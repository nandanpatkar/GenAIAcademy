# Supported language runtimes and deprecation policy - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-code-deploy-supported-runtimes.html

---

# Supported language runtimes and deprecation policy

The following table lists the supported AgentCore Runtime direct code deploy language runtimes and projected deprecation dates. After a language environment is deprecated, you’re still able to create and update runtimes for a limited period. The table provides the currently forecasted dates for runtime deprecation, based on the [Runtime deprecation policy](<https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtime-support-policy>) . These dates are provided for planning purposes and are subject to change.

## Supported Python runtimes

# | Name | Identifier | Operating system | Deprecation date | Block runtime update  
---|---|---|---|---|---  
1 |  Python 3.14 |  `PYTHON_3_14` |  Amazon Linux 2023 |  6/30/2030 |  8/31/2030  
2 |  Python 3.13 |  `PYTHON_3_13` |  Amazon Linux 2023 |  6/30/2029 |  8/31/2029  
3 |  Python 3.12 |  `PYTHON_3_12` |  Amazon Linux 2023 |  10/31/2028 |  1/10/2029  
4 |  Python 3.11 |  `PYTHON_3_11` |  Amazon Linux 2023 |  6/30/2026 |  8/31/2026  
5 |  Python 3.10 |  `PYTHON_3_10` |  Amazon Linux 2023 |  6/30/2026 |  8/31/2026  
  
## Supported Node.js runtimes

# | Name | Identifier | Operating system | Deprecation date | Block runtime update  
---|---|---|---|---|---  
1 |  Node.js 22 |  `NODE_22` |  Amazon Linux 2023 |  4/30/2027 |  7/1/2027  
  
## Language environment deprecation policy

AgentCore Runtime direct code deploy for .zip file archives are built around a combination of operating system, programming language, and software libraries that are subject to maintenance and security updates. AgentCore Runtime standard deprecation policy is to deprecate a language runtime when any major component of the runtime reaches the end of community long-term support (LTS) and security updates are no longer available. Most usually, this is the language runtime, though in some cases, a runtime can be deprecated because the operating system (OS) reaches end of LTS.

After a runtime is deprecated, AWS may no longer apply security patches or updates to that runtime, and runtimes are no longer eligible for technical support. Such deprecated runtimes are provided 'as-is', without any warranties, and may contain bugs, errors, defects, or other vulnerabilities.

###### Important

AgentCore Runtime occasionally delays deprecation of a AgentCore Runtime direct code deploy programming language runtime for a limited period beyond the end of support date of the language version that the runtime supports. During this period, AgentCore Runtime only applies security patches to the runtime OS. AgentCore Runtime doesn’t apply security patches to programming language runtimes after they reach their end of support date.

