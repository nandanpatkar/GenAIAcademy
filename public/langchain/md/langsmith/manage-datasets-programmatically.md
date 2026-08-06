You can use the Python and TypeScript SDK to manage datasets programmatically. This includes creating, updating, and deleting datasets, as well as adding examples to them.

## Create a dataset

### Create a dataset from list of values

The most flexible way to make a dataset using the client is by creating examples from a list of inputs and optional outputs. Below is an example.

Note that you can add arbitrary metadata to each example, such as a note or a source. The metadata is stored as a dictionary.


> [!TIP]
>
> If you have many examples to create, consider using the `create_examples`/`createExamples` method to create multiple examples in a single request. If creating a single example, you can use the `create_example`/`createExample` method.


```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nexamples = [\n  {\n    \"inputs\": {\"question\": \"What is the largest mammal?\"},\n    \"outputs\": {\"answer\": \"The blue whale\"},\n    \"metadata\": {\"source\": \"Wikipedia\"},\n  },\n  {\n    \"inputs\": {\"question\": \"What do mammals and birds have in common?\"},\n    \"outputs\": {\"answer\": \"They are both warm-blooded\"},\n    \"metadata\": {\"source\": \"Wikipedia\"},\n  },\n  {\n    \"inputs\": {\"question\": \"What are reptiles known for?\"},\n    \"outputs\": {\"answer\": \"Having scales\"},\n    \"metadata\": {\"source\": \"Wikipedia\"},\n  },\n  {\n    \"inputs\": {\"question\": \"What's the main characteristic of amphibians?\"},\n    \"outputs\": {\"answer\": \"They live both in water and on land\"},\n    \"metadata\": {\"source\": \"Wikipedia\"},\n  },\n]\n\nclient = Client()\ndataset_name = \"Elementary Animal Questions\"\n\n# Storing inputs in a dataset lets us\n# run chains and LLMs over a shared set of examples.\ndataset = client.create_dataset(\n  dataset_name=dataset_name, description=\"Questions and answers about animal phylogenetics.\",\n)\n\n# Prepare inputs, outputs, and metadata for bulk creation\nclient.create_examples(\n  dataset_id=dataset.id,\n  examples=examples\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "public class CreateDatasetExample {\n    public static void main(String[] args) {\n        LangsmithClient client = LangsmithOkHttpClient.fromEnv();\n\n        List<String[]> exampleInputs = List.of(\n            new String[]{\"What is the largest mammal?\", \"The blue whale\"},\n            new String[]{\"What do mammals and birds have in common?\", \"They are both warm-blooded\"},\n            new String[]{\"What are reptiles known for?\", \"Having scales\"},\n            new String[]{\"What's the main characteristic of amphibians?\", \"They live both in water and on land\"}\n        );\n\n        String datasetName = \"Elementary Animal Questions\";\n\n        Dataset dataset;\n        try {\n            dataset = client.datasets().create(\n                DatasetCreateParams.builder()\n                    .name(datasetName)\n                    .description(\"Questions and answers about animal phylogenetics\")\n                    .build()\n            );\n        } catch (UnexpectedStatusCodeException e) {\n            // Dataset already exists, get it\n            if (e.statusCode() == 409) {\n                DatasetListParams listParams = DatasetListParams.builder()\n                    .name(datasetName)\n                    .build();\n                dataset = client.datasets().list(listParams).items().get(0);\n            } else {\n                throw e;\n            }\n        }\n\n        // Prepare inputs, outputs, and metadata for bulk creation\n        List<Map<String, String>> inputs = exampleInputs.stream()\n            .map(pair -> {\n                return Maps.of(\"question\", pair[0]);\n            })\n            .collect(Collectors.toList());\n\n        List<Map<String, String>> outputs = exampleInputs.stream()\n            .map(pair -> {\n                return Maps.of(\"answer\", pair[1]);\n            })\n            .collect(Collectors.toList());\n\n        List<Map<String, String>> metadata = exampleInputs.stream()\n            .map(pair -> {\n                return Maps.of(\"source\", \"Wikipedia\");\n            })\n            .collect(Collectors.toList());\n\n        // Use the bulk createExamples method\n        BulkCreateParams.Builder bulkParamsBuilder = BulkCreateParams.builder();\n        for (int i = 0; i < inputs.size(); i++) {\n            bulkParamsBuilder.addBody(\n                BulkCreateParams.Body.builder()\n                    .datasetId(dataset.id())\n                    .inputs(JsonValue.from(inputs.get(i)))\n                    .outputs(JsonValue.from(outputs.get(i)))\n                    .metadata(JsonValue.from(metadata.get(i)))\n                    .build()\n            );\n        }\n\n        client.examples().bulk().create(bulkParamsBuilder.build());\n    }\n}"
 }
]
```

