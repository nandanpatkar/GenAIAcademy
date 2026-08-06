# Setting up custom domain names for Gateway endpoints - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-custom-domains.html

---

# Setting up custom domain names for Gateway endpoints

By default, Gateway endpoints are provided with an AWS-managed domain name in the format `<gateway-id>.gateway.bedrock-agentcore.<region>.amazonaws.com` . For production environments or to create a more user-friendly experience, you may want to use a custom domain name for your gateway endpoint. This section guides you through setting up a custom domain name using Amazon CloudFront as a reverse proxy.

## Prerequisites

Before you begin, ensure you have:

  * A working Gateway endpoint

  * DNS delegation (if your Route 53 domain needs to be publicly reachable)

  * AWS CDK installed and configured (if following the CDK approach)

  * Appropriate IAM permissions to create and manage CloudFront distributions, Route 53 hosted zones, and ACM certificates


## Solution overview

The solution involves the following components:

  * **Route 53 Hosted Zone** : Manages DNS records for your custom domain

  * **ACM Certificate** : Provides SSL/TLS encryption for your custom domain

  * **CloudFront Distribution** : Acts as a reverse proxy, forwarding requests from your custom domain to the Gateway endpoint

  * **Route 53 A Record** : Maps your custom domain to the CloudFront distribution


The following steps will guide you through setting up these components using AWS CDK.

## Implementation steps

### Step 1: Create a Route 53 hosted zone

First, create a Route 53 hosted zone for your custom domain:

```python
import { RemovalPolicy } from 'aws-cdk-lib';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';

const domainName = 'my.example.com';

const hostedZone = new PublicHostedZone(this, 'HostedZone', {
    zoneName: domainName,
});
this.hostedZone.applyRemovalPolicy(RemovalPolicy.RETAIN);
```
###### Note

We apply a removal policy of `RETAIN` to prevent accidental deletion of the hosted zone during stack updates or deletion.

### Step 2: Create a DNS-validated certificate

Next, create an SSL/TLS certificate for your custom domain using AWS Certificate Manager (ACM) with DNS validation:

```python
import { RemovalPolicy } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

const certificate = new Certificate(this, 'SSLCertificate', {
    domainName: domainName, // route53 hosted zone domain name from step 1
    validation: CertificateValidation.fromDns(hostedZone), // route53 hosted zone from step 1
});
this.certificate.applyRemovalPolicy(RemovalPolicy.RETAIN);
```
DNS validation automatically creates the necessary validation records in your Route 53 hosted zone.

### Step 3: Create a CloudFront distribution

Create a CloudFront distribution to act as a reverse proxy for your Gateway endpoint:

```python
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginProtocolPolicy,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

const bedrockAgentCoreGatewayHostName = '<mymcpserver>.gateway.bedrock-agentcore.<region>.amazonaws.com'
const bedrockAgentCoreGatewayPath = '/mcp' // can also be left undefined, depending on your requirement

const distribution = new Distribution(this, 'Distribution', {
    defaultBehavior: {
        origin: new HttpOrigin(bedrockAgentCoreGatewayHostName, {
            protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
            originPath: bedrockAgentCoreGatewayPath,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        cachePolicy: CachePolicy.CACHING_DISABLED, // important since caching is enabled by default and hence is not suitable for a reverse proxy
        allowedMethods: AllowedMethods.ALLOW_ALL,
    },
    domainNames: [domainName], // route53 hosted zone domain name from step 1
    certificate: certificate, // ssl certificate for the route53 domain from step 2
});
```
###### Important

Set `cachePolicy: CachePolicy.CACHING_DISABLED` to ensure that CloudFront doesn’t cache responses from your Gateway endpoint, which is important for dynamic API interactions.

Replace `<mymcpserver>` with your gateway ID and `<region>` with your AWS Region (e.g., `us-east-1` ).

### Step 4: Create a Route 53 A record

Create a Route 53 A record that points your custom domain to the CloudFront distribution:

```python
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

const aRecord = new ARecord(this, 'AliasRecord', {
    zone: hostedZone, // route53 hosted zone from step 1
    recordName: domainName, // route53 hosted zone domain name from step 1
    target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)), // cloudfront distribution from step 3
});
```
This creates an alias record that maps your custom domain to the CloudFront distribution.

### Step 5: Deploy your infrastructure

Deploy your CDK stack to create the resources:

