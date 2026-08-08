import React, { useMemo, useState } from "react";

/* Durable Agent Ops — checkpoint, interrupt, replay, and idempotency simulator. */

const RUNBOOKS = [
  {
    id: "runbook-001",
    name: "Procure replacement hardware · runbook 001",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 7,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-002",
    name: "Process a travel reimbursement · runbook 002",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 8,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-003",
    name: "Publish a compliance report · runbook 003",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 9,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-004",
    name: "Rotate an expiring credential · runbook 004",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 10,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-005",
    name: "Migrate a customer workspace · runbook 005",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 11,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-006",
    name: "Investigate a production incident · runbook 006",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 12,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-007",
    name: "Procure replacement hardware · runbook 007",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 13,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-008",
    name: "Process a travel reimbursement · runbook 008",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 14,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-009",
    name: "Publish a compliance report · runbook 009",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 15,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-010",
    name: "Rotate an expiring credential · runbook 010",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 16,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-011",
    name: "Migrate a customer workspace · runbook 011",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 17,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-012",
    name: "Investigate a production incident · runbook 012",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 18,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-013",
    name: "Procure replacement hardware · runbook 013",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 19,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-014",
    name: "Process a travel reimbursement · runbook 014",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 20,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-015",
    name: "Publish a compliance report · runbook 015",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 21,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-016",
    name: "Rotate an expiring credential · runbook 016",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 22,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-017",
    name: "Migrate a customer workspace · runbook 017",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 23,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-018",
    name: "Investigate a production incident · runbook 018",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 6,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-019",
    name: "Procure replacement hardware · runbook 019",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 7,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-020",
    name: "Process a travel reimbursement · runbook 020",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 8,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-021",
    name: "Publish a compliance report · runbook 021",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 9,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-022",
    name: "Rotate an expiring credential · runbook 022",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 10,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-023",
    name: "Migrate a customer workspace · runbook 023",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 11,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-024",
    name: "Investigate a production incident · runbook 024",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 12,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-025",
    name: "Procure replacement hardware · runbook 025",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 13,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-026",
    name: "Process a travel reimbursement · runbook 026",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 14,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-027",
    name: "Publish a compliance report · runbook 027",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 15,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-028",
    name: "Rotate an expiring credential · runbook 028",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 16,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-029",
    name: "Migrate a customer workspace · runbook 029",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 17,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-030",
    name: "Investigate a production incident · runbook 030",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 18,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-031",
    name: "Procure replacement hardware · runbook 031",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 19,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-032",
    name: "Process a travel reimbursement · runbook 032",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 20,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-033",
    name: "Publish a compliance report · runbook 033",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 21,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-034",
    name: "Rotate an expiring credential · runbook 034",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 22,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-035",
    name: "Migrate a customer workspace · runbook 035",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 23,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-036",
    name: "Investigate a production incident · runbook 036",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 6,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-037",
    name: "Procure replacement hardware · runbook 037",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 7,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-038",
    name: "Process a travel reimbursement · runbook 038",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 8,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-039",
    name: "Publish a compliance report · runbook 039",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 9,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-040",
    name: "Rotate an expiring credential · runbook 040",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 10,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-041",
    name: "Migrate a customer workspace · runbook 041",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 11,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-042",
    name: "Investigate a production incident · runbook 042",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 12,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-043",
    name: "Procure replacement hardware · runbook 043",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 13,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-044",
    name: "Process a travel reimbursement · runbook 044",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 14,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-045",
    name: "Publish a compliance report · runbook 045",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 15,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-046",
    name: "Rotate an expiring credential · runbook 046",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 16,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-047",
    name: "Migrate a customer workspace · runbook 047",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 17,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-048",
    name: "Investigate a production incident · runbook 048",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 18,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-049",
    name: "Procure replacement hardware · runbook 049",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 19,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-050",
    name: "Process a travel reimbursement · runbook 050",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 20,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-051",
    name: "Publish a compliance report · runbook 051",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 21,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-052",
    name: "Rotate an expiring credential · runbook 052",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 22,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-053",
    name: "Migrate a customer workspace · runbook 053",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 23,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-054",
    name: "Investigate a production incident · runbook 054",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 6,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-055",
    name: "Procure replacement hardware · runbook 055",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 7,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-056",
    name: "Process a travel reimbursement · runbook 056",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 8,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-057",
    name: "Publish a compliance report · runbook 057",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 9,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-058",
    name: "Rotate an expiring credential · runbook 058",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 10,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-059",
    name: "Migrate a customer workspace · runbook 059",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 11,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-060",
    name: "Investigate a production incident · runbook 060",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 12,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-061",
    name: "Procure replacement hardware · runbook 061",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 13,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-062",
    name: "Process a travel reimbursement · runbook 062",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 14,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-063",
    name: "Publish a compliance report · runbook 063",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 15,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-064",
    name: "Rotate an expiring credential · runbook 064",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 16,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-065",
    name: "Migrate a customer workspace · runbook 065",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 17,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-066",
    name: "Investigate a production incident · runbook 066",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 18,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-067",
    name: "Procure replacement hardware · runbook 067",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 19,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-068",
    name: "Process a travel reimbursement · runbook 068",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 20,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-069",
    name: "Publish a compliance report · runbook 069",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 21,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-070",
    name: "Rotate an expiring credential · runbook 070",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 22,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-071",
    name: "Migrate a customer workspace · runbook 071",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 23,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-072",
    name: "Investigate a production incident · runbook 072",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 6,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-073",
    name: "Procure replacement hardware · runbook 073",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 7,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-074",
    name: "Process a travel reimbursement · runbook 074",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 8,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-075",
    name: "Publish a compliance report · runbook 075",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 9,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-076",
    name: "Rotate an expiring credential · runbook 076",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 10,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-077",
    name: "Migrate a customer workspace · runbook 077",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 11,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-078",
    name: "Investigate a production incident · runbook 078",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 12,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-079",
    name: "Procure replacement hardware · runbook 079",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 13,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-080",
    name: "Process a travel reimbursement · runbook 080",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 14,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-081",
    name: "Publish a compliance report · runbook 081",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 15,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-082",
    name: "Rotate an expiring credential · runbook 082",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 16,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-083",
    name: "Migrate a customer workspace · runbook 083",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 17,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-084",
    name: "Investigate a production incident · runbook 084",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 18,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-085",
    name: "Procure replacement hardware · runbook 085",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 19,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-086",
    name: "Process a travel reimbursement · runbook 086",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 20,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-087",
    name: "Publish a compliance report · runbook 087",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 21,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-088",
    name: "Rotate an expiring credential · runbook 088",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 22,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-089",
    name: "Migrate a customer workspace · runbook 089",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 23,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-090",
    name: "Investigate a production incident · runbook 090",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 6,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-091",
    name: "Procure replacement hardware · runbook 091",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 7,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-092",
    name: "Process a travel reimbursement · runbook 092",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 8,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-093",
    name: "Publish a compliance report · runbook 093",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 9,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-094",
    name: "Rotate an expiring credential · runbook 094",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 10,
    sideEffects: 3,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-095",
    name: "Migrate a customer workspace · runbook 095",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 11,
    sideEffects: 4,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-096",
    name: "Investigate a production incident · runbook 096",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 12,
    sideEffects: 1,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-097",
    name: "Procure replacement hardware · runbook 097",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 13,
    sideEffects: 2,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-098",
    name: "Process a travel reimbursement · runbook 098",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 14,
    sideEffects: 3,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-099",
    name: "Publish a compliance report · runbook 099",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 15,
    sideEffects: 4,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-100",
    name: "Rotate an expiring credential · runbook 100",
    workflow: "Rotate an expiring credential",
    fault: "worker terminated after side effect",
    recommended: "checkpoint side effects as tasks",
    duration: 16,
    sideEffects: 1,
    severity: "high",
    lesson: "If worker terminated after side effect, checkpoint side effects as tasks so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-101",
    name: "Migrate a customer workspace · runbook 101",
    workflow: "Migrate a customer workspace",
    fault: "duplicate queue delivery",
    recommended: "checkpoint on exit only",
    duration: 17,
    sideEffects: 2,
    severity: "critical",
    lesson: "If duplicate queue delivery, checkpoint on exit only so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-102",
    name: "Investigate a production incident · runbook 102",
    workflow: "Investigate a production incident",
    fault: "worker terminated after side effect",
    recommended: "checkpoint every step",
    duration: 18,
    sideEffects: 3,
    severity: "moderate",
    lesson: "If worker terminated after side effect, checkpoint every step so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-103",
    name: "Procure replacement hardware · runbook 103",
    workflow: "Procure replacement hardware",
    fault: "duplicate queue delivery",
    recommended: "separate thread state from long-term memory",
    duration: 19,
    sideEffects: 4,
    severity: "high",
    lesson: "If duplicate queue delivery, separate thread state from long-term memory so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-104",
    name: "Process a travel reimbursement · runbook 104",
    workflow: "Process a travel reimbursement",
    fault: "worker terminated after side effect",
    recommended: "use idempotency keys",
    duration: 20,
    sideEffects: 1,
    severity: "critical",
    lesson: "If worker terminated after side effect, use idempotency keys so resume preserves completed work without duplicating consequences.",
  },
  {
    id: "runbook-105",
    name: "Publish a compliance report · runbook 105",
    workflow: "Publish a compliance report",
    fault: "duplicate queue delivery",
    recommended: "store approval payload durably",
    duration: 21,
    sideEffects: 2,
    severity: "moderate",
    lesson: "If duplicate queue delivery, store approval payload durably so resume preserves completed work without duplicating consequences.",
  },
];

