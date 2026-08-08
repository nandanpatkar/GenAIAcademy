import React, { useMemo, useState } from "react";

/* Retrieval Observatory — deterministic, offline RAG retrieval simulator. */

const QUERY_CASES = [
  {
    id: "rq-001",
    title: "Error code · case 001",
    query: "ERR_AUTH_TOKEN_42 — hr policy scenario 1",
    domain: "HR policy",
    ideal: "lexical",
    relevant: 3,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-002",
    title: "Conceptual policy · case 002",
    query: "parental leave eligibility — vendor contracts scenario 2",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-003",
    title: "Versioned API · case 003",
    query: "SDK v3 retry configuration — payments runbook scenario 3",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-004",
    title: "Named entity · case 004",
    query: "Project Northstar owner — security wiki scenario 4",
    domain: "Security wiki",
    ideal: "lexical",
    relevant: 2,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-005",
    title: "Multi-hop fact · case 005",
    query: "supplier linked to delayed region — incident reports scenario 5",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-006",
    title: "Ambiguous acronym · case 006",
    query: "What does ARC mean here? — platform docs scenario 6",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-007",
    title: "Error code · case 007",
    query: "ERR_AUTH_TOKEN_42 — release archive scenario 7",
    domain: "Release archive",
    ideal: "lexical",
    relevant: 5,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-008",
    title: "Conceptual policy · case 008",
    query: "parental leave eligibility — support handbook scenario 8",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-009",
    title: "Versioned API · case 009",
    query: "SDK v3 retry configuration — hr policy scenario 9",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-010",
    title: "Named entity · case 010",
    query: "Project Northstar owner — vendor contracts scenario 10",
    domain: "Vendor contracts",
    ideal: "lexical",
    relevant: 4,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-011",
    title: "Multi-hop fact · case 011",
    query: "supplier linked to delayed region — payments runbook scenario 11",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-012",
    title: "Ambiguous acronym · case 012",
    query: "What does ARC mean here? — security wiki scenario 12",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-013",
    title: "Error code · case 013",
    query: "ERR_AUTH_TOKEN_42 — incident reports scenario 13",
    domain: "Incident reports",
    ideal: "lexical",
    relevant: 3,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-014",
    title: "Conceptual policy · case 014",
    query: "parental leave eligibility — platform docs scenario 14",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-015",
    title: "Versioned API · case 015",
    query: "SDK v3 retry configuration — release archive scenario 15",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-016",
    title: "Named entity · case 016",
    query: "Project Northstar owner — support handbook scenario 16",
    domain: "Support handbook",
    ideal: "lexical",
    relevant: 2,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-017",
    title: "Multi-hop fact · case 017",
    query: "supplier linked to delayed region — hr policy scenario 17",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-018",
    title: "Ambiguous acronym · case 018",
    query: "What does ARC mean here? — vendor contracts scenario 18",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-019",
    title: "Error code · case 019",
    query: "ERR_AUTH_TOKEN_42 — payments runbook scenario 19",
    domain: "Payments runbook",
    ideal: "lexical",
    relevant: 5,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-020",
    title: "Conceptual policy · case 020",
    query: "parental leave eligibility — security wiki scenario 20",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-021",
    title: "Versioned API · case 021",
    query: "SDK v3 retry configuration — incident reports scenario 21",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-022",
    title: "Named entity · case 022",
    query: "Project Northstar owner — platform docs scenario 22",
    domain: "Platform docs",
    ideal: "lexical",
    relevant: 4,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-023",
    title: "Multi-hop fact · case 023",
    query: "supplier linked to delayed region — release archive scenario 23",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-024",
    title: "Ambiguous acronym · case 024",
    query: "What does ARC mean here? — support handbook scenario 24",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-025",
    title: "Error code · case 025",
    query: "ERR_AUTH_TOKEN_42 — hr policy scenario 25",
    domain: "HR policy",
    ideal: "lexical",
    relevant: 3,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-026",
    title: "Conceptual policy · case 026",
    query: "parental leave eligibility — vendor contracts scenario 26",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-027",
    title: "Versioned API · case 027",
    query: "SDK v3 retry configuration — payments runbook scenario 27",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-028",
    title: "Named entity · case 028",
    query: "Project Northstar owner — security wiki scenario 28",
    domain: "Security wiki",
    ideal: "lexical",
    relevant: 2,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-029",
    title: "Multi-hop fact · case 029",
    query: "supplier linked to delayed region — incident reports scenario 29",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-030",
    title: "Ambiguous acronym · case 030",
    query: "What does ARC mean here? — platform docs scenario 30",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-031",
    title: "Error code · case 031",
    query: "ERR_AUTH_TOKEN_42 — release archive scenario 31",
    domain: "Release archive",
    ideal: "lexical",
    relevant: 5,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-032",
    title: "Conceptual policy · case 032",
    query: "parental leave eligibility — support handbook scenario 32",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-033",
    title: "Versioned API · case 033",
    query: "SDK v3 retry configuration — hr policy scenario 33",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-034",
    title: "Named entity · case 034",
    query: "Project Northstar owner — vendor contracts scenario 34",
    domain: "Vendor contracts",
    ideal: "lexical",
    relevant: 4,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-035",
    title: "Multi-hop fact · case 035",
    query: "supplier linked to delayed region — payments runbook scenario 35",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-036",
    title: "Ambiguous acronym · case 036",
    query: "What does ARC mean here? — security wiki scenario 36",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-037",
    title: "Error code · case 037",
    query: "ERR_AUTH_TOKEN_42 — incident reports scenario 37",
    domain: "Incident reports",
    ideal: "lexical",
    relevant: 3,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-038",
    title: "Conceptual policy · case 038",
    query: "parental leave eligibility — platform docs scenario 38",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-039",
    title: "Versioned API · case 039",
    query: "SDK v3 retry configuration — release archive scenario 39",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-040",
    title: "Named entity · case 040",
    query: "Project Northstar owner — support handbook scenario 40",
    domain: "Support handbook",
    ideal: "lexical",
    relevant: 2,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-041",
    title: "Multi-hop fact · case 041",
    query: "supplier linked to delayed region — hr policy scenario 41",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-042",
    title: "Ambiguous acronym · case 042",
    query: "What does ARC mean here? — vendor contracts scenario 42",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-043",
    title: "Error code · case 043",
    query: "ERR_AUTH_TOKEN_42 — payments runbook scenario 43",
    domain: "Payments runbook",
    ideal: "lexical",
    relevant: 5,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-044",
    title: "Conceptual policy · case 044",
    query: "parental leave eligibility — security wiki scenario 44",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-045",
    title: "Versioned API · case 045",
    query: "SDK v3 retry configuration — incident reports scenario 45",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-046",
    title: "Named entity · case 046",
    query: "Project Northstar owner — platform docs scenario 46",
    domain: "Platform docs",
    ideal: "lexical",
    relevant: 4,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-047",
    title: "Multi-hop fact · case 047",
    query: "supplier linked to delayed region — release archive scenario 47",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-048",
    title: "Ambiguous acronym · case 048",
    query: "What does ARC mean here? — support handbook scenario 48",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-049",
    title: "Error code · case 049",
    query: "ERR_AUTH_TOKEN_42 — hr policy scenario 49",
    domain: "HR policy",
    ideal: "lexical",
    relevant: 3,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-050",
    title: "Conceptual policy · case 050",
    query: "parental leave eligibility — vendor contracts scenario 50",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-051",
    title: "Versioned API · case 051",
    query: "SDK v3 retry configuration — payments runbook scenario 51",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-052",
    title: "Named entity · case 052",
    query: "Project Northstar owner — security wiki scenario 52",
    domain: "Security wiki",
    ideal: "lexical",
    relevant: 2,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-053",
    title: "Multi-hop fact · case 053",
    query: "supplier linked to delayed region — incident reports scenario 53",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-054",
    title: "Ambiguous acronym · case 054",
    query: "What does ARC mean here? — platform docs scenario 54",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-055",
    title: "Error code · case 055",
    query: "ERR_AUTH_TOKEN_42 — release archive scenario 55",
    domain: "Release archive",
    ideal: "lexical",
    relevant: 5,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-056",
    title: "Conceptual policy · case 056",
    query: "parental leave eligibility — support handbook scenario 56",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-057",
    title: "Versioned API · case 057",
    query: "SDK v3 retry configuration — hr policy scenario 57",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-058",
    title: "Named entity · case 058",
    query: "Project Northstar owner — vendor contracts scenario 58",
    domain: "Vendor contracts",
    ideal: "lexical",
    relevant: 4,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-059",
    title: "Multi-hop fact · case 059",
    query: "supplier linked to delayed region — payments runbook scenario 59",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-060",
    title: "Ambiguous acronym · case 060",
    query: "What does ARC mean here? — security wiki scenario 60",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-061",
    title: "Error code · case 061",
    query: "ERR_AUTH_TOKEN_42 — incident reports scenario 61",
    domain: "Incident reports",
    ideal: "lexical",
    relevant: 3,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-062",
    title: "Conceptual policy · case 062",
    query: "parental leave eligibility — platform docs scenario 62",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-063",
    title: "Versioned API · case 063",
    query: "SDK v3 retry configuration — release archive scenario 63",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-064",
    title: "Named entity · case 064",
    query: "Project Northstar owner — support handbook scenario 64",
    domain: "Support handbook",
    ideal: "lexical",
    relevant: 2,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-065",
    title: "Multi-hop fact · case 065",
    query: "supplier linked to delayed region — hr policy scenario 65",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-066",
    title: "Ambiguous acronym · case 066",
    query: "What does ARC mean here? — vendor contracts scenario 66",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-067",
    title: "Error code · case 067",
    query: "ERR_AUTH_TOKEN_42 — payments runbook scenario 67",
    domain: "Payments runbook",
    ideal: "lexical",
    relevant: 5,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-068",
    title: "Conceptual policy · case 068",
    query: "parental leave eligibility — security wiki scenario 68",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-069",
    title: "Versioned API · case 069",
    query: "SDK v3 retry configuration — incident reports scenario 69",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-070",
    title: "Named entity · case 070",
    query: "Project Northstar owner — platform docs scenario 70",
    domain: "Platform docs",
    ideal: "lexical",
    relevant: 4,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-071",
    title: "Multi-hop fact · case 071",
    query: "supplier linked to delayed region — release archive scenario 71",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-072",
    title: "Ambiguous acronym · case 072",
    query: "What does ARC mean here? — support handbook scenario 72",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-073",
    title: "Error code · case 073",
    query: "ERR_AUTH_TOKEN_42 — hr policy scenario 73",
    domain: "HR policy",
    ideal: "lexical",
    relevant: 3,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-074",
    title: "Conceptual policy · case 074",
    query: "parental leave eligibility — vendor contracts scenario 74",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-075",
    title: "Versioned API · case 075",
    query: "SDK v3 retry configuration — payments runbook scenario 75",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-076",
    title: "Named entity · case 076",
    query: "Project Northstar owner — security wiki scenario 76",
    domain: "Security wiki",
    ideal: "lexical",
    relevant: 2,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-077",
    title: "Multi-hop fact · case 077",
    query: "supplier linked to delayed region — incident reports scenario 77",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-078",
    title: "Ambiguous acronym · case 078",
    query: "What does ARC mean here? — platform docs scenario 78",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-079",
    title: "Error code · case 079",
    query: "ERR_AUTH_TOKEN_42 — release archive scenario 79",
    domain: "Release archive",
    ideal: "lexical",
    relevant: 5,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-080",
    title: "Conceptual policy · case 080",
    query: "parental leave eligibility — support handbook scenario 80",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-081",
    title: "Versioned API · case 081",
    query: "SDK v3 retry configuration — hr policy scenario 81",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-082",
    title: "Named entity · case 082",
    query: "Project Northstar owner — vendor contracts scenario 82",
    domain: "Vendor contracts",
    ideal: "lexical",
    relevant: 4,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-083",
    title: "Multi-hop fact · case 083",
    query: "supplier linked to delayed region — payments runbook scenario 83",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-084",
    title: "Ambiguous acronym · case 084",
    query: "What does ARC mean here? — security wiki scenario 84",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-085",
    title: "Error code · case 085",
    query: "ERR_AUTH_TOKEN_42 — incident reports scenario 85",
    domain: "Incident reports",
    ideal: "lexical",
    relevant: 3,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-086",
    title: "Conceptual policy · case 086",
    query: "parental leave eligibility — platform docs scenario 86",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-087",
    title: "Versioned API · case 087",
    query: "SDK v3 retry configuration — release archive scenario 87",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-088",
    title: "Named entity · case 088",
    query: "Project Northstar owner — support handbook scenario 88",
    domain: "Support handbook",
    ideal: "lexical",
    relevant: 2,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-089",
    title: "Multi-hop fact · case 089",
    query: "supplier linked to delayed region — hr policy scenario 89",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-090",
    title: "Ambiguous acronym · case 090",
    query: "What does ARC mean here? — vendor contracts scenario 90",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-091",
    title: "Error code · case 091",
    query: "ERR_AUTH_TOKEN_42 — payments runbook scenario 91",
    domain: "Payments runbook",
    ideal: "lexical",
    relevant: 5,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-092",
    title: "Conceptual policy · case 092",
    query: "parental leave eligibility — security wiki scenario 92",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-093",
    title: "Versioned API · case 093",
    query: "SDK v3 retry configuration — incident reports scenario 93",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-094",
    title: "Named entity · case 094",
    query: "Project Northstar owner — platform docs scenario 94",
    domain: "Platform docs",
    ideal: "lexical",
    relevant: 4,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-095",
    title: "Multi-hop fact · case 095",
    query: "supplier linked to delayed region — release archive scenario 95",
    domain: "Release archive",
    ideal: "hybrid",
    relevant: 5,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-096",
    title: "Ambiguous acronym · case 096",
    query: "What does ARC mean here? — support handbook scenario 96",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 2,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-097",
    title: "Error code · case 097",
    query: "ERR_AUTH_TOKEN_42 — hr policy scenario 97",
    domain: "HR policy",
    ideal: "lexical",
    relevant: 3,
    distractors: 3,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-098",
    title: "Conceptual policy · case 098",
    query: "parental leave eligibility — vendor contracts scenario 98",
    domain: "Vendor contracts",
    ideal: "semantic",
    relevant: 4,
    distractors: 4,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-099",
    title: "Versioned API · case 099",
    query: "SDK v3 retry configuration — payments runbook scenario 99",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 5,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-100",
    title: "Named entity · case 100",
    query: "Project Northstar owner — security wiki scenario 100",
    domain: "Security wiki",
    ideal: "lexical",
    relevant: 2,
    distractors: 1,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-101",
    title: "Multi-hop fact · case 101",
    query: "supplier linked to delayed region — incident reports scenario 101",
    domain: "Incident reports",
    ideal: "hybrid",
    relevant: 3,
    distractors: 2,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-102",
    title: "Ambiguous acronym · case 102",
    query: "What does ARC mean here? — platform docs scenario 102",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 3,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-103",
    title: "Error code · case 103",
    query: "ERR_AUTH_TOKEN_42 — release archive scenario 103",
    domain: "Release archive",
    ideal: "lexical",
    relevant: 5,
    distractors: 4,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-104",
    title: "Conceptual policy · case 104",
    query: "parental leave eligibility — support handbook scenario 104",
    domain: "Support handbook",
    ideal: "semantic",
    relevant: 2,
    distractors: 5,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-105",
    title: "Versioned API · case 105",
    query: "SDK v3 retry configuration — hr policy scenario 105",
    domain: "HR policy",
    ideal: "hybrid",
    relevant: 3,
    distractors: 1,
    difficulty: "Foundation",
    lesson: "Watch for a broad chunk dilutes the supporting sentence; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-106",
    title: "Named entity · case 106",
    query: "Project Northstar owner — vendor contracts scenario 106",
    domain: "Vendor contracts",
    ideal: "lexical",
    relevant: 4,
    distractors: 2,
    difficulty: "Intermediate",
    lesson: "Watch for stale content outranks the current version; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-107",
    title: "Multi-hop fact · case 107",
    query: "supplier linked to delayed region — payments runbook scenario 107",
    domain: "Payments runbook",
    ideal: "hybrid",
    relevant: 5,
    distractors: 3,
    difficulty: "Advanced",
    lesson: "Watch for keyword search ignores the paraphrase; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-108",
    title: "Ambiguous acronym · case 108",
    query: "What does ARC mean here? — security wiki scenario 108",
    domain: "Security wiki",
    ideal: "semantic",
    relevant: 2,
    distractors: 4,
    difficulty: "Foundation",
    lesson: "Watch for dense search misses the exact identifier; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-109",
    title: "Error code · case 109",
    query: "ERR_AUTH_TOKEN_42 — incident reports scenario 109",
    domain: "Incident reports",
    ideal: "lexical",
    relevant: 3,
    distractors: 5,
    difficulty: "Intermediate",
    lesson: "Watch for metadata filters exclude the relevant source; compare recall before reranking with precision after reranking.",
  },
  {
    id: "rq-110",
    title: "Conceptual policy · case 110",
    query: "parental leave eligibility — platform docs scenario 110",
    domain: "Platform docs",
    ideal: "semantic",
    relevant: 4,
    distractors: 1,
    difficulty: "Advanced",
    lesson: "Watch for duplicate chunks crowd out diverse evidence; compare recall before reranking with precision after reranking.",
  },
];