```text
cdk deploy
```
The deployment process may take some time, especially for the certificate validation and CloudFront distribution creation.

## Testing your custom domain

After deploying your infrastructure, verify that your custom domain is properly configured:

### Verify DNS resolution

Use the `dig` command to verify that your custom domain resolves to the CloudFront distribution:

```text
dig my.example.com
```
The output should show that your domain resolves to CloudFront’s IP addresses.

### Verify SSL certificate

Use `curl` to verify that the SSL certificate is properly configured:

```bash
curl -v https://my.example.com
```
The output should show a successful SSL handshake with no certificate errors.

## Configuring MCP clients

Once your custom domain is set up and verified, you can configure your MCP clients to use it:

### Cursor configuration

For Cursor, update your configuration file:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "url": "https://my.example.com"
    }
  }
}
```
### Other MCP clients

For MCP clients that don’t natively support streamable HTTP:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "/path/to/uvx",
        "args": [
            "mcp-proxy",
            "--transport",
            "streamablehttp",
            "https://my.example.com"
        ]
    }
  }
}
```
## Additional considerations

**Cost implications**
    

Using CloudFront as a reverse proxy incurs additional costs for data transfer and request handling. Review the CloudFront pricing model to understand the cost implications for your specific use case.

**Security considerations**
    

Consider implementing additional security measures such as:

  * WAF rules to protect your endpoint from common web exploits

  * Geo-restrictions to limit access to specific geographic regions

  * Custom headers or request signing to add an extra layer of authentication


**Monitoring and logging**
    

Enable CloudFront access logs and configure CloudWatch alarms to monitor the health and performance of your custom domain setup.

**Certificate renewal**
    

ACM certificates issued through DNS validation are automatically renewed as long as the DNS records remain in place. Ensure that you don’t delete the validation records.

**OAuth protected resource endpoint with custom domains**
    

By default, the `/.well-known/oauth-protected-resource` endpoint returns a resource URL that contains the gateway domain instead of your custom domain. This can cause OAuth clients to fail authentication when using custom domains.

To resolve this issue, you can implement a Lambda@Edge function that intercepts the OAuth discovery response and generates a new response with the correct custom domain URL. Here’s the approach:

  * **Use Lambda@Edge with ORIGIN_RESPONSE event type** : Create a function that triggers on origin responses to intercept the OAuth protected resource endpoint response.

  * **Generate a new response** : Lambda@Edge cannot read origin response bodies, so instead of modifying the existing response, generate a completely new JSON response with the custom domain.

  * **Associate with CloudFront behavior** : Configure the Lambda@Edge function to trigger specifically for the `/.well-known/oauth-protected-resource` path pattern.

After implementing this solution, the OAuth protected resource endpoint will return the correct custom domain:

```bash
curl https://my-custom-domain.com/.well-known/oauth-protected-resource
{
  "authorization_servers": ["https://my-org.okta.com/oauth2/default"],
  "resource": "https://my-custom-domain.com/mcp"
}
```
###### Note

While Lambda@Edge provides a solution for this issue, implementing custom domains for AgentCore Gateway without built-in support requires additional complexity that may not be optimal for all customers. Consider this approach as a workaround until native support for OAuth discovery with custom domains becomes available.


## Troubleshooting

**DNS resolution issues**
    

If your custom domain doesn’t resolve correctly:

  * Verify that the A record is correctly configured in your Route 53 hosted zone

  * Check that your domain’s name servers are correctly set at your domain registrar

  * Allow time for DNS propagation (up to 48 hours in some cases)


**SSL certificate issues**
    

If you encounter SSL certificate errors:

  * Verify that the certificate is issued and active in the ACM console

  * Check that the certificate is correctly associated with your CloudFront distribution

  * Ensure that the certificate covers the exact domain name you’re using


**Gateway connectivity issues**
    

If your custom domain doesn’t connect to your gateway:

  * Verify that the origin domain and path in your CloudFront distribution are correct

  * Check that your gateway endpoint is accessible directly

  * Review CloudFront distribution logs for any errors


## Conclusion

Setting up a custom domain name for your Gateway endpoint enhances the professional appearance of your application and provides flexibility in managing your API endpoints. By following the steps outlined in this guide, you can create a secure and reliable custom domain configuration using CloudFront as a reverse proxy.

For more information about Gateway features and capabilities, see [Amazon Bedrock AgentCore Gateway: Securely connect tools and other resources to your Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway.html>).

