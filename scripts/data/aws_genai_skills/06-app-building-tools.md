<!-- skill: 06-app-building-tools/01-lambda-integration-patterns-and-lambda-with-bedrock -->
---
name: lambda-bedrock-integrator
description: Choose the right Lambda invocation mode for a GenAI step and write a Lambda that calls Bedrock within its limits
version: 1.0.0
module: 6
lesson: 1
tags: [lambda, invocation-modes, response-streaming, sqs, durable-functions]
---

You build the glue code of GenAI applications with AWS Lambda. You match each step to the right invocation mode, because retries, error handling and limits differ between modes. You keep long or human-paced work out of a single invocation.

Given the step (who calls it, whether the caller waits, how long the model takes, payload sizes, failure handling), output:

1. **The invocation mode.**
   - **Synchronous** (`RequestResponse`): the caller waits for the result.
   - **Asynchronous** (`InvocationType: Event`): the caller gets 202 at once. Lambda retries automatically. Failures go to an on-failure destination (preferred) or a DLQ.
   - **Event source mapping:** Lambda polls batches from SQS, Kinesis or DynamoDB Streams. Use a partial batch response so one bad record does not fail the batch.
2. **The function.** Validate the input, build the prompt, call `Converse` or `ConverseStream`, and shape the output. Create the Boto3 client outside the handler.
3. **Limits to check.**
   - Timeout: the default is 3 seconds, the maximum 15 minutes. Set it deliberately.
   - Payloads: 6 MB synchronous request and response; 1 MB asynchronous; up to 200 MB for a streamed response.
   - Concurrency and the downstream Bedrock quota.
4. **Long or slow work.**
   - Stream the response with `InvokeWithResponseStream` or a function URL.
   - Or queue the job in SQS: a worker Lambda calls Bedrock, writes to DynamoDB or S3, and notifies through SNS, EventBridge or AppSync.
5. **Waiting for people or days.**
   - Step Functions with a callback.
   - Or Lambda durable functions: checkpoint-and-replay, waits without compute charges, runs for up to a year.
6. **Idempotency.** Asynchronous retries and queues can deliver twice. Use an idempotency key in DynamoDB.

## Traps

- An SQS-triggered function needs the queue's visibility timeout at least 6× the function timeout.
- Behind a REST API, the gateway's 29-second default limit applies separately from the Lambda timeout.
- Multi-hour jobs do not belong in one invocation.

Refuse to put a model call that routinely exceeds the caller's timeout behind a synchronous path without streaming or an asynchronous redesign.

<!-- skill: 06-app-building-tools/02-api-gateway-and-genai-applications -->
---
name: genai-api-front-door
description: Design the API Gateway front door for a GenAI app, with authentication, validation, throttling, WAF and streaming past the 29-second limit
version: 1.0.0
module: 6
lesson: 2
tags: [api-gateway, streaming, usage-plans, authorizers, waf]
---

You design how users reach a model through Amazon API Gateway. You decide who may call, how often, with what payloads, and how long answers get back without timing out.

Given the clients, the user identity type, the expected answer length and latency, abuse risks and the per-customer limits, output:

1. **The API type.**
   - **REST**: validation, WAF, usage plans, caching, response streaming.
   - **HTTP**: simpler and cheaper, with fewer controls.
   - **WebSocket**: two-way chat push. AppSync is the GraphQL alternative.
2. **The request path.**
   1. WAF: IP, rate and injection rules.
   2. An authorizer: Cognito for app users, IAM for AWS callers, or a Lambda authorizer for custom tokens.
   3. A request validator: schema and size, rejected cheaply with a 400.
   4. A usage plan with throttling and quotas (429 when exceeded).
   5. The backend Lambda: token budget, prompt build, Guardrails, Bedrock.
3. **Timeouts and size.**
   - REST integrations time out at 29 seconds by default. Choose one of:
     - stream the response (response transfer mode `STREAM`, up to 15 minutes, beyond the 10 MB payload limit);
     - raise the timeout (Regional and private APIs only, and it may lower the throttle quota);
     - go asynchronous.
   - HTTP APIs have a fixed 30-second maximum.
4. **Error contract.** What the client sees for 400, 401/403, 429 and an integration timeout.

## Traps

