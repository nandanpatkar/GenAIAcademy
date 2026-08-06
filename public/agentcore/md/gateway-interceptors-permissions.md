# Permissions for interceptors - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors-permissions.html

---

# Permissions for interceptors

When configuring interceptors, your gateway service role must have the lambda:InvokeFunction IAM permissions to invoke the Lambda functions that serve as interceptors. The service role needs specific permissions to execute interceptor functions during request and response processing.

For detailed information about configuring the required permissions for your gateway service role, including permissions to Lambda, see [Gateway service role permissions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-prerequisites-permissions.html#gateway-service-role-permissions>).

