import React, { useMemo, useState } from "react";

/* Tokenization Microscope — deterministic NLP tokenization teaching simulator. */

const TEXT_CASES = [
  {
    id: "text-001",
    title: "Rare technical term · 001",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 29,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-002",
    title: "Code and identifier · 002",
    text: "Retry ERR_AUTH_TOKEN_42 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 46,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-003",
    title: "Hindi-English mix · 003",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 63,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-004",
    title: "Japanese spacing · 004",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 80,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-005",
    title: "Emoji sequence · 005",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 97,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-006",
    title: "Accented form · 006",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 26,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-007",
    title: "Agglutinative word · 007",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 43,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-008",
    title: "Whitespace noise · 008",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 60,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-009",
    title: "Rare technical term · 009",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 77,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-010",
    title: "Code and identifier · 010",
    text: "Retry ERR_AUTH_TOKEN_50 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 94,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-011",
    title: "Hindi-English mix · 011",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 23,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-012",
    title: "Japanese spacing · 012",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 40,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-013",
    title: "Emoji sequence · 013",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 57,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-014",
    title: "Accented form · 014",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 74,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-015",
    title: "Agglutinative word · 015",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 91,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-016",
    title: "Whitespace noise · 016",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 20,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-017",
    title: "Rare technical term · 017",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 37,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-018",
    title: "Code and identifier · 018",
    text: "Retry ERR_AUTH_TOKEN_58 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 54,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-019",
    title: "Hindi-English mix · 019",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 71,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-020",
    title: "Japanese spacing · 020",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 88,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-021",
    title: "Emoji sequence · 021",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 17,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-022",
    title: "Accented form · 022",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 34,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-023",
    title: "Agglutinative word · 023",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 51,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-024",
    title: "Whitespace noise · 024",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 68,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-025",
    title: "Rare technical term · 025",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 85,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-026",
    title: "Code and identifier · 026",
    text: "Retry ERR_AUTH_TOKEN_66 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 14,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-027",
    title: "Hindi-English mix · 027",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 31,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-028",
    title: "Japanese spacing · 028",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 48,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-029",
    title: "Emoji sequence · 029",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 65,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-030",
    title: "Accented form · 030",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 82,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-031",
    title: "Agglutinative word · 031",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 99,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-032",
    title: "Whitespace noise · 032",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 28,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-033",
    title: "Rare technical term · 033",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 45,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-034",
    title: "Code and identifier · 034",
    text: "Retry ERR_AUTH_TOKEN_74 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 62,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-035",
    title: "Hindi-English mix · 035",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 79,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-036",
    title: "Japanese spacing · 036",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 96,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-037",
    title: "Emoji sequence · 037",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 25,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-038",
    title: "Accented form · 038",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 42,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-039",
    title: "Agglutinative word · 039",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 59,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-040",
    title: "Whitespace noise · 040",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 76,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-041",
    title: "Rare technical term · 041",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 93,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-042",
    title: "Code and identifier · 042",
    text: "Retry ERR_AUTH_TOKEN_82 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 22,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-043",
    title: "Hindi-English mix · 043",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 39,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-044",
    title: "Japanese spacing · 044",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 56,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-045",
    title: "Emoji sequence · 045",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 73,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-046",
    title: "Accented form · 046",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 90,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-047",
    title: "Agglutinative word · 047",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 19,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-048",
    title: "Whitespace noise · 048",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 36,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-049",
    title: "Rare technical term · 049",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 53,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-050",
    title: "Code and identifier · 050",
    text: "Retry ERR_AUTH_TOKEN_40 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 70,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-051",
    title: "Hindi-English mix · 051",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 87,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-052",
    title: "Japanese spacing · 052",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 16,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-053",
    title: "Emoji sequence · 053",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 33,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-054",
    title: "Accented form · 054",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 50,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-055",
    title: "Agglutinative word · 055",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 67,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-056",
    title: "Whitespace noise · 056",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 84,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-057",
    title: "Rare technical term · 057",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 13,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-058",
    title: "Code and identifier · 058",
    text: "Retry ERR_AUTH_TOKEN_48 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 30,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-059",
    title: "Hindi-English mix · 059",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 47,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-060",
    title: "Japanese spacing · 060",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 64,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-061",
    title: "Emoji sequence · 061",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 81,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-062",
    title: "Accented form · 062",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 98,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-063",
    title: "Agglutinative word · 063",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 27,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-064",
    title: "Whitespace noise · 064",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 44,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-065",
    title: "Rare technical term · 065",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 61,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-066",
    title: "Code and identifier · 066",
    text: "Retry ERR_AUTH_TOKEN_56 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 78,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-067",
    title: "Hindi-English mix · 067",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 95,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-068",
    title: "Japanese spacing · 068",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 24,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-069",
    title: "Emoji sequence · 069",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 41,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-070",
    title: "Accented form · 070",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 58,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-071",
    title: "Agglutinative word · 071",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 75,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-072",
    title: "Whitespace noise · 072",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 92,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-073",
    title: "Rare technical term · 073",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 21,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-074",
    title: "Code and identifier · 074",
    text: "Retry ERR_AUTH_TOKEN_64 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 38,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-075",
    title: "Hindi-English mix · 075",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 55,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-076",
    title: "Japanese spacing · 076",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 72,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-077",
    title: "Emoji sequence · 077",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 89,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-078",
    title: "Accented form · 078",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 18,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-079",
    title: "Agglutinative word · 079",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 35,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-080",
    title: "Whitespace noise · 080",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 52,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-081",
    title: "Rare technical term · 081",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 69,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-082",
    title: "Code and identifier · 082",
    text: "Retry ERR_AUTH_TOKEN_72 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 86,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-083",
    title: "Hindi-English mix · 083",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 15,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-084",
    title: "Japanese spacing · 084",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 32,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-085",
    title: "Emoji sequence · 085",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 49,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-086",
    title: "Accented form · 086",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 66,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-087",
    title: "Agglutinative word · 087",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 83,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-088",
    title: "Whitespace noise · 088",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 12,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-089",
    title: "Rare technical term · 089",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 29,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-090",
    title: "Code and identifier · 090",
    text: "Retry ERR_AUTH_TOKEN_80 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 46,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-091",
    title: "Hindi-English mix · 091",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 63,
    complexity: 2,
    recommended: "wordpiece",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-092",
    title: "Japanese spacing · 092",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 80,
    complexity: 3,
    recommended: "unigram",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-093",
    title: "Emoji sequence · 093",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 97,
    complexity: 4,
    recommended: "bpe",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-094",
    title: "Accented form · 094",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 26,
    complexity: 5,
    recommended: "wordpiece",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-095",
    title: "Agglutinative word · 095",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 43,
    complexity: 1,
    recommended: "unigram",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-096",
    title: "Whitespace noise · 096",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 60,
    complexity: 2,
    recommended: "bpe",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-097",
    title: "Rare technical term · 097",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 77,
    complexity: 3,
    recommended: "wordpiece",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-098",
    title: "Code and identifier · 098",
    text: "Retry ERR_AUTH_TOKEN_88 in sdk_v3/client.ts.",
    language: "Developer text",
    challenge: "symbols and identifiers",
    frequency: 94,
    complexity: 4,
    recommended: "unigram",
    lesson: "Inspect symbols and identifiers before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-099",
    title: "Hindi-English mix · 099",
    text: "Kal meeting reschedule kar do for the Pune team.",
    language: "Code-switching",
    challenge: "mixed scripts",
    frequency: 23,
    complexity: 5,
    recommended: "bpe",
    lesson: "Inspect mixed scripts before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-100",
    title: "Japanese spacing · 100",
    text: "東京で新しいモデルをテストします。",
    language: "Japanese",
    challenge: "no whitespace boundaries",
    frequency: 40,
    complexity: 1,
    recommended: "wordpiece",
    lesson: "Inspect no whitespace boundaries before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-101",
    title: "Emoji sequence · 101",
    text: "Great launch 👩🏽‍💻🚀 — shipping today!",
    language: "Social text",
    challenge: "multi-codepoint graphemes",
    frequency: 57,
    complexity: 2,
    recommended: "unigram",
    lesson: "Inspect multi-codepoint graphemes before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-102",
    title: "Accented form · 102",
    text: "Café naïve résumé coöperate São Paulo.",
    language: "Multilingual Latin",
    challenge: "Unicode normalization",
    frequency: 74,
    complexity: 3,
    recommended: "bpe",
    lesson: "Inspect Unicode normalization before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-103",
    title: "Agglutinative word · 103",
    text: "Çekoslovakyalılaştıramadıklarımızdanmışsınız.",
    language: "Turkish",
    challenge: "long productive morphology",
    frequency: 91,
    complexity: 4,
    recommended: "wordpiece",
    lesson: "Inspect long productive morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-104",
    title: "Whitespace noise · 104",
    text: "Invoice   total\\t changed\\n unexpectedly.",
    language: "OCR output",
    challenge: "irregular whitespace",
    frequency: 20,
    complexity: 5,
    recommended: "unigram",
    lesson: "Inspect irregular whitespace before choosing vocabulary size, normalization, and truncation policy.",
  },
  {
    id: "text-105",
    title: "Rare technical term · 105",
    text: "The hyperparameterization failed in pre-processing.",
    language: "English",
    challenge: "rare morphology",
    frequency: 37,
    complexity: 1,
    recommended: "bpe",
    lesson: "Inspect rare morphology before choosing vocabulary size, normalization, and truncation policy.",
  },
];

