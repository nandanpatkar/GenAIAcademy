/*
 * Amazon Connect — Flows Intermediate
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT FLOWS INTERMEDIATE.txt
 *            conne-text/Amazon Connect Flows Intermediate Course Summary.txt  (from conne/Amazon Connect Flows Intermediate Course Summary.pdf)
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-flows-intermediate",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Flows Intermediate",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "Flows",
  "description": "Contact attribute types and use cases, using attributes in flows, pulling in external data sources, and flow design best practices.",
  "examFormat": "6 topics · ~41 min · 6 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT FLOWS INTERMEDIATE.txt",
    "conne-text/Amazon Connect Flows Intermediate Course Summary.txt  (from conne/Amazon Connect Flows Intermediate Course Summary.pdf)"
  ],
  "modules": [
    {
      "id": "connect-flows-intermediate-t1",
      "number": 1,
      "title": "Introduction to Amazon Connect Contact Attributes",
      "shortTitle": "Introduction to Amazon Connect Contact Attri…",
      "summary": "In Amazon Connect, each interaction with an organization's customers is referred to as a contact. The interaction can be a phone call, a chat, or…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [
        "Recognize contact attribute types.",
        "Recall common use cases for contact attributes."
      ],
      "sections": [
        {
          "id": "connect-flows-intermediate-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "In Amazon Connect, each interaction with an organization's customers is referred to as a contact. The interaction can be a phone call, a chat, or a task. Each contact has data associated to that specific interaction. This data is stored in Amazon Connect contact records and can be accessed as contact attributes. Some examples include the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Name of the customers"
            },
            {
              "type": "p",
              "text": "Name of the agent who handled an interaction"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Channel type"
            },
            {
              "type": "p",
              "text": "In the following sections, you will learn the commonly used contact attribute types. You will also explore use cases for contact attributes."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Contact attributes",
          "blocks": [
            {
              "type": "p",
              "text": "A contact attribute is a key-value pair that stores custom data associated with an interaction. Contact attributes are associated with the contact record for each interaction."
            },
            {
              "type": "p",
              "text": "The key is the name of the attribute, and the value is its content. For example, the key might be City, and the value might be London."
            },
            {
              "type": "p",
              "text": "With contact attributes, you can store and handle contact-related information. The data is available throughout the full journey of the contact. You can use the data to activate a flow, implement a routing strategy, provide contact context to agents, or generate custom reports."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Contact attribute types",
          "blocks": [
            {
              "type": "p",
              "text": "The following are the most common types of attributes used to enhance contact experience."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "System attributes",
                  "body": "These contain information about the Amazon Connect instance, in addition to contact identifiers, such as the channel used and the contact’s phone number."
                },
                {
                  "title": "Agent and queue attributes",
                  "body": "These provide information about the assigned contact center agent or queue, including the agent name, queue staffing, agents available, and agents busy."
                },
                {
                  "title": "Amazon Lex attributes",
                  "body": "You can pass information to and from an Amazon Lex chatbot using contact attributes. Some of the data available in Amazon Lex includes sentiment, intent description, or data collected from the contact while interacting with Amazon Lex."
                },
                {
                  "title": "External attributes",
                  "body": "AWS Lambda provides flexible integration ability between Amazon Connect and other AWS services, the customer's own data sources, and third-party applications. Data returned by Lambda functions is stored in external attributes. The external attributes are accessible in Amazon Connect flows."
                },
                {
                  "title": "User defined attributes",
                  "body": "Experience designers create user attributes to store data that is relevant for business logic specific to contact center workflows. For example, you can create a contact attribute that stores a specific user selection or preference while interacting with the flows, such as Opt-out of survey."
                }
              ]
            },
            {
              "type": "p",
              "text": "For a complete list of attributes, navigate to List of Available Contact Attributes and Their JSONPath Reference."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Data sources",
          "blocks": [
            {
              "type": "p",
              "text": "Some contact attributes are automatically preset by Amazon Connect and the services it integrates with. For example, for voice calls, Amazon Connect stores the phone number that the contact dialed in the Dialed Number system attribute. The contact phone number is stored in the Customer Number system attribute."
            },
            {
              "type": "p",
              "text": "Other attributes can be updated using data retrieved from external systems using integration services such as Lambda. The return values from Lambda functions are stored in the External attributes namespace. For example, if the Lambda function implements a contact search by phone number, the return values can be AccountNumber, Balance, and LastPayment. The values can be accessed using references to external attributes, right after the flow invokes the Lambda function."
            },
            {
              "type": "p",
              "text": "The following diagram shows the various data sources for contact attributes by attribute type. Please note that this diagram does not include all the contact attribute types. To learn more, choose each of the nine numbered markers."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Data persistence",
          "blocks": [
            {
              "type": "p",
              "text": "The data stored in some of the contact attributes is available for consumption for the whole duration of the contact. Some examples include the following types:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "System"
            },
            {
              "type": "ul",
              "items": [
                "Media stream",
                "Amazon Lex"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "User defined"
            },
            {
              "type": "p",
              "text": "External attributes are populated by Lambda function calls. Every time a Lambda function is invoked, the external attributes are overridden. Agent attributes are set and persist only within the scope of specific flow types, like Transfer to queue or Transfer to agent."
            },
            {
              "type": "p",
              "text": "There are use cases where external data populated in the attributes needs to be persistent for the duration of the contact. For example, the contact account number retrieved in the flow needs to be displayed in the agent application. In these use cases, the experience designers must save the value of the external attribute in a user-defined attribute."
            },
            {
              "type": "p",
              "text": "After an interaction ends, the contact record is stored in the Amazon Connect instance. User-defined contact attributes are stored in Amazon Connect contact records. Contact records are available within your instance for 24 months."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Flow attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Flow attributes are similar to user-defined attributes, but their value does not persist beyond the flow where they are populated. Flow attributes are useful in situations where you don't want to persist the data throughout the contact. A sample use case is a flow where you temporarily store sensitive information like a contact's credit card number to perform a search. By setting a flow attribute, you can pass that attribute as a parameter to a Lambda function. As soon as the flow ends, the value of that attribute is not accessible any longer."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Common use cases",
          "blocks": [
            {
              "type": "p",
              "text": "Contact attributes are used in Amazon Connect flows to personalize user interactions. The following are common use cases where contact attributes enhance user experience."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Queued callback",
                  "body": "Use the contact phone number to schedule a queued callback."
                },
                {
                  "title": "Post call survey",
                  "body": "Identify which agent interacts with a contact so that a post call survey can be associated with that contact."
                },
                {
                  "title": "Dynamic routing",
                  "body": "Identify the number of contacts in a queue to decide if the contact should be routed to a different queue."
                },
                {
                  "title": "VIP treatment",
                  "body": "Store look-up data relevant to the contact to route them to the appropriate queue. For example, you could staff the VIP queue with a dedicated team of agents. If the contact is a VIP customer, you can route them to a VIP queue."
                },
                {
                  "title": "Use external data",
                  "body": "Use data from a customer interaction with a bot. For example, the type of flowers to order could be data collected for a flower order's bot."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t1-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Use case",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Using data to improve customer experience and reduce agent handle time"
            },
            {
              "type": "p",
              "text": "Martha Rivera, a customer service representative at AnyCompany, starts her day by logging into the Amazon Connect agent application. Her first call of the day comes from John Stiles, a long-time customer calling about an issue with his recent order."
            },
            {
              "type": "p",
              "text": "As the call begins, Martha notices some key contact information populated in her agent workspace. John's phone number is displayed, so Martha can conveniently schedule a callback, if needed. Martha also notices that John is marked as a VIP customer, which means he should receive priority service."
            },
            {
              "type": "p",
              "text": "Martha greets John warmly and asks how she can assist him today. John explains that he ordered flowers for his wife's birthday, but there seems to be some confusion with the delivery date. Martha references the contact attribute showing the type of flowers John ordered during his interaction with the company's ordering bot."
            },
            {
              "type": "p",
              "text": "With this information readily available, Martha can quickly look up John's order details and discover that there was a miscommunication about the requested delivery date. She aptly resolves the issue by rescheduling the delivery for John's wife's birthday according to his original intent."
            },
            {
              "type": "p",
              "text": "During the call, Martha sends a professional survey link associated with John's contact record. At the end of the positive interaction, John completes the survey while the experience is still fresh in his mind. His feedback ties directly to Martha's excellent service."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned about flows and contact attributes and common use cases. Next, you will start using contact attributes in flows to make routing decisions. Lesson 3 of 9 Lesson 2 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-intermediate-t1-q1",
          "question": "An organization wants to personalize interactions with contacts using Amazon Connect. Which component of an Amazon Connect flow would they use to accomplish this?",
          "options": [
            {
              "id": "A",
              "text": "Contact attributes"
            },
            {
              "id": "B",
              "text": "Flow blocks"
            },
            {
              "id": "C",
              "text": "Contact records"
            },
            {
              "id": "D",
              "text": "Flows"
            }
          ],
          "correctOptionId": "A",
          "rationale": "Contact attributes are used in Amazon Connect flows to personalize interaction with a customer on a specific contact."
        },
        {
          "id": "connect-flows-intermediate-t1-q2",
          "question": "A company receives many calls regarding product orders. They want to route VIP contacts to a dedicated queue staffed by specialized agents. Which use case for contact attributes would apply in this scenario?",
          "options": [
            {
              "id": "A",
              "text": "Identify the number of contacts in a queue."
            },
            {
              "id": "B",
              "text": "Use the contact phone number to look up customer data and route them accordingly."
            },
            {
              "id": "C",
              "text": "Schedule a queued callback."
            },
            {
              "id": "D",
              "text": "Get the media streaming Amazon Resource Name (ARN)."
            }
          ],
          "correctOptionId": "B",
          "rationale": "You can staff the VIP queue by a dedicated team of agents. If the contact is a VIP customer, you can route them to a VIP queue."
        }
      ]
    },
    {
      "id": "connect-flows-intermediate-t2",
      "number": 2,
      "title": "Using Contact Attributes",
      "shortTitle": "Using Contact Attributes",
      "summary": "One way organizations can make customers feel valued is by creating personalized experiences. For example, a greeting by name or anticipating the…",
      "duration": "~14 min",
      "lede": null,
      "objectives": [
        "Recall how to access and store data in contact attributes using flow blocks.",
        "Explore how to store sensitive data using contact attributes."
      ],
      "sections": [
        {
          "id": "connect-flows-intermediate-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "One way organizations can make customers feel valued is by creating personalized experiences. For example, a greeting by name or anticipating the customer intent reduces effort and builds trust. To achieve this, experience designers need a way to store information about the contact and implement business logic based on that information."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Checking and setting contact attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Within a flow, you can use the Check contact attributes and Set contact attributes flow blocks to perform actions on the current contact. The following process steps will provide insight into setting and checking attribute blocks."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Set contact attributes flow block",
          "blocks": [
            {
              "type": "p",
              "text": "The Set contact attributes flow block stores key-value pairs as contact attributes. You can set a value that is later referenced in a flow or saved with the contact record. For example, you can copy information retrieved from external sources to user-defined attributes using the Set contact attributes flow block. The contact can specify a callback number that you have previously collected using a Store customer input flow block. You can set this value to a user-defined contact attribute to make it available for further processing in other flows steps. User-defined attributes are also saved with the contact record in the contact history."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Configuration options",
          "blocks": [
            {
              "type": "p",
              "text": "To explore configuration options for this block, choose the START or arrow buttons to display each of the three steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Configuring the Set contact attributes flow block",
                  "body": "After you placed your block in the flow, select the block title to add configuration settings. A details panel opens on the right side of the flow designer and displays the available settings for this block."
                },
                {
                  "title": "Set contact attributes flow block",
                  "body": "Set contact attributes block. The Set contact attributes flow block associates data you configure in the settings with the current contact. It then stores the contact information in key-value pairs named contact attributes."
                },
                {
                  "title": "Set one or more attributes",
                  "body": "Set contact attribute flow block details showing two contact attributes and highlighting the option to add more values. With this flow block, you can associate one or multiple key-value pair attributes with the contact."
                },
                {
                  "title": "Set manual or dynamic values for attributes",
                  "body": "Set contact attribute block highlighting option to manually and dynamically set values. You can manually set values to attributes directly inside of the block configuration. For example, you can store information gathered from the contact, such as their preference to speak to the last agent they interacted with. In this case, set the UserMenuSelection attribute to the LastAgent value, based on the user selection."
                }
              ]
            },
            {
              "type": "p",
              "text": "You can also dynamically set the value of the contact attributes by referencing information retrieved from external data sources. For example, the language configured in the contact profile and retrieved in a previous contact search action."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Check contact attributes block",
          "blocks": [
            {
              "type": "p",
              "text": "The Check contact attributes flow block branches flow logic based on a comparison action to the value of a contact attribute. It supports the following comparison actions: Equals, Is Greater Than, Is Less Than, Starts With, Contains."
            },
            {
              "type": "p",
              "text": "Based on the result of the comparison, the block displays multiple exit points. This makes it convenient for experience designers to implement different flow actions based on the contact attribute condition match. For example, if you check the value of the channel attribute, you can implement different CHAT behavior for your flow, compared to voice."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring the Check contact attributes flow block",
          "blocks": [
            {
              "type": "p",
              "text": "To explore more configuration options and use cases for this flow block, choose the START or arrow buttons to display each of the five steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Configuring the Check contact attributes flow block",
                  "body": "After you placed your block in the flow, select the block title to add configuration settings. A details panel opens on the right side of the flow designer and displays the available settings for this block."
                },
                {
                  "title": "Comparison operations",
                  "body": "Check contact attribute configuration panel showing the comparison operations available. You can configure conditions using operators such as Equals, Is Greater Than, Is Less Than, Starts With, and Contains. Where there is a match between the contact attribute and the condition, you can branch to specific parts of your flow."
                },
                {
                  "title": "Check contact attribute branching",
                  "body": "Agent Workspace, branching on Check contact attributes block properties. System attributes contain contact information available in Amazon Connect, such as voice calls metadata, channel, or the agent assigned to a contact. For example, the attribute is System > Channel, and the condition is Equals > CHAT."
                }
              ]
            },
            {
              "type": "p",
              "text": "When chat contact happens, the flow will continue on the =CHAT branch. For voice or task interactions, the flow takes the No match branch."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "User-defined attributes",
                  "body": "Set Contact Attributes block with Key and Condition highlighted. User-defined attributes contain information stored with the Set contact attributes flow block in the flow. For example, after looking up the contact, you can store the contact's account number. If the organization uses specific prefixes for account numbers, you can use the Starts with condition to branch the flow for different account types."
                },
                {
                  "title": "Lex attributes",
                  "body": "Amazon Lex attributes focused on Attribute to Check, with examples like Intent name and Sentiment score. Amazon Lex attributes contain information retrieved by Amazon Lex bots integrated with the flow. Some examples include intents, slot, and sentiment values."
                },
                {
                  "title": "External attributes",
                  "body": "Check contact attributes configuration focused on external attributes to check a balance greater than zero. External attributes contain information retrieved from external systems by invoking a Lambda function. For example, you search the contact in the customer relationship management (CRM) system using an Invoke AWS Lambda flow block. The results of the search can include contact preferences, account status, and current balance. The data returned by the Lambda function is available in external contact attributes."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Access contact attributes values using JSONPath",
          "blocks": [
            {
              "type": "p",
              "text": "In some flow blocks, you access contact attributes using JSONPath syntax. JSONPath syntax allows the use of contact attributes alongside other text, such as in the middle of a prompt played to a customer. Amazon Connect treats the dollar sign ($) character as a special character for purposes of this syntax."
            },
            {
              "type": "p",
              "text": "For contact attributes generated by Amazon Connect and their corresponding JSONPath reference, navigate to List of Available Contact Attributes and Their JSONPath Reference."
            },
            {
              "type": "p",
              "text": "An example of a JSONPath contact attribute is as follows:"
            },
            {
              "type": "p",
              "text": "$.Agent.FirstName"
            },
            {
              "type": "p",
              "text": "This example references an attribute within Agent attributes, by using the key FirstName. This attribute contains the first name of the agent assigned to the current contact."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Play Prompt flow block",
          "blocks": [
            {
              "type": "p",
              "text": "Let’s examine an example inside of a Play prompt flow block. The Play prompt flow block is used to speak or display a prompt to a customer in Amazon Connect. The Play prompt flow block’s properties contain a prompt property, which contains the message spoken or displayed to the customer."
            },
            {
              "type": "p",
              "text": "Inside of the Text-to-speech or chat text section of the Play prompt flow block configuration, you can insert the following message."
            },
            {
              "type": "p",
              "text": "You are now being transferred to $.Agent.FirstName who can help with this request."
            },
            {
              "type": "p",
              "text": "When the flow block is activated, the first name of the agent assigned to the current contact replaces the attribute $.Agent.FirstName."
            },
            {
              "type": "p",
              "text": "Agent Workspace highlighting option to manually set a text-to-speech or chat text in a Play prompt block type."
            },
            {
              "type": "p",
              "text": "When using JSONPath attributes, an attribute value might be blank or not set. If this happens, the Play prompt will announce, “You are now being transferred to, who can help with this request.” You can use a Check contact attributes flow block to check the value of the attribute before using it as the prompt. If the value is not set, you can create a branch with a different Play prompt flow block to provide an appropriate message to the contact."
            },
            {
              "type": "p",
              "text": "Check contact attribute block detail that shows a validation condition for agent first name."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Encrypt sensitive customer input"
            },
            {
              "type": "p",
              "text": "To ensure compliance with regulatory programs, such as standards for the payment card industry (PCI), it is critical to secure sensitive data. Therefore, it is critical to encrypt sensitive contact attributes data. By using the Store Customer Input flow block, you can secure sensitive customer information, such as credit card numbers."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Store customer input block"
            },
            {
              "type": "p",
              "text": "The Store customer input flow block uses public key cryptography for encryption. This is a class of cryptographic protocols that relies on two separate keys: one that is private and one that is public. When configuring Amazon Connect, you first provide the public key. This is the key used when encrypting data. Later, inside the flow block properties, you provide a certificate, which includes a signature that proves you possess the private key. The standard used for this certificate is X.509."
            },
            {
              "type": "p",
              "text": "You activate encryption inside of the Store customer input flow block by selecting the Encrypt entry checkbox. Use the encryption key to verify the signature of the certificate used within the flow to encrypt the customer input data. Each Amazon Connect instance is configured with up to two encryption keys active at once to facilitate key rotation."
            },
            {
              "type": "p",
              "text": "Store customer input flow block properties."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Accessing the encrypted data"
            },
            {
              "type": "p",
              "text": "After a customer provides input, the information is stored as a contact attribute alongside the contact. To access the encrypted value, you use the System > Stored customer input contact attribute. To decrypt the encrypted data stored in the Stored customer input attribute, you can use the public key and the corresponding private key. For more information, navigate to the AWS Encryption SDK section of the Developer Guide."
            },
            {
              "type": "p",
              "text": "Agent Workspace Function input parameters; radio button selected for Set dynamically, Namespace, and Key values selected."
            },
            {
              "type": "p",
              "text": "For more information, navigate to the Encrypt Customer Input section in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Secure IVR",
          "blocks": [
            {
              "type": "p",
              "text": "Organizations from regulated industries typically need to collect sensitive customer information over the phone. PCI compliance is mandated by credit card companies. This compliance helps ensure the security of credit card transactions in the payments industry."
            },
            {
              "type": "p",
              "text": "By using secure IVR systems, contact centers can automatically collect PCI data from a contact without an agent being involved. Secure IVRs incorporate multi-factor authentication methods to verify the contact’s identity. Granting access to sensitive information requires the contact identity verification. By designing a secure IVR experience, contact centers can protect sensitive customer data to comply with regulations, reduce fraud, and build customer trust."
            },
            {
              "type": "p",
              "text": "To learn more about secure methods to collect and handle sensitive contact data, choose the following two tabs. A use case will also be explored."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t2-s10",
          "eyebrow": null,
          "duration": null,
          "title": "IVR self-service",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Agent and IVR conference"
            },
            {
              "type": "p",
              "text": "To encrypt the collected data, use the Store customer input flow block. In a self-service experience, the following approach can be used to securely capture customer input:"
            },
            {
              "type": "ul",
              "items": [
                "Use a Store customer input flow block.",
                "Configure it to encrypt the contact input, such as their credit card information."
              ]
            },
            {
              "type": "p",
              "text": "After the action flow block captures the input, store the encrypted entry as a contact attribute for further processing by the flow."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed IVR Self-service, move on to the next tab to learn about Agent and IRV Conference."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned how to access and store data in contact attributes. In the next lesson, you will explore how data from external applications and services can enhance your flows design. Configuring the Set contact attributes flow block After you placed your block in the flow, select the block title to add configuration settings. A details panel opens on the right side of the flow designer and displays the available settings for this block. Set contact attributes flow block Set contact attributes block. The Set contact attributes flow block associates data you configure in the settings with the current contact. It then stores the contact information in key-value pairs named contact attributes. Set one or more attributes Set contact attribute flow block details showing two contact attributes and highlighting the option to add more values. With this flow block, you can associate one or multiple key-value pair attributes with the contact. Set manual or dynamic values for attributes Set contact attribute block highlighting option to manually and dynamically set values. You can manually set values to attributes directly inside of the block configuration. For example, you can store information gathered from the contact, such as their preference to speak to the last agent they interacted with. In this case, set the UserMenuSelection attribute to the LastAgent value, based on the user selection. You can also dynamically set the value of the contact attributes by referencing information retrieved from external data sources. For example, the language configured in the contact profile and retrieved in a previous contact search action. Comparison operations Check contact attribute configuration panel showing the comparison operations available. You can configure conditions using operators such as Equals, Is Greater Than, Is Less Than, Starts With, and Contains. Where there is a match between the contact attribute and the condition, you can branch to specific parts of your flow. Configuring the Check contact attributes flow block After you placed your block in the flow, select the block title to add configuration settings. A details panel opens on the right side of the flow designer and displays the available settings for this block. Comparison operations Check contact attribute configuration panel showing the comparison operations available. You can configure conditions using operators such as Equals, Is Greater Than, Is Less Than, Starts With, and Contains. Where there is a match between the contact attribute and the condition, you can branch to specific parts of your flow. Check contact attribute branching Agent Workspace, branching on Check contact attributes block properties. System attributes contain contact information available in Amazon Connect, such as voice calls metadata, channel, or the agent assigned to a contact. For example, the attribute is System > Channel, and the condition is Equals > CHAT. When chat contact happens, the flow will continue on the =CHAT branch. For voice or task interactions, the flow takes the No match branch. User-defined attributes Set Contact Attributes block with Key and Condition highlighted. User-defined attributes contain information stored with the Set contact attributes flow block in the flow. For example, after looking up the contact, you can store the contact's account number. If the organization uses specific prefixes for account numbers, you can use the Starts with condition to branch the flow for different account types. Lex attributes Amazon Lex attributes focused on Attribute to Check, with examples like Intent name and Sentiment score. Amazon Lex attributes contain information retrieved by Amazon Lex bots integrated with the flow. Some examples include intents, slot, and sentiment values. Configuring the Check contact attributes flow block After you placed your block in the flow, select the block title to add configuration settings. A details panel opens on the right side of the flow designer and displays the available settings for this block. Comparison operations Check contact attribute configuration panel showing the comparison operations available. You can configure conditions using operators such as Equals, Is Greater Than, Is Less Than, Starts With, and Contains. Where there is a match between the contact attribute and the condition, you can branch to specific parts of your flow. Check contact attribute branching Agent Workspace, branching on Check contact attributes block properties. System attributes contain contact information available in Amazon Connect, such as voice calls metadata, channel, or the agent assigned to a contact. For example, the attribute is System > Channel, and the condition is Equals > CHAT. When chat contact happens, the flow will continue on the =CHAT branch. For voice or task interactions, the flow takes the No match branch. User-defined attributes Set Contact Attributes block with Key and Condition highlighted. User-defined attributes contain information stored with the Set contact attributes flow block in the flow. For example, after looking up the contact, you can store the contact's account number. If the organization uses specific prefixes for account numbers, you can use the Starts with condition to branch the flow for different account types. Lex attributes Amazon Lex attributes focused on Attribute to Check, with examples like Intent name and Sentiment score. Amazon Lex attributes contain information retrieved by Amazon Lex bots integrated with the flow. Some examples include intents, slot, and sentiment values. External attributes Check contact attributes configuration focused on external attributes to check a balance greater than zero. External attributes contain information retrieved from external systems by invoking a Lambda function. For example, you search the contact in the customer relationship management (CRM) system using an Invoke AWS Lambda flow block. The results of the search can include contact preferences, account status, and current balance. The data returned by the Lambda function is available in external contact attributes. Agent and IVR conference The following is a use case where contact center agents need to capture secure payment details during an active voice call: Use a Quick connect in the agent application that conferences in a secure IVR. In the Transfer to queue flow block associated with the quick connect, implement the following: Add a Play prompt informing the customer that the agent will be put on hold while customer enters their credit card information. Add a Hold customer or agent flow block to put the agent on hold. Add a Store customer input flow block with encryption to collect the contact sensitive information. After data collection, use the Conference all option in a further Hold customer or agent flow block to bring the agent back into the call. Disconnect the IVR from the call so the contact continues the interaction with the agent. Lesson 4 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-intermediate-t2-q1",
          "question": "An experience designer builds a flow that collects credit card information from users. What should the designer do to securely collect this information?",
          "options": [
            {
              "id": "A",
              "text": "Ask the user to send the payment details by email."
            },
            {
              "id": "B",
              "text": "Use the Store customer input flow block to encrypt the user's entry."
            },
            {
              "id": "C",
              "text": "Put the user on hold and have them leave a voicemail with the payment details."
            },
            {
              "id": "D",
              "text": "Transfer the call to the next agent."
            }
          ],
          "correctOptionId": "B",
          "rationale": "To ensure compliance with regulatory programs, such as standards for the Payment Card Industry (PCI), it is critical to secure sensitive data. The Store customer input flow block secures sensitive customer information, such as credit card numbers. Transferring to an agent does not satisfy the requirement to collect credit card information in the flow."
        }
      ]
    },
    {
      "id": "connect-flows-intermediate-t3",
      "number": 3,
      "title": "External Data Sources",
      "shortTitle": "External Data Sources",
      "summary": "Contact attributes contain the data you can use to design dynamic customer experiences. For example, you can use the contact’s preferred language…",
      "duration": "~9 min",
      "lede": null,
      "objectives": [
        "Explore using data from Amazon Lex and Amazon Connect Customer Profiles as contact attributes.",
        "Explore using contact attributes for integrations through Lambda functions."
      ],
      "sections": [
        {
          "id": "connect-flows-intermediate-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Contact attributes contain the data you can use to design dynamic customer experiences. For example, you can use the contact’s preferred language from the organization's systems of record. You can anticipate what the user is trying to accomplish and streamline a chatbot interaction. You can use purchase history data to proactively recommend and upsell new products. By analyzing and using contact data, you can create responses and design flows tailored to meet contact expectations and business needs."
            },
            {
              "type": "p",
              "text": "In this lesson, you will learn how data from external applications and services helps improve your flows design."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Get customer input block",
          "blocks": [
            {
              "type": "p",
              "text": "The Get customer input flow block in Amazon Connect plays a prompt to ask for a response from the contact. For example, \"For sales, press 1. For support, press 2.\" It offers contacts the option to enter dual tone multi-frequency (DTMF) also called touch-tone or keypad tone input or voice input. The block then branches based on the contact’s input. Some key points about the Get customer input block are as follows:"
            },
            {
              "type": "p",
              "text": "The block supports voice, chat, and task channels. For the voice and chat channels, the block offers a built-in integration with Amazon Lex. Using this block, you can activate the same chatbot across voice and messaging."
            },
            {
              "type": "ul",
              "items": [
                "You can configure timeout settings for how long to wait for user input.",
                "The block stores custom input-end keys for DTMF input (for example, a number of sequence of numbers)."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Get customer input block with Amazon Lex"
            },
            {
              "type": "p",
              "text": "The Get customer input flow block can be configured to collect customer input using Amazon Lex. With this block, contacts are routed to Amazon Lex bots to answer questions and complete self-service operations. After the user intent is fulfilled, the session returns to Amazon Connect with contact attributes containing information about the interaction. These contact attributes are used to make dynamic routing decisions inside your flow to further personalize the customer experience and influence routing logic."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Data available from Amazon Lex",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Lex provides information about contacts as contact attributes. The types of information returned includes the following."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Intent name",
                  "body": "This is the user intent returned by Amazon Lex. By gathering the intent name, you can make dynamic routing decisions based on what the contact is asking about. For example, they can be routed to a billing queue if they are asking billing questions."
                },
                {
                  "title": "Intent confidence score",
                  "body": "Amazon Lex establishes a confidence of its understanding of the contact’s intent on a 0–1 scale. If Amazon Lex doesn't recognize the contact's utterance confidently, Amazon Connect verifies the confidence score for routing the contact to an agent."
                },
                {
                  "title": "Sentiment label and score",
                  "body": "This includes the overall sentiment, which is POSITIVE, NEGATIVE, MIXED, or NEUTRAL, and a numeric sentiment score. The Get customer input block supports sentiment routing. So, each turn of the conversation can route to a branch based on the sentiment of the contact. For example, you can short-circuit the bot experience when sentiment drops to a low score. You can route that contact directly to a queue with an increased priority."
                },
                {
                  "title": "Session attributes",
                  "body": "The Get customer input block passes session attributes to Amazon Lex. For example, the block passes the channel that a contact is contacting on as an attribute. Amazon Lex can also return attributes back to the flow, such as data from fulfillment of an intent."
                },
                {
                  "title": "Slots",
                  "body": "Amazon Lex slots capture user information inside an intent, such as name, phone number, email address, or custom slot types. Amazon Connect can use slot values to personalize the experience further, such as gathering the contact’s name or a callback phone number."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Use case example: Hotel booking experience",
          "blocks": [
            {
              "type": "p",
              "text": "Hotel bedroom with a single bed."
            },
            {
              "type": "p",
              "text": "The following is an example of how to use Amazon Lex in a hotel booking experience. When using a Get customer input block, Amazon Connect offers the contact the option to interact with an Amazon Lex bot. This approach can be used for self-service options or to collect data and route the contact to an agent. The following is a sample transcript of an Amazon Lex bot interacting with a contact to classify an utterance and collect information through slots."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Sample transcript: Chatbot interaction"
            },
            {
              "type": "p",
              "text": "Chatbot: Hello! Welcome to the AnyCompany Hotel chatbot. How can I assist you today?"
            },
            {
              "type": "p",
              "text": "User: I'd like to book a hotel room for my upcoming trip."
            },
            {
              "type": "p",
              "text": "Chatbot: Certainly! Let me ask you a few questions to find the best options for you. First, where will you be traveling to?"
            },
            {
              "type": "p",
              "text": "User: New York City."
            },
            {
              "type": "p",
              "text": "Chatbot: Great, New York City is an exciting destination! When will you be arriving, and how many nights will you be staying?"
            },
            {
              "type": "p",
              "text": "User: Arriving on June 15 and staying for 4 nights."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Chatbot: Got it. And how many rooms and guests will be staying?",
          "blocks": [
            {
              "type": "p",
              "text": "User: Just one room for two adults."
            },
            {
              "type": "p",
              "text": "Chatbot: Okay, let me check our available options based on your preferences and past stays (if applicable)."
            },
            {
              "type": "p",
              "text": "[Pulling contact data to check preferences like preferred hotel chains, room types, amenities, and so on.]"
            },
            {
              "type": "p",
              "text": "Based on your previous stay at the AnyCompany Hotel in New York City, you booked a king room with a city view. Would you like me to prioritize similar options for this trip?"
            },
            {
              "type": "p",
              "text": "User: Yes, that would be great!"
            },
            {
              "type": "p",
              "text": "Chatbot: Perfect, here are a few top recommendations for you:"
            },
            {
              "type": "ul",
              "items": [
                "Standard City – King room with city view, $259 per night.",
                "This option matches your preferences from your last stay."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Family Suites Times Square – King room with Times Square view, $279 per night.",
                "This option is at a highly rated hotel in a central location."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Business Hotel – King room, $199 per night.",
                "This is a trendy and affordable option close to top attractions."
              ]
            },
            {
              "type": "p",
              "text": "Would you like me to book one of these options or explore more choices?"
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "User: The Standard City option looks great. Could you book that for me?",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Chatbot: Absolutely! Let me just confirm a few details before finalizing the reservation:",
                "- Check-in: June 15",
                "- Check-out: June 19",
                "- 1 king room with city view",
                "- 2 adults"
              ]
            },
            {
              "type": "p",
              "text": "Please let me know if I have everything correct."
            },
            {
              "type": "p",
              "text": "User: Yes, that's all correct."
            },
            {
              "type": "p",
              "text": "Chatbot: Great, I will go ahead and book that room for you at AnyCompany Hotel. Please provide your name and email address so I can send the confirmation to you."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "User: Jane Doe, jane.doe@example.com",
          "blocks": [
            {
              "type": "p",
              "text": "Chatbot: Thank you! I have completed your reservation and sent the confirmation email with all the details. Is there anything else I can assist you with?"
            },
            {
              "type": "p",
              "text": "User: Yes, I would like to speak to an agent."
            },
            {
              "type": "p",
              "text": "Chatbot: Okay, let me route you to an agent."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Attributes collected in Amazon Lex"
            },
            {
              "type": "p",
              "text": "After the preceding bot interaction has completed, the flow continues to run and the contact attributes from Amazon Lex are available. An example of the attributes collected are as follows:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Intent: HotelBooking"
            },
            {
              "type": "ul",
              "items": [
                "Intent Confidence: 0.96",
                "Sentiment Label: POSITIVE",
                "Sentiment Score: 0.9",
                "Session Attributes:",
                "BookingConfirmationId: ABC123",
                "ReservationConfirmed: true",
                "Slots:",
                "Hotel: AnyCompany Hotel",
                "CheckInDate: 6/15/2024",
                "CheckOutDate: 6/19/2024",
                "RoomType: 1 king room with city view",
                "NumOfGuests: 2",
                "CustomerName: Jane Doe"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "CustomerEmail: jane.doe@example.com"
            },
            {
              "type": "p",
              "text": "The Amazon Lex intent and slot values can capture the customer's intent for hotel booking, such as making, changing, or cancelling a reservation."
            },
            {
              "type": "p",
              "text": "After the information is collected, it is available to personalize the routing and agent experience. For example, Amazon Connect uses the intent name to route the contact to the sales queue, as seen in the following image. A travel agency implementing this customer journey can use the hotel name to route to agents with experience of this hotel. This ensures that the agents are better prepared for answering the contact’s questions on this reservation. You can do this using agent proficiencies."
            },
            {
              "type": "p",
              "text": "Cropped screenshot of the Agent Workspace focused on the Hotel Booking Flow from Get Customer Input to Transfer to Queue."
            },
            {
              "type": "p",
              "text": "Customer Profiles block"
            },
            {
              "type": "p",
              "text": "The Customer Profiles block in Amazon Connect retrieves, creates, and updates customer profile data from your flows. The Get profile action within the block retrieves a profile for a contact using a search identifier. Examples of search identifiers include phone numbers, emails, or account IDs. Data such as a contact phone number is usually available over a voice channel. For chat, you can gather context about contacts by identifying data, such as emails."
            },
            {
              "type": "p",
              "text": "After retrieving a profile, you can map the profile information to contact attributes. These fields include basic profile data, such as name, email, or address. The following is some of the data that can be returned from Customer Profiles."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Customer Profiles data",
          "blocks": [
            {
              "type": "p",
              "text": "To learn more, expand each of the following categories."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Profile metadata",
                  "body": "Profile metadata contains basic demographic information about the customer, such as name, email, address and phone number."
                },
                {
                  "title": "Attributes",
                  "body": "Attributes"
                }
              ]
            },
            {
              "type": "p",
              "text": "Custom fields are specific to the organization using Customer Profiles, such as account ID."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Calculated attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Computed values represent the following:"
            },
            {
              "type": "ul",
              "items": [
                "Past behavior, such as the last website visited, or last agent spoken to",
                "Patterns of behavior, such as preferred channel or frequency of contact",
                "Customer value, such as new customer or average ticket size",
                "Calculated attributes use common aggregation operations, such as average, count, minimum, maximum, and sum."
              ]
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Asset",
                  "body": "An asset is related to a profile, such as a product, which has multiple attributes such as serial number, purchase date, and price."
                },
                {
                  "title": "Order",
                  "body": "An order is related to a profile, with attributes that include order ID, order status, total price, and currency."
                },
                {
                  "title": "Case",
                  "body": "A case is related to a profile, such as an Amazon Connect case, or case from a CRM system, such as Salesforce. The attributes include the case ID, the reason for the case, date created, date updated, and status."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t3-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Invoke AWS Lambda function block",
          "blocks": [
            {
              "type": "p",
              "text": "IVR designers can use Lambda functions from within flows. With this functionality, they can send and receive data from external systems and databases. Some examples of external systems include the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "CRM systems"
            },
            {
              "type": "p",
              "text": "IT service management (ITSM) systems"
            },
            {
              "type": "p",
              "text": "A Lambda function call can also be used to invoke external APIs. For example, you can call an API to reset a password and use a new password gathered from the contact. Lambda functions are also used to call APIs used by other Amazon Web Services (AWS) services. For example, a flow could invoke a Lambda function that sends an email using Amazon Simple Email Service (Amazon SES) to a contact."
            },
            {
              "type": "p",
              "text": "To run Lambda functions as part of flows, cloud administrators must configure Lambda access for the Amazon Connect instance. After the proper permissions are granted, you can use the Invoke AWS Lambda function block. This block passes contact information available in your flow to the Lambda function in the form of function parameters. The parameters can be manually specified or dynamically gathered from contact attributes, such as slot values from Amazon Lex."
            },
            {
              "type": "p",
              "text": "The AWS Lambda function returns key-value pairs that are stored as contact attributes in Amazon Connect. You can reference the values returned in the External namespace. For example, $.External.attributeName."
            },
            {
              "type": "p",
              "text": "Attributes returned to a flow from a Lambda function are overwritten when another Lambda function is invoked during the flow. Therefore, to use external attributes later in the flow, you must store them in user-defined attributes, using the Set contact attribute flow block."
            },
            {
              "type": "p",
              "text": "To learn more, navigate to the Invoke AWS Lambda functions section in the Amazon Connect Administrator Guide."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned to gather contact information directly from contacts or by using other data sources. Next, you will learn flow design best practices. Lesson 5 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-intermediate-t3-q1",
          "question": "A user wants to book a hotel room. Which Amazon Connect flow block empowers the user to interact with a chatbot and provide inputs like travel dates and preferences?",
          "options": [
            {
              "id": "A",
              "text": "Amazon Connect Customer Profiles block"
            },
            {
              "id": "B",
              "text": "Amazon Lex"
            },
            {
              "id": "C",
              "text": "AWS Lambda"
            },
            {
              "id": "D",
              "text": "Get customer input block"
            }
          ],
          "correctOptionId": "D",
          "rationale": "You can use the Get customer input flow block to collect customer input in your Amazon Connect flows. With this block, contacts can answer questions and complete self-service operations."
        },
        {
          "id": "connect-flows-intermediate-t3-q2",
          "question": "An Amazon Connect flow needs to invoke an external API to reset a customer's password. How can the experience designer achieve this functionality?",
          "options": [
            {
              "id": "A",
              "text": "Use Amazon API Gateway to integrate with the external API, and then store the results in contact attributes."
            },
            {
              "id": "B",
              "text": "Create an AWS Lambda function that calls the external API and returns the new password. Use the Invoke AWS Lambda function block to run this Lambda function."
            },
            {
              "id": "C",
              "text": "Store the external API endpoint in a contact attribute and pass it to an AWS Lambda function."
            },
            {
              "id": "D",
              "text": "Configure the external API to be invoked directly from the Amazon Connect flow."
            }
          ],
          "correctOptionId": "B",
          "rationale": "A Lambda function call can be used to invoke external APIs. For example, the experience designer can call an API to reset a password and use new password gathered from the contact. IVR designers can run Lambda functions within flows."
        }
      ]
    },
    {
      "id": "connect-flows-intermediate-t4",
      "number": 4,
      "title": "Flow Design Best Practices",
      "shortTitle": "Flow Design Best Practices",
      "summary": "This lesson contains a collection of recommended best practices to use when you design, create, and support Amazon Connect contact centers. These…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [
        "Recognize best practices for implementing flows.",
        "Identify optimal ways to implement error handling in flows."
      ],
      "sections": [
        {
          "id": "connect-flows-intermediate-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "This lesson contains a collection of recommended best practices to use when you design, create, and support Amazon Connect contact centers. These practices align with the AWS Well-Architected Framework and promote its six pillars. For more information, navigate to AWS Well-Architected Framework. The pillars are operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Best practices",
              "body": [
                "There is no right or wrong way to design a flow. Flows are built based on each organization's specific business needs. Experience designers can use the built in flow designer canvas. Developers can use flow language, a JSON-based representation of a series of flow actions, and the criteria for moving between them. With flow language, developers can efficiently update flows when migrating applications from one environment to another. Regardless of how you build flows, applying core design best practices helps ease the operational support while improving user experience.",
                "To explore flow design best practices, expand each of the following categories."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Modularized flows"
            },
            {
              "type": "p",
              "text": "You can create modular flows by breaking down functionality into logical sections. This makes your flows manageable."
            },
            {
              "type": "p",
              "text": "You build your flows as small modules, and then combine them into a complete customer experience. You can use a flow repeatedly in multiple interaction scenarios, thereby reducing regression testing."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Taxonomy",
                  "body": "Adopt a standard naming convention for all of your AWS services. This will make it more convenient to build and maintain your flows. Add attributes with the naming convention for facilitating references in the future. Make sure your attribute names do not use spaces or special characters that can impact downstream processing."
                },
                {
                  "title": "Error handling",
                  "body": "Ensure all error branches are routed to a block that effectively handles errors or ends contacts so that your contacts retain trust in your contact center."
                },
                {
                  "title": "Permissions",
                  "body": "To maintain a strong security posture, ensure that Amazon Connect has appropriate permissions for all integration points referenced in the flows."
                },
                {
                  "title": "Data security",
                  "body": "When you use the Set contact attribute block, make sure you are only storing the data you need. Any user-defined contact attribute you set will be saved as part of the contact."
                },
                {
                  "title": "Monitoring",
                  "body": "Use the Set logging behavior block to activate logging of the flow. Disable logging for segments of the flow where sensitive information is collected so that it does not appear in the Amazon CloudWatch monitoring service."
                },
                {
                  "title": "Hours of operation and staffing",
                  "body": "Ensure that you insert the Check hours of operation block to verify a contact is within working hours. Add the Check staffing block to ensure that agents are staffed to service a contact. This is necessary before you route the call to an agent."
                }
              ]
            },
            {
              "type": "p",
              "text": "For additional best practices, navigate to Best Practices for Amazon Connect in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Error handling",
          "blocks": [
            {
              "type": "p",
              "text": "You can use error branches in Amazon Connect flows to handle situations where an error occurs or a condition is not met. Errors might occur for a variety of reasons, depending on the specific block. Some common examples of errors include the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Invalid user input"
            },
            {
              "type": "p",
              "text": "Using dynamic contact attribute values that are not set"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Errors from running Lambda functions"
            },
            {
              "type": "p",
              "text": "When designing the customer experience in a flow, it’s important to design flows in a resilient manner. This ensures that they are able to withstand errors and failures that might occur as part of the design. You will examine some examples of errors in a flow and explore design patterns to handle them."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Flow error examples",
          "blocks": [
            {
              "type": "p",
              "text": "Each flow block has its own logic regarding error branching. Not every block has an error branch. If blocks have any error branch, they might route to the error branch for different reasons. To understand why a contact might be routed down an error branch, explore the Flow Block Definitions. The following are examples of flow blocks and their error branches."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Checking hours of operation for an agent queue",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Missing Prompt from Amazon S3"
            },
            {
              "type": "p",
              "text": "With the Check hours of operation block, you can make dynamic routing decisions based on hours of operation inside the contact center. Supervisors or administrators might choose to close their contact center at specific periods of the day. When using the Check hours of operation block, there are two ways to specify the hours. By default, hours are inferred based on the hours of operation of the queue set for the contact. However, you can set specific hours to be checked within the flow block."
            },
            {
              "type": "p",
              "text": "It is important to specify the set of hours of operations for a queue to avoid a contact being routed down the error branch of this block."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed Checking hours or operation for an agent queue, move on to the next tab to learn about Missing prompt from S3."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Handling errors best practices",
          "blocks": [
            {
              "type": "p",
              "text": "After understanding why an error occurs in a flow, you need to make a decision about how to handle the error. The following are recommended patterns to use for catching and handling an error inside a flow."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Continue past the error"
            },
            {
              "type": "p",
              "text": "In some situations, you might be able to proceed past errors without disruption."
            },
            {
              "type": "p",
              "text": "For instance, if the contact information is not available, implement a different experience that does not disrupt the interaction flow. In such cases, it is not necessary to inform customers. You can avoid further customer frustration by maintaining a light and effortless experience and silently advancing past handled errors."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Gracefully inform the customer and continue"
            },
            {
              "type": "p",
              "text": "When errors occur, you can create a Flow branch to inform the contact gracefully. For example, consider the situation when an error occurs due to a failed Lambda function used by Amazon Lex."
            },
            {
              "type": "p",
              "text": "A best practice for handling this type of error is to inform the contact that their self-service answers do not reach the external system. The flow does not end. It continues even in the presence of errors. When using error branches, a routing decision can be made to handle this situation. For example, the contact can be routed to an agent in a priority queue."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Gracefully disconnect the customer"
            },
            {
              "type": "p",
              "text": "If a flow encounters a critical error, it might make sense to gracefully disconnect the customer altogether. Some contact centers choose to put a maximum contact capacity on their queues. Upon hitting this limit, Amazon Connect routes contacts down the At capacity branch of the Transfer to queue block."
            },
            {
              "type": "p",
              "text": "If you want to limit the maximum number of contacts in a queue, you can disconnect the contact after this branch is invoked. Amazon Connect informs the contact gracefully after this branch is invoked before disconnecting. In front of the Disconnect block, use the Play prompt block with the text, \"We’re sorry, all of our agents are currently busy assisting other customers. Please try again later.\""
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have learned flow design best practices and error handling. Continue to the next lesson to review the course summary and prepare for the end-of-course assessment. Missing Prompt from Amazon S3 With the Play prompt block, you can play a prompt using different methods. You can use pre-recorded prompts or prompts played using the text-to-speech engine, Amazon Polly. You can also dynamically load a prompt from an Amazon Simple Storage Service (Amazon S3) bucket. When choosing to load a prompt from an S3 bucket, access errors might occur when getting the prompt. Incorrect AWS Identity and Access Management (IAM) permissions or wrong key names cause a contact to route down the error branch from this block. Lesson 6 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-intermediate-t4-q1",
          "question": "An experience designer builds an Amazon Connect flow for their organization's contact center. The flow uses a third-party integration that retrieves contact information. When the integration fails, no contact information is available. The contact information is used for downstream validation and additional interactions. How should the experience designer handle the error conditions?",
          "options": [
            {
              "id": "A",
              "text": "Inform the customer of the error and ask them to enter the information again."
            },
            {
              "id": "B",
              "text": "Inform the customer of the error and immediately route the interaction to a queue."
            },
            {
              "id": "C",
              "text": "End the call abruptly."
            },
            {
              "id": "D",
              "text": "Continue past the error. Implement different paths for when the contact information is available and not available."
            }
          ],
          "correctOptionId": "D",
          "rationale": "Depending on your use case, you might be able to proceed past errors without disruption. If the contact information is not available, try implementing a different experience that does not disrupt the interaction flow. In such cases, it is not necessary to inform customers. You can avoid further customer frustration by maintaining a light and effortless experience and silently advancing past handled errors."
        }
      ]
    },
    {
      "id": "connect-flows-intermediate-t5",
      "number": 5,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this course, you learned about Amazon Connect flow attributes. Take a moment to review the following key concepts before taking the course…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-flows-intermediate-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Course summary",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you learned about Amazon Connect flow attributes. Take a moment to review the following key concepts before taking the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Contact attributes"
            },
            {
              "type": "p",
              "text": "Amazon Connect stores data associated with each customer interaction as contact attributes."
            },
            {
              "type": "p",
              "text": "Contact attributes are key-value pairs containing information about the contact, agent, queue, or external data sources."
            },
            {
              "type": "p",
              "text": "Common attribute types include: system attributes, agent attributes, Amazon Lex attributes, and user-defined attributes. External attributes store data from external systems accessed through Lambda functions."
            },
            {
              "type": "p",
              "text": "Designers can set contact attributes within flows using the Set contact attributes block. The Check contact attributes block allows branching the flow logic based on attribute values. You can access attribute values using JSONPath syntax like $.Agent.FirstName."
            },
            {
              "type": "p",
              "text": "Sensitive data like credit card numbers should be encrypted using the Store customer input block encryption feature based on public key cryptography."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Accessing external data in flows"
            },
            {
              "type": "p",
              "text": "There are three ways to access external data in flows:"
            },
            {
              "type": "p",
              "text": "The Get customer input block integrates with Amazon Lex to enable chatbot interactions within flows. It provides access to data, like intent names, confidence scores, sentiment analysis, and slot values collected during the conversation."
            },
            {
              "type": "p",
              "text": "The Customer Profiles block retrieves customer data from Amazon Connect Customer Profiles using identifiers like phone numbers or emails."
            },
            {
              "type": "p",
              "text": "The Invoke AWS Lambda function block runs Lambda functions to integrate with external systems, databases, and APIs and store returned data in external attributes."
            },
            {
              "type": "p",
              "text": "Flows error handling"
            },
            {
              "type": "p",
              "text": "Design resilient flows to gracefully handle errors and failures. Common errors include invalid user input, unset dynamic attribute values, and failed Lambda function invocations."
            },
            {
              "type": "p",
              "text": "When errors occur, one option is to continue past the error with an alternate experience path."
            },
            {
              "type": "p",
              "text": "In some use cases, you can gracefully inform the customer about the error and continue. In other cases, depending on your workload, you can disconnect the contact after providing an explanatory message."
            },
            {
              "type": "p",
              "text": "Implement error branches to catch and handle different error conditions appropriately."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow design best practices"
            },
            {
              "type": "p",
              "text": "Take into consideration the following best practices when designing flows:"
            },
            {
              "type": "p",
              "text": "Adopt a modular design approach by breaking flows into reusable components for better manageability."
            },
            {
              "type": "p",
              "text": "Follow a standard naming convention and avoid spaces or special characters in attribute names. Maintain appropriate permissions for all integration points referenced."
            },
            {
              "type": "ul",
              "items": [
                "Store only necessary data in attributes to maintain security.",
                "Use monitoring capabilities and enable logging judiciously to avoid capturing sensitive information.",
                "Incorporate checks for hours of operation and staffing availability before routing contacts to agents.",
                "Use contact data to transfer contacts to agents with relevant skill sets."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Downloadable PDF of the summary"
            },
            {
              "type": "p",
              "text": "To download a PDF version of the summary section, choose anywhere inside the following box. Note: For the best experience with screen readers, use NVDA or JAWS. If you are using VoiceOver, you might experience issues with the downloaded PDF."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Connect Flows Intermediate Course Summary.pdf"
            },
            {
              "type": "p",
              "text": "78.7 KB"
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this section, you reviewed Amazon Connect flows concepts and design best practices. In the next section, you will assess your knowledge of these concepts."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-flows-intermediate-t6",
      "number": 6,
      "title": "Course summary",
      "shortTitle": "Course summary",
      "summary": "Amazon Connect stores data associated with each customer interaction as contact attributes.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-flows-intermediate-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Contact attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect stores data associated with each customer interaction as contact attributes."
            },
            {
              "type": "p",
              "text": "Contact attributes are key-value pairs containing information about the contact, agent, queue, or external data sources."
            },
            {
              "type": "p",
              "text": "Common attribute types include: system attributes, agent attributes, Amazon Lex attributes, and user- defined attributes. External attributes store data from external systems accessed through Lambda functions."
            },
            {
              "type": "p",
              "text": "Designers can set contact attributes within flows using the Set contact attributes block. The Check contact attributes block allows branching the flow logic based on attribute values. You can access attribute values using JSONPath syntax like $.Agent.FirstName."
            },
            {
              "type": "p",
              "text": "Sensitive data like credit card numbers should be encrypted using the Store customer input block encryption feature based on public key cryptography."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t6-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Accessing external data in flows",
          "blocks": [
            {
              "type": "p",
              "text": "There are three ways to access external data in flows:"
            },
            {
              "type": "p",
              "text": "The Get customer input block integrates with Amazon Lex to enable chatbot interactions within flows. It provides access to data like intent names, confidence scores, sentiment analysis, and slot values collected during the conversation."
            },
            {
              "type": "p",
              "text": "The Customer Profiles block retrieves customer data from Amazon Connect Customer Profiles using identifiers like phone numbers or emails."
            },
            {
              "type": "p",
              "text": "The Invoke AWS Lambda function block runs AWS Lambda functions to integrate with external systems, databases, and APIs, storing returned data in external attributes."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t6-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Flows error handling",
          "blocks": [
            {
              "type": "p",
              "text": "Design resilient flows to gracefully handle errors and failures. Common errors include invalid user input, unset dynamic attribute values, and failed Lambda function invocations."
            },
            {
              "type": "p",
              "text": "When errors occur, one option is to continue past the error with an alternate experience path."
            },
            {
              "type": "p",
              "text": "In some use cases, you can gracefully inform the customer about the error and continue. In other cases, depending on your workload, you can disconnect the contact after providing an explanatory message."
            },
            {
              "type": "p",
              "text": "Implement error branches to catch and handle different error conditions appropriately."
            }
          ]
        },
        {
          "id": "connect-flows-intermediate-t6-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Flow design best practices",
          "blocks": [
            {
              "type": "p",
              "text": "Take into consideration the following best practices when designing flows:"
            },
            {
              "type": "ul",
              "items": [
                "Adopt a modular design approach by breaking flows into reusable components for better manageability.",
                "Follow a standard naming convention and avoid spaces or special characters in attribute names.",
                "Maintain appropriate permissions for all integration points referenced.",
                "Store only necessary data in attributes to maintain security.",
                "Utilize monitoring capabilities and enable logging judiciously to avoid capturing sensitive information.",
                "Incorporate checks for hours of operation and staffing availability before routing contacts to agents.",
                "Use contact data to transfer contacts to agents with relevant skillsets."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
