import React, { useMemo, useState } from "react";

/* GraphRAG Atlas — offline graph retrieval and provenance exploration lab. */

const GRAPH_CASES = [
  {
    id: "graph-001",
    title: "Customer signals · investigation 01",
    question: "What themes dominate customer feedback? Case 1.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 8,
    relationCount: 13,
    confidence: 0.67,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-002",
    title: "Vendor ecosystem · investigation 02",
    question: "Which risks connect vendors to the delay? Case 2.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 9,
    relationCount: 14,
    confidence: 0.68,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-003",
    title: "Security council · investigation 03",
    question: "Which teams bridge compliance and platform? Case 3.",
    recommended: "drift",
    community: "Security council",
    entityCount: 10,
    relationCount: 15,
    confidence: 0.6900000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-004",
    title: "Platform guild · investigation 04",
    question: "How did the security decision spread? Case 4.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 11,
    relationCount: 16,
    confidence: 0.7000000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-005",
    title: "Delivery network · investigation 05",
    question: "Who influences the Atlas launch? Case 5.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 12,
    relationCount: 17,
    confidence: 0.7100000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-006",
    title: "Customer signals · investigation 06",
    question: "What themes dominate customer feedback? Case 6.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 13,
    relationCount: 18,
    confidence: 0.72,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-007",
    title: "Vendor ecosystem · investigation 07",
    question: "Which risks connect vendors to the delay? Case 7.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 14,
    relationCount: 19,
    confidence: 0.73,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-008",
    title: "Security council · investigation 08",
    question: "Which teams bridge compliance and platform? Case 8.",
    recommended: "global",
    community: "Security council",
    entityCount: 15,
    relationCount: 20,
    confidence: 0.74,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-009",
    title: "Platform guild · investigation 09",
    question: "How did the security decision spread? Case 9.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 16,
    relationCount: 21,
    confidence: 0.75,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-010",
    title: "Delivery network · investigation 10",
    question: "Who influences the Atlas launch? Case 10.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 17,
    relationCount: 22,
    confidence: 0.76,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-011",
    title: "Customer signals · investigation 11",
    question: "What themes dominate customer feedback? Case 11.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 18,
    relationCount: 23,
    confidence: 0.77,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-012",
    title: "Vendor ecosystem · investigation 12",
    question: "Which risks connect vendors to the delay? Case 12.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 19,
    relationCount: 24,
    confidence: 0.78,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-013",
    title: "Security council · investigation 13",
    question: "Which teams bridge compliance and platform? Case 13.",
    recommended: "local",
    community: "Security council",
    entityCount: 7,
    relationCount: 25,
    confidence: 0.79,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-014",
    title: "Platform guild · investigation 14",
    question: "How did the security decision spread? Case 14.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 8,
    relationCount: 26,
    confidence: 0.8,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-015",
    title: "Delivery network · investigation 15",
    question: "Who influences the Atlas launch? Case 15.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 9,
    relationCount: 27,
    confidence: 0.81,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-016",
    title: "Customer signals · investigation 16",
    question: "What themes dominate customer feedback? Case 16.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 10,
    relationCount: 28,
    confidence: 0.8200000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-017",
    title: "Vendor ecosystem · investigation 17",
    question: "Which risks connect vendors to the delay? Case 17.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 11,
    relationCount: 29,
    confidence: 0.8300000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-018",
    title: "Security council · investigation 18",
    question: "Which teams bridge compliance and platform? Case 18.",
    recommended: "drift",
    community: "Security council",
    entityCount: 12,
    relationCount: 30,
    confidence: 0.8400000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-019",
    title: "Platform guild · investigation 19",
    question: "How did the security decision spread? Case 19.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 13,
    relationCount: 12,
    confidence: 0.8500000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-020",
    title: "Delivery network · investigation 20",
    question: "Who influences the Atlas launch? Case 20.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 14,
    relationCount: 13,
    confidence: 0.8600000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-021",
    title: "Customer signals · investigation 21",
    question: "What themes dominate customer feedback? Case 21.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 15,
    relationCount: 14,
    confidence: 0.87,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-022",
    title: "Vendor ecosystem · investigation 22",
    question: "Which risks connect vendors to the delay? Case 22.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 16,
    relationCount: 15,
    confidence: 0.88,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-023",
    title: "Security council · investigation 23",
    question: "Which teams bridge compliance and platform? Case 23.",
    recommended: "global",
    community: "Security council",
    entityCount: 17,
    relationCount: 16,
    confidence: 0.89,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-024",
    title: "Platform guild · investigation 24",
    question: "How did the security decision spread? Case 24.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 18,
    relationCount: 17,
    confidence: 0.9,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-025",
    title: "Delivery network · investigation 25",
    question: "Who influences the Atlas launch? Case 25.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 19,
    relationCount: 18,
    confidence: 0.91,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-026",
    title: "Customer signals · investigation 26",
    question: "What themes dominate customer feedback? Case 26.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 7,
    relationCount: 19,
    confidence: 0.92,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-027",
    title: "Vendor ecosystem · investigation 27",
    question: "Which risks connect vendors to the delay? Case 27.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 8,
    relationCount: 20,
    confidence: 0.93,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-028",
    title: "Security council · investigation 28",
    question: "Which teams bridge compliance and platform? Case 28.",
    recommended: "local",
    community: "Security council",
    entityCount: 9,
    relationCount: 21,
    confidence: 0.9400000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-029",
    title: "Platform guild · investigation 29",
    question: "How did the security decision spread? Case 29.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 10,
    relationCount: 22,
    confidence: 0.66,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-030",
    title: "Delivery network · investigation 30",
    question: "Who influences the Atlas launch? Case 30.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 11,
    relationCount: 23,
    confidence: 0.67,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-031",
    title: "Customer signals · investigation 31",
    question: "What themes dominate customer feedback? Case 31.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 12,
    relationCount: 24,
    confidence: 0.68,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-032",
    title: "Vendor ecosystem · investigation 32",
    question: "Which risks connect vendors to the delay? Case 32.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 13,
    relationCount: 25,
    confidence: 0.6900000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-033",
    title: "Security council · investigation 33",
    question: "Which teams bridge compliance and platform? Case 33.",
    recommended: "drift",
    community: "Security council",
    entityCount: 14,
    relationCount: 26,
    confidence: 0.7000000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-034",
    title: "Platform guild · investigation 34",
    question: "How did the security decision spread? Case 34.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 15,
    relationCount: 27,
    confidence: 0.7100000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-035",
    title: "Delivery network · investigation 35",
    question: "Who influences the Atlas launch? Case 35.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 16,
    relationCount: 28,
    confidence: 0.72,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-036",
    title: "Customer signals · investigation 36",
    question: "What themes dominate customer feedback? Case 36.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 17,
    relationCount: 29,
    confidence: 0.73,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-037",
    title: "Vendor ecosystem · investigation 37",
    question: "Which risks connect vendors to the delay? Case 37.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 18,
    relationCount: 30,
    confidence: 0.74,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-038",
    title: "Security council · investigation 38",
    question: "Which teams bridge compliance and platform? Case 38.",
    recommended: "global",
    community: "Security council",
    entityCount: 19,
    relationCount: 12,
    confidence: 0.75,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-039",
    title: "Platform guild · investigation 39",
    question: "How did the security decision spread? Case 39.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 7,
    relationCount: 13,
    confidence: 0.76,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-040",
    title: "Delivery network · investigation 40",
    question: "Who influences the Atlas launch? Case 40.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 8,
    relationCount: 14,
    confidence: 0.77,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-041",
    title: "Customer signals · investigation 41",
    question: "What themes dominate customer feedback? Case 41.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 9,
    relationCount: 15,
    confidence: 0.78,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-042",
    title: "Vendor ecosystem · investigation 42",
    question: "Which risks connect vendors to the delay? Case 42.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 10,
    relationCount: 16,
    confidence: 0.79,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-043",
    title: "Security council · investigation 43",
    question: "Which teams bridge compliance and platform? Case 43.",
    recommended: "local",
    community: "Security council",
    entityCount: 11,
    relationCount: 17,
    confidence: 0.8,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-044",
    title: "Platform guild · investigation 44",
    question: "How did the security decision spread? Case 44.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 12,
    relationCount: 18,
    confidence: 0.81,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-045",
    title: "Delivery network · investigation 45",
    question: "Who influences the Atlas launch? Case 45.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 13,
    relationCount: 19,
    confidence: 0.8200000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-046",
    title: "Customer signals · investigation 46",
    question: "What themes dominate customer feedback? Case 46.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 14,
    relationCount: 20,
    confidence: 0.8300000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-047",
    title: "Vendor ecosystem · investigation 47",
    question: "Which risks connect vendors to the delay? Case 47.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 15,
    relationCount: 21,
    confidence: 0.8400000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-048",
    title: "Security council · investigation 48",
    question: "Which teams bridge compliance and platform? Case 48.",
    recommended: "drift",
    community: "Security council",
    entityCount: 16,
    relationCount: 22,
    confidence: 0.8500000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-049",
    title: "Platform guild · investigation 49",
    question: "How did the security decision spread? Case 49.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 17,
    relationCount: 23,
    confidence: 0.8600000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-050",
    title: "Delivery network · investigation 50",
    question: "Who influences the Atlas launch? Case 50.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 18,
    relationCount: 24,
    confidence: 0.87,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-051",
    title: "Customer signals · investigation 51",
    question: "What themes dominate customer feedback? Case 51.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 19,
    relationCount: 25,
    confidence: 0.88,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-052",
    title: "Vendor ecosystem · investigation 52",
    question: "Which risks connect vendors to the delay? Case 52.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 7,
    relationCount: 26,
    confidence: 0.89,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-053",
    title: "Security council · investigation 53",
    question: "Which teams bridge compliance and platform? Case 53.",
    recommended: "global",
    community: "Security council",
    entityCount: 8,
    relationCount: 27,
    confidence: 0.9,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-054",
    title: "Platform guild · investigation 54",
    question: "How did the security decision spread? Case 54.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 9,
    relationCount: 28,
    confidence: 0.91,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-055",
    title: "Delivery network · investigation 55",
    question: "Who influences the Atlas launch? Case 55.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 10,
    relationCount: 29,
    confidence: 0.92,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-056",
    title: "Customer signals · investigation 56",
    question: "What themes dominate customer feedback? Case 56.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 11,
    relationCount: 30,
    confidence: 0.93,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-057",
    title: "Vendor ecosystem · investigation 57",
    question: "Which risks connect vendors to the delay? Case 57.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 12,
    relationCount: 12,
    confidence: 0.9400000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-058",
    title: "Security council · investigation 58",
    question: "Which teams bridge compliance and platform? Case 58.",
    recommended: "local",
    community: "Security council",
    entityCount: 13,
    relationCount: 13,
    confidence: 0.66,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-059",
    title: "Platform guild · investigation 59",
    question: "How did the security decision spread? Case 59.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 14,
    relationCount: 14,
    confidence: 0.67,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-060",
    title: "Delivery network · investigation 60",
    question: "Who influences the Atlas launch? Case 60.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 15,
    relationCount: 15,
    confidence: 0.68,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-061",
    title: "Customer signals · investigation 61",
    question: "What themes dominate customer feedback? Case 61.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 16,
    relationCount: 16,
    confidence: 0.6900000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-062",
    title: "Vendor ecosystem · investigation 62",
    question: "Which risks connect vendors to the delay? Case 62.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 17,
    relationCount: 17,
    confidence: 0.7000000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-063",
    title: "Security council · investigation 63",
    question: "Which teams bridge compliance and platform? Case 63.",
    recommended: "drift",
    community: "Security council",
    entityCount: 18,
    relationCount: 18,
    confidence: 0.7100000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-064",
    title: "Platform guild · investigation 64",
    question: "How did the security decision spread? Case 64.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 19,
    relationCount: 19,
    confidence: 0.72,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-065",
    title: "Delivery network · investigation 65",
    question: "Who influences the Atlas launch? Case 65.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 7,
    relationCount: 20,
    confidence: 0.73,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-066",
    title: "Customer signals · investigation 66",
    question: "What themes dominate customer feedback? Case 66.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 8,
    relationCount: 21,
    confidence: 0.74,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-067",
    title: "Vendor ecosystem · investigation 67",
    question: "Which risks connect vendors to the delay? Case 67.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 9,
    relationCount: 22,
    confidence: 0.75,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-068",
    title: "Security council · investigation 68",
    question: "Which teams bridge compliance and platform? Case 68.",
    recommended: "global",
    community: "Security council",
    entityCount: 10,
    relationCount: 23,
    confidence: 0.76,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-069",
    title: "Platform guild · investigation 69",
    question: "How did the security decision spread? Case 69.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 11,
    relationCount: 24,
    confidence: 0.77,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-070",
    title: "Delivery network · investigation 70",
    question: "Who influences the Atlas launch? Case 70.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 12,
    relationCount: 25,
    confidence: 0.78,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-071",
    title: "Customer signals · investigation 71",
    question: "What themes dominate customer feedback? Case 71.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 13,
    relationCount: 26,
    confidence: 0.79,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-072",
    title: "Vendor ecosystem · investigation 72",
    question: "Which risks connect vendors to the delay? Case 72.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 14,
    relationCount: 27,
    confidence: 0.8,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-073",
    title: "Security council · investigation 73",
    question: "Which teams bridge compliance and platform? Case 73.",
    recommended: "local",
    community: "Security council",
    entityCount: 15,
    relationCount: 28,
    confidence: 0.81,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-074",
    title: "Platform guild · investigation 74",
    question: "How did the security decision spread? Case 74.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 16,
    relationCount: 29,
    confidence: 0.8200000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-075",
    title: "Delivery network · investigation 75",
    question: "Who influences the Atlas launch? Case 75.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 17,
    relationCount: 30,
    confidence: 0.8300000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-076",
    title: "Customer signals · investigation 76",
    question: "What themes dominate customer feedback? Case 76.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 18,
    relationCount: 12,
    confidence: 0.8400000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-077",
    title: "Vendor ecosystem · investigation 77",
    question: "Which risks connect vendors to the delay? Case 77.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 19,
    relationCount: 13,
    confidence: 0.8500000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-078",
    title: "Security council · investigation 78",
    question: "Which teams bridge compliance and platform? Case 78.",
    recommended: "drift",
    community: "Security council",
    entityCount: 7,
    relationCount: 14,
    confidence: 0.8600000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-079",
    title: "Platform guild · investigation 79",
    question: "How did the security decision spread? Case 79.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 8,
    relationCount: 15,
    confidence: 0.87,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-080",
    title: "Delivery network · investigation 80",
    question: "Who influences the Atlas launch? Case 80.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 9,
    relationCount: 16,
    confidence: 0.88,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-081",
    title: "Customer signals · investigation 81",
    question: "What themes dominate customer feedback? Case 81.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 10,
    relationCount: 17,
    confidence: 0.89,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-082",
    title: "Vendor ecosystem · investigation 82",
    question: "Which risks connect vendors to the delay? Case 82.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 11,
    relationCount: 18,
    confidence: 0.9,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-083",
    title: "Security council · investigation 83",
    question: "Which teams bridge compliance and platform? Case 83.",
    recommended: "global",
    community: "Security council",
    entityCount: 12,
    relationCount: 19,
    confidence: 0.91,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-084",
    title: "Platform guild · investigation 84",
    question: "How did the security decision spread? Case 84.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 13,
    relationCount: 20,
    confidence: 0.92,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-085",
    title: "Delivery network · investigation 85",
    question: "Who influences the Atlas launch? Case 85.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 14,
    relationCount: 21,
    confidence: 0.93,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-086",
    title: "Customer signals · investigation 86",
    question: "What themes dominate customer feedback? Case 86.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 15,
    relationCount: 22,
    confidence: 0.9400000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-087",
    title: "Vendor ecosystem · investigation 87",
    question: "Which risks connect vendors to the delay? Case 87.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 16,
    relationCount: 23,
    confidence: 0.66,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-088",
    title: "Security council · investigation 88",
    question: "Which teams bridge compliance and platform? Case 88.",
    recommended: "local",
    community: "Security council",
    entityCount: 17,
    relationCount: 24,
    confidence: 0.67,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-089",
    title: "Platform guild · investigation 89",
    question: "How did the security decision spread? Case 89.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 18,
    relationCount: 25,
    confidence: 0.68,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-090",
    title: "Delivery network · investigation 90",
    question: "Who influences the Atlas launch? Case 90.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 19,
    relationCount: 26,
    confidence: 0.6900000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-091",
    title: "Customer signals · investigation 91",
    question: "What themes dominate customer feedback? Case 91.",
    recommended: "local",
    community: "Customer signals",
    entityCount: 7,
    relationCount: 27,
    confidence: 0.7000000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-092",
    title: "Vendor ecosystem · investigation 92",
    question: "Which risks connect vendors to the delay? Case 92.",
    recommended: "global",
    community: "Vendor ecosystem",
    entityCount: 8,
    relationCount: 28,
    confidence: 0.7100000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-093",
    title: "Security council · investigation 93",
    question: "Which teams bridge compliance and platform? Case 93.",
    recommended: "drift",
    community: "Security council",
    entityCount: 9,
    relationCount: 29,
    confidence: 0.72,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-094",
    title: "Platform guild · investigation 94",
    question: "How did the security decision spread? Case 94.",
    recommended: "local",
    community: "Platform guild",
    entityCount: 10,
    relationCount: 30,
    confidence: 0.73,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-095",
    title: "Delivery network · investigation 95",
    question: "Who influences the Atlas launch? Case 95.",
    recommended: "global",
    community: "Delivery network",
    entityCount: 11,
    relationCount: 12,
    confidence: 0.74,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-096",
    title: "Customer signals · investigation 96",
    question: "What themes dominate customer feedback? Case 96.",
    recommended: "drift",
    community: "Customer signals",
    entityCount: 12,
    relationCount: 13,
    confidence: 0.75,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-097",
    title: "Vendor ecosystem · investigation 97",
    question: "Which risks connect vendors to the delay? Case 97.",
    recommended: "local",
    community: "Vendor ecosystem",
    entityCount: 13,
    relationCount: 14,
    confidence: 0.76,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-098",
    title: "Security council · investigation 98",
    question: "Which teams bridge compliance and platform? Case 98.",
    recommended: "global",
    community: "Security council",
    entityCount: 14,
    relationCount: 15,
    confidence: 0.77,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-099",
    title: "Platform guild · investigation 99",
    question: "How did the security decision spread? Case 99.",
    recommended: "drift",
    community: "Platform guild",
    entityCount: 15,
    relationCount: 16,
    confidence: 0.78,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-100",
    title: "Delivery network · investigation 100",
    question: "Who influences the Atlas launch? Case 100.",
    recommended: "local",
    community: "Delivery network",
    entityCount: 16,
    relationCount: 17,
    confidence: 0.79,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-101",
    title: "Customer signals · investigation 101",
    question: "What themes dominate customer feedback? Case 101.",
    recommended: "global",
    community: "Customer signals",
    entityCount: 17,
    relationCount: 18,
    confidence: 0.8,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-102",
    title: "Vendor ecosystem · investigation 102",
    question: "Which risks connect vendors to the delay? Case 102.",
    recommended: "drift",
    community: "Vendor ecosystem",
    entityCount: 18,
    relationCount: 19,
    confidence: 0.81,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
  {
    id: "graph-103",
    title: "Security council · investigation 103",
    question: "Which teams bridge compliance and platform? Case 103.",
    recommended: "local",
    community: "Security council",
    entityCount: 19,
    relationCount: 20,
    confidence: 0.8200000000000001,
    rationale: "Direct neighbors reveal the named entity and its strongest relationships.",
  },
  {
    id: "graph-104",
    title: "Platform guild · investigation 104",
    question: "How did the security decision spread? Case 104.",
    recommended: "global",
    community: "Platform guild",
    entityCount: 7,
    relationCount: 21,
    confidence: 0.8300000000000001,
    rationale: "Community reports summarize the system-wide theme across many sources.",
  },
  {
    id: "graph-105",
    title: "Delivery network · investigation 105",
    question: "Who influences the Atlas launch? Case 105.",
    recommended: "drift",
    community: "Delivery network",
    entityCount: 8,
    relationCount: 22,
    confidence: 0.8400000000000001,
    rationale: "A broad community hypothesis is refined through local entity traversal.",
  },
];

const NODES = [
  { id: "atlas", label: "Atlas launch", type: "project", x: 50, y: 49, community: 0 },
  { id: "maya", label: "Maya Rao", type: "person", x: 27, y: 27, community: 0 },
  { id: "risk", label: "Delay risk", type: "risk", x: 72, y: 25, community: 0 },
  { id: "vendor", label: "Nova Freight", type: "org", x: 87, y: 51, community: 1 },
  { id: "security", label: "Security review", type: "event", x: 62, y: 74, community: 2 },
  { id: "policy", label: "Control P-17", type: "document", x: 34, y: 76, community: 2 },
  { id: "customer", label: "Customer pulse", type: "signal", x: 14, y: 58, community: 3 },
  { id: "platform", label: "Platform team", type: "team", x: 48, y: 18, community: 0 },
  { id: "region", label: "APAC region", type: "place", x: 91, y: 79, community: 1 },
  { id: "incident", label: "Incident 284", type: "event", x: 69, y: 91, community: 2 },
  { id: "budget", label: "Q3 budget", type: "document", x: 15, y: 88, community: 3 },
  { id: "legal", label: "Legal team", type: "team", x: 9, y: 20, community: 3 },
];
const EDGES = [
  { id: "edge-1", from: "maya", to: "atlas", label: "owns" },
  { id: "edge-2", from: "platform", to: "atlas", label: "builds" },
  { id: "edge-3", from: "risk", to: "atlas", label: "threatens" },
  { id: "edge-4", from: "vendor", to: "risk", label: "contributes" },
  { id: "edge-5", from: "region", to: "vendor", label: "operates in" },
  { id: "edge-6", from: "security", to: "atlas", label: "gates" },
  { id: "edge-7", from: "policy", to: "security", label: "governs" },
  { id: "edge-8", from: "incident", to: "security", label: "triggered" },
  { id: "edge-9", from: "customer", to: "atlas", label: "shapes" },
  { id: "edge-10", from: "budget", to: "atlas", label: "funds" },
  { id: "edge-11", from: "legal", to: "policy", label: "approved" },
  { id: "edge-12", from: "vendor", to: "incident", label: "mentioned in" },
  { id: "edge-13", from: "customer", to: "risk", label: "reports" },
  { id: "edge-14", from: "platform", to: "security", label: "implements" },
  { id: "edge-15", from: "maya", to: "legal", label: "consulted" },
];
const COMMUNITY = [
  { id: 0, name: "Atlas delivery", color: "#ffb84d", report: "Launch ownership, platform work, and delay risk converge around Atlas." },
  { id: 1, name: "Vendor exposure", color: "#ee6c68", report: "Nova Freight and APAC operations form the external dependency cluster." },
  { id: 2, name: "Security controls", color: "#6dd3b5", report: "Incident 284 led to review work governed by Control P-17." },
  { id: 3, name: "Business signals", color: "#7eb6ff", report: "Customer, legal, and budget evidence shape the launch boundary." },
];

function Icon({ name, size = 18 }) {
  const paths = {
    graph: <><circle cx="5" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="m7.4 11 8.3-4M7.4 13l9.2 4" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    cite: <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    spark: <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function queryGraph(mode, focusId, hops) {
  const visited = new Set([focusId]);
  let frontier = new Set([focusId]);
  for (let depth = 0; depth < hops; depth += 1) {
    const next = new Set();
    EDGES.forEach((edge) => {
      if (frontier.has(edge.from)) next.add(edge.to);
      if (frontier.has(edge.to)) next.add(edge.from);
    });
    next.forEach((id) => visited.add(id));
    frontier = next;
  }
  if (mode === "global") return new Set(NODES.map((node) => node.id));
  if (mode === "drift") { COMMUNITY.filter((group) => visited.has(NODES.find((node) => node.community === group.id)?.id)).forEach((group) => NODES.filter((node) => node.community === group.id).forEach((node) => visited.add(node.id))); }
  return visited;
}

function ModeCard({ id, title, subtitle, selected, onClick, icon }) {
  return <button className={`ga-mode ${selected ? "is-selected" : ""}`} onClick={onClick} aria-pressed={selected}><Icon name={icon} /><span><strong>{title}</strong><small>{subtitle}</small></span></button>;
}

function GraphCanvas({ active, focusId, onFocus }) {
  return <div className="ga-canvas" role="img" aria-label="Knowledge graph of project entities and evidence">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {EDGES.map((edge) => { const from = NODES.find((node) => node.id === edge.from); const to = NODES.find((node) => node.id === edge.to); const enabled = active.has(from.id) && active.has(to.id); return <g key={edge.id} className={enabled ? "is-active" : ""}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} /><text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2}>{enabled ? edge.label : ""}</text></g>; })}
      {NODES.map((node) => { const enabled = active.has(node.id); const group = COMMUNITY[node.community]; return <g key={node.id} className={`ga-node ${enabled ? "is-active" : ""} ${focusId === node.id ? "is-focus" : ""}`} transform={`translate(${node.x} ${node.y})`} onClick={() => onFocus(node.id)} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onFocus(node.id); }} aria-label={`Focus ${node.label}`}><circle r={focusId === node.id ? 5.4 : 4.3} fill={group.color} /><text y="8">{node.label}</text></g>; })}
    </svg>
    <div className="ga-legend">{COMMUNITY.map((group) => <span key={group.id}><i style={{ background: group.color }} />{group.name}</span>)}</div>
  </div>;
}

