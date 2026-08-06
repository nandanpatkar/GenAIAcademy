/*
 * Amazon Connect — Customer Profiles Fundamentals
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT CUSTOMER PROFILE FUNDAMENTALS.txt
 *            conne-text/Amazon Connect Customer Profiles Getting Started Course Summary.txt  (from conne/Amazon Connect Customer Profiles Getting Started Course Summary.pdf)
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-customer-profiles-fundamentals",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Customer Profiles Fundamentals",
  "provider": "Amazon Web Services",
  "level": "Fundamentals",
  "category": "AI and automation",
  "description": "What Customer Profiles brings together, how agents use it during a contact, and the considerations for enabling it.",
  "examFormat": "5 topics · ~36 min · 6 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT CUSTOMER PROFILE FUNDAMENTALS.txt",
    "conne-text/Amazon Connect Customer Profiles Getting Started Course Summary.txt  (from conne/Amazon Connect Customer Profiles Getting Started Course Summary.pdf)"
  ],
  "modules": [
    {
      "id": "connect-customer-profiles-fundamentals-t1",
      "number": 1,
      "title": "Introduction to Amazon Connect Customer Profiles",
      "shortTitle": "Introduction to Amazon Connect Customer Prof…",
      "summary": "Customer Profiles is a built-in feature of Amazon Connect that works with all of the Amazon Connect customer-facing channels. Using Customer…",
      "duration": "~9 min",
      "lede": null,
      "objectives": [
        "In this lesson, you will:",
        "Recognize the purpose of Customer Profiles.",
        "Recognize the meaning of key Customer Profiles concepts.",
        "Identify the benefits of using Customer Profiles.",
        "Identify features of Customer Profiles."
      ],
      "sections": [
        {
          "id": "connect-customer-profiles-fundamentals-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles is a built-in feature of Amazon Connect that works with all of the Amazon Connect customer-facing channels. Using Customer Profiles empowers agents with the customer insights they need to deliver personalized customer service. You can create a single, unified view of the data by using Customer Profiles to automatically combine relevant customer information from multiple systems and applications."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Concepts and terminology",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profile data can be ingested from multiple data sources, and stored as customer profile attributes. Amazon Connect does not replace or update the data in the external application. If a data source is removed, the data from the external source is no longer available in the profile. For information about how customer profile data is secured, see the Data protection in Amazon Connect section in the Administrator Guide. To learn the core concepts of Customer Profiles, expand the following categories."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Customer Profile",
          "blocks": [
            {
              "type": "p",
              "text": "A Customer Profile contains all the information about a customer, and includes a standard profile object and any number of custom profile objects. A customer profile can have one standard object and up to 1000 custom profile object types with a maximum size of 250 Kilobytes. Using generative AI, Customer Profiles automatically map your data from different sources using no-code pre-built connectors from third-party applications. Third-party applications include Adobe Analytics, Salesforce, ServiceNow, Zendesk, and homegrown applications via Amazon Simple Storage (Amazon S3)."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Standard profile",
          "blocks": [
            {
              "type": "p",
              "text": "A standard profile object is a predefined object that contains standard fields, such as phone number, email address, name, and address. Agents can manually update standard profile data. Interactive systems can programmatically update data using Flows functionality. Data can also be automatically ingested from external sources such as Salesforce, ServiceNow, Marketo, or homegrown applications."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Custom profile object",
          "blocks": [
            {
              "type": "p",
              "text": "A custom profile object is a single unit of information about a profile. Some examples include information about a recent interaction (contact record), a support ticket, a case, or even a click-stream record from the organization web-site. Custom objects combined with the standard object data create a full context of a customer profile."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Mapping templates",
          "blocks": [
            {
              "type": "p",
              "text": "Mapping templates are predefined object types that define the layout of a custom profile object. The templates are used to quickly ingest data from known sources. Customer Profiles include mapping templates for Amazon Connect contact records, Salesforce Account objects, ServiceNow Users objects, and Marketo Leads objects."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Object type mapping",
          "blocks": [
            {
              "type": "p",
              "text": "When customer data is ingested in a customer profile, the object type mapping defines how the data is mapped into standard and custom profile objects. Object type mapping also identifies what fields should be indexed for each one of the objects in the profile. You can create an object type mapping using the Amazon Connect console, or by using the Customer Profiles API. More information is available in the Create object type mapping section of the Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Calculated attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Calculated attributes help organizations define their own business logic to transform their customer profile data into actionable data points to personalize automated experiences."
            },
            {
              "type": "p",
              "text": "By using calculated attributes, interactive voice response (IVR) designers and agents get access to information, such as:"
            },
            {
              "type": "ul",
              "items": [
                "• customer behavior (last website page visited or last agent they interacted with).",
                "• patterns of behavior (frequent caller or preferred interaction channel).",
                "• customer value (new customer, average number of tickets, or interaction durations)."
              ]
            },
            {
              "type": "p",
              "text": "The data available in calculated attributes can be used to reduce customer interaction effort and personalize the conversation. This data can also be used to dynamically apply the effective routing strategy to find the right agent at the right time. For example, the last web site interaction can be used to anticipate the customer intent when interacting with IVR. This will save the customer time selecting the reason they are contacting your organization. You can implement a different treatment for repeat callers or potential new leads, and you can redirect the interaction to the customer's preferred agent. Instant access to data available from multiple systems at the time of the interaction reduces the amount of time the customer has to wait for a lookup and validation."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Identity resolution",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles offers the ability to periodically run an identity resolution job that finds and merges similar profiles. There are situations where multiple customer records are captured across multiple channels and applications for the same customers that do not share a common identifier. Identity resolution automatically finds similar profiles and help administrators consolidate them."
            },
            {
              "type": "p",
              "text": "The job runs on a weekly basis and performs automatic profile matching and automatic merging of similar profiles. The automatic matching is performed using up to 15 configurable matching rule attributes. You can find more details in the How rule-based Identity Resolution works in the Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits of using Customer Profiles",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Personalized, dynamic experience"
            },
            {
              "type": "p",
              "text": "With Customer Profiles, organizations can provide a personal and dynamic customer experience through IVR and chatbots. Chatbots offer additional opportunities for self-service without involving an agent. IVR and chatbots use Amazon Connect Flows to personalize the end-to-end customer experience in the contact center."
            },
            {
              "type": "p",
              "text": "Organizations can use customer profile data as follows:"
            },
            {
              "type": "ul",
              "items": [
                "• Greet the customer by name.",
                "• Route the customer to a more experienced agent if they are frequent or repeat callers.",
                "• Anticipate the customer intent based on their most recent activity with the company.",
                "• Route the call to the appropriate geographical queue based on the customer’s address.",
                "• Send the caller to the last agent or preferred agent based on the information in their profile."
              ]
            },
            {
              "type": "p",
              "text": "The Customer Profiles Flow block can find the customer profile based on a number of configured fields. These fields include phone number, email address, name, account number or order number. You can then use customer information from the profile to personalize automated interactions and contact routing."
            },
            {
              "type": "p",
              "text": "A personalized and dynamic experience for the customer helps reduce their effort, and increases customer satisfaction and trust."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Use case"
            },
            {
              "type": "p",
              "text": "Conversational designers or IVR administrators can create different customer experience Flows using pre-defined search keys, such as the phone number, email address, or account number. When the caller is uniquely identified by using search keys, Flow designers can use the customer data to personalize the customer’s greeting. As the contact starts interacting with the IVR, the system retrieves their first and last name, and greets them by name. For example, “Welcome to AnyCompany, Márcia Oliveira.”"
            },
            {
              "type": "p",
              "text": "Flow designers can also use customer profile data to simplify customer's interaction with IVR menus by anticipating their call intent. For example, Carlos receives an email from AnyCompany advertising a new life insurance product offering. This communication is attached to Carlos's customer profile data. Carlos calls AnyCompany to ask for eligibility criteria. By using customer profile data the Flow designers can implement a personalized message such as \"Hi, Carlos! Are you calling in regards to our new life insurance product offering?\"."
            },
            {
              "type": "p",
              "text": "Data, such as customer sentiment, can be used to provide customers with a dynamic call treatment. If the previous interaction shows a negative sentiment, the contact might be automatically routed to a specialized queue that has agents better equipped to handle the contact. When other pieces of data ingested from third-party applications are available, the IVR has access to additional contact details. Insights into the most recent business transaction or current status of a shipping delivery can reduce customer effort, and better streamline the conversation."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Unified view for agents"
            },
            {
              "type": "p",
              "text": "As a customer begins a communication, Customer Profiles automatically matches the contact against customer data from the connected applications. It then surfaces a unified profile to the agent, directly in Amazon Connect. Customer Profiles combines customer information from multiple sources, so that agents no longer have to navigate between various applications to find the customer information they need. With Customer Profiles, customer information is automatically displayed in one record, including their previous contact history. Agents save time and have the most up-to-date information to provide a quick and personalized experience to the customer."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Use case"
            },
            {
              "type": "p",
              "text": "When a customer opts to speak or chat with an agent, Customer Profiles displays all information the agent needs in a single place. With a single view of customer information and contact history, agents have the information needed to quickly determine the reason for the call or the digital message. Depending on the integration level with other applications, Agents may be able to see the following customer information:"
            },
            {
              "type": "ul",
              "items": [
                "Product purchase history, if the data is ingested from an external application like Salesforce",
                "Contact history, such as dates, times, and duration of the customer’s previous contacts",
                "Additional customer information that is configured by the administrator of the system"
              ]
            },
            {
              "type": "p",
              "text": "Agents can also make edits to the customer’s information or choose to go directly to the contact’s Contact Record details page to review information."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Deduplication of Customer Profiles with Identity Resolution"
            },
            {
              "type": "p",
              "text": "When customer data is brought into Amazon Connect from multiple sources, there may be duplicate customer records. Customer Profiles includes a feature called Identity Resolution that uses machine learning (ML) to find multiple profiles for the same contact and helps you consolidate them. Identity Resolution runs an identity resolution job on a weekly basis. The identity resolution job provides a confidence score between 0 and 1 of how likely two profiles are an exact match (a score of 1 likely indicates an exact match). After the profiles are matched, the identity resolution job can merge similar profiles based on criteria that you specify. This provides clean data of your customer records with one profile per customer, which will save your agents time when searching for customer profiles in the agent application."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Use case"
            },
            {
              "type": "p",
              "text": "When a customer and agent are interacting, the agent navigates between applications to access customer information across applications such as a customer relationship management (CRM), marketing, billing, and shipping software. While the agent tries to find the customer in all the applications, the customer is typically waiting on hold, which in most cases results in a poor customer experience. For companies without a data-quality initiative in place, duplication rates are common because of multiple sources of customer data, out-of-date customer records, and lack of unique customer identifiers."
            },
            {
              "type": "p",
              "text": "The Identity Resolution feature uses ML to automatically detect duplicate customer profiles based on criteria defined by the organization, such as name, email address, or phone number. For example, two or more profiles with the customer name as “John Doe” and “Jhn Doe,” are likely the same customer and can be automatically matched, despite the typo. Additional examples include email addresses using different capitalization, such as “JOHN_DOE@ANYCOMPANY.COM” and “johndoe@anycompany.com.\" Phone number formats, such as “555-010-0000” and “+1-555-010-0000,\" are other examples of differing formats for data. Identity Resolution can also merge customer profiles based on missing key attributes, such as Last Name or Account ID. When the Identity Resolution feature identifies these matches based on the consolidation criteria the organization specified, the ML process will automatically merge them into a unified customer profile."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to how Customer Profiles can help create seamless customer experiences. In the next lesson, you will learn about how an organization can use Customer Profiles. Lesson 3 of 8 Lesson 2 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-customer-profiles-fundamentals-t1-q1",
          "question": "It is time to check your understanding of the content covered in this lesson. Which of the following are benefits of using Customer Profiles? (Select TWO.) (Select all that apply: Agents have customer information in a single place. / Customer Profiles replaces an organization’s customer relationship management (CRM) system. / Customer information is verified through multiple methods. / Customer Profiles creates duplicate customer records. / Customer information is stored in Amazon Connect for 60 days.)",
          "options": [],
          "answer": "Agents have customer information in a single place.; Customer information is verified through multiple methods.. Customer Profiles presents customer information in a single, unified view so agents don’t have to toggle between various applications. As a customer calls in or starts a chat, Customer Profiles automatically scans and matches their phone number or customer ID against their information. It also uses Identity Resolution to de-deduplicate records."
        },
        {
          "id": "connect-customer-profiles-fundamentals-t1-q2",
          "question": "Which feature of Customer Profiles prevents the duplication of customer data?",
          "options": [
            {
              "id": "A",
              "text": "Unified view for agents"
            },
            {
              "id": "B",
              "text": "Interactive voice response"
            },
            {
              "id": "C",
              "text": "Identity Resolution"
            },
            {
              "id": "D",
              "text": "Standard profile object"
            }
          ],
          "correctOptionId": "C",
          "rationale": "Customer Profiles uses Identity Resolution to deduplicate customer records."
        }
      ]
    },
    {
      "id": "connect-customer-profiles-fundamentals-t2",
      "number": 2,
      "title": "Using Customer Profiles",
      "shortTitle": "Using Customer Profiles",
      "summary": "Amazon Connect Customer Profiles makes it possible for IVR designers to implement personalized and dynamic experiences for customers. It also…",
      "duration": "~10 min",
      "lede": null,
      "objectives": [
        "In this lesson, you will:",
        "Explore a Customer Profiles use case.",
        "Recognize where to access customer information."
      ],
      "sections": [
        {
          "id": "connect-customer-profiles-fundamentals-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Customer Profiles makes it possible for IVR designers to implement personalized and dynamic experiences for customers. It also allows agents to access customer information from multiple systems in a single, unified view."
            },
            {
              "type": "p",
              "text": "In this lesson, you will be guided through an airline customer use case, and get a brief description of how to use the Customer Profile block in Amazon Connect Flows to reduce the customer effort. You will also learn how the Customer Profile view empowers agents to effectively address customer issues, and make changes to the customer data."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario: Providing a dynamic customer experience",
          "blocks": [
            {
              "type": "p",
              "text": "Sofia Martinez is an airline customer whose upcoming flight was cancelled. Sophia calls the contact center for assistance. As soon as the call connects, Amazon Connect uses the phone number to locate Sofia’s profile information. The IVR uses the customer data available in the Customer Profile to greet Sophia by name. Sophia’s account number, also available as part of her profile, is used to look up their case status. The IVR offers to rebook for the next available flight."
            },
            {
              "type": "p",
              "text": "Sophia accepts to re-book, but asks for a business-class upgrade for the inconvenience. Since this is a sensitive transaction that requires human intervention, Sophia opts to talk to an agent. As soon as the call connects, the customer service representative (CSR) has all Sophia's context information available. The CSR informs Sophia that business-class seats are full for the flight. The CSR uses a visual step-by-step guide to offer Sophia a gift card for the double inconvenience. Sophia confirms their email and home address. The representative notices the address on file had the wrong street type, and adds this information to Sophia’s profile, where it can be accessed for future interactions."
            },
            {
              "type": "p",
              "text": "Dynamic customer experience process flow."
            },
            {
              "type": "p",
              "text": "This scenario shows an example of how a customer problem is resolved by using available customer data to provide a dynamic, personalized, and frictionless experience. For sensitive transactions, the call is transferred to an agent. The agent is able to verify the customer’s email address, collect and update the shipping address directly in Amazon Connect Customer Profiles to ensure the gift card is sent to the right recipient."
            },
            {
              "type": "p",
              "text": "In the next sections, you will discover the steps to enable and access the Customer Profiles functionality you need to implement for the airline use case described above."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Enable Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "The Customer Profiles functionality can be activated during or after your contact center creation."
            },
            {
              "type": "p",
              "text": "To enable Customer Profiles, the infrastructure administrator of your contact center must first create and configure a domain. The Customer Profiles domain is a container for all data, including customer profile attributes, object types, profile keys, and encryption keys. Each contact center instance can only be associated with one domain, so organizations are encouraged to choose a friendly and meaningful domain name, such as the organization’s name. Please note that the domain name cannot be changed."
            },
            {
              "type": "p",
              "text": "During a contact center instance creation, the Customer Profiles feature is automatically opted into by default. If the feature is not activated by the organization during instance creation, an administrator can enable the functionality at a later date by selecting the Enable Customer Profiles button on the Amazon Connect account overview page."
            },
            {
              "type": "p",
              "text": "For more details about creating a Customer Profiles domain name, read Enable Customer Profiles for your instance in the Administrator Guide."
            },
            {
              "type": "p",
              "text": "Confirmation that the Enable Customer Profiles checkbox is selected."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Configure the domain"
            },
            {
              "type": "p",
              "text": "Once the Customer Profile feature is enabled, the next step administrators perform is to create a domain. To create a domain, they select a unique domain name and create an encryption key that will secure the data stored in this domain. Then, they configure an Amazon Simple Queue Service (Amazon SQS) dead-letter queue for error reporting."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Integrate applications with prebuilt connectors",
          "blocks": [
            {
              "type": "p",
              "text": "Following the creation of the domain, the next step is to configure the necessary integrations to ingest the customer data as Customer Profiles. Customer Profiles automatically integrates the contact records from Amazon Connect interactions. However, interactive systems and agents and also need customer information from the organizations' systems of record to complete their full profile. Prebuilt connectors provide convenient setup using a step-by-step guided process rather than having to code custom integrations using program languages or APIs."
            },
            {
              "type": "p",
              "text": "External applications: Amazon Connect provides a set of prebuilt integrations, powered by Amazon AppFlow and Amazon EventBridge. Organizations can bring data from application connectors into Customer Profiles. Then, they combine this data with contact history data to create a customer profile with the information agents need to provide personalized customer service. A prerequisite for data ingestion is the configuration of AWS Key Management Service (AWS KMS) keys. For detailed instructions, see the Administrator Guide at the link Create an AWS KMS key to be used by Customer Profiles to encrypt data (required)."
            },
            {
              "type": "p",
              "text": "Internal applications: A prebuilt connector is available for Amazon Simple Storage Service (Amazon S3). Organizations that store customer data in a homegrown or third-party application that does not have a prebuilt connector can use the Amazon S3 integration. The organization must define the data and data structure through object type mapping."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Integrating applications without prebuilt connectors",
          "blocks": [
            {
              "type": "p",
              "text": "When ingesting data in Customer Profiles, organizations also have the option to build their own custom integrations. Using the following developer tools, organizations can programmatically sync their customer data with Customer Profiles. To learn more about custom development options, choose each of the following four tabs."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "SDK",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Connect Streams"
            },
            {
              "type": "p",
              "text": "Using Amazon Connect Customer Profiles Rest API, developers can build custom integrations from their customer database to Amazon Connect. Developers can also automate key API actions, such as SearchProfile, GetMatches and UpdateProfile."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect administrator configuration",
          "blocks": [
            {
              "type": "p",
              "text": "After enabling Customer Profiles and ingesting profile data, the contact center administrator must assign permissions to the user security profile to allow access to the profile data."
            },
            {
              "type": "p",
              "text": "To access the Customer Profiles Flow block, users need View permission. Agents can be assigned View permissions to view and search profiles, and to get access to the detailed information associated with contact records. The can also get Edit and Create permissions to update existing profiles or manually create new profiles. For more details please refer to the How to update permissions for agents and How to update permissions for Flows in the Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s8",
          "eyebrow": null,
          "duration": null,
          "title": "What are Flows?",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect uses Flows to personalize the end-to-end customer experience with an organization. Users with the right permission access can use a drag-and-drop graphical Flow designer to link blocks together to build dynamic conversational experiences. Flow blocks are prebuilt units designed for specific functions. For example, to greet a customer, you can use a \"Play prompt\" block. Each block has configurable properties that can be used to further customize the Flow. To learn more about the Flow designer interface, choose each of the three numbered markers."
            },
            {
              "type": "p",
              "text": "Amazon Connect is equipped with default Flows that are available when you first create your contact center instance. Organizations can customize flows, and Amazon Connect provides a set of sample flows that model how to perform common functions. These flows are designed to help users learn how to create similar flows and speed up their task. All default and sample flows are available in the Amazon Connect console. To access them, go to Routing, then choose Flows. You can explore how default and sample Flows work by reading the Sample Flows page of the Administrator Guide."
            },
            {
              "type": "p",
              "text": "Once the contact center is created, you claim a phone number and associate it with a Flow, and the contact center is operational."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s9",
          "eyebrow": null,
          "duration": null,
          "title": "The Customer Profiles Flow block",
          "blocks": [
            {
              "type": "p",
              "text": "The Customer Profiles Flow block was designed to help simplify the handling of customer information contained in a profile with no-code. With this Flow block, you can search a contact by any of the fields configured as search identifiers in the profile configuration. Some examples of search fields include contact phone number, email address, full name, account number or case ID."
            },
            {
              "type": "p",
              "text": "The same block helps you:"
            },
            {
              "type": "ul",
              "items": [
                "Update the current information for the contact.",
                "Create a new customer profile.",
                "Get access to calculated attributes such as last communication channel, most frequent channel used, and frequent caller."
              ]
            },
            {
              "type": "p",
              "text": "For self-service actions that do not involve an agent, the Customer Profile block helps you associate the current interaction with the customer profile in the IVR."
            },
            {
              "type": "p",
              "text": "You can reference the Customer profile block's Response field in the subsequent Flow blocks in the Amazon Connect Flow. Selecting an action and a search identifier and setting the identifier value are required actions. Configuring the Response field is optional, but is a powerful tool that can be a used to further personalize the customer experience later in the Flow."
            },
            {
              "type": "p",
              "text": "For our airline use case, you can implement a simple greeting by name by first selecting FirstName in the Response fields dropdown menu. You can then dynamically access this information as part of the Play prompt block you use to greet Sophia by name. Please be aware that this information is available only if the Customer Profile search resulted in a single match. For multiple matches, you will have to try a new search using a unique piece of data, which can limit your search results to a single profile."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Agent Workspace",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect Agent Workspace is a single, intuitive application. The Agent Workspace provides agents with all the customer information and step-by-step guidance they need to onboard faster, resolve issues efficiently, and improve customer experiences. Contact center agents are often required to use many separate applications in order to manage a single customer interaction. This increases handle times, and frustrates customers."
            },
            {
              "type": "p",
              "text": "In this section, we focus on using the Customer Profiles view available in the Agent Workspace."
            },
            {
              "type": "p",
              "text": "Agents can access the built-in Customer Profiles view when they use the Agent Workspace. The Customer Profiles view can also be embedded in any custom agent application built with the Amazon Connect Streams library."
            },
            {
              "type": "p",
              "text": "To access the Agent Workspace, an agent will use a web link. For more information on the Agent Workspace, including how to access it, see the Access Customer Profiles in the Agent Workspace section in the Administrator Guide."
            },
            {
              "type": "p",
              "text": "As Sophia's call arrives to the Agent Workspace, the agent will have Sophia's profile information displayed on the Customer profile view, and they can immediately start addressing their issue."
            },
            {
              "type": "p",
              "text": "To learn more about the sections shown in the customer profile tab of the Agent Workspace, choose the following four numbered markers."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to how to use Amazon Connect Customer Profiles. In the next lesson, you will learn about service quotas, security, and pricing considerations. CLI SDK Amazon Connect Streams The AWS CLI Command Reference for Customer Profiles provides the list of commands developers can use in their Command Line Interface (CLI) to interact with Customer Profiles. This provides developers with the option to run commands that implement Amazon Connect functionality equivalent to the functions they could utilize in browser-based AWS Management Console. SDK Amazon Connect Streams By installing the Customer Profiles Client, AWS Software Developer Kit (SDK) for JavaScript v3, developers can download the JavaScript commands using their preferred package manager. These commands can then be used to build JavaScript programs that interact with Customer Profiles. Amazon Connect Streams When using Amazon Connect Streams API, organizations can integrate existing web applications with Amazon Connect. With Amazon Connect Streams you can embed the Contact Control Panel (CCP) and Customer Profiles application UI into a your organization’s page. It also permits the handling of agent and customer (contact) state events directly through an object-oriented event driven interface. Lesson 4 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-customer-profiles-fundamentals-t2-q1",
          "question": "It is time to check your understanding of the content covered in this lesson. AnyCompany Insurance uses the Amazon Connect application for their contact center. Juan Li, an infrastructure administrator at AnyCompany Insurance must activate the Customer Profiles feature. Juan logs into the Amazon Connect instance and notices that the Enable Customer Profiles option is already selected. What are the next steps Juan needs to take to activate of the Customer Profiles feature? (Select TWO). (Select all that apply: Create an AWS Key Management Service (AWS KMS). / Create a new instance. / Determine the use of a dead-letter queue. / Manually select the Enable Customer Profiles checkbox. / Delete existing instances.)",
          "options": [],
          "answer": "Create an AWS Key Management Service (AWS KMS).; Determine the use of a dead-letter queue.. Juan must create an AWS KMS key to activate Customer Profiles. Juan will also have to determine if they want to use a dead-letter queue with Customer Profiles. Because the Enable Customer Profiles checkbox is already selected for the instance, Juan does not need to select it again. Existing instances do not need to be deleted to turn on Customer Profiles."
        },
        {
          "id": "connect-customer-profiles-fundamentals-t2-q2",
          "question": "What Flow block can be used to access customer information?",
          "options": [
            {
              "id": "A",
              "text": "Set logging behavior."
            },
            {
              "id": "B",
              "text": "Play prompt."
            },
            {
              "id": "C",
              "text": "Set working queue."
            },
            {
              "id": "D",
              "text": "Customer Profiles."
            }
          ],
          "correctOptionId": "D",
          "rationale": "The Customer Profiles flow block can be used to access a customer's profile to retrieve, create, or update customer information."
        }
      ]
    },
    {
      "id": "connect-customer-profiles-fundamentals-t3",
      "number": 3,
      "title": "Considerations",
      "shortTitle": "Considerations",
      "summary": "While using Customer Profiles, it’s helpful to be familiar with service quotas to avoid unintentional spending, understand the limits associated…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [
        "In this lesson, you will:",
        "Recognize Customer Profiles security considerations.",
        "Recognize considerations for Customer Profile service quotas."
      ],
      "sections": [
        {
          "id": "connect-customer-profiles-fundamentals-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "While using Customer Profiles, it’s helpful to be familiar with service quotas to avoid unintentional spending, understand the limits associated with Customer Profiles, and request increases to adjustable quotas. It’s also important for organizations to consider security permissions as they develop and implement security policies. In this lesson, you will review these considerations to plan with your organization’s environment in mind."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Service quotas",
          "blocks": [
            {
              "type": "p",
              "text": "Service quotas are the maximum values for the resources and operations in your Amazon Web Services (AWS) account. AWS implements service quotas to provide highly available and reliable service to all customers, and protect you from unintentional spending. Each AWS account has default service quotas for each AWS service. Default service quotas and their values are set by each service. Unless otherwise specified, values for each quota are unique to each Region a service is deployed in. AWS service quotas can be adjusted or increased to meet an organization’s needs, unless otherwise noted."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Security",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect data protection operates under the AWS shared responsibility model. This means that both AWS and organizations play a role in protecting customer data. Within the context of Customer Profiles, data is segregated by the AWS account ID and the domain. (Remember that multiple Amazon Connect instances can share a single Customer Profiles domain.) All data handled by Customer Profiles can potentially be Personal Identifiable Information (PII), so it’s important to ensure your contact center is PII-compliant. For more information, see best practices for PII compliance in Amazon Connect in the Administrator Guide."
            },
            {
              "type": "p",
              "text": "Data handled by Customer Profiles is always encrypted using either a customer-provided AWS KMS key or a service-owned key. The data is encrypted at rest before it is put in, stored in, or saved to a disk. Keys are stored in AWS KMS. The customer-managed key is created, owned, and managed by the administrator, and they have full control over the key (AWS KMS key storage charges apply). To learn more about customer-provided and AWS keys, visit AWS KMS concepts in the AWS KMS Developer Guide. All data exchanged with Amazon Connect is also encrypted in transit between the user’s web browser and Amazon Connect using industry-standard Transport Layer Security (TLS) encryption. Visit the Administrator Guide for up-to-date information on supported versions of TLS."
            },
            {
              "type": "p",
              "text": "Many organizations use prebuilt connectors to integrate data held in source applications with historical data stored in Amazon Connect to create a single unified view of Customer Profiles. These prebuilt connectors are built on the Amazon AppFlow or Amazon EventBridge services. It’s useful to be aware of data protection for each of these services. For more information, see data protection in Amazon AppFlow and data protection in Amazon EventBridge, including data encryption at rest and in transit."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Security profile considerations in Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "As a best practice, ensure that all profile permissions follow the principle of least privilege by only granting users access to resources that are absolutely required for their role. For example, an agent may need to view, edit, or create a profile for a customer as part of their role, but it is not absolutely necessary for them to create new users in the instance. (This would be an administrator responsibility.) In this case, provide the agent the necessary permissions to perform profile creation, but not permissions to create new users in the instance. To learn more about least-privilege permissions, see Apply least-privilege permissions in the AWS Identity and Access Management User Guide."
            },
            {
              "type": "p",
              "text": "By default, the administrator security profile already has permissions to perform all Customer Profiles activities. The agent security profile has permissions to access the Contact Control Panel (CCP) and make outbound calls. These are the basic functions for a user whose primary responsibilities are focused on customer care or sales. If your organization activates the Customer Profiles feature, the agent security profile will need Customer Profiles security permissions added to it. The administrator can configure the feature to permit agents to view, edit, or create new profiles for customers. To learn what actions are associated with viewing, editing, and creating profiles, expand the following categories."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "View Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "The view permission helps agents see Customer Profiles in the agent workspace. Activating viewing permissions permits agents to:"
            },
            {
              "type": "ul",
              "items": [
                "See profiles that are auto-populated in the agent workspace.",
                "Search for profiles.",
                "View details stored in customer profiles such as name or address.",
                "Associate contact records to a customer’s profile."
              ]
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Edit Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "The edit permission helps agents edit details in a customer’s profile. For example, an agent can update a customer’s address. Viewing permissions are automatically activated when the edit permission is activated."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Create Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "The create permission helps agents create and save a new profile. When the create permission is activated, viewing and editing permissions are automatically activated."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Pricing",
          "blocks": [
            {
              "type": "p",
              "text": "Unique Customer Profiles ingested using identity resolution or third-party data are priced per profile per month."
            },
            {
              "type": "p",
              "text": "There is no charge for profiles that only contain data generated by usage of Amazon Connect."
            },
            {
              "type": "p",
              "text": "There is an additional incremental charge per profile per month for profiles that store over 100 objects."
            },
            {
              "type": "p",
              "text": "For more information on the pay as you go pricing model and pricing examples please navigate to the Amazon Connect pricing web page."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you reviewed the service quotas and security for Customer Profiles. Continue to the next lesson to review the course summary and prepare for the end-of-course assessment. Lesson 5 of 8"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-customer-profiles-fundamentals-t3-q1",
          "question": "New agents at AnyCompany should be given permission to view customer data and adjust any customer information that is incorrect. What is the minimum required permission agents need to perform these actions?",
          "options": [
            {
              "id": "A",
              "text": "View"
            },
            {
              "id": "B",
              "text": "Edit"
            },
            {
              "id": "C",
              "text": "Create"
            },
            {
              "id": "D",
              "text": "View, edit, and create"
            }
          ],
          "correctOptionId": "B",
          "rationale": "When Customer Profiles is added to an agent security profile with editing permissions, agents are able to both view and edit. If only viewing permissions are activated, then an agent cannot edit. Remember to use the principle of least privilege. Do not grant agents permission to create profiles if this is not an essential part of their role."
        },
        {
          "id": "connect-customer-profiles-fundamentals-t3-q2",
          "question": "Which statement is true about service quotas?",
          "options": [
            {
              "id": "A",
              "text": "Each quota is instance-specific."
            },
            {
              "id": "B",
              "text": "All quotas can be increased."
            },
            {
              "id": "C",
              "text": "You can request an increase directly from your Amazon Connect instance."
            },
            {
              "id": "D",
              "text": "You can go back down to the default quota after you’ve increased a quota."
            },
            {
              "id": "E",
              "text": "Quotas are Region-specific."
            }
          ],
          "correctOptionId": "E",
          "rationale": "Service quotas are Region-specific. Each service has default quotas associated with it. While most quotas can be increased, some cannot be. For those that can be adjusted, you can request an increase in the Service Quotas console that’s located in your AWS Management Console. All increase requests must be larger than the current quota amount."
        }
      ]
    },
    {
      "id": "connect-customer-profiles-fundamentals-t4",
      "number": 4,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this course, you learned about Amazon Connect Customer Profiles. It’s a feature of Amazon Connect that helps improve agent productivity by…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-customer-profiles-fundamentals-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Course summary",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you learned about Amazon Connect Customer Profiles. It’s a feature of Amazon Connect that helps improve agent productivity by combining customer information from source applications with customer data stored in Amazon Connect. It uses combined customer data to create personalized customer experiences. You explored the benefits of this feature and how to configure it, integrate source applications, and consolidate similar profiles with the Identity Resolution feature. Take a moment to review these key concepts in the course summary before taking the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Benefits"
            },
            {
              "type": "p",
              "text": "Customer Profiles provides four key benefits to organizations."
            },
            {
              "type": "p",
              "text": "Personalized, dynamic experience: Customer Profiles lets organizations create personalized and dynamic customer experiences through IVR and chatbots. The technology behind these experiences is Amazon Connect Flows. Specifically, the Customer Profiles Flow block can be used to get, create, or update a customer’s profile automatically. Organizations can use these tools to personalize automated interactions and contact routing—helping to increase customer trust and satisfaction."
            },
            {
              "type": "p",
              "text": "Unified view for agents: Customer Profiles creates a single, unified view of customer information. This helps agents view all information in one place instead of toggling between applications to gather customer data. It does this by automatically scanning and matching the customer phone number or customer ID against information available in connected applications. It surfaces this collated information directly in Amazon Connect through the agent workspace. The single, unified view lets agents spend more time solving customer problems and reducing wait time for customers."
            },
            {
              "type": "p",
              "text": "Deduplication with Identity Resolution: Since Customer Profiles makes it possible for organizations to bring over customer data from multiple sources, there might be duplicate records for the same contact. To solve this, organizations can activate the Identity Resolution feature of Customer Profiles, which runs an Identity Resolution Job on a weekly basis. Identity Resolution uses ML to automatically match similar profiles and put them into match groups. Organizations can also opt to automatically merge similar profiles. Automatic profile matching produces a confidence score between 0 and 1. The closer the confidence score is to 1 the higher the likelihood that the duplicate profiles are a match. The Identity Resolution Job writes the results of the automatic profile matching process to the specified Amazon S3 bucket. You can create strong match criteria, for example, by selecting multiple attributes such as first, middle, and last name (instead of just the last name)."
            },
            {
              "type": "p",
              "text": "Concepts"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Object type mapping"
            },
            {
              "type": "p",
              "text": "Object type mapping is a way to define how Customer Profiles will ingest a specific type of data from source applications. It also controls how Customer Profiles will read and map the ingested data from source applications into a standard profile object. Object type mapping can be created two different ways: using the Amazon Connect console user interface or the Customer Profiles API. It is important to plan how you want to map data, because you cannot choose a different mapping after completing the integration."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Identity Resolution",
          "blocks": [
            {
              "type": "p",
              "text": "Identity Resolution is a feature of Customer Profiles that uses ML to automatically detect and match similar profiles. The automatic profile matching process puts similar profiles into a group. Consolidation criteria can be used to optionally automatically merge similar profiles into a single, unified profile, which eliminates duplicate profiles. Agents with the appropriate security permissions can associate customers to existing profiles—reducing the number of profiles to sort through and creating a comprehensive, up-to-date view of customer information. Dead-letter queues can be used to view errors and send error messages using Amazon SQS. To view the profile IDs of customer profile potential matches that identity resolution has identified, you can download a file from the designated Amazon S3 bucket."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Domains and error reporting"
            },
            {
              "type": "p",
              "text": "Domain names are selected when the Customer Profiles feature is activated, which can happen when instances are first created or later on. Organizations are required to create an AWS KMS key to encrypt Customer Profiles data. For error-reporting purposes, organizations have the option to use a dead-letter queue to report errors associated with ingesting data from third-party applications, such as Salesforce, Marketo, and Segment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Integrating Amazon Connect Customer Profiles"
            },
            {
              "type": "p",
              "text": "Customer Profiles makes integrating applications easy by using prebuilt connectors powered by Amazon AppFlow and Amazon EventBridge."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Integrating applications with prebuilt connectors",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect provides prebuilt connectors for external data source applications as well as internal sources. Prebuilt connectors provide convenient setup using a step-by-step guided process rather than having to code custom integrations using program languages or APIs."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Integrating applications without prebuilt connectors",
          "blocks": [
            {
              "type": "p",
              "text": "Organizations can build their own custom integrations to programmatically sync customer data with Customer Profiles using the following developer tools."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Connect Customer Profiles Rest API"
            },
            {
              "type": "ul",
              "items": [
                "AWS CLI Command Reference for Customer Profiles",
                "AWS SDK for JavaScript v3",
                "Amazon Connect Streams API"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "The Customer Profiles Flow block"
            },
            {
              "type": "p",
              "text": "Amazon Connect uses Flows to personalize the customer experience from beginning to end. When the Customer Profiles Flow block is added to a Flow, it can retrieve, update, create and associate a customer profile. In order for agents to view a customer’s profile when it’s retrieved, they need to be assigned to a security profile that lets them view customer data. You can also reference the Customer Profile block's Response fields in the subsequent Flow blocks in the Flow to further personalize the customer experience."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Agent Workspace"
            },
            {
              "type": "p",
              "text": "Customer Profiles is accessed through the Agent Workspace—a single, intuitive application that provides agents with the tools to resolve issues efficiently. To take advantage of the benefits that Customer Profiles offers, an administrator needs to activate the feature either during instance creation or later on. They also need to assign Customer Profiles permissions to an agent’s security profile. The view permission lets agents view customer. This information including product purchase history, contact history, and additional information such as cell phone number or shipping address. They may also copy the profile ID, search for profiles, associate contact records, and directly visit the contact’s record page. Administrators can also activate profile editing and creation permissions. Be sure to apply the principle of least privilege as a data security best practice."
            },
            {
              "type": "callout",
              "variant": "warning",
              "title": "Considerations",
              "body": [
                "There are a few considerations you should be aware of when using Customer Profiles:",
                "Service quotas: AWS implements service quotas to provide highly available and reliable service to all customers, and protect you from unintentional spend. Unless otherwise specified, values for each quota are unique to each Region a service is deployed in. Customer Profiles has several default service quotas that set maximum values and expiration (in days) for certain quotas. Domain count, keys per object type, and expiration of objects and profiles are some examples. For more information about service quotas for Customer Profiles, see Amazon Connect Service quotas in the Administrator Guide, or your Amazon Connect instance in the AWS Management Console.",
                "Security: Customer Profiles security permissions need to be assigned to an agent’s security profile in order for them to either view, edit, or create Customer Profiles. If you are using Customer Profiles, it is possible that customer data could be PII. It is required for data to be encrypted in Customer Profiles (using an AWS KMS key) or a service-owned key. When syncing data periodically with an Amazon Connect service, data is encrypted using a customer-managed key and stored temporarily for one month.",
                "Pricing: Amazon Connect is a pay-as-you-go omnichannel cloud contact center, which means you only pay for what you use. Customer Profiles is free to use if your organization is only using Amazon Connect data. There are costs associated with using Customer Profiles if your organization uses it with Identity Resolution activated or third-party data. Additionally, there is an incremental charge for profiles that store over 100 objects."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-customer-profiles-fundamentals-t5",
      "number": 5,
      "title": "Course summary",
      "shortTitle": "Course summary",
      "summary": "In this course, you learned about Amazon Connect Customer Profiles. It’s a feature of Amazon Connect that helps improve agent productivity by…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-customer-profiles-fundamentals-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you learned about Amazon Connect Customer Profiles. It’s a feature of Amazon Connect that helps improve agent productivity by combining customer information from source applications with customer data stored in Amazon Connect. It leverages combined customer data to create personalized customer experiences. You explored the benefits of this feature, and how to configure it, integrate source applications, and how to consolidate similar profiles with the Identity Resolution feature. Take a moment to review these key concepts in the course summary before taking the course assessment."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles provides three key benefits to organizations."
            },
            {
              "type": "p",
              "text": "Personalized, dynamic experience: Customer Profiles lets organizations create personalized and dynamic customer experiences through IVR and chatbots. The technology behind these experiences is Amazon Connect Flows. Specifically, the Customer Profiles Flow block can be used to get, create, or update a customer’s profile automatically. Organizations can use these tools to personalize automated interactions and contact routing—helping to increase customer trust and satisfaction."
            },
            {
              "type": "p",
              "text": "Unified view for agents: Customer Profiles creates a single, unified view of customer information. This helps agents view all information in one place instead of toggling between applications to gather customer data. It does this by automatically scanning and matching the customer phone number or customer ID against information available in connected applications. It surfaces this collated information directly in Amazon Connect through the agent workspace. The single, unified view lets agents spend more time solving customer problems and reducing wait time for customers."
            },
            {
              "type": "p",
              "text": "Deduplication with Identity Resolution: Since Customer Profiles makes it possible for organizations to bring over customer data from multiple sources, there might be duplicate records for the same contact. To solve this, organizations can activate the Identity Resolution feature of Customer Profiles, which runs an Identity Resolution Job on a weekly basis. Identity Resolution uses ML to automatically match similar profiles and put them into match groups. Organizations can also opt to automatically merge similar profiles."
            },
            {
              "type": "p",
              "text": "Automatic profile matching produces a confidence score between 0 and 1. The closer the confidence score is to 1 the higher the likelihood that the duplicate profiles are a match. The Identity Resolution Job writes the"
            },
            {
              "type": "p",
              "text": "results of the automatic profile matching process to the specified Amazon S3 bucket. You can create strong match criteria, for example, by selecting multiple attributes such as first, middle, and last name (instead of just the last name)."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Concepts",
          "blocks": [
            {
              "type": "p",
              "text": "Object type mapping: is a way to define how Customer Profiles will ingest a specific type of data from source applications. It also controls how Customer Profiles will read and map the ingested data from source applications into a standard profile object. Object type mapping can be created two different ways: using the Amazon Connect console user interface or the Customer Profiles API. It is important to plan how you want to map data, because you cannot choose a different mapping after completing the integration."
            },
            {
              "type": "p",
              "text": "Identity Resolution: is a feature of Customer Profiles that uses ML to automatically detect and match similar profiles. The automatic profile matching process puts similar profiles into a group. Consolidation criteria can be used to optionally automatically merge similar profiles into a single, unified profile, which eliminates duplicate profiles. Agents with the appropriate security permissions can associate customers to existing profiles—reducing the number of profiles to sort through and creating a comprehensive, up-to-date view of customer information. Dead-letter queues can be used to view errors and send error messages using Amazon SQS. To view the profile IDs of customer profile potential matches that identity resolution has identified, you can download a file from the designated Amazon S3 bucket."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Domains and error reporting",
          "blocks": [
            {
              "type": "p",
              "text": "Domain names are selected when the Customer Profiles feature is activated, which can happen when instances are first created or later on. Organizations are required to create an AWS KMS key to encrypt Customer Profiles data. For error- reporting purposes, organizations have the option to use a dead-letter queue to report errors associated with ingesting data from third-party applications, such as Salesforce, Marketo, and Segment."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Integrating Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles makes integrating applications easy by using pre-built connectors powered by Amazon AppFlow and Amazon EventBridge."
            },
            {
              "type": "p",
              "text": "Integrating applications with prebuilt connectors: Amazon Connect provides prebuilt connectors for external data source applications as well as internal sources. Prebuilt connectors provide convenient setup using a step-by-step guided process rather than having to code custom integrations using program languages or APIs."
            },
            {
              "type": "p",
              "text": "Integrating applications without prebuilt connectors: Organizations can build their own custom integrations to programmatically sync customer data with Customer Profiles using the following developer tools:"
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s6",
          "eyebrow": null,
          "duration": null,
          "title": "The Customer Profiles Flow block",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect uses Flows to personalize the customer experience from beginning to end. When the Customer Profiles Flow block is added to a Flow, it can retrieve, update, create and associate a customer profile. In order for agents to view a customer’s profile when it’s retrieved, they need to be assigned to a security profile that lets them view customer data. You can also reference the Customer Profile block's Response fields in the subsequent Flow blocks in the Flow to further personalize the customer experience."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Agent workspace",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles is accessed through the agent workspace—a single, intuitive application that provides agents with the tools to resolve issues efficiently. To take advantage of the benefits that Customer Profiles offers, an administrator needs to activate the feature either during instance creation or later on. They also need to assign Customer Profiles permissions to an agent’s security profile."
            },
            {
              "type": "p",
              "text": "The view permission lets agents view customer information including product purchase history, contact history, and additional information such as cell phone number or shipping address. They may also copy the profile ID, search for profiles, associate contact records, and directly visit the contact’s record page."
            },
            {
              "type": "p",
              "text": "Administrators can also activate profile editing and creation permissions. Be sure to apply the principle of least privilege as a data security best practice."
            }
          ]
        },
        {
          "id": "connect-customer-profiles-fundamentals-t5-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Considerations",
          "blocks": [
            {
              "type": "p",
              "text": "There are a few considerations you should be aware of when using Customer Profiles:"
            },
            {
              "type": "p",
              "text": "Service quotas: AWS implements service quotas to provide highly available and reliable service to all customers, and protect you from unintentional spend. Unless otherwise specified, values for each quota are unique to each Region a service is deployed in. Customer Profiles has several default service quotas that set maximum values and expiration (in days) for certain quotas. Domain count, keys per object type, and expiration of objects and profiles are some examples."
            },
            {
              "type": "p",
              "text": "Visit the Service quotas section of the Administrator Guide or your Amazon Connect instance in the AWS Management Console for more details on service quotas for Customer Profiles."
            },
            {
              "type": "p",
              "text": "Security: Customer Profiles security permissions need to be assigned to an agent’s security profile in order for them to either view, edit, or create Customer Profiles. Note that if you are using Customer Profiles, it is possible that customer data could be Personal Identifiable Information (PII). It is required for data to be encrypted in Customer Profiles (using an AWS KMS key) or a service-owned key. When syncing data periodically with an Amazon Connect service, data is encrypted using a customer managed key and stored temporarily for one month."
            },
            {
              "type": "p",
              "text": "Pricing: Unique Customer Profiles ingested using identity resolution or third-party data are priced per profile per month. There is no charge for profiles that only contain data generated by usage of Amazon Connect. There is an additional incremental charge per profile per month for profiles that store over 100 objects. For more information on the pay as you go pricing model and pricing examples, please navigate to the Amazon Connect pricing web page."
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
