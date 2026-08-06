# Set up dependencies and credentials to create, maintain, and use gateway resources - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-setup-tools-credentials.html

---

# Set up dependencies and credentials to create, maintain, and use gateway resources

The AgentCore Gateway service involves the following main processes:

  * **Creation and maintenance of gateway resources** – You can create gateway and gateway target resources through the Amazon Bedrock AgentCore Control Plane service.

  * **Invocation of gateways** – After creating a gateway and gateway target, you can invoke the gateway through direct HTTP requests to the gateway or through the help of an MCP client or agent.


Select a topic to learn about setting up tools and credentials for carrying out these processes:

###### Topics

  * Set up tools and credentials for the creation and maintenance of gateway resources

  * Invocation of gateways


## Set up tools and credentials for the creation and maintenance of gateway resources

You create, modify, delete, and retrieve information about gateway and gateway target resources through making calls to the Amazon Bedrock AgentCore Control Plane service. The [Amazon Bedrock AgentCore Control Plane service API reference](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/Welcome.html>) details information about the API operations and structures in this service.

You can interact with the Amazon Bedrock AgentCore Control Plane service in the following ways. Expand a topic to learn how to install the tool and set up authentication for it.

The AWS Management Console lets you create and maintain gateway and gateway target resources through an interactive graphical interface in a web browser.

  * **Installation** – None needed. To manage gateways through the AgentCore console, you can navigate to [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>) and select **Gateways** from the left navigation pane.

  * **Authentication** – Sign in with an IAM identity with permissions to use AgentCore Gateway actions.


The [Amazon Bedrock AgentCore Control Plane service API reference](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/Welcome.html>) page for each API operations provides the information you need to make an API request.

  * **Installation** – None needed.

  * **Authentication** – You can use the [Authorization header](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html>) or query parameters (using [AWS Signature Version 4](<https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html>) ) to authenticate.


AWS SDKs let you make API requests to AWS services through a programming language of your choice. Refer to the following resources in the [AWS SDKs and Tools Reference Guide](<https://docs.aws.amazon.com/sdkref/latest/guide/overview.html>) to get set up:

  * **Installation** – To learn about an SDK and how to install it, select the **AWS SDK for** link that corresponds to your programming language of choice.

  * **Authentication** – To learn about configuring SDKs and authentication, refer to the links in the **This guide’s relevant sections for you are:** column.

  * **Other resources** – In the language-specific reference, search for the Amazon Bedrock AgentCore Core Control service to see the syntax of specific API methods.


The AWS Command Line Interface (CLI) lets you interact with the AWS API in a command line interface. To learn how to install and set up the AWS CLI, see [Getting started with the AWS CLI](<https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html>) in the [AWS Command Line Interface User Guide](<https://docs.aws.amazon.com/cli/latest/userguide/>).

  * **Installation** – To learn how to install the AWS CLI see [Installing or updating to the latest version of the AWS CLI](<https://docs.aws.amazon.com//cli/latest/userguide/getting-started-install.html>).

  * **Authentication** – To learn about configuring your credentials in the AWS CLI see [Setting up the AWS CLI](<https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html>).

  * **Other resources** – To see the syntax of specific API methods in the Amazon Bedrock AgentCore control plane service, see the [bedrock-agentcore-control](<https://docs.aws.amazon.com/cli/latest/reference/bedrock-agentcore-control/>) reference.


The AgentCore CLI is a Node.js command-line tool for interacting with the AgentCore API. Refer to the following resources in the [AgentCore CLI repository](<https://github.com/aws/agentcore-cli>).

  * **Installation** – To install the AgentCore CLI, run the following command:

```bash
npm install -g @aws/agentcore
```
  * **Authentication** – To access your AWS credentials and configure them for the AgentCore CLI, follow the steps at [Using IAM Identity Center to authenticate AWS SDK and Tools](<https://docs.aws.amazon.com/sdkref/latest/guide/access-sso.html>).

  * **Other resources** – For more information about using the AgentCore CLI to interact with AgentCore Gateway, see the [AgentCore CLI repository](<https://github.com/aws/agentcore-cli>).


## Invocation of gateways

After you create a gateway and gateway targets, you can interact with the gateway through direct HTTP requests or through an MCP client or agent.

To make an HTTP request to an AgentCore gateway, you make a POST request to a gateway endpoint that you set up when creating a gateway.

  * **Installation** – None needed.

  * **Authentication** – You can use the [Authorization header](<https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html>) or query parameters (using [AWS Signature Version 4](<https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html>) ) to authenticate.


To interact with an AgentCore gateway using an MCP client, you need to install the MCP client by following the **Setting up your environment** and **Setting up your API key** steps at [Build an MCP client](<https://modelcontextprotocol.io/docs/develop/build-client>) after choosing your programming language of choice. By following the steps, you’ll also retrieve an Anthropic API key for authentication.

To interact with an AgentCore gateway using the Strands Agents SDK, you need to install the Strands SDK by following the steps at [Strands Agents SDK](<https://strandsagents.com/latest/documentation/docs/>) to install the SDK and set up credentials.

To interact with an AgentCore gateway using a Langgraph agent, you need to install Langgraph by navigating to [LangGraph](<https://www.langchain.com/langgraph>) , selecting **Docs** , and choosing the **LangGraph** page that corresponds to your programming language of choice. By following these steps, you’ll also receive an API key to help set up your credentials.

