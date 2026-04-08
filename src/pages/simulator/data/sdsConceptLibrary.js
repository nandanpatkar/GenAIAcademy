// System Design Simulator — Concept Library (25+ concepts ported from original repo)
// Full port from vijaygupta18/system-design-simulator

export const CONCEPT_LIBRARY = {
  dns: {
    componentId: "dns",
    whenToUse: [
      "Every system design — DNS is the first hop for resolving domain names to IPs",
      "Geographic load balancing via DNS-based routing (latency-based, geo-based)",
      "Failover and disaster recovery using health-checked DNS records",
      "Service discovery in simpler architectures using SRV records",
    ],
    whenNotToUse: [
      "Fine-grained load balancing — DNS TTL caching makes real-time traffic shifting unreliable",
      "Low-latency failover — DNS propagation can take minutes even with low TTLs",
    ],
    keyTradeoffs: [
      "TTL trade-off: low TTL = faster failover but more DNS queries; high TTL = better caching but slower updates",
      "DNS is a single point of failure if your provider goes down (consider multi-provider DNS)",
      "Clients cache DNS responses — you cannot force instant changes across all clients",
      "DNSSEC adds security but increases response size and lookup latency",
    ],
    interviewTips: [
      "Mention DNS as the first step in any request flow — shows you understand the full path",
      "Discuss Route 53 weighted routing or latency-based routing for global traffic management",
      "Bring up DNS caching layers: browser cache, OS cache, ISP resolver, authoritative server",
    ],
    commonPatterns: [
      { name: "GeoDNS", description: "Route users to the nearest data center based on their geographic location" },
      { name: "Weighted Routing", description: "Distribute traffic across endpoints by weight — useful for canary deployments" },
      { name: "Failover DNS", description: "Health-checked primary/secondary records that automatically redirect on failure" },
    ],
    realWorldExamples: [
      "AWS Route 53 handles trillions of DNS queries per year with 100% SLA",
      "Netflix uses DNS-based global load balancing to route users to the nearest region",
      "GitHub uses Anycast DNS to direct users to the closest edge PoP",
    ],
  },
  cdn: {
    componentId: "cdn",
    whenToUse: [
      "Serving static assets (images, JS, CSS, videos) to a global audience with low latency",
      "Read-heavy content delivery where data changes infrequently",
      "Protecting origin servers from traffic spikes by absorbing load at the edge",
      "Reducing bandwidth costs — CDN edge caches offload origin egress traffic",
    ],
    whenNotToUse: [
      "Highly dynamic, personalized content that cannot be cached (e.g., user-specific API responses)",
      "Small-scale single-region applications where the origin is already close to all users",
      "Real-time data that must always be fresh — cache invalidation adds complexity",
    ],
    keyTradeoffs: [
      "Cache invalidation complexity: purging stale content across thousands of edge nodes takes time",
      "Cost: CDN bandwidth is cheaper than origin, but high-traffic video delivery bills add up",
      "Cold cache problem: first request to a new edge PoP still hits the origin",
      "Dynamic content at the edge (edge compute) is powerful but adds architectural complexity",
    ],
    interviewTips: [
      "Mention CDN as essential for any system serving media — interviewers expect it",
      "Discuss pull vs push CDN models and when each is appropriate",
      "Bring up cache-control headers (max-age, s-maxage, stale-while-revalidate) to show depth",
    ],
    commonPatterns: [
      { name: "Pull-based CDN", description: "Edge fetches from origin on cache miss, caches response for subsequent requests" },
      { name: "Push-based CDN", description: "Origin proactively pushes content to edge nodes before users request it" },
      { name: "Edge Compute", description: "Run logic at CDN edge (Cloudflare Workers, Lambda@Edge) for personalization without origin round-trips" },
    ],
    realWorldExamples: [
      "Netflix uses its Open Connect CDN to serve 15% of global internet traffic from ISP-embedded servers",
      "Cloudflare CDN operates 300+ edge PoPs serving 50M+ HTTP requests per second",
      "YouTube uses Google's CDN to deliver over 1 billion hours of video per day globally",
    ],
  },
  "load-balancer": {
    componentId: "load-balancer",
    whenToUse: [
      "Distributing traffic across multiple backend instances for horizontal scaling",
      "Enabling zero-downtime deployments via rolling updates and connection draining",
      "Health checking backends and removing unhealthy instances from the pool",
      "SSL/TLS termination to offload encryption from application servers",
    ],
    whenNotToUse: [
      "Single-server setups where there is nothing to balance across",
      "Client-side load balancing in service mesh architectures may replace traditional LBs",
      "UDP-heavy workloads where Layer 7 features are unnecessary — use Layer 4 NLB instead",
    ],
    keyTradeoffs: [
      "Layer 4 (TCP) vs Layer 7 (HTTP): L4 is faster but L7 enables content-based routing, sticky sessions, and header inspection",
      "Single LB is a SPOF — always deploy in HA pairs or use managed cloud LBs",
      "Sticky sessions hurt even distribution and complicate scaling — prefer stateless backends",
      "Algorithm choice matters: round-robin is simple, least-connections handles varying request costs better",
    ],
    interviewTips: [
      "Distinguish L4 vs L7 load balancing and explain when you would use each",
      "Mention consistent hashing for cache-friendly routing without sticky sessions",
      "Discuss health checks (active vs passive) and graceful connection draining during deploys",
    ],
    commonPatterns: [
      { name: "Round Robin", description: "Distribute requests sequentially across servers — simple but ignores server load" },
      { name: "Least Connections", description: "Route to the server with fewest active connections — better for varying request durations" },
      { name: "Consistent Hashing", description: "Hash request key to a server — ensures same key always hits the same server (good for caching)" },
    ],
    realWorldExamples: [
      "AWS ALB handles millions of requests per second with content-based routing rules",
      "Google Cloud Load Balancing provides a single anycast IP across all global regions",
      "Dropbox uses custom L4/L7 load balancers (Bandaid) to manage traffic to billions of files",
    ],
  },
  "api-gateway": {
    componentId: "api-gateway",
    whenToUse: [
      "Microservices architecture needing a unified API surface for external clients",
      "Cross-cutting concerns: authentication, rate limiting, logging, request transformation",
      "API versioning and protocol translation (REST to gRPC, GraphQL federation)",
      "Backend-for-frontend (BFF) pattern aggregating multiple service calls into one response",
    ],
    whenNotToUse: [
      "Simple monolithic applications where a single server handles everything",
      "Internal service-to-service calls — use service mesh instead of routing through a gateway",
      "When it becomes a bottleneck or single point of failure due to all traffic funneling through it",
    ],
    keyTradeoffs: [
      "Added latency: every request passes through an extra network hop",
      "Single point of failure if not deployed with HA — must be horizontally scaled",
      "Tight coupling risk: gateway becomes a monolith if too much business logic is added",
      "Operational complexity of maintaining routing rules, rate limits, and transformations",
    ],
    interviewTips: [
      "Mention API gateway as the entry point in any microservices design — shows architectural maturity",
      "Discuss the BFF pattern for mobile vs web clients needing different API shapes",
      "Explain how rate limiting at the gateway protects all downstream services uniformly",
    ],
    commonPatterns: [
      { name: "Backend for Frontend (BFF)", description: "Dedicated gateway per client type (web, mobile, IoT) with tailored aggregation" },
      { name: "Request Aggregation", description: "Gateway combines multiple microservice calls into a single client response" },
      { name: "Edge Authentication", description: "Validate JWT/OAuth tokens at the gateway so downstream services trust the identity" },
    ],
    realWorldExamples: [
      "Netflix Zuul gateway handles billions of API requests per day with dynamic routing filters",
      "Amazon API Gateway powers the AWS ecosystem with throttling and usage plans",
      "Uber uses a custom API gateway for routing across thousands of microservices",
    ],
  },
  "sql-db": {
    componentId: "sql-db",
    whenToUse: [
      "Data with complex relationships requiring JOINs and referential integrity",
      "ACID transactions — financial data, inventory, user accounts",
      "Well-defined schema with structured data that evolves predictably",
      "Strong consistency requirements where eventual consistency is unacceptable",
    ],
    whenNotToUse: [
      "Massive horizontal scaling needs (>100k writes/sec) — sharding SQL is painful",
      "Unstructured or rapidly evolving schemas (logs, social feeds, IoT sensor data)",
      "Simple key-value lookups at ultra-low latency — a cache or NoSQL DB is better",
    ],
    keyTradeoffs: [
      "Vertical scaling has limits — horizontal sharding is complex (routing, cross-shard joins, rebalancing)",
      "Read replicas reduce read load but introduce replication lag (eventual consistency for reads)",
      "Normalization reduces storage and ensures consistency, but denormalization improves read performance",
      "ORM convenience vs raw SQL performance — ORMs can generate inefficient queries",
    ],
    interviewTips: [
      "Explain read replicas for scaling reads and when replication lag is acceptable",
      "Discuss sharding strategies (hash-based, range-based) and the problems they introduce",
      "Mention indexing strategy — B-tree vs hash indexes, covering indexes, and query plan analysis",
    ],
    commonPatterns: [
      { name: "Primary-Replica", description: "Write to primary, read from replicas — scales reads but introduces replication lag" },
      { name: "Sharding", description: "Partition data across multiple databases by a shard key — scales writes but complicates queries" },
      { name: "CQRS", description: "Separate read and write models — optimize each independently with different storage strategies" },
    ],
    realWorldExamples: [
      "Instagram uses PostgreSQL with extensive sharding to store billions of user records",
      "Shopify shards MySQL across hundreds of instances using application-level routing",
      "Stripe uses PostgreSQL for financial transactions requiring strict ACID guarantees",
    ],
  },
  "nosql-db": {
    componentId: "nosql-db",
    whenToUse: [
      "Massive write throughput with horizontal scaling (millions of writes/sec)",
      "Flexible or evolving schemas — document, key-value, or wide-column data models",
      "Low-latency key-value lookups at scale where consistency can be tuned",
      "Distributed workloads across multiple regions with eventual consistency",
    ],
    whenNotToUse: [
      "Complex queries with multi-table JOINs — NoSQL data modeling requires denormalization",
      "Strict ACID transactions across multiple entities (use SQL or NewSQL instead)",
      "Small-scale applications where a simple PostgreSQL instance handles everything",
    ],
    keyTradeoffs: [
      "Schema flexibility is a double-edged sword — no schema enforcement can lead to data quality issues",
      "Denormalization means faster reads but data duplication and complex update logic",
      "Tunable consistency (ONE, QUORUM, ALL) trades availability for consistency",
      "Access pattern driven design — you must know your queries upfront, unlike SQL",
    ],
    interviewTips: [
      "Explain CAP theorem and where your chosen NoSQL DB falls (CP vs AP)",
      "Discuss data modeling for access patterns — partition key design is critical for DynamoDB/Cassandra",
      "Mention when you would choose DynamoDB (key-value) vs MongoDB (document) vs Cassandra (wide-column)",
    ],
    commonPatterns: [
      { name: "Single Table Design", description: "DynamoDB pattern: store multiple entity types in one table with composite keys" },
      { name: "Wide-Column Model", description: "Cassandra pattern: denormalize and duplicate data for each query pattern" },
      { name: "Document Store", description: "MongoDB pattern: embed related data in a single document to avoid joins" },
    ],
    realWorldExamples: [
      "Amazon uses DynamoDB internally for shopping cart, session management, and catalog at massive scale",
      "Apple uses Cassandra for over 100 PB of data powering iCloud and other services",
      "MongoDB Atlas powers thousands of applications from startups to enterprises like eBay and Toyota",
    ],
  },
  cache: {
    componentId: "cache",
    whenToUse: [
      "Read-heavy workloads (>10:1 read/write ratio)",
      "Data accessed frequently with tolerance for slight staleness",
      "Reduce database load and latency for hot data",
      "Session storage, leaderboards, rate limiting counters",
    ],
    whenNotToUse: [
      "Write-heavy workloads where data changes faster than cache invalidates",
      "Data that must always be strongly consistent (financial balances)",
    ],
    keyTradeoffs: [
      "Cache invalidation is the hardest problem — TTL vs event-driven vs write-through",
      "Memory is expensive — cache only hot data, not everything",
      "Cache stampede risk: when cache expires and thousands of requests hit DB simultaneously",
      "Consistency: stale reads are possible with cache-aside pattern",
    ],
    interviewTips: [
      "Always mention your cache invalidation strategy — interviewers look for this",
      "Discuss cache-aside vs write-through vs write-behind and WHY you chose one",
      "Mention Redis Cluster for horizontal scaling and HA",
    ],
    commonPatterns: [
      { name: "Cache-Aside (Lazy Loading)", description: "App checks cache first, on miss reads from DB and populates cache" },
      { name: "Write-Through", description: "Every write goes to cache AND DB — consistent but higher write latency" },
      { name: "Write-Behind (Write-Back)", description: "Write to cache, async flush to DB — fast writes but data loss risk" },
    ],
    realWorldExamples: [
      "Twitter uses Redis for timeline caching (fan-out-on-write)",
      "Facebook's Memcached fleet caches billions of objects across data centers",
      "Discord uses Redis for real-time presence and rate limiting",
    ],
  },
  "message-queue": {
    componentId: "message-queue",
    whenToUse: [
      "Decoupling producers from consumers for asynchronous processing",
      "Buffering traffic spikes — queue absorbs bursts while consumers process at their own pace",
      "Event-driven architectures where multiple services react to the same event",
      "Reliable delivery with at-least-once or exactly-once semantics for critical workflows",
    ],
    whenNotToUse: [
      "Synchronous request-response where the client needs an immediate result",
      "Simple direct service calls in a low-latency path where queueing adds unnecessary delay",
      "Tiny deployments where operational overhead of managing a broker is not justified",
    ],
    keyTradeoffs: [
      "At-least-once delivery means consumers MUST be idempotent to handle duplicate messages",
      "Ordering: Kafka guarantees per-partition ordering; SQS FIFO queues support up to 70k msg/sec",
      "Message retention: Kafka retains messages for replay; SQS deletes after processing",
      "Complexity: adding a queue means eventual consistency, dead-letter queues, and monitoring for lag",
    ],
    interviewTips: [
      "Always mention idempotent consumers when discussing at-least-once delivery",
      "Distinguish Kafka (log-based, replay) from SQS/RabbitMQ (traditional queue, delete after consume)",
      "Discuss dead-letter queues for handling poison messages that repeatedly fail processing",
    ],
    commonPatterns: [
      { name: "Pub/Sub", description: "Publisher sends events to a topic; multiple subscribers each receive a copy independently" },
      { name: "Work Queue", description: "Multiple consumers pull from the same queue — each message processed by exactly one consumer" },
      { name: "Event Sourcing", description: "Store all state changes as an immutable log of events — enables replay and audit trails" },
    ],
    realWorldExamples: [
      "LinkedIn built Apache Kafka to handle 7 trillion messages per day across its platform",
      "Uber uses Kafka for real-time trip events, matching, and surge pricing data pipelines",
      "Slack uses a job queue system to process billions of messages, notifications, and API webhooks",
    ],
  },
  "object-storage": {
    componentId: "object-storage",
    whenToUse: [
      "Storing large unstructured blobs: images, videos, backups, logs, data lake files",
      "Virtually unlimited storage capacity with 11 nines (99.999999999%) durability",
      "Static website hosting or serving assets paired with a CDN",
      "Data archival and compliance — lifecycle policies move data to cold storage automatically",
    ],
    whenNotToUse: [
      "Frequently updated small records — use a database instead",
      "File system semantics needed (random writes, appends, directory listing) — use block/file storage",
      "Low-latency key-value lookups — S3 GET latency is ~100ms, too slow for hot path",
    ],
    keyTradeoffs: [
      "S3 provides strong read-after-write consistency for all operations",
      "Cost-effective for storage but egress bandwidth costs can be significant at scale",
      "No append or partial update — must rewrite entire object for any change",
      "Performance: S3 supports 5,500 GETs and 3,500 PUTs per prefix per second",
    ],
    interviewTips: [
      "Mention S3 as the default for any media/file storage",
      "Discuss pre-signed URLs for secure direct uploads/downloads without proxying",
      "Bring up S3 + CDN pairing for serving static content globally at low latency",
    ],
    commonPatterns: [
      { name: "Pre-signed URLs", description: "Generate time-limited URLs so clients upload/download directly to S3" },
      { name: "CDN + Origin", description: "S3 as CDN origin — CDN caches objects at edge, S3 stores source of truth" },
      { name: "Lifecycle Policies", description: "Automatically transition objects from Standard to Glacier for cost optimization" },
    ],
    realWorldExamples: [
      "Netflix stores all video masters and encoded variants on Amazon S3",
      "Airbnb uses S3 for all user-uploaded images with CloudFront CDN for delivery",
      "Dropbox stores over 500 PB of user files on a custom object storage system",
    ],
  },
  monitoring: {
    componentId: "monitoring",
    whenToUse: [
      "Every production system — monitoring is non-negotiable for reliability",
      "SLO/SLA tracking with automated alerting on latency, error rate, and throughput",
      "Distributed tracing to debug latency across multi-service request flows",
      "Capacity planning using historical metrics trends and anomaly detection",
    ],
    whenNotToUse: [
      "Monitoring is never optional in production; the level of investment depends on scale",
    ],
    keyTradeoffs: [
      "High cardinality metrics are powerful but expensive to store and query",
      "Sampling: 100% trace collection gives complete visibility but high storage cost",
      "Alert fatigue: too many alerts = ignored alerts. Tune thresholds carefully.",
      "Push vs pull metrics: Prometheus pulls, Datadog agent pushes",
    ],
    interviewTips: [
      "Mention the three pillars of observability: metrics, logs, and traces",
      "Discuss the RED method (Rate, Errors, Duration) for services and USE method for infrastructure",
      "Show you think about alerting — thresholds, escalation policies, and runbooks",
    ],
    commonPatterns: [
      { name: "RED Method", description: "Monitor Rate (throughput), Errors (failures), Duration (latency) for every service" },
      { name: "Distributed Tracing", description: "Propagate trace IDs across services to visualize the full request path" },
      { name: "Log Aggregation", description: "Centralize logs from all services (ELK, Loki) for searchable, correlated debugging" },
    ],
    realWorldExamples: [
      "Google SRE invented the four golden signals (latency, traffic, errors, saturation)",
      "Uber uses Jaeger for distributed tracing across thousands of microservices",
      "Netflix uses Atlas for real-time metrics processing handling billions of points per minute",
    ],
  }
};

export function getConceptByComponentId(id) {
  return CONCEPT_LIBRARY[id];
}
