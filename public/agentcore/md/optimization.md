# AgentCore optimization: Improve agent quality loop with recommendations and A/B tests - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization.html

---

# AgentCore optimization: Improve agent quality loop with recommendations and A/B tests

Amazon Bedrock AgentCore optimization provides tools to continuously improve your agent’s performance through data-driven configuration changes. Instead of manually rewriting prompts and testing by hand, you use agent traces to generate improvements and validate them with controlled experiments.

AgentCore optimization builds on [AgentCore Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations.html>) and introduces three capabilities:

  * **Recommendations:** AI-generated improvements to system prompts and tool descriptions based on real agent traces and a target evaluator. The service analyzes failure patterns based on the target evaluator and produces an optimized variant of the system prompt or tool descriptions.

  * **Configuration bundles:** Versioned, immutable snapshots of agent configuration (system prompts, model IDs, tool descriptions) that decouple agent behavior from code, enabling behavioral changes without requiring redeployment. Configuration bundles are optional; you can also validate changes by deploying to a separate runtime endpoint.

  * **A/B testing:** Controlled traffic splitting between two variants through AgentCore Gateway, with online evaluation scoring for each session and reporting statistical significance. Variants can be different configuration bundle versions on the same runtime, or different gateway targets pointing to different runtime endpoints.


Together, these capabilities form a continuous improvement loop:

![AgentCore optimization improvement loop](/agentcore/images/optimization-loop.png)

###### Topics

  * [How it works](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-how-it-works.html>)

  * [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-prereqs.html>)

  * [Configuration bundles](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./configuration-bundles.html>)

  * [Recommendations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-recommendations.html>)

  * [A/B testing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing.html>)

  * [AgentCore insights: Triage agent failures with pattern analysis](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./insights.html>)