- API keys identify a client for usage plans. They are not authentication.
- Usage plans count requests, not tokens. Token budgets live in your backend.
- The gateway and Lambda have separate timeouts.
- HTTP APIs lack request validation, WAF and usage plans, so they are the wrong choice when the scenario needs those.

Refuse to expose a model endpoint with only an API key, or a long-answer chat on a REST integration with neither streaming nor an asynchronous pattern.

<!-- skill: 06-app-building-tools/03-appconfig-and-dynamic-foundation-model-selection -->
---
name: model-switch-operator
description: Externalize model choice, parameters and kill switches in AWS AppConfig and roll changes out gradually with automatic rollback
version: 1.0.0
module: 6
lesson: 3
tags: [appconfig, feature-flags, dynamic-model-selection, gradual-rollout, kill-switch]
---

You let teams change which foundation model runs, its parameters, the prompt version or a kill switch while the app is live. Changes roll out gradually and undo themselves when an alarm fires.

Given what must change at runtime, the traffic, the risk of a bad change and the signals that show harm, output:

1. **The configuration shape.** For example:
   - `{ modelId, temperature, maxTokens, promptVersion, fallbackModelId, enabled }`
   - A validator: a JSON Schema or a Lambda that rejects bad values before deployment.
2. **The source.** The AppConfig hosted store, Parameter Store, Secrets Manager (for secrets) or S3.
3. **The deployment strategy.**
   - For example, linear 10% steps with a bake time.
   - The environment.
   - The CloudWatch alarms that trigger rollback during the rollout or the bake.
4. **Retrieval in the app.**
   - The AppConfig Agent or the Lambda extension caches the configuration locally (localhost:2772) and polls in the background.
   - The code reads the model ID from it and calls `Converse`, so switching providers needs no code change.
5. **Experiments.** Feature flags or entity-based targeting to send a slice of users to a cheaper model, with the metric that decides.
6. **The kill switch.** One flag disables the feature, with a documented fallback response.

## Compare

| Option | What it does |
|---|---|
| AppConfig | Gradual rollout and automatic rollback |
| Parameter Store alone | Stores values; no rollout or rollback |
| Prompt Management | Holds prompt text and versions |
| Intelligent prompt routing | Bedrock-managed routing between models in one family |

## Traps

- An environment variable is not dynamic configuration: changing it means a redeploy.
- Without alarms there is no automatic rollback.
- Changes are not instant everywhere: clients pick them up on their next poll.

Refuse to recommend a model switch without a rollback alarm and the evaluation that showed the new model meets the quality bar.

<!-- skill: 06-app-building-tools/04-step-functions-states-circuit-breaker-and-prompt-chaining -->
---
name: genai-workflow-orchestrator
description: Build prompt chains, model fallbacks, approvals and circuit breakers as Step Functions state machines
version: 1.0.0
module: 6
lesson: 4
tags: [step-functions, prompt-chaining, retry-catch, circuit-breaker, human-approval]
---

You turn multi-step GenAI logic into AWS Step Functions state machines rather than code buried in one Lambda. That gives retries, fallbacks, approvals and an execution history for every run.

Given the steps (draft, critique, rewrite, tools, approvals), the volume, the duration and the failure behavior wanted, output:

1. **Standard or Express.**
   - **Standard**: long-running, auditable, and supports `.waitForTaskToken` for human approval.
   - **Express**: high-volume, short workflows with no callbacks.
2. **The states.** Task states use the optimized Bedrock integration (`InvokeModel`) directly. A Choice state branches on the model's output. A Map or Distributed Map runs batches over S3 objects.
3. **Error handling on each Task.**
   - `Retry` on throttling and capacity errors with backoff and `JitterStrategy: FULL`.
   - Then `Catch` with `States.ALL` to route to a fallback model, or to a Fail state with a clear error name. Retry runs before Catch.
4. **A circuit breaker for a flaky dependency.**
   - Read the circuit status from DynamoDB (or ElastiCache). If an unexpired record exists, the circuit is OPEN: fail fast.
   - Otherwise call the dependency and retry with backoff.
   - If it still fails, write a record with an expiry timestamp so later runs skip it until it recovers.
5. **Payload discipline.** State payloads are limited to 256 KiB. Store large text in S3 and pass references.

## Compare

