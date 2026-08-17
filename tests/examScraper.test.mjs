import test from "node:test";
import assert from "node:assert/strict";
import { parseExamQuestionsHtml } from "../api/_lib/examScraper.js";

test("parses Next.js initialQuestions payloads without ending arrays inside strings", () => {
  const html = String.raw`<script>self.__next_f.push([1,"{\\"initialQuestions\\":[{\\"id\\":\\"aws-1\\",\\"question\\":\\"Which option contains [brackets]?\\",\\"options\\":[\\"[A]\\",\\"B\\"],\\"correctAnswer\\":0,\\"explanation\\":\\"Keep [this] text intact.\\"},{\\"id\\":\\"aws-2\\",\\"question\\":\\"Second question\\",\\"options\\":[\\"A\\",\\"B\\"],\\"correctAnswer\\":1,\\"explanation\\":\\"Second explanation.\\"}]}"])</script>`;

  assert.deepEqual(parseExamQuestionsHtml(html), [
    {
      id: "aws-1",
      question: "Which option contains [brackets]?",
      options: ["[A]", "B"],
      correctAnswer: 0,
      explanation: "Keep [this] text intact.",
    },
    {
      id: "aws-2",
      question: "Second question",
      options: ["A", "B"],
      correctAnswer: 1,
      explanation: "Second explanation.",
    },
  ]);
});
