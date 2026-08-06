/*
 * Amazon Connect — Custom CCP Intermediate
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT CUSTOM CCP INTERMEDIATE.txt
 *            conne-text/Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.txt  (from conne/Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.pdf)
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-custom-ccp-intermediate",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Custom CCP Intermediate",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "Agent experience",
  "description": "Streams architecture and the Core, Agent, and Contact APIs, plus Customer Profiles, Amazon Q in Connect, and step-by-step guides in a custom CCP.",
  "examFormat": "9 topics · ~54 min · 7 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT CUSTOM CCP INTERMEDIATE.txt",
    "conne-text/Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.txt  (from conne/Amazon Connect Custom Contact Control Panel Intermediate Intermediate Summary.pdf)"
  ],
  "modules": [
    {
      "id": "connect-custom-ccp-intermediate-t1",
      "number": 1,
      "title": "Amazon Connect Streams Architecture",
      "shortTitle": "Amazon Connect Streams Architecture",
      "summary": "Amazon Connect empowers organizations to create personalized experiences in their contact center. Organizations can capture contact information,…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [
        "Explore Streams architecture layers and their roles."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect empowers organizations to create personalized experiences in their contact center. Organizations can capture contact information, such as name, phone number, email address, or the reason for the contact. Interaction information, such as the channel, start time, and duration, is automatically collected and associated with the contact."
            },
            {
              "type": "p",
              "text": "Displaying contact information to agents reduces the time spent to solve the contact inquiry. Contact data is either displayed in the Contact Control Panel (CCP) or passed through integration to the organization's customer relationship management (CRM) system. In Amazon Connect, contact data is stored as key-value pairs called contact attributes. Some examples of contact attributes are customer name, authentication status, or chatbot intent."
            },
            {
              "type": "p",
              "text": "Amazon Connect Streams is a JavaScript library that developers use to build custom agent experiences within web applications. The library provides access to features such as real-time voice call and chat events and actions, agent assist, and case management functionality."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Streams architecture layers",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Streams provides a multi-layered approach to application integrations, so developers can build integrations that meet diverse functional and business requirements."
            },
            {
              "type": "p",
              "text": "The core component that handles Streams requests is the Amazon Connect Computer Telephony Integration (CTI) service. This service performs required actions and raises events through multiple API layers. Requests and events examples include agents answering or completing a call, supervisors changing agent states, or agents logging out of CCP."
            },
            {
              "type": "p",
              "text": "Amazon Connect Streams architecture diagram showing Amazon Connect CTI service and three browser-side integration layers."
            },
            {
              "type": "p",
              "text": "Amazon Connect designed the Streams architecture on three browser-side integration layers:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Connect SharedWorker layer"
            },
            {
              "type": "p",
              "text": "CCP layer"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Application integration layer"
            },
            {
              "type": "p",
              "text": "Events and action requests flow between the external customized agent applications and Amazon Connect service through this three-layer communication conduit."
            },
            {
              "type": "p",
              "text": "Developers have access to Amazon Connect functionality through the application integration layer."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Application integration layer",
          "blocks": [
            {
              "type": "p",
              "text": "In the application layer, developers have access to the methods and events that integrate the Amazon Connect functionality within external web applications. CRM systems are the most common applications using integration code that extends existing functionality to include telephony events."
            },
            {
              "type": "p",
              "text": "To learn more, choose each of the five numbered markers."
            },
            {
              "type": "p",
              "text": "Process flow diagram of the application integration layer from CCP, migrating through layers with details in numbered markers."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "CCP layer",
          "blocks": [
            {
              "type": "p",
              "text": "CCP is the built-in interface that Amazon Connect agents use to handle contacts and interactions. The CCP layer has two primary functions:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Authenticates the agents logged into the system"
            },
            {
              "type": "p",
              "text": "Acts as a middle layer between the external application and the Amazon Connect platform"
            },
            {
              "type": "p",
              "text": "When an agent uses a CCP function, such as answering a call, the CCP sends a request to the Connect SharedWorker."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Connect SharedWorker layer",
          "blocks": [
            {
              "type": "p",
              "text": "SharedWorkers are special web workers accessed by multiple browser contexts like browser tabs, windows, or iframes. The Connect SharedWorker layer is the component that helps synchronize data across different parts of the service. This layer is an HTML5 SharedWorker whose primary functions are long polling agent states, incremental polling agent configuration data, and handling API requests."
            },
            {
              "type": "p",
              "text": "When an agent answers an incoming call using the CCP, the Connect SharedWorker gets the CCP request to answer the call. The SharedWorker makes an Asynchronous JavaScript and XML (AJAX) request to the Amazon Connect Computer Telephony Integration (Amazon Connect CTI) service. Following this request, the CTI service connects the two call parties: the agent and the contact. The Connect SharedWorker then updates the application pages to display the agent's connected status."
            },
            {
              "type": "p",
              "text": "For more details on the architecture of the three browser-side integration layers, navigate to the Architecture section of the Amazon Connect Streams GitHub documentation."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you explored the high-level Amazon Connect Streams API architecture and the benefits of using Streams for CRM integrations. In the next lesson, you will explore how to use the AWS SDK and Streams. Lesson 3 of 12 Lesson 2 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t1-q1",
          "question": "Efua Owusu, an agent at AnyCompany Travel, uses a Contact Control Panel (CCP) integrated with the customer relationship management (CRM) system. Which integration layer component sends requests to the Amazon Connect Computer Telephony Integration (Amazon Connect CTI) service when Efua answers a call?",
          "options": [
            {
              "id": "A",
              "text": "The application integration layer"
            },
            {
              "id": "B",
              "text": "The Contact Control Panel (CCP)"
            },
            {
              "id": "C",
              "text": "The Connect SharedWorker"
            },
            {
              "id": "D",
              "text": "The Amazon Connect Streams API"
            }
          ],
          "correctOptionId": "C",
          "rationale": "When an agent performs an action in the CCP, such as answering a call, the CCP sends a request to the Connect SharedWorker. The Connect SharedWorker makes Asynchronous JavaScript and XML (AJAX) requests to the Amazon Connect Computer Telephony Integration (Amazon Connect CTI) service."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t2",
      "number": 2,
      "title": "Core API",
      "shortTitle": "Core API",
      "summary": "Amazon Connect Streams provides a range of action and event subscription methods to help build custom functionality. The functionality is grouped…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [
        "Explore Streams Core API events and methods."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Streams provides a range of action and event subscription methods to help build custom functionality. The functionality is grouped in Core APIs, Agent APIs, Contact APIs and Connection APIs. In this lesson, you will look further into the Core APIs. At the end of the lesson, you will have access to download sample code showcasing the functionality covered in this lesson."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Getting started with Streams APIs",
          "blocks": [
            {
              "type": "p",
              "text": "Streams has a pre-built version of the AWS SDK included in the ./src/aws-client.js file. The SDK is a set of libraries that facilitate the interaction with the services of Amazon Web Services (AWS), such as Amazon Connect, through code."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Importing libraries",
          "blocks": [
            {
              "type": "p",
              "text": "When developing custom agent applications with Streams, import the Streams library before the SDK. This prevents version conflicts and verifies the global AWS object is bound to the intended SDK version. It avoids compatibility issues and simplifies dependency management."
            },
            {
              "type": "p",
              "text": "For instructions on how to download Amazon Connect Streams, navigate to Downloading Streams from Github in the Amazon Connect Streams Documentation. After downloading and installing Streams, you can start interacting with its APIs and events subscription within your application code."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Prerequisites",
              "body": [
                "For security purposes, all application domains that use Streams integration must be added to the Amazon Connect instance. Make sure you provide the application domain URLs to the contact center cloud administrator. By adding them to the Approved domains configuration in the instance, the applications will get the right permissions to access Amazon Connect functionality.",
                "The first step to using the Streams API is to allow-list the pages you wish to embed. Each domain entry identifies the protocol scheme, host, and port. Any pages hosted behind the same protocol scheme, host, and port will be accepted to embed the CCP components required to use the Streams library.",
                "Typically, it is the responsibility of cloud administrators to perform this configuration. For detailed instructions on how to allow-list your pages, navigate to Use an Allowlist for Integrated Applications in the Amazon Connect Administrator Guide."
              ]
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Core API",
          "blocks": [
            {
              "type": "p",
              "text": "The Core API includes a set of action methods and event subscriptions that help you customize Streams integration within your web application."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario",
          "blocks": [
            {
              "type": "p",
              "text": "Mary Major is a senior software developer at AnyCompany. AnyCompany uses Amazon Connect for their contact center. Mary's task is to build an integration of the Amazon Connect CCP in one of the applications used by the agents."
            },
            {
              "type": "p",
              "text": "The new application must include video calls so agents can have more personal interactions with customers. Additionally, the application must include settings to offer agents audio and video configuration options directly from the softphone interface. The main functional requirement is to display contact information when agents switch between multiple chat conversations. Because some agents work from home, they need an option to select their preferred phone type. The phone type options are softphone or desk phone to receive calls on their mobile devices. Mary will use the following five steps to perform the custom CCP development process."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating the base files",
          "blocks": [
            {
              "type": "p",
              "text": "Mary begins to write a JavaScript code for the custom CCP application. She creates two files: index.html and index.js. In the index.html file, she defines a container for CCP."
            },
            {
              "type": "code",
              "text": "<div> element with id=\"container-div\"."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Initializing the CCP",
          "blocks": [
            {
              "type": "p",
              "text": "Next, Mary follows the Downloading Streams from Github instructions and embeds StreamsJS library in her code. She adds a script tag pointing to a file called index.js, which contains the JS code. The index.js includes the CCP initialization code using connect.core.initCCP(). To meet the requirements, Mary provides the following parameters to initCCP() action method:"
            },
            {
              "type": "p",
              "text": "ccpUrl: This is the URL of the CCP. To access the CCP, the page agents use https://the-instance-name.my.connect.aws/connect/ccp-v2. Mary finds the instance name by reviewing the Amazon Connect Administrator Guide. For more information, navigate to Find Your Amazon Connect Instance Name in the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "loginPopup: This parameter is optional and defaults to true. Mary does not change the default value to pop up the login page for agents to sign in."
            },
            {
              "type": "p",
              "text": "loginPopupAutoClose: This parameter is optional and defaults to false. Mary sets this to true in conjunction with the loginPopup parameter to automatically close the login popup window when the authentication step has completed."
            },
            {
              "type": "code",
              "text": "<!-- Create div container for the CCP -->\n\n<div id=\"container-div\" style=\"float:left; width: 400px; height: 800px;\"></div>"
            },
            {
              "type": "p",
              "text": "The file also contains the reference to the libraries she needs to include for this code to work."
            },
            {
              "type": "code",
              "text": "<!-- Embed StreamsJS and include index.js -->\n\n<script type=\"text/javascript\" src=\"./connect-streams-min.js\"></script>\n\n<script type=\"module\" src=\"./index.js\"></script>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Subscribing to an onload event",
          "blocks": [
            {
              "type": "p",
              "text": "To confirm CCP functionality is initialized when the page loads, Mary writes code to subscribe to the onload event. This event is published when the window loads. The following sample code shows how to initialize the CCP functionality."
            },
            {
              "type": "code",
              "text": "// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\n// Connect information: Replace with your Connect Instance\n\nconst ccpUrl = \"https://my-instance-name.my.connect.aws/connect/ccp-v2\";\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.core.initCCP("
            },
            {
              "type": "p",
              "text": "document.getElementById(\"container-div\"), {"
            },
            {
              "type": "p",
              "text": "ccpUrl: ccpUrl, // REQUIRED"
            },
            {
              "type": "p",
              "text": "loginPopup: true, // optional, defaults to `true`"
            },
            {
              "type": "p",
              "text": "loginPopupAutoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "loginOptions: { // optional, if provided opens login in new window"
            },
            {
              "type": "p",
              "text": "autoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "height: 600, // optional, defaults to 578"
            },
            {
              "type": "p",
              "text": "width: 400, // optional, defaults to 433"
            },
            {
              "type": "p",
              "text": "top: 0, // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "left: 0 // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"CCP initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Configuring the softphone object",
          "blocks": [
            {
              "type": "p",
              "text": "This softphone object specifies the following softphone settings for the CCP."
            },
            {
              "type": "p",
              "text": "allowFramedSoftphone: Mary sets the allowFramedSoftphone to true. This way, the CCP widget is hosted in her application."
            },
            {
              "type": "p",
              "text": "allowFramedVideoCall: Mary sets this to true. As a result, the CCP widget can handle video calling. Mary knows that not all agents use video, but she does not need to worry about this setting. Agent permissions are controlled with the configuration of their security profiles."
            },
            {
              "type": "code",
              "text": "softphone: {\n\nallowFramedSoftphone: true, //optional, defaults to 'false'\n\nallowFramedVideoCall: true //optional, defaults to 'false'\n\n},"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t2-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Configuring page options",
          "blocks": [
            {
              "type": "p",
              "text": "The pageOptions object is optional. Mary uses this configuration option to specify which sections the CCP displays in the settings tab."
            },
            {
              "type": "p",
              "text": "enableAudioDeviceSettings: Mary sets this to true to provide agents with the option to configure audio input and output devices for their local machine."
            },
            {
              "type": "p",
              "text": "enableVideoDeviceSettings: Mary sets this to true, and the settings tab will display a section for configuring video input devices for the agent's local machine."
            },
            {
              "type": "p",
              "text": "enablePhoneTypeSettings: Mary keeps the default value to true. As a result, the settings tab will display a section for configuring the agent's phone type and desk phone number."
            },
            {
              "type": "code",
              "text": "pageOptions: {\n\nenableAudioDeviceSettings: true, //optional, defaults to 'false'\n\nenableVideoDeviceSettings: true, //optional, defaults to 'false'\n\nenablePhoneTypeSettings: true //optional, defaults to 'true'\n\n}"
            },
            {
              "type": "p",
              "text": "Throughout the day, Mary designs and implements the new CCP. She integrates the pre-built CCP to confirm that API requests are funneled through it and that agent and contact updates are published seamlessly."
            },
            {
              "type": "p",
              "text": "The new CCP is shaping up nicely, and Mary can't wait to see it in action. With the added functionality and user-friendly interface, AnyCompany's agents are equipped to provide exceptional customer service. As a result, they can strengthen the company's reputation in the market."
            },
            {
              "type": "p",
              "text": "The following attachment contains sample files that showcase Mary's work. To download the file attachment, choose anywhere inside the following box."
            },
            {
              "type": "ul",
              "items": [
                "core-api-index.zip",
                "1.4 KB",
                "Check your knowledge"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you discovered the Amazon Connect Streams Core APIs. In the next lesson, you will explore the Agent APIs that provide you with the ability to manage agent states. Lesson 4 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t2-q1",
          "question": "A developer built a custom Contact Control Panel (CCP) that integrates with the company's customer relationship management (CRM) system. After initializing the CCP, the developer noticed the login page does not automatically open. Which parameter should the developer check in initCCP?",
          "options": [
            {
              "id": "A",
              "text": "ccpUrl"
            },
            {
              "id": "B",
              "text": "loginOptions"
            },
            {
              "id": "C",
              "text": "loginPopupAutoClose"
            },
            {
              "id": "D",
              "text": "loginPopup"
            }
          ],
          "correctOptionId": "D",
          "rationale": "When the loginPopup initialization parameter value is true, during the initialization of CCP, a login window popups up to collect authentication credentials. If this value is set to false the login popup does not automatically open. This should be the value the developer checks to troubleshot the issue."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t3",
      "number": 3,
      "title": "Agent API",
      "shortTitle": "Agent API",
      "summary": "Amazon Connect Streams provides a range of action and events subscription methods to help build custom functionality. Agent APIs provide…",
      "duration": "~8 min",
      "lede": null,
      "objectives": [
        "Explore Streams Agent API methods and events."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Streams provides a range of action and events subscription methods to help build custom functionality. Agent APIs provide developers with the flexibility to customize the control of agent states. At the end of the lesson, you will have access to download sample code showcasing the functionality covered in this lesson."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Agent API",
          "blocks": [
            {
              "type": "p",
              "text": "The Agent API offers event subscription and action methods that help control agent-specific states and actions."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario",
          "blocks": [
            {
              "type": "p",
              "text": "John Stiles is a member of Mary’s team. He is also a software developer working for AnyCompany. AnyCompany has been using Amazon Connect and wants to enhance the agent experience by tailoring the CCP to their specific needs. John's task is to create a user-friendly interface for a different group of agents. This group uses an application that does not have space to display the full CCP widget. The agents need a small toolbar where they can signal when they are ready for work, to go on break, or logout."
            },
            {
              "type": "p",
              "text": "John is not familiar with Amazon Connect Streams APIs, but Mary is happy to share her code so John can progress faster in his task."
            },
            {
              "type": "p",
              "text": "John looks at the code from the index.html file. First, he will hide the default CCP container style=\"display:none;\" and create a new <div> container id=\"customCCPDiv\" for his custom CCP. He plans to include buttons for setting agent states, answering calls, and disconnecting contacts. John will use the following nine steps to perform the custom CCP development process."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating a custom CCP container",
          "blocks": [
            {
              "type": "p",
              "text": "To hide the standard pre-built CCP widget, John uses the following code in his HTML file."
            },
            {
              "type": "code",
              "text": "<div id=\"container-div\" style=\"display: none;\">\n\n<!--Amazon CCP is hiding in here-->\n\n</div>"
            },
            {
              "type": "p",
              "text": "Additionally, John creates a different container as a placeholder for the future custom user experience he might need to build further."
            },
            {
              "type": "code",
              "text": "<div id=\"customCCPDiv\" style=\"width: 320px; min-width: 200px; height: 465px; min-height: 400px; border-style: outset; border-color: gray; border-width: thin;\">\n\n<!-- custom user experience goes here -->\n\n</div>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Initializing the CCP and subscribing to an onload event",
          "blocks": [
            {
              "type": "p",
              "text": "John modifies the code in index.js file to initialize the CCP and pass the \"customCCPDiv\" container id. To confirm CCP initialization when the page loads, John writes code to subscribe to the onload event."
            },
            {
              "type": "code",
              "text": "// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\n// Connect information: Replace with your Connect Instance\n\nconst ccpUrl = \"https://my-instance-name.my.connect.aws/connect/ccp-v2\";\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.core.initCCP("
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customCCPDiv\"), {"
            },
            {
              "type": "p",
              "text": "ccpUrl: ccpUrl, // REQUIRED"
            },
            {
              "type": "p",
              "text": "loginPopup: true, // optional, defaults to `true`"
            },
            {
              "type": "p",
              "text": "loginPopupAutoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "loginOptions: { // optional, if provided opens login in new window"
            },
            {
              "type": "p",
              "text": "autoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "height: 600, // optional, defaults to 578"
            },
            {
              "type": "p",
              "text": "width: 400, // optional, defaults to 433"
            },
            {
              "type": "p",
              "text": "top: 0, // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "left: 0 // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"CCP initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Subscribing to agent events",
          "blocks": [
            {
              "type": "p",
              "text": "Next, John focuses on the index.js file, where he needs to implement event listeners for the visual components he's creating. He knows that the code needs to handle agent events, such as data refresh, agent state changes, and both routable and non-routable state events."
            },
            {
              "type": "p",
              "text": "John creates code that subscribes to the following Agent events:"
            },
            {
              "type": "code",
              "text": "// Subscribe to Agent events\n\nconnect.agent(function(agent) {\n\nagent.onRefresh(handleAgentRefresh);\n\nagent.onStateChange(handleAgentStateChange);\n\nagent.onRoutable(handleRoutable);\n\nagent.onNotRoutable(handleNotRoutable);\n\nagent.onOffline(handleAgentOffline);\n\nagent.onSoftphoneError(handleSoftphoneError);\n\nagent.onWebSocketConnectionLost(handleWebSocketConnectionLost);\n\nagent.onWebSocketConnectionGained(handleWebSocketConnectionGained);\n\nagent.onAfterCallWork(handleAfterCallWork);\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Creating an onRefresh handler for troubleshooting",
          "blocks": [
            {
              "type": "p",
              "text": "John wants to write functions for logging softphone and websocket connection errors. This code will help him troubleshoot in case the agents encounter issues."
            },
            {
              "type": "p",
              "text": "John subscribes to the onRefresh event."
            },
            {
              "type": "p",
              "text": "The agent.onRefresh() event is raised whenever new agent data is available, such as agent state and configuration changes. To handle this event, John creates the handleAgentRefresh() function."
            },
            {
              "type": "code",
              "text": "agent.onRefresh(handleAgentRefresh);\n\nfunction handleAgentRefresh(agent) {\n\nconsole.debug(\"CDEBUG >> handleAgentRefresh()\");"
            },
            {
              "type": "p",
              "text": "logInfoEvent(\"[agent.onRefresh] Agent data refreshed. Agent status is \" +"
            },
            {
              "type": "p",
              "text": "agent.getStatus().name);"
            },
            {
              "type": "p",
              "text": "}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Intercepting agent state changes",
          "blocks": [
            {
              "type": "p",
              "text": "The agent.onStateChange() event is invoked when the agent's state changes. The agentStateChange object contains the following properties:"
            },
            {
              "type": "ul",
              "items": [
                "agent: Contains the Agent API object",
                "oldState: Stores the name of the agent's previous state",
                "newState: Stores the name of the agent's new state",
                "John creates a handleAgentStateChange function to handle this event."
              ]
            },
            {
              "type": "code",
              "text": "agent.onStateChange(handleAgentStateChange);\n\nfunction handleAgentStateChange(agent) {\n\nconsole.debug(\"CDEBUG >> handleAgentStateChange()\");\n\nlogInfoEvent(\"[agent.onStateChange] Agent state changed. New Agent status is \" + agent.newState + \". Old Agent status is \" + agent.oldState);\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Step 6: Intercepting the agent status events",
          "blocks": [
            {
              "type": "p",
              "text": "The agent.onRoutable() event is invoked when the agent becomes available to handle contacts. By becoming available, agents can receive incoming contacts."
            },
            {
              "type": "p",
              "text": "John creates a function called handleRoutable() to handle this event."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s10",
          "eyebrow": null,
          "duration": null,
          "title": "\"'",
          "blocks": [
            {
              "type": "code",
              "text": "agent.onRoutable(handleRoutable);\n\nfunction handleRoutable(agent) {\n\nconsole.debug(\"CDEBUG >> handleRoutable()\");\n\nlogInfoEvent(\"[agent.onRoutable] Agent is routable. Agent status is \" + agent.getStatus().name);\n\ndisplayAgentStatus(agent.getStatus().name);\n\n}"
            },
            {
              "type": "p",
              "text": "The agent.onNotRoutable() event is raised when the agent changes state to any of the custom states configured in the system, such as Lunch or Break. A not routable state signifies that agents are online, but should not be routed incoming contacts."
            },
            {
              "type": "p",
              "text": "John creates the handleNotRoutable() function to handle this event."
            },
            {
              "type": "code",
              "text": "agent.onNotRoutable(handleNotRoutable);\n\nfunction handleNotRoutable(agent) {\n\nconsole.debug(\"CDEBUG >> handleNotRoutable()\");\n\nlogInfoEvent(\"[agent.onNotRoutable] Agent is online, but not routable. Agent status is \" + agent.getStatus().name);\n\ndisplayAgentStatus(agent.getStatus().name);\n\n}"
            },
            {
              "type": "p",
              "text": "The agent.onOffline() event is invoked when the agent goes offline. To handle this event, John creates the handleAgentOffline() function."
            },
            {
              "type": "code",
              "text": "agent.onOffline(handleAgentOffline);\n\nfunction handleAgentOffline(agent) {\n\nconsole.debug(\"CDEBUG >> handleAgentOffline()\");\n\nlogInfoEvent(\"[agent.onOffline] Agent is offline. Agent status is \" + agent.getStatus().name);\n\ndisplayAgentStatus(agent.getStatus().name);\n\n}"
            },
            {
              "type": "p",
              "text": "The agent.onSoftphoneError() event is invoked when the the system detects an error state specific to softphone functionality. For this event, John creates a handler function caller handleSoftphoneError()."
            },
            {
              "type": "code",
              "text": "agent.onSoftphoneError(handleSoftphoneError);\n\nfunction handleSoftphoneError(agent) {\n\nconsole.debug(\"CDEBUG >> handleSoftphoneError()\");\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Step 7: Intercepting errors",
          "blocks": [
            {
              "type": "p",
              "text": "John wants to write functions for logging softphone and web socket connection errors. This code will help him troubleshoot the errors in case the agents encounter issues."
            },
            {
              "type": "p",
              "text": "agent.onWebSocketConnectionLost() is an event raised when the system detects web socket connection errors. The handler for this event is a function called handleWebSocketConnectionLost()."
            },
            {
              "type": "code",
              "text": "agent.onWebSocketConnectionLost(handleWebSocketConnectionLost);\n\nfunction handleWebSocketConnectionLost(agent) {\n\nconsole.debug(\"CDEBUG >> handleWebSocketConnectionLost()\");\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Step 8: Creating event listeners for the agent status buttons",
          "blocks": [
            {
              "type": "p",
              "text": "John starts writing code functions to set the agent state based on the selected button."
            },
            {
              "type": "code",
              "text": "// Event listeners for the 3 \"buttons\" of the Webpage\n\ndocument.getElementById ('goAvailableDiv').addEventListener(\"click\", goAvailable, false);\n\ndocument.getElementById ('goBreakDiv').addEventListener(\"click\", goBreak, false);\n\ndocument.getElementById ('goOfflineDiv').addEventListener(\"click\", goOffline, false);"
            },
            {
              "type": "p",
              "text": "The agent.getAgentStates() method returns the list of available agent states. The states are returned as a list of AgentState API objects."
            },
            {
              "type": "ul",
              "items": [
                "agentStateARN",
                "This is the agent state Amazon Resource Name (ARN)."
              ]
            },
            {
              "type": "ul",
              "items": [
                "type",
                "The agent state type represented as a AgentStateType enum type value. The available types are as follows:"
              ]
            },
            {
              "type": "ul",
              "items": [
                "AgentStateType.INIT: The agent state hasn't been initialized yet.",
                "AgentStateType.ROUTABLE: The agent is in a state where they can be routed contacts.",
                "AgentStateType.NOT_ROUTABLE: The agent is in a state where they cannot be routed contacts.",
                "AgentStateType.OFFLINE: The agent is offline."
              ]
            },
            {
              "type": "ul",
              "items": [
                "name",
                "This is the name of the agent state to be displayed in the user interface (UI)."
              ]
            },
            {
              "type": "p",
              "text": "The agent.setState() method sets the agent's current availability state."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Step 9: Creating the agent status actions",
          "blocks": [
            {
              "type": "p",
              "text": "In this step, John creates the functions that change the agent status to Available, Break, and Offline."
            },
            {
              "type": "code",
              "text": "// Set the agent Available\n\nfunction goAvailable() {\n\nvar routableState = agent.getAgentStates().filter(function (state) {\n\nreturn state.type === connect.AgentStateType.ROUTABLE;\n\n})[0];\n\nagent.setState(routableState, {\n\nsuccess: function () {\n\nlogInfoMsg(\"Set agent status to Available (routable) via Streams\")\n\n},\n\nfailure: function () {\n\nlogInfoMsg(\"Failed to set agent status to Available (routable) via Streams\")\n\n}\n\n});\n\n}\n\n// Set the agent Break\n\nfunction goBreak() {\n\nvar notroutableState =agent.getAgentStates().filter(function (state) {\n\nreturn state.type === connect.AgentStateType.NOT_ROUTABLE;\n\n})[1];\n\nagent.setState(notroutableState, {\n\nsuccess: function () {\n\nlogInfoMsg(\"Set agent status to Break (not routable) via Streams\")\n\n},\n\nfailure: function () {\n\nlogInfoMsg(\"Failed to set agent status to Break (not routable) via Streams\")\n\n}\n\n});\n\n}\n\n// Set the agent Offline\n\nfunction goOffline() {\n\nvar offlineState = agent.getAgentStates().filter(function (state) {\n\nreturn state.type === connect.AgentStateType.OFFLINE;\n\n})[0];\n\nagent.setState(offlineState, {\n\nsuccess: function () {\n\nlogInfoMsg(\"Set agent status to Offline via Streams\")\n\n},\n\nfailure: function () {\n\nlogInfoMsg(\"Failed to set agent status to Offline via Streams\")\n\n}\n\n});\n\n}"
            },
            {
              "type": "p",
              "text": "John is ready to start testing his code in a test page. After he confirms the code works, he will embed it in the agent application’s webpage and design the look and feel of the new agent status buttons."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t3-s14",
          "eyebrow": null,
          "duration": null,
          "title": "Agent status - Available (Routable)",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Agent status - Break (NotRoutable)"
            },
            {
              "type": "p",
              "text": "The test HTML page John created shows that as the page loads, the initial state of the agent is Offline. The logs show the current agent Offline status and confirm the code subscribes for agent events."
            },
            {
              "type": "p",
              "text": "To download the sample files attachment, choose anywhere inside the following box."
            },
            {
              "type": "ul",
              "items": [
                "agent-api-index.zip",
                "2.8 KB",
                "Check your knowledge"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you discovered the Amazon Connect Streams Agent APIs. In the next lesson, you will explore the Contact APIs. Agent status - Available (Routable) Agent status - Break (NotRoutable) John chooses the Go Available button. The Log Messages panel confirms the Available agent status action was sent. The Event Messages window shows the log confirming an agent state onRoutable event was successfully received. Agent status - Break (NotRoutable) John chooses the Go Break button. The Log Messages panel confirms the Break agent status action was sent. The Event Messages window shows the log confirming an agent state onNotRoutable event was successfully received. Lesson 5 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t3-q1",
          "question": "John Stiles is implementing the functionality to set the agent's status in the custom Customer Control Panel (CCP). He needs to retrieve the list of available agent states that can be selected when the agent is not handling a live contact. Which method should John use to accomplish this?",
          "options": [
            {
              "id": "A",
              "text": "agent.getAgentStates()"
            },
            {
              "id": "B",
              "text": "agent.setState()"
            },
            {
              "id": "C",
              "text": "agent.onStateChange()"
            },
            {
              "id": "D",
              "text": "agent.onRefresh()"
            }
          ],
          "correctOptionId": "A",
          "rationale": "John uses agent.getAgentStates() to retrieve the list of available agent states. agent.getAgentStates() gets the list of AgentState API objects. These are the agent states that can be selected when the agent is not handling a live contact."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t4",
      "number": 4,
      "title": "Contact API",
      "shortTitle": "Contact API",
      "summary": "Amazon Connect Streams provides a range of action and events subscription methods to help build custom functionality. Contact APIs provide…",
      "duration": "~8 min",
      "lede": null,
      "objectives": [
        "Explore Streams Contact API events and methods."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Streams provides a range of action and events subscription methods to help build custom functionality. Contact APIs provide developers with the flexibility to react to contact events. For example, when a call is answered, the code can display contact information. At the end of the lesson, you will have access to download sample code showcasing the functionality covered in this lesson."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Contact API",
          "blocks": [
            {
              "type": "p",
              "text": "The Contact API provides event subscription and action methods to manage contact states and actions. It triggers events such as onIncoming when a contact is presented, onAccepted when accepted, and onEnded when the interaction ends."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario",
          "blocks": [
            {
              "type": "p",
              "text": "John continues his task of tailoring the CCP to AnyCompany’s specific needs. The same group of agents need a user-friendly interface to interact with contacts. Agents need to perform tasks such as accept and end call. John looks at the code from the index.html file. He plans to include buttons for answering, ending, and closing calls. John will use the following seven steps to perform the custom CCP development process. ."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Subscribing to contact events",
          "blocks": [
            {
              "type": "p",
              "text": "John focuses on the index.js file, where he needs to implement event listeners for the visual components he's creating. He knows that the code needs to handle contact events, such as incoming, accepted, and ended contact events."
            },
            {
              "type": "p",
              "text": "John creates code that subscribes to the following contact events:"
            },
            {
              "type": "ul",
              "items": [
                "onIncoming: Raised when the routing engine presents a queued callback contact to the agent",
                "onAccepted: Raised when the agent accepts the contact",
                "onConnecting: Raised when a contact comes in but before the agent accepts it",
                "onConnected: Raised when an outbound call initiated by the agent is connected to the contact"
              ]
            },
            {
              "type": "p",
              "text": "onEnded: Raised when the conversation was disconnected by the agent or the contact was missed because of the agent not accepting the contact"
            },
            {
              "type": "ul",
              "items": [
                "onDestroy: Raised when the contact object is destroyed",
                "onRefresh: Raised when the contact is updated, such as when the contact attribute values changed",
                "onACW: Raised after the connection closed but before the contact is destroyed"
              ]
            },
            {
              "type": "code",
              "text": "// Subscribe to Contact events\n\nconnect.contact(function(contact) {\n\ncontact.onIncoming(handleContactIncoming);\n\ncontact.onAccepted(handleContactAccepted);\n\ncontact.onConnecting(handleContactConnecting);\n\ncontact.onConnected(handleContactConnected);\n\ncontact.onEnded(handleContactEnded);\n\ncontact.onRefresh(handleContactRefresh);\n\ncontact.onACW(handleContactACW);\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Intercepting the contact state events",
          "blocks": [
            {
              "type": "p",
              "text": "The contact.onConnecting() event is invoked when a contact is connecting. This means a contact is presented to the agent. After the agent accepts the contact, the onAccepted event is raised. To handle this event, John creates a handleContactConnecting placeholder function with all the logging methods in place. This will help John troubleshoot his code when he is testing."
            },
            {
              "type": "code",
              "text": "contact.onConnecting(handleContactConnecting);\n\nfunction handleContactConnecting(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactConnecting() - Contact connecting to agent');\n\nlogInfoEvent(\"[contact.onConnecting] Contact is connecting\");\n\nif (contact) {\n\nlogInfoEvent(\"[contact.onConnecting] Contact is connecting. Contact state is \" + contact.getStatus().type);\n\n} else {\n\nlogInfoEvent(\"[contact.onConnecting] Contact is connecting. Null contact passed to event handler\");\n\n}\n\n}"
            },
            {
              "type": "p",
              "text": "The contact.onConnected() event is invoked when the agent and contact are connected. The handler function for this event is handleContactConnected."
            },
            {
              "type": "code",
              "text": "contact.onConnected(handleContactConnected);\n\nfunction handleContactConnected(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactConnected() - Contact connected to agent');\n\nif (contact) {\n\nlogInfoEvent(\"[contact.onConnected] Contact connected to agent. Contact state is \" + contact.getStatus().type);\n\n} else {\n\nlogInfoEvent(\"[contact.onConnected] Contact connected to agent. Null contact passed to event handler\");\n\n}\n\n}"
            },
            {
              "type": "p",
              "text": "The contact.onAccepted() event is invoked when a callback is accepted by the agent."
            },
            {
              "type": "code",
              "text": "contact.onAccepted(handleContactAccepted);\n\nfunction handleContactConnecting(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactConnecting() - Contact connecting to agent');\n\nlogInfoEvent(\"[contact.onAccepted] Contact is accepted\");\n\nif (contact) {\n\nlogInfoEvent(\"[contact.onAccepted] Contact is accepted. Contact state is \" + contact.getStatus().type);\n\n} else {\n\nlogInfoEvent(\"[contact.onAccepted] Contact is accepted. Null contact passed to event handler\");\n\n}\n\n}"
            },
            {
              "type": "p",
              "text": "The contact.onEnded() event is invoked when a contact ends. This can be because of the conversation being ended by the agent or because of the contact disconnecting. For additional details, John will use the contact.getState() in his handleContactEnded function. The log entry will contain the state of the contact."
            },
            {
              "type": "code",
              "text": "contact.onEnded(handleContactEnded);\n\nfunction handleContactEnded(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactEnded');\n\nlogInfoEvent(\"[contact.onEnded] Contact ended\");\n\nif (contact) {\n\nlogInfoEvent(\"[contact.onEnded] Contact ended. Contact state is \" + contact.getStatus().type);\n\n} else {\n\nlogInfoEvent(\"[contact.onEnded] Contact ended. Null contact passed to event handler\");\n\n}\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Creating event listeners for interacting with contacts",
          "blocks": [
            {
              "type": "p",
              "text": "John begins to write code functions to interact with the contact based on the selected button. The buttons he is creating handlers for are answer, hang-up, and clear contact."
            },
            {
              "type": "code",
              "text": "// Event listeners for the 3 \"buttons\" of the Webpage\n\ndocument.getElementById ('answerDiv').addEventListener(\"click\", acceptContact, false);\n\ndocument.getElementById ('hangupDiv').addEventListener(\"click\", disconnectContact, false);\n\ndocument.getElementById ('clearDiv').addEventListener(\"click\", clearContact, false);"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Creating the accept contact action",
          "blocks": [
            {
              "type": "p",
              "text": "John uses the contact.accept() method so agents can accept incoming contacts. Optional success and failure callback functions can be provided to determine if the operation was successful."
            },
            {
              "type": "code",
              "text": "// Accept the contact\n\nfunction acceptContact() {\n\nlogInfoMsg(\"Accept contact\");\n\ncontact.accept({\n\nsuccess: function () {\n\nlogInfoMsg(\"Accepted contact via Streams\");\n\n},\n\nfailure: function () {\n\nlogInfoMsg(\"Failed to accept contact via Streams\");\n\n}\n\n});\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Retrieving the agent connection to disconnect the contact",
          "blocks": [
            {
              "type": "p",
              "text": "There is no current method available in the Contact API that disconnects the agent from the contact. To achieve this, John needs to explore the Connection API."
            },
            {
              "type": "p",
              "text": "By using the contact.getAgentConnection() method, John gets access to the agent connection object. He can then use the connection object to disconnect the contact."
            },
            {
              "type": "p",
              "text": "The contact.getAgentConnection().destroy() method disconnects the agent from the conversation."
            },
            {
              "type": "code",
              "text": "// Disconnect the current contact\n\nfunction disconnectContact() {\n\ncontact.getAgentConnection().destroy({\n\nsuccess: function () {\n\nlogInfoMsg(\"Disconnected contact via Streams\");\n\n},\n\nfailure: function () {\n\nlogInfoMsg(\"Failed to disconnect contact via Streams\");\n\n}\n\n});\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Step 6: Creating the clear contact action",
          "blocks": [
            {
              "type": "p",
              "text": "The contact.clear() method clears a contact when it is no longer actively being worked on. Agents usually clear the contact to make themselves available for the next contact when they finish their after contact work (ACW). Optional success and failure callbacks can be provided to determine if the operation was successful."
            },
            {
              "type": "code",
              "text": "// To destroy the contact when agent is in ACW\n\nfunction clearContact() {\n\ncontact.clear({\n\nsuccess: function () {\n\nlogInfoMsg(\"Cleared contact via Streams\");\n\n},\n\nfailure: function () {\n\nlogInfoMsg(\"Failed to clear contact via Streams\");\n\n}\n\n});\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Step 7: Displaying contact attributes",
          "blocks": [
            {
              "type": "p",
              "text": "John continues to implement AnyCompany’s requirements. He writes code to display information to agents, such as the caller name, phone number, and queue name. Contact attributes are set in flows using the Set contact attributes flow block."
            },
            {
              "type": "p",
              "text": "Mateo meets with John to agree on the data displayed in the CCP. John writes code to retrieve the contact attributes using the contact.getAttributes() method and display them alongside the caller phone number."
            },
            {
              "type": "p",
              "text": "To get the caller number, John first needs access to the current connection information. The contact.getActiveInitialConnection() method gets the initial connection of the contact. If the initial connection is no longer active, the return value is NULL."
            },
            {
              "type": "p",
              "text": "By using the contact.getActiveInitialConnection().getEndpoint().phoneNumber, John gets the caller number for this connection."
            },
            {
              "type": "code",
              "text": "logInfoMsg(\"Subscribing to events for contact\");\n\nif (contact.getActiveInitialConnection()\n\n&& contact.getActiveInitialConnection().getEndpoint()) {\n\nlogInfoMsg(\"New contact is from \" + contact.getActiveInitialConnection().getEndpoint().phoneNumber);\n\n} else {\n\nlogInfoMsg(\"This is an existing contact for this agent\");\n\n}"
            },
            {
              "type": "p",
              "text": "The contact.getAttributes() method retrieves a list of attributes associated with the contact. Each value in the map has the following structure:"
            },
            {
              "type": "ul",
              "items": [
                "{ name: string, value: string }",
                "The contact.getQueue() method retrieves the queue associated with the contact. This object has the following fields:"
              ]
            },
            {
              "type": "ul",
              "items": [
                "name: Stores the queue name",
                "queueARN: Stores the ARN of the queue",
                "queueId: Stores the alias for queueARN",
                "By using the following code, John logs this information for better troubleshooting."
              ]
            },
            {
              "type": "code",
              "text": "logInfoMsg(\"Contact is from queue \" + contact.getQueue().name);\n\nlogInfoMsg(\"Hello \" + contact.getAttributes().firstName.value + \" \" + contact.getAttributes().lastName.value + \". Thank you for contacting AnyCompany\");"
            },
            {
              "type": "p",
              "text": "For more information about Amazon Connect queues, navigate to Concepts: Standard Queues and Agent Queues in the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "After a quick break, John is ready to start testing his code in a test page. After he confirms the code works, he will embed it in the agent application’s webpage. He will also design the look and feel of the new contact action buttons. To follow John's testing of his new webpage, choose each of the following tabs."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t4-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Agent hangs up on an active contact (onEnded event)",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Agent closes an ended contact after completing ACW (onDestroy event)"
            },
            {
              "type": "p",
              "text": "As a call is connecting, the incoming event contains three attributes. The first attribute contains a message that helps the agent greet the customer. The greeting includes the customer's name."
            },
            {
              "type": "p",
              "text": "The second attribute contains the name of the queue the call arrived on. The third attribute shows the caller's phone number. The Log Messages panel displays the value of the contact attributes received with the contact event. The Event Messages panel displays the contact and agent handler function logs. The first log shows the contact state as onConnecting."
            },
            {
              "type": "p",
              "text": "To download the sample file attachment, choose anywhere inside the following box."
            },
            {
              "type": "ul",
              "items": [
                "contact-api-index.zip",
                "139.7 KB",
                "Check your knowledge"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you discovered the Amazon Connect Streams Contact APIs. In the next lesson, you will learn how to embed Amazon Connect Customer Profiles functionality in your application. Agent answers an incoming contact (onConnected event) Agent hangs up on an active contact (onEnded event) Agent closes an ended contact after completing ACW (onDestroy event) In his next test, John placed a call. When the call is presented, John chooses the Answer Incoming button. The Log Messages panel shows the contact was accepted using the handler function John created for this event. The Event Messages panel shows an onConnected event handled by the code. Agent hangs up on an active contact (onEnded event) Agent closes an ended contact after completing ACW (onDestroy event) John is testing the Hang-up button next. When he chooses the button, the Log Messages panel shows the confirmation of a Disconnected method being invoked by the code. The Event Messages panel shows the confirmation of an onEnded event received by the application. Agent closes an ended contact after completing ACW (onDestroy event) The test user configuration is set to automatically have ACW time when the call ends. To clear that state, John will test his Close Contact button next. As soon as he chooses the button, the Log Messages panel shows that the Cleared contact method was processed successfully. The Event Messages panel shows a log entry that confirms an onDestroy event was successfully received, and the contact state ended. Lesson 6 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t4-q1",
          "question": "Mateo Jackson is developing a custom Customer Control Panel (CCP) for AnyCompany's agents. Which Streams Contact API method should Mateo use to display the caller's phone number and queue name for each incoming contact?",
          "options": [
            {
              "id": "A",
              "text": "contact.getActiveInitialConnection().getEndpoint().phoneNumber and contact.getQueue().name"
            },
            {
              "id": "B",
              "text": "contact.getCallerNumber() and contact.getQueueName()"
            },
            {
              "id": "C",
              "text": "contact.getAttributes().phoneNumber.value and contact.getQueueId()"
            },
            {
              "id": "D",
              "text": "contact.getInitialConnection().getPhoneNumber() and contact.getQueueARN()"
            }
          ],
          "correctOptionId": "A",
          "rationale": "Mateo uses contact.getActiveInitialConnection().getEndpoint().phoneNumber to get the caller's phone number and contact.getQueue().name to get the queue name for the incoming contact."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t5",
      "number": 5,
      "title": "Customer Profiles",
      "shortTitle": "Customer Profiles",
      "summary": "The Amazon Connect agent workspace equips agents with customer information and guidance to resolve issues efficiently. Often, agents handle…",
      "duration": "~7 min",
      "lede": null,
      "objectives": [
        "Explore embedding Customer Profiles functionality in a webpage."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect agent workspace equips agents with customer information and guidance to resolve issues efficiently. Often, agents handle multiple applications during interactions, leading to delays and frustration. Developers can use Streams to customize the workspace, integrating tools like Customer Profiles into their applications to streamline agent workflows."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles give agents real-time access to updated customer information for personalized interactions. By integrating data from sources like CRM systems or custom databases, organizations provide agents with a comprehensive view of customer details in one place. This includes contact history, sentiment, product orders, and mobile app interactions."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Prerequisites",
              "body": [
                "For instructions on how to configure Customer Profiles, navigate to Enable Customer Profiles for Your Instance in the Amazon Connect Administrator Guide."
              ]
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario",
          "blocks": [
            {
              "type": "p",
              "text": "Mary receives a new set of requirements from AnyCompany's business team. AnyCompany agents use multiple systems to find customer-relevant details about order status, purchase history, and previous interactions. Mary meets with her colleague, John, who helped her build a custom CCP. Mary reviews the requirements and decides to add Customer Profiles functionality to create a unified view of customer data for the agents."
            },
            {
              "type": "p",
              "text": "John shares his code with Mary as she begins to explore the options to embed Customer Profiles in AnyCompany’s agent application using Streams."
            },
            {
              "type": "p",
              "text": "The first option is to initialize the built-in Customer Profiles widget. The second option is to use the Customer Profiles JavaScript library (CustomerProfilesJS) to build a custom widget. For instructions on how to use the Customer Profiles JavaScript library, navigate to Customer Profiles JavaScript Library."
            },
            {
              "type": "p",
              "text": "The following two sections cover the details of each option. At the end of the lesson, you will find sample code for the functionality covered in the lesson."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Option 1: Built-in Customer Profiles widget",
          "blocks": [
            {
              "type": "p",
              "text": "Mary meets with John, and they agree to first test Customer Profiles functionality with minimal development work. They want to make sure the new capabilities meet AnyCompany’s requirements. Mary will use the following two steps to complete the implementation option."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating Customer Profiles container",
          "blocks": [
            {
              "type": "p",
              "text": "Mary checks the code in the index.html file. She creates a new <div> container id=\"customerprofiles-container\" for the Customer Profiles widget."
            },
            {
              "type": "code",
              "text": "<!-- Create div container for Customer Profiles -->\n\n<div id=\"customerprofiles-container\" style=\"width: 400px; height: 600px;\"></div>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Initializing the CCP and Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Mary modifies the index.js file to initialize both the CCP and Customer Profiles apps, using connect.agentApp.initApp(name, containerId, appUrl, config). To discover the details of each parameter for this function, expand each of the following four categories."
            },
            {
              "type": "ul",
              "items": [
                "name",
                "The first parameter represents the name of the app that uniquely identifies this integration."
              ]
            },
            {
              "type": "p",
              "text": "CCP: The value of the first initApp function is ccp."
            },
            {
              "type": "p",
              "text": "Customer Profiles: The value of the second app is customerprofiles."
            },
            {
              "type": "p",
              "text": "containerId"
            },
            {
              "type": "p",
              "text": "The second parameter is the identifier for the HTML Document Object Model (DOM) that contains the app inline frame (iframe)."
            },
            {
              "type": "p",
              "text": "CCP: The value is set to the customCCPDiv DOM object."
            },
            {
              "type": "p",
              "text": "Customer Profiles: The value is set to the customerprofiles-container DOM object."
            },
            {
              "type": "ul",
              "items": [
                "appUrl",
                "The string URL of the app. This is the page that navigates to the app."
              ]
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s7",
          "eyebrow": null,
          "duration": null,
          "title": "CCP: This value uses a relative path connectUrl + \"/ccp-v2/\"",
          "blocks": [
            {
              "type": "p",
              "text": "Customer Profiles: Similar to the CCP, the value uses a relative path connectUrl + \"/customerprofiles-v2/\""
            },
            {
              "type": "p",
              "text": "config"
            },
            {
              "type": "p",
              "text": "This is an optional parameter that provides additional configuration settings for CCP. Such settings include the following:"
            },
            {
              "type": "p",
              "text": "ccpParams: These are optional parameters that mirror the configuration options for initCCP. The allowFramedSoftphone setting defaults to true."
            },
            {
              "type": "ul",
              "items": [
                "style: This is an optional string that supplies inline styling for the iframe.",
                "CCP: The value is set to { style: \"width:400px; height:600px;\" }."
              ]
            },
            {
              "type": "p",
              "text": "Customer Profiles: The value is set to { style: \"width:400px; height:600px;\" }."
            },
            {
              "type": "p",
              "text": "Both iframes are the same size."
            },
            {
              "type": "p",
              "text": "To confirm CCP and Customer Profiles initialization when the page loads, Mary writes code to subscribe to the onload event. The following code sample shows the first step Mary takes to initialize the two apps."
            },
            {
              "type": "code",
              "text": "// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\n// Connect information: Replace with your Connect Instance\n\nconst connectUrl = \"https://my-instance-name.my.connect.aws/connect\";\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"ccp\","
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customCCPDiv\"),"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/ccp-v2/\","
            },
            {
              "type": "p",
              "text": "{ style: \"width:400px; height:600px;\" }"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"customerprofiles\","
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customerprofiles-container\"),"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/customerprofiles-v2/\","
            },
            {
              "type": "p",
              "text": "{ style: \"width:400px; height:600px;\" }"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            },
            {
              "type": "p",
              "text": "Mary and John run a first test and can see both CCP and Customer Profiles initializing successfully in their test webpage."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Option 2: Building a custom widget for Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Mary receives an updated request from AnyCompany's business team. They want the new UI to match the brand's look and feel. Agents need access to customer information when they receive a contact. At this point, Mary knows she must try the second option for embedding Customer Profiles functionality in their application. Mary will use the following five steps to complete the implementation option."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating a Customer Profiles container",
          "blocks": [
            {
              "type": "p",
              "text": "Mary looks at the code from the index.html file. She creates a new <div> container id=\"customer-profiles-widget\" for the Customer Profiles widget. In this new widget, Mary adds a Search button and a panel where the agents can see the search results."
            },
            {
              "type": "code",
              "text": "<!-- Add Search button and results container -->\n\n<div id=\"customer-profiles-widget\">\n\n<div id=\"cp-div\">\n\n<h2>Customer Profiles</h2>\n\n<input type=\"text\" id=\"search-input\" placeholder=\"Search for a profile\">\n\n<button id=\"search-button\">Search</button>\n\n<div id=\"search-results-container\">\n\n<div id=\"search-results\"></div>\n\n</div>\n\n</div>\n\n</div>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Importing CustomerProfilesJS",
          "blocks": [
            {
              "type": "p",
              "text": "First, Mary downloads the Customer Profiles JavaScript library by following the instructions in the Usage section on GitHub; for more information, navigate to Usage. Then, she updates the index.html file to embed CustomerProfilesJS in the script tag."
            },
            {
              "type": "code",
              "text": "<!-- Embed CustomerProfilesJS -->\n\n<script type=\"text/javascript\" src=\"./amazon-connect-customer-profiles-min.js\"></script>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Initializing the CCP",
          "blocks": [
            {
              "type": "p",
              "text": "The softphone widget must be initialized. Mary had no requirement to customize the look and feel of the standard soft phone. CCP is used for handling contacts."
            },
            {
              "type": "code",
              "text": "// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\n// Connect information: Replace with your Connect Instance\n\nconst ccpUrl = \"https://my-instance-name.my.connect.aws/connect/ccp-v2\";\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.core.initCCP("
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customCCPDiv\"), {"
            },
            {
              "type": "p",
              "text": "ccpUrl: ccpUrl, // REQUIRED"
            },
            {
              "type": "p",
              "text": "loginPopup: true, // optional, defaults to `true`"
            },
            {
              "type": "p",
              "text": "loginPopupAutoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "loginOptions: { // optional, if provided opens login in new window"
            },
            {
              "type": "p",
              "text": "autoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "height: 600, // optional, defaults to 578"
            },
            {
              "type": "p",
              "text": "width: 400, // optional, defaults to 433"
            },
            {
              "type": "p",
              "text": "top: 0, // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "left: 0 // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"CCP initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Initializing Customer Profiles client",
          "blocks": [
            {
              "type": "p",
              "text": "Next, Mary modifies the index.js file to initialize the Customer Profiles client. She initializes the search key value with the caller phone number."
            },
            {
              "type": "code",
              "text": "// Initialize CustomerProfilesJS\n\nconst customerProfilesClient = new connect.CustomerProfilesClient(\"https://my-instance-name.my.connect.aws/connect\");\n\n// Set the search key value to the caller number\n\nconst searchValue = contact.getActiveInitialConnection().getEndpoint().phoneNumber;"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Adding search profiles capabilities",
          "blocks": [
            {
              "type": "p",
              "text": "Finally, Mary completes the task by implementing SearchProfiles API logic to retrieve and display customer information. The SearchProfiles API input parameters include the Customer Profiles DomainName. For more information about how to find your Customer Profile domain, navigate to Enable Customer Profiles for Your Instance in the Amazon Connect Administrator Guide."
            },
            {
              "type": "code",
              "text": "// Search for profiles\n\nvar searchResults = document.getElementById('search-results');"
            },
            {
              "type": "p",
              "text": "const domainName = 'CustomerProfiles-Domain-Name'; // Replace with your domain name"
            },
            {
              "type": "p",
              "text": "const searchTerm = document.getElementById ('search-input').value; // Set the initial search term, or get it from a form input"
            },
            {
              "type": "p",
              "text": "try {"
            },
            {
              "type": "p",
              "text": "const searchResponse = await customerProfilesClient.searchProfiles({"
            },
            {
              "type": "p",
              "text": "DomainName: domainName,"
            },
            {
              "type": "p",
              "text": "KeyName: \"_phone\","
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t5-s14",
          "eyebrow": null,
          "duration": null,
          "title": "Values: [searchTerm]",
          "blocks": [
            {
              "type": "p",
              "text": "});"
            },
            {
              "type": "p",
              "text": "logInfoEvent(\"Searching for profiles\" + searchResponse);"
            },
            {
              "type": "p",
              "text": "searchResults.innerHTML = '';"
            },
            {
              "type": "p",
              "text": "if (searchResponse.data && searchResponse.data.Items && searchResponse.data.Items.length === 0) {"
            },
            {
              "type": "p",
              "text": "searchResults.innerHTML = '<p>No profiles found.</p>';"
            },
            {
              "type": "p",
              "text": "} else if (searchResponse.data && searchResponse.data.Items) {"
            },
            {
              "type": "p",
              "text": "searchResponse.data.Items.forEach(item => {"
            },
            {
              "type": "p",
              "text": "const profileDiv = document.createElement('div');"
            },
            {
              "type": "p",
              "text": "profileDiv.innerHTML = `"
            },
            {
              "type": "p",
              "text": "<div style=\"height: 350px; border-style: outset; border-color: gray; border-width: thin;\">"
            },
            {
              "type": "p",
              "text": "<h3>${item.FirstName} ${item.LastName}</h3>"
            },
            {
              "type": "p",
              "text": "<p><b>Phone</b>: ${item.PhoneNumber}</p>"
            },
            {
              "type": "p",
              "text": "<p><b>Email</b>: ${item.EmailAddress}</p>"
            },
            {
              "type": "p",
              "text": "<p><b>Address</b>: ${item.Address.Address1}, ${item.Address.City}, ${item.Address.Country}</p>"
            },
            {
              "type": "p",
              "text": "<p><b>Current Order</b>: ${contact.getAttributes().CurrentOrder.value}</p>"
            },
            {
              "type": "p",
              "text": "<p><b>Product Purchase History</b>: ${contact.getAttributes().PurchaseHistory.value}</p>"
            },
            {
              "type": "p",
              "text": "<p><b>Contact History</b>: ${contact.getAttributes().ContactHistory.value}</p>"
            },
            {
              "type": "p",
              "text": "`;"
            },
            {
              "type": "p",
              "text": "searchResults.appendChild(profileDiv);"
            },
            {
              "type": "p",
              "text": "});"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "searchResults.innerHTML = '<p>An error occurred while searching for profiles</p>';"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error('Error searching for profiles:', error);"
            },
            {
              "type": "p",
              "text": "searchResults.innerHTML = '<p>An error occurred while searching for profiles</p>';"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "After a quick break, Mary is ready to start testing her code in a test page. After she confirms that the code works, she can embed it in the agent application’s webpage. Then, she can design the look and feel of the new Customer Profiles widget."
            },
            {
              "type": "p",
              "text": "As soon as she receives the test call, Mary sees the pre-populated contact phone number and the result of the search displayed in her widget."
            },
            {
              "type": "p",
              "text": "Mary places a test call."
            },
            {
              "type": "p",
              "text": "She receives the test call and sees the pre-populated contact phone number. The result of the search displays in her new widget."
            },
            {
              "type": "p",
              "text": "To download the sample code attachment, choose anywhere inside the following box."
            },
            {
              "type": "ul",
              "items": [
                "customer-profiles-functionalty-sample-code.zip",
                "142.3 KB",
                "Check your knowledge"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you learned about the options for Customer Profiles. Continue to the next lesson to learn about Amazon Q in Connect. Lesson 7 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t5-q1",
          "question": "A developer must create a widget that gives agents the ability to search for a customer profile by phone number. The widget must have the same look and feel as their existing agent application. Which step is required for the search code to run successfully?",
          "options": [
            {
              "id": "A",
              "text": "Implement the onAccepted event handler."
            },
            {
              "id": "B",
              "text": "Initialize the Amazon Connect Customer Profiles client."
            },
            {
              "id": "C",
              "text": "Use connect.agentApp.initApp."
            },
            {
              "id": "D",
              "text": "Implement the onConnecting event handler."
            }
          ],
          "correctOptionId": "B",
          "rationale": "The Customer Profiles search functionality requires the Customer Profiles client to be initialized."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t6",
      "number": 6,
      "title": "Amazon Q in Connect",
      "shortTitle": "Amazon Q in Connect",
      "summary": "Amazon Connect agent workspace provides built-in agent assist capabilities using Amazon Q in Connect. Developers can use Streams to embed similar…",
      "duration": "~9 min",
      "lede": null,
      "objectives": [
        "Explore Streams library methods for Amazon Q in Connect functionality."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect agent workspace provides built-in agent assist capabilities using Amazon Q in Connect. Developers can use Streams to embed similar functionality in other web applications. In this lesson, you will learn how to extend the agent assist capabilities to other applications used by agents."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Q in Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Q in Connect uses generative AI to deliver agents' suggested responses and actions to address customer questions, improving issue resolution and customer satisfaction. Knowledge articles can be spread across separate repositories. Agents waste time trying to navigate these different sources of information while the customer waits for an answer."
            },
            {
              "type": "p",
              "text": "Amazon Q in Connect uses the real-time conversation with the customer and relevant knowledge articles to automatically recommend actions for agents to assist customers. With Amazon Q, agents can use natural language to search across connected knowledge sources to receive generated responses, recommended actions, and links to additional information."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Prerequisites",
              "body": [
                "For instructions on how to configure Amazon Q in Connect, navigate to Enable Amazon Q in Connect for Your Instance in the Amazon Connect Administrator Guide."
              ]
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario",
          "blocks": [
            {
              "type": "p",
              "text": "AnyCompany is launching a new product and has hired agents to support additional customer demand. There is not enough time to cover all the training courses. AnyCompany realizes that the newly hired agents cannot answer queries related to refunds and order returns. Mary meets with Mateo Jackson, AnyCompany head of customer experience, to find a solution. They explore Amazon Q in Connect and decide to test the generative AI capabilities to provide agents with real-time assistance."
            },
            {
              "type": "p",
              "text": "Mary reviews the requirements to integrate the agent application with Amazon Q in Connect to detect customer intent and generate recommendations based on knowledge content. Mary begins to explore the options to embed Amazon Q in Connect into AnyCompany’s agent application using Streams. The first option is to initialize the built-in Amazon Q in Connect widget. The second option is to use the Amazon Q in Connect JavaScript library (QConnectJS) to build a custom widget. For more information, navigate to Amazon-Q-Connectjs."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Option 1: Built-in Amazon Q in Connect widget",
          "blocks": [
            {
              "type": "p",
              "text": "Mary wants to test Amazon Q in Connect with minimal development work to confirm that the capabilities meet AnyCompany’s requirements. Mary will use the following two steps to complete the implementation option."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating Amazon Q in Connect container",
          "blocks": [
            {
              "type": "p",
              "text": "Mary looks at the code from the index.html file. She creates a new <div> container id=\"amazonQ-container\" for the Amazon Q in Connect widget."
            },
            {
              "type": "code",
              "text": "<!-- Create div container for Amazon Q -->\n\n<div id=\"amazonQ-container\" style=\"width: 400px; height: 600px;\"></div>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Initializing the CCP and Amazon Q in Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Mary modifies the \"index.js\" file to initialize the CCP and Amazon Q in Connect using connect.agentApp.initApp(name, containerId, appUrl, config). Similar to the Customer Profile configuration, Mary initializes each application separately."
            },
            {
              "type": "p",
              "text": "name"
            },
            {
              "type": "p",
              "text": "For the name of the application, Mary uses the ccp value for CCP, and the wisdom value for Amazon Q in Connect."
            },
            {
              "type": "p",
              "text": "containerId"
            },
            {
              "type": "p",
              "text": "For the container identifiers, Mary uses the DOM object customCCPDiv for CCP, and amazonQ-container for Amazon Q in Connect."
            },
            {
              "type": "p",
              "text": "appUrl"
            },
            {
              "type": "p",
              "text": "The value of the appUrl uses a relative path: connectUrl + \"/ccp-v2/\" for CCP, and connectUrl + \"/wisdom-v2/\" for Amazon Q in Connect."
            },
            {
              "type": "p",
              "text": "The URL specified in this parameter identifies the app widget you want to load in the iframe."
            },
            {
              "type": "p",
              "text": "config"
            },
            {
              "type": "p",
              "text": "The only configuration parameter in this test is the widget size. The value for both widgets is set to { style: \"width:400px; height:600px;\" }."
            },
            {
              "type": "p",
              "text": "To confirm CCP and Amazon Q in Connect initialization when the page loads, Mary writes code to subscribe to the onload event. The following code snippet shows the initApp function call with the parameters for CCP and Amazon Q in Connect."
            },
            {
              "type": "code",
              "text": "// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\n// Connect information: Replace with your Connect Instance\n\nconst connectUrl = \"https://my-instance-name.my.connect.aws/connect\";\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"ccp\","
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customCCPDiv\"),"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/ccp-v2/\","
            },
            {
              "type": "p",
              "text": "{ style: \"width:400px; height:600px;\" }"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"wisdom\","
            },
            {
              "type": "p",
              "text": "document.getElementById(\"amazonQ-container\"),"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/wisdom-v2/\","
            },
            {
              "type": "p",
              "text": "{ style: \"width:400px; height:600px;\" }"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Option 2: Building a custom widget for Amazon Q in Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Mary receives a request from AnyCompany's business team to customize the UI to match the brand look and feel. Agents need to receive recommendations in real time when interacting with contacts. Mary will use the following five steps to complete the implementation option."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating an Amazon Q in Connect container",
          "blocks": [
            {
              "type": "p",
              "text": "Mary looks at the code from the index.html file. She creates a new <div> container id=\"amazon-q-widget\" for the Customer Profiles widget."
            },
            {
              "type": "code",
              "text": "<!-- Add Search button and results container -->\n\n<div id=\"amazon-q-widget\">\n\n<div id=\"QiC-div\">\n\n<h2>Amazon Q </h2>\n\n<input type=\"text\" id=\"search-Qinput\" placeholder=\"Search Amazon Q\">\n\n<button id=\"search-Qbutton\">Search</button>\n\n<div id=\"search-Qresults-container\">\n\n<div id=\"search-Qresults\"></div>\n\n</div>\n\n</div>\n\n</div>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Importing QConnectJS",
          "blocks": [
            {
              "type": "p",
              "text": "First, Mary downloads the Amazon Q in Connect JavaScript library by following the instructions in the Usage section on GitHub. Then, she updates the index.html file to embed QConnectJS in the script tag."
            },
            {
              "type": "code",
              "text": "<!-- Embed QConnectJS -->\n\n<script type=\"text/javascript\" src=\"./amazon-q-connectjs-min.js\"></script>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Initializing the CCP",
          "blocks": [
            {
              "type": "p",
              "text": "In this step, Mary defines the parameters that initialize the standard CCP functionality. This includes login options and the size of the widget."
            },
            {
              "type": "code",
              "text": "// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\n// Connect information: Replace with your Connect Instance\n\nconst ccpUrl = \"https://my-instance-name.my.connect.aws/connect/ccp-v2\";\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.core.initCCP("
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customCCPDiv\"), {"
            },
            {
              "type": "p",
              "text": "ccpUrl: ccpUrl, // REQUIRED"
            },
            {
              "type": "p",
              "text": "loginPopup: true, // optional, defaults to `true`"
            },
            {
              "type": "p",
              "text": "loginPopupAutoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "loginOptions: { // optional, if provided opens login in new window"
            },
            {
              "type": "p",
              "text": "autoClose: true, // optional, defaults to `false`"
            },
            {
              "type": "p",
              "text": "height: 600, // optional, defaults to 578"
            },
            {
              "type": "p",
              "text": "width: 400, // optional, defaults to 433"
            },
            {
              "type": "p",
              "text": "top: 0, // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "left: 0 // optional, defaults to 0"
            },
            {
              "type": "p",
              "text": "},"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"CCP initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Initializing Amazon Q in Connect client",
          "blocks": [
            {
              "type": "p",
              "text": "Next, Mary modifies the index.js file to initialize the Amazon Q in Connect client."
            },
            {
              "type": "code",
              "text": "// Initialize QConnectJS client with \"QConnectClient\"\n\nconst instanceUrl = \"https://my-instance-name.my.connect.aws/connect\";\n\nconst qConnectClient = new connect.qconnectjs.QConnectClient({"
            },
            {
              "type": "p",
              "text": "instanceUrl,"
            },
            {
              "type": "p",
              "text": "});"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Retrieving and displaying Amazon Q in Connect recommendations",
          "blocks": [
            {
              "type": "p",
              "text": "After reading the documentation, Mary identifies three key actions to implement. First, she must retrieve the contact details, then get the recommendations, and last, get the relevant answer for the agent."
            },
            {
              "type": "p",
              "text": "Next, Mary updates the index.js file to integrate the GetContact, GetRecommendations, and QueryAssistant APIs."
            },
            {
              "type": "p",
              "text": "The following code sample shows how Mary uses the GetContact API to retrieve the contact details, including the current sessionARN or session identifier. For active contacts, the code loops every fifteen seconds, and uses the active connection and calls the GetRecommendations function."
            },
            {
              "type": "code",
              "text": "// Check if a contact exist for Amazon Q in Connect GetRecommendation\n\nif (contact) {\n\nconsole.log('Contact object exists.');\n\nsessionARN = GetContact(contact);\n\nconsole.log('sessionARN: ' + sessionARN);\n\nconst intervalId = setInterval(async () => {\n\nif (contact.getActiveInitialConnection()) {"
            },
            {
              "type": "p",
              "text": "if (sessionARN) { // Check if sessionARN is not undefined or null"
            },
            {
              "type": "p",
              "text": "GetRecommendations(sessionARN);"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "console.log('No session is available.');"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "clearInterval(intervalId);"
            },
            {
              "type": "p",
              "text": "console.log('Initial connection is no longer active.');"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}, 15000);"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "console.log('Contact object no longer exists.');"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "async function GetContact(contact){"
            },
            {
              "type": "p",
              "text": "try {"
            },
            {
              "type": "p",
              "text": "const getContactResponse = await qConnectClient.getContact({"
            },
            {
              "type": "p",
              "text": "awsAccountId: '111122223333', //Replace placeholder with your AWS account Id"
            },
            {
              "type": "p",
              "text": "instanceId: 'a1b2c3d4-5678-90ab-cdef-EXAMPLE11111', // Replace placeholder with your Amazon Connect instance Id"
            },
            {
              "type": "p",
              "text": "contactId: contact.getContactId()"
            },
            {
              "type": "p",
              "text": "});"
            },
            {
              "type": "p",
              "text": "sessionARN = getContactResponse.body.contactData.contactFeature.wisdomFeatures.wisdomConfig.sessionArn;"
            },
            {
              "type": "p",
              "text": "return sessionARN;"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error('Error searching for getContact:', error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "The GetRecommendations function uses the sessionARN retrieved in the previous action. It then uses the assistant client to get the recommendations. The following code sample shows the creation of a button for each suggested recommendation. The code has a main for loop. For each recommendation, if there is a trigger object. The sample code creates an action button, so the agent selects the right recommendation to handle the contact. The function GenQueryAssistant is invoked when the agent selects the action button. The following is a code snippet. To review the full code, expand the section following this image."
            },
            {
              "type": "code",
              "text": "async function GetRecommendations(sessionARN) {\n\nif(sessionARN != ''){\n\ntry {\n\nconst QResponse = await qConnectClient.getRecommendations({\n\n// Replace placeholder with your Amazon Q in Connect assistant Id: https://docs.aws.amazon.com/connect/latest/APIReference/API_amazon-q-connect_ListAssistants.html\n\nassistantId: \"arn:aws:wisdom:eu-west-2:111122223333:assistant/a1b2c3d4-5678-90ab-cdef-EXAMPLE22222\",\n\nsessionId: sessionARN.split(/\\/(?=[^/]*$)/)[1],\n\nmaxResults: 10,\n\nwaitTimeSeconds: 15\n\n});\n\nconsole.log(`GetRecommendation ${QResponse.body}`);\n\nfor (const recommendation of QResponse.body.recommendations) {\n\nconst recommendationId = recommendation.recommendationId;\n\n// Find the trigger object with the matching recommendationId"
            },
            {
              "type": "p",
              "text": "const trigger = QResponse.body.triggers.find((t) =>"
            },
            {
              "type": "p",
              "text": "t.recommendationIds.includes(recommendationId)"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "if (trigger) {"
            },
            {
              "type": "p",
              "text": "// Access the trigger text and id"
            },
            {
              "type": "p",
              "text": "const triggerText = trigger.data.query.text;"
            },
            {
              "type": "p",
              "text": "const triggerId = trigger.id;"
            },
            {
              "type": "p",
              "text": "console.log(`Trigger Text for RecommendationId ${recommendationId}:`, triggerText);"
            },
            {
              "type": "p",
              "text": "// Create a button element as an HTML string"
            },
            {
              "type": "p",
              "text": "const buttonHTML = `<button class=\"search-q-button\">${triggerText}</button>`;"
            },
            {
              "type": "p",
              "text": "// Append the button HTML to the searchQResults div"
            },
            {
              "type": "p",
              "text": "searchQResults.innerHTML += buttonHTML;"
            },
            {
              "type": "p",
              "text": "// Add an event listener to the button"
            },
            {
              "type": "p",
              "text": "const button = document.querySelector('.search-q-button:last-child');"
            },
            {
              "type": "p",
              "text": "button.addEventListener('click', async (event) => {"
            },
            {
              "type": "p",
              "text": "// Handle button click event"
            },
            {
              "type": "p",
              "text": "console.log(`Button clicked for RecommendationId ${recommendationId}`);"
            },
            {
              "type": "p",
              "text": "// Add your desired functionality here"
            },
            {
              "type": "p",
              "text": "GenQueryAssistant(`\"#intentrecommendation:${triggerId}\"`);"
            },
            {
              "type": "p",
              "text": "// Disable the button after it has been clicked"
            },
            {
              "type": "p",
              "text": "button.disabled = true;"
            },
            {
              "type": "p",
              "text": "});"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "console.log(`No trigger found for RecommendationId ${recommendationId}`);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "// process response."
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error('Error searching for getRecommendations:', error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "The last action Mary needs to complete is to write the code for the recommendation button handlers, the GenQueryAssistant function. The following sample showcases the display of the recommendations content in a visual container."
            },
            {
              "type": "code",
              "text": "async function GenQueryAssistant(searchQTerm){\n\ntry {\n\nconst searchQResponse = await qConnectClient.queryAssistant({\n\n// Replace placeholder with your Amazon Q in Connect assistant Id: https://docs.aws.amazon.com/connect/latest/APIReference/API_amazon-q-connect_ListAssistants.html\n\nassistantId: \"arn:aws:wisdom:eu-west-2:111122223333:assistant/a1b2c3d4-5678-90ab-cdef-EXAMPLE22222\",\n\nqueryText: searchQTerm,\n\nmaxResults: 1,\n\nqueryCondition: [\n\n{\n\n\"single\": {\n\n\"field\": \"RESULT_TYPE\",\n\n\"comparator\": \"EQUALS\",\n\n\"value\": \"GENERATIVE_ANSWER\"\n\n}\n\n}\n\n]\n\n});\n\n// Create a new div element to hold the result\n\nconst resultDiv = document.createElement('div');\n\nresultDiv.classList.add('result-container');\n\nif (searchQResponse.body.results.length === 0) {\n\nresultDiv.innerHTML = '<p>No answer found.</p>';\n\n} else {"
            },
            {
              "type": "p",
              "text": "resultDiv.innerHTML = `"
            },
            {
              "type": "p",
              "text": "<div style=\"height: 300px; border-style: outset; border-color: gray; border-width: thin;\">"
            },
            {
              "type": "p",
              "text": "<h3>Solution</h3>"
            },
            {
              "type": "p",
              "text": "<p>${searchQResponse.body.results[0].data.details.generativeData.completion}</p>"
            },
            {
              "type": "p",
              "text": "`;"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "// Append the resultDiv to the searchQResults div"
            },
            {
              "type": "p",
              "text": "searchQResults.appendChild(resultDiv);"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error('Error searching for answers:', error);"
            },
            {
              "type": "p",
              "text": "const errorDiv = document.createElement('div');"
            },
            {
              "type": "p",
              "text": "errorDiv.innerHTML = '<p>An error occurred while searching for answers</p>';"
            },
            {
              "type": "p",
              "text": "searchQResults.appendChild(errorDiv);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t6-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Testing the code",
          "blocks": [
            {
              "type": "p",
              "text": "To test the code that Mary created for her use case, choose anywhere inside the following box."
            },
            {
              "type": "p",
              "text": "amazon-q-in-connect-sample-code.zip"
            },
            {
              "type": "h",
              "level": 4,
              "text": "151.1 KB"
            },
            {
              "type": "p",
              "text": "Mary is ready to start testing her code in a test page. After she confirms the code works, she can embed it in the agent application’s webpage. Then, she can design the look and feel of the new Amazon Q in Connect widget."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you explored options to implement Amazon Q in Connect functionality in web applications. In the next lesson, you will learn how you can display agent guides in agent web applications. Lesson 8 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t6-q1",
          "question": "A developer is asked to add the built-in Amazon Q in Connect widget into the homegrown web agent application for AnyCompany. Which parameter passed to the connect.agentApp.initApp function initializes the agent assist functionality?",
          "options": [
            {
              "id": "A",
              "text": "name"
            },
            {
              "id": "B",
              "text": "containerId"
            },
            {
              "id": "C",
              "text": "appUrl"
            },
            {
              "id": "D",
              "text": "config"
            }
          ],
          "correctOptionId": "C",
          "rationale": "The appUrl identifies the app widget link loaded in the iframe."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t7",
      "number": 7,
      "title": "Step-by-Step Guides",
      "shortTitle": "Step-by-Step Guides",
      "summary": "Contact center agents need guidance to effectively handle contact inquiries. The Amazon Connect agent workspace provides built-in step-by-step…",
      "duration": "~8 min",
      "lede": null,
      "objectives": [
        "Explore embedding step-by-step guides functionality in a custom webpage."
      ],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t7-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Contact center agents need guidance to effectively handle contact inquiries. The Amazon Connect agent workspace provides built-in step-by-step guides within Amazon Connect flows. Developers can also integrate these guides into custom applications using Streams to make sure agents resolve contact requests efficiently."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect step-by-step guides",
          "blocks": [
            {
              "type": "p",
              "text": "Step-by-step guides empower organizations to create customizable workflows for agents to resolve customer issues. IVR designers use a no-code UI to develop workflows for tasks like reservations and orders. The guides integrate with third-party applications, streamlining agents' access to external information."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Prerequisites",
              "body": [
                "For instructions on how to configure step-by-step guides in Amazon Connect, navigate to Enable Step-by-Step Guides in the Amazon Connect Administrator Guide."
              ]
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Scenario",
          "blocks": [
            {
              "type": "p",
              "text": "AnyCompany wants to empower agents with guided workflows to assist customers with fraud queries and card replacement requests. The workflows must adhere to AnyCompany’s internal processes and procedures. Mary reviews the requirements to integrate the agent application with Amazon Connect step-by-step guides. She must display a guide view that displays as soon as the contact is connected with the agent. The view must stay visible until the contact is complete after the agent's ACW. Mary will use the following five steps to perform the custom CCP development process."
            },
            {
              "type": "p",
              "text": "At the end of the lesson, you will find sample code for the functionality covered in the lesson."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Step 1: Creating a step-by-step guides container",
          "blocks": [
            {
              "type": "p",
              "text": "Mary looks at the code from the index.html file. She creates a new container id=\"guides-container\" for the step-by-step guides widget."
            },
            {
              "type": "code",
              "text": "<!-- Create div container for step-by-step guides -->\n\n<div id=\"guides-container\" style=\"width: 400px; height: 600px;\"></div>"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Step 2: Initializing the CCP",
          "blocks": [
            {
              "type": "p",
              "text": "To confirm CCP initialization when the page loads, Mary writes code to subscribe to the onload event. The following code sample shows the first step Mary takes to initialize CCP."
            },
            {
              "type": "code",
              "text": "// Connect information: Replace with your Connect Instance\n\nconst connectUrl = \"https://my-instance-name.my.connect.aws/connect\";\n\n// Add the call to init() as an onload so it will only run once the page is loaded\n\nwindow.onload = (event) => {\n\nconsole.log(\"window.onload\")\n\ntry {"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"ccp\","
            },
            {
              "type": "p",
              "text": "document.getElementById(\"customCCPDiv\"),"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/ccp-v2/\","
            },
            {
              "type": "p",
              "text": "{ style: \"width:400px; height:600px;\" }"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "} catch (error) {"
            },
            {
              "type": "p",
              "text": "console.error(\"initialization error\", error);"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "};"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Step 3: Initializing the guides view when a contact connects",
          "blocks": [
            {
              "type": "p",
              "text": "Mary modifies the \"index.js\" file to initialize the step-by-step guides using connect.agentApp.initApp(name, containerId, appUrl, config). Based on the requirements, she must call this function as soon as the contact is connected. For this to happen, she includes the initialization code in the event handler function for contact.onConnected()."
            },
            {
              "type": "p",
              "text": "The handler function code uses the initApp function to initialize the customviews app in the guides-container HTML container. The \"/stargate/app\" is the suffix for the iframe URL that loads the guides widget. The config parameter includes the display style, and the request body property called customViewsParams. Expand each of the following four categories to find out more about the request body that initializes the guides functionality."
            },
            {
              "type": "p",
              "text": "name"
            },
            {
              "type": "p",
              "text": "The first parameter represents the name of the app that uniquely identifies this integration. Mary sets the value of the initApp function to customviews."
            },
            {
              "type": "p",
              "text": "containerId"
            },
            {
              "type": "p",
              "text": "The second parameter is the identifier for the HTML Document Object Model (DOM) that contains the app inline frame (iframe). Mary sets the value to viewContainer."
            },
            {
              "type": "p",
              "text": "appUrl"
            },
            {
              "type": "p",
              "text": "The third parameter is the string URL of the app. This is the page the iframe uses to navigate to the app."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s7",
          "eyebrow": null,
          "duration": null,
          "title": "This value uses a relative path connectUrl + \"/stargate/app\"",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "config",
                "This is an optional parameter that provides additional configuration settings for the app."
              ]
            },
            {
              "type": "p",
              "text": "These settings include the following:"
            },
            {
              "type": "p",
              "text": "style: This is an optional string that supplies inline styling for the iframe. Mary sets the value of this parameter to { style: \"width:400px; height:600px;\" }."
            },
            {
              "type": "p",
              "text": "customViewsParams: This is a property available for customviews only. This configuration object associates the current contact with the guides view and flow. Additionally, it has a property called disableAutoDestroy."
            },
            {
              "type": "p",
              "text": "The customViewsParams property is used to associate the current contact id with the view. Expand each of the following four properties to find out more about how to set their values."
            },
            {
              "type": "p",
              "text": "contact"
            },
            {
              "type": "p",
              "text": "By setting this value, the code attaches the contact to the customviews application. The value can be a contact object or a contactId string. If you use a contactId, then disableAutoDestroy is set to true by default."
            },
            {
              "type": "p",
              "text": "You must use connect.core.terminateCustomView() to end the lifecycle of the customviews before closing the iframe."
            },
            {
              "type": "ul",
              "items": [
                "contactFlowId",
                "This parameter must be set to the flow ID for the customviews that the application displays."
              ]
            },
            {
              "type": "p",
              "text": "For more information, navigate to Find the Flow ID in the Amazon Connect Administrator Guide."
            },
            {
              "type": "ul",
              "items": [
                "iframeSuffix",
                "This attaches a suffix to the customviews application iframe id."
              ]
            },
            {
              "type": "p",
              "text": "This id format becomes customviews{iframeSuffix}."
            },
            {
              "type": "p",
              "text": "This parameter is useful for instantiating multiple customviews applications in a single page, and associating customviews applications with contactIds."
            },
            {
              "type": "p",
              "text": "disableAutoDestroy"
            },
            {
              "type": "p",
              "text": "When this parameter is set to true, the code does not clear the view when the connected contact is closed."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "The code must handle the lifecycle of a step-by-step customview when the setting, disableAutoDestroy, is set to true. As a developer, you must invoke terminateCustomView() to make sure you do not impact service quota. Contact interactions using guides count against chat concurrency. The guide remains active until it either reaches the configured duration or the Show view block timeout value expires."
              ]
            },
            {
              "type": "p",
              "text": "The following code snippet shows sample values for the parameters used to initialize the custom view for step-by-step guides."
            },
            {
              "type": "code",
              "text": "// Get the HTML element for step-by-step guides\n\nvar viewcontainer = document.getElementById(\"customviews-container\");\n\nvar acwContainer = document.getElementById('customviews-acw');\n\nfunction handleContactConnected(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactConnected() - Contact connected to agent');\n\nif (contact) {"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"customviews\","
            },
            {
              "type": "p",
              "text": "viewcontainer,"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/stargate/app\","
            },
            {
              "type": "p",
              "text": "{"
            },
            {
              "type": "p",
              "text": "style: \"width:850px; height:500px;\","
            },
            {
              "type": "p",
              "text": "customViewsParams: {"
            },
            {
              "type": "p",
              "text": "contact: contact,"
            },
            {
              "type": "p",
              "text": "contactFlowId: \"a1b2c3d4-5678-90ab-cdef-EXAMPLEaaaaa\","
            },
            {
              "type": "p",
              "text": "iframeSuffix: `${contact.getContactId()}-a1b2c3d4-5678-90ab-cdef-EXAMPLEaaaaa`,"
            },
            {
              "type": "p",
              "text": "disableAutoDestroy: false,"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "logInfoEvent(\"[contact.onConnected] Contact connected to agent. Contact state is \" + contact.getStatus().type);"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "logInfoEvent(\"[contact.onConnected] Contact connected to agent. Null contact passed to event handler\");"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "Because the disableAutoDestroy property is set to false, the customview does not need to be cleaned up by using the terminatecustomview(). Mary must hide the view when the contact ends so she can display the disposition guide. To achieve this, Mary creates a handler function that runs when the contact ends. The sample code shows the container that displays the guide set to none, which means it won't be visible on the screen."
            },
            {
              "type": "code",
              "text": "function handleContactEnded(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactEnded() - Contact has ended successfully');\n\nif (contact) {\n\nviewcontainer.style.display = 'none';\n\nlogInfoEvent(\"[contact.onEnded] Contact has ended. Contact state is \" + contact.getStatus().type);\n\n} else {\n\nlogInfoEvent(\"[contact.onEnded] Contact has ended. Null contact passed to event handler\");\n\n}\n\n}"
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step 4: Initializing the guides at the end of the call",
          "blocks": [
            {
              "type": "p",
              "text": "Mary continues to review the requirements. AnyCompany wants to measure agent performance through a post-contact survey. Mary modifies the index.js file to launch a guided workflow when the contact is in ACW state. The ACW state occurs when the caller disconnects. Mary writes code to initialize the step-by-step guides in the event listener function for contact onACW. The following example shows a function handler for the onACW event."
            },
            {
              "type": "code",
              "text": "function handleContactACW(contact) {\n\nif (contact) {\n\nconsole.log('[contact.onACW] Contact is on ACW ended. Contact state is ' + contact.getStatus().type);"
            },
            {
              "type": "p",
              "text": "connect.agentApp.initApp("
            },
            {
              "type": "p",
              "text": "\"customviews\","
            },
            {
              "type": "p",
              "text": "document.getElementById(\"guides-container\"),"
            },
            {
              "type": "p",
              "text": "connectUrl + \"/stargate/app\","
            },
            {
              "type": "p",
              "text": "{"
            },
            {
              "type": "p",
              "text": "style: \"width:850px; height:550px;\","
            },
            {
              "type": "p",
              "text": "customViewsParams: {"
            },
            {
              "type": "p",
              "text": "contact: contact,"
            },
            {
              "type": "p",
              "text": "contactFlowId: \"a1b2c3d4-5678-90ab-cdef-EXAMPLEbbbbb\","
            },
            {
              "type": "p",
              "text": "iframeSuffix: `${contact.getContactId()}-a1b2c3d4-5678-90ab-cdef-EXAMPLEbbbbb`,"
            },
            {
              "type": "p",
              "text": "disableAutoDestroy: true"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "console.log('[contact.onACW] Contact is on ACW ended. Null contact passed to event handler');"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "Because the disableAutoDestroy configuration option is set to true, Mary should handle the cleanup of the guides view next."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Step 5: Cleaning the view the onACW event handler",
          "blocks": [
            {
              "type": "p",
              "text": "To handle the lifecycle of the post-contact customview, Mary writes code to invoke connect.core.terminateCustomView in the event listener function for contact.onDestroy. The onDestroy event is published after ACW when the contact is cleared from the agent application."
            },
            {
              "type": "code",
              "text": "//onACW initApp for customviews has disableAutoDestroy set to true, you must manually terminate the customview\n\nfunction handleContactDestroyed(contact) {\n\nconsole.debug('CDEBUG >> ContactEvents.handleContactDestroyed() - Contact will be destroyed');\n\nlogInfoEvent(\"[contact.onDestroy] Contact is Destroyed\");\n\nif (contact) {"
            },
            {
              "type": "p",
              "text": "connect.core.terminateCustomView("
            },
            {
              "type": "p",
              "text": "connectUrl,"
            },
            {
              "type": "p",
              "text": "`${contact.getContactId()}-a1b2c3d4-5678-90ab-cdef-EXAMPLEbbbbb`,"
            },
            {
              "type": "p",
              "text": "{"
            },
            {
              "type": "p",
              "text": "resolveIframe: true,"
            },
            {
              "type": "p",
              "text": "timeout: 30000,"
            },
            {
              "type": "p",
              "text": "hideIframe: false"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": ");"
            },
            {
              "type": "p",
              "text": "logInfoEvent(\"[contact.onDestroy] Contact is destroyed. Contact state is \" + contact.getStatus().type);"
            },
            {
              "type": "p",
              "text": "} else {"
            },
            {
              "type": "p",
              "text": "logInfoEvent(\"[contact.onDestroy] Contact is connecting. Null contact passed to event handler\");"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "}"
            },
            {
              "type": "p",
              "text": "After a quick break, Mary is ready to start testing her code in a test page. After she confirms the code works, she can embed it in the agent application’s webpage. Then, she can design the look and feel of the new step-by-step guides."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t7-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Step 6: Testing the code",
          "blocks": [
            {
              "type": "p",
              "text": "Martha Rivera, an experience designer at AnyCompany, creates a contact flow that includes custom guides' view for the following four agent workflows:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Review transaction history"
            },
            {
              "type": "ul",
              "items": [
                "Request replacement card",
                "Temporarily block card"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Apply for a new credit card"
            },
            {
              "type": "p",
              "text": "Martha shares the contact flow identifier with Mary. Mary updates the contact flow identifier in her code to associate the guides view with the flow. Then she places a test call in the queue. As soon as the call is connected, her test webpage displays the step-by-step guides. The following image shows Mary's test page that displays the guide view as soon as the contact connects."
            },
            {
              "type": "p",
              "text": "To download the sample code for this test page, choose anywhere inside the following box."
            },
            {
              "type": "ul",
              "items": [
                "step-by-step-guides-sample-code.zip",
                "152.1 KB",
                "Check your knowledge"
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you explored options to implement Amazon Step-by-step guide functionality in web applications. Continue to the next lesson to review the course summary and prepare for the end-of-course assessment. Lesson 9 of 12"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-custom-ccp-intermediate-t7-q1",
          "question": "A developer must add a custom guide view to an existing webpage. The view should display when a contact is presented to the agent, and be hidden when the contact disconnects. What are the first steps the developer must follow to implement this requirement? (Select TWO.) (Select all that apply: Initialize the view in the onIncomming handler. / Cleanup the view in the onACW handler. / Initialize the view in the onConnected handler. / Initialize the view in the onACW handler. / Cleanup the view in the onContactDestroyed handler.)",
          "options": [],
          "answer": "Initialize the view in the onIncomming handler.; Cleanup the view in the onContactDestroyed handler.. The view must be initialized in the onIncoming handler function because of the requirement to display the guides when the contact is presented to the agent. The view will be hidden if the code is implemented in the onContactDestroyed handler."
        }
      ]
    },
    {
      "id": "connect-custom-ccp-intermediate-t8",
      "number": 8,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this course, you learned about Amazon Connect Streams. It’s a feature of Amazon Connect that offers organizations the flexibility to expand and…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t8-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Course summary",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you learned about Amazon Connect Streams. It’s a feature of Amazon Connect that offers organizations the flexibility to expand and customize the built-in functionality for agent applications. Take a moment to review these key concepts in the course summary before taking the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Benefits"
            },
            {
              "type": "p",
              "text": "The Amazon Connect Streams APIs offer organizations the ability to create custom agent experiences within their web applications. Streams offer access to real-time call and chat events, agent assist, and case management. Developers can meet various functional and business needs with Streams' support for multi-layered integrations."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Architecture"
            },
            {
              "type": "p",
              "text": "The Streams architecture is comprised of four layers."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Connect CTI Service"
            },
            {
              "type": "p",
              "text": "This layer handles requests and raises events."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Application Integration",
          "blocks": [
            {
              "type": "p",
              "text": "This layer provides methods and event buses for integrating Amazon Connect functionality within external web applications."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s3",
          "eyebrow": null,
          "duration": null,
          "title": "CCP",
          "blocks": [
            {
              "type": "p",
              "text": "This layer authenticates agents and passes information between the application and the Connect Shared Worker."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Connect Shared Worker",
          "blocks": [
            {
              "type": "p",
              "text": "This layer synchronizes data across different service components, making sure agent status and configuration updates are reflected across all open tabs, iframes, and connected application pages."
            },
            {
              "type": "h",
              "level": 4,
              "text": "APIs"
            },
            {
              "type": "p",
              "text": "Core API"
            },
            {
              "type": "p",
              "text": "Developers can initialize the CCP, subscribe to events like onload, configure softphone settings, and customize the CCP's display in the settings tab. This API offers integration of the built-in CCP in external applications, and synchronization of agent and contact updates."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Agent API",
          "blocks": [
            {
              "type": "p",
              "text": "The Agent API provides event subscription and methods to manage agent states. Developers handle events like state changes, routable or non-routable events, and errors. They can create handlers for state changes and agent availability. Additionally, the API can programmatically set the agent's availability using the setState method."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Contact API",
          "blocks": [
            {
              "type": "p",
              "text": "The Contact API offers event subscription and methods to manage contact states. Developers handle events like onIncoming, onConnected, and onEnded, and perform actions such as answering or disconnecting calls. The API also programmatically retrieves contact details like caller name, phone number, and queue name."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Additional functionality"
            },
            {
              "type": "p",
              "text": "Customer Profiles"
            },
            {
              "type": "p",
              "text": "Customer Profiles offers agents real-time access to customer data for personalized interactions. The functionality of Customer Profiles delivers capabilities such as search and display of relevant customer information. Developers can integrate this functionality using Streams with either the built-in, or a custom widget via the Customer Profiles JavaScript library."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Q in Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Q in Connect uses generative AI to suggest responses and actions, enhancing issue resolution and customer satisfaction. Developers can integrate this functionality into their applications using Streams. They can initialize the built-in Amazon Q in Connect widget or create a custom widget using the Amazon Q in Connect JavaScript library. The custom widget offers tailored recommendations based on the conversation and relevant knowledge content."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t8-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Step-by-step guides",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect provides step-by-step guides that help agents navigate contact requests efficiently. Developers can embed guides into their applications using Streams. The guide displays when a contact connects and stays visible until after-call work is done."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-custom-ccp-intermediate-t9",
      "number": 9,
      "title": "Course summary",
      "shortTitle": "Course summary",
      "summary": "The Amazon Connect Streams APIs offer organizations the ability to create custom agent experiences within their web applications. Streams offer…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-custom-ccp-intermediate-t9-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits",
          "blocks": [
            {
              "type": "p",
              "text": "The Amazon Connect Streams APIs offer organizations the ability to create custom agent experiences within their web applications. Streams offer access to real-time call and chat events, agent assist, and case management. Developers can meet various functional and business needs with Streams' support for multi- layered integrations."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t9-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Architecture",
          "blocks": [
            {
              "type": "p",
              "text": "The Streams architecture comprises four layers:"
            },
            {
              "type": "p",
              "text": "Amazon Connect CTI Service: Handles requests and raises events."
            },
            {
              "type": "p",
              "text": "Application Integration: Provides methods and event buses for integrating Amazon Connect functionality within external web applications."
            },
            {
              "type": "p",
              "text": "CCP: Authenticates agents and passes information between the application and the Connect Shared Worker."
            },
            {
              "type": "p",
              "text": "Connect Shared Worker: Synchronizes data across different service components, ensuring agent status and configuration updates are reflected across all open tabs, iframes, and connected application pages."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t9-s3",
          "eyebrow": null,
          "duration": null,
          "title": "APIs",
          "blocks": [
            {
              "type": "p",
              "text": "Core API: Developers can initialize the CCP, subscribe to events like onload, configure softphone settings, and customize the CCP's display in the settings tab. This API offers integration of the built-in CCP in external applications, and synchronization of agent and contact updates."
            },
            {
              "type": "p",
              "text": "Agent API: The Agent API provides event subscription and methods to manage agent states. Developers handle events like state changes, routable or non-routable events, and errors. They can create handlers for state changes and agent availability. Additionally, the API can programmatically set the agent's availability using the setState method."
            },
            {
              "type": "p",
              "text": "Contact API: The Contact API offers event subscription and methods to manage contact states. Developers handle events like onIncoming, onConnected, and onEnded, and performs actions such as answering or disconnecting calls. The API also programmatically retrieves contact details like caller name, phone number, and queue name."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t9-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Additional functionality",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Customer Profiles"
            },
            {
              "type": "p",
              "text": "Amazon Connect Customer Profiles offers agents real-time access to customer data for personalized interactions. The functionality of Customer Profiles delivers capabilities such as search and display of relevant customer information. Developers can integrate this functionality using Streams with either the built-in, or a custom widget via the Customer Profiles JavaScript library."
            }
          ]
        },
        {
          "id": "connect-custom-ccp-intermediate-t9-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Q in Connect",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Q in Connect uses generative AI to suggest responses and actions, enhancing issue resolution and customer satisfaction. Developers can integrate this functionality into their applications using Streams. They can initialize the built-in Amazon Q in Connect widget or create a custom widget using the Amazon Q in Connect JavaScript library. The custom widget offers tailored recommendations based on the conversation and relevant knowledge content."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step-by-Step Guides"
            },
            {
              "type": "p",
              "text": "Amazon Connect provides step-by-step guides that help agents navigate contact requests efficiently."
            },
            {
              "type": "p",
              "text": "Developers can embed guides into their applications using Streams. The guide displays when a contact connects, and stays visible until after-call work is done."
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
