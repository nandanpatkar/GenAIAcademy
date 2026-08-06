/*
 * Amazon Connect — Amazon Connect Troubleshooting
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT TROUBLESHOOTING.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-troubleshooting",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Amazon Connect Troubleshooting",
  "provider": "Amazon Web Services",
  "level": "Advanced",
  "category": "Administration",
  "description": "Gathering information from the console and CLI, monitoring, and troubleshooting CCP errors, audio quality, contact flows, and routing.",
  "examFormat": "10 topics · ~44 min · 2 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT TROUBLESHOOTING.txt"
  ],
  "modules": [
    {
      "id": "connect-troubleshooting-t1",
      "number": 1,
      "title": "Overview of Amazon Connect",
      "shortTitle": "Overview of Amazon Connect",
      "summary": "Amazon Connect is an omnichannel cloud contact center that you can integrate with other enterprise applications, such as Salesforce. You can use…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "What is Amazon Connect?",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect icon."
            },
            {
              "type": "p",
              "text": "Amazon Connect is an omnichannel cloud contact center that you can integrate with other enterprise applications, such as Salesforce. You can use Amazon Connect with other AWS services to provide innovative new experiences for your customers."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "What are some benefits of Amazon Connect?",
          "blocks": [
            {
              "type": "p",
              "text": "Using Amazon Connect, you can use the power of artificial intelligence (AI) and machine learning (ML) to provide seamless customer service by voice or chat across multiple services quickly while increasing customer satisfaction."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Single application",
          "blocks": [
            {
              "type": "p",
              "text": "One application for workflows, agent management, routing, and experiences across all channels."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Dynamic, personal, and natural automated experiences",
          "blocks": [
            {
              "type": "p",
              "text": "Scale from tens to tens of thousands of agents to support your organization as it grows."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Decreased time to resolution",
          "blocks": [
            {
              "type": "p",
              "text": "Great customer and agent outcomes with AI and ML at the heart of every interaction."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Reporting",
          "blocks": [
            {
              "type": "p",
              "text": "Built-in real-time and historic analytics with secure, hassle-free access to your data."
            },
            {
              "type": "ul",
              "items": [
                "In addition to gathering configuration information, you will need diagnostic data from log files for troubleshooting.",
                "In addition to gathering configuration information, you will need diagnostic data from log files for troubleshooting."
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s7",
          "eyebrow": null,
          "duration": null,
          "title": "What are the important concepts and terminology to be aware of?",
          "blocks": [
            {
              "type": "p",
              "text": "To review concepts and terminology associated with Amazon Connect, expand each of the following eight sections."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Agent",
          "blocks": [
            {
              "type": "p",
              "text": "For Amazon Connect, an agent is the user who is logging into the contact control panel to handle calls as a representative of their company."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect is sitting between the telecom and agent side of the engagement, while also working to integrate with multiple AWS services."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Contact control panel or softphone",
          "blocks": [
            {
              "type": "p",
              "text": "Agents use the Amazon Connect contact control panel (CCP) to communicate with contacts. The CCP can also be referred to as a software phone (softphone)."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Agent side",
          "blocks": [
            {
              "type": "p",
              "text": "This refers to all internet traffic to the agent or the businesses network environment, which provides the agents with business applications and Amazon Connect communications."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Dual-tone multi-frequency",
          "blocks": [
            {
              "type": "p",
              "text": "Dual-tone multi-frequency (DTMF) refers to the sounds or tones generated by a telephone when the numbers are pressed on a dial pad, which can be used to capture or send input."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s13",
          "eyebrow": null,
          "duration": null,
          "title": "End customer",
          "blocks": [
            {
              "type": "p",
              "text": "The end customer is an individual or organization calling into your Amazon Connect instance."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s14",
          "eyebrow": null,
          "duration": null,
          "title": "Omnichannel",
          "blocks": [
            {
              "type": "p",
              "text": "An omnichannel is a unified contact experience across multiple communication channels, such as voice and chat."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s15",
          "eyebrow": null,
          "duration": null,
          "title": "Public switched telephone network or telecom",
          "blocks": [
            {
              "type": "p",
              "text": "A public switched telephone network (PSTN) is a carrier network consisting of multiple carriers working together."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t1-s16",
          "eyebrow": null,
          "duration": null,
          "title": "Session initiation protocol",
          "blocks": [
            {
              "type": "p",
              "text": "The session initiation protocol (SIP) is a signaling protocol used for initiating, maintaining, and ending communication sessions that include voice, video, and messaging applications."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t2",
      "number": 2,
      "title": "Gathering Information with the AWS Management Console",
      "shortTitle": "Gathering Information with the AWS Managemen…",
      "summary": "An architecture diagram provides a quick overview of your Amazon Connect deployment. Such diagrams can help you and your team understand the major…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Best practice: Use an architecture diagram",
          "blocks": [
            {
              "type": "p",
              "text": "An architecture diagram provides a quick overview of your Amazon Connect deployment. Such diagrams can help you and your team understand the major components. You can also visualize the request flow when troubleshooting certain issues. You can add any names and IDs necessary to quickly identify each component. To learn more about the components of this architecture, choose the numbered markers in the following diagram."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "How do I navigate the two Amazon Connect consoles?",
          "blocks": [
            {
              "type": "p",
              "text": "To begin the video, choose the play button. A transcript follows the video."
            },
            {
              "type": "p",
              "text": "Expand the following section to view the video transcript."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "How do I navigate the two Amazon Connect consoles?",
          "blocks": [
            {
              "type": "p",
              "text": "Sign in to the AWS Management Console and go to the Amazon Connect service console."
            },
            {
              "type": "p",
              "text": "To find Amazon Connect, choose the Services menu at the top of the AWS console."
            },
            {
              "type": "p",
              "text": "You can find Amazon Connect under the Services menu in the Business Applications section."
            },
            {
              "type": "p",
              "text": "You can also use the search box at the top of the AWS Management Console to search for Amazon Connect."
            },
            {
              "type": "p",
              "text": "Choose an instance alias in the Instances section to view more details and configuration options for that instance."
            },
            {
              "type": "p",
              "text": "To create a new instance, choose the Add an instance button."
            },
            {
              "type": "p",
              "text": "The Amazon Connect service dashboard is divided into two sections."
            },
            {
              "type": "p",
              "text": "The left section is the navigation menu. This menu will give you access to different configuration options for Amazon Connect."
            },
            {
              "type": "p",
              "text": "The right section is the details pane. This section will display various configuration information, links, and buttons based on the screen selected from the navigation menu."
            },
            {
              "type": "p",
              "text": "As with other AWS instance types, each Amazon Connect instance has its own instance dashboard. This can be accessed using the web address shown on the Account overview screen under Access information."
            },
            {
              "type": "p",
              "text": "The Amazon Connect instance dashboard is also divided into two sections, with a navigation menu on the left and a details pane on the right."
            },
            {
              "type": "p",
              "text": "Along the top of the dashboard, from left to right as highlighted, you will find the current user name, a log out button, a language selection menu, a softphone button, and a help button."
            },
            {
              "type": "p",
              "text": "Thank you for watching this demonstration!"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "How can the AWS console be used to find information on Amazon Connect?",
          "blocks": [
            {
              "type": "p",
              "text": "To begin the video, choose the play button. A transcript follows the video."
            },
            {
              "type": "p",
              "text": "Expand the following section to view the video transcript."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "How can the AWS console be used to find information on Amazon Connect?",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect service dashboard contains instance-level configurations and login access to the instance dashboard. Using the navigation menu, you can explore additional information for telephony, data storage, data streaming, contact flows, analytics tools, approved origins, customer profiles, wisdom, and voice ID."
            },
            {
              "type": "p",
              "text": "You can use the Amazon CloudWatch console to view log streams information. Navigate to the CloudWatch console, choose Log groups from the navigation menu, and choose the Amazon Connect instance you want to view the log stream for."
            },
            {
              "type": "p",
              "text": "The Amazon Connect instance dashboard will provide information such as analytics,"
            },
            {
              "type": "p",
              "text": "rules, routing configuration, user configuration, outbound campaigns or high volume outbound communication, also known as HVOC, if enabled, agent applications, and channels."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t3",
      "number": 3,
      "title": "Gathering Information Using the AWS CLI",
      "shortTitle": "Gathering Information Using the AWS CLI",
      "summary": "Amazon Connect commands can provide detailed information about metrics and alarms. You can use AWS Command Line Interface (AWS CLI) commands to…",
      "duration": "~5 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "How can I obtain information from Amazon Connect using the AWS CLI?",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect commands can provide detailed information about metrics and alarms. You can use AWS Command Line Interface (AWS CLI) commands to gather information about an Amazon Connect instance."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "How do I run AWS CLI commands?",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "1 AWS CLI greater-than sign aws connect [command].",
                "Example code from the AWS CLI; note that it is preceded by aws connect"
              ]
            },
            {
              "type": "p",
              "text": "Commands are run in the connect context of the AWS CLI. When running the following commands, use aws connect as a prefix. For more information about installing and using AWS CLI, see the Where can I find additional AWS CLI information? section at the end of this lesson."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "What are some examples of useful commands?",
          "blocks": [
            {
              "type": "p",
              "text": "For examples of some useful commands and their output, expand each of the following six sections. To visit the reference documentation for the selected command, choose the AWS CLI Command Reference link in each section."
            },
            {
              "type": "p",
              "text": "aws connect list-instances"
            },
            {
              "type": "p",
              "text": "You can use list-instances to return a list of instances that are in active state, creation-in-progress state, and failed state. Instances that aren’t successfully created (they are in a failed state) are returned only for 24 hours after the CreateInstance API was invoked."
            },
            {
              "type": "p",
              "text": "The following screenshot is the syntax available for the aws connect list-instances command. For more information about this command and text-based versions of the code response, see the AWS CLI Command Reference."
            },
            {
              "type": "p",
              "text": "aws connect describe-instance"
            },
            {
              "type": "p",
              "text": "You can use describe-instance to return the current state of the specified instance identifier. It tracks the instance while it is being created and returns an error status, if applicable."
            },
            {
              "type": "p",
              "text": "The following screenshot is the syntax available for the aws connect describe-instance command. For more information about this command and text-based versions of the code response, see the AWS CLI Command Reference."
            },
            {
              "type": "p",
              "text": "aws connect list-users"
            },
            {
              "type": "p",
              "text": "You can use list-users to provide summary information about the users for the specified Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "The following screenshot is the syntax available for the aws connect list-users command. For more information about this command and text-based versions of the code response, see the AWS CLI Command Reference."
            },
            {
              "type": "p",
              "text": "aws connect list-queues"
            },
            {
              "type": "p",
              "text": "You can use list-queues to provide information about the queues for the specified Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "The following screenshot is the syntax available for the aws connect list-queues command. For more information about this command and text-based versions of the code response, see the AWS CLI Command Reference."
            },
            {
              "type": "p",
              "text": "aws connect list-routing-profiles"
            },
            {
              "type": "p",
              "text": "You can use list-routing-profiles to provide summary information about the routing profiles for the specified Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "The following screenshot is the syntax available for the aws connect list-routing-profiles command. For more information about this command and text-based versions of the code response, see the AWS CLI Command Reference."
            },
            {
              "type": "p",
              "text": "aws connect list-phone-numbers-v2"
            },
            {
              "type": "p",
              "text": "You can use list-phone-numbers-v2 to list phone numbers claimed to your Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "The following screenshot is the syntax available for the aws connect list-phone-numbers-v2 command. For more information about this command and text-based versions of the code response, see the AWS CLI Command Reference."
            },
            {
              "type": "p",
              "text": "In addition to gathering configuration information, you will need diagnostic data from log files for troubleshooting."
            },
            {
              "type": "ul",
              "items": [
                "connect¶",
                "Description¶"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "Amazon Connect now refers to a portfolio of agentic solutions for business functions. The legacy product is now called Amazon Connect Customer, or simply Customer. The legacy name is used interchangeably in this documentation.",
                "Connect Customer Customer actions"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Connect Customer Customer data types"
            },
            {
              "type": "p",
              "text": "Connect Customer Customer engages customers at every touchpoint and creates deeper relationships with AI powered capabilities."
            },
            {
              "type": "p",
              "text": "Build and manage customer communication experiences. Connect customers to agents, enable intelligent routing, and track performance in real-time."
            },
            {
              "type": "p",
              "text": "There are limits to the number of Connect Customer resources that you can create. There are also limits to the number of requests that you can make per second. For more information, see Connect Customer Service Quotas in the Connect Customer Administrator Guide ."
            },
            {
              "type": "p",
              "text": "You can use an endpoint to connect programmatically to an Amazon Web Services service. For a list of Connect Customer endpoints, see Connect Customer Endpoints ."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Available Commands¶"
            },
            {
              "type": "ul",
              "items": [
                "activate-evaluation-form",
                "associate-analytics-data-set",
                "associate-approved-origin",
                "associate-bot",
                "associate-contact-with-user",
                "associate-default-vocabulary",
                "associate-email-address-alias",
                "associate-flow",
                "associate-hours-of-operations",
                "associate-instance-storage-config",
                "associate-lambda-function",
                "associate-lex-bot",
                "associate-phone-number-contact-flow",
                "associate-queue-email-addresses",
                "associate-queue-quick-connects",
                "associate-routing-profile-queues",
                "associate-security-key",
                "associate-security-profiles",
                "associate-traffic-distribution-group-user",
                "associate-user-proficiencies",
                "associate-workspace",
                "batch-associate-analytics-data-set",
                "batch-create-data-table-value",
                "batch-delete-data-table-value",
                "batch-describe-data-table-value",
                "batch-disassociate-analytics-data-set",
                "batch-get-attached-file-metadata",
                "batch-get-flow-association",
                "batch-put-contact",
                "batch-update-data-table-value",
                "claim-phone-number",
                "complete-attached-file-upload",
                "create-agent-status",
                "create-attached-file",
                "create-auth-code",
                "create-contact",
                "create-contact-flow",
                "create-contact-flow-module",
                "create-contact-flow-module-alias",
                "create-contact-flow-module-version",
                "create-contact-flow-version",
                "create-data-table",
                "create-data-table-attribute",
                "create-email-address",
                "create-evaluation-form",
                "create-hours-of-operation",
                "create-hours-of-operation-override",
                "create-instance",
                "create-integration-association",
                "create-notification",
                "create-participant",
                "create-persistent-contact-association",
                "create-predefined-attribute",
                "create-prompt",
                "create-push-notification-registration",
                "create-queue",
                "create-quick-connect",
                "create-routing-profile",
                "create-rule",
                "create-security-profile",
                "create-task-template",
                "create-test-case",
                "create-traffic-distribution-group",
                "create-use-case",
                "create-user",
                "create-user-hierarchy-group",
                "create-view",
                "create-view-version",
                "create-vocabulary",
                "create-workspace",
                "create-workspace-page",
                "deactivate-evaluation-form",
                "delete-attached-file",
                "delete-contact-data",
                "delete-contact-evaluation",
                "delete-contact-flow",
                "delete-contact-flow-module",
                "delete-contact-flow-module-alias",
                "delete-contact-flow-module-version",
                "delete-contact-flow-version",
                "delete-data-table",
                "delete-data-table-attribute",
                "delete-email-address",
                "delete-evaluation-form",
                "delete-hours-of-operation",
                "delete-hours-of-operation-override",
                "delete-instance",
                "delete-integration-association",
                "delete-notification",
                "delete-predefined-attribute",
                "delete-prompt",
                "delete-push-notification-registration",
                "delete-queue",
                "delete-quick-connect",
                "delete-routing-profile",
                "delete-rule",
                "delete-security-profile",
                "delete-session",
                "delete-task-template",
                "delete-test-case",
                "delete-traffic-distribution-group",
                "delete-use-case",
                "delete-user",
                "delete-user-hierarchy-group",
                "delete-view",
                "delete-view-version",
                "delete-vocabulary",
                "delete-workspace",
                "delete-workspace-media",
                "delete-workspace-page",
                "describe-agent-status",
                "describe-attached-files-configuration",
                "describe-authentication-profile",
                "describe-contact",
                "describe-contact-evaluation",
                "describe-contact-flow",
                "describe-contact-flow-module",
                "describe-contact-flow-module-alias",
                "describe-data-table",
                "describe-data-table-attribute",
                "describe-email-address",
                "describe-evaluation-form",
                "describe-hours-of-operation",
                "describe-hours-of-operation-override",
                "describe-instance",
                "describe-instance-attribute",
                "describe-instance-storage-config",
                "describe-notification",
                "describe-phone-number",
                "describe-predefined-attribute",
                "describe-prompt",
                "describe-queue",
                "describe-quick-connect",
                "describe-routing-profile",
                "describe-rule",
                "describe-security-profile",
                "describe-test-case",
                "describe-traffic-distribution-group",
                "describe-user",
                "describe-user-hierarchy-group",
                "describe-user-hierarchy-structure",
                "describe-view",
                "describe-vocabulary",
                "describe-workspace",
                "disassociate-analytics-data-set",
                "disassociate-approved-origin",
                "disassociate-bot",
                "disassociate-email-address-alias",
                "disassociate-flow",
                "disassociate-hours-of-operations",
                "disassociate-instance-storage-config",
                "disassociate-lambda-function",
                "disassociate-lex-bot",
                "disassociate-phone-number-contact-flow",
                "disassociate-queue-email-addresses",
                "disassociate-queue-quick-connects",
                "disassociate-routing-profile-queues",
                "disassociate-security-key",
                "disassociate-security-profiles",
                "disassociate-traffic-distribution-group-user",
                "disassociate-user-proficiencies",
                "disassociate-workspace",
                "dismiss-user-contact",
                "evaluate-data-table-values",
                "get-attached-file",
                "get-contact-attributes",
                "get-contact-metrics",
                "get-current-metric-data",
                "get-current-user-data",
                "get-effective-hours-of-operations",
                "get-evaluation-form-validation",
                "get-federation-token",
                "get-flow-association",
                "get-metric-data",
                "get-metric-data-v2",
                "get-prompt-file",
                "get-task-template",
                "get-test-case-execution-summary",
                "get-traffic-distribution",
                "import-phone-number",
                "import-workspace-media",
                "list-agent-statuses",
                "list-analytics-data-associations",
                "list-analytics-data-lake-data-sets",
                "list-approved-origins",
                "list-associated-contacts",
                "list-attached-files-configurations",
                "list-authentication-profiles",
                "list-bots",
                "list-child-hours-of-operations",
                "list-contact-evaluations",
                "list-contact-flow-module-aliases",
                "list-contact-flow-module-versions",
                "list-contact-flow-modules",
                "list-contact-flow-versions",
                "list-contact-flows",
                "list-contact-references",
                "list-data-table-attributes",
                "list-data-table-primary-values",
                "list-data-table-values",
                "list-data-tables",
                "list-default-vocabularies",
                "list-entity-security-profiles",
                "list-evaluation-form-versions",
                "list-evaluation-forms",
                "list-flow-associations",
                "list-hours-of-operation-overrides",
                "list-hours-of-operations",
                "list-instance-attributes",
                "list-instance-storage-configs",
                "list-instances",
                "list-integration-associations",
                "list-lambda-functions",
                "list-lex-bots",
                "list-notifications",
                "list-phone-numbers",
                "list-phone-numbers-v2",
                "list-predefined-attributes",
                "list-prompts",
                "list-queue-email-addresses",
                "list-queue-quick-connects",
                "list-queues",
                "list-quick-connects",
                "list-realtime-contact-analysis-segments-v2",
                "list-routing-profile-manual-assignment-queues",
                "list-routing-profile-queues",
                "list-routing-profiles",
                "list-rules",
                "list-security-keys",
                "list-security-profile-applications",
                "list-security-profile-flow-modules",
                "list-security-profile-permissions",
                "list-security-profiles",
                "list-tags-for-resource",
                "list-task-templates",
                "list-test-case-execution-records",
                "list-test-case-executions",
                "list-test-cases",
                "list-traffic-distribution-group-users",
                "list-traffic-distribution-groups",
                "list-use-cases",
                "list-user-hierarchy-groups",
                "list-user-notifications",
                "list-user-proficiencies",
                "list-users",
                "list-view-versions",
                "list-views",
                "list-workspace-media",
                "list-workspace-pages",
                "list-workspaces",
                "monitor-contact",
                "pause-contact",
                "put-user-status",
                "release-phone-number",
                "replicate-instance",
                "resume-contact",
                "resume-contact-recording",
                "search-agent-statuses",
                "search-available-phone-numbers",
                "search-contact-evaluations",
                "search-contact-flow-modules",
                "search-contact-flows",
                "search-contacts",
                "search-data-tables",
                "search-email-addresses",
                "search-evaluation-forms",
                "search-hours-of-operation-overrides",
                "search-hours-of-operations",
                "search-notifications",
                "search-predefined-attributes",
                "search-prompts",
                "search-queues",
                "search-quick-connects",
                "search-resource-tags",
                "search-routing-profiles",
                "search-rules",
                "search-security-profiles",
                "search-test-cases",
                "search-user-hierarchy-groups",
                "search-users",
                "search-views",
                "search-vocabularies",
                "search-workspace-associations",
                "search-workspaces",
                "send-chat-integration-event",
                "send-outbound-email",
                "send-outbound-web-notification",
                "start-attached-file-upload",
                "start-chat-contact",
                "start-contact-conversational-analytics-job",
                "start-contact-evaluation",
                "start-contact-media-processing",
                "start-contact-recording",
                "start-contact-streaming",
                "start-email-contact",
                "start-evaluation-form-validation",
                "start-outbound-chat-contact",
                "start-outbound-email-contact",
                "start-outbound-voice-contact",
                "start-screen-sharing",
                "start-task-contact",
                "start-test-case-execution",
                "start-web-rtc-contact",
                "stop-contact",
                "stop-contact-media-processing",
                "stop-contact-recording",
                "stop-contact-streaming",
                "stop-test-case-execution",
                "submit-contact-evaluation",
                "suspend-contact-recording",
                "tag-contact",
                "tag-resource",
                "transfer-contact",
                "untag-contact",
                "untag-resource",
                "update-agent-status",
                "update-attached-files-configuration",
                "update-authentication-profile",
                "update-contact",
                "update-contact-attributes",
                "update-contact-evaluation",
                "update-contact-flow-content",
                "update-contact-flow-metadata",
                "update-contact-flow-module-alias",
                "update-contact-flow-module-content",
                "update-contact-flow-module-metadata",
                "update-contact-flow-name",
                "update-contact-routing-data",
                "update-contact-schedule",
                "update-data-table-attribute",
                "update-data-table-metadata",
                "update-data-table-primary-values",
                "update-email-address-metadata",
                "update-evaluation-form",
                "update-hours-of-operation",
                "update-hours-of-operation-override",
                "update-instance-attribute",
                "update-instance-storage-config",
                "update-notification-content",
                "update-participant-authentication",
                "update-participant-role-config",
                "update-phone-number",
                "update-phone-number-metadata",
                "update-predefined-attribute",
                "update-prompt",
                "update-queue-hours-of-operation",
                "update-queue-max-contacts",
                "update-queue-name",
                "update-queue-outbound-caller-config",
                "update-queue-outbound-email-config",
                "update-queue-status",
                "update-quick-connect-config",
                "update-quick-connect-name",
                "update-routing-profile-agent-availability-timer",
                "update-routing-profile-concurrency",
                "update-routing-profile-default-outbound-queue",
                "update-routing-profile-name",
                "update-routing-profile-queues",
                "update-rule",
                "update-security-profile",
                "update-task-template",
                "update-test-case",
                "update-traffic-distribution",
                "update-user-config",
                "update-user-hierarchy",
                "update-user-hierarchy-group-name",
                "update-user-hierarchy-structure",
                "update-user-identity-info",
                "update-user-notification-status",
                "update-user-phone-config",
                "update-user-proficiencies",
                "update-user-routing-profile",
                "update-user-security-profiles",
                "update-view-content",
                "update-view-metadata",
                "update-workspace-metadata",
                "update-workspace-page",
                "update-workspace-theme",
                "update-workspace-visibility"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t4",
      "number": 4,
      "title": "Monitoring Amazon Connect",
      "shortTitle": "Monitoring Amazon Connect",
      "summary": "You should collect monitoring data from all the parts of your AWS solution to help you troubleshoot a multi-point failure if one occurs. Before…",
      "duration": "~5 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Why is monitoring important for troubleshooting?",
          "blocks": [
            {
              "type": "p",
              "text": "You should collect monitoring data from all the parts of your AWS solution to help you troubleshoot a multi-point failure if one occurs. Before you start monitoring Amazon Connect, however, you should create a monitoring plan. That plan should answer the following questions:"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "How can I monitor Amazon Connect resources?",
          "blocks": [
            {
              "type": "p",
              "text": "You can monitor your Amazon Connect resources by using Amazon CloudWatch. CloudWatch collects and processes raw data from Amazon Connect into readable and near real-time metrics. Amazon Connect metric data is automatically sent to CloudWatch in 1-minute periods."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Monitor and trigger alerts using Amazon CloudWatch for Amazon Connect"
            },
            {
              "type": "p",
              "text": "To learn more about monitoring Amazon Connect and initiating alerts with CloudWatch, choose the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to blog"
            },
            {
              "type": "p",
              "text": "With CloudWatch, you gain system-wide visibility into resource utilization, application performance, and operational health."
            },
            {
              "type": "p",
              "text": "With CloudWatch, you gain system-wide visibility into resource utilization, application performance, and operational health."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "What is CloudWatch?",
          "blocks": [
            {
              "type": "p",
              "text": "You can create CloudWatch alarms to monitor key instance metrics to alert you when their status changes. An alarm will monitor a singular metric change state over a given period of time, changing state when the value threshold goes over a specified value a number of times within the monitored period. On state change, the alarm can then undertake actions, with the primary use case to notify users over multiple channels configured by Amazon Simple Notification Service (Amazon SNS)."
            },
            {
              "type": "p",
              "text": "In addition to using alarms, you can also create customized dashboards within CloudWatch to obtain a centralized overview of all key Amazon Connect metrics. This presents graphed data so you can analyze and discover trends within your resource usage."
            },
            {
              "type": "p",
              "text": "For more information about CloudWatch, choose the following button."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "What is Amazon CloudWatch?",
          "blocks": [
            {
              "type": "p",
              "text": "CloudWatch monitors your AWS resources and the applications you run on AWS in real time. To learn more, choose the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to doc"
            },
            {
              "type": "p",
              "text": "Amazon Connect supports CloudWatch logging in the form of contact flow execution logs. These logs include the execution events and outcomes of a call through your contact flows so you can identify the exact flow of a given call, and any errors it encountered through its interaction. For more information about CloudWatch or Amazon Connect flow logs, choose each of the following two buttons."
            },
            {
              "type": "p",
              "text": "For more information about CloudWatch logging and what data is gathered in flow logs, choose the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Track events as customers interact with flows"
            },
            {
              "type": "p",
              "text": "Amazon Connect Flow logs provide you with real-time details about events in your flows as customers interact with them. To learn more, choose the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to doc"
            },
            {
              "type": "p",
              "text": "What types of monitoring metrics can I gather?"
            },
            {
              "type": "p",
              "text": "You can use the metrics available within the AWS/Connect namespace to monitor Amazon Connect. The following are key metrics that will be used most during troubleshooting."
            },
            {
              "type": "p",
              "text": "Expand the following section to view the key metrics for Amazon Connect."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Key metrics",
          "blocks": [
            {
              "type": "p",
              "text": "**Note: Screen readers should enter table mode to read the table below."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Key Metrics"
            },
            {
              "type": "p",
              "text": "Description ConcurrentCallsPercentage The percentage of the concurrent active voice calls service quota used in the instance. This is calculated by the following:"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Unit: Percent (output displays as a decimal)",
          "blocks": [
            {
              "type": "p",
              "text": "Dimensions:"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s7",
          "eyebrow": null,
          "duration": null,
          "title": "MetricGroup: VoiceCalls",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "ConcurrentActiveChatsPercentage"
            },
            {
              "type": "p",
              "text": "The percentage of the concurrent active chats service quota used in the instance. This is calculated by the following:"
            },
            {
              "type": "ul",
              "items": [
                "ConcurrentActiveChats / ConfiguredConcurrentActiveChatsLimit",
                "Where ConfiguredConcurrentActiveChatsLimit is the Concurrent active chats per instance configured for your instance."
              ]
            },
            {
              "type": "p",
              "text": "Unit: Percent (Output displays as an integer. For example, 1% of chats is shown as 1, not as 0.01.)"
            },
            {
              "type": "p",
              "text": "Dimensions:"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s8",
          "eyebrow": null,
          "duration": null,
          "title": "MetricGroup: Chats",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "ContactFlowErrors"
            },
            {
              "type": "p",
              "text": "The number of times the error branch for a flow was run."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Unit: Count"
            },
            {
              "type": "p",
              "text": "Dimensions:"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s9",
          "eyebrow": null,
          "duration": null,
          "title": "ContactFlowName: The name of your flow",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "ToInstancePacketLossRate"
            },
            {
              "type": "p",
              "text": "The ratio of packet loss for calls in the instance, reported every 10 seconds. Each data point is between 0 and 1, which represents the ratio of packets lost for the instance."
            },
            {
              "type": "p",
              "text": "Unit: Percent"
            },
            {
              "type": "p",
              "text": "Dimensions:"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Stream Type: Voice",
          "blocks": [
            {
              "type": "p",
              "text": "For a full list of available metrics with additional information, choose the following button."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Monitoring your instance using CloudWatch",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect sends data about your instance to CloudWatch metrics so that you can collect, view, and analyze CloudWatch metrics for your Amazon Connect virtual contact center. To learn more about monitoring, choose the following button."
            },
            {
              "type": "p",
              "text": "go to doc"
            },
            {
              "type": "p",
              "text": "You can use AWS CloudTrail to view, search, download, archive, analyze, and respond to account activity across your AWS infrastructure."
            },
            {
              "type": "p",
              "text": "You can use AWS CloudTrail to view, search, download, archive, analyze, and respond to account activity across your AWS infrastructure."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s12",
          "eyebrow": null,
          "duration": null,
          "title": "How can I monitor Amazon Connect using CloudTrail?",
          "blocks": [
            {
              "type": "p",
              "text": "With CloudTrail, you can monitor the invocation of any Amazon Connect APIs, providing you a record of API actions taken by a user, role, or another AWS service. This provides you insight into where and when changes to your instance were made when an API has been directly called."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Logging Amazon Connect API calls with AWS CloudTrail"
            },
            {
              "type": "p",
              "text": "To learn more, choose the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to Admin Guide"
            },
            {
              "type": "ul",
              "items": [
                "Amazon Connect API Reference",
                "To learn more, choose the following button."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to API doc"
            },
            {
              "type": "p",
              "text": "What information can be found in the Amazon Connect instance dashboard?"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t4-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect metrics dashboard",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect offers real-time and historical metrics within the instance, which track call, chat, and task metrics in relation to a given queue, routing profile, or agent."
            },
            {
              "type": "p",
              "text": "Real-time metrics can provide you visibility into the current state of your instance and identify any possible capacity issues before they occur. With historical metrics, you can review past datasets of your instance to identify any trends."
            },
            {
              "type": "p",
              "text": "The real-time metrics dashboard is found on the navigation menu under Reporting."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t5",
      "number": 5,
      "title": "General Problem Determination",
      "shortTitle": "General Problem Determination",
      "summary": "To learn about the general steps to follow for problem determination, expand each of the following seven sections.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "How do I determine my problem?",
          "blocks": [
            {
              "type": "p",
              "text": "To learn about the general steps to follow for problem determination, expand each of the following seven sections."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Problem determination",
          "blocks": [
            {
              "type": "p",
              "text": "Many problems are common and well documented so that identification of the issue based on symptoms and the solution are straightforward. Here are the first steps to follow when troubleshooting a problem."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Identify the problem",
          "blocks": [
            {
              "type": "p",
              "text": "Try to categorize the problem based on characteristic symptoms:"
            },
            {
              "type": "ul",
              "items": [
                "What error messages is the administrator seeing on the console or in log files?",
                "Are customers getting error messages in their browsers?",
                "What messages or error codes are users getting?"
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Collect data",
          "blocks": [
            {
              "type": "p",
              "text": "Gather diagnostic data after the fact or reproduce the problem to gather logs, trace data, and so forth. If you have various logging, tracing, and monitoring features turned on for your service, then you will have diagnostic data available when a problem occurs."
            },
            {
              "type": "p",
              "text": "Otherwise, you might have to set up these diagnostic features and reproduce the problem, if possible."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Analyze the data",
          "blocks": [
            {
              "type": "p",
              "text": "Analyze data to pinpoint one or more possible root causes. Sometimes you can manually search the relevant log files and tracing data."
            },
            {
              "type": "p",
              "text": "For large amounts of diagnostic data, it might be helpful to use tools for analyzing data such as the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Athena"
            },
            {
              "type": "ul",
              "items": [
                "CloudWatch Logs Insights",
                "Splunk",
                "Sumo Logic"
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Review documentation",
          "blocks": [
            {
              "type": "p",
              "text": "Search the product and service documentation for known issues and solutions. Start by exploring the multiple resources provided throughout this course."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Try known solutions",
          "blocks": [
            {
              "type": "p",
              "text": "Apply the documented solutions (one at a time) and test. If there are a series of proposed fixes, apply them one at a time and test until the problem is fixed."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t5-s8",
          "eyebrow": null,
          "duration": null,
          "title": "What else can I try?",
          "blocks": [
            {
              "type": "p",
              "text": "If you exhaust all the known issues and solutions without success, try the following:"
            },
            {
              "type": "p",
              "text": "Post your issue to AWS re:Post. AWS re:Post is a community-driven, question-and-answer service to help AWS customers remove technical roadblocks and troubleshoot problems."
            },
            {
              "type": "ul",
              "items": [
                "Engage with AWS IQ to post a request for help by an AWS Certified expert. Pay through AWS.",
                "Subscribe to an AWS Support Plan and open a case.",
                "Select a support plan that meets your needs. Compare AWS Support Plans.",
                "You can submit your case, along with any data you gathered."
              ]
            },
            {
              "type": "p",
              "text": "In the remaining lessons in this course, you will learn how to apply this methodology to potential Amazon Connect issues you might encounter."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t6",
      "number": 6,
      "title": "Troubleshooting Agent CCP Errors",
      "shortTitle": "Troubleshooting Agent CCP Errors",
      "summary": "Contact control panel (CCP) logs can be downloaded and used for troubleshooting. Continue to learn where to download the log files and what…",
      "duration": "~7 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "How does Mateo download CCP logs?",
          "blocks": [
            {
              "type": "p",
              "text": "Contact control panel (CCP) logs can be downloaded and used for troubleshooting. Continue to learn where to download the log files and what information they contain."
            },
            {
              "type": "p",
              "text": "Mateo, an AnyCompany SysOps administrator, is new to the communications team and needs to learn how to troubleshoot issues with Amazon Connect when they come up."
            },
            {
              "type": "p",
              "text": "In this lesson, you will learn with Mateo about the logs available and how to troubleshoot common issues with CCP."
            },
            {
              "type": "p",
              "text": "To download CCP logs, perform the following:"
            },
            {
              "type": "p",
              "text": "On the agent's desktop, in their CCP, choose Settings."
            },
            {
              "type": "p",
              "text": "If needed, open the agent's CCP by choosing the phone icon from the top-right corner of the Amazon Connect dashboard."
            },
            {
              "type": "p",
              "text": "Choose Download logs on the bottom-left corner of the Settings screen. The agent-log.txt file is saved to the browser's default download directory."
            },
            {
              "type": "p",
              "text": "After the file is downloaded, Mateo can rename the file the same way he renames any other file on his computer. The file name can't be customized before the file is downloaded."
            },
            {
              "type": "p",
              "text": "The log file contains information about his instance, local browser configuration as it relates to Amazon Connect, and other important information to assist AWS Support Engineers when working on a support case."
            },
            {
              "type": "p",
              "text": "It is important to attach the CCP log file when opening a support case."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s2",
          "eyebrow": null,
          "duration": null,
          "title": "What are the common errors Mateo might encounter in CCP?",
          "blocks": [
            {
              "type": "p",
              "text": "Common errors Mateo might encounter while using CCP are typically related to web browser permissions or network connectivity issues. During troubleshooting, he should determine the scope of the issue and how many machines are affected. Is the issue isolated to a single computer, multiple computers, or an entire physical site?"
            },
            {
              "type": "p",
              "text": "Determining scope will help him narrow down his troubleshooting efforts. While scenarios such as Active Directory are outside the scope of this course, note that Group Policies could both assist and cause issues related to web browser settings, permissions, and local workstation firewall rules."
            },
            {
              "type": "p",
              "text": "If the issue is site-wide, Mateo should evaluate the network infrastructure's outbound firewall rules to ensure web traffic is allowed to pass to AnyCompany's Amazon Connect instance."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Set up your network"
            },
            {
              "type": "p",
              "text": "To learn more about network requirements and recommended allow rules, choose the following button."
            },
            {
              "type": "p",
              "text": "go to Admin Guide"
            },
            {
              "type": "p",
              "text": "To learn more about the common errors Mateo might notice in CCP, expand each of the following four sections."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Symptom 1 – Microphone is not accessible",
          "blocks": [
            {
              "type": "p",
              "text": "The Microphone is not accessible error is seen in a red banner at the top of CCP. This error is typically related to the browser blocking access to the microphone or, in the case of a removable microphone, the microphone is not connected to or recognized by the computer. The agent-log.txt file will display a logged error containing \"Softphone error occurred : microphone_not_shared Your microphone is not enabled in your browser.\""
            },
            {
              "type": "p",
              "text": "Search the settings of the browser for microphone and look for site settings related to the Amazon Connect web address to allow microphone access. For more tips on troubleshooting, choose the button for Can't hear caller or caller can't hear agent? following this section."
            },
            {
              "type": "p",
              "text": "The following screenshot displays an Amazon Connect CCP window with a red banner displaying the microphone error on the left and an example agent-log.txt file showing the logged microphone_not_shared error on the right."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Symptom 2 – ice_collection_timeout or WebRTC issue",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo might notice a red banner at the top of CCP with an error about ice_collection_timeout or a WebRTC error. He might also notice one of the following errors in the agent-log.txt file:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "SESSION ICE collection timed out"
            },
            {
              "type": "ul",
              "items": [
                "SESSION No ICE candidate",
                "SESSION Amazon ConnectSignalingAndIceCollectionState => FailedState",
                "Softphone error occurred : ice_collection_timeout Ice collection timed out.",
                "Softphone error occurred : webrtc_error webrtc system error."
              ]
            },
            {
              "type": "p",
              "text": "There is a networking error stemming from the agent's network, blocking communication between the agent's CCP and the Amazon Connect service on UDP port 3478."
            },
            {
              "type": "p",
              "text": "The following screenshot displays an Amazon Connect CCP window with a red banner displaying the ice_collection_timeout or WebRTC issue error on the left, and an example agent-log.txt file showing the logged error messages on the right."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Symptom 3 – Softphone call failed",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo might notice a red banner at the top of CCP with a Softphone call failed error. He might also notice one of the following errors in the agent-log.txt file:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "SESSION Failed handshaking with signaling server Timeout"
            },
            {
              "type": "p",
              "text": "SESSION InviteAnswerState => FailedState"
            },
            {
              "type": "p",
              "text": "Softphone error occurred : signaling_handshake_failure Handshaking with Signaling Server wss://rtc.connect-telecom.us-west-2.amazonaws.com/LilyRTC failed."
            },
            {
              "type": "p",
              "text": "Causes:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Possible network failure from the agent's workstation"
            },
            {
              "type": "p",
              "text": "High load on the agent's computer"
            },
            {
              "type": "p",
              "text": "The firewall does not allow outbound traffic on TCP port 443 to the Amazon Connect Persistent Amazon Connection Service endpoint"
            },
            {
              "type": "p",
              "text": "Network congestion"
            },
            {
              "type": "p",
              "text": "The following screenshot displays an Amazon Connect CCP window with a red banner displaying the Softphone call failed error on the left and an example agent-log.txt file showing the logged error messages on the right."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Symptom 4 – Initialization Failed",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo might notice a red banner at the top of CCP with an Initialization Failed error. He might also notice one of the following errors in the agent-log.txt file:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "ERROR: WebSocketManager Error, error_event: {\"isTrusted\":true}"
            },
            {
              "type": "ul",
              "items": [
                "INFO: Fetching new WebSocket Amazon Connection configuration",
                "TRACE: AWSClient: → 'createTransport'",
                "INFO: Socket Amazon Connection is closed [object CloseEvent]",
                "DEBUG: [webSocketOnClose before-cleanup] Primary WebSocket: CLOSED | Secondary WebSocket: NULL"
              ]
            },
            {
              "type": "p",
              "text": "WARN: Neither primary websocket and nor secondary websocket have open Amazon Connections, attempting to re-establish Amazon Connection"
            },
            {
              "type": "ul",
              "items": [
                "ERROR: getWebSocketUrl failed",
                "TRACE: AWSClient: ← 'createTransport' failed"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "TRACE: Publishing event: webSocket::init_failure"
            },
            {
              "type": "p",
              "text": "ERROR: Failed to fetch webSocket Amazon Connection configuration {\"reason\":\"getWebSocketUrl failed\",\"_debug\":{\"type\":\"QuotaExceededException\", ...}}"
            },
            {
              "type": "ul",
              "items": [
                "ERROR: WebSocket Initialization failed",
                "Causes:"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Possible network failure from agent's workstation"
            },
            {
              "type": "p",
              "text": "High load on the agent's computer"
            },
            {
              "type": "p",
              "text": "The firewall does not allow outbound traffic on TCP port 443 to Amazon Connect Persistent Amazon Connection Service endpoint"
            },
            {
              "type": "p",
              "text": "The number of WebSocket Amazon Connections exceeded the limit (five by default)"
            },
            {
              "type": "p",
              "text": "The following screenshot displays an Amazon Connect CCP window with a red banner displaying the Initialization Failed error on the left and an example agent-log.txt file showing the logged error messages on the right."
            },
            {
              "type": "p",
              "text": "The preceding issues share the same troubleshooting and resolution path:"
            },
            {
              "type": "p",
              "text": "Check network related issues within the agent's workstation."
            },
            {
              "type": "p",
              "text": "Check resource usage (CPU, RAM, and the like) on the agent's workstation and that they meet minimum requirements. Choose the following Workstation minimum requirements button for more information."
            },
            {
              "type": "p",
              "text": "Check firewall settings on the device to confirm UDP traffic on port 3478 and TCP traffic on port 443 is open to traffic to the Amazon Connect Softphone Media endpoint. Choose the preceding Set up your network button for more information."
            },
            {
              "type": "p",
              "text": "Review the company network infrastructure such as virtual private networks (VPNs) and firewall implementations to ensure that they are allowing traffic to the Amazon Connect Softphone Media endpoint."
            },
            {
              "type": "p",
              "text": "Can't hear caller or caller can't hear agent?"
            },
            {
              "type": "p",
              "text": "To learn more about microphone issues, choose the following button."
            },
            {
              "type": "p",
              "text": "go to Admin Guide"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Workstation minimum requirements"
            },
            {
              "type": "p",
              "text": "To learn more about workstation requirements, choose the following button."
            },
            {
              "type": "ul",
              "items": [
                "go to Admin Guide",
                "What resources are available to Mateo for troubleshooting CCP?"
              ]
            },
            {
              "type": "p",
              "text": "In most use cases, the errors presented to agents are caused by networking issues from either their workstation configuration or company network. To address these cases, Mateo should become familiar with the CCP Networking documentation to understand the ports and endpoints the CCP uses."
            },
            {
              "type": "p",
              "text": "To identify these errors from log events and more clearly match these events to the previous samples, Maeto should use the CCP Log Parser tool by dragging and dropping his CCP files into the tool and sorting logs accordingly. He can also use the Endpoint Test Utility tool to perform port validations from their browser."
            },
            {
              "type": "p",
              "text": "For further guidance on how to understand and address these errors, aligning them with the correct endpoints and ports, choose the following buttons: How do I troubleshoot Amazon Connect CCP softphone errors? and Common Contact Control Panel (CCP) Issues."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Where can Mateo find additional resources?",
          "blocks": [
            {
              "type": "p",
              "text": "To access additional resource on gathering information, choose the following buttons."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t6-s8",
          "eyebrow": null,
          "duration": null,
          "title": "CCP Log Parser tool",
          "blocks": [
            {
              "type": "p",
              "text": "To learn more, choose the following button."
            },
            {
              "type": "p",
              "text": "go to tool"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Endpoint Test Utility tool"
            },
            {
              "type": "p",
              "text": "To learn more, choose the following button."
            },
            {
              "type": "p",
              "text": "go to Admin Guide"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Common Contact Control Panel (CCP) Issues"
            },
            {
              "type": "p",
              "text": "To learn more, choose the following button."
            },
            {
              "type": "ul",
              "items": [
                "go to Admin Guide",
                "How do I troubleshoot Amazon Connect CCP softphone errors?",
                "To learn more, choose the following button."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t7",
      "number": 7,
      "title": "Troubleshooting Audio Quality Issues",
      "shortTitle": "Troubleshooting Audio Quality Issues",
      "summary": "Mateo's agents report frequent audio issues that make understanding callers difficult and can sometimes cause frustration for the caller.",
      "duration": "~7 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t7-s1",
          "eyebrow": null,
          "duration": null,
          "title": "How should Mateo address audio issues?",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo's agents report frequent audio issues that make understanding callers difficult and can sometimes cause frustration for the caller."
            },
            {
              "type": "p",
              "text": "Follow along as Mateo learns about some of the common audio issues and resolutions that will restore clear conversations in no time."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s2",
          "eyebrow": null,
          "duration": null,
          "title": "What are the common audio quality scenarios Mateo's agents might see?",
          "blocks": [
            {
              "type": "p",
              "text": "Agents might experience issues with the following scenarios:"
            },
            {
              "type": "ul",
              "items": [
                "Poor audio quality – Users hear static or crackling sounds, garbled audio, or echoes.",
                "Delayed audio – The customer hears the agent's audio after significant delays.",
                "One-way audio – The agent can hear the customer but the customer cannot hear the agent.",
                "No audio – The agent and customer cannot hear each other.",
                "Audio drop-outs – The audio is lost during an ongoing call.",
                "What data should Mateo collect?"
              ]
            },
            {
              "type": "p",
              "text": "In addition to collecting the CCP agent log file, Mateo should collect audio samples to assist with troubleshooting and attaching to a support case if he plans to open one."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Download recordings or transcripts of past conversations",
          "blocks": [
            {
              "type": "p",
              "text": "To learn more about downloading audio files and transcripts, choose the following button."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Go to Admin Guide",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon connect call audio and recording diagram showing the call from from the PSTN side (left-channel audio) through Amazon Connect and related services (where audio recording is captured), and finally to the agent side (right-channel audio)"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s5",
          "eyebrow": null,
          "duration": null,
          "title": "How does Mateo analyze the data?",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo begins the process by listening to call recordings to understand where the reported issues are: on the PSTN side or on the agent side. A call recording will hold two separate channels of audio. The left channel will be the caller and the PSTN network while the right channel will be the agent side. By reviewing the audio file first, Mateo can narrow down the time stamp of the reported issue, which will help him to filter the agent log file or network logs more accurately."
            },
            {
              "type": "p",
              "text": "To more accurately analyze these recordings, Mateo can use a third-party tool such as Audacity, which lets him separate these channels and visualize the audio, as seen in the screenshot."
            },
            {
              "type": "p",
              "text": "If the issue is on the right channel (agent side), then he should review the WebRTC metrics within the CCP logs captured from the agents to identify possible networking issues. To analyze CCP logging, he can use the CCP Log Parser tool mentioned in the previous lesson."
            },
            {
              "type": "p",
              "text": "Using this tool, he can filter down log sets to outline when and why errors occurred. He can also review key audio quality metrics to understand the agent's experience during a given call."
            },
            {
              "type": "p",
              "text": "When reviewing specific logs, he can filter down to the ERROR type and select specific logged events to learn more about what they indicate and a potential issue they might represent."
            },
            {
              "type": "p",
              "text": "Most important, when investigating audio quality issues, Mateo should use the Metrics tab at the top of the CCP Log Parser page to investigate the local behavior registered for a call."
            },
            {
              "type": "p",
              "text": "These metrics are broken into the following sections:"
            },
            {
              "type": "p",
              "text": "Skew – Represents the time sync between the agent's workstation and the Amazon Connect backend service"
            },
            {
              "type": "p",
              "text": "API Call – The latency for various API calls made by the CCP, providing insight into the networking conditions of the agent"
            },
            {
              "type": "ul",
              "items": [
                "WebRTC Metrics – Call quality metrics only captured when a call is ongoing and broken into the following:",
                "audio_input – The customer's audio being received by the agent's CCP from Amazon Connect",
                "audio_output – The agent's audio captured by the CCP and sent to Amazon Connect",
                "These values should be investigated on a per-call basis against the following nominal values:"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Metric"
            },
            {
              "type": "ul",
              "items": [
                "Nominal Value",
                "Common Checks",
                "Possible Cause"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "(Ordered by Likelihood)"
            },
            {
              "type": "p",
              "text": "Packets Out 49–51 Commonly 50 packets per second should be sent. If this is low, review Packet Loss. 1. Networking issues"
            },
            {
              "type": "ul",
              "items": [
                "2. Agent hardware",
                "3. Browser and extensions",
                "4. Application compatibility",
                "5. CCP",
                "Packet Loss 0 Value is not higher than 0."
              ]
            },
            {
              "type": "p",
              "text": "Jitter Buffer < 30 ms Value is consistent and not fluctuating by high values frequently. Value is less than 30 ms."
            },
            {
              "type": "p",
              "text": "Round Trip Time < 300 ms Value is consistent and not fluctuating by high values frequently. Value is less than 300 ms."
            },
            {
              "type": "p",
              "text": "Audio Level > 1,000 Value fluctuates between 1 and multiple thousand values. This will fluctuate as the person stops and starts speaking. 1. Headset issues"
            },
            {
              "type": "ul",
              "items": [
                "2. Browser and extensions",
                "3. Application compatibility",
                "Investigate the cause of these abnormal values. Potential causes are shared in the following section.",
                "Investigate the cause of these abnormal values. Potential causes are shared in the following section."
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s6",
          "eyebrow": null,
          "duration": null,
          "title": "What are the symptoms, root causes, and resolutions?",
          "blocks": [
            {
              "type": "p",
              "text": "Identifying an abnormal value or behavior provides a basis to identify that the issue is stemming from the agent's side of the call. It helps understanding what influence might be causing the audio quality issues. You should then investigate the cause of these abnormal values. Potential causes are shared as follows."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s7",
          "eyebrow": null,
          "duration": null,
          "title": "What are audio issues on the PSTN side?",
          "blocks": [
            {
              "type": "p",
              "text": "For audio issues identified on the PSTN side of the recording, it's important to remember this is the audio the agents hear from the customers routing through the PSTN. This will require working with AWS Support for internal troubleshooting with the telecom carriers."
            },
            {
              "type": "p",
              "text": "To learn more, expand the following section."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Symptom: Audio quality issues from PSTN side of recording",
          "blocks": [
            {
              "type": "p",
              "text": "Causes:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "PSTN-side telecom issues"
            },
            {
              "type": "p",
              "text": "Resolution:"
            },
            {
              "type": "p",
              "text": "Capture three to five (where possible) call samples of the issue that are <4 days old; each sample including the following:"
            },
            {
              "type": "ul",
              "items": [
                "Contact ID, Destination Number, Source Number, Date, Time, Timezone, Call Recording",
                "Raise an AWS Support case reporting the issue with the collected samples",
                "What are some of the customer-side issues?"
              ]
            },
            {
              "type": "p",
              "text": "For audio issues identified on the customer side of the recording, it's important to remember this is the audio the customers hear from the agents. This will require troubleshooting on the agent side."
            },
            {
              "type": "p",
              "text": "To learn more about possible causes for audio quality issues, expand each of the following six sections."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Networking issues",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Possible causes:",
                "Blocked ports (TCP 443 or UDP 3478)",
                "Network congestion",
                "VPN or virtual desktop infrastructure (VDI) configuration",
                "Questions to address:",
                "Are all agents facing the issue using the same network?"
              ]
            },
            {
              "type": "p",
              "text": "Are there any VPN configurations used or are the affected agents using a VDI setup to log in to CCP?"
            },
            {
              "type": "p",
              "text": "Does this issue only happen on the company VPN or over pubic internet also?"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Headset issues",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Possible causes:",
                "Faulty headset",
                "Headset drivers",
                "Questions to address:",
                "Does the issue reproduce when a different headset (or no headset) is used?",
                "Does this issue occur with a different computer?"
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Agent hardware",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Possible causes:",
                "Resource constraints (CPU, RAM)",
                "New or out-of-date drivers",
                "Questions to address:",
                "Have there been any recent hardware updates that have been applied or ignored?",
                "Does the workstation meet Amazon Connect minimum requirements?"
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Browser and extensions",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Possible causes:",
                "Issues with new or specific browser version",
                "Extensions interfering with WebRTC traffic",
                "Questions to address:",
                "Does the issue reproduce on both Chrome and Firefox? What versions? Has the browser been recently upgraded?",
                "Are there any extensions enabled?"
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Application compatibility",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Possible causes:",
                "Software such as antivirus clients, VPNs, or proxy clients.",
                "Questions to address:"
              ]
            },
            {
              "type": "p",
              "text": "Are there any recent application installations on the agent's machine that seem to coincide with the start of the audio quality problem?"
            },
            {
              "type": "p",
              "text": "Are there any application that might influence networking?"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s14",
          "eyebrow": null,
          "duration": null,
          "title": "CCP",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Possible causes:",
                "Custom CCP implementation",
                "Questions to address:"
              ]
            },
            {
              "type": "p",
              "text": "Is the agent using a custom CCP? If so, can they reproduce the issue on the Amazon Connect native CCP?"
            },
            {
              "type": "p",
              "text": "To reach a resolution, work through the most likely causes and analyze their potential impact on the issue until the agent-side root cause is identified and addressed."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s15",
          "eyebrow": null,
          "duration": null,
          "title": "Was Mateo able to solve the audio issues?",
          "blocks": [
            {
              "type": "p",
              "text": "After reviewing logs and audio samples, Mateo was able to identify the audio issues are on the agent side of the conversation. He spent a few shifts shadowing agents to see if it could identify a commonality between those reporting the issue. After a few shifts Mateo noticed a web browser in common that was used between the effected agents. Speaking with the AnyCompany networking and server administration teams a solution was discovered. AnyCompany was able update and manage the web browser and ensure only supported browser extensions would be used."
            },
            {
              "type": "p",
              "text": "Continue to the next lesson to learn about troubleshooting contact flows."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t7-s16",
          "eyebrow": null,
          "duration": null,
          "title": "Audacity",
          "blocks": [
            {
              "type": "p",
              "text": "Audacity is an easy-to-use, multi-track audio editor and recorder. Audacity is free, open-source software. To learn more, choose the following button."
            },
            {
              "type": "p",
              "text": "⚠️ Note: Audacity is a third-party tool not supported by AWS."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-troubleshooting-t8",
      "number": 8,
      "title": "Troubleshooting Contact Flow",
      "shortTitle": "Troubleshooting Contact Flow",
      "summary": "When contact flow doesn't work as expected, Mateo should review logs to assist with troubleshooting.",
      "duration": "~5 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t8-s1",
          "eyebrow": null,
          "duration": null,
          "title": "What can Mateo do to troubleshoot contact flow?",
          "blocks": [
            {
              "type": "p",
              "text": "When contact flow doesn't work as expected, Mateo should review logs to assist with troubleshooting."
            },
            {
              "type": "p",
              "text": "To learn how to enable contact flow logging and where to review logs, choose the play button. A transcript follows the video."
            },
            {
              "type": "p",
              "text": "Expand the following section to view the video transcript."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t8-s2",
          "eyebrow": null,
          "duration": null,
          "title": "How do I troubleshoot contact flow?",
          "blocks": [
            {
              "type": "p",
              "text": "Sign in to the AWS Management Console and go to the Amazon Connect service console."
            },
            {
              "type": "p",
              "text": "To find Amazon Connect, choose the Services menu at the top of the AWS console."
            },
            {
              "type": "p",
              "text": "You can find Amazon Connect under the Services menu in the Business Applications section."
            },
            {
              "type": "p",
              "text": "You can also use the search box at the top of the AWS Management Console to search for Amazon Connect."
            },
            {
              "type": "p",
              "text": "Choose an instance alias in the Instances section to view more details and configuration options for that instance."
            },
            {
              "type": "p",
              "text": "Step 1: Enable logging for your instance."
            },
            {
              "type": "p",
              "text": "Choose Contact flows from the navigation menu."
            },
            {
              "type": "p",
              "text": "Scroll to the bottom of the page. Select the Enable Contact flow logs check box, then choose the Save button."
            },
            {
              "type": "p",
              "text": "Step 2: Add the Set logging behavior block."
            },
            {
              "type": "p",
              "text": "Logs are generated only for flows that include a Set logging behavior block with logging set to Enabled."
            },
            {
              "type": "p",
              "text": "Navigate to your Amazon Connect instance dashboard. On the left navigation menu, choose the Routing icon, and then choose Contact flows from the Routing menu."
            },
            {
              "type": "p",
              "text": "Choose an existing contact flow to modify or choose the Create contact flow button to create a new contact flow."
            },
            {
              "type": "p",
              "text": "Choose the Set logging behavior block from the Set container on the left. Drag the block onto the flow grid and move it into position to be connected to your existing flow. Open the properties for the block and choose Enable or Disable."
            },
            {
              "type": "p",
              "text": "Modify the existing flow by reconnecting the flow arrows to connect the Set logging behavior block. Be sure to save any changes and review before publishing the updated contact flow."
            },
            {
              "type": "p",
              "text": "When you use a Set logging behavior block to enable or disable logging for a flow, logging is also enabled or disabled for any subsequent flow that a contact is transferred to, even if the flow does not include a Set logging behavior block. To avoid logging that persists between flows, enable or disable a Set logging behavior block as needed for that specific flow."
            },
            {
              "type": "p",
              "text": "Flow logs are stored in an Amazon CloudWatch log group, in the same Region as your Amazon Connect instance. This log group is created automatically when Enable flow logging is turned on for your instance. A log entry is added as each block in your flow is initiated."
            },
            {
              "type": "p",
              "text": "Thank you for watching this demonstration!"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t8-s3",
          "eyebrow": null,
          "duration": null,
          "title": "How does Mateo troubleshoot DTMF captured by a contact flow?",
          "blocks": [
            {
              "type": "p",
              "text": "When troubleshooting contact flows that ask a caller to provide information such as an account number to be stored for later use, a typical scenario would be to troubleshoot DTMF. These are the numbers a caller inputs with their phone when prompted."
            },
            {
              "type": "p",
              "text": "The following will demonstrate this process to create a contact flow that will prompt the caller for input, transfer to another flow, and store the information."
            },
            {
              "type": "p",
              "text": "Each flow will be logged for troubleshooting if an error occurs."
            },
            {
              "type": "p",
              "text": "Mateo should create an inbound contact flow, storecustomerinput-receiver, with the following blocks:"
            },
            {
              "type": "ul",
              "items": [
                "Set logging behavior – This will let him review the logs in CloudWatch after the flow runs.",
                "Store customer input – He can prompt the caller for information and store it."
              ]
            },
            {
              "type": "p",
              "text": "Play prompt – Two of these will be used: one to play a message after a successful input by the caller and one to play an error on a failed input."
            },
            {
              "type": "ul",
              "items": [
                "Disconnect – This will end the call.",
                "For this example, the assigned phone number for this contact flow is +1 555-555-0134."
              ]
            },
            {
              "type": "p",
              "text": "He should create another inbound contact flow, storecustomerinput-sender, using the Transfer to phone number block with preconfigured DTMF digits, 1234, to transfer a call to the number assigned to storecustomerinput-receiver."
            },
            {
              "type": "p",
              "text": "Ne should use the following blocks:"
            },
            {
              "type": "ul",
              "items": [
                "Set logging behavior – This will let him review the logs in CloudWatch after the flow runs.",
                "Transfer to phone number – This will transfer the call to the preceding number.",
                "Play prompt – This will play an error message if the call was unable to be transferred.",
                "Disconnect – This will end the call."
              ]
            },
            {
              "type": "p",
              "text": "With these two flows, a call will come into the storecustomerinput-sender contact flow first. Logging is enabled, then the call will transfer to the storecustomerinput-receiver contact flow with the DTMF code of 1234 by transferring to the assigned phone number +1 555-555-0134. If the call fails to transfer, an error message is played and the call is disconnected."
            },
            {
              "type": "p",
              "text": "After the call is done, the storecustomerinput-receiver contact flow logging is enabled and the DTMF of 1234 is stored for later use. A success message is played and the call is disconnected. If the DTMF code is unable to be stored, an error message is played and the call is disconnected."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t8-s4",
          "eyebrow": null,
          "duration": null,
          "title": "How does Mateo test without calling into the system?",
          "blocks": [
            {
              "type": "p",
              "text": "Using the AWS CLI, Mateo can use the start-outbound-voice-contact command to perform an outbound call to test the contact flows."
            },
            {
              "type": "p",
              "text": "To learn more about each argument for the command, choose the following numbered interactive markers."
            },
            {
              "type": "p",
              "text": "To validate the flows are working properly, check the output of the test to see if the DTMF code manually set in the sending contact flow is stored in the receiver contact flow."
            },
            {
              "type": "p",
              "text": "Inspecting the output of the start-outbound-voice-contact command, the sender contact flow shows the dtmValue key is set to a value of 1234."
            },
            {
              "type": "p",
              "text": "Also shown in the command output is the results of the receiver contact flow showing the Results key has a value of 1234."
            },
            {
              "type": "p",
              "text": "The output shows that the dtmValue key was successfully passed to the receiver contact flow and stored, indicating a successful test of the contact flows."
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-troubleshooting-t8-q1",
          "question": "To check your understanding of Amazon Connect blocks, answer the multiple choice question that follows. For guidance on navigating these questions using the keyboard, expand the following keyboard instructions. Keyboard instructions Select the correct answer and choose SUBMIT. For keyboard-only accessibility, press Tab, then the arrow keys to select the correct answer. Then press Tab to navigate to the SUBMIT button and press Enter to continue. What block should be added to a contact flow for troubleshooting purposes?",
          "options": [
            {
              "id": "A",
              "text": "Enable Troubleshooting block, set to True."
            },
            {
              "id": "B",
              "text": "Export logs to CloudWatch, set to True."
            },
            {
              "id": "C",
              "text": "Set logging behavior, set to Enable."
            },
            {
              "id": "D",
              "text": "Enable Debugging, set to True."
            }
          ],
          "correctOptionId": "C",
          "rationale": "See the lesson content above."
        }
      ]
    },
    {
      "id": "connect-troubleshooting-t9",
      "number": 9,
      "title": "Troubleshooting Routing",
      "shortTitle": "Troubleshooting Routing",
      "summary": "In Amazon Connect, routing consists of three parts: queues, routing profiles, and contact flows. Each of these parts will need to be investigated…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t9-s1",
          "eyebrow": null,
          "duration": null,
          "title": "How should Mateo troubleshoot routing?",
          "blocks": [
            {
              "type": "p",
              "text": "In Amazon Connect, routing consists of three parts: queues, routing profiles, and contact flows. Each of these parts will need to be investigated when looking into routing issues."
            },
            {
              "type": "p",
              "text": "Expand each of the following three sections to learn more about the three parts of routing in Amazon Connect."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Queues",
          "blocks": [
            {
              "type": "p",
              "text": "A queue holds contacts waiting to be answered by agents."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Routing profiles",
          "blocks": [
            {
              "type": "p",
              "text": "A routing profile determines what types of contacts an agent can receive and the routing priority. Routing profiles link queues and agents together. Each agent is assigned to one routing profile."
            },
            {
              "type": "p",
              "text": "Routing profiles define the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "The channels the agents will support"
            },
            {
              "type": "p",
              "text": "The queues of customers that the agents will handle (they can use a single queue to handle all incoming contacts or set up multiple queues)"
            },
            {
              "type": "p",
              "text": "Priority and delay of the queues"
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Contact flows",
          "blocks": [
            {
              "type": "p",
              "text": "Contacts are routed through the contact center based on these factors:"
            },
            {
              "type": "ul",
              "items": [
                "The routing profile an agent is assigned to",
                "The hours of operation for a given queue"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "The routing logic defined in the contact flows"
            },
            {
              "type": "p",
              "text": "To learn more about queues, routing profiles, or contact flows, see Amazon Connect concepts in the additional resources section at the end of this lesson."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s5",
          "eyebrow": null,
          "duration": null,
          "title": "What data should Mateo collect when troubleshooting routing?",
          "blocks": [
            {
              "type": "p",
              "text": "For both internal troubleshooting and if a support case is opened with AWS Support, it's important for Mateo to collect and review the following data points to ensure a complete picture of the workflow is captured."
            },
            {
              "type": "p",
              "text": "An export of the contact flow so the issue be can reproduced in-house or through AWS Support. To learn more about exporting contact flows, see Export contact flows in the additional resources section at the end of this lesson."
            },
            {
              "type": "ul",
              "items": [
                "Contact flow logs to understand the flow logic and attributes captured.",
                "Queue, routing profile, user, and security profile configuration in the Amazon Connect console.",
                "Continue to take a look at some of the scenarios Mateo might see when troubleshooting routing issues."
              ]
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s6",
          "eyebrow": null,
          "duration": null,
          "title": "What transfer types will Mateo see in Amazon Connect?",
          "blocks": [
            {
              "type": "p",
              "text": "There are four transfer types Mateo will need to be familiar with: agent-to-agent transfers, transfers to a specific agent, transfers to queues, and transfers to external numbers."
            },
            {
              "type": "p",
              "text": "To learn more about the transfer types, expand each of the following four sections."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Agent-to-agent transfers",
          "blocks": [
            {
              "type": "p",
              "text": "With this transfer type, agents can transfer calls or tasks directly to another agent, if they are available or not. In this example, Mateo might want agents to be able to transfer calls or tasks to other agents."
            },
            {
              "type": "p",
              "text": "To learn more about transferring calls to unavailable agents, see the following Knowledge Center article, How can agents in my Amazon Connect contact center transfer contacts directly to another agent who isn't available?"
            },
            {
              "type": "p",
              "text": "The following screenshot is as sample contact flow used for agent-to-agent transfers."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Transfers to a specific agent",
          "blocks": [
            {
              "type": "p",
              "text": "This transfer type will route a call to one specific agent (to the last agent the customer interacted with or to an agent with specific responsibilities) in one of two ways."
            },
            {
              "type": "p",
              "text": "Method 1: Use preconfigured agent quick connect through CCP to transfer the call to the destination agent. The destination agent must have an Available status to accept the transferred call."
            },
            {
              "type": "p",
              "text": "Method 2: Use set working queue block in a contact flow and select a specific agent."
            },
            {
              "type": "p",
              "text": "The following screenshot of the TransferToSpecificAgent contact flow highlights the set working queue block with Agent 2 assigned."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Transfers to queues",
          "blocks": [
            {
              "type": "p",
              "text": "This transfer type transfers the caller to another queue; for example, a sales, support, or escalation queue."
            },
            {
              "type": "p",
              "text": "Method 1: Use preconfigured agent quick connect through CCP to transfer the call. This works with voice, chat, and task contacts."
            },
            {
              "type": "p",
              "text": "Method 2: Use a contact flow to route the inbound call to one specific queue by using set working queue block and transfer to queue block."
            },
            {
              "type": "p",
              "text": "The following screenshot of the TransferToQueue contact flow highlights the set working queue and transfer to queue blocks."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Transfers to external numbers",
          "blocks": [
            {
              "type": "p",
              "text": "This transfer type transfers calls to external numbers, such as an on-call pager."
            },
            {
              "type": "p",
              "text": "Method 1: Use a preconfigured external quick connect through CCP directly."
            },
            {
              "type": "p",
              "text": "Method 2: Use transfer to phone number block in a contact flow and set the transfer to number under properties to the external number."
            },
            {
              "type": "p",
              "text": "The following screenshot of the transferToNumber contact flow highlights the transfer to phone number blocks."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Transfers to external numbers",
          "blocks": [
            {
              "type": "p",
              "text": "This transfer type transfers calls to external numbers, such as an on-call pager."
            },
            {
              "type": "p",
              "text": "Method 1: Use a preconfigured external quick connect through CCP directly."
            },
            {
              "type": "p",
              "text": "Method 2: Use transfer to phone number block in a contact flow and set the transfer to number under properties to the external number."
            },
            {
              "type": "p",
              "text": "The following screenshot of the transferToNumber contact flow highlights the transfer to phone number blocks."
            },
            {
              "type": "p",
              "text": "See Set up contact transfers in the additional resources section at the end of this lesson for more in-depth information about each type of transfer."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s12",
          "eyebrow": null,
          "duration": null,
          "title": "How can Mateo troubleshoot quick connects?",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo has created quick connects to transfer customer contacts; however, the quick connects are now showing up on the agent's CCP."
            },
            {
              "type": "p",
              "text": "As he learned in the previous section, quick connects can be used for common transfers when transferring calls to agents, queues, or external numbers. To learn more about quick connects, choose one of the following two buttons."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Create quick connects"
            },
            {
              "type": "p",
              "text": "To learn more, choose the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to Admin Guide"
            },
            {
              "type": "ul",
              "items": [
                "How quick connects work",
                "To learn more, choose the following button."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to Admin Guide"
            },
            {
              "type": "p",
              "text": "Follow along as Mateo troubleshoots why his quick connects are not showing up in the agent's CCP."
            },
            {
              "type": "p",
              "text": "Check the type of the quick connects created. If the quick connects are of type Agent or Queue, they will only appear on an agent’s CCP while the agent is on a call. External quick connects are always displayed after created and associated with a corresponding queue."
            },
            {
              "type": "p",
              "text": "Mateo can access this dashboard by choosing Routing on the navigation menu, then choosing Quick connects."
            },
            {
              "type": "p",
              "text": "Check if the quick connects are associated with the queue the agents handle. Quick connects must be associated with the queue in order to be displayed on the CCP. Note the user's routing profile."
            },
            {
              "type": "p",
              "text": "Mateo can access the User management dashboard by choosing Users on the navigation menu, then choosing User management."
            },
            {
              "type": "p",
              "text": "Choose Users on the navigation menu, then choose Routing profiles. Choose the user's routing profile that was noted in Step 2 (Basic Routing Profile). Find the queue assigned for the routing profile (BasicQueue)."
            },
            {
              "type": "p",
              "text": "Choose Routing from the navigation menu, then choose Queues. Choose the queue identified in Step 3 (BasicQueue). In the Quick connects (optional) section, verify the quick connect in question is shown. If not, add it to the list."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t9-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Was Mateo able to resolve the issue?",
          "blocks": [
            {
              "type": "p",
              "text": "Mateo's quick connects are of the type External, and should always show for his agents. However, after reviewing the agent's user profiles and following the preceding steps to review the associated queues, Mateo discovered the quick connects were only assigned to one queue and not the others. Mateo was able to update the queues and now all agents report the quick connects are available in their CCP."
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-troubleshooting-t9-q1",
          "question": "To check your understanding of Amazon Connect quick connects, answer the multiple choice question that follows. For guidance on navigating these questions using the keyboard, expand the following keyboard instructions. Keyboard instructions Select the correct answer and choose SUBMIT. For keyboard-only accessibility, press Tab, then the arrow keys to select the correct answer. Then press Tab to navigate to the SUBMIT button and press Enter to continue. Which of the following quick connect types will always display in CCP?",
          "options": [
            {
              "id": "A",
              "text": "Agent"
            },
            {
              "id": "B",
              "text": "Queue"
            },
            {
              "id": "C",
              "text": "External"
            }
          ],
          "correctOptionId": "C",
          "rationale": "Agent and Queue types will only display in CCP when the agent is on a call. The External type will always display in CCP."
        }
      ]
    },
    {
      "id": "connect-troubleshooting-t10",
      "number": 10,
      "title": "Resources",
      "shortTitle": "Resources",
      "summary": "You might encounter issues other than those covered in this course. AWS provides multiple resources that can further aid in your troubleshooting…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-troubleshooting-t10-s1",
          "eyebrow": null,
          "duration": null,
          "title": "What support resources are available for troubleshooting Amazon Connect?",
          "blocks": [
            {
              "type": "p",
              "text": "You might encounter issues other than those covered in this course. AWS provides multiple resources that can further aid in your troubleshooting attempts. To explore each support resource, choose the following buttons."
            },
            {
              "type": "h",
              "level": 4,
              "text": "AWS CLI Command Reference"
            },
            {
              "type": "p",
              "text": "The AWS CLI is a unified tool that provides a consistent interface for interacting with all parts of AWS. To learn more about the AWS CLI, choose the following button."
            },
            {
              "type": "p",
              "text": "go to AWS CLI ref"
            },
            {
              "type": "h",
              "level": 4,
              "text": "AWS API Reference"
            },
            {
              "type": "p",
              "text": "The AWS API reference describes the API operations for Amazon Connect. To learn more about the AWS API, choose the following button."
            },
            {
              "type": "ul",
              "items": [
                "go to AWS API ref",
                "Amazon Connect User Guide",
                "To learn more about common troubleshooting issues and solutions in the user guide, choose the following button."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to user guide"
            },
            {
              "type": "p",
              "text": "AWS Knowledge Center"
            },
            {
              "type": "p",
              "text": "To learn more about the most frequent questions and requests that AWS Support receives from customers through articles and videos, choose the following button."
            },
            {
              "type": "p",
              "text": "go to AWS KC"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Official AWS YouTube channel"
            },
            {
              "type": "p",
              "text": "Explore additional information such as presentations delivered by AWS professionals, including re:Invent sessions, deep dives, best practices, and AWS Support customer questions. Visit the AWS YouTube channel by choosing the following button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Go to AWS Youtube"
            },
            {
              "type": "p",
              "text": "Official AWS Twitch channel"
            },
            {
              "type": "p",
              "text": "Through livestream events, learn how millions of customers are using AWS Cloud products and solutions. To visit the channel page for the schedule, previously recorded episodes, and links to resources discussed in each episode, choose the following button."
            },
            {
              "type": "ul",
              "items": [
                "go to AWS Twitch",
                "Where can I get complimentary direct engagement from peers?"
              ]
            },
            {
              "type": "p",
              "text": "AWS re:Post gives you access to a vibrant community that can help you become more successful on AWS."
            },
            {
              "type": "h",
              "level": 4,
              "text": "AWS re:Post"
            },
            {
              "type": "p",
              "text": "To ask questions about anything related to designing, building, deploying, and operating workloads on AWS, visit re:Post. To get answers from community experts, including AWS Partners, customers, and employees, choose the following button."
            },
            {
              "type": "ul",
              "items": [
                "go to re:Post",
                "Where can I ask questions or get direct engagement for my Amazon Connect issues?"
              ]
            },
            {
              "type": "p",
              "text": "There might be cases when you get stuck and cannot figure out a particular problem. AWS provides ways to get help, either from AWS directly or from our AWS Partners. To learn more about AWS Support, AWS Partners, and AWS Certified consultants, choose from the following buttons."
            }
          ]
        },
        {
          "id": "connect-troubleshooting-t10-s2",
          "eyebrow": null,
          "duration": null,
          "title": "AWS IQ",
          "blocks": [
            {
              "type": "p",
              "text": "AWS IQ is a paid service designed to provide help from experts and consulting firms with the skills and the experience you need. To learn more about AWS IQ, choose the following button."
            },
            {
              "type": "p",
              "text": "go to aws iq"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Find an AWS Partner"
            },
            {
              "type": "p",
              "text": "AWS Partners are a community of partners uniquely positioned to help you accelerate your journey to the cloud and take full advantage of all that AWS has to offer. To learn more about how AWS Partners can help you, choose the following button."
            },
            {
              "type": "p",
              "text": "go to AWS partners"
            },
            {
              "type": "h",
              "level": 4,
              "text": "AWS Support"
            },
            {
              "type": "p",
              "text": "AWS Support is a paid program that provides a mix of tools and technology, people, and programs designed to proactively help you optimize performance, lower costs, and innovate faster. To learn more about how AWS Support can help you, choose the following button."
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
