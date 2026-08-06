# Built-in templates from integration providers as targets - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-integrations.html

---

# Built-in templates from integration providers as targets

Amazon Bedrock AgentCore lets you add open source templates from the following integration providers as targets in your gateway:

  * Amazon

  * Asana

  * BambooHR

  * Brave

  * Coinbase x402 Bazaar

  * Confluence

  * Jira

  * Microsoft

  * PagerDuty

  * Salesforce

  * ServiceNow

  * Slack

  * Smartsheet

  * Tavily

  * Zendesk

  * Zoom


###### Topics

  * Key considerations and limitations

  * Supported APIs by template


## Key considerations and limitations

When using templates from integration providers as targets, keep in mind the following requirements and limitations:

  * You can only add an integration provider template as a target through the AWS Management Console and not through the API.

  * Amazon Bedrock AgentCore doesn’t host any servers natively, so you must set up server hosting yourself. After you add the template, you can invoke the server URL that you set up using the authorization that you configure.

  * Amazon Bedrock AgentCore supports a subset of APIs that the provider supports for interacting with these templates. For a list of APIs supported by AgentCore, see Supported APIs by template.


## Supported APIs by template

This section lists the APIs that are supported for each template from an integration provider. To learn more about a specific API and schemas, do the following:

  * Search for the provider’s API documentation.

  * Send a `tools/list` call to the target after setting it up.


The following sections show, for each template, the [outbound authentication](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-outbound-auth.html>) types supported, the server URL, and the supported APIs and their paths.

###### Note

If an API path has a replaceable `{variable}` , pass the variable in the `params` field of the JSON RPC request.

Select a topic to learn about which APIs are supported for each template:

###### Topics

  * Agents for Amazon Bedrock Runtime

  * Amazon Bedrock Runtime

  * Amazon CloudWatch

  * Amazon DynamoDB

  * Asana

  * BambooHR

  * Brave Search

  * Coinbase x402 Bazaar

  * The Confluence Cloud REST API v2

  * The Jira Cloud platform

  * Microsoft Exchange

  * Microsoft OneDrive

  * Microsoft SharePoint

  * Microsoft Teams

  * PagerDuty Advance

  * Salesforce Lightning Platform

  * ServiceNow

  * Slack Web

  * Smartsheet

  * Tavily Search

  * Zendesk Suite

  * Zoom


### Agents for Amazon Bedrock Runtime

The following list provides key information for this template

  * Server URL – https://bedrock-agent-runtime. `{region}` .amazonaws.com

