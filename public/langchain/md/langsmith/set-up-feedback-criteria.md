> [!TIP]
>
> **Recommended Reading**
>
> Before diving into this content, it might be helpful to read the following:
>
> - [Conceptual guide on tracing and feedback](lc:langsmith/observability-concepts)
> - [Reference guide on feedback data format](lc:langsmith/feedback-data-format)


Feedback criteria are represented in the application as feedback tags. For human feedback, you can set up new feedback criteria as continuous feedback or categorical feedback.


> [!NOTE]
>
> You can also manage feedback configs programmatically with the SDK. Refer to [Manage feedback & annotation queues programmatically](lc:langsmith/annotation-queues-sdk).


> [!TIP]
>
> For free-form acceptance criteria a reviewer writes per-run (rather than a fixed set of rubric scores), refer to [Use assertions](lc:langsmith/assertions).


To set up a new feedback criteria, follow [this link](https://smith.langchain.com/settings/workspaces/feedbacks) to view all existing tags for your workspace, then click **New Tag**.

## Continuous feedback

For continuous feedback, you can enter a feedback tag name, then select a minimum and maximum value. Every value, including floating-point numbers, within this range will be accepted as feedback scores.

![Cont feedback](/langchain/images/langsmith/images/cont-feedback.png)

## Categorical feedback

For categorical feedback, you can enter a feedback tag name, then add a list of categories, each category mapping to a score. When you provide feedback, you can select one of these categories as the feedback score.
Both the category label and the score will be logged as feedback in `value` and `score` fields, respectively.

![Cat feedback](/langchain/images/langsmith/images/cat-feedback.png)
