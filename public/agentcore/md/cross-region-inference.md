# Cross-region inference in Amazon Bedrock AgentCore Memory, Policy in Amazon Bedrock AgentCore, and AgentCore Evaluations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/cross-region-inference.html

---

# Cross-region inference in Amazon Bedrock AgentCore Memory, Policy in Amazon Bedrock AgentCore, and AgentCore Evaluations

With cross-region inference, Amazon Bedrock AgentCore Memory, Policy in AgentCore, and AgentCore Evaluations will automatically select the optimal region (as described in more detail below) to process your inference request, maximizing available compute resources and model availability, and providing the best customer experience.

For AgentCore Memory, Policy in AgentCore (in select regions), and AgentCore Evaluations, cross-region inference requests are kept within the AWS Regions that are part of the geography where the data originally resides. For example, a request made within the US is kept within the AWS Regions in the US. Although the data remains stored only in the primary region, when using cross-region inference, your input prompts and output results may move outside of your primary region. All data will be transmitted encrypted across Amazon’s secure network. For Policy in AgentCore, inference requests originating in Canada (Central) (ca-central-1) and South America (São Paulo) (sa-east-1) use global cross-region inference and will be securely routed to all available compute resources across all global commercial AWS Regions. For more information, see Global cross-region inference for Policy in AgentCore. For AgentCore Evaluations, inference requests originating in Asia Pacific (Seoul) (ap-northeast-2) use global cross-region inference and will be securely routed to all available compute resources across all global commercial AWS Regions. For more information, see Global cross-region inference for AgentCore Evaluations.

###### Note

There’s no additional cost for using cross-region inference. Amazon CloudWatch and AWS CloudTrail logs won’t specify the AWS Region in which data inference occurs. For AgentCore Memory, if you don’t want cross-region inference, you can manage your model selection using a [built-in with overrides strategy](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-custom-strategy.html>) . For AgentCore Evaluations, if you don’t want cross-region inference, please see additional information on creating [custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>) that operate without CRIS.

###### Topics

  * Supported Regions for AgentCore Memory cross-region inference

  * Supported Regions for Policy in AgentCore cross-region inference

  * Global cross-region inference for Policy in AgentCore

  * Supported Regions for AgentCore Evaluations cross-region inference

  * Global cross-region inference for AgentCore Evaluations


## Supported Regions for AgentCore Memory cross-region inference

