/*
 * Amazon Connect — Chat and Messaging Intermediate
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT CHAT AND MESSAGING INTERMEDIATE.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-chat-messaging-intermediate",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Chat and Messaging Intermediate",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "Channels",
  "description": "The Amazon Connect communication widget, SMS messaging, and the Amazon Connect Chat feature set.",
  "examFormat": "3 topics · ~30 min · 9 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT CHAT AND MESSAGING INTERMEDIATE.txt"
  ],
  "modules": [
    {
      "id": "connect-chat-messaging-intermediate-t1",
      "number": 1,
      "title": "Amazon Connect Communication Widget",
      "shortTitle": "Amazon Connect Communication Widget",
      "summary": "Amazon Connect provides organizations with a set of integrated communication channels. This includes built-in support for web chat, mobile chat,…",
      "duration": "~13 min",
      "lede": null,
      "objectives": [
        "Recognize steps to configure the communication widget."
      ],
      "sections": [
        {
          "id": "connect-chat-messaging-intermediate-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect provides organizations with a set of integrated communication channels. This includes built-in support for web chat, mobile chat, and SMS. Additionally, Amazon Connect offers integration with third-party messaging applications, such as WhatsApp and Facebook Messenger. Through chat and messaging functionality, customers can reach out to organizations using text-based interactions. With this approach, organizations provide personalized support and enhance the overall customer experience."
            },
            {
              "type": "p",
              "text": "Amazon Connect includes a pre-built communication widget that you can add to your website. You configure the communications widget using the Amazon Connect console. You can customize the font and colors. You can also secure the widget so users can only access it from your website. When the configuration steps are complete, the Amazon Connect console generates a short code snippet to add to your organization's website."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Travel agency use case",
          "blocks": [
            {
              "type": "p",
              "text": "AnyCompany Travel wants to offer support through multiple channels, including chat. By using an Amazon Connect communication widget, they can easily integrate chat channels into their website. Users can initiate a chat interaction directly from the agency's website. This feature provides asynchronous real-time assistance with booking inquiries, itinerary changes, or general travel-related questions. You are tasked to create a chat widget."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Creating a chat communication widget",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect communication widget is a built-in interface. It allows organizations to integrate Amazon Connect chat capabilities directly into their websites or web applications. In this section, you will learn how to create a communication widget for chat. You will learn how to customize the look and feel of the user interface and configure widget security settings."
            },
            {
              "type": "p",
              "text": "To explore the steps to create a chat widget, choose the START or arrow buttons to display each of the six steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Creating the chat widget",
                  "body": "Follow the steps required to create a communication widget for the travel agency website visitors."
                },
                {
                  "title": "Log in to the Amazon Connect console",
                  "body": "Log in to the Amazon Connect console at https://<instance-name>.my.connect.aws/ or using your SAML application URL. Replace the <instance-name> with the instance alias you want to log into."
                },
                {
                  "title": "Access the communication widgets menu",
                  "body": "Communications widget menu option. From the left side navigation panel, choose Channels, and then choose Communication widgets."
                },
                {
                  "title": "Add a communications widget",
                  "body": "Communication widget page, add widget button highlighted. On the Communications widgets page, choose Add widget to create a new communications widget."
                },
                {
                  "title": "Enter the communication widget details",
                  "body": "Widget details configuration page, name and description input highlighted. Enter a Name and Description for your communication widget."
                }
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "The Name must be unique for each communications widget created in the Amazon Connect instance."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Add chat functionality"
            },
            {
              "type": "p",
              "text": "Communication options configuration for chat, add chat and allow message receipts selected. In the Communications options section, choose Add chat. With this option, contacts can start a chat from the organization's web portal. You can leave the Allow message receipts option checked."
            },
            {
              "type": "p",
              "text": "Next, choose the flow that is activated when a contact initiates a chat interaction with this widget. You can use an existing flow that you built or one of the sample flows created with your instance."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Check web calling options"
            },
            {
              "type": "p",
              "text": "Web calling configuration options. No options selected. Make sure the Add web calling selection is unchecked for simple chat deployments. You can select it if you want to add video to your interactions."
            },
            {
              "type": "p",
              "text": "Select the Save and continue button to save your changes and continue with more configuration settings."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Customizing a communication widget",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect communication widget empowers businesses to customize the appearance of the client chat interface to create a branded experience. This includes defining the colors and logo that represent their brand."
            },
            {
              "type": "p",
              "text": "To explore the steps to customize the colors of the travel agency chat widget, choose the START or arrow buttons to display each of the three steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Customizing the chat widget look and feel",
                  "body": "Follow the steps required to customize the widget for the travel agency use case. You will use settings such as button styles, widget header, and chat view."
                },
                {
                  "title": "Customize the Start button colors",
                  "body": "Widget access button style configuration view. Select the background color for the Start chat button by entering the hex value for the desired color."
                }
              ]
            },
            {
              "type": "p",
              "text": "Then, choose the White or Black option for the icon color."
            },
            {
              "type": "p",
              "text": "Repeat the same steps for the Minimize chat button."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Customize the widget header"
            },
            {
              "type": "p",
              "text": "Widget header style configuration view. Enter the widget Header message and preferred Header color for your chat widget."
            },
            {
              "type": "p",
              "text": "In the same configuration window, you can select the Widget background color. The default color is white."
            },
            {
              "type": "p",
              "text": "Organizations often want to display their own brand logo on the chat widget their customers interact with. You can configure the logo or banner that represents your brand by entering a Logo URL in this view."
            },
            {
              "type": "p",
              "text": "The logo must be in .svg, .jpg, or .png format. The image size is 280 px (width) by 60 px (height). Images larger than the dimensions above will be scaled to fit the 280 x 60 logo component space."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Customize the chat view"
            },
            {
              "type": "p",
              "text": "Chat view configuration options. You can customize the chat view in the following ways:"
            },
            {
              "type": "ul",
              "items": [
                "Typeface: Use the menu to choose the font for the text in the communications widget.",
                "System Message Display Name: Enter a new display name to override the default. The default is SYSTEM_MESSAGE.",
                "Bot Message Display Name: Enter a new display name to override the default. The default is BOT.",
                "Text Input Placeholder: Enter new placeholder text to override the default. The default is Type a message.",
                "End Chat Button Text: Enter new text to replace the default. The default is End chat."
              ]
            },
            {
              "type": "p",
              "text": "Agent chat bubble color: Choose the colors for the agent's message bubbles by entering hex values (HTML color codes)."
            },
            {
              "type": "p",
              "text": "Customer chat bubble color: Choose the colors for the customer's message bubbles by entering hex values (HTML color codes)."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "Save these settings and continue with domain and security configuration."
            },
            {
              "type": "p",
              "text": "The widget preview that is available in the configuration view can only display logo images stored in Amazon Simple Storage Service (Amazon S3)."
            },
            {
              "type": "p",
              "text": "After the customized communications widget is deployed to the organization's website, all logos from valid sources will be displayed."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring security settings",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect communications widget empowers businesses to securely host the widget on their website. The travel agency wants to ensure their chat widget is only accessible from their official website. To explore the steps to restrict access to their specific website domain, choose the START or arrow buttons to display each of the four steps. This process protects sensitive traveler data and prevents unauthorized access."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Securing the chat widget",
                  "body": "Follow the steps to add website domains and security configuration for the travel agency."
                },
                {
                  "title": "Specify the website domains",
                  "body": "Communication widget configuration, add domain highlighted. To specify the website domains where you expect to display the communications widget, enter the domain URL, and then choose Add domain."
                }
              ]
            },
            {
              "type": "p",
              "text": "You can add up to 50 domains."
            },
            {
              "type": "p",
              "text": "Chat loads only on websites that you select in this step."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "Ensure that your website URLs are valid and do not contain errors. Include the full URL starting with https://. Use https:// for your production websites and applications."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Add security"
            },
            {
              "type": "p",
              "text": "Add security for communication widget request configuration. To secure requests to the communication widget, choose Yes under Add security for your communications widget."
            },
            {
              "type": "p",
              "text": "The website administrator can set up the web servers to issue JSON Web Tokens (JWTs) for new chat requests."
            },
            {
              "type": "p",
              "text": "This provides control when initiating new chats, including the ability to verify that chat requests sent to Amazon Connect are from authenticated users."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Save and continue",
                  "body": "After you save, you can continue to add the communication widget to your website."
                },
                {
                  "title": "Additional security information",
                  "body": "For more information on widget security keys, navigate to the Step 3: Confirm and Copy Communications Widget Code and Security Keys section of the Administrator Guide."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Deploying a communication widget",
          "blocks": [
            {
              "type": "p",
              "text": "With the Amazon Connect communications widget, organizations can copy the generated code and paste it on the website pages where they want the widget to appear."
            },
            {
              "type": "p",
              "text": "To explore the steps to add the communication widget to the website, choose the START or arrow buttons to display each of the four steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Adding the communication widget to the website",
                  "body": "Follow the final steps to deploy the widget to the travel agency website."
                },
                {
                  "title": "Final review",
                  "body": "Confirmation screen displaying successful creation of the chat widget. AnyCompany Travel is ready for the chat widget deployment. The final configuration confirmation page displays Success, and your widget is ready for deployment."
                },
                {
                  "title": "Deploy in a staging environment",
                  "body": "Chat widget example, agent and customer interaction. Before going live, offer AnyCompany Travel the option to test the chat functionality in a staging environment. This will ensure that the widget is working correctly. If you did not configure the staging website domain, select the Edit link and add the change now."
                },
                {
                  "title": "Copy the widget script",
                  "body": "Widget JavaScript code example. The following image shows JavaScript code that you can embed on the websites where you want customers to chat with agents. This script displays the widget in the bottom-right corner of the website."
                },
                {
                  "title": "Accessing the widget from the portal",
                  "body": "Start button and Minimize button displayed on the web portal. When the website loads, travelers first see the Start button. When they chose the Start button, the communications widget opens, and the travel agency customers start their chat."
                }
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned how to create and set up an Amazon Connect communication widget. You customized its appearance, specified website domains, and secured the widget requests. In the next lesson, you will learn how to configure Amazon Connect SMS messaging. Log in to the Amazon Connect console Log in to the Amazon Connect console at https://<instance-name>.my.connect.aws/ or using your SAML application URL. Replace the <instance-name> with the instance alias you want to log into. Access the communication widgets menu Communications widget menu option. From the left side navigation panel, choose Channels, and then choose Communication widgets. Add a communications widget Communication widget page, add widget button highlighted. On the Communications widgets page, choose Add widget to create a new communications widget. Enter the communication widget details Widget details configuration page, name and description input highlighted. Enter a Name and Description for your communication widget. Note: The Name must be unique for each communications widget created in the Amazon Connect instance. Add chat functionality Communication options configuration for chat, add chat and allow message receipts selected. In the Communications options section, choose Add chat. With this option, contacts can start a chat from the organization's web portal. You can leave the Allow message receipts option checked. Next, choose the flow that is activated when a contact initiates a chat interaction with this widget. You can use an existing flow that you built or one of the sample flows created with your instance. Check web calling options Web calling configuration options. No options selected. Make sure the Add web calling selection is unchecked for simple chat deployments. You can select it if you want to add video to your interactions. Select the Save and continue button to save your changes and continue with more configuration settings. Customize the Start button colors Widget access button style configuration view. Select the background color for the Start chat button by entering the hex value for the desired color. Then, choose the White or Black option for the icon color. Repeat the same steps for the Minimize chat button. Customize the widget header Widget header style configuration view. Enter the widget Header message and preferred Header color for your chat widget. In the same configuration window, you can select the Widget background color. The default color is white. Organizations often want to display their own brand logo on the chat widget their customers interact with. You can configure the logo or banner that represents your brand by entering a Logo URL in this view. The logo must be in .svg, .jpg, or .png format. The image size is 280 px (width) by 60 px (height). Images larger than the dimensions above will be scaled to fit the 280 x 60 logo component space. Customize the chat view Chat view configuration options. You can customize the chat view in the following ways: Typeface: Use the menu to choose the font for the text in the communications widget. System Message Display Name: Enter a new display name to override the default. The default is SYSTEM_MESSAGE. Bot Message Display Name: Enter a new display name to override the default. The default is BOT. Text Input Placeholder: Enter new placeholder text to override the default. The default is Type a message. End Chat Button Text: Enter new text to replace the default. The default is End chat. Agent chat bubble color: Choose the colors for the agent's message bubbles by entering hex values (HTML color codes). Customer chat bubble color: Choose the colors for the customer's message bubbles by entering hex values (HTML color codes). Specify the website domains Communication widget configuration, add domain highlighted. To specify the website domains where you expect to display the communications widget, enter the domain URL, and then choose Add domain. You can add up to 50 domains. Chat loads only on websites that you select in this step. Note: Ensure that your website URLs are valid and do not contain errors. Include the full URL starting with https://. Use https:// for your production websites and applications. Add security Add security for communication widget request configuration. To secure requests to the communication widget, choose Yes under Add security for your communications widget. The website administrator can set up the web servers to issue JSON Web Tokens (JWTs) for new chat requests. This provides control when initiating new chats, including the ability to verify that chat requests sent to Amazon Connect are from authenticated users. Save and continue After you save, you can continue to add the communication widget to your website. Additional security information For more information on widget security keys, navigate to the Step 3: Confirm and Copy Communications Widget Code and Security Keys section of the Administrator Guide. Final review Confirmation screen displaying successful creation of the chat widget. AnyCompany Travel is ready for the chat widget deployment. The final configuration confirmation page displays Success, and your widget is ready for deployment. Deploy in a staging environment Chat widget example, agent and customer interaction. Before going live, offer AnyCompany Travel the option to test the chat functionality in a staging environment. This will ensure that the widget is working correctly. If you did not configure the staging website domain, select the Edit link and add the change now. Copy the widget script Widget JavaScript code example. The following image shows JavaScript code that you can embed on the websites where you want customers to chat with agents. This script displays the widget in the bottom-right corner of the website. Accessing the widget from the portal Start button and Minimize button displayed on the web portal. When the website loads, travelers first see the Start button. When they chose the Start button, the communications widget opens, and the travel agency customers start their chat. Lesson 3 of 8 Lesson 2 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-chat-messaging-intermediate-t1-q1",
          "question": "A retail business wants to customize the appearance of the chat widget to match their brand's color scheme and logo. For example, the customer or the agent bubble color. Which options describe the customization options available in Amazon Connect? (Select THREE.) (Select all that apply: Change the button background colors using hex values. / Upload a custom font for the widget text. / Adjust the font style such as bold, or italics. / Add a logo banner from an Amazon S3 bucket or online source. / Adjust the placement of the widgets. / Adjust the chat bubble colors for agents and contacts.)",
          "options": [],
          "answer": "Change the button background colors using hex values.; Add a logo banner from an Amazon S3 bucket or online source.; Adjust the chat bubble colors for agents and contacts.. The available customization options are for:"
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-q2",
          "question": "A financial institution needs to ensure that their Amazon Connect chat widget is only accessible from their official website domain for security reasons. What steps should they take to specify the website domain where the chat widget will be displayed?",
          "options": [
            {
              "id": "A",
              "text": "Configure the communication widget to add security and specify website domains."
            },
            {
              "id": "B",
              "text": "Use the default communication widget settings without any additional configuration."
            },
            {
              "id": "C",
              "text": "Customize the chat view and button styles to match their brand."
            },
            {
              "id": "D",
              "text": "Upload their logo to an Amazon S3 bucket and provide the URL in the widget header."
            }
          ],
          "correctOptionId": "A",
          "rationale": "Organizations can enter the domain URL and choose Add domain to specify the website domains where they want the chat widget to appear."
        },
        {
          "id": "connect-chat-messaging-intermediate-t1-q3",
          "question": "A healthcare organization is implementing the Amazon Connect chat widget on their internal test website for the first time. As the chat widget will be used for testing, they are not concerned about security. What should they do to add the widget to their website? (Select TWO.) (Select all that apply: Embed the generated JavaScript code snippet on their website. / Configure the communication options and specify the website domains. / Customize the chat view and upload their logo to an Amazon S3 bucket. / Set up security keys and add security for the communication widget. / Configure the widget button styles and header.)",
          "options": [],
          "answer": "Embed the generated JavaScript code snippet on their website.; Configure the communication options and specify the website domains.. The organization should embed the generated JavaScript code snippet on their website, configure the communication options, and specify the website domains."
        }
      ]
    },
    {
      "id": "connect-chat-messaging-intermediate-t2",
      "number": 2,
      "title": "Amazon Connect SMS Messaging",
      "shortTitle": "Amazon Connect SMS Messaging",
      "summary": "SMS is a messaging channel, supported by Amazon Connect, that businesses use to communicate with their contacts through text messages. SMS…",
      "duration": "~5 min",
      "lede": null,
      "objectives": [
        "Explore Amazon Connect SMS messaging.",
        "Recognize the process for configuring two-way SMS messaging phone numbers.",
        "Explore phone number types for SMS."
      ],
      "sections": [
        {
          "id": "connect-chat-messaging-intermediate-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "SMS is a messaging channel, supported by Amazon Connect, that businesses use to communicate with their contacts through text messages. SMS messaging offers several benefits, including increased customer satisfaction through prompt responses to customers who prefer text communication using their mobile device. Agents can send and receive text messages from within the Amazon Connect Contact Control Panel (CCP), which improves agent productivity. With Amazon Lex, organizations can automate responses to questions to save agents valuable time and effort. Additionally, SMS messaging reduces the need for customers to navigate phone menus. For more information, see Add an Amazon Lex bot to Amazon Connect."
            },
            {
              "type": "p",
              "text": "To support your contacts through the SMS channel, you can procure a phone number from Amazon Pinpoint SMS. You can then enable two-way SMS messaging for individual phone numbers. When one of your contacts sends a message to your phone number, the message body is sent to Amazon Connect. Optionally, you can update your existing flows to branch when a contact uses SMS."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Requesting a phone number in Amazon Pinpoint",
          "blocks": [
            {
              "type": "p",
              "text": "Some countries require phone numbers and sender IDs to be registered for use in the country. It can take up to 15 business days to process a registration request after it is submitted. For more information about registering, see Registrations."
            },
            {
              "type": "p",
              "text": "To request a number in Amazon Pinpoint SMS, navigate to Step 1: Request a Number in Amazon Pinpoint SMS in the Amazon Connect Administrator Guide. Using Amazon Pinpoint SMS, you can request new SMS-enabled phone numbers or reuse existing SMS-enabled phone numbers in Amazon Connect. You can request short codes, 10-digit long codes (10DLC), and toll-free numbers. These are also known as Origination Identities (OIDs). Each type of OID has a different registration process, and the leasing costs vary. For more information on pricing, navigate to the Amazon Pinpoint Pricing page."
            },
            {
              "type": "p",
              "text": "When deciding what type of phone number to request, consider your throughput needs. SMS messages are delivered in 140-byte sections known as message parts. For more information, review Message Parts per Second (MPS) Limits. Your throughput rate is the number of message parts that you can send each second."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "10–75 message parts per second",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "100 message parts per second or more"
            },
            {
              "type": "p",
              "text": "For 1–3 MPS, use a toll-free number. You can consider using a 10DLC number or short code if your throughput needs exceed these limits as you expand your use cases. 10DLC and short code numbers provide an easier scaling mechanism, but they are also more expensive than toll-free numbers. Claiming and registering 10DLC or short code numbers takes longer than claiming toll free numbers. For more information about requesting a toll-free number in Amazon Pinpoint, see Request a phone number."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed 1–3 MPS, move to the next tab to learn about 10–75 MPS."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Enabling two-way SMS on the phone number",
          "blocks": [
            {
              "type": "p",
              "text": "After you have procured a phone number from Amazon Pinpoint SMS, you configure two-way SMS on the number with Amazon Connect. This will be the message destination. You can enable two-way SMS messaging for individual phone numbers. When one of your contacts sends a message to your phone number, the message body is sent to Amazon Connect. For instructions on how to enable two-way SMS, see Step 2: Enable Two-Way SMS on the Phone Number in the Amazon Connect Administrator Guide."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "Amazon Connect for two-way SMS is available in the AWS Regions listed in Chat Messaging: SMS Subtype."
              ]
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Onboarding phone number to Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "After the Amazon Pinpoint phone number is imported into Amazon Connect, you can view it in the Amazon Connect console. You can onboard the phone number to start sending and receiving SMS messages in Amazon Connect. To learn more, choose the START or arrow buttons to display each of the three steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Introduction",
                  "body": "To start sending and receiving SMS messages in Amazon Connect, use the following instructions."
                },
                {
                  "title": "Go to phone numbers page",
                  "body": "Channels menu, Phone numbers menu option highlighted. In the left navigation, choose Channels, and then select Phone numbers."
                },
                {
                  "title": "Find the SMS number",
                  "body": "Phone numbers channel configuration, example Phone Number and Active Channel highlighted. The SMS number appears on the Phone numbers page."
                },
                {
                  "title": "Associate the SMS phone number with your flow",
                  "body": "Phone number configuration, Contact flow/ IVR input selected Associate the SMS phone number with your flow or use another existing flow. Navigate to the phone number and select the flow from the menu for Contact flow/IVR."
                },
                {
                  "title": "Summary",
                  "body": "You can now use the number for SMS."
                }
              ]
            },
            {
              "type": "p",
              "text": "When you first purchase a phone number, the phone number's status is Pending. When the phone number is ready to use, the phone number's status is Active. If the phone number requires registration, then you must complete that step before the phone number's status changes to Active. Review more information on Registrations."
            },
            {
              "type": "p",
              "text": "To update the flow for SMS contacts, see Step 3: Update Flows to Branch on SMS Contacts. in the Amazon Connect Administrator Guide."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned the benefits of the SMS channel and the process of setting up SMS messaging for Amazon Connect. In the next lesson, you will explore Amazon Connect Chat features. 10–75 message parts per second 100 message parts per second or more For 10–75 MPS, use a 10DLC number. You can also use a short code, which would provide additional room for growth, but it would cost more. For more information, see Requesting dedicated long codes for messaging. Now that you have reviewed 10-75 MPS, move to the next tab to learn about 100 MPS. 100 message parts per second or more For 100 MPS or more, use a short code. When you create your request in the AWS Support Center console, specify the throughput rate that you want your short code to support. By default, US short codes support 100 MPS, but you can increase the throughput rate beyond that rate for an additional monthly fee. For more information, see How to request short codes for messaging. Go to phone numbers page Channels menu, Phone numbers menu option highlighted. In the left navigation, choose Channels, and then select Phone numbers. Find the SMS number Phone numbers channel configuration, example Phone Number and Active Channel highlighted. The SMS number appears on the Phone numbers page. Associate the SMS phone number with your flow Phone number configuration, Contact flow/ IVR input selected Associate the SMS phone number with your flow or use another existing flow. Navigate to the phone number and select the flow from the menu for Contact flow/IVR. Lesson 4 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-chat-messaging-intermediate-t2-q1",
          "question": "AnyOrganization has recently decided to incorporate Short Message Service (SMS) messaging into their communication channels. A developer is tasked with guiding AnyOrganization through the process of setting up SMS. Which type of phone number should AnyOrganization use if their estimated SMS throughput needs are about 50 message parts per second (MPS)?",
          "options": [
            {
              "id": "A",
              "text": "Toll-free number"
            },
            {
              "id": "B",
              "text": "10-digit long code (10DLC) number"
            },
            {
              "id": "C",
              "text": "Short code"
            },
            {
              "id": "D",
              "text": "Origination identity"
            }
          ],
          "correctOptionId": "B",
          "rationale": "They should use a 10DLC number. They can also use a short code, which would provide additional room for growth, but it would also cost more."
        },
        {
          "id": "connect-chat-messaging-intermediate-t2-q2",
          "question": "After successfully procuring a phone number from Amazon Pinpoint Short Message Service (SMS), AnyOrganization needs to enable two-way SMS messaging for their newly acquired number. As a consultant, you need to guide them through the process of configuring two-way SMS on the phone number. Which statement accurately describes the next step in this process?",
          "options": [
            {
              "id": "A",
              "text": "Configure the phone number to send SMS messages directly to Amazon Connect."
            },
            {
              "id": "B",
              "text": "Configure two-way SMS on the phone number with Amazon Connect as the message destination."
            },
            {
              "id": "C",
              "text": "Associate the phone number with an Amazon Pinpoint SMS campaign."
            },
            {
              "id": "D",
              "text": "Enable SMS messaging through Amazon Simple Notification Service (Amazon SNS)."
            }
          ],
          "correctOptionId": "B",
          "rationale": "After you have successfully procured a phone number from Amazon Pinpoint SMS, configure two-way SMS on the phone number with Amazon Connect as the message destination."
        },
        {
          "id": "connect-chat-messaging-intermediate-t2-q3",
          "question": "During Short Message Service (SMS) setup at AnyCompany, a contact center administrator encounters a scenario where the phone number status is showing as Pending in the Amazon Connect console. What could be the reason for this status, and what action should be taken?",
          "options": [
            {
              "id": "A",
              "text": "The phone number is not yet ready for use, and no action is required."
            },
            {
              "id": "B",
              "text": "The phone number requires registration, and the team must complete the registration step before the status changes to Active."
            },
            {
              "id": "C",
              "text": "There is an issue with the phone number, and the team should contact AWS Support."
            },
            {
              "id": "D",
              "text": "The phone number is associated with the wrong flow, and the team needs to reassign it."
            }
          ],
          "correctOptionId": "B",
          "rationale": "When the team first purchases a phone number, the phone number's status is Pending. When the phone number is ready to use, the phone number's status is Active. If the phone number requires registration, then the administrator must complete that step before the phone number's status changes to Active."
        }
      ]
    },
    {
      "id": "connect-chat-messaging-intermediate-t3",
      "number": 3,
      "title": "Amazon Connect Chat Features",
      "shortTitle": "Amazon Connect Chat Features",
      "summary": "Amazon Connect provides a comprehensive set of capabilities to enhance the chat experience for both contacts and agents. It offers message…",
      "duration": "~12 min",
      "lede": null,
      "objectives": [
        "Recognize the benefits of message receipts.",
        "Recognize the process of configuring attachment scanning.",
        "Recognize the steps to set up a persistent chat experience.",
        "Explore quick responses for chat contacts."
      ],
      "sections": [
        {
          "id": "connect-chat-messaging-intermediate-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect provides a comprehensive set of capabilities to enhance the chat experience for both contacts and agents. It offers message receipts to ensure transparent communication. With quick responses, agents are presented with responses that they can use during chat contacts. With persistent chat enabled, contacts can resume previous conversations with the context carried forward."
            },
            {
              "type": "p",
              "text": "Additionally, contacts and agents can add structure and clarity to their messages using message formatting options such as bulleted lists and hyperlinks. To protect against security threats, organizations can configure attachment virus scanning, prioritizing security during file transfers. With these chat features, businesses can improve customer experiences and agent productivity. In this lesson, you will explore how these Amazon Connect features work."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Enabling chat message receipts",
          "blocks": [
            {
              "type": "p",
              "text": "Contacts often express frustration when they are unsure if their messages have been received or read by an agent. By enabling chat message receipts, the contact center can provide real-time confirmations to contacts about their messages. This feature can help improve customer satisfaction and reduce confusion during chat interactions."
            },
            {
              "type": "p",
              "text": "By default, messages are marked as delivered or read when message receipts are enabled in the communication widget for chat."
            },
            {
              "type": "p",
              "text": "A chat message is marked as Delivered when one of the following conditions occurs:"
            },
            {
              "type": "p",
              "text": "A message is received by the contact or agent AND the communication widget is not in focus. For example, a message is received, but the recipient navigates away from the widget to a new browser tab."
            },
            {
              "type": "p",
              "text": "A message is received by the contact or agent AND the recipient does not scroll all the way down using the scroll bar."
            },
            {
              "type": "p",
              "text": "A chat message is marked as Read when one of the following conditions occurs:"
            },
            {
              "type": "p",
              "text": "A message is received by the contact or agent AND the recipient opens the communication widget."
            },
            {
              "type": "p",
              "text": "A message is received by the contact or agent AND the recipient scrolls all the way down to view the latest incoming messages."
            },
            {
              "type": "p",
              "text": "The Amazon Connect message receipts feature is not applicable to the SMS messaging channel."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Use case",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Chat message receipts"
            },
            {
              "type": "p",
              "text": "María García contacts AnyCompany customer service to reset her password. She initiates a chat and starts a conversation with Jane Doe, who is an agent at AnyCompany. María sees when her messages to Jane are delivered and read."
            },
            {
              "type": "p",
              "text": "Example agent and customer chat interaction, Chat message delivered."
            },
            {
              "type": "p",
              "text": "Similarly, Jane sees when her messages are sent to María, and when she reads them. This provides transparency to both María and Jane and improves the overall chat experience."
            },
            {
              "type": "p",
              "text": "Example agent and customer chat interaction, Chat message read."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Configuring attachment scanning"
            },
            {
              "type": "p",
              "text": "With Amazon Connect, contacts and agents can share files during chat conversations. Attachments are included in the chat transcript to help ensure the context from the conversation is available if a contact is transferred. The files are stored in an Amazon Simple Storage Service (Amazon S3) bucket to offer access from other systems such as a customer relationship management (CRM) system or a case management system. Organizations can integrate a third-party or custom-built attachment scanner and use it to approve or reject attachments in Amazon Connect."
            },
            {
              "type": "p",
              "text": "The Amazon Connect attachment scanning feature is not applicable to the SMS messaging channel."
            },
            {
              "type": "p",
              "text": "To learn more about configuring attachment scanning, choose the START or arrow buttons to display each of the three steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Introduction",
                  "body": "Follow the instructions to enable attachment scanning for your Amazon Connect instance."
                },
                {
                  "title": "Create an AWS Lambda function",
                  "body": "The first step to configure attachment scanning is to create an AWS Lambda function. For more information about Lambda functions, AWS Lambda function. For more information, see Step 1: Create a Lambda Function That Handles Scanning in the Amazon Connect Administrator Guide."
                },
                {
                  "title": "Navigate to Amazon Connect instance settings",
                  "body": "Amazon Connect instances page in AWS Management Console, example instance highlighted. Open the AWS Management Console. Navigate to the Amazon Connect service, and then select your instance. On the instances page, choose the instance alias. The instance alias is also your instance name, which appears in your Amazon Connect URL."
                },
                {
                  "title": "Enable attachments scanning",
                  "body": "Navigation pane Data storage view, enable attachment scanning for an Amazon Connect instance is highlighted. In the navigation pane, choose Data storage. On the Data storage page, in the Attachments section, choose Edit, and then select Enable attachments scanning. Use the Lambda Functions menu to select the Lambda function that you added in Step 1: Create a Lambda function that handles scanning."
                },
                {
                  "title": "Summary",
                  "body": "To complete the process and enable attachment scanning, choose Save. Attachment scanning is now enabled for your Amazon Connect instance."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Use case",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Attachment scanning"
            },
            {
              "type": "p",
              "text": "John Doe contacts AnyCompany Financial Institution to open a bank account. He uses the Amazon Connect communication widget to initiate a chat conversation with a customer service agent, Efua Owusu. As a part of the account opening process, Efua requests that John send his identity document. John mistakenly uploads a virus using the paperclip icon located in the communication widget."
            },
            {
              "type": "p",
              "text": "Attachment option in chat interface, file attachment button highlighted."
            },
            {
              "type": "p",
              "text": "AnyCompany configured Amazon Connect attachment scanning to scan chat documents that are sent by both customers and agents. John receives a notification that his attachment was rejected. Efua also sees that John attempted to send an incorrect file."
            },
            {
              "type": "p",
              "text": "Chat interface, rejected attachment highlighted."
            },
            {
              "type": "p",
              "text": "John attempts to send the correct document again so that Efua can help him set up a new account."
            },
            {
              "type": "ul",
              "items": [
                "Sending attachment in chat interface.",
                "John successfully sends his identity document, and Efua proceeds to open a bank account for John."
              ]
            },
            {
              "type": "p",
              "text": "Chat interface successful attachment highlighted."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Setting up persistent chat experience"
            },
            {
              "type": "p",
              "text": "Amazon Connect empowers organizations to configure chat transcripts and context to be carried over when customers resume chatting after earlier sessions have ended."
            }
          ]
        },
        {
          "id": "connect-chat-messaging-intermediate-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Use case",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Persistent chat experience"
            },
            {
              "type": "p",
              "text": "Pat Candella, a customer service manager, arrives at his desk to find several emails from frustrated customers. The customers are complaining about having to repeat their issues multiple times when they resume conversations with agents."
            },
            {
              "type": "p",
              "text": "Pat knows that this is an ongoing problem that negatively impacts the customer experience. He decides it's time to implement persistent chat functionality. With persistent chat, customers can pick up where they left off in previous conversations."
            },
            {
              "type": "p",
              "text": "Pat reviews the Amazon Connect Administrator Guide. He understands that with persistent chat, chat transcripts and context are carried over when customers return to continue chatting after earlier sessions have ended. This means customers won't have to frustratingly re-explain everything. Pat reviewed the chat rehydration types, which is the process to retrieve chat transcripts from previous chat contacts."
            },
            {
              "type": "p",
              "text": "Amazon Connect supports two rehydration types:"
            },
            {
              "type": "ul",
              "items": [
                "ENTIRE_PAST_SESSION: This type starts a new chat session and rehydrates all chat segments from past chat sessions.",
                "FROM_SEGMENT: This type starts a new session and rehydrates from the specified past chat segment."
              ]
            },
            {
              "type": "p",
              "text": "To get started, Pat meets with Martha Rivera from the IT department. Martha explains that there are two ways to enable persistent chat:"
            },
            {
              "type": "p",
              "text": "Specify a previous contact ID when creating a new chat using the SourceContactId parameter of the StartChatContact API. For more information, see StartChatContact."
            },
            {
              "type": "ul",
              "items": [
                "Add a block to the flow. For more information, see Flow Block: Create Persistent Contact Association.",
                "They decide to set up persistent chat experiences within a flow."
              ]
            },
            {
              "type": "p",
              "text": "Create persistent contact association flow block."
            },
            {
              "type": "p",
              "text": "After a chat contact has been created, they add the Create persistent contact association block to the flow and specify a source contact ID."
            },
            {
              "type": "p",
              "text": "This will require building a repository to store and retrieve the previous contact IDs. A contact ID is a unique identifier in Amazon Connect for each contact, such as an incoming chat request."
            },
            {
              "type": "p",
              "text": "They decide to select ENTIRE_PAST_SESSION as the rehydration type to retrieve all chat transcripts from past conversations."
            },
            {
              "type": "p",
              "text": "Create persistent contact association flow block configuration, the Select rehydration type and Use attributes are highlighted."
            },
            {
              "type": "p",
              "text": "Creating quick responses"
            },
            {
              "type": "p",
              "text": "Quick responses provide contact center agents with pre-written responses that they can use during chat contacts. Quick responses are especially useful for answering common inquires. They help improve agent productivity, reduce handle times, and improve customer satisfaction scores."
            },
            {
              "type": "p",
              "text": "To learn more about configuring quick responses for chat contacts, choose the START or arrow buttons to display each of the six steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Introduction",
                  "body": "Review the steps required to configure quick responses for chat contacts."
                },
                {
                  "title": "Assign permissions",
                  "body": "Agent application permissions page, content management quick responses highlighted. To create and manage quick responses in the Amazon Connect console, users need the Content Management security profile permissions. For more information, see Assign Permissions to Manage Quick Responses in the Amazon Connect Administrator Guide."
                },
                {
                  "title": "Navigate to the Quick responses page",
                  "body": "Agent applications Quick responses menu option highlighted Log in to the Amazon Connect console at https://<instance-name>.my.connect.aws. For more information on how to find your instance name, see Find Your Amazon Connect Instance Name."
                }
              ]
            },
            {
              "type": "p",
              "text": "On the navigation bar, choose Agent applications, and then Quick responses."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Create an Amazon Q in Connect knowledge base"
            },
            {
              "type": "p",
              "text": "Quick responses getting started page, get started button highlighted. Create an Amazon Q in Connect knowledge base using the Amazon Connect console to store quick responses."
            },
            {
              "type": "p",
              "text": "On the Quick responses page, choose Get started."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "If the Get started button isn't available, sign in with an account that has the admin security profile or ask another admin for help."
              ]
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Wait for the process to complete",
                  "body": "Amazon Q Connect knowledge base creation progress bar. Remain on the page until the process ends. Do not refresh the page until the process ends. An indicator shows the status."
                },
                {
                  "title": "The Amazon Q in Connect knowledge base is ready",
                  "body": "Quick responses page, status column highlighted. The finished knowledge base provides two sample quick responses."
                }
              ]
            },
            {
              "type": "p",
              "text": "The sample responses are associated with routing profiles, if that exists in your Amazon Connect instance. For more information see, Concepts: Routing Profiles."
            },
            {
              "type": "p",
              "text": "The sample responses are set to Inactive, which means agents can't see or search for them."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "If the basic routing profile is not present in your Amazon Connect instance, the sample quick responses are associated with All routing profiles. After you activate a sample quick response, all agents can see and search for that response, regardless of their assigned routing profiles."
              ]
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Activate quick responses",
                  "body": "Quick response configuration details, radio button selected to activate making the response visible for agents. Activating a sample quick response makes it visible and searchable by agents assigned to the basic routing profile."
                },
                {
                  "title": "Summary",
                  "body": "You have activated the sample quick responses."
                }
              ]
            },
            {
              "type": "p",
              "text": "To configure additional quick responses, see Add Quick Responses for Use with Chat Contacts in the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "To personalize quick responses with user attributes such as customer’s name, see Add Attributes for Personalizing Quick Responses in the Amazon Connect Administrator Guide."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you explored chat features in Amazon Connect aimed at improving the contact and agent experience. You learned the benefits of message receipts and attachment scanning and explored the steps to set up a persistent chat experience. In the next lesson, you will review the course summary and prepare for the end-of-course assessment. Create an AWS Lambda function The first step to configure attachment scanning is to create an AWS Lambda function. For more information about Lambda functions, AWS Lambda function. For more information, see Step 1: Create a Lambda Function That Handles Scanning in the Amazon Connect Administrator Guide. Navigate to Amazon Connect instance settings Amazon Connect instances page in AWS Management Console, example instance highlighted. Open the AWS Management Console. Navigate to the Amazon Connect service, and then select your instance. On the instances page, choose the instance alias. The instance alias is also your instance name, which appears in your Amazon Connect URL. Enable attachments scanning Navigation pane Data storage view, enable attachment scanning for an Amazon Connect instance is highlighted. In the navigation pane, choose Data storage. On the Data storage page, in the Attachments section, choose Edit, and then select Enable attachments scanning. Use the Lambda Functions menu to select the Lambda function that you added in Step 1: Create a Lambda function that handles scanning. Summary To complete the process and enable attachment scanning, choose Save. Attachment scanning is now enabled for your Amazon Connect instance. Assign permissions Agent application permissions page, content management quick responses highlighted. To create and manage quick responses in the Amazon Connect console, users need the Content Management security profile permissions. For more information, see Assign Permissions to Manage Quick Responses in the Amazon Connect Administrator Guide. Navigate to the Quick responses page Agent applications Quick responses menu option highlighted Log in to the Amazon Connect console at https://<instance-name>.my.connect.aws. For more information on how to find your instance name, see Find Your Amazon Connect Instance Name. On the navigation bar, choose Agent applications, and then Quick responses. Navigate to the Quick responses page Agent applications Quick responses menu option highlighted Log in to the Amazon Connect console at https://<instance-name>.my.connect.aws. For more information on how to find your instance name, see Find Your Amazon Connect Instance Name. On the navigation bar, choose Agent applications, and then Quick responses. Create an Amazon Q in Connect knowledge base Quick responses getting started page, get started button highlighted. Create an Amazon Q in Connect knowledge base using the Amazon Connect console to store quick responses. On the Quick responses page, choose Get started. Note: If the Get started button isn't available, sign in with an account that has the admin security profile or ask another admin for help.Step 4 Wait for the process to complete Amazon Q Connect knowledge base creation progress bar. Remain on the page until the process ends. Do not refresh the page until the process ends. An indicator shows the status. The Amazon Q in Connect knowledge base is ready Quick responses page, status column highlighted. The finished knowledge base provides two sample quick responses. The sample responses are associated with routing profiles, if that exists in your Amazon Connect instance. For more information see, Concepts: Routing Profiles. The sample responses are set to Inactive, which means agents can't see or search for them. Note: If the basic routing profile is not present in your Amazon Connect instance, the sample quick responses are associated with All routing profiles. After you activate a sample quick response, all agents can see and search for that response, regardless of their assigned routing profiles. Activate quick responses Quick response configuration details, radio button selected to activate making the response visible for agents. Activating a sample quick response makes it visible and searchable by agents assigned to the basic routing profile. Summary You have activated the sample quick responses. To configure additional quick responses, see Add Quick Responses for Use with Chat Contacts in the Amazon Connect Administrator Guide. To personalize quick responses with user attributes such as customer’s name, see Add Attributes for Personalizing Quick Responses in the Amazon Connect Administrator Guide."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-chat-messaging-intermediate-t3-q1",
          "question": "AnyCompany, a retail business, wants to provide a transparent chat experience for its customers. To achieve this, the company needs to implement a feature that confirms when messages are delivered and read by agents. Which feature should AnyCompany enable to meet this requirement?",
          "options": [
            {
              "id": "A",
              "text": "Attachment scanning"
            },
            {
              "id": "B",
              "text": "Persistent chat experience"
            },
            {
              "id": "C",
              "text": "Message receipts"
            },
            {
              "id": "D",
              "text": "Quick responses"
            }
          ],
          "correctOptionId": "C",
          "rationale": "By enabling chat message receipts, the contact center can provide real-time confirmations to customers that their messages have been delivered and seen by an agent."
        },
        {
          "id": "connect-chat-messaging-intermediate-t3-q2",
          "question": "Efua Owusu, a supervisor at AnyCompany Retail, wants to use a feature that can help agents respond efficiently to common inquiries during chat sessions. Which feature is Efua referring to?",
          "options": [
            {
              "id": "A",
              "text": "Chat message receipts"
            },
            {
              "id": "B",
              "text": "Attachment scanning"
            },
            {
              "id": "C",
              "text": "Persistent chat"
            },
            {
              "id": "D",
              "text": "Quick responses"
            }
          ],
          "correctOptionId": "D",
          "rationale": "Quick responses can help agents respond efficiently to common inquiries. This improves agent productivity and customer satisfaction scores."
        },
        {
          "id": "connect-chat-messaging-intermediate-t3-q3",
          "question": "AnyCompany's contact center has been receiving complaints from contacts about repeating their issues multiple times when resuming chat conversations with agents. The manager, Efua Owusu, wants to implement a solution to address this problem. What action can Efua take to streamline the customer conversation by continuing where they left off in previous chat sessions?",
          "options": [
            {
              "id": "A",
              "text": "Enable chat message receipts."
            },
            {
              "id": "B",
              "text": "Configure attachment scanning."
            },
            {
              "id": "C",
              "text": "Set up a persistent chat experience."
            },
            {
              "id": "D",
              "text": "Create quick responses."
            }
          ],
          "correctOptionId": "C",
          "rationale": "With persistent chat, customers can pick up where they left off in previous conversations."
        }
      ]
    }
  ],
  "quiz": null
};
