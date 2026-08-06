# Browser OS action - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-invoke.html

---

# Browser OS action  
  
The InvokeBrowser API provides direct operating system-level control over Amazon Bedrock AgentCore Browser sessions. While the WebSocket-based automation endpoint uses Chrome DevTools Protocol (CDP) for browser interaction, InvokeBrowser operates at the OS level, enabling actions that CDP cannot handle — such as interacting with print dialogs, keyboard shortcuts, right-click context menus, JavaScript alerts, and capturing full-screen screenshots.

## Overview

The Amazon Bedrock AgentCore Browser provides two ways to interact with a browser session:

  * **WebSocket-based automation (CDP)** : Uses the Chrome DevTools Protocol over a WebSocket connection. This is ideal for standard browser automation tasks such as navigating pages, clicking DOM elements, filling forms, and extracting page content. Libraries like Playwright and browser-use connect through this endpoint.

  * **OS-level actions (InvokeBrowser)** : Uses a REST API to perform operating system-level interactions through mouse, keyboard, and screenshot actions. This complements CDP by handling scenarios where browser-level automation is insufficient.


Use InvokeBrowser when your agent needs to:

  * Interact with native OS dialogs such as print dialogs, file upload/download dialogs, or authentication prompts that are outside the browser DOM

  * Dismiss JavaScript alerts, confirms, or prompts that block CDP execution

  * Use keyboard shortcuts (for example, ctrl+a, ctrl+p) that trigger OS-level behavior

  * Interact with right-click context menus rendered by the operating system

  * Capture full desktop screenshots that include content outside the browser viewport, such as OS notifications or multi-window layouts

  * Perform drag-and-drop operations that span across browser windows or between the browser and the desktop


InvokeBrowser follows the same pattern as InvokeCodeInterpreter: a single unified operation with action-type dispatch. You send a request with exactly one action, and receive a corresponding result.

## Supported actions

InvokeBrowser supports the following action types through the `BrowserAction` union. Exactly one action member must be set per request.

### Mouse actions

For all mouse actions, coordinate values ( `x` , `y` ) must be strictly within the browser session viewport bounds. Valid ranges are 1 < x < viewportWidth-2 and 1 < y < viewportHeight-2. The default viewport size is 1456×819 pixels, which can be configured when starting a session using the `viewPort` parameter.

Action | Required fields | Optional fields | Description  
---|---|---|---  
`mouseClick` |  `x` (Integer), `y` (Integer) |  `button` (MouseButton), `clickCount` (Integer) |  Click at the specified coordinates. `clickCount` : 1–10. `button` : LEFT, RIGHT, MIDDLE.  
`mouseMove` |  `x` (Integer), `y` (Integer) |  — |  Move cursor to the specified coordinates.  
`mouseDrag` |  `startX` (Integer), `startY` (Integer), `endX` (Integer), `endY` (Integer) |  `button` (MouseButton) |  Drag from start to end position. `button` defaults to LEFT.  
`mouseScroll` |  `x` (Integer), `y` (Integer) |  `deltaX` (Integer), `deltaY` (Integer) |  Scroll at the specified position. `deltaX` / `deltaY` : -1000 to 1000. Negative `deltaY` scrolls down.  
  
### Keyboard actions

Action | Required fields | Optional fields | Description  
---|---|---|---  
`keyType` |  `text` (String) |  — |  Type a string of text. Maximum length: 10,000 characters.  
`keyPress` |  `key` (String) |  `presses` (Integer) |  Press a key N times. `presses` : 1–100. Defaults to 1.  
`keyShortcut` |  `keys` (KeyList) |  — |  Press a key combination (for example, `["ctrl", "s"]` ). Maximum 5 keys.  
  
### Screenshot action

Action | Required fields | Optional fields | Description  
---|---|---|---  
`screenshot` |  — |  `format` (ScreenshotFormat) |  Capture the full OS desktop (not just the browser viewport). Format: PNG only.  
  