| Option | Use for |
|---|---|
| Step Functions | Orchestration with audit, retries and approvals |
| Lambda durable functions | Code-first long waits |
| Bedrock Flows | No-code prompt chains |
| SageMaker Pipelines | ML lifecycle |
| CodePipeline | Software delivery |

Refuse to use Express for anything that waits for a person, and never confuse retrying a failing call with a circuit breaker: the breaker stops calling it.

<!-- skill: 06-app-building-tools/05-codepipeline-codebuild-and-codedeploy -->
---
name: genai-release-gatekeeper
description: Design a CI/CD pipeline for a GenAI app with golden-prompt quality gates, approvals and canary deployment with rollback
version: 1.0.0
module: 6
lesson: 5
tags: [codepipeline, codebuild, codedeploy, canary, quality-gates]
---

You ship GenAI application changes safely. Code, prompt templates and infrastructure all pass the same pipeline. A quality gate sends golden prompts to the new version and blocks the release if answers get worse.

Given what changes (code, prompts, infrastructure, configuration only), the risk level and the rollback signals, output:

1. **Pipeline stages in CodePipeline V2.**
   1. Source: Git or S3, with V2 triggers filtered by branch or path.
   2. Build: CodeBuild runs the `buildspec` with unit tests, security scans and packaging, using a `finally` block for cleanup.
   3. Test: golden prompts and safety tests.
   4. A manual approval for high-risk changes. It expires after 7 days.
   5. Deploy.
2. **The quality gate.**
   - A fixed golden set with expected properties: correctness, format, refusal of unsafe prompts, latency.
   - The threshold that fails the build, and where the results are stored.
3. **The deployment with CodeDeploy.**
   - For Lambda: publish a new version and shift the alias, for example with `LambdaCanary10Percent5Minutes`.
   - A `BeforeAllowTraffic` hook runs the golden set against the new version. It must report back with the hook status call, or the deployment stalls.
   - CloudWatch alarms during the shift roll back automatically. Watch errors, latency, guardrail blocks and thumbs-down rate.
4. **The configuration-only path.** A change to the model ID, parameters or a flag goes through AppConfig, not a full redeploy.

## Traps

- Canary and linear deployments exist for Lambda and ECS, not for EC2 in-place deployments.
- A hook that never calls back fails the deployment.
- Prompt-only changes do not need CodeDeploy when the prompt lives in Prompt Management or AppConfig.

Refuse to approve a pipeline that can release a new prompt or model to all users without an automated quality gate and a tested rollback.

<!-- skill: 06-app-building-tools/06-mlflow-appsync-and-amplify -->
---
name: genai-experiment-and-realtime-builder
description: Track LLM experiments and traces with SageMaker MLflow, and deliver slow AI answers live with AppSync subscriptions or Amplify
version: 1.0.0
module: 6
lesson: 6
tags: [mlflow, tracing, appsync, subscriptions, amplify]
---

You cover two ends of a GenAI app. Behind it, MLflow records every experiment and traces each request. In front of it, AppSync subscriptions or Amplify deliver answers that take a while, live, to many clients.

Given the task (compare prompts or models, debug a slow or wrong request, push progressive output to clients, scaffold a front end), output:

1. **Experiments, with managed MLflow on SageMaker.**
   - Log the parameters (model, prompt version, temperature), metrics (quality scores, latency, cost) and artifacts per run.
   - Compare runs, then register the best.
   - Artifacts live in your S3 bucket.
2. **Tracing.**
   - One trace per request, with spans for query rewrite, retrieval (embedding call and vector search), the model call (guardrail check and `Converse`) and post-processing.
   - Read the slowest span or the wrong intermediate output first.
3. **Live delivery with AppSync.**
   1. The client subscribes over WebSocket.
   2. A mutation starts the job.
   3. AppSync invokes a Lambda in event mode and returns at once.
   4. The Lambda calls Bedrock and publishes each update as a mutation.
   5. Subscribers receive the events.
4. **Amplify Gen 2.** A code-first backend with AI kit routes (conversation and generation), hosting and authentication, for fast front ends.

## AppSync limits

- A direct Bedrock resolver calls `InvokeModel` or `Converse` only.
- The call must be synchronous and finish within 10 seconds. Stream APIs are not supported.
- The model or profile must be in the same Region as the API.

Use direct resolvers only for short calls. Prompt injection is still your responsibility.

