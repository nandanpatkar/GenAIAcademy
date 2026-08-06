# Monitor AgentCore resources across accounts - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-cross-account.html

---

# Monitor AgentCore resources across accounts

You can use Amazon CloudWatch cross-account observability to monitor Amazon Bedrock AgentCore resources across multiple AWS accounts from a single monitoring account. This enables you to view agent metrics, traces, sessions, and resource data from source accounts without switching between accounts.

When cross-account observability is enabled, the AgentCore Observability console in your monitoring account automatically displays data from all linked source accounts alongside your local account data.

## Prerequisites

Before you can monitor AgentCore resources across accounts, you must complete the following:

  * **Set up a monitoring account** – Configure a central AWS account as your monitoring account in CloudWatch Settings. For instructions, see [CloudWatch cross-account observability](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html>).

  * **Link source accounts** – Link one or more source accounts to your monitoring account using AWS Organizations or individual account linking. Source accounts must share the required telemetry types (Metrics and Logs).

  * **Deploy AgentCore resources** – Ensure your AgentCore agents, gateways, memory, identity, and built-in tool resources are deployed in the source accounts with observability enabled.


## How to set up cross-account monitoring

### Step 1: Configure the monitoring account

  * Open the [CloudWatch console](<https://console.aws.amazon.com/cloudwatch/>).

  * In the left navigation pane, choose **Settings**.

  * In the **Monitoring account configuration** section, choose **Configure**.

  * Select the telemetry types to share:

    * At minimum, select **Metrics** and **Logs** to enable AgentCore cross-account observability.

  * Complete the monitoring account setup wizard.


### Step 2: Link source accounts

Link your source accounts to the monitoring account using one of the following methods:

  * **AWS Organizations** (recommended) – Automatically links all accounts in your organization or organizational unit. New accounts are onboarded automatically.

  * **Individual account linking** – Use a CloudFormation template or URL to link specific accounts.


When configuring source accounts, ensure the same telemetry types selected in the monitoring account are also enabled in the source account.

For detailed instructions, see [Link monitoring accounts with source accounts](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account-Setup.html>).

### Step 3: View cross-account data in AgentCore Observability

  * Open the [AgentCore Observability console](<https://console.aws.amazon.com/cloudwatch/home#gen-ai-observability>) in your monitoring account.

  * The console automatically displays data from all linked source accounts.


## Set up cross-account monitoring using infrastructure as code

You can use AWS CloudFormation to configure cross-account observability programmatically using [CloudWatch Observability Access Manager (OAM)](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html>) resources.

For the required IAM permissions to create sinks and links, see [Necessary permissions](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account-Setup.html#Unified-Cross-Account-permissions-setup>).

### Monitoring account: Create a sink

In your monitoring account, create an OAM sink that accepts telemetry from source accounts.

You can scope the sink policy in one of the following ways:

  * **By organization (recommended)** – Use `aws:PrincipalOrgID` to allow all accounts in your AWS Organizations organization. This is the simplest approach and automatically includes new accounts added to the organization.

  * **By individual account IDs** – List specific source account IDs as principals. Use this approach if you need fine-grained control over which accounts can link.


**Option 1: Allow all accounts in an organization**

Replace `<your-org-id>` with your AWS Organizations organization ID (for example, `o-a1b2c3d4e5`).

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: OAM Sink for cross-account AgentCore Observability (organization-wide)

Resources:
  ObservabilitySink:
    Type: AWS::Oam::Sink
    Properties:
      Name: AgentCoreObservabilitySink
      Policy:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal: '*'
            Action:
              - 'oam:CreateLink'
              - 'oam:UpdateLink'
            Resource: '*'
            Condition:
              StringEquals:
                aws:PrincipalOrgID: '<your-org-id>'
              ForAllValues:StringEquals:
                oam:ResourceTypes:
                  - 'AWS::Logs::LogGroup'
                  - 'AWS::CloudWatch::Metric'
      Tags:
        Purpose: AgentCoreObservability

Outputs:
  SinkArn:
    Value: !GetAtt ObservabilitySink.Arn
    Description: Share this ARN with source accounts to create links
```
**Option 2: Allow specific source accounts**

Replace `<source-account-id-1>` and `<source-account-id-2>` with the AWS account IDs of your source accounts.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: OAM Sink for cross-account AgentCore Observability (specific accounts)

Resources:
  ObservabilitySink:
    Type: AWS::Oam::Sink
    Properties:
      Name: AgentCoreObservabilitySink
      Policy:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS:
                - '<source-account-id-1>'
                - '<source-account-id-2>'
            Action:
              - 'oam:CreateLink'
              - 'oam:UpdateLink'
            Resource: '*'
            Condition:
              ForAllValues:StringEquals:
                oam:ResourceTypes:
                  - 'AWS::Logs::LogGroup'
                  - 'AWS::CloudWatch::Metric'
      Tags:
        Purpose: AgentCoreObservability

Outputs:
  SinkArn:
    Value: !GetAtt ObservabilitySink.Arn
    Description: Share this ARN with source accounts to create links
```
### Source account: Create a link

In each source account, create an OAM link to the monitoring account’s sink. Replace `<sink-arn-from-monitoring-account>` with the sink ARN from the previous step.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: OAM Link for cross-account AgentCore Observability

Resources:
  ObservabilityLink:
    Type: AWS::Oam::Link
    Properties:
      LabelTemplate: '$AccountName'
      ResourceTypes:
        - 'AWS::Logs::LogGroup'
        - 'AWS::CloudWatch::Metric'
      SinkIdentifier: '<sink-arn-from-monitoring-account>'
      Tags:
        Purpose: AgentCoreObservability
```
To deploy this link across all member accounts in your organization, use AWS CloudFormation StackSets. For instructions, see [Link monitoring accounts with source accounts](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account-Setup.html>).

For more information about OAM resources, see the [AWS CloudFormation OAM resource reference](<https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Oam.html>).

## Filtering cross-account data

You can filter data by account in the sessions and traces tables:

  * Use the property filter in the table.

  * Select **Account ID** as the filter property.

  * Enter the source account ID to filter results to a specific account.


## Limitations

  * **Cross-account resource actions** – Some actions are unavailable for cross-account resources, such as navigating to the Bedrock console for resource details. You must sign in to the source account directly to perform these actions.

  * **OAM link required** – Cross-account data is only visible while the OAM link between the monitoring and source accounts is active. If the link is removed, cross-account data will no longer appear.

  * **Telemetry types** – Both the monitoring account and source account must have Metrics and Logs enabled for full AgentCore observability. If only a subset is shared, some data may be missing.

  * **Regional** – Cross-account observability works within a single AWS Region. The monitoring account and source accounts must be in the same Region.


## Related resources

  * [CloudWatch cross-account observability](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html>)

  * [Get started with AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-get-started.html>)

  * [View observability data for your Amazon Bedrock AgentCore agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-view.html>)

  * [Observability Access Manager API Reference](<https://docs.aws.amazon.com/OAM/latest/APIReference/Welcome.html>)