export default function GraphRagAtlasLab() {
  const [caseId, setCaseId] = useState("graph-003");
  const [mode, setMode] = useState("local");
  const [focusId, setFocusId] = useState("atlas");
  const [hops, setHops] = useState(1);
  const [showProvenance, setShowProvenance] = useState(true);
  const item = GRAPH_CASES.find((entry) => entry.id === caseId) || GRAPH_CASES[0];
  const active = useMemo(() => queryGraph(mode, focusId, hops), [mode, focusId, hops]);
  const focus = NODES.find((node) => node.id === focusId);
  const selectedCommunities = COMMUNITY.filter((group) => NODES.some((node) => node.community === group.id && active.has(node.id)));
  const evidence = NODES.filter((node) => active.has(node.id)).slice(0, mode === "global" ? 8 : 6);
  const tokenCost = 420 + evidence.length * 132 + (mode === "global" ? 910 : mode === "drift" ? 480 : 0);
  const answer = mode === "global" ? "Across the corpus, Atlas delivery risk is driven by vendor exposure and tightened security controls, while customer signals and budget remain supportive." : mode === "drift" ? "Community summaries identify vendor exposure as the likely theme; local traversal then connects Nova Freight, APAC operations, and Incident 284 to the Atlas delay." : `${focus?.label} connects to ${evidence.slice(1,4).map((node) => node.label).join(", ")}, providing direct entity-level evidence for the answer.`;

  return <main className="graph-atlas">
    <header className="ga-header"><div className="ga-mark"><Icon name="graph" size={26} /></div><div><span>GraphRAG field lab</span><h1>Atlas of connected evidence</h1><p>Switch query strategies, traverse relationships, and inspect the provenance behind a synthesized answer.</p></div><label><span>Investigation</span><select value={caseId} onChange={(event) => setCaseId(event.target.value)}>{GRAPH_CASES.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label></header>
    <section className="ga-question"><span>Research question</span><strong>{item.question}</strong><small>Suggested strategy: {item.recommended}</small></section>
    <section className="ga-modes" aria-label="Graph query strategy"><ModeCard id="local" title="Local search" subtitle="Entity + neighborhood" icon="compass" selected={mode === "local"} onClick={() => setMode("local")} /><ModeCard id="global" title="Global search" subtitle="Community reports" icon="layers" selected={mode === "global"} onClick={() => setMode("global")} /><ModeCard id="drift" title="DRIFT search" subtitle="Broad theme → local detail" icon="spark" selected={mode === "drift"} onClick={() => setMode("drift")} /></section>
    <div className="ga-grid">
      <section className="ga-map-panel"><header><div><span>Interactive knowledge map</span><strong>{active.size} of {NODES.length} entities in context</strong></div><label>Traversal depth <input type="range" min="1" max="3" value={hops} onChange={(event) => setHops(Number(event.target.value))} /><output>{hops} hop{hops > 1 ? "s" : ""}</output></label></header><GraphCanvas active={active} focusId={focusId} onFocus={setFocusId} /></section>
      <aside className="ga-side">
        <section className="ga-focus"><span className="ga-kicker">Focused entity</span><h2>{focus?.label}</h2><p>{focus?.type} · {COMMUNITY[focus?.community]?.name}</p><div className="ga-stat-row"><div><strong>{active.size}</strong><span>entities</span></div><div><strong>{EDGES.filter((edge) => active.has(edge.from) && active.has(edge.to)).length}</strong><span>relations</span></div><div><strong>{tokenCost}</strong><span>tokens</span></div></div></section>
        <section className="ga-reports"><span className="ga-kicker">Community reports</span>{selectedCommunities.map((group) => <article key={group.id}><i style={{ background: group.color }} /><div><strong>{group.name}</strong><p>{group.report}</p></div></article>)}</section>
      </aside>
    </div>
    <section className="ga-answer"><header><div><Icon name="spark" /><span>Grounded synthesis</span></div><button onClick={() => setShowProvenance((value) => !value)} aria-pressed={showProvenance}><Icon name="cite" size={16} /> {showProvenance ? "Hide" : "Show"} provenance</button></header><p>{answer}</p>{showProvenance && <div className="ga-provenance">{evidence.map((node, index) => <button key={node.id} onClick={() => setFocusId(node.id)}><span>[{index + 1}]</span><strong>{node.label}</strong><small>{node.type} · {COMMUNITY[node.community].name}</small></button>)}</div>}<footer><span>Coverage <b>{Math.round((active.size / NODES.length) * 100)}%</b></span><span>Query cost <b>{tokenCost.toLocaleString()} tokens</b></span><span>Strategy <b>{mode.toUpperCase()}</b></span></footer></section>
    <section className="ga-teach"><article><span>A</span><h3>Local answers “who?”</h3><p>Start at a named entity and traverse nearby relationships for precise factual questions.</p></article><article><span>B</span><h3>Global answers “what themes?”</h3><p>Aggregate hierarchical community summaries when no single chunk can represent the whole corpus.</p></article><article><span>C</span><h3>DRIFT bridges both</h3><p>Use a global hypothesis to choose communities, then descend into entities for evidence.</p></article></section>
    <style>{`
:root {
  color-scheme: dark;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #090d16;
}
button,
select,
input {
  font: inherit;
}
button,
select,
input[type="range"] {
  cursor: pointer;
}
.graph-atlas {
  --ink: #f2f6ff;
  --muted: #94a1b8;
  --line: #263044;
  --panel: #111827;
  --panel-2: #151e2e;
  --gold: #ffb84d;
  min-height: 100vh;
  padding: 30px clamp(16px,4vw,58px) 48px;
  color: var(--ink);
  background:
    radial-gradient(circle at 20% -10%, rgba(81,112,171,.2), transparent 34%),
    radial-gradient(circle at 90% 20%, rgba(22,139,125,.11), transparent 30%),
    #090d16;
  font-family: "IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif;
}
.ga-header {
  max-width: 1460px;
  margin: 0 auto 18px;
  display: grid;
  grid-template-columns: auto minmax(0,1fr) minmax(220px,320px);
  gap: 16px;
  align-items: center;
}
.ga-mark {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border: 1px solid #43506a;
  border-radius: 50%;
  color: var(--gold);
  background: #111827;
}
.ga-header span,
.ga-kicker {
  display: block;
  color: var(--gold);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.ga-header h1 {
  margin: 4px 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(30px,4.4vw,58px);
  font-weight: 500;
  line-height: 1;
}
.ga-header p {
  margin: 7px 0 0;
  max-width: 700px;
  color: var(--muted);
  font-size: 14px;
}
.ga-header label {
  display: grid;
  gap: 6px;
}
.ga-header select {
  width: 100%;
  color: var(--ink);
  border: 1px solid #35415a;
  border-radius: 8px;
  background: #141d2c;
  padding: 11px;
}
.ga-question {
  max-width: 1460px;
  margin: 0 auto 12px;
  padding: 15px 18px;
  border: 1px solid #37435a;
  border-radius: 10px;
  background: rgba(20,29,44,.86);
  display: grid;
  grid-template-columns: auto minmax(0,1fr) auto;
  gap: 16px;
  align-items: center;
}
.ga-question span {
  color: var(--muted);
  font-size: 10px;
  text-transform: uppercase;
}
.ga-question strong {
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 500;
}
.ga-question small {
  color: var(--gold);
  font-size: 10px;
}
.ga-modes {
  max-width: 1460px;
  margin: 0 auto 12px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 9px;
}
.ga-mode {
  min-height: 64px;
  padding: 11px 14px;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #101724;
  display: flex;
  align-items: center;
  gap: 11px;
  text-align: left;
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
}
.ga-mode:hover {
  transform: translateY(-2px);
  border-color: #53617a;
}
.ga-mode.is-selected {
  color: var(--ink);
  border-color: var(--gold);
  background: #1c2130;
  box-shadow: inset 0 -2px var(--gold);
}
.ga-mode svg {
  color: var(--gold);
}
.ga-mode strong,
.ga-mode small {
  display: block;
}
.ga-mode strong {
  font-size: 13px;
}
.ga-mode small {
  color: var(--muted);
  margin-top: 3px;
  font-size: 10px;
}
.ga-grid {
  max-width: 1460px;
  margin: 0 auto 12px;
  display: grid;
  grid-template-columns: minmax(0,1fr) 310px;
  gap: 12px;
  align-items: stretch;
}
.ga-map-panel,
.ga-side > section,
.ga-answer,
.ga-teach article {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(16,23,36,.94);
}
.ga-map-panel {
  min-width: 0;
  overflow: hidden;
}
.ga-map-panel > header {
  padding: 13px 15px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}
.ga-map-panel header span,
.ga-map-panel header strong {
  display: block;
}
.ga-map-panel header span {
  color: var(--muted);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .1em;
}
.ga-map-panel header strong {
  margin-top: 4px;
  font-size: 12px;
}
.ga-map-panel label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 10px;
}
.ga-map-panel input {
  width: 100px;
  accent-color: var(--gold);
}
.ga-map-panel output {
  min-width: 46px;
  color: var(--gold);
  font-weight: 800;
}
.ga-canvas {
  position: relative;
  min-height: 480px;
  background:
    linear-gradient(rgba(91,108,139,.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(91,108,139,.08) 1px, transparent 1px),
    #0d1420;
  background-size: 30px 30px;
}
.ga-canvas > svg {
  display: block;
  width: 100%;
  height: 480px;
  overflow: visible;
}
.ga-canvas line {
  stroke: #283349;
  stroke-width: .24;
  transition: stroke .25s ease, stroke-width .25s ease;
}
.ga-canvas g.is-active line {
  stroke: #66758e;
  stroke-width: .38;
}
.ga-canvas g > text {
  fill: #9aa8bd;
  font-size: 1.45px;
  text-anchor: middle;
  paint-order: stroke;
  stroke: #0d1420;
  stroke-width: .45px;
}
.ga-canvas g:not(.is-active) > text {
  display: none;
}
.ga-node {
  cursor: pointer;
  opacity: .18;
  transition: opacity .2s ease;
}
.ga-node.is-active {
  opacity: 1;
}
.ga-node circle {
  stroke: #0d1420;
  stroke-width: 1.2;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,.55));
}
.ga-node.is-focus circle {
  stroke: white;
  stroke-width: .8;
}
.ga-node text {
  font-size: 2.1px !important;
  font-weight: 700;
}
.ga-node:focus-visible circle {
  stroke: #fff;
  stroke-width: 1.2;
}
.ga-legend {
  position: absolute;
  left: 14px;
  bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 8px 10px;
  border: 1px solid #2b374c;
  border-radius: 7px;
  background: rgba(9,13,22,.88);
}
.ga-legend span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #aab5c7;
  font-size: 8px;
}
.ga-legend i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.ga-side {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
}
.ga-focus {
  padding: 18px;
}
.ga-focus h2 {
  margin: 10px 0 4px;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 500;
}
.ga-focus > p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}
.ga-stat-row {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  border-top: 1px solid var(--line);
}
.ga-stat-row div {
  padding-top: 13px;
}
.ga-stat-row strong,
.ga-stat-row span {
  display: block;
}
.ga-stat-row strong {
  color: var(--gold);
  font: 700 18px ui-monospace, monospace;
}
.ga-stat-row span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ga-reports {
  padding: 16px;
}
.ga-reports article {
  display: flex;
  gap: 9px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
}
.ga-reports article:first-of-type {
  margin-top: 9px;
}
.ga-reports article > i {
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 50%;
  flex: none;
}
.ga-reports strong {
  font-size: 11px;
}
.ga-reports p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}
.ga-answer {
  max-width: 1460px;
  margin: 0 auto 12px;
  padding: 18px;
  background: #f1eadc;
  color: #26241f;
}
.ga-answer > header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ga-answer header > div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f5815;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .1em;
}
.ga-answer button {
  min-height: 40px;
  padding: 8px 11px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #564623;
  border: 1px solid #c7b993;
  border-radius: 7px;
  background: #fff9e9;
  font-size: 10px;
  font-weight: 800;
}
.ga-answer > p {
  margin: 18px 0;
  max-width: 1000px;
  font-family: Georgia, serif;
  font-size: clamp(18px,2.2vw,28px);
  line-height: 1.45;
}
.ga-provenance {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 8px;
}
.ga-provenance button {
  min-height: 70px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-content: center;
  text-align: left;
}
.ga-provenance button span {
  grid-row: 1 / 3;
  color: #9a6d1f;
}
.ga-provenance button strong,
.ga-provenance button small {
  display: block;
}
.ga-provenance button small {
  color: #746d5e;
  margin-top: 3px;
}
.ga-answer footer {
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #d2c8ad;
  display: flex;
  gap: 24px;
  color: #746d5e;
  font-size: 9px;
  text-transform: uppercase;
}
.ga-answer footer b {
  color: #27241e;
}
.ga-teach {
  max-width: 1460px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 12px;
}
.ga-teach article {
  padding: 15px;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 11px;
}
.ga-teach article > span {
  grid-row: 1 / 3;
  color: var(--gold);
  font: 800 11px ui-monospace, monospace;
}
.ga-teach h3 {
  margin: 0;
  font-size: 12px;
}
.ga-teach p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
}
.graph-atlas button:focus-visible,
.graph-atlas select:focus-visible,
.graph-atlas input:focus-visible {
  outline: 2px solid #b9892c;
  outline-offset: 2px;
}
@media (max-width: 950px) {
  .ga-header {
    grid-template-columns: auto 1fr;
  }
  .ga-header label {
    grid-column: 1 / -1;
  }
  .ga-grid {
    grid-template-columns: 1fr;
  }
  .ga-side {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
}
@media (max-width: 680px) {
  .graph-atlas {
    padding: 22px 11px 34px;
  }
  .ga-header {
    grid-template-columns: 1fr;
  }
  .ga-mark {
    width: 44px;
    height: 44px;
  }
  .ga-question,
  .ga-modes,
  .ga-side,
  .ga-teach {
    grid-template-columns: 1fr;
  }
  .ga-question {
    gap: 7px;
  }
  .ga-map-panel > header {
    align-items: start;
    flex-direction: column;
  }
  .ga-canvas,
  .ga-canvas > svg {
    min-height: 390px;
    height: 390px;
  }
  .ga-provenance {
    grid-template-columns: 1fr 1fr;
  }
  .ga-answer footer {
    flex-wrap: wrap;
    gap: 10px 18px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
    `}</style>
  </main>;
}
