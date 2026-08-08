import React, { useMemo, useState } from "react";

/* Plan Repair Studio — deterministic ReAct planning and replanning simulator. */

const MISSIONS = [
  {
    id: "mission-001",
    name: "Prepare a launch brief · 001",
    goal: "Prepare a launch brief for scenario 1 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 27,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-002",
    name: "Resolve a customer escalation · 002",
    goal: "Resolve a customer escalation for scenario 2 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 34,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-003",
    name: "Reconcile a billing anomaly · 003",
    goal: "Reconcile a billing anomaly for scenario 3 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 41,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-004",
    name: "Schedule a field repair · 004",
    goal: "Schedule a field repair for scenario 4 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 48,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-005",
    name: "Audit an access request · 005",
    goal: "Audit an access request for scenario 5 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 55,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-006",
    name: "Research a market entrant · 006",
    goal: "Research a market entrant for scenario 6 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 62,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-007",
    name: "Prepare a launch brief · 007",
    goal: "Prepare a launch brief for scenario 7 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 69,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-008",
    name: "Resolve a customer escalation · 008",
    goal: "Resolve a customer escalation for scenario 8 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 76,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-009",
    name: "Reconcile a billing anomaly · 009",
    goal: "Reconcile a billing anomaly for scenario 9 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 83,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-010",
    name: "Schedule a field repair · 010",
    goal: "Schedule a field repair for scenario 10 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 20,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-011",
    name: "Audit an access request · 011",
    goal: "Audit an access request for scenario 11 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 27,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-012",
    name: "Research a market entrant · 012",
    goal: "Research a market entrant for scenario 12 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 34,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-013",
    name: "Prepare a launch brief · 013",
    goal: "Prepare a launch brief for scenario 13 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 41,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-014",
    name: "Resolve a customer escalation · 014",
    goal: "Resolve a customer escalation for scenario 14 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 48,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-015",
    name: "Reconcile a billing anomaly · 015",
    goal: "Reconcile a billing anomaly for scenario 15 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 55,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-016",
    name: "Schedule a field repair · 016",
    goal: "Schedule a field repair for scenario 16 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 62,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-017",
    name: "Audit an access request · 017",
    goal: "Audit an access request for scenario 17 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 69,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-018",
    name: "Research a market entrant · 018",
    goal: "Research a market entrant for scenario 18 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 76,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-019",
    name: "Prepare a launch brief · 019",
    goal: "Prepare a launch brief for scenario 19 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 83,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-020",
    name: "Resolve a customer escalation · 020",
    goal: "Resolve a customer escalation for scenario 20 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 20,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-021",
    name: "Reconcile a billing anomaly · 021",
    goal: "Reconcile a billing anomaly for scenario 21 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 27,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-022",
    name: "Schedule a field repair · 022",
    goal: "Schedule a field repair for scenario 22 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 34,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-023",
    name: "Audit an access request · 023",
    goal: "Audit an access request for scenario 23 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 41,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-024",
    name: "Research a market entrant · 024",
    goal: "Research a market entrant for scenario 24 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 48,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-025",
    name: "Prepare a launch brief · 025",
    goal: "Prepare a launch brief for scenario 25 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 55,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-026",
    name: "Resolve a customer escalation · 026",
    goal: "Resolve a customer escalation for scenario 26 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 62,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-027",
    name: "Reconcile a billing anomaly · 027",
    goal: "Reconcile a billing anomaly for scenario 27 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 69,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-028",
    name: "Schedule a field repair · 028",
    goal: "Schedule a field repair for scenario 28 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 76,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-029",
    name: "Audit an access request · 029",
    goal: "Audit an access request for scenario 29 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 83,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-030",
    name: "Research a market entrant · 030",
    goal: "Research a market entrant for scenario 30 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 20,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-031",
    name: "Prepare a launch brief · 031",
    goal: "Prepare a launch brief for scenario 31 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 27,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-032",
    name: "Resolve a customer escalation · 032",
    goal: "Resolve a customer escalation for scenario 32 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 34,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-033",
    name: "Reconcile a billing anomaly · 033",
    goal: "Reconcile a billing anomaly for scenario 33 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 41,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-034",
    name: "Schedule a field repair · 034",
    goal: "Schedule a field repair for scenario 34 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 48,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-035",
    name: "Audit an access request · 035",
    goal: "Audit an access request for scenario 35 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 55,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-036",
    name: "Research a market entrant · 036",
    goal: "Research a market entrant for scenario 36 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 62,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-037",
    name: "Prepare a launch brief · 037",
    goal: "Prepare a launch brief for scenario 37 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 69,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-038",
    name: "Resolve a customer escalation · 038",
    goal: "Resolve a customer escalation for scenario 38 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 76,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-039",
    name: "Reconcile a billing anomaly · 039",
    goal: "Reconcile a billing anomaly for scenario 39 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 83,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-040",
    name: "Schedule a field repair · 040",
    goal: "Schedule a field repair for scenario 40 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 20,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-041",
    name: "Audit an access request · 041",
    goal: "Audit an access request for scenario 41 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 27,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-042",
    name: "Research a market entrant · 042",
    goal: "Research a market entrant for scenario 42 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 34,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-043",
    name: "Prepare a launch brief · 043",
    goal: "Prepare a launch brief for scenario 43 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 41,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-044",
    name: "Resolve a customer escalation · 044",
    goal: "Resolve a customer escalation for scenario 44 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 48,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-045",
    name: "Reconcile a billing anomaly · 045",
    goal: "Reconcile a billing anomaly for scenario 45 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 55,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-046",
    name: "Schedule a field repair · 046",
    goal: "Schedule a field repair for scenario 46 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 62,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-047",
    name: "Audit an access request · 047",
    goal: "Audit an access request for scenario 47 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 69,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-048",
    name: "Research a market entrant · 048",
    goal: "Research a market entrant for scenario 48 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 76,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-049",
    name: "Prepare a launch brief · 049",
    goal: "Prepare a launch brief for scenario 49 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 83,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-050",
    name: "Resolve a customer escalation · 050",
    goal: "Resolve a customer escalation for scenario 50 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 20,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-051",
    name: "Reconcile a billing anomaly · 051",
    goal: "Reconcile a billing anomaly for scenario 51 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 27,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-052",
    name: "Schedule a field repair · 052",
    goal: "Schedule a field repair for scenario 52 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 34,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-053",
    name: "Audit an access request · 053",
    goal: "Audit an access request for scenario 53 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 41,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-054",
    name: "Research a market entrant · 054",
    goal: "Research a market entrant for scenario 54 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 48,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-055",
    name: "Prepare a launch brief · 055",
    goal: "Prepare a launch brief for scenario 55 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 55,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-056",
    name: "Resolve a customer escalation · 056",
    goal: "Resolve a customer escalation for scenario 56 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 62,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-057",
    name: "Reconcile a billing anomaly · 057",
    goal: "Reconcile a billing anomaly for scenario 57 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 69,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-058",
    name: "Schedule a field repair · 058",
    goal: "Schedule a field repair for scenario 58 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 76,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-059",
    name: "Audit an access request · 059",
    goal: "Audit an access request for scenario 59 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 83,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-060",
    name: "Research a market entrant · 060",
    goal: "Research a market entrant for scenario 60 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 20,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-061",
    name: "Prepare a launch brief · 061",
    goal: "Prepare a launch brief for scenario 61 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 27,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-062",
    name: "Resolve a customer escalation · 062",
    goal: "Resolve a customer escalation for scenario 62 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 34,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-063",
    name: "Reconcile a billing anomaly · 063",
    goal: "Reconcile a billing anomaly for scenario 63 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 41,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-064",
    name: "Schedule a field repair · 064",
    goal: "Schedule a field repair for scenario 64 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 48,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-065",
    name: "Audit an access request · 065",
    goal: "Audit an access request for scenario 65 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 55,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-066",
    name: "Research a market entrant · 066",
    goal: "Research a market entrant for scenario 66 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 62,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-067",
    name: "Prepare a launch brief · 067",
    goal: "Prepare a launch brief for scenario 67 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 69,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-068",
    name: "Resolve a customer escalation · 068",
    goal: "Resolve a customer escalation for scenario 68 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 76,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-069",
    name: "Reconcile a billing anomaly · 069",
    goal: "Reconcile a billing anomaly for scenario 69 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 83,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-070",
    name: "Schedule a field repair · 070",
    goal: "Schedule a field repair for scenario 70 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 20,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-071",
    name: "Audit an access request · 071",
    goal: "Audit an access request for scenario 71 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 27,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-072",
    name: "Research a market entrant · 072",
    goal: "Research a market entrant for scenario 72 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 34,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-073",
    name: "Prepare a launch brief · 073",
    goal: "Prepare a launch brief for scenario 73 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 41,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-074",
    name: "Resolve a customer escalation · 074",
    goal: "Resolve a customer escalation for scenario 74 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 48,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-075",
    name: "Reconcile a billing anomaly · 075",
    goal: "Reconcile a billing anomaly for scenario 75 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 55,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-076",
    name: "Schedule a field repair · 076",
    goal: "Schedule a field repair for scenario 76 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 62,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-077",
    name: "Audit an access request · 077",
    goal: "Audit an access request for scenario 77 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 69,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-078",
    name: "Research a market entrant · 078",
    goal: "Research a market entrant for scenario 78 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 76,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-079",
    name: "Prepare a launch brief · 079",
    goal: "Prepare a launch brief for scenario 79 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 83,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-080",
    name: "Resolve a customer escalation · 080",
    goal: "Resolve a customer escalation for scenario 80 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 20,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-081",
    name: "Reconcile a billing anomaly · 081",
    goal: "Reconcile a billing anomaly for scenario 81 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 27,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-082",
    name: "Schedule a field repair · 082",
    goal: "Schedule a field repair for scenario 82 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 34,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-083",
    name: "Audit an access request · 083",
    goal: "Audit an access request for scenario 83 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 41,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-084",
    name: "Research a market entrant · 084",
    goal: "Research a market entrant for scenario 84 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 48,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-085",
    name: "Prepare a launch brief · 085",
    goal: "Prepare a launch brief for scenario 85 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 55,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-086",
    name: "Resolve a customer escalation · 086",
    goal: "Resolve a customer escalation for scenario 86 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 62,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-087",
    name: "Reconcile a billing anomaly · 087",
    goal: "Reconcile a billing anomaly for scenario 87 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 69,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-088",
    name: "Schedule a field repair · 088",
    goal: "Schedule a field repair for scenario 88 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 76,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-089",
    name: "Audit an access request · 089",
    goal: "Audit an access request for scenario 89 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 83,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-090",
    name: "Research a market entrant · 090",
    goal: "Research a market entrant for scenario 90 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 20,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-091",
    name: "Prepare a launch brief · 091",
    goal: "Prepare a launch brief for scenario 91 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 27,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-092",
    name: "Resolve a customer escalation · 092",
    goal: "Resolve a customer escalation for scenario 92 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 34,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-093",
    name: "Reconcile a billing anomaly · 093",
    goal: "Reconcile a billing anomaly for scenario 93 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 41,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-094",
    name: "Schedule a field repair · 094",
    goal: "Schedule a field repair for scenario 94 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 48,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-095",
    name: "Audit an access request · 095",
    goal: "Audit an access request for scenario 95 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 55,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-096",
    name: "Research a market entrant · 096",
    goal: "Research a market entrant for scenario 96 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 62,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-097",
    name: "Prepare a launch brief · 097",
    goal: "Prepare a launch brief for scenario 97 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 69,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-098",
    name: "Resolve a customer escalation · 098",
    goal: "Resolve a customer escalation for scenario 98 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 76,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-099",
    name: "Reconcile a billing anomaly · 099",
    goal: "Reconcile a billing anomaly for scenario 99 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 83,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-100",
    name: "Schedule a field repair · 100",
    goal: "Schedule a field repair for scenario 100 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 8,
    risk: "medium",
    ambiguity: 20,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-101",
    name: "Audit an access request · 101",
    goal: "Audit an access request for scenario 101 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 9,
    risk: "high",
    ambiguity: 27,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-102",
    name: "Research a market entrant · 102",
    goal: "Research a market entrant for scenario 102 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 4,
    risk: "low",
    ambiguity: 34,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-103",
    name: "Prepare a launch brief · 103",
    goal: "Prepare a launch brief for scenario 103 with a verifiable final deliverable.",
    constraint: "use only sources newer than 90 days.",
    disruption: "approval is denied",
    budget: 5,
    risk: "medium",
    ambiguity: 41,
    lesson: "When approval is denied occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-104",
    name: "Resolve a customer escalation · 104",
    goal: "Resolve a customer escalation for scenario 104 with a verifiable final deliverable.",
    constraint: "preserve every intermediate artifact.",
    disruption: "user changes the deadline",
    budget: 6,
    risk: "high",
    ambiguity: 48,
    lesson: "When user changes the deadline occurs, update the plan from observed state instead of repeating the failed action.",
  },
  {
    id: "mission-105",
    name: "Reconcile a billing anomaly · 105",
    goal: "Reconcile a billing anomaly for scenario 105 with a verifiable final deliverable.",
    constraint: "never send externally without approval.",
    disruption: "calendar API rate limit",
    budget: 7,
    risk: "low",
    ambiguity: 55,
    lesson: "When calendar API rate limit occurs, update the plan from observed state instead of repeating the failed action.",
  },
];

