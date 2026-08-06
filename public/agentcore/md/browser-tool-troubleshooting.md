# Troubleshoot AgentCore Browser - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool-troubleshooting.html

---

# Troubleshoot AgentCore Browser

This section provides solutions to common issues you might encounter when using the Amazon Bedrock AgentCore Browser.

## Permission denied errors

**Symptom:** Errors mentioning access denied or insufficient permissions.

**Solution:**

  * Verify your IAM user or role has the required Browser permissions

  * Check your AWS credentials: `aws sts get-caller-identity`

  * For recording: Verify the execution role has Amazon S3 write permissions

  * For recording: Confirm the trust policy allows `bedrock-agentcore.amazonaws.com` to assume the role


## Model access denied

**Symptom:** Errors about model access or authorization when running agents.

**Solution:**

  * Navigate to the Amazon Bedrock console

  * Go to **Model access** in the left navigation

  * Enable **Anthropic Claude Sonnet 4**

  * Verify you’re in the correct region (match the region in your code)


## Browser session timeout

**Symptom:** Browser sessions end unexpectedly or timeout errors occur.

**Solution:**

  * Check the `sessionTimeoutSeconds` parameter when starting sessions

  * Default timeout is 900 seconds (15 minutes)

  * Increase timeout for longer sessions: `sessionTimeoutSeconds=1800`

  * Sessions automatically stop after the timeout period


## Recording not appearing in Amazon S3

**Symptom:** No recording files in your Amazon S3 bucket after session completes.

**Solution:**

  * Verify the execution role has correct Amazon S3 permissions

  * Confirm the Amazon S3 bucket name and prefix are correct

  * Check the execution role trust policy includes bedrock-agentcore service

  * Review CloudWatch Logs for Amazon S3 upload errors

  * Ensure the session ran for at least a few seconds (very short sessions may not generate recordings)


## Playwright connection errors

**Symptom:** Cannot connect to browser with Playwright or WebSocket errors.

**Solution:**

  * Verify you installed playwright: `pip install playwright`

  * Confirm the browser session started successfully before connecting

  * Check that the session is still active (not timed out)

  * Verify your network allows WebSocket connections


## Agent cannot make progress due to CAPTCHA checks

**Issue:** Your agent gets blocked by CAPTCHA verification when using the Browser tool to interact with websites.

**Cause:** Anti-bot measures on popular websites detect automated browsing and require human verification.

**Solution:** Structure your agent to avoid search engines and implement the following architecture pattern:

  * Use the Browser tool only for specific page actions, not general web searching

  * Use non-browser MCP tools like Tavily search for general web search operations

  * Consider adding a live view feature to your agent application that allows end users to take control and solve CAPTCHAs when needed


## CORS errors when integrating with browser applications

**Issue:** Cross-Origin Resource Sharing (CORS) errors occur when building browser-based web applications that call a custom Amazon Bedrock AgentCore runtime server.

**Cause:** Browser security policies block cross-origin requests to your runtime server during local development or self-hosted deployment.

**Solution:** Add CORS middleware to your BedrockAgentCoreApp to handle cross-origin requests from your frontend:

```python
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from fastapi.middleware.cors import CORSMiddleware

app = BedrockAgentCoreApp()

# Add CORS middleware to allow browser requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Customize in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handle browser preflight requests to /invocations
@app.options("/invocations")
async def options_handler():
    return {"message": "OK"}

@app.entrypoint
def my_agent(payload):
    return {"response": "Hello from agent"}
```
###### Important

In production environments, replace allow_origins=["*"] with specific domain origins for better security.

## Session Replay and Web Bot Auth don’t work in new browser windows or contexts

**Issue:** Session Replay and Web Bot Auth features are not available when your automation code creates new browser windows or contexts.

**Cause:** These features rely on browser extensions that only work in the default browser context provided by Amazon Bedrock AgentCore. When you create a new context using methods like `browser.new_context()` in Playwright, the extensions are not available.

**Solution:** Use the default browser context provided when you connect to the browser session. Avoid creating new contexts or windows if you need Session Replay or Web Bot Auth functionality.

