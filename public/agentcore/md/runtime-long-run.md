# Handle asynchronous and long running agents with Amazon Bedrock AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-long-run.html

---

# Handle asynchronous and long running agents with Amazon Bedrock AgentCore Runtime

Amazon Bedrock AgentCore Runtime can handle asynchronous processing and long running agents. Asynchronous tasks allow your agent to continue processing after responding to the client and handle long-running operations without blocking responses. With async processing, your agent can:

  * Start a task that might take minutes or hours

  * Immediately respond to the user saying "I’ve started working on this"

  * Continue processing in the background

  * Allow the user to check back later for results


## Key concepts

### Asynchronous processing model

The Amazon Bedrock AgentCore SDK supports both synchronous and asynchronous processing through a unified API. This creates a flexible implementation pattern for both clients and agent developers. Agent clients can work with the same API without differentiating between synchronous and asynchronous on the client side. With the ability to invoke the same session across invocations, agent developers can reuse context and build upon this context incrementally without implementing complex task management logic.

### Runtime session lifecycle management

Agent code communicates its processing status using the "/ping" endpoint health status. The `/ping` endpoint must return an HTTP 200 response with the following JSON payload:

```json
{"status": "HealthyBusy"}
```
The response contains a required field and an optional field:

  * `status` (required) — either `"Healthy"` (idle, waiting for requests) or `"HealthyBusy"` (processing background tasks). The platform uses this field to determine whether the session is still active.

  * `time_of_last_update` (optional) — Unix timestamp in seconds of when the `status` last changed. Set it only on an actual status change, not on every ping.


A session in idle state (`"Healthy"`) for 15 minutes gets automatically terminated. A session returning `"HealthyBusy"` remains alive beyond the idle timeout.

###### Warning

If you include `time_of_last_update`, do not set it to the current time on every ping. A timestamp that advances on every ping signals a continuous status change, which prevents the idle session timeout from ever firing — sessions then persist until `MaxLifetime` and can exhaust your session quota. Omit the field (the platform tracks status changes on its own) or update it only when the status actually changes. If you use the Bedrock AgentCore SDK, this is handled for you.

## Implementing asynchronous tasks

To get started, install the `bedrock-agentcore` package:

```bash
pip install bedrock-agentcore
```
AgentCore SDK provides following options for integration asynchronous processing.

###### Example

API based task management
    

  1. To build interactive agents that perform asynchronous tasks, you need to call `add_async_task` when starting a task and `complete_async_task` when the task completes. The SDK handles task tracking and manages Ping status automatically.

```bash
# Start tracking a task manually
task_id = app.add_async_task("data_processing")

# Do work...

# Mark task as complete
app.complete_async_task(task_id)
```
Custom ping handler
    

  1. You can implement your own custom ping handler to manage the Runtime Session’s state. Your agent’s health is reported through the /ping endpoint:

```python
@app.ping
def custom_status():
    if system_busy():
        return PingStatus.HEALTHY_BUSY
    return PingStatus.HEALTHY
```
Status values:

     * "Healthy": Ready for new work

     * "HealthyBusy": Processing background task


###### Important

Ensure `@app.entrypoint` handler does not perform blocking operations, as this might also block the /ping health check endpoint. Use separate threads or async methods for blocking operations.

## Complete example

First, install the required package:

```bash
pip install strands-agents
```
Then, create a Python file with the following code:

```python
import threading
import time
from strands import Agent, tool
from bedrock_agentcore.runtime import BedrockAgentCoreApp

# Initialize app with debug mode for task management
app = BedrockAgentCoreApp()

@tool
def start_background_task(duration: int = 5) -> str:
    """Start a simple background task that runs for specified duration."""
    # Start tracking the async task
    task_id = app.add_async_task("background_processing", {"duration": duration})

    # Run task in background thread
    def background_work():
        time.sleep(duration)  # Simulate work
        app.complete_async_task(task_id)  # Mark as complete

    threading.Thread(target=background_work, daemon=True).start()
    return f"Started background task (ID: {task_id}) for {duration} seconds. Agent status is now BUSY."

# Create agent with the tool
agent = Agent(tools=[start_background_task])

@app.entrypoint
def main(payload):
    """Main entrypoint - handles user messages."""
    user_message = str(payload.get("prompt", "Try: start_background_task(3)"))
    return {"message": agent(user_message).message}

if __name__ == "__main__":
    print("🚀 Simple Async Strands Example")
    print("Test: curl -X POST http://localhost:8080/invocations -H 'Content-Type: application/json' -d '{\"prompt\": \"start a 3 second task\"}'")
    app.run()
```
This example demonstrates:

  * Creating a background task that runs asynchronously

  * Tracking the task’s status with `add_async_task` and `complete_async_task`

  * Responding immediately to the user while processing continues

  * Managing the agent’s health status automatically


## Common issues and solutions

### Long-running agent gets terminated after 15 minutes

This can happen when the application is single threaded and the ping thread is blocked.

  * Check that blocking calls in the invocation path are in a separate thread or async non-blocking

  * Run async agent server locally and simulate scenarios while checking for ping status.



