/*
 * Parser for the raw Amazon Connect course exports in conne/*.txt.
 *
 * The exports are plain-text dumps of an interactive courseware player, so they
 * carry no markup: headings, lists, cards and quizzes are all distinguishable
 * only by line shape and blank-line spacing. This module encodes those shapes
 * as rules and emits the block vocabulary documented in src/data/courses.js.
 *
 * Nothing here invents content. Every string in the output is a line from the
 * source file; the rules only decide how a line is classified and grouped.
 *
 * Run tools/build-connect-data.mjs to regenerate src/data/amazon-connect/.
 */

/* ---------------------------------------------------------------------------
 * Player chrome
 *
 * Lines emitted by the courseware UI rather than the author: carousel dots,
 * button labels, progress pips, flashcard affordances. They carry no teaching
 * content and are dropped everywhere except inside code blocks.
 * ------------------------------------------------------------------------ */
const CHROME_EXACT = new Set([
  'SUBMIT',
  'TAKE AGAIN',
  'START',
  'START AGAIN',
  'CONTINUE',
  'SKIP TO LESSON',
  'Top of page',
  'Play Video',
  'Navigation instructions',
  'Completed',
  'Unstarted',
  'In progress',
  'Click to flip',
  'Lesson content',
  'Course content',
  'Screen recording',
  'bullet',
  'Code',
  '+',
  '-',
  '–',
  '—',
  '•',
  '*',
]);

/* Answer-state labels from the quiz widget. Meaningful only while parsing a
   question; noise anywhere else. */
const ANSWER_MARKER = /^(Correctly|Incorrectly) (selected|unselected|checked|unchecked)$/;
const VERDICT = /^(Correct|Incorrect)$/;

/* Alt text for images and diagrams the export could not include. */
const IMAGE_ALT =
  /^(a |an |the )?(screen ?shot|screen ?capture|diagram|image|graphic|illustration|photo|icon|animated|video still)\b/i;

/* Lesson / section boundary emitted by the player's progress indicator. The
   leading "L" is optional because one export clips the first character of its
   very first line. */
const LESSON_MARKER = /^(l?esson|module|section|part|chapter)\s+(\d+)\s+of\s+(\d+)$/i;

/* Residue of a recorded attempt left at the top of two exports. */
const ATTEMPT_RESIDUE = /^(Correct|Incorrect)\.\s*Correct answer:/i;

