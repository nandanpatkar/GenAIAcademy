// System Design Simulator — Tradeoff Cards (14 cards ported from original repo)
// Full port from vijaygupta18/system-design-simulator

export const TRADEOFF_CARDS = [
  {
    id: "sql-vs-nosql",
    title: "SQL vs NoSQL",
    optionA: {
      name: "SQL (Relational)",
      pros: [
        "ACID transactions",
        "Strong consistency",
        "Complex joins and queries",
        "Well-understood schema enforcement",
      ],
      cons: [
        "Harder to scale horizontally",
        "Rigid schema — migrations can be painful",
        "Lower write throughput at extreme scale",
      ],
    },
    optionB: {
      name: "NoSQL (Document/Key-Value)",
      pros: [
        "Horizontal scaling built-in",
        "Flexible schema",
        "High write throughput",
        "Low-latency key-value lookups",
      ],
      cons: [
        "Limited join support",
        "Eventual consistency by default",
        "Data modeling requires denormalization",
      ],
    },
    whenToChooseA: "When you need complex queries, transactions, or strong consistency (payments, inventory, user accounts).",
    whenToChooseB: "When you need massive scale, flexible schema, or high write throughput (social feeds, IoT data, session stores).",
  },
  {
    id: "push-vs-pull",
    title: "Push vs Pull (Fan-out)",
    optionA: {
      name: "Fan-out on Write (Push)",
      pros: [
        "Fast reads — timeline is pre-computed",
        "Simple read path",
        "Consistent user experience",
      ],
      cons: [
        "High write amplification for popular users",
        "Wasted work if followers never read",
        "Slow writes for celebrity accounts",
      ],
    },
    optionB: {
      name: "Fan-out on Read (Pull)",
      pros: [
        "No write amplification",
        "Always fresh data",
        "Simple write path",
      ],
      cons: [
        "Slow reads — must aggregate at read time",
        "Higher read latency",
        "Complex read path with many DB queries",
      ],
    },
    whenToChooseA: "For most users with moderate follower counts where read latency matters most.",
    whenToChooseB: "For celebrity/high-follower accounts, or when write simplicity is more important than read speed.",
  },
  {
    id: "sync-vs-async",
    title: "Sync vs Async Communication",
    optionA: {
      name: "Synchronous (Request-Response)",
      pros: [
        "Simple to reason about",
        "Immediate feedback",
        "Easy error handling",
        "Natural request-response pattern",
      ],
      cons: [
        "Tight coupling between services",
        "Cascading failures",
        "Caller blocks until response",
      ],
    },
    optionB: {
      name: "Asynchronous (Message Queue)",
      pros: [
        "Loose coupling",
        "Better fault tolerance",
        "Natural load leveling",
        "Retry and dead-letter support",
      ],
      cons: [
        "Harder to debug",
        "Eventual consistency",
        "Message ordering challenges",
        "Additional infrastructure (broker)",
      ],
    },
    whenToChooseA: "When you need immediate responses and simple request-response flows (API gateway to service, user-facing reads).",
    whenToChooseB: "For fire-and-forget tasks, cross-service events, or when you need to decouple producers from consumers (notifications, analytics, order processing).",
  },
  {
    id: "strong-vs-eventual",
    title: "Strong vs Eventual Consistency",
    optionA: {
      name: "Strong Consistency",
      pros: [
        "All reads see the latest write",
        "Simplifies application logic",
        "No stale data surprises",
      ],
      cons: [
        "Higher latency (coordination overhead)",
        "Lower availability during partitions",
        "Harder to scale geographically",
      ],
    },
    optionB: {
      name: "Eventual Consistency",
      pros: [
        "Higher availability",
        "Lower latency",
        "Better geographic distribution",
        "Higher throughput",
      ],
      cons: [
        "Stale reads possible",
        "Complex conflict resolution",
        "Application must handle inconsistency",
      ],
    },
    whenToChooseA: "For financial transactions, inventory counts, or anywhere correctness is non-negotiable.",
    whenToChooseB: "For social feeds, analytics, caches, or anywhere slight staleness is acceptable for better performance.",
  },
  {
    id: "monolith-vs-microservices",
    title: "Monolith vs Microservices",
    optionA: {
      name: "Monolith",
      pros: [
        "Simple deployment",
        "Easy local development",
        "No network overhead between modules",
        "Straightforward debugging",
      ],
      cons: [
        "Harder to scale individual components",
        "Longer build/deploy cycles at scale",
        "Technology lock-in",
        "Team coupling",
      ],
    },
    optionB: {
      name: "Microservices",
      pros: [
        "Independent scaling per service",
        "Independent deployments",
        "Technology flexibility per service",
        "Team autonomy",
      ],
      cons: [
        "Distributed system complexity",
        "Network latency between services",
        "Operational overhead (monitoring, tracing)",
        "Data consistency challenges",
      ],
    },
    whenToChooseA: "For early-stage products, small teams, or when the domain is not yet well understood.",
    whenToChooseB: "For large organizations with clear domain boundaries, independent scaling needs, and dedicated platform teams.",
  },
  {
    id: "rest-vs-grpc",
    title: "REST vs gRPC",
    optionA: {
      name: "REST (HTTP/JSON)",
      pros: [
        "Universal browser support",
        "Human-readable payloads",
        "Simple tooling (curl, Postman)",
        "Wide ecosystem",
      ],
      cons: [
        "Larger payload size (JSON)",
        "No built-in streaming",
        "No strict schema enforcement",
        "HTTP/1.1 overhead",
      ],
    },
    optionB: {
      name: "gRPC (Protocol Buffers)",
      pros: [
        "Binary protocol — smaller payloads",
        "Built-in bi-directional streaming",
        "Strong schema via .proto files",
        "HTTP/2 multiplexing",
      ],
      cons: [
        "No native browser support (needs proxy)",
        "Binary payloads harder to debug",
        "Steeper learning curve",
        "Code generation required",
      ],
    },
    whenToChooseA: "For public APIs, browser clients, or when developer experience and debuggability matter most.",
    whenToChooseB: "For internal service-to-service communication where performance, streaming, and strict contracts matter.",
  },
  {
    id: "cache-aside-vs-write-through",
    title: "Cache-aside vs Write-through",
    optionA: {
      name: "Cache-aside (Lazy Loading)",
      pros: [
        "Only caches data that is actually read",
        "Cache failure does not block writes",
        "Simple implementation",
      ],
      cons: [
        "Cache miss penalty (extra DB read)",
        "Stale data until TTL expires",
        "Cold start problem",
      ],
    },
    optionB: {
      name: "Write-through",
      pros: [
        "Cache is always up-to-date",
        "No stale data",
        "Consistent read performance",
      ],
      cons: [
        "Write latency increases (write to cache + DB)",
        "Caches data that may never be read",
        "More complex write path",
      ],
    },
    whenToChooseA: "For read-heavy workloads where some staleness is acceptable and you want to minimize cache size.",
    whenToChooseB: "When data freshness is critical and the write volume is manageable.",
  },
  {
    id: "vertical-vs-horizontal",
    title: "Vertical vs Horizontal Scaling",
    optionA: {
      name: "Vertical Scaling (Scale Up)",
      pros: [
        "No code changes needed",
        "No distributed system complexity",
        "Simple data consistency",
        "Lower operational overhead",
      ],
      cons: [
        "Hardware limits (single machine ceiling)",
        "Single point of failure",
        "Expensive at high end",
        "Downtime during upgrades",
      ],
    },
    optionB: {
      name: "Horizontal Scaling (Scale Out)",
      pros: [
        "Virtually unlimited capacity",
        "Better fault tolerance",
        "Cost-effective with commodity hardware",
        "Zero-downtime scaling",
      ],
      cons: [
        "Distributed system complexity",
        "Data partitioning challenges",
        "Network overhead",
        "Consistency challenges",
      ],
    },
    whenToChooseA: "For early-stage systems, databases that are hard to shard, or when simplicity outweighs scale needs.",
    whenToChooseB: "When you need fault tolerance, unlimited growth, or when individual machines cannot handle the load.",
  },
  {
    id: "polling-vs-websocket",
    title: "Polling vs WebSocket",
    optionA: {
      name: "Polling (Short/Long)",
      pros: [
        "Simple to implement",
        "Works through all proxies/firewalls",
        "Stateless — easy to load balance",
        "HTTP caching friendly",
      ],
      cons: [
        "Wasted requests when no new data",
        "Higher latency (polling interval)",
        "More server load at scale",
      ],
    },
    optionB: {
      name: "WebSocket",
      pros: [
        "Real-time bidirectional communication",
        "Low latency",
        "Efficient — no repeated handshakes",
        "Server can push updates instantly",
      ],
      cons: [
        "Stateful connections — harder to load balance",
        "Connection management overhead",
        "Proxy/firewall compatibility issues",
        "Reconnection logic needed",
      ],
    },
    whenToChooseA: "For infrequent updates, simple dashboards, or when infrastructure does not support persistent connections.",
    whenToChooseB: "For chat, live feeds, collaborative editing, gaming, or any feature needing sub-second updates.",
  },
  {
    id: "at-least-once-vs-exactly-once",
    title: "MQ: At-least-once vs Exactly-once",
    optionA: {
      name: "At-least-once Delivery",
      pros: [
        "Simpler to implement",
        "No message loss",
        "Higher throughput",
        "Most brokers support natively",
      ],
      cons: [
        "Duplicate messages possible",
        "Consumer must be idempotent",
        "Application-level deduplication needed",
      ],
    },
    optionB: {
      name: "Exactly-once Delivery",
      pros: [
        "No duplicates",
        "Simplifies consumer logic",
        "Correct by default",
      ],
      cons: [
        "Significant performance overhead",
        "Requires transactional coordination",
        "Limited broker support (Kafka transactions)",
        "Higher latency",
      ],
    },
    whenToChooseA: "For most use cases — design idempotent consumers instead (notifications, analytics, logs).",
    whenToChooseB: "For financial transactions or state changes where duplicates cause real harm and you can afford the cost.",
  },
];
