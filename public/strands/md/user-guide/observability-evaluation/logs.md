The Strands SDK provides logging infrastructure to give visibility into its operations.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Strands SDK uses Python\u2019s standard [`logging`](https://docs.python.org/3/library/logging.html) module. The SDK implements a straightforward logging approach:\n\n1.  **Module-level Loggers**: Each module creates its own logger using `logging.getLogger(__name__)`, following Python best practices for hierarchical logging.\n    \n2.  **Root Logger**: All loggers are children of the \u201cstrands\u201d root logger, making it easy to configure logging for the entire SDK.\n    \n3.  **Default Behavior**: By default, the SDK doesn\u2019t configure any handlers or log levels, allowing you to integrate it with your application\u2019s logging configuration."
 },
 {
  "label": "TypeScript",
  "body": "Strands SDK provides a simple logging infrastructure with a global logger that can be configured to use your preferred logging implementation.\n\n1.  **Logger Interface**: A simple interface (`debug`, `info`, `warn`, `error`) compatible with popular logging libraries like Pino, Winston, and the browser/Node.js console.\n    \n2.  **Global Logger**: A single global logger instance configured via `configureLogging()`.\n    \n3.  **Default Behavior**: By default, the SDK only logs warnings and errors to the console. Debug and info logs are no-ops unless you configure a custom logger."
 }
]
```

## Configuring Logging

```sa-tabs
[
 {
  "label": "Python",
  "body": "To enable logging for the Strands Agents SDK, you can configure the \u201cstrands\u201d logger:\n\n```python\nimport logging\n\n# Configure the root strands logger\nlogging.getLogger(\"strands\").setLevel(logging.DEBUG)\n\n# Add a handler to see the logs\nlogging.basicConfig(\n    format=\"%(levelname)s | %(name)s | %(message)s\",\n    handlers=[logging.StreamHandler()]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "To enable logging for the Strands Agents SDK, use the `configureLogging` function. The SDK\u2019s logger interface is compatible with standard console and popular logging libraries.\n\n**Using console:**\n\n```typescript\n// Use the default console for logging\nconfigureLogging(console)\n```\n\n**Using Pino:**\n\n```typescript\nimport pino from 'pino'\n\nconst pinoLogger = pino({\n  level: 'debug',\n  transport: {\n    target: 'pino-pretty',\n    options: {\n      colorize: true,\n    },\n  },\n})\n\nconfigureLogging(pinoLogger)\n```\n\n**Default Behavior:**\n\n-   By default, the SDK only logs warnings and errors using `console.warn()` and `console.error()`\n-   Debug and info logs are no-ops by default (zero performance overhead)\n-   Configure a custom logger with appropriate log levels to enable debug/info logging"
 }
]
```

### Log Levels

The Strands Agents SDK uses standard log levels:

-   **DEBUG**: Detailed operational information for troubleshooting. Extensively used for tool registration, discovery, configuration, and execution flows.
    
-   **INFO**: General informational messages. Currently not used.
    
-   **WARNING**: Potential issues that don’t prevent operation, such as validation failures, specification errors, and compatibility warnings.
    
-   **ERROR**: Significant problems that prevent specific operations from completing successfully, such as execution failures and handler errors.
    
-   **CRITICAL**: Reserved for catastrophic failures.
    

## Key Logging Areas

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Strands Agents SDK logs information in several key areas. Let\u2019s look at what kinds of logs you might see when using the following example agent with a calculator tool:\n\n```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\n# Create an agent with the calculator tool\nagent = Agent(tools=[calculator])\nresult = agent(\"What is 125 * 37?\")\n```\n\nWhen running this code with logging enabled, you\u2019ll see logs from different components of the SDK as the agent processes the request, calls the calculator tool, and generates a response.\n\n**Tool Registry and Execution**\n\nLogs related to tool discovery, registration, and execution:\n\n```plaintext\n# Tool registration\nDEBUG | strands.tools.registry | tool_name=<calculator> | registering tool\nDEBUG | strands.tools.registry | tool_name=<calculator>, tool_type=<function>, is_dynamic=<False> | registering tool\nDEBUG | strands.tools.registry | tool_name=<calculator> | loaded tool config\nDEBUG | strands.tools.registry | tool_count=<1> | tools configured\n\n# Tool discovery\nDEBUG | strands.tools.registry | tools_dir=</path/to/tools> | found tools directory\nDEBUG | strands.tools.registry | tools_dir=</path/to/tools> | scanning\nDEBUG | strands.tools.registry | tool_modules=<['calculator', 'weather']> | discovered\n\n# Tool validation\nWARNING | strands.tools.registry | tool_name=<invalid_tool> | spec validation failed | Missing required fields in tool spec: description\nDEBUG | strands.tools.registry | tool_name=<calculator> | loaded dynamic tool config\n\n# Tool execution\nDEBUG | strands.event_loop.event_loop | tool_use=<calculator_tool_use_id> | streaming\n\n# Tool hot reloading\nDEBUG | strands.tools.registry | tool_name=<calculator> | searching directories for tool\nDEBUG | strands.tools.registry | tool_name=<calculator> | reloading tool\nDEBUG | strands.tools.registry | tool_name=<calculator> | successfully reloaded tool\n```\n\n**Event Loop**\n\nLogs related to the event loop processing:\n\n```plaintext\nERROR | strands.event_loop.error_handler | an exception occurred in event_loop_cycle | ContextWindowOverflowException\nDEBUG | strands.event_loop.error_handler | message_index=<5> | found message with tool results at index\n```\n\n**Model Interactions**\n\nLogs related to interactions with foundation models:\n\n```plaintext\nDEBUG | strands.models.bedrock | config=<{'model_id': 'global.anthropic.claude-sonnet-4-6'}> | initializing\nWARNING | strands.models.bedrock | bedrock threw context window overflow error\nDEBUG | strands.models.bedrock | Found blocked output guardrail. Redacting output.\n```"
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript SDK currently has minimal logging, primarily focused on model interactions. Logs are generated for:\n\n-   **Model configuration warnings**: Unsupported features (e.g., cache points in OpenAI, guard content)\n-   **Model response warnings**: Invalid formats, unexpected data structures\n-   **Bedrock-specific operations**: Configuration auto-detection, unsupported event types\n\nExample logs you might see:\n\n```plaintext\n# Model configuration warnings\nWARN cache points are not supported in openai system prompts, ignoring cache points\nWARN guard content is not supported in openai system prompts, removing guard content block\n\n# Model response warnings\nWARN choice=<null> | invalid choice format in openai chunk\nWARN tool_call=<{\"type\":\"function\",\"id\":\"xyz\"}> | received tool call with invalid index\n\n# Bedrock-specific logs\nDEBUG model_id=<global.anthropic.claude-sonnet-4-6>, include_tool_result_status=<true> | auto-detected includeToolResultStatus\nWARN block_key=<unknown_key> | skipping unsupported block key\nWARN event_type=<unknown_type> | unsupported bedrock event type\n```\n\nFuture versions will include more detailed logging for tool operations and event loop processing."
 }
]
```

## Advanced Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "**Filtering Specific Modules**\n\nYou can configure logging for specific modules within the SDK:\n\n```python\nimport logging\n\n# Enable DEBUG logs for the tool registry only\nlogging.getLogger(\"strands.tools.registry\").setLevel(logging.DEBUG)\n\n# Set WARNING level for model interactions\nlogging.getLogger(\"strands.models\").setLevel(logging.WARNING)\n```\n\n**Custom Handlers**\n\nYou can add custom handlers to process logs in different ways:\n\n```python\nimport logging\nimport json\n\nclass JsonFormatter(logging.Formatter):\n    def format(self, record):\n        log_data = {\n            \"timestamp\": self.formatTime(record),\n            \"level\": record.levelname,\n            \"name\": record.name,\n            \"message\": record.getMessage()\n        }\n        return json.dumps(log_data)\n\n# Create a file handler with JSON formatting\nfile_handler = logging.FileHandler(\"strands_agents_sdk.log\")\nfile_handler.setFormatter(JsonFormatter())\n\n# Add the handler to the strands logger\nlogging.getLogger(\"strands\").addHandler(file_handler)\n```"
 },
 {
  "label": "TypeScript",
  "body": "**Custom Logger Implementation**\n\nYou can implement your own logger to integrate with your application\u2019s logging system:\n\n```typescript\n// Declare a mock logging service type for documentation\ndeclare const myLoggingService: {\n  log(level: string, ...args: unknown[]): void\n}\n\nconst customLogger: Logger = {\n  debug: (...args: unknown[]) => {\n    // Send to your logging service\n    myLoggingService.log('DEBUG', ...args)\n  },\n  info: (...args: unknown[]) => {\n    myLoggingService.log('INFO', ...args)\n  },\n  warn: (...args: unknown[]) => {\n    myLoggingService.log('WARN', ...args)\n  },\n  error: (...args: unknown[]) => {\n    myLoggingService.log('ERROR', ...args)\n  },\n}\n\nconfigureLogging(customLogger)\n```"
 }
]
```

## Best Practices

```sa-tabs
[
 {
  "label": "Python",
  "body": "1.  **Configure Early**: Set up logging configuration before initializing the agent\n2.  **Appropriate Levels**: Use INFO for normal operation and DEBUG for troubleshooting\n3.  **Structured Log Format**: Use the structured log format shown in examples for better parsing\n4.  **Performance**: Be mindful of logging overhead in production environments\n5.  **Integration**: Integrate Strands Agents SDK logging with your application\u2019s logging system"
 },
 {
  "label": "TypeScript",
  "body": "1.  **Configure Early**: Call `configureLogging()` before creating any Agent instances\n2.  **Default Behavior**: By default, only warnings and errors are logged - configure a custom logger to see debug information\n3.  **Production Performance**: Debug and info logs are no-ops by default, minimizing performance impact\n4.  **Compatible Libraries**: Use established logging libraries like Pino or Winston for production deployments\n5.  **Consistent Format**: Ensure your custom logger maintains consistent formatting across log levels"
 }
]
```

## Related pages

- [PII Redaction](lc:user-guide/safety-security/pii-redaction) (2 shared tags)
- [Evaluating Remote Traces](lc:user-guide/evals-sdk/how-to/trace_providers) (1 shared tag)
- [Metrics](lc:user-guide/observability-evaluation/metrics) (1 shared tag)
- [Observability](lc:user-guide/observability-evaluation/observability) (1 shared tag)
- [Task Decorator](lc:user-guide/evals-sdk/how-to/eval_task) (1 shared tag)
- [Traces](lc:user-guide/observability-evaluation/traces) (1 shared tag)
- [Operating Agents in Production](lc:user-guide/deploy/operating-agents-in-production) (1 shared tag)
- [Root Cause Analysis](lc:user-guide/evals-sdk/detectors/root_cause_analysis) (1 shared tag)
- [Session Diagnosis](lc:user-guide/evals-sdk/detectors/diagnosis) (1 shared tag)
- [AgentCore Evaluation Dashboard Configuration](lc:user-guide/evals-sdk/how-to/agentcore_evaluation_dashboard) (1 shared tag)