## Considerations

  * **ASCII-only text input** : The `keyType` action supports ASCII characters only. Non-ASCII characters (such as Unicode or multi-byte characters) are skipped during input.

  * **No key name validation** : The `keyPress` and `keyShortcut` actions do not validate whether the specified key names are supported. If you provide an unrecognized key name, the API returns a SUCCESS status without performing the intended action. Refer to the supported key names listed above.

  * **Supported key names** : Key names for `keyPress` and `keyShortcut` actions must be in lowercase. Supported keys include single characters ( `a` – `z` , `0` – `9` ), and named keys such as `enter` , `tab` , `space` , `backspace` , `delete` , `escape` , `ctrl` , `alt` , `shift`.


## Request and response format

### Request

```text
POST /browsers/{browserIdentifier}/sessions/invoke HTTP/1.1
x-amzn-browser-session-id: sessionId
Content-type: application/json
```
The request body contains an `action` field with exactly one member of the `BrowserAction` union set:

```json
{
    "action": {
        "mouseClick": {
            "x": 100,
            "y": 200,
            "button": "LEFT",
            "clickCount": 1
        }
    }
}
```
### Response

The `sessionId` is returned via the `x-amzn-browser-session-id` response header. The response body contains a `result` field with the corresponding action result.

On success:

```json
{
    "result": {
        "mouseClick": {
            "status": "SUCCESS",
            "error": null
        }
    }
}
```
On failure, the `status` field is set to FAILED and the `error` field contains a description of the failure.

## Examples

The following examples show how to invoke browser actions using the AWS CLI, AWS SDK for Python (Boto3), and the API.

###### Example

AWS CLI
    

  1. To click at a specific position:

```bash
aws bedrock-agentcore invoke-browser \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --session-id "<your-session-id>" \
  --action '{"mouseClick": {"x": 100, "y": 200, "button": "LEFT", "clickCount": 1}}'
```
To type text:

```bash
aws bedrock-agentcore invoke-browser \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --session-id "<your-session-id>" \
  --action '{"keyType": {"text": "Hello, world!"}}'
```
To press a keyboard shortcut:

```bash
aws bedrock-agentcore invoke-browser \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --session-id "<your-session-id>" \
  --action '{"keyShortcut": {"keys": ["ctrl", "s"]}}'
```
To take a screenshot:

```bash
aws bedrock-agentcore invoke-browser \
  --region <Region> \
  --browser-identifier "aws.browser.v1" \
  --session-id "<your-session-id>" \
  --action '{"screenshot": {"format": "PNG"}}'
```
Boto3
    

  1. To click at a specific position:

```python
response = dp_client.invoke_browser(
    browserIdentifier="aws.browser.v1",
    sessionId="<your-session-id>",
    action={
        "mouseClick": {
            "x": 100,
            "y": 200,
            "button": "LEFT",
            "clickCount": 1
        }
    }
)
print(f"Status: {response['result']['mouseClick']['status']}")
```
To type text:

```text
response = dp_client.invoke_browser(
    browserIdentifier="aws.browser.v1",
    sessionId="<your-session-id>",
    action={
        "keyType": {
            "text": "Hello, world!"
        }
    }
)
```
To take a screenshot and save it:

```python
import base64

response = dp_client.invoke_browser(
    browserIdentifier="aws.browser.v1",
    sessionId="<your-session-id>",
    action={
        "screenshot": {
            "format": "PNG"
        }
    }
)

if response['result']['screenshot']['status'] == 'SUCCESS':
    image_data = base64.b64decode(response['result']['screenshot']['data'])
    with open("screenshot.png", "wb") as f:
        f.write(image_data)
    print("Screenshot saved as screenshot.png")
```
API
    

  1. To click at a specific position:

```text
awscurl -X POST \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/invoke" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "x-amzn-browser-session-id: <your-session-id>" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "action": {
        "mouseClick": {
            "x": 100,
            "y": 200,
            "button": "LEFT",
            "clickCount": 1
        }
    }
  }'
```
To take a screenshot:

```text
awscurl -X POST \
  "https://bedrock-agentcore.<Region>.amazonaws.com/browsers/aws.browser.v1/sessions/invoke" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "x-amzn-browser-session-id: <your-session-id>" \
  --service bedrock-agentcore \
  --region <Region> \
  -d '{
    "action": {
        "screenshot": {
            "format": "PNG"
        }
    }
  }'
```
