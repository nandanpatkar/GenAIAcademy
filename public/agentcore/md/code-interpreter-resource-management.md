# Resource management - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-management.html

---

# Resource management

The AgentCore Code Interpreter provides two types of resources:

System ARNs
    

System ARNs are default resources pre-created for ease of use. These ARNs have default configuration with the most restrictive options and are available for all regions where Amazon Bedrock AgentCore is available.

Field | Value  
---|---  
ID |  aws.codeinterpreter.v1  
ARN |  arn:aws:bedrock-agentcore:<region>:aws:code-interpreter/aws.codeinterpreter.v1  
Name |  Amazon Bedrock AgentCore Code Interpreter  
Description |  AWS built-in code interpreter for secure code execution  
Status |  READY  
  
Custom ARNs
    

Custom ARNs allow you to configure a code interpreter with your own settings. You can choose network settings (Sandbox or Public), and the execution role that defines what AWS resources the code interpreter can access.

###### Topics

  * Network settings

  * [Creating an AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-create.html>)

  * [Listing AgentCore Code Interpreter tools](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-list.html>)

  * [Deleting an AgentCore Code Interpreter](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./code-interpreter-delete.html>)


## Network settings

The AgentCore Code Interpreter supports the following network modes:

Sandbox mode
    

Provides limited external network access to AWS services. In Sandbox mode, the code interpreter can access Amazon S3 for data operations.

Public network mode
    

Allows the tool to access public internet resources. This option enables integration with external APIs and services but introduces potential security considerations.

VPC mode
    

Connects the tool to your Virtual Private Cloud (VPC), allowing access to private resources within your AWS environment such as databases, internal APIs, and other services while maintaining network isolation from the public internet. This option requires additional VPC configuration.

The following topics show you how to create and manage Code Interpreters, start and stop sessions, and how to execute code.

