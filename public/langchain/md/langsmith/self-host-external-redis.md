LangSmith uses Redis to back our queuing/caching operations. By default, LangSmith Self-Hosted will use an internal Redis instance. However, you can configure LangSmith to use an external Redis instance. By configuring an external Redis instance, you can more easily manage backups, scaling, and other operational tasks for your Redis instance.

[Valkey](https://valkey.io/) is also officially supported as a drop-in replacement for Redis. Anywhere this page refers to Redis, you can use a compatible Valkey instance. See [Requirements](#requirements) for supported versions.


> [!WARNING]
>
> Each LangSmith installation must use its own dedicated Redis instance. Redis cannot be shared across separate LangSmith installations (for example, between an existing and new cluster during a migration). Sharing it across installations causes deployment tasks to be routed to the wrong cluster.


> [!TIP]
>
> **If you're using a managed Redis service**, we recommend:
> - [Amazon ElastiCache](https://aws.amazon.com/elasticache/redis/) (AWS)
> - [Google Cloud Memorystore](https://cloud.google.com/memorystore) (GCP)
> - [Azure Cache for Redis](https://azure.microsoft.com/en-us/services/cache/) (Azure)
>
> For cloud-specific IAM/Workload Identity authentication, refer to the [IAM authentication section](#iam-authentication).


## Requirements

* A provisioned Redis or [Valkey](https://valkey.io/) instance that your LangSmith instance will have network access to. We recommend using a managed service like:

  * [Amazon ElastiCache](https://aws.amazon.com/elasticache/redis/) (Redis or Valkey)
  * [Google Cloud Memorystore](https://cloud.google.com/memorystore) (Redis or Valkey)
  * [Azure Cache for Redis](https://azure.microsoft.com/en-us/services/cache/)

* **Supported versions:** Redis >= 5, or Valkey 8. Valkey is treated as a drop-in replacement for Redis throughout this guide.
* We support both Standalone and Redis Cluster (including Valkey Cluster). See the appropriate sections for deployment instructions.
* We support no authentication, password, and [IAM/Workload Identity](#iam-authentication) authentication.
* By default, we recommend an instance with at least 2 vCPUs and 8GB of memory. However, the actual requirements will depend on your tracing workload. We recommend monitoring your Redis instance and scaling up as needed.


> [!TIP]
>
> If you enable [LangSmith Sandboxes](lc:langsmith/deploy-self-hosted-full-platform#enable-sandboxes), we recommend setting the Redis `maxmemory-policy` to `noeviction` for the Redis metadata store used by sandbox storage. This avoids evicting filesystem metadata under memory pressure.
> With `noeviction`, Redis writes can fail when the instance reaches max memory, so keep enough memory headroom for sandbox metadata growth.


## Standalone Redis

### Connection string

You will need to assemble the connection string for your Redis instance. This connection string should include the following information:

* Host
* Database
* Port
* URL params

This will take the form of:

```
"redis://host:port/db?<url_params>"
```

An example connection string might look like:

```
"redis://langsmith-redis:6379/0"
```

Note: If your Standalone Redis requires authentication or TLS, include these directly in the connection URL:

- Use `rediss://` when TLS is enabled on your Redis server.
- Provide the password in the connection string.

For example:

```text
rediss://langsmith-redis:6380/0?password=foo
```

For IAM authentication, use the identity as the username (no password):

```text
rediss://<iam-identity>@host:6380
```

### Configuration

With your connection string in hand, you can configure your LangSmith instance to use an external Redis instance. You can do this by modifying the `values` file for your LangSmith Helm Chart installation.

```yaml Helm
redis:
  external:
    enabled: true
    connectionUrl: "Your connection url"
```

You can also store the connection URL in an existing Kubernetes Secret and reference it in your Helm values.

```lc-tabs
[
 {
  "label": "Helm (using an existing Secret)",
  "lang": "yaml",
  "code": "redis:\n  external:\n    enabled: true\n    # Name of an existing Secret that contains the connection URL\n    existingSecretName: \"my-redis-secret\"\n    # Key in the Secret that stores the connection URL (default shown)\n    connectionUrlSecretKey: \"connection_url\""
 },
 {
  "label": "Kubernetes Secret",
  "lang": "yaml",
  "code": "apiVersion: v1\nkind: Secret\nmetadata:\n  name: my-redis-secret\ntype: Opaque\nstringData:\n  # Full connection URL, e.g., using TLS with password\n  connection_url: \"rediss://langsmith-redis:6380/0?password=foo\""
 }
]
```

Once configured, you should be able to reinstall your LangSmith instance. If everything is configured correctly, your LangSmith instance should now be using your external Redis instance.

## Redis cluster
As of LangSmith helm version **0.12.25**, we officially support **Redis Cluster**.

### Host names

When using Redis Cluster, provide a list of node hostnames and ports. Each node URI must be in the form:

```text
redis://hostname:port
```

For example:

```text
redis://redis-node-0:6379
redis://redis-node-1:6379
redis://redis-node-2:6379
```

Do not include a password in these URIs, and do not use `rediss` here. For Redis Cluster:

- Provide the password separately via `redis.external.cluster.password` or through a Secret using `passwordSecretKey`.
- TLS is enabled by default for Redis Cluster (`redis.external.cluster.tlsEnabled: true`). Set `tlsEnabled: false` if your cluster does not use TLS.

### Configuration

When connecting to an external Redis Cluster, configure the Helm values under `redis.external.cluster`. You can either:

* Provide node URIs and (optionally) a password directly in `values.yaml`.
* Or reference an existing Kubernetes `Secret` containing node URIs and password.

```lc-tabs
[
 {
  "label": "Helm (inline values)",
  "lang": "yaml",
  "code": "redis:\n  external:\n    enabled: true\n    cluster:\n      enabled: true\n      # List of cluster node URIs. Format: redis://host:port\n      nodeUris:\n        - \"redis://redis-node-0:6379\"\n        - \"redis://redis-node-1:6379\"\n        - \"redis://redis-node-2:6379\"\n      # Optional. If your cluster requires auth, set a password or use a Secret (recommended).\n      password: \"your_redis_password\"\n      # TLS is enabled by default. Set to false if your cluster does not use TLS.\n      tlsEnabled: true"
 },
 {
  "label": "Helm (using an existing Secret)",
  "lang": "yaml",
  "code": "redis:\n  external:\n    enabled: true\n    # Name of an existing Secret that contains cluster connection details\n    existingSecretName: \"my-redis-cluster-secret\"\n    cluster:\n      enabled: true\n      # Keys in the Secret. Defaults shown here; override if your Secret uses different keys.\n      nodeUrisSecretKey: \"redis_cluster_node_uris\"\n      passwordSecretKey: \"redis_cluster_password\"\n      tlsEnabled: true"
 }
]
```

If using an existing Secret, it should contain:

```yaml Kubernetes Secret
apiVersion: v1
kind: Secret
metadata:
  name: my-redis-cluster-secret
type: Opaque
stringData:
  # JSON array of node URIs (as a string)
  redis_cluster_node_uris: '["redis://redis-node-0:6379","redis://redis-node-1:6379","redis://redis-node-2:6379"]'
  # Optional if your cluster requires a password
  redis_cluster_password: "your_redis_password"
```

## Azure managed Redis

[Azure Managed Redis](https://azure.microsoft.com/en-us/products/managed-redis) supports two clustering policies that affect how LangSmith connects to it. Choose the configuration below based on the clustering policy of your instance.

### OSS Cluster

LangSmith connects to OSS clustering policy instances using Redis Cluster mode.

As of LangSmith helm chart version **0.13.33**, `ssl_check_hostname=false` is supported as a node URI parameter. In our testing, the OSS clustering policy requires disabling SSL hostname verification. Azure's proxy resolves connections to internal node IPs that are not present in the certificate's SAN, causing hostname verification to fail.

```yaml
redis:
  external:
    enabled: true
    cluster:
      enabled: true
      nodeUris:
        - "redis://<node_url>:10000?ssl_check_hostname=false"
      tlsEnabled: true
```

### EnterpriseCluster

As of LangSmith helm chart version **0.13.33**, LangSmith supports Azure Managed Redis with the EnterpriseCluster policy. This policy exposes a single endpoint that handles sharding internally. LangSmith must connect to it as a standalone (single-instance) client, but it does not support cluster unsafe operations such as MULTI/EXEC. Set `redis.external.clusterSafeMode: true` to disable unsafe cluster operations.

```yaml
redis:
  external:
    enabled: true
    connectionUrl: "rediss://<azure-redis-host>:6380"
    # Required for EnterpriseCluster: use a single-instance client and disable unsafe cluster operations
    clusterSafeMode: true
```

For Microsoft Entra (IAM) authentication with EnterpriseCluster, see the [Azure tab in IAM authentication](#azure-cache-for-redis) and include `clusterSafeMode: true` in your Helm values.

## TLS with Redis

Use this section to configure TLS for Redis connections. For mounting internal/public CAs so LangSmith trusts your Redis server certificate, see [Configure custom TLS certificates](lc:langsmith/self-host-custom-tls-certificates#mount-internal-cas-for-tls).

### Server TLS (one-way)

To validate the Redis server certificate:

- Provide a CA bundle using `config.customCa.secretName` and `config.customCa.secretKey`.
- For Standalone Redis, use `rediss://` in the connection URL.
- For Redis Cluster, `redis.external.cluster.tlsEnabled` defaults to `true`. Ensure it is not set to `false`.


> [!WARNING]
>
> Mount a custom CA only when your Redis server uses an internal or private CA. Publicly trusted CAs do not require this configuration.


```lc-tabs
[
 {
  "label": "Helm (Standalone - server TLS)",
  "lang": "yaml",
  "code": "config:\n  customCa:\n    secretName: \"langsmith-custom-ca\"  # Secret containing your CA bundle\n    secretKey: \"ca.crt\"    # Key in the Secret with the CA bundle\nredis:\n  external:\n    enabled: true\n    # Use rediss:// and include password if required by your server\n    connectionUrl: \"rediss://host:6380/0?password=<PASSWORD>\""
 },
 {
  "label": "Helm (Cluster - server TLS)",
  "lang": "yaml",
  "code": "config:\n  customCa:\n    secretName: \"langsmith-custom-ca\"  # Secret containing your CA bundle\n    secretKey: \"ca.crt\"    # Key in the Secret with the CA bundle\nredis:\n  external:\n    enabled: true\n    cluster:\n      enabled: true\n      tlsEnabled: true\n      nodeUris:\n        - \"redis://redis-node-0:6379\"\n        - \"redis://redis-node-1:6379\"\n        - \"redis://redis-node-2:6379\"\n      password: \"<PASSWORD>\""
 },
 {
  "label": "Kubernetes Secret (CA bundle)",
  "lang": "yaml",
  "code": "apiVersion: v1\nkind: Secret\nmetadata:\n  name: langsmith-custom-ca\ntype: Opaque\nstringData:\n  ca.crt: |\n    -----BEGIN CERTIFICATE-----\n    <ROOT_OR_INTERMEDIATE_CA_CERT_CHAIN>\n    -----END CERTIFICATE-----"
 }
]
```

### Mutual TLS with client auth (mTLS)

As of LangSmith helm chart version **0.12.29**, we support mTLS for Redis clients. For server-side authentication in mTLS, use the [Server TLS steps](#server-tls-one-way) (custom CA) in addition to the following client certificate configuration.

If your Redis server requires client certificate authentication:

- Provide a Secret with your client certificate and key.
- Reference it via `redis.external.clientCert.secretName` and specify the keys with `certSecretKey` and `keySecretKey`.
- For Standalone Redis, keep using `rediss://` in the connection URL.
- For Redis Cluster, `redis.external.cluster.tlsEnabled` defaults to `true`. Ensure it is not set to `false`.

```lc-tabs
[
 {
  "label": "Helm (client Auth)",
  "lang": "yaml",
  "code": "redis:\n  external:\n    enabled: true\n    clientCert:\n      secretName: \"redis-mtls-secret\"\n      certSecretKey: \"tls.crt\"\n      keySecretKey: \"tls.key\"\n    # Standalone example:\n    # connectionUrl: \"rediss://host:6380/0?password=<PASSWORD>\"\n    # Or, for Cluster:\n    cluster:\n      enabled: true\n      tlsEnabled: true\n      nodeUris:\n        - \"redis://redis-node-0:6379\"\n        - \"redis://redis-node-1:6379\"\n        - \"redis://redis-node-2:6379\"\n      password: \"<PASSWORD>\""
 },
 {
  "label": "Kubernetes Secret (client cert/key)",
  "lang": "yaml",
  "code": "apiVersion: v1\nkind: Secret\nmetadata:\n  name: redis-mtls-secret\ntype: Opaque\nstringData:\n  tls.crt: |\n    -----BEGIN CERTIFICATE-----\n    <CLIENT_CERT>\n    -----END CERTIFICATE-----\n  tls.key: |\n    -----BEGIN PRIVATE KEY-----\n    <CLIENT_KEY>\n    -----END PRIVATE KEY-----"
 }
]
```

#### Pod security context for certificate volumes

The certificate volumes mounted for mTLS are protected by file access restrictions. To ensure all LangSmith pods can read the certificate files, you must set `fsGroup: 1000` in the pod security context.

You can configure this in one of two ways:

**Option 1: Use `commonPodSecurityContext`**

Set the `fsGroup` at the top level to apply it to all pods:

```yaml
commonPodSecurityContext:
  fsGroup: 1000
```

**Option 2: Add to individual pod security contexts**

If you need more granular control, add the `fsGroup` to each pod's security context individually. See the [mtls configuration example](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/examples/mtls_config.yaml) for a complete reference.

## IAM authentication

As of LangSmith helm chart version **0.12.34**, we support IAM authentication for Redis. This allows you to use cloud provider workload identity instead of static passwords.


> [!NOTE]
>
> IAM authentication is supported for both standalone Redis and Redis Cluster configurations. However, not all cloud providers support IAM authentication for all Redis offerings. Check your cloud provider's documentation to verify IAM support for your specific Redis setup (e.g., GCP only supports IAM for Memorystore Cluster, not standalone Memorystore).


  #### Tab: AWS

<a id="amazon-elasticache"></a>

### ElastiCache for Redis IAM authentication

ElastiCache for Redis supports [IAM authentication](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/auth-iam.html), which allows you to authenticate using AWS IAM credentials instead of Redis AUTH passwords.

#### Prerequisites

1. **Configure workload identity** in your Kubernetes cluster using [AWS IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) or [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html)
2. **Enable IAM authentication** on your ElastiCache instance and grant access to your workload identity

#### Configuration

**Standalone Redis:**

```yaml
redis:
  external:
    enabled: true
    existingSecretName: "redis-secret"
    iamAuthProvider: "aws"
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: redis-secret
type: Opaque
stringData:
  # IAM connection URL - identity as username, no password
  connection_url: "rediss://<iam-identity>@<elasticache-host>:6380"
```

**Redis Cluster:**

```yaml
redis:
  external:
    enabled: true
    existingSecretName: "redis-cluster-secret"
    iamAuthProvider: "aws"
    cluster:
      enabled: true
      nodeUrisSecretKey: "redis_cluster_node_uris"
      tlsEnabled: true
```

#### Required annotations

You must apply the ServiceAccount annotations required by AWS IRSA to all LangSmith components that connect to Redis:

**Deployments:** `backend`, `queue`, `platformBackend`, `hostBackend`, `ingestQueue`

Example configuration:

```yaml
backend:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::<account-id>:role/<role-name>"

queue:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::<account-id>:role/<role-name>"

platformBackend:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::<account-id>:role/<role-name>"

hostBackend:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::<account-id>:role/<role-name>"

ingestQueue:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::<account-id>:role/<role-name>"
```

See the [Helm values reference](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml) for the full list of configurable services.

  
  #### Tab: GCP

<a id="google-cloud-memorystore"></a>

### Memorystore for Redis IAM authentication

Memorystore for Redis supports [IAM authentication](https://docs.cloud.google.com/memorystore/docs/cluster/about-iam-auth) for **Cluster instances only** (not standalone Memorystore). This allows you to authenticate using GCP service accounts.


> [!NOTE]
>
> IAM authentication is only available for Memorystore Cluster, not standalone Memorystore instances.


#### Prerequisites

1. **Configure workload identity** in your Kubernetes cluster using [GCP Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)
2. **Enable IAM authentication** on your Memorystore Cluster and grant access to your workload identity

#### Configuration

**Memorystore Cluster with IAM:**

```yaml
redis:
  external:
    enabled: true
    existingSecretName: "redis-cluster-secret"
    iamAuthProvider: "gcp"
    cluster:
      enabled: true
      nodeUrisSecretKey: "redis_cluster_node_uris"
      tlsEnabled: true
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: redis-cluster-secret
type: Opaque
stringData:
  redis_cluster_node_uris: '["redis://node-0:6379","redis://node-1:6379","redis://node-2:6379"]'
```

#### Required annotations

You must apply the ServiceAccount annotations required by GCP Workload Identity to all LangSmith components that connect to Redis:

**Deployments:** `backend`, `queue`, `platformBackend`, `hostBackend`, `ingestQueue`

Example configuration:

```yaml
backend:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<service-account>@<project>.iam.gserviceaccount.com"

queue:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<service-account>@<project>.iam.gserviceaccount.com"

platformBackend:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<service-account>@<project>.iam.gserviceaccount.com"

hostBackend:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<service-account>@<project>.iam.gserviceaccount.com"

ingestQueue:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<service-account>@<project>.iam.gserviceaccount.com"
```

See the [Helm values reference](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml) for the full list of configurable services.

  
  #### Tab: Azure

<a id="azure-cache-for-redis"></a>

### Azure Cache for Redis with Microsoft Entra authentication

Azure Cache for Redis supports [Microsoft Entra authentication](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication), which allows you to authenticate using Azure managed identities.

#### Prerequisites

1. **Configure workload identity** in your Kubernetes cluster using [Azure Workload Identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)
2. **Enable Microsoft Entra authentication** on your Azure Cache for Redis and grant access to your workload identity

#### Configuration

**Standalone Redis:**

```yaml
redis:
  external:
    enabled: true
    existingSecretName: "redis-secret"
    iamAuthProvider: "azure"
    # Include if using EnterpriseCluster policy. See the Azure managed Redis section for details.
    # clusterSafeMode: true
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: redis-secret
type: Opaque
stringData:
  # IAM connection URL - managed identity as username, no password
  connection_url: "rediss://<managed-identity>@<azure-redis-host>:6380"
```

**Redis Cluster:**

```yaml
redis:
  external:
    enabled: true
    existingSecretName: "redis-cluster-secret"
    iamAuthProvider: "azure"
    cluster:
      enabled: true
      nodeUrisSecretKey: "redis_cluster_node_uris"
      tlsEnabled: true
```

#### Required annotations

You must apply the ServiceAccount annotations and pod labels required by Azure Workload Identity to all LangSmith components that connect to Redis:

**Deployments:** `backend`, `queue`, `platformBackend`, `hostBackend`, `ingestQueue`

Example configuration:

```yaml
backend:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "<managed-identity-client-id>"
  deployment:
    labels:
      azure.workload.identity/use: "true"

queue:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "<managed-identity-client-id>"
  deployment:
    labels:
      azure.workload.identity/use: "true"

platformBackend:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "<managed-identity-client-id>"
  deployment:
    labels:
      azure.workload.identity/use: "true"

hostBackend:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "<managed-identity-client-id>"
  deployment:
    labels:
      azure.workload.identity/use: "true"

ingestQueue:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "<managed-identity-client-id>"
  deployment:
    labels:
      azure.workload.identity/use: "true"
```

See the [Helm values reference](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml) for the full list of configurable services.
