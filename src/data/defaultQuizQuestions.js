export const defaultQuestions = [
{n:1,section:"Data Preparation",difficulty:"M",multi:true,multiCount:2,
q:`A Generative AI Engineer has created a RAG application to look up answers to questions about a series of fantasy novels. The fantasy novel texts are chunked and embedded into a vector store with metadata, retrieved with the user's query, and provided to an LLM for response generation. The engineer used their intuition to pick the chunking strategy and now wants to more methodically choose the best values.\n\nWhich TWO strategies should the Generative AI Engineer take to optimize their chunking strategy and parameters?`,
options:["Change embedding models and compare performance.","Add a classifier for user queries that predicts which book will best contain the answer. Use this to filter retrieval.","Choose an appropriate evaluation metric (such as recall or NDCG) and experiment with changes in the chunking strategy, such as splitting chunks by paragraphs or chapters. Choose the strategy that gives the best performance metric.","Pass known questions and best answers to an LLM and instruct the LLM to provide the best token count. Use a summary statistic of the best token counts to choose chunk size.","Create an LLM-as-a-judge metric to evaluate how well previous questions are answered by the most appropriate chunk. Optimize the chunking parameters based upon the values of the metric."],
answer:[2,4],explanation:"Options 3 and 5 are correct. Using evaluation metrics like recall or NDCG (Option 3) provides a systematic, data-driven approach. Using LLM-as-a-judge (Option 5) leverages LLM capabilities to assess content relevance for optimization."},

{n:2,section:"Assembling & Deploying",difficulty:"M",
q:`A Generative AI Engineer is designing a RAG application for answering user questions on technical regulations as they learn a new sport.\nWhat are the steps needed to build this RAG application and deploy it?`,
options:["Ingest documents → Index and save to Vector Search → User submits queries → LLM retrieves documents → Evaluate model → LLM generates response → Deploy via Model Serving","Ingest documents → Index and save to Vector Search → User submits queries → LLM retrieves documents → LLM generates response → Evaluate model → Deploy via Model Serving","Ingest documents → Index and save to Vector Search → Evaluate model → Deploy via Model Serving","User submits queries → Ingest documents → Index and save to Vector Search → LLM retrieves documents → LLM generates response → Evaluate model → Deploy via Model Serving"],
answer:[1],explanation:"Option 2 is correct. The logical sequence is: ingest, index, query, retrieve, generate, evaluate, then deploy. Evaluation should come after response generation to assess real performance."},

{n:3,section:"Evaluation & Monitoring",difficulty:"E",
q:`A Generative AI Engineer just deployed an LLM application at a digital marketing company that assists with answering customer service inquiries.\nWhich metric should they monitor for their customer service LLM application in production?`,
options:["Number of customer inquiries processed per unit of time","Energy usage per query","Final perplexity scores for the training of the model","HuggingFace Leaderboard values for the base LLM"],
answer:[0],explanation:"Number of customer inquiries processed per unit of time directly measures the application's efficiency and throughput in production."},

{n:4,section:"Design Applications",difficulty:"M",
q:`A Generative AI Engineer is building a system that suggests the best matched employee team member to newly scoped projects. The match should be based upon project date availability and how well their employee profile matches the project scope. Both the employee profile and project scope are unstructured text.\n\nHow should the system be architected?`,
options:["Create a tool for finding available team members. Embed all project scopes into a vector store, perform retrieval using team member profiles to find the best match.","Create a tool for finding team member availability, and another tool that uses an LLM to extract keywords from project scopes. Iterate through available team members' profiles and perform keyword matching.","Create a tool to find available team members. Create a second tool that calculates a similarity score for a combination of team member profile and project scope. Iterate through and rank by score.","Create a tool for finding available team members. Embed team profiles into a vector store and use the project scope and filtering to perform retrieval to find the best matched team members."],
answer:[3],explanation:"Option 4 is correct. Embedding team profiles into a vector store allows efficient semantic matching with project scopes, combined with availability filtering."},

{n:5,section:"Assembling & Deploying",difficulty:"M",
q:`A Generative AI Engineer is designing an LLM-powered live sports commentary platform. The platform provides real-time updates and LLM-generated analyses.\n\nWhich tool will give the platform access to real-time data for generating game analyses based on the latest game scores?`,
options:["DatabricksIQ","Foundation Model APIs","Feature Serving","AutoML"],
answer:[2],explanation:"Feature Serving provides real-time access to the latest data, such as game scores, which can feed live sports commentary and analyses."},

{n:6,section:"Evaluation & Monitoring",difficulty:"M",
q:`A Generative AI Engineer has a provisioned throughput model serving endpoint as part of a RAG application and would like to monitor the serving endpoint's incoming requests and outgoing responses. The current approach is to include a micro-service in between the endpoint and the UI to write logs.\n\nWhich Databricks feature should they use instead?`,
options:["Vector Search","Lakeview","DBSQL","Inference Tables"],
answer:[3],explanation:"Inference Tables in Databricks allow monitoring and logging of incoming requests and outgoing responses for model serving endpoints without needing an external microservice."},

{n:7,section:"Governance",difficulty:"M",
q:`A Generative AI Engineer is tasked with improving the RAG quality by addressing its inflammatory outputs.\nWhich action would be most effective in mitigating the problem of offensive text outputs?`,
options:["Increase the frequency of upstream data updates","Inform the user of the expected RAG behavior","Restrict access to the data sources to a limited number of users","Curate upstream data properly that includes manual review before it is fed into the RAG system"],
answer:[3],explanation:"Proper curation of upstream data with manual review ensures harmful content is prevented from entering the RAG system, addressing the root cause."},

{n:8,section:"Application Development",difficulty:"E",
q:`A Generative AI Engineer is creating an LLM-based application. The documents have been chunked to a maximum of 512 tokens each. Cost and latency are more important than quality.\n\nWhich context length option will fulfill their need?`,
options:["Context length 514; smallest model is 0.44GB and embedding dimension 768","Context length 2048; smallest model is 11GB and embedding dimension 2560","Context length 32768; smallest model is 14GB and embedding dimension 4096","Context length 512; smallest model is 0.13GB and embedding dimension 384"],
answer:[3],explanation:"Option 4 matches the chunk size (512), has the smallest model (0.13GB) and lowest embedding dimension (384), ensuring minimal cost and latency."},

{n:9,section:"Application Development",difficulty:"M",
q:`A small and cost-conscious startup in cancer research wants to build a RAG application using Foundation Model APIs.\nWhich strategy would allow them to build a good-quality RAG application while being cost-conscious?`,
options:["Limit the number of relevant documents available for retrieval","Pick a smaller LLM that is domain-specific","Limit the number of queries a customer can send per day","Use the largest LLM possible because that gives the best performance"],
answer:[1],explanation:"A smaller, domain-specific LLM balances cost and performance effectively. It's optimized for the specific domain while being cost-effective to run."},

{n:10,section:"Data Preparation",difficulty:"M",multi:true,multiCount:2,
q:`A Generative AI Engineer is developing a chatbot for an internal HelpDesk. They have several candidate data sources:\n\n• call_rep_history: tracks representative call duration and start time\n• transcript Volume: recordings as .wav files and text transcripts as .txt files\n• call_cust_history: tracks customer service usage for chargeback\n• call_detail: includes root_cause and resolution fields (updated hourly)\n• maintenance_schedule: lists outages and planned downtimes\n\nWhich TWO sources best identify ticket root cause and resolution?`,
options:["call_cust_history","maintenance_schedule","call_rep_history","call_detail","transcript Volume"],
answer:[3,4],explanation:"call_detail contains root_cause and resolution fields directly relevant to ticket resolution. transcript Volume provides detailed call information that can be analyzed for root cause insights."},

{n:11,section:"Application Development",difficulty:"M",
q:`What is the most suitable library for building a multi-step LLM-based workflow?`,
options:["Pandas","TensorFlow","PySpark","LangChain"],
answer:[3],explanation:"LangChain is specifically designed for building multi-step workflows with LLMs, providing utilities for prompt chaining, memory handling, and API integration."},

{n:12,section:"Governance",difficulty:"M",
q:`When developing an LLM application, it's crucial to ensure data compliance with licensing requirements. Which action is NOT appropriate to avoid legal risks?`,
options:["Reach out to the data curators directly before you have started using the trained model to let them know.","Use any available data you personally created which is completely original and you can decide what license to use.","Only use data explicitly labeled with an open license and ensure the license terms are followed.","Reach out to the data curators directly after you have started using the trained model to let them know."],
answer:[1],explanation:"Even personally created original data may be subject to contractual obligations, privacy laws, or other constraints. Assuming full licensing control without checking is not appropriate."},

{n:13,section:"Application Development",difficulty:"M",
q:`A Generative AI Engineer is testing a simple prompt template in LangChain using the code below but is getting an error:\n\nfrom langchain.chains import LLMChain\nfrom langchain_community.llms import OpenAI\nfrom langchain_core.prompts import PromptTemplate\n\nprompt_template = "Tell me a {adjective} joke"\nprompt = PromptTemplate(input_variables=["adjective"], template=prompt_template)\nllm = LLMChain(prompt=prompt)\nllm.generate([{"adjective": "funny"}])\n\nAssuming the API key was properly defined, what change is needed to fix the chain?`,
options:['Change llm.generate([{"adjective": "funny"}]) to llm.generate("funny")',"Format the prompt before passing: LLMChain(prompt=prompt.format(\"funny\"))","Initialize OpenAI() first: llm=OpenAI(), then LLMChain(prompt=prompt, llm=llm)","Pass llm inline: LLMChain(llm=OpenAI(), prompt=prompt)"],
answer:[2],explanation:"The LLMChain requires both a prompt and an LLM. The original code was missing the OpenAI LLM instance. Option 3 properly initializes it and passes it to the chain."},

{n:14,section:"Application Development",difficulty:"M",
q:`A Generative AI Engineer is creating an LLM system that retrieves news articles from 1918 and summarizes them. The summaries are good but often include an explanation of how the summary was generated.\n\nWhich change could mitigate this issue?`,
options:["Split the LLM output by newline characters to truncate the explanation.","Tune the chunk size of news articles or experiment with different embedding models.","Revisit document ingestion logic to ensure proper ingestion.","Provide few-shot examples of desired output format to the system and/or user prompt."],
answer:[3],explanation:"Few-shot examples effectively guide the LLM to understand the expected output format—summaries only, without explanations—through demonstration."},

{n:15,section:"Governance",difficulty:"M",
q:`A Generative AI Engineer has developed an LLM application to answer questions about internal company policies. They must ensure no hallucination or confidential data leakage.\n\nWhich approach should NOT be used to mitigate these issues?`,
options:["Add guardrails to filter outputs before showing to the user","Fine-tune the model on your data, hoping it will learn what is appropriate","Limit the data available based on the user's access level","Use a strong system prompt to ensure the model aligns with your needs"],
answer:[1],explanation:"Fine-tuning alone is insufficient to prevent hallucinations or data leakage. It may even exacerbate problems without rigorous external safeguards."},

{n:16,section:"Design Applications",difficulty:"M",
q:`An LLM has been trained on customer calls about product availability. It outputs "In Stock" or "Out of Stock".\n\nWhich prompt will allow the engineer to respond to call classification labels correctly?`,
options:['Respond with "In Stock" if the customer asks for a product.','You will be given a customer call transcript. The outputs are either "In Stock" or "Out of Stock". Format the output in JSON, for example: {"call_id": "123", "label": "In Stock"}.','Respond with "Out of Stock" if the customer asks for a product.','You will be given a customer call transcript. Respond with "In Stock" if available or "Out of Stock" if not.'],
answer:[1],explanation:"Option 2 provides structured JSON output format with an example, making it optimal for systematic call classification and downstream processing."},

{n:17,section:"Application Development",difficulty:"I",
q:`A Generative AI Engineer needs a RAG application for a small internal group of experts answering specific questions. Best quality is paramount, and no data can be transmitted to third parties due to regulatory requirements.\n\nWhich model meets all needs?`,
options:["Dolly 1.5B","OpenAI GPT-4","BGE-large","Llama2-70B"],
answer:[3],explanation:"Llama2-70B can be deployed on-premise (no third-party data transmission), provides high-quality responses, and has sufficient capacity for complex questions."},

{n:18,section:"Design Applications",difficulty:"M",
q:`A Generative AI Engineer would like an LLM to generate formatted JSON from emails, extracting: order ID, date, and sender email.\n\nWhich prompt will extract the relevant information with the highest accuracy?`,
options:["You will receive customer emails and need to extract date, sender email, and order ID. Return in JSON format.","You will receive customer emails and need to extract date, sender email, and order ID. Return in JSON format. Here's an example: {\"date\": \"April 16, 2024\", \"sender_email\": \"sarah.lee925@gmail.com\", \"order_id\": \"RE987D\"}","You will receive customer emails and need to extract date, sender email, and order ID. Return in a human-readable format.","You will receive customer emails and need to extract date, sender email, and order ID. Return in JSON format."],
answer:[1],explanation:"Option 2 includes a concrete JSON example that acts as a template, ensuring the LLM follows the exact format for maximum accuracy."},

{n:19,section:"Assembling & Deploying",difficulty:"M",
q:`A Generative AI Engineer has been asked to build an LLM-based question-answering application that should account for frequently published new documents, with least cost and development effort.\n\nWhich combination of chaining components meets these requirements?`,
options:["A prompt, a retriever, and an LLM. The retriever output is inserted into the prompt which is given to the LLM.","The LLM needs to be frequently retrained with the new documents.","Prompt engineering and an LLM are required to generate answers.","A prompt, an agent and a fine-tuned LLM. The agent retrieves relevant content for the prompt."],
answer:[0],explanation:"A simple retriever + prompt + LLM architecture is the most cost-effective. The retriever handles new documents without needing to retrain the LLM."},

{n:20,section:"Design Applications",difficulty:"M",
q:`A Generative AI Engineer is creating an agent-based LLM system for a monster truck team. The system can answer text questions, lookup event dates via API, or query standings tables.\n\nHow should these capabilities be designed into the system?`,
options:["Ingest PDF documents into a vector store and query it in a RAG architecture.","Write a system prompt listing available tools and bundle it into an agent system that runs multiple calls to solve a query.","Instruct the LLM to respond with 'RAG', 'API', or 'TABLE' and use text parsing with conditional statements.","Build a system prompt with all event dates and table info. Use RAG for generic text questions."],
answer:[1],explanation:"An agent-based system with a system prompt listing available tools allows dynamic, intelligent tool selection for varied query types—the most scalable and flexible approach."},

{n:21,section:"Design Applications",difficulty:"M",
q:`A Generative AI Engineer is asked to design an LLM-based application to answer employee HR questions using HR PDF documentation.\n\nWhich set of high-level tasks should the system perform?`,
options:["Calculate averaged embeddings for each HR document, compare to query, pass best document to LLM with large context window.","Use an LLM to summarize HR documentation, then pass summaries with query to LLM.","Create an interaction matrix with ALS factorization, calculate embeddings, use for retrieval, then LLM generation.","Split HR documentation into chunks, embed into vector store, retrieve best matched chunks, use LLM to generate response."],
answer:[3],explanation:"Option 4 uses the standard RAG approach: chunking, vector embedding, semantic retrieval, and LLM generation—efficient, scalable, and contextually accurate."},

{n:22,section:"Application Development",difficulty:"M",
q:`A Generative AI Engineer at an electronics company deployed a RAG application for customer product questions. Feedback shows the RAG often returns information about irrelevant products.\n\nWhat can the engineer do to improve relevance?`,
options:["Assess the quality of the retrieved context","Implement caching for frequently asked questions","Use a different LLM to improve the generated response","Use a different semantic similarity search algorithm"],
answer:[0],explanation:"Assessing the quality of retrieved context is the most comprehensive approach. It directly addresses the root cause—the retrieval is returning irrelevant products."},

{n:23,section:"Governance",difficulty:"M",
q:`A Generative AI Engineer is developing an insurance chatbot that must not answer political questions. It should respond with: "Sorry, I cannot answer that. I am a chatbot that can only answer questions around insurance."\n\nWhich framework type should be implemented?`,
options:["Safety Guardrail","Security Guardrail","Contextual Guardrail","Compliance Guardrail"],
answer:[3],explanation:"A Compliance Guardrail enforces adherence to specific company policies, ensuring the chatbot stays within the defined scope of insurance-related queries."},

{n:24,section:"Assembling & Deploying",difficulty:"M",
q:`A Generative AI Engineer is setting up a vector store with this code:\n\nfrom databricks.vector_search.client import VectorSearchClient\nvsc = VectorSearchClient()\nvsc.create_endpoint(name="vector_search_test", endpoint_type="STANDARD")\n\nAssuming Databricks managed embeddings with the default model, what should be the next logical function call?`,
options:["vsc.get_index()","vsc.create_delta_sync_index()","vsc.create_direct_access_index()","vsc.similarity_search()"],
answer:[1],explanation:"After creating an endpoint, the next step is to create an index. create_delta_sync_index() creates an index optimized for vector search with sync capabilities."},

{n:25,section:"Assembling & Deploying",difficulty:"M",
q:`A Generative AI Engineer is deploying an application with a custom MLflow Pyfunc model.\n\nHow should they configure the endpoint to pass secrets and credentials?`,
options:["Use spark.conf.set()","Pass variables using the Databricks Feature Store API","Add credentials using environment variables","Pass the secrets in plain text"],
answer:[2],explanation:"Environment variables are the most secure and standard method for passing credentials in production deployments, keeping sensitive info separate from code."},

{n:26,section:"Design Applications",difficulty:"M",
q:`A Generative AI Engineer wants to build an LLM solution for a restaurant to improve online booking by automatically handling inquiries, minimizing escalations to humans.\n\nWhich input/output pair will support this goal?`,
options:["Input: Online chat logs; Output: Group chat logs by users and summarize interactions","Input: Online chat logs; Output: Buttons that represent choices for booking details","Input: Customer reviews; Output: Classify review sentiment","Input: Online chat logs; Output: Cancellation options"],
answer:[1],explanation:"Providing booking choice buttons from chat logs creates an interactive, user-friendly experience that minimizes human intervention and guides customers through the booking process."},

{n:27,section:"Application Development",difficulty:"M",
q:`What is an effective method to preprocess prompts using custom code before sending them to an LLM?`,
options:["Directly modify the LLM's internal architecture to include preprocessing steps","It is better not to introduce custom code as the LLM wasn't trained with preprocessed prompts","Rather than preprocessing prompts, postprocess the LLM outputs instead","Write an MLflow PyFunc model that has a separate function to process the prompts"],
answer:[3],explanation:"An MLflow PyFunc model provides a modular wrapper where custom preprocessing logic can be implemented independently of the LLM, maintaining clean separation of concerns."},

{n:28,section:"Governance",difficulty:"M",
q:`A Generative AI Engineer is developing an LLM application for personalized birthday poems based on user names.\n\nWhich technique would be most effective in safeguarding against malicious user inputs?`,
options:["Implement a safety filter that detects harmful inputs and asks the LLM to respond that it is unable to assist","Reduce the time users can interact with the LLM","Ask the LLM to remind the user the input is malicious but continue the conversation","Increase the compute to process input faster"],
answer:[0],explanation:"A safety filter that detects and blocks harmful inputs is the most proactive and effective approach, preventing exploitation while maintaining the application's intended purpose."},

{n:29,section:"Evaluation & Monitoring",difficulty:"M",
q:`Which indicator should be considered to evaluate the safety of LLM outputs when qualitatively assessing responses for a translation use case?`,
options:["The ability to generate responses in code","The similarity to the previous language","The latency of the response and the length of text generated","The accuracy and relevance of the responses"],
answer:[3],explanation:"Accuracy and relevance ensure translations maintain original meaning and context, directly impacting safety and effectiveness of the output."},

{n:30,section:"Application Development",difficulty:"M",
q:`A healthcare chatbot should solicit more information for non-emergencies and direct to emergency services for urgent cases.\n\nGiven user input: "I have been experiencing severe headaches and dizziness for the past two days."\n\nWhich response is most appropriate?`,
options:["Here are a few relevant articles for your browsing. Let me know if you have questions.","Please call your local emergency services.","Headaches can be tough. Hope you feel better soon!","Please provide your age, recent activities, and any other symptoms."],
answer:[1],explanation:"Severe headaches and dizziness over two days indicate a potentially urgent condition. The chatbot should prioritize patient safety by advising immediate emergency contact."},

{n:31,section:"Application Development",difficulty:"M",multi:true,multiCount:2,
q:`After switching from GPT-4 to a model with a shorter context length (4096 tokens), the engineer gets an error: prompt token count (4595) exceeds 4096.\n\nWhat TWO solutions should be implemented without changing the model?`,
options:["Use a smaller embedding model to generate embeddings","Reduce the maximum output tokens of the new model","Decrease the chunk size of embedded documents","Reduce the number of records retrieved from the vector database","Retrain the response generating model using ALiBi"],
answer:[2,3],explanation:"Decreasing chunk size (Option 3) and reducing retrieved records (Option 4) both directly reduce the input token count, keeping it within the model's limit."},

{n:32,section:"Governance",difficulty:"E",
q:`A Generative AI Engineer is building a system to answer questions on latest stock news.\n\nWhich will NOT help with ensuring outputs are relevant to financial news?`,
options:["Implement a comprehensive guardrail framework with finance-sector content filters","Increase compute for greater relevancy analysis","Implement a profanity filter to screen out offensive language","Incorporate manual reviews to correct problematic outputs"],
answer:[2],explanation:"A profanity filter screens offensive language but doesn't contribute to ensuring the relevance of outputs to financial news content."},

{n:33,section:"Data Preparation",difficulty:"M",
q:`A Generative AI Engineer is building a RAG application for SnoPen AI's internal documents. Source documents may contain irrelevant content like ads, sports, or entertainment news.\n\nWhich approach is advisable for filtering irrelevant information?`,
options:["Keep all articles because the RAG needs to understand non-company content to avoid answering about them.","Include in the system prompt that all information is about SnoPen AI, even without data filtering.","Include in the system prompt that the application should not answer questions unrelated to SnoPen AI.","Consolidate all SnoPen AI documents into a single chunk in the vector database."],
answer:[2],explanation:"Explicitly instructing the system to focus only on SnoPen AI questions guides the application to ignore irrelevant content and maintain relevance."},

{n:34,section:"Data Preparation",difficulty:"M",
q:`A Generative AI Engineer has chunked unstructured documents. The dataframe has two columns: (i) original document file name and (ii) an array of text chunks.\n\nWhat is the most performant way to store this for a Vector Search index?`,
options:["Split into train/test sets, create unique identifiers per document, save to Delta table","Flatten the dataframe to one chunk per row, create unique identifier per row, save to Delta table","Create unique identifier per document, then save to Delta table","Store each chunk as an independent JSON file in Unity Catalog Volume"],
answer:[1],explanation:"Flattening to one chunk per row with unique identifiers ensures efficient granular querying and retrieval, optimized for vector search operations."},

{n:35,section:"Evaluation & Monitoring",difficulty:"M",
q:`A Generative AI Engineer has a working RAG prototype with positive feedback. They want to formally evaluate the system and focus improvement efforts.\n\nHow should they evaluate the system?`,
options:["Use cosine similarity to evaluate quality of final generated answers","Curate a dataset to test retrieval and generation components separately. Use MLflow's built-in evaluation metrics.","Benchmark multiple LLMs with the same data and pick the best one","Use an LLM-as-a-judge to evaluate final answer quality"],
answer:[1],explanation:"Testing retrieval and generation components separately with MLflow's metrics provides a structured, comprehensive evaluation that pinpoints specific areas for improvement."},

{n:36,section:"Assembling & Deploying",difficulty:"E",
q:`A Generative AI Engineer has trained an LLM on Databricks and it's ready to be deployed.\n\nWhich process correctly outlines the easiest deployment on Databricks?`,
options:["Log model as pickle, upload to UC Volume, register with MLflow, start serving endpoint","Log model using MLflow during training, register to Unity Catalog using MLflow API, start serving endpoint","Save model with dependencies locally, build Docker image, run container","Wrap prediction function into Flask app and serve using Gunicorn"],
answer:[1],explanation:"Option 2 is the most streamlined: MLflow integration during training → Unity Catalog registration → serving endpoint. All native to Databricks."},

{n:37,section:"Evaluation & Monitoring",difficulty:"E",
q:`A Generative AI Engineer's application uses provisioned throughput Foundation Model API, but request volume is too low for a provisioned throughput endpoint.\n\nWhat strategy ensures best cost-effectiveness?`,
options:["Switch to using External Models instead","Deploy using pay-per-token throughput as it comes with cost guarantees","Change to a model with fewer parameters to reduce hardware constraints","Throttle incoming batch of requests manually to avoid rate limiting"],
answer:[1],explanation:"Pay-per-token throughput ensures you only pay for actual usage, making it the most cost-effective for low-volume requests."},

{n:38,section:"Application Development",difficulty:"M",
q:`A Generative AI Engineer is building an LLM to generate article summaries in the form of a haiku. The initial output doesn't match the desired tone or style.\n\nWhich approach will NOT improve the LLM's response?`,
options:["Provide a prompt that explicitly instructs the desired tone and style","Use a neutralizer to normalize the tone and style of underlying documents","Include few-shot examples in the prompt","Fine-tune the LLM on a dataset of desired tone and style"],
answer:[1],explanation:"A neutralizer normalizes tone/style, which contradicts the goal of achieving a specific creative style. It reduces variation rather than guiding toward the desired output."},

{n:39,section:"Design Applications",difficulty:"M",
q:`A Generative AI Engineer is creating an LLM application needing real-time news articles and stock prices (stored in Delta tables).\n\nHow should the system be architected?`,
options:["Use an LLM to summarize news articles and lookup stock tickers from summaries","Query Delta table for volatile stock prices and use LLM to generate search queries for causes","Download and store news articles and stock prices in a vector store. Use RAG at runtime.","Create an agent with tools for SQL querying of Delta tables and web searching, provide values to an LLM."],
answer:[3],explanation:"An agent with SQL querying and web search tools ensures real-time access to both structured (Delta tables) and unstructured (web news) data sources."},

{n:40,section:"Evaluation & Monitoring",difficulty:"M",
q:`A Generative AI Engineer is designing a chatbot for a gaming company to engage users during online video games.\n\nWhich metric would help increase user engagement and retention?`,
options:["Randomness","Diversity of responses","Lack of relevance","Repetition of responses"],
answer:[1],explanation:"Diversity of responses keeps conversations fresh and interesting, encouraging users to continue interacting, thus increasing engagement and retention."},

{n:41,section:"Assembling & Deploying",difficulty:"M",
q:`A company has a typical RAG-enabled, customer-facing chatbot.\n\nUser Question → 1 → 2 → 3 → 4 → Output\n(with feedback loop from user back to step 3)\n\nSelect the correct sequence of components:`,
options:["1. Embedding model → 2. Vector search → 3. Context-augmented prompt → 4. Response-generating LLM","1. Context-augmented prompt → 2. Vector search → 3. Embedding model → 4. Response-generating LLM","1. Response-generating LLM → 2. Vector search → 3. Context-augmented prompt → 4. Embedding model","1. Response-generating LLM → 2. Context-augmented prompt → 3. Vector search → 4. Embedding model"],
answer:[0],explanation:"The standard RAG flow is: embedding model → vector search → context-augmented prompt → response-generating LLM."},

{n:42,section:"Application Development",difficulty:"M",
q:`A team wants to serve a code generation model as an assistant for software developers. It should support multiple programming languages. Quality is the primary objective.\n\nWhich model would be the best fit?`,
options:["Llama2-70b","BGE-large","MPT-7b","CodeLlama-34B"],
answer:[3],explanation:"CodeLlama-34B is specifically designed and fine-tuned for code generation tasks, making it the best fit for multi-language code assistance with quality as the priority."},

{n:43,section:"Data Preparation",difficulty:"E",
q:`A Generative AI Engineer is building a RAG application using PDF source documents that contain both text and images. They want the least amount of code.\n\nWhich Python package should extract the text?`,
options:["flask","beautifulsoup","unstructured","numpy"],
answer:[2],explanation:"The 'unstructured' package is specifically designed to extract text from various document formats including PDFs with both text and images, requiring minimal code."},

{n:44,section:"Design Applications",difficulty:"M",
q:`A chatbot needs to route user questions to appropriate models. Users might ask about event details or ticket purchasing.\n\nWhat is an ideal workflow?`,
options:["The chatbot should only look at previous event information","There should be two different chatbots for different query types","Implement as a multi-step LLM workflow: identify question type → route to appropriate model (text-to-SQL for events, payment platform for tickets)","The chatbot should only process payments"],
answer:[2],explanation:"A multi-step workflow that identifies query type and routes to the appropriate model/system is the most scalable and efficient approach."},

{n:45,section:"Application Development",difficulty:"M",
q:`A Generative AI Engineer needs an open source foundation LLM with a large context window.\n\nWhich model fits this need?`,
options:["DistilBERT","MPT-30B","Llama2-70B","DBRX"],
answer:[1],explanation:"MPT-30B is designed for long-context processing with a large context window, making it suitable for applications requiring handling of large input data."},

{n:46,section:"Data Preparation",difficulty:"M",multi:true,multiCount:2,
q:`A Generative AI Engineer is loading 150 million embeddings into a vector database that takes a maximum of 100 million.\n\nWhich TWO actions can reduce the record count?`,
options:["Increase the document chunk size","Decrease the overlap between chunks","Decrease the document chunk size","Increase the overlap between chunks","Use a smaller embedding model"],
answer:[0,1],explanation:"Increasing chunk size means fewer chunks (fewer records). Decreasing overlap reduces duplicate/overlapping chunks. Both reduce total record count."},

{n:47,section:"Data Preparation",difficulty:"M",
q:`A GenAI application for selling automotive parts requires account_id and transaction_id. Feedback shows it does well on order/billing but fails on shipping and expected arrival dates.\n\nWhich receiver would improve shipping/arrival answers?`,
options:["Create a vector store with shipping policies and payment terms","Create a feature store table with transaction_id as primary key populated with invoice data and expected delivery date","Provide examples data for fine-tuning the model with updated shipping information","Amend the prompt to add 14 days to the order date as no shipping exceeds 14 days"],
answer:[1],explanation:"A feature store table keyed by transaction_id with delivery data provides real-time, transaction-specific shipping information for accurate answers."},

{n:48,section:"Data Preparation",difficulty:"M",
q:`A Generative AI Engineer is building a RAG application from scanned images (.jpeg/.png) and wants minimal code.\n\nWhich Python package should extract the text?`,
options:["beautifulsoup","scrapy","pytesseract","pyquery"],
answer:[2],explanation:"pytesseract is an OCR (Optical Character Recognition) package specifically designed for extracting text from images like .jpeg and .png files."},

{n:49,section:"Application Development",difficulty:"M",
q:`A Generative AI Engineer wants to update a paragraph-long memo field to a single sentence gist showing intent.\n\nWith which NLP task category should they evaluate potential LLMs?`,
options:["text2text Generation","Sentencizer","Text Classification","Summarization"],
answer:[3],explanation:"Summarization is the NLP task that condenses longer text into shorter versions while preserving the key intent and meaning—exactly what's needed here."},

{n:50,section:"Design Applications",difficulty:"M",
q:`What is the primary goal of designing a prompt that elicits a specifically formatted response?`,
options:["To allow the model to generate random outputs","To ensure structured and predictable model responses","To maximize computation time","To bypass model constraints"],
answer:[1],explanation:"A well-structured prompt ensures that model outputs follow a consistent format, making it easier to parse and use the responses."},

{n:51,section:"Design Applications",difficulty:"M",
q:`Which of the following best describes chain components in a Gen AI pipeline?`,
options:["Individual AI models that function independently","Pre-built APIs for random data retrieval","Modules that transform inputs and pass outputs in a sequence","Static SQL queries"],
answer:[2],explanation:"Chain components define how input moves through different transformations in an AI pipeline, processing data sequentially."},

{n:52,section:"Design Applications",difficulty:"M",
q:`When designing an AI pipeline, how should business use case goals be translated?`,
options:["Directly into SQL queries","Into a description of the desired inputs and outputs for the model","By selecting a random model and testing outputs","By increasing API latency"],
answer:[1],explanation:"Business goals should be mapped to clear inputs and outputs to ensure the AI pipeline aligns with objectives."},

{n:53,section:"Design Applications",difficulty:"M",
q:`Which of the following should be considered when selecting model tasks for a given business requirement?`,
options:["Model name only","Token cost and API latency","The complexity of the model's training data","The model's ability to generate relevant outputs based on task needs"],
answer:[3],explanation:"The model must align with task requirements to produce useful results. Its ability to generate relevant outputs is the key consideration."},

{n:54,section:"Design Applications",difficulty:"M",
q:`What is the purpose of defining tools in a multi-stage reasoning Gen AI application?`,
options:["To reduce inference time","To gather knowledge and take actions across steps","To avoid using a model altogether","To create unnecessary computational steps"],
answer:[1],explanation:"Multi-stage reasoning applications use tools to enhance knowledge retrieval and decision-making across multiple processing steps."},

{n:55,section:"Data Preparation",difficulty:"M",
q:`What is the purpose of chunking in data preparation for Gen AI applications?`,
options:["To reduce the overall number of documents in the dataset","To optimize input length while maintaining contextual relevance","To discard unnecessary documents","To increase token count per prompt"],
answer:[1],explanation:"Chunking helps fit content within model token limits while keeping it meaningful and contextually relevant."},

{n:56,section:"Data Preparation",difficulty:"M",
q:`What is a key consideration when filtering extraneous content in source documents for RAG applications?`,
options:["Reducing hallucinations by removing irrelevant data","Maximizing document size for embedding efficiency","Ignoring text structure in documents","Ensuring all content is included regardless of quality"],
answer:[0],explanation:"Irrelevant data can lead to misleading or incorrect AI responses. Removing it reduces hallucinations."},

{n:57,section:"Data Preparation",difficulty:"M",
q:`Which Python package is best suited for extracting document content from PDFs in a Gen AI pipeline?`,
options:["NumPy","PyMuPDF","Matplotlib","Seaborn"],
answer:[1],explanation:"PyMuPDF is a robust library specifically designed for extracting text from PDF documents."},

{n:58,section:"Data Preparation",difficulty:"M",
q:`What is a best practice when writing chunked text into Delta Lake tables in Unity Catalog?`,
options:["Storing all text in a single row","Using structured formats and metadata to enhance retrieval","Removing text metadata for efficiency","Avoiding partitioning for simplicity"],
answer:[1],explanation:"Metadata helps with indexing and retrieval accuracy, making structured formats essential for effective storage."},

{n:59,section:"Data Preparation",difficulty:"M",
q:`What tool can be used to evaluate retrieval performance in a RAG application?`,
options:["Inference latency monitor","Retrieval quality metrics like MRR (Mean Reciprocal Rank)","Random sampling of documents","Tokenization logs"],
answer:[1],explanation:"MRR (Mean Reciprocal Rank) measures how well a retrieval system ranks relevant documents."},

{n:60,section:"Application Development",difficulty:"M",
q:`Which of the following tools can be used to extract data for retrieval in a Gen AI application?`,
options:["LangChain retrievers","Random document selection","Hardcoded SQL queries","Static JSON files"],
answer:[0],explanation:"LangChain provides efficient retrieval components designed for Gen AI applications."},

{n:61,section:"Application Development",difficulty:"M",
q:`How do different prompt formats affect model output?`,
options:["They do not affect output in any way","They can guide model behavior to produce more relevant responses","They reduce the model's token limit","They cause the model to ignore training data"],
answer:[1],explanation:"Prompt design influences how models interpret and respond to queries, guiding behavior for more relevant outputs."},

{n:62,section:"Application Development",difficulty:"M",
q:`What is a common issue in model responses that should be assessed qualitatively?`,
options:["Token efficiency","Response hallucinations or safety concerns","API cost","Response time variability"],
answer:[1],explanation:"AI-generated content should be evaluated for correctness, reliability, and safety—hallucinations are a key qualitative concern."},

{n:63,section:"Application Development",difficulty:"M",
q:`Why is metaprompting used in Generative AI applications?`,
options:["To make prompts longer","To reduce model reasoning ability","To minimize hallucinations and improve response quality","To increase API cost"],
answer:[2],explanation:"Metaprompts refine AI outputs by structuring input prompts effectively, reducing hallucinations and improving quality."},

{n:64,section:"Application Development",difficulty:"M",
q:`What is an essential step in selecting an embedding model for a RAG application?`,
options:["Ignoring context length","Aligning model selection with document structure and retrieval needs","Prioritizing the cheapest model available","Using any random model from the model hub"],
answer:[1],explanation:"The right embedding model should fit the specific use case, aligned with document structure and retrieval requirements."},

{n:65,section:"Assembling & Deploying",difficulty:"M",
q:`What is the purpose of coding a chain using a pyfunc model with pre- and post-processing?`,
options:["To customize input and output transformations for model inference","To replace the need for model inference","To reduce the number of API calls","To increase the model's complexity unnecessarily"],
answer:[0],explanation:"A pyfunc model allows adding pre-processing (formatting, cleaning) and post-processing (filtering, structuring) around model inference."},

{n:66,section:"Assembling & Deploying",difficulty:"M",
q:`What is the correct sequence for deploying a basic RAG application?`,
options:["Data preparation → Indexing → Model selection → Deployment","Deployment → Model selection → Indexing → Data preparation","Model selection → Indexing → Deployment → Data preparation","Indexing → Deployment → Data preparation → Model selection"],
answer:[0],explanation:"The logical deployment sequence is: prepare data first, then index it, select appropriate models, and finally deploy."},

{n:67,section:"Assembling & Deploying",difficulty:"M",
q:`How can an LLM application be served efficiently?`,
options:["By directly exposing the model API with no restrictions","By leveraging Foundation Model APIs with controlled access","By running the model locally on consumer hardware","By storing responses as static JSON files"],
answer:[1],explanation:"Foundation Model APIs with controlled access provide secure, scalable, and efficient model serving."},

{n:68,section:"Assembling & Deploying",difficulty:"M",
q:`What is the primary function of a Vector Search index in a RAG application?`,
options:["To randomly retrieve documents","To optimize search and retrieval efficiency","To replace embeddings with raw text","To store models"],
answer:[1],explanation:"Vector Search indexes optimize the efficiency of searching and retrieving relevant documents based on semantic similarity."},

{n:69,section:"Assembling & Deploying",difficulty:"M",
q:`What should be done after registering a model in Unity Catalog using MLflow?`,
options:["Skip evaluation and deploy immediately","Monitor model performance with tracking features","Store models in an unstructured format","Use only the default configurations"],
answer:[1],explanation:"After registration, monitoring model performance with tracking features ensures the model behaves as expected before and after deployment."},

{n:70,section:"Governance",difficulty:"M",
q:`What is a key technique for preventing malicious user inputs in a Gen AI application?`,
options:["Prompt filtering and input validation","Allowing all user inputs for flexibility","Disabling all API logging","Increasing token length"],
answer:[0],explanation:"Prompt filtering and input validation are essential for detecting and blocking harmful inputs before they reach the model."},

{n:71,section:"Governance",difficulty:"M",
q:`How can masking techniques be used to meet performance objectives?`,
options:["By removing sensitive data from model inputs and outputs","By increasing token count","By disabling embeddings","By storing responses locally"],
answer:[0],explanation:"Masking removes or replaces sensitive data like PII from inputs and outputs, meeting privacy requirements while maintaining performance."},

{n:72,section:"Governance",difficulty:"M",
q:`Why is it essential to follow licensing requirements for data sources?`,
options:["To avoid legal risks associated with data usage","To increase model performance","To reduce data storage requirements","To improve embedding efficiency"],
answer:[0],explanation:"Following licensing requirements prevents legal risks including copyright infringement and data privacy violations."},

{n:73,section:"Governance",difficulty:"M",
q:`What is a common method to mitigate problematic text in RAG applications?`,
options:["Filtering out inappropriate or biased content","Increasing the number of tokens per request","Disabling logging","Using random sampling"],
answer:[0],explanation:"Filtering out inappropriate or biased content directly addresses the problem of problematic text in RAG outputs."},

{n:74,section:"Governance",difficulty:"M",
q:`What is the primary reason for implementing guardrails in Gen AI applications?`,
options:["To ensure responsible AI usage and prevent harmful outputs","To increase API response time","To reduce cloud storage costs","To remove model interpretability"],
answer:[0],explanation:"Guardrails ensure responsible AI usage by preventing harmful, biased, or inappropriate outputs from reaching users."},

{n:75,section:"Evaluation & Monitoring",difficulty:"M",
q:`What is a key metric to monitor in an LLM deployment scenario?`,
options:["Model accuracy and latency","Cloud storage size","Random response sampling","API request cost only"],
answer:[0],explanation:"Model accuracy and latency are critical metrics that directly reflect the performance and user experience of a deployed LLM."},

{n:76,section:"Evaluation & Monitoring",difficulty:"M",
q:`Why is inference logging important for monitoring a deployed RAG application?`,
options:["To analyze response quality and troubleshoot errors","To increase latency","To store random API responses","To reduce model explainability"],
answer:[0],explanation:"Inference logging enables analysis of response quality, helps troubleshoot errors, and identifies performance issues."},

{n:77,section:"Evaluation & Monitoring",difficulty:"M",
q:`How does MLflow help in evaluating model performance?`,
options:["By tracking metrics and logging experiments","By increasing API rate limits","By restricting model usage","By disabling retrieval functions"],
answer:[0],explanation:"MLflow provides experiment tracking, metric logging, and model comparison capabilities essential for performance evaluation."},

{n:78,section:"Evaluation & Monitoring",difficulty:"M",
q:`How can Databricks features help control LLM costs?`,
options:["By optimizing compute resources and inference settings","By disabling embeddings","By reducing token length randomly","By limiting API access"],
answer:[0],explanation:"Optimizing compute resources and inference settings directly reduces operational costs while maintaining performance."},

{n:79,section:"Evaluation & Monitoring",difficulty:"M",
q:`What is the first step in evaluating an LLM model for a specific use case?`,
options:["Running quantitative and qualitative tests","Deploying without evaluation","Increasing token count","Skipping retrieval analysis"],
answer:[0],explanation:"Running quantitative and qualitative tests provides the foundational assessment of model suitability for a specific use case."},

{n:80,section:"Assembling & Deploying",difficulty:"M",
q:`What is a key factor when controlling access to resources from model serving endpoints?`,
options:["Implementing authentication and authorization controls","Model accuracy","Data size","Embedding context"],
answer:[0],explanation:"Role-based access control (RBAC) and API authentication are essential for securing model serving endpoints."},

{n:81,section:"Assembling & Deploying",difficulty:"M",
q:`How can LangChain be used in coding a simple chain?`,
options:["LangChain does not replace MLflow","It is not limited to data filtering","By defining a sequence of steps that process and retrieve data","Not only used for visualization"],
answer:[2],explanation:"LangChain enables structured processing of AI model inputs/outputs by defining sequential processing steps."},

{n:82,section:"Assembling & Deploying",difficulty:"M",
q:`What are the key elements needed to create a RAG application?`,
options:["Metadata only","File type only","Random components","Model flavor, embedding model, retriever, dependencies, input examples, model signature"],
answer:[3],explanation:"A complete RAG application requires model flavor, embedding model, retriever, dependencies, input examples, and model signature."},

{n:83,section:"Assembling & Deploying",difficulty:"M",
q:`What is required to deploy an endpoint for a basic RAG application?`,
options:["Only embeddings","Registering the model, creating an API, and setting up access","Creating vector embeddings only","Random deployment"],
answer:[1],explanation:"Deploying involves model registration, API hosting, and secure access setup—a complete deployment pipeline."},

{n:84,section:"Governance",difficulty:"M",
q:`How can masking techniques be used in a Gen AI application?`,
options:["To increase storage","To redact sensitive information before generating responses","Masking does not impact anything","To speed up processing"],
answer:[1],explanation:"Masking removes or replaces sensitive data like PII (Personally Identifiable Information) before model processing."},

{n:85,section:"Governance",difficulty:"M",
q:`What is a common guardrail technique to prevent malicious inputs?`,
options:["Input sanitization and validation","Reducing API latency","Encryption alone","Reducing API latency"],
answer:[0],explanation:"Input sanitization filters out harmful queries to prevent prompt injection attacks and other malicious inputs."},

{n:86,section:"Governance",difficulty:"M",
q:`Why is legal compliance important in selecting data sources for a RAG application?`,
options:["Rejecting all third-party data","Using only internal data","Ignoring licenses","To avoid copyright infringement and data privacy violations"],
answer:[3],explanation:"Legal compliance ensures licensed, ethical AI training and usage, preventing copyright and privacy violations."},

{n:87,section:"Governance",difficulty:"M",
q:`How can problematic text in a RAG application be mitigated?`,
options:["Ignoring the issue","Increasing tokens","Implementing a filtering or re-ranking approach to improve response quality","Random sampling"],
answer:[2],explanation:"Filtering and re-ranking approaches remove misleading or biased content, improving the overall quality of AI outputs."},

{n:88,section:"Governance",difficulty:"M",
q:`What is a best practice to handle user inputs that may lead to undesirable AI behavior?`,
options:["Reducing token usage","Using structured prompts and safety checks","Ignoring problematic inputs","Removing all filters"],
answer:[1],explanation:"Structured prompts and safety checks prevent offensive or misleading responses by establishing clear behavioral boundaries."},

{n:89,section:"Evaluation & Monitoring",difficulty:"M",
q:`Which metric is best for evaluating retrieval performance in a RAG application?`,
options:["Token count","Latency only","Mean Reciprocal Rank (MRR)","Storage size"],
answer:[2],explanation:"MRR measures how well the retrieval system ranks relevant documents, making it the best metric for retrieval evaluation."},

{n:90,section:"Evaluation & Monitoring",difficulty:"M",
q:`Why is inference logging important for deployed RAG applications?`,
options:["To track model response quality and detect anomalies","For debugging only","For cost tracking only","For storage management"],
answer:[0],explanation:"Inference logging records AI outputs to identify errors, drifts, and anomalies in deployed applications."},

{n:91,section:"Evaluation & Monitoring",difficulty:"M",
q:`What is an effective way to control LLM costs in Databricks?`,
options:["Running multiple small models","Optimize prompt length and batch processing","Avoiding retrievers","Limiting all API access"],
answer:[1],explanation:"Reducing prompt size and batching requests reduce token consumption, directly controlling costs."},

{n:92,section:"Evaluation & Monitoring",difficulty:"M",
q:`What should be monitored to ensure stable model performance over time?`,
options:["Cost only","Speed only","Model drift and response consistency","Storage usage"],
answer:[2],explanation:"Drift occurs when model outputs become less relevant over time. Monitoring drift and consistency ensures stable performance."},

{n:93,section:"Evaluation & Monitoring",difficulty:"M",
q:`How can MLflow be used to evaluate a RAG model?`,
options:["Modifying LLM settings","Changing token usage","Adjusting retrieval parameters","Tracking retrieval metrics and response quality over multiple runs"],
answer:[3],explanation:"MLflow logs retrieval success rates and AI output quality across multiple experiment runs for comprehensive evaluation."},

{n:94,section:"Design Applications",difficulty:"M",
q:`How can you ensure a language model returns responses in JSON format?\n\nprompt = """\nProvide the response in JSON format:\n{{\n    "answer": "<your answer>",\n    "confidence": <your confidence score>\n}}\nQuestion: What is the capital of France?\n"""`,
options:["Let the model decide the response format","Use explicit formatting instructions within curly braces {}","Use XML instead of JSON","Only mention 'Answer in JSON'"],
answer:[1],explanation:"Providing an explicit structured format with curly braces ensures the model returns consistently formatted JSON."},

{n:95,section:"Design Applications",difficulty:"M",
q:`Which LangChain component allows chaining multiple LLM calls?\n\nfrom langchain.chains import SequentialChain`,
options:["SimpleChain","Calling models separately","SequentialChain","Storing intermediate outputs in files"],
answer:[2],explanation:"SequentialChain chains multiple LLM calls together, passing outputs forward through the pipeline."},

{n:96,section:"Design Applications",difficulty:"M",
q:`How do you integrate an LLM with external tools in LangChain?\n\nfrom langchain.agents import initialize_agent`,
options:["Use initialize_agent and pass tools","Define tools but don't pass them","Use a basic LLM without tools","Manually execute tool calls"],
answer:[0],explanation:"initialize_agent allows the model to use external tools dynamically, enabling integration with databases, APIs, etc."},

{n:97,section:"Data Preparation",difficulty:"M",
q:`How do you extract text from a PDF file using Python?`,
options:["PIL","Use pdfplumber","openpyxl","requests"],
answer:[1],explanation:"pdfplumber extracts structured text from PDFs efficiently."},

{n:98,section:"Application Development",difficulty:"M",
q:`How do you secure model endpoints?`,
options:["Allow open access","Use API keys only","Use OAuth authentication","Disable authentication"],
answer:[2],explanation:"OAuth ensures secure access control with proper authentication and authorization mechanisms."},

{n:99,section:"Assembling & Deploying",difficulty:"M",
q:`What is the purpose of coding a chain using a pyfunc model with pre- and post-processing?`,
options:["Pyfunc does not speed up processing directly","To customize input and output transformations for model inference","It does not store model embeddings","Not limited to training workflows"],
answer:[1],explanation:"A pyfunc model allows adding pre-processing (formatting, cleaning) and post-processing (filtering, structuring) before and after model inference."},
];
