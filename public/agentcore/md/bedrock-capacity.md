# Amazon Bedrock capacity for built-in with overrides strategies - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-capacity.html

---

# Amazon Bedrock capacity for built-in with overrides strategies

When configuring [built-in with overrides](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-custom-strategy.html>) strategies with [CreateMemory](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html>) or [UpdateMemory](<https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_UpdateMemory.html>) , you must provide an IAM execution role ( `memoryExecutionRoleArn` ). The AgentCore Memory service assumes this role to perform Amazon Bedrock operations (such as LLM calls for memory extraction and/or consolidation) within your AWS account.

Since Amazon Bedrock usage is attributed to your account, it consumes your allocated capacity and is subject to your Bedrock service quotas. If Amazon Bedrock calls are throttled due to quota limits, memory ingestion operations might fail.

###### Note

Amazon Bedrock usage is attributed to customer account only for custom memory strategies.

To monitor and troubleshoot these issues, enable log delivery on your memory configuration to observe error logs when ingestion failures occur. You can also request quota increases for the Bedrock models you’re using to prevent throttling issues.

