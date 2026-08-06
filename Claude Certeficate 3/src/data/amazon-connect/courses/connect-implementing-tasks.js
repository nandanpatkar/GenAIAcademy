/*
 * Amazon Connect — Implementing Tasks in Amazon Connect
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT IMPLEMENTING TASKS IN CONNECT.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-implementing-tasks",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Implementing Tasks in Amazon Connect",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "Channels",
  "description": "Configuring and creating tasks, orchestrating them with prebuilt integrations and rules, and reporting on task contacts.",
  "examFormat": "8 topics · ~51 min · 8 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT IMPLEMENTING TASKS IN CONNECT.txt"
  ],
  "modules": [
    {
      "id": "connect-implementing-tasks-t1",
      "number": 1,
      "title": "Introduction to Amazon Connect Tasks",
      "shortTitle": "Introduction to Amazon Connect Tasks",
      "summary": "Many organizations with contact centers face significant challenges in prioritizing, assigning, and tracking work items across disparate…",
      "duration": "~12 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Many organizations with contact centers face significant challenges in prioritizing, assigning, and tracking work items across disparate applications in their customer experience tools. A call or chat can often be just the starting point for all the work that an agent needs to complete the case or customer experience. Without visibility of all the work, managers struggle to effectively schedule and staff their contact center."
            },
            {
              "type": "p",
              "text": "That is where Amazon Connect Tasks comes in. In this course, you will explore how you can implement Amazon Connect Tasks to manage tasks and automate processes. It can also provide valuable metrics and insights to help effectively manage your agents' time while improving your customer's experience."
            },
            {
              "type": "p",
              "text": "Because Amazon Connect is an omnichannel contact center, it provides a seamless experience, working between communication channels: calls, chats, and tasks. Your agents can create and complete tasks in the same user interface that they use for calls and chats. Amazon Connect Tasks is a highly flexible and customizable channel, providing task management and endless opportunities to automate business processes."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "What is Amazon Connect Tasks?",
          "blocks": [
            {
              "type": "p",
              "text": "A task is a unit of work that an agent must complete or a business procedure completes."
            },
            {
              "type": "p",
              "text": "Amazon Connect Tasks is a feature of Amazon Connect. A task is a unit of work that an agent or an automated business process must complete. A task is routed, prioritized, assigned, and tracked like voice and chat. With Amazon Connect Tasks, your agents can create and complete tasks that originated from various sources. Supervisors or agents can create and assign tasks to themselves and others, or use workflows to automate tasks that don't require agent interaction."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Common contact center challenges",
          "blocks": [
            {
              "type": "p",
              "text": "Contact center agents can receive tasks in many different ways. It can be through verbal instructions, emails, notes, web forms, business applications, customer relationship management (CRM) systems, ecommerce, ticketing systems, and customer conversations or chats. Because the work is spread across many disparate systems, it is hard for agents to keep track and understand which task is the highest priority. Agents might rely on memory, handwritten notes, and to-do lists to keep track of these essential tasks and follow-up items. Manual tracking is time-consuming and error prone. That, in turn, reduces productivity and increases the likelihood that tasks get lost, which can decrease customer satisfaction and erode customer trust."
            },
            {
              "type": "p",
              "text": "Another major challenge for contact centers is the lack of visibility of agents' tasks and their hours of work outside of calls and chats. That makes it challenging to schedule and manage their agents' time and priorities effectively. Teams can struggle to identify and automate everyday repetitive tasks without visibility and data. Many of these tasks originate from their business applications, and some could be automated, helping agents save time. An example would be sending an email or SMS to notify a customer of their order status or upcoming installation."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Tasks addresses these common contact center challenges and also provides several other beneﬁts. One significant benefit is to provide time tracking and metrics for your contact center. With this data and insights, you can quantify the workload and understand where your agents spend their time. This helps you identify the opportunities for automating manual processes and redundant tasks, improving agent efficiency and productivity."
            },
            {
              "type": "p",
              "text": "Benefits include improving agent productivity, automating business processes, reducing contact center costs, and increasing customer satisfaction."
            },
            {
              "type": "p",
              "text": "Amazon Connect Tasks can automate business processes across multiple systems, providing seamless task management and metrics. This allows for a more complete understanding of the amount of work in any business application, not just time in calls and chats. This lets you schedule more accurately and run a more efficient contact center. That, in turn, helps reduce contact center costs."
            },
            {
              "type": "p",
              "text": "Using tasks can increase customer satisfaction as agents work more efficiently and issues are more quickly resolved. Tasks spanning multiple systems are completed and are less likely to get overlooked. By reducing repetitive tasks that don't require their time, agents can spend more time interacting with customers, increasing customer satisfaction."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed some of the benefits of using Amazon Connect Tasks, let's look at how it works."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "How do tasks in Amazon Connect work?",
          "blocks": [
            {
              "type": "p",
              "text": "Let's look at an example, an agent creating a task. Maria Garcia is an agent at AnyCompany Bank and handles mortgage and loan applications as a financial adviser. When Maria gets a customer call, she verifies the customer status and credit history, which are essential prerequisites to a successful loan application. But the actual application is not reviewed and approved by the agent. Instead, Maria has to create a request for a specialist in the bank loan department to process the application. The loan specialists are not working directly with customers, like the agents in the contact center are. Therefore, the loan specialists are considered back office processors of tasks. After Maria completes the verification process, she creates a task for the loan department and asks the caller if there is anything else she can help with."
            },
            {
              "type": "p",
              "text": "Customer calls contact center and is routed to an agent, Maria Garcia. Maria creates a task in the CCP and routes it to a specialist in the loan department."
            },
            {
              "type": "p",
              "text": "The loan specialists can process tasks using the web interface Contact Control Panel (CCP). With this same CCP, they can signal when they are ready to process new requests, take breaks, or end their work by logging out of the CCP. Their managers now have complete visibility into the number of tasks they are working on and the amount of time spent to complete each task. With the pay-per-use model, the back office workers can use the same routing engine and contact flow configuration to optimize their processes using the same tools as the contact center teams."
            },
            {
              "type": "p",
              "text": "After Maria disconnects from the call, if the system identifies the customer as a survey candidate, it asks them to rate their experience. If the customer responds with a low rating, the contact flow can be configured to automatically create a notification task for the supervisor, and include the call details. So the supervisor can review the call details and determine the appropriate action, which could be to call the customer back to remedy the situation."
            },
            {
              "type": "p",
              "text": "Suppose the supervisor reviewed the call and determined that the reason for the poor customer satisfaction was the way Maria handled the call. In that case, the manager can assign a specific training course to Maria. In this case, a task can be used to provide the course assignment. The digital materials are included in the task that Maria receives and acts on when the queues become less busy and she has time to review the digital materials."
            },
            {
              "type": "p",
              "text": "Manager reviews call details and creates a task for agent, includes the training materials in the task, and agent reviews training and marks the task complete."
            },
            {
              "type": "p",
              "text": "Alternatively, the administrator can set up Contact Lens for Amazon Connect to analyze the conversation between Maria and the customer. Contact Lens can be used to perform sentiment analysis, detect issues, and automatically categorize contacts. The administrator can also set up rules to automatically create a task and notify the supervisor of potentially poor quality of service delivered by Maria during the loan application call."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Features of Amazon Connect Tasks",
          "blocks": [
            {
              "type": "p",
              "text": "There are several features included with Amazon Connect Tasks that provide insights and metrics, making it quick to locate task information and details."
            },
            {
              "type": "p",
              "text": "Provide real-time and historical metrics, search completed and outstanding tasks, automate repetitive tasks, and schedule future tasks."
            },
            {
              "type": "p",
              "text": "Like the real-time and historical metrics that you use with voice calls and chats, tasks have similar reports to provide task data. The data lets you see how long an agent worked on a task and the time from creation to completion. And you can create custom service levels to align with your business goals. You can also use the contact search to locate specific task details for completed and outstanding tasks. By analyzing the metrics and data, managers can identify and automate repetitive tasks to save time and improve efficiency. Another feature is scheduling tasks in the future—for example, to call a customer back on a particular date or time to provide an update."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Why choose Amazon Connect Tasks?",
          "blocks": [
            {
              "type": "p",
              "text": "Because Amazon Connect Tasks can be used in many different ways, there are several areas to consider when deciding to implement. Here are some questions to consider to see if Amazon Connect Tasks can help your contact center."
            },
            {
              "type": "p",
              "text": "Do your agents have action items that they keep track of after calls or chats are completed? Are these tracked manually?"
            },
            {
              "type": "p",
              "text": "Do your agents spend time away from customer calls or chats completing work in a CRM or external applications?"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Do your agents struggle to understand which action items are highest priority?",
          "blocks": [
            {
              "type": "p",
              "text": "Do your agents rely on memory or hand-written notes to track work to-dos and follow-up items?"
            },
            {
              "type": "p",
              "text": "Would you benefit from automatically routing tasks to the appropriate high-skilled agents?"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Are there processes that your agents are doing manually that could be automated?",
          "blocks": [
            {
              "type": "p",
              "text": "Are there reminders or to-dos that you could automate for your agents based on phrases or words said on customer calls?"
            },
            {
              "type": "p",
              "text": "Are you looking for more insight into your agents' productivity to complete all the work items in their customer interactions?"
            },
            {
              "type": "p",
              "text": "Do you have work items you need to distribute based on skill sets while optimizing processing time?"
            },
            {
              "type": "p",
              "text": "Do you need to route action items to nonagents, specialists, or other team members?"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Tasks use cases",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Tasks can integrate with third-party applications, which creates a possibility of endless use cases. To help get you started, here are a few common ones."
            },
            {
              "type": "p",
              "text": "To learn more about how Amazon Connect Tasks helps with each of these areas in your contact center, choose the + symbol to expand each of the following eight use cases."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Automate business processes",
          "blocks": [
            {
              "type": "p",
              "text": "There are a variety of ways to automate business processes using Amazon Connect Tasks. Supervisors or administrators can use workflows to automate tasks that don't require agent interaction, like notifying a customer when their claim is processed and a refund has been issued."
            },
            {
              "type": "p",
              "text": "You can use built-in connectors with CRM applications like Salesforce and Zendesk. With just a few steps, you can integrate to create tasks that are routed to agents or automated to completion. You can configure rules with conditions to automatically create a task—for example, when a new ticket is created in Zendesk."
            },
            {
              "type": "p",
              "text": "For custom applications without built-in connectors, you can use the task API to create tasks programmatically and route them to agents or have the task automated to completion."
            },
            {
              "type": "p",
              "text": "Automate business processes."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Follow up with customers",
          "blocks": [
            {
              "type": "p",
              "text": "An agent responds to voicemails, emails, or follow-up actions from back-office systems and uses tasks to track and complete the tasks for their customer interactions. Tasks help ensure that work is completed and provide metrics for the amount of time it takes. This can include sending product information to a customer after a call or following up with external vendors and notifying customers of their status."
            },
            {
              "type": "p",
              "text": "Follow up with customers."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Call back abandoned customers",
          "blocks": [
            {
              "type": "p",
              "text": "A customer drops from the queue, and a task can be automatically generated and routed to an agent to call that customer back to ensure that all their questions were answered. This is one way that a task can be used to have an agent place the call manually."
            },
            {
              "type": "p",
              "text": "Customer disconnected and agent receives task and calls customer."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s14",
          "eyebrow": null,
          "duration": null,
          "title": "Respond to a \"Call me\" request",
          "blocks": [
            {
              "type": "p",
              "text": "Your customer chooses a \"Call me\" option on your website that creates a task with the customer's phone number. The agent receives the task, loads the customer profile to prepare for the call, and calls the customer back."
            },
            {
              "type": "p",
              "text": "Customer chooses call me option on website and a task with details is sent to agent."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s15",
          "eyebrow": null,
          "duration": null,
          "title": "Respond to sign-ups or lead generation",
          "blocks": [
            {
              "type": "p",
              "text": "In this use case, a customer signs up for a quote online. An agent receives the quote details through an automatically generated task and gets back to the customer with more information."
            },
            {
              "type": "p",
              "text": "Customer signs up for a quote online and agent receives a task with quote details and contacts customer."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s16",
          "eyebrow": null,
          "duration": null,
          "title": "Respond to escalations or surveys",
          "blocks": [
            {
              "type": "p",
              "text": "Your customer fills out a post-call or chat survey, and the score is low based on your business standard. A task is automatically generated and routed to a supervisor for review of that call or chat for analysis and proactive reach-out to that customer."
            },
            {
              "type": "p",
              "text": "Responding to escalations or surveys."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s17",
          "eyebrow": null,
          "duration": null,
          "title": "Manage quality",
          "blocks": [
            {
              "type": "p",
              "text": "An agent does not comply with standard messaging during a call (for example, saying \"this call may be recorded\" or using the proper greeting). So a task is automatically generated and routed to a QA specialist to review the call recording."
            },
            {
              "type": "p",
              "text": "Managing quality."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t1-s18",
          "eyebrow": null,
          "duration": null,
          "title": "Prioritize, assign, and track work across disparate applications",
          "blocks": [
            {
              "type": "p",
              "text": "Administrators can create call flows to prioritize and assign tasks based on information within the tasks, like priority, type, origination, agent skill set, and availability. They can ensure that they assign the tasks to the right agent at the right time, to help improve work distribution and balance work in the contact center. The contact flow can dynamically reprioritize and reroute tasks based on information within the task, time in queue, and channel type to ensure the customer service tasks are completed on time."
            },
            {
              "type": "p",
              "text": "Prioritize, assign, and track work across disparate applications."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Amazon Connect Tasks experience"
            },
            {
              "type": "p",
              "text": "Let's look at the tasks experience from the agent's perspective. Amazon Connect provides a unified agent experience for all the agent's tasks in the CCP. Whether the agent created the task, the manager assigned the task, or the task was generated by a business application linked to Amazon Connect, the task notification is received in the agent's CCP. The task tab (briefcase icon) is displayed in the upper-right corner. The agent reviews the task information, completes the task, or transfers the task using the transfer task button. When the agent completes the work, they choose the End task button at the bottom of the panel. The next interaction that the agent is assigned to work on will arrive, and the process repeats."
            },
            {
              "type": "p",
              "text": "To learn more about the Amazon Connect Tasks experience, choose each of the five markers."
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-implementing-tasks-t1-q1",
          "question": "Take a minute to check your understanding of the content covered in this lesson. Select the correct answers and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to a correct answer. Press the space bar to select. Repeat this step until all correct responses are checked, then press Enter to submit. Amazon Connect Tasks can be used to follow up with customers. What are three other ways that tasks can be used in your contact center? (Select THREE.) (Select all that apply: To respond to website forms, \"call me\" options, and sign-ups / To record customer calls for training purposes / To automate business processes or repetitive tasks / To respond to escalations or surveys / To group one or more queues together / To route a call or chat to a qualified agent)",
          "options": [],
          "answer": "To respond to website forms, \"call me\" options, and sign-ups; To automate business processes or repetitive tasks; To respond to escalations or surveys. Amazon Connect tasks can automate business processes, respond to website forms or \"Call me\" options, respond to escalations or surveys, and increase agent efficiency and productivity."
        }
      ]
    },
    {
      "id": "connect-implementing-tasks-t2",
      "number": 2,
      "title": "Configure and Set Up Amazon Connect Tasks",
      "shortTitle": "Configure and Set Up Amazon Connect Tasks",
      "summary": "Amazon Connect uses the same routing profiles for voice, chats, and tasks. So it's straightforward to remember where to go to configure and set up…",
      "duration": "~7 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect uses the same routing profiles for voice, chats, and tasks. So it's straightforward to remember where to go to configure and set up your contact center when you want to use tasks. In this lesson, you will learn how to configure your agent's routing profile for tasks, create quick connects, set your agent capacity, and add channel priorities or delays for tasks in Amazon Connect."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring the agent routing profile for tasks",
          "blocks": [
            {
              "type": "p",
              "text": "One of the first steps to set up Amazon Connect Tasks is configuring your agent's routing profile to use tasks. You can include the ability to manage and create tasks. When you configure your agent's routing profile for tasks, you activate the assignment and routing of tasks. Agents still need to be available to receive the tasks."
            },
            {
              "type": "p",
              "text": "1. In the Amazon Connect administrative interface, on the left navigation pane, choose Users, Routing profiles."
            },
            {
              "type": "ul",
              "items": [
                "Administration console menu, Users, Routing profile.",
                "2. Choose the routing profile where you want to use tasks."
              ]
            },
            {
              "type": "p",
              "text": "Pointer selects applications routing profile from the list."
            },
            {
              "type": "p",
              "text": "3. In the Select a channel section, select the Task check box and enter the capacity or the number of tasks per agent. (The maximum number of tasks per agent is 10.)"
            },
            {
              "type": "p",
              "text": "The Task box is checked and the maximum tasks per agent is set to 3."
            },
            {
              "type": "p",
              "text": "4. In the Queues section, select the Task check box on the specific queues where you want to use tasks. Then choose Save."
            },
            {
              "type": "p",
              "text": "The Tasks channel is checked."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Setting agent capacity"
            },
            {
              "type": "p",
              "text": "Agents can be available concurrently on voice, chat, and tasks at the same time. By setting the capacity, or the number of tasks an agent can be assigned, you can help distribute the tasks evenly across agents. The maximum number of tasks per agent is 10. (Capacity is set in step 3 in the previous section.)"
            },
            {
              "type": "p",
              "text": "Let's look at an example. At AnyCompany Bank's loan applications department, Maria is assigned the Applications routing profile. This routing profile is configured for voice, and has the capacity set for up to two chats and up to three tasks. When Maria logs in, she can be routed a voice call, chat, or task. However, when she is on a voice call, no more voice calls, chats, or tasks are routed to her until she completes the call. If Maria accepts a task first, up to three tasks will be routed to her, but no voice calls or chats. After she completes the tasks, she is available for the next contact, which could be voice, chat, or tasks."
            },
            {
              "type": "p",
              "text": "AnyCompany’s contact center shows calls, chats, and tasks in queues. Agent profile for applications has tasks routed to Maria."
            },
            {
              "type": "p",
              "text": "Setting channel priorities and delays"
            },
            {
              "type": "p",
              "text": "Next, let's look at priorities and delays. When configuring your agent routing profile, you can specify a channel priority or a delay. Priorities and delays give you the control to determine the order in which voice, chat, and tasks are handled. If you assign a task to a queue, and phone calls and chats have a higher priority, the tasks will wait until all the phone calls and chats have been completed before they reach an agent."
            },
            {
              "type": "p",
              "text": "The Mortgages and Loans queues have a priority 1 for voice channel."
            },
            {
              "type": "p",
              "text": "So depending on your business needs, you can specify priorities or delays for tasks so that they reach your agents in the order that makes sense for your business. To add different priorities and delays on channels in the same routing profile, you can add an additional line for the profile. And then specify the priority or delay for each channel as needed. (See step 4 in the previous section)."
            },
            {
              "type": "p",
              "text": "In the queues section of the profile dialog box, the Applications queue is listed twice and the priority for the tasks channel is set to 2."
            },
            {
              "type": "p",
              "text": "Setting up agents with a quick connect"
            },
            {
              "type": "p",
              "text": "Depending on your business needs, you might want to set up Amazon Connect Tasks so that agents can create tasks. For example, an agent could create a task to ensure follow-up work is not forgotten, such as calling a customer back to provide a status update on a customer issue. When an agent creates a task, it also provides metrics that provide insights for staffing."
            },
            {
              "type": "p",
              "text": "For an agent to be able to create a task for themselves or to receive a task, they need a quick connect created. With this quick connect, agents will be able to assign tasks to themselves, and other agents will be able to assign tasks to them. There are three parts in the process that an administrator would use to set up a quick connect for an agent. The first step is to create a quick connect for the agent. The second step is to create a queue for the agent and associate the quick connect. The third step is to add the queue to the agent's routing profile."
            },
            {
              "type": "p",
              "text": "The following video explains how to set up an agent to create and assign their own tasks. To watch the video, choose the play button."
            },
            {
              "type": "p",
              "text": "To view the video transcript, expand the + symbol."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Create an agent quick connect video transcript",
          "blocks": [
            {
              "type": "p",
              "text": "In this demonstration, we will walk through how to set up agents to assign tasks to themselves. There are three parts to this process. In the first part, we will create a quick connect for the agent. In the second part, we will create a queue for the agent, and associate the quick connect. In the third part, we will add the queue to the agent's routing profile."
            },
            {
              "type": "p",
              "text": "The first part of the process is to create a quick connect for the agent. To get started, open the Amazon Connect administrative interface and on the left navigation pane, choose the Routing icon, and scroll to Quick connects. Then choose the Add new button. Enter a name for the quick connect, such as the name of the agent."
            },
            {
              "type": "p",
              "text": "For our example, we want María García to be able to assign tasks to herself, so we will name the quick connect MariaGarcia. Under Type, use the dropdown list to choose Agent. Under Destination, use the dropdown list to choose the user name for the agent. Under Contact flow, choose Default agent transfer, or the appropriate contact flow for your contact center. Under Description, enter a description such as Maria Garcia's Quick Connect. Then choose Save."
            },
            {
              "type": "p",
              "text": "The second part of the process is to create a queue for the agent and associate the quick connect. To do this, you go to Routing, then Queues, and choose Add queue. Name the queue Maria Garcia. And set hours of operation to Basic Hours. Then add the quick connect MariaGarcia from the dropdown list. And choose Save."
            },
            {
              "type": "p",
              "text": "Now you're ready to add the queue to the agent's routing profile. Go to Users, then Routing profiles. Choose the routing profile that you want to use for Maria by selecting the Name field. This displays the edit routing profile window. In the Queues section, add the agent's queue to the routing profile by choosing Add Queue, and selecting Maria Garcia's queue from the dropdown list. Choose Task for the channel. And if needed, set priority and delay. And choose Save."
            },
            {
              "type": "p",
              "text": "This concludes the walkthrough of how to set up agents to assign tasks to themselves. You created the quick connect, created a queue for the agent, and associated the quick connect. Then you added the queue to the agent's user profile."
            },
            {
              "type": "p",
              "text": "To bookmark the steps to create a quick connect (and assign it to a queue), see Set up agents to assign tasks to themselves."
            },
            {
              "type": "p",
              "text": "By default, all agents can create tasks. If you want to block permissions for some agents, assign the CCP Restrict task creation permission in their security profile. To learn more, see Block agents from creating tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Testing tasks",
          "blocks": [
            {
              "type": "p",
              "text": "After you have set up tasks, if you want to test, you can use these steps within Amazon Connect. The same steps can be used for voice, chat, or tasks. These steps permit you to see what the task experience will be like for your agents as you do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Create a quick connect.",
                "Assign it to a queue.",
                "Assign the queue to the agent's routing profile.",
                "Test it by creating a task and accepting the task.",
                "Check your knowledge"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-implementing-tasks-t2-q1",
          "question": "Take a minute to check your understanding of the content covered in this lesson. Select the correct answer and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to the correct answer. Press the space bar to select, and press Enter to submit. What is the capacity or the maximum number of tasks that an agent can be assigned?",
          "options": [
            {
              "id": "A",
              "text": "Five tasks"
            },
            {
              "id": "B",
              "text": "Ten tasks"
            },
            {
              "id": "C",
              "text": "Fifteen tasks"
            },
            {
              "id": "D",
              "text": "Unlimited tasks"
            }
          ],
          "correctOptionId": "B",
          "rationale": "When you add tasks to an agent’s routing profile, you can specify up to 10 tasks to be assigned to them at a time."
        }
      ]
    },
    {
      "id": "connect-implementing-tasks-t3",
      "number": 3,
      "title": "Create Amazon Connect Tasks",
      "shortTitle": "Create Amazon Connect Tasks",
      "summary": "Because no two customers are alike, the various systems they use to run their businesses are also unique. With multiple systems, tracking tasks to…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Because no two customers are alike, the various systems they use to run their businesses are also unique. With multiple systems, tracking tasks to provide a seamless customer experience can be challenging. Amazon Connect offers many ways to create tasks to support the action items you need from business applications, CRM systems, or while using Amazon Connect. In this lesson, you will learn how to create Amazon Connect tasks. The following lessons will cover the remaining ways to create tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Different ways to create tasks",
          "blocks": [
            {
              "type": "p",
              "text": "In the previous lesson, you reviewed how to configure your agent's routing profile to use tasks. In the following lessons, you will review the different ways that you can create tasks. There are several ways to create tasks for Amazon Connect. The first three ways create tasks inside Amazon Connect. They are using the CCP, a contact flow, or rules to create tasks."
            },
            {
              "type": "p",
              "text": "The following two ways to create tasks work with your external business systems and applications. With these methods, you can create and orchestrate tasks using the prebuilt integrations for common CRM systems like Salesforce and Zendesk. Or, if you have a custom CRM system, business applications, or other AWS services, you can use APIs to create tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Creating a task manually",
          "blocks": [
            {
              "type": "p",
              "text": "Depending on your business needs, your agents might need to create a task manually and assign the task to a queue, an individual, or themselves. To manually create a task, the agent would open the CCP window, choose the tasks tab, choose the Create task button, and enter the task name, description, and reference links. Then they would use the Assign to field to choose a queue, an individual, or themselves. Optionally, they can select a specific date and time and then choose Create."
            },
            {
              "type": "p",
              "text": "Create task window with Task name, Description, and Assign to boxes highlighted."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Creating a task using a template"
            },
            {
              "type": "p",
              "text": "Creating a task manually depends on the agent accurately entering all the required information in the proper format. That is where task templates can help. With Amazon Connect Task Templates, you can create a custom form with specific fields defined for your agent's tasks. This makes it faster for agents to fill out, provides more consistency across agents, and reduces the likelihood of human error. Templates can be customized for any number of tasks needed for your business—like customer feedback forms, billing disputes, or insurance claims."
            },
            {
              "type": "p",
              "text": "There are three steps that an administrator would use to create templates. First, create and name the template. Then add the fields, task assignments, and schedule. Then publish the task template so that agents will see it when they create tasks."
            },
            {
              "type": "p",
              "text": "For the specific steps and to set up new templates see, Create task templates. When you have created and published the task templates, your agents will see the templates in a dropdown list when they create a new task."
            },
            {
              "type": "p",
              "text": "The Create task dialog box shows the dropdown list of task templates."
            },
            {
              "type": "p",
              "text": "After you create task templates and publish them, agents will be required to select a task template when they create a task. If you want to return to the standard task experience and not require agents to select a template, on the Task templates page, use the Disable/Enable toggle to disable all templates you published."
            },
            {
              "type": "p",
              "text": "To set up permissions for those who can create task temples, see Security profile permissions for task templates. For information on quotas for task templates, such as the task templates per instance and task template customized fields per instance, see Amazon Connect service quotas."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Creating a task from a contact flow",
          "blocks": [
            {
              "type": "p",
              "text": "The next method for creating a task is using a contact flow. Administrators can use this method to create a task based on customer inputs or when specific conditions are met. For example, a customer might contact you outside of regular business hours. When that condition occurs, a task can be created and routed for an agent to respond later."
            },
            {
              "type": "p",
              "text": "Administrators can set this up by adding a Create task block in the contact flow. This block creates and orchestrates tasks directly from flows based on customer input or a business rule. The contact flow creates a new task, sets the task attributes, and initiates a contact flow to start the task immediately or schedule it for a future date and time."
            },
            {
              "type": "p",
              "text": "Take a minute to review how creating a task from a contact flow works when a customer calls the AnyCompany Bank contact center outside of business hours. To learn more, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "For more information about creating tasks with contact flows, see Flow block: Create task. To learn more about which contact flows and types can be used with tasks, see list of supported contact flow types and blocks for tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Creating a task from an API",
          "blocks": [
            {
              "type": "p",
              "text": "Now let's explore how to create a task using an application programming interface (API). Administrators can use this method to create tasks from outside of Amazon Connect, from any number of business applications, homegrown CRMs, or ticketing systems. It is a flexible way to programmatically create a task from external systems without being inside of Amazon Connect when you need to create and orchestrate a task."
            },
            {
              "type": "p",
              "text": "Take a minute to review how it works when a task is created from the AnyCompany Bank website using APIs. To learn more, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "To learn more about using APIs to create tasks, see the StartTaskContact API."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Scheduling a task",
          "blocks": [
            {
              "type": "p",
              "text": "You can schedule a task for a future date and time for any methods that you use to create tasks. This might come in handy when you need to reach out to a customer on a specific date or coordinate work for a future date and time slot. To schedule a date in the future, you use the Scheduled date/time section on the Create task screen."
            },
            {
              "type": "p",
              "text": "The Create task window shows Scheduled date/time section highlighted."
            },
            {
              "type": "p",
              "text": "You can schedule a task up to 6 days in the future. The task will remain in Amazon Connect until it is completed or expires when 7 days elapse. Let's look at an example. It is June 1, and Nikki can schedule the task up to 6 days in the future. She chose June 7 as the scheduled date. The task was delivered on June 7 and will expire on June 14 if not completed."
            },
            {
              "type": "p",
              "text": "When scheduling tasks, remember that the delivery depends on the state of the queue and agent availability at that future time. So there is no guarantee that the task will be delivered at that exact time if, for example, the queues are busy and agent availability is low."
            },
            {
              "type": "p",
              "text": "To learn more, see Create a scheduled task."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "When do tasks end?",
          "blocks": [
            {
              "type": "p",
              "text": "Now that you have created tasks, let's explore the four ways that tasks can be completed or ended. A task ends when one of the following happens:"
            },
            {
              "type": "p",
              "text": "An agent completes the task."
            },
            {
              "type": "p",
              "text": "A contact flow runs a Disconnect / hang up block. This can be used to end the task based on attributes collected during the customer experience or business rules that have been met."
            },
            {
              "type": "p",
              "text": "A task reaches the 7-day limit. A task is completed if it expires. If necessary, you can automate extending the task."
            },
            {
              "type": "p",
              "text": "You end the task using the StopContact API."
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-implementing-tasks-t3-q1",
          "question": "Take a minute to check your understanding of the content covered in this lesson. Select the correct answer and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to the correct answer. Press the space bar to select, and press Enter to submit. Which method is best to work with your custom customer relationship management system (CRM), business systems, and custom applications to create tasks in Amazon Connect?",
          "options": [
            {
              "id": "A",
              "text": "Use Contact Control Panel (CCP) to create tasks."
            },
            {
              "id": "B",
              "text": "Use contact flow to create tasks."
            },
            {
              "id": "C",
              "text": "Use rules to create tasks."
            },
            {
              "id": "D",
              "text": "Use an API to create tasks."
            }
          ],
          "correctOptionId": "D",
          "rationale": "Using an API lets you create tasks from your custom CRM or applications. The other three methods listed, the CCP, contact flows, and rules, are all used inside Amazon Connect to create tasks."
        },
        {
          "id": "connect-implementing-tasks-t3-q2",
          "question": "Select the correct answers and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to a correct answer. Press the space bar to select. Repeat this step until all correct responses are checked, then press Enter to submit. An Amazon Connect Task can end when an agent completes the task in the Contact Control Panel (CCP). What are three other ways that tasks can end? (Select THREE.) (Select all that apply: A contact flow runs a Disconnect/hang up block, which ends the task. / A task reaches the 7-day limit. / A chat is sent to an agent with the word \"STOP.\" / You end the task using the StopContact API. / The task is selected in the current task report, and you press the Delete key.)",
          "options": [],
          "answer": "A contact flow runs a Disconnect/hang up block, which ends the task.; A task reaches the 7-day limit.; You end the task using the StopContact API.. Amazon Connect tasks can end when the task reaches a 7-day limit, a contact flow runs a disconnect/hang-up block, or you use the StopContact API."
        }
      ]
    },
    {
      "id": "connect-implementing-tasks-t4",
      "number": 4,
      "title": "Use Applications with Prebuilt Integrations to Orchestrate Tasks",
      "shortTitle": "Use Applications with Prebuilt Integrations…",
      "summary": "If your organization uses Salesforce or Zendesk as your CRM system, you can use the prebuilt connectors to integrate with Amazon Connect…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "If your organization uses Salesforce or Zendesk as your CRM system, you can use the prebuilt connectors to integrate with Amazon Connect seamlessly. The prebuilt integrations act as a bridge between Salesforce or Zendesk and Amazon Connect. With this integration, an agent can have work that starts in Salesforce or Zendesk and continues in Amazon Connect. Using the Amazon Connect integration permits actions to initiate automatically. For example, it could create a callback, generate a proactive chat, or follow up on a task. Amazon Connect integration with Zendesk and Salesforce offers many opportunities to create efficiencies within your contact center. The power of this integration is the ability to use the same routing engine and reporting to optimize the agent's time spent on offline work."
            },
            {
              "type": "p",
              "text": "In this lesson, we will describe the benefits of integrated applications and review some examples of how customers use them. We will also identify questions to ask to help get you started, and where to go for set-up instructions for both Salesforce and Zendesk."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits",
          "blocks": [
            {
              "type": "p",
              "text": "There are several benefits when you integrate applications like Salesforce and Zendesk to create and orchestrate tasks in Amazon Connect. Getting started doesn't require writing code; it takes just a few clicks. The integration provides the opportunity to automate tasks, follow up, and track tasks to completion, improving the customer experience. When tasks span multiple systems like CRM systems, ecommerce, or ticketing systems, agents might manually track work, which is time consuming and error prone. With fewer errors and the ability to track tasks to completion, you can improve your customer experience."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "How do customers use it?",
          "blocks": [
            {
              "type": "p",
              "text": "To explain how customers use applications with prebuilt integrations to orchestrate tasks, let's look at a few examples."
            },
            {
              "type": "p",
              "text": "Arnav is an admin at AnyCompany Products. The customer service team uses Zendesk, and Arnav is looking for a way to automatically direct customer service tasks to the team member qualified to handle the task and track the time spent on completing the task. He uses the skills-based routing engine in Amazon Connect and uses tasks to accomplish this."
            },
            {
              "type": "p",
              "text": "Maria is an admin at AnyCompany. Their service desk agents receive voice and chat contacts through their Amazon Connect contact center but monitor and update cases in their ticketing platform. There have been situations where critical tickets go unactioned, because all agents handle voice and chat interactions. Maria wants to find a way to route critical cases to the agents and ensure that they are prioritized over the lower priority interactions. She determines that tasks, which use the same routing engine as voice and chat interactions, could be integrated into the existing ticketing system and used for routing critical cases to the agents."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "How does it work?",
          "blocks": [
            {
              "type": "p",
              "text": "To learn more about how it works, let's look at Maria's example, routing critical priority cases from her ticket platform to the agents, in more detail."
            },
            {
              "type": "p",
              "text": "To learn more, choose each of the numbered markers."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "How to identify opportunities",
          "blocks": [
            {
              "type": "p",
              "text": "The first step to identifying opportunities where tasks can help with integrated applications, like Salesforce and Zendesk, is to ask questions. When you ask these questions, you can identify areas in your workflow where Amazon Connect Tasks can help."
            },
            {
              "type": "p",
              "text": "Where do you need to create a work item or a \"to do\" when you are working in the CRM?"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Where do you see opportunities to automate?",
          "blocks": [
            {
              "type": "p",
              "text": "Where do you need a work item or the next step in the process sent to another team?"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Are there places in your workflow where you need to escalate something?",
          "blocks": [
            {
              "type": "p",
              "text": "Are there places in Salesforce or Zendesk where work goes unfinished and would be essential to track to completion?"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t4-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up prebuilt integrations",
          "blocks": [
            {
              "type": "p",
              "text": "You can set up applications with prebuilt integrations for task creation in just a few steps; no coding is required. Whether you are setting up Salesforce or Zendesk, the first part of the process is the same."
            },
            {
              "type": "p",
              "text": "Step 1: Open the Amazon Connect console at https://console.aws.amazon.com/connect/."
            },
            {
              "type": "p",
              "text": "Step 2: On the Instances page, choose the instance alias. The instance alias is your instance name, which appears in your Amazon Connect URL."
            },
            {
              "type": "ul",
              "items": [
                "Step 3: Choose Tasks, and then choose Add an application.",
                "Step 4: On the Select application page, choose the application for integration.",
                "Step 5: Review the application requirements listed on the Select application page.",
                "Step 6: Complete the remaining steps specific to the application integration."
              ]
            },
            {
              "type": "p",
              "text": "To learn more about integrating Salesforce, see Set up application integration for Salesforce. To learn more about integrating Zendesk, see Set up application integration for Zendesk."
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-implementing-tasks-t4-q1",
          "question": "Take a minute to check your understanding of the content covered in this lesson. Select the correct answers and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to a correct answer. Press the space bar to select. Repeat this step until all correct responses are checked, then press Enter to submit. You can create tasks from third-party applications with prebuilt integrations without writing any code. Which external applications can natively integrate with Amazon Connect today? (Select TWO.) (Select all that apply: Oracle / Zendesk / Salesforce / SAP / Your custom (CRM))",
          "options": [],
          "answer": "Zendesk; Salesforce. Sorry, that is not correct. Using prebuilt integrations, you can set up applications for task creation with Salesforce and Zendesk; no coding is required. You can use Amazon Connect APIs to create tasks for other applications like homegrown CRMs or business-specific applications."
        }
      ]
    },
    {
      "id": "connect-implementing-tasks-t5",
      "number": 5,
      "title": "Use Rules to Create Tasks in Amazon Connect",
      "shortTitle": "Use Rules to Create Tasks in Amazon Connect",
      "summary": "In previous lessons, you identified three ways to create tasks in Amazon Connect: using the Contact Control Panel (CCP), using a contact flow, and…",
      "duration": "~9 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In previous lessons, you identified three ways to create tasks in Amazon Connect: using the Contact Control Panel (CCP), using a contact flow, and using APIs. Then you reviewed the steps to set up applications with prebuilt integrations. In this lesson, you will learn the last two ways to create tasks: using rules for prebuilt third-party applications and using Contact Lens rules."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s2",
          "eyebrow": null,
          "duration": null,
          "title": "What are rules?",
          "blocks": [
            {
              "type": "p",
              "text": "A rule is a defined action that Amazon Connect automatically performs based on the specified conditions. Working with rules is a powerful way to automate essential notiﬁcations, tasks, and actions. Let's look at how to create tasks with rules. You can use Amazon Connect rules to create tasks in two ways without requiring the writing of code."
            },
            {
              "type": "p",
              "text": "Third-party integration rules:"
            },
            {
              "type": "p",
              "text": "Rules can be used with preintegrated applications, such as Salesforce and Zendesk. For example, when a ticket is created in Zendesk, a new task can be created in Amazon Connect."
            },
            {
              "type": "p",
              "text": "Rules with Contact Lens:"
            },
            {
              "type": "p",
              "text": "Rules can be used with a feature called Contact Lens for Amazon Connect to orchestrate tasks based on uttered keywords, sentiment scores, customer attributes, and other criteria."
            },
            {
              "type": "p",
              "text": "Benefits of using rules with tasks"
            },
            {
              "type": "p",
              "text": "When you use Amazon Connect rules to orchestrate tasks, you specify the conditions to look and listen for. And when those conditions are met, you can choose what action will occur. For example, the action could create a task and route it to a queue, a team, or an individual. That means you can automate tasks based on those custom rules that are meaningful for your business."
            },
            {
              "type": "p",
              "text": "Let's look at two ways to use rules with tasks in more detail."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Using third-party integration rules to create a task",
          "blocks": [
            {
              "type": "p",
              "text": "The first way is to use third-party integration rules to create a task. When you integrate Amazon Connect with one of the preintegrated applications, either Salesforce or Zendesk, you can define rules that dictate the conditions for creating a task and how it will be routed."
            },
            {
              "type": "p",
              "text": "Let's look at an example. AnyCompany is looking for a way to automate a task to notify an IT help desk analyst if a new case is created in Salesforce with a high priority and a subject that contains the word outage. This is where using rules with an integrated application to orchestrate tasks can help. To learn more, choose each of the numbered markers."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Using a rule with real-time or post-call analysis to create a task",
          "blocks": [
            {
              "type": "p",
              "text": "The second way that tasks can be created by rules is with real-time or post-call analysis on calls. This is possible by using a feature called Contact Lens for Amazon Connect. Contact Lens uses natural language processing (NLP) and machine learning analytics to discover customer insights and identify agent coaching opportunities."
            },
            {
              "type": "p",
              "text": "Let's look at an example. Arnav, the supervisor at AnyCompany, has a new agent in training that takes a limited number of live calls. Arnav can set up rules to check the new agent's calls for proper greetings and required phrases. Arnav can also create an action that generates a task for him to review and assign more training for the new agent if needed."
            },
            {
              "type": "p",
              "text": "This is where rules with Contact Lens come in. Contact Lens can analyze the new agent's calls for required phrases and use a rule to generate a task and send it to Arnav's supervisor queue. Now Arnav can be notiﬁed to review his new agent's call when it does not meet the conditions that he specifies."
            },
            {
              "type": "p",
              "text": "This is one example, but Contact Lens can use rules to automatically create and route tasks to queues, back office teams, or individuals based on uttered keywords, sentiment scores, customer attributes, and other criteria."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up a rule",
          "blocks": [
            {
              "type": "p",
              "text": "Now, let's review how to create a rule. You can set up an Amazon Connect rule in three steps. First, define the condition. The condition is when something happens, such as a keyword is uttered. Second, specify the action. The action is what you want to happen, such as creating a task or sending an alert. Third, review and save."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Conditions and types of matches",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect rules are powerful tools that help you to automate or take actions when certain conditions match the criteria you specify. Understanding the types of matches that you can use will help to ensure that your rules work effectively to meet your organization’s goals."
            },
            {
              "type": "p",
              "text": "Some customers might provide specific phrases and scripts for agents and need to ensure compliance. Others might provide more general guidance and want to check for polite interactions, like greetings and closings, for example. Other customers might want to automate actions for escalations based on customer sentiment or based on conditions like a customer saying, “I want to cancel my subscription,” or when a customer mentions a competitor. These are all possible by using rules and specifying conditions with types of matches and actions."
            },
            {
              "type": "p",
              "text": "Let’s look at the three types of matches: an exact match, a semantic match, and a pattern match."
            },
            {
              "type": "p",
              "text": "An exact match finds only the exact words or phrases that you specify. Use an exact match when specific words or phrases should be used, or you can search a contact to ensure that specific words or phrases are not uttered."
            },
            {
              "type": "p",
              "text": "A semantic match is more flexible because it finds words that could be synonyms. For example, if you enter \"upset,\" it can match \"not happy.\" Or \"hardly acceptable\" can match with \"unacceptable,\" and \"unsubscribe\" can match with \"cancel my subscription.\" It can also semantically match phrases—for example, \"thank you so much for helping me out,\" and \"thanks a lot, and this is so helpful.\" A semantic match makes it easier for you to find meaningful matches without providing an exhaustive list of keywords."
            },
            {
              "type": "p",
              "text": "The third type of matching, pattern match, finds matches that can be less than 100 percent exact. It also provides the ability to specify the distance between words. This can come in handy when, for example, you do not want to see any mention of the word \"credit card.\" You can define a pattern matching category to look for the word \"credit\" that is not within one-word distance of \"card.\""
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Steps to create rules to orchestrate a task",
          "blocks": [
            {
              "type": "p",
              "text": "Whether you are creating a rule to use with third-party integrations or using the rule with Contact Lens to orchestrate a task, the steps are basically the same. The only difference is in step two, choosing Contact Lens, or third-party integration. Before you create a new rule, you will need permissions assigned that are activated for rules."
            },
            {
              "type": "p",
              "text": "To learn the steps, let's look at an example. Nikki, a supervisor at AnyCompany Bank, wants to know when an new agent misses the required phrases during a call so that she can coach the agents for future interactions. Watch the following video to see the steps to set up a rule with real-time analysis to solve Nikki's challenge. To watch the video, choose the play button."
            },
            {
              "type": "p",
              "text": "To access the video transcript, expand the + symbol."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Video transcript: Set up a rule with real-time analysis to orchestrate a task",
          "blocks": [
            {
              "type": "p",
              "text": "In this demonstration, we are going to use Contact Lens for Amazon Connect to set up a rule with post-call analysis to create and route a task."
            },
            {
              "type": "p",
              "text": "For our example, we define a rule that checks if a new agent uses the required greeting and closing statements during a call. If not, we set the action to create a task and route it to the supervisor for review. There are three steps in the process to create a rule. First, define the conditions. In the second part, define the actions. This is when you create and route a task. Third, review and save the rule."
            },
            {
              "type": "p",
              "text": "To get started, open the Amazon Connect administrative interface. On the left navigation pane, choose the rules icon and select Rules. Select Create a rule, then Contact lens. Select the When dropdown list and choose A Contact Lens post-call analysis is available. Choose Add condition and then choose the type of match as Semantic match. Remember, semantic rules are more flexible than exact match and will catch synonyms."
            },
            {
              "type": "p",
              "text": "For this example's logic, use Any of the following words or phrases were not mentioned during the first 15 seconds of the contact where the speaker is agent speaking English. Now choose the words and phrases. For our company's greeting, agents should say, \"Hello, how are you today?\" By using a semantic match, if an agent said, \"Hello, how's everything going?\" that would also be a match. Select the Enter keywords box and type Hello how are you today. Choose Add. The logic that Contact Lens uses to read these words or phrases is hello or how or are or you or today."
            },
            {
              "type": "p",
              "text": "Next, we want to add a second condition to check our agents' closing statement. Agents should say, \"Thank you for calling AnyCompany.\" Choose Add condition and then choose the type of match as semantic match. Choose the logic by selecting When the words or phrases were not mentioned during the last 15 seconds of the contact where the speaker is the agent speaking English. Select the Enter keywords box and type Thank you for calling AnyCompany, and choose Add."
            },
            {
              "type": "p",
              "text": "This semantic rule would also match if the agent said, \"Thanks for contacting us\" or \"Thanks for being our customer.\" Now that we have multiple cards, the logic that Contact Lens uses to read the two cards of words or phrases is card one and card two. Choose Add condition to decide where to apply the rules. We want to use this rule with our orders queue. So choose CustomerOrders from the dropdown. Choose Next. Assign a category name. The category name is a label that can be used in reports and searches."
            },
            {
              "type": "p",
              "text": "For this example, use CallGreetingRule. Select Add action and choose Create Task. Add a description. Then choose the Select the contact flow dropdown list and choose the contact flow to route the task. For our example, we'll use the Sample inbound flow. The sample inbound flow routes all interaction types to Basic Queue. If needed, you could create a contact flow that would route the task to another group like quality assurance. Choose Next."
            },
            {
              "type": "p",
              "text": "Review the rule, then choose Save and publish. This concludes the walkthrough of how to set up a rule for Contact Lens post-call analysis to orchestrate a task. You defined the conditions and specified the words or phrases to match, defined an action to create a task and where to route it, then reviewed and saved."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t5-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Learn more",
          "blocks": [
            {
              "type": "p",
              "text": "Rules are a powerful tool in Amazon Connect. For more information about rules, see Rules. For more information about how rules work with Contact Lens, see Create rules with Contact Lens in the Amazon Connect Administrator Guide."
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-implementing-tasks-t5-q1",
          "question": "Take a minute to check your understanding of the content covered in this lesson. Select the correct answer and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to the correct answer. Press the space bar to select, and press Enter to submit. Nikki wants to create a rule in her contact center where she can categorize calls based on sentiment, and she wants to search for synonyms for “upset.” What type of match should she use for her analysis?",
          "options": [
            {
              "id": "A",
              "text": "Semantic match"
            },
            {
              "id": "B",
              "text": "Exact match"
            },
            {
              "id": "C",
              "text": "Pattern match"
            },
            {
              "id": "D",
              "text": "No match"
            }
          ],
          "correctOptionId": "A",
          "rationale": "You should use a semantic match when you are looking to find words that might be synonyms. Exact match will only find the exact words or phrases mentioned. Pattern match finds matches that could be less than 100 percent exact."
        },
        {
          "id": "connect-implementing-tasks-t5-q2",
          "question": "Arnav is an administrator at AnyCompany. He wants to create a rule with post-call analysis to create a task. The task would be used to review calls when his customers mention the competitor's name. He specifies the competitor's name in the keywords. Which logic settings and match type should Arnav use for his rule in Amazon Connect?",
          "options": [
            {
              "id": "A",
              "text": "Arnav should use an exact match where any of the following words or phrases were mentioned during the entire length of the contact where the speaker is the customer speaking English."
            },
            {
              "id": "B",
              "text": "Arnav should use a pattern match where any of the following words or phrases were mentioned during the first 30 seconds of the contact where the speaker is the customer speaking English."
            },
            {
              "id": "C",
              "text": "Arnav should use a semantic match where any of the following words or phrases were not mentioned during the entire contact where the speaker is the agent speaking English."
            },
            {
              "id": "D",
              "text": "Arnav cannot create a rule for this type of match."
            }
          ],
          "correctOptionId": "A",
          "rationale": "An exact match would work with Arnav’s competitor's name used in the keywords. He should use the logic: Any of the following words or phrases were mentioned during the entire length of the contact where the speaker is the customer speaking English."
        }
      ]
    },
    {
      "id": "connect-implementing-tasks-t6",
      "number": 6,
      "title": "Amazon Connect Tasks Reporting",
      "shortTitle": "Amazon Connect Tasks Reporting",
      "summary": "Estimating the effort required to support follow-up work, and the staff needed to manage the workload, can be a challenge. The good news is that…",
      "duration": "~8 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Estimating the effort required to support follow-up work, and the staff needed to manage the workload, can be a challenge. The good news is that Amazon Connect Tasks reporting uses the same UI, capabilities, and report engine that you use for Amazon Connect calls and chats. With tasks reports, you can see how long agents take to complete their tasks."
            },
            {
              "type": "ul",
              "items": [
                "Agent on computer with a task list and 2 hours showing on the clock.",
                "Amazon Connect Tasks reporting helps you to do the following:"
              ]
            },
            {
              "type": "ul",
              "items": [
                "Gain visibility into task metrics.",
                "Use insights from time spent on tasks to accurately staff.",
                "Build metrics to use in coaching and performance management."
              ]
            },
            {
              "type": "p",
              "text": "In this lesson, you will explore Amazon Connect Tasks reports, options, and metrics, and learn how to adjust your service-level targets for tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t6-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Two report types for tasks",
          "blocks": [
            {
              "type": "p",
              "text": "The two report types that you use for tracking task activity are real-time metrics reports and historical metrics reports. You can customize, save, and publish each type."
            },
            {
              "type": "p",
              "text": "A stop watch and a calendar."
            },
            {
              "type": "p",
              "text": "Real-time metrics reports provide data about current task activity in your contact center. The metrics are updated every 15 seconds and contain data for the following:"
            },
            {
              "type": "ul",
              "items": [
                "Number of agents online",
                "Number of tasks waiting in a queue"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Number of contacts or tasks handled"
            },
            {
              "type": "p",
              "text": "Historical metrics reports provide data about past (completed) tasks activity and performance in your contact center. These reports can be organized by the following:"
            },
            {
              "type": "ul",
              "items": [
                "Queues for tasks or agents",
                "Routing profiles",
                "Agent performance"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "When to use real-time tasks reports"
            },
            {
              "type": "p",
              "text": "Real-time metrics reports work the same for tasks as they do for calls and chats. You use them to observe agent-level and queue-level activity as it is occurring. Let's look at an example."
            },
            {
              "type": "p",
              "text": "Arnav is a contact center supervisor for AnyCompany. His team uses tasks for follow-up work and routes tasks through the CustomerFollowup queue. Arnav wants to create a real-time report to view the tasks in the CustomerFollowup queue to check throughout the day. He wants to view the queues grouped by channels so that he can see the specific tasks compared to calls and chats."
            },
            {
              "type": "p",
              "text": "Customer follow-up queue showing metrics for agents, contacts, and performance."
            },
            {
              "type": "p",
              "text": "You must have permission to view and save real-time metrics reports. Before using the following steps, you must be assigned Permissions required to view real-time metrics reports."
            },
            {
              "type": "p",
              "text": "Follow these steps to create a real-time metrics view for tasks and save it."
            },
            {
              "type": "p",
              "text": "1. In the left navigation menu, choose Analytics, and then choose Real-time metrics."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Analytics menu, real-time metrics"
            },
            {
              "type": "p",
              "text": "2. Choose the primary groupings to view. For this example, choose Queues."
            },
            {
              "type": "ul",
              "items": [
                "Real-time metrics view screen with queue menu selected.",
                "3. To customize the report settings, in the upper-right corner, choose the gear icon."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Gear icon to customize report settings.",
                "4. Choose the Group tab, and choose Queues grouped by channels."
              ]
            },
            {
              "type": "p",
              "text": "Grouping options window with queues grouped by channels selected."
            },
            {
              "type": "p",
              "text": "5. Choose the Filters tab, and for Filter primary groupings by, choose Queues. Choose the Search field, and choose your tasks queue; for our example, the CustomerFollowup queue."
            },
            {
              "type": "p",
              "text": "Table settings window with Filters tab selected and queues dropdown list highlighted and CustomerFollowup queue selected."
            },
            {
              "type": "p",
              "text": "6. To specify which metrics to show for your tasks, choose the Metrics tab. Select one or more agent metrics, and choose Apply."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "Two helpful metrics for tasks are On contact and Contact handle time."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Table settings window with Metrics tab selected.",
                "7. To save the report to use later, choose Save report."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Save rport button"
            },
            {
              "type": "p",
              "text": "8. To retrieve your real-time metrics report, choose Analytics, Saved reports, and Real-time metrics, and then choose your report."
            },
            {
              "type": "p",
              "text": "As you refine your real-time metrics view for tasks, for more options, see Create a Real-Time Metrics Report in the Amazon Connect Administrator Guide. To view a complete list of all metrics available in real-time reports and their definitions, see Real-Time Metrics Definitions in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t6-s3",
          "eyebrow": null,
          "duration": null,
          "title": "When to use historical metrics reports",
          "blocks": [
            {
              "type": "p",
              "text": "Use historical metrics reports to identify performance data for completed tasks. Use them to gain insights on performance for yesterday, last week, last month, or a custom time range. By viewing your historical task data, you can identify trends and gain insights into the amount of work that your agents spend on tasks."
            },
            {
              "type": "p",
              "text": "Let's continue with our example. Arnav wants to review the team's performance on last month's tasks for customer follow-up. To do this, he selects the Historical metrics report in the Analytics menu and chooses the CustomerFollowup queue with the time range for the previous month. He can customize metrics to display using the settings icon that he used in the earlier steps."
            },
            {
              "type": "ul",
              "items": [
                "Historical metrics report for CustomerFollowup queue showing metrics for contacts handled and average handle time.",
                "To create a real-time metrics view for tasks and save it, follow these steps."
              ]
            },
            {
              "type": "p",
              "text": "1. In the navigation menu, choose Analytics, and then choose Historical metrics."
            },
            {
              "type": "ul",
              "items": [
                "Analytics menu, Historical metrics option.",
                "2. Choose the primary groupings to view. For this example, choose Queues."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Historical metrics option with queues selected.",
                "3. To customize report settings, in the upper-right corner, choose the gear icon."
              ]
            },
            {
              "type": "p",
              "text": "Gear icon for historical reports settings."
            },
            {
              "type": "p",
              "text": "4. Customize the time range if needed, then group by channels. Choose the Group tab, and choose Queues grouped by channels."
            },
            {
              "type": "p",
              "text": "Grouping options window with queues grouped by channels selected."
            },
            {
              "type": "p",
              "text": "5. If needed, filter to view a specific queue. Choose the Filters tab, and for Filter primary groupings by, choose Queues. Choose the Search field, and choose your tasks queue; for our example, the CustomerFollowup queue."
            },
            {
              "type": "p",
              "text": "Table settings showing Filters tab selected, queues dropdown list, and CustomerFollowup queue check box."
            },
            {
              "type": "p",
              "text": "6. To select which metrics to show for your tasks, choose the Metrics tab, and clear any metrics that you want to remove from your report. For tasks metrics, you might use Contacts handled, Average handle time, Agent on Contact time, and Contact handle time."
            },
            {
              "type": "ul",
              "items": [
                "Table settings showing Metrics tab selected and metrics check boxes.",
                "7. Your historical metrics report will display."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Historical metrics queues report showing CustomerFollowup queue, contacts handled, and average handle time metrics.",
                "8. To save the report to use later, choose Save report."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Save report button"
            },
            {
              "type": "p",
              "text": "9. To retrieve your real-time metrics report, choose Analytics, Saved reports, and Historical metrics, and then choose your report."
            },
            {
              "type": "p",
              "text": "For a report you want to run regularly, see Schedule a Historical Metrics Report."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t6-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Tasks metrics",
          "blocks": [
            {
              "type": "p",
              "text": "When you use reports to view tasks, there are two commonly used metrics:"
            },
            {
              "type": "ul",
              "items": [
                "How long agents spend working on each task (Agent on Contact Time)",
                "The total time from when a task was created to when it was completed (Contact Handle Time)"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Custom service levels for tasks"
            },
            {
              "type": "p",
              "text": "A service level is a target metric that organizations set to measure queue performance. Although voice and chats might have short service level times, based on seconds or minutes, for some tasks, it might be hours or days. You can create custom service level durations that are appropriate for the tasks that you need for your organization. If you need to set up different service levels for tasks, we recommend that you split those task channels into different queues. You can add up to 10 custom service levels for each report."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t6-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring a custom service level on a tasks report",
          "blocks": [
            {
              "type": "p",
              "text": "You can use a custom service level for your tasks with either real-time or historical metrics reports. Follow these steps to customize a service level for tasks on your reports."
            },
            {
              "type": "p",
              "text": "1. You can choose Analytics, Real-time metrics, or Historical metrics. For our example, choose Historical metrics."
            },
            {
              "type": "ul",
              "items": [
                "Analytics menu, Historical metrics option.",
                "2. To customize the report settings, in the upper-right corner, choose the gear icon."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Gear icon for customizing table settings.",
                "3. Choose the Metrics tab. Scroll down and choose +Add Custom SL."
              ]
            },
            {
              "type": "p",
              "text": "Table Settings with Metrics tab selected, and Add Custom SL highlighted."
            },
            {
              "type": "p",
              "text": "4. In the Length of time field, enter the duration for your custom service level. To the right, in the dropdown list, choose minutes or days, and choose Add."
            },
            {
              "type": "ul",
              "items": [
                "Contact service level set to 2 days and the add button highlighted",
                "5. Clear any other selected service levels and choose Apply."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Service level 2 days check box and the apply button highlighted"
            },
            {
              "type": "p",
              "text": "6. Choose Save. Follow the same steps to add your new service level to your other reports."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t6-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Searching for a task",
          "blocks": [
            {
              "type": "p",
              "text": "If you are already using contact search for calls and chats, it works the same for tasks. Use the Contact search page to search for completed tasks. The contact search works the same for tasks as it does for calls and chats. The contact search uses the ﬁlters that you specify to search contact center interactions, displaying the matches in a table. You can open the result of each match to view further details on your task in the contact trace record (CTR)."
            },
            {
              "type": "p",
              "text": "1. In the navigation menu, choose Analytics, and then choose Contact search."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Analytics menu, Contact search"
            },
            {
              "type": "p",
              "text": "2. In the Contact search window, choose the Time range dropdown list. Choose Fixed time or Trailing window of time, a start and end date, and then choose Apply."
            },
            {
              "type": "p",
              "text": "Contact search window, Time range with fixed time selected and July 1 and July 31 highlighed. The Apply button is also selected."
            },
            {
              "type": "p",
              "text": "3. In the Contact search window, choose the Channel dropdown list, choose Task, and then choose Apply."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Channel dropdown selected with Task channel checkbox"
            },
            {
              "type": "p",
              "text": "4. In the Contact search window, choose Click here to add filter, choose Queue, and choose your tasks queue. Then choose Apply."
            },
            {
              "type": "p",
              "text": "Select a queue field selected with CustomerFollowup queue and Apply button highlighted"
            },
            {
              "type": "p",
              "text": "5. To review the details for a specific task, in Contacts table, under Contact ID, choose a contact ID."
            },
            {
              "type": "ul",
              "items": [
                "Contacts table with contact ID highlighted.",
                "The contact trace record (CTR) for your task will display."
              ]
            },
            {
              "type": "ul",
              "items": [
                "Contact trace record showing task details.",
                "Check your knowledge"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-implementing-tasks-t6-q1",
          "question": "Take a minute to check your understanding of the content covered in this lesson. Select the correct answer and choose SUBMIT. For keyboard-only accessibility, press the Tab key and then the arrow keys to navigate to the correct answer. Press the space bar to select, and press Enter to submit. Arnav is a contact center supervisor for AnyCompany. He wants to use a report to review his team's performance on tasks for last month. Which report type should Arnav use?",
          "options": [
            {
              "id": "A",
              "text": "Real-time metrics report"
            },
            {
              "id": "B",
              "text": "Contact search, specifying the date range for one month"
            },
            {
              "id": "C",
              "text": "Historical metrics report"
            },
            {
              "id": "D",
              "text": "Custom service levels"
            }
          ],
          "correctOptionId": "C",
          "rationale": "Arnav should use a historical metrics report to view his team's performance on tasks for the past month. Real-time would show the team's current performance. Arnav could set custom service levels for historical or real-time metrics reports. Contact search can locate specific tasks by using time ranges and filters."
        }
      ]
    },
    {
      "id": "connect-implementing-tasks-t7",
      "number": 7,
      "title": "Considerations",
      "shortTitle": "Considerations",
      "summary": "When implementing Amazon Connect Tasks, you should take a minute to get familiar with service quotas related to tasks management and handling.…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t7-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "When implementing Amazon Connect Tasks, you should take a minute to get familiar with service quotas related to tasks management and handling. Service quotas are the default quotas or limits for each Amazon Web Services (AWS) service. In this lesson, you will identify the service quotas to consider when implementing Amazon Connect Tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Tasks service quotas",
          "blocks": [
            {
              "type": "p",
              "text": "All service quotas can be adjusted or increased unless otherwise noted. For a complete list and the exact numbers, see Amazon Connect service quotas. To request a quota increase, see Requesting a quota increase in the Service Quotas User Guide."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Queues per routing profile per instance",
          "blocks": [
            {
              "type": "p",
              "text": "When you add the task channel to a routing profile, remember that this counts towards the service limit of 50 queue-channel combinations per instance. For example, when we added the task channel for the EscalationQueue in the following image, three queue-channel combinations would count towards the service limit of 50 queue-channel combinations per routing profile in an instance."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Concurrent active tasks per instance",
          "blocks": [
            {
              "type": "p",
              "text": "You can have up to 2,500 concurrent active tasks per instance. This refers to all tasks that have not expired or been closed. These tasks are considered active and are counted as concurrent tasks. This includes tasks being routed in flows, waiting in a queue for an agent, being handled by agents, or being run in After Contact Work (ACW). See service limits for concurrent active tasks."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Task template service quotas",
          "blocks": [
            {
              "type": "p",
              "text": "There are two service quotas to remember when using templates with Amazon Connect Tasks:"
            },
            {
              "type": "p",
              "text": "Task templates per instance: You can use up to 50 task templates per instance."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Miscellaneous task service quotas",
          "blocks": [
            {
              "type": "p",
              "text": "There are a few other service quotas to remember when using Amazon Connect Tasks:"
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Maximum duration of a task: 7 days",
          "blocks": [
            {
              "type": "p",
              "text": "Maximum number of transfers of a task: 11 transfers. After it's created, a single task can only be transferred over to another agent or queue up to 11 times."
            },
            {
              "type": "p",
              "text": "Maximum number of linked tasks on an existing contact: 11 tasks. A task receives the attribute data from the related interaction it was created from or during. You can only create up to 11 tasks related to that contact or interaction."
            }
          ]
        },
        {
          "id": "connect-implementing-tasks-t7-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Summary",
          "blocks": [
            {
              "type": "p",
              "text": "In this lesson, you reviewed the service quotas for Amazon Connect Tasks, where to go to learn more, and the link to request a quota increase."
            },
            {
              "type": "p",
              "text": "Continue to the next lesson to review the course summary and prepare for the end-of-course assessment."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-implementing-tasks-t8",
      "number": 8,
      "title": "Course Summary",
      "shortTitle": "Course Summary",
      "summary": "In this course, you reviewed how to configure and set up Amazon Connect Tasks, and five ways to create Amazon Connect Tasks. You explored how to…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-implementing-tasks-t8-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you reviewed how to configure and set up Amazon Connect Tasks, and five ways to create Amazon Connect Tasks. You explored how to use rules to orchestrate tasks, and use reporting to gain task insights and considerations for service quotas."
            },
            {
              "type": "p",
              "text": "Take a minute to review the course summary in preparation for the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Benefits"
            },
            {
              "type": "p",
              "text": "Amazon Connect Tasks provides time tracking and metrics for your contact center. With this data and insights, you can quantify the workload and understand where your agents spend their time. This helps you identify the opportunities for automating manual processes and redundant tasks, which improves agent efficiency and productivity. Amazon Connect Tasks can automate business processes across multiple systems, providing seamless task management. With visibility of all the tasks across systems, managers can identify and automate repetitive tasks that don't require agent time. That, in turn, helps reduce contact center costs. Using tasks can increase customer satisfaction because agents work more efficiently and issues are more quickly resolved. Tasks spanning multiple systems are completed and are less likely to get overlooked. By reducing repetitive tasks that don't require their time, agents can spend more time interacting with customers, which increases customer satisfaction."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Features of Amazon Connect Tasks",
                  "body": "Similar to the real-time and historical metrics that you use with voice calls and chats, tasks have real-time metrics reports to provide task data. You can also use the contact search to locate specific task details for completed and outstanding tasks. Managers can identify and automate repetitive tasks by analyzing the metrics and data to save time and improve efficiency. Another feature is scheduling tasks in the future—for example, calling a customer back on a particular date or time to provide an update."
                },
                {
                  "title": "Amazon Connect Tasks experience",
                  "body": "Whether the agent created the task, the manager assigned the task, or the task was generated by a business application linked to Amazon Connect, the task notification is received in the Contact Control Panel (CCP). The task tab (briefcase icon) is displayed in the upper-right corner. The agent reviews the task information, completes the task, or transfers the task using the transfer task button. When the agent completes the work, they choose the End task button at the bottom of the panel. The next interaction the agent is assigned to work on will arrive, and the process repeats."
                },
                {
                  "title": "Ways to create tasks",
                  "body": "There are five ways to create tasks for Amazon Connect: using the CCP, a contact flow, Contact Lens rules, third-party rules, and APIs."
                },
                {
                  "title": "Using reports with tasks",
                  "body": "Real-time metrics reports provide data about current tasks activity in your contact center. The metrics are updated every 15 seconds and contain data for the following:"
                }
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Number of agents online"
            },
            {
              "type": "p",
              "text": "Number of tasks waiting in a queue"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Number of contacts handled"
            },
            {
              "type": "p",
              "text": "Historical metrics reports provide data about past (completed) tasks activity and performance in your contact center. These reports can be organized by any the following ways:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Queues for tasks or agents"
            },
            {
              "type": "ul",
              "items": [
                "Routing profiles",
                "Agent performance"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Considerations"
            },
            {
              "type": "p",
              "text": "There are a few service quotas to consider when using Amazon Connect Tasks:"
            },
            {
              "type": "ul",
              "items": [
                "You can have up to 2,500 concurrent active tasks per instance.",
                "Task templates per instance: You can use up to 50 task templates per instance.",
                "Task template customized fields per instance: 50",
                "Maximum duration of a task: 7 days",
                "Maximum number of transfers of a task: 11",
                "Maximum number of linked tasks on an existing contact: 11"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Moving forward"
            },
            {
              "type": "p",
              "text": "Considering these concepts are essential in configuring, setting up Amazon Connect Tasks, and using tasks in your contact center. Continue to the next lesson to assess your knowledge of everything that you have learned in this course."
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
