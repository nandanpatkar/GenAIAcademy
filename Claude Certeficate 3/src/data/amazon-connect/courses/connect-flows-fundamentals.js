/*
 * Amazon Connect — Flows Fundamentals
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT FLOWS FUNDAMENTAL.txt
 *            conne-text/Amazon Connect Flows Fundamentals Summary.txt  (from conne/Amazon Connect Flows Fundamentals Summary.pdf)
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-flows-fundamentals",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Flows Fundamentals",
  "provider": "Amazon Web Services",
  "level": "Fundamentals",
  "category": "Flows",
  "description": "Flow types and the flow designer, the blocks that enable additional Amazon Connect functionality, and operational support blocks.",
  "examFormat": "6 topics · ~40 min · 6 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT FLOWS FUNDAMENTAL.txt",
    "conne-text/Amazon Connect Flows Fundamentals Summary.txt  (from conne/Amazon Connect Flows Fundamentals Summary.pdf)"
  ],
  "modules": [
    {
      "id": "connect-flows-fundamentals-t1",
      "number": 1,
      "title": "Introduction to Amazon Connect Flows",
      "shortTitle": "Introduction to Amazon Connect Flows",
      "summary": "Amazon Connect flows is a built-in feature that defines customer journeys. It provides a seamless experience across channels, such as voice, chat,…",
      "duration": "~9 min",
      "lede": null,
      "objectives": [
        "Recognize Amazon Connect flow types."
      ],
      "sections": [
        {
          "id": "connect-flows-fundamentals-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect flows is a built-in feature that defines customer journeys. It provides a seamless experience across channels, such as voice, chat, and tasks."
            },
            {
              "type": "p",
              "text": "With flows, organizations can design their interactive voice response (IVR) or chatbot experiences to provide customers with self-service options to answer their inquiries. Flow capabilities empower designers to build step-by-step guides for agents to help them handle contact inquiries quickly and accurately. Flows offer the ability to create task automation for agents. With flows, organizations craft outbound communications to proactively engage their customers."
            },
            {
              "type": "p",
              "text": "Flows define the path users follow when engaging organizations' contact centers for both customers and agents. Flows help you tailor greetings, menus, self-service options, and call routing. You can implement customized experiences aligned with your business needs."
            },
            {
              "type": "p",
              "text": "Amazon Connect provides default flows with built-in customer experiences. You can also build custom flows tailored to your organization's needs. You can refer to sample flows to learn how to build custom flows. Flows help shape customer experiences through features like IVR prompts, chatbots, call recording, agent routing, and wait treatments."
            },
            {
              "type": "p",
              "text": "To navigate to Flows, you can select Flows under the Routing menu of the Amazon Connect console."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Default and sample flows",
          "blocks": [
            {
              "type": "p",
              "text": "There are two types of built-in flows: default and sample flows. They are available as soon as the Amazon Connect instance is created, and their names are prefixed with either default or sample."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Default flows",
                  "body": "Default flows are experiences that are activated without any IVR designer intervention. An example of a default flow is the Default agent hold flow. This flow is activated when agents place a call on hold. There is no action an IVR designer needs to take to ensure this flow is started because the flow is automatically invoked. To learn more about the default flows available in Amazon Connect, navigate to the Default flows section of the Amazon Connect Administrator Guide."
                },
                {
                  "title": "Sample flows",
                  "body": "Sample flows are designed to help you learn how to create your own flows that work in a similar way. To learn more about adding a queued callback flow to your call center, navigate to the Sample queued callback flow. These flows are not intended to be used for production environments as is. To learn more about the default flows available in Amazon Connect, navigate to the Sample flows section of the Amazon Connect Administrator Guide."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Flow types",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect contains different flow types designed to support different scenarios. For example, when a call is answered in Amazon Connect, an inbound flow is activated. When an agent puts a call on hold, an Agent and Customer hold flow is activated."
            },
            {
              "type": "p",
              "text": "Each flow type contains flow blocks that perform specific actions. For example, when Amazon Connect answers an incoming call, you can use a Play prompt action to greet the caller."
            },
            {
              "type": "p",
              "text": "When you create a flow, you need to select the appropriate flow type that is relevant to your scenario. This is because certain actions are only allowed in specific flow types. For example, transfer a contact to a queue is not available in the Customer hold flow type."
            },
            {
              "type": "p",
              "text": "The following are the nine types of flows."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Inbound flow"
            },
            {
              "type": "p",
              "text": "This is the default flow type created when you choose Create flow."
            },
            {
              "type": "p",
              "text": "Choose this flow type to activate your customer experiences for incoming contacts before a transfer to a queue. You can also use this type of flow to create agent step-by-step guides or implement specific treatments, such as a survey, after an agent disconnects from a call. This type of flow is available for contacts across all channels supported by Amazon Connect, including voice, digital messaging, and tasks."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Customer queue flow"
            },
            {
              "type": "p",
              "text": "This flow type defines the experience customers have while they are waiting in a queue before they are connected to an agent."
            },
            {
              "type": "p",
              "text": "Flows are interruptible, helping you incorporate various actions and prompts to enhance the waiting experience in the Customer queue. For instance, you can include audio prompts to apologize for the delay or provide estimated wait times. If a customer has been waiting for an extended period (for example, over 5 minutes), you can design the flow to offer alternative options. This can involve presenting a dual-tone multi-frequency (DTMF) menu to deflect the caller to a chatbot or offer a callback. This flow is interruptible, meaning that customers can select options as soon as they are presented."
            },
            {
              "type": "p",
              "text": "You can use the Change routing priority/age flow block to change the call order in queue. For example, you can move the contact to the front of the queue or to the back of the queue."
            },
            {
              "type": "p",
              "text": "It's important to note that customer queue flows can handle channels such voice, chat, and tasks."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Customer hold flow"
            },
            {
              "type": "p",
              "text": "The Customer hold flow defines the experience that a customer has while an agent places them on hold during a voice call. This flow type differs from the customer queue flow, which handles queued customer interactions."
            },
            {
              "type": "p",
              "text": "When an agent puts a customer on hold, the Customer hold flow runs. Within this flow, you can configure one or more audio prompts to be played in a loop using the Loop prompts block. These prompts can provide information, updates, or even music to enhance the customer's on-hold experience."
            },
            {
              "type": "p",
              "text": "The Customer hold flow is designed specifically for voice contacts and cannot be used for other contact types."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Customer whisper flow"
            },
            {
              "type": "p",
              "text": "The customer whisper flow helps you define the customer experience just before a contact is joined with an agent. This flow provides organizations with an opportunity to play specific uninterrupted messages or prompts to customers before they start their interaction with an agent. A use case for customer whisper flow is playing mandatory announcements, like recording a disclaimer for quality assurance. This ensures that customers are aware of the recording and can make an informed decision before proceeding with the call."
            },
            {
              "type": "p",
              "text": "Customer whisper flow is only compatible with voice and chat contacts. Implementing the Customer whisper flow can ensure a consistent, professional customer experience while meeting legal or regulatory disclosure requirements before agent interaction."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Agent whisper flow"
            },
            {
              "type": "p",
              "text": "The Agent whisper flow defines the agent experience just before receiving a contact from a customer. This flow type plays specific uninterrupted messages to agents before they start their interaction with customers."
            },
            {
              "type": "p",
              "text": "For example, consider a scenario where an agent receives contacts from two queues, namely Sales and Customer Support. To notify an agent about which queue the contact originates from, you can use the Agent whisper flow to play the name of the queue. This flow is compatible with voice and chat interactions."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Agent hold flow",
                  "body": "The Agent hold flow defines the agent experience as part of an inbound voice contact while the call is placed on hold. With this flow, one or more audio prompts can be played to an agent using the Loop prompts block while waiting on hold. This flow is only compatible with voice contacts."
                },
                {
                  "title": "Transfer to agent flow",
                  "body": "The Transfer to agent flow type defines the agent experience when transferring a contact to another agent. These flows are associated with transfer to agent quick connects. They might involve playing messages and completing the Transfer to agent flow block. This flow works with channels such as voice, chat, and tasks."
                },
                {
                  "title": "Transfer to queue flow",
                  "body": "The Transfer to queue flow type defines the agent experience when transferring a contact to another queue. This flow type is associated with Transfer to queue quick connects. This is useful to verify hours of operation and staffing levels to ensure agents are available to handle the contact in the target queue. This flow works with channels such as voice, chat, and tasks."
                },
                {
                  "title": "Outbound whisper flow",
                  "body": "The Outbound whisper flow type defines what the customer experience is before agent interaction on outbound calls. The messages played to the customer in this flow are played to completion. Organizations can play uninterrupted messages before customer-agent interactions, like mandatory announcements on the call being recorded. This flow is compatible with voice and chat contacts only."
                },
                {
                  "title": "Disconnect flow",
                  "body": "The Disconnect flow is not a default contact flow type, but is important to understand when understanding different flow types."
                }
              ]
            },
            {
              "type": "p",
              "text": "Disconnect flows specify the inbound flow actions performed when an agent disconnects while the customer remains connected. This flow type is typically used for capturing post-contact surveys. For example, when an agent disconnects and the contact stays on the line, the flow offers a customer satisfaction (CSAT) survey."
            },
            {
              "type": "p",
              "text": "A disconnect event is classified as the following:"
            },
            {
              "type": "ul",
              "items": [
                "A chat or task is disconnected.",
                "An agent disconnects a voice call.",
                "A task is disconnected as a result of a flow action.",
                "A task expires. The task is automatically disconnected if it is not completed in 7 days."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow blocks"
            },
            {
              "type": "p",
              "text": "Flow blocks visually represent the actions available in a flow. IVR designers use these blocks to create flows in the Amazon Connect flow designer. The following image outlines the process a designer follows starting from the initial Entry block. The process progresses through various flow blocks, such as checking contact attributes, playing prompts, and setting a disconnect flow."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Use case",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Helping agents prepare for an upcoming interaction"
            },
            {
              "type": "p",
              "text": "Nikki Wolf, an agent at AnyCompany Retail, lacks customer background information when answering calls. For each call, Nikki is asking for information the customer has already provided in the self service IVR. This is leading to poor CSAT scores."
            },
            {
              "type": "p",
              "text": "Nikki provides her feedback to her direct manager, then informs IT of the pain points that they are experiencing. John Stiles, the IVR designer, is tasked with finding a solution to Nikki’s pain point."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "How can he solve for this?",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Solution"
            },
            {
              "type": "p",
              "text": "One solution for solving the problem is to use an Agent whisper flow. When a customer calls into the contact center, John can configure Amazon Connect to initiate the Agent whisper flow. During this process, the system can retrieve relevant customer data from various sources, such as customer relationship management (CRM) systems or databases. This data is then synthesized into a brief audio message, which is played directly to the agent's headset before the call is connected."
            },
            {
              "type": "p",
              "text": "The Agent whisper flow can help agents like Nikki prepare for the upcoming interaction by providing them with crucial customer information upfront. This enables personalized service because agents can address concerns effectively from the start."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned different types of Amazon Connect flows and were introduced to flow blocks. In the next lesson, you will learn how to use the Amazon Connect flow designer to create and manage flows. Lesson 3 of 9 Lesson 2 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-fundamentals-t1-q1",
          "question": "It is time to check your understanding of the content covered in this lesson. Arnav Desai is an experience designer at AnyCompany Petcare. Arnav wants to notify callers contacting the call center their call will be recorded for quality monitoring and training purposes. He wants to play this message just before callers are connected with an agent. Which type of Amazon Connect flow should Arnav use?",
          "options": [
            {
              "id": "A",
              "text": "Inbound flow"
            },
            {
              "id": "B",
              "text": "Customer hold flow"
            },
            {
              "id": "C",
              "text": "Outbound whisper flow"
            },
            {
              "id": "D",
              "text": "Customer whisper flow"
            }
          ],
          "correctOptionId": "D",
          "rationale": "A Customer whisper flow plays a message for the customer when the customer and agent are joined. Arnav can use a Customer whisper flow to play a message to the caller and notify them that their call will be recorded for quality monitoring and training purposes."
        }
      ]
    },
    {
      "id": "connect-flows-fundamentals-t2",
      "number": 2,
      "title": "Flow Designer",
      "shortTitle": "Flow Designer",
      "summary": "The flow designer in Amazon Connect is a visual tool that helps you create and customize contact-center experiences. With the drag-and-drop…",
      "duration": "~8 min",
      "lede": null,
      "objectives": [
        "Explore the key capabilities of the flow designer."
      ],
      "sections": [
        {
          "id": "connect-flows-fundamentals-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "The flow designer in Amazon Connect is a visual tool that helps you create and customize contact-center experiences. With the drag-and-drop interface, you can add and configure various flow blocks without any coding. By focusing on personalization and continuous optimization across voice and digital channels, organizations can improve customer satisfaction with dynamic, tailored experiences."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Key capabilities of the flow designer",
          "blocks": [
            {
              "type": "p",
              "text": "Using the flow designer empowers organizations to create contact center experiences. The key capabilities of the flow designer include the following:"
            },
            {
              "type": "p",
              "text": "Design flows: A drag-and-drop interface where you can build custom flows by adding various flow blocks like prompts, transfers, queues, and integrations with other Amazon Web Services (AWS) services."
            },
            {
              "type": "p",
              "text": "Configure flow logic: You can define the logic and decision points in your flows by connecting the flow blocks and configuring the conditions and actions for each block."
            },
            {
              "type": "p",
              "text": "Integrate with other AWS services: Integrate your flows with other AWS services like Amazon Lex for natural language processing (NLP) and AWS Lambda for custom logic."
            },
            {
              "type": "p",
              "text": "Test and debug flows: You can test your flows and debug any issues before publishing them in your environment."
            },
            {
              "type": "p",
              "text": "Manage flow versions: You can create and manage different versions of your flows. This helps you roll back to a previous version, if needed."
            },
            {
              "type": "p",
              "text": "Import and export flows: You can import and export flows. This helps you migrate flows between different Amazon Connect instances."
            },
            {
              "type": "p",
              "text": "Now, you can look further into the process of using the flow designer."
            },
            {
              "type": "ul",
              "items": [
                "Amazon Connect flow designer screenshot showing Save menu options: Save As, Import (beta), Export (beta), and Archive.",
                "You can can save, import, export, and publish flows within the graphical interface, as shown in the image."
              ]
            },
            {
              "type": "p",
              "text": "After a flow is published, a version of the published flow is available in the interface, as shown in the following image."
            },
            {
              "type": "p",
              "text": "Flow designer screenshot showing a dropdown list of all previous dates and times when the flow was published or saved."
            },
            {
              "type": "p",
              "text": "You can also add additional information to your flow by using the description text box, as highlighted in the following image."
            },
            {
              "type": "p",
              "text": "Amazon Connect flow designer screenshot. On the left side of the screen, the flow description panel is highlighted. In the panel, there is a description: Default flow used to transfer to a queue."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Flow designer toolbar",
          "blocks": [
            {
              "type": "p",
              "text": "The flow designer includes a toolbar with shortcuts to editing capabilities that improve the design experience. The key capabilities of the toolbar are as follows:"
            },
            {
              "type": "p",
              "text": "Flow designer toolbar screenshot. Icons are highlighted: Search, Undo, Cut, Copy, Paste, and Attach notes."
            },
            {
              "type": "ul",
              "items": [
                "Search flow blocks.",
                "Undo and redo actions.",
                "Cut, copy, paste, and delete operations on flow blocks.",
                "Select all objects in a flow.",
                "Attach notes to your flow."
              ]
            },
            {
              "type": "p",
              "text": "For more information about flow designer toolbar capabilities, navigate to Create a flow in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Flow blocks",
          "blocks": [
            {
              "type": "p",
              "text": "The flow designer provides access to multiple flow blocks. Flow blocks are the building blocks to create flows. Each block performs a distinct function that can be dragged and dropped onto the canvas to define the flow logic."
            },
            {
              "type": "p",
              "text": "Within the interface, flow blocks are organized into seven categories."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "INTERACT",
                  "body": "This section contains blocks that deal with the customer interaction directly, such as playing messages or gathering information from the customer."
                },
                {
                  "title": "SET",
                  "body": "This section provides blocks that set the conditions or attributes within a flow."
                },
                {
                  "title": "CHECK",
                  "body": "This section provides blocks that check the conditions or attributes within a flow."
                },
                {
                  "title": "ANALYZE",
                  "body": "This section provides blocks that set the logging and recording behavior."
                },
                {
                  "title": "LOGIC",
                  "body": "This section provides blocks that insert logic into the routing behavior."
                },
                {
                  "title": "INTEGRATE",
                  "body": "This section provides blocks to do either of the following:"
                }
              ]
            },
            {
              "type": "p",
              "text": "Invoke AWS Lambda allowing integration with external data sources and services."
            },
            {
              "type": "p",
              "text": "Invoke a specific module. Modules are a reusable set of flow blocks that are grouped together. Modules are used when specific customer experiences are reused in multiple customer journeys."
            },
            {
              "type": "h",
              "level": 4,
              "text": "TERMINATE"
            },
            {
              "type": "p",
              "text": "This section provides the mechanisms to transfer or terminate calls. It also provides the ability to terminate contact flow processing in specific contact flow types."
            },
            {
              "type": "p",
              "text": "To learn more about the process of configuring a flow block, choose the START or arrow buttons to display each of the three steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Configure a flow block",
                  "body": "Drag the flow block onto the flow designer canvas. Then follow the steps to configure a flow block."
                },
                {
                  "title": "Open the block settings",
                  "body": "A block with the settings menu opened. Commands available are Edit Settings, Add block name, Add a note, and Delete. Open the block settings by selecting the ellipsis. Another way to open the block settings is by selecting the ribbon."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Open block settings",
          "blocks": [
            {
              "type": "p",
              "text": "Choose Edit settings."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Update and save",
          "blocks": [
            {
              "type": "p",
              "text": "Make the changes to the block settings. Then, choose Save."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "You can configure flow blocks in Amazon Connect by updating the flow settings."
            },
            {
              "type": "p",
              "text": "When building a flow for your contact center, you need to ensure that each output from a flow block is connected to another flow block’s input to successfully publish your flow."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Flow management",
          "blocks": [
            {
              "type": "p",
              "text": "You can use the save, publish, and archive features of the flow designer to manage the IVR and agent experience. As you design new custom flows or update existing flows, you can save your work as you go. When you are ready to publish the flows to production, you can use the publish option. You can archive flows that are no longer required to be visible or exposed to production traffic for record-keeping purposes."
            },
            {
              "type": "p",
              "text": "Save, publish, and archive flows: The flow designer maintains multiple versions of your flow when you publish it. This feature is useful if you need to review how a flow has changed over time or revert to a previous version."
            },
            {
              "type": "p",
              "text": "You can also save your flow without publishing it. A flow becomes active and processes live traffic only after you publish it. An unpublished flow does not affect live traffic. To learn more about publishing a flow, choose the START or arrow buttons to display each of the four steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Save, publish, and archive a flow"
            },
            {
              "type": "p",
              "text": "Open the flow that you want to save or publish. Follow the steps for saving and publishing a flow."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Save a flow",
          "blocks": [
            {
              "type": "p",
              "text": "In the Contact Control Panel, choose Save to save the flow."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Confirm saved version"
            },
            {
              "type": "p",
              "text": "Amazon Connect flow designer screenshot showing flow designer with versions listed, highlighting the latest saved version. Choose the Latest menu dropdown list to verify the latest version. The version will show Saved, confirming that the flow saved successfully."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Publish the flow",
          "blocks": [
            {
              "type": "p",
              "text": "To publish the flow, choose Publish."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Confirm published timestamp",
          "blocks": [
            {
              "type": "p",
              "text": "To verify the latest version, choose the Latest menu dropdown list. This will show Published, which confirms the flow published successfully."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "You can save and publish flows using the Amazon Connect flow designer. You can archive flows that are no longer needed."
            },
            {
              "type": "p",
              "text": "Import and export flows: A scenario might arise where users would like the ability to import or export flows. For example, when working on multiple environments such as production, development, or test, instead of building new flows, users can import flows."
            },
            {
              "type": "p",
              "text": "Export flows: You can export flows directly from the flow designer’s graphical user interface. To learn more about exporting a flow, choose the START or arrow buttons to display each of the two steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Export flows"
            },
            {
              "type": "p",
              "text": "The steps to export a flow."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Choose export button",
          "blocks": [
            {
              "type": "p",
              "text": "From the dropdown list, choose Export."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Define the export file name",
                  "body": "Export dialog box opened. Name of the exported file highlighted. In the text entry box, define a name for the file to export the flow to. Then, choose Export. A file with the name you provide is saved in your Downloads folder."
                },
                {
                  "title": "Summary",
                  "body": "The export flow process is now complete."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Import flows",
          "blocks": [
            {
              "type": "p",
              "text": "You can import flows exported from a different environment directly into the flow designer graphical user interface. To learn more about importing a flow, choose the START or arrow buttons to display each of the two steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Import flows"
            },
            {
              "type": "p",
              "text": "The steps to import a flow."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t2-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Choose Import",
          "blocks": [
            {
              "type": "p",
              "text": "From the dropdown list, choose Import."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Import a file",
                  "body": "Import dialog box opened. Choose File command highlighted. Next, select Choose File. Then, choose Import."
                },
                {
                  "title": "Summary",
                  "body": "The import process is now complete."
                }
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned how to use the flow designer, a tool that gives you the ability to build custom flows. In the next lesson, you will learn how you can use flows to enable Amazon Connect features, such as call recording and analytics. Open the block settings A block with the settings menu opened. Commands available are Edit Settings, Add block name, Add a note, and Delete. Open the block settings by selecting the ellipsis. Another way to open the block settings is by selecting the ribbon. Open block settings Choose Edit settings. Configure a flow block Drag the flow block onto the flow designer canvas. Then follow the steps to configure a flow block. Open the block settings A block with the settings menu opened. Commands available are Edit Settings, Add block name, Add a note, and Delete. Open the block settings by selecting the ellipsis. Another way to open the block settings is by selecting the ribbon. Open block settings Choose Edit settings. Update and save Make the changes to the block settings. Then, choose Save. Save a flow In the Contact Control Panel, choose Save to save the flow. Confirm saved version Amazon Connect flow designer screenshot showing flow designer with versions listed, highlighting the latest saved version. Choose the Latest menu dropdown list to verify the latest version. The version will show Saved, confirming that the flow saved successfully. Publish the flow To publish the flow, choose Publish. Confirm published timestamp To verify the latest version, choose the Latest menu dropdown list. This will show Published, which confirms the flow published successfully. Summary You can save and publish flows using the Amazon Connect flow designer. You can archive flows that are no longer needed. Lesson 4 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-fundamentals-t2-q1",
          "question": "It is time to check your understanding of the content covered in this lesson. What are flow blocks in the context of designing flows in Amazon Connect?",
          "options": [
            {
              "id": "A",
              "text": "The challenges faced during the flow design process"
            },
            {
              "id": "B",
              "text": "The building blocks or modular units that make up the flow's structure and functionality"
            },
            {
              "id": "C",
              "text": "The sections that categorize different types of flows"
            },
            {
              "id": "D",
              "text": "The mechanisms to transfer or terminate calls"
            }
          ],
          "correctOptionId": "B",
          "rationale": "In the context of designing flows in Amazon Connect, flow blocks are the building blocks used to create and manage customer interactions within a flow. Flows in Amazon Connect define the sequence of actions that occur during a customer contact, such as a phone call or chat. Flow blocks help to design these interactions in a visual and intuitive way. Each block represents a specific function or action that can be taken during the interaction."
        }
      ]
    },
    {
      "id": "connect-flows-fundamentals-t3",
      "number": 3,
      "title": "Enabling Additional Amazon Connect Functionality Using Flows",
      "shortTitle": "Enabling Additional Amazon Connect Functiona…",
      "summary": "You can activate specific Amazon Connect features within the flows to tailor the customer journey according to your business requirements. These…",
      "duration": "~12 min",
      "lede": null,
      "objectives": [
        "Explore how to use flow blocks to activate Amazon Connect features."
      ],
      "sections": [
        {
          "id": "connect-flows-fundamentals-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "You can activate specific Amazon Connect features within the flows to tailor the customer journey according to your business requirements. These features include capabilities such as the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Intelligent routing"
            },
            {
              "type": "ul",
              "items": [
                "Self-service options",
                "Real-time analytics"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Integration with other business applications"
            },
            {
              "type": "p",
              "text": "By enabling Amazon Connect features through flows, you can design personalized and efficient customer interactions, ultimately improving customer satisfaction and operational efficiency."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect call recording",
          "blocks": [
            {
              "type": "p",
              "text": "To enable call recording for your flow, follow these steps in the flow designer:"
            },
            {
              "type": "p",
              "text": "Search for the Set recording and analytics behavior block by typing set record in the Blocks search panel on the left side of the flow designer."
            },
            {
              "type": "p",
              "text": "Drag the Set recording and analytics behavior block into the flow designer canvas. To edit the properties, select the block."
            },
            {
              "type": "p",
              "text": "Edit the settings of the flow block."
            },
            {
              "type": "p",
              "text": "The recording behavior is controlled within the properties of this block. You can enable or disable call recording by selecting the appropriate radio button."
            },
            {
              "type": "ul",
              "items": [
                "Save your changes.",
                "To learn more about Amazon Connect call recording, choose each of the five numbered markers."
              ]
            },
            {
              "type": "p",
              "text": "To enable speech analytics, the agent and customer call recording must be enabled."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Contact Lens",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Contact Lens provides analytics and quality management tools to monitor, measure, and improve contact quality and agent performance for better customer experiences."
            },
            {
              "type": "p",
              "text": "Before using this flow block, ensure that the Contact Lens feature is enabled in the Amazon Connect instance. The administrator for your contact center can enable this feature for your Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "To learn more about how to enable the Amazon Connect Contact Lens functionality, choose the START or arrow buttons to display each of the eight steps."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Enable Amazon Connect Contact Lens",
                  "body": "By using the Set recording and analytics flow block, you can configure the analytics behavior that is tailored to your business needs."
                },
                {
                  "title": "Select the Flows option in the Amazon Connect console",
                  "body": "Amazon Connect Flows showing the list of all the flows filtered by the word Default. On the left navigation panel, choose the Routing option, then choose Flows. Select an existing flow or create a new one."
                },
                {
                  "title": "Add the Set recording and analytics behavior flow block",
                  "body": "Amazon Connect flow designer with the Set recording and analytics behavior block highlighted. Open the flow designer. Drag and drop the Set recording and analytics behavior block into the flow designer canvas."
                },
                {
                  "title": "Enable call and screen recording",
                  "body": "Set recording and analytics behavior configuration details for voice and screen recording. To edit the properties of the Set recording and analytics behavior block, select the block. Modify the settings of the flow block to configure the desired Contact Lens features:"
                }
              ]
            },
            {
              "type": "p",
              "text": "You can enable or disable agent recording during customer interactions by selecting the displayed options. Please note that analytics options for voice calls require that the call recording option is On."
            },
            {
              "type": "p",
              "text": "You can also enable or disable the screen recording for interactions that you want to evaluate."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Enable Analytics behavior for voice calls"
            },
            {
              "type": "p",
              "text": "Set recording and analytics behavior flow block configuration options for voice calls analytics. To enable the analytics behavior, Select the On radio button."
            },
            {
              "type": "p",
              "text": "For voice calls, you have the option to activate post-call analytics only, or both real-time and post call analytics."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Enable Analytics behavior for chat",
                  "body": "Set recording and analytics behavior configuration options for chat analytics. To activate chat analytics, select the Enable chat analytics option. Both real-time and post contact analytics will become available for your chat interactions."
                },
                {
                  "title": "Language selection",
                  "body": "Set recording and analytics behavior flow block configuration options for Language selection. In this section, you select the language that the system will process your analytics in."
                }
              ]
            },
            {
              "type": "p",
              "text": "Use the dropdown list to select one of the supported languages."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Sensitive data redaction",
                  "body": "Set recording and analytics behavior flow block configuration options for sensitive data redaction. To select whether you want the analytics engine to redact the Personal Identifiable Information (PII) data from your transcripts, use the Redact sensitive data checkbox. You can decide to remove the original transcripts or keep both the original and redacted transcript."
                },
                {
                  "title": "Generative AI Summarization",
                  "body": "Set recording and analytics behavior flow block configuration option for Generative AI summarization. If you want the analytics engine to automatically generate a summary of the conversation, select the post-contacts summary. The conversation summary saves supervisors, quality analysts, and managers time when they evaluate contact conversations."
                },
                {
                  "title": "Summary",
                  "body": "By adding the Set recording and analytics behavior flow block to your flows, you enable the analytics you need to optimize your processes. You have the flexibility to enable this functionality for all of your interactions, or select only what you need for your business."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Q in Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Q in Connect is a feature that uses generative AI to assist agents in providing faster and more effective customer support. It offers suggested responses and actions tailored to each customer's query, leading to quicker issue resolution and improved customer satisfaction."
            },
            {
              "type": "p",
              "text": "This functionality becomes available after Amazon Q in Connect is activated within the Amazon Connect instance. This is typically performed by a cloud administrator with access to the AWS Management Console. To learn more, navigate to the Enable Amazon Q in Connect for your instance section of the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "To enable Amazon Q in Connect within your flow, follow these steps:"
            },
            {
              "type": "p",
              "text": "Search for the Amazon Q Connect block by typing Q in the Blocks search panel on the left side of the flow designer."
            },
            {
              "type": "ul",
              "items": [
                "Drag and drop the Amazon Q Connect block into the flow designer, and select the block.",
                "Configure the domain by associating an Amazon Q Connect domain by choosing your domain from the menu.",
                "Save your configuration.",
                "To learn more about Amazon Q in Connect, choose each of the numbered markers."
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Cases",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Cases is a feature that enables your organization's contact center to track and manage customer issues. These issues often require multiple interactions, follow-up tasks, and involvement from different teams. Agents can document all relevant case details in a unified view. Details can include date, time, issue summary, customer information, and status."
            },
            {
              "type": "p",
              "text": "Before using the Cases block, ensure that the Cases feature is enabled in the Amazon Connect instance. This is typically done by a cloud administrator with access to the AWS Management Console. To learn more, navigate to the Enable Cases section of the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "To enable Cases within your flow, follow these steps:"
            },
            {
              "type": "p",
              "text": "Search for the Cases block by typing case in the Blocks search panel on the left side of the flow designer. Drag and drop the Cases block into the flow designer."
            },
            {
              "type": "ul",
              "items": [
                "Select the block to configure its parameters.",
                "Select the action you want to implement with this block. Multiple options are available.",
                "Save your configuration.",
                "To learn more about Amazon Connect Cases, choose each of the four numbered markers."
              ]
            },
            {
              "type": "p",
              "text": "Cases block being added to a contact flow."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Tasks",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Tasks is a channel within Amazon Connect that helps you prioritize, track, route, and automate tasks for contact center agents. This improves agent productivity and ensures customer issues are resolved quickly."
            },
            {
              "type": "p",
              "text": "To create a task in your flows, follow these steps:"
            },
            {
              "type": "p",
              "text": "Search for the Create task block by typing task in the Blocks search panel on the left side of the flow designer. Drag and drop the Create task block into the flow designer."
            },
            {
              "type": "ul",
              "items": [
                "Select the block.",
                "Select the flow to run this task, and configure the properties of the new task.",
                "Save your configuration.",
                "To learn more about Amazon Connect Tasks, choose each of the four numbered markers."
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Customer Profiles provides customer service agents with automated experiences and real-time access to up-to-date customer information, enabling personalized interactions."
            },
            {
              "type": "p",
              "text": "To access the Customer Profiles functionality, a cloud administrator must enable the Customer Profiles feature in the Amazon Connect instance. To find out more, navigate to the Enable Customer Profiles for your instance section in the Administrator Guide."
            },
            {
              "type": "p",
              "text": "To access Customer Profiles functionality within your flow:"
            },
            {
              "type": "p",
              "text": "Search for the Customer profiles block by typing the block type in the Blocks search panel on the left side of the flow designer. Drag and drop the Create task block into the flow designer"
            },
            {
              "type": "ul",
              "items": [
                "Select the block.",
                "Select and action, and configure the properties for the selected action.",
                "Save your configuration.",
                "Customer profiles block being added to a contact flow."
              ]
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Persistent Chat",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect chat supports conversations that take place over an extended period of time. Contacts can start a chat interaction, then leave, and return later to continue the discussion."
            },
            {
              "type": "p",
              "text": "To facilitate long-running conversations, Amazon Connect offers persistent chat capabilities. With persistent chat, customers can resume previous discussions while retaining all context, metadata, and chat transcripts. This eliminates the need for repetitive conversations. Customers don't have to re-explain their issues, and agents have access to the complete interaction history."
            },
            {
              "type": "p",
              "text": "You can enable chat persistence through a process called chat rehydration. By using chat rehydration, previous chat transcripts are retrieved and displayed at the start of new chat interactions. This provides continuity for both customers and agents to pick up where they left off. To associate the current chat with a previous one, you need to have the unique identifier of the previous contact. Each interaction has a unique identifier called a Contact ID."
            },
            {
              "type": "p",
              "text": "To enable persistent chat within flows, follow these steps:"
            },
            {
              "type": "p",
              "text": "Search for the Create persistent contact association block by typing create in the Blocks search panel on the left side of the flow designer. Drag and drop the Create persistent contact association block into the flow designer."
            },
            {
              "type": "ul",
              "items": [
                "Select the block.",
                "Edit the settings in the properties panel that opens to the right side of the view.",
                "Save your configuration.",
                "Create pesistent contact association block being added to a contact flow."
              ]
            },
            {
              "type": "p",
              "text": "It is mandatory to provide a source Contact ID when using the Create persistent contact association block. The contact ID configured in the block properties determines the rehydration source."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t3-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Use case",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Using analytics insights to improve customer satisfaction scores"
            },
            {
              "type": "p",
              "text": "Diego Ramirez is the operations manager at AnyAuthority, a small retail company with a customer support call center. As part of an initiative to improve customer satisfaction, Diego wants to implement Amazon Connect to use its call recording and Contact Lens capabilities."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Solution"
            },
            {
              "type": "p",
              "text": "Diego can use the following approach:"
            },
            {
              "type": "p",
              "text": "Enable call recording for quality assurance purposes by adding the Set Recording and Analytics Behavior flow block to configure recording settings and enable Contact Lens. This will help him review calls later to evaluate agent performance and identify coaching opportunities."
            },
            {
              "type": "p",
              "text": "Use Contact Lens to access critical insights. Diego enables screen, speech, and post-call analytics through the same flow block. The speech analytics, powered by machine learning (ML), is especially useful to automatically detect sentiments, trends, and compliance issues. However, because it requires call recording, Diego makes sure to have recording enabled."
            },
            {
              "type": "p",
              "text": "Improve agent training. By using call recording and analytics, Diego can pinpoint areas needing improvement. For example, if speech analytics detects that agents struggle to de-escalate angry customers, Diego can schedule additional training."
            },
            {
              "type": "p",
              "text": "Track improvements over time. Key metrics from Contact Lens, like customer sentiment trends, handle time, compliance scores, and more, are important for Diego. Positive trends will help him secure budget for expanding the capabilities further."
            },
            {
              "type": "p",
              "text": "Check your knowledge"
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned how to enable various Amazon Connect features, like call recording, Contact Lens analytics, and real-time agent recommendations using Amazon Connects flow designer. In the next lesson, you will discover the flow blocks that help improve operational processes. Select the Flows option in the Amazon Connect console Amazon Connect Flows showing the list of all the flows filtered by the word Default. On the left navigation panel, choose the Routing option, then choose Flows. Select an existing flow or create a new one. Add the Set recording and analytics behavior flow block Amazon Connect flow designer with the Set recording and analytics behavior block highlighted. Open the flow designer. Drag and drop the Set recording and analytics behavior block into the flow designer canvas. Enable call and screen recording Set recording and analytics behavior configuration details for voice and screen recording. To edit the properties of the Set recording and analytics behavior block, select the block. Modify the settings of the flow block to configure the desired Contact Lens features: You can enable or disable agent recording during customer interactions by selecting the displayed options. Please note that analytics options for voice calls require that the call recording option is On. You can also enable or disable the screen recording for interactions that you want to evaluate. Enable Analytics behavior for voice calls Set recording and analytics behavior flow block configuration options for voice calls analytics. To enable the analytics behavior, Select the On radio button. For voice calls, you have the option to activate post-call analytics only, or both real-time and post call analytics. Enable Analytics behavior for chat Set recording and analytics behavior configuration options for chat analytics. To activate chat analytics, select the Enable chat analytics option. Both real-time and post contact analytics will become available for your chat interactions. Language selection Set recording and analytics behavior flow block configuration options for Language selection. In this section, you select the language that the system will process your analytics in. Use the dropdown list to select one of the supported languages. Sensitive data redaction Set recording and analytics behavior flow block configuration options for sensitive data redaction. To select whether you want the analytics engine to redact the Personal Identifiable Information (PII) data from your transcripts, use the Redact sensitive data checkbox. You can decide to remove the original transcripts or keep both the original and redacted transcript. Generative AI Summarization Set recording and analytics behavior flow block configuration option for Generative AI summarization. If you want the analytics engine to automatically generate a summary of the conversation, select the post-contacts summary. The conversation summary saves supervisors, quality analysts, and managers time when they evaluate contact conversations. Summary By adding the Set recording and analytics behavior flow block to your flows, you enable the analytics you need to optimize your processes. You have the flexibility to enable this functionality for all of your interactions, or select only what you need for your business. Lesson 5 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-fundamentals-t3-q1",
          "question": "It is time to check your understanding of the content covered in this lesson. (Select all that apply: Which features can be enabled using the Set recording and analytics behavior flow block? (Select TWO.) / Amazon Connect Tasks / Amazon Connect Cases / Amazon Q in Connect / Speech analytics)",
          "options": [],
          "answer": "Which features can be enabled using the Set recording and analytics behavior flow block? (Select TWO.); Speech analytics. The Set recording and analytics behavior flow block enables Amazon Connect Contact Lens functionality. Contact Lens provides analytics and quality management tools to monitor, measure, and improve contact quality and agent performance for better customer experiences. This includes screen recording and speech analytics."
        },
        {
          "id": "connect-flows-fundamentals-t3-q2",
          "question": "Nikki Wolf is a telecom engineer at AnyCompany Manufacturing. Which block can Nikki use to enable persistent chat capabilities, helping customers resume previous conversations?",
          "options": [
            {
              "id": "A",
              "text": "Set recording and analytics behavior"
            },
            {
              "id": "B",
              "text": "Amazon Q in Connect"
            },
            {
              "id": "C",
              "text": "Customer profiles"
            },
            {
              "id": "D",
              "text": "Create persistent contact association"
            }
          ],
          "correctOptionId": "D",
          "rationale": "To enable persistent chat, Nikki should drag and drop the Create persistent contact association block into the flow designer. Amazon Q in Connect, Customer Profiles, and Set recording and analytics behavior do not have settings for persistent chat configuration."
        }
      ]
    },
    {
      "id": "connect-flows-fundamentals-t4",
      "number": 4,
      "title": "Operational Support Flow Blocks",
      "shortTitle": "Operational Support Flow Blocks",
      "summary": "The AWS Well-Architected Framework provides architectural best practices across operational excellence, security, reliability, performance…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [
        "Explore the use of flow logs.",
        "Recognize the ability to distribute contacts by pre-configured percentage."
      ],
      "sections": [
        {
          "id": "connect-flows-fundamentals-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "The AWS Well-Architected Framework provides architectural best practices across operational excellence, security, reliability, performance efficiency, and cost optimization. These best practices help cloud architects build secure, high-performing, resilient, and efficient application infrastructure."
            },
            {
              "type": "p",
              "text": "Flows play a key role in maintaining operational efficiency while ensuring high levels of customer satisfaction. By adopting flow-management best practices, operations teams can architect reliable and operationally efficient contact centers."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Distribute traffic by percentage",
          "blocks": [
            {
              "type": "p",
              "text": "The Well-Architected reliability pillar discusses strategies like blue/green deployment to reduce risks when deploying new versions of applications. When applied to contact centers within the context of flows, gradually increasing traffic to new or modified flows can reduce risks associated with these changes."
            },
            {
              "type": "p",
              "text": "The Distribute by percentage flow block is a useful tool for implementing such strategies. This block allows for the logic to distribute incoming contacts (voice, chat, or task) randomly based on a specified percentage."
            },
            {
              "type": "p",
              "text": "The Distribute by percentage block is compatible with the following flow types:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Inbound flow"
            },
            {
              "type": "ul",
              "items": [
                "Customer queue flow",
                "Outbound whisper flow",
                "Transfer to agent flow",
                "Transfer to queue flow",
                "To enable traffic distribution for your flow, follow these steps in the flow designer:"
              ]
            },
            {
              "type": "ul",
              "items": [
                "Open the flow designer.",
                "Drag and drop the Distribute by percentage block into the flow designer canvas.",
                "Choose the block to edit the properties of the Distribute by percentage block.",
                "Modify the settings of the flow block to configure the desired percentage distribution."
              ]
            },
            {
              "type": "p",
              "text": "When using the Distribute by percentage flow block, Amazon Connect distributes contacts randomly, so exact percentage splits might occur."
            },
            {
              "type": "p",
              "text": "For more information, refer to the Flow block: Distribute by percentage section in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Flow logs",
          "blocks": [
            {
              "type": "p",
              "text": "Operational teams often need to store application logs for auditing and troubleshooting purposes. The AWS Well-Architected Framework operational excellence pillar recommends storing flow logs in an Amazon CloudWatch log group."
            },
            {
              "type": "p",
              "text": "With Amazon CloudWatch Logs, you can monitor, store, and access your log files from various sources. A log group organizes log streams that share the same retention, monitoring, and access control settings. Each log stream stores log data from a specific source, such as Amazon Connect."
            },
            {
              "type": "p",
              "text": "The Set logging behavior flow block can be used to enable flow logs so you can track events as contacts interact with flows. Flow logs are stored in an Amazon CloudWatch log group, in the same AWS Region as your Amazon Connect instance. This log group is created automatically when Enable flow logging is turned on for your instance. A log entry is added as each block in your flow is invoked. You can configure CloudWatch to send alerts when unexpected events occur during active flows."
            },
            {
              "type": "p",
              "text": "To enable logs for your flow, follow these steps in the flow designer:"
            },
            {
              "type": "ul",
              "items": [
                "Drag and drop the Set Logging Behavior block into the flow designer canvas.",
                "Choose the block to edit the properties of the Set Logging Behavior block.",
                "Edit the properties of the flow block to enable or disable flow logs."
              ]
            },
            {
              "type": "p",
              "text": "For more information, refer to the Flow block: Set logging behavior and Flow logs stored in an Amazon CloudWatch log group sections in the Amazon Connect Administrator Guide."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Example scenario"
            },
            {
              "type": "p",
              "text": "John is the IVR designer at AnyCompany Bank, a mid-sized institution that uses Amazon Connect for their contact center services. A significant number of users complained to agents that they were dissatisfied with the traditional DTMF-based IVR. AnyCompany Bank's customers found the menus too lengthy and inflexible. To improve the customer experience, AnyCompany Bank has deployed a new conversational IVR using Amazon Lex."
            },
            {
              "type": "p",
              "text": "John wants to implement this new conversational IVR as a production workload. A/B testing is a controlled experiment that compares two or more versions of a solution. The goal is to determine which solution performs best, and use the data to make decisions about how people interact with the solution. John wants to follow the AWS best practice of A/B testing to evaluate his script performance and impact."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Solution"
            },
            {
              "type": "p",
              "text": "John can gradually increase the incoming call volume handled by the newly deployed conversational IVR. To do this he can use the Distribute by percentage flow block to branch routing for the incoming calls."
            },
            {
              "type": "p",
              "text": "For example he can start by distributing 25 percent of the incoming calls to the conversational IVR. The remaining 75 percent will be distributed to the existing DTMF-based IVR."
            },
            {
              "type": "p",
              "text": "John can monitor service level metrics and gather qualitative feedback from agents and customers. If no significant issues arise during this period, he can update the flow block configuration. The configuration can distribute calls equally between the new conversational IVR and the existing DTMF-based IVR."
            },
            {
              "type": "p",
              "text": "After another monitoring period, he can further adjust the distribution to 75 percent and 25 percent, sending more calls to the conversational IVR."
            },
            {
              "type": "p",
              "text": "Throughout this incremental call volume shift process, John can configure flow logs using the Set logging behavior flow block. He can access them through the associated Amazon CloudWatch log group. This logging mechanism gives him the ability to audit flow performance and troubleshoot any issues that might arise."
            },
            {
              "type": "p",
              "text": "Assuming no major issues occur during the gradual traffic shift, John can route 100 percent of the incoming calls to the new conversational IVR."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned flow management best practices and how to enable them within Amazon Connect. You explored how to conduct A/B testing to mitigate risks associated with changes. Continue to the next lesson to review the course summary and prepare for the end-of-course assessment. Lesson 6 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flows-fundamentals-t4-q1",
          "question": "It is time to check your understanding of the content covered in this lesson. Which flow block is used to distribute random incoming contacts based on configured percentages, and can be used for A/B testing?",
          "options": [
            {
              "id": "A",
              "text": "Distribute by skill"
            },
            {
              "id": "B",
              "text": "Distribute by priority"
            },
            {
              "id": "C",
              "text": "Distribute by percentage"
            },
            {
              "id": "D",
              "text": "Distribute randomly"
            }
          ],
          "correctOptionId": "C",
          "rationale": "The Distribute by percentage flow block routes customers randomly, based on a specified percentage, and can be useful for A/B testing."
        },
        {
          "id": "connect-flows-fundamentals-t4-q2",
          "question": "John Stiles is an operations manager at AnyCompany Health. John got a report of random error messages and disconnects for some of the contact center support calls. Where can John find the Amazon Connect flow logs to best troubleshoot the reported issue?",
          "options": [
            {
              "id": "A",
              "text": "Amazon Lex dashboard"
            },
            {
              "id": "B",
              "text": "Amazon CloudWatch log group"
            },
            {
              "id": "C",
              "text": "Customer relationship management (CRM) database"
            },
            {
              "id": "D",
              "text": "AWS Lambda function"
            }
          ],
          "correctOptionId": "B",
          "rationale": "This is the correct option. By default, when you create a new Amazon Connect instance, an Amazon CloudWatch log group is created automatically to store the logs for your instance. Logs are generated for flows that include a Set logging behavior block with logging set to enabled."
        }
      ]
    },
    {
      "id": "connect-flows-fundamentals-t5",
      "number": 5,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "n this course, you learned about Amazon Connect Flows. It’s a feature of Amazon Connect that define customer journeys across various channels,…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-flows-fundamentals-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Course summary",
          "blocks": [
            {
              "type": "p",
              "text": "n this course, you learned about Amazon Connect Flows. It’s a feature of Amazon Connect that define customer journeys across various channels, like voice, chat, and tasks. Take a moment to review these key concepts in the course summary before taking the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow types"
            },
            {
              "type": "p",
              "text": "Amazon Connect provides multiple types of flows designed to support different use cases. The types of flows available are as follows:"
            },
            {
              "type": "p",
              "text": "Inbound flow: This is a default flow type that is created when you choose Create flow. Use this flow type to activate customer experiences for incoming contacts before transferring to a queue."
            },
            {
              "type": "p",
              "text": "Customer queue flow: This defines the experience customers have while waiting in a queue before connecting to an agent."
            },
            {
              "type": "p",
              "text": "Customer hold flow: This defines the experience a customer has while placed on hold by an agent during a voice call."
            },
            {
              "type": "ul",
              "items": [
                "Customer whisper flow: This defines the customer experience just before joining an agent.",
                "Agent whisper flow: This flow defines the agent experience just before receiving a contact from a customer."
              ]
            },
            {
              "type": "p",
              "text": "Agent hold flow: This defines the agent experience as part of an inbound voice contact while the call is placed on hold."
            },
            {
              "type": "ul",
              "items": [
                "Agent transfer flow: This defines the agent experience when transferring a contact to another agent.",
                "Transfer to queue flow: This defines the agent experience when transferring a contact to another queue.",
                "Outbound whisper flow: This defines the customer experience before agent interaction on outbound calls.",
                "Disconnect flow: This is an inbound flow that runs when an agent disconnects and the customer remains connected."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow blocks"
            },
            {
              "type": "p",
              "text": "Flow blocks are visual representations of actions available in a flow. Customer and agent experience designers use flow blocks to create flows in the Amazon Connect flow designer."
            },
            {
              "type": "p",
              "text": "Flow blocks are organized into seven categories: Interact, Set, Check, Analyze, Logic, Integrate, and Terminate."
            },
            {
              "type": "p",
              "text": "To configure a flow block, drag it onto the flow designer canvas, open the block settings, update, and save the changes."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow designer"
            },
            {
              "type": "p",
              "text": "The flow designer in Amazon Connect is a visual tool that helps create and customize contact center experiences."
            },
            {
              "type": "p",
              "text": "Key capabilities include designing flows, configuring flow logic, integrating with AWS services, testing and debugging flows, managing flow versions, and importing and exporting flows."
            },
            {
              "type": "p",
              "text": "The flow designer includes a toolbar with shortcuts to editing capabilities, like searching flow blocks, undoing and redoing actions, cutting, copying, pasting, and deleting flow blocks."
            },
            {
              "type": "p",
              "text": "Amazon Connect flow designer full process view from block entry to various flow block implementation."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Flow management"
            },
            {
              "type": "p",
              "text": "You can use the save, publish, and archive features of the flow designer to manage the IVR and agent experience."
            },
            {
              "type": "p",
              "text": "Save your work as you design new custom flows or update existing flows. When you are ready to publish the flows to production, use the publish option."
            },
            {
              "type": "p",
              "text": "Archive flows that are no longer required to be visible or exposed to production traffic for record-keeping purposes."
            },
            {
              "type": "p",
              "text": "The flow designer maintains multiple versions of your flow when you publish it. You can also import and export flows."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Enabling Amazon Connect functionality with flow blocks"
            },
            {
              "type": "p",
              "text": "You can activate specific Amazon Connect features within the flows to tailor the customer journey according to your business requirements."
            },
            {
              "type": "p",
              "text": "These features are as follows:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Call recording"
            },
            {
              "type": "ul",
              "items": [
                "Amazon Connect Contact Lens",
                "Amazon Q in Connect",
                "Amazon Connect Cases",
                "Amazon Connect Tasks",
                "Amazon Connect Customer Profiles"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Connect persistent chat"
            },
            {
              "type": "p",
              "text": "To enable any of these features, search for the respective flow blocks, drag and drop them into the flow designer canvas. Then, configure the block properties and save the changes."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Operational support flow blocks"
            },
            {
              "type": "p",
              "text": "The Distribute by percentage block distributes incoming contacts randomly based on a specified percentage. You can use this block for testing strategies, like blue/green deployments, to reduce risks when deploying new versions."
            },
            {
              "type": "p",
              "text": "The Set logging behavior block enables tracking events as contacts interact with flows. Flow logs are stored in an Amazon CloudWatch log group. Configure CloudWatch to send alerts for unexpected events."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t5-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Downloadable PDF of the summary",
          "blocks": [
            {
              "type": "p",
              "text": "To download a PDF version of the summary section, choose anywhere inside the following box. Note: For the best experience with screen readers, use NVDA or JAWS. If you are using VoiceOver, you may experience issues with the downloaded PDF."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-flows-fundamentals-t6",
      "number": 6,
      "title": "Course summary",
      "shortTitle": "Course summary",
      "summary": "This course provides an introduction to Amazon Connect flows. Flows define customer journeys across various channels like voice, chat and tasks.…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-flows-fundamentals-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "This course provides an introduction to Amazon Connect flows. Flows define customer journeys across various channels like voice, chat and tasks. It covers the different types of flows, their purposes, and how they are constructed using flow blocks within the visual flow designer interface."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t6-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Flows",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect provides multiple types of flows, designed to support different use cases. The types of flows available, are:"
            },
            {
              "type": "ul",
              "items": [
                "Inbound flow: Is the default flow type created when you select the \"Create flow\" button. Use this",
                "flow type to activate customer experiences for incoming contacts before transferring to a queue.",
                "Customer queue flow: Defines the experience customers have while waiting in a queue before",
                "connecting to an agent.",
                "Customer hold flow: Defines the experience a customer has while placed on hold by an agent during",
                "a voice call."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Customer whisper flow: Allows defining the customer experience just before joining an agent.",
                "Agent whisper flow: Defines the agent experience just before receiving a contact from a customer.",
                "Agent hold flow: Defines the agent experience as part of an inbound voice contact while the call is"
              ]
            },
            {
              "type": "p",
              "text": "placed on hold."
            },
            {
              "type": "ul",
              "items": [
                "Agent transfer flow: Defines the agent experience when transferring a contact to another agent.",
                "Transfer to queue flow: Defines the agent experience when transferring a contact to another queue.",
                "Outbound whisper flow: Defines the customer experience before agent interaction on outbound"
              ]
            },
            {
              "type": "p",
              "text": "calls."
            },
            {
              "type": "p",
              "text": "Disconnect flow: Is an inbound flow that runs when an agent disconnects, and the customer remains"
            },
            {
              "type": "p",
              "text": "connected."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t6-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Flow blocks",
          "blocks": [
            {
              "type": "p",
              "text": "Flow blocks are visual representations of actions available in a flow. Customer and agent experience designers use flow blocks to create flows in the Amazon Connect flow designer."
            },
            {
              "type": "p",
              "text": "flow blocks are organized into seven categories: Interact, Set, Check, Analyze, Logic, Integrate, and Terminate."
            },
            {
              "type": "p",
              "text": "To configure a flow block, drag it onto the flow designer canvas, open the block settings, update and save the changes."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t6-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Flow designer",
          "blocks": [
            {
              "type": "p",
              "text": "The flow designer in Amazon Connect is a visual tool that allows creating and customizing contact center experiences."
            },
            {
              "type": "p",
              "text": "Key capabilities include: designing flows, configuring flow logic, integrating with AWS services, testing and debugging flows, managing flow versions, and import and export flows."
            },
            {
              "type": "p",
              "text": "The flow designer includes a toolbar with shortcuts to editing capabilities like searching flow blocks, undoing and redoing actions, cutting, copying, pasting, and deleting flow blocks."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t6-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Flow management",
          "blocks": [
            {
              "type": "p",
              "text": "You can use the save, publish, and archive features of the flow designer to manage the IVR and agent experience."
            },
            {
              "type": "p",
              "text": "Save your work as you design new custom flows or update existing flows. When ready to publish the flows to production, use the publish option."
            },
            {
              "type": "p",
              "text": "Archive flows that are no longer required to be visible or exposed to production traffic for record-keeping purposes."
            },
            {
              "type": "p",
              "text": "The flow designer maintains multiple versions of your flow when you publish it. You can also import and export flows."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t6-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Enabling Amazon Connect functionality with flow blocks",
          "blocks": [
            {
              "type": "p",
              "text": "You can activate specific Amazon Connect features within the flows, to tailor the customer journey according to your business requirements."
            },
            {
              "type": "p",
              "text": "These features are:"
            },
            {
              "type": "ul",
              "items": [
                "Call recording,",
                "Amazon Connect Contact Lens,",
                "Amazon Q in Connect,",
                "Amazon Connect Cases,",
                "Amazon Connect Tasks,",
                "Amazon Connect Customer Profiles, and",
                "Amazon Connect Persistent Chat."
              ]
            },
            {
              "type": "p",
              "text": "To enable any of these features, search for the respective flow blocks, drag and drop them into the flow designer canvas, configure the block properties, and save the changes."
            }
          ]
        },
        {
          "id": "connect-flows-fundamentals-t6-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Operational Flow blocks",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "The Distribute by percentage block distributes incoming contacts randomly based on a specified percentage.",
                "You can use this block for testing strategies like blue/green deployments, to reduce risks when deploying new versions."
              ]
            },
            {
              "type": "p",
              "text": "The Set logging behavior block enables tracking events as contacts interact with flows. Flow logs are stored in an Amazon CloudWatch log group. Configure CloudWatch to send alerts for unexpected events."
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