const COLORS = ["#ff775f","#ffc857","#65d6ad","#67aaf9","#b89cff","#ff91c8","#8bd450","#59c3c3"];
const hash = (text) => Array.from(text).reduce((sum, char, index) => sum + char.codePointAt(0) * (index + 3), 17);

function normalizeText(text, lowercase, accents, spaces) {
  let value = text;
  if (lowercase) value = value.toLocaleLowerCase();
  if (accents) value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (spaces) value = value.replace(/\s+/g, " ").trim();
  return value;
}

function tokenize(text, algorithm, vocabSize) {
  const words = text.match(/[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) || [];
  const threshold = algorithm === "word" ? 99 : algorithm === "bpe" ? 7 : algorithm === "wordpiece" ? 6 : 5;
  return words.flatMap((word) => {
    if (/^[^\p{L}\p{N}_]$/u.test(word)) return [word];
    const chars = Array.from(word);
    const effective = Math.max(2, Math.round(threshold + Math.log10(vocabSize) - 3));
    if (algorithm === "word" || chars.length <= effective) return [word];
    const pieces = [];
    for (let index = 0; index < chars.length; index += effective) {
      let piece = chars.slice(index, index + effective).join("");
      if (algorithm === "wordpiece" && index > 0) piece = `##${piece}`;
      if (algorithm === "unigram" && index === 0) piece = `▁${piece}`;
      pieces.push(piece);
    }
    return pieces;
  });
}

function Icon({ name, size = 18 }) {
  const paths = {
    scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><path d="M7 12h10" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    reset: <><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8" /><path d="M4 3v5h5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Stage({ number, title, value, children }) {
  return <section className="tm-stage"><header><span>{number}</span><div><strong>{title}</strong><small>{value}</small></div></header>{children}</section>;
}

export default function TokenizationMicroscopeLab() {
  const [caseId, setCaseId] = useState("text-002");
  const [algorithm, setAlgorithm] = useState("bpe");
  const [vocabSize, setVocabSize] = useState(32000);
  const [lowercase, setLowercase] = useState(false);
  const [accents, setAccents] = useState(false);
  const [spaces, setSpaces] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const item = TEXT_CASES.find((entry) => entry.id === caseId) || TEXT_CASES[0];
  const normalized = useMemo(() => normalizeText(item.text, lowercase, accents, spaces), [item, lowercase, accents, spaces]);
  const tokens = useMemo(() => tokenize(normalized, algorithm, vocabSize), [normalized, algorithm, vocabSize]);
  const bytes = new TextEncoder().encode(normalized).length;
  const fragmentation = tokens.length / Math.max(1, normalized.split(/\s+/).length);
  const active = tokens[selectedToken] || tokens[0];
  const tokenId = active ? 1000 + (hash(active) % Math.max(vocabSize, 1000)) : 0;
  const reset = (id) => { setCaseId(id); setSelectedToken(0); };

  return <main className="token-microscope">
    <header className="tm-header"><div><span className="tm-kicker"><Icon name="scan" size={15} /> NLP foundations · representation lab</span><h1>Tokenization<br />Microscope</h1><p>Watch raw text move through normalization, pre-tokenization, subword segmentation, IDs, and model context.</p></div><label><span>Specimen</span><select value={caseId} onChange={(event) => reset(event.target.value)}>{TEXT_CASES.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label></header>
    <section className="tm-specimen"><span>Raw specimen</span><strong>{item.text}</strong><div><b>{item.language}</b><b>{item.challenge}</b><b>complexity {item.complexity}/5</b></div></section>
    <div className="tm-pipeline">
      <Stage number="01" title="Normalize" value={`${normalized.length} characters`}><div className="tm-switches"><button className={lowercase ? "is-on" : ""} onClick={() => setLowercase((v) => !v)} aria-pressed={lowercase}>lowercase</button><button className={accents ? "is-on" : ""} onClick={() => setAccents((v) => !v)} aria-pressed={accents}>strip accents</button><button className={spaces ? "is-on" : ""} onClick={() => setSpaces((v) => !v)} aria-pressed={spaces}>clean spaces</button></div><code>{normalized}</code></Stage>
      <Stage number="02" title="Choose model" value={`${vocabSize.toLocaleString()} vocabulary`}><div className="tm-algorithms">{["word","bpe","wordpiece","unigram"].map((name) => <button key={name} className={algorithm === name ? "is-active" : ""} onClick={() => { setAlgorithm(name); setSelectedToken(0); }}>{name}</button>)}</div><label className="tm-range"><span>Vocabulary size</span><input type="range" min="8000" max="64000" step="1000" value={vocabSize} onChange={(event) => setVocabSize(Number(event.target.value))} /><output>{vocabSize.toLocaleString()}</output></label></Stage>
      <Stage number="03" title="Segment" value={`${tokens.length} tokens`}><div className="tm-tokens">{tokens.map((token, index) => <button key={`${token}-${index}`} style={{ "--token-color": COLORS[index % COLORS.length] }} className={selectedToken === index ? "is-selected" : ""} onClick={() => setSelectedToken(index)} aria-label={`Inspect token ${token}`}><span>{token === " " ? "SPACE" : token}</span><small>{1000 + (hash(token) % Math.max(vocabSize,1000))}</small></button>)}</div></Stage>
      <Stage number="04" title="Encode" value="token → integer ID"><div className="tm-inspector"><span style={{ background: COLORS[selectedToken % COLORS.length] }}>{active}</span><strong>{tokenId}</strong><div><small>UTF-8 bytes</small><b>{active ? new TextEncoder().encode(active).length : 0}</b></div></div><p>{algorithm === "wordpiece" ? "The ## prefix marks a continuation inside a word." : algorithm === "unigram" ? "The ▁ marker represents a preceding word boundary." : algorithm === "bpe" ? "Frequent character pairs survive as reusable subwords." : "Whole words require a much larger vocabulary and produce unknowns."}</p></Stage>
    </div>
    <section className="tm-dashboard"><article><span>Token count</span><strong>{tokens.length}</strong><small>affects context and price</small></article><article><span>UTF-8 bytes</span><strong>{bytes}</strong><small>raw storage footprint</small></article><article><span>Fragmentation</span><strong>{fragmentation.toFixed(2)}×</strong><small>tokens per whitespace word</small></article><article><span>Compression</span><strong>{(bytes / Math.max(tokens.length,1)).toFixed(1)}</strong><small>bytes represented per token</small></article></section>
    <section className="tm-lesson"><Icon name="info" /><div><span>What this specimen teaches</span><strong>{item.lesson}</strong></div><button onClick={() => { setLowercase(false); setAccents(false); setSpaces(true); setAlgorithm("bpe"); setVocabSize(32000); }}><Icon name="reset" size={15} /> Reset pipeline</button></section>
    <section className="tm-principles"><article><b>Normalization changes alignment</b><p>Lowercasing and accent removal may help vocabulary coverage but can destroy distinctions needed downstream.</p></article><article><b>Vocabulary changes fragmentation</b><p>Larger vocabularies keep more frequent strings intact while increasing embedding-table size.</p></article><article><b>Languages behave differently</b><p>Always inspect token distributions by language, script, domain, and rare-word slice.</p></article></section>
    <style>{`
:root {
  color-scheme: light;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #fff4e9;
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
.token-microscope {
  --ink: #211b24;
  --muted: #786d78;
  --paper: #fffaf4;
  --line: #2a222c;
  --hot: #f35c45;
  --yellow: #ffc857;
  min-height: 100vh;
  padding: 28px clamp(14px,4vw,58px) 48px;
  color: var(--ink);
  background:
    linear-gradient(90deg, rgba(42,34,44,.04) 1px, transparent 1px),
    #fff4e9;
  background-size: 22px 22px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.tm-header {
  max-width: 1450px;
  margin: 0 auto 17px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
}
.tm-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--hot);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.tm-header h1 {
  margin: 8px 0 6px;
  font-family: "Arial Black", Impact, sans-serif;
  font-size: clamp(42px,6vw,84px);
  line-height: .78;
  letter-spacing: -.055em;
  text-transform: uppercase;
}
.tm-header p {
  max-width: 700px;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 14px;
}
.tm-header label {
  min-width: min(100%,360px);
}
.tm-header label > span {
  display: block;
  margin-bottom: 6px;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.tm-header select {
  width: 100%;
  min-height: 46px;
  border: 2px solid var(--line);
  border-radius: 0;
  background: var(--paper);
  color: var(--ink);
  padding: 10px;
  font-weight: 700;
}
.tm-specimen {
  max-width: 1450px;
  margin: 0 auto 10px;
  padding: 15px 18px;
  border: 2px solid var(--line);
  background: var(--yellow);
  box-shadow: 5px 5px 0 var(--line);
}
.tm-specimen > span {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.tm-specimen > strong {
  display: block;
  margin: 8px 0 11px;
  font-family: Georgia, serif;
  font-size: clamp(18px,2.1vw,28px);
  line-height: 1.35;
}
.tm-specimen > div {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tm-specimen b {
  border: 1px solid var(--line);
  background: rgba(255,255,255,.4);
  padding: 4px 7px;
  font-size: 8px;
  text-transform: uppercase;
}
.tm-pipeline {
  max-width: 1450px;
  margin: 0 auto 10px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 8px;
  align-items: stretch;
}
.tm-stage {
  min-width: 0;
  min-height: 330px;
  border: 2px solid var(--line);
  background: var(--paper);
}
.tm-stage > header {
  min-height: 59px;
  padding: 10px 12px;
  border-bottom: 2px solid var(--line);
  display: flex;
  align-items: center;
  gap: 10px;
}
.tm-stage header > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--ink);
  font-size: 9px;
  font-weight: 900;
}
.tm-stage header strong,
.tm-stage header small {
  display: block;
}
.tm-stage header strong {
  font-size: 12px;
  text-transform: uppercase;
}
.tm-stage header small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 8px;
}
.tm-switches {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 11px;
}
.tm-switches button {
  min-height: 38px;
  border: 1px solid var(--line);
  background: white;
  padding: 7px 8px;
  font-size: 8px;
  font-weight: 800;
}
.tm-switches button.is-on {
  color: white;
  background: var(--ink);
}
.tm-stage > code {
  display: block;
  min-height: 120px;
  margin: 4px 11px 11px;
  padding: 11px;
  color: #e8f7ef;
  background: #211b24;
  font: 10px/1.7 ui-monospace, monospace;
  overflow-wrap: anywhere;
}
.tm-algorithms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  padding: 11px;
}
.tm-algorithms button {
  min-height: 48px;
  border: 1px solid var(--line);
  background: white;
  color: var(--muted);
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.tm-algorithms button.is-active {
  color: white;
  background: var(--hot);
  box-shadow: inset 0 -4px rgba(0,0,0,.18);
}
.tm-range {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 11px;
}
.tm-range span {
  grid-column: 1 / -1;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.tm-range input {
  width: 100%;
  accent-color: var(--hot);
}
.tm-range output {
  font: 900 10px ui-monospace, monospace;
}
.tm-tokens {
  padding: 11px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-content: start;
}
.tm-tokens button {
  min-height: 46px;
  max-width: 100%;
  padding: 5px 8px;
  border: 2px solid transparent;
  background: color-mix(in srgb, var(--token-color) 30%, white);
  color: var(--ink);
}
.tm-tokens button.is-selected {
  border-color: var(--line);
  box-shadow: 3px 3px 0 var(--line);
}
.tm-tokens span,
.tm-tokens small {
  display: block;
}
.tm-tokens span {
  font: 800 10px ui-monospace, monospace;
  overflow-wrap: anywhere;
}
.tm-tokens small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 7px;
}
.tm-inspector {
  margin: 11px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 2px solid var(--line);
}
.tm-inspector > span,
.tm-inspector > strong,
.tm-inspector > div {
  min-height: 70px;
  padding: 10px;
  display: grid;
  place-items: center;
  overflow-wrap: anywhere;
}
.tm-inspector > span {
  grid-column: 1 / -1;
  border-bottom: 2px solid var(--line);
  font: 900 17px ui-monospace, monospace;
}
.tm-inspector > strong {
  border-right: 2px solid var(--line);
  font-size: 24px;
}
.tm-inspector small,
.tm-inspector b {
  display: block;
  text-align: center;
}
.tm-inspector small {
  color: var(--muted);
  font-size: 7px;
  text-transform: uppercase;
}
.tm-inspector b {
  margin-top: 4px;
  font-size: 15px;
}
.tm-stage > p {
  margin: 10px 12px;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.55;
}
.tm-dashboard {
  max-width: 1450px;
  margin: 0 auto 8px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 8px;
}
.tm-dashboard article {
  border: 2px solid var(--line);
  background: white;
  padding: 12px;
}
.tm-dashboard span,
.tm-dashboard strong,
.tm-dashboard small {
  display: block;
}
.tm-dashboard span {
  color: var(--muted);
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
}
.tm-dashboard strong {
  margin: 5px 0 2px;
  color: var(--hot);
  font-size: 23px;
}
.tm-dashboard small {
  color: var(--muted);
  font-size: 8px;
}
.tm-lesson {
  max-width: 1450px;
  margin: 0 auto 8px;
  padding: 12px 14px;
  border: 2px solid var(--line);
  background: #dff7ee;
  display: flex;
  align-items: center;
  gap: 11px;
}
.tm-lesson > svg {
  color: #11684e;
  flex: none;
}
.tm-lesson > div {
  flex: 1;
}
.tm-lesson span,
.tm-lesson strong {
  display: block;
}
.tm-lesson span {
  color: #27715c;
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
}
.tm-lesson strong {
  margin-top: 4px;
  font-size: 10px;
}
.tm-lesson button {
  min-height: 42px;
  padding: 8px 10px;
  border: 1px solid #23624f;
  background: transparent;
  color: #23624f;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 800;
}
.tm-principles {
  max-width: 1450px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 8px;
}
.tm-principles article {
  border-top: 4px solid var(--hot);
  background: rgba(255,250,244,.82);
  padding: 12px;
}
.tm-principles b {
  font-size: 10px;
  text-transform: uppercase;
}
.tm-principles p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid #087e68;
  outline-offset: 3px;
}
@media (max-width: 1050px) {
  .tm-pipeline {
    grid-template-columns: 1fr 1fr;
  }
  .tm-stage {
    min-height: 290px;
  }
}
@media (max-width: 680px) {
  .token-microscope {
    padding: 21px 10px 34px;
  }
  .tm-header {
    align-items: start;
    flex-direction: column;
  }
  .tm-header label {
    width: 100%;
  }
  .tm-pipeline,
  .tm-dashboard,
  .tm-principles {
    grid-template-columns: 1fr;
  }
  .tm-stage {
    min-height: auto;
  }
  .tm-lesson {
    align-items: start;
    flex-wrap: wrap;
  }
  .tm-lesson button {
    width: 100%;
    justify-content: center;
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

