# Integrating AgentCore payments with Browser Tool - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-browser.html

---

# Integrating AgentCore payments with Browser Tool

There are two ways your agent can access x402 paid content: via the [Browser Tool](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool.html>) or via standard HTTP calls.

## Browser Tool integration (Playwright)

The AgentCore Browser Tool gives your agent a managed headless Chromium browser session within the AgentCore Runtime. Your agent connects over WebSocket using Chrome DevTools Protocol (CDP), enabling it to navigate pages, execute JavaScript, and intercept HTTP responses at the network level. To get started, see the [Browser onboarding guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-tool.html>).

This option uses Strands SDK along with the browser tool and payments tool to browse websites and process payments. When an agent uses the browser tool to navigate websites, it uses Playwright’s response interception capabilities to automatically detect paywall sites:

  1. **Browser Navigation** — Agent uses `browse_with_payment` tool powered by Playwright.

  2. **Automatic 402 Detection** — Playwright intercepts all HTTP responses and triggers the agent’s response handler to detect 402 status codes.

  3. **x402 Extraction** — Payment tools automatically parse x402 payment details from response headers/body. This can also be done by agent business logic.

  4. **Payment Processing** — AgentCore payment processor creates crypto signatures using configured CDP wallets.

  5. **Retry** — Payment tools inject authorization headers and retry the request in the same browser session.


```python
from agentcore.payments import PaymentClient
from agentcore.browser import browser_tool

@tool
async def browse_with_payment(url: str, auto_pay: bool = True) -> dict:
    payment_requirements = None

    async def handle_response(response):
        nonlocal payment_requirements
        if response.status == 402:
            payment_requirements = await extract_x402_requirements(response)

    async def add_payment_header(route, request):
        headers = {**request.headers, **payment_result["authorization"]}
        await route.continue_(headers=headers)

    async with async_playwright() as p:
        # 1. Browser setup
        browser = await p.chromium.connect_over_cdp(AGENTCORE_BROWSER_WS_URL)
        page = await browser.contexts[0].new_page()

        # 2. Register response interceptor
        page.on("response", handle_response)

        # 3. Initial navigation (handle_response runs automatically here)
        response = await page.goto(url)

        # 4. Payment processing logic (runs AFTER navigation completes)
        if response.status == 402 and payment_requirements and auto_pay:
            payment_result = payment_client.process_payment(
                payment_session,
                payment_instrument,
                payment_requirements=payment_requirements
            )

            if payment_result["success"]:
                await page.route("**/*", add_payment_header)
                response = await page.goto(url)  # Retry with payment
            else:
                raise PaymentError(f"Payment failed: {payment_result['error_message']}")

        # 5. Capture content, cleanup, and return
        content = await page.content()
        await browser.close()
        return {"content": content, "status": response.status}
```
## Non-browser HTTP integration

For direct API calls and headless scenarios, developers can write custom tool logic using Strands SDK alongside a standard HTTP requests library to process payments with x402 detection:

  1. Agent uses a custom tool for making direct HTTP calls.

  2. Tool monitors HTTP response status codes to detect 402.

  3. Tool extracts x402 requirements and processes payment.

  4. Tool retries the HTTP request with payment authorization headers.


```python
@tool
async def make_payment(method, url, headers, body) -> dict:
    # Make initial HTTP request
    response = requests.request(method, url, headers=headers, data=body)

    # Check for 402 Payment Required
    if response.status_code == 402:
        payment_requirements = extract_x402_requirements(response)
        payment_result = payment_client.process_payment(
            payment_session,
            payment_instrument,
            payment_requirements=payment_requirements
        )

        if payment_result["success"]:
            # Retry request with payment authorization
            headers.update(payment_result["authorization"])
            response = requests.request(method, url, headers=headers, data=body)
        else:
            raise PaymentError(f"Payment failed: {payment_result['error_message']}")
```
