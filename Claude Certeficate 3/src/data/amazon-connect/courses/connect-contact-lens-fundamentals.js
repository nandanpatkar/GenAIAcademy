/*
 * Amazon Connect — Contact Lens Fundamentals
 *
 * GENERATED FILE. Do not edit by hand.
 * Sources:  conne/AMAZON CONNECT CONTACT LENS FUNDAMENTAL.txt
 *            conne-text/Amazon Connect Contact Lens Fundamentals Summary.txt  (from conne/Amazon Connect Contact Lens Fundamentals Summary.pdf)
 * Generator: tools/build-connect-data.mjs  (node tools/build-connect-data.mjs)
 *
 * Every string below is taken from the sources above. The block vocabulary is
 * documented in src/data/courses.js.
 */

export const course = {
  "id": "connect-contact-lens-fundamentals",
  "track": "amazon-connect",
  "code": "AWS",
  "title": "Contact Lens Fundamentals",
  "provider": "Amazon Web Services",
  "level": "Fundamentals",
  "category": "Analytics",
  "description": "What Contact Lens analyzes, its advanced functionality, how it is used day to day, and the considerations that apply.",
  "examFormat": "6 topics · ~28 min · 6 review questions",
  "sourceFiles": [
    "conne/AMAZON CONNECT CONTACT LENS FUNDAMENTAL.txt",
    "conne-text/Amazon Connect Contact Lens Fundamentals Summary.txt  (from conne/Amazon Connect Contact Lens Fundamentals Summary.pdf)"
  ],
  "modules": [
    {
      "id": "connect-contact-lens-fundamentals-t1",
      "number": 1,
      "title": "Introduction to Contact Lens",
      "shortTitle": "Introduction to Contact Lens",
      "summary": "In this lesson, you will do the following:",
      "duration": "~7 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-contact-lens-fundamentals-t1-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson objective",
          "blocks": [
            {
              "type": "p",
              "text": "In this lesson, you will do the following:"
            },
            {
              "type": "p",
              "text": "Recognize Contact Lens core concepts and terminology."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "In today's customer focused business landscape, providing exceptional customer experience is crucial for success. Contact centers play a vital role in shaping contact interactions and building lasting relationships. However, gaining actionable insights from conversations across multiple channels is a challenge."
            },
            {
              "type": "p",
              "text": "Amazon Connect is an omnichannel cloud-based contact center service that businesses can use to handle contact interactions across channels, such as voice, chat, and SMS. A feature of Amazon Connect is Amazon Connect Contact Lens, a suite of AI-powered capabilities that provide deep insights into conversations."
            },
            {
              "type": "p",
              "text": "This lesson introduces key concepts and terminology related to Amazon Connect Contact Lens."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Contact Lens concepts and terminology",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens is a suite of machine learning (ML)-powered capabilities that empower businesses to unlock valuable insights from contact interactions. Contact center agents, supervisors, and quality teams need access to relevant contact context and analytics. To effectively handle contacts, improve customer experience, and drive agent performance, Contact Lens offers conversational analytics capabilities such as:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Sentiment analysis"
            },
            {
              "type": "ul",
              "items": [
                "Automated post-contact summaries",
                "Key highlights",
                "Sensitive data redaction"
              ]
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Conversational analytics",
          "blocks": [
            {
              "type": "p",
              "text": "Conversational analytics is a capability of Contact Lens that uses natural language processing (NLP) to analyze and understand the content of your contact conversations. For voice interactions, conversational analytics automatically transcribes calls and analyzes the text of the transcriptions. It uses advanced NLP techniques to extract meaningful information from the conversations, such as customer sentiment, speech patterns, and key topics discussed."
            },
            {
              "type": "p",
              "text": "The following screenshot is of the Conversational analytics view in Amazon Connect. To learn more, choose each of the numbered markers."
            },
            {
              "type": "p",
              "text": "Interactive screenshot of Conversational analytics in the Amazon Connect console."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Sentiment analysis",
          "blocks": [
            {
              "type": "p",
              "text": "Sentiment analysis is a feature of Contact Lens that helps users understand the emotional tone of conversations. It uses NLP to analyze the contact's spoken words and assign a sentiment score ranging from negative to positive values."
            },
            {
              "type": "p",
              "text": "With sentiment analysis, users can evaluate the contact or agent sentiment during the conversation. You can determine whether their sentiment is happy, neutral, or negative."
            },
            {
              "type": "p",
              "text": "This insight is valuable for the following reasons."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Identify dissatisfied customers",
                  "body": "Contact Lens can alert you when a conversation turns negative based on predefined sentiment score thresholds. You can use this information to intervene and try to de-escalate the situation."
                },
                {
                  "title": "Learn from positive interactions",
                  "body": "By analyzing calls with highly positive sentiment scores, you can understand which agent behaviors or processes are driving positive customer experiences. You can use these insights to train other agents and replicate successful approaches."
                },
                {
                  "title": "Uncover common complaints and praises",
                  "body": "The sentiment data can reveal recurring topics or issues that tend to elicit negative or positive reactions from customers. This information can guide decisions about product improvements, process changes, or areas that need further agent training."
                },
                {
                  "title": "Optimize handle times",
                  "body": "Contact Lens tracks talk time (when the agent is speaking) and non-talk time (hold periods or long silences). Analyzing these metrics alongside sentiment can identify opportunities to reduce handle times and improve efficiency."
                }
              ]
            },
            {
              "type": "p",
              "text": "By using sentiment analysis, organizations gain deeper insights into the customer experience. They can address issues proactively, reinforce positive behaviors, and make data-driven operational improvements. In the conversational analytics view, you can further analyze these insights to enhance your understanding and application of the data."
            },
            {
              "type": "p",
              "text": "Contact Lens sentiment analysis for a voice interaction."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Automated post-contact summaries",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens uses generative AI to automatically create summaries of contact conversations. Post-contact summaries save time for agents by eliminating the need for manual note-taking. They also help supervisors efficiently understand contact interactions without the need to review entire transcripts or recordings."
            },
            {
              "type": "p",
              "text": "Supervisors can use the summaries to efficiently review contact interactions, identify areas for improvement, and provide targeted feedback to agents. The post-contact summary feature streamlines the quality assurance process and helps organizations deliver improved customer experiences."
            },
            {
              "type": "p",
              "text": "A post-contact summary for a voice interaction."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Key highlights",
          "blocks": [
            {
              "type": "p",
              "text": "A key highlight is a key excerpt from a contact conversation that Contact Lens automatically identifies and labels. These highlights make it possible for you to efficiently review important parts of a lengthy conversation transcript. Contact Lens analyzes each conversation transcript and assigns labels, such as Issue, Outcome, or Action Item, to the relevant excerpts. It then displays these labeled excerpts as expandable key highlights."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Issue",
                  "body": "An Issue highlight might capture the portion of the conversation where the contact explains the problem they are facing. For example, the contact might say, \"I've been trying to reset my password for hours, but the reset link never arrives in my email inbox.\""
                },
                {
                  "title": "Outcome",
                  "body": "An Outcome highlight includes information about how the agent resolved the issue. For example, the agent might say, \"Okay, I've reset your account password and sent a new temporary password to your alternate email address.\""
                },
                {
                  "title": "Action Item",
                  "body": "An Action Item highlight represents the action item for the agent. For example, the agent might say, \"Please wait for an email with a price quote. I will send it to you shortly.\""
                }
              ]
            },
            {
              "type": "p",
              "text": "The key highlights provide a high-level summary of the main topics covered during an interaction. Reviewers can conveniently scan the highlights to understand the main point of the conversation without reading the entire transcript."
            },
            {
              "type": "p",
              "text": "When evaluating a contact, you can expand the key highlights to view the interaction transcript, for additional context. Each conversation can contain multiple highlights labeled with different categories, such as Issue, Outcome, and so on. These highlights help contact center managers and quality analysts identify the critical portions of an interaction for efficient review and analysis. The following image provides an example of an analyzed customer interaction. The example highlights the customer-identified issue and the interaction outcome."
            },
            {
              "type": "p",
              "text": "Contact Lens key highlights for an interaction."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Accessible highlight example",
                  "body": "The following table illustrates the key highlights used in the previous image."
                },
                {
                  "title": "Customer Issue Agent Outcome",
                  "body": "Hi, [PII]. I'd like to buy a new chair, please. It's the gray one I've seen on your website. Great. Thank you. Let me process that. Great. The payment's gone through, your order should be with you in three working days. Is there anything else I can help you with? Sensitive data redaction"
                }
              ]
            },
            {
              "type": "p",
              "text": "When you record and analyze conversations, you might capture sensitive information, such as names, addresses, credit card numbers, or social security numbers. Exposing this sensitive data can violate privacy regulations and put your customers at risk. Contact Lens offers a data redaction feature to help safeguard privacy. Data redaction automatically removes or masks sensitive information from transcripts and audio recordings after a call ends."
            },
            {
              "type": "p",
              "text": "Contact Lens uses machine learning and natural language understanding to identify and redact sensitive data, such as the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Personal names"
            },
            {
              "type": "ul",
              "items": [
                "Street addresses",
                "Credit and debit card numbers"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Social security and national ID numbers"
            },
            {
              "type": "p",
              "text": "Data redaction is an important tool for complying with data privacy regulations, enhancing security, reducing risk exposure, and improving quality assurance without compromising contact information."
            },
            {
              "type": "p",
              "text": "Call transcript with data redacted for personally identifiable information (PII)."
            },
            {
              "type": "p",
              "text": "With Contact Lens, organizations can record an agent’s desktop activities during contact interactions. By using the screen recording feature, organizations can do the following:"
            },
            {
              "type": "p",
              "text": "Identify coaching opportunities by reviewing the agent's actions with call recordings or chat transcripts to pinpoint areas for improvement, such as long handle times or process deviations."
            },
            {
              "type": "p",
              "text": "Ensure that compliance screen recordings are Payment Card Industry Data Security Standard (PCI DSS) compliant and within the AWS System and Organization Controls (SOC) audit scope. This can help organizations meet regulatory requirements."
            },
            {
              "type": "p",
              "text": "Check your knowledge"
            },
            {
              "type": "p",
              "text": "The following section will check your understanding of the content covered in this lesson."
            },
            {
              "type": "p",
              "text": "An organization wants to transcribe calls while managing privacy and risk exposure issues. Which feature should the organization use?"
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Key highlights",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Incorrect"
            },
            {
              "type": "p",
              "text": "Sensitive data redaction identifies and redacts sensitive information from the conversation."
            },
            {
              "type": "p",
              "text": "Key highlights provide key excerpts of interactions. Sentiment analysis evaluates how the contact or agent is feeling. Screen recording makes it possible for organizations to manage compliance and auditability requirements they might be subject to."
            },
            {
              "type": "p",
              "text": "A supervisor wants to find out the outcome of a customer call without reviewing full recordings. Which feature should they use?"
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t1-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Key highlights",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Incorrect"
            },
            {
              "type": "p",
              "text": "Key highlights provide key excerpts of interactions that automatically identify issues, outcomes, and action items."
            },
            {
              "type": "p",
              "text": "Sensitive data redaction removes sensitive information from the conversation. Sentiment analysis evaluates how the contact or agent is feeling. Screen recording does not summarize key highlights."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to Amazon Connect Contact Lens concepts and terminology. In the next lesson, you will explore advanced features of Amazon Connect Contact Lens. Lesson 3 of 9 Lesson 2 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-contact-lens-fundamentals-t2",
      "number": 2,
      "title": "Contact Lens Advanced Functionality",
      "shortTitle": "Contact Lens Advanced Functionality",
      "summary": "Contact Lens offers advanced features to automate contact categorization, customize business rules, simplify search interactions, and surface…",
      "duration": "~6 min",
      "lede": null,
      "objectives": [
        "Explore Contact Lens features that simplify contact insights, search, and review features.",
        "Recognize Contact Lens features that automate business rules and surface emerging trends."
      ],
      "sections": [
        {
          "id": "connect-contact-lens-fundamentals-t2-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens offers advanced features to automate contact categorization, customize business rules, simplify search interactions, and surface emerging trends."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t2-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Advanced features",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens offers contact insights, search, and review features such as the following:"
            },
            {
              "type": "h",
              "level": 4,
              "text": "Rules"
            },
            {
              "type": "ul",
              "items": [
                "Categories",
                "Search conversations",
                "Theme detection",
                "Custom vocabulary"
              ]
            },
            {
              "type": "h",
              "level": 4,
              "text": "Rules"
            },
            {
              "type": "p",
              "text": "With rules in Contact Lens, you can automatically categorize contact interactions and take actions based on specific criteria."
            },
            {
              "type": "p",
              "text": "A rule is like a set of instructions that Contact Lens follows to identify and respond to certain situations during a call or chat. For example, you can create a rule to categorize a contact as a refund request if the contact mentions the word \"refund\" during the conversation."
            },
            {
              "type": "p",
              "text": "You can also set up rules to detect sentiment, like frustration or dissatisfaction, based on the language used by the contact or agent. Contact Lens rules can match exact words, synonyms, patterns, and sentiment scores. This feature helps you gain insights and automate actions based on the content of your interactions."
            },
            {
              "type": "p",
              "text": "After a rule is initiated, you can configure Contact Lens to perform various actions. These actions can include sending an alert to a supervisor or creating a follow-up task in Amazon Connect."
            },
            {
              "type": "p",
              "text": "By defining and implementing rules, you can understand contact needs, identify areas for improvement, and streamline your contact center operations."
            },
            {
              "type": "p",
              "text": "The following image depicts the first step in setting up a rule definition. In this example, the rule condition logic is met when the customer says one of the words or phrases during the entire length of the conversation. There is a list of words or phrases that meet the rule condition if they exactly match the customer speech."
            },
            {
              "type": "p",
              "text": "Contact Lens rule definition in the Amazon Connect administrator UI."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t2-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Categories",
          "blocks": [
            {
              "type": "p",
              "text": "Categories in Contact Lens are labels or tags that you can assign to contact conversations based on specific criteria. These categories help you organize and analyze your contact center interactions effectively. Contact Lens uses rules to automatically detect and assign categories to conversations in real time or post interaction."
            },
            {
              "type": "p",
              "text": "Categories can be based on multiple criteria, such as keywords or phrases, sentiment, interruptions, or non-talk time."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Keywords or phrases",
                  "body": "You can define categories based on specific words or phrases that are spoken or typed during a conversation. For example, you can create a category called Product Inquiry for conversations that include phrases such as \"product information\" or \"specifications.\""
                },
                {
                  "title": "Sentiment",
                  "body": "Contact Lens can analyze the sentiment expressed during a conversation and assign categories accordingly. Sentiment values can be positive, negative, or neutral. This can help you identify conversations where customers were satisfied or dissatisfied while interacting with an agent."
                },
                {
                  "title": "Interruptions",
                  "body": "Categories can be assigned based on the presence or frequency of interruptions during a conversation. An interruption is when the agent or contact talk over each other. Interruptions can be an indicator of poor customer experience or communication issues."
                },
                {
                  "title": "Non-talk time",
                  "body": "Non-talk time is identified when neither the agent nor the contact speaks. You can create categories for conversations with excessive non-talk time, which might indicate inefficient handling or technical issues."
                }
              ]
            },
            {
              "type": "p",
              "text": "By defining categories, you can filter and analyze your contact center data. You can define categories based on the topics, sentiments, or behaviors that are relevant to your business. For example, an organization can review conversations labeled Billing Issues to identify recurring problems. Organizations can monitor negative sentiment conversations to improve customer experience. You can find this information on the Contact details page in the Amazon Connect console for a specific conversation. Any category matches based on your defined rules are displayed above the transcript. You can use this information to identify and analyze relevant interactions."
            },
            {
              "type": "p",
              "text": "The following image depicts an interaction with two category labels: closure-voice-postcall and UnHappyCall."
            },
            {
              "type": "p",
              "text": "Amazon Connect Contact Lens categories applied to a voice interaction."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t2-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Search conversations",
          "blocks": [
            {
              "type": "p",
              "text": "With the search conversations feature, organizations can conveniently locate specific contact interactions for review and analysis."
            },
            {
              "type": "p",
              "text": "For example, imagine you want to find all conversations for a particular month where contacts called about making a return or exchange. You can use the keywords search to look for interactions containing phrases like \"return,\" \"exchange,\" \"send back,\" and so on. This will surface any relevant voice and chat transcripts where those words were spoken or typed. You can then filter the results for conversations in the Returns & Exchanges category that Contact Lens automatically assigned."
            },
            {
              "type": "p",
              "text": "Perhaps you want to focus specifically on interactions handled by your newest agent, Nikki Wolf. You can add a speaker filter for Nikki to provide only the return and exchange conversations that Nikki handled."
            },
            {
              "type": "p",
              "text": "Additionally, you might want to review particularly negative experiences. You can set the sentiment filter to include only conversations with low negative sentiment scores, which indicate frustrated or dissatisfied customers. For the voice calls, you can also search for long non-talk times of over 2 minutes. This might reveal opportunities to improve response times during the return process explanation."
            },
            {
              "type": "p",
              "text": "By combining keyword, category, speaker, sentiment, and non-talk time filters, you can efficiently find the exact conversation transcripts you need to analyze performance. You can identify issues and optimize processes for managing returns and exchanges."
            },
            {
              "type": "p",
              "text": "The following image depicts the conversation search interface with a filter for category labels. In this example, the Contact category filter is searching for interactions that were categorized with 45 seconds of non-talk time."
            },
            {
              "type": "p",
              "text": "Conversation search using Contact Lens categories."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t2-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Theme detection",
          "blocks": [
            {
              "type": "p",
              "text": "With the theme detection feature, you can automatically discover the reasons why customers contact your organization and the common topics."
            },
            {
              "type": "p",
              "text": "Theme detection uses NLP to group similar interactions into themes or categories based on the words and phrases used. This helps you efficiently identify emerging trends or issues that might be driving a high volume of contacts. Theme detection can reveal common issues, such as cancel subscription or billing question, providing insights into customer pain points."
            },
            {
              "type": "p",
              "text": "To use theme detection, you need to search for a set of conversations in Amazon Connect based on criteria such as the date range or queue. Contact Lens will then automatically analyze the transcripts and recordings using machine learning models to detect underlying themes across that dataset. The detected themes are presented in an intuitive interface in Amazon Connect. From there, you can conveniently explore each theme further by reviewing example conversations, listening to call recordings, and reading entire transcripts."
            },
            {
              "type": "p",
              "text": "By continuously monitoring the top automatically detected themes, you can stay ahead of developing customer experience issues before they become widespread. The insights can guide decisions like updating interactive voice response (IVR) prompts, knowledge base content, staff training, and other process improvements."
            },
            {
              "type": "p",
              "text": "The following image shows a theme report that can help to explore the associated contacts further."
            },
            {
              "type": "p",
              "text": "Contact Lens theme detection applied to contact interactions."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t2-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Custom vocabulary",
          "blocks": [
            {
              "type": "p",
              "text": "With Contact Lens, you can enhance speech recognition accuracy for specific terms relevant to your business. These terms can include details such as product names, brand names, and industry-specific terminology. By creating a custom vocabulary, you can expand and tailor the speech-to-text engine's vocabulary to improve transcription of specialized terms."
            },
            {
              "type": "p",
              "text": "For example, if your company sells a product called AnyCompany Laundry Detergent, you can add this term to your custom vocabulary. This will help Contact Lens accurately recognize and transcribe the product name during contact conversations. It prevents inaccurately transcribing it as separate words or misspelling it."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to the advanced features of Contact Lens. In the next lesson, you will explore Contact Lens use cases. Lesson 4 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-contact-lens-fundamentals-t2-q1",
          "question": "An organization wants to improve speech recognition accuracy for industry terms. Which feature should the organization use?",
          "options": [
            {
              "id": "A",
              "text": "Custom vocabulary"
            },
            {
              "id": "B",
              "text": "Rules"
            },
            {
              "id": "C",
              "text": "Categories"
            },
            {
              "id": "D",
              "text": "Theme detection"
            }
          ],
          "correctOptionId": "A",
          "rationale": "The custom vocabulary feature makes it possible to add specialized terms to improve transcription accuracy."
        }
      ]
    },
    {
      "id": "connect-contact-lens-fundamentals-t3",
      "number": 3,
      "title": "Using Contact Lens",
      "shortTitle": "Using Contact Lens",
      "summary": "Contact Lens provides analytics and quality management for contact centers. You can use it to monitor, measure, and improve contact quality and…",
      "duration": "~8 min",
      "lede": null,
      "objectives": [
        "Explore the benefits of Contact Lens and use cases.",
        "Examine how to enable Contact Lens functionality."
      ],
      "sections": [
        {
          "id": "connect-contact-lens-fundamentals-t3-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens provides analytics and quality management for contact centers. You can use it to monitor, measure, and improve contact quality and agent performance. This can lead to a better customer experience. The analytics provide a complete view of customer conversations for voice and chat. You can automatically transcribe calls, analyze sentiment, discover top contact drivers, and redact sensitive data."
            },
            {
              "type": "p",
              "text": "In this section, you will explore the benefits of Contact Lens and common use cases."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Benefits and use cases",
          "blocks": [
            {
              "type": "p",
              "text": "The most common benefits for Contact Lens are operational efficiency, agent performance improvements, insights, and regulatory compliance. The following four use cases introduce common contact center problems and how Contact Lens addresses those problems."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Operational efficiency",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Use case 1"
            },
            {
              "type": "p",
              "text": "Enhancing operational efficiency"
            },
            {
              "type": "p",
              "text": "Diego Ramirez is a supervisor at AnyCompany Retail. He is responsible for contact center performance and closely monitors average handle time (AHT). An increase in AHT of 1 percent costs the organization 1 million USD per week. Diego noticed that the AHT has increased by 10 percent in the last week."
            },
            {
              "type": "p",
              "text": "John Stiles is an agent working for the AnyCompany Retail contact center. John's weekly performance reports indicate a consistent increase in AHT."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Contact Lens solution for use case 1"
            },
            {
              "type": "p",
              "text": "Diego sets up a Contact Lens rule for non-talk time higher than the average hold time. He then spot-checks the result set and reviews the contact detail records for John Stiles."
            },
            {
              "type": "p",
              "text": "John’s screen recording indicates that the internal order tracker tool is slow, taking 45 seconds longer than usual. During this time, John waits for the tool to return the order status, which results in a long duration of non-talk time. Diego reaches out to the IT department for this issue. The IT department fixes the tool. As a result of this change, the AHT for all agents using the tool improves."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Agent performance improvements",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Use case 2"
            },
            {
              "type": "p",
              "text": "Improving agent performance through real-time coaching"
            },
            {
              "type": "p",
              "text": "It's another busy day at the AnyCompany contact center, and Alejandro Rosalez, a supervisor, is gearing up for his shift. As he reviews the daily reports, he notices an increase in call volumes and a dip in customer satisfaction scores."
            },
            {
              "type": "p",
              "text": "Alejandro knows that providing an exceptional customer experience is crucial for the company's success, and he's determined to address any issues proactively in real time."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Contact Lens solution for use case 2"
            },
            {
              "type": "p",
              "text": "Alejandro ensures that agents are maintaining high levels of customer satisfaction. He uses the sentiment analysis feature of Contact Lens to evaluate the contact and agent sentiment. By creating a rule that alerts on poor sentiment scores, Alejandro can identify dissatisfied contacts and intervene before the situation escalates."
            },
            {
              "type": "p",
              "text": "Alejandro receives an alert from Contact Lens that a customer named John Doe has expressed frustration during an interaction with Sofía Martínez, an agent."
            },
            {
              "type": "p",
              "text": "Alejandro promptly joins the call using the supervisor barge feature. He acknowledges John's issue and helps Sofía navigate the conversation."
            },
            {
              "type": "p",
              "text": "John's inquiry is resolved, and his customer satisfaction score (CSAT) is high."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s5",
          "eyebrow": null,
          "duration": null,
          "title": "Insights",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Use case 3"
            },
            {
              "type": "p",
              "text": "Gaining valuable insights into customer behavior"
            },
            {
              "type": "p",
              "text": "Martha Rivera, a planner at AnyAuthority Retail, is aware of the increase in urgent calls waiting in the product return queue. Martha needs to understand the reason why customers are calling. She needs convenient access to a view of the top customer issues across thousands of contacts over the past 3 hours."
            },
            {
              "type": "p",
              "text": "Martha provides her feedback to her manager, Richard Roe."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Contact Lens solution for use case 3"
            },
            {
              "type": "p",
              "text": "By using theme detection, Richard saves the time required to search and evaluate all calls within the past 3 hours in the product return queue."
            },
            {
              "type": "p",
              "text": "He generates a theme report and shares the results with Martha. Martha reviews the results and notices the top theme is complaints about a newly released, top-selling basketball. She discovers the manufacturer is shipping the basketballs, but they arrive deflated. She escalates the issue and resolves it promptly with the manufacturer."
            },
            {
              "type": "p",
              "text": "Theme detection can offer efficient insights into customer interactions. Users can discover previously unknown or emerging themes from thousands of customer interactions. After the information is surfaced, organizations can take appropriate actions to improve the customer experience by expediting issue resolution."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s6",
          "eyebrow": null,
          "duration": null,
          "title": "Regulatory compliance",
          "blocks": [
            {
              "type": "h",
              "level": 4,
              "text": "Use case 4"
            },
            {
              "type": "p",
              "text": "Ensuring regulatory compliance"
            },
            {
              "type": "p",
              "text": "Nikki Wolf, a supervisor at AnyAuthority Retail, notices that several agents have poor CSAT scores because they are not sharing return policies during calls. Nikki is aware that not providing return policy information can lead to disappointed customers and potential lawsuits."
            },
            {
              "type": "p",
              "text": "Nikki tasks Efua Owusu, the Amazon Connect quality analyst, to find a solution."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Contact Lens solution for use case 4"
            },
            {
              "type": "p",
              "text": "To solve the problem, Efua creates and uses a Contact Lens rule. The rule adds a Missed return policy category. If the agent does not provide the return information during the conversation, the category is associated with the contact interaction. When a customer calls into the contact center, Efua's new rule automatically categorizes calls to ensure that agents comply with regulatory standards."
            },
            {
              "type": "p",
              "text": "Through this process, the system categorizes calls using the exact matching of words from the return policy. Contact interactions that have the Missed return policy category associated are identified efficiently."
            },
            {
              "type": "p",
              "text": "Nikki can now identify agents who need training or guidance to increase CSAT scores and improve the customer experience."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s7",
          "eyebrow": null,
          "duration": null,
          "title": "Using Contact Lens",
          "blocks": [
            {
              "type": "p",
              "text": "There are two steps to enable Contact Lens in your contact center. First, the infrastructure administrator must enable the feature in the Amazon Connect instance."
            },
            {
              "type": "p",
              "text": "After the feature is enabled, you can use Amazon Connect flows to add the functionality for the contacts you want to analyze conversations for. The Set recording and analytics behavior flow block is used to enable Contact Lens for the current contact. For more information, navigate to Create Amazon Connect Flows."
            },
            {
              "type": "p",
              "text": "To learn more about enabling Contact Lens in your contact center, choose the START or arrow buttons to display each of the four steps."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Introduction"
            },
            {
              "type": "p",
              "text": "After the cloud administrator enables the Amazon Connect feature, you can use Amazon Connect flows to activate conversational analytics."
            },
            {
              "type": "p",
              "text": "Use the Set recording and analytics behavior flow block to enable Contact Lens for the current contact."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s8",
          "eyebrow": null,
          "duration": null,
          "title": "Use the flow block",
          "blocks": [
            {
              "type": "p",
              "text": "In the flow designer, choose the Set recording and analytics behavior flow block, and drag it onto the flow designer canvas."
            },
            {
              "type": "p",
              "text": "You can position the flow block at the beginning of your flow or later in the flow."
            },
            {
              "type": "p",
              "text": "This positioning gives control over when to perform conversational analytics based on identifying types of contacts and business criteria."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s9",
          "eyebrow": null,
          "duration": null,
          "title": "Enable call recording",
          "blocks": [
            {
              "type": "p",
              "text": "Speech analysis for voice calls can be performed only if the call recording is enabled."
            },
            {
              "type": "p",
              "text": "For Call recording, choose On, and specify if you want only one or both sides of the conversation recorded."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s10",
          "eyebrow": null,
          "duration": null,
          "title": "Enable speech analytics",
          "blocks": [
            {
              "type": "p",
              "text": "After you enable call recording, Enable speech analytics becomes available. Select this option if you want conversational analytics for your conversations."
            },
            {
              "type": "p",
              "text": "Choose Post-call analytics if you only need data as the conversations are still in progress. With this option, conversations will be analyzed after the contact is complete."
            },
            {
              "type": "p",
              "text": "Choose Real-time and post-call analytics if you want real-time alerts. This option is also needed if you require automatic agent assistance in the agent application."
            },
            {
              "type": "p",
              "text": "Enabling chat analytics does not require the call recording option and can be selected at any time."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-s11",
          "eyebrow": null,
          "duration": null,
          "title": "Contact Lens generative AI summarization",
          "blocks": [
            {
              "type": "p",
              "text": "To optimize supervisor and data analyst processes, you can create a conversation summary by selecting the Post-contact summary option."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Summary"
            },
            {
              "type": "p",
              "text": "You can enable conversational analytics by configuring the Set recording and analytics behavior flow block in your flows. This gives you the flexibility to analyze the conversations you need to focus on for your business."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to Contact Lens use cases. In the next lesson, you will explore key considerations for Contact Lens. Use the flow block In the flow designer, choose the Set recording and analytics behavior flow block, and drag it onto the flow designer canvas. You can position the flow block at the beginning of your flow or later in the flow. This positioning gives control over when to perform conversational analytics based on identifying types of contacts and business criteria. Enable call recording Speech analysis for voice calls can be performed only if the call recording is enabled. For Call recording, choose On, and specify if you want only one or both sides of the conversation recorded. Enable speech analytics After you enable call recording, Enable speech analytics becomes available. Select this option if you want conversational analytics for your conversations. Choose Post-call analytics if you only need data as the conversations are still in progress. With this option, conversations will be analyzed after the contact is complete. Choose Real-time and post-call analytics if you want real-time alerts. This option is also needed if you require automatic agent assistance in the agent application. Enabling chat analytics does not require the call recording option and can be selected at any time. Contact Lens generative AI summarization To optimize supervisor and data analyst processes, you can create a conversation summary by selecting the Post-contact summary option. Summary You can enable conversational analytics by configuring the Set recording and analytics behavior flow block in your flows. This gives you the flexibility to analyze the conversations you need to focus on for your business. Lesson 5 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-contact-lens-fundamentals-t3-q1",
          "question": "A supervisor notices an increase in average handle time (AHT) for contact center agents over the past week. Which solution can Amazon Connect Contact Lens provide to help improve agent performance?",
          "options": [
            {
              "id": "A",
              "text": "Contact Lens can suggest that there is a need to hire more agents to handle the increased call volume."
            },
            {
              "id": "B",
              "text": "Contact Lens can provide sentiment analysis to identify dissatisfied customers."
            },
            {
              "id": "C",
              "text": "Contact Lens can provide rules to identify long non-talk times to help investigate the root cause of an issue."
            },
            {
              "id": "D",
              "text": "Contact Lens can generate a theme report to identify the top customer issues."
            }
          ],
          "correctOptionId": "C",
          "rationale": "Long non-talk times can be a cause of longer than usual AHT. Setting up a Contact Lens rule for non-talk time that is higher than the AHT helps identify contacts with a long duration of non-talk time. Supervisors can then look into the root cause of the issue."
        },
        {
          "id": "connect-contact-lens-fundamentals-t3-q2",
          "question": "An Amazon Connect quality analyst wants to identify agents who are not sharing return policies during calls. Which steps should the quality analyst take? (Select TWO.) (Select all that apply: Ask an experience designer to enable call recording and speech analytics in the Amazon Connect flow. / Enable personally identifiable information (PII) redaction in the Amazon Connect flow. / Create an Amazon Connect Contact Lens rule to categorize calls based on return policy keywords. / Run a report to identify the agents who have shorter calls. / Verify which agents took the regulatory compliance training.)",
          "options": [],
          "answer": "Ask an experience designer to enable call recording and speech analytics in the Amazon Connect flow.; Create an Amazon Connect Contact Lens rule to categorize calls based on return policy keywords.. First, Contact Lens must be enabled. For Call recording, choose On, and then select Enable speech analytics."
        }
      ]
    },
    {
      "id": "connect-contact-lens-fundamentals-t4",
      "number": 4,
      "title": "Considerations",
      "shortTitle": "Considerations",
      "summary": "As you've learned, Contact Lens is a powerful tool that provides real-time analysis and insights into conversations. With Contact Lens, you can…",
      "duration": "~4 min",
      "lede": null,
      "objectives": [
        "Identify the Amazon Connect security permissions for Contact Lens.",
        "Recognize service quotas for Contact Lens.",
        "Explore pricing for Contact Lens."
      ],
      "sections": [
        {
          "id": "connect-contact-lens-fundamentals-t4-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Lesson introduction",
          "blocks": [
            {
              "type": "p",
              "text": "As you've learned, Contact Lens is a powerful tool that provides real-time analysis and insights into conversations. With Contact Lens, you can optimize agent performance, improve customer experience, and drive operational efficiency."
            },
            {
              "type": "p",
              "text": "In this section, you will explore the security setting, service quotas, and pricing for Contact Lens."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t4-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Security",
          "blocks": [
            {
              "type": "p",
              "text": "Security is a crucial aspect of Amazon Connect, especially when dealing with customer interactions that might involve sensitive information and personal data. One way to manage access control is through security profiles."
            },
            {
              "type": "p",
              "text": "With security profiles, you can define the permissions and access levels for different groups of users in your Amazon Connect instance. Before you dive into the specific security settings for Contact Lens, you need to understand what security profiles are and why they're important."
            },
            {
              "type": "p",
              "text": "The security profile settings specific to Contact Lens are grouped under the Analytics and Optimization section. These permissions determine who can access and interact with the data and insights generated by Contact Lens. For more information, navigate to Analytics and Optimization in the Amazon Connect Administrator Guide."
            },
            {
              "type": "p",
              "text": "The following are the relevant security profile settings for Contact Lens."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Search contacts by keywords",
                  "body": "This permission makes it possible for users to search contacts on the Contact search page by specific words or phrases used during the conversation."
                },
                {
                  "title": "Contact search",
                  "body": "This permission grants users access to the Contact search page, where they can search for specific interactions. Users can review the analyzed recordings and transcripts, perform full-text searches on call transcripts, and filter by sentiment scores and non-talk time."
                },
                {
                  "title": "View my contacts",
                  "body": "This permission grants users access to the Contact search page, but they can only review the contacts (interactions) they personally handled. They can review the analyzed recordings and transcripts for those specific contacts."
                },
                {
                  "title": "Contact Lens - conversational analytics",
                  "body": "This permission makes it possible for users to view graphs summarizing conversational analytics (such as customer sentiment talk time for voice contacts). Users can also view sentiment evaluation and indicators for each conversation transcript and recording."
                },
                {
                  "title": "Rules",
                  "body": "This permission makes it possible for users to view, edit, or create rules for categorizing contacts based on keywords and phrases used during a conversation."
                },
                {
                  "title": "Recorded conversations (redacted)",
                  "body": "With this permission, users can listen to call recordings or view chat transcripts with sensitive data removed (redacted)."
                },
                {
                  "title": "Recorded conversations (unredacted)",
                  "body": "This permission grants users access to unredacted content, including original, unredacted chat and speech transcripts. This permission also grants users access to transcripts analyzed by Contact Lens and original, unredacted audio recordings on the Contact details and Contact search pages."
                }
              ]
            },
            {
              "type": "p",
              "text": "By carefully configuring these security profile permissions, you can control who in your organization has access to the insights provided by Contact Lens. Applying these permissions ensures that sensitive data is properly protected and accessible only to authorized individuals."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t4-s3",
          "eyebrow": null,
          "duration": null,
          "title": "Service quotas",
          "blocks": [
            {
              "type": "p",
              "text": "When you create an Amazon Connect instance, it comes with limits called service quotas. These quotas are enforced to prevent resources from being overutilized or exhausted, ensuring the reliability and performance of the service."
            },
            {
              "type": "p",
              "text": "Service quotas are predefined limits on the resources or operations that can be performed in a service. These limits help prevent accidental overprovisioning of resources, which can lead to unexpected charges or performance issues. Service quotas are designed to protect both the service and your workloads from potential disruptions caused by resource exhaustion."
            },
            {
              "type": "p",
              "text": "Contact Lens has the following service quotas."
            },
            {
              "type": "cards",
              "items": [
                {
                  "title": "Concurrent real-time calls with analytics",
                  "body": "This quota determines the maximum number of concurrent voice calls that can have real-time analytics enabled. The default quota is 50, except in the US East (N. Virginia) Region, where it is 100."
                },
                {
                  "title": "Concurrent post-call analytics jobs",
                  "body": "This quota determines the maximum number of post-call analytics jobs that can run concurrently. The default quota is 200, and it should be derived from your overall Amazon Connect call volume."
                },
                {
                  "title": "Concurrent chat analytics jobs",
                  "body": "This quota determines the maximum number of chat analytics jobs that can run concurrently. The default quota is 200."
                },
                {
                  "title": "Concurrent post-contact summary jobs",
                  "body": "This quota determines the maximum number of post-contact summary jobs (shared between voice, chat, and other channels) that can run concurrently. The default quota is 10."
                }
              ]
            },
            {
              "type": "p",
              "text": "You can set up Amazon CloudWatch metrics to monitor usage. Depending on your business use case, you can submit service limit increase requests."
            },
            {
              "type": "p",
              "text": "By understanding and managing the service quotas for Contact Lens. You can ensure that your contact center has the necessary resources to handle real-time and post-call analytics effectively without resource exhaustion or potential disruptions."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t4-s4",
          "eyebrow": null,
          "duration": null,
          "title": "Pricing",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens offers separate pay-as-you-go pricing for conversational analytics, performance evaluation, and screen recording."
            },
            {
              "type": "p",
              "text": "For more information about the pay-as-you-go pricing model and pricing examples, navigate to Amazon Connect Pricing."
            },
            {
              "type": "callout",
              "variant": "note",
              "title": "What's next",
              "body": [
                "In this lesson, you have been introduced to security considerations, service quotas, and pricing for Contact Lens. Continue to the next lesson to review the course summary and prepare for the end-of-course assessment. Lesson 6 of 9"
              ]
            }
          ]
        }
      ],
      "reviewQuestions": [
        {
          "id": "connect-contact-lens-fundamentals-t4-q1",
          "question": "A company wants to ensure that only authorized individuals can access customer interactions with sensitive data in Amazon Connect Contact Lens. Which security profile setting should the company configure?",
          "options": [
            {
              "id": "A",
              "text": "Search contacts by keywords"
            },
            {
              "id": "B",
              "text": "Contact search"
            },
            {
              "id": "C",
              "text": "View my contacts"
            },
            {
              "id": "D",
              "text": "Recorded conversations (unredacted)"
            }
          ],
          "correctOptionId": "D",
          "rationale": "The recorded conversations (unredacted) permission grants users access to unredacted content, including original, unredacted chat and speech transcripts. This permission also grants users access to transcripts analyzed by Contact Lens and original, unredacted audio recordings on the Contact details and Contact search pages."
        },
        {
          "id": "connect-contact-lens-fundamentals-t4-q2",
          "question": "A contact center analyst wants to ensure that their Amazon Connect instance can handle analytics jobs without resource exhaustion. Which service quota should they monitor and potentially request an increase for?",
          "options": [
            {
              "id": "A",
              "text": "Concurrent real-time calls with analytics"
            },
            {
              "id": "B",
              "text": "Concurrent post-call analytics jobs"
            },
            {
              "id": "C",
              "text": "Concurrent chat analytics jobs"
            },
            {
              "id": "D",
              "text": "Concurrent post-contact summary jobs"
            }
          ],
          "correctOptionId": "B",
          "rationale": "The concurrent post-call analytics jobs quota determines the maximum number of post-call analytics jobs that can run concurrently. This is important for handling the expected volume of post-call analytics."
        },
        {
          "id": "connect-contact-lens-fundamentals-t4-q3",
          "question": "A company is evaluating the costs of implementing Amazon Connect Contact Lens for their contact center. Which pricing model does Contact Lens follow for capabilities like conversational analytics and performance evaluation?",
          "options": [
            {
              "id": "A",
              "text": "Pay as you go"
            },
            {
              "id": "B",
              "text": "Flat monthly fee"
            },
            {
              "id": "C",
              "text": "Annual subscription"
            },
            {
              "id": "D",
              "text": "License based"
            }
          ],
          "correctOptionId": "A",
          "rationale": "Contact Lens follows a pay-as-you-go pricing model for its capabilities like conversational analytics and performance evaluation."
        }
      ]
    },
    {
      "id": "connect-contact-lens-fundamentals-t5",
      "number": 5,
      "title": "Summary",
      "shortTitle": "Summary",
      "summary": "In this course, you learned about Contact Lens analytics and conversational insights. Take a moment to review these key learnings in the course…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-contact-lens-fundamentals-t5-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Course summary",
          "blocks": [
            {
              "type": "p",
              "text": "In this course, you learned about Contact Lens analytics and conversational insights. Take a moment to review these key learnings in the course summary before taking the course assessment."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Benefits"
            },
            {
              "type": "p",
              "text": "Contact Lens enhances operational efficiency by automating processes like transcription, sentiment analysis, and data redaction. This reduces manual effort and streamlines operations."
            },
            {
              "type": "p",
              "text": "Contact Lens helps improve agent performance through real-time coaching and insights into customer behavior."
            },
            {
              "type": "p",
              "text": "Organizations gain valuable insights into customer sentiments, common issues, and conversation themes. These insights guide process improvements, product updates, and agent training."
            },
            {
              "type": "p",
              "text": "Additionally, Contact Lens ensures regulatory compliance by automatically redacting sensitive data from transcripts and recordings."
            },
            {
              "type": "h",
              "level": 4,
              "text": "Feature highlights"
            },
            {
              "type": "p",
              "text": "Rules: Rules allow automatic categorizing based on specific criteria. Rules can match words, synonyms, patterns, and sentiment scores. Actions include sending alerts or creating follow-up tasks."
            },
            {
              "type": "p",
              "text": "Categories: Categories are labels assigned to conversations based on criteria like keywords, sentiment, interruptions, or non-talk time. Categories help organize and analyze interactions effectively."
            },
            {
              "type": "p",
              "text": "Sensitive data redaction: This feature automatically removes or masks sensitive information, like names, addresses, and credit card numbers, from transcripts and recordings. It safeguards privacy and ensures compliance."
            },
            {
              "type": "p",
              "text": "Theme detection: Theme detection automatically discovers common topics or reasons for customer contacts. It groups similar interactions into themes based on words and phrases used. This reveals emerging trends or issues driving high contact volumes."
            },
            {
              "type": "p",
              "text": "Post-contact summary: Contact Lens uses generative AI to create structured summaries of conversations. These summaries capture key details, like issues discussed, actions taken, and outcomes. Summaries save time for agents and help supervisors review interactions efficiently."
            },
            {
              "type": "callout",
              "variant": "warning",
              "title": "Considerations",
              "body": [
                "Security: Security profiles control permissions and access levels for different user groups in an Amazon Connect instance. Specific settings manage access to Contact Lens data insights, and features such as search, rules, and redacted or unredacted content.",
                "Service quotas: Contact Lens has service quotas limiting resources and operations. Key quotas include concurrent real-time calls with analytics, concurrent post-call analytics jobs, concurrent chat analytics jobs, and concurrent post-contact summary jobs.",
                "Pricing: Contact Lens uses a pay-as-you-go pricing model for conversational analytics and performance evaluation. Pricing details are available on the Amazon Connect Pricing webpage."
              ]
            }
          ]
        }
      ],
      "reviewQuestions": []
    },
    {
      "id": "connect-contact-lens-fundamentals-t6",
      "number": 6,
      "title": "Course summary",
      "shortTitle": "Course summary",
      "summary": "Contact Lens enhances operational efficiency by automating processes like transcription, sentiment analysis, and data redaction. This reduces…",
      "duration": "~2 min",
      "lede": null,
      "objectives": [],
      "sections": [
        {
          "id": "connect-contact-lens-fundamentals-t6-s1",
          "eyebrow": null,
          "duration": null,
          "title": "Amazon Connect Contact Lens benefits",
          "blocks": [
            {
              "type": "p",
              "text": "Contact Lens enhances operational efficiency by automating processes like transcription, sentiment analysis, and data redaction. This reduces manual effort and streamlines operations."
            },
            {
              "type": "p",
              "text": "Contact Lens helps improve agent performance through real-time coaching and insights into customer behavior."
            },
            {
              "type": "ul",
              "items": [
                "Organizations gain valuable insights into customer sentiments, common issues, and conversation themes.",
                "These insights guide process improvements, product updates, and agent training."
              ]
            },
            {
              "type": "p",
              "text": "Additionally, Contact Lens ensures regulatory compliance by automatically redacting sensitive data from transcripts and recordings."
            }
          ]
        },
        {
          "id": "connect-contact-lens-fundamentals-t6-s2",
          "eyebrow": null,
          "duration": null,
          "title": "Feature highlights",
          "blocks": [
            {
              "type": "p",
              "text": "Rules: Rules allow automatic categorizing based on specific criteria. Rules can match words, synonyms, patterns, and sentiment scores. Actions include sending alerts or creating follow-up tasks."
            },
            {
              "type": "p",
              "text": "Categories: Categories are labels assigned to conversations based on criteria like keywords, sentiment, interruptions, or non-talk time. Categories help organize and analyze interactions effectively."
            },
            {
              "type": "p",
              "text": "Sensitive data redaction: This feature automatically removes or masks sensitive information, like names, addresses, and credit card numbers, from transcripts and recordings. It safeguards privacy and ensures compliance."
            },
            {
              "type": "p",
              "text": "Theme detection: Theme detection automatically discovers common topics or reasons for customer contacts. It groups similar interactions into themes based on words and phrases used. This reveals emerging trends or issues driving high contact volumes."
            },
            {
              "type": "p",
              "text": "Post-call summary: Contact Lens uses generative AI to create structured summaries of conversations. These summaries capture key details, like issues discussed, actions taken, and outcomes. Summaries save time for agents and help supervisors review interactions efficiently."
            },
            {
              "type": "callout",
              "variant": "warning",
              "title": "Considerations",
              "body": [
                "Security: Security profiles control permissions and access levels for different user groups within an Amazon Connect instance. Specific settings manage access to Contact Lens data, insights, and features like search, rules, and redacted or unredacted content.",
                "Service quotas: Amazon Connect Contact Lens has service quotas limiting resources and operations. Key quotas include concurrent real-time calls with analytics, post-call analytics jobs, chat analytics jobs, and post-contact summary jobs.",
                "Pricing: Contact Lens uses a pay-as-you-go pricing model for conversational analytics and performance evaluation. Pricing details are available on the Amazon Connect pricing webpage."
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
