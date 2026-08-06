# Redrive failed ingestions - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/long-term-redrive.html

---

# Redrive failed ingestions

Extraction from short-term memory to long-term memory is usually automatic. If extraction from short-term memory to long-term memory is unsuccessful for any reason, AgentCore Memory attempts to address the issue. If issues persist, developer intervention may be needed and the failed jobs are moved to a dedicated queue for your memory resource. One example is if your account is ingesting to long-term memory at a greater rate than what is allowed. In this case, you should wait until traffic is lower and manually redrive the impacted jobs.

You can call `ListMemoryExtractionJobs` to see any failed jobs and look at the failure reason code to see the reason for the failure. Call `StartMemoryExtractionJobs` to re-ingest the job into long-term memory. We recommend monitoring the vended metric `FailedExtraction` to be notified of any issues. This metric also has dimensions on StrategyId, Resource (the memory ARN), and StrategyType. AgentCore Memory emits a count of this metric whenever a extraction job fails and is written to the extraction jobs storage.

For built-in strategies, the only failure scenario is hitting the ingestion limit. For built-in with override, there are additional failure scenarios, including issues with the model you’ve selected to use in your account or the permissions you’ve granted to AgentCore Memory.

Failure Reason Code | Description | Recommended mitigation  
---|---|---  
`LTM_RATE_EXCEEDED` |  This account has exceeded the allocated tokens per minute quota for long-term memory processing |  Through Service Quotas, request a higher limit for the Bedrock Agentcore quota "Tokens per minute for long-term memory extraction". Then invoke the StartMemoryExtractionJob API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_ACCESS_DENIED` |  The memoryExecutionRoleArn provided during CreateMemory lacks adequate permissions to invoke all of the model IDs provided in the custom strategies attached to the memory |  Ensure that the role has the permissions and trust policy as defined here and add any missing permissions. Or call UpdateMemory to switch to a different role with adequate permissions. Then invoke the StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_INTERNAL_ERROR` |  The service received an internal error from Bedrock when attempting to invoke the model provided in the custom strategy. |  This could be a temporary service error from Bedrock. Try again later by invoking the StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_THROTTLING` |  The service received a throttling exception from Bedrock when attempting to invoke the model provided in the custom strategy. |  Ensure that your account has requested adequate TPM and RPM quota for that model from Bedrock. Invoke the StartMemoryExtractionJobs API on the failed extraction’s jobID after quota increase or during low-traffic hours.  
`CUSTOM_MODEL_BEDROCK_MODEL_ERROR` |  The service received a Model Error Exception from Bedrock when attempting to invoke the model provided in the custom strategy. |  This is usually a temporary service error from Bedrock. Try again later by invoking the StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_MODEL_TIMEOUT` |  The service received a Model Timeout Exception from Bedrock when attempting to invoke the model provided in the custom strategy. |  This occurs when the model processing time exceeds its timeout. Consider switching to a faster model before invoking StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_RESOURCE_NOT_FOUND` |  The service received a Resource Not Found from Bedrock when attempting to invoke the model provided in the custom strategy. |  Ensure that the modelID provided in any custom strategies associated with the memory is correct. Call UpdateMemory to update those values if necessary. Then invoke the StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_MODEL_NOT_READY` |  The service received a Model Not Ready from Bedrock when attempting to invoke the model provided in the custom strategy. |  Wait for the model to be in a ready state. Refer to Bedrock documentation for more details. Then invoke the StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_SERVICE_UNAVAILABLE` |  The service received Service Unavailable from Bedrock when attempting to invoke the model provided in the custom strategy. |  This is usually a temporary service error from Bedrock. Try again later by invoking the StartMemoryExtractionJobs API on the failed extraction’s jobID.  
`CUSTOM_MODEL_BEDROCK_VALIDATION_EXCEPTION` |  The service received Validation Exception from Bedrock when attempting to invoke the model provided in the custom strategy. |  Ensure that the modelID provided in any custom strategies associated with the memory is correct. Call UpdateMemory to update those values if necessary. Then invoke the StartMemoryExtractionJobs API on the failed extraction’s jobID.