const PLAN_STEPS = [
  { id: "understand", title: "Clarify success", tool: "reason", cost: 0, detail: "Extract the deliverable, constraints, and unresolved ambiguity." },
  { id: "search", title: "Gather evidence", tool: "search", cost: 1, detail: "Search approved sources and record provenance." },
  { id: "inspect", title: "Inspect records", tool: "database", cost: 1, detail: "Read structured facts needed to validate the evidence." },
  { id: "draft", title: "Draft artifact", tool: "workspace", cost: 1, detail: "Create a reversible local draft from the observed facts." },
  { id: "verify", title: "Verify constraints", tool: "reason", cost: 0, detail: "Check factual support, privacy, scope, and tool budget." },
  { id: "approve", title: "Request approval", tool: "human", cost: 0, detail: "Pause before the consequential external action." },
  { id: "deliver", title: "Deliver result", tool: "send", cost: 1, detail: "Execute once with an idempotency key and report outcome." },
];
const REPAIRS = {
  "calendar API rate limit": { remove: "deliver", insert: "Schedule retry with backoff", observation: "429 RATE_LIMIT · retry-after 30s" },
  "required document is missing": { remove: "draft", insert: "Ask owner for missing source", observation: "SOURCE_NOT_FOUND · required evidence absent" },
  "user changes the deadline": { remove: "search", insert: "Reprioritize minimum viable evidence", observation: "USER_UPDATE · deadline moved forward" },
  "tool returns contradictory data": { remove: "draft", insert: "Triangulate authoritative source", observation: "CONFLICT · two records disagree" },
  "approval is denied": { remove: "deliver", insert: "Revise to a non-consequential draft", observation: "HUMAN_DENIED · external action blocked" },
  "search result is stale": { remove: "draft", insert: "Filter by recency and re-query", observation: "STALE_SOURCE · revision superseded" },
};