const STEPS = [
  { id: "intake", label: "Validate request", kind: "compute", duration: 8, sideEffect: false },
  { id: "lookup", label: "Load account state", kind: "read", duration: 12, sideEffect: false },
  { id: "prepare", label: "Prepare change set", kind: "compute", duration: 16, sideEffect: false },
  { id: "approval", label: "Wait for approval", kind: "interrupt", duration: 0, sideEffect: false },
  { id: "execute", label: "Apply external change", kind: "write", duration: 22, sideEffect: true },
  { id: "verify", label: "Verify final state", kind: "read", duration: 11, sideEffect: false },
  { id: "notify", label: "Send completion notice", kind: "write", duration: 7, sideEffect: true },
];

const EVENTS = [
  { at: "10:14:02.011", type: "queue", text: "run queued · thread thr_7f2" },
  { at: "10:14:02.084", type: "lease", text: "worker-03 acquired lease" },
  { at: "10:14:02.221", type: "checkpoint", text: "checkpoint cp_001 committed" },
  { at: "10:14:02.490", type: "tool", text: "account.read completed" },
  { at: "10:14:02.701", type: "checkpoint", text: "checkpoint cp_002 committed" },
  { at: "10:14:03.042", type: "interrupt", text: "approval interrupt emitted" },
  { at: "10:18:44.530", type: "resume", text: "approval accepted · resume command" },
  { at: "10:18:44.890", type: "tool", text: "external.write idempotency=run_7f2_execute" },
  { at: "10:18:45.107", type: "checkpoint", text: "checkpoint cp_005 committed" },
];

