# Enable CloudTrail data event logging for Amazon Bedrock AgentCore Gateway resources - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/enabling-cloudtrail-data-event-logging.html

---

# Enable CloudTrail data event logging for Amazon Bedrock AgentCore Gateway resources

You can use CloudTrail data events to get information about Amazon Bedrock AgentCore Gateway requests. To enable CloudTrail data events for Gateway, you must create a trail manually in CloudTrail backed by an Amazon S3 bucket.

**Key considerations**

  * Data event logging incurs additional charges. You must explicitly enable data events as they are not captured by default. Check to ensure that you have data events enabled for your account.

  * With a gateway that is generating a high workload, you could quickly generate thousands of logs in a short amount of time. Be mindful of how long you choose to enable CloudTrail data events for a busy Gateway.

  * CloudTrail stores gateway data event logs in an Amazon S3 bucket of your choosing. Consider using a bucket in a separate AWS account to better organize events from multiple resources into a central place for easier querying and analysis.


When you log data events for a trail in CloudTrail, you must use advanced event selectors to log data events for gateway operations.

###### Example

AWS CLI
    

  1. To enable CloudTrail data events for gateway resources using the AWS CLI, you can run the following command in a terminal:

```bash
aws cloudtrail put-event-selectors \
  --trail-name brac-gateway-canary-trail-prod-us-east-1 \
  --region us-east-1 \
  --advanced-event-selectors '[
    {
      "Name": "GatewayDataEvents",
      "FieldSelectors": [
        {
          "Field": "eventCategory",
          "Equals": ["Data"]
        },
        {
          "Field": "resources.type",
          "Equals": ["AWS::BedrockAgentCore::Gateway"]
        }
      ]
    }
  ]'
```
AWS CDK
    

  1. The following example demonstrates how to create a CloudTrail trail with AgentCore Gateway data events using the AWS CDK:

```python
import { Construct } from 'constructs';
import { Trail, CfnTrail } from 'aws-cdk-lib/aws-cloudtrail';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface DataEventTrailProps {
  /**
   * Whether to enable multi-region trail
   */
  isMultiRegionTrail?: boolean;

  /**
   * Whether to include global service events
   */
  includeGlobalServiceEvents?: boolean;

  /**
   * AWS region
   */
  region: string;

  /**
   * Environment account ID
   */
  account: string;
}

/**
 * Creates a CloudTrail trail configured to capture data events for Bedrock Agent Core Gateway
 */
export class BedrockAgentCoreDataEventTrail extends Construct {
  /**
   * The CloudTrail trail
   */
  public readonly trail: Trail;

  /**
   * The S3 bucket for CloudTrail logs
   */
  public readonly logsBucket: Bucket;

  constructor(scope: Construct, id: string, props: DataEventTrailProps) {
    super(scope, id);

    // Create S3 bucket for CloudTrail logs
    const bucketName = `brac-gateway-cloudtrail-logs-${props.account}-${props.region}`;
    this.logsBucket = new Bucket(this, 'CloudTrailLogsBucket', {
      bucketName,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Create trail name (suffixing region since regional trail)
    const trailName = `brac-gateway-trail-${props.region}`;

    // Add CloudTrail bucket policy
    this.logsBucket.addToResourcePolicy(
      new PolicyStatement({
        sid: 'AWSCloudTrailAclCheck',
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudtrail.amazonaws.com')],
        actions: ['s3:GetBucketAcl'],
        resources: [this.logsBucket.bucketArn],
        conditions: {
          StringEquals: {
            'aws:SourceArn': `arn:aws:cloudtrail:${props.region}:${props.account}:trail/${trailName}`,
          },
        },
      }),
    );

    this.logsBucket.addToResourcePolicy(
      new PolicyStatement({
        sid: 'AWSCloudTrailWrite',
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudtrail.amazonaws.com')],
        actions: ['s3:PutObject'],
        resources: [this.logsBucket.arnForObjects(`AWSLogs/${props.account}/*`)],
        conditions: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
            'aws:SourceArn': `arn:aws:cloudtrail:${props.region}:${props.account}:trail/${trailName}`,
          },
        },
      }),
    );

    // Create CloudTrail trail
    this.trail = new Trail(this, 'GatewayDataEventTrail', {
      trailName,
      bucket: this.logsBucket,
      isMultiRegionTrail: props.isMultiRegionTrail ?? false,
      includeGlobalServiceEvents: props.includeGlobalServiceEvents ?? true,
      enableFileValidation: true,
    });

    // Add advanced event selectors for Bedrock Agent Core Gateway data events
    const cfnTrail = this.trail.node.defaultChild as CfnTrail;

    // Define the advanced event selectors
    const advancedEventSelectors = [
      {
        // Log Bedrock Agent Core Gateway Data Events only
        fieldSelectors: [
          {
            field: 'eventCategory',
            equalTo: ['Data'],
          },
          {
            field: 'resources.type',
            equalTo: ['AWS::BedrockAgentCore::Gateway'],
          },
        ],
      },
    ];

    // Clear any existing event selectors and set advanced event selectors
    cfnTrail.eventSelectors = undefined;
    cfnTrail.advancedEventSelectors = advancedEventSelectors;
  }
}
```