const DOCUMENTS = [
  { id: "doc-1", title: "Exact reference", body: "Contains the exact identifier, version, or named entity from the query.", kind: "lexical", base: 0.95 },
  { id: "doc-2", title: "Semantic match", body: "Uses different words to express the same intent and answer.", kind: "semantic", base: 0.92 },
  { id: "doc-3", title: "Current authority", body: "The newest approved source with a direct supporting passage.", kind: "authority", base: 0.9 },
  { id: "doc-4", title: "Stale near-match", body: "Highly similar wording from an obsolete document version.", kind: "stale", base: 0.76 },
  { id: "doc-5", title: "Popular distractor", body: "Frequently cited content that shares broad vocabulary.", kind: "noise", base: 0.68 },
  { id: "doc-6", title: "Cross-reference", body: "Connects the first fact to a second source needed for the answer.", kind: "bridge", base: 0.82 },
  { id: "doc-7", title: "Duplicate chunk", body: "Overlapping copy of a relevant passage with little new evidence.", kind: "duplicate", base: 0.74 },
  { id: "doc-8", title: "Unrelated exact term", body: "Contains a keyword but answers a different question.", kind: "noise", base: 0.61 },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pct = (value) => `${Math.round(value * 100)}%`;

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.7-3.7" /></>,
    tune: <><path d="M4 6h16M7 12h10M10 18h4" /><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></>,
    run: <path d="m8 5 11 7-11 7Z" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" /><path d="M4 5.5v16" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function scoreDocuments(caseItem, denseWeight, topK, rerank, freshness) {
  const lexicalWeight = 100 - denseWeight;
  return DOCUMENTS.map((doc, index) => {
    const idealBoost = doc.kind === caseItem.ideal ? 0.19 : 0;
    const lexical = ["lexical", "authority", "stale"].includes(doc.kind) ? lexicalWeight / 240 : 0.08;
    const semantic = ["semantic", "bridge", "authority"].includes(doc.kind) ? denseWeight / 240 : 0.07;
    const stalePenalty = doc.kind === "stale" ? freshness / 150 : 0;
    const rerankBoost = rerank && ["authority", caseItem.ideal, "bridge"].includes(doc.kind) ? 0.12 : 0;
    const duplicatePenalty = rerank && doc.kind === "duplicate" ? 0.18 : 0;
    const jitter = ((caseItem.id.charCodeAt(4) + index * 11) % 13) / 100;
    const score = clamp(doc.base * 0.38 + lexical + semantic + idealBoost + rerankBoost - stalePenalty - duplicatePenalty + jitter, 0.08, 0.99);
    return { ...doc, score, relevant: ["lexical", "semantic", "authority", "bridge", caseItem.ideal].includes(doc.kind) && doc.kind !== "stale" };
  }).sort((left, right) => right.score - left.score).slice(0, topK);
}

