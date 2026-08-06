This page is a reference hub for enterprise teams and includes information on features that are important for your organization, like [hosting options](#hosting-options), [access control](#access-control), [data privacy](#data-privacy-and-pii), and [cost controls](#cost-controls-and-usage).

> 
For questions about Enterprise [pricing](lc:langsmith/pricing-plans) or to get started, [contact our sales team](https://www.langchain.com/contact-sales).

## Hosting options

Choose how to host LangSmith to match your infrastructure and data residency requirements.

  ### [Cloud](#)
Host LangSmith in LangSmith's managed cloud with US or EU data residency.

  ### [Hybrid](#)
Run the control plane in LangSmith's cloud and your data plane in your own VPC for full data isolation.

  ### [Self-hosted](#)
Host LangSmith entirely within your own infrastructure using Kubernetes.

## User management

Manage users and automate provisioning across your organization.

  ### [User management](#)
Invite users, assign roles, and configure SCIM for automated provisioning and deprovisioning.

  ### [SSO & JIT provisioning](#)
Configure SAML or OIDC single sign-on and just-in-time user provisioning for your identity provider.

  ### [Organization setup](#)
Create and configure organizations, workspaces, and the user hierarchy within your enterprise.

  ### [Manage by API](#)
Programmatically manage users, configure security settings, and administer your organization via API.

## Access control

Control who can access what within your organization.

  ### [Role-based access control (RBAC)](#)
Define permissions per workspace using built-in or custom roles. Available exclusively on Enterprise plans.

  ### [Attribute-based access control (ABAC)](#)
Apply fine-grained, tag-based access policies to restrict resource access—including blocking PII data from specific users.

  ### [Workload isolation](#)
Use multi-workspace models to isolate teams, establish trust boundaries, and separate environments.

  ### [Resource tags](#)
Tag resources for use with ABAC policies and to organize environments like dev, staging, and prod.

## Data privacy and PII

Control how sensitive data is stored and accessed.

  ### [Data storage & privacy](#)
Understand what LangSmith stores, how encryption works, and how to opt out of telemetry and tracing.

  ### [PII controls with ABAC](#)
Use ABAC deny policies to restrict access to traces and datasets that contain personally identifiable information.

## Data retention & cleanup

Configure how long data is retained and how to delete it.

  ### [Data purging for compliance](#)
Set custom retention periods, delete traces by metadata, and meet deletion requirements.

  ### [Data retention settings](#)
Understand base vs. extended retention tiers, auto-upgrades, and how retention affects billing.

## Cost controls and usage

Track and limit spending across your organization.

  ### [Billing & spend limits](#)
Set monthly usage limits, track prepaid contract usage, and optimize tracing spend.

  ### [Granular usage reporting](#)
Break down trace usage by workspace, project, user, or API key to attribute costs across teams.

## Security & compliance

Review LangSmith's security posture and compliance certifications.

  ### [Shared responsibility model](#)
Review the security responsibilities shared between LangChain and your organization. LangSmith holds SOC 2 Type II, HIPAA, and GDPR certifications.

  ### [Scalability & resilience](#)
Review SLA guarantees, disaster recovery strategies, and high availability configurations.