Replace `{region}` with an actual value. Look up supported Regions at [Agents for Amazon Bedrock runtime APIs](<https://docs.aws.amazon.com/general/latest/gr/bedrock.html#bra-rt>).

  * Outbound authentication types accepted:

    * IAM credentials of gateway service role


To learn more about the Amazon Bedrock Agents Runtime API, see the [Agents for Amazon Bedrock API reference](<https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Operations_Agents_for_Amazon_Bedrock_Runtime.html>)

The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  CreateSession |  / |  Creates a session to temporarily store conversations for generative AI applications.  
POST |  DeleteAgentMemory |  / |  Deletes a memory from an agent.  
POST |  DeleteSession |  / |  Deletes a session for temporarily storing conversations for generative AI applications.  
POST |  EndSession |  / |  Ends a session for temporarily storing conversations for generative AI applications.  
POST |  GenerateQuery |  / |  Generates a query to submit to an Amazon Bedrock knowledge base.  
POST |  GetAgentMemory |  / |  Gets a memory from an agent.  
POST |  GetSession |  / |  Gets a session for temporarily storing conversations for generative AI applications.  
POST |  InvokeAgent |  / |  Invokes an Amazon Bedrock agent.  
POST |  InvokeInlineAgent |  / |  Invokes an agent that you define inline.  
POST |  ListSessions |  / |  Lists sessions for temporarily storing conversations for generative AI applications.  
POST |  ListTagsForResource |  / |  Lists tags for an Agents for Amazon Bedrock Runtime resource.  
POST |  OptimizePrompt |  / |  Optimizes a prompt for a specific task.  
POST |  Rerank |  / |  Reranks the relevance of cited sources based on a query.  
POST |  Retrieve |  / |  Retrieves results from querying a knowledge base.  
POST |  RetrieveAndGenerate |  / |  Generate a natural language response based on results retrieved from querying a knowledge base.  
POST |  TagResource |  / |  Tag an Agents for Amazon Bedrock resource.  
POST |  UntagResource |  / |  Untag an Agents for Amazon Bedrock resource.  
POST |  UpdateSession |  / |  Update a session for temporarily storing conversations for generative AI applications.  
  
### Amazon Bedrock Runtime

The following list provides key information for this template

  * Server URL – https://bedrock-runtime. `{region}` .amazonaws.com

Replace `{region}` with an actual value. look up supported Regions at [Amazon Bedrock runtime APIs](<https://docs.aws.amazon.com/general/latest/gr/bedrock.html#br-rt>) ).

  * Outbound authentication types accepted:

    * IAM credentials of gateway service role


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  Converse |  / |  Invoke an Amazon Bedrock model to generate a response in a conversational interface.  
POST |  ApplyGuardrail |  / |  Apply a guardrail to content.  
POST |  InvokeModel |  / |  Invoke an Amazon Bedrock model to generate a response for a prompt.  
  
### Amazon CloudWatch

The following list provides key information for this template

  * Server URL – https://monitoring. `{region}` .amazonaws.com

Replace `{region}` with an actual value. Look up supported Regions at [Amazon CloudWatch endpoints and quotas](<https://docs.aws.amazon.com/general/latest/gr/cw_region.html>).

  * Outbound authentication types accepted:

    * IAM credentials of gateway service role


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  DescribeAlarmHistory |  / |  Retrieve the history for an alarm you’ve set up.  
POST |  DescribeAlarms |  / |  Retrieve information about specific alarms.  
POST |  DescribeAlarmsForMetric |  / |  Retrieve information about alarms for a metric.  
POST |  DescribeAnomalyDetectors |  / |  Retrieve anomaly detection models that you’ve created in your account.  
POST |  DescribeInsightRules |  / |  Retrieve a list of Contributor Insights rules in your account.  
POST |  DisableAlarmActions |  / |  Disable actions for the specified alarms.  
POST |  DisableInsightRules |  / |  Disable the specified Contributor Insights rules.  
POST |  GetDashboard |  / |  Display the details of the dashboard that you specify.  
POST |  GetInsightRuleReport |  / |  Get the time series data collected by a Contributor Insights rule.  
POST |  GetMetricData |  / |  Get metric values.  
POST |  GetMetricStatistics |  / |  Get statistics for a specified metric.  
POST |  GetMetricStream |  / |  Get information about a metric stream.  
POST |  GetMetricWidgetImage |  / |  Get a snapshot graph of a metric as a bitmap image.  
POST |  ListDashboards |  / |  Return a list of dashboards.  
POST |  ListManagedInsightRules |  / |  Return a list of managed Contributor Insights rules.  
POST |  ListMetricStreams |  / |  Return a list of metric streams.  
POST |  ListMetrics |  / |  Retrieve a list of metrics.  
POST |  ListTagsForResource |  / |  List tags for a CloudWatch resource.  
  
### Amazon DynamoDB

The following list provides key information for this template

  * Server URL – https://dynamodb. `{region}` .amazonaws.com

Replace `{region}` with an actual value. Look up supported Regions at [Amazon DynamoDB endpoints and quotas](<https://docs.aws.amazon.com/general/latest/gr/ddb.html>).

  * Outbound authentication types accepted:

    * IAM credentials of gateway service role


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  BatchExecuteStatement |  / |  Perform batch read or writes on data using PartiQL.  
POST |  BatchGetItem |  / |  Returns the attributes of items from one or more tables.  
POST |  BatchWriteItem |  / |  Puts or deletes items in one or more tables.  
POST |  CreateBackup |  / |  Create a backup for a table.  
POST |  CreateTable |  / |  Create a table.  
POST |  DeleteItem |  / |  Delete an item from a table.  
POST |  DeleteTable |  / |  Delete a table and all its items.  
POST |  DescribeBackup |  / |  Get information about a backup.  
POST |  DescribeContinuousBackups |  / |  Check the status of continuous backups and point in time recovery on a specified table.  
POST |  DescribeEndpoints |  / |  Return regional endpoint information.  
POST |  DescribeLimits |  / |  Return your current provisioned-capacity quotas for your account in an AWS Region and for a table you create in it.  
POST |  DescribeTable |  / |  Get information about a table.  
POST |  DescribeTimeToLive |  / |  Get information about the time to live (TTL) status on a specified table.  
POST |  ExecuteStatement |  / |  Perform a read or singleton write on data using PartiQL.  
POST |  ExecuteTransaction |  / |  Perform transactional reads or writes on data using PartiQL.  
POST |  GetItem |  / |  Get a set of attributes for an item in your data.  
POST |  GetResourcePolicy |  / |  Get a resource-based IAM policy attached to a resource, such as a table or stream.  
POST |  ListBackups |  / |  List backups for a table.  
POST |  ListGlobalTables |  / |  List all global tables that have a replica in the specified Region.  
POST |  ListTables |  / |  List table names associated with an account and endpoint.  
POST |  ListTagsOfResource |  / |  List the tags for a DynamoDB resource.  
POST |  PutItem |  / |  Create or update an item in a table.  
POST |  PutResourcePolicy |  / |  Attach a resource-based IAM policy to a resource, such as a table or stream.  
POST |  Query |  / |  Return the results for a database query.  
POST |  Scan |  / |  Return items and item attributes by accessing every item in a table or secondary index.  
POST |  TagResource |  / |  Add a tag to a DynamoDB resource.  
POST |  TransactGetItems |  / |  Retrieve items from one or more tables in the same account and Region.  
POST |  TransactWriteItems |  / |  Carry out the specified action on items in one or more tables in the same account and Region.  
POST |  UntagResource |  / |  Remove a tag from a DynamoDB resource.  
POST |  UpdateItem |  / |  Modify an item’s attributes or add the item to the table if it doesn’t exist.  
POST |  UpdateTable |  / |  Modify provisioned throughput settings, global secondary indexes, or DynamoDB Streams settings for a table.  
  
### Asana

The following list provides key information for this template

  * Server URL – https://app.asana.com/api/1.0

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  createTask |  /tasks |  Create new task in workspace  
PUT |  updateTask |  /tasks/ `{task_gid}` |  Update existing task details  
  
### BambooHR

The following list provides key information for this template

  * Server URL – https://api.bamboohr.com/api/gateway.php/ `{companyDomain}`

  * Outbound authentication types accepted:

    * OAuth2


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  getCompanyInformation |  /v1/company_information |  View company details  
GET |  getCompanyEINs |  /v1/company_eins |  View company tax IDs  
GET |  getEmployee |  /v1/employees/ `{employeeId}` |  Retrieve employee information  
POST |  updateEmployee |  /v1/employees/ `{employeeId}` |  Update employee information  
POST |  addEmployee |  /v1/employees |  Add new employee with basic info  
GET |  getEmployeesDirectory |  /v1/employees/directory |  View employee directory  
GET |  getTimeOffTypes |  /v1/meta/time_off/types |  View types of time off  
GET |  getTimeOffPolicies |  /v1/meta/time_off/policies |  View time off policy list  
GET |  getTimeOffRequests |  /v1/time_off/requests |  View time off requests  
PUT |  addTimeOffRequest |  /v1/employees/ `{employeeId}` /time_off/request |  Submit time off request  
PUT |  changeRequestStatus |  /v1/time_off/requests/ `{requestId}` /status |  Update time off request status  
PUT |  adjustTimeOffBalance |  /v1/employees/ `{employeeId}` /time_off/balance_adjustment |  Adjust employee time off balance  
PUT |  assignTimeOffPolicies |  /v1_1/employees/ `{employeeId}` /time_off/policies |  Assign employee time off policies  
GET |  listTimeOffPolicies |  /v1/employees/ `{employeeId}` /time_off/policies |  View time off policies  
GET |  estimateFutureTimeOffBalances |  /v1/employees/ `{employeeId}` /time_off/calculator |  Calculate future time off estimates  
GET |  getWhosOutList |  /v1/time_off/whos_out |  See who’s on leave  
GET |  listEmployeeFiles |  /v1/employees/ `{employeeId}` /files/view |  View employee documents  
POST |  uploadEmployeeFile |  /v1/employees/ `{employeeId}` /files |  Upload Employee File  
GET |  getEmployeeTableRow |  /v1/employees/ `{employeeId}` /tables/ `{table}` |  Get employee table data  
  
### Brave Search

The following list provides key information for this template

  * Server URL – https://api.search.brave.com/res/v1

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  BraveWebSearch |  /web/search |  Performs a web search query  
  
### Coinbase x402 Bazaar

[Coinbase x402 Bazaar](<https://docs.cdp.coinbase.com/x402/bazaar>) exposes discovery endpoints that let developers and AI agents browse and search for x402-enabled services. You can add the Coinbase x402 Bazaar MCP server as a target in a Gateway via the AWS Management Console or CLI.

The following list provides key information for this template:

  * Server URL — `https://api.cdp.coinbase.com/platform/v2/x402/discovery/mcp`

  * Outbound authentication types accepted:

    * No Authorization (selected by default)


For detailed setup instructions (console, CLI, SDK, and Strands), see [Coinbase Bazaar via AgentCore Gateway](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-connect-bazaar.html>) in the payments guide. To set up the Payment Manager and Connector required for processing payments, see [Create a Payment Manager and Connector](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./payments-create-manager.html>).

### The Confluence Cloud REST API v2

The following list provides key information for this template

  * Server URL – https:// `{sub-domain}` .atlassian.net

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  getPages |  /wiki/api/v2/pages |  Get pages  
POST |  createPage |  /wiki/api/v2/pages |  Create page  
PUT |  updatePage |  /wiki/api/v2/pages/ `{id}` |  Update page  
GET |  getPageById |  /wiki/api/v2/pages/ `{id}` |  Get page by id  
GET |  searchByCQL |  /wiki/rest/api/search |  Search content  
GET |  getSpaces |  /wiki/api/v2/spaces |  Get spaces  
  
### The Jira Cloud platform

The following list provides key information for this template

  * Server URL – https://api.atlassian.com/ex/jira/ `{customerInstanceId}`

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  moveIssuesToBacklog |  /rest/agile/1.0/backlog/issue |  Move issues to backlog  
GET |  GetAllBoards |  /rest/agile/1.0/board |  Get boards  
GET |  getBoard |  /rest/agile/1.0/board/ { boardId} |  Get board  
GET |  getAllSprints |  /rest/agile/1.0/board/ { boardId}/sprint |  Get all sprints  
POST |  createSprint |  /rest/agile/1.0/sprint |  Create sprint  
DELETE |  deleteSprint |  /rest/agile/1.0/sprint/ { sprintId} |  Delete sprint  
GET |  getSprint |  /rest/agile/1.0/sprint/ { sprintId} |  Get sprint  
PUT |  updateSprint |  /rest/agile/1.0/sprint/ { sprintId} |  Update sprint  
POST |  moveIssuesToSprintAndRank |  /rest/agile/1.0/sprint/ { sprintId}/issue |  Move issues to sprint and rank  
GET |  getAttachmentContent |  /rest/api/3/attachment/content/ `{id}` |  Get attachment content  
POST |  createIssue |  /rest/api/3/issue |  Create an issue  
PUT |  editIssue |  /rest/api/3/issue/ { issueIdOrKey} |  Edit issue  
GET |  getIssue |  /rest/api/3/issue/ { issueIdOrKey} |  Get issue  
DELETE |  deleteIssue |  /rest/api/3/issue/ { issueIdOrKey} |  Delete issue  
POST |  addAttachment |  /rest/api/3/issue/ { issueIdOrKey}/attachments |  Add attachment  
GET |  getComments |  /rest/api/3/issue/ { issueIdOrKey}/comment |  Get comments  
POST |  addComment |  /rest/api/3/issue/ { issueIdOrKey}/comment |  Add comment  
DELETE |  deleteComment |  /rest/api/3/issue/ { issueIdOrKey}/comment/ `{id}` |  Delete comment  
PUT |  updateComment |  /rest/api/3/issue/ { issueIdOrKey}/comment/ `{id}` |  Update comment  
GET |  getTransitions |  /rest/api/3/issue/ { issueIdOrKey}/transitions |  Get transitions  
POST |  DoTransition |  /rest/api/3/issue/ { issueIdOrKey}/transitions |  Transition issue  
GET |  getIssueTypesForProject |  /rest/api/3/issuetype/project |  Get issue types for project  
GET |  getAllLabels |  /rest/api/3/label |  Get all labels  
GET |  getPriorities |  /rest/api/3/priority |  Get priorities  
POST |  createProject |  /rest/api/3/project |  Create project  
GET |  listProjects |  /rest/api/3/project |  Get all projects  
GET |  searchProjects |  /rest/api/3/project/search |  Get projects paginated  
DELETE |  deleteProject |  /rest/api/3/project/ { projectIdOrKey} |  Delete project  
GET |  getProject |  /rest/api/3/project/ { projectIdOrKey} |  Get project  
PUT |  updateProject |  /rest/api/3/project/ { projectIdOrKey} |  Update project  
GET |  searchStatuses |  /rest/api/3/statuses/search |  Search statuses paginated  
GET |  SearchIssues |  /rest/api/3/search/jql |  Search for issues using JQL enhanced search (GET)  
GET |  getAllUsers |  /rest/api/3/users |  Get all users default  
GET |  findUsers |  /rest/api/3/user/search |  Find users  
  
### Microsoft Exchange

The following list provides key information for this template

  * Server URL – https://graph.microsoft.com/v1.0

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  sendUserEmail |  /users/ `{userId}` /microsoft.graph.sendMail |  Send Email  
GET |  listUserMails |  /users/ `{userId}` /messages |  Get messages from users  
GET |  ListFolderMessage |  /users/ `{userId}` /mailFolders/ `{mailFolderId}` /messages |  Get messages from users  
GET |  getEmailById |  /users/ `{userId}` /messages/ `{messageId}` |  Get messages from users  
PATCH |  updateEmail |  /users/ `{userId}` /messages/ `{messageId}` |  Update the navigation property messages in users  
DELETE |  deleteEmail |  /users/ `{userId}` /messages/ `{messageId}` |  Delete navigation property messages for users  
POST |  moveEmailToFolder |  /users/ `{userId}` /messages/ `{messageId}` /move |  Move Email to Folder  
POST |  forwardUserEmail |  /users/ `{userId}` /messages/ `{messageId}` /forward |  Forward User Email  
POST |  replyToEmail |  /users/ `{userId}` /messages/ `{messageId}` /reply |  Reply to a message  
GET |  listEmailAttachment |  /users/ `{userId}` /messages/ `{messageId}` /attachments |  Get attachments from users  
GET |  getAttachmentById |  /users/ `{userId}` /messages/ `{messageId}` /attachments/ `{attachmentId}` |  Get attachments from users  
GET |  listCalendarEvents |  /users/ `{userId}` /calendar/events |  Get events from users  
POST |  createCalendarEvent |  /users/ `{userId}` /calendar/events |  Create new navigation property to events for users  
PATCH |  updateCalendarEvent |  /users/ `{userId}` /calendar/events/ `{eventId}` |  Update the calendar events in users  
POST |  findMeetingTimes |  /users/ `{userId}` /findMeetingTimes |  Suggest meeting times and locations  
GET |  listMailFolders |  /users/ `{userId}` /mailFolders |  Get mailFolders from users  
GET |  listContacts |  /users/ `{userId}` /contacts |  Get contacts from users  
GET |  listUsers |  /users |  List users  
GET |  getUser |  /users/ `{userId}` |  Get a user  
GET |  getMailboxSettings |  /users/ `{userId}` /mailboxSettings |  Get current mailbox settings of the user.  
GET |  listPlaces |  /places/microsoft.graph.room |  List places  
  
### Microsoft OneDrive

The following list provides key information for this template

  * Server URL – https://graph.microsoft.com/v1.0

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  getUser |  /users/ `{userId}` |  Get a user  
GET |  getDrive |  /users/ `{userId}` /drive |  Get drive from users  
GET |  listItem |  /users/ `{userId}` /drive/root/children |  Get items from users  
POST |  createItem |  /users/ `{userId}` /drive/root/children |  Create new navigation property to items for users  
GET |  getItem |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` |  Get items from users  
PATCH |  updateItem |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` |  Update file or folder metadata  
DELETE |  deleteItem |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` |  Delete navigation property items for users  
GET |  listChildren |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /children |  Get children from users  
POST |  copyItem |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /copy |  Copy item within a drive  
POST |  addPermisions |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /invite |  Add permission  
PUT |  uploadFile |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` :/ `{fileName}` :/content |  Upload new file  
POST |  addSheet |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/add |  Add worksheet  
GET |  readSheet |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` |  Get worksheets from drives  
PATCH |  updateSheet |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` |  Update worksheet  
DELETE |  deleteSheet |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` |  Delete worksheet  
GET |  readCell |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /cell(row= `{row}` ,column= `{column}` ) |  Read cell within a sheet  
PATCH |  writeCell |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /cell(row= `{row}` ,column= `{column}` ) |  Write cell within a sheet  
GET |  readRange |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ') |  Read range  
PATCH |  writeRange |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ') |  Write range  
POST |  deleteRange |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ')/delete |  Delete Range within a sheet  
GET |  listSheets |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets |  Get worksheets from drives  
GET |  readUsedRange |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /usedRange |  Read used range of a sheet  
POST |  clearRange |  /users/ `{userId}` /drives/ `{driveId}` /items/ `{driveItemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ')/clear |  Clear range within a sheet  
  
### Microsoft SharePoint

The following list provides key information for this template

  * Server URL – https://graph.microsoft.com/v1.0

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  listSites |  /sites |  Search for sites  
GET |  getSite |  /sites/ `{siteId}` |  Get a site resource  
GET |  listLists |  /sites/ `{siteId}` /lists |  Get lists in a site  
GET |  getList |  /sites/ `{siteId}` /lists/ `{listId}` |  List operations on a list  
GET |  listItem |  /sites/ `{siteId}` /lists/ `{listId}` /items |  Enumerate items in a list  
POST |  createItem |  /sites/ `{siteId}` /lists/ `{listId}` /items |  Create a new item in a list  
GET |  getItem |  /sites/ `{siteId}` /lists/ `{listId}` /items/ `{listItemId}` |  Get listItem  
PATCH |  updateItem |  /sites/ `{siteId}` /lists/ `{listId}` /items/ `{listItemId}` |  Update the navigation property items in sites  
DELETE |  deleteItem |  /sites/ `{siteId}` /lists/ `{listId}` /items/ `{listItemId}` |  Delete an item from a list  
POST |  addSheet |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/add |  Add worksheet  
GET |  readSheet |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` |  Read a sheet  
DELETE |  deleteSheet |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` |  Delete a new sheet  
PATCH |  updateSheet |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` |  Update worksheet  
GET |  listSheets |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets |  List worksheet collection  
PUT |  uploadFile |  /sites/ `{siteId}` /drive/items/ `{parentId}` :/ `{fileName}` :/content |  Create or upload a file  
GET |  readCell |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /cell(row= `{row}` ,column= `{column}` ) |  Read cell  
PATCH |  writeCell |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /cell(row= `{row}` ,column= `{column}` ) |  Write cell  
GET |  readRange |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ') |  Read range  
PATCH |  writeRange |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ') |  Write range  
POST |  deleteRange |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ')/delete |  Delete range  
POST |  clearRange |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /range(address=' `{address}` ')/clear |  Clear range  
GET |  getUsedRange |  /sites/ `{siteId}` /drive/items/ `{itemId}` /workbook/worksheets/ `{worksheetIdOrName}` /usedRange |  Get used range  
  
### Microsoft Teams

The following list provides key information for this template

  * Server URL – https://graph.microsoft.com/v1.0

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  listChats |  /chats |  List chats  
POST |  CreateChat |  /chats |  Create a new chat object  
GET |  GetIndividualChat |  /chats/ `{chatId}` |  Get chat  
GET |  ListAllChatMessages |  /chats/ `{chatId}` /messages |  List messages in a chat  
POST |  SendChatMessage |  /chats/ `{chatId}` /messages |  Send a message in a chat  
GET |  listTeams |  /teams |  List teams  
GET |  GetTeam |  /teams/ `{teamId}` |  Get team  
GET |  ListAllChannels |  /teams/ `{teamId}` /channels |  List channels  
POST |  CreateChannel |  /teams/ `{teamId}` /channels |  Create channel  
GET |  GetChannel |  /teams/ `{teamId}` /channels/ `{channelId}` |  Get channel  
POST |  InviteChannelMember |  /teams/ `{teamId}` /channels/ `{channelId}` /members |  Add conversationMember  
GET |  ListAllChannelMessages |  /teams/ `{teamId}` /channels/ `{channelId}` /messages |  List channel messages  
POST |  SendChannelMessage |  /teams/ `{teamId}` /channels/ `{channelId}` /messages |  Send a message in a channel  
POST |  ReplyToChannelMessage |  /teams/ `{teamId}` /channels/ `{channelId}` /messages/ `{chatMessageId}` /replies |  Reply to a message in a channel  
GET |  ListAllTeamMembers |  /teams/ `{teamId}` /members |  List members of team  
POST |  InviteUserToTeam |  /teams/ `{teamId}` /members |  Add member to team  
GET |  listUsers |  /users |  List users  
GET |  getUser |  /users/ `{userId}` |  Get a user  
POST |  CreateOnlineTeamsMeeting |  /users/ `{userId}` /onlineMeetings |  Create an online meeting.  
GET |  GetOnlineTeamsMeeting |  /users/ `{userId}` /onlineMeetings/ `{meetingId}` |  Get an online meeting.  
GET |  ListAllRecordings |  /users/ `{userId}` /onlineMeetings/ `{meetingId}` /recordings |  List all recordings.  
GET |  ListAllTranscripts |  /users/ `{userId}` /onlineMeetings/ `{meetingId}` /transcripts |  List all transcripts.  
  
### PagerDuty Advance

The following list provides key information for this template

  * Server URL – https://api.pagerduty.com

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  listIncidents |  /incidents |  View incidents in my account  
POST |  createIncident |  /incidents |  Create new incident  
GET |  getIncident |  /incidents/ `{id}` |  View incident details  
PUT |  updateIncident |  /incidents/ `{id}` |  Update an incident  
GET |  listUsers |  /users |  View user list  
  
### Salesforce Lightning Platform

The following list provides key information for this template

  * Server URL – https:// `{domainName}` .develop.my.salesforce.com/services/data/v60.0

  * Outbound authentication types accepted:

    * OAUTH2


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  getAccountList |  /sobjects/Account |  View all accounts  
POST |  createAccount |  /sobjects/Account |  Create new account  
GET |  getAccount |  /sobjects/Account/ `{id}` |  Get account details  
DELETE |  deleteAccount |  /sobjects/Account/ `{id}` |  Remove account  
PATCH |  updateAccount |  /sobjects/Account/ `{id}` |  Edit account details  
POST |  createAccountTeamMember |  /sobjects/AccountTeamMember |  Add account team member  
GET |  getAccountTeamMember |  /sobjects/AccountTeamMember/ `{id}` |  View account team member  
DELETE |  deleteAccountTeamMember |  /sobjects/AccountTeamMember/ `{id}` |  Remove account team member  
GET |  getCaseList |  /sobjects/Case |  View all cases  
POST |  createCase |  /sobjects/Case |  Create new case  
GET |  getCase |  /sobjects/Case/ `{id}` |  View case details  
DELETE |  deleteCase |  /sobjects/Case/ `{id}` |  Remove case  
PATCH |  updateCase |  /sobjects/Case/ `{id}` |  Edit case  
GET |  getCampaignList |  /sobjects/Campaign |  View all campaigns  
POST |  createCampaign |  /sobjects/Campaign |  Create new campaign  
GET |  getCampaign |  /sobjects/Campaign/ `{id}` |  Get campaign details  
DELETE |  deleteCampaign |  /sobjects/Campaign/ `{id}` |  Remove campaign  
PATCH |  updateCampaign |  /sobjects/Campaign/ `{id}` |  Edit campaign  
POST |  createCampaignMember |  /sobjects/CampaignMember |  Add campaign member  
GET |  getCampaignMember |  /sobjects/CampaignMember/ `{id}` |  Get campaign member details  
DELETE |  deleteCampaignMember |  /sobjects/CampaignMember/ `{id}` |  Remove campaign member  
GET |  getContactList |  /sobjects/Contact |  View all contacts  
POST |  createContact |  /sobjects/Contact |  Create new contact  
GET |  getContact |  /sobjects/Contact/ `{id}` |  Get contact information  
DELETE |  deleteContact |  /sobjects/Contact/ `{id}` |  Remove contact  
PATCH |  updateContact |  /sobjects/Contact/ `{id}` |  Edit contact  
POST |  createFeedItem |  /sobjects/FeedItem |  Create new feed item  
GET |  getFeedItem |  /sobjects/FeedItem/ `{id}` |  View feed item  
DELETE |  deleteFeedItem |  /sobjects/FeedItem/ `{id}` |  Remove feed item  
PATCH |  updateFeedItem |  /sobjects/FeedItem/ `{id}` |  Edit feed item  
GET |  getLeadList |  /sobjects/Lead |  View all leads  
POST |  createLead |  /sobjects/Lead |  Create new lead  
GET |  getLead |  /sobjects/Lead/ `{id}` |  Get lead details  
DELETE |  deleteLead |  /sobjects/Lead/ `{id}` |  Remove lead  
PATCH |  updateLead |  /sobjects/Lead/ `{id}` |  Edit lead details  
GET |  getOpportunityList |  /sobjects/Opportunity |  View list of opportunities  
POST |  createOpportunity |  /sobjects/Opportunity |  Create new opportunity  
GET |  getOpportunity |  /sobjects/Opportunity/ `{id}` |  View opportunity details  
DELETE |  deleteOpportunity |  /sobjects/Opportunity/ `{id}` |  Remove opportunity  
PATCH |  updateOpportunity |  /sobjects/Opportunity/ `{id}` |  Edit opportunity  
GET |  getUser |  /sobjects/User |  View user details  
GET |  describeSObject |  /sobjects/ `{sObject}` /describe |  Get object metadata and field details  
GET |  queryAccounts |  /query |  Executes a SOQL query to retrieve account data from Salesforce  
  
### ServiceNow

The following list provides key information for this template

  * Server URL – https:// `{instance}` .service-now.com

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  retrieveAttachmentsMetadata |  /api/now/attachment |  Get all attachments info  
POST |  uploadBinaryAttachment |  /api/now/attachment/file |  Upload binary file  
GET |  retrieveAttachmentMetadata |  /api/now/attachment/ `{sys_id}` |  Get attachment info  
DELETE |  deleteAttachment |  /api/now/attachment/ `{sys_id}` |  Remove attachment  
GET |  retrieveAttachmentContent |  /api/now/attachment/ `{sys_id}` /file |  Get attachment content  
GET |  listIncidents |  /api/now/table/incident |  View all incidents  
POST |  createIncident |  /api/now/table/incident |  Create new incident  
GET |  getIncident |  /api/now/table/incident/ `{sys_id}` |  View incident details  
PATCH |  updateIncident |  /api/now/table/incident/ `{sys_id}` |  Edit incident  
DELETE |  deleteIncident |  /api/now/table/incident/ `{sys_id}` |  Remove incident  
GET |  listProblem |  /api/now/table/problem |  View all problems  
POST |  createProblem |  /api/now/table/problem |  Create new problem  
GET |  getProblem |  /api/now/table/problem/ `{sys_id}` |  View problem details  
DELETE |  deleteProblem |  /api/now/table/problem/ `{sys_id}` |  Remove problem  
PATCH |  updateProblem |  /api/now/table/problem/ `{sys_id}` |  Edit problem  
POST |  createKnowledgeBaseArticle |  /api/now/table/kb_knowledge |  Create KB article  
DELETE |  deleteKnowledgeBaseArticle |  /api/now/table/kb_knowledge/ `{sys_id}` |  Remove KB article  
PATCH |  updateKnowledgeBaseArticle |  /api/now/table/kb_knowledge/ `{sys_id}` |  Edit KB article  
GET |  listChoices |  /api/now/table/sys_choice |  View all system choices  
GET |  listUsers |  /api/now/table/sys_user |  View all users  
GET |  listChangeRequest |  /api/sn_chg_rest/change |  View all change requests  
POST |  createChangeRequest |  /api/sn_chg_rest/change |  Create new change request  
GET |  getChangeRequest |  /api/sn_chg_rest/change/ `{sys_id}` |  View change request details  
DELETE |  deleteChangeRequest |  /api/sn_chg_rest/change/ `{sys_id}` |  Remove change request  
PATCH |  updateChangeRequest |  /api/sn_chg_rest/change/ `{sys_id}` |  Edit change request  
  
### Slack Web

The following list provides key information for this template

  * Server URL – https://slack.com/api

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  chatPostEphemeral |  /chat.postEphemeral |  Send temporary message  
POST |  chatPostMessage |  /chat.postMessage |  Send new message  
POST |  conversationsCreate |  /conversations.create |  Start new channel  
GET |  conversationsHistory |  /conversations.history |  View message history  
POST |  conversationsInvite |  /conversations.invite |  Add users to channel  
POST |  conversationsJoin |  /conversations.join |  Enter existing conversation  
POST |  conversationsKick |  /conversations.kick |  Remove user from chat  
POST |  conversationsLeave |  /conversations.leave |  Exit conversation  
GET |  conversationsList |  /conversations.list |  View all channels  
GET |  conversationsMembers |  /conversations.members |  View chat participants  
POST |  conversationsOpen |  /conversations.open |  Start or resume direct message  
GET |  conversationsReplies |  /conversations.replies |  View message thread  
POST |  conversationsSetTopic |  /conversations.setTopic |  Set chat topic  
GET |  filesList |  /files.list |  List for a team, in a channel, or from a user with applied filters.  
GET |  filesInfo |  /files.info |  View file details  
GET |  searchAll |  /search.all |  Search messages and files  
POST |  userGroupsCreate |  /usergroups.create |  Create new user group  
GET |  userGroupsList |  /usergroups.list |  View all user groups  
POST |  userGroupsUsersUpdate |  /usergroups.users.update |  Edit user group  
GET |  usersList |  /users.list |  View team members  
POST |  remindersAdd |  /reminders.add |  Set new reminder  
POST |  usersProfileSet |  /users.profile.set |  Update user profile  
GET |  GetUploadURLExternal |  /files.getUploadURLExternal |  Get an upload URL for a file to be uploaded externally to Slack.  
POST |  completeUploadExternal |  /files.completeUploadExternal |  Finalize file upload to Slack. Should be used after Upload File.  
  
### Smartsheet

The following list provides key information for this template

  * Server URL – https://api.smartsheet.com/2.0

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  listSearch |  /search |  Search all sheets  
GET |  getSheet |  /sheets/ `{sheetId}` |  View sheet details  
GET |  listReports |  /reports |  View all reports  
GET |  getReport |  /reports/ `{reportId}` |  View report information  
  
### Tavily Search

The following list provides key information for this template

  * Server URL – https://api.tavily.com

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
POST |  TavilySearchPost |  /search |  ExecuteasearchqueryusingTavilySearch  
POST |  TavilySearchExtract |  /extract |  ExtractwebpagecontentfromURLsusingTavilyExtract  
  
### Zendesk Suite

The following list provides key information for this template

  * Server URL – https:// `{customerInstanceId}` .zendesk.com

  * Outbound authentication types accepted:

    * OAUTH2


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  listSearchResults |  /api/v2/search |  List Search Results  
GET |  listTickets |  /api/v2/tickets |  List Tickets  
POST |  createTicket |  /api/v2/tickets |  Create Ticket  
GET |  showTicket |  /api/v2/tickets/ `{ticket_id}` |  Show Ticket  
PUT |  updateTicket |  /api/v2/tickets/ `{ticket_id}` |  Update Ticket  
GET |  ListTicketEmailCCs |  /api/v2/tickets/ `{ticket_id}` /email_ccs |  List Email CCs for a Ticket  
GET |  ListTicketFollowers |  /api/v2/tickets/ `{ticket_id}` /followers |  List Followers for a Ticket  
GET |  ListTicketIncidents |  /api/v2/tickets/ `{ticket_id}` /incidents |  List Ticket Incidents  
GET |  TicketRelatedInformation |  /api/v2/tickets/ `{ticket_id}` /related |  Ticket Related Information  
  
### Zoom

The following list provides key information for this template

  * Server URL – https://api.zoom.us/v2

  * Outbound authentication types accepted:

    * API key


The following table shows the APIs that you can call if you add this target type to your gateway:

REST API type | Operation name | REST API path | Description  
---|---|---|---  
GET |  recordingsList |  /users/ `{userId}` /recordings |  List all recordings  
GET |  meeting |  /meetings/ `{meetingId}` |  Get a meeting  
GET |  meetings |  /users/ `{userId}` /meetings |  List meetings  
POST |  meetingCreate |  /users/ `{userId}` /meetings |  Create a meeting  
GET |  recordingGet |  /meetings/ `{meetingId}` /recordings |  Get meeting recordings

