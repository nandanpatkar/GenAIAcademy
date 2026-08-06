S3-based session manager for cloud storage.

## S3SessionManager

```python
class S3SessionManager(RepositorySessionManager, SessionRepository)
```

Defined in: [src/strands/session/s3\_session\_manager.py:31](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L31)

S3-based session manager for cloud storage.

Creates the following filesystem structure for the session storage:

```bash
/<sessions_dir>/
└── session_<session_id>/
    ├── session.json                # Session metadata
    └── agents/
        └── agent_<agent_id>/
            ├── agent.json          # Agent metadata
            └── messages/
                ├── message_<id1>.json
                └── message_<id2>.json
```

#### \_\_init\_\_

```python
def __init__(session_id: str,
             bucket: str,
             prefix: str = "",
             boto_session: boto3.Session | None = None,
             boto_client_config: BotocoreConfig | None = None,
             region_name: str | None = None,
             endpoint_url: str | None = None,
             **kwargs: Any)
```

Defined in: [src/strands/session/s3\_session\_manager.py:48](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L48)

Initialize S3SessionManager with S3 storage.

**Arguments**:

-   `session_id` - ID for the session ID is not allowed to contain path separators (e.g., a/b).
-   `bucket` - S3 bucket name (required)
-   `prefix` - S3 key prefix for storage organization
-   `boto_session` - Optional boto3 session
-   `boto_client_config` - Optional boto3 client configuration
-   `region_name` - AWS region for S3 storage
-   `endpoint_url` - Custom endpoint URL for S3-compatible storage backends (e.g., MinIO, LocalStack) or VPC endpoints (PrivateLink)
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### create\_session

```python
def create_session(session: Session, **kwargs: Any) -> Session
```

Defined in: [src/strands/session/s3\_session\_manager.py:166](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L166)

Create a new session in S3.

#### read\_session

```python
def read_session(session_id: str, **kwargs: Any) -> Session | None
```

Defined in: [src/strands/session/s3\_session\_manager.py:183](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L183)

Read session data from S3.

#### delete\_session

```python
def delete_session(session_id: str, **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:191](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L191)

Delete session and all associated data from S3.

#### create\_agent

```python
def create_agent(session_id: str, session_agent: SessionAgent,
                 **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:214](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L214)

Create a new agent in S3.

#### read\_agent

```python
def read_agent(session_id: str, agent_id: str,
               **kwargs: Any) -> SessionAgent | None
```

Defined in: [src/strands/session/s3\_session\_manager.py:221](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L221)

Read agent data from S3.

#### update\_agent

```python
def update_agent(session_id: str, session_agent: SessionAgent,
                 **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:229](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L229)

Update agent data in S3.

#### create\_message

```python
def create_message(session_id: str, agent_id: str,
                   session_message: SessionMessage, **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:241](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L241)

Create a new message in S3.

#### read\_message

```python
def read_message(session_id: str, agent_id: str, message_id: int,
                 **kwargs: Any) -> SessionMessage | None
```

Defined in: [src/strands/session/s3\_session\_manager.py:248](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L248)

Read message data from S3.

#### update\_message

```python
def update_message(session_id: str, agent_id: str,
                   session_message: SessionMessage, **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:256](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L256)

Update message data in S3.

#### list\_messages

```python
def list_messages(session_id: str,
                  agent_id: str,
                  limit: int | None = None,
                  offset: int = 0,
                  **kwargs: Any) -> list[SessionMessage]
```

Defined in: [src/strands/session/s3\_session\_manager.py:268](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L268)

List messages for an agent with pagination from S3.

**Arguments**:

-   `session_id` - ID of the session
-   `agent_id` - ID of the agent
-   `limit` - Optional limit on number of messages to return
-   `offset` - Optional offset for pagination
-   `**kwargs` - Additional keyword arguments

**Returns**:

List of SessionMessage objects, sorted by message\_id.

**Raises**:

-   `SessionException` - If S3 error occurs during message retrieval.

#### create\_multi\_agent

```python
def create_multi_agent(session_id: str, multi_agent: "MultiAgentBase",
                       **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:359](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L359)

Create a new multiagent state in S3.

#### read\_multi\_agent

```python
def read_multi_agent(session_id: str, multi_agent_id: str,
                     **kwargs: Any) -> dict[str, Any] | None
```

Defined in: [src/strands/session/s3\_session\_manager.py:366](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L366)

Read multi-agent state from S3.

#### update\_multi\_agent

```python
def update_multi_agent(session_id: str, multi_agent: "MultiAgentBase",
                       **kwargs: Any) -> None
```

Defined in: [src/strands/session/s3\_session\_manager.py:371](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/session/s3_session_manager.py#L371)

Update multi-agent state in S3.
