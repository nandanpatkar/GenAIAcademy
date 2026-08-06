/*
 * Amazon Connect — Amazon Connect Administration
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT ADMINISTRATION.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-administration",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Amazon Connect Administration",
  "provider": "Amazon Web Services",
  "level": "Advanced",
  "category": "Administration",
  "description": "Advanced flow design, AWS service integration with Lambda, Lex, Polly and databases, security and compliance implementation, and the reliability model.",
  "examFormat": "27 topics · ~27 min · 13 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT ADMINISTRATION.txt"
  ],
  "modules": [
    {
      "id": "connect-administration-t1",
      "number": 1,
      "title": "Introduction to Advanced Contact Flow Design",
      "shortTitle": "Introduction to Advanced Contact Flow Design",
      "summary": "Have you ever called a company and been amazed when their system already knew who you were and what you might need help with? Behind that seamless…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever called a company and been amazed when their system already knew who you were and what you might need help with? Behind that seamless experience is some clever contact flow design. In this section, you will explore how to create these personalized experiences for your customers by using the advanced flow techniques of Amazon Connect."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t2",
      "number": 2,
      "title": "Dynamic Attributes and Personalization",
      "shortTitle": "Dynamic Attributes and Personalization",
      "summary": "Contact attributes in Amazon Connect are like digital sticky notes that follow a customer's interaction throughout their journey. They store…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Contact attributes in Amazon Connect are like digital sticky notes that follow a customer's interaction throughout their journey. They store important information that can be used to personalize the experience."
            },
            {
              "type": "h",
              "level": 4,
              "text": "User-defined attributes"
            },
            {
              "type": "p",
              "text": "For all other attributes Amazon Connect defines the key and value. For user-defined attributes, however, you provide a name for the key and the value."
            },
            {
              "type": "p",
              "text": "To learn more, visit the User attributes section in the Amazon Connect Administrator Guide."
            },
            {
              "type": "h",
              "level": 4,
              "text": "System attributes"
            },
            {
              "type": "p",
              "text": "These are predefined attributes in Amazon Connect. You can reference system attributes, but you cannot create them. These attributes contain information such as the customer's phone number."
            },
            {
              "type": "p",
              "text": "To learn more, visit the System attributes section in the Amazon Connect Administrator Guide."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Lambda contact attributes"
            },
            {
              "type": "p",
              "text": "Lambda contact attributes are returned as key-value pairs from the most recent invocation of an Invoke AWS Lambda function block. Lambda contact attributes are overwritten with each invocation of the Lambda function."
            },
            {
              "type": "p",
              "text": "To learn more, visit the Lambda contact attributes section in the Amazon Connect Administrator Guide."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow attributes"
            },
            {
              "type": "p",
              "text": "Flow attributes are like a type user-defined attribute, however, they are restricted to the flow where they are set."
            },
            {
              "type": "p",
              "text": "To learn more, visit the Flow attributes section in the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "For referencing contact attributes in Amazon Connect, you need to use specific JSON syntax. While these are the most commonly used attributes in contact flows, you can find the complete list and their corresponding JSONPath references in the Amazon Connect Administrator Guide. For more information, visit the List of available contact attributes in Amazon Connect and their JSONPath references."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Lambda contact attributes may also be referred to as an External attribute due to their JSONPath namespace: $.External.attributeName"
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world application of attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine a customer calls your airline's support line. Using the incoming phone number, you can look up their account details and create a personalized greeting."
            },
            {
              "type": "p",
              "text": "Example: \"Hello Sarah, thanks for being a Gold member with us for 5 years! I see you have an upcoming flight to Chicago tomorrow.\""
            },
            {
              "type": "p",
              "text": "To learn more about contact attributes, choose the START or arrow buttons to display each of the three steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Create dynamic text strings in Play prompt blocks in Amazon Connect"
            },
            {
              "type": "p",
              "text": "Follow these steps to reference a dynamic contact attribute in Flow Designer."
            },
            {
              "type": "p",
              "text": "Contact attributes are used in any number of scenarios in a contact flow. In this example, you want to play a custom greeting to callers."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Navigate to Flow Designer"
            },
            {
              "type": "p",
              "text": "Amazon Connect flows console page."
            },
            {
              "type": "p",
              "text": "In the Amazon Connect console, create a new flow or select an existing flow."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Get customer information from a database"
            },
            {
              "type": "p",
              "text": "Invoke Lambda function flow block in Flow Designer."
            },
            {
              "type": "p",
              "text": "Use a Lambda function to return values from your customer database for FirstName and LastName of the caller."
            },
            {
              "type": "p",
              "text": "Using a Lambda function to retrieve information is a multi step task. To learn more, visit the Connect Lambda Functions in the Amazon Connect Administrator Guide."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Use the values in a flow"
            },
            {
              "type": "p",
              "text": "Amazon Connect Play Prompt block in Flow Designer."
            },
            {
              "type": "p",
              "text": "You can now use these attributes to say the customer’s name in a Play prompt block."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Dynamically assign the attribute value"
            },
            {
              "type": "p",
              "text": "Use dynamic values from the external attributes to set the value of the greeting."
            },
            {
              "type": "p",
              "text": "To set the greeting based on information retrieved from your database select the Play prompt block, choose Text-to-speech or chat text and then select Set manually. Next, enter the greeting and JSONPath for the values in the text box."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t3",
      "number": 3,
      "title": "Creating Custom Blocks and Reusable Components",
      "shortTitle": "Creating Custom Blocks and Reusable Components",
      "summary": "One of the most powerful features in Amazon Connect is the ability to create reusable modules. These modules are like building blocks that can be…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "One of the most powerful features in Amazon Connect is the ability to create reusable modules. These modules are like building blocks that can be used across multiple flows, which save you time and ensure consistency."
            }
          ]
        },
        {
          "id": "connect-administration-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Flow modules explained",
          "blocks": [
            {
              "type": "p",
              "text": "Flow modules are reusable sections of a flow that you can create once and use multiple times. Think of them like functions in programming—write once, use many times."
            },
            {
              "type": "p",
              "text": "Use flow modules for the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Data collection sequences, such as gathering customer information",
          "blocks": [
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Not all flows support the use of modules."
              ]
            },
            {
              "type": "p",
              "text": "Modules are only supported by the following inbound flow types:"
            }
          ]
        },
        {
          "id": "connect-administration-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world application",
          "blocks": [
            {
              "type": "p",
              "text": "You are building a number of different contact flows that will verify a callers' identity. Instead of recreating this in each flow, you can create a flow module that handles the verification. You can reuse the module rather than rebuilding this logic each time."
            },
            {
              "type": "p",
              "text": "To implement the flow module, follow this procedure:"
            },
            {
              "type": "p",
              "text": "Create a customer verification module that does the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Returns a success or failure result",
          "blocks": [
            {
              "type": "p",
              "text": "Customer verification module blocks."
            },
            {
              "type": "p",
              "text": "Use the Invoke module flow block and reference the module in any flow where verification is needed."
            },
            {
              "type": "p",
              "text": "Invoke module flow block for the Customer Verification module."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Modules centralize logic in a single location, ensuring all flows automatically leverage the most recent published version, eliminating redundancy and maintaining consistency across your system."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t4",
      "number": 4,
      "title": "Error Handling and Recovery Patterns",
      "shortTitle": "Error Handling and Recovery Patterns",
      "summary": "Even the best-planned flows can run into unexpected problems. By adding graceful error handling, you can make sure your customers have a smooth…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Even the best-planned flows can run into unexpected problems. By adding graceful error handling, you can make sure your customers have a smooth experience no matter what happens behind the scenes. Well-architected systems have robust error handling strategies that detect problems as they occur. These strategies can be used to create actionable solutions, such as diverting contacts or alerting contact center managers. This can prevent minor issues from cascading into significant service disruptions."
            }
          ]
        },
        {
          "id": "connect-administration-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Common Error Scenarios",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Error Handling Strategies"
            },
            {
              "type": "p",
              "text": "Common error scenarios include the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "System limitations (such as attribute size exceeding 32 KB)",
          "blocks": [
            {
              "type": "p",
              "text": "Now that you have reviewed common error scenarios, move on to the next tab to learn about error handling."
            },
            {
              "type": "p",
              "text": "The following interaction presents you with one scene that simulates dialogue with a character. Choose the appropriate response to receive feedback from your decision and move ahead. To start the scenario interaction, choose Continue."
            },
            {
              "type": "p",
              "text": "Linda is wearing business casual clothing. She is standing in a hotel lobby and has a neutral expression."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Handling database connection failures"
            },
            {
              "type": "p",
              "text": "Even the best-designed flows can encounter problems. Effective error handling promotes a smooth experience for your customers, even when things don't go as planned."
            }
          ]
        },
        {
          "id": "connect-administration-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for error handling in Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "In Amazon Connect, error handling best practices focus on proactive error prevention, error logging and monitoring, clear error messages for agents and customers, and automated error recovery."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Proactive error prevention"
            },
            {
              "type": "p",
              "text": "Implement Graceful Degradation"
            }
          ]
        },
        {
          "id": "connect-administration-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Provide clear instructions when invalid data is entered",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Error logging and monitoring"
            },
            {
              "type": "p",
              "text": "Cross-System Error Correlation"
            }
          ]
        },
        {
          "id": "connect-administration-t4-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Review CCP logs using Amazon Connect CCP Log Parser",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Customer and agent communication"
            },
            {
              "type": "p",
              "text": "Transparent Error Communication"
            }
          ]
        },
        {
          "id": "connect-administration-t4-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Quick access to known issue repository",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Automated recovery strategies"
            },
            {
              "type": "p",
              "text": "Flow Fallbacks"
            }
          ]
        },
        {
          "id": "connect-administration-t4-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Callback options automatically offered during queue errors",
          "blocks": [
            {
              "type": "p",
              "text": "To learn more about error handling techniques, choose any of the numbered markers."
            },
            {
              "type": "p",
              "text": "Contact flow with error handling callouts."
            },
            {
              "type": "p",
              "text": "To learn more, visit the Troubleshooting Issues with the Contact Control Panel in the Amazon Connect Administrator Guide.Error Handling Strategies"
            },
            {
              "type": "p",
              "text": "To create a robust error handling system, consider the following:"
            },
            {
              "type": "p",
              "text": "Always use error branches: Every block that could potentially fail should have its error path handled gracefully to maintain a positive customer experience."
            },
            {
              "type": "p",
              "text": "Provide clear customer messaging: When errors occur, explain clearly what happened and what the customer should do next, if needed."
            },
            {
              "type": "p",
              "text": "Create recovery options: Give customers a way to retry or speak to an agent."
            },
            {
              "type": "ul",
              "items": [
                "Log errors for analysis: Use contact attributes to track what went wrong for later improvement.",
                "Lesson 6 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t5",
      "number": 5,
      "title": "Best Practices for Complex Flows",
      "shortTitle": "Best Practices for Complex Flows",
      "summary": "As your customer experience grows more sophisticated, keeping them manageable becomes crucial. Consider these best practices to streamline your…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "As your customer experience grows more sophisticated, keeping them manageable becomes crucial. Consider these best practices to streamline your complex flows:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Naming and documentation"
            },
            {
              "type": "p",
              "text": "Use descriptive naming conventions for flows, blocks, and attributes."
            },
            {
              "type": "p",
              "text": "Document your flows with comments and clear structure."
            },
            {
              "type": "p",
              "text": "Create a standardized naming system across your organization."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Visual organization"
            },
            {
              "type": "p",
              "text": "Use color-coded branches to visually distinguish different paths."
            },
            {
              "type": "p",
              "text": "Break complex logic into modules for better organization."
            },
            {
              "type": "p",
              "text": "Use the search function to quickly find blocks in complex flows."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Testing strategy"
            },
            {
              "type": "p",
              "text": "Create test cases that cover all possible paths."
            },
            {
              "type": "p",
              "text": "Test thoroughly with different scenarios and edge cases."
            },
            {
              "type": "p",
              "text": "Validate each individual error handling path."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Maintenance considerations"
            },
            {
              "type": "p",
              "text": "Plan for regular reviews and updates."
            },
            {
              "type": "p",
              "text": "Document dependencies between flows."
            },
            {
              "type": "ul",
              "items": [
                "Consider how changes might impact other parts of the system.",
                "Lesson 7 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t6",
      "number": 6,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-administration-t6-q1",
          "question": "A financial services company wants to personalize their Amazon Connect contact flows based on the customer's account type (Gold, Silver, Bronze). When a customer calls, the company plans to retrieve the account type from their customer relationship management (CRM) system. How should they implement personalized greetings based on the customer's account type?",
          "options": [
            {
              "id": "A",
              "text": "Use an AWS Lambda function to analyze the customer's call history and determine the appropriate greeting."
            },
            {
              "id": "B",
              "text": "Set up dynamic attributes to store the account type and reference it in flow prompts."
            },
            {
              "id": "C",
              "text": "Create separate flows for each account type and manually transfer customers."
            },
            {
              "id": "D",
              "text": "Use Amazon Lex to ask customers about their account type before routing the call."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Using Amazon Lex to ask customers about information they already have in their systems creates unnecessary friction in the customer experience."
        },
        {
          "id": "connect-administration-t6-q2",
          "question": "A retail company needs to implement the same payment verification process in multiple contact flows throughout their Amazon Connect instance. The development team aims for consistent implementation and streamlined future updates. What is the MOST efficient approach?",
          "options": [
            {
              "id": "A",
              "text": "Duplicate the payment verification blocks in each flow."
            },
            {
              "id": "B",
              "text": "Create a separate AWS Lambda function for each flow."
            },
            {
              "id": "C",
              "text": "Create a flow module for payment verification and reference it in each flow."
            },
            {
              "id": "D",
              "text": "Store the payment verification code in Amazon S3 and use an AWS Lambda function to retrieve it."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Creating separate Lambda functions would lead to code duplication and inconsistency."
        },
        {
          "id": "connect-administration-t6-q3",
          "question": "A healthcare provider's contact center experiences occasional failures when trying to retrieve patient records. What is the MOST effective approach to implement error handling in their Amazon Connect contact flow?",
          "options": [
            {
              "id": "A",
              "text": "End the contact whenever an error occurs and ask the customer to call back."
            },
            {
              "id": "B",
              "text": "Create a specialized error branch for each possible error scenario in the flow."
            },
            {
              "id": "C",
              "text": "Use error branches on integration points with default fallback messages and self-service alternatives."
            },
            {
              "id": "D",
              "text": "Always transfer to an agent when any system error occurs."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Error branches in Amazon Connect contact flows provide a way to handle failures gracefully. Adding default messages and self-service alternatives helps ensure customers have options even when integrations fail. Lesson 8 of 31"
        }
      ]
    },
    {
      "id": "connect-administration-t7",
      "number": 7,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this section, you learned how to design advanced contact flows in Amazon Connect using dynamic attributes, reusable components, and effective…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t7-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this section, you learned how to design advanced contact flows in Amazon Connect using dynamic attributes, reusable components, and effective error handling. These techniques help create personalized and reliable customer experiences."
            },
            {
              "type": "ul",
              "items": [
                "In the next section, you will learn how Amazon Connect integrates with other supporting services.",
                "Lesson 9 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t8",
      "number": 8,
      "title": "Introduction to AWS Service Integration",
      "shortTitle": "Introduction to AWS Service Integration",
      "summary": "Integrating Amazon Connect with databases and voice services for enhanced functionality",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t8-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Implementing Amazon Lex bots for natural language interactions",
          "blocks": [
            {
              "type": "p",
              "text": "Integrating Amazon Connect with databases and voice services for enhanced functionality"
            }
          ]
        },
        {
          "id": "connect-administration-t8-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever wondered how some customer service systems seem to know everything about you and your history with the company? Or how they can understand what you're saying in natural language? The magic behind these capabilities is AWS service integration! In this section, you will explore how to supercharge your Amazon Connect implementation by connecting it with other powerful AWS services."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t9",
      "number": 9,
      "title": "AWS Lambda Integration",
      "shortTitle": "AWS Lambda Integration",
      "summary": "AWS Lambda provides the ability to run code without provisioning or managing servers. When Lambda is integrated with Amazon Connect, you can…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t9-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "AWS Lambda provides the ability to run code without provisioning or managing servers. When Lambda is integrated with Amazon Connect, you can create dynamic, data-driven experiences by connecting to external systems and databases. To learn more, visit the What is AWS Lambda in the AWS Lambda Developer Guide."
            },
            {
              "type": "p",
              "text": "You will now review Lambda integrations for your contact center. To learn about Lambda integration with Amazon Connect, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Amazon Connect to Lambda integration setup screen."
            },
            {
              "type": "p",
              "text": "To learn more, visit the Grant Amazon Connect access to your AWS Lambda functions in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-administration-t9-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world application",
          "blocks": [
            {
              "type": "p",
              "text": "Consider a scenario where a customer calls about their recent order. The following flow chart shows the steps for how you might use Lambda. To learn more about how Lambda would handle their request, choose each of the numbered markers."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Add a Play prompt block between Lambda functions to prevent silence."
              ]
            },
            {
              "type": "p",
              "text": "Implementing the Insider tip in your flows preserves seamless customer interaction while background processes execute efficiently. Brief prompts reassure callers that their interaction remains active. Customers won't experience awkward pauses or think the call disconnected. Use simple messages like, \"Processing your request,\" to bridge the gap during data processing."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t10",
      "number": 10,
      "title": "Amazon Lex Integration",
      "shortTitle": "Amazon Lex Integration",
      "summary": "Amazon Lex is a conversational AI service that integrates with Amazon Connect to power natural language understanding and conversational…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t10-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Lex is a conversational AI service that integrates with Amazon Connect to power natural language understanding and conversational interactions with customers. By using Amazon Connect with Amazon Lex, customers can speak their responses or press buttons on their keypad to navigate menus and access services."
            },
            {
              "type": "p",
              "text": "This integration allows self-service capabilities like checking account balances or routing to the appropriate department through natural conversation flows. This enhances the customer experience while reducing the need for human agent intervention for basic inquiries."
            }
          ]
        },
        {
          "id": "connect-administration-t10-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits of Amazon Lex integration",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Lex best practices"
            },
            {
              "type": "p",
              "text": "Natural conversation experiences"
            }
          ]
        },
        {
          "id": "connect-administration-t10-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Amazon Lex with Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Setting up an Amazon Lex bot in Amazon Connect involves creating a bot with specific intents in the Amazon Lex console. You then integrate the bot with your Amazon Connect instance through a flow."
            },
            {
              "type": "p",
              "text": "Adding Amazon Lex to Amazon Connect requires a number of steps that occur outside of Amazon Connect. To learn how, visit Add an Amazon Lex bot to Amazon Connect in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-administration-t10-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world application of Amazon Lex",
          "blocks": [
            {
              "type": "p",
              "text": "Instead of a traditional interactive voice response (IVR) menu saying, \"Press 1 for billing, press 2 for technical support,\" an Amazon Lex powered system can simply ask, \"How can I help you today?\" The customer might respond, \"I need help with my internet connection.\" Amazon Lex would recognize this as a technical support intent and then proceed to collect relevant information about the customer's problem."
            },
            {
              "type": "p",
              "text": "Amazon Lex is covered in more detail in Amazon Connect AI Fundamentals curriculum. To learn more about Amazon Lex, see the Amazon Lex Developer Guide."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Lex best practices"
            },
            {
              "type": "p",
              "text": "Provide simple and realistic phrases (utterances) as training sets."
            },
            {
              "type": "p",
              "text": "Regularly review bot performance and update your utterance sets."
            },
            {
              "type": "p",
              "text": "Give clear prompts that guide users toward supported intents."
            },
            {
              "type": "p",
              "text": "Plan for fallback scenarios when customer intent is unrecognized."
            },
            {
              "type": "p",
              "text": "Use synonyms to handle different ways that customers might express the same intent."
            },
            {
              "type": "ul",
              "items": [
                "Now that you have reviewed common best practices, move on to the remaining content.",
                "Lesson 12 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t11",
      "number": 11,
      "title": "Database Connections",
      "shortTitle": "Database Connections",
      "summary": "Connecting Amazon Connect to databases makes it possible for you to personalize experiences based on customer data and record interaction…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t11-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Connecting Amazon Connect to databases makes it possible for you to personalize experiences based on customer data and record interaction information for future use. The following steps discuss the general needs to integrate Amazon Connect and your database."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Understand the use case"
            },
            {
              "type": "p",
              "text": "Common database integration scenarios include the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t11-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Recording interaction outcomes",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Choose the right connection method"
            },
            {
              "type": "p",
              "text": "Connection methods include the following:"
            },
            {
              "type": "p",
              "text": "Through Lambda (most common approach): Lambda functions act as the intermediary between Amazon Connect and your database."
            },
            {
              "type": "p",
              "text": "Through Amazon API Gateway: Use this method for more complex integrations with authentication requirements."
            },
            {
              "type": "p",
              "text": "Direct to Amazon DynamoDB: Use this method is for simpler use cases with Lambda."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Implement the integration"
            },
            {
              "type": "p",
              "text": "Follow these general steps:"
            },
            {
              "type": "p",
              "text": "Set up proper permissions for Lambda to access your database (RDS, DynamoDB, other AWS databases or an on-premise database)"
            },
            {
              "type": "p",
              "text": "Code Lambda functions to perform create, read, update and delete (CRUD) operations on your database based on contact interactions."
            },
            {
              "type": "p",
              "text": "Pass relevant customer data between Connect and your Lambda using contact attributes."
            }
          ]
        },
        {
          "id": "connect-administration-t11-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Validate the end-to-end flow",
          "blocks": [
            {
              "type": "p",
              "text": "Additional steps may be needed based on your system configuraion. Please consult with appropriate resources to determine specific requirements to connect to your database."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Apply best practices"
            },
            {
              "type": "p",
              "text": "Cache frequently accessed data to improve performance."
            },
            {
              "type": "p",
              "text": "Plan for database unavailability in your flows."
            },
            {
              "type": "p",
              "text": "Be mindful of security when storing and accessing customer data."
            },
            {
              "type": "p",
              "text": "Consider read replicas for high-volume lookup operations."
            },
            {
              "type": "p",
              "text": "Remember that security and performance considerations should guide your implementation choices. Follow the principle of least privilege when configuring AWS Identity and Access Management (IAM) roles. Store sensitive credentials in AWS Secrets Manager and optimize database calls to maintain low latency."
            },
            {
              "type": "p",
              "text": "The customer experience depends on quick access to data, so a technique like caching frequently accessed information will help ensure smooth interactions."
            },
            {
              "type": "p",
              "text": "Lesson 13 of 31"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t12",
      "number": 12,
      "title": "Amazon Polly Integration",
      "shortTitle": "Amazon Polly Integration",
      "summary": "Amazon Connect is seamlessly integrated with Amazon Polly to create a natural and dynamic voice experience.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t12-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect is seamlessly integrated with Amazon Polly to create a natural and dynamic voice experience."
            },
            {
              "type": "p",
              "text": "Consider the following integration options and best practices for Amazon Polly."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Polly features in Amazon Connect"
            },
            {
              "type": "p",
              "text": "Natural text-to-speech (TTS) in multiple voices and languages"
            }
          ]
        },
        {
          "id": "connect-administration-t12-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Ability to create dynamic, personalized prompts",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect SSML Play prompt block."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Setting up voice services"
            },
            {
              "type": "p",
              "text": "Step 1: Configure text-to-speech in your Play prompt blocks."
            },
            {
              "type": "p",
              "text": "Step 2: Select voice and language options."
            },
            {
              "type": "p",
              "text": "Step 3: Reference contact attributes to personalize messages."
            },
            {
              "type": "p",
              "text": "Step 4: Optionally add SSML tags for enhanced control."
            }
          ]
        },
        {
          "id": "connect-administration-t12-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Example SSML in Play prompt block",
          "blocks": [
            {
              "type": "p",
              "text": "<speak>"
            },
            {
              "type": "p",
              "text": "<prosody rate=\"95%\">"
            },
            {
              "type": "p",
              "text": "Hello <emphasis level=\"moderate\">\\$[Customer.FirstName] </emphasis>, thanks for calling."
            },
            {
              "type": "p",
              "text": "</prosody>"
            },
            {
              "type": "p",
              "text": "<break time=\"300ms\"/>"
            },
            {
              "type": "p",
              "text": "I see your \\$[Customer.ProductName] is scheduled for delivery on <say-as interpret-as=\"date\" format=\"mdy\">\\$[Customer.DeliveryDate]</say-as>."
            },
            {
              "type": "p",
              "text": "<break time=\"500ms\"/>"
            },
            {
              "type": "p",
              "text": "<prosody volume=\"+10%\">"
            }
          ]
        },
        {
          "id": "connect-administration-t12-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Would you like an update on this order?",
          "blocks": [
            {
              "type": "p",
              "text": "</prosody>"
            },
            {
              "type": "p",
              "text": "</speak>"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Real-world application"
            },
            {
              "type": "p",
              "text": "Instead of recording dozens of prompt variations, you can use Amazon Polly to dynamically generate personalized messages."
            },
            {
              "type": "p",
              "text": "For example, \"Hello [First Name], thanks for calling. I see that your [Product Name] is scheduled for delivery on [Delivery Date]. Would you like an update on this order?\""
            },
            {
              "type": "p",
              "text": "All the bracketed items could be contact attributes, providing completely personalized experiences without prerecording anything."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Best practices",
              "body": [
                "Test pronunciations of industry-specific terms.",
                "Use SSML for pauses, emphasis, and proper pronunciation.",
                "Consider different voices for different types of messages.",
                "Balance natural speech with efficiency.",
                "Insider tip: Use Amazon Polly's SSML tags in Connect to create natural-sounding voice interactions that enhance caller satisfaction."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t13",
      "number": 13,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-administration-t13-q1",
          "question": "A travel company wants to integrate their Amazon Connect contact center with their existing booking system. When a customer calls, they want to retrieve the customer's upcoming reservations and offer specific options based on how close the travel date is. Which approach should they implement?",
          "options": [
            {
              "id": "A",
              "text": "Store all reservation data in Amazon Connect contact attributes."
            },
            {
              "id": "B",
              "text": "Configure an AWS Lambda function that queries the booking system and returns reservation details."
            },
            {
              "id": "C",
              "text": "Use Amazon DynamoDB as an intermediary to store all customer reservations."
            },
            {
              "id": "D",
              "text": "Create a separate contact flow for each possible reservation scenario."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Using DynamoDB as an intermediary would create unnecessary data duplication and synchronization challenges."
        },
        {
          "id": "connect-administration-t13-q2",
          "question": "A telecommunications company wants to implement a self-service system in their contact center to handle common requests like checking account balances and paying bills. Which approach provides the most natural conversational experience for customers?",
          "options": [
            {
              "id": "A",
              "text": "Create DTMF, or touch-tone, menus for all self-service options."
            },
            {
              "id": "B",
              "text": "Implement an Amazon Lex bot integrated with Amazon Connect."
            },
            {
              "id": "C",
              "text": "Use a series of stored audio prompts to guide customers through options."
            },
            {
              "id": "D",
              "text": "Create a custom JavaScript application to process customer voice commands."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Stored audio prompts alone do not provide natural language understanding capabilities."
        },
        {
          "id": "connect-administration-t13-q3",
          "question": "A contact center manager needs to implement dynamic text-to-speech capabilities in Amazon Connect contact flows that support multiple languages with natural-sounding voices. Which AWS service should be integrated for this requirement?",
          "options": [
            {
              "id": "A",
              "text": "Amazon Transcribe"
            },
            {
              "id": "B",
              "text": "Amazon Comprehend"
            },
            {
              "id": "C",
              "text": "Amazon Polly"
            },
            {
              "id": "D",
              "text": "Amazon Translate"
            }
          ],
          "correctOptionId": "C",
          "rationale": "Amazon Transcribe is a speech-to-text service that converts audio to text, not text to speech. While useful for transcribing customer conversations, it cannot generate spoken responses in contact flows."
        }
      ]
    },
    {
      "id": "connect-administration-t14",
      "number": 14,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this section, you learned how Amazon Connect integrates with AWS services like Lambda and Amazon Lex and databases. These integrations enhance…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t14-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this section, you learned how Amazon Connect integrates with AWS services like Lambda and Amazon Lex and databases. These integrations enhance contact flows with external data and natural language capabilities."
            },
            {
              "type": "ul",
              "items": [
                "In the next section, you will learn about security services and how they are used in Amazon Connect.",
                "Lesson 16 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t15",
      "number": 15,
      "title": "Introduction to Security Implementation",
      "shortTitle": "Introduction to Security Implementation",
      "summary": "What if a disgruntled former employee could still access your customer data? Or what if customer credit card information was being stored…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t15-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "What if a disgruntled former employee could still access your customer data? Or what if customer credit card information was being stored unprotected in your contact recordings? Security breaches in contact centers can have serious consequences. In this section, you explore how to implement robust security measures in Amazon Connect. These measures help protect your customers, your agents, and your organization from potential threats."
            },
            {
              "type": "p",
              "text": "Lesson 17 of 31"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t16",
      "number": 16,
      "title": "Security Profile Configuration",
      "shortTitle": "Security Profile Configuration",
      "summary": "Security profiles in Amazon Connect control what actions users can perform within the system. They are permission sets that determine what each…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t16-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Security profiles in Amazon Connect control what actions users can perform within the system. They are permission sets that determine what each person can see and do."
            }
          ]
        },
        {
          "id": "connect-administration-t16-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Understanding security profile structure",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect security profiles are built around granular permissions grouped into categories, such as the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t16-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Phone numbers and prompts",
          "blocks": [
            {
              "type": "p",
              "text": "For a complete list of security profile permissions, see the Amazon Connect security profiles webpage."
            },
            {
              "type": "p",
              "text": "To explore key points about Amazon Connect security profiles, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Security profile editing screen showing the Amazon Q feature set expanded to list all available assignable permissions."
            },
            {
              "type": "p",
              "text": "To view the complete list of assignable permissions available in Amazon Connect, see the Security Profile List webpage."
            }
          ]
        },
        {
          "id": "connect-administration-t16-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Default security profiles",
          "blocks": [
            {
              "type": "p",
              "text": "In an Amazon Connect contact center, the following are the available default security profiles. Additional security profiles can be created with custom permissions. Consider the following security profiles and their key permissions."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Admin",
                  "body": "Grants administrators permission to perform a majority of actions."
                },
                {
                  "title": "Agent",
                  "body": "Grants agents permission to access the Contact Control Panel (CCP)."
                },
                {
                  "title": "Call center manager",
                  "body": "Grants managers permission to perform actions related to user management, metrics, and routing."
                },
                {
                  "title": "Quality analyst",
                  "body": "Grants analysts permission to perform actions related to metrics."
                }
              ]
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "New permissions are added on a regular basis. We recommend revisiting your permission configurations to ensure your users can access the latest Amazon Connect features."
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t16-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices",
          "blocks": [
            {
              "type": "p",
              "text": "The following are best practices for configuring a security profile:"
            },
            {
              "type": "ul",
              "items": [
                "Document the purpose of each custom security profile.",
                "Implement approval processes for granting admin access.",
                "Review profiles when staff roles change.",
                "Create specialized profiles rather than giving broad access.",
                "Regularly audit who has access to sensitive functions."
              ]
            },
            {
              "type": "p",
              "text": "To learn more, visit the Best practices for Amazon Connect and Contact Control Panel (CCP) security profiles webpage in the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "Lesson 18 of 31"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t17",
      "number": 17,
      "title": "Advanced Authentication Methods",
      "shortTitle": "Advanced Authentication Methods",
      "summary": "Securing access to Amazon Connect goes beyond just username and password authentication. Implementing stronger authentication methods helps…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t17-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Securing access to Amazon Connect goes beyond just username and password authentication. Implementing stronger authentication methods helps prevent unauthorized access."
            }
          ]
        },
        {
          "id": "connect-administration-t17-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Authentication options in Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "WIth Amazon Connect, you have the option of selecting different authetication methods for users to access the system."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Store user accounts with Amazon Connect"
            },
            {
              "type": "p",
              "text": "Uses the basic username and password system."
            },
            {
              "type": "p",
              "text": "This is the simplest method but best practice recommends using a method with additional security measures such as an existing directory or SAML 2.0."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Link to an existing directory"
            },
            {
              "type": "p",
              "text": "Use an existing directory service that is associated with your AWS account. Users can log in to Amazon Connect by using their corporate credentials. Amazon Connect supports the following directories using AWS Directory Service:"
            },
            {
              "type": "p",
              "text": "AWS Directory Service for Microsoft Active Directory – With AWS Managed Microsoft AD, you can run Active Directory as a managed service."
            },
            {
              "type": "p",
              "text": "Active Directory Connector – AD Connector is a directory gateway that you can use to redirect directory requests to your on-premises Active Directory."
            },
            {
              "type": "p",
              "text": "Simple Active Directory – Simple AD is a standalone managed directory that is powered by a Samba 4 Active Directory compatible server."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Use SAML 2.0-based authentication"
            },
            {
              "type": "p",
              "text": "Integrate with identity providers like Okta, Azure AD, or AWS IAM Identity Center. This method allows the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t17-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Enhanced authentication controls",
          "blocks": [
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Identity management settings cannot be changed after instance creation. To modify these settings, you must create a new instance. Deleting an instance permanently removes all configuration settings and metrics data."
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t17-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world application",
          "blocks": [
            {
              "type": "p",
              "text": "A financial services contact center might do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Use SAML 2.0-based authentication with their corporate identity provider.",
                "Require multi-factor authentication (MFA) for all agent logins.",
                "Implement automatic session timeout after periods of inactivity.",
                "Enforce IP-based restrictions so that agents can only log in from approved networks."
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t17-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for authentication",
          "blocks": [
            {
              "type": "p",
              "text": "Use the following best practices for authentication:"
            },
            {
              "type": "ul",
              "items": [
                "Enable MFA for all user types.",
                "Implement single sign-on for a seamless user experience.",
                "Enforce strong password policies.",
                "Set appropriate session timeouts.",
                "Monitor for unusual login patterns."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Implement thorough offboarding processes when employees leave.",
                "Lesson 19 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t18",
      "number": 18,
      "title": "Data Protection Techniques",
      "shortTitle": "Data Protection Techniques",
      "summary": "Contact centers handle sensitive customer information that requires protection both in transit and at rest. To learn more, review the following.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t18-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Contact centers handle sensitive customer information that requires protection both in transit and at rest. To learn more, review the following."
            }
          ]
        },
        {
          "id": "connect-administration-t18-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Payment Card Protection Example",
          "blocks": [
            {
              "type": "p",
              "text": "The following provide protection for sensitive customer data:"
            },
            {
              "type": "ul",
              "items": [
                "Encryption in transit: All communication between browsers and Amazon Connect uses TLS.",
                "Encryption at rest: Customer data stored in AWS is encrypted by default."
              ]
            },
            {
              "type": "p",
              "text": "Call recording encryption: AWS encryption keys configured at instance creation are used to protect recorded conversations."
            },
            {
              "type": "p",
              "text": "Sensitive data handling: Use encryption in a Store customer input block for sensitive DTMF information that is obtained in the IVR."
            },
            {
              "type": "p",
              "text": "Access controls: Security profiles, tag-based access controls and hierarchy-based access controls limit who can see what information."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed data protection layers, move on to the next tab to learn about handling sensitive data."
            }
          ]
        },
        {
          "id": "connect-administration-t18-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Data proctection best practices",
          "blocks": [
            {
              "type": "p",
              "text": "The following are best practices to follow to protect data:"
            },
            {
              "type": "ul",
              "items": [
                "Minimize collection of sensitive data.",
                "Use secure input methods for confidential information.",
                "Implement appropriate retention policies.",
                "Regularly audit access to sensitive data.",
                "Follow relevant compliance standards for your industry.",
                "Consider using AWS Key Management Service (KMS) customer managed keys for additional control.",
                "For additional information on AWS KMS, please see the AWS KMS Basic concepts webpage."
              ]
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Data protection is a critical aspect to maintain customer trust in your contact center. For more information, see Data protection in Amazon Connect."
              ]
            },
            {
              "type": "p",
              "text": "Handling Sensitive Data"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Payment Card Protection Example"
            },
            {
              "type": "p",
              "text": "For handling sensitive information, follow these steps:"
            },
            {
              "type": "ul",
              "items": [
                "Use flow attributes for temporary storage of sensitive information.",
                "Implement pause/resume recording for payment information collection.",
                "Configure AWS encryption keys for recorded conversations.",
                "Set up storage retention policies for contact records and recordings."
              ]
            },
            {
              "type": "p",
              "text": "Now that you have reviewed handling sensitive data, move on to the next tab to learn about payment card protection."
            },
            {
              "type": "ul",
              "items": [
                "Payment Card Protection Example",
                "When a customer needs to provide their credit card information, the following process occurs:"
              ]
            },
            {
              "type": "p",
              "text": "The flow detects when the payment section begins."
            },
            {
              "type": "p",
              "text": "Recording is automatically paused."
            },
            {
              "type": "p",
              "text": "The customer enters their card details by secure keypad input (not spoken)."
            },
            {
              "type": "p",
              "text": "The data is processed without being stored in Amazon Connect."
            },
            {
              "type": "ul",
              "items": [
                "Recording resumes after the sensitive information collection is complete.",
                "Lesson 20 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t19",
      "number": 19,
      "title": "Compliance Implementation",
      "shortTitle": "Compliance Implementation",
      "summary": "Contact center compliance standards are important rules that protect businesses and their customers. Following these rules is essential because it…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t19-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Contact center compliance standards are important rules that protect businesses and their customers. Following these rules is essential because it helps companies avoid expensive fines and legal problems. Compliance also builds customer trust by showing that a business takes protecting personal information seriously. In today's world, where data breaches are common, following these standards is a must for any professional contact center's operation."
            }
          ]
        },
        {
          "id": "connect-administration-t19-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Common compliance standards",
          "blocks": [
            {
              "type": "p",
              "text": "To learn more about some common compliance standards, choose each of the following flashcards."
            }
          ]
        },
        {
          "id": "connect-administration-t19-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Building compliant contact centers",
          "blocks": [
            {
              "type": "p",
              "text": "Each standard has different requirements, but to build a compliant contact center, the following common practices apply regardless of which standard is followed."
            },
            {
              "type": "p",
              "text": "Understand your requirements: Identify which regulations apply to your business."
            },
            {
              "type": "p",
              "text": "Design flows with compliance in mind: Build processes that meet regulatory needs."
            },
            {
              "type": "p",
              "text": "Implement appropriate controls: Technical and procedural safeguards prevent accidental or malicious changes."
            },
            {
              "type": "p",
              "text": "Document your approach: Maintain evidence of compliance."
            },
            {
              "type": "p",
              "text": "Audit regularly: Verify continued compliance."
            },
            {
              "type": "p",
              "text": "The following interaction presents you with one scene that simulates dialogue with a character. Choose the appropriate response to receive feedback from your decision and move ahead. Choose Continue to start the scenario interaction."
            },
            {
              "type": "p",
              "text": "Linda is standing in a contact center with a neutral expression."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Building a compliant healthcare contact center"
            },
            {
              "type": "p",
              "text": "Many industries have specific compliance requirements for contact centers. Try making a compliance decision for a contact center."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Verify that each AWS service used in your Amazon Connect contact center is in scope for the compliance standards required. For more information, see Compliance Validation in Amazon Connect."
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t19-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices",
          "blocks": [
            {
              "type": "p",
              "text": "The following are best practices for compliance:"
            },
            {
              "type": "ul",
              "items": [
                "Engage compliance experts early in your design process.",
                "Train agents on compliance requirements.",
                "Regularly test your controls.",
                "Keep up with changing regulations.",
                "Document everything.",
                "Consider AWS Artifact for access to AWS compliance reports.",
                "Payment Card Industry Data Security Standard (PCI DSS) for payment card processing.",
                "Health Insurance Portability and Accountability Act (HIPAA) for healthcare information.",
                "General Data Protection Regulation (GDPR) for data protection and privacy in Europe.",
                "California Consumer Privacy Act (CCPA)is a state-level data privacy law in California."
              ]
            },
            {
              "type": "p",
              "text": "System and Organization Controls (SOC) is a suite of reports produced by service organizations. These reports demonstrate the effectiveness of the service organization's internal controls."
            },
            {
              "type": "p",
              "text": "Telephone Consumer Protection Act of 1991, a U.S. law that regulates telemarketing calls, text messages, and faxes to protect consumers from unwanted communications."
            },
            {
              "type": "p",
              "text": "Lesson 21 of 31"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t20",
      "number": 20,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-administration-t20-q1",
          "question": "A contact center manager needs to grant permissions to a quality assurance team to listen to recorded calls. They want to restrict the team from changing any contact flow configurations. How should this be accomplished in Amazon Connect?",
          "options": [
            {
              "id": "A",
              "text": "Create AWS Identity and Access Management (IAM) roles for each quality assurance team member with specific permissions."
            },
            {
              "id": "B",
              "text": "Create a security profile with CallAudioSearch - Access and Contact Search - Access permissions, but no contact flow edit permissions."
            },
            {
              "id": "C",
              "text": "Add the quality assurance team to the Admin security profile but set up Amazon S3 bucket policies to restrict access."
            },
            {
              "id": "D",
              "text": "Configure Amazon CloudWatch alarms to monitor and prevent contact flow changes."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Amazon Connect security profiles control what users can access within the Amazon Connect instance. Creating a security profile with specific call recording access permissions but without contact flow edit permissions helps ensure the QA team has appropriate access."
        },
        {
          "id": "connect-administration-t20-q2",
          "question": "A financial services company needs to implement stronger authentication for their contact center agents. Which authentication configuration in Amazon Connect provides the highest level of security?",
          "options": [
            {
              "id": "A",
              "text": "Username and complex password combination"
            },
            {
              "id": "B",
              "text": "SAML-based single sign-on with multi-factor authentication"
            },
            {
              "id": "C",
              "text": "Setting a shorter session timeout for the Amazon Connect console"
            },
            {
              "id": "D",
              "text": "IP-based restrictions on the Amazon Connect access URL"
            }
          ],
          "correctOptionId": "B",
          "rationale": "Username and password combinations, even with complexity requirements, provide only single-factor authentication."
        },
        {
          "id": "connect-administration-t20-q3",
          "question": "A healthcare provider needs to make sure that patient information collected during calls is properly protected in their Amazon Connect implementation. Which approach meets HIPAA requirements for protecting this sensitive data?",
          "options": [
            {
              "id": "A",
              "text": "Use the default Amazon Connect encryption settings."
            },
            {
              "id": "B",
              "text": "Implement custom encryption using a Lambda function."
            },
            {
              "id": "C",
              "text": "Encrypt sensitive customer input using customer-managed KMS keys and enable encrypted call recordings."
            },
            {
              "id": "D",
              "text": "Store all customer data in temporary contact attributes that expire after the call."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Using customer-managed KMS keys for encrypting sensitive data like call recordings and stored customer input provides the necessary control for HIPAA compliance. This allows the healthcare provider to manage their own encryption keys."
        },
        {
          "id": "connect-administration-t20-q4",
          "question": "A multinational company is expanding their Amazon Connect contact center to operate in the European Union (EU). Which configuration is necessary to meet GDPR requirements?",
          "options": [
            {
              "id": "A",
              "text": "Enable automatic call recordings for all EU-based customers."
            },
            {
              "id": "B",
              "text": "Set up Amazon Connect in an EU Region and implement data retention policies."
            },
            {
              "id": "C",
              "text": "Route all EU calls to agents physically located in the EU."
            },
            {
              "id": "D",
              "text": "Add a voice prompt informing customers their data might be transferred outside the EU."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Although disclosure is important, only informing customers is not sufficient to meet GDPR requirements if the underlying data handling does not comply."
        }
      ]
    },
    {
      "id": "connect-administration-t21",
      "number": 21,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this section, you learned how to implement security controls in Amazon Connect through security profiles, authentication methods, and data…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t21-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this section, you learned how to implement security controls in Amazon Connect through security profiles, authentication methods, and data protection. These features help meet various industry compliance requirements for contact centers."
            },
            {
              "type": "p",
              "text": "In the next section, you will learn about system reliability and recovery processes in the event of a critical event.Lesson 23 of 31"
            },
            {
              "type": "ul",
              "items": [
                "Introduction to System Reliability",
                "Identifying backup strategies for critical contact center components"
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t21-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine that your contact center suddenly goes offline during your busiest period. Customers are unable to reach you, agents are unable to work, and your business loses thousands of dollars every minute. System reliability is strictly a technical consideration; it is a business necessity. In this section, you will explore how to build an Amazon Connect implementation that stays operational even when problems occur."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t22",
      "number": 22,
      "title": "Understanding the Amazon Connect Reliability Model",
      "shortTitle": "Understanding the Amazon Connect Reliability…",
      "summary": "Understanding these reliability terms and limitations will help you design resilient contact center solutions and create appropriate contingency…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t22-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Understanding these reliability terms and limitations will help you design resilient contact center solutions and create appropriate contingency plans."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Reliability terminology"
            },
            {
              "type": "p",
              "text": "The following are terms that apply to reliability:"
            }
          ]
        },
        {
          "id": "connect-administration-t22-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Business continuity: Broader strategies to maintain operations during disruptions",
          "blocks": [
            {
              "type": "p",
              "text": "Availability Zone (AZ): An isolated data center with independent power, cooling, and networking that enables high-availability application deployments."
            },
            {
              "type": "p",
              "text": "Region: A logical group of Availability Zones in a geographic area offering the complete set of AWS services and infrastructure."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Reliability limitations"
            },
            {
              "type": "p",
              "text": "Although Amazon Connect has strong built-in reliability, there are still potential failure points to consider, such as the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t22-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Agent workstation or browser problems",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect's built-in reliability features makes developing strategies for a reliable contact center easier by mitigating potential failure points. This is list describes some of these key features:"
            },
            {
              "type": "ul",
              "items": [
                "Global Infrastructure: Leverages AWS's globally distributed infrastructure for high availability",
                "Multi-AZ Architecture: Automatically operates across multiple Availability Zones within a Region",
                "Automatic Scaling: Dynamically scales to handle fluctuating contact volumes without manual intervention"
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t22-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Service Quotas: Configurable limits to protect system stability and performance",
          "blocks": [
            {
              "type": "p",
              "text": "Phone Number Redundancy: Supports multiple carrier connections for inbound telephony traffic"
            },
            {
              "type": "p",
              "text": "To learn more, visit the Resilience in Amazon Connect section in the Amazon Connect Administrator Guide."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t23",
      "number": 23,
      "title": "Backup Strategies",
      "shortTitle": "Backup Strategies",
      "summary": "In today's connected business world, contact centers are essential to customer service. Setting up strong backup plans is necessary, not just…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t23-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Protecting your contact center",
          "blocks": [
            {
              "type": "p",
              "text": "In today's connected business world, contact centers are essential to customer service. Setting up strong backup plans is necessary, not just helpful, for keeping your business running. These backups protect against system failures and data loss, while also helping you follow industry rules about data protection."
            },
            {
              "type": "p",
              "text": "To learn more, choose the START or arrow buttons to display each of the four steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Plan your backup"
            },
            {
              "type": "p",
              "text": "Amazon Connect offers powerful cloud-based contact center capabilities. Still, cloud solutions require thoughtful backup planning to protect against data loss, configuration errors, and service disruptions. The following steps help you to protect you contact center."
            },
            {
              "type": "p",
              "text": "A good backup plan does more than just copy data. It uses multiple methods including regular exports, storing copies in different locations, and keeping track of different versions. Remember that backups are only valuable if you can actually restore your data when problems happen. This is why testing your recovery process and maintaining your backup systems regularly are key parts of any solid business continuity plan."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Conduct an audit of your current backup procedures. Are all critical components covered? Have you tested your restoration process recently? Review and update documentation as needed."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Identify what to back up"
            },
            {
              "type": "p",
              "text": "Back up configuration data, such as the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t23-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Phone number assignments",
          "blocks": [
            {
              "type": "p",
              "text": "Back up operational data, such as the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t23-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Custom reports",
          "blocks": [
            {
              "type": "p",
              "text": "Adjust as needed for your contact center."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Select backup methods"
            },
            {
              "type": "p",
              "text": "The following are possible methods to backup your Connect instance:"
            },
            {
              "type": "p",
              "text": "API-based backups: Use the Amazon Connect Application Programming Interface (API) to export configuration data."
            },
            {
              "type": "p",
              "text": "Amazon Simple Storage Service (Amazon S3) bucket replication: For recorded conversations and exported reports, use built in replication functions."
            },
            {
              "type": "p",
              "text": "Database backups: For any external databases integrated with Amazon Connect, backup according to the needs of the database."
            },
            {
              "type": "p",
              "text": "Documentation: Maintain current documentation of configurations and settings for any custom settings in Amazon Connect."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Implement your backup strategy"
            },
            {
              "type": "p",
              "text": "A comprehensive backup strategy might include the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t23-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Proper versioning of all custom code in a repository like GitHub",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Test and maintain your backups"
            },
            {
              "type": "p",
              "text": "Best practices for backups include the following:"
            },
            {
              "type": "ul",
              "items": [
                "Automate backup processes, where possible.",
                "Test restoration procedures regularly.",
                "Maintain multiple backup copies.",
                "Store backups in multiple AWS Regions.",
                "Document all backup and recovery procedures."
              ]
            },
            {
              "type": "p",
              "text": "Include backups in your security planning."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "These steps outlined a four-step approach to effectively backing up your Amazon Connect environment. These practices help ensure business continuity and protect your contact center operations from potential data loss or service disruptions."
            },
            {
              "type": "ul",
              "items": [
                "To learn more, visit the Implement a backup strategy section on the AWS Prescriptive Guidance webpage.",
                "Lesson 26 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t24",
      "number": 24,
      "title": "Failover and Recovery Principles",
      "shortTitle": "Failover and Recovery Principles",
      "summary": "Amazon Connect has a native highly available architecture, in all available regions, it operates simultaneously across three availability zones in…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t24-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect has a native highly available architecture, in all available regions, it operates simultaneously across three availability zones in an active/active/active mode."
            },
            {
              "type": "p",
              "text": "For customers needing maximum resiliency during extreme region-wide issues, Amazon Connect Global Resiliency is available. This solution also helps meet regulatory requirements for redundancy across geographically distant locations. Amazon Connect Global Resiliency (ACGR) provides the most effective failover capabilities available for Amazon Connect."
            },
            {
              "type": "p",
              "text": "Detailed failover architectures are a complex topic and outside the scope of this course. For more information, see Set up Amazon Connect Global Resiliency."
            }
          ]
        },
        {
          "id": "connect-administration-t24-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Failover best practices",
          "blocks": [
            {
              "type": "p",
              "text": "The following are best practices for failover:"
            },
            {
              "type": "ul",
              "items": [
                "Regularly test failover procedures.",
                "Train agents on procedures to implement depending on the severity of the outage.",
                "Document clear decision criteria for initiating failover.",
                "Consider automated monitoring to detect issues.",
                "Make sure that integrations work in both systems.",
                "Test with partial traffic shifts periodically."
              ]
            }
          ]
        },
        {
          "id": "connect-administration-t24-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Recovery",
          "blocks": [
            {
              "type": "p",
              "text": "Even with good prevention, problems can still occur. Having documented recovery processes helps ensure that you can quickly restore service."
            },
            {
              "type": "p",
              "text": "Common recovery scenarios include the following:"
            }
          ]
        },
        {
          "id": "connect-administration-t24-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Flow errors: When contact flows have logical or configuration issues",
          "blocks": [
            {
              "type": "p",
              "text": "Agent connectivity: When agents can't access the Amazon Connect Contact Control Panel"
            }
          ]
        },
        {
          "id": "connect-administration-t24-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Service disruptions: When cloud services experience a problem",
          "blocks": [
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "For more information about reliability and recovery of workloads in AWS Cloud, see Disaster Recovery Options in the Cloud."
              ]
            },
            {
              "type": "p",
              "text": "Lesson 27 of 31"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t25",
      "number": 25,
      "title": "Availability Optimization",
      "shortTitle": "Availability Optimization",
      "summary": "Even in the best designed system, downtime may still occur. Contact centers often depend on external data sources that may sometimes become…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t25-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Even in the best designed system, downtime may still occur. Contact centers often depend on external data sources that may sometimes become unavailable, potentially affecting customer interactions. In addition to backup, failover and recovery strategies, you can enhance your Amazon Connect system's availability by implementing error branches within your contact flows. These error branches allow for smooth management when integrations fail. By designing your system this way, calls can automatically follow alternative paths when problems occur."
            },
            {
              "type": "p",
              "text": "For example, the system could offer customers callback options or route them directly to available agents during integration failures. This careful planning helps maintain service continuity and preserve the customer experience even when technical challenges arise."
            },
            {
              "type": "p",
              "text": "Consider the following strategies for maintaining high availability."
            }
          ]
        },
        {
          "id": "connect-administration-t25-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Availability enhancement strategies",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "High availability patterns"
            },
            {
              "type": "p",
              "text": "Agent connectivity: Make sure that agents have reliable internet connections."
            },
            {
              "type": "p",
              "text": "Browser compatibility: Test and validate supported browsers."
            },
            {
              "type": "p",
              "text": "Integration resilience: Build retry and circuit breaker patterns into integrations."
            },
            {
              "type": "p",
              "text": "Graceful degradation: Design flows that can function with reduced capabilities."
            },
            {
              "type": "p",
              "text": "Monitoring and alerting: Detect issues before they affect customers."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed availability enhancement strategies, move on to the next tab to learn about high availability patterns."
            }
          ]
        },
        {
          "id": "connect-administration-t25-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices",
          "blocks": [
            {
              "type": "p",
              "text": "The following are best practices for availability:"
            },
            {
              "type": "ul",
              "items": [
                "Test under various failure conditions.",
                "Implement comprehensive monitoring.",
                "Design for partial functionality during disruptions.",
                "Regularly review and update reliability plans.",
                "Consider the reliability of all integrated components."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Plan for both technical and operational resilience.",
                "High availability patterns",
                "Circuit breakers: Prevent cascading failures when integrations fail. To learn more, see Circuit Breaker Patterns."
              ]
            },
            {
              "type": "p",
              "text": "Retry with backoff: Automatically retry failed operations with increasing delays."
            },
            {
              "type": "p",
              "text": "Fallback responses: Provide default responses when lookups fail."
            },
            {
              "type": "ul",
              "items": [
                "Asynchronous processing: Decouple time-sensitive operations.",
                "Lesson 28 of 31"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-administration-t26",
      "number": 26,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-administration-t26-q1",
          "question": "Knowledge check A retail company wants to make sure that their Amazon Connect contact flows and configurations are properly backed up. What is the recommended approach for backing up Amazon Connect configurations?",
          "options": [
            {
              "id": "A",
              "text": "Use AWS Backup to create automated snapshots of the Amazon Connect instance."
            },
            {
              "id": "B",
              "text": "Export contact flows as JSON and store them in versioned Amazon S3 buckets."
            },
            {
              "id": "C",
              "text": "Create duplicate contact flows within the same instance as backups."
            },
            {
              "id": "D",
              "text": "Use AWS CloudFormation to provision and maintain Amazon Connect resources."
            }
          ],
          "correctOptionId": "B",
          "rationale": "AWS Backup does not directly support Amazon Connect instances."
        },
        {
          "id": "connect-administration-t26-q2",
          "question": "An insurance company's contact center must remain operational even during a company on-premise database outage. Which design would provide the most effective failover capability for their Amazon Connect implementation?",
          "options": [
            {
              "id": "A",
              "text": "Configure Amazon Connect in a single AWS Region with multiple Availability Zones."
            },
            {
              "id": "B",
              "text": "Gracefully handle the error and offer a callback to the caller or route to an available agent."
            },
            {
              "id": "C",
              "text": "Deploy all contact flows in containers using Amazon Elastic Container Service (Amazon ECS) for portability."
            },
            {
              "id": "D",
              "text": "Implement a backup call center with traditional private branch exchange (PBX) systems."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Amazon Connect is a managed service and does not use containers or Amazon ECS. This approach is not applicable."
        },
        {
          "id": "connect-administration-t26-q3",
          "question": "During a contact flow execution, an integration with a customer database has failed. The call is stuck and customers are experiencing long wait times. Which recovery process should be implemented for this scenario?",
          "options": [
            {
              "id": "A",
              "text": "Restart the entire Amazon Connect instance to clear all active sessions."
            },
            {
              "id": "B",
              "text": "Implement circuit breakers in AWS Lambda functions with exponential backoff retry logic."
            },
            {
              "id": "C",
              "text": "Configure contact flow error branches to provide alternative paths when integrations fail."
            },
            {
              "id": "D",
              "text": "Increase the AWS Lambda function timeout to wait for the database to recover."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Error branches in contact flows allow for graceful handling of integration failures. By designing flows with error branches, calls can be redirected to alternative paths (like offering callback options or routing to agents) when integrations fail. Lesson 29 of 31"
        }
      ]
    },
    {
      "id": "connect-administration-t27",
      "number": 27,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this section, you learned about system reliability in Amazon Connect. This includes identifying backup strategies, recognizing failover…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-administration-t27-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this section, you learned about system reliability in Amazon Connect. This includes identifying backup strategies, recognizing failover principles, and selecting high availability configurations to maintain service during disruptions."
            },
            {
              "type": "p",
              "text": "This completes the Amazon Connect Administration course. Now it's time to apply what you have learned to create exceptional customer experiences in your own Amazon Connect contact center!"
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
