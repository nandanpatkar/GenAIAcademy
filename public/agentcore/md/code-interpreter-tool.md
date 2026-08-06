# Execute code and analyze data using Amazon Bedrock AgentCore Code Interpreter - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html

---

# Execute code and analyze data using Amazon Bedrock AgentCore Code Interpreter

The Amazon Bedrock AgentCore Code Interpreter enables AI agents to write and execute code securely in sandbox environments, enhancing their accuracy and expanding their ability to solve complex end-to-end tasks. This is critical in Agentic AI applications where the agents may execute arbitrary code that can lead to data compromise or security risks. The AgentCore Code Interpreter tool provides secure code execution, which helps you avoid running into these issues.

The Code Interpreter comes with pre-built runtimes for multiple languages and advanced features, including large file support and internet access, and CloudTrail logging capabilities. For inline upload, the file size can be up to 100 MB. And for uploading to Amazon S3 through terminal commands, the file size can be as large as 5 GB.

Developers can customize environments with session properties and network modes to meet their enterprise and security requirements. The AgentCore Code Interpreter reduces manual intervention while enabling sophisticated AI development without compromising security or performance.

###### Topics

  * Overview

  * Why use Code Interpreter in agent development

  * Best practices

  * [Pre-installed libraries](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-preinstalled-libraries.html>)

  * [Get started with AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-getting-started.html>)

  * [Run code in Code Interpreter from Agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-building-agents.html>)

  * [Write files to a session](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-file-operations.html>)

  * [Using Terminal Commands with an execution role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-s3-integration.html>)

  * [Resource and session management](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-resource-session-management.html>)

  * [File system configurations for AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-filesystem-configurations.html>)

  * [Code Interpreter API Reference Examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-api-reference-examples.html>)

  * [Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-observability.html>)

  * [Configure Root Certificate Authority for Amazon Bedrock AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-root-ca-certificates.html>)

  * [Troubleshoot AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-troubleshooting.html>)


## Overview

The AgentCore Code Interpreter is a capability that allows AI agents to write, execute, and debug code securely in sandbox environments. It provides a bridge between natural language understanding and computational execution, enabling agents to manipulate data and perform calculations programmatically.

The AgentCore Code Interpreter runs in a containerized environment within Amazon Bedrock AgentCore, ensuring that code execution remains isolated and secure.

![Architecture showing the built-in tools offering and Browser and CI tools.](/agentcore/images/code-interpreter.png)

## Why use Code Interpreter in agent development

The AgentCore Code Interpreter enhances agent development in the following ways:

  * Execute code securely: Develop agents that can perform complex workflows and data analysis in sandbox environments, while accessing internal data sources without exposing sensitive data or compromising security.

  * Multiple programming languages: The Code Interpreter supports various programming languages including Python, JavaScript, and TypeScript, making it versatile for different use cases.

  * Monitoring and large-scale data processing: Track and troubleshoot code execution. When working with large datasets, you can easily reference files stored in Amazon S3, enabling efficient processing of gigabyte-scale data without API limitations.

  * Ease of use: Use a fully managed default mode with pre-built execution runtimes that support popular programming languages with common libraries pre-installed.

  * Extends problem-solving capabilities: Allows agents to solve computational problems that are difficult to address through reasoning alone and enables precise mathematical calculations and data processing at scale.

  * Long execution duration support: The Code Interpreter tool provides support for a default execution time of 15 minutes, which can be extended for up to eight hours.

  * Handles structured data: Processes CSV, Excel, JSON, and other data formats, and performs data cleaning, and analysis.

  * Enables complex workflows: Allows multi-step problem solving that combines reasoning with computation and facilitates iterative development and debugging.


The AgentCore Code Interpreter makes agents more powerful by complementing their reasoning abilities with computational execution, allowing them to tackle a much wider range of tasks effectively.

## Best practices

To get the most out of the AgentCore Code Interpreter:

  * Keep code snippets concise and focused on specific tasks

  * Use comments to document your code

  * Optimize code for performance when working with large datasets

  * Save intermediate results when performing complex operations

  * Use the `code_session` context manager to ensure proper cleanup

  * Include try/except blocks in code to handle errors gracefully

  * Code execution results are returned and processed as streams

  * Clean up temporary files when no longer needed

  * Close sessions when you’re done to release resources