function Metric({ label, value, detail, tone = "blue" }) {
  return <div className={`ro-metric ro-${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function RankRow({ document, index, selected, onSelect }) {
  return <button className={`ro-rank ${selected ? "is-selected" : ""}`} onClick={onSelect} aria-pressed={selected}>
    <span className="ro-position">{String(index + 1).padStart(2, "0")}</span>
    <span className="ro-rank-copy"><strong>{document.title}</strong><small>{document.body}</small></span>
    <span className={`ro-kind ro-kind-${document.kind}`}>{document.kind}</span>
    <span className="ro-score">{document.score.toFixed(2)}</span>
  </button>;
}

export default function RetrievalObservatoryLab() {
  const [caseId, setCaseId] = useState("rq-003");
  const [denseWeight, setDenseWeight] = useState(65);
  const [topK, setTopK] = useState(5);
  const [rerank, setRerank] = useState(true);
  const [freshness, setFreshness] = useState(55);
  const [runVersion, setRunVersion] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState("doc-1");
  const caseItem = QUERY_CASES.find((item) => item.id === caseId) || QUERY_CASES[0];
  const ranked = useMemo(() => scoreDocuments(caseItem, denseWeight, topK, rerank, freshness), [caseItem, denseWeight, topK, rerank, freshness, runVersion]);
  const hits = ranked.filter((item) => item.relevant).length;
  const precision = hits / Math.max(ranked.length, 1);
  const recall = Math.min(1, hits / caseItem.relevant);
  const latency = Math.round(38 + topK * 7 + (rerank ? 92 : 0) + denseWeight * 0.3);
  const contextTokens = ranked.length * 184 + (rerank ? 72 : 0);
  const activeDoc = ranked.find((item) => item.id === selectedDoc) || ranked[0];
  const diagnosis = recall < 0.7 ? "Candidate generation is missing evidence. Increase top-k or rebalance hybrid retrieval." : precision < 0.7 ? "The evidence is present, but noisy. Rerank or tighten metadata and freshness." : "Healthy retrieval: relevant evidence survives both candidate generation and final ranking.";

  return <main className="retrieval-observatory">
    <a className="ro-skip" href="#ro-results">Skip to ranked results</a>
    <header className="ro-header">
      <div><span className="ro-eyebrow"><Icon name="search" size={15} /> RAG systems · retrieval diagnostics</span><h1>Retrieval Observatory</h1><p>See what your retriever found, what it missed, and whether a reranker actually helped.</p></div>
      <div className="ro-run-block"><span>Experiment {String(runVersion).padStart(2, "0")}</span><button onClick={() => setRunVersion((value) => value + 1)}><Icon name="run" size={16} /> Run retrieval</button></div>
    </header>
    <section className="ro-query-strip" aria-label="Query case">
      <label><span>Benchmark query</span><select value={caseId} onChange={(event) => { setCaseId(event.target.value); setSelectedDoc("doc-1"); }}>{QUERY_CASES.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <div><span>Query</span><strong>{caseItem.query}</strong></div>
      <div><span>Known failure</span><p>{caseItem.lesson}</p></div>
    </section>
    <div className="ro-layout">
      <aside className="ro-controls" aria-label="Retrieval controls">
        <div className="ro-panel-title"><Icon name="tune" /><div><strong>Pipeline controls</strong><small>Changes recompute locally</small></div></div>
        <label className="ro-slider"><span><b>Dense / sparse blend</b><output>{denseWeight}% dense</output></span><input type="range" min="0" max="100" value={denseWeight} onChange={(event) => setDenseWeight(Number(event.target.value))} /><small>Exact identifiers favor sparse; paraphrases favor dense.</small></label>
        <label className="ro-slider"><span><b>Candidate count</b><output>top {topK}</output></span><input type="range" min="3" max="8" value={topK} onChange={(event) => setTopK(Number(event.target.value))} /><small>More candidates can improve recall while increasing noise and cost.</small></label>
        <label className="ro-slider"><span><b>Freshness pressure</b><output>{freshness}%</output></span><input type="range" min="0" max="100" value={freshness} onChange={(event) => setFreshness(Number(event.target.value))} /><small>Penalize obsolete content when policies and APIs change.</small></label>
        <button className={`ro-toggle ${rerank ? "is-on" : ""}`} onClick={() => setRerank((value) => !value)} aria-pressed={rerank}><span><b>Cross-encoder reranker</b><small>Second-pass query-document scoring</small></span><i>{rerank ? "ON" : "OFF"}</i></button>
        <div className="ro-formula"><span>Fusion model</span><code>score = dense × α + sparse × (1−α)</code><code>final = rerank(candidates, query)</code></div>
      </aside>
      <section className="ro-workbench" id="ro-results">
        <div className="ro-metrics">
          <Metric label="Context precision" value={pct(precision)} detail={`${hits}/${ranked.length} useful chunks`} tone={precision >= .7 ? "green" : "amber"} />
          <Metric label="Context recall" value={pct(recall)} detail={`${hits}/${caseItem.relevant} expected signals`} tone={recall >= .7 ? "green" : "red"} />
          <Metric label="Retrieval latency" value={`${latency} ms`} detail={rerank ? "includes reranking" : "first stage only"} tone="blue" />
          <Metric label="Context budget" value={contextTokens.toLocaleString()} detail="estimated tokens" tone="violet" />
        </div>
        <div className="ro-results-grid">
          <div className="ro-ranking"><header><div><span>Ranked evidence</span><strong>{ranked.length} candidates after fusion</strong></div><span className="ro-live">computed</span></header><div className="ro-rank-head"><span>Rank</span><span>Document</span><span>Type</span><span>Score</span></div>{ranked.map((document, index) => <RankRow key={document.id} document={document} index={index} selected={activeDoc?.id === document.id} onSelect={() => setSelectedDoc(document.id)} />)}</div>
          <aside className="ro-inspector"><span className="ro-label">Evidence inspector</span><h2>{activeDoc?.title}</h2><p>{activeDoc?.body}</p><dl><div><dt>Retriever signal</dt><dd>{activeDoc?.kind}</dd></div><div><dt>Final score</dt><dd>{activeDoc?.score.toFixed(3)}</dd></div><div><dt>Ground-truth relevance</dt><dd>{activeDoc?.relevant ? "Relevant" : "Distractor"}</dd></div></dl><div className={`ro-verdict ${activeDoc?.relevant ? "good" : "bad"}`}><Icon name={activeDoc?.relevant ? "check" : "search"} /><span>{activeDoc?.relevant ? "Keep in context" : "Exclude before generation"}</span></div></aside>
        </div>
        <footer className="ro-diagnosis"><Icon name="book" /><div><span>Pipeline diagnosis</span><strong>{diagnosis}</strong></div></footer>
      </section>
    </div>
    <section className="ro-notes"><article><span>01</span><div><h3>Recall before precision</h3><p>If candidate generation never finds the evidence, a reranker cannot recover it.</p></div></article><article><span>02</span><div><h3>Evaluate on labeled queries</h3><p>Similarity scores are not quality metrics. Use expected evidence and failure slices.</p></div></article><article><span>03</span><div><h3>Budget the second stage</h3><p>Reranking often improves ordering, but adds latency and per-document inference.</p></div></article></section>
    <style>{`
:root {
  color-scheme: light;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  background: #eef4f8;
}
button,
input,
select {
  font: inherit;
}
button,
select,
input[type="range"] {
  cursor: pointer;
}
.retrieval-observatory {
  --ink: #102a3a;
  --muted: #607583;
  --line: #cbdbe4;
  --panel: #ffffff;
  --blue: #087ea4;
  --cyan: #0ea5a8;
  --green: #16865b;
  --amber: #b56b09;
  --red: #c2413b;
  min-height: 100vh;
  color: var(--ink);
  background:
    linear-gradient(90deg, rgba(8,126,164,.045) 1px, transparent 1px),
    linear-gradient(rgba(8,126,164,.045) 1px, transparent 1px),
    #eef4f8;
  background-size: 28px 28px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 34px clamp(18px, 4vw, 62px) 54px;
}
.ro-skip {
  position: fixed;
  left: 18px;
  top: -60px;
  z-index: 20;
  background: #102a3a;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
}
.ro-skip:focus {
  top: 12px;
}
.ro-header {
  max-width: 1480px;
  margin: 0 auto 24px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
}
.ro-header h1 {
  margin: 8px 0 7px;
  font-size: clamp(34px, 5vw, 68px);
  letter-spacing: -.055em;
  line-height: .95;
}
.ro-header p {
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  max-width: 720px;
}
.ro-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--blue);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .11em;
  text-transform: uppercase;
}
.ro-run-block {
  min-width: 190px;
  display: grid;
  justify-items: end;
  gap: 8px;
}
.ro-run-block > span {
  color: var(--muted);
  font: 700 11px ui-monospace, monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.ro-run-block button {
  border: 0;
  border-radius: 10px;
  background: var(--ink);
  color: white;
  padding: 13px 18px;
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(16,42,58,.18);
  transition: transform .2s ease, box-shadow .2s ease;
}
.ro-run-block button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(16,42,58,.24);
}
.ro-query-strip {
  max-width: 1480px;
  margin: 0 auto 16px;
  background: var(--ink);
  color: white;
  border-radius: 15px;
  padding: 15px;
  display: grid;
  grid-template-columns: minmax(220px,.7fr) 1fr 1fr;
  gap: 1px;
}
.ro-query-strip > * {
  padding: 10px 16px;
  min-width: 0;
}
.ro-query-strip > * + * {
  border-left: 1px solid rgba(255,255,255,.15);
}
.ro-query-strip span,
.ro-label {
  display: block;
  color: #8fb9c9;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .1em;
  margin-bottom: 6px;
}
.ro-query-strip select {
  width: 100%;
  border: 1px solid #47707f;
  background: #173849;
  color: white;
  border-radius: 8px;
  padding: 9px 10px;
}
.ro-query-strip strong {
  display: block;
  font-size: 14px;
  line-height: 1.45;
}
.ro-query-strip p {
  margin: 0;
  color: #bfd2da;
  font-size: 12px;
  line-height: 1.5;
}
.ro-layout {
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 294px minmax(0,1fr);
  gap: 16px;
  align-items: start;
}
.ro-controls,
.ro-workbench {
  background: rgba(255,255,255,.94);
  border: 1px solid var(--line);
  border-radius: 15px;
  box-shadow: 0 10px 36px rgba(44,76,93,.08);
}
.ro-controls {
  padding: 18px;
  position: sticky;
  top: 16px;
}
.ro-panel-title {
  display: flex;
  gap: 10px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.ro-panel-title svg {
  color: var(--blue);
}
.ro-panel-title strong,
.ro-panel-title small {
  display: block;
}
.ro-panel-title small {
  color: var(--muted);
  margin-top: 3px;
}
.ro-slider {
  display: block;
  padding: 18px 0;
  border-bottom: 1px solid #e3edf2;
}
.ro-slider > span {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
}
.ro-slider output {
  color: var(--blue);
  font-weight: 800;
}
.ro-slider input {
  width: 100%;
  margin: 14px 0 8px;
  accent-color: var(--blue);
}
.ro-slider small {
  display: block;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}
.ro-toggle {
  width: 100%;
  min-height: 56px;
  margin: 16px 0;
  border: 1px solid var(--line);
  background: #f6fafc;
  border-radius: 10px;
  padding: 11px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
}
.ro-toggle b,
.ro-toggle small {
  display: block;
}
.ro-toggle small {
  color: var(--muted);
  margin-top: 3px;
  font-size: 10px;
}
.ro-toggle i {
  align-self: center;
  color: #7b8e99;
  font-style: normal;
  font: 800 10px ui-monospace, monospace;
}
.ro-toggle.is-on {
  background: #e8f7f5;
  border-color: #8bd1c9;
}
.ro-toggle.is-on i {
  color: var(--green);
}
.ro-formula {
  background: #102a3a;
  color: white;
  border-radius: 10px;
  padding: 12px;
}
.ro-formula span {
  color: #8fb9c9;
  font-size: 10px;
  text-transform: uppercase;
}
.ro-formula code {
  display: block;
  margin-top: 8px;
  font-size: 10px;
  color: #d2f2f0;
  overflow-wrap: anywhere;
}
.ro-workbench {
  padding: 14px;
  min-width: 0;
}
.ro-metrics {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 10px;
  margin-bottom: 12px;
}
.ro-metric {
  border-radius: 11px;
  background: #f7fafc;
  border: 1px solid #dae6ec;
  padding: 13px;
  border-top: 3px solid currentColor;
}
.ro-metric span {
  display: block;
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .07em;
}
.ro-metric strong {
  display: block;
  color: currentColor;
  font-size: 25px;
  margin: 5px 0 2px;
}
.ro-metric small {
  color: var(--muted);
  font-size: 10px;
}
.ro-green { color: var(--green); }
.ro-amber { color: var(--amber); }
.ro-red { color: var(--red); }
.ro-blue { color: var(--blue); }
.ro-violet { color: #6d5ac9; }
.ro-results-grid {
  display: grid;
  grid-template-columns: minmax(0,1fr) 270px;
  gap: 12px;
}
.ro-ranking,
.ro-inspector {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.ro-ranking > header {
  min-height: 60px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f8fa;
}
.ro-ranking header span,
.ro-ranking header strong {
  display: block;
}
.ro-ranking header span {
  color: var(--muted);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.ro-ranking header strong {
  margin-top: 4px;
  font-size: 13px;
}
.ro-live {
  color: var(--green) !important;
  font-weight: 800;
}
.ro-rank-head,
.ro-rank {
  display: grid;
  grid-template-columns: 48px minmax(0,1fr) 85px 50px;
  gap: 8px;
  align-items: center;
}
.ro-rank-head {
  padding: 8px 12px;
  background: #edf3f6;
  color: #718590;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}
.ro-rank {
  width: 100%;
  border: 0;
  border-top: 1px solid #e5edf1;
  background: white;
  padding: 12px;
  color: var(--ink);
  text-align: left;
  min-height: 70px;
  transition: background .18s ease, box-shadow .18s ease;
}
.ro-rank:hover {
  background: #f6fbfd;
}
.ro-rank.is-selected {
  background: #edf9fb;
  box-shadow: inset 3px 0 var(--blue);
}
.ro-position {
  color: #8ba0ac;
  font: 700 12px ui-monospace, monospace;
}
.ro-rank-copy {
  min-width: 0;
}
.ro-rank-copy strong,
.ro-rank-copy small {
  display: block;
}
.ro-rank-copy strong {
  font-size: 12px;
}
.ro-rank-copy small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ro-kind {
  justify-self: start;
  border-radius: 99px;
  background: #edf3f6;
  padding: 5px 7px;
  color: #516874;
  font-size: 9px;
  font-weight: 800;
}
.ro-kind-authority,
.ro-kind-semantic {
  background: #e8f6f1;
  color: #167553;
}
.ro-kind-stale,
.ro-kind-noise {
  background: #fff0ed;
  color: #ad453c;
}
.ro-score {
  font: 800 12px ui-monospace, monospace;
}
.ro-inspector {
  padding: 17px;
  background: #f8fbfc;
}
.ro-inspector h2 {
  font-size: 20px;
  margin: 11px 0 8px;
  letter-spacing: -.03em;
}
.ro-inspector > p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}
.ro-inspector dl {
  margin: 18px 0;
}
.ro-inspector dl div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid #dce8ed;
}
.ro-inspector dt {
  color: var(--muted);
  font-size: 10px;
}
.ro-inspector dd {
  margin: 0;
  font: 700 10px ui-monospace, monospace;
  text-align: right;
}
.ro-verdict {
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 9px;
  padding: 11px;
  font-size: 11px;
  font-weight: 800;
}
.ro-verdict.good {
  color: var(--green);
  background: #eaf7f1;
}
.ro-verdict.bad {
  color: var(--red);
  background: #fff0ed;
}
.ro-diagnosis {
  margin-top: 12px;
  border: 1px solid #b7dbe6;
  background: #edfafd;
  border-radius: 11px;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ro-diagnosis svg {
  color: var(--blue);
  flex: none;
}
.ro-diagnosis span,
.ro-diagnosis strong {
  display: block;
}
.ro-diagnosis span {
  color: var(--blue);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .09em;
}
.ro-diagnosis strong {
  font-size: 12px;
  margin-top: 4px;
}
.ro-notes {
  max-width: 1480px;
  margin: 16px auto 0;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 12px;
}
.ro-notes article {
  display: flex;
  gap: 13px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,.72);
  border-radius: 12px;
  padding: 14px;
}
.ro-notes article > span {
  color: var(--blue);
  font: 800 11px ui-monospace, monospace;
}
.ro-notes h3 {
  margin: 0 0 4px;
  font-size: 12px;
}
.ro-notes p {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
}
button:focus-visible,
select:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 3px solid #f6b941;
  outline-offset: 3px;
}
@media (max-width: 980px) {
  .ro-query-strip {
    grid-template-columns: 1fr;
  }
  .ro-query-strip > * + * {
    border-left: 0;
    border-top: 1px solid rgba(255,255,255,.15);
  }
  .ro-layout {
    grid-template-columns: 1fr;
  }
  .ro-controls {
    position: static;
  }
  .ro-metrics {
    grid-template-columns: repeat(2,1fr);
  }
}
@media (max-width: 680px) {
  .retrieval-observatory {
    padding: 24px 12px 36px;
  }
  .ro-header {
    align-items: start;
    flex-direction: column;
  }
  .ro-run-block {
    width: 100%;
    justify-items: stretch;
  }
  .ro-run-block button {
    justify-content: center;
  }
  .ro-results-grid {
    grid-template-columns: 1fr;
  }
  .ro-rank-head {
    display: none;
  }
  .ro-rank {
    grid-template-columns: 34px 1fr 58px;
  }
  .ro-kind {
    display: none;
  }
  .ro-metrics,
  .ro-notes {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
    `}</style>
  </main>;
}
