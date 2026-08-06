# Record lifecycle - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-record-lifecycle.html

---

# Record lifecycle

###### Upcoming namespace migration

AWS Agent Registry is currently in public preview under the bedrock-agentcore namespace. Starting August 6, 2026, the service moves to the agent-registry namespace. If you use AWS Agent Registry, you must update your endpoints, IAM policies, SDK clients, CLI scripts, and registry data. For more information about migrating from public preview, see [Comprehensive registry migration guide](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./registry-faq.html>).

## Status transitions

```text
Create → DRAFT → Submit → PENDING_APPROVAL → Approve → APPROVED
                               │                          │
                               │ Reject                   │ Edit (new DRAFT
                               ▼                          │  revision; approved
                          REJECTED ── Approve (direct) ───┘  stays in search)
                               │
                               └── Edit → DRAFT

         Any status → DEPRECATED (terminal)
```
## Transition details

  * **Create** → DRAFT. Edit freely before submitting.

  * **Submit** → PENDING_APPROVAL. Auto-approval skips to APPROVED. Amazon EventBridge notification sent.

  * **Approve/Reject** → Curator uses UpdateRegistryRecordStatus. Can directly approve a REJECTED record.

  * **Deprecate** → Terminal from any status. Cannot be undone.


## How edits affect status

Current status | Effect of edit  
---|---  
DRAFT |  Updated in place. Stays DRAFT.  
PENDING_APPROVAL |  New DRAFT revision. Pending revision discarded. Not visible in search (never approved).  
APPROVED |  New DRAFT revision. Approved revision stays visible in search until new revision is approved.  
REJECTED |  New DRAFT revision. Must go through normal submit-and-approve flow again.  
DEPRECATED |  Deprecated Records cannot be edited; Deprecated is a Terminal state  
  
## Dual-revision behavior

Editing an APPROVED record creates a new DRAFT revision while the approved revision remains active:

  * **Search and MCP endpoint** — Returns the approved revision.

  * **Get and List APIs** — Returns the latest (DRAFT) revision.


Once the edited revision of the record is reviewed and approved, then Search and MCP Endpoint also start showing the new (approved) revision.

## Visibility rules

API | Returns  
---|---  
SearchRegistryRecords |  Only approved revisions  
InvokeRegistryMcp |  Only approved revisions  
GetRegistryRecord |  Latest revision (any status)  
ListRegistryRecords |  Latest revision (any status)

