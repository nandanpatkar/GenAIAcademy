# Write files to a session - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-file-operations.html

---

# Write files to a session

You can use the Code Interpreter to read and write files in the sandbox environment. This allows you to upload data files, process them with code, and retrieve the results.

**Install dependencies**

Run the following command to install the required package:

```bash
pip install bedrock-agentcore
```
**Upload Code and Data using the file tool**

The following Python code shows how to upload files to the Code Interpreter session and execute code that processes those files. The files that are required are `data.csv` and `stats.py` that are available [in this package](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/samples/read_write_files.zip>).

```bash
# file_mgmt_ci_agent.py

from bedrock_agentcore.tools.code_interpreter_client import CodeInterpreter
import json
from typing import Dict, Any, List

#Configure and Start the code interpreter session
code_client = CodeInterpreter('<Region>')
code_client.start()

#read the content of the sample data file
data_file = "data.csv"

try:
    with open(data_file, 'r', encoding='utf-8') as data_file_content:
        data_file_content = data_file_content.read()
    #print(data_file_content)
except FileNotFoundError:
    print(f"Error: The file '{data_file}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

#read the content of the python script to analyze the sample file
code_file = "stats.py"
try:
    with open(code_file, 'r', encoding='utf-8') as code_file_content:
        code_file_content = code_file_content.read()
    #print(code_file_content)
except FileNotFoundError:
    print(f"Error: The file '{code_file}' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")

files_to_create = [
                {
                    "path": "data.csv",
                    "text": data_file_content
                },
                {
                    "path": "stats.py",
                    "text": code_file_content
                }]

#define the method to call the invoke API
def call_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:

    response = code_client.invoke(tool_name, arguments)
    for event in response["stream"]:
        return json.dumps(event["result"], indent=2)

#write the sample data and analysis script into the code interpreter session
writing_files = call_tool("writeFiles", {"content": files_to_create})
print(f"writing files: {writing_files}")

#List and validate that the files were written successfully
listing_files = call_tool("listFiles", {"path": ""})
print(f"listing files: {listing_files}")

#Run the python script to analyze the sample data file
execute_code = call_tool("executeCode", {
                "code": files_to_create[1]['text'],
                "language": "python",
                "clearContext": True})
print(f"code execution result: {execute_code}")

#Clean up and stop the code interpreter session
code_client.stop()
```
