# Compare long-term memory with Retrieval-Augmented Generation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-ltm-rag.html

---

# Compare long-term memory with Retrieval-Augmented Generation

[Long-term memory](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./memory-types.html#memory-long-term-memory>) in Amazon Bedrock AgentCore Memory serves as persistent storage for session-specific context, enabling agents to maintain continuity and personalization across interactions. Use long-term memory to store user preferences, past decisions, conversation history, and behavioral patterns that help agents adapt and feel personal without repeatedly requesting the same information. This memory type is ideal for tracking who the user is, what has happened in previous sessions, and maintaining state across multi-step workflows.

Retrieval-Augmented Generation (RAG) complements long-term memory by providing access to authoritative, current information from large-scale repositories. Use these system to retrieve up-to-date documentation, technical specifications, policies, and domain expertise that may be too large or volatile for long-term storage. RAG ensures factual accuracy by pulling directly from curated sources at query time, making it ideal for accessing what authoritative sources say right now. One option for integrating RAG into your agent is to use an Amazon Bedrock Knowledge Base. For more information, see [Retrieve data and generate AI responses with Amazon Bedrock Knowledge Bases](<https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html>) in the _Amazon Bedrock user guide_.

The key distinction lies in their complementary roles: long-term memory handles personal context and session continuity, while RAG provides current factual knowledge and domain expertise. Long-term memory answers "who is the user and what happened before," while RAG answers "what do trusted sources say currently." This separation allows agents to maintain personal relationships with users while ensuring access to accurate, authoritative information.

By using long-memory and RAG together, your agent can deliver both personalized experiences through remembered context and reliable information through real- time knowledge retrieval. To your customers, your agents are both familiar and factually grounded.