### Create a dataset from traces

To create datasets from the runs (spans) of your traces, you can use the same approach. For **many** more examples of how to fetch and filter runs, see the [export traces](lc:langsmith/export-traces) guide. Below is an example:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nclient = Client()\ndataset_name = \"Example Dataset\"\n\n# Filter runs to add to the dataset\nruns = client.list_runs(\n  project_name=\"my_project\",\n  is_root=True,\n  error=False,\n)\n\ndataset = client.create_dataset(dataset_name, description=\"An example dataset\")\n\n# Prepare inputs and outputs for bulk creation\nexamples = [{\"inputs\": run.inputs, \"outputs\": run.outputs} for run in runs]\n\n# Use the bulk create_examples method\nclient.create_examples(\n  dataset_id=dataset.id,\n  examples=examples\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "public class CreateDatasetExample {\n    public static void main(String[] args) {\n        LangsmithClient client = LangsmithOkHttpClient.fromEnv();\n        String projectId = System.getenv(\"LANGSMITH_PROJECT_ID\");\n        String datasetName = \"Example Dataset\";\n\n        List<RunQueryResponse.Run> allRuns = new ArrayList<>();\n        String cursor = null;\n        try {\n            do {\n                RunQueryParams.Builder paramsBuilder = RunQueryParams.builder()\n                    .addSession(projectId)\n                    .isRoot(true)\n                    .error(false)\n                    .limit(10L);\n\n                if (cursor != null) {\n                    paramsBuilder.cursor(cursor);\n                }\n\n                RunQueryResponse response = client.runs().query(paramsBuilder.build());\n                allRuns.addAll(response.runs());\n\n                // Get cursor for next page\n                try {\n                    Map<String, JsonValue> cursorProps = response.cursors()._additionalProperties();\n                    if (cursorProps != null && cursorProps.containsKey(\"next\")) {\n                        JsonValue nextValue = cursorProps.get(\"next\");\n                        if (nextValue != null && !nextValue.isNull() && !nextValue.isMissing()) {\n                            cursor = nextValue.asString().orElse(null);\n                        } else {\n                            cursor = null;\n                        }\n                    } else {\n                        cursor = null;\n                    }\n                } catch (Exception e) {\n                    cursor = null;\n                }\n                if (response.runs().size() < 50) {\n                    cursor = null;\n                }\n            } while (cursor != null && !cursor.isEmpty());\n        } catch (Exception e) {\n            System.err.println(\"Error querying runs: \" + e.getMessage());\n            e.printStackTrace();\n            System.exit(1);\n        }\n\n        System.out.println(\"Total runs found: \" + allRuns.size());\n\n        // Create dataset\n        Dataset dataset = client.datasets().create(\n            DatasetCreateParams.builder()\n                .name(datasetName)\n                .description(\"An example dataset\")\n                .build()\n        );\n\n        // Prepare inputs and outputs for bulk creation\n        BulkCreateParams.Builder bulkParamsBuilder = BulkCreateParams.builder();\n        int examplesWithData = 0;\n        for (RunQueryResponse.Run run : allRuns) {\n            if (run.inputs().isPresent() && run.outputs().isPresent()) {\n                // Get the additional properties maps which contain the actual data\n                Map<String, JsonValue> inputsMap = run.inputs().get()._additionalProperties();\n                Map<String, JsonValue> outputsMap = run.outputs().get()._additionalProperties();\n\n                bulkParamsBuilder.addBody(\n                    BulkCreateParams.Body.builder()\n                        .datasetId(dataset.id())\n                        .inputs(JsonValue.from(inputsMap))\n                        .outputs(JsonValue.from(outputsMap))\n                        .build()\n                );\n                examplesWithData++;\n            }\n        }\n\n        System.out.println(\"Prepared \" + examplesWithData + \" examples from \" + allRuns.size() + \" runs\");\n\n        if (examplesWithData == 0) {\n            System.err.println(\"No runs have both inputs and outputs. Cannot create examples.\");\n            System.exit(1);\n        }\n\n        client.examples().bulk().create(bulkParamsBuilder.build());\n        System.out.println(\"Created \" + examplesWithData + \" examples in dataset\");\n    }\n}"
 }
]
```

### Create a dataset from a CSV file

In this section, we will demonstrate how you can create a dataset by uploading a CSV file.

First, ensure your CSV file is properly formatted with columns that represent your input and output keys. These keys will be utilized to map your data properly during the upload. You can specify an optional name and description for your dataset. Otherwise, the file name will be used as the dataset name and no description will be provided.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nclient = Client()\ncsv_file = 'path/to/your/csvfile.csv'\ninput_keys = ['column1', 'column2'] # replace with your input column names\noutput_keys = ['output1', 'output2'] # replace with your output column names\n\ndataset = client.upload_csv(\n  csv_file=csv_file,\n  input_keys=input_keys,\n  output_keys=output_keys,\n  name=\"My CSV Dataset\",\n  description=\"Dataset created from a CSV file\",\n  data_type=\"kv\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "LangsmithClient client = LangsmithOkHttpClient.fromEnv();\nPath csvFile = Paths.get(\"path/to/your/csvfile.csv\");\nList<String> inputKeys = List.of(\"column1\", \"column2\");\nList<String> outputKeys = List.of(\"output1\", \"output2\");\n\nDataset dataset = client.datasets().upload(\n    DatasetUploadParams.builder()\n        .file(csvFile)\n        .inputKeys(inputKeys)\n        .outputKeys(outputKeys)\n        .name(\"My CSV Dataset\")\n        .description(\"Dataset created from a CSV file\")\n        .dataType(DataType.KV)\n        .build()\n);"
 }
]
```

### Create a dataset from pandas DataFrame (Python only)

The python client offers an additional convenience method to upload a dataset from a pandas dataframe.

```python
from langsmith import Client

client = Client()
df = pd.read_parquet('path/to/your/myfile.parquet')
input_keys = ['column1', 'column2'] # replace with your input column names
output_keys = ['output1', 'output2'] # replace with your output column names

dataset = client.upload_dataframe(
    df=df,
    input_keys=input_keys,
    output_keys=output_keys,
    name="My Parquet Dataset",
    description="Dataset created from a parquet file",
    data_type="kv" # The default
)
```

## Fetch datasets

You can programmatically fetch datasets from LangSmith using the `list_datasets`/`listDatasets` method in the Python and TypeScript SDKs. Below are some common calls.


> [!NOTE]
>
> Initialize the client before running the below code snippets.


```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nclient = Client()"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "LangsmithClient client = LangsmithOkHttpClient.fromEnv();"
 }
]
```

### Query all datasets

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "datasets = client.list_datasets()"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "DatasetListParams listParams = DatasetListParams.builder().build();\nvar datasets = client.datasets().list(listParams);"
 }
]
```

### List datasets by name

If you want to search by the exact name, you can do the following:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "datasets = client.list_datasets(dataset_name=\"My Test Dataset 1\")"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "DatasetListParams listParams = DatasetListParams.builder()\n    .name(\"My Test Dataset 1\")\n    .build();\nvar datasets = client.datasets().list(listParams);"
 }
]
```

