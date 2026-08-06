# Using interceptors with Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html

---

# Using interceptors with Gateway

Configuring interceptors on your gateway allows you to run custom code during each invocation of your gateway. This section provides guidance on implementing and configuring interceptors for your Gateway.

###### Topics

  * Overview

  * Security best practices

  * [Permissions for interceptors](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-interceptors-permissions.html>)

  * [Types of interceptors](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-interceptors-types.html>)

  * [Configuration](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-interceptors-configuration.html>)

  * [Examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-interceptors-examples.html>)


## Overview

Configuring interceptors on your gateway allows you to run custom code during each invocation of your gateway. This is useful for the following use cases:

  * Implementing fine-grained access control over tools or MCP operations

  * Transforming the target request and gateway response

  * Implementing custom authorization logic


There are two types of interceptors that can be configured on your gateway:

  * **REQUEST interceptors** – Execute before the gateway makes a call to the target. These are useful for request validation, transformation, or custom authorization.

  * **RESPONSE interceptors** – Execute after the target responds but before the gateway sends the response back to the caller. These are useful for response transformation, filtering, or adding custom headers.


A gateway can have at most one REQUEST interceptor and at most one RESPONSE interceptor configured. You can configure both types on the same gateway, but you cannot have multiple interceptors of the same type.

Currently, interceptors can only be configured with Lambda functions.

## Security best practices

When implementing interceptors, it’s important to follow security best practices to protect sensitive information and maintain proper access control.

  1. By default, request headers will not be passed to an interceptor unless the `passRequestHeaders` field is set to true. Be careful when using this field as request headers can contain sensitive information such as authentication tokens and credentials. Be sure to verify your interceptor is not logging this sensitive information.

  2. Be sure to restrict your gateway execution role to have permissions only to invoke the specific lambda functions you are using as interceptors and not to give wild card lambda permissions to your execution role.

  3. Implement idempotent Lambda functions for your interceptors. The gateway may retry requests to interceptor Lambda functions in case of failures or timeouts. Ensure your interceptor logic can handle duplicate invocations safely by implementing idempotency keys, tracking processed requests, or designing stateless operations that produce consistent results when executed multiple times with the same input.



