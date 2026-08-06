/*
 * Amazon Connect — AI Customer Engagement
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT AI CUSTOMER ENGAGEMENT.txt
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-ai-customer-engagement",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "AI Customer Engagement",
  "provider": "Amazon Web Services",
  "level": "Intermediate",
  "category": "AI and automation",
  "description": "Customer data and personalization, Customer Profiles with generative AI data mapping and identity resolution, and AI-assisted outbound campaigns.",
  "examFormat": "21 topics · ~42 min · 9 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT AI CUSTOMER ENGAGEMENT.txt"
  ],
  "modules": [
    {
      "id": "connect-ai-customer-engagement-t1",
      "number": 1,
      "title": "Introduction to AI-Powered Customer Engagement",
      "shortTitle": "Introduction to AI-Powered Customer Engagement",
      "summary": "Have you ever called customer service and repeated your information multiple times to different agents? Or have you received generic marketing…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [
        "Compare traditional contact centers with AI-enhanced engagement models to identify key opportunities for transformation.",
        "Implement AI-powered features to recognize customers across channels and deliver personalized experiences.",
        "Evaluate how the partnership between AI and human agents improves key business metrics and customer satisfaction."
      ],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Have you ever called customer service and repeated your information multiple times to different agents? Or have you received generic marketing messages that had nothing to do with your needs?"
            },
            {
              "type": "p",
              "text": "In this section, you will explore how Amazon Connect AI capabilities are reshaping customer engagement and why these capabilities matter for your business. You will discover how AI helps businesses recognize customers across different channels. This helps businesses understand customer history and needs, so they can engage with customers in more relevant ways. Whether you are managing a support team or designing customer journeys, understanding these AI foundations is valuable. They will help you deliver experiences that feel personalized and efficient instead of robotic and frustrating."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson 3 of 24",
          "blocks": [
            {
              "type": "p",
              "text": "esson 2 of 24"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t2",
      "number": 2,
      "title": "Customer Data in the Contact Center",
      "shortTitle": "Customer Data in the Contact Center",
      "summary": "Traditional contact centers operate with a major constraint: fragmented customer information. Agents often need to juggle multiple systems to…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Traditional contact centers operate with a major constraint: fragmented customer information. Agents often need to juggle multiple systems to gather basic information about who they are talking to and why."
            },
            {
              "type": "p",
              "text": "This can create a number of problems with the contact center experience, including the following:"
            },
            {
              "type": "p",
              "text": "Disjointed customer experience – When customer data lives in separate systems, agents spend valuable time switching between applications instead of helping customers. By the time the agent has gathered the necessary information, the customer is already frustrated."
            },
            {
              "type": "p",
              "text": "Repetitive customer identification – One of the most frustrating experiences for customers is having to repeatedly identify themselves as they are transferred between departments or agents. This happens when contact centers lack a unified customer profile that travels with the customer throughout their journey."
            },
            {
              "type": "p",
              "text": "Generic service instead of personalized engagement – Without a complete picture of the customer, agents default to generic service scripts instead of tailored interactions. They miss opportunities to reference previous purchases, anticipate needs, or acknowledge loyalty."
            },
            {
              "type": "p",
              "text": "Real-world example: You recently moved and updated your address with a company's billing department. When you call customer services about a different issue, the agent asks you to confirm your address. However, the agent still sees your old address because the billing system and customer services system are not sharing information."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Contact center evolution",
          "blocks": [
            {
              "type": "p",
              "text": "Contact centers have evolved through several stages over the years as explained in the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "1970s-1990s"
            },
            {
              "type": "ul",
              "items": [
                "Basic Call Centers: The Phone-Only Era",
                "Phone-based support with minimal customer data."
              ]
            },
            {
              "type": "p",
              "text": "Basic call centers revolutionized customer service by moving interactions from stores to centralized telephone support. This transformation standardized service delivery across entire organizations. Companies achieved significant operational savings while maintaining consistent customer communication for the first time."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Customer viewpoint: Why am I on hold for 20 minutes?",
          "blocks": [
            {
              "type": "p",
              "text": "Basic contact center icon."
            },
            {
              "type": "h",
              "level": 4,
              "text": "1990s-2010s"
            },
            {
              "type": "ul",
              "items": [
                "Multichannel Contact Centers: Breaking Down the Walls",
                "Added email, chat, and social media, but often as separate operations."
              ]
            },
            {
              "type": "p",
              "text": "Multichannel centers fueled ecommerce growth by supporting customers through emerging digital channels. New service expectations developed as consumers demanded help beyond traditional business hours. Companies built specialized teams for each channel, which created new career paths in digital customer engagement."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Customer viewpoint: Can I just email you instead of calling?",
          "blocks": [
            {
              "type": "p",
              "text": "Multichannel agent icon."
            },
            {
              "type": "h",
              "level": 4,
              "text": "2010-2020"
            },
            {
              "type": "ul",
              "items": [
                "Omnichannel Contact Centers: Making Connections",
                "Connected channels but still with fragmented customer data."
              ]
            },
            {
              "type": "p",
              "text": "Omnichannel approaches elevated customer experience as a primary business differentiator beyond price and product. Organizations began measuring success through customer satisfaction metrics instead of operational efficiency alone. Seamless experiences across touchpoints became essential as consumer loyalty increasingly depended on effortless service interactions."
            },
            {
              "type": "p",
              "text": "Customer viewpoint: Why do I need to repeat myself every time I contact you?"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Omni-channel contact center icon",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "2020+"
            },
            {
              "type": "ul",
              "items": [
                "AI-Powered Contact Hubs: The Intelligent Revolution",
                "Intelligent AI-powered systems that unify customer data and provide AI-assisted insights."
              ]
            },
            {
              "type": "p",
              "text": "AI-powered hubs transform service operations from reactive cost centers into proactive revenue generators. Predictive capabilities empower companies to address customer needs before problems fully develop. Human agents now focus on complex problem-solving while technology handles routine interactions. Service insights drive product development and marketing strategies across the entire organization."
            },
            {
              "type": "p",
              "text": "Customer viewpoint: The system already knew what I needed before I explained it."
            },
            {
              "type": "p",
              "text": "AI-powered engagement hub icon."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Unified customer data",
          "blocks": [
            {
              "type": "p",
              "text": "The foundation of effective customer engagement is having a complete, unified view of each customer by bringing all customer information together. When properly implemented, this comprehensive customer profile becomes the central hub from which meaningful interactions flow."
            },
            {
              "type": "p",
              "text": "A unified customer profile includes data such as the following:"
            },
            {
              "type": "ul",
              "items": [
                "Basic identity information – Names, contact details, account numbers, and authentication history",
                "Purchase and billing history – Complete transaction records, subscription status, and payment preferences",
                "Previous interactions across all channels – Conversation history from calls, chats, emails, and social media engagements",
                "Service cases and their resolutions – Past issues, how they were resolved, and follow-up outcomes",
                "Preferences and behavioral patterns – Communication preferences, product usage habits, and engagement tendencies"
              ]
            },
            {
              "type": "p",
              "text": "Without this unified foundation, customer data remains trapped in isolated systems, which creates fragmented experiences. When agents lack access to complete information, customers face repetitive questions and inconsistent service."
            },
            {
              "type": "p",
              "text": "Even the most sophisticated AI tools will struggle to deliver meaningful improvements in customer engagement when working with disjointed data. Personalization begins with this consolidated view that empowers both human agents and AI systems to understand the full customer context."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t2-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Avoid these critical engagement pitfalls",
          "blocks": [
            {
              "type": "p",
              "text": "Before revolutionizing your customer experience strategy, be aware of the following crucial pitfalls that even seasoned organizations could encounter:"
            },
            {
              "type": "ol",
              "items": [
                "Never launch new engagement channels without establishing proper data infrastructure first.",
                "Do not rush into automation solutions while your customer data remains fragmented across systems.",
                "Remember that without a comprehensive view of the entire customer journey, your personalization efforts will fall short."
              ]
            },
            {
              "type": "p",
              "text": "By addressing these fundamental challenges before implementing advanced technologies, you can build a solid foundation that maximizes the return on your customer experience investments."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t3",
      "number": 3,
      "title": "Personalizing Customer Interactions",
      "shortTitle": "Personalizing Customer Interactions",
      "summary": "AI is transforming customer interactions from generic scripts to personalized conversations. Amazon Connect AI capabilities help businesses…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "AI is transforming customer interactions from generic scripts to personalized conversations. Amazon Connect AI capabilities help businesses recognize customers instantly, understand their needs more deeply, and deliver more relevant experiences."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Beyond basic recognition",
          "blocks": [
            {
              "type": "p",
              "text": "Identity Resolution in Amazon Connect uses both rule-based and machine learning (ML) approaches to identify and consolidate matching customer profiles. This helps create a unified view of the customer across channels and systems as follows:"
            },
            {
              "type": "p",
              "text": "Rule-based matching – Uses exact matching on key identifiers such as phone numbers, email addresses, and account numbers"
            },
            {
              "type": "p",
              "text": "ML matching – Goes beyond basic rules to detect patterns and relationships that indicate the same customer across different records"
            },
            {
              "type": "p",
              "text": "With Amazon Connect Identity Resolution, businesses can maintain conversation continuity across channels. This helps honor preferences consistently regardless of how customers identify themselves. Companies can deliver truly personalized experiences without requiring customers to repeatedly explain who they are."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Customer Profile: Alejandro \"Ale\" Rosalez",
          "blocks": [
            {
              "type": "p",
              "text": "Alejandro has used both his personnel email and work email when contacting your business. He has also contacted your business using both the name Alejandro and the name Ale."
            },
            {
              "type": "p",
              "text": "Customer profile image of Ale."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Alejandro \"Ale\" Rosalez"
            },
            {
              "type": "p",
              "text": "Traditional systems would create separate records for Alejandro and name Ale and each email used. This fragments the customer's history across multiple profiles."
            },
            {
              "type": "p",
              "text": "Identity Resolution in Amazon Connect can recognize these are likely the same person based on multiple data points. The system analyzes behavior patterns, device information, and location data."
            },
            {
              "type": "p",
              "text": "To learn more about Identity Resolution, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Amazon Connect identity resolution process: ingest data, map profiles, resolve identities, merge and enrich profiles"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "AI-enhanced context for better first-contact resolution",
          "blocks": [
            {
              "type": "p",
              "text": "AI capabilities of Amazon Connect systematically analyze multiple data points to provide agents with comprehensive context at the moment of customer contact. This proactive intelligence increases the likelihood of resolving issues during the first interaction."
            },
            {
              "type": "p",
              "text": "Personalization diagram showing contact info, history, customer insights, purchases, and case data"
            },
            {
              "type": "p",
              "text": "As illustrated in the diagram, Amazon Connect places personalization at the center of the customer experience by intelligently connecting the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Customer insights – Using predictive analytics to anticipate needs",
          "blocks": [
            {
              "type": "p",
              "text": "This unified approach transforms typical fragmented support experiences into seamless interactions where customers feel recognized and understood from the first moment of contact."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Calculated attributes",
          "blocks": [
            {
              "type": "p",
              "text": "Calculated attributes represent a key AI capability that elevates customer service beyond basic identification to truly intelligent engagement. These dynamically generated insights transform raw behavioral data into predictive customer understanding that drives meaningful personalization."
            },
            {
              "type": "p",
              "text": "Calculated attributes create actionable intelligence as follows:"
            },
            {
              "type": "p",
              "text": "Identifying a customer's preferred communication channel – Analyzing patterns to determine whether a customer responds best to chat, email, SMS, or phone contact"
            },
            {
              "type": "p",
              "text": "Calculating average order frequency – Determining typical purchase cycles to anticipate needs and identify potential upsell opportunities"
            },
            {
              "type": "p",
              "text": "Recognizing past behavior such as frequency of contact – Establishing baselines for normal customer behavior that help identify potential satisfaction issues"
            },
            {
              "type": "p",
              "text": "Detecting rising frustration based on recent interactions – Analyzing tone, word choice, and contact patterns to predict customer sentiment"
            },
            {
              "type": "p",
              "text": "For example, a customer typically contacts support through chat during business hours. If the customer unexpectedly calls after hours, the system might flag this as an urgent issue requiring special attention. This pattern deviation intelligence makes it possible for support teams to prioritize appropriately and respond with the appropriate level of urgency."
            },
            {
              "type": "p",
              "text": "The system adapts with each interaction, building a deeper understanding of customer needs to guide automated systems and human agents."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t4",
      "number": 4,
      "title": "Human-AI Partnership",
      "shortTitle": "Human-AI Partnership",
      "summary": "The most effective implementations of AI for customer engagement augment human agents instead of replacing them. AI can augment agents as follows:",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "The most effective implementations of AI for customer engagement augment human agents instead of replacing them. AI can augment agents as follows:"
            },
            {
              "type": "ul",
              "items": [
                "AI handles data gathering and analysis.",
                "AI suggests possible solutions and provides context.",
                "Human agents apply judgment, empathy, and creativity.",
                "Together, they deliver better outcomes than either could alone."
              ]
            },
            {
              "type": "p",
              "text": "For example, when a customer contacts support about a product issue, Amazon Connect can immediately recognize them. It can pull up their purchase history and identify the likely product they are calling about. Amazon Connect can recommend solutions based on similar cases before the agent even greets the customer. This leaves the agent free to focus on the human elements of the interaction that AI cannot replicate."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits of AI-powered customer engagement",
          "blocks": [
            {
              "type": "p",
              "text": "Organizations implementing AI-powered customer engagement solutions see improvements across multiple dimensions of their business. The following tangible benefits demonstrate why forward-thinking companies are adopting these technologies to transform their customer experience operations. Explore each benefit below to understand how AI creates value for both customers and businesses."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Improved first-contact resolution"
            },
            {
              "type": "p",
              "text": "When customers get their issues resolved on the first contact, it delivers the following benefits:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Reduced customer effort",
          "blocks": [
            {
              "type": "p",
              "text": "\"More than 80% of companies cite improved CSAT as the top driver for proactive outreach.\" AI for Business Success, Jan 2024. Metrigy."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Reduced handle time without sacrificing quality"
            },
            {
              "type": "p",
              "text": "AI helps agents work more efficiently without cutting corners by doing the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Suggesting appropriate next steps",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Enhanced personalization at scale"
            },
            {
              "type": "p",
              "text": "AI makes personalization scalable as follows:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t4-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Suggesting personalized next-best actions",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Improved operational efficiency"
            },
            {
              "type": "p",
              "text": "Beyond customer experience benefits, AI delivers significant operational improvements such as the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t4-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Reduced technical debt",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Measurable business outcomes"
            },
            {
              "type": "p",
              "text": "The benefits translate to concrete business results:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t4-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Improved Net Promoter Score (NPS)",
          "blocks": [
            {
              "type": "p",
              "text": "As customer expectations continue to rise, the gap between companies that embrace AI-powered engagement strategies and those that continue to use fragmented, reactive approaches widens. Leading organizations will view AI not merely as automation, but as a tool for understanding customers at a deeper level."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t5",
      "number": 5,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-ai-customer-engagement-t5-q1",
          "question": "A financial services company is experiencing high levels of customer frustration due to repetitive identification processes when customers are transferred between departments. Which key difference between traditional contact centers and AI-enhanced engagement models MOST directly addresses this customer pain point?",
          "options": [
            {
              "id": "A",
              "text": "AI-enhanced models use predictive dialing while traditional centers use manual dialing"
            },
            {
              "id": "B",
              "text": "AI-enhanced models unify customer data across systems while traditional centers have fragmented information"
            },
            {
              "id": "C",
              "text": "AI-enhanced models operate in the cloud while traditional centers use on-premises technology"
            },
            {
              "id": "D",
              "text": "AI-enhanced models focus on self-service while traditional centers prioritize agent interactions"
            }
          ],
          "correctOptionId": "B",
          "rationale": "Predictive dialing is a feature found in some advanced contact centers. It addresses agent efficiency in outbound calling instead of customer identification during transfers. The core issue involves repetitive customer identification caused by fragmented information."
        },
        {
          "id": "connect-ai-customer-engagement-t5-q2",
          "question": "A retail company wants to implement identity resolution to improve customer recognition across different contact channels. Which approach does Amazon Connect Identity Resolution use to identify the same customer across different channels and systems? (Select TWO) (Select all that apply: Manual agent verification of customer identity / Rule-based matching on key identifiers / Blockchain identity verification / Biometric voice authentication / Machine learning (ML)-based pattern detection / Social media profile integration)",
          "options": [],
          "answer": "Rule-based matching on key identifiers; Machine learning (ML)-based pattern detection. The incorrect options represent authentication or identification methods not used by Amazon Connect Identity Resolution. Manual agent verification is a traditional approach that AI aims to replace. Blockchain identity verification requires different technology infrastructure. Biometric voice authentication involves specialized voice analysis tools. Social media profile integration requires external platform connections not covered in the Identity Resolution capabilities discussed in this course."
        },
        {
          "id": "connect-ai-customer-engagement-t5-q3",
          "question": "A telecommunications company is considering implementing AI tools to support their contact center agents but is concerned about the impact on the human workforce. How does the human-AI partnership possible with Amazon Connect MOST effectively improve business metrics?",
          "options": [
            {
              "id": "A",
              "text": "AI completely automates basic customer interactions while human agents handle only the most complex cases."
            },
            {
              "id": "B",
              "text": "Human agents supervise AI systems to ensure that they are functioning properly."
            },
            {
              "id": "C",
              "text": "AI handles data analysis and human agents apply judgment, empathy, and creativity to customer interactions."
            },
            {
              "id": "D",
              "text": "AI replaces human agents for night shifts and humans work during business hours."
            }
          ],
          "correctOptionId": "C",
          "rationale": "The human-AI partnership works best when AI handles data gathering and analysis. AI suggests possible solutions and provides context to agents. Human agents apply judgment, empathy, and creativity in customer conversations. This combination improves metrics like first-contact resolution, handle time, and customer satisfaction."
        }
      ]
    },
    {
      "id": "connect-ai-customer-engagement-t6",
      "number": 6,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this section, you explored how Amazon Connect AI capabilities transform customer engagement through intelligent data integration and…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "In this section, you explored how Amazon Connect AI capabilities transform customer engagement through intelligent data integration and processing. You examined how unified customer data forms the critical foundation for effective personalization and context-aware interactions. The section showed how Identity Resolution in Amazon Connect blends rule-based and ML methods to identify customers across various channels. You discovered how calculated attributes convert raw customer behavior data into actionable insights that predict needs and detect emerging patterns. These AI foundations enable businesses to deliver more relevant, personalized experiences while maintaining operational efficiency."
            },
            {
              "type": "p",
              "text": "In the next section, you will explore Amazon Connect Customer Profiles with AI capabilities."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t7",
      "number": 7,
      "title": "Introduction to Amazon Connect Customer Profiles with AI Capabilities",
      "shortTitle": "Introduction to Amazon Connect Customer Prof…",
      "summary": "Imagine answering a customer call and immediately having access to your customer's complete history, preferences, and account details. You have…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [
        "Configure Amazon Connect Customer Profiles with generative AI data mapping to unify customer data from multiple sources.",
        "Implement Identity Resolution using both rule-based and ML approaches to create consolidated customer profiles.",
        "Apply best practices for profile merging to improve agent efficiency and customer experience."
      ],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t7-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine answering a customer call and immediately having access to your customer's complete history, preferences, and account details. You have their data organized in one place without switching between multiple systems."
            },
            {
              "type": "p",
              "text": "With Amazon Connect Customer Profiles, you can combine contact history from Amazon Connect with information from external applications to provide this improved experience."
            },
            {
              "type": "p",
              "text": "In this section, you will learn how generative AI streamlines data mapping and how identity resolution automatically finds and merges duplicate customer records."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t8",
      "number": 8,
      "title": "Components of Amazon Connect Customer Profiles",
      "shortTitle": "Components of Amazon Connect Customer Profiles",
      "summary": "Amazon Connect Customer Profiles combine customer contact history with important information such as their account number, personal details,…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t8-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect Customer Profiles combine customer contact history with important information such as their account number, personal details, contact information, and interaction preferences. After it is enabled, Amazon Connect Customer Profiles automatically creates a unique profile for every customer who contacts your organization."
            },
            {
              "type": "p",
              "text": "When a customer contacts your organization, Amazon Connect can identify the customer. Typically, it uses a phone number to identify the customer for a voice call or email address for chat. Amazon Connect Customer Profiles then retrieves the customer's existing profile or creates a new one. The profile may contain the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t8-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits for Agents",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Benefits for Customers"
            },
            {
              "type": "p",
              "text": "Having all customer information in one place benefits human support agents in the following ways:"
            },
            {
              "type": "ul",
              "items": [
                "Reduced handle time – Agents no longer need to switch between systems.",
                "Personalized service – Agents can greet customers by name and acknowledge their contact history.",
                "Improved issue resolution – Agents understand previous interactions."
              ]
            },
            {
              "type": "p",
              "text": "\"\"End of Tab."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Key components of Amazon Connect Customer Profiles"
            },
            {
              "type": "p",
              "text": "To learn more about the key components of Amazon Connect Customer Profile, choose each of the numbered markers."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Benefits for Customers"
            },
            {
              "type": "p",
              "text": "The benefits for customers are as follows:"
            },
            {
              "type": "ul",
              "items": [
                "Reduced repetition – Customer details are stored, which reduces the need to repeat the same information.",
                "Faster resolution – Customers experience faster issue resolution because agents have customer data when they connect."
              ]
            },
            {
              "type": "p",
              "text": "Personalized service – Agents can greet customers by name or route them to an agent faster due to account status."
            },
            {
              "type": "p",
              "text": "Consistent experience – Customers experience is more consistent across different communication channels."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t9",
      "number": 9,
      "title": "Data Mapping with Generative AI",
      "shortTitle": "Data Mapping with Generative AI",
      "summary": "Modern contact centers handle massive volumes of customer data from multiple sources. Understanding how to effectively integrate this data is…",
      "duration": "~7 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t9-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Modern contact centers handle massive volumes of customer data from multiple sources. Understanding how to effectively integrate this data is crucial for delivering exceptional customer experiences."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Comparing traditional and AI-powered data integrations",
          "blocks": [
            {
              "type": "p",
              "text": "The following tabs compare traditional data integration methods with generative AI-powered automated data mapping in Amazon Connect."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Traditional Data Integration Methods",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Generative AI-Powered Data Mapping"
            },
            {
              "type": "p",
              "text": "Traditional data integration relies on manual processes and predefined rules."
            },
            {
              "type": "p",
              "text": "Organizations typically use extract, transform, load (ETL) pipelines where data engineers manually map fields between systems."
            },
            {
              "type": "p",
              "text": "For example, mapping a customer's phone_number field from a customer relationship management (CRM) system to the contact_number field in Amazon Connect requires explicit programming."
            },
            {
              "type": "p",
              "text": "Key characteristics of traditional methods include the following:"
            },
            {
              "type": "ul",
              "items": [
                "Manual field mapping – Engineers identify and code relationships between data fields.",
                "Static rule-based transformations – Predefined logic handles data format conversions.",
                "Batch processing – Data moves in scheduled intervals rather than in real time.",
                "High maintenance overhead – Changes require developer intervention and testing."
              ]
            },
            {
              "type": "p",
              "text": "Now that you have reviewed traditional data integration methods, move on to the next tab to learn about generative AI-powered data mapping."
            },
            {
              "type": "p",
              "text": "Although traditional data integration methods provide proven reliability, generative AI-powered automated mapping represents the future of contact center data management. It offers unprecedented speed, accuracy, and scalability for modern customer service operations."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Generative AI-Powered Data Mapping Process",
          "blocks": [
            {
              "type": "p",
              "text": "To learn about how generative AI-powered data mapping works, choose the START or arrow buttons to display each of the following four phases."
            },
            {
              "type": "h",
              "level": 4,
              "text": "1 of 6"
            },
            {
              "type": "p",
              "text": "How does data mapping with generative AI work? Generative AI transforms how you map customer data in Amazon Connect Customer Profiles. The system analyzes your incoming data from various sources and intelligently determines relationship patterns between fields."
            },
            {
              "type": "p",
              "text": "Generative AI-powered data mapping in Amazon Connect Customer Profiles automatically determines how to organize and combine it into unified profiles."
            },
            {
              "type": "p",
              "text": "This significantly reduces the time needed for unified customer profiles, which empowers you to deliver more personalized customer experiences efficiently."
            },
            {
              "type": "p",
              "text": "Let's see how it works in action."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Generative AI-Powered Data Mapping in Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Contact center administrators can review and complete the setup of customer profiles for data mapping to occur. This will provide agents with relevant customer information and dynamically personalized interactive voice response (IVR) and self-service assistants to improve customer satisfaction and agent productivity."
            },
            {
              "type": "p",
              "text": "In the following demonstration, you will learn about setting up generative AI-powered data mapping in Amazon Connect Customer Profiles."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Generative AI Powered Data Mapping in Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Transcript: Setting Up Generative AI Powered Data Mapping in Amazon Connect Customer Profiles",
                "Welcome to this demonstration on setting up generative AI-powered data mapping in Amazon Connect Customer Profiles."
              ]
            },
            {
              "type": "p",
              "text": "To start, sign in to the AWS Management Console."
            },
            {
              "type": "p",
              "text": "In the search box at the top of the page, enter Amazon Connect. In the displayed list of services, choose Amazon Connect."
            },
            {
              "type": "p",
              "text": "On the Amazon Connect page, the instances in your account are displayed. Choose the Instance alias of the instance that you want to set up automated data mapping in Amazon Connect Customer Profiles on."
            },
            {
              "type": "p",
              "text": "On the Instance page, under Applications, choose Customer Profiles."
            },
            {
              "type": "p",
              "text": "On the Data source integrations tab, choose Add data source integration to begin the process."
            },
            {
              "type": "p",
              "text": "Select a Data source from any of the 70+ available no-code data connectors such as Adobe Analytics, Salesforce, or Amazon Simple Storage Service (S3). Each connector is designed to pull specific types of customer data. Configure the connector you have selected, then choose Next."
            },
            {
              "type": "p",
              "text": "When you reach the Map data step, select the Auto-generate mapping option. This is where the generative AI capabilities are used to automatically map the attributes of your data to Amazon Connect Customer Profiles attributes. Then, choose Next to continue."
            },
            {
              "type": "p",
              "text": "You will now be presented with a summary of all the automatically mapped Amazon Connect Customer Profiles attributes. This is your opportunity to review and make any necessary adjustments. When you are ready, choose Next to continue."
            },
            {
              "type": "p",
              "text": "When you are satisfied with the configuration, choose Add data source integration to complete the connector configuration and begin ingesting your customer data into Amazon Connect Customer Profiles."
            },
            {
              "type": "p",
              "text": "Your new connector will now be listed in your Amazon Connect Customer Profiles Data source integrations. When the connector is complete, it will show as Active."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Generative AI-Powered Data Mapping"
            },
            {
              "type": "p",
              "text": "Generative AI-powered data mapping in Amazon Connect Customer Profiles is an intelligent system that analyzes your customer data. The data mapping feature uses data from various sources and automatically determines how to organize and combine it into unified profiles. This capability reduces the time needed to create unified customer profiles."
            },
            {
              "type": "p",
              "text": "For example, an insurance company can use the generative AI-powered data mapping in Amazon Connect to automatically consolidate customer information. This makes it possible for the company to map customer data from their claims database, CRM system, and payment portal into unified profiles. Agents can view a comprehensive customer history on a single screen and reduce call handling time."
            },
            {
              "type": "p",
              "text": "Key characteristics of generative AI-powered features include the following:"
            },
            {
              "type": "p",
              "text": "Intelligent pattern recognition – AI identifies similar data types across systems automatically."
            },
            {
              "type": "p",
              "text": "Semantic understanding – Natural language processing recognizes that customer_phone and contact_number represent the same concept."
            },
            {
              "type": "p",
              "text": "Real-time adaptation – Continuous learning improves mapping accuracy over time."
            },
            {
              "type": "p",
              "text": "Self-healing integrations – Automatic adjustments occur when source systems change."
            },
            {
              "type": "p",
              "text": "Now that you have reviewed generative AI powered data mapping, move on to the remaining content."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Phase 1: Data Collection and Analysis",
          "blocks": [
            {
              "type": "p",
              "text": "The system fetches source attributes and, if available, sample data from your data source. For an Amazon Simple Storage Service (Amazon S3) data source, the first CSV file found in the selected Amazon S3 bucket and prefix will be used as the sample data."
            },
            {
              "type": "p",
              "text": "For other data sources such as Salesforce or Zendesk, it fetches attributes through Amazon AppFlow."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Phase 2: Smart Field Mapping",
          "blocks": [
            {
              "type": "p",
              "text": "A large language model (LLM) processes each custom attribute from your data source and maps them to standard customer profile attributes."
            },
            {
              "type": "p",
              "text": "For example, if your system has fields labeled CustomerEmailAddress, Email_Contact, and EmailID, the AI recognizes these are all referring to email addresses and maps them appropriately."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Phase 3: Key Attribute Selection",
          "blocks": [
            {
              "type": "p",
              "text": "After mapping fields, the LLM selects suitable attributes that can serve as keys (standard identifiers) for customer profiles. These include the following:"
            },
            {
              "type": "p",
              "text": "Unique identifier – You must have a unique identifier for your data to avoid ingestion errors. This identifier, also known as the unique key, distinguishes data and enables indexing for search and updates. There can be only one unique identifier."
            },
            {
              "type": "p",
              "text": "Customer identifier – You must have at least one customer identifier to avoid ingestion errors. Also known as the profile key, Amazon Connect Customer Profiles uses it to determine if data can be associated to existing profiles or create new ones by searching other profiles for this identifier. You can have multiple customer identifiers."
            },
            {
              "type": "p",
              "text": "Product identifier – You must have at least one product identifier to avoid ingestion errors. Also known as the asset key, Amazon Connect Customer Profiles uses it to distinguish from other customer product purchase data and determine profile associations by searching other profiles for this identifier. You can have multiple product identifiers."
            },
            {
              "type": "p",
              "text": "Case identifier – You must have at least one case identifier to avoid ingestion errors. Also known as the case key, Amazon Connect Customer Profiles uses it to distinguish from other customer case data and determine profile associations by searching other profiles for this identifier. You can have multiple case identifiers."
            },
            {
              "type": "p",
              "text": "Order identifier – You must have at least one order identifier to avoid ingestion errors. Also known as the order key, Customer Profiles uses it to distinguish from other customer order data and determine profile associations by searching other profiles for this identifier. You can have multiple order identifiers."
            },
            {
              "type": "p",
              "text": "Additional search attributes (optional) – You can choose attributes in your data source object that you want to index to be searchable. By default, all your identifiers are indexed."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t9-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Phase 4: Timestamp Processing",
          "blocks": [
            {
              "type": "p",
              "text": "Finally, the system parses timestamps to maintain the correct chronological order of records. This ensures that customer interactions and updates appear in the right sequence."
            },
            {
              "type": "p",
              "text": "The entire process typically takes minutes. This improves speed and accuracy compared to manual data mapping, which could take hours or days."
            },
            {
              "type": "p",
              "text": "Generative AI-powered data mapping in Amazon Connect Customer Profiles goes beyond field matching. It analyzes the actual data values in each field to ensure accurate connections. You no longer need to manually define every relationship between data sources."
            },
            {
              "type": "p",
              "text": "Amazon Connect processes this information and suggests optimal mapping configurations for your specific data. You maintain control with the ability to review and adjust these suggestions before implementation. The system learns from your adjustments to improve future mapping recommendations."
            },
            {
              "type": "p",
              "text": "Lesson 11 of 24"
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t10",
      "number": 10,
      "title": "Identity Resolution",
      "shortTitle": "Identity Resolution",
      "summary": "There can be multiple profiles when customer records are captured across multiple channels and applications for the same customer. Without a…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t10-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "There can be multiple profiles when customer records are captured across multiple channels and applications for the same customer. Without a common unique identifier linking these profiles, the same customer ends up with separate, disconnected profiles across different systems."
            },
            {
              "type": "p",
              "text": "Identity Resolution in Amazon Connect Customer Profiles tackles this challenge by finding each profile and consolidating them. Identity Resolution uses both rules-based matching and ML matching to ensure that each customer has just one comprehensive profile."
            },
            {
              "type": "p",
              "text": "For more information, see Enable Identity Resolution for your Amazon Connect Customer Profiles domain in the Amazon Connect Administrator Guide."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Rule-based matching",
          "blocks": [
            {
              "type": "p",
              "text": "Rule-based matching relies on predefined rules to determine if two profiles represent the same customer. This method compares specific attributes between profiles using a set of matching rules."
            },
            {
              "type": "p",
              "text": "These rules examine attributes such as the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Date of birth",
          "blocks": [
            {
              "type": "p",
              "text": "You can configure up to 15 different matching rules to catch various scenarios where profiles might represent the same customer. The strength of rule-based matching is its precision and transparency. You know exactly why two profiles were matched."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Matching rules are processed by priority. For example, the first rule should be the most optimized rule you want to define and should be used to achieve the most accurate result."
              ]
            },
            {
              "type": "p",
              "text": "You can choose how profiles are compared across attribute types and which attribute to use for matching from each type."
            },
            {
              "type": "p",
              "text": "For example, if you want to match multiple email types, choose many-to-many to match across profiles and attribute types that your business uses."
            },
            {
              "type": "p",
              "text": "You can choose from multiple attribute types."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Email type"
            },
            {
              "type": "p",
              "text": "Choose from the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s4",
          "eyebrow": null,
          "duration": null,
          "title": "PersonalEmailAddress",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Phone number type"
            },
            {
              "type": "p",
              "text": "Choose from the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s5",
          "eyebrow": null,
          "duration": null,
          "title": "MobilePhoneNumber",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Address type"
            },
            {
              "type": "p",
              "text": "Choose from the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s6",
          "eyebrow": null,
          "duration": null,
          "title": "ShippingAddress",
          "blocks": [
            {
              "type": "p",
              "text": "Each attribute type supports either ONE_TO_ONE matching (exact matches) or MANY_TO_MANY matching (matches across sub-types) as follows:"
            },
            {
              "type": "p",
              "text": "ONE_TO_ONE – The system can only match if the sub-types are exact matches."
            },
            {
              "type": "p",
              "text": "For example, when the EmailAddress fields of Profile A and B match, the two profiles are matched on the EmailAddress type."
            },
            {
              "type": "p",
              "text": "MANY_TO_MANY – The system can match attributes across the sub-types of an attribute type."
            },
            {
              "type": "p",
              "text": "For example, if EmailAddress for Profile A matches BusinessEmailAddress for Profile B, the profiles are matched based on EmailAddress type."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s7",
          "eyebrow": null,
          "duration": null,
          "title": "ML matching",
          "blocks": [
            {
              "type": "p",
              "text": "For more sophisticated matching capabilities, Amazon Connect offers ML-based Identity Resolution. This approach uses AI to identify similarities that might not be caught by basic rules."
            },
            {
              "type": "p",
              "text": "ML-based Identity Resolution reviews the following personal identifiable information (PII) attributes in each profile:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Date of birth",
          "blocks": [
            {
              "type": "p",
              "text": "Unlike rule-based matching, ML-based matching can detect similarities even when information is not exactly the same."
            },
            {
              "type": "p",
              "text": "For example, it might recognize that Ana Carolina Silva and Ana Silva with similar addresses are likely the same person."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Identity Resolution in Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "Ensure you have an Amazon Connect Customer Profiles domain already set up for your Amazon Connect instance. If not, see the Enable Customer Profiles for your Amazon Connect instance section of the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "In the following demonstration, you will learn about setting up Identity Resolution in Amazon Connect Customer Profiles."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t10-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Identity Resolution in Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Transcript: Setting up Identity Resolution in Amazon Connect Customer Profiles",
                "Welcome to this demonstration on setting up Identity Resolution for your Amazon Connect Customer Profiles."
              ]
            },
            {
              "type": "p",
              "text": "To start, sign in to the AWS Management Console."
            },
            {
              "type": "p",
              "text": "In the search box at the top of the page, enter Amazon Connect. In the displayed list of services, choose Amazon Connect."
            },
            {
              "type": "p",
              "text": "On the Amazon Connect page, the instances in your account are displayed. Choose the Instance alias that you want to set up Identity Resolution for Amazon Connect Customer Profiles."
            },
            {
              "type": "p",
              "text": "On the Instance page, under Applications, choose Customer Profiles."
            },
            {
              "type": "p",
              "text": "On the Amazon Connect Customer Profiles page, in the Identity Resolution section, choose Enable identity resolution to begin the process."
            },
            {
              "type": "p",
              "text": "A message appears asking you to confirm that you understand that enabling Identity Resolution will not result in any profile merging, and that you will need to enable merging separately within Identity Resolution. After reading the message, choose Enable Identity Resolution to proceed."
            },
            {
              "type": "p",
              "text": "You've now successfully enabled Identity Resolution with rule-based matching and machine learning-based matching for your Amazon Connect Customer Profiles domain."
            },
            {
              "type": "p",
              "text": "After enabling Identity Resolution for a new domain with rule-based matching, the matching will start immediately if you have an integration running. For existing domains, the matching process will start within one hour. For machine learning-based matching, the Identity Resolution job will run for the first time within 24 hours of enabling the feature."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Before running an Identity Resolution Job for the first time on a new Customer Profiles domain, check your profile metrics to ensure profiles have been created."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t11",
      "number": 11,
      "title": "Auto-Merging Setup and Best Practices",
      "shortTitle": "Auto-Merging Setup and Best Practices",
      "summary": "After Identity Resolution identifies similar profiles (either through rules or ML), the next step is to consolidate them through the following…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t11-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "After Identity Resolution identifies similar profiles (either through rules or ML), the next step is to consolidate them through the following auto-merging process:"
            },
            {
              "type": "ol",
              "items": [
                "Apply consolidation criteria that you define to determine which profiles should be combined.",
                "Create a consolidated profile that combines information from all matching profiles.",
                "Preserve information from the original profiles, and retain all values if there are conflicts.",
                "Update references to the original profiles to point to the new consolidated profile."
              ]
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t11-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Auto-merging process",
          "blocks": [
            {
              "type": "p",
              "text": "The Identity Resolution process in Amazon Connect Customer Profiles, automatically combines fragmented customer data from multiple sources into a unified customer profile."
            },
            {
              "type": "p",
              "text": "In the following example, John Doe creates an account with his personal email. Later, he contacts support using his work email. Without Identity Resolution, the system would create two separate profiles. With Identity Resolution, if other attributes, such as the name and phone number match, the system recognizes these are the same person and merges the profiles."
            },
            {
              "type": "p",
              "text": "To learn more about the auto-merging process, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "This automated process helps businesses recognize the same customers across different channels, which can result in better customer service experiences and more effective marketing."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t11-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Auto-Merging in Identity Resolution for Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "p",
              "text": "When similar profiles are detected by an Identity Resolution job, the process can automatically merge them into a unified profile based on auto-merging rules that you specify."
            },
            {
              "type": "p",
              "text": "In the following demonstration, you will learn about setting up auto-merging in Identity Resolution for Amazon Connect Customer Profiles."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t11-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Setting up Auto-Merging in Identity Resolution for Amazon Connect Customer Profiles",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Transcript: Setting up Auto-Merging in Identity Resolution for Amazon Connect Customer Profiles",
                "Welcome to this demonstration on setting up auto-merging in Identity Resolution for Amazon Connect Customer Profiles."
              ]
            },
            {
              "type": "p",
              "text": "To start, sign in to the AWS Management Console."
            },
            {
              "type": "p",
              "text": "In the search box at the top of the page, enter Amazon Connect. In the displayed list of services, choose Amazon Connect."
            },
            {
              "type": "p",
              "text": "On the Amazon Connect page, the instances in your account are displayed. Choose the Instance alias of the instance that you want to set up Identity Resolution in Amazon Connect Customer Profiles on."
            },
            {
              "type": "p",
              "text": "Now, on your Amazon Connect instance Overview page in the navigation pane, under Applications, choose Customer Profiles."
            },
            {
              "type": "p",
              "text": "Next, in the Identity Resolution section, choose View Identity Resolution."
            },
            {
              "type": "p",
              "text": "On the Identity Resolution page, in the Identity Resolution settings section, you will see the Rule-based resolution and Machine learning resolution. Choose the resolution that you want to setup auto-merging on. For this demonstration, choose the Rule-based resolution."
            },
            {
              "type": "p",
              "text": "Now, on the Rule-based resolution settings page, in the Merge rule-based matches section, choose Edit."
            },
            {
              "type": "p",
              "text": "The Missing timestamp pop-up appears and indicates whether you have custom object type mappings. Amazon Connect uses a timestamp attribute and timestamp format to determine when a profile was last updated. If the Missing timestamp pop-up appears, it means there is a timestamp missing from your custom objects. You can add it using the PutProfileObjectType API. If your object type does not have a proper timestamp attribute, you can acknowledge that a default timestamp will be applied for records ingested into Amazon Connect Customer Profiles. For this demonstration, select the acknowledgment. Then, choose Next."
            },
            {
              "type": "p",
              "text": "On the Edit merge rule-based matches page, in the Merge matches section, you will define when to merge profiles based on the selected rule. Select the Merge matches found by rule-based matching checkbox."
            },
            {
              "type": "p",
              "text": "Next, choose a rule level for merging from the list available. For this demonstration, choose Rule 1."
            },
            {
              "type": "p",
              "text": "Then, choose Save."
            },
            {
              "type": "p",
              "text": "In the Merge data pop-up, enter confirm in the textbox."
            },
            {
              "type": "p",
              "text": "Then, choose Merge data."
            },
            {
              "type": "p",
              "text": "Now, on the Rule-based resolution settings page, notice that the rule-based resolution settings have been updated."
            },
            {
              "type": "p",
              "text": "Next, decide if you want to review matched profile IDs by having them written to an Amazon Simple Storage Service (Amazon S3) bucket. For this demonstration, assign an S3 bucket to the rule-based resolution. In the Match results location section, choose Edit."
            },
            {
              "type": "p",
              "text": "Now, on the Edit match results location page, in the S3 location - optional section, select the Write profile ID matches to Amazon S3 checkbox."
            },
            {
              "type": "p",
              "text": "To choose your bucket destination, either enter the S3 URI or choose Browse S3. For this demonstration, choose Browse S3."
            },
            {
              "type": "p",
              "text": "In the Choose an archive in S3 pop-up, under Buckets, enter the name of the S3 bucket."
            },
            {
              "type": "p",
              "text": "Now, choose the S3 bucket."
            },
            {
              "type": "p",
              "text": "Then, select Choose."
            },
            {
              "type": "p",
              "text": "Now, with the S3 bucket URI entered into the S3 URI textbox, choose Save."
            },
            {
              "type": "p",
              "text": "On the Rules-based resolution settings page, an alert indicates you have successfully assigned the S3 bucket location."
            },
            {
              "type": "p",
              "text": "Next, choose View Identity Resolution."
            },
            {
              "type": "p",
              "text": "On the Identity Resolution page, notice that the rule-based resolution has an Active status for both Find matches and Merge matches. Also, S3 location displays the chosen S3 bucket."
            },
            {
              "type": "p",
              "text": "Now, you will complete the machine learning resolution. In the Identity Resolution settings section, choose Machine learning resolution."
            },
            {
              "type": "p",
              "text": "On the Machine learning resolution settings page, in the Merge matches section, choose Edit."
            },
            {
              "type": "p",
              "text": "Now, on the Edit merge machine learning matches page, in the Merge matches section, define when to merge profiles based on attribute rules you create. Select the Merge matches found by machine learning matching checkbox."
            },
            {
              "type": "p",
              "text": "Next, under Rule 1, choose the Attributes menu, and then choose one or more attributes from the list. For this demonstration, choose AccountNumber and EmailAddress."
            },
            {
              "type": "p",
              "text": "To add more rules, choose Add merge rule. For the second rule, choose AccountNumber only, and for the third rule, choose EmailAddress only."
            },
            {
              "type": "p",
              "text": "Then, choose Save."
            },
            {
              "type": "p",
              "text": "In the Merge data pop-up, enter confirm in the textbox."
            },
            {
              "type": "p",
              "text": "Then, choose Merge data."
            },
            {
              "type": "p",
              "text": "Now, on the Machine learning resolution settings page, notice that the machine learning resolution settings have been updated."
            },
            {
              "type": "p",
              "text": "Next, decide if you want to review matched profile IDs by having them written to an S3 bucket. For this demonstration, you will assign an S3 bucket to the machine learning resolution. In the Match results location section, choose Edit."
            },
            {
              "type": "p",
              "text": "Now, on the Edit match results location page, in the S3 location - optional section, select the Write profile ID matches to Amazon S3 checkbox."
            },
            {
              "type": "p",
              "text": "To choose your bucket destination, either enter the S3 URI or choose Browse S3. For this demonstration, choose Browse S3."
            },
            {
              "type": "p",
              "text": "In the Choose an archive in S3 pop-up, under Buckets, enter the name of the S3 bucket."
            },
            {
              "type": "p",
              "text": "Next, choose the S3 bucket."
            },
            {
              "type": "p",
              "text": "Then, select Choose."
            },
            {
              "type": "p",
              "text": "Now, with the S3 bucket URI entered into the S3 URI textbox, choose Save."
            },
            {
              "type": "p",
              "text": "On the Machine learning resolution settings page, an alert indicates you have successfully assigned the S3 bucket location."
            },
            {
              "type": "p",
              "text": "Next, choose View Identity Resolution."
            },
            {
              "type": "p",
              "text": "On the Identity Resolution page, notice that the machine learning resolution has an Active status for both Find matches and Merge matches. Also, S3 location displays the chosen S3 bucket."
            },
            {
              "type": "p",
              "text": "That's it. You successfully set up auto-merging in Identity Resolution and assigned S3 buckets to store matched profile IDs for Amazon Connect Customer Profiles."
            },
            {
              "type": "callout",
              "variant": "key",
              "title": "Tip",
              "body": [
                "Use the PutProfileObjectType API to add timestamp attributes to your custom object types. For more information, see PutProfileObjectType in the Amazon Connect API Reference."
              ]
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t11-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for Identity Resolution",
          "blocks": [
            {
              "type": "p",
              "text": "Best practices of Identity Resolution include the following:"
            },
            {
              "type": "ul",
              "items": [
                "Start conservative: Begin with stricter matching rules and gradually relax them.",
                "Monitor regularly: Periodically review matched profiles.",
                "Take a balanced approach: Consider using both rule-based matching and ML-based matching.",
                "Use clear consolidation criteria: Define clear criteria for when profiles should be merged."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t12",
      "number": 12,
      "title": "Knowledge Check",
      "shortTitle": "Knowledge Check",
      "summary": "Course content.",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [],
      "reviewQuestions": [
        {
          "id": "connect-ai-customer-engagement-t12-q1",
          "question": "A healthcare provider is implementing Amazon Connect Customer Profiles. The provider needs to integrate patient data from multiple systems, including the electronic medical records system, appointment scheduling software, and billing system. What is the PRIMARY advantage of using generative AI-powered data mapping in this scenario?",
          "options": [
            {
              "id": "A",
              "text": "It creates synthetic patient data for testing purposes."
            },
            {
              "id": "B",
              "text": "It generates realistic self-service assistant responses based on patient medical history."
            },
            {
              "id": "C",
              "text": "It prevents unauthorized access to protected health information."
            },
            {
              "id": "D",
              "text": "It automatically determines how to organize and combine data from different sources into unified profiles."
            }
          ],
          "correctOptionId": "D",
          "rationale": "Generative AI data mapping focuses on data organization and integration. It does not primarily address security concerns. Other features and configurations handle access control and data protection requirements in healthcare settings."
        },
        {
          "id": "connect-ai-customer-engagement-t12-q2",
          "question": "A financial institution is implementing Identity Resolution capabilities in Amazon Connect Customer Profiles and needs to understand about the matching resolutions to use for the institution's customer data. What is the key difference between rule-based matching and machine learning (ML) matching in Identity Resolution for Amazon Connect Customer Profiles?",
          "options": [
            {
              "id": "A",
              "text": "Rule-based matching works with email addresses, while ML matching works with phone numbers."
            },
            {
              "id": "B",
              "text": "ML matching requires manual approval, while rule-based matching is fully automated."
            },
            {
              "id": "C",
              "text": "Rule-based matching uses predefined rules for exact comparisons, while ML matching can detect similarities in non-exact matches."
            },
            {
              "id": "D",
              "text": "Rule-based matching is available at no charge, while ML matching requires additional payment."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Both approaches can run automatically without manual approval requirements. The difference lies in their matching methodology and capabilities. Both can be configured to operate independently after initial setup."
        },
        {
          "id": "connect-ai-customer-engagement-t12-q3",
          "question": "A retail company has implemented Identity Resolution in Amazon Connect Customer Profiles and is now setting up auto-merging to consolidate duplicate customer records. Which best practice should be followed when implementing profile merging in Amazon Connect? (Select TWO.) (Select all that apply: Begin with stricter matching rules and gradually relax them as confidence in the system grows. / Rely solely on machine learning (ML) matching and ignore rule-based matching. / Regularly monitor matched profiles to make sure there is accurate consolidation. / Merge all potential matches automatically without review. / Use both rule-based matching and machine learning (ML) matching approaches for comprehensive coverage.)",
          "options": [],
          "answer": "Begin with stricter matching rules and gradually relax them as confidence in the system grows.; Regularly monitor matched profiles to make sure there is accurate consolidation.. The incorrect options can create data quality issues. Relying on only one matching approach limits effectiveness. Both methods complement each other for better results. Automatic merging without review endangers data integrity. Although using both matching approaches is beneficial, implementation requires careful monitoring and conservative initial settings."
        }
      ]
    },
    {
      "id": "connect-ai-customer-engagement-t13",
      "number": 13,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "You have explored Amazon Connect Customer Profiles and the AI-powered capabilities that create unified customer views across multiple data…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t13-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "You have explored Amazon Connect Customer Profiles and the AI-powered capabilities that create unified customer views across multiple data sources. Generative AI data mapping streamlines organizing and combining customer data from disparate systems. This reduces setup time from hours to seconds."
            },
            {
              "type": "p",
              "text": "You examined how Amazon Connect uses both rule-based and machine learning-based identity resolution to automatically identify and merge duplicate profiles. Rule-based matching uses deterministic criteria while ML matching identifies patterns in customer data. Together, these identity resolution methods ensure a single comprehensive view of each customer. The unified profiles provide agents with immediate access to customer information. This enables agents to deliver personalized service while improving operational efficiency."
            },
            {
              "type": "p",
              "text": "In the next section, you will explore how to use unified customer profiles and generative AI in outbound campaign intelligence."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t14",
      "number": 14,
      "title": "Introduction to Outbound Campaigns and Customer Segments",
      "shortTitle": "Introduction to Outbound Campaigns and Custo…",
      "summary": "Imagine you are tasked with reaching out to thousands of customers who haven't made a purchase in the past month. How would you identify these…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [
        "Configure Amazon Connect outbound campaigns with AI-powered call classification to optimize agent productivity.",
        "Create targeted customer segments using both natural language prompts and data-driven inspiration cards.",
        "Implement segmentation strategies that improve campaign performance and customer engagement metrics."
      ],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t14-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Section introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Imagine you are tasked with reaching out to thousands of customers who haven't made a purchase in the past month. How would you identify these customers? How would you make sure that your outreach is personalized and effective? This is where outbound campaign intelligence comes into play."
            },
            {
              "type": "p",
              "text": "In this section, you will explore how AI-powered tools in Amazon Connect can transform your outbound campaigns from basic mass communications to strategic, data-driven customer engagements."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t15",
      "number": 15,
      "title": "Setting up Outbound Campaigns",
      "shortTitle": "Setting up Outbound Campaigns",
      "summary": "Outbound campaigns are proactive communications initiated by businesses to their customers, and they are essential for everything from appointment…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t15-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Outbound campaigns are proactive communications initiated by businesses to their customers, and they are essential for everything from appointment reminders to marketing promotions."
            },
            {
              "type": "p",
              "text": "Amazon Connect outbound campaigns can help with various proactive communications. Review the following examples of outbound campaigns:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t15-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Preparing to set up Amazon Connect outbound campaigns",
          "blocks": [
            {
              "type": "p",
              "text": "Before beginning your first campaign, you need to complete the following prerequisites:"
            },
            {
              "type": "p",
              "text": "Make sure the Amazon Connect instance is configured for outbound calling. For more information, see Enable Outbound Calls in Your Amazon Connect Instance."
            },
            {
              "type": "p",
              "text": "Create a dedicated outbound campaigns queue to handle any contacts that will be routed to agents as a result of the campaign."
            },
            {
              "type": "p",
              "text": "Assign the queue to the agent's routing profile. Note: The agent's routing profile should only include the dedicated outbound campaigns queue."
            },
            {
              "type": "p",
              "text": "Create and publish a flow that includes a Check call progress block. With this block, you can branch based on whether a person or a machine answered a call. For more information, see Flow Block in Amazon Connect: Check Call Progress."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t15-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring Outbound Campaigns in Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "In the following demonstration, you will learn about enabling outbound campaigns in the Amazon Connect. Amazon Connect outbound campaigns allow you to automate outbound campaign voice communications to your customers."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t15-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Configuring Outbound Campaigns in Amazon Connect",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Transcript: Configuring Outbound Campaigns in Amazon Connect"
            },
            {
              "type": "p",
              "text": "Welcome to this demonstration on how to set up Amazon Connect outbound campaigns, formerly known as high-volume outbound communications."
            },
            {
              "type": "p",
              "text": "To start, sign in to the AWS Management Console."
            },
            {
              "type": "p",
              "text": "In the search box at the top of the page, enter Amazon Connect. In the displayed list of services, choose Amazon Connect."
            },
            {
              "type": "p",
              "text": "On the Amazon Connect page, the instances in your account are displayed. Choose the Instance alias of the instance that you want to enable outbound campaigns on."
            },
            {
              "type": "p",
              "text": "Next, in the navigation pane, under Channels and communications, choose Outbound campaigns."
            },
            {
              "type": "p",
              "text": "On the Outbound campaigns page, choose Enable. If you don't have this option, verify whether outbound campaigns is available in your AWS Region."
            },
            {
              "type": "p",
              "text": "Next, under the Encryption section, you will need to either enter your own AWS KMS key or choose to create a new one. For this demonstration, you will create a new KMS key."
            },
            {
              "type": "p",
              "text": "Choose Create an AWS KMS key. A new browser tab will open for the AWS Key Management Service (AWS KMS) console."
            },
            {
              "type": "p",
              "text": "On the Create key page, in the Configure key step, review that the Key type is set to Symmetric and Key usage is set as Encrypt and decrypt. Then, choose Next."
            },
            {
              "type": "p",
              "text": "On the Add labels step, enter a descriptive alias and description for your key. In this demonstration, for Alias, enter KMS-AmazonConnectOutboundCampaigns. For Description, enter KMS for Amazon Connect Outbound Campaigns. When you are done, choose Next."
            },
            {
              "type": "p",
              "text": "On the Define key administrative permissions - optional step, choose Next."
            },
            {
              "type": "p",
              "text": "On the Define key usage permissions - optional step, choose Next."
            },
            {
              "type": "p",
              "text": "On the Edit key policy - optional step, choose Next."
            },
            {
              "type": "p",
              "text": "Finally, on the Review step, choose Finish to complete the key creation process."
            },
            {
              "type": "p",
              "text": "Now, return to the Amazon Connect console tab. Choose the AWS KMS key field, and review your list of available keys. Your newly created key should appear in the list. In this demonstration, you will choose the KMS-AmazonConnectOutboundCampaigns key."
            },
            {
              "type": "p",
              "text": "With everything configured, choose Enable outbound campaigns. The process will take a few minutes to complete. After outbound campaigns is enabled, you can begin creating outbound campaigns for voice calls in Amazon Connect."
            },
            {
              "type": "p",
              "text": "If the enabling process fails, you might need to verify that you have the required AWS Identity and Access Management (IAM) permissions for the key, including kms:DescribeKey, kms:CreateGrant, and kms:RetireGrant."
            },
            {
              "type": "p",
              "text": "To enable your total instance limits for outbound campaigns, you need to make sure that your campaign permissions are up to date. Choose Upgrade permission."
            },
            {
              "type": "p",
              "text": "This completes the demonstration on setting up Amazon Connect outbound campaigns."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t16",
      "number": 16,
      "title": "Understanding Customer Segments",
      "shortTitle": "Understanding Customer Segments",
      "summary": "Customer segments are specific groups of people who share common characteristics or behaviors. Customer segments are dynamically evaluated based…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t16-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Customer segments are specific groups of people who share common characteristics or behaviors. Customer segments are dynamically evaluated based on attributes that you define and can change over time when the value of the attributes change. In Amazon Connect, segments serve as the foundation for targeted outbound campaigns."
            },
            {
              "type": "p",
              "text": "Instead of sending the same promotional message to all customers, you might create different segments, such as the following:"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t16-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Real-world example",
          "blocks": [
            {
              "type": "p",
              "text": "The following diagram illustrates how a customer can be segmented based on interaction type (inbound compared to outbound contacts) and priority levels. At the center is Amazon Connect, which serves as the hub for all customer interactions."
            },
            {
              "type": "p",
              "text": "On the left side of the diagram, inbound contacts are categorized into the following three priority segments:"
            },
            {
              "type": "p",
              "text": "Cart abandoners (urgent priority) with an estimated 3,200 contacts who abandoned their carts within 24–72 hours"
            },
            {
              "type": "p",
              "text": "High-value customers (high priority) with 2,450 estimated contacts who haven't made purchases in more than 30 days and have historical spend exceeding $500 each month"
            },
            {
              "type": "p",
              "text": "New customers (medium priority) with approximately 1,850 contacts who made their first purchase within 7 days"
            },
            {
              "type": "p",
              "text": "The right side of the diagram displays the following outbound contact strategies:"
            },
            {
              "type": "p",
              "text": "Recovery and conversion efforts (urgent priority) targeting 200 contacts with limited-time offers and purchase hesitation solutions"
            },
            {
              "type": "p",
              "text": "Reengagement strategies (high priority) focusing on 350 contacts through personalized discounts and loyalty program enrollment"
            },
            {
              "type": "p",
              "text": "Welcome and onboarding (medium priority) reaching 1,500 contacts with product tutorials and support information"
            },
            {
              "type": "p",
              "text": "Workflow diagram for Amazon Connect Customer Engagement system showing inbound and outbound contact strategies. Inbound contacts (left) include three customer segments: Cart abandoners (Urgent priority, 3,200 contacts), High-value customers (High priority, 2,450 contacts), and New customers (Medium priority, 1,850 contacts). Outbound contacts (right) show corresponding engagement strategies: Recovery and conversion efforts (Urgent, 200 contacts), Reengagement strategies (High, 350 contacts), and Welcome & onboarding (Medium, 1,500 contacts). Arrows connect each segment to the central Amazon Connect system."
            },
            {
              "type": "p",
              "text": "Customer segments are specific groups of people who share common characteristics or behaviors."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t16-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Segmentation benefits",
          "blocks": [
            {
              "type": "p",
              "text": "The more targeted your segments, the more personalized and effective your campaigns can be. The following are some examples:"
            },
            {
              "type": "ul",
              "items": [
                "Higher engagement rates: When customers receive relevant messages, they're more likely to engage.",
                "Improved customer experience: Personalized communications demonstrate to customers that you understand their needs.",
                "Better resource allocation: By focusing on the right customers at the right time, you optimize your outreach efforts."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t17",
      "number": 17,
      "title": "AI in Campaign Management",
      "shortTitle": "AI in Campaign Management",
      "summary": "AI has revolutionized outbound campaign management, enabling businesses to work smarter, not harder. From detecting whether a human or machine…",
      "duration": "~3 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t17-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "AI has revolutionized outbound campaign management, enabling businesses to work smarter, not harder. From detecting whether a human or machine answered a call to receiving recommendations based on trends in the customer data, AI-powered tools make campaigns more efficient."
            },
            {
              "type": "p",
              "text": "In Amazon Connect, AI powers the following key aspects of outbound campaigns."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t17-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Segment AI Assistant",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Inspiration Cards"
            },
            {
              "type": "p",
              "text": "Call classification uses machine learning to determine whether a call was answered by a person or an automated system."
            },
            {
              "type": "p",
              "text": "Amazon Connect call classification technology analyzes several factors:"
            },
            {
              "type": "ul",
              "items": [
                "Background noise analysis: It can detect background noise patterns typically associated with pre-recorded messages.",
                "Speech patterns: The system recognizes long strings of words common in voicemail greetings.",
                "Human response patterns: Call classification identifies typical human responses, such as \"Hello,\" followed by pauses.",
                "Amazon Connect call classification connects agents only with live customers."
              ]
            },
            {
              "type": "p",
              "text": "Call classification. End of Tab."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Understanding call classification"
            },
            {
              "type": "p",
              "text": "Call classification uses machine learning to determine whether a call was answered by a person or an automated system."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Call progress analysis"
            },
            {
              "type": "p",
              "text": "When your outbound campaign makes a call, the Check call progress flow block branches based on the call classification outcome. The following are a few examples:"
            },
            {
              "type": "ul",
              "items": [
                "If a human answers, it branches to connect to an agent.",
                "If an answering machine responds, it branches to leave a pre-recorded message."
              ]
            },
            {
              "type": "p",
              "text": "If the ML model cannot determine the answer type, it branches to play a message before connecting to an agent."
            },
            {
              "type": "p",
              "text": "This intelligence matters because studies show that many calls to consumers go to voicemail. Without call classification, agents would waste countless hours listening to voicemail greetings and leaving messages."
            },
            {
              "type": "p",
              "text": "Check call progress block in an Amazon Connect flow."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Agent productivity benefits"
            },
            {
              "type": "p",
              "text": "Beyond call classification, AI improves agent productivity in several key ways:"
            },
            {
              "type": "p",
              "text": "Minimizing idle time: Predictive dialing helps agents spend more time speaking with customers."
            },
            {
              "type": "p",
              "text": "Prioritizing live connections: Because answering machines, wrong numbers, and no-answers are filtered out, agents stay focused on live connections."
            },
            {
              "type": "p",
              "text": "Providing context: When a call connects to an agent, AI can instantly display relevant customer information."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Customer experience impact"
            },
            {
              "type": "p",
              "text": "AI does not just benefit agents and businesses, it also improves the customer experience in the following ways:"
            },
            {
              "type": "ul",
              "items": [
                "Reduced spam perception: When calls connect to live agents immediately, customers are more likely to engage.",
                "Personalization: AI helps agents have more relevant conversations by providing customer context."
              ]
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t17-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Segment AI Assistant",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Inspiration Cards"
            },
            {
              "type": "p",
              "text": "Generative AI-powered segmentation helps non-technical business users to build audiences using natural language queries."
            },
            {
              "type": "p",
              "text": "Natural language segment creation represents a significant breakthrough in making data more accessible to non-technical users. Instead of navigating complex filter interfaces or writing database queries, you can describe the customers you want to target in everyday language."
            },
            {
              "type": "p",
              "text": "Amazon Connect segment AI assistant interprets your natural language description and translates it into a structured segment definition that identifies the exact customers matching your criteria."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Inspiration Cards"
            },
            {
              "type": "p",
              "text": "This generative AI-powered feature presents segment ideas tailored to specific customer data and trends, streamlining segment creation."
            },
            {
              "type": "p",
              "text": "Inspiration cards are AI-powered recommendations that analyze your customer data to suggest potentially valuable segments for your campaigns. Unlike traditional segmentation that requires you to define criteria from scratch, inspiration cards proactively identify patterns and opportunities in your data."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t18",
      "number": 18,
      "title": "Segment AI Assistant",
      "shortTitle": "Segment AI Assistant",
      "summary": "Natural language segment creation represents a significant breakthrough in making data more accessible to non-technical users. Instead of…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t18-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Natural language segment creation represents a significant breakthrough in making data more accessible to non-technical users. Instead of navigating complex filter interfaces or writing database queries, you can describe the customers you want to target in conversational language."
            },
            {
              "type": "p",
              "text": "Amazon Connect segment AI assistant interprets your natural language description and translates it into a structured segment definition that identifies the exact customers matching your criteria."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t18-s2",
          "eyebrow": null,
          "duration": null,
          "title": "How natural language segment creation works",
          "blocks": [
            {
              "type": "p",
              "text": "Behind the scenes, the segment AI assistant uses advanced natural language processing algorithms to do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Analyze your description to identify key criteria and conditions.",
                "Map these criteria to available customer attributes in your domain.",
                "Construct a logical segment definition with the appropriate filters and relationships.",
                "Apply this definition to your customer data to generate the segment."
              ]
            },
            {
              "type": "p",
              "text": "For example, instead of manually configuring multiple filters and conditions, you could enter: Customers who have spent over $2,000 in the last 60 days."
            },
            {
              "type": "p",
              "text": "Amazon Connect interface for creating customer segments, showing segment definition fields and AI assistant chat."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t18-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Best practices for your segment AI assistant prompts",
          "blocks": [
            {
              "type": "p",
              "text": "Amazon Connect segment AI assistant relies heavily on the quality of prompts to generate effective responses for customer service agents. The difference between vague and better formed prompts can significantly impact the assistant's performance and usefulness. The quality of your segment depends significantly on how you phrase your prompt. Use the following best practices when composing prompts for the segment AI assistant:"
            },
            {
              "type": "ul",
              "items": [
                "Be specific: Include precise criteria instead of vague descriptions.",
                "Reference existing attributes: When possible, use the names of attributes that exist in your data.",
                "Include clear timeframes: Specify time periods clearly, such as in the last quarter.",
                "Start simple: Begin with straightforward prompts and gradually add complexity.",
                "Use business terminology: Frame your prompt in terms of business objectives."
              ]
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t18-s4",
          "eyebrow": null,
          "duration": null,
          "title": "\"I want to generate a segment\"",
          "blocks": [
            {
              "type": "p",
              "text": "A detailed but ineffective prompt that lists specific numbers and timeframes without connecting to actual system attributes"
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t18-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Better prompt example",
          "blocks": [
            {
              "type": "p",
              "text": "\"Identify VIP Customers who might be interested in our new subscription offer and have opted in to receive text messages.\""
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t18-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Refining AI-generated segments",
          "blocks": [
            {
              "type": "p",
              "text": "After the AI generates your segment, you can do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Review the segment definition: Check that all conditions reflect your intent.",
                "Adjust thresholds: Fine-tune values like purchase amounts or timeframes.",
                "Add or remove conditions: Enhance the segment with additional criteria or simplify.",
                "Preview results: See how many customers match your segment and review a sample."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t19",
      "number": 19,
      "title": "Inspiration Cards",
      "shortTitle": "Inspiration Cards",
      "summary": "Inspiration cards are Amazon Connect AI-powered recommendations that analyze your customer data to suggest potentially valuable segments for your…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t19-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "Inspiration cards are Amazon Connect AI-powered recommendations that analyze your customer data to suggest potentially valuable segments for your campaigns. Unlike traditional segmentation that requires you to define criteria from scratch, inspiration cards proactively identify patterns and opportunities in your data."
            },
            {
              "type": "p",
              "text": "These cards appear on the Customer segments page in Amazon Connect and present ready-to-use segment ideas based on actual trends in your customer profiles data."
            },
            {
              "type": "p",
              "text": "Amazon Connect customer segments dashboard showing three inspiration cards for targeting support cases and purchase patterns."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t19-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Inspiration cards generated recommendations",
          "blocks": [
            {
              "type": "p",
              "text": "Inspiration cards use advanced analytics and AI to generate their suggestions. They do the following:"
            },
            {
              "type": "ul",
              "items": [
                "Analyze historical data: Examine customer behavior patterns over time.",
                "Identify trends: Spot significant changes or patterns in customer activities.",
                "Apply business logic: Categorize these patterns into meaningful business contexts.",
                "Generate actionable segments: Create predefined segment criteria based on these insights.",
                "The system organizes these suggestions into the following business-focused themes:"
              ]
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t19-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Using AI-Powered Inspiration Cards for Customer Segmentation in Amazon Connect",
          "blocks": [
            {
              "type": "p",
              "text": "In the following demonstration, you will learn about using AI-powered inspiration cards for segmentation in Amazon Connect."
            }
          ]
        },
        {
          "id": "connect-ai-customer-engagement-t19-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Using AI-Powered Inspiration Cards for Customer Segmentation in Amazon Connect",
          "blocks": [
            {
              "type": "ul",
              "items": [
                "Transcript: Using AI-Powered Inspiration Cards for Customer Segmentation in Amazon Connect",
                "Welcome to this demonstration on using AI-powered inspiration cards for customer segmentation in Amazon Connect."
              ]
            },
            {
              "type": "p",
              "text": "First, you will need to sign into your Amazon Connect admin workspace by navigating to your instance URL, such as https://yourinstancename.my.connect.aws. You will either need the Admin security profile or make sure your security profile includes the CustomerProfiles.Segments.Create permission."
            },
            {
              "type": "p",
              "text": "After you are logged in, navigate to the Customer segments page. On the navigation pane, choose Customer Profiles, then select Customer segments."
            },
            {
              "type": "p",
              "text": "On the Customer segments page, you will see the Inspired by customer trends section, which shows the AI-powered inspiration cards."
            },
            {
              "type": "p",
              "text": "Review the inspiration cards that have been suggested for you. These are not just random suggestions. They are carefully crafted segments designed to help your business grow. Think about how each inspiration card might fit your business needs."
            },
            {
              "type": "p",
              "text": "If the first few cards are not quite right, you can choose Explore more to display more possible inspiration cards if available."
            },
            {
              "type": "p",
              "text": "When you have selected an inspiration card that matches your business goals, choose Get started on your chosen inspiration card."
            },
            {
              "type": "p",
              "text": "Review the generated customer segmentation audience. You can fine-tune the segment by adjusting the group and filters to perfectly match your target audience."
            },
            {
              "type": "p",
              "text": "When you are happy with your target audience, choose Create segment."
            },
            {
              "type": "p",
              "text": "Your AI-powered customer segment will now be created and ready to power your marketing strategy."
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-ai-customer-engagement-t20",
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
          "id": "connect-ai-customer-engagement-t20-q1",
          "question": "A utility company needs to set up outbound campaigns in Amazon Connect to notify customers about planned service interruptions. What are the necessary prerequisites for setting up outbound campaigns in Amazon Connect? (Select THREE.) (Select all that apply: Enable outbound calling capabilities for the Amazon Connect instance. / Create a dedicated queue for outbound campaign contacts. / Purchase additional phone numbers specifically for outbound calling. / Build a flow that includes the Check call progress block. / Install special hardware for campaign management. / Assign the outbound campaigns queue to agent routing profiles.)",
          "options": [],
          "answer": "Enable outbound calling capabilities for the Amazon Connect instance.; Create a dedicated queue for outbound campaign contacts.; Assign the outbound campaigns queue to agent routing profiles.. The incorrect options represent unnecessary requirements for Amazon Connect outbound campaigns. Building a flow with Check call progress helps with answering machine detection but is not a prerequisite. Additional phone numbers are not required because existing numbers can manage the outbound calls. Special hardware is unnecessary because Amazon Connect operates as a cloud-based solution. The platform does not need on-premises equipment for campaign management."
        },
        {
          "id": "connect-ai-customer-engagement-t20-q2",
          "question": "A subscription-based streaming service wants to create customer segments for retention campaigns using the segment AI assistant in Amazon Connect. Which approach would produce the MOST effective results when creating a segment with natural language prompts?",
          "options": [
            {
              "id": "A",
              "text": "\"Customers who might cancel soon\""
            },
            {
              "id": "B",
              "text": "\"Give me a list of all at-risk customers\""
            },
            {
              "id": "C",
              "text": "\"Find subscribers who need special offers\""
            },
            {
              "id": "D",
              "text": "\"Customers who have decreased their viewing time by more than 30 percent in the last month, have not watched any new releases, and whose subscription renews within the next 14 days\""
            }
          ],
          "correctOptionId": "D",
          "rationale": "This prompt lacks the precision needed for effective segmentation. It contains no specific criteria, timeframes, or behaviors. The AI cannot determine which customers \"need special offers\" without defined parameters. Effective prompts require concrete definitions."
        },
        {
          "id": "connect-ai-customer-engagement-t20-q3",
          "question": "A travel company is using inspiration cards in Amazon Connect to discover new customer segments for their promotional campaigns. How can a contact center manager evaluate which inspiration card suggestions are worth pursuing?",
          "options": [
            {
              "id": "A",
              "text": "Select inspiration cards that generate the largest possible customer segments."
            },
            {
              "id": "B",
              "text": "Choose the first three inspiration cards that appear in the system."
            },
            {
              "id": "C",
              "text": "Assess alignment with business goals, actionability, segment size, and timing relevance."
            },
            {
              "id": "D",
              "text": "Implement all inspiration cards without evaluation to maximize coverage."
            }
          ],
          "correctOptionId": "C",
          "rationale": "The order of inspiration cards does not indicate their business value. Each suggestion deserves evaluation based on its alignment with current objectives. The system does not prioritize cards by potential effectiveness."
        }
      ]
    },
    {
      "id": "connect-ai-customer-engagement-t21",
      "number": 21,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "You have completed your journey through Amazon Connect AI Customer Engagement capabilities. Throughout this course, you explored three major areas…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-ai-customer-engagement-t21-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Overview",
          "blocks": [
            {
              "type": "p",
              "text": "You have completed your journey through Amazon Connect AI Customer Engagement capabilities. Throughout this course, you explored three major areas that can revolutionize customer engagement. First, you learned how AI enhances traditional contact centers by creating unified customer views. Instead of agents navigating through multiple systems, they can now see all customer information in one place. Next, you explored Customer Profiles with AI capabilities. You learned how generative AI data mapping automatically organizes customer information from different sources and how identity resolution works to recognize that variation. Finally, you explored outbound campaign intelligence, where you learned to create customer segments using natural language and to use inspiration cards to discover patterns."
            },
            {
              "type": "p",
              "text": "You have now been introduced to the AI tools that can transform customer engagement. How will you use them to create more personalized, efficient, and meaningful connections with your customers?"
            }
          ]
        }
      ],
      "reviewQuestions": []
    }
  ],
  "quiz": null
};
