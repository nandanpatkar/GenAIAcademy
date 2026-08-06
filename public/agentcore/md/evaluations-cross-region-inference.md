# Cross region inference - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-cross-region-inference.html

---

# Cross region inference

AgentCore Evaluations will automatically select the optimal region within your geography to process your inference requests. This maximizes available compute resources, model availability, and delivers the best customer experience. Your data will remain stored only in the region where the request originated, however, input prompts and output results may be processed outside that region. All data will be transmitted encrypted across AWS's secure network.

For AgentCore Evaluations, inference requests originating in Asia Pacific (Seoul) (ap-northeast-2) use global cross-region inference and will be securely routed to all available compute resources across all global commercial AWS Regions. For more information, see [Global cross-region inference for AgentCore Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./cross-region-inference.html#cross-region-inference-evaluations-global>).

If your use case requires avoiding [cross region inference](<https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html>) , you can create [Custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>) that operate without CRIS. Custom evaluators provide the flexibility to:

  * Replicate the functionality of built-in evaluators without using CRIS

  * Define identical evaluation criteria and scoring schemas as built-in evaluators

  * Maintain full control over the inference configuration


###### Note

While custom evaluators can be configured to match built-in evaluator functionality, you are responsible for managing model availability and compute resources.

