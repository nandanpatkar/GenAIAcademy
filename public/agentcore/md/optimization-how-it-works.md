# How it works - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/optimization-how-it-works.html

---

# How it works

AgentCore optimization connects evaluation findings to validated improvements through a repeatable cycle. A typical iteration follows these steps:

  1. **Generate a recommendation:** Point the Recommendations API at agent traces in CloudWatch Logs and specify the evaluator you want to optimize for. The service analyzes failure patterns and returns an optimized system prompt or set of tool descriptions, along with an explanation of what changed and why.

  2. **(Optional) Package as a configuration bundle:** Create a bundle version with the recommended configuration. A bundle is a versioned, immutable snapshot of an agent’s configuration (system prompts, model IDs, tool descriptions) that can be dynamically changed without code deployments. Configuration bundles are useful when you want to decouple agent behavior from code; they are not required. You can also validate changes by deploying to a separate runtime endpoint.

  3. **Validate with an A/B test:** Split production traffic between the current agent (control) and the improved version (treatment) through AgentCore Gateway. Online evaluation scores each session and reports results with statistical significance. A/B tests support two patterns:

     * **Configuration bundle variants:** Same runtime, different bundle versions. Use when the change is purely configuration (prompt, model ID, tool descriptions).

     * **Target-based variants:** Different gateway targets pointing to different runtime endpoints. Use when the change includes code changes, a framework upgrade, or when you want to compare entirely different agent implementations. Each variant can have its own online evaluation configuration.

  4. **Deploy the winning variant and repeat:** Route 100% of traffic to the winning variant. New traces from the new baseline provide the foundation for the next iteration.



