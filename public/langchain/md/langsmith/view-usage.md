LangSmith provides several views into your [organization's](lc:langsmith/administration-overview) usage, depending on your [plan](lc:langsmith/pricing-plans) and [hosting type](lc:langsmith/platform-setup). This page explains what data is available, what each metric means, and what limitations apply to [Self-hosted](lc:langsmith/self-hosted).

## Usage views

| View | Where to find it | Who can see it | Plan availability |
|------|-----------------|----------------|-------------------|
| [Usage graph](#usage-graph) |**Enterprise**: Settings > Usage > Usage graph<br></br>**Self-serve**: Settings > Billing > Usage graph | All org members | All plans |
| [Granular usage](#granular-usage) | **Enterprise**: Settings > Usage > Granular usage<br></br>**Self-serve**: Settings > Billing > Granular usage | All org members | All plans |
| [Contract usage](#contract-usage) | **Enterprise**: Settings > Usage > Contract usage<br></br>**Self-serve**: Settings > Billing > Contract usage | Org admins only (`organization:manage`) | Enterprise only |
| [Invoices](#invoices) | Settings > Billing > Invoices | All org members | Self-serve Cloud only |
| [Evaluator spend](lc:langsmith/evaluator-spend) | Evaluators page, evaluator detail | All workspace members | Tracked weekly, resetting at Monday 12AM UTC, separate from the monthly billing period below |

## Usage graph

The usage graph shows aggregate trace consumption for your [organization](lc:langsmith/administration-overview#organizations), broken down by [workspace](lc:langsmith/administration-overview#workspaces). It covers the current billing period and does not show spend—for spend, refer to the invoice.

Navigate to **Settings** → **Billing and Usage** → **Usage Graph**.

### Billable metrics

| Metric | What it counts |
|--------|----------------|
| **LangSmith Traces (Base Charge)** | Every trace sent to LangSmith during the billing period, regardless of data retention tier. |
| **LangSmith Traces (Extended Data Retention Upgrades)** | Traces upgraded to extended retention (400 days by default, [customizable for Enterprise customers](lc:langsmith/data-purging-compliance#customize-extended-retention-policy)). These are charged in addition to the base charge. |
| **LangSmith Deployment Runs** | End-to-end invocations of deployed LangGraph agents. See [LangSmith Deployment billing](lc:langsmith/billing#langsmith-deployment-billing) for pricing details. |
| **LangSmith Fleet Runs** | End-to-end invocations of [Fleet](lc:langsmith/fleet/index) agents. Tracked separately for Cloud-hosted and Self-hosted deployments. |
| **LangSmith Deployment Nodes Executed** | Individual LangGraph node executions across deployed agents. Each step in a deployed agent's graph counts as one node execution. Tracked separately for Cloud-hosted and Self-hosted deployments. |

For more details on trace retention tiers, refer to [Data retention](lc:langsmith/usage-and-billing#data-retention).


> [!NOTE]
>
> The usage graph uses the term `tenant_id` interchangeably with workspace ID.


## Contract usage

Enterprise customers with prepaid commitments can view how much of their contract has been consumed.

Navigate to **Settings** → **Usage Configuration** → **Contract Usage**.

This view shows:

- **Usage summary**: Total usage, total credits, and any overages. Overages occur when usage exceeds your total prepaid commitment.
- **Commitment progress bars**: Visual indicators for each commitment showing percentage consumed and dollar amounts for used vs. remaining. Contracts can have multiple commitments that apply to different time periods (e.g., year 1 and year 2 of a multi-year contract) or different products.
- **Monthly usage chart**: Bar chart showing usage amounts for each month within your contract period.
- **Product rates**: Table of your entitled products and their pricing.


> [!NOTE]
>
> Contract usage requires the [`organization:manage` permission](lc:langsmith/organization-workspace-operations) and is only available to Enterprise customers with prepaid commitments.


> [!NOTE]
>
> If your contract spans multiple organizations under the same billing entity, the contract usage view shows the **combined** usage accrued across all of those organizations, not just the one you're currently viewing. [Granular usage](#granular-usage) is always scoped to a single organization, so to view granular usage for a specific org, switch to that org and view its granular usage separately.


## Invoices

Invoices are available on **self-serve Cloud plans only**. Enterprise Cloud organizations have a separate usage view for tracking spend.

Navigate to **Settings** → **Billing and Usage** → **Invoices** to see how your usage translates to spend. The first invoice shown is a draft of your current month's invoice, reflecting your running spend to date.

## Granular usage

Granular usage gives you trace counts broken down by a dimension you choose (workspace, project, user, or API key) over a time range you select. This is useful for internal chargebacks, identifying high-usage teams, or auditing trace activity.

Navigate to **Settings** → **Billing and Usage** → **Granular Usage**, or use the [granular usage API](lc:langsmith/granular-usage).

### What "traces" means here

The granular usage view counts **traces**: root-level runs and all their child spans counted as a single unit. This is the same unit used for [billing](lc:langsmith/billing). It does not count individual spans, tokens, or model calls separately.

### When usage is recorded

Granular usage records traces by **insertion time** (when the trace was received and stored by LangSmith), not by when it ran in your application. In practice this difference is usually negligible, but traces sent with significant delay (e.g., buffered SDK uploads) may appear in a later time bucket than expected.

For grouping options, time bucket sizes, and API reference, refer to [Granular billable usage](lc:langsmith/granular-usage).

## Self-hosted limitations

[Self-hosted](lc:langsmith/self-hosted) LangSmith have a different set of usage views available compared to [Cloud](lc:langsmith/cloud), due to differences in billing infrastructure.

| **Feature** | **Self-hosted availability** |
|---------|--------------------------|
| Granular usage (trace attribution) | Available with feature flags or version ≥ 0.13.12 |
| Usage graph (aggregate traces) | Available on Helm chart 0.9.5 and later |
| Contract usage | Available when Beacon phone-home is enabled |
| Invoices and payment management | Not available (billing is handled outside LangSmith) |

### Granular usage on self-hosted

Granular usage is available on [Self-hosted](lc:langsmith/self-hosted) but requires explicit opt-in:

- On **LangSmith 0.13.12 and later**, granular usage collection is enabled by default.
- On **earlier versions**, enable it by setting both of the following environment variables:

    ```env
    DEFAULT_ORG_FEATURE_ENABLE_GRANULAR_USAGE_REPORTING=true
    GRANULAR_USAGE_TABLE_ENABLED=true
    ```


> [!WARNING]
>
> Data collection begins from the moment the feature is enabled. There is no backfill of historical usage data prior to enabling it. Plan accordingly when choosing when to enable this feature.


### Aggregate usage on Self-hosted

The usage graph is available on [Self-hosted](lc:langsmith/self-hosted) running Helm chart 0.9.5 or later. LangSmith automatically generates and syncs organization usage charts, available under **Settings** → **Usage and billing** → **Usage graph**:

- **Usage by Workspace**: trace counts (root runs) per workspace
- **Organization Usage**: total trace counts across the organization

Charts refresh every 5 minutes to include new workspaces and are not editable.

For programmatic access to trace counts, see [View trace counts across your organization](lc:langsmith/self-host-organization-charts).

## Related resources

- [Granular billable usage API reference](lc:langsmith/granular-usage)
- [Manage billing](lc:langsmith/billing)
- [Data retention and usage limits](lc:langsmith/usage-and-billing#data-retention)
- [Track and limit evaluator spend](lc:langsmith/evaluator-spend)
- [Organization and workspace operations](lc:langsmith/organization-workspace-operations)
