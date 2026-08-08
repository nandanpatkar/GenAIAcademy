import React, { useMemo, useState } from "react";

/* Semantic Space Cartographer — deterministic sentence embedding and STS lab. */

const PAIR_CASES = [
  {
    id: "pair-001",
    title: "Paraphrase · 001",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.90,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 2,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-002",
    title: "Negation trap · 002",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.75,
    label: "Negation trap",
    domain: "legal",
    difficulty: 3,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-003",
    title: "Topic neighbor · 003",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.70,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 4,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-004",
    title: "Polysemy · 004",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.57,
    label: "Polysemy",
    domain: "support",
    difficulty: 5,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-005",
    title: "Cross-lingual · 005",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.81,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 1,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-006",
    title: "Hard negative · 006",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.63,
    label: "Hard negative",
    domain: "legal",
    difficulty: 2,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-007",
    title: "Paraphrase · 007",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.91,
    label: "Paraphrase",
    domain: "general",
    difficulty: 3,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-008",
    title: "Negation trap · 008",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.76,
    label: "Negation trap",
    domain: "support",
    difficulty: 4,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-009",
    title: "Topic neighbor · 009",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.71,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 5,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-010",
    title: "Polysemy · 010",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.58,
    label: "Polysemy",
    domain: "legal",
    difficulty: 1,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-011",
    title: "Cross-lingual · 011",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.82,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 2,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-012",
    title: "Hard negative · 012",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.64,
    label: "Hard negative",
    domain: "support",
    difficulty: 3,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-013",
    title: "Paraphrase · 013",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.85,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 4,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-014",
    title: "Negation trap · 014",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.77,
    label: "Negation trap",
    domain: "legal",
    difficulty: 5,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-015",
    title: "Topic neighbor · 015",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.72,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 1,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-016",
    title: "Polysemy · 016",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.59,
    label: "Polysemy",
    domain: "support",
    difficulty: 2,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-017",
    title: "Cross-lingual · 017",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.83,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 3,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-018",
    title: "Hard negative · 018",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.65,
    label: "Hard negative",
    domain: "legal",
    difficulty: 4,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-019",
    title: "Paraphrase · 019",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.86,
    label: "Paraphrase",
    domain: "general",
    difficulty: 5,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-020",
    title: "Negation trap · 020",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.71,
    label: "Negation trap",
    domain: "support",
    difficulty: 1,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-021",
    title: "Topic neighbor · 021",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.73,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 2,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-022",
    title: "Polysemy · 022",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.60,
    label: "Polysemy",
    domain: "legal",
    difficulty: 3,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-023",
    title: "Cross-lingual · 023",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.84,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 4,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-024",
    title: "Hard negative · 024",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.66,
    label: "Hard negative",
    domain: "support",
    difficulty: 5,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-025",
    title: "Paraphrase · 025",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.87,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 1,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-026",
    title: "Negation trap · 026",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.72,
    label: "Negation trap",
    domain: "legal",
    difficulty: 2,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-027",
    title: "Topic neighbor · 027",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.67,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 3,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-028",
    title: "Polysemy · 028",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.61,
    label: "Polysemy",
    domain: "support",
    difficulty: 4,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-029",
    title: "Cross-lingual · 029",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.85,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 5,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-030",
    title: "Hard negative · 030",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.67,
    label: "Hard negative",
    domain: "legal",
    difficulty: 1,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-031",
    title: "Paraphrase · 031",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.88,
    label: "Paraphrase",
    domain: "general",
    difficulty: 2,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-032",
    title: "Negation trap · 032",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.73,
    label: "Negation trap",
    domain: "support",
    difficulty: 3,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-033",
    title: "Topic neighbor · 033",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.68,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 4,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-034",
    title: "Polysemy · 034",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.55,
    label: "Polysemy",
    domain: "legal",
    difficulty: 5,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-035",
    title: "Cross-lingual · 035",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.86,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 1,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-036",
    title: "Hard negative · 036",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.68,
    label: "Hard negative",
    domain: "support",
    difficulty: 2,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-037",
    title: "Paraphrase · 037",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.89,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 3,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-038",
    title: "Negation trap · 038",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.74,
    label: "Negation trap",
    domain: "legal",
    difficulty: 4,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-039",
    title: "Topic neighbor · 039",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.69,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 5,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-040",
    title: "Polysemy · 040",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.56,
    label: "Polysemy",
    domain: "support",
    difficulty: 1,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-041",
    title: "Cross-lingual · 041",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.80,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 2,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-042",
    title: "Hard negative · 042",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.69,
    label: "Hard negative",
    domain: "legal",
    difficulty: 3,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-043",
    title: "Paraphrase · 043",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.90,
    label: "Paraphrase",
    domain: "general",
    difficulty: 4,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-044",
    title: "Negation trap · 044",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.75,
    label: "Negation trap",
    domain: "support",
    difficulty: 5,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-045",
    title: "Topic neighbor · 045",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.70,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 1,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-046",
    title: "Polysemy · 046",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.57,
    label: "Polysemy",
    domain: "legal",
    difficulty: 2,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-047",
    title: "Cross-lingual · 047",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.81,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 3,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-048",
    title: "Hard negative · 048",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.63,
    label: "Hard negative",
    domain: "support",
    difficulty: 4,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-049",
    title: "Paraphrase · 049",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.91,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 5,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-050",
    title: "Negation trap · 050",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.76,
    label: "Negation trap",
    domain: "legal",
    difficulty: 1,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-051",
    title: "Topic neighbor · 051",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.71,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 2,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-052",
    title: "Polysemy · 052",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.58,
    label: "Polysemy",
    domain: "support",
    difficulty: 3,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-053",
    title: "Cross-lingual · 053",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.82,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 4,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-054",
    title: "Hard negative · 054",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.64,
    label: "Hard negative",
    domain: "legal",
    difficulty: 5,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-055",
    title: "Paraphrase · 055",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.85,
    label: "Paraphrase",
    domain: "general",
    difficulty: 1,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-056",
    title: "Negation trap · 056",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.77,
    label: "Negation trap",
    domain: "support",
    difficulty: 2,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-057",
    title: "Topic neighbor · 057",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.72,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 3,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-058",
    title: "Polysemy · 058",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.59,
    label: "Polysemy",
    domain: "legal",
    difficulty: 4,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-059",
    title: "Cross-lingual · 059",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.83,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 5,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-060",
    title: "Hard negative · 060",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.65,
    label: "Hard negative",
    domain: "support",
    difficulty: 1,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-061",
    title: "Paraphrase · 061",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.86,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 2,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-062",
    title: "Negation trap · 062",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.71,
    label: "Negation trap",
    domain: "legal",
    difficulty: 3,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-063",
    title: "Topic neighbor · 063",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.73,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 4,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-064",
    title: "Polysemy · 064",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.60,
    label: "Polysemy",
    domain: "support",
    difficulty: 5,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-065",
    title: "Cross-lingual · 065",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.84,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 1,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-066",
    title: "Hard negative · 066",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.66,
    label: "Hard negative",
    domain: "legal",
    difficulty: 2,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-067",
    title: "Paraphrase · 067",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.87,
    label: "Paraphrase",
    domain: "general",
    difficulty: 3,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-068",
    title: "Negation trap · 068",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.72,
    label: "Negation trap",
    domain: "support",
    difficulty: 4,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-069",
    title: "Topic neighbor · 069",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.67,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 5,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-070",
    title: "Polysemy · 070",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.61,
    label: "Polysemy",
    domain: "legal",
    difficulty: 1,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-071",
    title: "Cross-lingual · 071",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.85,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 2,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-072",
    title: "Hard negative · 072",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.67,
    label: "Hard negative",
    domain: "support",
    difficulty: 3,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-073",
    title: "Paraphrase · 073",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.88,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 4,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-074",
    title: "Negation trap · 074",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.73,
    label: "Negation trap",
    domain: "legal",
    difficulty: 5,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-075",
    title: "Topic neighbor · 075",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.68,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 1,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-076",
    title: "Polysemy · 076",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.55,
    label: "Polysemy",
    domain: "support",
    difficulty: 2,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-077",
    title: "Cross-lingual · 077",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.86,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 3,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-078",
    title: "Hard negative · 078",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.68,
    label: "Hard negative",
    domain: "legal",
    difficulty: 4,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-079",
    title: "Paraphrase · 079",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.89,
    label: "Paraphrase",
    domain: "general",
    difficulty: 5,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-080",
    title: "Negation trap · 080",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.74,
    label: "Negation trap",
    domain: "support",
    difficulty: 1,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-081",
    title: "Topic neighbor · 081",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.69,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 2,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-082",
    title: "Polysemy · 082",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.56,
    label: "Polysemy",
    domain: "legal",
    difficulty: 3,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-083",
    title: "Cross-lingual · 083",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.80,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 4,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-084",
    title: "Hard negative · 084",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.69,
    label: "Hard negative",
    domain: "support",
    difficulty: 5,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-085",
    title: "Paraphrase · 085",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.90,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 1,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-086",
    title: "Negation trap · 086",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.75,
    label: "Negation trap",
    domain: "legal",
    difficulty: 2,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-087",
    title: "Topic neighbor · 087",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.70,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 3,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-088",
    title: "Polysemy · 088",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.57,
    label: "Polysemy",
    domain: "support",
    difficulty: 4,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-089",
    title: "Cross-lingual · 089",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.81,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 5,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-090",
    title: "Hard negative · 090",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.63,
    label: "Hard negative",
    domain: "legal",
    difficulty: 1,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-091",
    title: "Paraphrase · 091",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.91,
    label: "Paraphrase",
    domain: "general",
    difficulty: 2,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-092",
    title: "Negation trap · 092",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.76,
    label: "Negation trap",
    domain: "support",
    difficulty: 3,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-093",
    title: "Topic neighbor · 093",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.71,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 4,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-094",
    title: "Polysemy · 094",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.58,
    label: "Polysemy",
    domain: "legal",
    difficulty: 5,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-095",
    title: "Cross-lingual · 095",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.82,
    label: "Cross-lingual",
    domain: "general",
    difficulty: 1,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-096",
    title: "Hard negative · 096",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.64,
    label: "Hard negative",
    domain: "support",
    difficulty: 2,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-097",
    title: "Paraphrase · 097",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.85,
    label: "Paraphrase",
    domain: "commerce",
    difficulty: 3,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-098",
    title: "Negation trap · 098",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.77,
    label: "Negation trap",
    domain: "legal",
    difficulty: 4,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-099",
    title: "Topic neighbor · 099",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.72,
    label: "Topic neighbor",
    domain: "general",
    difficulty: 5,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-100",
    title: "Polysemy · 100",
    anchor: "The crane stood beside the river.",
    candidate: "The crane lifted the steel beam.",
    base: 0.59,
    label: "Polysemy",
    domain: "support",
    difficulty: 1,
    issue: "the same word has different senses",
    lesson: "Similarity is not entailment: the same word has different senses. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-101",
    title: "Cross-lingual · 101",
    anchor: "The meeting starts tomorrow.",
    candidate: "La reunión comienza mañana.",
    base: 0.83,
    label: "Cross-lingual",
    domain: "commerce",
    difficulty: 2,
    issue: "translation pairs should share a neighborhood",
    lesson: "Similarity is not entailment: translation pairs should share a neighborhood. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-102",
    title: "Hard negative · 102",
    anchor: "Reset the customer password.",
    candidate: "Delete the customer account.",
    base: 0.65,
    label: "Hard negative",
    domain: "legal",
    difficulty: 3,
    issue: "shared context masks a dangerous intent change",
    lesson: "Similarity is not entailment: shared context masks a dangerous intent change. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-103",
    title: "Paraphrase · 103",
    anchor: "The package arrived ahead of schedule.",
    candidate: "Delivery was earlier than expected.",
    base: 0.86,
    label: "Paraphrase",
    domain: "general",
    difficulty: 4,
    issue: "same meaning, different wording",
    lesson: "Similarity is not entailment: same meaning, different wording. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-104",
    title: "Negation trap · 104",
    anchor: "The account is active.",
    candidate: "The account is not active.",
    base: 0.71,
    label: "Negation trap",
    domain: "support",
    difficulty: 5,
    issue: "lexical overlap hides contradiction",
    lesson: "Similarity is not entailment: lexical overlap hides contradiction. Inspect hard negatives before choosing a threshold.",
  },
  {
    id: "pair-105",
    title: "Topic neighbor · 105",
    anchor: "The team launched a new payment API.",
    candidate: "The company released a billing SDK.",
    base: 0.73,
    label: "Topic neighbor",
    domain: "commerce",
    difficulty: 1,
    issue: "related topic but not equivalent",
    lesson: "Similarity is not entailment: related topic but not equivalent. Inspect hard negatives before choosing a threshold.",
  },
];