If you want to do a case-invariant substring search, try the following:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "datasets = client.list_datasets(dataset_name_contains=\"some substring\")"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "DatasetListParams listParams = DatasetListParams.builder()\n    .nameContains(\"some substring\")\n    .build();\nvar datasets = client.datasets().list(listParams);"
 }
]
```

### List datasets by type

You can filter datasets by type:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "datasets = client.list_datasets(data_type=\"kv\")"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "DatasetListParams listParams = DatasetListParams.builder()\n    .datatype(DataType.of(\"kv\"))\n    .build();\nvar datasets = client.datasets().list(listParams);"
 }
]
```

## Fetch examples

You can programmatically fetch examples from LangSmith using the `list_examples`/`listExamples` method in the Python and TypeScript SDKs. Below are some common calls.


> [!NOTE]
>
> Initialize the client before running the below code snippets.


```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nclient = Client()"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "LangsmithClient client = LangsmithOkHttpClient.fromEnv();"
 }
]
```

### List all examples for a dataset

You can filter by dataset ID:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "examples = client.list_examples(dataset_id=\"c9ace0d8-a82c-4b6c-13d2-83401d68e9ab\")"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "ExampleListParams listParams = ExampleListParams.builder()\n    .dataset(\"c9ace0d8-a82c-4b6c-13d2-83401d68e9ab\")\n    .build();\nvar examples = client.examples().list(listParams);"
 }
]
```

Or you can filter by dataset name (this must exactly match the dataset name you want to query)

```python Python
examples = client.list_examples(dataset_name="My Test Dataset")
```

### List examples by id

You can also list multiple examples all by ID.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "example_ids = [\n  '734fc6a0-c187-4266-9721-90b7a025751a',\n  'd6b4c1b9-6160-4d63-9b61-b034c585074f',\n  '4d31df4e-f9c3-4a6e-8b6c-65701c2fed13',\n]\n\nexamples = client.list_examples(example_ids=example_ids)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "List<String> exampleIds = List.of(\n    \"734fc6a0-c187-4266-9721-90b7a025751a\",\n    \"d6b4c1b9-6160-4d63-9b61-b034c585074f\",\n    \"4d31df4e-f9c3-4a6e-8b6c-65701c2fed13\"\n);\n\nExampleListParams listParams = ExampleListParams.builder()\n    .id(exampleIds)\n    .build();\nvar examples = client.examples().list(listParams);"
 }
]
```

