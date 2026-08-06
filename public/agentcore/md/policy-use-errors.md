# Errors - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-use-errors.html

---

# Errors

Policy in AgentCore operations can return the following types of errors:

AuthorizationError
    

The policy engine denied the request.

HTTP Status Code: 403

AccessDeniedException
    

You don’t have permission to perform this operation.

HTTP Status Code: 403

ConflictException
    

The request conflicts with the current state of the resource (e.g., policy name already exists).

HTTP Status Code: 409

InternalServerException
    

An internal server error occurred.

HTTP Status Code: 500

ResourceNotFoundException
    

The specified policy or policy engine does not exist.

HTTP Status Code: 404

ServiceQuotaExceededException
    

You have exceeded the service quota for policies or policy engines.

HTTP Status Code: 402

ThrottlingException
    

The request was throttled due to too many requests.

HTTP Status Code: 429

ValidationException
    

The request contains invalid parameters or the policy statement contains syntax errors.

HTTP Status Code: 400

