import React, { useMemo, useState } from "react";

/* Intent Calibration Clinic — deterministic NLP classification and threshold lab. */

const DATASETS = [
  {
    id: "intent-001",
    title: "Negation · sample 001",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.81,
    slice: "negation",
    volume: 33,
    severity: "medium",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-002",
    title: "Sarcasm · sample 002",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.74,
    slice: "sarcasm",
    volume: 46,
    severity: "high",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-003",
    title: "Ambiguous · sample 003",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.54,
    slice: "ambiguous",
    volume: 59,
    severity: "low",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-004",
    title: "Domain shift · sample 004",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.65,
    slice: "domain_shift",
    volume: 72,
    severity: "medium",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-005",
    title: "Implicit urgency · sample 005",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.83,
    slice: "implicit_urgency",
    volume: 85,
    severity: "high",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-006",
    title: "Multi-intent · sample 006",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.68,
    slice: "multi-intent",
    volume: 98,
    severity: "low",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-007",
    title: "Polite refusal · sample 007",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.64,
    slice: "polite_refusal",
    volume: 111,
    severity: "medium",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-008",
    title: "Out of scope · sample 008",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.55,
    slice: "out_of_scope",
    volume: 124,
    severity: "high",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-009",
    title: "Negation · sample 009",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.82,
    slice: "negation",
    volume: 137,
    severity: "low",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-010",
    title: "Sarcasm · sample 010",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.75,
    slice: "sarcasm",
    volume: 150,
    severity: "medium",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-011",
    title: "Ambiguous · sample 011",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.55,
    slice: "ambiguous",
    volume: 163,
    severity: "high",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-012",
    title: "Domain shift · sample 012",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.66,
    slice: "domain_shift",
    volume: 176,
    severity: "low",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-013",
    title: "Implicit urgency · sample 013",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.84,
    slice: "implicit_urgency",
    volume: 189,
    severity: "medium",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-014",
    title: "Multi-intent · sample 014",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.69,
    slice: "multi-intent",
    volume: 22,
    severity: "high",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-015",
    title: "Polite refusal · sample 015",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.65,
    slice: "polite_refusal",
    volume: 35,
    severity: "low",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-016",
    title: "Out of scope · sample 016",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.56,
    slice: "out_of_scope",
    volume: 48,
    severity: "medium",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-017",
    title: "Negation · sample 017",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.74,
    slice: "negation",
    volume: 61,
    severity: "high",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-018",
    title: "Sarcasm · sample 018",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.76,
    slice: "sarcasm",
    volume: 74,
    severity: "low",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-019",
    title: "Ambiguous · sample 019",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.56,
    slice: "ambiguous",
    volume: 87,
    severity: "medium",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-020",
    title: "Domain shift · sample 020",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.67,
    slice: "domain_shift",
    volume: 100,
    severity: "high",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-021",
    title: "Implicit urgency · sample 021",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.85,
    slice: "implicit_urgency",
    volume: 113,
    severity: "low",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-022",
    title: "Multi-intent · sample 022",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.70,
    slice: "multi-intent",
    volume: 126,
    severity: "medium",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-023",
    title: "Polite refusal · sample 023",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.66,
    slice: "polite_refusal",
    volume: 139,
    severity: "high",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-024",
    title: "Out of scope · sample 024",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.57,
    slice: "out_of_scope",
    volume: 152,
    severity: "low",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-025",
    title: "Negation · sample 025",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.75,
    slice: "negation",
    volume: 165,
    severity: "medium",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-026",
    title: "Sarcasm · sample 026",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.68,
    slice: "sarcasm",
    volume: 178,
    severity: "high",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-027",
    title: "Ambiguous · sample 027",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.57,
    slice: "ambiguous",
    volume: 191,
    severity: "low",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-028",
    title: "Domain shift · sample 028",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.68,
    slice: "domain_shift",
    volume: 24,
    severity: "medium",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-029",
    title: "Implicit urgency · sample 029",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.86,
    slice: "implicit_urgency",
    volume: 37,
    severity: "high",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-030",
    title: "Multi-intent · sample 030",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.71,
    slice: "multi-intent",
    volume: 50,
    severity: "low",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-031",
    title: "Polite refusal · sample 031",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.67,
    slice: "polite_refusal",
    volume: 63,
    severity: "medium",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-032",
    title: "Out of scope · sample 032",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.58,
    slice: "out_of_scope",
    volume: 76,
    severity: "high",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-033",
    title: "Negation · sample 033",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.76,
    slice: "negation",
    volume: 89,
    severity: "low",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-034",
    title: "Sarcasm · sample 034",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.69,
    slice: "sarcasm",
    volume: 102,
    severity: "medium",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-035",
    title: "Ambiguous · sample 035",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.49,
    slice: "ambiguous",
    volume: 115,
    severity: "high",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-036",
    title: "Domain shift · sample 036",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.69,
    slice: "domain_shift",
    volume: 128,
    severity: "low",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-037",
    title: "Implicit urgency · sample 037",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.87,
    slice: "implicit_urgency",
    volume: 141,
    severity: "medium",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-038",
    title: "Multi-intent · sample 038",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.72,
    slice: "multi-intent",
    volume: 154,
    severity: "high",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-039",
    title: "Polite refusal · sample 039",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.68,
    slice: "polite_refusal",
    volume: 167,
    severity: "low",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-040",
    title: "Out of scope · sample 040",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.59,
    slice: "out_of_scope",
    volume: 180,
    severity: "medium",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-041",
    title: "Negation · sample 041",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.77,
    slice: "negation",
    volume: 193,
    severity: "high",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-042",
    title: "Sarcasm · sample 042",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.70,
    slice: "sarcasm",
    volume: 26,
    severity: "low",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-043",
    title: "Ambiguous · sample 043",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.50,
    slice: "ambiguous",
    volume: 39,
    severity: "medium",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-044",
    title: "Domain shift · sample 044",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.61,
    slice: "domain_shift",
    volume: 52,
    severity: "high",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-045",
    title: "Implicit urgency · sample 045",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.88,
    slice: "implicit_urgency",
    volume: 65,
    severity: "low",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-046",
    title: "Multi-intent · sample 046",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.73,
    slice: "multi-intent",
    volume: 78,
    severity: "medium",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-047",
    title: "Polite refusal · sample 047",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.69,
    slice: "polite_refusal",
    volume: 91,
    severity: "high",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-048",
    title: "Out of scope · sample 048",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.60,
    slice: "out_of_scope",
    volume: 104,
    severity: "low",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-049",
    title: "Negation · sample 049",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.78,
    slice: "negation",
    volume: 117,
    severity: "medium",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-050",
    title: "Sarcasm · sample 050",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.71,
    slice: "sarcasm",
    volume: 130,
    severity: "high",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-051",
    title: "Ambiguous · sample 051",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.51,
    slice: "ambiguous",
    volume: 143,
    severity: "low",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-052",
    title: "Domain shift · sample 052",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.62,
    slice: "domain_shift",
    volume: 156,
    severity: "medium",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-053",
    title: "Implicit urgency · sample 053",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.80,
    slice: "implicit_urgency",
    volume: 169,
    severity: "high",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-054",
    title: "Multi-intent · sample 054",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.74,
    slice: "multi-intent",
    volume: 182,
    severity: "low",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-055",
    title: "Polite refusal · sample 055",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.70,
    slice: "polite_refusal",
    volume: 195,
    severity: "medium",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-056",
    title: "Out of scope · sample 056",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.61,
    slice: "out_of_scope",
    volume: 28,
    severity: "high",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-057",
    title: "Negation · sample 057",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.79,
    slice: "negation",
    volume: 41,
    severity: "low",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-058",
    title: "Sarcasm · sample 058",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.72,
    slice: "sarcasm",
    volume: 54,
    severity: "medium",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-059",
    title: "Ambiguous · sample 059",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.52,
    slice: "ambiguous",
    volume: 67,
    severity: "high",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-060",
    title: "Domain shift · sample 060",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.63,
    slice: "domain_shift",
    volume: 80,
    severity: "low",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-061",
    title: "Implicit urgency · sample 061",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.81,
    slice: "implicit_urgency",
    volume: 93,
    severity: "medium",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-062",
    title: "Multi-intent · sample 062",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.66,
    slice: "multi-intent",
    volume: 106,
    severity: "high",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-063",
    title: "Polite refusal · sample 063",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.71,
    slice: "polite_refusal",
    volume: 119,
    severity: "low",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-064",
    title: "Out of scope · sample 064",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.62,
    slice: "out_of_scope",
    volume: 132,
    severity: "medium",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-065",
    title: "Negation · sample 065",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.80,
    slice: "negation",
    volume: 145,
    severity: "high",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-066",
    title: "Sarcasm · sample 066",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.73,
    slice: "sarcasm",
    volume: 158,
    severity: "low",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-067",
    title: "Ambiguous · sample 067",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.53,
    slice: "ambiguous",
    volume: 171,
    severity: "medium",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-068",
    title: "Domain shift · sample 068",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.64,
    slice: "domain_shift",
    volume: 184,
    severity: "high",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-069",
    title: "Implicit urgency · sample 069",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.82,
    slice: "implicit_urgency",
    volume: 197,
    severity: "low",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-070",
    title: "Multi-intent · sample 070",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.67,
    slice: "multi-intent",
    volume: 30,
    severity: "medium",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-071",
    title: "Polite refusal · sample 071",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.63,
    slice: "polite_refusal",
    volume: 43,
    severity: "high",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-072",
    title: "Out of scope · sample 072",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.63,
    slice: "out_of_scope",
    volume: 56,
    severity: "low",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-073",
    title: "Negation · sample 073",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.81,
    slice: "negation",
    volume: 69,
    severity: "medium",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-074",
    title: "Sarcasm · sample 074",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.74,
    slice: "sarcasm",
    volume: 82,
    severity: "high",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-075",
    title: "Ambiguous · sample 075",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.54,
    slice: "ambiguous",
    volume: 95,
    severity: "low",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-076",
    title: "Domain shift · sample 076",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.65,
    slice: "domain_shift",
    volume: 108,
    severity: "medium",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-077",
    title: "Implicit urgency · sample 077",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.83,
    slice: "implicit_urgency",
    volume: 121,
    severity: "high",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-078",
    title: "Multi-intent · sample 078",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.68,
    slice: "multi-intent",
    volume: 134,
    severity: "low",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-079",
    title: "Polite refusal · sample 079",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.64,
    slice: "polite_refusal",
    volume: 147,
    severity: "medium",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-080",
    title: "Out of scope · sample 080",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.55,
    slice: "out_of_scope",
    volume: 160,
    severity: "high",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-081",
    title: "Negation · sample 081",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.82,
    slice: "negation",
    volume: 173,
    severity: "low",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-082",
    title: "Sarcasm · sample 082",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.75,
    slice: "sarcasm",
    volume: 186,
    severity: "medium",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-083",
    title: "Ambiguous · sample 083",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.55,
    slice: "ambiguous",
    volume: 199,
    severity: "high",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-084",
    title: "Domain shift · sample 084",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.66,
    slice: "domain_shift",
    volume: 32,
    severity: "low",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-085",
    title: "Implicit urgency · sample 085",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.84,
    slice: "implicit_urgency",
    volume: 45,
    severity: "medium",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-086",
    title: "Multi-intent · sample 086",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.69,
    slice: "multi-intent",
    volume: 58,
    severity: "high",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-087",
    title: "Polite refusal · sample 087",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.65,
    slice: "polite_refusal",
    volume: 71,
    severity: "low",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-088",
    title: "Out of scope · sample 088",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.56,
    slice: "out_of_scope",
    volume: 84,
    severity: "medium",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-089",
    title: "Negation · sample 089",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.74,
    slice: "negation",
    volume: 97,
    severity: "high",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-090",
    title: "Sarcasm · sample 090",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.76,
    slice: "sarcasm",
    volume: 110,
    severity: "low",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-091",
    title: "Ambiguous · sample 091",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.56,
    slice: "ambiguous",
    volume: 123,
    severity: "medium",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-092",
    title: "Domain shift · sample 092",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.67,
    slice: "domain_shift",
    volume: 136,
    severity: "high",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-093",
    title: "Implicit urgency · sample 093",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.85,
    slice: "implicit_urgency",
    volume: 149,
    severity: "low",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-094",
    title: "Multi-intent · sample 094",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.70,
    slice: "multi-intent",
    volume: 162,
    severity: "medium",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-095",
    title: "Polite refusal · sample 095",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.66,
    slice: "polite_refusal",
    volume: 175,
    severity: "high",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-096",
    title: "Out of scope · sample 096",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.57,
    slice: "out_of_scope",
    volume: 188,
    severity: "low",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-097",
    title: "Negation · sample 097",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.75,
    slice: "negation",
    volume: 21,
    severity: "medium",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
  {
    id: "intent-098",
    title: "Sarcasm · sample 098",
    text: "Wonderful, another failed payment. Exactly what I needed.",
    truth: "complaint",
    baseline: "praise",
    confidence: 0.68,
    slice: "sarcasm",
    volume: 34,
    severity: "high",
    lesson: "Slice failures by sarcasm; sarcasm reverses surface sentiment.",
  },
  {
    id: "intent-099",
    title: "Ambiguous · sample 099",
    text: "Can you change it for me?",
    truth: "clarify",
    baseline: "account_change",
    confidence: 0.57,
    slice: "ambiguous",
    volume: 47,
    severity: "low",
    lesson: "Slice failures by ambiguous; the object of the request is missing.",
  },
  {
    id: "intent-100",
    title: "Domain shift · sample 100",
    text: "The pod is crash-looping after the rollout.",
    truth: "technical_incident",
    baseline: "other",
    confidence: 0.68,
    slice: "domain_shift",
    volume: 60,
    severity: "medium",
    lesson: "Slice failures by domain shift; specialized vocabulary was absent from training.",
  },
  {
    id: "intent-101",
    title: "Implicit urgency · sample 101",
    text: "My card is being used in another city right now.",
    truth: "fraud",
    baseline: "billing_question",
    confidence: 0.86,
    slice: "implicit_urgency",
    volume: 73,
    severity: "high",
    lesson: "Slice failures by implicit urgency; urgency is implied rather than stated.",
  },
  {
    id: "intent-102",
    title: "Multi-intent · sample 102",
    text: "Update my address and send the last three invoices.",
    truth: "account_change",
    baseline: "invoice_request",
    confidence: 0.71,
    slice: "multi-intent",
    volume: 86,
    severity: "low",
    lesson: "Slice failures by multi-intent; one utterance contains two actionable intents.",
  },
  {
    id: "intent-103",
    title: "Polite refusal · sample 103",
    text: "Thanks, but I will pass on the upgrade.",
    truth: "decline",
    baseline: "praise",
    confidence: 0.67,
    slice: "polite_refusal",
    volume: 99,
    severity: "medium",
    lesson: "Slice failures by polite refusal; politeness obscures the refusal.",
  },
  {
    id: "intent-104",
    title: "Out of scope · sample 104",
    text: "Write a poem about database indexes.",
    truth: "out_of_scope",
    baseline: "technical_question",
    confidence: 0.58,
    slice: "out_of_scope",
    volume: 112,
    severity: "high",
    lesson: "Slice failures by out of scope; a familiar topic appears in an unsupported request.",
  },
  {
    id: "intent-105",
    title: "Negation · sample 105",
    text: "I do not want to cancel my subscription.",
    truth: "retain",
    baseline: "cancel",
    confidence: 0.76,
    slice: "negation",
    volume: 125,
    severity: "low",
    lesson: "Slice failures by negation; negation flips the apparent keyword intent.",
  },
];

const CLASSES = ["cancel","retain","complaint","praise","clarify","account_change","fraud","billing_question","out_of_scope"];
const SLICE_STATS = [
  { id: "clean", precision: 94, recall: 92, count: 420 },
  { id: "negation", precision: 71, recall: 58, count: 95 },
  { id: "sarcasm", precision: 63, recall: 49, count: 62 },
  { id: "domain_shift", precision: 74, recall: 68, count: 130 },
  { id: "multi_intent", precision: 69, recall: 61, count: 88 },
  { id: "ambiguous", precision: 58, recall: 45, count: 114 },
  { id: "implicit_urgency", precision: 87, recall: 78, count: 47 },
  { id: "out_of_scope", precision: 79, recall: 83, count: 74 },
];

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function predict(item, threshold, calibrated, abstain) { const confidence=clamp(item.confidence+(calibrated?.04:0),.25,.97); const shouldAbstain=abstain&&confidence<threshold/100; const predicted=shouldAbstain?"ask_clarifying_question":confidence>=threshold/100?item.baseline:item.truth; return {confidence,predicted,correct:predicted===item.truth,abstained:shouldAbstain}; }

function Icon({ name, size=18 }) {
  const paths={clinic:<><path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5Z" /></>,tune:<><path d="M4 6h16M7 12h10M10 18h4" /><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></>,check:<path d="m5 12 4 4L19 6" />,alert:<><path d="M12 3 2.5 20h19Z" /><path d="M12 9v4M12 17h.01" /></>};
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function ConfusionMatrix({ threshold, calibrated }) { const values=useMemo(()=>{const shift=Math.round((threshold-50)/10);return [[82+shift,12-shift,6],[9,76+(calibrated?5:0),15-(calibrated?5:0)],[4,11,85]];},[threshold,calibrated]); const labels=["intent A","intent B","other"]; return <div className="icc-matrix"><div />{labels.map(label=><span key={`head-${label}`}>{label}</span>)}{values.map((row,r)=><React.Fragment key={labels[r]}><span>{labels[r]}</span>{row.map((value,c)=><button key={`${r}-${c}`} style={{"--heat":value/100}} aria-label={`Actual ${labels[r]}, predicted ${labels[c]}: ${value}`}><strong>{value}</strong><small>{r===c?"correct":"error"}</small></button>)}</React.Fragment>)}</div>; }

function ReliabilityChart({ calibrated }) { const before=[8,21,33,47,59,66,72,79,81,84];const after=[7,18,29,41,53,64,74,84,92,97];const series=calibrated?after:before;return <svg className="icc-chart" viewBox="0 0 240 130" role="img" aria-label="Reliability calibration chart"><line x1="28" y1="105" x2="225" y2="105" /><line x1="28" y1="105" x2="28" y2="10" /><line className="ideal" x1="28" y1="105" x2="220" y2="12" />{series.map((value,index)=>{const x=37+index*19;const y=105-value*.9;return <g key={index}><line className="bar" x1={x} y1="105" x2={x} y2={y} /><circle cx={x} cy={y} r="3" /></g>;})}<text x="120" y="125">predicted confidence →</text><text x="4" y="12">accuracy</text></svg>; }

export default function IntentCalibrationClinicLab() {
  const [sampleId,setSampleId]=useState("intent-002");
  const [threshold,setThreshold]=useState(70);
  const [calibrated,setCalibrated]=useState(false);
  const [abstain,setAbstain]=useState(true);
  const [activeSlice,setActiveSlice]=useState("negation");
  const [costMode,setCostMode]=useState("balanced");
  const item=DATASETS.find(entry=>entry.id===sampleId)||DATASETS[0];
  const result=useMemo(()=>predict(item,threshold,calibrated,abstain),[item,threshold,calibrated,abstain]);
  const slice=SLICE_STATS.find(entry=>entry.id===activeSlice)||SLICE_STATS[0];
  const precision=clamp(slice.precision+(calibrated?4:0)+(threshold-70)*.18,35,98);
  const recall=clamp(slice.recall+(calibrated?5:0)-(threshold-70)*.25,25,98);
  const f1=2*precision*recall/Math.max(precision+recall,1);
  const reviewRate=clamp((threshold-45)*1.25+(abstain?8:0),2,68);
  const cost=costMode==="misses"?Math.round((100-recall)*4):costMode==="false_alarms"?Math.round((100-precision)*3):Math.round((200-precision-recall)*2);
  return <main className="intent-clinic">
    <header className="icc-header"><div className="icc-mark"><Icon name="clinic" size={25} /></div><div><span>NLP classification · evaluation lab</span><h1>Intent Calibration Clinic</h1><p>Triage classification errors, tune decision thresholds, and add an abstention path for language the model should not guess.</p></div><label><span>Patient sample</span><select value={sampleId} onChange={event=>setSampleId(event.target.value)}>{DATASETS.map(entry=><option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label></header>
    <section className="icc-patient"><div><span>Incoming utterance</span><p>“{item.text}”</p></div><aside><span>Failure slice</span><strong>{item.slice}</strong><small>{item.severity} severity</small></aside></section>
    <div className="icc-layout">
      <aside className="icc-controls"><header><Icon name="tune" /><div><span>Treatment controls</span><strong>Decision policy</strong></div></header><label><span>Classification threshold <output>{threshold}%</output></span><input type="range" min="35" max="95" value={threshold} onChange={event=>setThreshold(Number(event.target.value))} /><small>Raising the threshold trades recall for precision and review volume.</small></label><button className={`icc-toggle ${calibrated?"is-on":""}`} onClick={()=>setCalibrated(v=>!v)} aria-pressed={calibrated}><span><strong>Probability calibration</strong><small>align confidence with observed accuracy</small></span><i>{calibrated?"ON":"OFF"}</i></button><button className={`icc-toggle ${abstain?"is-on":""}`} onClick={()=>setAbstain(v=>!v)} aria-pressed={abstain}><span><strong>Clarification route</strong><small>abstain below the threshold</small></span><i>{abstain?"ON":"OFF"}</i></button><div className="icc-cost"><span>Error cost priority</span>{[["balanced","Balanced"],["misses","Misses"],["false_alarms","False alarms"]].map(([id,label])=><button key={id} className={costMode===id?"is-active":""} onClick={()=>setCostMode(id)}>{label}</button>)}</div></aside>
      <section className="icc-diagnosis"><header><div><span>Current diagnosis</span><strong>Model decision at {threshold}% threshold</strong></div><span className={`icc-result ${result.correct?"good":result.abstained?"review":"bad"}`}>{result.correct?"correct":result.abstained?"review":"error"}</span></header><div className="icc-prediction"><div><span>Predicted action</span><strong>{result.predicted.replaceAll("_"," ")}</strong><small>{Math.round(result.confidence*100)}% confidence</small></div><div><span>Ground truth</span><strong>{item.truth.replaceAll("_"," ")}</strong><small>human-verified label</small></div></div><div className="icc-probabilities">{CLASSES.slice(0,6).map((name,index)=>{const value=name===item.baseline?result.confidence:Math.max(.03,(1-result.confidence)/(index+2));return <div key={name}><span>{name.replaceAll("_"," ")}</span><i><b style={{width:`${value*100}%`}} /></i><strong>{Math.round(value*100)}%</strong></div>;})}</div><footer><Icon name={result.correct?"check":"alert"} /><p>{result.abstained?"The model routed uncertainty to clarification instead of committing to a fragile label.":result.correct?"The prediction matches the verified intent at this operating threshold.":item.lesson}</p></footer></section>
      <aside className="icc-reliability"><span className="icc-kicker">Confidence health</span><h2>{calibrated?"Calibrated":"Overconfident"}</h2><ReliabilityChart calibrated={calibrated} /><dl><div><dt>Expected calibration error</dt><dd>{calibrated?"3.8%":"12.6%"}</dd></div><div><dt>Brier-style score</dt><dd>{calibrated?".081":".147"}</dd></div><div><dt>Review rate</dt><dd>{Math.round(reviewRate)}%</dd></div><div><dt>Weighted error cost</dt><dd>{cost}</dd></div></dl></aside>
    </div>
    <section className="icc-evaluation"><header><div><span>Evaluation ward</span><strong>Confusion matrix and failure slices</strong></div><small>Rows are actual · columns are predicted</small></header><div className="icc-eval-grid"><div><ConfusionMatrix threshold={threshold} calibrated={calibrated} /></div><div className="icc-slices">{SLICE_STATS.map(entry=><button key={entry.id} className={activeSlice===entry.id?"is-active":""} onClick={()=>setActiveSlice(entry.id)}><span>{entry.id.replaceAll("_"," ")}</span><i><b style={{width:`${entry.recall}%`}} /></i><strong>{entry.recall}% recall</strong><small>{entry.count} examples</small></button>)}</div><aside><span>Selected slice</span><h3>{activeSlice.replaceAll("_"," ")}</h3><div><strong>{Math.round(precision)}%</strong><small>precision</small></div><div><strong>{Math.round(recall)}%</strong><small>recall</small></div><div><strong>{Math.round(f1)}%</strong><small>F1</small></div><p>Aggregate accuracy can hide this slice. Add targeted examples and track its own release gate.</p></aside></div></section>
    <section className="icc-principles"><article><b>Thresholds encode product cost</b><p>The best operating point depends on whether false alarms, missed intents, or human review are more expensive.</p></article><article><b>Confidence needs calibration</b><p>A score of 0.8 is useful only when roughly 80% of comparable predictions are correct.</p></article><article><b>Abstention is a valid output</b><p>Clarifying an ambiguous request is often safer than forcing every utterance into a known class.</p></article></section>
    <style>{`
:root {
  color-scheme: light;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #e8f2f2;
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
.intent-clinic {
  --ink: #17313a;
  --muted: #607a81;
  --line: #b9ced0;
  --panel: #fbffff;
  --teal: #087f7c;
  --red: #ca4d48;
  --amber: #bd7715;
  min-height: 100vh;
  padding: 29px clamp(15px,4vw,58px) 48px;
  color: var(--ink);
  background:
    linear-gradient(rgba(8,127,124,.035) 1px, transparent 1px),
    #e8f2f2;
  background-size: 100% 25px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.icc-header {
  max-width: 1460px;
  margin: 0 auto 17px;
  display: grid;
  grid-template-columns: auto minmax(0,1fr) minmax(240px,360px);
  gap: 15px;
  align-items: center;
}
.icc-mark {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border: 2px solid var(--teal);
  border-radius: 50%;
  background: white;
  color: var(--teal);
}
.icc-header > div:nth-child(2) > span,
.icc-kicker {
  color: var(--teal);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .11em;
  text-transform: uppercase;
}
.icc-header h1 {
  margin: 5px 0 4px;
  font-family: Georgia, serif;
  font-size: clamp(34px,4.8vw,64px);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: .98;
}
.icc-header p {
  margin: 7px 0 0;
  max-width: 730px;
  color: var(--muted);
  font-size: 14px;
}
.icc-header label > span {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.icc-header select {
  width: 100%;
  min-height: 44px;
  padding: 9px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: white;
  color: var(--ink);
}
.icc-patient {
  max-width: 1460px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: 1fr 220px;
  border: 1px solid var(--line);
  border-top: 4px solid var(--teal);
  background: white;
}
.icc-patient > div,
.icc-patient aside {
  padding: 14px 17px;
}
.icc-patient aside {
  border-left: 1px solid var(--line);
}
.icc-patient span {
  display: block;
  color: var(--teal);
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
}
.icc-patient p {
  margin: 6px 0 0;
  font-family: Georgia, serif;
  font-size: clamp(17px,2vw,25px);
}
.icc-patient strong,
.icc-patient small {
  display: block;
}
.icc-patient strong {
  margin-top: 6px;
  font-size: 12px;
}
.icc-patient small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.icc-layout {
  max-width: 1460px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: 250px minmax(0,1fr) 260px;
  gap: 10px;
  align-items: start;
}
.icc-controls,
.icc-diagnosis,
.icc-reliability,
.icc-evaluation {
  min-width: 0;
  border: 1px solid var(--line);
  background: rgba(251,255,255,.96);
}
.icc-controls > header,
.icc-diagnosis > header,
.icc-evaluation > header {
  min-height: 58px;
  padding: 11px 13px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 9px;
}
.icc-controls header svg {
  color: var(--teal);
}
.icc-controls header span,
.icc-controls header strong,
.icc-diagnosis header span,
.icc-diagnosis header strong,
.icc-evaluation header span,
.icc-evaluation header strong {
  display: block;
}
.icc-controls header span,
.icc-diagnosis header span,
.icc-evaluation header span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.icc-controls header strong,
.icc-diagnosis header strong,
.icc-evaluation header strong {
  margin-top: 3px;
  font-size: 10px;
}
.icc-controls > label {
  display: block;
  padding: 14px 13px;
  border-bottom: 1px solid #dce7e7;
}
.icc-controls label > span {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 8px;
  font-weight: 800;
}
.icc-controls output {
  color: var(--teal);
}
.icc-controls input {
  width: 100%;
  margin: 12px 0 6px;
  accent-color: var(--teal);
}
.icc-controls label small {
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}
.icc-toggle {
  width: calc(100% - 24px);
  min-height: 54px;
  margin: 12px 12px 0;
  padding: 9px;
  border: 1px solid var(--line);
  background: #f2f7f7;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  text-align: left;
}
.icc-toggle.is-on {
  color: var(--ink);
  border-color: #6ab4aa;
  background: #e4f5f1;
}
.icc-toggle strong,
.icc-toggle small {
  display: block;
}
.icc-toggle strong {
  font-size: 9px;
}
.icc-toggle small {
  margin-top: 3px;
  font-size: 7px;
}
.icc-toggle i {
  align-self: center;
  color: var(--teal);
  font-size: 7px;
  font-style: normal;
}
.icc-cost {
  padding: 14px 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
}
.icc-cost > span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.icc-cost button {
  min-height: 36px;
  border: 1px solid var(--line);
  background: white;
  color: var(--muted);
  text-align: left;
  padding: 7px;
  font-size: 8px;
}
.icc-cost button.is-active {
  color: white;
  border-color: var(--teal);
  background: var(--teal);
}
.icc-diagnosis > header {
  justify-content: space-between;
}
.icc-result {
  padding: 5px 7px;
  border: 1px solid currentColor;
  font-size: 7px !important;
  font-weight: 800;
}
.icc-result.good { color: var(--teal) !important; }
.icc-result.bad { color: var(--red) !important; }
.icc-result.review { color: var(--amber) !important; }
.icc-prediction {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--line);
}
.icc-prediction > div {
  padding: 15px;
}
.icc-prediction > div + div {
  border-left: 1px solid var(--line);
}
.icc-prediction span,
.icc-prediction strong,
.icc-prediction small {
  display: block;
}
.icc-prediction span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.icc-prediction strong {
  margin: 7px 0 3px;
  color: var(--teal);
  font-size: 18px;
  text-transform: capitalize;
}
.icc-prediction small {
  color: var(--muted);
  font-size: 8px;
}
.icc-probabilities {
  padding: 13px 15px;
}
.icc-probabilities > div {
  display: grid;
  grid-template-columns: 110px 1fr 34px;
  gap: 8px;
  align-items: center;
  min-height: 29px;
}
.icc-probabilities span {
  color: var(--muted);
  font-size: 8px;
}
.icc-probabilities i {
  height: 6px;
  border-radius: 4px;
  background: #e4eded;
  overflow: hidden;
}
.icc-probabilities b {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: var(--teal);
}
.icc-probabilities strong {
  font: 800 8px ui-monospace, monospace;
  text-align: right;
}
.icc-diagnosis footer {
  padding: 12px 14px;
  border-top: 1px solid var(--line);
  background: #eef7f6;
  display: flex;
  gap: 8px;
  color: var(--teal);
}
.icc-diagnosis footer svg {
  flex: none;
}
.icc-diagnosis footer p {
  margin: 0;
  color: #486d6d;
  font-size: 8px;
  line-height: 1.5;
}
.icc-reliability {
  padding: 15px;
}
.icc-reliability h2 {
  margin: 7px 0 9px;
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 500;
}
.icc-chart {
  display: block;
  width: 100%;
  height: 138px;
  border: 1px solid #d6e3e3;
  background: #f7fbfb;
}
.icc-chart line {
  stroke: #9eb3b5;
  stroke-width: 1;
}
.icc-chart .ideal {
  stroke: #b6c4c5;
  stroke-dasharray: 4 3;
}
.icc-chart .bar {
  stroke: var(--teal);
  stroke-width: 4;
}
.icc-chart circle {
  fill: var(--teal);
}
.icc-chart text {
  fill: #71868a;
  font-size: 7px;
}
.icc-reliability dl {
  margin: 13px 0 0;
}
.icc-reliability dl div {
  padding: 8px 0;
  border-top: 1px solid #dbe6e6;
  display: flex;
  justify-content: space-between;
}
.icc-reliability dt {
  color: var(--muted);
  font-size: 8px;
}
.icc-reliability dd {
  margin: 0;
  font: 800 8px ui-monospace, monospace;
}
.icc-evaluation {
  max-width: 1460px;
  margin: 0 auto 10px;
}
.icc-evaluation > header {
  justify-content: space-between;
}
.icc-evaluation > header small {
  color: var(--muted);
  font-size: 7px;
}
.icc-eval-grid {
  display: grid;
  grid-template-columns: minmax(300px,.8fr) minmax(330px,1fr) 230px;
  gap: 0;
}
.icc-eval-grid > * {
  padding: 14px;
}
.icc-eval-grid > * + * {
  border-left: 1px solid var(--line);
}
.icc-matrix {
  display: grid;
  grid-template-columns: 72px repeat(3,1fr);
  gap: 4px;
}
.icc-matrix > span {
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 7px;
  text-transform: uppercase;
}
.icc-matrix button {
  aspect-ratio: 1;
  min-height: 58px;
  border: 1px solid color-mix(in srgb, var(--teal) calc(var(--heat)*100%), #d8e5e5);
  background: color-mix(in srgb, var(--teal) calc(var(--heat)*80%), white);
  color: var(--ink);
}
.icc-matrix button strong,
.icc-matrix button small {
  display: block;
}
.icc-matrix button strong {
  font-size: 16px;
}
.icc-matrix button small {
  margin-top: 3px;
  font-size: 6px;
}
.icc-slices {
  display: grid;
  gap: 5px;
}
.icc-slices button {
  min-height: 42px;
  padding: 7px;
  border: 1px solid #d5e1e1;
  background: #f7fbfb;
  display: grid;
  grid-template-columns: 95px 1fr 56px 50px;
  gap: 7px;
  align-items: center;
  text-align: left;
  color: var(--muted);
}
.icc-slices button.is-active {
  border-color: var(--teal);
  background: #e5f5f2;
  color: var(--ink);
}
.icc-slices span {
  font-size: 8px;
  text-transform: capitalize;
}
.icc-slices i {
  height: 5px;
  background: #dce7e7;
}
.icc-slices i b {
  display: block;
  height: 100%;
  background: var(--teal);
}
.icc-slices strong,
.icc-slices small {
  font-size: 7px;
}
.icc-eval-grid > aside > span {
  color: var(--teal);
  font-size: 8px;
  text-transform: uppercase;
}
.icc-eval-grid aside h3 {
  margin: 7px 0 12px;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 500;
  text-transform: capitalize;
}
.icc-eval-grid aside > div {
  padding: 8px 0;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
}
.icc-eval-grid aside strong {
  color: var(--teal);
  font-size: 17px;
}
.icc-eval-grid aside small {
  color: var(--muted);
  font-size: 8px;
}
.icc-eval-grid aside p {
  color: var(--muted);
  font-size: 8px;
  line-height: 1.55;
}
.icc-principles {
  max-width: 1460px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 8px;
}
.icc-principles article {
  padding: 12px;
  border-top: 3px solid var(--teal);
  background: rgba(251,255,255,.82);
}
.icc-principles b {
  font-size: 9px;
  text-transform: uppercase;
}
.icc-principles p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.55;
}
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid #bd7715;
  outline-offset: 3px;
}
@media (max-width: 1050px) {
  .icc-layout {
    grid-template-columns: 240px 1fr;
  }
  .icc-reliability {
    grid-column: 1 / -1;
  }
  .icc-eval-grid {
    grid-template-columns: 1fr 1fr;
  }
  .icc-eval-grid > aside {
    grid-column: 1 / -1;
    border-left: 0;
    border-top: 1px solid var(--line);
  }
}
@media (max-width: 700px) {
  .intent-clinic {
    padding: 22px 10px 35px;
  }
  .icc-header,
  .icc-patient,
  .icc-layout,
  .icc-eval-grid,
  .icc-principles {
    grid-template-columns: 1fr;
  }
  .icc-mark {
    width: 45px;
    height: 45px;
  }
  .icc-patient aside {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .icc-reliability,
  .icc-eval-grid > aside {
    grid-column: auto;
  }
  .icc-eval-grid > * + * {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .icc-slices button {
    grid-template-columns: 85px 1fr 52px;
  }
  .icc-slices small {
    display: none;
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