### List examples by metadata

You can also filter examples by metadata. Below is an example querying for examples with a specific metadata key-value pair. Under the hood, we check to see if the example's metadata contains the key-value pair(s) you specify.

For example, if you have an example with metadata `{"foo": "bar", "baz": "qux"}`, both `{foo: bar}` and `{baz: qux}` would match, as would `{foo: bar, baz: qux}`.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "examples = client.list_examples(dataset_name=dataset_name, metadata={\"foo\": \"bar\"})"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "ExampleListParams listParams = ExampleListParams.builder()\n    .datasetId(datasetId)\n    .metadata(\"{\\\"foo\\\":\\\"bar\\\"}\")\n    .build();\nvar examples = client.examples().list(listParams);"
 }
]
```

### List examples by structured filter

Similar to how you can use the structured filter query language to [fetch runs](lc:langsmith/export-traces#use-filter-query-language), you can use it to fetch examples.


> [!NOTE]
>
> This is currently only available in v0.1.83 and later of the Python SDK and v0.1.35 and later of the TypeScript SDK.
>
> Additionally, the structured filter query language is only supported for `metadata` fields.


You can use the `has` operator to fetch examples with metadata fields that contain specific key/value pairs and the `exists` operator to fetch examples with metadata fields that contain a specific key. Additionally, you can chain multiple filters together using the `and` operator and negate a filter using the `not` operator.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "examples = client.list_examples(\n  dataset_name=dataset_name,\n  filter='and(not(has(metadata, \\'{\"foo\": \"bar\"}\\')), exists(metadata, \"tenant_id\"))'\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "String filter = \"and(not(has(metadata, '{\\\"foo\\\": \\\"bar\\\"}')), exists(metadata, \\\"tenant_id\\\"))\";\n\nExampleListParams listParams = ExampleListParams.builder()\n    .datasetId(datasetId)\n    .filter(filter)\n    .build();\nvar examples = client.examples().list(listParams);"
 }
]
```