```bash
# ✓ Use the existing default context
context = browser.contexts[0]
page = context.pages[0]

# ✗ Don't create new contexts - Session Replay and Web Bot Auth won't work
# context = browser.new_context()
```
## Browser extensions issues

### Extension download fails with access denied

**Symptom:** Session fails to start with errors related to Amazon S3 access when using extensions.

**Solution:**

  * Verify your IAM user or role has `s3:GetObject` and `s3:GetObjectHead` permission on the extension bucket

  * Confirm the Amazon S3 bucket is owned by the same AWS account making the API call

  * Check that the bucket name and prefix (object key) are correct

  * If using versioned buckets, ensure you have `s3:GetObjectVersion` permission


### Extension rejected due to invalid format

**Symptom:** Session fails to start with validation errors about the extension file format.

**Solution:**

  * Ensure the extension file is in ZIP format

  * Verify the ZIP file contains a valid Chrome extension structure with a valid `manifest.json` file

  * Check that the extension follows Chrome extension guidelines

  * Ensure the ZIP was created from the extension directory contents, not the parent folder


## Browser profile issues

### Failed to save browser session profile due to concurrent operation on the profile

**Symptom:** `SaveBrowserSessionProfile` throws `ConflictException`.

**Solution:**

  * Retry `SaveBrowserSessionProfile` at a later time

  * Use exponential backoff with jitter if retrying from agent or code


### Failed to save browser session profile due to concurrent operation on the session

**Symptom:** `SaveBrowserSessionProfile` throws `ConflictException`.

**Solution:**

  * Retry `SaveBrowserSessionProfile` at a later time

  * Use exponential backoff with jitter if retrying from agent or code


### Authentication fails when loading a saved browser profile

**Symptom:** A browser session loaded from a saved profile requires re-authentication even though the profile was saved with valid authentication cookies.

**Cause:** Cookies stored in the browser profile have expired. Websites set expiration times on cookies (such as authentication tokens), and the browser automatically removes expired cookies according to these expiration dates. When you load a profile, any cookies that have expired since the profile was saved will not be available.

**Solution:**

  * Re-authenticate in the browser session to obtain fresh cookies

  * Save the profile again after re-authentication to update it with new cookies

  * For workflows requiring long-term authentication, consider the typical cookie lifetime of your target websites when planning profile usage

  * Implement periodic re-authentication in your automation workflow if cookie expiration is expected

  * Save profiles more frequently for critical authentication states to minimize the time between saves and subsequent use


###### Note

Cookie expiration times are set by websites and cannot be modified by browser profiles. Session cookies typically expire when the browser session ends, while persistent cookies expire based on their Max-Age or Expires attributes.

## Troubleshooting Root Certificate Authority issues

The following table describes common errors and their resolutions when configuring root CA certificates for Amazon Bedrock AgentCore Browser.

Error | Cause | Resolution  
---|---|---  
Certificate secret not found in Secrets Manager |  The secret ARN does not exist or the secret has been deleted. |  Verify the secret ARN is correct and the secret exists in the specified Region.  
Access denied to certificate secret in Secrets Manager |  The caller does not have `secretsmanager:GetSecretValue` permission on the secret. |  Add the `secretsmanager:GetSecretValue` permission to your IAM policy for the specified secret ARN.  
Certificate content is not valid PEM/X.509 format |  The secret value is not a valid PEM-encoded X.509 certificate. |  Ensure the secret contains a properly formatted PEM certificate starting with `-----BEGIN CERTIFICATE-----` and ending with `-----END CERTIFICATE-----`.  
Certificate has expired |  The certificate’s `notAfter` date is in the past. |  Replace the expired certificate with a valid one in AWS Secrets Manager and retry.  
Certificate is not yet valid |  The certificate’s `notBefore` date is in the future. |  Wait until the certificate’s validity period begins, or use a certificate that is currently valid.  
Number of certificates exceeds the maximum allowed |  More than 10 certificates were provided at the session level or tool level. |  Reduce the number of certificates to 10 or fewer per session and 10 or fewer per tool.  
Certificate location is required |  A certificate entry was provided without a location. |  Ensure each certificate in the array includes a `location` with a `secretsManager` entry containing a valid `secretArn`.  
Certificates configuration is not enabled |  The certificates feature is not enabled for your account. |  Contact AWS Support to enable the certificates feature for your account.  
  
