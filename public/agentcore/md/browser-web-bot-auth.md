# Reducing CAPTCHAs with Web Bot Auth - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-web-bot-auth.html

---

# Reducing CAPTCHAs with Web Bot Auth

###### Note

Amazon Bedrock AgentCore Browser Web Bot Auth (Preview) is based on the draft IETF Web Bot Auth protocol, which is subject to change as the specification evolves toward finalization.

\+ **Current Implementation:**

\+ * Implementation details, API parameters, and signing mechanisms may change as we align with the finalized protocol specification * WAF provider support and policies vary. Not all websites will recognize or allow signed agent traffic * Domain owners retain full control over their bot policies and may block, monitor, or rate-limit agent traffic regardless of cryptographic signatures

\+ For the latest protocol specification, see the [IETF draft](<https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture>).

Amazon Bedrock AgentCore Browser reduces CAPTCHA challenges through Web Bot Auth, a draft IETF protocol that cryptographically identifies AI agents to websites and bot control vendors.

## Overview

AI agents frequently encounter anti-bot mechanisms when browsing websites, including CAPTCHA challenges, rate limiting, and request blocking. These security measures are designed to prevent malicious automated traffic but often block legitimate AI agents as well.

Websites implement these defenses because they cannot reliably distinguish between legitimate agents and malicious bots. Traditional identification methods like IP addresses or User-Agent strings can be easily spoofed and do not provide verifiable identity.

Web Bot Auth addresses this challenge by implementing the [IETF HTTP Message Signatures for automated traffic Architecture](<https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture>) draft protocol. This protocol enables AI agents to cryptographically sign their HTTP requests, providing websites with verifiable proof of the agent’s identity.

When Web Bot Auth is enabled, Amazon Bedrock AgentCore Browser automatically signs each HTTP request with a private key and includes verification headers. Bot control vendors (such as Cloudflare, Akamai Technologies, and HUMAN Security) can verify these signatures against public key directories and apply appropriate policies configured by website owners.

This approach provides a standardized method for legitimate automation to identify itself while preserving website owners' control over access policies.

## How it works

Web Bot Auth uses the IETF HTTP Message Signatures standard to cryptographically sign HTTP requests:

  1. **Agent Registration** : Amazon Bedrock AgentCore registers with bot control vendors (Cloudflare, reCAPTCHA, etc.) and provides public keys for verification

  2. **Request Signing** : When enabled, the Browser Tool automatically signs each HTTP request using a private key

  3. **Signature Headers** : Three headers are added to each request:

     * `Signature` : The cryptographic signature

     * `Signature-Agent` : Points to the public key directory for verification

     * `Signature-Input` : Specifies which components were signed

  4. **Verification** : The website’s bot control system fetches the public key and verifies the signature to confirm the request comes from Amazon Bedrock AgentCore

  5. **Policy Application** : Based on the verified identity, the website can apply appropriate policies. Domain owners can configure their bot control systems to:

     * **Block all traffic** : Reject all automated requests regardless of authentication

     * **Allow only signed bots** : Accept requests only from verified agents with valid Web Bot Auth signatures

     * **Allow signed bots from specific directories** : Permit authenticated agents to access only certain paths or resources on the website


## Enabling Web Bot Auth

To enable Web Bot Auth, you need to configure it when creating a Browser Tool:

###### Example

AWS CLI
    

  1. To create a Browser Tool with Web Bot Auth enabled using the AWS CLI:

```bash
aws bedrock-agentcore-control create-browser \
  --region <Region> \
  --name "my-browser-with-auth" \
  --description "Browser with Web Bot Auth enabled" \
  --network-configuration '{"networkMode": "PUBLIC"}' \
  --execution-role-arn "arn:aws:iam::<account-id>:role/<execution-role>" \
  --browser-signing '{"enabled": true}'
```
Boto3
    

  1. To create a Browser Tool with Web Bot Auth enabled using Boto3:

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')

response = client.create_browser(
    name='my-browser-with-auth',
    description='Browser with Web Bot Auth enabled',
    networkConfiguration={
        'networkMode': 'PUBLIC'
    },
    executionRoleArn='arn:aws:iam::<account-id>:role/<execution-role>',
    browserSigning={
        'enabled': True
    }
)
```
Console
    

  1. ====== To enable Web Bot Auth in the console

  2. Open the AgentCore console at [https://console.aws.amazon.com/bedrock-agentcore/home#](<https://console.aws.amazon.com/bedrock-agentcore/home#>).

  3. In the navigation pane, choose **Built-in tools**.

  4. Choose **Create browser tool**.

  5. Provide a unique **Tool name** and optional **Description**.

  6. Under **Network settings** , choose **Public network**.

  7. In the **Web Bot Auth configuration** section, select the **Use Web Bot Auth** check box.

  8. Under **Permissions** , specify an IAM execution role that defines what AWS resources the Browser Tool can access.

  9. Configure other browser settings as needed and choose **Create**.


###### Important

Web Bot Auth requires an execution role with a trust policy, but does not require any managed or inline policies. The feature is disabled by default and must be explicitly enabled during browser creation. You should add the following trust policy to the execution role: [source,json,subs="verbatim,attributes"] ---- { "Version":"2012-10-17", "Statement": [{ "Sid": "BedrockAgentCoreBuiltInTools", "Effect": "Allow", "Principal": { "Service": "bedrock-agentcore.amazonaws.com" }, "Action": "sts:AssumeRole", "Condition": { "StringEquals": { "aws:SourceAccount": "111122223333" }, "ArnLike": { "aws:SourceArn": "arn:aws:bedrock-agentcore:us-east-1:111122223333:*" } } }] } ----

## Supported Bot Control Vendors

Amazon Bedrock AgentCore currently supports Web Bot Auth with the following bot control vendors:

  * **Cloudflare**

  * **HUMAN Security**

  * **Akamai Technologies**

  * **DataDome**

  * **F5**


Additional bot control vendors will be supported as partnerships are established. The authentication works transparently - once enabled, your agents can browse websites protected by these services with reduced friction.

## Considerations

  * **Transparent Operation** : Web Bot Auth works automatically once enabled. No additional code changes are required in your agent applications.

  * **Performance Impact** : Signing requests adds minimal latency to HTTP requests.

  * **Vendor Coverage** : The feature only works with websites that use supported bot control vendors. Websites using other anti-bot solutions may still present challenges.

  * **Policy Dependent** : Even with authentication, website owners control their bot policies. Some sites may still restrict or monitor agent traffic based on their specific requirements.



