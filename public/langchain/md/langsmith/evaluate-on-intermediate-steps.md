While, in many scenarios, it is sufficient to evaluate the final output of your task, in some cases you might want to evaluate the intermediate steps of your pipeline.

For example, for retrieval-augmented generation (RAG), you might want to

1. Evaluate the retrieval step to ensure that the correct documents are retrieved w\.r.t the input query.
2. Evaluate the generation step to ensure that the correct answer is generated w\.r.t the retrieved documents.

In this guide, we will use a simple, fully-custom evaluator for evaluating criteria 1 and an LLM-based evaluator for evaluating criteria 2 to highlight both scenarios.

In order to evaluate the intermediate steps of your pipeline, your evaluator function should traverse and process the `run`/`rootRun` argument, which is a `Run` object that contains the intermediate steps of your pipeline.

## 1. Define your LLM pipeline

The below RAG pipeline consists of 1) generating a Wikipedia query given the input question, 2) retrieving relevant documents from Wikipedia, and 3) generating an answer given the retrieved documents.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "pip install -U langsmith langchain[openai] wikipedia"
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "yarn add langsmith langchain @langchain/openai wikipedia"
 }
]
```

Requires `langsmith>=0.3.13`

```python Python
from openai import OpenAI
from langsmith import traceable, wrappers

oai_client = wrappers.wrap_openai(OpenAI())

@traceable
def generate_wiki_search(question: str) -> str:
    """Generate the query to search in wikipedia."""
    instructions = (
        "Generate a search query to pass into wikipedia to answer the user's question. "
        "Return only the search query and nothing more. "
        "This will passed in directly to the wikipedia search engine."
    )
    messages = [
        {"role": "system", "content": instructions},
        {"role": "user", "content": question}
    ]
    result = oai_client.chat.completions.create(
        messages=messages,
        model="gpt-5.4-mini",
        temperature=0,
    )
    return result.choices[0].message.content

@traceable(run_type="retriever")
def retrieve(query: str) -> list:
    """Get up to two search wikipedia results."""
    results = []
    for term in wp.search(query, results = 10):
        try:
            page = wp.page(term, auto_suggest=False)
            results.append({
                "page_content": page.summary,
                "type": "Document",
                "metadata": {"url": page.url}
            })
        except wp.DisambiguationError:
            pass
        if len(results) >= 2:
            return results

@traceable
def generate_answer(question: str, context: str) -> str:
    """Answer the question based on the retrieved information."""
    instructions = f"Answer the user's question based ONLY on the content below:\n\n{context}"
    messages = [
        {"role": "system", "content": instructions},
        {"role": "user", "content": question}
    ]
    result = oai_client.chat.completions.create(
        messages=messages,
        model="gpt-5.4-mini",
        temperature=0
    )
    return result.choices[0].message.content

@traceable
def qa_pipeline(question: str) -> str:
    """The full pipeline."""
    query = generate_wiki_search(question)
    context = "\n\n".join([doc["page_content"] for doc in retrieve(query)])
    return generate_answer(question, context)
```

This pipeline will produce a trace that looks something like: ![evaluation_intermediate_trace.png](/langchain/images/langsmith/images/evaluation-intermediate-trace.png)

## 2. Create a dataset and examples to evaluate the pipeline

We are building a very simple dataset with a couple of examples to evaluate the pipeline.

Requires `langsmith>=0.3.13`

```python Python
from langsmith import Client

ls_client = Client()
dataset_name = "Wikipedia RAG"

if not ls_client.has_dataset(dataset_name=dataset_name):
    dataset = ls_client.create_dataset(dataset_name=dataset_name)
    examples = [
      {"inputs": {"question": "What is LangChain?"}},
      {"inputs": {"question": "What is LangSmith?"}},
    ]
    ls_client.create_examples(
      dataset_id=dataset.id,
      examples=examples,
    )
```

## 3. Define your custom evaluators

As mentioned above, we will define two evaluators: one that evaluates the relevance of the retrieved documents w\.r.t the input query and another that evaluates the hallucination of the generated answer w\.r.t the retrieved documents. We will be using LangChain LLM wrappers, along with `with_structured_output`[BaseChatModel.with_structured_output] to define the evaluator for hallucination.

The key here is that the evaluator function should traverse the `run` / `rootRun` argument to access the intermediate steps of the pipeline. The evaluator can then process the inputs and outputs of the intermediate steps to evaluate according to the desired criteria.

Example uses `langchain` for convenience, this is not required.

```python Python
from langchain.chat_models import init_chat_model
from langsmith.schemas import Run
from pydantic import BaseModel, Field

def document_relevance(run: Run) -> bool:
    """Checks if retriever input exists in the retrieved docs."""
    qa_pipeline_run = next(
        r for run in run.child_runs if r.name == "qa_pipeline"
    )
    retrieve_run = next(
        r for run in qa_pipeline_run.child_runs if r.name == "retrieve"
    )
    page_contents = "\n\n".join(
        doc["page_content"] for doc in retrieve_run.outputs["output"]
    )
    return retrieve_run.inputs["query"] in page_contents

# Data model
class GradeHallucinations(BaseModel):
    """Binary score for hallucination present in generation answer."""
    is_grounded: bool = Field(..., description="True if the answer is grounded in the facts, False otherwise.")

# LLM with structured output for grading hallucinations
# For more see: https://docs.langchain.com/oss/python/langchain/structured-output
grader_llm= init_chat_model("gpt-5.4-mini", temperature=0).with_structured_output(
    GradeHallucinations,
    method="json_schema",
    strict=True,
)

def no_hallucination(run: Run) -> bool:
    """Check if the answer is grounded in the documents.
    Return True if there is no hallucination, False otherwise.
    """
    # Get documents and answer
    qa_pipeline_run = next(
        r for r in run.child_runs if r.name == "qa_pipeline"
    )
    retrieve_run = next(
        r for r in qa_pipeline_run.child_runs if r.name == "retrieve"
    )
    retrieved_content = "\n\n".join(
        doc["page_content"] for doc in retrieve_run.outputs["output"]
    )

    # Construct prompt
    instructions = (
        "You are a grader assessing whether an LLM generation is grounded in / "
        "supported by a set of retrieved facts. Give a binary score 1 or 0, "
        "where 1 means that the answer is grounded in / supported by the set of facts."
    )
    messages = [
        {"role": "system", "content": instructions},
        {"role": "user", "content": f"Set of facts:\n{retrieved_content}\n\nLLM generation: {run.outputs['answer']}"},
    ]
    grade = grader_llm.invoke(messages)
    return grade.is_grounded
```

## 4. Evaluate the pipeline

Finally, we'll run `evaluate` with the custom evaluators defined above.

```python Python
def qa_wrapper(inputs: dict) -> dict:
  """Wrap the qa_pipeline so it can accept the Example.inputs dict as input."""
  return {"answer": qa_pipeline(inputs["question"])}

experiment_results = ls_client.evaluate(
    qa_wrapper,
    data=dataset_name,
    evaluators=[document_relevance, no_hallucination],
    experiment_prefix="rag-wiki-oai"
)
```

The experiment will contain the results of the evaluation, including the scores and comments from the evaluators: ![evaluation_intermediate_experiment.png](/langchain/images/langsmith/images/evaluation-intermediate-experiment.png)

## Related

* [Evaluate a `langgraph` graph](lc:langsmith/evaluate-on-intermediate-steps)