const OBJECTIVES_HEADING = /^(Lesson|Section|Module|Course)\s+objectives$/i;
const INTRO_HEADING = /^(Lesson|Section|Module|Course)\s+introduction$/i;
const QUESTIONS_HEADING = /^(Check your knowledge|Knowledge Check|Knowledge check)$/i;
const NEXT_HEADING = /^(What's next\??|Whats next\??|What is next\??)$/i;
const QUESTION_INTRO =
  /^(the following|this section will|these questions)/i;

/* Headings that introduce advisory rather than expository content. Converted
   to callouts so they read as asides instead of full sections. */
const CALLOUT_HEADINGS = [
  { test: /^(considerations?|limitations?|things to consider)$/i, variant: 'warning' },
  { test: /^(important|caution|warning|gotchas?)$/i, variant: 'warning' },
  { test: /^(notes?|prerequisites?|requirements?)$/i, variant: 'note' },
  { test: /^(best practices?|tips?|recommendations?)$/i, variant: 'key' },
  { test: /^(key (points?|takeaways?)|takeaways?)$/i, variant: 'key' },
];

/* ---------------------------------------------------------------------------
 * Line-level helpers
 * ------------------------------------------------------------------------ */

function normalise(raw) {
  return raw
    .replace(/^﻿/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/ /g, ' ')
    .replace(/\(opens in a new tab\)/gi, '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim());
}

/*
 * Remove the navigation sidebar some exports repeat on every page.
 *
 * One export dumps the course's lesson list, progress states and footer links
 * above each lesson, eight times over. Rather than name those lines, this finds
 * them structurally: any run of consecutive non-blank lines that appears
 * verbatim three or more times in the document is a repeated widget, not
 * teaching copy, which no author writes three times in a row-for-row match.
 */
function stripRepeatedBlocks(lines, windowSize = 4, minRepeats = 3) {
  const windows = new Map();

  for (let i = 0; i + windowSize <= lines.length; i += 1) {
    const slice = lines.slice(i, i + windowSize);
    if (slice.some((line) => line === '')) continue;
    /* A repeated widget is a list of short labels. Code legitimately repeats —
       the same boilerplate turns up across several samples — and a line long
       enough to be a sentence is content, not chrome. */
    if (slice.some((line) => line.length > 90 || looksLikeCode(line))) continue;
    const key = slice.join(' ');
    if (!windows.has(key)) windows.set(key, []);
    windows.get(key).push(i);
  }

  const drop = new Set();
  for (const [, starts] of windows) {
    if (starts.length < minRepeats) continue;
    for (const start of starts) {
      for (let i = start; i < start + windowSize; i += 1) drop.add(i);
    }
  }

  if (drop.size === 0) return lines;
  return lines.filter((_, index) => !drop.has(index));
}

function isChrome(line) {
  if (CHROME_EXACT.has(line)) return true;
  if (/^\d+$/.test(line)) return true; // carousel position pips
  if (/^Step \d+$/i.test(line)) return true; // step label; the title follows
  if (ANSWER_MARKER.test(line)) return true;
  if (IMAGE_ALT.test(line)) return true;
  if (ATTEMPT_RESIDUE.test(line)) return true;
  return false;
}

/* Inline advisory prefixes the courseware uses in place of a callout box. */
const INLINE_ADVISORY = [
  { test: /^(insider tips?|pro tips?|tips?)\s*[:—-]\s*/i, variant: 'key', title: 'Tip' },
  { test: /^(notes?|remember)\s*[:—-]\s*/i, variant: 'note', title: 'Note' },
  { test: /^(important|caution|warning)\s*[:—-]\s*/i, variant: 'warning', title: 'Important' },
];

/* A line that reads like source code rather than prose. Deliberately narrow:
   prose with a stray bracket should not be swept into a code block. */
function looksLikeCode(line) {
  if (!line) return false;
  if (/^(\/\/|\/\*|\*|#|<|\}|\{|\]|\[)/.test(line)) return true;
  if (/[{};]$/.test(line)) return true;
  if (/^[\w$.]+\s*\(.*\)\s*;?$/.test(line)) return true;
  if (/^"?[\w$-]+"?\s*[:=]\s*.+[,;]?$/.test(line) && !/\s\w+\s\w+\s\w+\s/.test(line))
    return true;
  return false;
}

const SENTENCE_END = /[.!?:;,]$/;

/* A heading never trails off in a function word — a line that does is a
   sentence the export broke, not a title. */
const DANGLING =
  /\b(and|or|but|the|a|an|to|of|in|for|with|at|on|by|from|as|is|are|was|were|that|which|into|about|over|under|per|via)$/i;

/* Heading test for a line standing alone between blank lines. */
function isHeadingLine(line) {
  if (!line || line.length > 84) return false;
  if (SENTENCE_END.test(line) && !/\?$/.test(line)) return false;
  if (line.split(' ').length > 13) return false;
  if (!/^[A-Z0-9"'(]/.test(line)) return false;
  if (/^(and|or|but|so|then|because|which|that)\b/i.test(line)) return false;
  if (/^\d+[.)]\s/.test(line)) return false; // numbered step, not a section
  if (DANGLING.test(line)) return false;
  return true;
}

/* Title test for the first line of a multi-line run — the shape used by the
   player's card decks and scenario call-outs. */
function isRunTitle(line) {
  if (!line || line.length > 72) return false;
  if (SENTENCE_END.test(line)) return false;
  if (line.split(' ').length > 11) return false;
  if (!/^[A-Z0-9"'(]/.test(line)) return false;
  if (DANGLING.test(line)) return false;
  return true;
}

function isListItem(line) {
  return line.length <= 120 && line.split(' ').length <= 18;
}

/* ---------------------------------------------------------------------------
 * Runs: consecutive non-blank lines, plus how many blank lines preceded them.
 * Blank-line count is the only grouping signal the export preserves, so it is
 * kept rather than collapsed.
 * ------------------------------------------------------------------------ */
function toRuns(lines) {
  const runs = [];
  let gap = 0;
  let current = null;

  for (const line of lines) {
    if (line === '') {
      if (current) {
        runs.push(current);
        current = null;
        gap = 0;
      }
      gap += 1;
      continue;
    }
    if (!current) current = { gap, lines: [] };
    current.lines.push(line);
  }
  if (current) runs.push(current);
  return runs;
}

/* ---------------------------------------------------------------------------
 * Code blocks
 *
 * A `Code` chrome line introduces a listing that runs until a blank line
 * followed by prose. Extracted before chrome filtering so that braces and
 * digits inside the listing survive.
 * ------------------------------------------------------------------------ */
function extractCodeBlocks(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== 'Code') {
      out.push({ kind: 'line', text: lines[i] });
      continue;
    }

    const body = [];
    let j = i + 1;
    while (j < lines.length) {
      const line = lines[j];
      if (line === '') {
        /* A blank line ends the listing unless code resumes after it. */
        let k = j;
        while (k < lines.length && lines[k] === '') k += 1;
        if (k >= lines.length || !looksLikeCode(lines[k])) break;
        body.push('');
        j = k;
        continue;
      }
      body.push(line);
      j += 1;
    }

    while (body.length && body[body.length - 1] === '') body.pop();
    if (body.length) {
      out.push({ kind: 'code', text: body.join('\n') });
      i = j - 1;
    }
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * Numbered step sequences
 *
 * The player prints a step's ordinal on its own line above the step body:
 *
 *     1
 *     Set hours of operation: Hours of operation define when …
 *     2
 *     Create queues: Queues allow contacts to be routed …
 *
 * Detected before chrome filtering, which would otherwise discard the ordinals
 * and leave a run of unrelated paragraphs. Carousel position pips look similar
 * but have no body line, so a body line is required.
 * ------------------------------------------------------------------------ */
function extractSteps(pieces) {
  const out = [];

  for (let i = 0; i < pieces.length; i += 1) {
    const piece = pieces[i];
    if (piece.kind !== 'line' || !/^\d+$/.test(piece.text)) {
      out.push(piece);
      continue;
    }

    const items = [];
    let j = i;
    let expected = Number(piece.text);

    while (j < pieces.length) {
      const marker = pieces[j];
      if (marker.kind !== 'line' || marker.text !== String(expected)) break;

      /* Skip blanks, then take the body line — it must not be another ordinal. */
      let k = j + 1;
      while (k < pieces.length && pieces[k].kind === 'line' && pieces[k].text === '') k += 1;
      const body = pieces[k];
      if (!body || body.kind !== 'line' || body.text === '' || /^\d+$/.test(body.text)) break;

      items.push(body.text);
      expected += 1;
      j = k + 1;
      while (j < pieces.length && pieces[j].kind === 'line' && pieces[j].text === '') j += 1;
    }

    /* A single ordinal is a pip, not a sequence. */
    if (items.length >= 2 && Number(piece.text) <= 2) {
      out.push({ kind: 'steps', items });
      i = j - 1;
      continue;
    }
    out.push(piece);
  }

  return out;
}

/* ---------------------------------------------------------------------------
 * Blocks
 * ------------------------------------------------------------------------ */

function paragraph(text) {
  return { type: 'p', text };
}

/* Split "Create queues: Queues allow contacts to be routed …" into the step
   title and its explanation. Falls back to the whole line as the title. */
function toStep(text) {
  const at = text.indexOf(': ');
  if (at > 0 && at <= 70) {
    return { title: text.slice(0, at), text: text.slice(at + 2) };
  }
  return { title: '', text };
}

/* Turn one run of consecutive lines into blocks. */
function runToBlocks(run) {
  const { lines, gap } = run;

  if (lines.length === 1) {
    return [isHeadingLine(lines[0]) ? { type: 'h', level: 3, text: lines[0] } : paragraph(lines[0])];
  }

  /* Card deck: a wide gap, a short title, then its body on the very next line.
     This is how the player renders "choose each of the following" tiles. */
  if (gap >= 2 && isRunTitle(lines[0]) && lines.length >= 2) {
    return [
      {
        type: 'card-item',
        title: lines[0],
        body: lines.slice(1).join(' '),
      },
    ];
  }

  const blocks = [];
  let rest = lines;

  /* A short, punctuation-free opening line is a heading for the rest. */
  if (isRunTitle(lines[0]) && lines.length > 1) {
    blocks.push({ type: 'h', level: 4, text: lines[0] });
    rest = lines.slice(1);
  }

  /* Within what remains, leading short lines are list items and the first long
     line ends the list — the export strips bullet glyphs, so length and word
     count are the only signals left. */
  let index = 0;
  while (index < rest.length) {
    const items = [];
    while (index < rest.length && isListItem(rest[index])) {
      items.push(rest[index]);
      index += 1;
    }

    if (items.length >= 2) {
      blocks.push({ type: 'ul', items });
    } else {
      for (const item of items) blocks.push(paragraph(item));
    }

    while (index < rest.length && !isListItem(rest[index])) {
      blocks.push(paragraph(rest[index]));
      index += 1;
    }
  }

  return blocks;
}

/* Merge adjacent card-items into one `cards` block; a lone card-item is just a
   heading plus a paragraph. */
function foldCards(blocks) {
  const out = [];
  let pending = [];

  const flush = () => {
    if (pending.length === 0) return;
    if (pending.length === 1) {
      out.push({ type: 'h', level: 4, text: pending[0].title });
      out.push(paragraph(pending[0].body));
    } else {
      out.push({
        type: 'cards',
        items: pending.map((item) => ({ title: item.title, body: item.body })),
      });
    }
    pending = [];
  };

  for (const block of blocks) {
    if (block.type === 'card-item') {
      pending.push(block);
      continue;
    }
    flush();
    out.push(block);
  }
  flush();
  return out;
}

/* Convert advisory headings and the paragraphs under them into callouts. */
function foldCallouts(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const match =
      block.type === 'h' && CALLOUT_HEADINGS.find((entry) => entry.test.test(block.text));

    if (!match) {
      out.push(block);
      continue;
    }

    const body = [];
    let j = i + 1;
    while (j < blocks.length && (blocks[j].type === 'p' || blocks[j].type === 'ul')) {
      if (blocks[j].type === 'p') body.push(blocks[j].text);
      else body.push(...blocks[j].items);
      j += 1;
    }

    /* Only fold a short run. A long one is a real section and stays as prose. */
    if (body.length === 0 || body.length > 6) {
      out.push(block);
      continue;
    }

    out.push({ type: 'callout', variant: match.variant, title: block.text, body });
    i = j - 1;
  }
  return out;
}

/* A paragraph ending in a colon introduces a list whose bullet glyphs the
   export stripped. Fold the short paragraphs that follow back into one. */
function foldColonLists(blocks) {
  const out = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    out.push(block);

    if (block.type !== 'p' || !/:$/.test(block.text)) continue;

    const items = [];
    let j = i + 1;
    while (j < blocks.length && blocks[j].type === 'p' && isListItem(blocks[j].text)) {
      items.push(blocks[j].text);
      j += 1;
    }

    if (items.length >= 2) {
      out.push({ type: 'ul', items });
      i = j - 1;
    }
  }

  return out;
}

/*
 * Recover a heading that landed at the end of a list.
 *
 * The export drops the blank line between a heading and the paragraph under
 * it, so a heading sitting directly below a bullet reads as one more bullet.
 * A list whose last item is heading-shaped and which is followed by a
 * paragraph gives that item up.
 */
function liftTrailingHeadings(blocks) {
  const out = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const next = blocks[i + 1];

    const trailing =
      (block.type === 'ul' || block.type === 'ol') &&
      next?.type === 'p' &&
      isRunTitle(block.items[block.items.length - 1]);

    if (!trailing) {
      out.push(block);
      continue;
    }

    const items = block.items.slice(0, -1);
    const heading = block.items[block.items.length - 1];

    if (items.length >= 2) out.push({ ...block, items });
    else items.forEach((item) => out.push(paragraph(item)));
    out.push({ type: 'h', level: 4, text: heading });
  }

  return out;
}

/* "Insider tip: …" and friends become callouts rather than plain paragraphs. */
function foldInlineAdvisory(blocks) {
  return blocks.map((block) => {
    if (block.type !== 'p') return block;
    const match = INLINE_ADVISORY.find((entry) => entry.test.test(block.text));
    if (!match) return block;
    const body = block.text.replace(match.test, '').trim();
    if (!body) return block;
    return { type: 'callout', variant: match.variant, title: match.title, body: [body] };
  });
}

function toBlocks(lines) {
  const pieces = extractSteps(extractCodeBlocks(lines));
  const blocks = [];
  let buffer = [];

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    const kept = buffer.map((line) => (isChrome(line) ? '' : line));
    for (const run of toRuns(kept)) blocks.push(...runToBlocks(run));
    buffer = [];
  };

  for (const piece of pieces) {
    if (piece.kind === 'code') {
      flushBuffer();
      blocks.push({ type: 'code', text: piece.text });
      continue;
    }
    if (piece.kind === 'steps') {
      flushBuffer();
      const steps = piece.items.map(toStep);
      blocks.push(
        steps.filter((step) => step.title).length * 2 >= steps.length
          ? { type: 'steps', items: steps.map((step) => ({ title: step.title || step.text, text: step.title ? step.text : '' })) }
          : { type: 'ol', items: piece.items }
      );
      continue;
    }
    buffer.push(piece.text);
  }
  flushBuffer();

  return foldInlineAdvisory(
    foldCallouts(liftTrailingHeadings(foldColonLists(foldCards(blocks))))
  );
}

/* ---------------------------------------------------------------------------
 * Sections
 *
 * A standalone heading opens a new section. Content before the first heading
 * becomes an untitled opening section.
 * ------------------------------------------------------------------------ */
function toSections(lines, idPrefix) {
  const blocks = toBlocks(lines);
  const sections = [];
  let current = { title: null, blocks: [] };

  for (const block of blocks) {
    if (block.type === 'h' && block.level === 3) {
      if (current.blocks.length > 0) sections.push(current);
      current = { title: block.text, blocks: [] };
      continue;
    }
    current.blocks.push(block);
  }
  if (current.blocks.length > 0) sections.push(current);

  return sections
    .filter((section) => section.blocks.length > 0)
    .map((section, index) => ({
      id: `${idPrefix}-s${index + 1}`,
      eyebrow: null,
      duration: null,
      title: section.title ?? 'Overview',
      blocks: section.blocks,
    }));
}

/* ---------------------------------------------------------------------------
 * Questions
 *
 * The quiz widget prints each option followed by the state of a recorded
 * attempt. An option is the right answer when that state is "Correctly
 * selected"/"Correctly checked" (picked, and picking was right) or
 * "Incorrectly unselected"/"Incorrectly unchecked" (not picked, and that was
 * the mistake).
 * ------------------------------------------------------------------------ */
const CORRECT_MARKERS = new Set([
  'Correctly selected',
  'Correctly checked',
  'Incorrectly unselected',
  'Incorrectly unchecked',
]);

const OPTION_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function parseQuestions(lines, idPrefix) {
  const questions = [];

  let stem = [];
  let options = [];
  let rationale = [];
  let phase = 'stem';

  const flush = () => {
    if (options.length >= 2) {
      const text = stem
        .filter((line) => !QUESTION_INTRO.test(line))
        .join(' ')
        .trim();
      const correct = options.filter((option) => option.correct);
      const rationaleText = rationale.join(' ').trim();

      if (text) {
        const id = `${idPrefix}-q${questions.length + 1}`;
        if (correct.length === 1) {
          questions.push({
            id,
            question: text,
            options: options.map((option, index) => ({
              id: OPTION_IDS[index],
              text: option.text,
            })),
            correctOptionId: OPTION_IDS[options.indexOf(correct[0])],
            rationale: rationaleText || 'See the lesson content above.',
          });
        } else if (correct.length > 1) {
          /* Multi-answer questions have no single correct option id, so they
             are kept as short-answer: the reader works it out, then reveals
             the full answer. */
          questions.push({
            id,
            question: `${text} (Select all that apply: ${options.map((o) => o.text).join(' / ')})`,
            options: [],
            answer: `${correct.map((option) => option.text).join('; ')}. ${rationaleText}`.trim(),
          });
        }
      }
    }
    stem = [];
    options = [];
    rationale = [];
    phase = 'stem';
  };

  for (const line of lines) {
    /* A blank line after the rationale closes the question. Only some exports
       print a TAKE AGAIN button, so the blank line is the reliable terminator;
       without it the next question's stem would be read as more rationale. */
    if (line === '') {
      if (phase === 'rationale' && rationale.length > 0) flush();
      continue;
    }

    if (ANSWER_MARKER.test(line)) {
      const text = stem.pop();
      if (text) options.push({ text, correct: CORRECT_MARKERS.has(line) });
      phase = 'options';
      continue;
    }

    if (line === 'SUBMIT') {
      phase = 'verdict';
      continue;
    }

    if (VERDICT.test(line) && phase !== 'stem') {
      phase = 'rationale';
      continue;
    }

    if (line === 'TAKE AGAIN' || line === 'START AGAIN') {
      flush();
      continue;
    }

    if (isChrome(line)) continue;

    if (phase === 'rationale') {
      rationale.push(line);
      continue;
    }

    /* A new stem line after the options have closed means the previous
       question ended without a TAKE AGAIN marker. */
    if (phase === 'verdict' && options.length >= 2) {
      flush();
    }
    stem.push(line);
  }
  flush();

  return questions;
}

/* ---------------------------------------------------------------------------
 * Lessons
 * ------------------------------------------------------------------------ */

function findIndex(lines, test, from = 0) {
  for (let i = from; i < lines.length; i += 1) if (test(lines[i])) return i;
  return -1;
}

/*
 * A lesson's title is its first line — but only when that line reads like a
 * title. Some exports open a lesson with a paragraph instead, and consuming it
 * as the heading would both lose the prose and produce a heading the length of
 * a paragraph. In that case the lesson keeps its whole body and takes its name
 * from the first heading inside it (resolved by the caller).
 */
function parseLesson(lines, number, idPrefix) {
  const firstAt = lines.findIndex((line) => line !== '' && !isChrome(line));
  const first = firstAt === -1 ? null : lines[firstAt];
  const titled = first != null && isHeadingLine(first);

  const title = titled ? first : null;
  let body = lines.slice(titled ? firstAt + 1 : 0);

  /* Objectives -------------------------------------------------------- */
  let objectives = [];
  const objectivesAt = findIndex(body, (line) => OBJECTIVES_HEADING.test(line));
  if (objectivesAt !== -1) {
    const endAt = findIndex(
      body,
      (line) => INTRO_HEADING.test(line) || (isHeadingLine(line) && !OBJECTIVES_HEADING.test(line)),
      objectivesAt + 1
    );
    const slice = body.slice(objectivesAt + 1, endAt === -1 ? body.length : endAt);
    objectives = slice.filter(
      (line) => line !== '' && !isChrome(line) && !/do the following|you will (do|learn)/i.test(line)
    );
    body = [...body.slice(0, objectivesAt), ...body.slice(endAt === -1 ? body.length : endAt)];
  }

  /* "What's next?" trails the lesson and is lifted into a closing callout. */
  let nextUp = null;
  const nextAt = findIndex(body, (line) => NEXT_HEADING.test(line));
  if (nextAt !== -1) {
    nextUp =
      body
        .slice(nextAt + 1)
        .filter((line) => line !== '' && !isChrome(line))
        .join(' ') || null;
    body = body.slice(0, nextAt);
  }

  /* Questions ---------------------------------------------------------
   *
   * The question zone starts at the "Check your knowledge" heading. Whole
   * lessons are sometimes nothing but questions, in which case that heading is
   * the lesson title and the entire body is the zone. Failing both, the first
   * answer-state marker locates the zone and its start is taken from the
   * paragraph break before it. */
  let reviewQuestions = [];
  let questionsAt = -1;

  if (title != null && QUESTIONS_HEADING.test(title)) {
    questionsAt = 0;
  } else {
    const headingAt = findIndex(body, (line) => QUESTIONS_HEADING.test(line));
    if (headingAt !== -1) {
      questionsAt = headingAt + 1;
    } else {
      const markerAt = findIndex(body, (line) => ANSWER_MARKER.test(line));
      if (markerAt !== -1) {
        let start = markerAt;
        /* Walk back over the option list to the blank line above the stem. */
        let blanks = 0;
        while (start > 0 && blanks < 2) {
          start -= 1;
          blanks = body[start] === '' ? blanks + 1 : 0;
        }
        questionsAt = start;
      }
    }
  }

  if (questionsAt !== -1) {
    reviewQuestions = parseQuestions(body.slice(questionsAt), idPrefix);
    /* Some exports list options without recording which one is right. Rather
       than guess an answer key, leave that text in the lesson body as prose. */
    if (reviewQuestions.length > 0) body = body.slice(0, questionsAt);
  }

  const sections = toSections(body, idPrefix);

  if (nextUp) {
    const last = sections[sections.length - 1];
    const block = { type: 'callout', variant: 'note', title: "What's next", body: [nextUp] };
    if (last) last.blocks.push(block);
    else sections.push({ id: `${idPrefix}-s1`, eyebrow: null, duration: null, title: 'Overview', blocks: [block] });
  }

  return { title, objectives, sections, reviewQuestions };
}

/* ---------------------------------------------------------------------------
 * PDF-extracted guides
 *
 * Text pulled out of a PDF arrives hard-wrapped at the column width with page
 * furniture interleaved. Rejoin the wrapped lines and drop the furniture
 * before the normal rules run.
 * ------------------------------------------------------------------------ */
function unwrapPdfText(lines, furniture) {
  const kept = lines.filter(
    (line) => line !== '' && !furniture.includes(line) && !/^\d{1,4}$/.test(line)
  );

  /* Rejoin lines the PDF broke at the column width. A line continues the one
     above it when that one has no terminal punctuation and this one opens in
     lowercase. */
  const joined = [];
  const bullets = [];
  for (const line of kept) {
    const bullet = /^[•*]\s*/.test(line);
    const text = line.replace(/^[•*]\s*/, '');
    const previous = joined[joined.length - 1];

    if (!bullet && previous && !SENTENCE_END.test(previous) && /^[a-z(]/.test(text)) {
      joined[joined.length - 1] = `${previous} ${text}`;
      continue;
    }
    joined.push(text);
    bullets.push(bullet);
  }

  /* The source has no blank lines at all, so nothing downstream can tell one
     paragraph from the next. Re-insert the breaks: every unit stands alone
     except runs of bullets, which stay adjacent so they read as one list. */
  const out = [];
  joined.forEach((text, index) => {
    const runsOn = bullets[index] && bullets[index - 1];
    if (out.length > 0 && !runsOn) out.push('');
    out.push(text);
  });
  return out;
}

/* ---------------------------------------------------------------------------
 * Entry point
 * ------------------------------------------------------------------------ */

function wordCount(lines) {
  return lines.reduce((total, line) => total + (line ? line.split(' ').length : 0), 0);
}

export function estimateDuration(words) {
  const minutes = Math.max(2, Math.round(words / 200));
  return `~${minutes} min`;
}

/* Words a reader actually reads: block text, ignoring ids and type tags. */
export function proseWordCount(sections) {
  let words = 0;
  const count = (text) => {
    if (typeof text === 'string') words += text.split(/\s+/).filter(Boolean).length;
  };

  for (const section of sections) {
    count(section.title);
    for (const block of section.blocks) {
      count(block.text);
      (block.items ?? []).forEach((item) =>
        typeof item === 'string' ? count(item) : [item.title, item.text, item.body].forEach(count)
      );
      (block.body ?? []).forEach(count);
      (block.headers ?? []).forEach(count);
    }
  }
  return words;
}

/*
 * Parse one raw export into topics.
 *
 * `idPrefix` namespaces every generated id so topics from different courses
 * never collide. `pdfFurniture` switches on the PDF unwrapping path.
 */
export function parseCourseText(raw, { idPrefix, pdfFurniture = null } = {}) {
  let lines = normalise(raw);
  if (pdfFurniture) lines = unwrapPdfText(lines, pdfFurniture);
  lines = stripRepeatedBlocks(lines);

  const boundaries = [];
  lines.forEach((line, index) => {
    if (LESSON_MARKER.test(line)) boundaries.push(index);
  });

  const chunks =
    boundaries.length === 0 ? chunkByHeading(lines) : chunkByMarker(lines, boundaries);

  const topics = [];
  chunks.forEach((chunk) => {
    const number = topics.length + 1;
    const prefix = `${idPrefix}-t${number}`;
    const lesson = parseLesson(chunk, number, prefix);

    /* Drop fragments with nothing to read. */
    const hasContent =
      lesson.sections.some((section) => section.blocks.length > 0) ||
      lesson.reviewQuestions.length > 0;
    if (!hasContent) return;

    /* An untitled lesson borrows the name of its first section. */
    const named = lesson.sections.find((section) => section.title !== 'Overview');
    const title = lesson.title ?? named?.title ?? `Topic ${number}`;

    /* A preamble that repeats the first lesson's heading is the same topic
       split across the marker. Fold it in rather than listing it twice. */
    const previous = topics[topics.length - 1];
    if (previous && previous.title === title) {
      previous.sections.push(
        ...lesson.sections.map((section, index) => ({
          ...section,
          id: `${previous.id}-c${index + 1}`,
        }))
      );
      previous.reviewQuestions.push(...lesson.reviewQuestions);
      previous.objectives.push(...lesson.objectives);
      return;
    }

    topics.push({
      id: prefix,
      number,
      title,
      shortTitle: title.length > 46 ? `${title.slice(0, 44).trimEnd()}…` : title,
      summary: summarise(lesson),
      /* Counted from the parsed prose, not the raw chunk, so a topic's estimate
         and the course total are derived from the same words. */
      duration: estimateDuration(proseWordCount(lesson.sections)),
      lede: null,
      objectives: lesson.objectives,
      sections: lesson.sections,
      reviewQuestions: lesson.reviewQuestions,
    });
  });

  return topics;
}

/*
 * Split on the player's "Lesson N of M" markers.
 *
 * The lesson title sits after the marker in most exports and before it in
 * others. When the line above a marker looks like a title and the line below it
 * does not, the title is moved across so it opens its own lesson instead of
 * trailing the previous one.
 */
function chunkByMarker(lines, boundaries) {
  const chunks = [];

  const titleBefore = (at) => {
    let i = at - 1;
    while (i >= 0 && lines[i] === '') i -= 1;
    if (i < 0) return -1;

    let j = at + 1;
    while (j < lines.length && lines[j] === '') j += 1;

    const above = lines[i];
    const below = j < lines.length ? lines[j] : '';
    if (!isHeadingLine(above) || isChrome(above)) return -1;
    return isHeadingLine(below) && !isChrome(below) ? -1 : i;
  };

  const starts = boundaries.map((at) => {
    const moved = titleBefore(at);
    return { marker: at, from: moved === -1 ? at + 1 : moved, titleMoved: moved !== -1 };
  });

  /* Text above the first marker is a course preamble. It becomes its own topic
     when it is headed, and is folded into the first lesson when it is not —
     an unheaded fragment would otherwise surface as "Topic 1". */
  let preamble = [];
  if (starts[0].from > 0) {
    const above = lines.slice(0, starts[0].from);
    const headed = above.find((line) => line !== '' && !isChrome(line));
    if (headed && isHeadingLine(headed) && wordCount(above) > 60) chunks.push(above);
    else preamble = above;
  }

  starts.forEach((start, index) => {
    const end = starts[index + 1]?.from ?? lines.length;
    let chunk = lines.slice(start.from, end);
    /* Drop the marker line itself when the title was taken from above it. */
    if (start.titleMoved) chunk = chunk.filter((line) => !LESSON_MARKER.test(line));
    if (index === 0 && preamble.length) chunk = [...chunk, '', ...preamble];
    chunks.push(chunk);
  });

  return chunks;
}

/*
 * No lesson markers: split on standalone headings instead, merging them into
 * topics of a readable size. The heading scan stops at the closing knowledge
 * check, whose option text would otherwise be mistaken for more headings.
 */
function chunkByHeading(lines) {
  const stopAt = lines.findIndex((line) => QUESTIONS_HEADING.test(line));
  const scanEnd = stopAt === -1 ? lines.length : stopAt;

  /* Chrome counts as a break here: these exports often separate a heading from
     what precedes it with a widget label rather than a blank line. */
  const isBreak = (index) =>
    index < 0 || index >= lines.length || lines[index] === '' || isChrome(lines[index]);

  const headingAt = [];
  for (let index = 0; index < scanEnd; index += 1) {
    if (isBreak(index - 1) && isBreak(index + 1) && isHeadingLine(lines[index]) && !isChrome(lines[index]))
      headingAt.push(index);
  }

  if (headingAt.length < 2) return [lines];

  /*
   * Group headings into topics by weight rather than by count. A one-page
   * summary has half a dozen headings and a few hundred words in total; cutting
   * at every heading would make each "topic" a paragraph long. Sections are
   * accumulated until a topic is substantial enough to stand on its own.
   */
  const MIN_TOPIC_WORDS = 260;
  const MAX_TOPICS = 14;
  const chunks = [];

  let start = headingAt[0];
  let words = 0;

  for (let i = 0; i < headingAt.length; i += 1) {
    const from = headingAt[i];
    const to = headingAt[i + 1] ?? scanEnd;
    words += wordCount(lines.slice(from, to));

    const isLast = i === headingAt.length - 1;
    const enough = words >= MIN_TOPIC_WORDS;
    const roomLeft = chunks.length < MAX_TOPICS - 1;

    if (isLast || (enough && roomLeft)) {
      chunks.push(lines.slice(start, to));
      start = to;
      words = 0;
    }
  }

  if (headingAt[0] > 0) chunks.unshift(lines.slice(0, headingAt[0]));
  if (stopAt !== -1) chunks.push(lines.slice(stopAt));

  return chunks;
}

/* First paragraph of the topic, clipped to one line, used as the outline
   subtitle. Taken verbatim from the source rather than written fresh. */
function summarise(lesson) {
  for (const section of lesson.sections) {
    for (const block of section.blocks) {
      if (block.type !== 'p') continue;
      const text = block.text.trim();
      if (text.length < 40) continue;
      if (text.length <= 150) return text;
      const clipped = text.slice(0, 147);
      const lastSpace = clipped.lastIndexOf(' ');
      return `${clipped.slice(0, lastSpace > 80 ? lastSpace : 147).trimEnd()}…`;
    }
  }
  return lesson.objectives[0] ?? 'Course content.';
}
