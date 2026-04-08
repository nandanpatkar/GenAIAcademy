// System Design Simulator — Component Data
// Ported from vijaygupta18/system-design-simulator

export const SYSTEM_COMPONENTS = [
  // ── Networking ──────────────────────────────────────────────────────────────
  {
    id: "dns", label: "DNS", category: "networking", icon: "Globe",
    maxQPS: 100000, latencyMs: 10, scalable: true, stateful: false,
    color: "#06b6d4",
    description: "Domain Name System — resolves human-readable domain names to IP addresses. Every internet request starts with a DNS lookup. Services like AWS Route 53 also support health-checked routing and geo-based load balancing.",
  },
  {
    id: "cdn", label: "CDN", category: "networking", icon: "Cloudy",
    maxQPS: 500000, latencyMs: 15, scalable: true, stateful: false,
    color: "#8b5cf6",
    description: "Content Delivery Network — caches static assets at edge locations close to users, reducing latency. Essential for read-heavy or media-heavy systems. Examples: Amazon CloudFront, Google Cloud CDN, Cloudflare.",
  },
  {
    id: "load-balancer", label: "Load Balancer", category: "networking", icon: "Network",
    maxQPS: 1000000, latencyMs: 1, scalable: true, stateful: false,
    color: "#3b82f6",
    description: "Distributes incoming traffic across multiple backend servers using round-robin, least-connections, or weighted routing. Prevents bottlenecks and enables zero-downtime deployments. AWS ALB/NLB, HAProxy are common choices.",
  },
  {
    id: "api-gateway", label: "API Gateway", category: "networking", icon: "Router",
    maxQPS: 50000, latencyMs: 10, scalable: true, stateful: false,
    color: "#6366f1",
    description: "Single entry point for all API requests — handles routing, authentication, rate limiting, request transformation. AWS API Gateway, Kong, and Apigee are popular managed options.",
  },
  {
    id: "rate-limiter", label: "Rate Limiter", category: "networking", icon: "ShieldAlert",
    maxQPS: 80000, latencyMs: 1, scalable: true, stateful: true,
    color: "#f59e0b",
    description: "Throttles requests per client, IP, or API key to protect services from abuse and DDoS. Implemented using token bucket or sliding window algorithms backed by Redis.",
  },
  {
    id: "reverse-proxy", label: "Reverse Proxy", category: "networking", icon: "Shield",
    maxQPS: 100000, latencyMs: 1, scalable: true, stateful: false,
    color: "#10b981",
    description: "Sits between clients and backends — handles SSL termination, routing, caching, compression, and security. Nginx, Envoy, Cloudflare function as reverse proxies.",
  },
  {
    id: "origin-shield", label: "Origin Shield", category: "networking", icon: "ShieldCheck",
    maxQPS: 200000, latencyMs: 5, scalable: true, stateful: false,
    color: "#14b8a6",
    description: "Additional caching layer between CDN edge locations and the origin server. Reduces origin load by collapsing duplicate requests from multiple edge PoPs. AWS CloudFront Origin Shield.",
  },
  // ── Compute ─────────────────────────────────────────────────────────────────
  {
    id: "app-server", label: "App Server", category: "compute", icon: "Server",
    maxQPS: 5000, latencyMs: 20, scalable: true, stateful: false,
    color: "#22c55e",
    description: "Stateless application server that executes core business logic and serves API requests. Scales horizontally behind a load balancer. AWS EC2/ECS, Google Compute Engine, Kubernetes pods.",
  },
  {
    id: "auth-service", label: "Auth Service", category: "compute", icon: "KeyRound",
    maxQPS: 10000, latencyMs: 15, scalable: true, stateful: false,
    color: "#a855f7",
    description: "Dedicated authentication and authorization service — handles login, JWT/OAuth2 token issuance, session management. AWS Cognito, Auth0, Firebase Auth are examples.",
  },
  {
    id: "websocket-server", label: "WebSocket Server", category: "compute", icon: "Radio",
    maxQPS: 50000, latencyMs: 2, scalable: true, stateful: true,
    color: "#ec4899",
    description: "Maintains persistent bidirectional connections for real-time communication. Essential for chat apps, live notifications, and collaborative editing. Connection-to-server mapping stored in Redis.",
  },
  {
    id: "task-scheduler", label: "Task Scheduler", category: "compute", icon: "Clock",
    maxQPS: 10000, latencyMs: 50, scalable: true, stateful: false,
    color: "#f97316",
    description: "Manages delayed, scheduled, and recurring background jobs with retry logic and dead-letter queues. Celery, AWS Step Functions, Google Cloud Tasks, Temporal are common implementations.",
  },
  {
    id: "stream-processor", label: "Stream Processor", category: "compute", icon: "Waves",
    maxQPS: 200000, latencyMs: 10, scalable: true, stateful: true,
    color: "#0ea5e9",
    description: "Processes continuous data streams in real-time for analytics, event processing, and ETL pipelines. Apache Kafka Streams, Apache Flink, Spark Streaming, AWS Kinesis Data Analytics.",
  },
  {
    id: "notification-service", label: "Notification Service", category: "compute", icon: "Bell",
    maxQPS: 50000, latencyMs: 100, scalable: true, stateful: false,
    color: "#d946ef",
    description: "Orchestrates multi-channel delivery of push notifications, emails, SMS with priority queuing and template rendering. Firebase Cloud Messaging, AWS SNS/SES, Twilio.",
  },
  // ── Storage ──────────────────────────────────────────────────────────────────
  {
    id: "sql-db", label: "SQL Database", category: "storage", icon: "Database",
    maxQPS: 10000, latencyMs: 8, scalable: false, stateful: true,
    color: "#2563eb",
    description: "Relational database with ACID transactions, strong consistency, and SQL queries. Best for data with complex relationships and strict integrity. Amazon RDS, Google Cloud SQL, Aurora.",
  },
  {
    id: "nosql-db", label: "NoSQL Database", category: "storage", icon: "HardDrive",
    maxQPS: 50000, latencyMs: 3, scalable: true, stateful: true,
    color: "#16a34a",
    description: "Non-relational database optimized for flexible schemas, horizontal scaling, and high-throughput. Amazon DynamoDB, Google Cloud Bigtable, MongoDB Atlas, Cassandra.",
  },
  {
    id: "cache", label: "Cache / Redis", category: "storage", icon: "Zap",
    maxQPS: 100000, latencyMs: 1, scalable: true, stateful: true,
    color: "#dc2626",
    description: "In-memory data store delivering sub-millisecond read latency. Reduces DB load by 80-90% for read-heavy workloads. Amazon ElastiCache, Google Cloud Memorystore.",
  },
  {
    id: "object-storage", label: "Object Storage", category: "storage", icon: "Archive",
    maxQPS: 25000, latencyMs: 75, scalable: true, stateful: true,
    color: "#65a30d",
    description: "Highly durable blob storage for images, videos, backups. Offers 11-nines durability. Amazon S3, Google Cloud Storage, Azure Blob Storage — often paired with CDN.",
  },
  {
    id: "search", label: "Search / ES", category: "storage", icon: "Search",
    maxQPS: 20000, latencyMs: 10, scalable: true, stateful: true,
    color: "#ca8a04",
    description: "Full-text search engine with fuzzy matching, faceted search, and relevance scoring. Elasticsearch (OpenSearch), Apache Solr, Google Cloud Search.",
  },
  {
    id: "graph-db", label: "Graph Database", category: "storage", icon: "Share2",
    maxQPS: 8000, latencyMs: 15, scalable: true, stateful: true,
    color: "#7c3aed",
    description: "Stores highly connected data — optimized for relationship traversals like friend-of-friend queries, recommendation engines, fraud detection. Neo4j, Amazon Neptune, JanusGraph.",
  },
  {
    id: "timeseries-db", label: "Time-Series DB", category: "storage", icon: "TrendingUp",
    maxQPS: 100000, latencyMs: 3, scalable: true, stateful: true,
    color: "#0891b2",
    description: "Optimized for ingesting and querying time-stamped data with downsampling and retention policies. InfluxDB, TimescaleDB, Amazon Timestream, Prometheus.",
  },
  {
    id: "data-warehouse", label: "Data Warehouse", category: "storage", icon: "Warehouse",
    maxQPS: 1000, latencyMs: 5000, scalable: true, stateful: true,
    color: "#b45309",
    description: "Columnar analytical database for complex queries across petabytes of historical data. Google BigQuery, Amazon Redshift, Snowflake, ClickHouse.",
  },
  {
    id: "vector-db", label: "Vector Database", category: "storage", icon: "Brain",
    maxQPS: 10000, latencyMs: 10, scalable: true, stateful: true,
    color: "#9333ea",
    description: "Stores high-dimensional vector embeddings for ANN similarity search. Powers recommendation engines, semantic search, RAG AI systems. Pinecone, Weaviate, Milvus, Qdrant.",
  },
  {
    id: "geospatial-index", label: "Geospatial Index", category: "storage", icon: "MapPin",
    maxQPS: 50000, latencyMs: 5, scalable: true, stateful: true,
    color: "#059669",
    description: "Indexes location data using geohash, quadtree for nearest-neighbor searches. Essential for ride-sharing, food delivery, local search. PostGIS, Redis GEO, Elasticsearch geo_point.",
  },
  {
    id: "file-store", label: "File Store", category: "storage", icon: "FolderOpen",
    maxQPS: 10000, latencyMs: 10, scalable: true, stateful: true,
    color: "#78716c",
    description: "Network-attached file storage supporting POSIX file system semantics with shared access across instances. Amazon EFS, Google Cloud Filestore, Azure Files.",
  },
  // ── Messaging ────────────────────────────────────────────────────────────────
  {
    id: "message-queue", label: "Message Queue", category: "messaging", icon: "MessageSquare",
    maxQPS: 100000, latencyMs: 5, scalable: true, stateful: true,
    color: "#f59e0b",
    description: "Async message broker decoupling producers from consumers. Enables reliable background processing, event-driven architectures. Apache Kafka, Amazon SQS/SNS, Google Cloud Pub/Sub.",
  },
  {
    id: "pub-sub", label: "Pub/Sub", category: "messaging", icon: "Megaphone",
    maxQPS: 200000, latencyMs: 5, scalable: true, stateful: true,
    color: "#f97316",
    description: "Topic-based publish/subscribe where each message is broadcast to all subscribers. Enables event-driven fan-out for feeds, analytics. Google Cloud Pub/Sub, AWS SNS, Kafka topics.",
  },
  // ── Infrastructure ───────────────────────────────────────────────────────────
  {
    id: "service-mesh", label: "Service Mesh", category: "infrastructure", icon: "GitBranch",
    maxQPS: 80000, latencyMs: 2, scalable: true, stateful: false,
    color: "#6366f1",
    description: "Transparent service-to-service communication layer handling mTLS, retries, circuit breaking, load balancing. Istio, Linkerd, AWS App Mesh.",
  },
  {
    id: "monitoring", label: "Monitoring", category: "infrastructure", icon: "Activity",
    maxQPS: 500000, latencyMs: 5, scalable: true, stateful: true,
    color: "#10b981",
    description: "Observability stack for metrics collection, logging, distributed tracing, and alerting. Prometheus + Grafana, AWS CloudWatch, Datadog, ELK stack.",
  },
  {
    id: "service-discovery", label: "Service Discovery", category: "infrastructure", icon: "Compass",
    maxQPS: 50000, latencyMs: 1, scalable: true, stateful: true,
    color: "#14b8a6",
    description: "Enables microservices to find and communicate dynamically. HashiCorp Consul, Apache ZooKeeper, etcd, AWS Cloud Map.",
  },
  {
    id: "distributed-lock", label: "Distributed Lock", category: "infrastructure", icon: "Lock",
    maxQPS: 10000, latencyMs: 5, scalable: false, stateful: true,
    color: "#ef4444",
    description: "Provides mutual exclusion across distributed systems. Redis Redlock, ZooKeeper, etcd lease-based locks. Used for inventory updates, leader election.",
  },
  {
    id: "circuit-breaker", label: "Circuit Breaker", category: "infrastructure", icon: "ShieldOff",
    maxQPS: 100000, latencyMs: 1, scalable: true, stateful: true,
    color: "#f43f5e",
    description: "Prevents cascading failures by monitoring service health and short-circuiting failed requests. Three states: closed, open, half-open. Resilience4j, Envoy, Istio.",
  },
  {
    id: "coordination-service", label: "Coordination Service", category: "infrastructure", icon: "Users",
    maxQPS: 20000, latencyMs: 5, scalable: true, stateful: true,
    color: "#8b5cf6",
    description: "Distributed coordination primitives: leader election, config management, distributed barriers. Apache ZooKeeper, etcd, Consul — built on Raft/ZAB consensus.",
  },
  {
    id: "id-generator", label: "ID Generator", category: "infrastructure", icon: "Fingerprint",
    maxQPS: 500000, latencyMs: 1, scalable: true, stateful: true,
    color: "#0ea5e9",
    description: "Generates globally unique, sortable IDs using Twitter Snowflake, ULID, or UUID. Essential for database primary keys, URL shortening, event ordering, and sharding keys.",
  },
  {
    id: "sharded-counter", label: "Sharded Counter", category: "infrastructure", icon: "Hash",
    maxQPS: 500000, latencyMs: 2, scalable: true, stateful: true,
    color: "#22c55e",
    description: "Distributes a single logical counter across multiple shards to avoid hot-key bottlenecks. Critical for like counts, view counters at scale. Backed by Redis or sharded tables.",
  },
  {
    id: "config-service", label: "Config Service", category: "infrastructure", icon: "Settings",
    maxQPS: 50000, latencyMs: 2, scalable: true, stateful: true,
    color: "#64748b",
    description: "Centralized dynamic configuration management for feature flags, A/B test parameters, runtime settings without redeployment. AWS AppConfig, LaunchDarkly, etcd.",
  },
  {
    id: "custom", label: "Custom Component", category: "compute", icon: "Box",
    maxQPS: 50000, latencyMs: 10, scalable: true, stateful: false,
    color: "#94a3b8",
    description: "Generic component that can represent any service not in the library. Use for ML inference engines, recommendation services, fraud detection, or any domain-specific component.",
  },
];

export const COMPONENT_CATEGORIES = [
  { key: "networking", label: "Networking", icon: "Globe" },
  { key: "compute", label: "Compute", icon: "Server" },
  { key: "storage", label: "Storage", icon: "Database" },
  { key: "messaging", label: "Messaging", icon: "MessageSquare" },
  { key: "infrastructure", label: "Infrastructure", icon: "Layers" },
];

export function getComponentById(id) {
  return SYSTEM_COMPONENTS.find(c => c.id === id);
}