function Icon({ name, size = 18 }) {
  const paths = {
    pulse: <><path d="M3 12h4l2-6 4 12 2-6h6" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    crash: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5" /><circle cx="12" cy="12" r="3" /></>,
    checkpoint: <><path d="M5 4h14v16H5z" /><path d="m8 12 3 3 5-6" /></>,
    shield: <><path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6Z" /><path d="m9 12 2 2 4-5" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function deriveStepState(step, crashAt, crashed, resumed, checkpointMode) {
  const index = STEPS.findIndex((item) => item.id === step.id);
  const crashIndex = STEPS.findIndex((item) => item.id === crashAt);
  if (!crashed) return index < 2 ? "complete" : index === 2 ? "running" : "pending";
  if (!resumed) return index < crashIndex ? "complete" : index === crashIndex ? "failed" : "pending";
  if (checkpointMode === "exit") return index < crashIndex ? "replayed" : index === crashIndex ? "running" : "pending";
  return index <= crashIndex ? "complete" : index === crashIndex + 1 ? "running" : "pending";
}

function TimelineStep({ step, state, index, checkpointMode, idempotent }) {
  const checkpointed = checkpointMode === "step" && state === "complete";
  return <div className={`dao-step is-${state}`}><div className="dao-rail"><span>{index + 1}</span><i /></div><article><header><div><strong>{step.label}</strong><small>{step.kind} · {step.duration || "wait"}s</small></div><span>{state}</span></header><p>{step.sideEffect ? `External side effect · ${idempotent ? "idempotency protected" : "duplicate risk"}` : step.kind === "interrupt" ? "Durable pause awaiting a JSON-serializable response." : "Deterministic state transformation."}</p>{checkpointed && <div className="dao-checkpoint"><Icon name="checkpoint" size={13} /> checkpoint committed after step</div>}</article></div>;
}

export default function DurableAgentOpsLab() {
  const [runbookId, setRunbookId] = useState("runbook-005");
  const [checkpointMode, setCheckpointMode] = useState("step");
  const [idempotent, setIdempotent] = useState(true);
  const [crashAt, setCrashAt] = useState("execute");
  const [crashed, setCrashed] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [approval, setApproval] = useState("approved");
  const runbook = RUNBOOKS.find((item) => item.id === runbookId) || RUNBOOKS[0];
  const states = useMemo(() => STEPS.map((step) => deriveStepState(step, crashAt, crashed, resumed, checkpointMode)), [crashAt, crashed, resumed, checkpointMode]);
  const replayed = states.filter((state) => state === "replayed").length;
  const completed = states.filter((state) => state === "complete").length;
  const duplicateRisk = resumed && !idempotent && STEPS.slice(0, STEPS.findIndex((item) => item.id === crashAt) + 1).some((step) => step.sideEffect);
  const recovery = !crashed ? "running" : !resumed ? "worker lost" : duplicateRisk ? "resumed with risk" : "resumed safely";
  const recoveryTime = checkpointMode === "step" ? 1.8 : checkpointMode === "async" ? 3.4 : 11.7;
  const reset = (id = runbookId) => { setRunbookId(id); setCrashed(false); setResumed(false); };

  return <main className="durable-agent-ops">
    <header className="dao-header"><div><span className="dao-eyebrow"><Icon name="pulse" size={15} /> Agent reliability · runtime lab</span><h1>Durable Agent Ops</h1><p>Crash a long-running workflow, inspect persisted state, and resume without replaying dangerous side effects.</p></div><div className="dao-run-id"><span>Active thread</span><strong>thr_7f2a91</strong><small>{recovery}</small></div></header>
    <section className="dao-command"><label><span>Runbook</span><select value={runbookId} onChange={(event) => reset(event.target.value)}>{RUNBOOKS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><span>Crash at</span><select value={crashAt} onChange={(event) => { setCrashAt(event.target.value); setCrashed(false); setResumed(false); }}>{STEPS.filter((step) => step.id !== "approval").map((step) => <option key={step.id} value={step.id}>{step.label}</option>)}</select></label><button className="dao-crash" onClick={() => { setCrashed(true); setResumed(false); }}><Icon name="crash" size={16} /> Terminate worker</button><button className="dao-resume" disabled={!crashed || resumed} onClick={() => setResumed(true)}><Icon name="play" size={16} /> Resume run</button></section>
    <section className="dao-alert"><Icon name="shield" /><div><span>Failure exercise</span><strong>{runbook.fault}</strong><p>{runbook.lesson}</p></div></section>
    <div className="dao-grid">
      <aside className="dao-settings"><header><span>Durability policy</span><strong>Persistence controls</strong></header><div className="dao-segment" role="group" aria-label="Checkpoint frequency"><button className={checkpointMode === "step" ? "is-active" : ""} onClick={() => { setCheckpointMode("step"); setResumed(false); }}>Every step<small>Safest resume</small></button><button className={checkpointMode === "async" ? "is-active" : ""} onClick={() => { setCheckpointMode("async"); setResumed(false); }}>Async<small>Lower write latency</small></button><button className={checkpointMode === "exit" ? "is-active" : ""} onClick={() => { setCheckpointMode("exit"); setResumed(false); }}>On exit<small>No mid-run recovery</small></button></div><button className={`dao-toggle ${idempotent ? "is-on" : ""}`} onClick={() => setIdempotent((value) => !value)} aria-pressed={idempotent}><span><strong>Idempotency keys</strong><small>Deduplicate external writes</small></span><i>{idempotent ? "ENABLED" : "DISABLED"}</i></button><label className="dao-approval"><span>Approval response</span><select value={approval} onChange={(event) => setApproval(event.target.value)}><option value="approved">Approve execution</option><option value="denied">Deny and revise</option><option value="edit">Approve with edits</option></select><small>Interrupt state remains durable while no worker is active.</small></label><div className="dao-rule"><span>Runtime invariant</span><code>resume(state, checkpoint)</code><code>side_effect(key) → once</code></div></aside>
      <section className="dao-timeline"><header><div><span>Execution timeline</span><strong>{completed}/{STEPS.length} steps checkpointed</strong></div><span className={`dao-state is-${recovery.replaceAll(" ","-")}`}>{recovery}</span></header><div className="dao-steps">{STEPS.map((step, index) => <TimelineStep key={step.id} step={step} state={states[index]} index={index} checkpointMode={checkpointMode} idempotent={idempotent} />)}</div></section>
      <aside className="dao-events"><header><span>Runtime events</span><strong>Structured event stream</strong></header><div>{EVENTS.slice(0, crashed ? resumed ? EVENTS.length : 6 : 4).map((event, index) => <article key={`${event.at}-${index}`} className={`is-${event.type}`}><time>{event.at}</time><span>{event.type}</span><p>{event.text}</p></article>)}{crashed && <article className="is-error"><time>10:14:03.218</time><span>error</span><p>worker heartbeat expired · lease released</p></article>}{resumed && <article className={duplicateRisk ? "is-error" : "is-resume"}><time>10:18:45.422</time><span>{duplicateRisk ? "warning" : "resume"}</span><p>{duplicateRisk ? "external write may execute twice" : "completed tasks restored from checkpoint"}</p></article>}</div></aside>
    </div>
    <section className="dao-metrics"><article><span>Recovery point</span><strong>{checkpointMode === "exit" ? "start of run" : `step ${Math.max(completed,1)}`}</strong><small>{replayed} steps replayed</small></article><article><span>Estimated recovery</span><strong>{recoveryTime.toFixed(1)} s</strong><small>checkpoint load + lease</small></article><article><span>Side-effect safety</span><strong className={duplicateRisk ? "bad" : "good"}>{duplicateRisk ? "at risk" : "protected"}</strong><small>{idempotent ? "stable request keys" : "no deduplication"}</small></article><article><span>Interrupt outcome</span><strong>{approval}</strong><small>persisted with thread state</small></article></section>
    <section className="dao-principles"><article><b>Checkpoint boundaries</b><p>Persist after meaningful state transitions so a new worker can recover without starting over.</p></article><article><b>Idempotent effects</b><p>A resumed node may run again. Stable keys, upserts, and read-before-write prevent duplicates.</p></article><article><b>Durable interrupts</b><p>Pause indefinitely for human input without keeping a process alive or losing the execution state.</p></article></section>
    <style>{`
:root {
  color-scheme: dark;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #07110e;
}
button,
select {
  font: inherit;
}
button,
select {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: .45;
}
.durable-agent-ops {
  --ink: #e8fff5;
  --muted: #8aa99c;
  --line: #254238;
  --panel: #0c1a16;
  --panel-2: #10241d;
  --green: #50e3a4;
  --lime: #c1f37d;
  --orange: #ff9165;
  --red: #ff655f;
  min-height: 100vh;
  padding: 30px clamp(15px,3.5vw,54px) 48px;
  color: var(--ink);
  background:
    radial-gradient(circle at 8% 0%, rgba(54,193,131,.13), transparent 26%),
    linear-gradient(rgba(80,227,164,.025) 1px, transparent 1px),
    #07110e;
  background-size: auto, 100% 26px, auto;
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
}
.dao-header {
  max-width: 1480px;
  margin: 0 auto 18px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
}
.dao-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.dao-header h1 {
  margin: 9px 0 6px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(36px,5vw,70px);
  letter-spacing: -.055em;
  line-height: .92;
}
.dao-header p {
  margin: 0;
  max-width: 760px;
  color: var(--muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 15px;
}
.dao-run-id {
  min-width: 220px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--green);
  background: rgba(12,26,22,.92);
}
.dao-run-id span,
.dao-run-id strong,
.dao-run-id small {
  display: block;
}
.dao-run-id span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.dao-run-id strong {
  margin: 5px 0;
  color: var(--green);
  font-size: 14px;
}
.dao-run-id small {
  color: #bed3ca;
  font-size: 9px;
}
.dao-command {
  max-width: 1480px;
  margin: 0 auto 10px;
  padding: 11px;
  border: 1px solid var(--line);
  background: var(--panel);
  display: grid;
  grid-template-columns: minmax(220px,1.5fr) minmax(180px,.8fr) auto auto;
  gap: 9px;
  align-items: end;
}
.dao-command label > span {
  display: block;
  margin-bottom: 5px;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.dao-command select,
.dao-approval select {
  width: 100%;
  min-height: 42px;
  padding: 9px;
  color: var(--ink);
  border: 1px solid #315247;
  background: #0a1713;
}
.dao-command button {
  min-height: 42px;
  padding: 9px 13px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  font-weight: 800;
}
.dao-crash {
  color: #ffece5;
  border: 1px solid #a64c3c;
  background: #5a271f;
}
.dao-resume {
  color: #062117;
  border: 1px solid var(--green);
  background: var(--green);
}
.dao-alert {
  max-width: 1480px;
  margin: 0 auto 10px;
  padding: 11px 14px;
  border: 1px solid #72533b;
  background: #2a2118;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--orange);
}
.dao-alert > div {
  min-width: 0;
}
.dao-alert span,
.dao-alert strong,
.dao-alert p {
  display: inline;
}
.dao-alert span {
  margin-right: 10px;
  font-size: 8px;
  text-transform: uppercase;
}
.dao-alert strong {
  color: #ffd1bd;
  font-size: 11px;
}
.dao-alert p {
  margin-left: 10px;
  color: #ba9c8d;
  font-size: 9px;
}
.dao-grid {
  max-width: 1480px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: 260px minmax(390px,1fr) minmax(280px,.75fr);
  gap: 10px;
  align-items: start;
}
.dao-settings,
.dao-timeline,
.dao-events {
  min-width: 0;
  border: 1px solid var(--line);
  background: rgba(12,26,22,.96);
}
.dao-settings > header,
.dao-timeline > header,
.dao-events > header {
  min-height: 57px;
  padding: 11px 13px;
  border-bottom: 1px solid var(--line);
}
.dao-settings header span,
.dao-settings header strong,
.dao-timeline header span,
.dao-timeline header strong,
.dao-events header span,
.dao-events header strong {
  display: block;
}
.dao-settings header span,
.dao-timeline header span,
.dao-events header span {
  color: var(--muted);
  font-size: 8px;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.dao-settings header strong,
.dao-timeline header strong,
.dao-events header strong {
  margin-top: 4px;
  font-size: 11px;
}
.dao-segment {
  display: grid;
  padding: 10px;
  gap: 5px;
}
.dao-segment button {
  min-height: 48px;
  padding: 8px 9px;
  text-align: left;
  color: var(--muted);
  border: 1px solid var(--line);
  background: #0a1713;
}
.dao-segment button.is-active {
  color: var(--ink);
  border-color: var(--green);
  box-shadow: inset 3px 0 var(--green);
  background: #10271f;
}
.dao-segment strong,
.dao-segment small {
  display: block;
}
.dao-segment strong {
  font-size: 10px;
}
.dao-segment small {
  margin-top: 3px;
  font-size: 8px;
}
.dao-toggle {
  width: calc(100% - 20px);
  min-height: 57px;
  margin: 2px 10px 10px;
  padding: 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: var(--muted);
  border: 1px solid var(--line);
  background: #0a1713;
}
.dao-toggle.is-on {
  color: var(--ink);
  border-color: #3d896c;
  background: #10271f;
}
.dao-toggle strong,
.dao-toggle small {
  display: block;
}
.dao-toggle strong {
  font-size: 9px;
}
.dao-toggle small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 7px;
}
.dao-toggle i {
  color: var(--green);
  font-size: 7px;
  font-style: normal;
}
.dao-approval {
  display: block;
  margin: 0 10px 12px;
}
.dao-approval > span {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.dao-approval small {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 7px;
  line-height: 1.5;
}
.dao-rule {
  margin: 10px;
  padding: 10px;
  border-top: 2px solid var(--lime);
  background: #15251f;
}
.dao-rule span {
  display: block;
  margin-bottom: 6px;
  color: var(--lime);
  font-size: 7px;
  text-transform: uppercase;
}
.dao-rule code {
  display: block;
  color: #cbe1d7;
  font-size: 8px;
  line-height: 1.7;
}
.dao-timeline > header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dao-state {
  padding: 5px 7px;
  border: 1px solid currentColor;
  color: var(--green) !important;
  font-size: 7px !important;
  font-weight: 800;
}
.dao-state.is-worker-lost,
.dao-state.is-resumed-with-risk {
  color: var(--red) !important;
}
.dao-steps {
  padding: 13px;
}
.dao-step {
  display: grid;
  grid-template-columns: 34px 1fr;
  min-height: 88px;
}
.dao-rail {
  position: relative;
  display: grid;
  justify-items: center;
}
.dao-rail span {
  z-index: 1;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: 1px solid #3a564c;
  border-radius: 50%;
  color: var(--muted);
  background: #0c1a16;
  font-size: 8px;
}
.dao-rail i {
  position: absolute;
  top: 24px;
  bottom: 0;
  width: 1px;
  background: #2b483e;
}
.dao-step:last-child .dao-rail i {
  display: none;
}
.dao-step > article {
  margin-bottom: 9px;
  padding: 9px 11px;
  border: 1px solid #203b32;
  background: #0a1713;
}
.dao-step article header {
  display: flex;
  justify-content: space-between;
  gap: 9px;
}
.dao-step article strong,
.dao-step article small {
  display: block;
}
.dao-step article strong {
  font-size: 10px;
}
.dao-step article small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 7px;
}
.dao-step article header > span {
  color: var(--muted);
  font-size: 7px;
  text-transform: uppercase;
}
.dao-step article p {
  margin: 8px 0 0;
  color: #89a398;
  font-size: 8px;
  line-height: 1.45;
}
.dao-step.is-complete .dao-rail span {
  color: #061f15;
  border-color: var(--green);
  background: var(--green);
}
.dao-step.is-running article {
  border-color: var(--lime);
  box-shadow: inset 3px 0 var(--lime);
}
.dao-step.is-failed article {
  border-color: var(--red);
  background: #281817;
}
.dao-step.is-failed .dao-rail span {
  color: white;
  border-color: var(--red);
  background: #9a332f;
}
.dao-step.is-replayed article {
  border-color: var(--orange);
  background: #251e16;
}
.dao-checkpoint {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--green);
  font-size: 7px;
}
.dao-events > div {
  max-height: 650px;
  overflow: auto;
}
.dao-events article {
  padding: 10px 11px;
  border-bottom: 1px solid #203b32;
  display: grid;
  grid-template-columns: 72px 64px 1fr;
  gap: 7px;
  align-items: start;
}
.dao-events time {
  color: #55766a;
  font-size: 7px;
}
.dao-events article > span {
  color: var(--green);
  font-size: 7px;
  text-transform: uppercase;
}
.dao-events p {
  margin: 0;
  color: #b1c8be;
  font-size: 8px;
  line-height: 1.45;
}
.dao-events .is-error > span,
.dao-events .is-error p {
  color: var(--red);
}
.dao-events .is-interrupt > span {
  color: var(--orange);
}
.dao-events .is-resume > span {
  color: var(--lime);
}
.dao-metrics {
  max-width: 1480px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 8px;
}
.dao-metrics article {
  min-height: 92px;
  padding: 12px;
  border: 1px solid var(--line);
  background: rgba(12,26,22,.9);
}
.dao-metrics span,
.dao-metrics strong,
.dao-metrics small {
  display: block;
}
.dao-metrics span {
  color: var(--muted);
  font-size: 7px;
  text-transform: uppercase;
}
.dao-metrics strong {
  margin: 8px 0 4px;
  color: var(--lime);
  font-size: 18px;
}
.dao-metrics strong.bad {
  color: var(--red);
}
.dao-metrics strong.good {
  color: var(--green);
}
.dao-metrics small {
  color: var(--muted);
  font-size: 7px;
}
.dao-principles {
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 8px;
}
.dao-principles article {
  padding: 12px;
  border-top: 2px solid var(--green);
  background: rgba(16,36,29,.8);
}
.dao-principles b {
  color: var(--ink);
  font-size: 9px;
}
.dao-principles p {
  margin: 5px 0 0;
  color: var(--muted);
  font: 8px/1.55 Inter, ui-sans-serif, system-ui, sans-serif;
}
button:focus-visible,
select:focus-visible {
  outline: 3px solid var(--lime);
  outline-offset: 3px;
}
@media (max-width: 1040px) {
  .dao-grid {
    grid-template-columns: 250px 1fr;
  }
  .dao-events {
    grid-column: 1 / -1;
  }
  .dao-events > div {
    max-height: 300px;
  }
}
@media (max-width: 760px) {
  .durable-agent-ops {
    padding: 22px 10px 34px;
  }
  .dao-header {
    align-items: start;
    flex-direction: column;
  }
  .dao-run-id {
    width: 100%;
  }
  .dao-command,
  .dao-grid,
  .dao-metrics,
  .dao-principles {
    grid-template-columns: 1fr;
  }
  .dao-alert {
    align-items: start;
  }
  .dao-alert p {
    display: block;
    margin: 5px 0 0;
  }
  .dao-events {
    grid-column: auto;
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

