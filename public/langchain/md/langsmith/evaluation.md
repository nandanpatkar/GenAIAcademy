> [!NOTE]
>
> To set up a LangSmith instance, visit the [Platform setup section](lc:langsmith/platform-setup) to choose between cloud, hybrid, or self-hosted. All options include observability, evaluation, prompt engineering, and deployment.


LangSmith's testing tools help you measure agent quality, iterate on prompts, and debug live in an interactive environment. Evaluation is the core of testing: it scores your agent's outputs against datasets and criteria so you can benchmark versions, catch regressions, and track quality over time.

LangSmith supports two types of evaluation based on when and where they run:

  ### [Offline Evaluation](#)
**Test before you ship**

    Run evaluations on curated datasets during development to compare versions, benchmark performance, and catch regressions.

  ### [Online Evaluation](#)
**Monitor in production**

    Evaluate real user interactions in real-time to detect issues and measure quality on live traffic.

## Set up your account


#### Step: Create an account

        Sign up at [smith.langchain.com](https://smith.langchain.com) (no credit card required).
        You can log in with **Google**, **GitHub**, or **email**.
    
    #### Step: Create an API key

        Go to your [Settings page](https://smith.langchain.com/settings) → **API Keys** → **Create API Key**.
        Copy the key and save it securely.


Once your account and API key are ready, [run your first evaluation](lc:langsmith/evaluation-quickstart).

## Evaluation workflow

#### Tab: Offline evaluation flow

  #### Step: Create a dataset

    Create a [dataset](lc:langsmith/manage-datasets) with [examples](lc:langsmith/evaluation-concepts#examples) from manually curated test cases, historical production traces, or synthetic data generation.
  

  #### Step: Define evaluators

    Create [evaluators](lc:langsmith/evaluation-concepts#evaluators) to score performance:
    - [Human](lc:langsmith/evaluation-concepts#human) review
    - [Code](lc:langsmith/evaluation-concepts#code) rules
    - [LLM-as-judge](lc:langsmith/llm-as-judge)
    - [Pairwise](lc:langsmith/evaluate-pairwise) comparison
  

  #### Step: Run an experiment

    Execute your application on the dataset to create an [experiment](lc:langsmith/evaluation-concepts#experiment). Configure [repetitions, concurrency, and caching](lc:langsmith/experiment-configuration) to optimize runs.
  

  #### Step: Analyze results

    Compare experiments for [benchmarking](lc:langsmith/evaluation-types#benchmarking), [unit tests](lc:langsmith/evaluation-types#unit-tests), [regression tests](lc:langsmith/evaluation-types#regression-tests), or [backtesting](lc:langsmith/evaluation-types#backtesting).
  

#### Tab: Online evaluation flow

  #### Step: Deploy your application

    Each interaction creates a [run](lc:langsmith/evaluation-concepts#runs) without reference outputs.
  

  #### Step: Configure online evaluators

    Set up [evaluators](lc:langsmith/online-evaluations-llm-as-judge) to run automatically on production traces: safety checks, format validation, quality heuristics, and reference-free LLM-as-judge. Apply [filters and sampling rates](lc:langsmith/online-evaluations-llm-as-judge#configure-a-sampling-rate) to control costs.
  

  #### Step: Monitor in real-time

    Evaluators run automatically on [runs](lc:langsmith/evaluation-concepts#runs) or [threads](lc:langsmith/online-evaluations-multi-turn), providing real-time monitoring, anomaly detection, and alerting.
  

  #### Step: Establish a feedback loop

    Add failing production traces to your [dataset](lc:langsmith/manage-datasets), create targeted evaluators, validate fixes with offline experiments, and redeploy.
  


> [!TIP]
>
> For more on the differences between offline and online evaluation, refer to the [Evaluation concepts](lc:langsmith/evaluation-concepts#quick-reference-offline-vs-online-evaluation) page.


## Get started


### [Evaluation quickstart](#)
Get started with offline evaluation.

  ### [Manage datasets](#)
Create and manage datasets for evaluation through the UI or SDK.

  ### [Run offline evaluations](#)
Explore evaluation types, techniques, and frameworks for comprehensive testing.

  ### [Analyze results](#)
View and analyze evaluation results, compare experiments, filter data, and export findings.

  ### [Run online evaluations](#)
Monitor production quality in real-time from the Observability tab.

  ### [Follow tutorials](#)
Learn by following step-by-step tutorials, from simple chatbots to complex agent evaluations.

  ### [Studio](#)
Use an interactive environment for developing and debugging agents.
