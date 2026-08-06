# Stateful MCP server features - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/mcp-stateful-features.html

---

# Stateful MCP server features

The Model Context Protocol (MCP) provides a standardized way for AI applications to interact with external data and capabilities. This guide demonstrates how to build a comprehensive MCP server that showcases all major protocol features, and how to test it both locally and when deployed to Amazon Bedrock AgentCore.

For complete protocol details, see the [MCP Specification](<https://modelcontextprotocol.io/specification/2025-11-25>).

## MCP features overview

MCP servers can expose capabilities to clients through several feature types. The following features are demonstrated in this guide:

**Resources**
    

Resources expose data and content from your server to MCP clients. Use resources to share configuration, reference data, or any contextual information that clients or AI models can read. Resources are identified by URIs (for example, `travel://destinations` ).

**Prompts**
    

Prompts are reusable templates that generate structured messages for AI models. Use prompts to standardize common interactions, such as generating packing lists or learning local phrases for a destination.

**Tools**
    

Tools are functions that AI models can invoke to perform actions or retrieve information. Tools can range from simple data lookups to complex multi-step workflows that combine other MCP features.

**Elicitation**
    

Elicitation enables server-initiated requests for user input during tool execution. Use elicitation when your tool needs to collect information interactively, such as gathering travel preferences through a multi-turn conversation.

**Sampling**
    

Sampling allows servers to request LLM-generated content from the client. Use sampling when your tool needs AI-powered text generation, such as personalized travel recommendations based on user preferences.

**Progress notifications**
    

Progress notifications keep clients informed about long-running operations. Use progress reporting to provide real-time feedback during tasks like searching for flights or processing bookings.

###### Note

Features like elicitation, sampling, and progress notifications require stateful MCP sessions. Enable stateful mode by setting `stateless_http=False` when running your server.

**Session management**

In stateful mode, the server returns an `Mcp-Session-Id` header during the initialize call. Clients must include this session ID in subsequent requests to maintain session context. If the server terminates or the session expires, requests may return a 404 error, and clients must re-initialize to obtain a new session ID. For more details, see [Session Management](<https://modelcontextprotocol.io/specification/2025-11-25/basic/transports#session-management>) in the MCP specification.

## Create an MCP server with all features

**To set up the project**

  1. Create a `requirements.txt` file with the required dependencies:

```text
fastmcp>=2.10.0
mcp
```
  2. Install the dependencies:

```bash
pip install -r requirements.txt
```
Create a file called `travel_server.py` with the following code. This travel booking agent demonstrates all MCP features in a realistic workflow:

```python
"""
Travel Booking Agent - Stateful MCP Server
Demonstrates all MCP features in a real-world travel booking workflow:
- Elicitation: Collect trip preferences interactively
- Progress: Show search progress for flights and hotels
- Sampling: AI-generated personalized recommendations
- Resources: Expose destination data and pricing
- Prompts: Templates for packing lists and local phrases
"""
import asyncio
import json
from fastmcp import FastMCP, Context
from enum import Enum

mcp = FastMCP("Travel-Booking-Agent")

# ============================================================
# DATA
# ============================================================

class TripType(str, Enum):
    BUSINESS = "business"
    LEISURE = "leisure"
    FAMILY = "family"

DESTINATIONS = {
    "paris": {"name": "Paris, France", "flight": 450, "hotel": 180,
              "highlights": ["Eiffel Tower", "Louvre", "Notre-Dame"],
              "phrases": ["Bonjour", "Merci", "S'il vous plait"]},
    "tokyo": {"name": "Tokyo, Japan", "flight": 900, "hotel": 150,
              "highlights": ["Shibuya", "Senso-ji Temple", "Mt. Fuji day trip"],
              "phrases": ["Konnichiwa", "Arigato", "Sumimasen"]},
    "new york": {"name": "New York, USA", "flight": 350, "hotel": 250,
                 "highlights": ["Central Park", "Broadway", "Statue of Liberty"],
                 "phrases": ["Hey!", "Thanks", "Excuse me"]},
    "bali": {"name": "Bali, Indonesia", "flight": 800, "hotel": 100,
             "highlights": ["Ubud Rice Terraces", "Tanah Lot", "Beach clubs"],
             "phrases": ["Selamat pagi", "Terima kasih", "Sama-sama"]}
}

# ============================================================
# RESOURCES - Expose data to MCP clients
# ============================================================

@mcp.resource("travel://destinations")
def list_destinations() -> str:
    """All available destinations with pricing."""
    return json.dumps({k: {"name": v["name"], "flight": v["flight"], "hotel": v["hotel"]}
                       for k, v in DESTINATIONS.items()}, indent=2)

@mcp.resource("travel://destination/{city}")
def get_destination(city: str) -> str:
    """Detailed info for a specific destination."""
    dest = DESTINATIONS.get(city.lower())
    return json.dumps(dest, indent=2) if dest else f"Unknown: {city}"

# ============================================================
# PROMPTS - Reusable templates for AI generation
# ============================================================

@mcp.prompt()
def packing_list(destination: str, days: int, trip_type: str) -> str:
    """Generate packing list prompt."""
    return f"Create a {days}-day packing list for a {trip_type} trip to {destination}. Be practical and concise."

@mcp.prompt()
def local_phrases(destination: str) -> str:
    """Generate local phrases prompt."""
    dest = DESTINATIONS.get(destination.lower(), {})
    phrases = dest.get("phrases", [])
    return f"Teach me essential phrases for {destination}. Start with: {', '.join(phrases)}"

# ============================================================
# MAIN TOOL - Complete booking with all MCP features
# ============================================================

@mcp.tool()
async def plan_trip(ctx: Context) -> str:
    """
    Plan a complete trip using all MCP features:
    1. Elicitation - Collect preferences
    2. Progress - Search flights and hotels
    3. Sampling - AI recommendations
    """

    # -------- PHASE 1: ELICITATION --------
    # Collect trip details through multi-turn conversation

    dest_result = await ctx.elicit(
        message="Where would you like to go?\nOptions: Paris, Tokyo, New York, Bali",
        response_type=str
    )
    if dest_result.action != "accept":
        return "Trip planning cancelled."

    dest_key = dest_result.data.lower().strip()
    dest = DESTINATIONS.get(dest_key, DESTINATIONS["paris"])

    type_result = await ctx.elicit(
        message="What type of trip?\n1. business\n2. leisure\n3. family",
        response_type=TripType
    )
    if type_result.action != "accept":
        return "Trip planning cancelled."
    trip_type = type_result.data

    days_result = await ctx.elicit(
        message="How many days? (3-14)",
        response_type=int
    )
    if days_result.action != "accept":
        return "Trip planning cancelled."
    days = max(3, min(14, days_result.data))

    travelers_result = await ctx.elicit(
        message="Number of travelers?",
        response_type=int
    )
    if travelers_result.action != "accept":
        return "Trip planning cancelled."
    travelers = travelers_result.data

    # -------- PHASE 2: PROGRESS NOTIFICATIONS --------
    # Search for flights and hotels with progress updates

    total_steps = 5

    await ctx.report_progress(progress=1, total=total_steps)  # Searching flights
    await asyncio.sleep(0.4)

    await ctx.report_progress(progress=2, total=total_steps)  # Comparing airlines
    await asyncio.sleep(0.4)

    await ctx.report_progress(progress=3, total=total_steps)  # Searching hotels
    await asyncio.sleep(0.4)

    await ctx.report_progress(progress=4, total=total_steps)  # Checking availability
    await asyncio.sleep(0.4)

    await ctx.report_progress(progress=5, total=total_steps)  # Finalizing
    await asyncio.sleep(0.2)

    # Calculate costs
    flight_cost = dest["flight"] * travelers
    hotel_cost = dest["hotel"] * days * ((travelers + 1) // 2)  # Rooms needed
    total_cost = flight_cost + hotel_cost

    # -------- PHASE 3: SAMPLING --------
    # Get AI-generated personalized recommendations

    ai_tips = f"Enjoy {dest['name']}!"
    try:
        response = await ctx.sample(
            messages=f"Give 3 brief tips for a {trip_type} trip to {dest['name']} for {travelers} travelers, {days} days. Max 60 words.",
            max_tokens=150
        )
        if hasattr(response, 'text') and response.text:
            ai_tips = response.text
    except Exception:
        ai_tips = f"Visit {dest['highlights'][0]}, try local food, learn basic phrases!"

    # -------- FINAL CONFIRMATION --------

    confirm = await ctx.elicit(
        message=f"""
========== TRIP SUMMARY ==========
Destination: {dest['name']}
Trip Type: {trip_type}
Duration: {days} days
Travelers: {travelers}

COSTS:
  Flights: ${flight_cost}
  Hotels: ${hotel_cost} ({(travelers + 1) // 2} room(s) x {days} nights)
  TOTAL: ${total_cost}

Confirm booking? (Yes/No)""",
        response_type=["Yes", "No"]
    )

    if confirm.action != "accept" or confirm.data == "No":
        return "Booking cancelled. Your search results are saved for 24 hours."

    # -------- FINAL RESULT --------

    highlights_str = '\n'.join(f'  * {h}' for h in dest['highlights'])
    phrases_str = '\n'.join(f'  * {p}' for p in dest['phrases'])

    return f"""
{'=' * 50}
  BOOKING CONFIRMED!
{'=' * 50}

Booking Reference: TRV-{ctx.session_id[:8].upper()}

TRIP DETAILS:
  {dest['name']}
  {days} days | {travelers} traveler(s)
  Trip type: {trip_type}

FLIGHTS: ${flight_cost}
  Outbound: Day 1, Morning departure
  Return: Day {days}, Evening departure

ACCOMMODATION: ${hotel_cost}
  {(travelers + 1) // 2} room(s) for {days} nights

TOTAL PAID: ${total_cost}

HIGHLIGHTS TO EXPLORE:
{highlights_str}

USEFUL PHRASES:
{phrases_str}

AI RECOMMENDATIONS:
{ai_tips}

{'=' * 50}
Thank you for booking with Travel Agent!
"""

if __name__ == "__main__":
    print("=" * 60)
    print("  Travel Booking Agent - Stateful MCP Server")
    print("=" * 60)
    print("\n MCP FEATURES DEMONSTRATED:")
    print("   * Elicitation - Multi-turn trip preference collection")
    print("   * Progress    - Real-time search progress updates")
    print("   * Sampling    - AI-powered travel recommendations")
    print("   * Resources   - Destination data and pricing")
    print("   * Prompts     - Packing list and phrase templates")
    print("\n TOOLS:")
    print("   plan_trip - Complete booking flow with all features")
    print("\n RESOURCES:")
    print("   travel://destinations - All destinations")
    print("   travel://destination/{city} - City details")
    print("\n PROMPTS:")
    print("   packing_list - Generate packing suggestions")
    print("   local_phrases - Learn useful phrases")
    print("\n" + "=" * 60)
    print(f" Server: http://0.0.0.0:8000/mcp")
    print("=" * 60)

    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",
        port=8000,
        stateless_http=False
    )
```
## Test locally

**To start the server**

  * Run the MCP server:

```text
python travel_server.py
```
You should see output indicating the server is running on port 8000.


Create a file called `test_client.py` with the following code. This client tests all MCP features including resources, prompts, and the main tool:

```python
"""
Travel Booking Agent - Test Client
Tests all MCP features: Elicitation, Sampling, Progress, Resources, Prompts
"""
import asyncio
import os
import sys
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport
from fastmcp.client.elicitation import ElicitResult
from mcp.types import CreateMessageResult, TextContent

async def elicit_handler(message: str, response_type, params, ctx):
    """Handle elicitation - interactive input."""
    print(f"\n>>> Server asks: {message}")

    if isinstance(response_type, list):
        for i, opt in enumerate(response_type, 1):
            print(f"    {i}. {opt}")
        choice = input("    Your choice (number): ").strip()
        response = response_type[int(choice) - 1]
    else:
        hint = " (number)" if response_type == int else ""
        response = input(f"    Your answer{hint}: ").strip()
        if response_type == int:
            response = int(response)

    print(f"<<< Responding: {response}")
    return ElicitResult(action="accept", content={"value": response})

async def sampling_handler(messages, params, ctx):
    """Handle sampling - provide LLM response."""
    print(f"\n>>> AI Sampling Request")
    prompt = messages if isinstance(messages, str) else str(messages)
    print(f"    Prompt: {prompt[:80]}...")

    user_input = input("    Enter AI response (or Enter for auto): ").strip()
    if not user_input:
        user_input = "1. Book popular attractions early. 2. Try local street food. 3. Learn basic greetings!"

    print(f"<<< AI Response: {user_input}")
    return CreateMessageResult(
        role="assistant",
        content=TextContent(type="text", text=user_input),
        model="test-model",
        stopReason="endTurn"
    )

async def progress_handler(progress: float, total: float | None, message: str | None):
    """Handle progress notifications."""
    pct = int((progress / total) * 100) if total else 0
    bar = "#" * (pct // 5) + "-" * (20 - pct // 5)
    print(f"\r    Progress: [{bar}] {pct}% ({int(progress)}/{int(total or 0)})", end="", flush=True)
    if progress == total:
        print(" Done!")

async def main():
    local_test = os.getenv('LOCAL_TEST', 'true').lower() == 'true'

    if local_test:
        url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/mcp"
        token = None
    else:
        agent_arn = os.getenv('AGENT_ARN')
        if not agent_arn:
            print("ERROR: Missing AGENT_ARN environment variable")
            sys.exit(1)

        encoded_arn = agent_arn.replace(':', '%3A').replace('/', '%2F')
        endpoint = os.getenv('MCP_ENDPOINT', 'https://bedrock-agentcore.us-west-2.amazonaws.com')
        url = f"{endpoint}/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
        token = os.getenv('BEARER_TOKEN')

        if not token:
            print("ERROR: Missing BEARER_TOKEN for remote testing")
            sys.exit(1)

        print(f"  Agent ARN: {agent_arn}")
        print(f"  Endpoint: {endpoint}")

    print("=" * 60)
    print("  Travel Agent - MCP Feature Test Client")
    print("=" * 60)

    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        print(f"  Using auth token (len={len(token)})")

    transport = StreamableHttpTransport(url=url, headers=headers)
    client = Client(
        transport,
        elicitation_handler=elicit_handler,
        sampling_handler=sampling_handler,
        progress_handler=progress_handler
    )

    try:
        await client.__aenter__()

        # Test Resources
        print("\n[1] Testing RESOURCES...")
        resources = await client.list_resources()
        print(f"    Found {len(resources)} resource(s)")

        # Test Prompts
        print("\n[2] Testing PROMPTS...")
        prompts = await client.list_prompts()
        print(f"    Found {len(prompts)} prompt(s)")

        # Test Main Tool (Elicitation + Progress + Sampling)
        print("\n[3] Testing PLAN_TRIP tool...")
        print("    (This tests Elicitation, Progress, and Sampling)\n")

        result = await client.call_tool("plan_trip", {})

        print("\n" + "=" * 60)
        print("RESULT:")
        print("=" * 60)
        print(result.content[0].text)

        print("=" * 60)
        print("  ALL TESTS COMPLETED!")
        print("=" * 60)

    except Exception as e:
        print(f"\nERROR: {e}")
        return False
    finally:
        await client.__aexit__(None, None, None)

    return True

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
```
**To run the local test**

  1. With the server running in one terminal, open a new terminal and run the test client:

```text
python test_client.py
```
  2. The client tests resources and prompts, then runs the `plan_trip` tool which demonstrates elicitation, progress notifications, and sampling in a complete workflow.


## Deploy to Amazon Bedrock AgentCore

**To configure and deploy**

  1. Install the AgentCore CLI if you haven’t already:

```bash
npm install -g @aws/agentcore
```
  2. Create a project for deployment:

```bash
agentcore create --name TravelAgentDemo --protocol MCP
```
  3. Deploy the agent:

```bash
agentcore deploy
```
After deployment completes, note the agent ARN provided in the output.


## Test your deployed agent

**To test the deployed agent**

  1. Set the required environment variables:

```bash
export AGENT_ARN='arn:aws:bedrock-agentcore:us-west-2:YOUR_ACCOUNT:runtime/YOUR_AGENT_NAME'
export BEARER_TOKEN='your_bearer_token'
```
Replace the placeholders with your actual agent ARN and bearer token.

  2. Run the test client in remote mode:

```text
LOCAL_TEST=false python test_client.py
```
  3. The client will test resources, prompts, and the `plan_trip` tool. Follow the interactive prompts to complete a booking, which demonstrates elicitation, progress notifications, and sampling on your deployed agent.


```text
  Agent ARN: arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/TravelAgentDemo
  Endpoint: https://bedrock-agentcore.us-west-2.amazonaws.com
============================================================
  Travel Agent - MCP Feature Test Client
============================================================
  Using auth token (len=1034)

[1] Testing RESOURCES...
    Found 1 resource(s)

[2] Testing PROMPTS...
    Found 2 prompt(s)

[3] Testing PLAN_TRIP tool...
    (This tests Elicitation, Progress, and Sampling)

>>> Server asks: Where would you like to go?
Options: Paris, Tokyo, New York, Bali
    Your answer: Paris
<<< Responding: Paris

>>> Server asks: What type of trip?
1. business
2. leisure
3. family
    Your answer: leisure
<<< Responding: leisure

>>> Server asks: How many days? (3-14)
    Your answer (number): 5
<<< Responding: 5

>>> Server asks: Number of travelers?
    Your answer (number): 2
<<< Responding: 2

    Progress: [####################] 100% (5/5) Done!

>>> AI Sampling Request
    Prompt: Give 3 brief tips for a leisure trip to Paris, France for 2 travelers...
    Enter AI response (or Enter for auto):
<<< AI Response: 1. Book popular attractions early. 2. Try local street food. 3. Learn basic greetings!

>>> Server asks:
========== TRIP SUMMARY ==========
Destination: Paris, France
Trip Type: leisure
Duration: 5 days
Travelers: 2

COSTS:
  Flights: $900
  Hotels: $900 (1 room(s) x 5 nights)
  TOTAL: $1800

Confirm booking? (Yes/No)
    1. Yes
    2. No
    Your choice (number): 1
<<< Responding: Yes

============================================================
RESULT:
============================================================

==================================================
  BOOKING CONFIRMED!
==================================================

Booking Reference: TRV-A1B2C3D4

TRIP DETAILS:
  Paris, France
  5 days | 2 traveler(s)
  Trip type: leisure

FLIGHTS: $900
  Outbound: Day 1, Morning departure
  Return: Day 5, Evening departure

ACCOMMODATION: $900
  1 room(s) for 5 nights

TOTAL PAID: $1800

HIGHLIGHTS TO EXPLORE:
  * Eiffel Tower
  * Louvre
  * Notre-Dame

USEFUL PHRASES:
  * Bonjour
  * Merci
  * S'il vous plait

AI RECOMMENDATIONS:
1. Book popular attractions early. 2. Try local street food. 3. Learn basic greetings!

==================================================
Thank you for booking with Travel Agent!

============================================================
  ALL TESTS COMPLETED!
============================================================
```
###### Tip

You can also test your MCP server using the MCP Inspector, a visual tool for testing MCP servers. For local testing instructions, see [Local testing with MCP inspector](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html#runtime-mcp-appendix-b>) . For remote testing instructions, see [Remote testing with MCP inspector](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-mcp.html#runtime-mcp-appendix-c>).

