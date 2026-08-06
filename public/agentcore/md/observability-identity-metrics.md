# AgentCore generated identity observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-identity-metrics.html

---

# AgentCore generated identity observability data  
  
This document described observability data emitted by the Bedrock AgentCore Identity Service. This data provides visibility into the performance, usage, and operational health of the service, allowing your to monitor authorization activities for your AI agents and workloads.

You can use the identity observability data described in this section in the following ways:

  * Monitor usage: track API call volume and throttling events across workload identities and credential providers

  * Track inbound authorization: monitor success/failure rates for workload access token operations

  * Analyze Resource Access Patterns: gain insights into OAuth2 providers and API key usage patterns by provider type and flow

  * Troubleshoot issues: identify and diagnose errors by type, operation, and resource

  * Capacity planning: use metrics to understand usage patterns and plan for scaling


These metrics can be viewed in the Amazon CloudWatch console, retrieved via the Amazon CloudWatch API, or incorporated into Amazon CloudWatch dashboards and alarms for proactive monitoring.

###### Topics

  * Usage, authorization, and resource access metrics

  * Provided span data

  * Provided log data


## Usage, authorization, and resource access metrics

The following dimensions reference applies to the metrics described in this section:

  * WorkloadIdentity: the workload identity name making the request.

  * WorkloadIdentityDirectory: the directory containing the workload identity (typically `default` ).

  * TokenVault: the token vault being accessed (typically `default` ).

  * ProviderName: the name of the credential provider (for example, `MyGoogleProvider` , `MySlackProvider` ).

  * FlowType: the OAuth2 flow type (USER_FEDERATION, M2M).

  * ExceptionType: the specific error type (ValidationException, ThrottlingException, etc.)


### Usage metrics

These metrics are emitted in the AWS/Usage namespace and track service usage at the AWS account level.

Metric name | Dimensions | Description  
---|---|---  
CallCount |  Service, Type, Class, Resource |  Tracks the number of calls made to Identity Service operations. This can be used for service quotas.  
ThrottleCount |  Service, Type, Class, Resource |  Tracks the number of throttled calls for Identity Service operations.  
  
### Authorization metrics

These metrics are emitted in the AWS/Bedrock-AgentCore namespace and provide insights into authentication and authorization operations.

Metric name | Dimensions | Description  
---|---|---  
WorkloadAccessTokenFetchSuccess |  WorkloadIdentity, WorkloadIdentityDirectory, Operation |  Tracks successful workload access token fetch operations.  
WorkloadAccessTokenFetchFailures |  WorkloadIdentity, WorkloadIdentityDirectory, Operation, ExceptionType |  Tracks failed workload access token fetch operations by exception type.  
WorkloadAccessTokenFetchThrottles |  WorkloadIdentity, WorkloadIdentityDirectory, Operation |  Tracks throttled workload access token fetch operations.  
  
### Resource access metrics

These metrics track credential provider operations for accessing external resources.

Metric name | Dimensions | Description  
---|---|---  
ResourceAccessTokenFetchSuccess |  WorkloadIdentity, WorkloadIdentityDirectory, TokenVault, ProviderName, Type |  Tracks successful OAuth2 token fetch operations from credential providers.  
ResourceAccessTokenFetchFailures |  WorkloadIdentity, WorkloadIdentityDirectory, TokenVault, ProviderName, Type, ExceptionType |  Tracks failed OAuth2 token fetch operations by exception type.  
ResourceAccessTokenFetchThrottles |  WorkloadIdentity, WorkloadIdentityDirectory, TokenVault, ProviderName, Type |  Tracks throttled OAuth2 token fetch operations.  
ApiKeyFetchSuccess |  WorkloadIdentity, WorkloadIdentityDirectory, TokenVault, ProviderName |  Tracks successful API key fetch operations.  
ApiKeyFetchFailures |  WorkloadIdentity, WorkloadIdentityDirectory, TokenVault, ProviderName, ExceptionType |  Tracks failed API key fetch operations by exception type.  
ApiKeyFetchThrottles |  WorkloadIdentity, WorkloadIdentityDirectory, TokenVault, ProviderName |  Tracks throttled API key fetch operations.  
  