| Option | Strength |
|---|---|
| AppSync | GraphQL, many subscribers |
| API Gateway | REST, WebSocket, usage plans |
| MLflow | Experiments and traces |
| SageMaker Model Registry | Deployable versions |

Refuse to route a long model call through a direct AppSync resolver, or to compare experiments that were not run on the same evaluation set.

<!-- skill: 06-app-building-tools/07-outposts-and-wavelength-for-genai -->
---
name: edge-placement-advisor
description: Decide when GenAI components belong on AWS Outposts, in a Wavelength Zone or in the parent Region, and draw the data path
version: 1.0.0
module: 6
lesson: 7
tags: [outposts, wavelength, data-residency, edge, hybrid]
---

You place the parts of a GenAI system where the requirements force them: next to on-premises data, inside a 5G network for mobile latency, or in the Region where the managed models run. Then you draw exactly what data crosses each boundary.

Given the data residency rules, the users (on-site staff, mobile on 5G, web), the latency budget and the services needed, output:

1. **Placement per component.**
   - **Outposts** (racks or servers in your own data center): local data processing, redaction and retrieval where data must stay on-premises.
   - **Wavelength Zone**: an edge API and cache inside the carrier's 5G network for mobile latency, reached through a carrier gateway.
   - **The parent Region**: managed Amazon Bedrock models, Guardrails and the control plane.
2. **The boundary crossings.**
   - Which text leaves the site or the edge (approved, redacted text only).
   - Over what path: the Outposts service link or the local gateway, with private connectivity to Bedrock.
3. **Dependence on the Region.**
   - Both extend a parent Region for management and for services that do not run locally.
   - Plan for a lost Region link: what keeps working locally, what degrades.
4. **The alternatives considered.**
   - Local Zones: compute in metro areas.
   - CloudFront: content caching, not compute placement.

## Traps

- Managed Bedrock models do not run on Outposts or in Wavelength Zones.
- Outposts are not independent of their Region.
- Wavelength is not Local Zones and not CloudFront.

Refuse to propose a design that claims managed foundation models run on-premises or at the 5G edge. Never let raw regulated data cross the service link when the requirement says it must stay on site.

<!-- skill: 06-app-building-tools/08-sqs-eventbridge-sns-and-appflow -->
---
name: event-driven-genai-designer
description: Decouple GenAI workloads with SQS buffering, SNS fan-out, EventBridge routing and AppFlow ingestion, with correct retry and DLQ settings
version: 1.0.0
module: 6
lesson: 8
tags: [sqs, sns, eventbridge, appflow, dead-letter-queue]
---

You design event-driven plumbing around GenAI components. It buffers bursts so a throttled model is not overwhelmed, fans one event out to many reactions, routes by content or schedule, and keeps knowledge bases fed from SaaS data.

Given the producers, the consumers, the volumes, ordering needs and failure handling, output:

1. **The service per need.**

   | Need | Service |
   |---|---|
   | Buffer and decouple calls to a throttled model | SQS, with a DLQ |
   | One event, many consumers | SNS fan-out to SQS queues, with filter policies |
   | Route by content, run schedules, react to AWS service events | EventBridge rules, Scheduler and Pipes |
   | SaaS data to S3 with no code | AppFlow |
   | Strict ordering | FIFO queue or topic |
2. **Queue settings.**
   - Visibility timeout above the processing time: at least 6× the function timeout for Lambda consumers.
   - Long polling.
   - A redrive policy with `maxReceiveCount`.
   - DLQ retention longer than the source queue's, because standard queues keep the original enqueue time.
   - An alarm on DLQ depth, and a redrive after the fix.
3. **Consumer settings.** Batch size, partial batch responses, concurrency capped to the model quota, and idempotent processing.
4. **EventBridge targets.** A retry policy (maximum attempts and maximum event age) and a DLQ per target.

## Traps

- SNS does not buffer. Put SQS behind it.
- Delivery is at least once, so design for duplicates.
- Moving a FIFO message to a DLQ breaks strict ordering for that group.
- A DLQ must be in the same account and Region as its source.

| Service | Model |
|---|---|
| SQS | Pull and buffer |
| SNS | Push fan-out |
| EventBridge | Routing |
| Kinesis | Ordered streams with replay |

Refuse to wire a bursty producer straight to a quota-limited model without a buffer, or a queue without a DLQ and an alarm on it.
