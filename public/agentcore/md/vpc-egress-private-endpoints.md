# Connect to private resources in your VPC using VPC Lattice - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/vpc-egress-private-endpoints.html

---

# Connect to private resources in your VPC using VPC Lattice

Amazon Bedrock AgentCore supports private connectivity to resources hosted inside your AWS VPC or on-premises environments connected to your VPC, such as private MCP servers, internal REST APIs, or databases, without exposing those services to the public internet.

Private connectivity is established using [Amazon VPC Lattice](<https://docs.aws.amazon.com/vpc-lattice/latest/ug/what-is-vpc-lattice.html>) resource gateways and resource configurations. For details on the two supported modes (managed and self-managed Lattice), see Supported VPC egress modes.

###### Topics

  * Key concepts

  * Supported Amazon Bedrock AgentCore services

  * Supported VPC egress modes

  * Option 1: Managed VPC resources

  * Option 2: Self-managed Lattice resources

  * Route traffic through an intermediate domain

  * Workaround for private certificates: ALB

  * Service-linked role for VPC egress

  * Target status and troubleshooting

  * Limitations and considerations


## Key concepts

**Resource Gateway**
    

An Amazon VPC Lattice resource gateway is the point of ingress into your VPC. It is associated with one or more subnets and security groups in your VPC and acts as the network entry point for traffic from AgentCore. When you use managed Lattice, AgentCore creates and manages this resource on your behalf.

**Resource Configuration**
    

A resource configuration represents a specific private endpoint - an IP address or DNS name - within your VPC. It is attached to a resource gateway and defines which resource AgentCore can reach. When you use managed Lattice, AgentCore creates this resource in the AgentCore service account on your behalf.

**Service Network Resource Association**
    

A service network resource association connects a resource configuration to the AgentCore service network, enabling the AgentCore service to invoke your private endpoint. AgentCore always creates and manages this association on your behalf, regardless of whether you use managed or self-managed Lattice.

**Routing domain**
    

An optional field that specifies an intermediate domain that AgentCore uses as the resource configuration domain instead of the actual target domain. This is useful when you want to route traffic through an intermediate component such as a VPC endpoint or an internal load balancer — for example, to consolidate multiple private API Gateways behind a single VPC endpoint, reducing the number of resource configurations and associated costs. The AgentCore service continues to invoke the actual target domain using SNI override. For more information, see Route traffic through an intermediate domain.

## Supported Amazon Bedrock AgentCore services

The following Amazon Bedrock AgentCore services support VPC egress with VPC Lattice:

**AgentCore Gateway**
    

AgentCore Gateway supports private endpoints for MCP server and OpenAPI target types. For details on configuring VPC egress for each target type, see [Configure Amazon Bedrock AgentCore Gateway VPC Egress for Gateway Targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-vpc-egress.html>).

**AgentCore Identity**
    

AgentCore Identity supports private endpoints for connecting to VPC hosted OAuth 2.0 identity providers for both inbound JWT authorization and outbound OAuth credential providers. For details, see [Connect to private identity providers](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-private-idp.html>).

## Supported VPC egress modes

Amazon Bedrock AgentCore supports two modes for configuring VPC Lattice connectivity:

  * **Managed VPC resources** — Amazon Bedrock AgentCore creates and manages the VPC Lattice resource gateway and resource configuration on your behalf. You provide your VPC, subnets, and optional security groups. This is the simpler approach for in-account VPC connectivity that plugs into existing network architectures such as hub-and-spoke.

###### Note

You do not need VPC Lattice IAM permissions, SCP changes, or additional approval processes to use this option. Amazon Bedrock AgentCore manages all VPC Lattice resources on your behalf.

  * **Self-managed Lattice resources** — You create and manage the VPC Lattice resource gateway and resource configuration yourself. This approach provides enhanced governance and visibility: you can see exactly which services are connected to which domains, who has access, and revoke connections at a granular level. It also enables direct cross-account connectivity via AWS RAM without requiring VPC peering or Transit Gateways.


The following table summarizes the key differences:

Dimension | Managed VPC resources | Self-managed Lattice resources  
---|---|---  
Additional service dependency |  No VPC Lattice onboarding or allowlisting required. VPC Lattice is used internally by Amazon Bedrock AgentCore as an implementation detail. You do not need VPC Lattice IAM policies, SCP changes, or additional approval processes. You only need standard Amazon EC2 permissions and the ability to create a service-linked role. |  Yes. You create and manage VPC Lattice resources directly, which requires VPC Lattice IAM permissions (for example, `vpc-lattice:CreateResourceGateway`, `vpc-lattice:CreateResourceConfiguration`, and `vpc-lattice:CreateServiceNetworkResourceAssociation`). You may need to update SCPs or request approval if your organization restricts VPC Lattice access.  
Governance and visibility |  The only resource in your account is a resource gateway, which is effectively a network interface (ENI) in your VPC. This is a read-only resource fully managed by Amazon Bedrock AgentCore — you cannot modify, configure, or interact with it. |  Full visibility into resource gateways, resource configurations, service network associations, and connected domains. You own and manage all resources, and can audit connections and revoke access at a granular level.  
Complexity |  Simple — provide VPC, subnets, and security groups. Amazon Bedrock AgentCore manages the rest. |  Advanced — you create and manage VPC Lattice resource gateways and resource configurations yourself.  
Cross-account connectivity |  Not supported. Use with existing network architectures such as hub-and-spoke (VPC peering or AWS Transit Gateway) for cross-account or cross-VPC scenarios. |  Supported via AWS RAM. Enables direct cross-account connectivity without requiring VPC peering or Transit Gateways.  
VPC Lattice pricing |  Data processing charges only (per GB processed through the resource gateway). |  Hourly charge per VPC resource added to a service network, plus data processing charges (per GB).  
Resource lifecycle |  Amazon Bedrock AgentCore creates, reuses, and deletes resource gateways on your behalf. |  You own the full lifecycle of resource gateways and resource configurations.  
IP consumption and throughput |  Each managed resource gateway consumes 1 IP address per subnet. This is not configurable. |  When used with Amazon Bedrock AgentCore, consumes 1 IP address per subnet. If also attached to other VPC Lattice service networks, consumes additional IPs based on the `ipv4AddressesPerEni` value on the resource gateway. The combination of port range and IP addresses determines the maximum number of concurrent connections for that service network resource association. Note that there is a 350-second port cooldown period after a connection ends before that port can be reused.  
  
For VPC Lattice pricing details, see [Amazon VPC Lattice pricing](<https://aws.amazon.com/vpc/lattice/pricing/>).

## Option 1: Managed VPC resources

With managed VPC resources, you provide your VPC, subnet, and optional security group information. AgentCore handles the creation and lifecycle management of the VPC Lattice resource gateway and resource configuration on your behalf. The managed resource gateway is a wrapper around ENIs in your VPC. You cannot modify, configure, or interact with it. AgentCore owns its full lifecycle, including creation, reuse, and deletion.

###### Note

You do not need VPC Lattice IAM permissions, SCP changes, or additional approval processes to use managed VPC resources, because Amazon Bedrock AgentCore uses Lattice as an internal dependency and any Lattice resource gateways are read-only to the customer.

AgentCore uses the `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` service-linked role to create and manage VPC Lattice resource gateways in your account. This role is created automatically the first time you create a gateway target with a managed private endpoint. For more information about this role, see [Gateway service-linked role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html#gateway-service-linked-role>).

### Prerequisites

Before creating a gateway target with a managed private endpoint, ensure the following:

  * Your private resource (MCP server or REST API) is running and accessible within your VPC.

  * You have at least one subnet in your VPC that has network access to the private resource.

  * Your security groups allow inbound traffic on the port used by your private resource (typically port 443 for HTTPS).

  * Your IAM principal has the `iam:CreateServiceLinkedRole` permission for `bedrock-agentcore.amazonaws.com` , so that AgentCore can create the service-linked role on your behalf if it does not already exist. For the required IAM policy, see [Gateway service-linked role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html#gateway-service-linked-role>).

  * Your IAM principal has the following Amazon EC2 permissions, which are required for AgentCore to set up the VPC Lattice resource gateway in your VPC:

    * `ec2:CreateNetworkInterface`

    * `ec2:DescribeVpcs`

    * `ec2:DescribeSecurityGroups`

    * `ec2:DescribeSubnets`

  * If your private resource uses a TLS certificate issued by a private certificate authority, you can place an internal Application Load Balancer with a public ACM certificate in front of it. For more information, see Workaround for private certificates: ALB.


### Create a target with a managed private endpoint

To create a resource with a managed private endpoint, include the `privateEndpoint.managedVpcResource` block in your create request.

```json
{
  ...
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "vpc-0abc123def456",
      "subnetIds": ["subnet-0abc123", "subnet-0def456"],
      "endpointIpAddressType": "IPV4",
      "securityGroupIds": ["sg-0abc123def"]
    }
  },
  ...
}
```
The `managedVpcResource` block accepts the following fields:

`vpcIdentifier` (required)
    

The ID of the VPC that contains your private resource.

`subnetIds` (required)
    

A list of subnet IDs within the VPC where the resource gateway will be placed.

`endpointIpAddressType` (required)
    

The IP address type for the resource configuration. Valid values are `IPV4` and `IPV6`.

`securityGroupIds` (optional)
    

A list of security group IDs to associate with the resource gateway. If not provided, the default security group for the VPC is used.

`routingDomain` (optional)
    

An intermediate domain to use as the resource configuration endpoint instead of the actual target domain. Use this when you want to route traffic through an intermediate component such as a VPC endpoint or internal load balancer. For more information, see Route traffic through an intermediate domain.

`tags` (optional)
    

Tags to apply to the managed VPC Lattice resource gateway. The tag key `BedrockAgentCoreGatewayManaged` is reserved and cannot be specified.

### View managed resources

After the resource is created, call the relevant Get API (for example, `GetGatewayTarget` ) to view the managed VPC Lattice resources that AgentCore created on your behalf. These are returned in the `privateEndpointManagedResources` field of the response:

```json
{
  ...
  "status": "READY",
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "vpc-0abc123def456",
      "subnetIds": ["subnet-0abc123", "subnet-0def456"],
      "endpointIpAddressType": "IPV4",
      "securityGroupIds": ["sg-0abc123def"]
    }
  },
  "privateEndpointManagedResources": [
    {
      "domain": "my-server.internal.example.com",
      "resourceGatewayArn": "arn:aws:vpc-lattice:us-east-1:123456789012:resourcegateway/rgw-abc123"
    }
  ]
}
```
The `resourceGatewayArn` is the ARN of the VPC Lattice resource gateway that AgentCore created in your account. AgentCore manages the full lifecycle of this resource: it reuses the same resource gateway for targets with matching VPC and subnet configurations, and deletes it when it is no longer used by any targets.

## Option 2: Self-managed Lattice resources

With self-managed Lattice, you create and manage the VPC Lattice resource gateway and resource configuration yourself, then provide the resource configuration identifier to AgentCore. Use this option if you already have VPC Lattice resources configured, need to share a resource configuration across multiple services, or require control over the Lattice resource lifecycle.

### Prerequisites

Before creating a gateway target with a self-managed private endpoint, complete the following steps:

  * Your private resource (MCP server or REST API) is running and accessible within your VPC.

  * You have at least one subnet in your VPC that has network access to the private resource.

  * Your security groups allow inbound traffic on the port used by your private resource (typically port 443 for HTTPS).

  * If your private resource uses a TLS certificate issued by a private certificate authority, you can place an internal Application Load Balancer with a public ACM certificate in front of it. For more information, see Workaround for private certificates: ALB.


**Set up VPC Lattice resources for self-managed connectivity**

  1. **Create a Resource Gateway** in your VPC using the VPC Lattice console or the `CreateResourceGateway` API. Associate it with the subnets and security groups that have access to your private resource.

```bash
aws vpc-lattice create-resource-gateway \
  --name my-resource-gateway \
  --vpc-identifier vpc-0abc123def456 \
  --subnet-ids subnet-0abc123 subnet-0def456 \
  --security-group-ids sg-0abc123def \
  --ip-address-type IPV4
```
  2. **Create a Resource Configuration** that points to your private endpoint. Use the ARN of the resource gateway you created in the previous step.

```bash
aws vpc-lattice create-resource-configuration \
  --name my-resource-config \
  --type SINGLE \
  --resource-gateway-identifier <resource-gateway-arn> \
  --resource-configuration-definition '{"dnsResource": {"domain": "my-service.internal.example.com", "ipAddressType": "IPV4"}}' \
  --port-ranges 443
```
  3. **If the resource is in a different account** than the AgentCore owner account, share the resource configuration with the AgentCore owner account using AWS RAM:

```bash
aws ram create-resource-share \
  --name my-resource-config-share \
  --resource-arns <resource-configuration-arn> \
  --principals <gateway-owner-account-id>
```
The AgentCore owner account must accept the resource share before creating the target.

  4. Note the resource configuration ARN or ID. You will provide this as the `resourceConfigurationIdentifier` when creating the gateway target.


Your IAM principal also needs the following permissions to allow AgentCore to associate the resource configuration with the AgentCore service network on your behalf:

```json
{
"Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "vpc-lattice:GetResourceConfiguration",
        "vpc-lattice:CreateServiceNetworkResourceAssociation",
        "vpc-lattice:GetServiceNetworkResourceAssociation",
        "vpc-lattice:ListServiceNetworkResourceAssociations",
        "vpc-lattice:AssociateViaAWSService"
      ],
      "Resource": "*"
    }
  ]
}
```
### Create a target with a self-managed private endpoint

To create a resource with a self-managed private endpoint, include the `privateEndpoint.selfManagedLatticeResource` block in your create request:

```json
{
  ...
  "privateEndpoint": {
    "selfManagedLatticeResource": {
      "resourceConfigurationIdentifier": "arn:aws:vpc-lattice:us-east-1:123456789012:resourceconfiguration/rcfg-abc123"
    }
  },
  ...
}
```
The `resourceConfigurationIdentifier` can be either the ARN or the ID of the VPC Lattice resource configuration. AgentCore uses your credentials (via [Forward Access Sessions](<https://docs.aws.amazon.com/IAM/latest/UserGuide/access_forward_access_sessions.html>) ) to associate the resource configuration with the AgentCore service network.

After the resource is created, the Get API response includes the `resourceAssociationArn` in the `privateEndpointManagedResources` field. If you create multiple resources pointing to the same resource configuration, AgentCore automatically reuses the existing service network resource association.

### Cross-account private resources

You can connect AgentCore to private resources in a different AWS account than the account that owns the gateway. This is a common pattern for platform teams that manage centralized gateways while individual service teams own the private resources.

The resource owner account must share the VPC Lattice resource configuration with the gateway owner account using AWS RAM. The gateway owner account then provides the shared resource configuration identifier when creating the gateway target.

The following steps summarize the cross-account setup:

**Set up cross-account private connectivity**

  1. **In the resource owner account** : Create a VPC Lattice resource gateway and resource configuration as described in Prerequisites.

  2. **In the resource owner account** : Share the resource configuration with the gateway owner account using AWS RAM:

```bash
aws ram create-resource-share \
  --name my-resource-config-share \
  --resource-arns <resource-configuration-arn> \
  --principals <gateway-owner-account-id>
```
  3. **In the gateway owner account** : Accept the resource share:

```bash
aws ram accept-resource-share-invitation \
  --resource-share-invitation-arn <invitation-arn>
```
  4. **In the gateway owner account** : Create the gateway target using the shared resource configuration identifier, as described in Create a target with a self-managed private endpoint.


## Route traffic through an intermediate domain

You can use the `routingDomain` field to route traffic through an intermediate component — such as a VPC endpoint, internal Application Load Balancer, or Network Load Balancer — instead of directly to your target domain. This is useful when you want to consolidate multiple private resources behind a single entry point (for example, routing multiple private API Gateways through a single VPC endpoint to reduce the number of resource configurations and associated costs).

When using a routing domain, the domain you specify for your target (in the MCP endpoint URL or OpenAPI server URL) should be the actual DNS name of your resource. The `routingDomain` is a separate domain that AgentCore uses to set up the VPC Lattice resource configuration. At invocation time, AgentCore routes traffic through the routing domain but sends requests with the actual target domain as the TLS SNI hostname, so your resource receives requests addressed to its actual domain.

The routing domain can be any domain that routes to your private resource within the VPC. Common options include:

  * **VPC endpoint (VPCE) domain for a private API Gateway** \- Use the VPCE DNS name as the `routingDomain` , for example `<vpce-id>.execute-api.us-east-1.vpce.amazonaws.com` . Set the target URL in your OpenAPI spec to the private API Gateway hostname, for example `https://<api-id>.execute-api.us-east-1.amazonaws.com` . AgentCore routes traffic through the VPCE domain but sends requests with the private API hostname as the TLS SNI, ensuring correct routing within your VPC.

  * **Internal Application Load Balancer (ALB)** \- Use the internal ALB DNS name as the `routingDomain` , for example `internal-<alb-name>-<id>.us-west-2.elb.amazonaws.com` . Set the target URL to the DNS name of the resource behind the ALB.

  * **Internal Network Load Balancer (NLB)** \- Use the internal NLB DNS name as the `routingDomain` , for example `internal-<nlb-name>-<id>.elb.us-west-2.amazonaws.com` . Set the target URL to the DNS name of the resource behind the NLB.


The following steps describe the traffic flow when a routing domain is used:

  1. AgentCore resolves the VPC Lattice-generated DNS name to reach the resource gateway.

  2. Traffic enters your VPC through the resource gateway, addressed to the routing domain.

  3. The routing domain (VPCE or ALB) forwards the request to your private resource. The TLS SNI header contains the actual target domain, so your resource receives the request with the correct hostname.


### Example: Private API Gateway with VPCE routing domain

The following example shows how to create a gateway target for a private API Gateway using its VPCE domain as the routing domain. The target URL is the private API Gateway hostname, and the `routingDomain` is the VPCE DNS name:

```json
{
  "name": "my-private-apigw-target",
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "vpc-0123456789abcdef0",
      "subnetIds": ["subnet-0123456789abcdef0", "subnet-0abcdef1234567890"],
      "endpointIpAddressType": "IPV4",
      "routingDomain": "<vpce-id>.execute-api.us-east-1.vpce.amazonaws.com"
    }
  },
  "targetConfiguration": {
    "mcp": {
      "openApiSchema": {
        "inlinePayload": "<OpenAPI spec JSON with server URL matching the public certificate domain, for example https://<api-id>.execute-api.<region>.amazonaws.com>"
      }
    }
  }
}
```
###### Note

The `routingDomain` field is only available for the `managedVpcResource` option. For self-managed Lattice, configure the routing domain directly in your resource configuration when you create it.

## Workaround for private certificates: ALB

VPC egress requires your target endpoint to have a publicly trusted TLS certificate. If your private resource uses a certificate issued by a private certificate authority (CA), the recommended workaround is to place an internal Application Load Balancer (ALB) in front of your resource.

The following steps describe the traffic flow:

  1. Set the target URL to a domain that matches your public ACM certificate (for example, `https://my-server.my-company.com` ).

  2. Set the `routingDomain` to the internal ALB DNS name (for example, `internal-my-alb-1234567890.us-west-2.elb.amazonaws.com` ).

  3. VPC Lattice routes traffic to the ALB via the routing domain. The TLS SNI is set to `my-server.my-company.com` , which matches the ALB’s public ACM certificate, so the TLS handshake succeeds.

  4. The ALB terminates TLS and applies a host header transform to rewrite the Host header from `my-server.my-company.com` to the private resource’s domain (for example, `my-server.my-company.internal` ).

  5. The ALB forwards the request to your backend resource over HTTPS using the private certificate. All traffic stays inside your VPC.


**Step 1: Request a public ACM certificate**

Request a public certificate from ACM for a domain you own. This domain will be used as the target URL. For instructions, see [Request a public certificate](<https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html>) in the AWS Certificate Manager User Guide.

**Step 2: Create an internal ALB**

Create an internal Application Load Balancer in the same VPC as your private resource. For instructions, see [Create an Application Load Balancer](<https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html>) in the Elastic Load Balancing User Guide. Ensure you set the scheme to `internal`.

**Step 3: Create an IP-based target group**

Create a target group with target type `ip` that points to your private resource’s IP address on port 443 (HTTPS), and register your private resource as a target. For instructions, see [Create a target group](<https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-target-group.html>) in the Elastic Load Balancing User Guide.

**Step 4: Create an HTTPS listener with host header transform**

Create an HTTPS listener on port 443 using the public ACM certificate. Add a listener rule that transforms the Host header from the public domain to the private resource’s domain before forwarding.

```bash
aws elbv2 create-listener \
  --load-balancer-arn <alb-arn> \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=<acm-certificate-arn> \
  --default-actions '[{
    "Type": "forward",
    "TargetGroupArn": "<target-group-arn>",
    "ForwardConfig": {
      "TargetGroups": [{"TargetGroupArn": "<target-group-arn>", "Weight": 1}]
    }
  }]'
```
Then modify the listener rule to add the host header transform:

```bash
aws elbv2 modify-rule \
  --rule-arn <default-rule-arn> \
  --actions '[{
    "Type": "forward",
    "TargetGroupArn": "<target-group-arn>",
    "ForwardConfig": {
      "TargetGroups": [{"TargetGroupArn": "<target-group-arn>", "Weight": 1}]
    }
  }]' \
  --transforms '[{
    "Type": "host-header",
    "HostHeaderConfig": {
      "Values": ["my-server.my-company.internal"]
    }
  }]'
```
**Step 5: Configure the private endpoint**

Use the ALB DNS name as the `routingDomain` and the public cert domain as the target URL.

```json
{
  ...
  "privateEndpoint": {
    "managedVpcResource": {
      "vpcIdentifier": "<vpc-id>",
      "subnetIds": ["<subnet-id-1>", "<subnet-id-2>"],
      "endpointIpAddressType": "IPV4",
      "routingDomain": "internal-my-alb-1234567890.us-west-2.elb.amazonaws.com"
    }
  },
  ...
}
```
The target URL in your target configuration should use `https://my-server.my-company.com` (the public cert domain), not the private domain.

## Service-linked role for VPC egress

When you create a gateway target with a managed private endpoint ( `managedVpcResource` ), AgentCore uses the `AWSServiceRoleForBedrockAgentCoreGatewayNetwork` service-linked role to create and manage VPC Lattice resource gateways in your account. This role is created automatically the first time you create a managed private endpoint target, provided your IAM principal has the required `iam:CreateServiceLinkedRole` permission.

The service-linked role has the following key characteristics:

  * It can only create and delete VPC Lattice resource gateways that are tagged with `BedrockAgentCoreGatewayManaged: true` . It cannot modify resource gateways that you create and manage yourself.

  * AgentCore reuses the same managed resource gateway for targets that share the same VPC, subnet, security group, and IP address type configuration. The resource gateway is deleted only when no gateway targets are using it.

  * Resource configurations for managed Lattice are created in the AgentCore service account, not in your account. You will not see them in your VPC Lattice console.


For the full policy document and instructions for creating, editing, and deleting this role, see [Gateway service-linked role](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./service-linked-roles.html#gateway-service-linked-role>).

## Target status and troubleshooting

After you create a resource with a private endpoint, the resource goes through a `CREATING` state while AgentCore sets up the VPC Lattice resources and establishes the service network association. You can monitor the status by calling the relevant Get API (for example, `GetGatewayTarget` ) and checking the `status` and `statusReasons` fields.

The following table describes common status values and their meanings:

Status | Description  
---|---  
`CREATING` |  AgentCore is setting up VPC Lattice resources and establishing the service network association. This can take up to a few minutes.  
`READY` |  The private endpoint is configured and the target is ready to receive requests.  
`FAILED` |  Target creation failed. Check the `statusReasons` field for details. Common causes include missing IAM permissions or an invalid resource configuration identifier.  
  
The following table describes common issues and their solutions:

Issue | Solution  
---|---  
Target creation fails with an IAM permission error |  Ensure your IAM principal has the `iam:CreateServiceLinkedRole` permission for `bedrock-agentcore.amazonaws.com` . For self-managed Lattice, ensure you have the required VPC Lattice permissions listed in Prerequisites.  
Tool invocations fail with a connection error after target creation |  Verify that the security groups associated with the resource gateway allow inbound traffic on the port used by your private resource. Also verify that the private resource is running and accessible from the specified subnets.  
Tool invocations fail with a TLS error |  If your private resource uses a certificate issued by a private CA, ensure that the certificate’s Subject Alternative Name (SAN) matches the domain in your MCP endpoint or OpenAPI server URL. If using a routing domain, ensure the routing domain correctly forwards TLS to your private resource.  
Resource configuration not found (self-managed) |  For cross-account scenarios, ensure the AWS RAM resource share has been accepted in the gateway owner account before creating the target.  
  
## Limitations and considerations

Be aware of the following limitations when using VPC egress for AgentCore:

  * **Cross-account** : Cross-account private connectivity requires the self-managed Lattice resources option. Managed VPC resources does not support cross-account scenarios.

  * **DNS TTL configuration** : VPC Lattice uses IP-based routing. Ensure that DNS TTLs for your resource configuration domain are configured appropriately so that IP address changes during rolling deployments do not cause connectivity disruption.