const MAP_POINTS = [
  { id: "anchor", label: "Anchor", x: 50, y: 48, kind: "anchor", seed: 3 },
  { id: "para", label: "Paraphrase", x: 61, y: 42, kind: "positive", seed: 4 },
  { id: "translation", label: "Translation", x: 44, y: 36, kind: "positive", seed: 5 },
  { id: "topic", label: "Topic neighbor", x: 69, y: 58, kind: "near", seed: 6 },
  { id: "negative", label: "Hard negative", x: 57, y: 68, kind: "danger", seed: 7 },
  { id: "contradiction", label: "Contradiction", x: 37, y: 66, kind: "danger", seed: 8 },
  { id: "unrelated", label: "Unrelated", x: 18, y: 28, kind: "far", seed: 9 },
  { id: "polysemy", label: "Other word sense", x: 78, y: 25, kind: "near", seed: 10 },
  { id: "duplicate", label: "Near duplicate", x: 52, y: 28, kind: "positive", seed: 11 },
  { id: "noise", label: "Lexical noise", x: 24, y: 76, kind: "far", seed: 12 },
  { id: "short", label: "Short query", x: 83, y: 74, kind: "near", seed: 13 },
  { id: "domain", label: "Domain phrase", x: 31, y: 44, kind: "positive", seed: 14 },
];
const MODELS = {
  general: { label: "General STS", shiftX: 0, shiftY: 0, quality: 84, speed: 6200 },
  retrieval: { label: "Asymmetric retrieval", shiftX: 5, shiftY: -3, quality: 88, speed: 5100 },
  multilingual: { label: "Multilingual", shiftX: -4, shiftY: 4, quality: 81, speed: 4200 },
  domain: { label: "Domain-tuned", shiftX: 2, shiftY: 6, quality: 91, speed: 3800 },
};

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function cosineFor(item, model, normalize, pooling) { const modelBoost=model==="domain"&&item.domain!=="general"?.07:model==="multilingual"&&item.label==="Cross-lingual"?.09:0; const poolPenalty=pooling==="cls"?.05:pooling==="max"?.03:0; return clamp(item.base+modelBoost-poolPenalty+(normalize?.02:-.04),.18,.98); }

