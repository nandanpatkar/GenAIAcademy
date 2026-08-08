import React, { useMemo, useState } from "react";

/* Entity Boundary Studio — deterministic BIO tagging and span-evaluation lab. */

const ANNOTATION_CASES = [
  {
    id: "ner-001",
    title: "Acquisition news · 001",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $36 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$36 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 19,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-002",
    title: "Clinical note · 002",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 28,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-003",
    title: "Travel request · 003",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 37,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-004",
    title: "Product support · 004",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 46,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-005",
    title: "Legal clause · 005",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 55,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-006",
    title: "Creative title · 006",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 64,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-007",
    title: "Acquisition news · 007",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $42 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$42 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 73,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-008",
    title: "Clinical note · 008",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 82,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-009",
    title: "Travel request · 009",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 11,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-010",
    title: "Product support · 010",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 20,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-011",
    title: "Legal clause · 011",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 29,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-012",
    title: "Creative title · 012",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 38,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-013",
    title: "Acquisition news · 013",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $48 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$48 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 47,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-014",
    title: "Clinical note · 014",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 56,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-015",
    title: "Travel request · 015",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 65,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-016",
    title: "Product support · 016",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 74,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-017",
    title: "Legal clause · 017",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 83,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-018",
    title: "Creative title · 018",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 12,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-019",
    title: "Acquisition news · 019",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $54 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$54 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 21,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-020",
    title: "Clinical note · 020",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 30,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-021",
    title: "Travel request · 021",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 39,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-022",
    title: "Product support · 022",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 48,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-023",
    title: "Legal clause · 023",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 57,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-024",
    title: "Creative title · 024",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 66,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-025",
    title: "Acquisition news · 025",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $60 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$60 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 75,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-026",
    title: "Clinical note · 026",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 84,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-027",
    title: "Travel request · 027",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 13,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-028",
    title: "Product support · 028",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 22,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-029",
    title: "Legal clause · 029",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 31,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-030",
    title: "Creative title · 030",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 40,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-031",
    title: "Acquisition news · 031",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $66 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$66 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 49,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-032",
    title: "Clinical note · 032",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 58,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-033",
    title: "Travel request · 033",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 67,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-034",
    title: "Product support · 034",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 76,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-035",
    title: "Legal clause · 035",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 85,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-036",
    title: "Creative title · 036",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 14,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-037",
    title: "Acquisition news · 037",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $72 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$72 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 23,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-038",
    title: "Clinical note · 038",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 32,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-039",
    title: "Travel request · 039",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 41,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-040",
    title: "Product support · 040",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 50,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-041",
    title: "Legal clause · 041",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 59,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-042",
    title: "Creative title · 042",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 68,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-043",
    title: "Acquisition news · 043",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $38 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$38 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 77,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-044",
    title: "Clinical note · 044",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 86,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-045",
    title: "Travel request · 045",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 15,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-046",
    title: "Product support · 046",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 24,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-047",
    title: "Legal clause · 047",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 33,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-048",
    title: "Creative title · 048",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 42,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-049",
    title: "Acquisition news · 049",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $44 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$44 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 51,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-050",
    title: "Clinical note · 050",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 60,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-051",
    title: "Travel request · 051",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 69,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-052",
    title: "Product support · 052",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 78,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-053",
    title: "Legal clause · 053",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 87,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-054",
    title: "Creative title · 054",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 16,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-055",
    title: "Acquisition news · 055",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $50 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$50 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 25,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-056",
    title: "Clinical note · 056",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 34,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-057",
    title: "Travel request · 057",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 43,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-058",
    title: "Product support · 058",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 52,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-059",
    title: "Legal clause · 059",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 61,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-060",
    title: "Creative title · 060",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 70,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-061",
    title: "Acquisition news · 061",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $56 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$56 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 79,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-062",
    title: "Clinical note · 062",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 88,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-063",
    title: "Travel request · 063",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 17,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-064",
    title: "Product support · 064",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 26,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-065",
    title: "Legal clause · 065",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 35,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-066",
    title: "Creative title · 066",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 44,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-067",
    title: "Acquisition news · 067",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $62 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$62 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 53,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-068",
    title: "Clinical note · 068",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 62,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-069",
    title: "Travel request · 069",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 71,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-070",
    title: "Product support · 070",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 80,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-071",
    title: "Legal clause · 071",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 89,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-072",
    title: "Creative title · 072",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 18,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-073",
    title: "Acquisition news · 073",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $68 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$68 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 27,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-074",
    title: "Clinical note · 074",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 36,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-075",
    title: "Travel request · 075",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 45,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-076",
    title: "Product support · 076",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 54,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-077",
    title: "Legal clause · 077",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 63,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-078",
    title: "Creative title · 078",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 72,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-079",
    title: "Acquisition news · 079",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $74 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$74 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 81,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-080",
    title: "Clinical note · 080",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 10,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-081",
    title: "Travel request · 081",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 19,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-082",
    title: "Product support · 082",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 28,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-083",
    title: "Legal clause · 083",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 37,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-084",
    title: "Creative title · 084",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 46,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-085",
    title: "Acquisition news · 085",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $40 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$40 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 55,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-086",
    title: "Clinical note · 086",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 64,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-087",
    title: "Travel request · 087",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 73,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-088",
    title: "Product support · 088",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 82,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-089",
    title: "Legal clause · 089",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 11,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-090",
    title: "Creative title · 090",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 20,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-091",
    title: "Acquisition news · 091",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $46 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$46 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 29,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-092",
    title: "Clinical note · 092",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 38,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-093",
    title: "Travel request · 093",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 47,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-094",
    title: "Product support · 094",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "legal",
    noise: 56,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-095",
    title: "Legal clause · 095",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "clinical",
    noise: 65,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-096",
    title: "Creative title · 096",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "general",
    noise: 74,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-097",
    title: "Acquisition news · 097",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $52 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$52 million|MONEY",
    difficulty: "intermediate",
    domain: "support",
    noise: 83,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-098",
    title: "Clinical note · 098",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "legal",
    noise: 12,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-099",
    title: "Travel request · 099",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "clinical",
    noise: 21,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
  {
    id: "ner-100",
    title: "Product support · 100",
    text: "The Acme Cloud Pro account for Vega Retail expires Friday.",
    entities: "Acme Cloud Pro|PRODUCT;Vega Retail|ORG;Friday|DATE",
    difficulty: "intermediate",
    domain: "general",
    noise: 30,
    issue: "product and organization ambiguity",
    lesson: "Evaluate exact spans and labels separately; product and organization ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-101",
    title: "Legal clause · 101",
    text: "Orion Systems signed the DPA under EU Regulation 2016/679.",
    entities: "Orion Systems|ORG;DPA|DOCUMENT;EU Regulation 2016/679|LAW",
    difficulty: "advanced",
    domain: "support",
    noise: 39,
    issue: "long formal spans",
    lesson: "Evaluate exact spans and labels separately; long formal spans can hide behind strong token accuracy.",
  },
  {
    id: "ner-102",
    title: "Creative title · 102",
    text: "Sofia discussed The Left Hand of Darkness with Penguin Books.",
    entities: "Sofia|PERSON;The Left Hand of Darkness|WORK;Penguin Books|ORG",
    difficulty: "starter",
    domain: "legal",
    noise: 48,
    issue: "title boundary ambiguity",
    lesson: "Evaluate exact spans and labels separately; title boundary ambiguity can hide behind strong token accuracy.",
  },
  {
    id: "ner-103",
    title: "Acquisition news · 103",
    text: "Mira Patel at Northwind Labs acquired Blue Finch for $58 million.",
    entities: "Mira Patel|PERSON;Northwind Labs|ORG;Blue Finch|ORG;$58 million|MONEY",
    difficulty: "intermediate",
    domain: "clinical",
    noise: 57,
    issue: "nested organization context",
    lesson: "Evaluate exact spans and labels separately; nested organization context can hide behind strong token accuracy.",
  },
  {
    id: "ner-104",
    title: "Clinical note · 104",
    text: "Dr. Chen prescribed Metformin 500 mg at St. Anne Hospital.",
    entities: "Dr. Chen|PERSON;Metformin|DRUG;500 mg|DOSAGE;St. Anne Hospital|ORG",
    difficulty: "advanced",
    domain: "general",
    noise: 66,
    issue: "domain-specific labels",
    lesson: "Evaluate exact spans and labels separately; domain-specific labels can hide behind strong token accuracy.",
  },
  {
    id: "ner-105",
    title: "Travel request · 105",
    text: "Book Arjun from Pune to New Delhi on 18 September.",
    entities: "Arjun|PERSON;Pune|GPE;New Delhi|GPE;18 September|DATE",
    difficulty: "starter",
    domain: "support",
    noise: 75,
    issue: "adjacent slots",
    lesson: "Evaluate exact spans and labels separately; adjacent slots can hide behind strong token accuracy.",
  },
];

const LABELS = { PERSON: "#ff7a6b", ORG: "#8d7cf4", GPE: "#3da9d5", MONEY: "#e5a936", DATE: "#4aaf7b", DRUG: "#d962a5", DOSAGE: "#9a7544", PRODUCT: "#ef8354", DOCUMENT: "#5c8d89", LAW: "#6f73d2", WORK: "#b3694f", O: "#d9dee5" };
const parseEntities = (item) => item.entities.split(";").map((entry) => { const [text,label] = entry.split("|"); return { text,label }; });

function buildTokens(item, threshold, boundaryBias) {
  const entities = parseEntities(item);
  const raw = item.text.match(/[\p{L}\p{N}$/.:-]+|[^\s]/gu) || [];
  let cursor = 0;
  return raw.map((token, index) => {
    const start = item.text.indexOf(token, cursor);
    const end = start + token.length;
    cursor = end;
    const entity = entities.find((candidate) => { const entityStart = item.text.indexOf(candidate.text); return start >= entityStart && end <= entityStart + candidate.text.length; });
    const entityStart = entity ? item.text.indexOf(entity.text) : -1;
    const confidence = Math.max(.31, Math.min(.98, .92 - ((index * 13 + item.noise) % 41) / 100 + boundaryBias / 250));
    const accepted = entity && confidence >= threshold / 100;
    return { token, start, end, label: accepted ? entity.label : "O", bio: accepted ? `${start === entityStart ? "B" : "I"}-${entity.label}` : "O", confidence, expected: entity?.label || "O" };
  });
}

function Icon({ name, size = 18 }) {
  const paths = {
    tag: <><path d="M20 13 13 20l-9-9V4h7Z" /><circle cx="8.5" cy="8.5" r="1.2" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="M12 3 2.5 20h19Z" /><path d="M12 9v4M12 17h.01" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function TokenRow({ token, selected, onClick }) {
  const color = LABELS[token.label];
  return <button className={`ebs-token ${selected ? "is-selected" : ""}`} onClick={onClick} aria-pressed={selected} style={{ "--entity": color }}><span>{token.token}</span><small>{token.bio}</small><i>{Math.round(token.confidence * 100)}%</i></button>;
}

export default function EntityBoundaryStudioLab() {
  const [caseId, setCaseId] = useState("ner-002");
  const [threshold, setThreshold] = useState(68);
  const [boundaryBias, setBoundaryBias] = useState(15);
  const [selected, setSelected] = useState(0);
  const [scheme, setScheme] = useState("BIO");
  const item = ANNOTATION_CASES.find((entry) => entry.id === caseId) || ANNOTATION_CASES[0];
  const tokens = useMemo(() => buildTokens(item, threshold, boundaryBias), [item, threshold, boundaryBias]);
  const active = tokens[selected] || tokens[0];
  const tp = tokens.filter((token) => token.label !== "O" && token.label === token.expected).length;
  const fp = tokens.filter((token) => token.label !== "O" && token.label !== token.expected).length;
  const fn = tokens.filter((token) => token.label === "O" && token.expected !== "O").length;
  const precision = tp / Math.max(tp + fp, 1);
  const recall = tp / Math.max(tp + fn, 1);
  const f1 = (2 * precision * recall) / Math.max(precision + recall, .001);
  const spans = parseEntities(item);
  const changeCase = (id) => { setCaseId(id); setSelected(0); };

  return <main className="entity-boundary-studio">
    <header className="ebs-header"><div><span className="ebs-kicker"><Icon name="tag" size={15} /> NLP sequence labeling</span><h1>Entity Boundary Studio</h1><p>Turn a sentence into token labels, inspect BIO boundaries, and see why exact-span evaluation matters.</p></div><label><span>Annotation case</span><select value={caseId} onChange={(event) => changeCase(event.target.value)}>{ANNOTATION_CASES.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label></header>
    <section className="ebs-source"><span>Source sentence</span><p>{item.text}</p><div><b>{item.domain}</b><b>{item.difficulty}</b><b>{item.issue}</b></div></section>
    <div className="ebs-layout">
      <aside className="ebs-controls"><header><Icon name="target" /><div><span>Model controls</span><strong>Prediction policy</strong></div></header><label><span>Confidence threshold <output>{threshold}%</output></span><input type="range" min="35" max="95" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /><small>Higher thresholds reduce uncertain spans but can harm recall.</small></label><label><span>Boundary preference <output>{boundaryBias > 0 ? "+" : ""}{boundaryBias}</output></span><input type="range" min="-30" max="30" value={boundaryBias} onChange={(event) => setBoundaryBias(Number(event.target.value))} /><small>Simulates stronger or weaker confidence near entity boundaries.</small></label><div className="ebs-scheme"><span>Tagging scheme</span>{["BIO","BIOES"].map((name) => <button key={name} className={scheme === name ? "is-active" : ""} onClick={() => setScheme(name)}>{name}</button>)}</div><div className="ebs-legend">{Object.entries(LABELS).filter(([name]) => name !== "O").map(([name,color]) => <span key={name}><i style={{ background: color }} />{name}</span>)}</div></aside>
      <section className="ebs-workbench"><header><div><span>Token annotation lane</span><strong>{tokens.length} tokens · {spans.length} expected spans</strong></div><span className="ebs-live">model output</span></header><div className="ebs-token-lane">{tokens.map((token,index) => <TokenRow key={`${token.token}-${index}`} token={token} selected={selected === index} onClick={() => setSelected(index)} />)}</div><div className="ebs-inspection"><div><span>Selected token</span><strong>{active?.token}</strong><small>characters {active?.start}:{active?.end}</small></div><div><span>Predicted tag</span><strong style={{ color: LABELS[active?.label] }}>{active?.bio}</strong><small>{Math.round((active?.confidence || 0) * 100)}% confidence</small></div><div><span>Expected label</span><strong>{active?.expected}</strong><small>{active?.label === active?.expected ? "correct token label" : "label mismatch"}</small></div></div><section className="ebs-spans"><span>Expected entity spans</span>{spans.map((span,index) => <article key={`${span.text}-${index}`}><i style={{ background: LABELS[span.label] }} /><div><strong>{span.text}</strong><small>{span.label}</small></div><b>{item.text.indexOf(span.text)}:{item.text.indexOf(span.text)+span.text.length}</b></article>)}</section></section>
      <aside className="ebs-score"><span className="ebs-kicker">Evaluation board</span><h2>Exact-span score</h2><div className="ebs-ring" style={{ "--score": `${f1 * 360}deg` }}><strong>{Math.round(f1 * 100)}</strong><span>F1</span></div><dl><div><dt>Precision</dt><dd>{Math.round(precision * 100)}%</dd></div><div><dt>Recall</dt><dd>{Math.round(recall * 100)}%</dd></div><div><dt>True-positive tokens</dt><dd>{tp}</dd></div><div><dt>Missed entity tokens</dt><dd>{fn}</dd></div></dl><div className={`ebs-diagnosis ${fn ? "warn" : "good"}`}><Icon name={fn ? "alert" : "check"} /><p>{fn ? "The threshold is suppressing part of an expected entity. Inspect boundary confidence." : "All expected entity tokens survive the current threshold."}</p></div></aside>
    </div>
    <section className="ebs-lesson"><b>Boundary lesson</b><p>{item.lesson}</p><div><span>Token accuracy can remain high</span><span>Exact-span F1 catches partial entities</span><span>Evaluate by domain and label</span></div></section>
    <style>{`
:root {
  color-scheme: light;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #eef0f7;
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
.entity-boundary-studio {
  --ink: #1c2133;
  --muted: #687087;
  --line: #cbd0df;
  --panel: #ffffff;
  --indigo: #5b4fd6;
  min-height: 100vh;
  padding: 31px clamp(15px,4vw,58px) 48px;
  color: var(--ink);
  background:
    radial-gradient(circle at 100% 0%, rgba(91,79,214,.13), transparent 28%),
    #eef0f7;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.ebs-header {
  max-width: 1460px;
  margin: 0 auto 18px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 22px;
}
.ebs-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--indigo);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.ebs-header h1 {
  margin: 8px 0 6px;
  font-size: clamp(36px,5.2vw,70px);
  letter-spacing: -.055em;
  line-height: .95;
}
.ebs-header p {
  margin: 0;
  max-width: 730px;
  color: var(--muted);
  font-size: 15px;
}
.ebs-header label {
  min-width: min(100%,360px);
}
.ebs-header label > span {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}
.ebs-header select {
  width: 100%;
  min-height: 45px;
  padding: 9px 10px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: white;
  color: var(--ink);
}
.ebs-source {
  max-width: 1460px;
  margin: 0 auto 11px;
  padding: 15px 18px;
  border: 1px solid #bfc5d7;
  border-left: 5px solid var(--indigo);
  border-radius: 10px;
  background: white;
}
.ebs-source > span {
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}
.ebs-source p {
  margin: 7px 0 11px;
  font-family: Georgia, serif;
  font-size: clamp(18px,2vw,27px);
  line-height: 1.35;
}
.ebs-source > div {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ebs-source b {
  padding: 4px 7px;
  border-radius: 99px;
  background: #eceafa;
  color: #5145b7;
  font-size: 8px;
  text-transform: uppercase;
}
.ebs-layout {
  max-width: 1460px;
  margin: 0 auto 11px;
  display: grid;
  grid-template-columns: 260px minmax(0,1fr) 260px;
  gap: 11px;
  align-items: start;
}
.ebs-controls,
.ebs-workbench,
.ebs-score {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--panel);
  box-shadow: 0 10px 28px rgba(42,47,76,.07);
}
.ebs-controls > header,
.ebs-workbench > header {
  min-height: 59px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 9px;
}
.ebs-controls header svg {
  color: var(--indigo);
}
.ebs-controls header span,
.ebs-controls header strong,
.ebs-workbench header span,
.ebs-workbench header strong {
  display: block;
}
.ebs-controls header span,
.ebs-workbench header span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ebs-controls header strong,
.ebs-workbench header strong {
  margin-top: 3px;
  font-size: 11px;
}
.ebs-controls > label {
  display: block;
  padding: 15px 13px;
  border-bottom: 1px solid #e5e7ef;
}
.ebs-controls label > span {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 9px;
  font-weight: 800;
}
.ebs-controls output {
  color: var(--indigo);
}
.ebs-controls input {
  width: 100%;
  margin: 13px 0 7px;
  accent-color: var(--indigo);
}
.ebs-controls label small {
  color: var(--muted);
  font-size: 8px;
  line-height: 1.5;
}
.ebs-scheme {
  padding: 13px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.ebs-scheme > span {
  grid-column: 1 / -1;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ebs-scheme button {
  min-height: 40px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: #f7f7fb;
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
}
.ebs-scheme button.is-active {
  color: white;
  border-color: var(--indigo);
  background: var(--indigo);
}
.ebs-legend {
  padding: 6px 13px 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ebs-legend span {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 5px;
  border: 1px solid #e0e2eb;
  border-radius: 99px;
  color: var(--muted);
  font-size: 7px;
}
.ebs-legend i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.ebs-workbench > header {
  justify-content: space-between;
}
.ebs-live {
  color: #318661 !important;
  font-weight: 800;
}
.ebs-token-lane {
  min-height: 188px;
  padding: 18px;
  display: flex;
  align-content: start;
  flex-wrap: wrap;
  gap: 7px;
  background:
    linear-gradient(#eef0f6 1px, transparent 1px),
    #fbfbfd;
  background-size: 100% 46px;
}
.ebs-token {
  position: relative;
  min-height: 61px;
  padding: 8px 9px 15px;
  border: 2px solid transparent;
  border-radius: 7px;
  background: color-mix(in srgb, var(--entity) 18%, white);
  color: var(--ink);
}
.ebs-token::after {
  content: "";
  position: absolute;
  left: 7px;
  right: 7px;
  bottom: 6px;
  height: 3px;
  border-radius: 2px;
  background: var(--entity);
}
.ebs-token.is-selected {
  border-color: var(--entity);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--entity) 25%, transparent);
}
.ebs-token span,
.ebs-token small,
.ebs-token i {
  display: block;
}
.ebs-token span {
  font-weight: 800;
  font-size: 11px;
}
.ebs-token small {
  margin-top: 4px;
  color: var(--muted);
  font: 7px ui-monospace, monospace;
}
.ebs-token i {
  position: absolute;
  right: 4px;
  top: 4px;
  color: #7f879b;
  font-size: 6px;
  font-style: normal;
}
.ebs-inspection {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.ebs-inspection > div {
  min-height: 90px;
  padding: 13px;
}
.ebs-inspection > div + div {
  border-left: 1px solid var(--line);
}
.ebs-inspection span,
.ebs-inspection strong,
.ebs-inspection small {
  display: block;
}
.ebs-inspection span {
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ebs-inspection strong {
  margin: 7px 0 3px;
  font: 800 16px ui-monospace, monospace;
  overflow-wrap: anywhere;
}
.ebs-inspection small {
  color: var(--muted);
  font-size: 8px;
}
.ebs-spans {
  padding: 14px;
}
.ebs-spans > span {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
}
.ebs-spans article {
  min-height: 43px;
  padding: 7px 8px;
  border-top: 1px solid #e4e6ee;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
}
.ebs-spans article > i {
  width: 9px;
  height: 28px;
  border-radius: 4px;
}
.ebs-spans strong,
.ebs-spans small {
  display: block;
}
.ebs-spans strong {
  font-size: 10px;
}
.ebs-spans small {
  color: var(--muted);
  font-size: 7px;
}
.ebs-spans article > b {
  color: var(--muted);
  font: 8px ui-monospace, monospace;
}
.ebs-score {
  padding: 17px;
}
.ebs-score h2 {
  margin: 8px 0 16px;
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 500;
}
.ebs-ring {
  width: 134px;
  height: 134px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: conic-gradient(var(--indigo) var(--score), #e4e5ee 0);
  position: relative;
  display: grid;
  place-content: center;
}
.ebs-ring::before {
  content: "";
  position: absolute;
  inset: 13px;
  border-radius: 50%;
  background: white;
}
.ebs-ring strong,
.ebs-ring span {
  z-index: 1;
  text-align: center;
}
.ebs-ring strong {
  font-size: 30px;
}
.ebs-ring span {
  color: var(--muted);
  font-size: 8px;
}
.ebs-score dl {
  margin: 0;
}
.ebs-score dl div {
  padding: 9px 0;
  border-top: 1px solid #e3e5ed;
  display: flex;
  justify-content: space-between;
}
.ebs-score dt {
  color: var(--muted);
  font-size: 9px;
}
.ebs-score dd {
  margin: 0;
  font: 800 10px ui-monospace, monospace;
}
.ebs-diagnosis {
  margin-top: 14px;
  padding: 11px;
  border-radius: 8px;
  display: flex;
  gap: 8px;
}
.ebs-diagnosis.warn {
  color: #9b4f25;
  background: #fff0e3;
}
.ebs-diagnosis.good {
  color: #287253;
  background: #eaf7f1;
}
.ebs-diagnosis svg {
  flex: none;
}
.ebs-diagnosis p {
  margin: 0;
  font-size: 8px;
  line-height: 1.5;
}
.ebs-lesson {
  max-width: 1460px;
  margin: 0 auto;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #26243f;
  color: white;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 15px;
  align-items: center;
}
.ebs-lesson > b {
  color: #bdb7ff;
  font-size: 9px;
  text-transform: uppercase;
}
.ebs-lesson > p {
  margin: 0;
  font-size: 10px;
}
.ebs-lesson > div {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ebs-lesson > div span {
  padding: 5px 7px;
  border: 1px solid #595572;
  border-radius: 99px;
  color: #d9d5ee;
  font-size: 7px;
}
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid #e5a936;
  outline-offset: 3px;
}
@media (max-width: 1040px) {
  .ebs-layout {
    grid-template-columns: 240px 1fr;
  }
  .ebs-score {
    grid-column: 1 / -1;
  }
}
@media (max-width: 700px) {
  .entity-boundary-studio {
    padding: 22px 10px 35px;
  }
  .ebs-header {
    align-items: start;
    flex-direction: column;
  }
  .ebs-header label {
    width: 100%;
  }
  .ebs-layout,
  .ebs-inspection,
  .ebs-lesson {
    grid-template-columns: 1fr;
  }
  .ebs-score {
    grid-column: auto;
  }
  .ebs-inspection > div + div {
    border-left: 0;
    border-top: 1px solid var(--line);
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

