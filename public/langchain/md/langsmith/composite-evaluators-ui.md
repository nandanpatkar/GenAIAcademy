_Composite evaluators_ are a way to combine multiple evaluator scores into a single [score](lc:langsmith/evaluation-concepts#evaluator-outputs). This is useful when you want to evaluate multiple aspects of your application and combine the results into a single result.

This guide shows you how to define a [composite evaluator](lc:langsmith/evaluation-concepts#llm-as-judge) using the [LangSmith UI](https://smith.langchain.com).


> [!NOTE]
>
> To create composite evaluators programmatically using the SDK, refer to [How to create a composite evaluator (SDK)](lc:langsmith/composite-evaluators-sdk).


## Create a composite evaluator

You can create composite evaluators on a [tracing project](lc:langsmith/observability-concepts#projects) (for [online evaluations](lc:langsmith/evaluation-concepts#online-evaluations)) or a [dataset](lc:langsmith/evaluation-concepts#datasets) (for [offline evaluations](lc:langsmith/evaluation-concepts#offline-evaluations)). With composite evaluators in the UI, you can compute a weighted average or weighted sum of multiple evaluator scores, with configurable weights.


![LangSmith UI showing an LLM call trace called ChatOpenAI with a system and human input followed by an AI Output.](/langchain/images/langsmith/images/create_composite_evaluator-light.png)


![LangSmith UI showing an LLM call trace called ChatOpenAI with a system and human input followed by an AI Output.](/langchain/images/langsmith/images/create_composite_evaluator-dark.png)


### 1. Navigate to the tracing project or dataset

To start configuring a composite evaluator, navigate to the **Tracing Projects** or **Dataset & Experiments** tab and select a project or dataset.
- From within a tracing project: **+ New** > **Evaluator** > **Composite score**
- From within a dataset: **+ Evaluator** > **Composite score**

### 2. Configure the composite evaluator

1. Name your evaluator.
2. Select an aggregation method, either **Average** or **Sum**.
    - **Average**: ∑(weight*score) / ∑(weight).
    - **Sum**: ∑(weight*score).
3. Add the feedback keys you want to include in the composite score.
4. Add the weights for the feedback keys. By default, the weights are equal for each feedback key. Adjust the weights to increase or decrease the importance of specific feedback keys in the final score.
5. Click **Create** to save the evaluator.


> [!TIP]
>
> If you need to adjust the weights for the composite scores, they can be updated after the evaluator is created. The resulting scores will be updated for all runs that have the evaluator configured.


### 3. View composite evaluator results
Composite scores are attached to a run as **feedback**, similarly to feedback from a single evaluator. How you can view them depends on where the evaluation was run:

**On a tracing project**:
- Composite scores appear as feedback on runs.
- [Filter for runs](lc:langsmith/filter-traces-in-application) with a composite score, or where the composite score meets a certain threshold.
- [Create a chart](lc:langsmith/dashboards#custom-dashboards) to visualize trends in the composite score over time.

**On a dataset**:
- View the composite scores in the experiments tab. You can also filter and sort experiments based on the average composite score of their runs.
- Click into an experiment to view the composite score for each run.


> [!NOTE]
>
> If any of the constituent evaluators are not configured on the run, the composite score will not be calculated for that run.