function Icon({ name, size = 18 }) {
  const paths = {
    map: <><circle cx="6" cy="7" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="15" cy="18" r="2" /><path d="m8 7 8-1M7 9l7 7M17 8l-2 8" /></>,
    vector: <><path d="M4 19 19 4" /><path d="M11 4h8v8" /><path d="M4 4v15h15" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></>,
    alert: <><path d="M12 3 2.5 20h19Z" /><path d="M12 9v4M12 17h.01" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function SpaceMap({ model, threshold, selected, onSelect }) { const cfg=MODELS[model]; return <div className="ssc-map" role="img" aria-label="Two-dimensional projection of sentence embeddings"><svg viewBox="0 0 100 100">{[20,40,60,80].map(n=><g key={n}><line x1={n} y1="0" x2={n} y2="100" /><line x1="0" y1={n} x2="100" y2={n} /></g>)}<circle className="ssc-threshold-ring" cx="50" cy="48" r={clamp(38-threshold/3,9,26)} />{MAP_POINTS.map(point=>{const x=clamp(point.x+(point.id==="anchor"?0:cfg.shiftX*((point.seed%3)-1)),6,94);const y=clamp(point.y+(point.id==="anchor"?0:cfg.shiftY*((point.seed%2)?.7:-.7)),6,94);return <g key={point.id} className={`ssc-point is-${point.kind} ${selected===point.id?"is-selected":""}`} transform={`translate(${x} ${y})`} role="button" tabIndex="0" onClick={()=>onSelect(point.id)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" ")onSelect(point.id);}} aria-label={`Inspect ${point.label}`}><circle r={point.id==="anchor"?5:3.6} /><text y="7">{point.label}</text></g>;})}</svg><div className="ssc-axis x">semantic dimension 1 →</div><div className="ssc-axis y">semantic dimension 2 →</div></div>; }