function Icon({ name, size = 18 }) {
  const paths = {
    plan: <><path d="M5 4h14v16H5z" /><path d="m8 9 2 2 4-4M8 15h8" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    bolt: <path d="m13 2-9 12h7l-1 8 9-13h-7Z" />,
    branch: <><path d="M6 3v12a4 4 0 0 0 4 4h8" /><path d="m14 15 4 4-4 4M6 8h6a4 4 0 0 0 4-4V3" /></>,
    shield: <><path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6Z" /><path d="m9 12 2 2 4-5" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function buildPlan(mission, repaired) {
  const repair = REPAIRS[mission.disruption];
  const base = PLAN_STEPS.map((step, index) => ({ ...step, order: index + 1, state: index === 0 ? "done" : index === 1 ? "active" : "queued" }));
  if (!repaired) return base;
  const target = base.findIndex((step) => step.id === repair.remove);
  return [...base.slice(0, target), { id: `repair-${mission.id}`, title: repair.insert, tool: "repair", cost: 1, detail: `Plan patch responding to: ${repair.observation}`, state: "patched", order: target + 1 }, ...base.slice(target + 1)].map((step, index) => ({ ...step, order: index + 1 }));
}

function StepCard({ step, selected, onSelect }) {
  return <button className={`prs-step is-${step.state} ${selected ? "is-selected" : ""}`} onClick={onSelect} aria-pressed={selected}><span className="prs-order">{String(step.order).padStart(2, "0")}</span><span className="prs-step-copy"><strong>{step.title}</strong><small>{step.detail}</small></span><span className="prs-tool">{step.tool}</span><i>{step.cost ? `${step.cost} call` : "internal"}</i></button>;
}

function TraceLine({ type, title, body, active }) {
  return <div className={`prs-trace is-${type} ${active ? "is-active" : ""}`}><span>{type}</span><div><strong>{title}</strong><p>{body}</p></div></div>;
}

export default function PlanRepairStudioLab() {
  const [missionId, setMissionId] = useState("mission-004");
  const [selectedStep, setSelectedStep] = useState("search");
  const [disrupted, setDisrupted] = useState(false);
  const [repaired, setRepaired] = useState(false);
  const [planningMode, setPlanningMode] = useState("adaptive");
  const [budget, setBudget] = useState(7);
  const mission = MISSIONS.find((item) => item.id === missionId) || MISSIONS[0];
  const plan = useMemo(() => buildPlan(mission, repaired), [mission, repaired]);
  const selected = plan.find((step) => step.id === selectedStep) || plan[1];
  const calls = plan.reduce((sum, step) => sum + step.cost, 0) + (planningMode === "reactive" ? 2 : planningMode === "fixed" ? 0 : 1);
  const completion = disrupted && !repaired ? 42 : repaired ? 91 : planningMode === "fixed" ? 72 : 84;
  const risk = disrupted && !repaired ? "blocked" : calls > budget ? "over budget" : repaired ? "recovered" : "ready";
  const inject = () => { setDisrupted(true); setRepaired(false); setSelectedStep(REPAIRS[mission.disruption].remove); };
  const repair = () => { setRepaired(true); setSelectedStep(`repair-${mission.id}`); };
  const reset = (id) => { setMissionId(id); setDisrupted(false); setRepaired(false); setSelectedStep("search"); };

  return <main className="plan-repair-studio">
    <header className="prs-header"><div><span className="prs-overline"><Icon name="plan" size={15} /> Agentic AI · planning workshop</span><h1>Plan Repair Studio</h1><p>Give an agent a goal, disturb the world, and decide whether it should retry, replan, clarify, or stop.</p></div><div className="prs-header-actions"><label><span>Mission</span><select value={missionId} onChange={(event) => reset(event.target.value)}>{MISSIONS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button className="prs-inject" onClick={inject}><Icon name="bolt" size={16} /> Inject disruption</button></div></header>
    <section className="prs-brief"><div><span>Goal</span><strong>{mission.goal}</strong></div><div><span>Constraint</span><strong>{mission.constraint}</strong></div><div><span>Hidden disruption</span><strong>{disrupted ? mission.disruption : "armed · not triggered"}</strong></div></section>
    <section className="prs-mode-row" aria-label="Planning strategy"><button className={planningMode === "fixed" ? "is-active" : ""} onClick={() => setPlanningMode("fixed")}><strong>Plan once</strong><small>Cheap, brittle</small></button><button className={planningMode === "reactive" ? "is-active" : ""} onClick={() => setPlanningMode("reactive")}><strong>Reactive loop</strong><small>Flexible, can wander</small></button><button className={planningMode === "adaptive" ? "is-active" : ""} onClick={() => setPlanningMode("adaptive")}><strong>Plan + repair</strong><small>Structured adaptation</small></button><label><span>Tool-call budget</span><input type="range" min="4" max="12" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /><output>{budget}</output></label></section>
    <div className="prs-layout">
      <section className="prs-board"><header><div><span>Current plan</span><strong>{plan.length} explicit steps · {calls} projected calls</strong></div><span className={`prs-status is-${risk.replace(" ","-")}`}>{risk}</span></header><div className="prs-column-labels"><span>Order</span><span>Intent and success condition</span><span>Executor</span><span>Cost</span></div><div className="prs-steps">{plan.map((step) => <StepCard key={step.id} step={step} selected={selected?.id === step.id} onSelect={() => setSelectedStep(step.id)} />)}</div>{disrupted && !repaired && <button className="prs-repair" onClick={repair}><Icon name="branch" /> Repair from observed state</button>}</section>
      <aside className="prs-inspector"><span className="prs-kicker">Step inspector</span><h2>{selected?.title}</h2><p>{selected?.detail}</p><dl><div><dt>Executor</dt><dd>{selected?.tool}</dd></div><div><dt>Expected cost</dt><dd>{selected?.cost} calls</dd></div><div><dt>State</dt><dd>{selected?.state}</dd></div><div><dt>Reversible</dt><dd>{selected?.tool === "send" ? "No" : "Yes"}</dd></div></dl><div className="prs-guard"><Icon name="shield" /><div><strong>Execution guard</strong><span>{selected?.tool === "send" ? "Require approval + idempotency key" : "Record observation before advancing"}</span></div></div></aside>
      <section className="prs-console"><header><span>Reason · act · observe</span><strong>Live trajectory</strong></header><TraceLine type="thought" title="Reason" body={`Goal parsed with ${mission.ambiguity}% ambiguity; ${mission.constraint}`} active /><TraceLine type="action" title="Action" body="search_approved_sources(query, recency_filter)" active /><TraceLine type="observation" title="Observation" body={disrupted ? REPAIRS[mission.disruption].observation : "3 current sources returned with provenance"} active /><TraceLine type={repaired ? "repair" : "thought"} title={repaired ? "Plan patched" : "Next decision"} body={repaired ? `Inserted “${REPAIRS[mission.disruption].insert}” and removed unsafe continuation.` : disrupted ? "Current plan assumptions are invalid. Repeating the action will not satisfy the goal." : "Evidence sufficient; advance to structured inspection."} active /><footer><span>Loop cap <b>{budget}</b></span><span>Projected success <b>{completion}%</b></span></footer></section>
    </div>
    <section className="prs-lessons"><article><b>01</b><div><h3>Plans are hypotheses</h3><p>A plan encodes assumptions about tools and the world. Observations decide whether those assumptions still hold.</p></div></article><article><b>02</b><div><h3>Repair locally</h3><p>Preserve completed work, replace the invalid step, and keep the original goal and constraints visible.</p></div></article><article><b>03</b><div><h3>Bound autonomy</h3><p>Budgets, approval gates, and stop conditions keep adaptive behavior legible and safe.</p></div></article></section>
    <style>{`
:root {
  color-scheme: light;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #f2ede3;
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
.plan-repair-studio {
  --ink: #24211d;
  --muted: #726a5d;
  --paper: #fbf7ef;
  --line: #d8ccba;
  --orange: #d9552d;
  --blue: #315c75;
  --green: #39745d;
  min-height: 100vh;
  padding: 32px clamp(16px,4vw,58px) 52px;
  color: var(--ink);
  background:
    radial-gradient(circle at 85% 3%, rgba(217,85,45,.1), transparent 24%),
    #f2ede3;
  font-family: "Avenir Next", Avenir, Inter, ui-sans-serif, system-ui, sans-serif;
}
.prs-header {
  max-width: 1450px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 28px;
}
.prs-overline {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--orange);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.prs-header h1 {
  margin: 9px 0 5px;
  font-family: "Arial Black", Impact, sans-serif;
  font-size: clamp(36px,5.6vw,78px);
  letter-spacing: -.055em;
  line-height: .9;
  text-transform: uppercase;
}
.prs-header p {
  margin: 12px 0 0;
  max-width: 680px;
  color: var(--muted);
  font-size: 15px;
}
.prs-header-actions {
  min-width: min(100%,420px);
  display: grid;
  grid-template-columns: minmax(190px,1fr) auto;
  gap: 9px;
  align-items: end;
}
.prs-header-actions label > span {
  display: block;
  margin-bottom: 5px;
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}
.prs-header select {
  width: 100%;
  min-height: 45px;
  border: 1px solid #bcae98;
  border-radius: 4px;
  background: var(--paper);
  padding: 9px;
  color: var(--ink);
}
.prs-inject {
  min-height: 45px;
  border: 0;
  border-radius: 4px;
  background: var(--orange);
  color: white;
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 800;
}
.prs-brief {
  max-width: 1450px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: 1.2fr 1fr .8fr;
  border-top: 4px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  background: var(--paper);
}
.prs-brief > div {
  padding: 13px 15px;
}
.prs-brief > div + div {
  border-left: 1px solid var(--line);
}
.prs-brief span {
  display: block;
  color: var(--orange);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
}
.prs-brief strong {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.45;
}
.prs-mode-row {
  max-width: 1450px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: repeat(3,1fr) minmax(230px,.8fr);
  gap: 7px;
}
.prs-mode-row > button,
.prs-mode-row > label {
  min-height: 58px;
  border: 1px solid var(--line);
  background: rgba(251,247,239,.72);
  padding: 10px 13px;
}
.prs-mode-row > button {
  text-align: left;
  color: var(--muted);
}
.prs-mode-row > button.is-active {
  color: var(--ink);
  border-color: var(--ink);
  box-shadow: inset 0 -3px var(--orange);
  background: var(--paper);
}
.prs-mode-row strong,
.prs-mode-row small {
  display: block;
}
.prs-mode-row strong {
  font-size: 12px;
}
.prs-mode-row small {
  margin-top: 3px;
  font-size: 9px;
}
.prs-mode-row label {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  color: var(--muted);
  font-size: 9px;
  text-transform: uppercase;
}
.prs-mode-row input {
  width: 100%;
  accent-color: var(--orange);
}
.prs-mode-row output {
  color: var(--ink);
  font: 800 15px ui-monospace, monospace;
}
.prs-layout {
  max-width: 1450px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0,1.35fr) minmax(230px,.55fr) minmax(270px,.7fr);
  gap: 10px;
  align-items: start;
}
.prs-board,
.prs-inspector,
.prs-console {
  border: 1px solid #cfc2af;
  background: var(--paper);
  min-width: 0;
}
.prs-board > header,
.prs-console > header {
  min-height: 59px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.prs-board header span,
.prs-board header strong,
.prs-console header span,
.prs-console header strong {
  display: block;
}
.prs-board header span,
.prs-console header span {
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .09em;
}
.prs-board header strong,
.prs-console header strong {
  margin-top: 4px;
  font-size: 12px;
}
.prs-status {
  border: 1px solid currentColor;
  padding: 5px 7px;
  color: var(--blue) !important;
  font: 800 9px ui-monospace, monospace;
}
.prs-status.is-blocked,
.prs-status.is-over-budget {
  color: #b63d2c !important;
}
.prs-status.is-recovered {
  color: var(--green) !important;
}
.prs-column-labels,
.prs-step {
  display: grid;
  grid-template-columns: 40px minmax(0,1fr) 72px 48px;
  gap: 8px;
  align-items: center;
}
.prs-column-labels {
  padding: 8px 11px;
  border-bottom: 1px solid var(--line);
  color: #8a8174;
  background: #eee7da;
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
}
.prs-step {
  width: 100%;
  min-height: 62px;
  padding: 10px 11px;
  border: 0;
  border-bottom: 1px solid #ddd2c1;
  background: transparent;
  color: var(--ink);
  text-align: left;
  transition: background .18s ease, box-shadow .18s ease;
}
.prs-step:hover {
  background: #fffdf8;
}
.prs-step.is-selected {
  background: #fff8e8;
  box-shadow: inset 4px 0 var(--orange);
}
.prs-step.is-patched {
  background: #eaf4ef;
}
.prs-order {
  color: #8a8174;
  font: 800 11px ui-monospace, monospace;
}
.prs-step-copy {
  min-width: 0;
}
.prs-step-copy strong,
.prs-step-copy small {
  display: block;
}
.prs-step-copy strong {
  font-size: 11px;
}
.prs-step-copy small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.prs-tool {
  justify-self: start;
  border: 1px solid #cfc2af;
  padding: 4px 6px;
  color: var(--blue);
  font: 800 8px ui-monospace, monospace;
}
.prs-step > i {
  color: var(--muted);
  font-size: 8px;
  font-style: normal;
}
.prs-repair {
  width: calc(100% - 20px);
  min-height: 44px;
  margin: 10px;
  border: 0;
  background: var(--ink);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 800;
}
.prs-inspector {
  padding: 16px;
}
.prs-kicker {
  color: var(--orange);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .1em;
}
.prs-inspector h2 {
  margin: 9px 0 7px;
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 500;
}
.prs-inspector > p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.6;
}
.prs-inspector dl {
  margin: 17px 0;
}
.prs-inspector dl div {
  padding: 8px 0;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.prs-inspector dt {
  color: var(--muted);
  font-size: 9px;
}
.prs-inspector dd {
  margin: 0;
  font: 800 9px ui-monospace, monospace;
  text-align: right;
}
.prs-guard {
  border-top: 3px solid var(--blue);
  background: #e8eef0;
  padding: 11px;
  display: flex;
  gap: 8px;
  color: var(--blue);
}
.prs-guard strong,
.prs-guard span {
  display: block;
}
.prs-guard strong {
  font-size: 10px;
}
.prs-guard span {
  margin-top: 3px;
  color: #586d76;
  font-size: 8px;
  line-height: 1.4;
}
.prs-console {
  background: #252521;
  color: #f1ede3;
}
.prs-console > header {
  border-color: #46463f;
}
.prs-console header span {
  color: #d97b58;
}
.prs-trace {
  position: relative;
  padding: 13px 12px 13px 44px;
  border-bottom: 1px solid #41413b;
  opacity: .55;
}
.prs-trace.is-active {
  opacity: 1;
}
.prs-trace > span {
  position: absolute;
  left: 10px;
  top: 13px;
  width: 25px;
  color: #df9275;
  font: 800 7px ui-monospace, monospace;
  text-transform: uppercase;
}
.prs-trace strong {
  font-size: 10px;
}
.prs-trace p {
  margin: 4px 0 0;
  color: #bdb8ad;
  font: 9px/1.55 ui-monospace, monospace;
}
.prs-trace.is-observation {
  background: #2d302e;
}
.prs-trace.is-repair {
  background: #26362e;
}
.prs-trace.is-repair > span {
  color: #75c398;
}
.prs-console footer {
  padding: 11px 13px;
  display: flex;
  justify-content: space-between;
  color: #aaa59a;
  font-size: 8px;
  text-transform: uppercase;
}
.prs-console footer b {
  color: white;
}
.prs-lessons {
  max-width: 1450px;
  margin: 10px auto 0;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 10px;
}
.prs-lessons article {
  border-top: 2px solid var(--ink);
  background: rgba(251,247,239,.65);
  padding: 13px;
  display: flex;
  gap: 11px;
}
.prs-lessons b {
  color: var(--orange);
  font: 800 10px ui-monospace, monospace;
}
.prs-lessons h3 {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
}
.prs-lessons p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid #315c75;
  outline-offset: 3px;
}
@media (max-width: 1040px) {
  .prs-layout {
    grid-template-columns: minmax(0,1fr) 280px;
  }
  .prs-console {
    grid-column: 1 / -1;
  }
}
@media (max-width: 760px) {
  .plan-repair-studio {
    padding: 22px 11px 36px;
  }
  .prs-header {
    align-items: start;
    flex-direction: column;
  }
  .prs-header-actions {
    min-width: 100%;
    grid-template-columns: 1fr;
  }
  .prs-brief,
  .prs-mode-row,
  .prs-layout,
  .prs-lessons {
    grid-template-columns: 1fr;
  }
  .prs-brief > div + div {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .prs-console {
    grid-column: auto;
  }
  .prs-column-labels {
    display: none;
  }
  .prs-step {
    grid-template-columns: 32px 1fr 60px;
  }
  .prs-step > i {
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