## Provided span data

To enhance observability, AgentCore Identity provides structured spans that give visibility into identity service operations. To enable span data, you need to enable observability on your workload identity or credential provider resource.

This span data is available in Amazon CloudWatch Logs aws/spans log group. The following table defines operations for which spans are created and their attributes.

The following attribute explanations apply to the information in the tables below:

  * aws.operation.name - the operation name being performed

  * aws.resource.arn - the Amazon Resource Name for the identity resource

  * aws.request_id - unique request ID for the operation

  * aws.account.id - user’s AWS account ID

  * workload.identity.id - the workload identity name

  * workload.identity.directory - the workload identity directory

  * credential.provider.name - name of the credential provider

  * credential.provider.type - type of credential provider (OAuth2, API Key)

  * token.vault.name - token vault name

  * oauth2.flow - OAuth2 flow type (USER_FEDERATION, M2M)

  * latency_ms - operation latency in milliseconds

  * error_type - error classification (throttle, system, user, null if successful)

  * aws.region - AWS region where the operation occurred


**Workload Identity Operations**

Operation | Span attributes | Description  
---|---|---  
GetWorkloadAccessToken |  aws.operation.name, aws.resource.arn, aws.request_id, aws.account.id, workload.identity.id, workload.identity.directory, aws.region, latency_ms, error_type |  Fetches workload access token for machine-to-machine authentication  
GetWorkloadAccessTokenForJWT |  aws.operation.name, aws.resource.arn, aws.request_id, aws.account.id, workload.identity.id, workload.identity.directory, issuer, user_sub, aws.region, latency_ms, error_type |  Fetches workload access token using JWT user token  
GetWorkloadAccessTokenForUserId |  aws.operation.name, aws.resource.arn, aws.request_id, aws.account.id, workload.identity.id, workload.identity.directory, aws.region, latency_ms, error_type |  Fetches workload access token for specific user ID  
  
**Credential Provider Operations**

Operation | Span attributes | Description  
---|---|---  
GetResourceOAuth2Token |  aws.operation.name, aws.resource.arn, aws.request_id, aws.account.id, workload.identity.id, credential.provider.name, credential.provider.type, token.vault.name, oauth2.flow, aws.region, latency_ms, error_type |  Fetches OAuth2 access token from credential provider  
GetResourceAPIKey |  aws.operation.name, aws.resource.arn, aws.request_id, aws.account.id, workload.identity.id, credential.provider.name, token.vault.name, aws.region, latency_ms, error_type |  Fetches API key from credential provider  
  
## Provided log data

AgentCore Identity provides structured application logs that help you gain visibility into identity service operations. This log data is provided when enabling observability on your identity resources.

AgentCore can output logs to Amazon CloudWatch Logs, Amazon S3, or Amazon Kinesis Firehose stream. If you use a CloudWatch Logs destination, these logs are stored under your resource’s application logs or under your own custom log group.

Log type | Log fields | Description  
---|---|---  
Application Logs |  timestamp, resource_arn, event_timestamp, account_id, request_id, trace_id, span_id, service_name, operation, request_payload, response_payload |  Application logs for Identity Service operations with tracing fields, request, and response payloads  
  
Log field explanations:

  * timestamp - Unix timestamp of the log event

  * resource_arn - ARN of the identity resource

  * event_timestamp - ISO 8601 timestamp string

  * account_id - AWS account ID

  * request_id - unique request identifier

  * trace_id - distributed tracing ID

  * span_id - span identifier for the operation

  * service_name - service name (BedrockAgentCore.Identity)

  * operation - pperation name (GetWorkloadAccessToken, etc.)

  * request_payload - request payload

  * response_payload - response payload