## Troubleshooting browser proxies

### Errors when starting a session with proxy

**Symptom:** `StartBrowserSession` returns an HTTP 400 error with a message beginning with `Failed to set up browser proxy:`.

**Cause:** The proxy configuration or credentials secret is invalid.

**Solution:**

  * `Proxy credentials secret not found in Secrets Manager` – The secret ARN does not match any secret in the target account and Region. Verify the ARN is correct and that the secret has not been deleted or scheduled for deletion.

  * `Invalid proxy credentials secret configuration (check encryption key for cross-account access)` – The secret exists but cannot be accessed. Ensure the calling identity has `secretsmanager:GetSecretValue` permission. For cross-account secrets, see [Cross-account secret access](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-proxies.html#browser-proxies-cross-account>).

  * `Proxy credentials secret must be a JSON object with username and password fields` – Update the secret value to a valid JSON object: `{"username": "…​", "password": "…​"}`.

  * `Failed to parse proxy credentials from secret` – The secret value could not be read as proxy credentials. Verify the secret contains a plain JSON string (not binary) with `username` and `password` fields.

  * `Field 'username' is missing or empty in secret` or `Field 'password' is missing or empty in secret` – Ensure both `username` and `password` are present and non-empty in the secret.

  * `Field 'username' contains invalid characters` or `Field 'password' contains invalid characters` – Use only the characters listed in the error message. See [Step 1: Create a credentials secret (if using authentication)](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./browser-proxies.html#browser-proxies-step1>) for allowed characters.

  * `Field 'username' exceeds maximum length of 256 characters` or `Field 'password' exceeds maximum length of 256 characters` – Shorten the credential to 256 characters or fewer.


### Proxy connection errors in browser

**Symptom:** A browser session starts successfully, but page navigation fails for proxied domains with HTTP 502 errors or `net::ERR_INVALID_AUTH_CREDENTIALS`.

**Cause:** The browser cannot connect to the proxy server, or the proxy server rejects the provided credentials. These are Chromium network errors, not AWS API errors.

**Solution:**

  * **HTTP 502 on proxied pages** – Verify the proxy hostname, port, and that the server is running and reachable from the public internet (or from your VPC if using VPC configuration).

  * `net::ERR_INVALID_AUTH_CREDENTIALS` – Update the secret in Secrets Manager with valid credentials for the proxy server.

  * Use `GetBrowserSession` to confirm the active proxy settings. Credentials are never returned in the response.


###### Note

These errors are visible in Live View and through the automation API.

## Troubleshooting InvokeBrowser OS actions

The following table describes common errors when using the InvokeBrowser API for OS-level browser actions.

Exception | HTTP code | Description  
---|---|---  
`ValidationException` |  400 |  Invalid input. For coordinate-based actions ( `mouseClick` , `mouseMove` , `mouseDrag` , `mouseScroll` ), coordinates must be strictly within the session viewport bounds (1 < x < viewportWidth-2, 1 < y < viewportHeight-2). The default viewport size is 1456×819 pixels. Also returned for disabled actions or invalid parameter values.  
`AccessDeniedException` |  403 |  Insufficient permissions or action not allowed for the session.  
`ResourceNotFoundException` |  404 |  Invalid `browserIdentifier` or `sessionId`.  
`ServiceQuotaExceededException` |  402 |  Service quota has been exceeded.  
`ThrottlingException` |  429 |  Rate limit exceeded.  
`InternalServerException` |  500 |  Unexpected failure in execution.  
  
**Solution:**

  * Verify that coordinate values are within the session viewport dimensions. Use the `screenshot` action to capture the current screen and confirm the visible area.

  * Check that the browser session is still active and has not timed out.

  * Ensure your IAM identity has the `bedrock-agentcore:InvokeBrowser` permission.