export default function SemanticSpaceCartographerLab() {
  const [caseId,setCaseId]=useState("pair-006");
  const [model,setModel]=useState("general");
  const [threshold,setThreshold]=useState(72);
  const [normalize,setNormalize]=useState(true);
  const [pooling,setPooling]=useState("mean");
  const [selected,setSelected]=useState("negative");
  const item=PAIR_CASES.find(entry=>entry.id===caseId)||PAIR_CASES[0];
  const similarity=useMemo(()=>cosineFor(item,model,normalize,pooling),[item,model,normalize,pooling]);
  const cfg=MODELS[model];
  const point=MAP_POINTS.find(entry=>entry.id===selected)||MAP_POINTS[0];
  const accepted=similarity*100>=threshold;
  const margin=Math.round(similarity*100-threshold);
  return <main className="semantic-cartographer">
    <header className="ssc-header"><div><span className="ssc-kicker"><Icon name="map" size={15} /> NLP embeddings · semantic similarity</span><h1>Semantic Space<br /><i>Cartographer</i></h1><p>Map sentences into vectors, compare neighborhoods, and challenge cosine similarity with contradictions and hard negatives.</p></div><label><span>Sentence pair</span><select value={caseId} onChange={event=>setCaseId(event.target.value)}>{PAIR_CASES.map(entry=><option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label></header>
    <section className="ssc-pair"><article><span>Anchor A</span><p>{item.anchor}</p></article><div><Icon name="vector" /><strong>{similarity.toFixed(3)}</strong><span>cosine</span></div><article><span>Candidate B</span><p>{item.candidate}</p></article></section>
    <div className="ssc-layout">
      <aside className="ssc-controls"><header><span>Embedding recipe</span><strong>Representation controls</strong></header><label><span>Encoder model</span><select value={model} onChange={event=>setModel(event.target.value)}>{Object.entries(MODELS).map(([id,value])=><option key={id} value={id}>{value.label}</option>)}</select></label><div className="ssc-pooling"><span>Pooling</span>{["mean","cls","max"].map(name=><button key={name} className={pooling===name?"is-active":""} onClick={()=>setPooling(name)}>{name}</button>)}</div><button className={`ssc-toggle ${normalize?"is-on":""}`} onClick={()=>setNormalize(v=>!v)} aria-pressed={normalize}><span><strong>L2 normalize</strong><small>unit-length vectors</small></span><i>{normalize?"ON":"OFF"}</i></button><label className="ssc-range"><span>Match threshold <output>{threshold/100}</output></span><input type="range" min="40" max="95" value={threshold} onChange={event=>setThreshold(Number(event.target.value))} /></label><div className="ssc-formula"><span>Cosine similarity</span><code>cos(A,B) = A·B / ‖A‖‖B‖</code></div></aside>
      <section className="ssc-space"><header><div><span>Projected embedding space</span><strong>12 sentence vectors · illustrative 2D projection</strong></div><div className="ssc-legend"><span><i className="positive" />similar</span><span><i className="danger" />hard negative</span><span><i className="far" />distant</span></div></header><SpaceMap model={model} threshold={threshold} selected={selected} onSelect={setSelected} /></section>
      <aside className="ssc-inspector"><span className="ssc-kicker">Vector inspector</span><h2>{point.label}</h2><p>{point.kind==="danger"?"Close in vector space, but unsafe to treat as equivalent.":point.kind==="positive"?"A semantically aligned neighbor of the anchor.":"Related distance depends on the encoder training objective."}</p><div className="ssc-vector">{Array.from({length:12},(_,index)=>{const value=Math.sin((point.seed+index)*1.7)*.8;return <i key={index} style={{height:`${Math.abs(value)*46+5}px`}} className={value>0?"pos":"neg"} />;})}</div><dl><div><dt>Vector dimension</dt><dd>384</dd></div><div><dt>Neighborhood</dt><dd>{point.kind}</dd></div><div><dt>Model throughput</dt><dd>{cfg.speed}/s</dd></div><div><dt>Quality index</dt><dd>{cfg.quality}</dd></div></dl></aside>
    </div>
    <section className={`ssc-verdict ${accepted?"accept":"reject"}`}><Icon name={accepted?"target":"alert"} /><div><span>{accepted?"Pair accepted":"Pair rejected"} · margin {margin>0?"+":""}{margin} points</span><strong>{accepted&&item.label==="Hard negative"?"Warning: high similarity does not prove equivalent intent.":item.lesson}</strong></div><b>{Math.round(similarity*100)} / {threshold}</b></section>
    <section className="ssc-principles"><article><b>Similarity ≠ entailment</b><p>Contradictions can share almost every word. Add task-specific checks for meaning direction and safety.</p></article><article><b>Train for the task</b><p>Symmetric STS, query-document retrieval, clustering, and classification need different objectives.</p></article><article><b>Mine hard negatives</b><p>Near-miss examples teach the embedding space which distinctions matter in your domain.</p></article></section>
    <style>{`
:root {
  color-scheme: dark;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #11100f;
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
.semantic-cartographer {
  --ink: #f5f0e7;
  --muted: #a69f93;
  --line: #3c3934;
  --panel: #1a1917;
  --coral: #ff8066;
  --mint: #73d6ae;
  --blue: #70aef5;
  min-height: 100vh;
  padding: 30px clamp(15px,4vw,58px) 50px;
  color: var(--ink);
  background:
    radial-gradient(circle at 82% 2%, rgba(255,128,102,.13), transparent 25%),
    #11100f;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.ssc-header {
  max-width: 1460px;
  margin: 0 auto 18px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 22px;
}
.ssc-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--coral);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.ssc-header h1 {
  margin: 8px 0 7px;
  font-family: Georgia, serif;
  font-size: clamp(38px,5.6vw,76px);
  font-weight: 500;
  line-height: .88;
  letter-spacing: -.055em;
}
.ssc-header h1 i {
  color: var(--coral);
  font-weight: 400;
}
.ssc-header p {
  margin: 0;
  max-width: 720px;
  color: var(--muted);
  font-size: 14px;
}
.ssc-header label {
  min-width: min(100%,350px);
}
.ssc-header label > span {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ssc-header select,
.ssc-controls select {
  width: 100%;
  min-height: 44px;
  padding: 9px;
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--panel);
}
.ssc-pair {
  max-width: 1460px;
  margin: 0 auto 11px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  border: 1px solid var(--line);
  background: var(--panel);
}
.ssc-pair article {
  padding: 14px 17px;
}
.ssc-pair article > span {
  color: var(--coral);
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
}
.ssc-pair article p {
  margin: 7px 0 0;
  font-family: Georgia, serif;
  font-size: clamp(16px,1.7vw,23px);
}
.ssc-pair > div {
  min-width: 108px;
  border-left: 1px solid var(--line);
  border-right: 1px solid var(--line);
  display: grid;
  place-content: center;
  justify-items: center;
}
.ssc-pair > div svg {
  color: var(--coral);
}
.ssc-pair > div strong {
  margin-top: 3px;
  font-size: 22px;
}
.ssc-pair > div span {
  color: var(--muted);
  font-size: 7px;
  text-transform: uppercase;
}
.ssc-layout {
  max-width: 1460px;
  margin: 0 auto 11px;
  display: grid;
  grid-template-columns: 250px minmax(0,1fr) 250px;
  gap: 11px;
  align-items: start;
}
.ssc-controls,
.ssc-space,
.ssc-inspector {
  min-width: 0;
  border: 1px solid var(--line);
  background: rgba(26,25,23,.96);
}
.ssc-controls > header,
.ssc-space > header {
  min-height: 58px;
  padding: 11px 13px;
  border-bottom: 1px solid var(--line);
}
.ssc-controls header span,
.ssc-controls header strong,
.ssc-space header span,
.ssc-space header strong {
  display: block;
}
.ssc-controls header span,
.ssc-space header span {
  color: var(--muted);
  font-size: 7px;
  text-transform: uppercase;
}
.ssc-controls header strong,
.ssc-space header strong {
  margin-top: 4px;
  font-size: 10px;
}
.ssc-controls > label {
  display: block;
  padding: 13px;
  border-bottom: 1px solid var(--line);
}
.ssc-controls label > span,
.ssc-pooling > span {
  display: block;
  margin-bottom: 7px;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ssc-pooling {
  padding: 13px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 4px;
  border-bottom: 1px solid var(--line);
}
.ssc-pooling > span {
  grid-column: 1 / -1;
}
.ssc-pooling button {
  min-height: 38px;
  border: 1px solid var(--line);
  color: var(--muted);
  background: #121210;
  font-size: 8px;
}
.ssc-pooling button.is-active {
  color: #161411;
  border-color: var(--coral);
  background: var(--coral);
  font-weight: 800;
}
.ssc-toggle {
  width: calc(100% - 26px);
  min-height: 52px;
  margin: 13px;
  padding: 9px;
  border: 1px solid var(--line);
  background: #121210;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  text-align: left;
}
.ssc-toggle.is-on {
  color: var(--ink);
  border-color: var(--mint);
  background: #15271f;
}
.ssc-toggle strong,
.ssc-toggle small {
  display: block;
}
.ssc-toggle strong {
  font-size: 9px;
}
.ssc-toggle small {
  margin-top: 3px;
  font-size: 7px;
}
.ssc-toggle i {
  align-self: center;
  color: var(--mint);
  font-size: 7px;
  font-style: normal;
}
.ssc-range output {
  float: right;
  color: var(--coral);
  font-weight: 800;
}
.ssc-range input {
  width: 100%;
  accent-color: var(--coral);
}
.ssc-formula {
  margin: 13px;
  padding: 11px;
  border-top: 2px solid var(--blue);
  background: #12161c;
}
.ssc-formula span {
  display: block;
  color: var(--blue);
  font-size: 7px;
  text-transform: uppercase;
}
.ssc-formula code {
  display: block;
  margin-top: 7px;
  color: #c9d9eb;
  font-size: 8px;
  overflow-wrap: anywhere;
}
.ssc-space > header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ssc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.ssc-legend span {
  display: flex !important;
  align-items: center;
  gap: 4px;
  color: var(--muted);
  font-size: 7px !important;
}
.ssc-legend i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.ssc-legend i.positive { background: var(--mint); }
.ssc-legend i.danger { background: var(--coral); }
.ssc-legend i.far { background: #706a61; }
.ssc-map {
  position: relative;
  min-height: 510px;
  background: #121210;
}
.ssc-map svg {
  width: 100%;
  height: 510px;
  overflow: visible;
}
.ssc-map line {
  stroke: #292723;
  stroke-width: .2;
}
.ssc-threshold-ring {
  fill: rgba(255,128,102,.035);
  stroke: var(--coral);
  stroke-width: .35;
  stroke-dasharray: 2 1.5;
}
.ssc-point {
  cursor: pointer;
}
.ssc-point circle {
  fill: #777168;
  stroke: #121210;
  stroke-width: 1;
  transition: r .18s ease, stroke .18s ease;
}
.ssc-point.is-anchor circle {
  fill: var(--blue);
}
.ssc-point.is-positive circle {
  fill: var(--mint);
}
.ssc-point.is-danger circle {
  fill: var(--coral);
}
.ssc-point.is-far {
  opacity: .45;
}
.ssc-point.is-selected circle {
  stroke: white;
  stroke-width: .8;
}
.ssc-point text {
  fill: #c7c1b8;
  font-size: 1.8px;
  text-anchor: middle;
  paint-order: stroke;
  stroke: #121210;
  stroke-width: .5px;
}
.ssc-axis {
  position: absolute;
  color: #5e5952;
  font-size: 7px;
  text-transform: uppercase;
}
.ssc-axis.x {
  right: 10px;
  bottom: 8px;
}
.ssc-axis.y {
  left: 7px;
  top: 90px;
  transform: rotate(-90deg);
  transform-origin: left top;
}
.ssc-inspector {
  padding: 16px;
}
.ssc-inspector h2 {
  margin: 9px 0 7px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 500;
}
.ssc-inspector > p {
  color: var(--muted);
  font-size: 9px;
  line-height: 1.55;
}
.ssc-vector {
  height: 95px;
  margin: 17px 0;
  padding: 8px;
  border: 1px solid var(--line);
  background: #121210;
  display: flex;
  align-items: center;
  gap: 3px;
}
.ssc-vector i {
  flex: 1;
  min-height: 4px;
  border-radius: 2px;
}
.ssc-vector i.pos {
  background: var(--mint);
}
.ssc-vector i.neg {
  background: var(--coral);
}
.ssc-inspector dl {
  margin: 0;
}
.ssc-inspector dl div {
  padding: 9px 0;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
}
.ssc-inspector dt {
  color: var(--muted);
  font-size: 8px;
}
.ssc-inspector dd {
  margin: 0;
  color: var(--ink);
  font: 800 8px ui-monospace, monospace;
}
.ssc-verdict {
  max-width: 1460px;
  margin: 0 auto 10px;
  padding: 13px 15px;
  border: 1px solid var(--line);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
}
.ssc-verdict.accept {
  color: #baf2d9;
  background: #153327;
  border-color: #2e6c52;
}
.ssc-verdict.reject {
  color: #ffc1b5;
  background: #39201c;
  border-color: #774037;
}
.ssc-verdict span,
.ssc-verdict strong {
  display: block;
}
.ssc-verdict span {
  font-size: 7px;
  text-transform: uppercase;
}
.ssc-verdict strong {
  margin-top: 4px;
  font-size: 9px;
}
.ssc-verdict > b {
  font-size: 13px;
}
.ssc-principles {
  max-width: 1460px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 8px;
}
.ssc-principles article {
  padding: 13px;
  border-top: 2px solid var(--coral);
  background: rgba(26,25,23,.8);
}
.ssc-principles b {
  font-size: 9px;
  text-transform: uppercase;
}
.ssc-principles p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.55;
}
button:focus-visible,
select:focus-visible,
input:focus-visible,
.ssc-point:focus-visible circle {
  outline: 3px solid var(--blue);
  outline-offset: 3px;
}
@media (max-width: 1040px) {
  .ssc-layout {
    grid-template-columns: 240px 1fr;
  }
  .ssc-inspector {
    grid-column: 1 / -1;
  }
}
@media (max-width: 700px) {
  .semantic-cartographer {
    padding: 22px 10px 35px;
  }
  .ssc-header {
    align-items: start;
    flex-direction: column;
  }
  .ssc-header label {
    width: 100%;
  }
  .ssc-pair,
  .ssc-layout,
  .ssc-principles {
    grid-template-columns: 1fr;
  }
  .ssc-pair > div {
    min-height: 78px;
    border: 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .ssc-inspector {
    grid-column: auto;
  }
  .ssc-space > header {
    align-items: start;
    flex-direction: column;
    gap: 8px;
  }
  .ssc-map,
  .ssc-map svg {
    min-height: 390px;
    height: 390px;
  }
  .ssc-verdict {
    grid-template-columns: auto 1fr;
  }
  .ssc-verdict > b {
    grid-column: 2;
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

