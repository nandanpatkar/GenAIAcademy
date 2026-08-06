/*
 * Amazon Connect — Conversational Analytics Essentials
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT CONVERSATIONAL ANALYTICS ESSENTIALS.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-conversational-analytics",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Conversational Analytics Essentials",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "Analytics",
  "description": "Agent, queue, contact, bot, and evaluation metrics; recording configuration and strategies; and recording retention, access control, and management.",
  "examFormat": "22 topics · ~52 min · 12 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT CONVERSATIONAL ANALYTICS ESSENTIALS.txt"
  ],
  "modules": [
    {
      "id": "connect-conversational-analytics-t1",
      "number": 1,
      "title": "Introduction to Amazon Connect Metrics",
      "shortTitle": "Introduction to Amazon Connect Metrics",
      "summary": "Imagine you are managing a busy contact center and need to understand exactly what is happening across all customer interactions. How would you…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [
        "Identify key agent, queue, and contact metrics available in Amazon Connect that provide operational insight.",
        "Interpret bot metrics to evaluate automated customer service effectiveness.",
        "Recognize how conversational analytics metrics reveal quality aspects of customer interactions.",
        "Compare different metric types to determine which best address specific business questions."
      ],
      "sections": [
        {
          "id": "connect-conversational-analytics-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine you are managing a busy contact center and need to understand exactly what is happening across all customer interactions. How would you know which agents are performing well, which queues are backed up, or whether your chatbots are effectively solving customer problems?"
            },
            {
              "type": "p",
              "text": "In this section, you will explore the variety of metrics in Amazon Connect. You will learn about different types of metrics from agent performance indicators to conversational analytics that reveal the quality of customer interactions. These metrics are your window into understanding contact center performance and making data-driven decisions that improve both customer and agent satisfaction."
            },
            {
              "type": "p",
              "text": "Now it is time to dive in and discover how Amazon Connect metrics deliver comprehensive insights that elevate contact center performance."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t2",
      "number": 2,
      "title": "Agent, Queue, and Contact Metrics",
      "shortTitle": "Agent, Queue, and Contact Metrics",
      "summary": "Before you explore specific metrics, it is important to understand how Amazon Connect collects this data. Most metrics are derived from contact…",
      "duration": "~5 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Before you explore specific metrics, it is important to understand how Amazon Connect collects this data. Most metrics are derived from contact records, which capture detailed information about each customer interaction. These contact records include time spent in various states (on hold, in queue, talking with an agent) and the ultimate resolution. Additionally, these records form the foundation for most metrics you will see in the system and are stored for up to 24 months."
            },
            {
              "type": "p",
              "text": "The following metrics are a subset of the metrics available in Amazon Connect, giving visibility into what is really happening in your contact center."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Queue Metrics",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Contact Metrics"
            },
            {
              "type": "p",
              "text": "Agent metrics help you understand how effectively your team members are handling customer interactions. These metrics focus on individual performance and can identify areas for improvement and exceptional service."
            },
            {
              "type": "p",
              "text": "Average talk time: This metric shows how long agents typically spend in conversation with customers. This helps you identify agents who might need coaching on efficiency or those who excel at quickly resolving issues. If most of your agents average 5-6 minutes per call, but one agent consistently averages 9-10 minutes, they might need training on more efficient problem-solving approaches."
            },
            {
              "type": "p",
              "text": "Average handle time (AHT): This metric measures the total time an agent spends on a contact, including both the conversation and after-contact work. AHT reveals the full time investment for each customer interaction, helping you understand resource utilization. Agent Carlos averages 8 minutes per contact, whereas most other agents average 12 minutes. This might indicate Carlos has developed efficient techniques that could be shared with the team."
            },
            {
              "type": "p",
              "text": "Occupancy: This metric shows what percentage of an agent's time is spent handling contacts compared to waiting for new ones. High occupancy (above 85%) might indicate your team is understaffed and at risk of burnout. If your team's occupancy consistently runs at 92-95%, agents have very little downtime between contacts, which could lead to stress, fatigue, and eventual turnover."
            },
            {
              "type": "p",
              "text": "Agent non-response: This metric tracks instances where agents failed to respond to contacts. High agent non-response can indicate technical problems, training issues, or overwhelming contact volume. A sudden increase in non-response events might reveal that new agents are not comfortable with a particular contact type or that there is an issue with the routing system."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed agent metrics, move on to the next tab to learn about queue metrics."
            },
            {
              "type": "p",
              "text": "For more information on the available metrics in Amazon Connect, visit the Metric definitions in Amazon Connect section in the Amazon Connect Administrator Guide"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Real world example",
          "blocks": [
            {
              "type": "p",
              "text": "Now consider how these metrics work together in a real scenario."
            },
            {
              "type": "p",
              "text": "You notice that abandonment rates are increasing and service levels are decreasing, particularly during midday hours. By examining queue metrics, you discover average queue answer times have increased to over 5 minutes during lunch hours."
            },
            {
              "type": "p",
              "text": "Digging deeper into agent metrics, you find that agent occupancy is at 98% during these times, indicating your team is severely overloaded. Having knowledge of this data, you could do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Adjust break schedules to ensure adequate coverage during peak periods.",
                "Add additional staff during the midday rush.",
                "Develop self-service options for common midday inquiries."
              ]
            },
            {
              "type": "p",
              "text": "After implementing these changes, you might see abandonment rates drop from 20% to 5% and customer satisfaction scores increase significantly."
            },
            {
              "type": "p",
              "text": "Remember that metrics work best when used together to tell a complete story. A single metric in isolation might be misleading. High talk time could indicate either thorough customer service or inefficient processes, depending on context from other metrics."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Queue Metrics",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Contact Metrics"
            },
            {
              "type": "p",
              "text": "Queue metrics help you manage customer wait times and help ensure contacts are distributed efficiently. These metrics focus on the customer experience before they connect with an agent."
            },
            {
              "type": "p",
              "text": "Abandonment rate: This metric is the percentage of customers who disconnect before speaking with an agent. High abandonment rates often signal excessive wait times or ineffective queue messaging. An abandonment rate that jumps from 5% to 15% might indicate a staffing shortage or sudden increase in contact volume that needs immediate attention."
            },
            {
              "type": "p",
              "text": "Service level: This metric shows the percentage of contacts answered within a target time (like 80% in 30 seconds). This is a standard contact center benchmark that measures your ability to respond promptly to customers. If your morning queue has a 65% service level and your afternoon service level is 85%, you might need to adjust staffing patterns to better match contact volume throughout the day."
            },
            {
              "type": "p",
              "text": "Contacts in queue: This metric is the real-time count of waiting customers. This metric provides immediate visibility into potential bottlenecks. A sudden spike in queue count might indicate an unexpected issue affecting many customers simultaneously, requiring rapid response."
            },
            {
              "type": "p",
              "text": "Average Queue Answer Time: This is how long customers typically wait before connecting with an agent. This metric directly impacts customer satisfaction and abandonment rates. If this metric begins trending upward over several days, it is often a sign that you need additional staff or improved self-service options."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed Queue metrics, move on to the next tab to learn about Contact metrics."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Contact Metrics"
            },
            {
              "type": "p",
              "text": "Contact metrics provide insights into the full customer journey and help you understand the overall effectiveness of your contact center."
            },
            {
              "type": "p",
              "text": "Average contact duration: This is the typical length of a customer interaction from start to finish. Longer durations might indicate complex or inefficient resolution processes. If contacts about password resets average 8 minutes, but industry standard is 3-4 minutes, you might need to streamline your reset process or enhance agent training."
            },
            {
              "type": "p",
              "text": "Contacts handled: This is the total number of interactions managed during a specified period. Tracking this metric over time helps identify patterns in contact volume for staffing planning. By noticing that contact volume increases by 40% in the first week of each month, you can plan staffing accordingly, rather than being caught unprepared."
            },
            {
              "type": "p",
              "text": "Contacts resolved in X: This is the percentage of contacts resolved within a target timeframe. This metric helps you understand efficiency from the customer perspective. If only 60% of technical support interactions are resolved in the first contact, you might need to provide agents with better troubleshooting tools or additional training."
            },
            {
              "type": "p",
              "text": "Average resolution time: This is how long it typically takes to completely resolve a customer interaction, which might span multiple contacts. From the customer perspective, total time to resolution is often more important than individual contact duration. Discovering that billing issues take an average of three contacts over 4 days to resolve might prompt you to develop a more streamlined billing resolution process."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t3",
      "number": 3,
      "title": "Bot Metrics",
      "shortTitle": "Bot Metrics",
      "summary": "Have you ever called a company and interacted with a chatbot or voice assistant that seemed to misunderstand everything you said? Or perhaps you…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever called a company and interacted with a chatbot or voice assistant that seemed to misunderstand everything you said? Or perhaps you have experienced a bot that impressively solved your problem without ever needing human help? The difference between these experiences often comes down to how well organizations monitor and optimize their bots."
            },
            {
              "type": "p",
              "text": "Amazon Connect provides specialized metrics for tracking bot performance, helping you create automated experiences that actually work for customers rather than frustrating them."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Bot conversations overview table"
            },
            {
              "type": "p",
              "text": "The following metrics table helps you understand how well your automated systems are serving customers."
            },
            {
              "type": "p",
              "text": "To learn more about what each metric measures and how to interpret it, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "The Bot conversations overview table displays a snapshot of bot conversation metrics aggregated over the selected time range."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world example",
          "blocks": [
            {
              "type": "p",
              "text": "Your metrics show that customers asking about order status have a 78% bot resolution rate, and those asking about returns have only a 45% resolution rate. By examining the conversation flows, you discover that the returns process requires more complex decision trees that confuse customers."
            },
            {
              "type": "p",
              "text": "Based on this data, you could streamline the returns flow by breaking complex questions into smaller steps and adding clearer examples of what the bot can understand. After these improvements, you might see returns resolution rates climb to 65%, significantly reducing agent workload."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Integration with other metrics",
          "blocks": [
            {
              "type": "p",
              "text": "Bot metrics work best when analyzed alongside other contact center data, such as the following:"
            },
            {
              "type": "p",
              "text": "If bot metrics show high transfer-to-agent rates during specific hours, check queue metrics during those same times to see if staffing adjustments are needed."
            },
            {
              "type": "p",
              "text": "When bot metrics indicate customers frequently abandon during particular intents, review those conversation transcripts to identify patterns in customer language that might improve intent recognition."
            },
            {
              "type": "p",
              "text": "Compare bot resolution rates across different channels (voice compared to chat) to determine where automation is most effective and where human touch might be more valuable."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for bot measurement",
          "blocks": [
            {
              "type": "p",
              "text": "To get the most from your bot metrics, incorporate the following best practices:"
            },
            {
              "type": "ul",
              "items": [
                "Establish baseline performance before making changes to bot flows or intents.",
                "Regularly review bot conversations with low success rates to identify improvement opportunities.",
                "Test bot updates with small customer segments before full deployment.",
                "Compare metrics before and after changes to quantify improvements."
              ]
            },
            {
              "type": "p",
              "text": "Set realistic targets based on intent complexity. For example, basic information requests might achieve 90% resolution rates, whereas complex troubleshooting might only reach 50-60%."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t4",
      "number": 4,
      "title": "Conversation Analytics Metrics",
      "shortTitle": "Conversation Analytics Metrics",
      "summary": "Have you ever wished you could listen to every customer conversation to uncover hidden patterns, detect emerging issues, or identify your…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever wished you could listen to every customer conversation to uncover hidden patterns, detect emerging issues, or identify your top-performing agents? Although personally reviewing thousands of interactions is impossible, the conversational analytics capabilities of Amazon Connect make this level of insight achievable."
            },
            {
              "type": "p",
              "text": "Amazon Connect Contact Lens is an advanced analytics feature. It uses machine learning (ML) to analyze conversations and uncover insights that would otherwise remain hidden in your contact center data. You can now explore how these powerful analytics work and the value they can bring to your organization."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Capture conversations"
            },
            {
              "type": "p",
              "text": "Conversational analytics uses AI to analyze customer interactions across voice and chat channels. Unlike traditional quality monitoring that might sample only 1-2% of contacts, this technology can process 100% of your interactions."
            },
            {
              "type": "p",
              "text": "In Amazon Connect, conversational analytics is powered by Contact Lens, which automatically processes recordings and transcripts to extract actionable insights. This creates a comprehensive view of customer interactions without requiring massive increases in quality assurance staff."
            },
            {
              "type": "p",
              "text": "The system captures the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Metadata about timing, participants, and outcomes",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Analyze conversation characteristics"
            },
            {
              "type": "p",
              "text": "After conversations are captured, the system analyzes various characteristics to understand what is happening in each interaction."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Average talk time",
          "blocks": [
            {
              "type": "p",
              "text": "This metric measures the average time spent talking during a voice contact across either the customer or the agent. This helps identify agents who might be overly verbose or not providing enough information."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Average agent interruptions",
          "blocks": [
            {
              "type": "p",
              "text": "This metric counts how often agents interrupt customers during conversations. Frequent interruptions might indicate poor listening skills or overly scripted responses, which can frustrate customers."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Average non-talk time",
          "blocks": [
            {
              "type": "p",
              "text": "This metric measures silent periods during calls when neither party is speaking. Extended silence might indicate system issues, agent uncertainty, or customers struggling to understand information."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Apply real-time rules"
            },
            {
              "type": "p",
              "text": "Contact Lens does not just analyze conversations after they end. It also provides real-time analysis during ongoing interactions."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Live sentiment tracking",
          "blocks": [
            {
              "type": "p",
              "text": "The system analyzes customer tone and language to determine if they are having a positive, neutral, or negative experience. This makes it possible for supervisors to identify problematic interactions before they end and potentially intervene."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Real-time compliance alerts",
          "blocks": [
            {
              "type": "p",
              "text": "The system can recognize potential compliance issues during conversations. These alerts enable immediate intervention if agents miss required disclosures or enter sensitive areas without proper handling."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Generate insights and take action"
            },
            {
              "type": "p",
              "text": "The final step of conversational analytics is transforming raw data into actionable insights."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Agent coaching",
          "blocks": [
            {
              "type": "p",
              "text": "You can use conversation recordings and transcripts to create targeted coaching. Agent John has twice the number of customer interruptions as the team average, and his customer sentiment scores are consistently lower. You could develop focused coaching on listening skills and avoiding interruptions."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Compliance monitoring",
          "blocks": [
            {
              "type": "p",
              "text": "With this metric, you can identify when required disclosures or authentication steps are missed. You might discover that authentication procedures are followed 98% of the time during normal hours but drop to 85% during peak periods. This indicates a need for additional training or staffing."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t4-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Issue identification",
          "blocks": [
            {
              "type": "p",
              "text": "Analyze common phrases and topics across thousands of interactions to identify emerging issues. If mentions of website error increase by 300% over 2 days, you can alert your web team to investigate potential problems promptly."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Implementation best practices"
            },
            {
              "type": "p",
              "text": "Get the most value from conversational analytics by incorporating the following best practices:"
            },
            {
              "type": "ul",
              "items": [
                "Start with clear goals for which insights you want to extract from conversations.",
                "Establish baseline metrics before implementing changes based on analytics.",
                "Focus on trends rather than individual outliers when making policy decisions.",
                "Use conversational insights to create custom agent coaching rather than general training.",
                "Combine conversational analytics with traditional metrics for a complete performance picture.",
                "Review analytics settings regularly to ensure they reflect current business priorities."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t5",
      "number": 5,
      "title": "Evaluation Metrics",
      "shortTitle": "Evaluation Metrics",
      "summary": "Think about the last time you called a customer service line. What made the experience great or terrible? Was it the agent's knowledge, their…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Think about the last time you called a customer service line. What made the experience great or terrible? Was it the agent's knowledge, their tone, or how quickly they solved your problem? Measuring these aspects of agent performance consistently is crucial for contact centers, but traditionally, it has been highly manual and subjective."
            },
            {
              "type": "p",
              "text": "Amazon Connect evaluation capabilities transform this process, combining human assessment with ML to create more objective, scalable, quality monitoring. You will now explore how evaluation metrics can help you consistently measure and improve agent performance."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Understanding agent evaluations"
            },
            {
              "type": "p",
              "text": "Agent evaluations assess performance against standard criteria, providing structured feedback for improvement. In traditional contact centers, this typically involves supervisors manually reviewing a small sample of recordings and scoring them against a form. Amazon Connect enhances this process by doing the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Allowing customizable evaluation forms based on your specific quality standards",
          "blocks": [
            {
              "type": "p",
              "text": "Integrating with Contact Lens to automatically pre-populate certain evaluation fields"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Generating evaluation metrics to track performance trends over time",
          "blocks": [
            {
              "type": "p",
              "text": "Targeted coaching can significantly improve key performance metrics across multiple dimensions of agent performance."
            },
            {
              "type": "p",
              "text": "Comparison of traditional and Amazon Connect agent evaluation methods."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Comparison of traditional and Amazon Connect agent evaluation methods",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Key evaluation metrics"
            },
            {
              "type": "p",
              "text": "Amazon Connect provides several metrics categories for measuring evaluation effectiveness."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Form Completion Metrics",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Performance Score Metrics"
            },
            {
              "type": "p",
              "text": "Evaluations performed: This metric tracks how many evaluations supervisors complete over time and helps ensure you are meeting your quality assurance (QA) targets. For example, if your goal is to evaluate 5% of all contacts but metrics show only 2% completion, you might need to adjust supervisor workloads or evaluation processes."
            },
            {
              "type": "p",
              "text": "Evaluation coverage: This metric can be calculated by dividing the number of evaluations performed by the total number of contacts handled. This metric provides the percentage of contacts that received an evaluation and helps ensure fair and consistent quality monitoring across your team. You should aim for consistent coverage across all agents, shifts, and contact types."
            },
            {
              "type": "p",
              "text": "This metric shows which percentage of agents or contacts receive evaluations and helps ensure fair and consistent quality monitoring across your team. You should aim for consistent coverage across all agents, shifts, and contact types."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed form completion metrics, move on to the next tab to learn about performance score metrics."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Driving performance with evaluations"
            },
            {
              "type": "p",
              "text": "Evaluation metrics drive performance improvements in several ways."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Targeted coaching"
            },
            {
              "type": "p",
              "text": "If evaluation metrics show that Agent Maria consistently scores low on product knowledge but high on customer rapport, you can create personalized coaching focused specifically on product training rather than generic customer service skills."
            },
            {
              "type": "p",
              "text": "This targeted approach does the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Creates measurable improvement goals",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Trend analysis"
            },
            {
              "type": "p",
              "text": "By tracking evaluation scores over time, you can measure the impact of training initiatives."
            },
            {
              "type": "p",
              "text": "For example, after implementing a new problem-resolution training program, you notice average scores for this category increase by 15% over the following 2 months, quantifying the program's effectiveness."
            },
            {
              "type": "p",
              "text": "This data helps you do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Justify investment in training.",
                "Identify which training approaches work best.",
                "Recognize improvements objectively.",
                "Make data-driven decisions about future initiatives."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Calibration verification"
            },
            {
              "type": "p",
              "text": "Evaluation metrics help ensure consistency among different supervisors."
            },
            {
              "type": "p",
              "text": "For example, if one supervisor's average scores are consistently 20% higher than others, this indicates a need for calibration sessions to standardize rating approaches."
            },
            {
              "type": "p",
              "text": "Regular calibration does the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Identifies supervisors who might need coaching on evaluation skills",
          "blocks": [
            {
              "type": "p",
              "text": "Before and after visualization showing how evaluation metrics improve over time with proper coaching."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Automated evaluations with Contact Lens"
            },
            {
              "type": "p",
              "text": "Amazon Connect Contact Lens can automatically pre-populate certain evaluation fields based on conversation analysis, making evaluations more objective and efficient. Script adherence and conversation characteristics are some automation options that are available to you."
            },
            {
              "type": "p",
              "text": "Script adherence: This automation helps ensure compliance requirements are objectively measured rather than subject to human interpretation. Contact Lens can detect whether agents used required phrases or disclosures, as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Appropriate closing statements: \"Is there anything else I can help you with today?\"",
          "blocks": [
            {
              "type": "p",
              "text": "Conversation characteristics: This automation reduces evaluation time and increases objectivity, because these factors are measured consistently rather than subjectively interpreted. The system can automatically assess factors such as the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t5-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Hold time and frequency",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Best practices for evaluation metrics"
            },
            {
              "type": "p",
              "text": "To maximize the value of your evaluation program, implement the following best practices for evaluation metrics:"
            },
            {
              "type": "ul",
              "items": [
                "Align evaluation criteria with your specific customer experience goals and brand values.",
                "Use a mix of objective (measurable) and subjective (quality-based) criteria.",
                "Regularly calibrate among supervisors to ensure scoring consistency.",
                "Connect evaluation results directly to coaching and training initiatives.",
                "Review evaluation forms quarterly to ensure they reflect current business priorities.",
                "Use evaluation metrics alongside operational metrics for a complete performance picture."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Performance Score Metrics"
            },
            {
              "type": "p",
              "text": "Average evaluation score: This is the overall agent performance rating across all evaluations and provides a high-level view of quality performance. Average evaluation score should be tracked over time to see if quality initiatives are improving overall performance."
            },
            {
              "type": "p",
              "text": "Section scores: These are performance ratings for specific categories like greeting quality, problem-solving, or compliance adherence. This helps to identify specific areas of strength or weakness. For example, if scores for problem resolution are consistently lower than other categories, this might indicate a need for additional training or improved tools."
            },
            {
              "type": "p",
              "text": "Question scores: These are detailed ratings for individual evaluation questions and provide granular insight into specific behaviors. Question scores identify the lowest-scoring questions across multiple agents to target training initiatives."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t6",
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
          "id": "connect-conversational-analytics-t6-q1",
          "question": "A contact center manager notices unusual customer behavior during peak hours and wants to quantify how many contacts are leaving the queue. Which metric would BEST provide this measurement?",
          "options": [
            {
              "id": "A",
              "text": "Average queue answer time"
            },
            {
              "id": "B",
              "text": "Queue abandon rate"
            },
            {
              "id": "C",
              "text": "Agent occupancy rate"
            },
            {
              "id": "D",
              "text": "Service level percentage"
            }
          ],
          "correctOptionId": "B",
          "rationale": "Agent occupancy rate shows how busy agents are but does not specifically indicate why customers are abandoning calls while waiting in queue."
        },
        {
          "id": "connect-conversational-analytics-t6-q2",
          "question": "An Amazon Connect administrator implements Amazon Lex bots to handle initial customer inquiries and wants to measure their effectiveness. Which metric would BEST evaluate whether the bots are successfully resolving customer issues without human intervention?",
          "options": [
            {
              "id": "A",
              "text": "Conversation duration"
            },
            {
              "id": "B",
              "text": "Completion rate"
            },
            {
              "id": "C",
              "text": "Error frequency"
            },
            {
              "id": "D",
              "text": "Containment rate"
            }
          ],
          "correctOptionId": "D",
          "rationale": "Completion rate shows successful bot interactions but does not specifically indicate whether human intervention was avoided."
        },
        {
          "id": "connect-conversational-analytics-t6-q3",
          "question": "A quality assurance (QA) team wants to analyze customer satisfaction trends across different interaction channels in Amazon Connect. Which conversational analytics metric would provide the MOST comprehensive view of interaction quality?",
          "options": [
            {
              "id": "A",
              "text": "Sentiment analysis scores"
            },
            {
              "id": "B",
              "text": "Talk time percentage"
            },
            {
              "id": "C",
              "text": "Hold time duration"
            },
            {
              "id": "D",
              "text": "Contact resolution status"
            }
          ],
          "correctOptionId": "A",
          "rationale": "Hold time duration indicates operational efficiency but does not reveal the quality or satisfaction aspects of customer interactions."
        },
        {
          "id": "connect-conversational-analytics-t6-q4",
          "question": "A business analyst needs to identify which Amazon Connect metrics would help determine if increasing agent staffing levels improved customer experience. Which combination of metrics would MOST effectively answer this specific business question?",
          "options": [
            {
              "id": "A",
              "text": "Average handle time and first call resolution"
            },
            {
              "id": "B",
              "text": "Service level and customer satisfaction score"
            },
            {
              "id": "C",
              "text": "Queue abandon rate and agent utilization"
            },
            {
              "id": "D",
              "text": "Contact volume and peak hour coverage"
            }
          ],
          "correctOptionId": "B",
          "rationale": "Service level and customer satisfaction score directly measure how well customers are served and their satisfaction. This most effectively shows the impact of increased staffing on customer experience."
        }
      ]
    },
    {
      "id": "connect-conversational-analytics-t7",
      "number": 7,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "You explored the fundamental metrics framework that powers contact center insights. You learned to differentiate between agent metrics, queue…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t7-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "You explored the fundamental metrics framework that powers contact center insights. You learned to differentiate between agent metrics, queue metrics, and bot performance indicators. The section showed you how Contact Lens analyzes conversations for deeper understanding. You studied how to use these metrics for improving customer experience and agent performance. These measurement tools form the foundation for data-driven decisions."
            },
            {
              "type": "p",
              "text": "Next up, we will explore recording configuration in Amazon Connect."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t8",
      "number": 8,
      "title": "Introduction to Recording Configuration",
      "shortTitle": "Introduction to Recording Configuration",
      "summary": "Imagine you are listening to a customer service call recording that suddenly cuts out during the most important part of the conversation. Or…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [
        "Differentiate between the recording types and formats available in Amazon Connect.",
        "Recognize how to configure appropriate storage settings for voice and chat recordings.",
        "Identify how to customize recording settings based on specific business and compliance needs.",
        "Apply best practices when implementing recording configurations to help ensure security and reliability."
      ],
      "sections": [
        {
          "id": "connect-conversational-analytics-t8-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine you are listening to a customer service call recording that suddenly cuts out during the most important part of the conversation. Or worse, discovering your contact center is not recording calls that contain sensitive customer information, putting your company at regulatory risk. Recording configuration might sound technical, but it is actually the backbone of QA and compliance in any contact center."
            },
            {
              "type": "p",
              "text": "In this section, you will explore how Amazon Connect handles recordings, from basic voice recordings to comprehensive screen captures. You will learn how to set up, customize, and implement various recording types while following industry best practices."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t9",
      "number": 9,
      "title": "Channel-specific Features",
      "shortTitle": "Channel-specific Features",
      "summary": "When a customer service agent says, \"This call may be recorded for quality and training purposes,\" what exactly happens behind the scenes? In…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t9-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "When a customer service agent says, \"This call may be recorded for quality and training purposes,\" what exactly happens behind the scenes? In Amazon Connect, recordings go far beyond basic phone calls. You can now explore the various ways Amazon Connect can capture interactions between agents and customers."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Recording Types",
          "blocks": [
            {
              "type": "p",
              "text": "Understanding these recording types is the first step to creating a comprehensive quality monitoring program that improves customer experience and agent performance."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Chat transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "This unique recording type captures conversations between customers and automated systems like interactive voice response (IVR) menus or chatbots before they connect with agents. With automated interaction recording enabled, voice recording starts as soon as it is enabled in the flow. Without this option enabled, recordings only start when an agent connects to the caller."
            },
            {
              "type": "p",
              "text": "The value of automated interaction recording includes the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Improving containment rates by addressing common failure points",
          "blocks": [
            {
              "type": "p",
              "text": "Use case example: By analyzing automated interaction recordings, you might discover that customers frequently get confused at a particular menu option. This makes it possible for you to reword that prompt for clarity."
            },
            {
              "type": "p",
              "text": "This analysis could lead to the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Higher self-service completion rates",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Start recording"
            },
            {
              "type": "p",
              "text": "Understanding when recordings begin is crucial for proper configuration."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Client Application",
          "blocks": [
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Consider which recording types are most appropriate for your business needs. Many contact centers use a combination of these recording types to create a complete picture of the customer experience."
              ]
            },
            {
              "type": "p",
              "text": "Review the following comparison chart to identify feature availability across various channels."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s7",
          "eyebrow": null,
          "duration": null,
          "title": "No",
          "blocks": [
            {
              "type": "p",
              "text": "By understanding the unique requirements of each channel and maintaining a unified management approach, you can create an effective recording strategy that balances quality, compliance, and operational efficiency."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Chat transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "Voice recordings in Amazon Connect offer several configuration options based on your specific needs. Review the following recording options that are available."
            },
            {
              "type": "p",
              "text": "Agent and customer recording: This is the most common and most comprehensive recording option because it captures both sides of the conversation. This allows for complete QA and training purposes. For example, when a customer explains a complex technical issue, capturing both sides makes it possible for you to hear the complete interaction. This helps you identify any communication gaps."
            },
            {
              "type": "p",
              "text": "Agent-only recording: This option records only what the agent says during the interaction. Agent-only recording is best for scenarios where customer information is particularly sensitive. For example, if your agents frequently handle financial transactions where customers verbally share credit card details, agent-only recording helps with compliance by not capturing the customer's sensitive information."
            },
            {
              "type": "p",
              "text": "Customer-only recording: This option captures only what the customer says. Customer-only recording is useful for specialized analytical scenarios or when agent information is sensitive. For example, when analyzing customer sentiment or specific phrases customers use to describe products, you might focus only on the customer side of conversations."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Chat transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "For text-based interactions, Amazon Connect can store complete chat transcripts between agents and customers."
            },
            {
              "type": "p",
              "text": "Unlike voice recordings (which require configuration), chat transcripts are automatically stored when an Amazon Simple Storage Service (Amazon S3) bucket exists for chat transcripts. Transcripts can be categorized and filtered to quickly navigate to relevant sections of customer interactions."
            },
            {
              "type": "p",
              "text": "Chat transcripts provide the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Permanent documentation of customer issues and resolutions",
          "blocks": [
            {
              "type": "p",
              "text": "Use case example: When reviewing a chat session where a customer expressed frustration, managers can see the exact conversation flow, identify where issues occurred, and coach agents on better responses for similar situations in the future."
            },
            {
              "type": "p",
              "text": "Chat transcripts are particularly valuable for the following situations:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Analyzing customer language patterns to improve chatbot capabilities",
          "blocks": [
            {
              "type": "p",
              "text": "Screen recording captures everything that is happening on an agent's screen during customer interactions, providing valuable visual context to voice conversations. There are several considerations to optimize your recording experience with Amazon Connect."
            },
            {
              "type": "p",
              "text": "Recording format: Screen recordings in Amazon Connect are saved in MP4 format, making them efficient to review on standard media players without special software. This is beneficial because it prevents the need for proprietary software to view recordings. It is important to consider that screen recording requires the Amazon Connect Client Application to be installed on agent workstations. Without this application, screen recording will not function even if enabled in your flows."
            },
            {
              "type": "p",
              "text": "System requirements: For screen recording to work properly, agent workstations need to have the following specifications:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t9-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Network: 600Kbps",
          "blocks": [
            {
              "type": "p",
              "text": "Supported operating systems: 64-bit Windows 10 and 11 based on the x86-64 architecture"
            },
            {
              "type": "p",
              "text": "Use case example: Imagine an agent helping a customer navigate a complex billing portal. With screen recording, you can see exactly what the agent was looking at, which screens they navigated to, and how efficiently they used available tools."
            },
            {
              "type": "p",
              "text": "This visual context helps do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Identify navigation issues in agent tools.",
                "Spot opportunities for UI improvements.",
                "Verify agents are following proper procedures.",
                "Create more effective training materials."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t10",
      "number": 10,
      "title": "Call Recording Strategies",
      "shortTitle": "Call Recording Strategies",
      "summary": "Have you ever wished you could record only certain types of customer conversations? Perhaps high-value sales calls or complex support issues? With…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t10-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever wished you could record only certain types of customer conversations? Perhaps high-value sales calls or complex support issues? With selective recording, you can be strategic about which interactions you capture, saving storage costs while focusing on the conversations that matter most."
            },
            {
              "type": "p",
              "text": "You can now explore how to configure recording settings based on specific interaction types in Amazon Connect. You will learn how to set up various recording approaches and choose the right strategy for different scenarios."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Recording all calls compared to selective recording",
          "blocks": [
            {
              "type": "p",
              "text": "The following are advantages and disadvantages associated with all call recording and selective recording."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s3",
          "eyebrow": null,
          "duration": null,
          "title": "All Calls Recording",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Selective Recording"
            },
            {
              "type": "p",
              "text": "Recording every customer interaction helps ensure complete coverage but might include unnecessary conversations. This option works best for highly regulated industries where documentation of all interactions is required, or when building initial training datasets. For example, a financial services company might record all calls related to investment advice due to regulatory requirements, helping ensure every recommendation is documented."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Creates comprehensive historical archive",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Creates larger volumes of data to manage",
          "blocks": [
            {
              "type": "p",
              "text": "Now that you have reviewed all calls recording, move on to the next tab to learn about selective recording."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Agent recording compared to customer recording",
          "blocks": [
            {
              "type": "p",
              "text": "The following are advantages and disadvantages associated with agent recording and customer recording."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Agent Recording",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Customer Recording"
            },
            {
              "type": "p",
              "text": "Agent recording captures only what the agent says during interactions. This option works best for evaluating agent script adherence or when extremely sensitive customer information is shared verbally. For example, a healthcare call center might record only the agent side when patients discuss detailed medical history, capturing how agents provide guidance without recording protected health information."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Might streamline compliance in some scenarios",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s9",
          "eyebrow": null,
          "duration": null,
          "title": "One-sided for dispute resolution",
          "blocks": [
            {
              "type": "p",
              "text": "Now that you have reviewed agent recording, move on to the next tab to learn about customer recording."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Static recording compared to dynamic recording rules",
          "blocks": [
            {
              "type": "p",
              "text": "The following are advantages and disadvantages associated with with static and dynamic recording rules."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Static Rules",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Dynamic Rules"
            },
            {
              "type": "p",
              "text": "Static rules apply the same recording behavior to all interactions of a certain type. This option works best for when recording needs are consistent and straightforward. For example, a sales organization always records sales calls but never records password reset calls."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Less prone to configuration errors",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s13",
          "eyebrow": null,
          "duration": null,
          "title": "One-size-fits-all approach",
          "blocks": [
            {
              "type": "p",
              "text": "Now that you have reviewed static rules, move on to the next tab to learn about dynamic rules."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s14",
          "eyebrow": null,
          "duration": null,
          "title": "Continuous pausing compared to selective pausing",
          "blocks": [
            {
              "type": "p",
              "text": "The following are advantages and disadvantages associated with with continuous pausing and selective pausing rules."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s15",
          "eyebrow": null,
          "duration": null,
          "title": "Continuous Recording",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Selective Pausing"
            },
            {
              "type": "p",
              "text": "Continuous recording records the entire interaction without interruption. This option works best for interactions with minimal sensitive data or when a complete record is essential for context."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s16",
          "eyebrow": null,
          "duration": null,
          "title": "Creates a single continuous recording file",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s17",
          "eyebrow": null,
          "duration": null,
          "title": "Might record unnecessary portions of calls",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Selective Recording"
            },
            {
              "type": "p",
              "text": "Recording only specific interactions types helps focus on high-value conversations while reducing storage requirements. This option works best for certain interaction types that have higher value or risk than others, or when storage costs are a significant concern. For example, a retail company might record only complaint calls and high-value purchases, ignoring routine order status inquiries that follow a basic script."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s18",
          "eyebrow": null,
          "duration": null,
          "title": "Streamlines compliance management for sensitive data",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s19",
          "eyebrow": null,
          "duration": null,
          "title": "More difficult to implement consistently",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Customer Recording"
            },
            {
              "type": "p",
              "text": "Customer recording captures only what the customer says during interactions. This option works best for analyzing customer language patterns for chatbot development or voice recognition training. For example, a product development team might analyze only customer portions of support calls to identify common ways customers describe product issues, improving knowledge base articles and automated solutions."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s20",
          "eyebrow": null,
          "duration": null,
          "title": "Can identify common issues and questions",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s21",
          "eyebrow": null,
          "duration": null,
          "title": "Not helpful for agent coaching",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Dynamic Rules"
            },
            {
              "type": "p",
              "text": "Dynamic rules change recording behavior based on contact attributes or flow conditions. This option works best for recording decisions that depend on multiple factors or conditions that might change during the interaction. For example, a customer service team starts recording when a customer expresses dissatisfaction or when call value exceeds a certain threshold."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s22",
          "eyebrow": null,
          "duration": null,
          "title": "Can respond to changing conditions during the contact",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s23",
          "eyebrow": null,
          "duration": null,
          "title": "Requires more sophisticated flow design",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Selective Pausing"
            },
            {
              "type": "p",
              "text": "Selective pausing temporarily stops recording during sensitive segments of the interaction. This option works best for when specific portions of interactions contain sensitive information that should not be recorded."
            },
            {
              "type": "p",
              "text": "Advantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s24",
          "eyebrow": null,
          "duration": null,
          "title": "More targeted storage use",
          "blocks": [
            {
              "type": "p",
              "text": "Disadvantages are as follows:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t10-s25",
          "eyebrow": null,
          "duration": null,
          "title": "Needs careful timing",
          "blocks": [
            {
              "type": "p",
              "text": "Now that you have reviewed selective pausing, move on to the remaining content."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t11",
      "number": 11,
      "title": "Enablement and customization",
      "shortTitle": "Enablement and customization",
      "summary": "Recording configuration in Amazon Connect requires careful planning to ensure you capture the right interactions while maintaining security and…",
      "duration": "~5 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t11-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Recording configuration in Amazon Connect requires careful planning to ensure you capture the right interactions while maintaining security and compliance. Understand the essential steps for setting up recording across voice, chat, and screen interactions. From storage configuration to security settings, you'll discover how to implement a recording system that meets your operational requirements while protecting sensitive customer information."
            },
            {
              "type": "p",
              "text": "You can enable Contact Lens conversational analytics in a few steps:"
            },
            {
              "type": "p",
              "text": "Enable Contact Lens on your Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "Add a Set recording and analytics behavior block to a flow, and configure it to enable conversational analytics for voice, chat, or both."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Enable Contact Lens",
          "blocks": [
            {
              "type": "p",
              "text": "Before you can enable conversational analytics, you first need to enable Contact Lens for your instance."
            },
            {
              "type": "ol",
              "items": [
                "Open the Amazon Connect console at https://console.aws.amazon.com/connect/",
                "On the instances page, choose the instance alias. The instance alias is also your instance name, which appears in your Amazon Connect URL. The following image shows the Amazon Connect virtual contact center instances page, with a box around the instance alias."
              ]
            },
            {
              "type": "p",
              "text": "Amazon Connect instances page."
            },
            {
              "type": "p",
              "text": "In the Amazon Connect console, in the navigation pane, choose Analytics tools, and then choose Enable Contact Lens."
            },
            {
              "type": "p",
              "text": "Choose Save."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Set recording and analytics behavior block",
          "blocks": [
            {
              "type": "p",
              "text": "The following image shows a block that is configured for call recording including automated interaction with speech analytics, screen recording and chat analytics. The Call recording option is set to Agent and customer. In the Analytics section, the options are selected for speech post-call analytics and chat."
            },
            {
              "type": "p",
              "text": "Amazon Connect Set recording and analytics behavior block showing the enable recording and analytics section."
            },
            {
              "type": "p",
              "text": "Amazon Connect Set recording and analytics behavior block showing the enable recording and analytics section."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Analytics customization"
            },
            {
              "type": "p",
              "text": "With the ability to configure Contact Lens analytics, once enabled for your specific channels. Providing configuration to set your language, data redaction, sentiment analysis and generative AI post-contact summary."
            },
            {
              "type": "p",
              "text": "Amazon Connect Set recording and analytics behavior block showing the configure analytics section."
            },
            {
              "type": "p",
              "text": "Amazon Connect Set recording and analytics behavior block showing the configure analytics section."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Sentiment Analysis",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Post-contact Summary"
            },
            {
              "type": "p",
              "text": "For multilingual contact centers, language customization is crucial. To customize language, do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Configure default language for analytics.",
                "Set up dynamic language selection based on contact attributes.",
                "Optimize transcription accuracy for specific dialects or accents."
              ]
            },
            {
              "type": "p",
              "text": "To learn more about what languages are supported in Amazon Connect, visit the Languages supported by Amazon Connect features in the Amazon Connect Administration Guide."
            },
            {
              "type": "p",
              "text": "Amazon Connect set recording and analytics block - Set languages."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Dynamically controlling recording behavior",
          "blocks": [
            {
              "type": "p",
              "text": "Regardless of which recording strategy you choose, consider the following implementation approaches."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Using Contact Attributes",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Calling Amazon Connect API"
            },
            {
              "type": "p",
              "text": "You can dynamically enable the redaction of the output files based on the language of the customer."
            },
            {
              "type": "p",
              "text": "For example, for customers using en-US, you may want only a redacted file whereas for those using en-GB, you may want both the original and redacted output files"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s7",
          "eyebrow": null,
          "duration": null,
          "title": "RedactedAndOriginal",
          "blocks": [
            {
              "type": "p",
              "text": "Language: Choose from the list of available languages."
            },
            {
              "type": "p",
              "text": "Set these user defined attributes using a Set contact attributes block and define the Destination key and Value for redaction and language as needed."
            },
            {
              "type": "p",
              "text": "For more information about using the set contact attributes, visit the How to reference contact attributes. section in that Amazon Connect Administrator Guide."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Always test your recording configuration thoroughly before implementing in production to ensure it captures what you need while protecting sensitive information."
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Example implementation",
          "blocks": [
            {
              "type": "p",
              "text": "The following is a sample flow implementation for a payment call:"
            },
            {
              "type": "ol",
              "items": [
                "Start with a Set recording behavior block configured to record both the agent and customer.",
                "Before payment collection, add another block that sets recording to Off.",
                "After payment collection, add a block that resumes recording both parties.",
                "Test this flow to verify the recording pauses and resumes appropriately."
              ]
            },
            {
              "type": "p",
              "text": "Consider your specific business needs and how these customization options might help you address them effectively."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Sentiment Analysis",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Post-contact Summary"
            },
            {
              "type": "p",
              "text": "You can protect your customer's privacy by redacting sensitive data, such as name, address, and credit card information from transcripts and audio recordings."
            },
            {
              "type": "p",
              "text": "Amazon Connect offers powerful redaction customization, such as the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Applying redaction rules to specific contact types",
          "blocks": [
            {
              "type": "p",
              "text": "For example, for healthcare calls, you might configure redaction to mask patient identification numbers, whereas financial calls might have credit card and account numbers redacted."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Sentiment Analysis",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Post-contact Summary"
            },
            {
              "type": "p",
              "text": "Conversational analytics performs sentiment analysis between customers and agents by using speech and chat transcriptions, natural language processing, and intelligent search capabilities."
            },
            {
              "type": "p",
              "text": "Customer sentiment trend: This graph shows how customer sentiment changes as the contact progresses. For more information, see Investigate sentiment scores."
            },
            {
              "type": "p",
              "text": "Customer sentiment: This graph shows the distribution of customer sentiment for the entire call. This is calculated by counting the total number of conversation turns or chat messages where a customer had Positive, Neutral, and Negative sentiment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Post-contact Summary"
            },
            {
              "type": "p",
              "text": "You can save valuable time with generative AI-powered post-contact summaries that provide essential information from customer conversations in a structured, concise, and easy to read format."
            },
            {
              "type": "p",
              "text": "You can access generative AI-powered post-contact summaries multiple ways:"
            },
            {
              "type": "p",
              "text": "Agents can access post-contact summaries for voice contacts on the Contact Control Panel (CCP). They can use the summaries to quickly complete their After Contact Work (ACW)."
            },
            {
              "type": "p",
              "text": "Managers and supervisors can access summaries for voice and chat contacts on the Amazon Connect admin website, on the Contact details and the Contact search pages. They can use the summaries to quickly understand the issues and outcomes for the contacts they are reviewing."
            },
            {
              "type": "p",
              "text": "Developers can directly ingest the summaries from the APIs into third-party systems. They can also integrate with Amazon Kinesis Data Streams for streaming. This latter option is useful when you have higher loads and you want avoid having the TPS throttled."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Calling Amazon Connect API"
            },
            {
              "type": "p",
              "text": "For more advanced control, use the following Amazon Connect APIs:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t11-s12",
          "eyebrow": null,
          "duration": null,
          "title": "ResumeContactRecording: Restarts recording after suspension",
          "blocks": [
            {
              "type": "p",
              "text": "These can be triggered by specific events in your flows."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t12",
      "number": 12,
      "title": "Real-time Monitoring",
      "shortTitle": "Real-time Monitoring",
      "summary": "Have you ever wished you could be in multiple places at the same time to help your team? The monitoring interface is your virtual way of doing…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t12-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever wished you could be in multiple places at the same time to help your team? The monitoring interface is your virtual way of doing exactly that. Before you can start monitoring conversations, you need to set up the right environment."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t12-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Real-time metrics report exploration",
          "blocks": [
            {
              "type": "p",
              "text": "Welcome to the real-time metrics report. With this interactive dashboard, supervisors can observe ongoing customer interactions and provide support when needed. Explore each element to understand its function and how to use it effectively, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Real time metrics dashboard with voice channel monitoring available."
            },
            {
              "type": "p",
              "text": "To learn more about how to set up the real-time metrics report, choose the arrow buttons to display each of the following six steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "1 of 7"
            },
            {
              "type": "p",
              "text": "Introduction Think of the real-time metrics report setup like preparing a mission control room. You need the right screens, the right access, and the right tools to effectively oversee your team's interactions. Now get your monitoring station ready for action."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t12-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Best Practices for effective monitoring",
          "blocks": [
            {
              "type": "p",
              "text": "To make the most of your monitoring capabilities, do the following:"
            },
            {
              "type": "p",
              "text": "Be consistent: Set a regular schedule to monitor different agents. For example, \"I will monitor two conversations per agent each week.\" This creates a fair and predictable quality program rather than seeming random or targeted."
            },
            {
              "type": "p",
              "text": "Focus on development: Use monitoring primarily as a coaching tool, not just for evaluation. For example, after monitoring, share one positive observation and one improvement suggestion. This balanced approach helps agents see monitoring as helpful rather than punitive."
            },
            {
              "type": "p",
              "text": "Create monitoring checklists: Know what you are looking for before you start monitoring. For example, develop a basic checklist covering greeting, problem-solving, and closing. This ensures you are evaluating consistently across different conversations."
            },
            {
              "type": "p",
              "text": "Recognize patterns: Monitor multiple agents handling similar issues to identify training needs. For example, if several agents struggle with the same product questions, plan targeted training. This helps you address systemic issues rather than individual performance gaps."
            },
            {
              "type": "p",
              "text": "Follow up promptly: Share feedback soon after monitoring when the conversation is still fresh. For example, schedule 15-minute check-ins within 24 hours of monitoring. This makes the feedback more relevant and actionable for agents."
            },
            {
              "type": "p",
              "text": "Remember that monitoring is like classroom observation. It works best when agents know it is happening regularly and when the goal is improvement, not punishment."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Sort by contact duration to identify potentially complex interactions that might need assistance."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 1: Understand the real-time metrics report"
            },
            {
              "type": "p",
              "text": "The real-time metrics report is the control center where supervisors can observe agent interactions with customers. This interface provides a window into ongoing conversations without interrupting the agent or alerting the customer."
            },
            {
              "type": "p",
              "text": "Think of it as a one-way mirror in a training room. The supervisor can see and hear what is happening, but the agent handles the conversation independently unless help is needed."
            },
            {
              "type": "p",
              "text": "The monitoring interface typically shows the following:"
            },
            {
              "type": "p",
              "text": "Which agents are currently active"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t12-s4",
          "eyebrow": null,
          "duration": null,
          "title": "What type of conversation they are handling (voice or chat)",
          "blocks": [
            {
              "type": "p",
              "text": "How long the conversation has been going on"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t12-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Options to join or monitor the conversation",
          "blocks": [
            {
              "type": "p",
              "text": "This visibility helps supervisors do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Identify struggling agents who might need assistance.",
                "Recognize successful techniques they can share with the team.",
                "Ensure quality standards are being maintained.",
                "Provide real-time coaching when necessary."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 2: Configure permissions"
            },
            {
              "type": "p",
              "text": "Before anyone can monitor conversations, they need the right permissions. These permissions help ensure only authorized personnel can access customer conversations."
            },
            {
              "type": "p",
              "text": "To set up monitoring permissions, do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Navigate to your Amazon Connect Admin Workspace.",
                "On the navigation menu, choose Security profiles.",
                "Either create a new profile for supervisors or modify an existing one.",
                "Configure the following essential permissions:"
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t12-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Make outbound calls (needed to provide the ability to join monitoring sessions)",
          "blocks": [
            {
              "type": "p",
              "text": "Important security note: Giving someone monitoring permissions is like handing them a key to all customer conversations. Only assign these permissions to supervisors and QA personnel who need them for their job."
            },
            {
              "type": "ul",
              "items": [
                "Step 3: Configure contact flows",
                "For monitoring to work properly, you need to configure your contact flows, as follows:"
              ]
            },
            {
              "type": "p",
              "text": "Open the flow editor."
            },
            {
              "type": "p",
              "text": "Add a Set recording and analytics behavior block to your flow."
            },
            {
              "type": "p",
              "text": "Configure the block to enable call recording. This will enable the ability to monitor calls."
            },
            {
              "type": "p",
              "text": "Connect this block early in your flow, before agent connection."
            },
            {
              "type": "p",
              "text": "The recording behavior block configures what supervisors can monitor, as follows:"
            },
            {
              "type": "ul",
              "items": [
                "Voice recording customer and agent needs to be enabled in this block.",
                "Without this block, supervisors will not be able to join ongoing chat or voice conversations."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 4: Enable enhanced monitoring Features"
            },
            {
              "type": "p",
              "text": "For the best monitoring experience, you should enable advanced monitoring features by doing the following:"
            },
            {
              "type": "ul",
              "items": [
                "Navigate to the Amazon Connect service page in the AWS Console.",
                "Select the instance alias of your Amazon Connect instance settings.",
                "On the navigation menu under Channels and communications, choose Telephony."
              ]
            },
            {
              "type": "p",
              "text": "In the Enhanced contact monitoring capabilities section, select Enable Multi-Party Calls and Enhanced Monitoring for Voice for voice contacts."
            },
            {
              "type": "p",
              "text": "Select Multi-Party Chats and Enhanced Monitoring for Chat for chat contacts."
            },
            {
              "type": "p",
              "text": "With these settings, multiple supervisors can monitor the same conversation and provide enhanced features like the ability to join conversations when needed."
            },
            {
              "type": "p",
              "text": "Benefits of enhanced monitoring include the following:"
            },
            {
              "type": "ul",
              "items": [
                "Multiple supervisors can monitor simultaneously.",
                "Supervisors experience smoother joining of conversations.",
                "Supervisors receive better audio quality for monitoring sessions.",
                "Supervisors get improved reliability for monitoring connections.",
                "Supervisors are able to barge into conversations to support agents."
              ]
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "Note",
              "body": [
                "When you enable enhanced monitoring features in your system settings, you no longer need to add the Set recording behavior block to your flows."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Step 5: Test your monitoring setup"
            },
            {
              "type": "p",
              "text": "Before rolling out monitoring to all supervisors, test your setup by doing the following:"
            },
            {
              "type": "ul",
              "items": [
                "Have one person act as an agent and another as a customer.",
                "Start a test conversation between them.",
                "Log in as a supervisor with monitoring permissions.",
                "Try to monitor the conversation using the real-time metrics dashboard.",
                "Verify that you can hear or see the conversation properly.",
                "Verify the supervisor can barge in to the voice or chat conversation.",
                "If you cannot monitor or barge in on the conversation, check the following common issues:",
                "Permissions might not be correctly assigned.",
                "The recording behavior block might be missing or in the wrong position.",
                "Enhanced monitoring features might not be enabled.",
                "Network connectivity problems might be preventing the connection.",
                "The testing checklist is as follows:",
                "Verify both voice and chat monitoring (if applicable).",
                "Test with multiple browsers to ensure compatibility.",
                "Confirm monitoring audio quality is sufficient.",
                "Check that supervisors can successfully join conversations if needed.",
                "Verify that agents receive appropriate notification when monitoring begins (if configured)."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "After your monitoring interface is properly set up and tested, supervisors will be ready to provide effective oversight and support to your agent team."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t13",
      "number": 13,
      "title": "Implementation Best Practices",
      "shortTitle": "Implementation Best Practices",
      "summary": "Have you ever followed a recipe only to have your dish turn out completely different from what you expected? Much like cooking, implementing…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t13-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever followed a recipe only to have your dish turn out completely different from what you expected? Much like cooking, implementing recording configuration in Amazon Connect requires following best practices to get the desired results."
            },
            {
              "type": "p",
              "text": "You will explore proven strategies to help ensure your recording implementation is secure, efficient, and aligned with regulatory requirements. These best practices will help you avoid common pitfalls and create a recording system that serves both your operational and compliance needs."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t13-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Technical Implementation Best Practices",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Operational Best Practices"
            },
            {
              "type": "p",
              "text": "The following are best practices to protect sensitive recorded data:"
            },
            {
              "type": "p",
              "text": "Enable encryption for all recording storage: This is important because unencrypted recordings could expose sensitive customer information if accessed improperly. You should configure encryption when setting up S3 buckets for recording storage."
            },
            {
              "type": "p",
              "text": "Consider using customer-managed AWS Key Management Service (AWS KMS) keys for additional control: Customer-managed keys provide more control over who can access encrypted data. During implementation, consider creating dedicated KMS keys for recording storage with strict access controls."
            },
            {
              "type": "p",
              "text": "Create specific security profiles for recording access: Limiting access to recordings helps prevent unauthorized exposure of customer information. Prior to implementation, define roles with different levels of access based on job responsibilities."
            },
            {
              "type": "p",
              "text": "Limit download capabilities to only those who need it: Downloading creates additional copies of recordings that might not be properly secured. Because most users only need playback access (not download rights), you should consider limitation during your implementation."
            },
            {
              "type": "p",
              "text": "Enable AWS CloudTrail for all recording access activities: Audit logs help you track who accessed recordings and when. If you set up alerts for unusual access patterns that might indicate security issues."
            },
            {
              "type": "p",
              "text": "Set up alerts for unusual access patterns: Proactive monitoring can identify potential security breaches quickly. Create Amazon CloudWatch alarms for activities like bulk downloads or after-hours access."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed security best practices , move on to the next tab to learn about compliance best practices."
            },
            {
              "type": "p",
              "text": "By following these best practices, you will create a recording system that balances security, compliance, and operational needs effectively."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t13-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Technical Implementation Best Practices",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Operational Best Practices"
            },
            {
              "type": "p",
              "text": "Meet regulatory requirements with the following implementation approaches:"
            },
            {
              "type": "p",
              "text": "Conduct eligibility audits for all services used: Different Amazon Web Services (AWS) services have different compliance certifications. You should use AWS Artifact to verify which services meet your compliance needs."
            },
            {
              "type": "p",
              "text": "Ensure encryption applies to all integration points: Your data should remain encrypted throughout its lifecycle. Review all points where recording data might be transferred or stored."
            },
            {
              "type": "p",
              "text": "Use the Store customer input block with encryption for sensitive dual-tone multi-frequency (DTMF) information: Touch-tone entry often contains sensitive data like account numbers. Because of this, you should always encrypt stored customer input in contact flows."
            },
            {
              "type": "p",
              "text": "Implement recording pauses during payment card collection: Payment Card Industry (PCI) compliance typically requires protecting card data from recording. You can use APIs to pause recording during sensitive segments of calls."
            },
            {
              "type": "p",
              "text": "Configure appropriate retention policies: Different regulations require different retention periods. To address this, you should set up Amazon S3 Lifecycle policies to manage recordings based on their compliance requirements."
            },
            {
              "type": "p",
              "text": "Set up automatic archiving to lower-cost storage tiers: Compliance retention can be expensive if using only standard storage. Automatic archiving will move older recordings to Amazon S3 Glacier storage and maintain required retention periods."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed compliance best practices, move on to the next tab to learn about technical implementations best practices."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t13-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Technical Implementation Best Practices",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Operational Best Practices"
            },
            {
              "type": "p",
              "text": "To ensure optimal performance and reliability during technical implementation, consider the following best practices:"
            },
            {
              "type": "p",
              "text": "Place recording blocks early in inbound flows: This will help ensure recording starts at the beginning of customer interactions. You should add recording blocks just after initial contact classification."
            },
            {
              "type": "p",
              "text": "Avoid placing recording blocks in queue flows: Recording blocks in queue flows might activate after agent connection. To avoid this, you should use inbound or outbound whisper flows for recording configuration."
            },
            {
              "type": "p",
              "text": "Use consistent recording configurations across similar flows: Inconsistent configuration leads to unpredictable recording behavior. For consistency, create reusable flow modules with standard recording settings."
            },
            {
              "type": "p",
              "text": "Ensure agent workstations meet recommended specifications: Insufficient resources can cause recording failures, especially for screen recording. During implementation remember to verify workstations meet the following minimum requirements:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t13-s5",
          "eyebrow": null,
          "duration": null,
          "title": "OS: Windows 10/11 (64-bit) for screen recording",
          "blocks": [
            {
              "type": "p",
              "text": "Test recording configuration before full deployment: Recording issues are more efficient to fix before wide implementation. Prior to implementation, you should create test flows to verify different recording scenarios work as expected."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed technical implementations best practices, move on to the next tab to learn about operational best practices."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Operational Best Practices"
            },
            {
              "type": "p",
              "text": "Day-to-day management of recordings requires operational discipline. The following operational best practices will help:"
            },
            {
              "type": "p",
              "text": "Establish clear evaluation criteria for recorded interactions: Recording is most valuable when systematically reviewed against standards. You should create evaluation forms that are aligned with your quality objectives."
            },
            {
              "type": "p",
              "text": "Implement regular calibration sessions using recordings: Different evaluators should score consistently. To accomplish this, have multiple supervisors evaluate the same recordings and discuss scoring differences."
            },
            {
              "type": "p",
              "text": "Train agents on when recordings occur and why: Transparency builds trust and improves agent performance. It is encouraged to include recording policies in agent training and provide clear guidelines on handling sensitive information"
            },
            {
              "type": "p",
              "text": "Regularly review recording configurations for improvement opportunities: Business needs and compliance requirements change over time. To avoid misalignments, schedule quarterly reviews of recording configurations and retention policies."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed operational best practices, move on to the remaining content."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t14",
      "number": 14,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-conversational-analytics-t14-q1",
          "question": "A financial services company needs to implement call recording in Amazon Connect for regulatory compliance purposes. Which recording type should the compliance officer configure to capture complete customer interactions?",
          "options": [
            {
              "id": "A",
              "text": "Agent audio only"
            },
            {
              "id": "B",
              "text": "Screen recording with audio"
            },
            {
              "id": "C",
              "text": "Automated interaction call recording and agent and customer voice recording"
            },
            {
              "id": "D",
              "text": "Chat transcript recording only"
            }
          ],
          "correctOptionId": "C",
          "rationale": "Screen recording with audio captures visual elements but is not the standard recording type for voice interactions in Amazon Connect and might not be required for compliance."
        },
        {
          "id": "connect-conversational-analytics-t14-q2",
          "question": "An Amazon Connect administrator must configure storage settings for a healthcare organization that handles sensitive patient information. Which storage configuration would BEST meet both security and compliance requirements?",
          "options": [
            {
              "id": "A",
              "text": "Standard Amazon S3 storage with public access"
            },
            {
              "id": "B",
              "text": "Amazon S3 with server-side encryption and private access"
            },
            {
              "id": "C",
              "text": "Local instance storage with backup"
            },
            {
              "id": "D",
              "text": "Amazon S3 Glacier with immediate retrieval"
            }
          ],
          "correctOptionId": "B",
          "rationale": "Local instance storage with backup does not use AWS managed security features and might not meet healthcare compliance standards for data protection and availability."
        },
        {
          "id": "connect-conversational-analytics-t14-q3",
          "question": "A retail company wants to customize Amazon Connect recording settings to capture only specific types of customer interactions while reducing storage costs. Which approach would MOST effectively balance their business needs with cost optimization?",
          "options": [
            {
              "id": "A",
              "text": "Record all interactions with maximum retention."
            },
            {
              "id": "B",
              "text": "Enable conditional recording based on contact attributes."
            },
            {
              "id": "C",
              "text": "Use lowest quality settings for all recordings."
            },
            {
              "id": "D",
              "text": "Disable recording for chat interactions completely."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Conditional recording based on contact attributes allows selective capture of specific interaction types and optimizes storage costs by avoiding unnecessary recordings of routine contacts."
        },
        {
          "id": "connect-conversational-analytics-t14-q4",
          "question": "An Amazon Connect implementation team must establish recording configurations that help ensure both security and reliability for a contact center. Which practice would BEST achieve these dual objectives?",
          "options": [
            {
              "id": "A",
              "text": "Single storage location with basic encryption"
            },
            {
              "id": "B",
              "text": "Local storage with manual backup processes"
            },
            {
              "id": "C",
              "text": "Cloud storage with default security settings"
            },
            {
              "id": "D",
              "text": "Multi-region storage replication with encryption in transit and at rest"
            }
          ],
          "correctOptionId": "D",
          "rationale": "Local storage with manual backup processes introduces reliability risks through manual processes and might not provide adequate security controls for sensitive customer interaction data."
        }
      ]
    },
    {
      "id": "connect-conversational-analytics-t15",
      "number": 15,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "You learned how to implement comprehensive recording capabilities across voice calls, chats, and screens. You studied live monitoring setup for…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t15-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "You learned how to implement comprehensive recording capabilities across voice calls, chats, and screens. You studied live monitoring setup for real-time supervision and coaching. The section covered advanced features like selective recording and multi-channel strategies. You explored quality assurance workflows and integration capabilities. You discovered technical best practices for optimal recording performance. This knowledge helps you capture and monitor customer interactions effectively."
            },
            {
              "type": "p",
              "text": "Next up, we will examine recording management."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t16",
      "number": 16,
      "title": "Introduction to Recording Management",
      "shortTitle": "Introduction to Recording Management",
      "summary": "Imagine you are a customer service manager at an online retail company. A customer calls claiming they were promised a refund last week, but there…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [
        "Search for and retrieve specific recorded conversations using the Amazon Connect search tools.",
        "Implement transcript handling procedures for both voice and chat interactions.",
        "Establish appropriate retention policies that balance compliance requirements with storage costs.",
        "Configure access controls to help ensure only authorized personnel can access specific recordings."
      ],
      "sections": [
        {
          "id": "connect-conversational-analytics-t16-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine you are a customer service manager at an online retail company. A customer calls claiming they were promised a refund last week, but there is no record of this in your system. Without a recording of that conversation, how do you verify what was promised? This scenario highlights why effective recording management is essential. It is not enough to only capture recordings. You need to organize them, find them when needed, and maintain them according to business and regulatory requirements."
            },
            {
              "type": "p",
              "text": "In this section, you will explore how Amazon Connect helps you store, search, access, and maintain recordings of customer interactions. You will learn practical strategies for organizing recordings, controlling who can access them, and maintaining compliance with retention policies."
            },
            {
              "type": "p",
              "text": "You will now learn about the tools and techniques that make recording management both powerful and user-friendly in Amazon Connect."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t17",
      "number": 17,
      "title": "Transcript Handling",
      "shortTitle": "Transcript Handling",
      "summary": "Transcripts turn spoken conversations into text, making it more efficient to review, analyze, and search through customer interactions. You will…",
      "duration": "~5 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t17-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Transcripts turn spoken conversations into text, making it more efficient to review, analyze, and search through customer interactions. You will explore how Amazon Connect handles transcripts for both voice and chat conversations. You will learn how to store, access, and make the most of these valuable text records, whether you are looking to improve QA or gather insights about common customer issues."
            },
            {
              "type": "p",
              "text": "To learn more about transcript storage, choose the arrow buttons to display each of the following four steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "1 of 6"
            },
            {
              "type": "p",
              "text": "Transcript storage"
            },
            {
              "type": "p",
              "text": "Have you ever wished you could quickly find specific information in past customer conversations without listening to hours of recordings? Transcripts make this possible."
            },
            {
              "type": "p",
              "text": "Understanding transcript handling helps you unlock valuable information hidden in your customer conversations."
            },
            {
              "type": "p",
              "text": "Explore how Amazon Connect manages different types of transcripts."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Setting up transcript storage"
            },
            {
              "type": "p",
              "text": "Amazon Connect handles transcripts differently, depending on whether they are from voice or chat interactions."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Chat transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "When you create an Amazon Connect instance, the system automatically creates an S3 bucket for storing chat transcripts. After this bucket exists, all chat conversations are automatically transcribed and stored without any additional configuration needed. This means the following:"
            },
            {
              "type": "ul",
              "items": [
                "Every chat conversation is automatically preserved in text form.",
                "No special setup is required beyond the initial bucket configuration.",
                "You can access complete chat histories immediately after conversations end."
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Voice transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "For voice conversations, transcription is not automatic. You need to take the following additional steps:"
            },
            {
              "type": "ul",
              "items": [
                "Enable Contact Lens for your instance.",
                "Add the Set recording and analytics behavior block to your flows.",
                "Select Enable Contact Lens speech analytics."
              ]
            },
            {
              "type": "p",
              "text": "This additional configuration is necessary because voice transcription requires speech recognition technology to convert audio to text, whereas chat is already in text format."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Storage configuration",
          "blocks": [
            {
              "type": "p",
              "text": "The following transcript types are stored in your configured S3 buckets:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Chat transcripts: Stored in your dedicated chat transcript bucket",
          "blocks": [
            {
              "type": "p",
              "text": "You can modify storage locations through the Data storage settings in your Amazon Connect instance, if needed."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Voice transcription with Contact Lens"
            },
            {
              "type": "p",
              "text": "To unlock the full power of voice transcription, Amazon Connect offers Contact Lens, an advanced analytics feature that provides much more than basic text conversion."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up voice transcription",
          "blocks": [
            {
              "type": "p",
              "text": "To transcribe voice conversations with Contact Lens, complete the following steps:"
            },
            {
              "type": "ul",
              "items": [
                "Enable Contact Lens for your Amazon Connect instance.",
                "Add the Set recording and analytics behavior block to your flows.",
                "Choose Enable Contact Lens speech analytics.",
                "Enable Sentiment analysis, if desired.",
                "Set Post-contact summary = ON in Contact Lens Generative AI capabilities.",
                "After it's enabled, Contact Lens will transcribe conversations and provide additional advanced capabilities."
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Sentiment analysis",
          "blocks": [
            {
              "type": "p",
              "text": "Sentiment analysis does the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Issue detection",
          "blocks": [
            {
              "type": "p",
              "text": "Issue detection does the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Action item detection",
          "blocks": [
            {
              "type": "p",
              "text": "Action item detection does the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Automatic summarization",
          "blocks": [
            {
              "type": "p",
              "text": "Automatic summarization does the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Saves time when reviewing conversations",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Accessing and using transcripts"
            },
            {
              "type": "p",
              "text": "After you have set up transcript storage, you need to know how to access and use the following valuable resources."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s12",
          "eyebrow": null,
          "duration": null,
          "title": "Finding transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "To access transcripts from past conversations, do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Navigate to Analytics and optimization, then choose Contact search.",
                "Search for the relevant contact using filters such as the following:"
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s13",
          "eyebrow": null,
          "duration": null,
          "title": "Queue",
          "blocks": [
            {
              "type": "p",
              "text": "In the search results, look for the transcript icon."
            },
            {
              "type": "p",
              "text": "Choose the transcript icon to view the full transcript alongside the recording."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s14",
          "eyebrow": null,
          "duration": null,
          "title": "Required permissions",
          "blocks": [
            {
              "type": "p",
              "text": "Users need appropriate permissions to access the following transcripts:"
            },
            {
              "type": "ul",
              "items": [
                "Contact search - View permission allows searching for contacts.",
                "Recorded conversations permission controls access to recordings and transcripts.",
                "Administrators can limit transcript access to certain users based on security profiles."
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s15",
          "eyebrow": null,
          "duration": null,
          "title": "Viewing experience",
          "blocks": [
            {
              "type": "p",
              "text": "When viewing transcripts within the contact detail page you will see the following:"
            },
            {
              "type": "ul",
              "items": [
                "Voice transcripts appear alongside the recording player.",
                "Text is synchronized with the audio for efficient following.",
                "Contact Lens transcripts include sentiment indicators and categorization.",
                "Chat transcripts show the complete conversation with timestamps."
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s16",
          "eyebrow": null,
          "duration": null,
          "title": "Search within transcripts",
          "blocks": [
            {
              "type": "p",
              "text": "When you are viewing a transcript, you can search for specific words or phrases by doing the following:"
            },
            {
              "type": "ul",
              "items": [
                "Use Ctrl+F (or Command+F on Mac) to open the search function.",
                "Type keywords to quickly locate specific parts of the conversation.",
                "This is especially valuable for long conversations."
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Business insights from transcripts"
            },
            {
              "type": "p",
              "text": "Transcripts are not just useful for reviewing individual conversations. They can provide valuable business insights when analyzed collectively."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s17",
          "eyebrow": null,
          "duration": null,
          "title": "Identifying common issues",
          "blocks": [
            {
              "type": "p",
              "text": "By searching across multiple transcripts for specific terms, you can do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Discover frequently mentioned problems.",
                "Identify product or service issues.",
                "Spot confusion points in customer journeys.",
                "Quantify how often certain issues arise."
              ]
            },
            {
              "type": "p",
              "text": "For example, searching for confused about or does not work across hundreds of transcripts might reveal common pain points that many customers experience."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s18",
          "eyebrow": null,
          "duration": null,
          "title": "Detecting sentiment trends",
          "blocks": [
            {
              "type": "p",
              "text": "With Contact Lens sentiment analysis, you can do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Track emotional patterns across conversations.",
                "Identify topics that consistently generate negative reactions.",
                "Spot positive experiences worth replicating.",
                "Measure sentiment changes after process or product updates."
              ]
            },
            {
              "type": "p",
              "text": "For example, after changing your return policy, you might analyze sentiment in all conversations mentioning return to see if customer reactions improved."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s19",
          "eyebrow": null,
          "duration": null,
          "title": "Finding agent training opportunities",
          "blocks": [
            {
              "type": "p",
              "text": "By comparing transcripts across agents handling similar situations, you can do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Identify different approaches to the same problem.",
                "Discover particularly effective phrases or explanations.",
                "Spot knowledge gaps or misunderstandings.",
                "Create targeted training based on real conversations."
              ]
            },
            {
              "type": "p",
              "text": "For example, you might notice that some agents explain a complex feature clearly in just a few sentences, whereas others struggle with lengthy, confusing explanations."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t17-s20",
          "eyebrow": null,
          "duration": null,
          "title": "Improving self-service options",
          "blocks": [
            {
              "type": "p",
              "text": "Transcript analysis can enhance your automated solutions so you can do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Identify common questions for FAQ development.",
                "Find natural language patterns for chatbot training.",
                "Spot where customers abandon the self-service for agent help.",
                "Test whether explanations are clear and effective."
              ]
            },
            {
              "type": "p",
              "text": "For example, by reviewing transcripts from the past month, you might discover that many customers are confused about a particular feature in your mobile app. This insight could lead you to improve your app documentation or create a helpful video tutorial."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t18",
      "number": 18,
      "title": "Retention Policies",
      "shortTitle": "Retention Policies",
      "summary": "How long should you keep customer conversation recordings? Too short, and you might lose valuable information needed for compliance or dispute…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t18-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "How long should you keep customer conversation recordings? Too short, and you might lose valuable information needed for compliance or dispute resolution. Too long, and storage costs could increase while creating potential privacy concerns."
            },
            {
              "type": "p",
              "text": "Explore how to create balanced retention policies for your Amazon Connect recordings and transcripts. You will learn practical strategies for keeping what you need while managing costs and maintaining compliance with regulations."
            },
            {
              "type": "h",
              "level": 4,
              "text": "0-3 months"
            },
            {
              "type": "p",
              "text": "Immediate storage"
            },
            {
              "type": "p",
              "text": "S3 Standard storage: Keep recent recordings in standard storage for quick, frequent access. This tier provides millisecond access times, ideal for frequent retrieval."
            },
            {
              "type": "p",
              "text": "Default analytics retention: Amazon Connect retains analytics data for 25 months in its analytics data lake. This includes contact records, statistics, and Contact Lens data."
            },
            {
              "type": "p",
              "text": "Primary use: Recent recordings serve several immediate needs, including the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t18-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Performance evaluation",
          "blocks": [
            {
              "type": "p",
              "text": "Typical cost consideration: S3 Standard is the most expensive storage tier, but the frequent access needed for recent recordings justifies the cost."
            },
            {
              "type": "h",
              "level": 4,
              "text": "3-12 months"
            },
            {
              "type": "p",
              "text": "Medium-term archive"
            },
            {
              "type": "p",
              "text": "S3 Standard-IA: Move older recordings to lower-cost storage while maintaining reasonable access speed. This tier is designed for data that is accessed less frequently but requires rapid access when needed."
            },
            {
              "type": "p",
              "text": "Contact record availability: Contact trace records remain searchable for 24 months within the Amazon Connect interface, even if recordings are moved to different storage tiers."
            },
            {
              "type": "p",
              "text": "Primary use: Medium-term recordings serve different purposes, such as the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t18-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Training material development",
          "blocks": [
            {
              "type": "p",
              "text": "Typical cost consideration: S3 Standard-IA typically costs about half as much as S3 Standard, providing significant savings for data that is not accessed daily."
            },
            {
              "type": "h",
              "level": 4,
              "text": "1-7 years"
            },
            {
              "type": "p",
              "text": "Long-term compliance storage"
            },
            {
              "type": "p",
              "text": "S3 Glacier: Move rarely accessed recordings needed for compliance to lowest-cost storage. Glacier is designed for long-term archiving with retrieval times ranging from minutes to hours."
            },
            {
              "type": "p",
              "text": "Access consideration: Recordings in S3 Glacier require longer retrieval times. Plan ahead when you need to access these recordings for investigations or audits."
            },
            {
              "type": "p",
              "text": "Primary use: Long-term storage typically serves the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t18-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Historical analysis and auditing",
          "blocks": [
            {
              "type": "p",
              "text": "Typical cost consideration: S3 Glacier can cost as little as one-fifth the price of S3 Standard, making long-term retention much more economical."
            },
            {
              "type": "p",
              "text": "Industry examples: Different industries have different retention requirements, such as the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t18-s5",
          "eyebrow": null,
          "duration": null,
          "title": "General business: Typically 1-3 years for most interactions",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Beyond 7 years"
            },
            {
              "type": "p",
              "text": "End of lifecycle"
            },
            {
              "type": "p",
              "text": "Automatic deletion: Configure automatic removal after retention requirements are met. This ensures you do not keep data longer than necessary."
            },
            {
              "type": "p",
              "text": "Access note: Recordings moved between S3 buckets require direct Amazon S3 access. They will not be accessible through the Amazon Connect interface but can still be retrieved through the Amazon S3 console or API."
            },
            {
              "type": "p",
              "text": "Primary use: Deletion policies serve important functions, such as the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t18-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for storage retention",
          "blocks": [
            {
              "type": "p",
              "text": "Consider the following best practices when developing your storage retention strategies:"
            },
            {
              "type": "p",
              "text": "Implement encryption and proper access controls from day one. Security is not something to add later. It should be built into your storage strategy from the beginning."
            },
            {
              "type": "p",
              "text": "Document access procedures for retrieving older recordings. As recordings age, fewer people will be familiar with the retrieval process, so clear documentation becomes increasingly important."
            },
            {
              "type": "p",
              "text": "Create clear policies for extraordinary retrieval needs. Because retrieval from S3 Glacier is not instantaneous, establish procedures for requesting and prioritizing access to archived recordings."
            },
            {
              "type": "p",
              "text": "Document your deletion process and maintain deletion logs. Having records of what was deleted and when can be important for demonstrating compliance with retention policies."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t18-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Balancing cost and accessibility",
          "blocks": [
            {
              "type": "p",
              "text": "Creating effective retention policies requires balancing three key factors. These are compliance requirements (what you must keep), operational needs (what you want to keep), and storage costs (what you can afford to keep)."
            },
            {
              "type": "p",
              "text": "To find the right balance, incorporate the following:"
            },
            {
              "type": "ul",
              "items": [
                "Document your specific compliance requirements by recording type.",
                "Analyze how often recordings of different ages are accessed.",
                "Calculate storage costs for different retention scenarios.",
                "Test retrieval processes before implementing policies."
              ]
            },
            {
              "type": "p",
              "text": "Remember that a well-designed retention strategy should be reviewed regularly as business needs and regulatory requirements evolve."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t19",
      "number": 19,
      "title": "Access Controls Principles",
      "shortTitle": "Access Controls Principles",
      "summary": "Who should be able to listen to customer service calls in your organization? All managers? Only quality assurance specialists? What about…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t19-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Who should be able to listen to customer service calls in your organization? All managers? Only quality assurance specialists? What about sensitive calls containing payment information or personal details? Amazon Connect uses security profiles to manage recording access. The appropriate role of a user should be based on the principle of least privilege."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t19-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Understanding access control principles",
          "blocks": [
            {
              "type": "p",
              "text": "Before exploring specific role responsibilities, you should understand some core principles of access control for recordings."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Principle of least privilege"
            },
            {
              "type": "p",
              "text": "Users should only have access to the recordings they absolutely need for their role."
            },
            {
              "type": "p",
              "text": "This minimizes risk of unauthorized access to sensitive customer information."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Separation of duties"
            },
            {
              "type": "p",
              "text": "Consider separating the ability to search for contacts from the ability to access recordings."
            },
            {
              "type": "p",
              "text": "This creates a two-layer permission system where having one permission does not automatically grant access to everything."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Data protection"
            },
            {
              "type": "p",
              "text": "Recordings often contain sensitive customer information like credit card details or personal identifiers."
            },
            {
              "type": "p",
              "text": "Access controls should reflect the sensitivity of this data and limit exposure."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t19-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for recording access",
          "blocks": [
            {
              "type": "p",
              "text": "To ensure your recording access controls are both effective and practical, do the following:"
            },
            {
              "type": "p",
              "text": "Regular access reviews: Conduct quarterly audits of who has recording access, remove permissions when roles change, and document justification for highest-level access."
            },
            {
              "type": "p",
              "text": "Clear access request process: Create a formal process for requesting recording access, require management approval for unredacted access, and document the business purpose for each access level."
            },
            {
              "type": "p",
              "text": "Access logging: Enable CloudTrail logging for recording access, review access patterns periodically, and set up alerts for unusual access behavior."
            },
            {
              "type": "p",
              "text": "Time-limited access: Consider providing temporary access for special projects, set expiration dates for elevated access, and implement automatic permission reviews."
            },
            {
              "type": "p",
              "text": "Training and awareness: Ensure all users understand their responsibilities, train supervisors on proper handling of sensitive recordings, and create clear guidelines for sharing or discussing recorded content."
            },
            {
              "type": "p",
              "text": "By implementing these role-based access controls, you will help ensure that recordings are available to those who need them while maintaining appropriate security and privacy protection."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t20",
      "number": 20,
      "title": "Recording Management Best Practices",
      "shortTitle": "Recording Management Best Practices",
      "summary": "Have you ever needed to find a specific customer conversation from 3 months ago but did not know where to start looking? In this lesson, you will…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t20-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever needed to find a specific customer conversation from 3 months ago but did not know where to start looking? In this lesson, you will explore how Amazon Connect organizes recordings and provides powerful search tools to find exactly what you need, when you need it."
            },
            {
              "type": "p",
              "text": "From properly setting up recording storage to implementing cost-efficient storage strategies, you will gain practical knowledge about managing your conversation archives. This foundation will help you maintain compliance and keep your most valuable customer interaction data readily accessible."
            },
            {
              "type": "p",
              "text": "The following are best practices for managing storage in Amazon Connect:"
            },
            {
              "type": "ul",
              "items": [
                "Document your retention requirements before setting up lifecycle policies.",
                "Consider creating different policies for different types of recordings.",
                "Test retrieval processes for archived recordings before implementing widely.",
                "Monitor storage costs over time to ensure your policies are effective.",
                "Consider compressing older recordings to further reduce storage costs.",
                "By applying these best practices, you can set up your storage for effective and efficient usage."
              ]
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t20-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Optimizing Storage Costs",
          "blocks": [
            {
              "type": "p",
              "text": "As your collection of recordings grows, storage costs can increase. Amazon Connect stores recordings in Amazon S3, so you can implement cost-saving measures through S3 Lifecycle policies."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t20-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Understanding storage tiers",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Implementing S3 Lifecycle policies"
            },
            {
              "type": "p",
              "text": "Amazon S3 offers different storage classes with varying costs and access characteristics, such as the following:"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t20-s4",
          "eyebrow": null,
          "duration": null,
          "title": "S3 Standard: Fast access, higher cost",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon S3 Standard-Infrequent Access (S3 Standard-IA): Slightly slower access, lower cost"
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t20-s5",
          "eyebrow": null,
          "duration": null,
          "title": "S3 Glacier: Slow access (minutes to hours), lowest cost",
          "blocks": [
            {
              "type": "p",
              "text": "Now you have reviewed understanding storage tiers, move to the next tab to learn about implementing S3 lifecycle policies."
            },
            {
              "type": "p",
              "text": "By implementing these storage management strategies, you can maintain all the recordings you need for compliance and QA while controlling costs effectively."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Implementing S3 Lifecycle policies"
            },
            {
              "type": "p",
              "text": "The following is a practical approach for implementing S3 Lifecycle policies:"
            },
            {
              "type": "p",
              "text": "Keep recent recordings (1-3 months) in S3 Standard storage for quick access."
            }
          ]
        },
        {
          "id": "connect-conversational-analytics-t20-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Move medium-term recordings (3-12 months) to S3 Standard-Infrequent Access",
          "blocks": [
            {
              "type": "p",
              "text": "Move older recordings (12+ months) to S3 Glacier using lifecycle policies."
            },
            {
              "type": "p",
              "text": "Set up automatic transitions based on your compliance and operational needs."
            },
            {
              "type": "p",
              "text": "Important note: If recordings are moved between S3 buckets for any reason, they will no longer be accessible directly through an Amazon Connect contact search. However, they can still be accessed through Amazon S3 directly, if needed."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-conversational-analytics-t21",
      "number": 21,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-conversational-analytics-t21-q1",
          "question": "A quality assurance (QA) manager needs to locate specific customer conversations from last month where agents discussed billing disputes. How should the manager use search functionality in Amazon Connect to find these interactions MOST efficiently?",
          "options": [
            {
              "id": "A",
              "text": "Search by agent name and date range only."
            },
            {
              "id": "B",
              "text": "Use contact attributes and keyword search with date filters."
            },
            {
              "id": "C",
              "text": "Filter by queue name and customer phone number."
            },
            {
              "id": "D",
              "text": "Search using only the customer account number."
            }
          ],
          "correctOptionId": "B",
          "rationale": "Filtering by queue name and customer phone number might miss relevant conversations if customers called different numbers or were routed through various queues for billing issues."
        },
        {
          "id": "connect-conversational-analytics-t21-q2",
          "question": "An Amazon Connect administrator must implement transcript handling procedures for a multilingual contact center that processes both voice and chat interactions. Which approach would help ensure comprehensive transcript management across all interaction types?",
          "options": [
            {
              "id": "A",
              "text": "Voice transcription only with manual chat logs"
            },
            {
              "id": "B",
              "text": "Manual transcription for all interactions"
            },
            {
              "id": "C",
              "text": "Automated transcription for voice with integrated chat transcript capture"
            },
            {
              "id": "D",
              "text": "Chat transcripts only with voice recording storage"
            }
          ],
          "correctOptionId": "C",
          "rationale": "Manual transcription for all interactions introduces unnecessary costs and delays while increasing the risk of errors and inconsistencies in transcript quality and availability."
        },
        {
          "id": "connect-conversational-analytics-t21-q3",
          "question": "A compliance team must establish retention policies for Amazon Connect recordings that balance regulatory requirements with storage cost optimization. Which retention strategy would MOST effectively achieve both objectives?",
          "options": [
            {
              "id": "A",
              "text": "Uniform long-term retention for all recordings"
            },
            {
              "id": "B",
              "text": "Short-term retention with manual extension requests"
            },
            {
              "id": "C",
              "text": "Permanent retention with periodic manual review"
            },
            {
              "id": "D",
              "text": "Tiered retention based on interaction type and regulatory requirements"
            }
          ],
          "correctOptionId": "D",
          "rationale": "Permanent retention with periodic manual review supports compliance but significantly increases storage costs and creates ongoing administrative overhead for review processes."
        },
        {
          "id": "connect-conversational-analytics-t21-q4",
          "question": "An Amazon Connect supervisor needs to make sure that only authorized quality assurance (QA) staff can access recordings containing sensitive customer financial information. Which access control configuration would provide the MOST appropriate security level?",
          "options": [
            {
              "id": "A",
              "text": "Role-based access with multi-factor authentication (MFA)"
            },
            {
              "id": "B",
              "text": "Public access with audit logging"
            },
            {
              "id": "C",
              "text": "Manager approval for each access request"
            },
            {
              "id": "D",
              "text": "Basic username and password authentication"
            }
          ],
          "correctOptionId": "A",
          "rationale": "Role-based access with MFA provides appropriate security by limiting access to authorized personnel and adds an additional authentication factor for sensitive financial data."
        }
      ]
    },
    {
      "id": "connect-conversational-analytics-t22",
      "number": 22,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "You studied how to organize and manage recordings effectively in Amazon Connect. You learned about conversation search capabilities and storage…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-conversational-analytics-t22-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "You studied how to organize and manage recordings effectively in Amazon Connect. You learned about conversation search capabilities and storage optimization techniques. The section covered transcript handling and retention policies. You explored recording-specific access controls for security. These management skills help you maintain an efficient recording system."
            },
            {
              "type": "p",
              "text": "This concludes our course on Conversational Analytics Essentials. You now have comprehensive knowledge to implement and manage recording capabilities securely in Amazon Connect."
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