For a list of Region codes and endpoints supported in AgentCore, see [Supported AWS Regions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-regions.html>) . For endpoints, see [Amazon Bedrock AgentCore endpoints and quotas](<https://docs.aws.amazon.com/general/latest/gr/bedrock_agentcore.html>).

Supported AgentCore Memory geography | Inference regions  
---|---  
Canada (Effective 3/31) |  Canada (Central) (ca-central-1) US East (N. Virginia) (us-east-1) US East (Ohio) (us-east-2) US West (Oregon) (us-west-2)  
United States |  US East (N. Virginia) (us-east-1) US East (Ohio) (us-east-2) US West (Oregon) (us-west-2)  
Europe |  Europe (Frankfurt) (eu-central-1) Europe (Stockholm) (eu-north-1) Europe (Ireland) (eu-west-1) Europe (London) (eu-west-2) Europe (Paris) (eu-west-3)  
Asia Pacific |  Asia Pacific (Tokyo) (ap-northeast-1) Asia Pacific (Seoul) (ap-northeast-2) Asia Pacific (Mumbai) (ap-south-1) Asia Pacific (Singapore) (ap-southeast-1) Asia Pacific (Sydney) (ap-southeast-2)  
  
## Supported Regions for Policy in AgentCore cross-region inference

For a list of Region codes and endpoints supported in AgentCore, see [Supported AWS Regions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-regions.html>) . For endpoints, see [Amazon Bedrock AgentCore endpoints and quotas](<https://docs.aws.amazon.com/general/latest/gr/bedrock_agentcore.html>).

Supported Policy in AgentCore geography | Inference regions  
---|---  
United States |  US East (N. Virginia) (us-east-1) US East (Ohio) (us-east-2) US West (Oregon) (us-west-2)  
Europe |  Europe (Frankfurt) (eu-central-1) Europe (Stockholm) (eu-north-1) Europe (Milan) (eu-south-1) Europe (Spain) (eu-south-2) Europe (Ireland) (eu-west-1) Europe (Paris) (eu-west-3)  
Asia Pacific |  Asia Pacific (Tokyo) (ap-northeast-1) Asia Pacific (Seoul) (ap-northeast-2) Asia Pacific (Osaka) (ap-northeast-3) Asia Pacific (Mumbai) (ap-south-1) Asia Pacific (Hyderabad) (ap-south-2) Asia Pacific (Singapore) (ap-southeast-1) Asia Pacific (Sydney) (ap-southeast-2) Asia Pacific (Melbourne) (ap-southeast-4)  
  
## Global cross-region inference for Policy in AgentCore

Effective 4/30, Policy in AgentCore supports global cross-region inference from the following source AWS Regions. An inference request originating in these source Regions will be securely routed to all available compute resources across all global commercial AWS Regions. Unlike geography-bounded cross-region inference, input prompts and output results may be processed outside the geography where the source Region is located. All data will be transmitted encrypted across Amazon’s secure network.

Customers with data residency or compliance requirements should assess whether global cross-region inference fits their compliance framework, because requests may be processed in any global commercial AWS Region.

Source AWS Region  
---  
Asia Pacific (Malaysia) (ap-southeast-5)  
Asia Pacific (Thailand) (ap-southeast-7)  
Canada (Central) (ca-central-1)  
South America (São Paulo) (sa-east-1)  
  
## Supported Regions for AgentCore Evaluations cross-region inference

For a list of Region codes and endpoints supported in AgentCore, see [Supported AWS Regions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./agentcore-regions.html>) . For endpoints, see [Amazon Bedrock AgentCore endpoints and quotas](<https://docs.aws.amazon.com/general/latest/gr/bedrock_agentcore.html>).

Supported AgentCore Evaluations geography | Inference regions  
---|---  
Canada |  Canada (Central) (ca-central-1) US East (N. Virginia) (us-east-1) US East (Ohio) (us-east-2) US West (Oregon) (us-west-2)  
United States |  US East (N. Virginia) (us-east-1) US East (Ohio) (us-east-2) US West (Oregon) (us-west-2)  
Europe |  Europe (Frankfurt) (eu-central-1) Europe (Stockholm) (eu-north-1) Europe (Milan) (eu-south-1) Europe (Spain) (eu-south-2) Europe (Ireland) (eu-west-1) Europe (London) (eu-west-2) Europe (Paris) (eu-west-3)  
Asia Pacific |  Asia Pacific (Tokyo) (ap-northeast-1) Asia Pacific (Seoul) (ap-northeast-2) Asia Pacific (Osaka) (ap-northeast-3) Asia Pacific (Mumbai) (ap-south-1) Asia Pacific (Hyderabad) (ap-south-2) Asia Pacific (Singapore) (ap-southeast-1) Asia Pacific (Sydney) (ap-southeast-2) Asia Pacific (Melbourne) (ap-southeast-4)  
  
## Global cross-region inference for AgentCore Evaluations

AgentCore Evaluations supports global cross-region inference from the following source AWS Regions. An inference request originating in these source Regions will be securely routed to all available compute resources across all global commercial AWS Regions. Unlike geography-bounded cross-region inference, input prompts and output results may be processed outside the geography where the source Region is located. All data will be transmitted encrypted across Amazon’s secure network.

Customers with data residency or compliance requirements should assess whether global cross-region inference fits their compliance framework, because requests may be processed in any global commercial AWS Region.

Source AWS Region  
---  
Asia Pacific (Seoul) (ap-northeast-2)

