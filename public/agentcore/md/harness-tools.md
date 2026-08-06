# Tools - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-tools.html

---

# Tools

Tools are declarative. You list what the agent can call; AgentCore handles invocation, credentials, and results. The harness supports five tool types, plus the built-in filesystem and shell tools.

  * **MCP servers:** Connect to any remote [Model Context Protocol](<https://modelcontextprotocol.io>) endpoint by URL. No Gateway required for simple cases.

  * **[AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html>):** Governed connectivity to APIs and MCP servers with inbound/outbound auth, access control, and [policy enforcement](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html>). Reference a gateway ARN and every tool configured on that gateway becomes available. Use Gateway when you need a managed, policy-backed tool surface.

  * **[AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html>):** Managed web browsing and automation.

  * **[AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html>):** Sandboxed Python/JavaScript/TypeScript code execution for data analysis and computation.

  * **Inline functions:** Tool schemas that execute on the client side, not on the harness VM. The harness pauses when the tool is called and returns the call to your code, which decides what to do and sends a result back. This is the pattern for human-in-the-loop approvals and custom integrations.


Default tools `shell` and `file_operations` are available in every session unless you restrict them with `allowedTools`. `shell` executes bash commands; `file_operations` supports viewing, creating, and editing files.

The `allowedTools` parameter controls which tools the agent can use. If omitted, all tools are allowed.

###### Token overhead from tool definitions

Tool definitions count toward model input tokens even when the agent doesn’t call the tools. Together, the default `shell` and `file_operations` definitions add approximately 900 input tokens to each model request. The exact count varies by model and can change as tool definitions evolve. Because an invocation can make multiple model requests, this overhead can occur more than once per invocation. Use `allowedTools` to expose only the tools needed for a request and reduce token usage.

Supported patterns:

Pattern | Example | Matches  
---|---|---  
`*` |  `"*"` |  All tools  
Plain name |  `"shell"` |  Builtin by name  
Builtin glob |  `"file_*"` |  `file_operations`, `file_read`  
`@builtin` |  `"@builtin"` |  All builtin tools  
`@builtin/name` |  `"@builtin/shell"` |  Specific builtin  
`@server` |  `"@git"` |  All tools from an MCP server  
`@server/tool` |  `"@git/git_status"` |  Specific MCP tool  
`@server/glob` |  `"@git/read_*"` |  Glob within a server  
`@*/tool` |  `"@*-mcp/status"` |  Glob across servers  
  
###### Note

`allowedTools` scopes LLM tool selection during `InvokeHarness` only. It does not affect [InvokeAgentRuntimeCommand](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-execute-command.html>), which is a separate API with its own IAM action (`bedrock-agentcore:InvokeAgentRuntimeCommand`) that executes commands directly without passing through the LLM. To prevent direct command execution, do not grant `bedrock-agentcore:InvokeAgentRuntimeCommand` in your IAM policies.

## Add tools

###### Example

AWS CLI/boto3
    

Pass `tools` at create, update, or invoke time:

```text
tools = [
    # MCP server
    {
        "type": "remote_mcp",
        "name": "exa",
        "config": {"remoteMcp": {"url": "https://mcp.exa.ai/mcp"}},
    },
    # MCP server with authentication headers (plain text)
    {
        "type": "remote_mcp",
        "name": "my-private-mcp",
        "config": {"remoteMcp": {
            "url": "https://mcp.example.com/api",
            "headers": {"Authorization": "Bearer <your-token>"}
        }},
    },
    # MCP server with API key stored in AgentCore Identity Token Vault.
    # Use ${arn:...} to reference a credential provider - the ARN is resolved
    # to the actual API key at invocation time.
    {
        "type": "remote_mcp",
        "name": "exa-secure",
        "config": {"remoteMcp": {
            "url": "https://mcp.exa.ai/mcp",
            "headers": {"x-api-key": "${arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-exa-key}"}
        }},
    },
    # For managed credential rotation and OAuth-protected tools, put your MCP server
    # behind AgentCore Gateway and use AgentCore Identity instead of raw headers.
    #
    # AgentCore Gateway with SigV4 auth (default)
    {
        "type": "agentcore_gateway",
        "name": "my-gateway",
        "config": {"agentCoreGateway": {"gatewayArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/my-gateway"}},
    },
    # AgentCore Gateway with OAuth auth
    {
        "type": "agentcore_gateway",
        "name": "my-oauth-gateway",
        "config": {"agentCoreGateway": {
            "gatewayArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/my-oauth-gateway",
            "outboundAuth": {"oauth": {
                "credentialProviderName": "my-oauth-provider",
                "scopes": ["read", "write"]
            }}
        }},
    },
    # AgentCore Browser
    {"type": "agentcore_browser", "name": "browser"},
    # AgentCore Code Interpreter
    {"type": "agentcore_code_interpreter", "name": "code_interpreter"},
    # Inline function - executes on the client side, not on the harness VM.
    # When the agent calls this tool, the call is returned to your code for handling.
    {
        "type": "inline_function",
        "name": "approve_purchase",
        "config": {
            "inlineFunction": {
                "description": "Request human approval for a purchase.",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "item": {"type": "string"},
                        "amount": {"type": "number"},
                    },
                    "required": ["item", "amount"],
                },
            }
        },
    },
]

response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    tools=tools,
    messages=[{"role": "user", "content": [{"text": "Find a mechanical keyboard under $200 and request approval."}]}],
)
```
AgentCore CLI
    

When creating a new harness interactively, the `agentcore add harness` wizard lets you select tools. To add tools via the CLI, use `agentcore add tool` after creating the harness:

###### Note

The `--type` flag uses underscore-separated names (for example, `agentcore_browser`), which match the tool type identifiers in `harness.json`.

```bash
# Add a remote MCP server
agentcore add tool --harness my-agent --type remote_mcp \
  --name exa --url https://mcp.exa.ai/mcp

# Add a remote MCP server with an API key from AgentCore Identity Token Vault.
# Use ${arn:...} syntax in header values to reference a credential provider.
agentcore add tool --harness my-agent --type remote_mcp \
  --name exa-secure --url https://mcp.exa.ai/mcp \
  --header 'x-api-key=${arn:aws:bedrock-agentcore:us-west-2:123456789012:token-vault/default/apikeycredentialprovider/my-exa-key}'

# Add Browser
agentcore add tool --harness my-agent --type agentcore_browser --name browser

# Add Code Interpreter
agentcore add tool --harness my-agent --type agentcore_code_interpreter --name code-interpreter

# Add Gateway by ARN
agentcore add tool --harness my-agent --type agentcore_gateway \
  --name my-gateway --gateway-arn arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/my-gateway

# Add Gateway by project-local name
agentcore add tool --harness my-agent --type agentcore_gateway \
  --name my-gateway --gateway my-gateway

# Add an inline function tool (executes client-side, not on the harness VM)
agentcore add tool --harness my-agent --type inline_function \
  --name approve_purchase \
  --description "Request human approval for a purchase" \
  --input-schema '{"type": "object", "properties": {"item": {"type": "string"}, "amount": {"type": "number"}}, "required": ["item", "amount"]}'
```
Deploy to apply.

Override tools on a single invocation:

```bash
agentcore invoke --harness research-agent --tools agentcore-browser "Find the latest news on AI agents"
```
Interactive
    

Run `agentcore` in a project directory, select **add** , choose **Harness** , and advance to **Advanced settings** . Enable **Tools** with **Space** , then press **Enter** .

  1. Select the tools for your harness: **AgentCore Browser** , **AgentCore Code Interpreter** , **AgentCore Gateway** , or **Remote MCP Server** . Use **Space** to toggle each, then press **Enter** .

![Select tools: Browser, Code Interpreter, Gateway, Remote MCP Server](/agentcore/images/harness-tools-02-picker.png)

  2. For a **Remote MCP Server** , the wizard prompts for the server name, URL, and optional request headers.

![Enter the MCP server URL](/agentcore/images/harness-tools-04-mcp-url.png)

  3. For an **AgentCore Gateway** , enter the gateway ARN and choose its outbound authentication: **AWS IAM** (default), **None** , or **OAuth** .

![Select gateway outbound authentication](/agentcore/images/harness-tools-07-gateway-auth.png)

  4. Review the configuration summary and confirm.

![Review the harness tool configuration](/agentcore/images/harness-tools-08-confirm.png)


Then run `agentcore deploy` to apply.

## Web search

To give your agent web search, put the [Web Search Tool](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-target-connector-web-search-tool.html>) connector behind an [AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway.html>) and attach that gateway to your harness as an `agentcore_gateway` tool. The gateway exposes web search as a standard MCP `WebSearch` tool. Your agent discovers and calls it like any other gateway tool. AgentCore Gateway serves all queries entirely within AWS. For more information about the privacy model and the purpose-built web index, see the Web Search Tool connector page.

###### Region availability

Web Search Tool is available in the US East (N. Virginia) `us-east-1` Region. Create the gateway and harness in `us-east-1`.

Complete the following steps to set up web search for your harness.

  1. **Create the gateway and connector target.** Follow the steps in [Set up Web Search Tool](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-web-search-setup>) to create a Gateway (MCP protocol, `AWS_IAM` inbound auth) and add a target with `connectorId: "web-search"`. That target needs a Gateway service role with `bedrock-agentcore:InvokeWebSearch` on the connector. For more information, see [Configure the Gateway Service Role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-add-target-api-target-config.html#gateway-add-target-api-connector-web-search-service-role>). Note the gateway ARN once it reaches `READY`.

  2. **Grant the harness execution role access.** The harness execution role (distinct from the Gateway service role in the previous step) needs `bedrock-agentcore:InvokeGateway` on the gateway ARN. For more information about the required permissions, see the [AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) optional-permissions policy in the security topic. If your harness uses managed memory (the default), the execution role also needs the [AgentCore Memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) permissions. The agent reads and writes session memory on each invocation.

  3. **Attach the gateway to the harness.** Add it as an `agentcore_gateway` tool with the default `AWS_IAM` outbound auth. The following examples show how to attach the gateway at create time.


###### Example

AWS CLI/boto3
    

Attach the gateway at create time (or pass `tools` on `update_harness` / `invoke_harness`):

```text
tools = [
    {
        "type": "agentcore_gateway",
        "name": "web-search",
        "config": {"agentCoreGateway": {
            "gatewayArn": "arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-web-search-gateway",
            "outboundAuth": {"awsIam": {}}
        }},
    },
]

client.create_harness(
    harnessName="research-agent",
    executionRoleArn="arn:aws:iam::123456789012:role/MyHarnessRole",
    tools=tools,
)
```
The gateway’s tools are now available to the agent. Invoke the harness with a prompt that needs current information:

```text
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    messages=[{"role": "user", "content": [{"text": "Search the web for the latest AWS announcements and cite your sources."}]}],
)
```
AgentCore CLI
     ```bash
     # Attach the web-search gateway to your harness
     agentcore add tool --harness research-agent --type agentcore_gateway \
       --name web-search \
       --gateway-arn arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/my-web-search-gateway

     # Deploy, then invoke
     agentcore deploy
     agentcore invoke --harness research-agent "Search the web for the latest AWS announcements and cite your sources."
     ```
## Inline function calls

Inline functions let you define a tool that executes in your code, not on the harness. This is useful for human-in-the-loop approvals, calling internal APIs, or any logic you want to control client-side.

###### Example

AWS CLI/boto3
    

Pass an inline function tool at invoke time:

```bash
# 1. Invoke with an inline function tool
response = client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    tools=[{
        "type": "inline_function",
        "name": "get_weather",
        "config": {"inlineFunction": {
            "description": "Get the current weather for a city.",
            "inputSchema": {
                "type": "object",
                "properties": {"city": {"type": "string"}},
                "required": ["city"]
            }
        }}
    }],
    messages=[{"role": "user", "content": [{"text": "What's the weather in Seattle?"}]}],
)

# 2. The agent calls the tool - capture the toolUseId and input from the stream
tool_use_id = None
tool_name = None
tool_input = None
for event in response["stream"]:
    if "contentBlockStart" in event:
        start = event["contentBlockStart"].get("start", {})
        if "toolUse" in start and start["toolUse"].get("name") == "get_weather":
            tool_use_id = start["toolUse"]["toolUseId"]
            tool_name = start["toolUse"]["name"]
    if "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "toolUse" in delta:
            tool_input = (tool_input or "") + delta["toolUse"].get("input", "")

# 3. Execute the tool yourself and send the result back
# Include the assistant's toolUse message followed by your toolResult
client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    messages=[
        {
            "role": "assistant",
            "content": [{"toolUse": {"toolUseId": tool_use_id, "name": tool_name, "input": json.loads(tool_input)}}],
        },
        {
            "role": "user",
            "content": [{
                "toolResult": {
                    "toolUseId": tool_use_id,
                    "content": [{"text": "72°F, partly cloudy"}],
                    "status": "success",
                }
            }],
        },
    ],
)
```
###### Note

You must include both the assistant `toolUse` message and your `toolResult` in step 3. The harness intentionally does not persist the inline function turn to the session - if the client never returns a result, persisting a partial turn (assistant `toolUse` without a matching `toolResult`) would leave the session in a corrupted state. By requiring the client to send both messages, the session remains clean regardless of whether the client completes the tool call.

The agent resumes reasoning with the tool result and streams the final response.

AgentCore CLI
    

Add an inline function tool to a harness:

```bash
agentcore add tool --harness my-agent --type inline_function \
  --name get_weather
```
Then define the description and input schema in `app/my-agent/harness.json`:

```json
{
  "type": "inline_function",
  "name": "get_weather",
  "config": {
    "inlineFunction": {
      "description": "Get the current weather for a city.",
      "inputSchema": {
        "type": "object",
        "properties": { "city": { "type": "string" } },
        "required": ["city"]
      }
    }
  }
}
```
Run `agentcore deploy` to apply. When the agent calls the inline function during an invocation, the TUI pauses and prompts you to provide the tool result inline. In non-interactive (CLI) mode, the stream returns with `stopReason: "tool_use"` and you send the result back with a follow-up invoke call.

Learn more about each tool:

  * [AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html>) · [create a gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-create.html>) · [policies](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html>)

  * [AgentCore Browser](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html>) · [browser profiles](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-profiles.html>) · [session recording](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-session-recording.html>)

  * [AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html>) · [preinstalled libraries](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-preinstalled-libraries.html>)


### Related topics

  * [Models and instructions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-models.html>) \- configure models and override per invocation

  * [Environment and filesystem](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-environment.html>) \- bring your own container and run shell commands

  * [Security and access controls](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-security.html>) \- control which tools the agent can access with policies

  * [API Documentation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./harness-get-started.html#api-documentation>)



