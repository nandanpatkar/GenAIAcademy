# Example use cases - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-use-cases.html

---

# Example use cases  
  
Amazon Bedrock AgentCore Identity supports a wide range of use cases across different industries and application types. This section provides detailed examples of how the service can be applied in specific scenarios, demonstrating both user-delegated access (OAuth 2.0 authorization code grant) and machine-to-machine authentication (OAuth 2.0 client credentials grant) patterns.

###### Topics

  * Personal assistant agents

  * Enterprise automation agents

  * Customer service agents

  * Data processing and analytics agents

  * Development and DevOps agents


## Personal assistant agents

AI agents that help users manage their personal productivity by accessing services like Google Drive, Microsoft Office 365, or Slack represent one of the most common and valuable applications of AgentCore Identity. These agents use OAuth 2.0 authorization code grant to obtain explicit user consent (3Lo) and access user data securely across multiple systems. For example, a research agent might search the web using AgentCore Browser, generate a comprehensive report, and save it to the user’s Google Drive, all while maintaining proper authentication and authorization throughout the entire workflow.

The complexity of managing credentials across multiple third-party services makes AgentCore Identity particularly valuable for personal assistant scenarios. Consider a meeting agent that needs to access a user’s Google Calendar to check availability, join a Zoom meeting to take notes, schedule follow-up meetings, and draft emails for approval. Each of these services requires different authentication mechanisms and user consent, but AgentCore Identity orchestrates the entire process seamlessly while the agent maintains its own identity and the user retains control over what data is accessed.

Personal assistant agents also benefit from AgentCore Identity’s token storage and secure credential management, which eliminate the need for users to repeatedly authorize access to their accounts. Once a user has granted permission for an agent to access their Google Drive, for instance, the agent can continue to access that service for subsequent tasks without requiring re-authorization, as long as the stored tokens remain valid. This creates a smooth user experience while maintaining security through proper token management.

## Enterprise automation agents

Agents that automate business processes by integrating with enterprise systems like Salesforce, SharePoint, or internal APIs represent a critical use case for organizations seeking to improve operational efficiency. These agents typically use OAuth 2.0 client credentials grant for machine-to-machine authentication (2Lo) when accessing systems that don’t require user interaction, and may require access to multiple systems with different authentication requirements. For example, an HR automation agent might need to access employee data from an HRIS system, update records in Salesforce, and generate reports in SharePoint, each requiring different credentials and authorization scopes.

Enterprise automation scenarios often involve complex workflows that span multiple trust domains and require careful identity propagation to maintain security and compliance. AgentCore Identity addresses this challenge by providing a centralized approach to credential management that works across different enterprise systems. The service supports both AWS-hosted resources with IAM-based authentication and external enterprise systems with OAuth 2.0 or API key authentication, enabling agents to operate seamlessly across hybrid environments while helping to maintain consistent security standards.

The audit and compliance capabilities of AgentCore Identity are particularly important for enterprise automation use cases, where organizations need to maintain detailed records of automated actions for regulatory compliance and security monitoring. Every action performed by an enterprise automation agent is logged with both the agent identity and any associated user context, providing complete traceability of automated business processes. This level of visibility helps with compliance requirements and enables organizations to quickly identify and respond to any unauthorized or unexpected agent behavior.

## Customer service agents

AI agents that assist customer service representatives by accessing customer data from CRM systems, knowledge bases, and support ticketing systems must authenticate securely while providing real-time assistance during customer interactions. These agents need to access sensitive customer information from multiple sources while maintaining strict security controls and audit trails. For example, a customer service agent might need to access a customer’s order history from an e-commerce platform, check their support ticket status in a ticketing system, and retrieve relevant troubleshooting information from a knowledge base, all while the customer is on the phone.

The real-time nature of customer service interactions makes credential management particularly challenging, as agents cannot afford delays caused by authentication failures or expired tokens. AgentCore Identity addresses this challenge through its comprehensive error handling, ensuring that customer service agents can access the information they need without interruption. The service also supports fine-grained access controls that can be configured to have agents only access customer data that is relevant to the specific interaction, supporting privacy requirements and regulatory compliance.

## Data processing and analytics agents

Agents that collect, process, and analyze data from multiple sources, including cloud storage services, databases, and APIs, often require long-running access to data sources. These agents typically operate on scheduled or triggered workflows that may run for hours or days, accessing large datasets from various sources to perform complex analytics operations. For example, a financial analytics agent might collect transaction data from multiple payment processors, combine it with customer data from CRM systems, and generate comprehensive reports that are stored in data warehouses and shared with business stakeholders.

The long-running nature of data processing workflows makes credential management particularly complex, as tokens may expire during processing and agents need to handle authentication failures gracefully without losing progress on lengthy operations. AgentCore Identity addresses these challenges through its robust error handling, helping data processing agents maintain access to required resources throughout their entire execution lifecycle. The service also supports batch processing scenarios where agents need to access multiple data sources simultaneously, providing efficient credential management that scales with the complexity of the data processing workflow.

Data processing and analytics use cases also benefit from AgentCore Identity’s support for different authentication mechanisms across various data sources. A single analytics workflow might need to access data from AWS services using IAM credentials, third-party APIs using OAuth 2.0 tokens, and on-premise databases using API keys or other authentication methods. AgentCore Identity provides a unified interface for managing all these different credential types, enabling data processing agents to focus on their core analytics functions rather than the complexity of credential management across diverse systems.

## Development and DevOps agents

Agents that automate software development workflows by integrating with version control systems, CI/CD pipelines, and deployment systems require secure access to development tools and infrastructure while maintaining comprehensive audit trails for compliance purposes. These agents might automatically create pull requests, trigger builds, deploy applications, and update documentation across multiple development tools and systems. For example, a DevOps agent might monitor application performance, detect issues, automatically create bug reports in JIRA, generate fixes through code analysis, and deploy patches through CI/CD pipelines, all while maintaining proper authentication and authorization throughout the entire workflow.

Development and DevOps scenarios present unique security challenges because agents often need elevated privileges to perform deployment and infrastructure management tasks, while also needing to maintain strict controls to prevent unauthorized changes to production systems. AgentCore Identity addresses these challenges through its fine-grained access control capabilities and comprehensive audit logging, ensuring that DevOps agents can perform necessary automation tasks while supporting security and compliance. The service supports role-based access controls that can be configured to limit agent access to specific environments, repositories, or deployment targets based on the agent’s identity and the context of the operation.

The audit and compliance capabilities of AgentCore Identity are particularly valuable for development and DevOps use cases, where organizations need to maintain detailed records of all changes to code, infrastructure, and deployment configurations. Every action performed by a DevOps agent is logged with complete context, including the agent identity, the specific resources accessed, and the changes made, providing the level of traceability that supports regulatory compliance and security auditing. This comprehensive logging also enables organizations to quickly identify the root cause of issues and roll back changes when necessary, supporting the reliability and stability of development and deployment processes.