## Update examples

### Update single example

You can programmatically update examples from LangSmith using the `update_example`/`updateExample` method in the Python and TypeScript SDKs. Below is an example.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.update_example(\n  example_id=example.id,\n  inputs={\"input\": \"updated input\"},\n  outputs={\"output\": \"updated output\"},\n  metadata={\"foo\": \"bar\"},\n  split=\"train\"\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": " // Create Inputs using the builder\nExampleUpdateParams.Inputs inputsObj = ExampleUpdateParams.Inputs.builder()\n    .putAdditionalProperty(\"input\", JsonValue.from(\"updated input\"))\n    .build();\n\n// Create Outputs using the builder\nExampleUpdateParams.Outputs outputsObj = ExampleUpdateParams.Outputs.builder()\n    .putAdditionalProperty(\"output\", JsonValue.from(\"updated output\"))\n    .build();\n\n// Create Metadata using the builder\nExampleUpdateParams.Metadata metadataObj = ExampleUpdateParams.Metadata.builder()\n    .putAdditionalProperty(\"foo\", JsonValue.from(\"bar\"))\n    .build();\n\nExampleUpdateParams updateParams = ExampleUpdateParams.builder()\n    .inputs(inputsObj)\n    .outputs(outputsObj)\n    .metadata(metadataObj)\n    .split(\"train\")\n    .build();\n\nExampleUpdateResponse updateResponse = client.examples().update(example.id(), updateParams);"
 }
]
```

### Bulk update examples

You can also programmatically update multiple examples in a single request with the `update_examples`/`updateExamples` method in the Python and TypeScript SDKs. Below is an example.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "client.update_examples(\n  example_ids=[example.id, example_2.id],\n  inputs=[{\"input\": \"updated input 1\"}, {\"input\": \"updated input 2\"}],\n  outputs=[\n      {\"output\": \"updated output 1\"},\n      {\"output\": \"updated output 2\"},\n  ],\n  metadata=[{\"foo\": \"baz\"}, {\"foo\": \"qux\"}],\n  splits=[[\"training\", \"foo\"], \"training\"] # Splits can be arrays or standalone strings\n)"
 },
 {
  "label": "Java",
  "lang": "java",
  "code": "Map<String, String> inputs1 = Map.of(\"question\", \"What is the capital of France?\")\nMap<String, String> outputs1 = Map.of(\"answer\", \"The capital of France is Paris.\");\nMap<String, String> metadata1 = Map.of(\n    \"source\", \"Wikipedia\",\n    \"difficulty\", \"easy\"\n);\n\nMap<String, String> inputs2 = Map.of(\"question\", \"What is 2 + 2?\");\nMap<String, String> outputs2 = Map.of(\"answer\", \"The answer is 4.\");\nMap<String, String> metadata2 = Map.of(\n    \"source\", \"Math textbook\",\n    \"difficulty\", \"easy\");\n\nBulkPatchAllParams.Builder bulkParamsBuilder = BulkPatchAllParams.builder();\n\nbulkParamsBuilder.addBody(\n    BulkPatchAllParams.Body.builder()\n        .id(example1.id())\n        .inputs(buildInputs(inputs1))\n        .outputs(buildOutputs(outputs1))\n        .metadata(buildMetadata(metadata1))\n        .splitOfStrings(Arrays.asList(\"training\", \"validation\"))\n        .build()\n);\n\nbulkParamsBuilder.addBody(\n    BulkPatchAllParams.Body.builder()\n        .id(example2.id())\n        .inputs(buildInputs(inputs2))\n        .outputs(buildOutputs(outputs2))\n        .metadata(buildMetadata(metadata2))\n        .split(\"test\")\n        .build()\n);\n\nclient.examples().bulk().patchAll(bulkParamsBuilder.build());"
 }
]
```
