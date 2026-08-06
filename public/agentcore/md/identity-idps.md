# Provider setup and configuration - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-idps.html

---

# Provider setup and configuration

Amazon Bedrock AgentCore Identity provides managed OAuth 2.0 supported providers for both inbound and outbound authentication. Each provider encapsulates the specific authentication protocols, endpoint configurations, and credential formats required for a particular service or identity system. The service provides built-in providers for popular services including Google, GitHub, Slack, and Salesforce with authorization server endpoints and provider-specific parameters pre-configured to reduce development effort. The providers abstract away the complexity of different OAuth 2.0 implementations, API authentication schemes, and token formats, presenting a unified interface to agents while handling the underlying protocol variations and edge cases.

Built-in providers are maintained by the AgentCore Identity team and automatically updated to handle changes in external service APIs, security requirements, and best practices.

Supported providers include:

###### Topics

  * [Amazon Cognito](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-cognito.html>)

  * [Auth0 by Okta](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-auth0.html>)

  * [Atlassian](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-atlassian.html>)

  * [CyberArk](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-cyberark.html>)

  * [Dropbox](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-dropbox.html>)

  * [Facebook](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-facebook.html>)

  * [FusionAuth](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-fusionauth.html>)

  * [GitHub](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-github.html>)

  * [Google](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-google.html>)

  * [HubSpot](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-hubspot.html>)

  * [LinkedIn](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-linkedin.html>)

  * [Microsoft](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-microsoft.html>)

  * [Notion](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-notion.html>)

  * [Okta](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-okta.html>)

  * [OneLogin](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-onelogin.html>)

  * [Ping Identity](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-pingidentity.html>)

  * [Reddit](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-reddit.html>)

  * [Salesforce](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-salesforce.html>)

  * [Slack](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-slack.html>)

  * [Spotify](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-spotify.html>)

  * [Twitch](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-twitch.html>)

  * [X](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-x.html>)

  * [Yandex](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-yandex.html>)

  * [Zoom](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./identity-idp-zoom.html>)



