# A/B testing - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing.html

---

# A/B testing

A/B testing splits live production traffic between two variants and continuously evaluates performance with statistical significance. The AgentCore Gateway handles traffic routing; your agent code does not change.

A/B testing is the validation step in the [AgentCore optimization improvement loop](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-how-it-works.html>). After generating a [recommendation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-recommendations.html>) and validating it with [offline batch evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations.html>), you run an A/B test to confirm the change improves performance on live traffic before committing to a full rollout. You can route traffic to separate AgentCore Runtimes (target-based) or deliver different configurations to the same AgentCore Runtime (configuration bundles).

## When to use A/B testing

Use A/B testing when you need to:

  * **Validate a recommendation** before routing all production traffic to the optimized configuration.

  * **Compare two model versions** (for example, moving from one foundation model to another) on live traffic with statistical rigor.

  * **Measure the impact of a prompt change** across real user sessions rather than a curated test set.

  * **Gradually roll out a new capability** (new tools, updated system prompt) by validating it on a subset of live traffic before full deployment.


## How it works

An A/B test follows this flow:

  1. **You initiate an A/B test** with `agentcore run ab-test`, specifying an already-deployed AgentCore Gateway, two variants (control and treatment), traffic weights, and online evaluation configuration(s) for scoring. (The execution role is optional — pass `--role-arn` to bring your own, or let the CLI create one.) Each variant references either an AgentCore Gateway target or a configuration bundle version. The test starts RUNNING as soon as the command returns (use `--disable-on-create` to start it stopped).

  2. **The AgentCore Gateway splits traffic.** Once the test is running, the gateway splits incoming traffic between the two variants based on the runtime session ID. Assignment is sticky; a given session ID always routes to the same variant.

  3. **Online evaluation scores each session.** The online evaluation configuration you specified runs evaluators against each session as it completes. The A/B test aggregation pipeline maps scores to variants.

  4. **The service computes statistical significance.** As sample sizes grow, the service calculates per-evaluator metrics for each variant: mean score, absolute and percent change, p-value, confidence interval, and a significance flag. A p-value below 0.05 indicates the difference is statistically significant. Poll results with `agentcore view ab-test <id>` at any time without affecting statistical validity.

  5. **You promote the treatment variant.** When results are significant, run `agentcore promote ab-test -i <id>` to stop the test and write the treatment variant into `agentcore.json`, then `agentcore deploy` to roll it out. (You can also `agentcore stop ab-test -i <id>` without promoting.)


## A/B test patterns

A/B tests support two variant configuration patterns:

###### Target-based variants

Use when the change includes code changes, a framework upgrade, or when you want to compare entirely different agent implementations. Each variant routes to a different AgentCore Gateway target pointing to a different runtime endpoint.

###### Configuration bundle variants

Use when the change is purely configuration (system prompt, model ID, or tool descriptions). Both variants run on the same AgentCore Runtime with different configuration bundle versions. The AgentCore Gateway injects the bundle reference into each request via W3C baggage headers, which the runtime can use to pull the configurations using the AgentCore SDK.

###### Choosing a pattern

Aspect | Target-based variants | Configuration bundle variants  
---|---|---  
What varies |  Entire runtime endpoint (code, framework, model) |  System prompt, tool descriptions, model parameters  
Routing |  Different targets per variant |  Same target, different config bundles  
Evaluation config |  One online eval config per AgentCore Runtime |  Single shared online eval config  
When to use |  Code changes, framework upgrades, comparing different agents |  Configuration-only changes on a single AgentCore Runtime  
  
###### Topics



