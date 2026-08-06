/*
 * Amazon Connect — Flow Modules and Step-by-Step Guides
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT FLOW MODULES AND STEP BY STEP GUIDE.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-flow-modules-guides",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Flow Modules and Step-by-Step Guides",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "Flows",
  "description": "Reusable flow modules, and building the step-by-step guides that walk agents through a process in the agent workspace.",
  "examFormat": "4 topics · ~28 min · 6 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT FLOW MODULES AND STEP BY STEP GUIDE.txt"
  ],
  "modules": [
    {
      "id": "connect-flow-modules-guides-t1",
      "number": 1,
      "title": "Introduction to Amazon Connect Flow Modules",
      "shortTitle": "Introduction to Amazon Connect Flow Modules",
      "summary": "Modules are reusable components that encapsulate flow logic, such as greetings, prompts, call transfers, data validation, error handling, or…",
      "duration": "~10 min",
      "lede": null,
      "objectives": [
        "Recognize the benefits of flow modules.",
        "Recognize the purpose and advantages of flow modules."
      ],
      "sections": [
        {
          "id": "connect-flow-modules-guides-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Modules are reusable components that encapsulate flow logic, such as greetings, prompts, call transfers, data validation, error handling, or integration with external systems. Modules promote modular design, code organization, reusability, customization, and more efficient development."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Introduction to flow modules",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect flows offer flow modules that provide a flexible, reusable approach to building contact flows. Similar to functions or microservices in software development, modules make flows more manageable, customizable, and resilient to change. This makes contact center development and innovation more efficient."
            },
            {
              "type": "p",
              "text": "You can use modules in any inbound flow. When a module is invoked, the flow engine performs the logic implemented in the module. It then returns the control to the flow it was initiated from. You can use modules for repetitive processes, such as authenticating a user or collecting survey data."
            },
            {
              "type": "p",
              "text": "Following is a sample diagram representing the logical flow of branching from the main flow to a flow module."
            },
            {
              "type": "p",
              "text": "A parent flow starts and runs the logic defined by the customer experience designer. The flow invokes a flow module. The flow runs the designed logic and returns the control back to the main flow."
            },
            {
              "type": "p",
              "text": "Expand each of the following categories to explore the benefits of using flow modules."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Reusable components",
                  "body": "Flow modules help group functionality provided by components such as greetings, data validation, error handling, or integrations. Modules can be reused across multiple contact flows. They promote code reusability and reduce duplication of flow logic."
                },
                {
                  "title": "Design organization",
                  "body": "Modules promote a modular design approach. This helps break down complex flows into smaller, more manageable components. Modular design enhances code organization, readability, and maintainability. Interactive voice response (IVR) designers can use it to focus on the design and implementation of individual modules independently of each other."
                },
                {
                  "title": "Customization",
                  "body": "Modules use contact attributes to help customize and configure common logic. For example, you can build a generic prompt module and customize the prompt by using a dynamic contact attribute that persists throughout the flow lifecycle."
                },
                {
                  "title": "Development efficiencies",
                  "body": "Pre-built modules for repetitive tasks help reduce the time and effort to create new contact flows. Modules abstract away the complexity by providing specific functionality. With this approach, other stakeholders with no programming expertise can reuse modules using the flow designer interface."
                },
                {
                  "title": "Version control",
                  "body": "The Amazon Connect flow designer provides versioning and revision control capabilities for flow modules. You can track changes, manage updates, and roll back to previous versions if required. This functionality provides consistency and reliability across flows and ensures that all flows use the same module version."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Creating a module",
          "blocks": [
            {
              "type": "p",
              "text": "In this section, you will learn the steps to create a flow module."
            },
            {
              "type": "p",
              "text": "Before you navigate to the Amazon Connect console, ensure that you have the appropriate permissions to access the module functionality."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Security permissions",
          "blocks": [
            {
              "type": "p",
              "text": "To access, create, and manage flow modules, your security profiles must have the Flow modules permissions enabled. The security profile permissions for flow modules are located in the Channels and flows section of the Amazon Connect console. They include separate settings for the following actions:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "View"
            },
            {
              "type": "ul",
              "items": [
                "Edit",
                "Create",
                "Remove",
                "Publish",
                "The following image depicts the security profile settings required for managing flow modules."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Security profiles configuration view with the security permissions for managing flow modules.",
                "After you have the appropriate access, you're ready to create your first module."
              ]
            },
            {
              "type": "p",
              "text": "The following sample flow module explores how to enable call recording for 10 percent of the calls received by a business. To learn more, choose the START or arrow buttons to display each of the six steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Recording 10 percent of calls"
            },
            {
              "type": "p",
              "text": "Log in to the Amazon Connect console."
            },
            {
              "type": "p",
              "text": "Ensure that your security profile has permissions to create flow modules."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Navigate to the flow designer",
                  "body": "Amazon Connect console with the Routing menu expanded and Flows option selected. In the left navigation panel, choose Routing, and then choose Flows."
                },
                {
                  "title": "Create the flow module",
                  "body": "Amazon Connect console Flows designer view with the Create flow module button highlighted. Choose the Modules tab, and then choose Create flow module."
                },
                {
                  "title": "Add a Set logging behavior block",
                  "body": "Amazon Connect flow designer canvas with Set logging behavior block. Search for the Set logging behavior block, and then drag it onto the canvas."
                }
              ]
            },
            {
              "type": "p",
              "text": "It is a best practice to enable logging for your flows. Logging can be used to help troubleshoot and fix potential issues."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Add a Distribute by percentage block"
            },
            {
              "type": "p",
              "text": "Flow designer with two blocks: Set logging behavior and Distribute by percentage block. Search for the Distribute by percentage block, and then add it to the canvas."
            },
            {
              "type": "p",
              "text": "Connect the Success branch from the Set logging behavior block to the entry of the Distribute by percentage block."
            },
            {
              "type": "p",
              "text": "Choose the Distribute by percentage block, and then, in the right configuration panel, add a percentage branch for 10%."
            },
            {
              "type": "p",
              "text": "Save the block configuration."
            },
            {
              "type": "p",
              "text": "In the top-left corner of the flow editor, enter a name for your module, for example: \"Ten percent calls active.\""
            },
            {
              "type": "h",
              "level": 4,
              "text": "Add Set recording and analytics behavior blocks"
            },
            {
              "type": "p",
              "text": "Flow module with four blocks: set log behavior, distribute by percentage, set recording, and analytics behavior. Search for the Set recording and analytics behavior block, and then add two of them to the canvas."
            },
            {
              "type": "p",
              "text": "Connect the 10%: Recording enabled branch from the Distribute by percentage block to the first Set recording and analytics behavior block. To configure this recording block, choose the Call recording > On setting. Then choose Agent and Customer."
            },
            {
              "type": "p",
              "text": "Connect the 90% Default branch of the Distribute by percentage block to the second Set recording and analytics behavior block. The default configuration for this block does not enable call recording."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Add an End flow / Resume block"
            },
            {
              "type": "p",
              "text": "Flow module with five blocks: set log behavior, distribute by percentage, set recording, and analytics behavior and End flow. Search for the End flow / Resume block, and add it to the canvas."
            },
            {
              "type": "p",
              "text": "Connect the Success branches from the two Set recording and analytics behavior blocks to the End flow / Resume block."
            },
            {
              "type": "p",
              "text": "Publish your module."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "Congratulations! You created your first module. You can now invoke this module for all lines of business that need to enable recordings for 10 percent of their calls."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Other use cases",
          "blocks": [
            {
              "type": "p",
              "text": "There are other use cases where you can use modules in Amazon Connect. To learn more, expand each of the following categories."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Customized routing",
                  "body": "Use modules to create customized routing strategies based on various factors, such as customer priority, business hours, agent skills, and more. You can also implement complex routing rules that can direct customers to the most appropriate agent or team, based on their needs."
                },
                {
                  "title": "Integration with external systems",
                  "body": "Use modules to integrate Amazon Connect with other business applications, such as customer relationship management (CRM), enterprise resource planning (ERP), or ticketing systems. You can build reusable logic to retrieve or update data from external sources."
                },
                {
                  "title": "Automated workflows",
                  "body": "Use modules to create automated workflows that can handle specific tasks or processes, such as customer inquiries, order processing, or appointment scheduling. You can automate repetitive tasks and improve efficiency by streamlining workflows within the contact center."
                },
                {
                  "title": "Enhanced customer experience",
                  "body": "Develop modules to provide self-service options, such as chatbots, to offer customers ways to resolve their queries without the need for agent assistance. Additionally, implement modules to offer personalized experiences, such as customized greetings, targeted promotions, or recommended solutions, based on customer preferences."
                },
                {
                  "title": "Multilingual support",
                  "body": "Create modules to handle language detection and routing so customers are directed to agents who are proficient in their preferred language."
                },
                {
                  "title": "Contextual alerts and notifications",
                  "body": "Use modules to configure alerts and notifications for supervisors or backend teams, informing them of important customer information or events that require immediate attention."
                },
                {
                  "title": "Conversational AI assistants",
                  "body": "Develop modules to incorporate advanced conversational AI technologies, such as natural language processing (NLP) and machine learning (ML), to offer natural and intelligent interactions. You can implement modules to handle complex customer queries, provide recommendations, and escalate to human agents when necessary."
                }
              ]
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for creating modules",
          "blocks": [
            {
              "type": "p",
              "text": "Modules are often used in multiple flows within your contact center. When designing flow modules, consider recommended best practices. To learn more, expand each of the following categories."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Use modular design",
                  "body": "Design your modules to be self-contained with clear boundaries and dependencies. This will make it more efficient to manage, test, and deploy individual modules without affecting the entire system."
                },
                {
                  "title": "Establish naming conventions",
                  "body": "Establish clear and consistent naming conventions for your modules, flows, and resources. This will help you and your team navigate the system more efficiently."
                },
                {
                  "title": "Implement error handling and logging",
                  "body": "Implement robust error handling and logging mechanisms in your modules. This will make it more convenient to troubleshoot issues and monitor the performance of your contact center."
                },
                {
                  "title": "Consider reusability",
                  "body": "Design your modules to be as reusable as possible. This will help you avoid duplication of effort and ensure consistency across your contact center."
                },
                {
                  "title": "Set up monitoring and alerting",
                  "body": "Set up monitoring and alerting mechanisms to track the performance of your modules and receive notifications of any issues or failures."
                },
                {
                  "title": "Create documentation",
                  "body": "Document your modules thoroughly, including their purpose, functionality, and any dependencies or integrations. This will make it more straightforward for your team to understand and maintain the system over time."
                },
                {
                  "title": "Collaborate and share information",
                  "body": "Collaborate with your team and share best practices and learnings. This will help you continuously improve and optimize your contact center modules."
                },
                {
                  "title": "Ensure compliance and security",
                  "body": "Ensure that your modules comply with all relevant security and compliance requirements, such as data privacy and access controls."
                }
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to the benefits, purposes, and advantages of flow modules. In the next lesson, you will learn about how to create step-by-step guides in flows and how to use views in the agent workspace. Navigate to the flow designer Amazon Connect console with the Routing menu expanded and Flows option selected. In the left navigation panel, choose Routing, and then choose Flows. Create the flow module Amazon Connect console Flows designer view with the Create flow module button highlighted. Choose the Modules tab, and then choose Create flow module. Add a Set logging behavior block Amazon Connect flow designer canvas with Set logging behavior block. Search for the Set logging behavior block, and then drag it onto the canvas. It is a best practice to enable logging for your flows. Logging can be used to help troubleshoot and fix potential issues. Add a Distribute by percentage block Flow designer with two blocks: Set logging behavior and Distribute by percentage block. Search for the Distribute by percentage block, and then add it to the canvas. Connect the Success branch from the Set logging behavior block to the entry of the Distribute by percentage block. Choose the Distribute by percentage block, and then, in the right configuration panel, add a percentage branch for 10%. Save the block configuration. In the top-left corner of the flow editor, enter a name for your module, for example: \"Ten percent calls active.\" Add Set recording and analytics behavior blocks Flow module with four blocks: set log behavior, distribute by percentage, set recording, and analytics behavior. Search for the Set recording and analytics behavior block, and then add two of them to the canvas. Connect the 10%: Recording enabled branch from the Distribute by percentage block to the first Set recording and analytics behavior block. To configure this recording block, choose the Call recording > On setting. Then choose Agent and Customer. Connect the 90% Default branch of the Distribute by percentage block to the second Set recording and analytics behavior block. The default configuration for this block does not enable call recording. Add an End flow / Resume block Flow module with five blocks: set log behavior, distribute by percentage, set recording, and analytics behavior and End flow. Search for the End flow / Resume block, and add it to the canvas. Connect the Success branches from the two Set recording and analytics behavior blocks to the End flow / Resume block. Publish your module. Summary Congratulations! You created your first module. You can now invoke this module for all lines of business that need to enable recordings for 10 percent of their calls. Lesson 3 of 8 Lesson 2 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flow-modules-guides-t1-q1",
          "question": "A consulting firm needs to create a contact flow for a client's call center. The flow must prompt callers with a generic welcome message and set up common interactive voice response (IVR) settings like voice, text-to-speech language, and call recording behavior. Which approach should the firm take to build this flow efficiently and promote reusability?",
          "options": [
            {
              "id": "A",
              "text": "Create separate flows for each IVR setting and welcome message and combine them into one large flow."
            },
            {
              "id": "B",
              "text": "Build a single monolithic flow with all the logic for the IVR settings and welcome message."
            },
            {
              "id": "C",
              "text": "Create a reusable module with the IVR settings and welcome message logic, which can be invoked from multiple flows."
            },
            {
              "id": "D",
              "text": "Write custom code to handle the IVR settings and welcome message logic for each new flow."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Creating a reusable module promotes code reuse, organization, and customization through parameters."
        },
        {
          "id": "connect-flow-modules-guides-t1-q2",
          "question": "An organization wants to ensure that all contact flows use the same version of a critical module for consistency. Which benefit of flow modules supports this requirement?",
          "options": [
            {
              "id": "A",
              "text": "Customization through module parameters"
            },
            {
              "id": "B",
              "text": "Ability to group related functionality into reusable components"
            },
            {
              "id": "C",
              "text": "Pre-built modules for repetitive tasks"
            },
            {
              "id": "D",
              "text": "Version control and revision tracking capabilities"
            }
          ],
          "correctOptionId": "D",
          "rationale": "The Amazon Connect flow designer provides versioning and revision control capabilities for flow modules. You can track changes, manage updates, and roll back to previous versions if required. This functionality provides consistency and reliability across flows and ensures that all flows use the same module version."
        }
      ]
    },
    {
      "id": "connect-flow-modules-guides-t2",
      "number": 2,
      "title": "Creating Step-by-Step Guides Part 1",
      "shortTitle": "Creating Step-by-Step Guides Part 1",
      "summary": "Amazon Connect step-by-step guides (noted as guides from now on in this course) are UIs designed to guide agents through customer interactions…",
      "duration": "~12 min",
      "lede": null,
      "objectives": [
        "Explore Amazon Web Services (AWS) managed and custom views.",
        "Identify the security permissions required to access and manage guides."
      ],
      "sections": [
        {
          "id": "connect-flow-modules-guides-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect step-by-step guides (noted as guides from now on in this course) are UIs designed to guide agents through customer interactions with intuitive workflows and customized views."
            },
            {
              "type": "p",
              "text": "Guides provide workflows, forms, actions, and step-by-step guidance for specific use cases. They also provide a personalized and streamlined experience by displaying customized data for agents and contacts."
            },
            {
              "type": "p",
              "text": "This lesson presents the first three steps you will go through when creating a step-by-step guide."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Step-by-step guides",
          "blocks": [
            {
              "type": "p",
              "text": "Guides empower contact center agents with intuitive workflows. These workflows guide agents through customer interactions with precision and efficiency. Step-by-step guides help agents seamlessly navigate custom views tailored to each interaction."
            },
            {
              "type": "p",
              "text": "With guides, agents can fill out single-page forms or follow detailed step-by-step instructions for specific use cases. Additionally, guides make it possible to customize the UI and data presented to agents."
            },
            {
              "type": "p",
              "text": "The following screenshot is an example of the agent’s view of a step-by-step guide from the Amazon Connect agent workspace. The guide displays interactive cards with configurable actions an agent can follow during an interaction. Some examples include handling new cases, unlocking credit cards, or helping contact make payments. IVR designers can create and customize step-by-step guides in the Amazon Connect flow designer."
            },
            {
              "type": "p",
              "text": "Following is an image of Amazon Connect agent workspace depicting a step-by-step guide with action cards."
            },
            {
              "type": "p",
              "text": "Amazon Connect workspace with six action cards: Current case, Security, Communications, Payment, Offers, and Service."
            },
            {
              "type": "p",
              "text": "With guides enabled, the agent application displays the contact information as soon as the contact is presented to the agent. Agents can navigate the available information, capture customer requests, or perform actions to address the contact inquiries."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Overview of the step-by-step guide process",
          "blocks": [
            {
              "type": "p",
              "text": "Organizations can streamline agent or contact workflows by creating step-by-step instructions to reduce agent cognitive load and improve the customer experience. Each organization has the flexibility to define job-role access to specific features in Amazon Connect. Based on your job role, you might have access to one or more steps in the following processes."
            },
            {
              "type": "p",
              "text": "To discover the high-level steps involved in the process of creating guides, expand each of the following categories."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 1: Granting permissions for guide views"
            },
            {
              "type": "p",
              "text": "This step is typically the contact center administrator's responsibility and consists of the following actions:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Navigating to the user security profile in the Amazon Connect console"
            },
            {
              "type": "ul",
              "items": [
                "Assigning the necessary permissions to grant the user access to create and maintain views",
                "Providing access to views for agents by assigning the necessary permissions to the agents’ security profiles"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 2: Creating guide views"
            },
            {
              "type": "p",
              "text": "This step is typically the IVR designer's responsibility, or it can be done by any user with access permissions to the functionality. It requires the following actions:"
            },
            {
              "type": "ul",
              "items": [
                "Using AWS managed pre-built views or creating a custom view by using the Views UI or APIs",
                "Ensuring that the guide's view contains all the necessary information and actions to guide agents."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 3: Creating guide flows"
            },
            {
              "type": "p",
              "text": "This step is typically the IVR designer's responsibility, or it can be done by any user with access permissions to the functionality. It requires the following actions:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Navigating to the Flows menu and creating an Inbound flow"
            },
            {
              "type": "ul",
              "items": [
                "Adding a Show view flow block and linking it to an AWS managed or custom view",
                "Creating linked views as needed for a complete workflow.",
                "Publishing the flow when completed"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 4: Adding guide flows to the Inbound flow"
            },
            {
              "type": "p",
              "text": "This step is typically the IVR designer's responsibility, or it can be done by any user with access permissions to the functionality. It requires the following actions:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Using an existing Inbound flow or creating a new one"
            },
            {
              "type": "p",
              "text": "Adding a Set event flow block to the Inbound flow to activate a guide flow that displays a guide view from the list of available events."
            },
            {
              "type": "p",
              "text": "The following sections provide details about Steps 1–3 of the process for creating guides. You will learn about Step 4 in the next lesson, Creating Step-by-Step Guides Part 2."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Granting permissions for guide views",
          "blocks": [
            {
              "type": "p",
              "text": "Users can gain access to create and use guides in Amazon Connect through security profile configuration. The contact center administrator can grant permissions as described in the following sections."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring Views permissions",
          "blocks": [
            {
              "type": "p",
              "text": "The security profile settings that grant users access to the no-code UI builder are located in the Channels and flows section on the Amazon Connect console. The View, Edit, Create, and Remove settings grant or deny user access to configure guide views."
            },
            {
              "type": "p",
              "text": "The following image depicts the security profile settings required to manage Views."
            },
            {
              "type": "p",
              "text": "Security profile section for Channels and flows with the Views configuration settings highlighted."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Accessing Custom views permissions"
            },
            {
              "type": "p",
              "text": "The settings that grant user access to guide custom views in the agent applications are found in the Agent Applications section of the user security profile. When the Access setting is enabled, users have access to custom views."
            },
            {
              "type": "p",
              "text": "The following image depicts the security profile settings required to access Custom views."
            },
            {
              "type": "p",
              "text": "Security profile view of the Agent Applications section with a highlight on the Custom views configuration settings."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 2: Creating guide views"
            },
            {
              "type": "p",
              "text": "Views are Amazon Connect resources that contain customized content displayed in the agent applications. To create a view, you use components placed in the graphical layout of your choice. Guides display static content in a view or pass dynamic content to the view in the flows. An example of dynamic content is a list of disposition codes specific to a contact type or queue. The following image depicts an agent workspace with different guide view types."
            },
            {
              "type": "p",
              "text": "Agent applications screen with different types of guide views example of Travel Rewards Card with customer information."
            },
            {
              "type": "p",
              "text": "After you create and publish a guide view, you can use flow logic to display the view on the agent workspace for each contact. Flows help designers activate a view when the contact is first presented and a different view when disconnected from the agent. For example, a disconnect view helps capture the contact's disposition as the agent wraps up the contact."
            },
            {
              "type": "p",
              "text": "A view contains three types of components: a template, actions, and input schema."
            },
            {
              "type": "p",
              "text": "There are two types of views: AWS managed views and customer managed views."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Using AWS managed views",
          "blocks": [
            {
              "type": "p",
              "text": "AWS managed views are built-in views created and managed by AWS. You can use these views to make your deployments more efficient."
            },
            {
              "type": "p",
              "text": "To learn more about the AWS managed views created with your Amazon Connect instance, expand each of the following categories."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Cards"
            },
            {
              "type": "p",
              "text": "With this view, you can present a list of topics for the agent to choose from as soon as they accept a contact. A Cards view contains multiple tiles that are dynamic, based on the customer's information and actions. The tiles can also be static."
            },
            {
              "type": "p",
              "text": "The following is an example of the Cards view."
            },
            {
              "type": "p",
              "text": "A cards view with six cards: New case, Unlock card, SMS session, Make payment, apply for a credit card, and a travel notice."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Confirmation"
            },
            {
              "type": "p",
              "text": "With this view, you can display the final outcome after a form is submitted or an action is taken. This view provides agents with reassurance on the successful completion of actions."
            },
            {
              "type": "p",
              "text": "The Confirmation view offers an opportunity to communicate next steps or provide additional information. This helps enhance the overall user experience and ensure clarity in agent interactions."
            },
            {
              "type": "p",
              "text": "The following is an example of the Confirmation view."
            },
            {
              "type": "p",
              "text": "Confirmation view page."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Detail"
            },
            {
              "type": "p",
              "text": "This view provides agents with information about the contact, such as the customer's history, preferences, and other context links. The information displayed in this view helps agents personalize their interaction, anticipate contact needs, and efficiently handle inquiries. By using this view, agents can deliver tailored solutions, build rapport with contacts, and enhance the overall customer experience."
            },
            {
              "type": "p",
              "text": "Following is an example of the Detail view."
            },
            {
              "type": "p",
              "text": "This is an example Details view. It contains a series of sample fields."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Form"
            },
            {
              "type": "p",
              "text": "Forms provide the agent with input fields to gather data and submit it to backend systems. Forms streamline the process of capturing contact information. They help make advanced requests or actions more efficient and manageable."
            },
            {
              "type": "p",
              "text": "Forms can be built to guide agents through a series of structured steps. This reduces the likelihood of errors or omissions so agents can focus on one aspect of a request at a time. Forms facilitate efficient data entry and ensure a seamless customer experience."
            },
            {
              "type": "p",
              "text": "The following is an example of the Form view."
            },
            {
              "type": "p",
              "text": "Example of the Form page. It contains a car rental example with car selection with pick up details."
            },
            {
              "type": "h",
              "level": 4,
              "text": "List"
            },
            {
              "type": "p",
              "text": "This view displays information to the agents as a list of items with titles and descriptions. The view offers a user-friendly and organized interface with access to key information and helps agents act efficiently. Each item has a link that helps agents initiate actions directly from the list or access relevant contact details."
            },
            {
              "type": "p",
              "text": "The following is an example of the List view."
            },
            {
              "type": "p",
              "text": "Example of the List page. It contains a series of sample fields and list item samples."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Using Custom views"
            },
            {
              "type": "p",
              "text": "With Amazon Connect step-by-step guides, organizations can build their own custom views. Custom views provide the flexibility to create and update interfaces tailored to each organization's specific needs. These views can be created and maintained using the built-in no-code UI builder. For complex customizations, organizations can also use public APIs to create views."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Discovering the no-code UI builder",
          "blocks": [
            {
              "type": "p",
              "text": "To create a custom view for agents, you can use the no-code UI builder available in the Amazon Connect console. The UI builder is a drag-and-drop interface where designers can use predefined visual objects from a library."
            },
            {
              "type": "p",
              "text": "To learn how to access the no-code UI builder, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Flows section with the Views tab selected and the Create View button highlighted."
            },
            {
              "type": "p",
              "text": "To define a consistent look and feel, designers also have access to predefined templates. The Customize toolbar provides options to further adjust visual styles for the guide view."
            },
            {
              "type": "p",
              "text": "To explore the main areas of the UI builder interface, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Create view page with the Library and Styles tabs selected."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Creating guide flows",
          "blocks": [
            {
              "type": "p",
              "text": "After you create your custom view that displays contact information and recommended actions, the next step is to create a guide flow that activates your view. You can create guide flows in the flow designer by selecting the Inbound flow type."
            },
            {
              "type": "p",
              "text": "A guide flow helps guide the agent's steps during contact interactions. With guide flows, you can define one or multiple steps in the agent workflow based on the contact inquiry type. You can link the current guide view with other views to create custom actions and guide any multistep agent workflow."
            },
            {
              "type": "p",
              "text": "For example, to troubleshoot a technical support issue, the first view provides the contact validation information. The second view provides the products or services the contact is currently subscribed to. A third view provides the frequently asked questions for the selected product or service. A fourth view provides multiple root causes for issues with a given product. By navigating these steps, agents can make the troubleshooting process more efficient and deliver a consistent experience every time."
            },
            {
              "type": "p",
              "text": "Show View block configurations pane with various attributes available in the flow block, such as Action selected and Error."
            },
            {
              "type": "p",
              "text": "Adding a Show view flow block"
            },
            {
              "type": "p",
              "text": "To implement step-by-step agent guidance, create a guide flow where you add one or more Show view flow blocks."
            },
            {
              "type": "p",
              "text": "A Show view block renders the view in the agent workspace and, if configured, can wait for specific agent actions. Use the detail window to configure your view."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Creating a workflow with multiple Show view blocks",
          "blocks": [
            {
              "type": "p",
              "text": "With Show view blocks, you can activate multiple views to define an entire workflow for agents. Based on how the agent interacts with the view, the Show view blocks provide control over the next steps. The flow block can be configured to wait for an agent’s action or selection and provide control back to the flow."
            },
            {
              "type": "p",
              "text": "On the right is a sample diagram of a flow with multiple Show View blocks."
            },
            {
              "type": "p",
              "text": "For example, if the current view supports back navigational options, the flow will continue from the Back branch of the Show view block and process the next step. Similarly, if the agent performs an action, such as selecting a button, the flow will continue with the corresponding action branch of the Show View block."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t2-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Handling data returned by the Show view flow block",
          "blocks": [
            {
              "type": "p",
              "text": "Guide views display and capture input from agents. As each flow block is processed, views store the input data as flow contact attributes."
            },
            {
              "type": "p",
              "text": "Guide views include two contact attributes you can use to enhance the experience: Action and ViewResultData. The attributes are stored in the view's namespace and can be accessed using $.Views.Action and $.Views.ViewResultData."
            },
            {
              "type": "p",
              "text": "You can use these contact attributes to further shape your flow based on your business outcomes. For example, take a view with a form where agents collect a contact name. If you choose Submit, the data entered by the agent is available in the next flow step."
            },
            {
              "type": "p",
              "text": "Following is an example of a form template."
            },
            {
              "type": "p",
              "text": "Configure contact attributes input data, highlighting populated intake fields, submit radio button and namespace selected."
            },
            {
              "type": "p",
              "text": "For AWS managed views, you can access the value entered by the agent in the $.Views.ViewResultData.FormData.<component-name> contact attribute. For custom managed views, the data is accessible in the $.Views.ViewResultData.<component-name>."
            },
            {
              "type": "p",
              "text": "You can use the Set contact attributes flow block to store the value collected in the form to a persistent user-defined contact attribute. This makes the data available outside of your guide's flow. You can use this data for further integrations required by your business use case."
            },
            {
              "type": "p",
              "text": "Following is a flow diagram depicting the Properties panel configurations and flow block options."
            },
            {
              "type": "ul",
              "items": [
                "Flow diagram depicting the Properties panel with the custName and LunchPref properties.",
                "Check your knowledge"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to the permissions required for guide views. You also explored the steps to create guide views and guide flows. In the next lesson, you will learn how to add guide flows to an Inbound flow. Lesson 4 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flow-modules-guides-t2-q1",
          "question": "An agent needs to access a specific view during a customer interaction. Which actions grant the agent access to custom views?",
          "options": [
            {
              "id": "A",
              "text": "Add a Show view flow block to the guide's flow."
            },
            {
              "id": "B",
              "text": "Create a new security profile and assign it to the agent."
            },
            {
              "id": "C",
              "text": "Grant Custom views access under the Agent Applications section of the agent security profile."
            },
            {
              "id": "D",
              "text": "Publish the guide's flow and configure main flow access to it."
            }
          ],
          "correctOptionId": "C",
          "rationale": "To grant agents access to views, navigate to the Security profiles section, select the agent's profile, and grant access to Custom views under the Agent Applications section."
        },
        {
          "id": "connect-flow-modules-guides-t2-q2",
          "question": "A user wants to create a custom view for agents using the no-code UI builder. Which actions describe the correct steps to access the UI builder?",
          "options": [
            {
              "id": "A",
              "text": "Navigate to the Flows menu, choose Views, and then choose Create View."
            },
            {
              "id": "B",
              "text": "Access the UI builder through the Amazon Connect APIs."
            },
            {
              "id": "C",
              "text": "Create a new flow and use the Show view flow block to access the UI builder."
            },
            {
              "id": "D",
              "text": "Open the AWS Management Console and search for the no-code UI builder service."
            }
          ],
          "correctOptionId": "A",
          "rationale": "To access the no-code UI builder, navigate to the Flows menu, choose Views, and then choose the Create View button."
        }
      ]
    },
    {
      "id": "connect-flow-modules-guides-t3",
      "number": 3,
      "title": "Creating Step-by-Step Guides Part 2",
      "shortTitle": "Creating Step-by-Step Guides Part 2",
      "summary": "In this lesson, you learn the final steps you will go through to complete the creation of a step-by-step guide.",
      "duration": "~6 min",
      "lede": null,
      "objectives": [
        "Recognize the configuration settings to activate guide views in a flow.",
        "Identify strategies to dynamically update data in guide views."
      ],
      "sections": [
        {
          "id": "connect-flow-modules-guides-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "In this lesson, you learn the final steps you will go through to complete the creation of a step-by-step guide."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Adding guide flows to the Inbound flow",
          "blocks": [
            {
              "type": "p",
              "text": "After you have created and published your guide flow, the next step is to add it to your Inbound flow. You can add one or more guide flows by using the Set event flow block in your main flow."
            },
            {
              "type": "p",
              "text": "For example, to display a guide view when a contact is presented to the agent, use a Set event flow block that displays the contact information. You can also use a Set event flow block that displays as soon as the contact disconnects, and the agent wraps up the follow-up contact work."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Displaying a guide view at the start of an interaction",
          "blocks": [
            {
              "type": "p",
              "text": "To display a guide view when an interaction starts, choose Default flow for Agent UI in the configuration settings for the Set event flow block. Then, choose the guide flow that displays the views you want the agent to see and interact with. The Set event flow block must be added in the flow before any transfer to queue block."
            },
            {
              "type": "p",
              "text": "Following is an example of the Set event flow block and its properties."
            },
            {
              "type": "p",
              "text": "Enable Guide View block with the Select event property highlighted."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Displaying a guide view post contact"
            },
            {
              "type": "p",
              "text": "A post-contact view helps agents provide feedback about the conversation, capture notes, or perform a series of follow-up tasks as soon as the contact ends."
            },
            {
              "type": "p",
              "text": "To display a guide view at the end of an interaction, choose Disconnect flow for Agent UI in the configuration settings for the Set event flow block. Then, choose the guide flow that displays the views you want the agent to see and interact with post-contact interaction."
            },
            {
              "type": "p",
              "text": "The following image depicts a Set Disconnect Flow block with the Select event property highlighted."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Testing the guide views in the agent workspace",
          "blocks": [
            {
              "type": "p",
              "text": "This step is not typically the responsibility of the IVR designer. Contact center personas with the proper access permissions to test agent functionality can follow these steps:"
            },
            {
              "type": "p",
              "text": "Log in to the agent workspace using test agent user credentials. Ensure that the user profile has the permissions to access guide views."
            },
            {
              "type": "ul",
              "items": [
                "Make a test call or initiate a test chat from the Amazon Connect console.",
                "Accept the contact in the agent workspace."
              ]
            },
            {
              "type": "p",
              "text": "If the guide is activated at the beginning of the interaction, the agent workspace should display the guide view you configured in the flow."
            },
            {
              "type": "p",
              "text": "Navigate through the view and test all the actions."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Using dynamic data in views"
            },
            {
              "type": "p",
              "text": "Creating views for agents to handle interactions offers an effective and streamlined way to guide agents through the steps required to process contact queries. In Amazon Connect, your views can be used to display data and adapt to the context of each interaction."
            },
            {
              "type": "p",
              "text": "You can use the no-code UI builder to turn every component into a placeholder replaced by dynamic values when a view is presented to an agent. For example, you can create a view that displays personal information from a contact, such as their name or account number. The required data is collected during the interaction lifecycle and passed to the view before it is presented to an agent."
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Using attributes in a component",
          "blocks": [
            {
              "type": "p",
              "text": "When creating a view, you can add a number of components related to your use case. For example, you can create a view that presents an attribute bar and use that attribute bar to display information about the contact."
            },
            {
              "type": "p",
              "text": "Each contact will be different because the customer changes, and the intent of the contact varies. Displaying relevant data to the agent helps enhance customer satisfaction. It also helps the agent handle a contact more efficiently."
            },
            {
              "type": "p",
              "text": "The following example is an illustration of the Attribute Bar component in a view."
            },
            {
              "type": "p",
              "text": "Default display of the four values available in the configuration view."
            },
            {
              "type": "p",
              "text": "By default, none of the attribute values are dynamic, and you can set a label and value directly in the no-code UI builder. For example, you might want to display the contact's name, phone number, account number, and date of birth. You can modify the labels accordingly in the builder because the labels will stay the same from one contact to another."
            },
            {
              "type": "p",
              "text": "To explore the steps involved in creating a view, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "View of the Attribute Bar with the Customize panel open. Attribute 1 is selected."
            },
            {
              "type": "p",
              "text": "By adjusting the labels for each attribute in the no-code UI builder, you can change what displays for agents when the view for a contact is presented."
            },
            {
              "type": "p",
              "text": "The following example is an illustration of the Attribute Bar component in a view. This example shows four attributes: Contact name, Phone number, Account number, and Date of birth."
            },
            {
              "type": "p",
              "text": "Display of four values in the attribute bar: Contact name, Phone number, Account number, and Date of birth."
            },
            {
              "type": "p",
              "text": "After you modify the labels for each attribute, you need to configure the labels to accept a dynamic value display for each contact. You cannot create a view for every contact, and you cannot know the value that should be displayed before presenting the view to the agent."
            },
            {
              "type": "p",
              "text": "In the no-code UI builder, most components that present information offer a This is dynamic option. When you select this option, the no-code UI builder displays a default value that is replaced with the real-time value when the view is presented to the agent. You can control the value by passing the data within the flow used to control the guide."
            },
            {
              "type": "p",
              "text": "In the following example, you can select This is dynamic for each of the four attribute values."
            },
            {
              "type": "p",
              "text": "View of an attribute's property with the This is dynamic check box highlighted."
            },
            {
              "type": "p",
              "text": "When you publish the view, you can use it to create a guide flow. In the flow, you use a Show View block to display the view. The Show View block now displays additional fields for each of the attribute values. This strategy helps to dynamically set the value for the attributes. For example, the values can be provided by an external system and retrieved using an AWS Lambda function or stored in contact attributes."
            },
            {
              "type": "ul",
              "items": [
                "Example of JSON formatted data that passes values used by your Attribute Bar.",
                "This is an example of JSON formatted data that passes values used by your Attribute Bar."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Accessible Sample JSON example"
            },
            {
              "type": "p",
              "text": "{\"Attributes\": ["
            },
            {
              "type": "p",
              "text": "{\"Label\":\"Customer name\","
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "\"Value\":\"$.Attributes.name\"",
          "blocks": [
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "{\"Label\":\"Phone number\","
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "\"Value\":\"$.Attributes.phone\"",
          "blocks": [
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "{\"Label\":\"Account number\","
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s8",
          "eyebrow": null,
          "duration": null,
          "title": "\"Value\":\"$.Attributes.account\"",
          "blocks": [
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "{\"Label\":\"Date of birth\","
            }
          ]
        },
        {
          "id": "connect-flow-modules-guides-t3-s9",
          "eyebrow": null,
          "duration": null,
          "title": "\"Value\":\"$.Attributes.dob\"",
          "blocks": [
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "]}"
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you reviewed how to add guide views to your flows and how to dynamically display contact data in views. Continue to the next lesson to review the course summary and prepare for the end-of-course assessment. Lesson 5 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-flow-modules-guides-t3-q1",
          "question": "An agent needs to capture customer feedback after a contact is disconnected. Which flow option displays post-contact views to an agent?",
          "options": [
            {
              "id": "A",
              "text": "Add a Set event flow block and select the Disconnect Flow for Agent UI event hook, in the main flow."
            },
            {
              "id": "B",
              "text": "Create a separate Inbound flow specifically for post-contact views."
            },
            {
              "id": "C",
              "text": "Use the Show View flow block in the main flow after the contact is disconnected."
            },
            {
              "id": "D",
              "text": "Configure the security profile to allow access to post-contact views."
            }
          ],
          "correctOptionId": "A",
          "rationale": "By adding a Set event flow block with the Disconnect Flow for Agent UI event hook, a view can be presented to the agent after the contact disconnects."
        },
        {
          "id": "connect-flow-modules-guides-t3-q2",
          "question": "An interactive voice response (IVR) designer is tasked with creating a customer view that displays dynamic contact information during an interaction. Which strategy should the IVR designer follow?",
          "options": [
            {
              "id": "A",
              "text": "Create a new view for every customer interaction."
            },
            {
              "id": "B",
              "text": "Create a view for agents to manually enter the customer information during the interaction."
            },
            {
              "id": "C",
              "text": "Use the no-code UI builder to set the component values as dynamic placeholders."
            },
            {
              "id": "D",
              "text": "Request the development team to hardcode the customer information in the view."
            }
          ],
          "correctOptionId": "C",
          "rationale": "In the no-code UI builder, most components that present information offer a This is dynamic configuration option. When you select this option, the no-code UI builder displays a default value that is replaced with the real-time value when the view is presented to the agent."
        }
      ]
    },
    {
      "id": "connect-flow-modules-guides-t4",
      "number": 4,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this course, you learned about advanced features of Amazon Connect flows. Flows optimize contact center operations with flow modules and…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-flow-modules-guides-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Course summary",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you learned about advanced features of Amazon Connect flows. Flows optimize contact center operations with flow modules and step-by-step guides. Take a moment to review these key concepts in the course summary before taking the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Concepts"
            },
            {
              "type": "p",
              "text": "Flow modules are reusable components that encapsulate flow logic. Use modules for greetings, prompts, call transfers, data validation, error handling, or integration with external systems."
            },
            {
              "type": "p",
              "text": "Step-by-step guides provide agents with custom views, forms, and step-by-step instructions tailored to each interaction. Views are AWS managed or customer managed, which provides for flexible customization."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Benefits"
            },
            {
              "type": "p",
              "text": "Advanced capabilities of Amazon Connect flows provide several benefits to organizations."
            },
            {
              "type": "p",
              "text": "Flow modules provide the following benefits:"
            },
            {
              "type": "p",
              "text": "Promote modular design, code reusability, customization, and more efficient development of contact flows."
            },
            {
              "type": "p",
              "text": "Break down complex flows into smaller, manageable components, to enhance code organization, readability, and maintainability. Modules provide version control and consistent updates across flows."
            },
            {
              "type": "p",
              "text": "Step-by-step guides provide the following benefits:"
            },
            {
              "type": "p",
              "text": "Empower agents with intuitive workflows, tailored views, forms, and step-by-step instructions."
            },
            {
              "type": "p",
              "text": "Streamline customer interactions and guide agents through complex processes, capturing customer information, or providing personalized recommendations."
            },
            {
              "type": "ul",
              "items": [
                "Considerations",
                "Considerations for flow modules include the following:"
              ]
            },
            {
              "type": "ul",
              "items": [
                "Identify experiences that use repeatable logic.",
                "Design and build your modular components once and invoke modules within the main flows.",
                "Considerations for step-by-step guides include the following:"
              ]
            },
            {
              "type": "ul",
              "items": [
                "Use existing AWS managed views or create your own custom views.",
                "Configure guide flows, and display views in the agent workspace to provide guidance."
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
