// Aptitude practice and timed tests.
//
// Quantitative and logical questions are generated from seeded templates:
// the same (topic, set) always yields the same questions, every answer is
// computed rather than typed in, and nothing is copied from anywhere. Verbal
// questions come from a small hand-written bank. Each question records the
// time a prepared candidate should need, used for pacing feedback.

import { seededRandom, seededShuffle } from "./problems.js";

const int = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];
const round2 = (value) => Math.round(value * 100) / 100;
const fmt = (value) => (Number.isInteger(value) ? String(value) : String(round2(value)));
const rupees = (value) => `₹${fmt(value)}`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** Build an MCQ with exactly four distinct options, answer position seeded. */
function mcq(rnd, { prompt, answer, distractors, explanation, seconds = 60 }) {
  const seen = new Set([answer]);
  const options = [answer];
  for (const option of distractors) {
    if (options.length === 4) break;
    if (option != null && !seen.has(option)) { seen.add(option); options.push(option); }
  }
  let bump = 1;
  while (options.length < 4) {
    const numeric = Number(String(answer).replace(/[^\d.-]/g, ""));
    const candidate = Number.isFinite(numeric) ? String(answer).replace(String(numeric), fmt(numeric + bump * (numeric >= 10 ? Math.ceil(numeric / 10) : 1))) : `${answer} (${bump})`;
    if (!seen.has(candidate)) { seen.add(candidate); options.push(candidate); }
    bump += 1;
  }
  const shuffled = seededShuffle(options, Math.floor(rnd() * 1e9));
  return { prompt, options: shuffled, answer: shuffled.indexOf(answer), explanation, seconds };
}

/* ── quantitative ──────────────────────────────────────────────────────── */

const QUANT = {
  percentages(rnd) {
    if (rnd() < 0.5) {
      const p = pick(rnd, [5, 10, 12.5, 15, 20, 25, 30, 40, 60, 75]);
      const n = int(rnd, 2, 30) * 40;
      const answer = (p * n) / 100;
      return mcq(rnd, { prompt: `What is ${p}% of ${n}?`, answer: fmt(answer), distractors: [fmt(answer * 10), fmt(n - answer), fmt(answer / 2), fmt(answer + n / 20)], explanation: `${p}% of ${n} = ${p}/100 × ${n} = ${fmt(answer)}.`, seconds: 30 });
    }
    const up = pick(rnd, [10, 20, 25, 30, 40, 50]);
    const down = pick(rnd, [10, 20, 25, 30, 40, 50].filter((value) => value !== up));
    const net = up - down - (up * down) / 100;
    const label = (value) => (value === 0 ? "No change" : `${fmt(Math.abs(value))}% ${value > 0 ? "increase" : "decrease"}`);
    return mcq(rnd, {
      prompt: `A price rises by ${up}% and then falls by ${down}%. What is the overall change?`,
      answer: label(net),
      distractors: [label(up - down), label(up - down + (up * down) / 100), label(-(up * down) / 100), label(net + 2)],
      explanation: `Successive change = a + b + ab/100 = ${up} + (−${down}) + (${up} × −${down})/100 = ${fmt(net)}%.`,
      seconds: 45,
    });
  },
  "profit-loss"(rnd) {
    const cost = int(rnd, 4, 40) * 50;
    const profit = pick(rnd, [10, 12, 15, 20, 25, 30, 40]);
    if (rnd() < 0.5) {
      const sell = cost * (1 + profit / 100);
      return mcq(rnd, { prompt: `An item costs ${rupees(cost)}. At what price must it be sold for a ${profit}% profit?`, answer: rupees(sell), distractors: [rupees(cost + profit), rupees(cost * (1 - profit / 100)), rupees(sell + cost / 10), rupees(cost * (1 + profit / 1000))], explanation: `SP = CP × (1 + ${profit}/100) = ${cost} × ${fmt(1 + profit / 100)} = ${fmt(sell)}.`, seconds: 40 });
    }
    // Cost is a multiple of (100 − discount) so every price is a whole number.
    const discount = pick(rnd, [10, 20, 25]);
    const cost2 = (100 - discount) * int(rnd, 2, 20);
    const marked = (cost2 * (100 + profit)) / (100 - discount);
    const sell = (marked * (100 - discount)) / 100;
    return mcq(rnd, {
      prompt: `A shop marks an item at ${rupees(marked)} and gives a ${discount}% discount. If the item cost ${rupees(cost2)}, what is the profit percentage?`,
      answer: `${fmt(profit)}%`,
      distractors: [`${fmt(profit + discount)}%`, `${fmt(((marked - cost2) / cost2) * 100)}%`, `${discount}%`, `${fmt(Math.abs(profit - discount))}%`],
      explanation: `Selling price = ${fmt(marked)} × ${fmt((100 - discount) / 100)} = ${fmt(sell)}. Profit = ${fmt(sell - cost2)} on ${cost2}, i.e. ${fmt(profit)}%.`,
      seconds: 75,
    });
  },
  "simple-interest"(rnd) {
    const principal = int(rnd, 2, 40) * 500;
    const rate = pick(rnd, [4, 5, 6, 8, 10, 12]);
    const years = int(rnd, 2, 6);
    const si = (principal * rate * years) / 100;
    const askAmount = rnd() < 0.4;
    return mcq(rnd, {
      prompt: `Find the ${askAmount ? "amount" : "simple interest"} on ${rupees(principal)} at ${rate}% per annum for ${years} years.`,
      answer: rupees(askAmount ? principal + si : si),
      distractors: [rupees(askAmount ? si : principal + si), rupees((principal * rate) / 100), rupees(principal * (1 + rate / 100) ** years - principal), rupees(si + principal / 10)],
      explanation: `SI = P × R × T / 100 = ${principal} × ${rate} × ${years} / 100 = ${fmt(si)}${askAmount ? `; amount = ${principal} + ${fmt(si)} = ${fmt(principal + si)}` : ""}.`,
      seconds: 45,
    });
  },
  "compound-interest"(rnd) {
    const principal = int(rnd, 1, 20) * 1000;
    const rate = pick(rnd, [5, 10, 20]);
    const years = pick(rnd, [2, 3]);
    const amount = principal * (1 + rate / 100) ** years;
    const ci = amount - principal;
    return mcq(rnd, {
      prompt: `What is the compound interest on ${rupees(principal)} at ${rate}% per annum for ${years} years, compounded annually?`,
      answer: rupees(round2(ci)),
      distractors: [rupees((principal * rate * years) / 100), rupees(round2(amount)), rupees(round2(ci + (principal * rate) / 100)), rupees(round2(ci - principal * (rate / 100) ** 2))],
      explanation: `A = P(1 + R/100)^T = ${principal} × ${fmt(1 + rate / 100)}^${years} = ${fmt(round2(amount))}. CI = A − P = ${fmt(round2(ci))}. (Simple interest would be ${fmt((principal * rate * years) / 100)}.)`,
      seconds: 75,
    });
  },
  ratio(rnd) {
    const a = int(rnd, 1, 7);
    let b = int(rnd, 1, 7);
    if (b === a) b += 1;
    const unit = int(rnd, 5, 40) * 10;
    const total = (a + b) * unit;
    return mcq(rnd, {
      prompt: `${rupees(total)} is shared between Asha and Ravi in the ratio ${a} : ${b}. How much does Ravi get?`,
      answer: rupees(b * unit),
      distractors: [rupees(a * unit), rupees(total / 2), rupees((b / a) * unit), rupees(b * unit + unit)],
      explanation: `Total parts = ${a} + ${b} = ${a + b}; one part = ${total}/${a + b} = ${unit}; Ravi gets ${b} × ${unit} = ${b * unit}.`,
      seconds: 40,
    });
  },
  averages(rnd) {
    const count = int(rnd, 5, 12);
    const average = int(rnd, 30, 70);
    const shift = int(rnd, 1, 4);
    const leaving = int(rnd, 30, 70);
    const joining = leaving + shift * count;
    return mcq(rnd, {
      prompt: `The average weight of ${count} people is ${average} kg. When one person weighing ${leaving} kg is replaced by a new person, the average rises by ${shift} kg. What does the new person weigh?`,
      answer: `${joining} kg`,
      distractors: [`${leaving + shift} kg`, `${average + shift} kg`, `${joining - count} kg`, `${leaving + shift * (count - 1)} kg`],
      explanation: `Total weight rises by ${shift} × ${count} = ${shift * count} kg, so the newcomer weighs ${leaving} + ${shift * count} = ${joining} kg.`,
      seconds: 60,
    });
  },
  "time-work"(rnd) {
    const [a, b, together] = pick(rnd, [[10, 15, 6], [12, 24, 8], [20, 30, 12], [6, 12, 4], [9, 18, 6], [40, 60, 24], [21, 42, 14], [24, 40, 15], [36, 45, 20], [12, 4, 3], [30, 45, 18]]);
    return mcq(rnd, {
      prompt: `A can finish a job in ${a} days and B in ${b} days. Working together, how many days do they take?`,
      answer: `${together} days`,
      distractors: [`${(a + b) / 2} days`, `${a + b} days`, `${Math.abs(a - b)} days`, `${together + 2} days`],
      explanation: `Per day they finish 1/${a} + 1/${b} = ${(a + b) / gcd(a + b, a * b)}/${(a * b) / gcd(a + b, a * b)} of the job, so together they need ${a} × ${b} / (${a} + ${b}) = ${together} days.`,
      seconds: 50,
    });
  },
  "speed-distance"(rnd) {
    const kmph = pick(rnd, [36, 54, 72, 90, 108]);
    const ms = (kmph * 5) / 18;
    const seconds = int(rnd, 8, 30);
    const length = ms * seconds;
    return mcq(rnd, {
      prompt: `A train ${length} m long runs at ${kmph} km/h. How long does it take to pass a signal post?`,
      answer: `${seconds} s`,
      distractors: [`${fmt(length / kmph)} s`, `${seconds * 2} s`, `${fmt((length / kmph) * 3.6 * 2)} s`, `${seconds + 5} s`],
      explanation: `${kmph} km/h = ${kmph} × 5/18 = ${ms} m/s. Time = length / speed = ${length} / ${ms} = ${seconds} s.`,
      seconds: 45,
    });
  },
  "lcm-hcf"(rnd) {
    const h = int(rnd, 2, 12);
    let p = int(rnd, 2, 9);
    let q = int(rnd, 2, 9);
    while (gcd(p, q) !== 1 || p === q) { p = int(rnd, 2, 9); q = int(rnd, 2, 9); }
    const x = h * p;
    const y = h * q;
    const lcm = h * p * q;
    const askLcm = rnd() < 0.5;
    return mcq(rnd, {
      prompt: `What is the ${askLcm ? "LCM" : "HCF"} of ${x} and ${y}?`,
      answer: String(askLcm ? lcm : h),
      distractors: [String(askLcm ? h : lcm), String(x * y), String(askLcm ? lcm * 2 : h * 2), String(Math.min(x, y))],
      explanation: `${x} = ${h} × ${p} and ${y} = ${h} × ${q}, with ${p} and ${q} sharing no factor. HCF = ${h}; LCM = ${h} × ${p} × ${q} = ${lcm}.`,
      seconds: 40,
    });
  },
  remainders(rnd) {
    const base = pick(rnd, [2, 3, 7]);
    const power = int(rnd, 20, 99);
    const answer = Number(BigInt(base) ** BigInt(power) % 5n);
    const cycle = Array.from({ length: 4 }, (_, i) => Number(BigInt(base) ** BigInt(i + 1) % 5n));
    return mcq(rnd, {
      prompt: `What is the remainder when ${base}^${power} is divided by 5?`,
      answer: String(answer),
      distractors: ["0", "1", "2", "3", "4"].filter((value) => value !== String(answer)),
      explanation: `Powers of ${base} mod 5 repeat every 4: ${cycle.join(", ")}. ${power} is position ${((power - 1) % 4) + 1} in that cycle (${power} mod 4 = ${power % 4}), so the remainder is ${cycle[(power - 1) % 4]}.`,
      seconds: 50,
    });
  },
};

/* ── logical ───────────────────────────────────────────────────────────── */

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const LOGICAL = {
  clocks(rnd) {
    const hour = int(rnd, 1, 12);
    const minute = pick(rnd, [0, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
    const raw = Math.abs(30 * (hour % 12) - 5.5 * minute);
    const angle = Math.min(raw, 360 - raw);
    const label = (value) => `${fmt(value)}°`;
    return mcq(rnd, {
      prompt: `What is the smaller angle between the hour and minute hands at ${hour}:${String(minute).padStart(2, "0")}?`,
      answer: label(angle),
      distractors: [label(Math.abs(30 * (hour % 12) - 6 * minute) % 360), label(360 - angle), label(Math.abs(angle - 15)), label(angle + 7.5)],
      explanation: `Angle = |30H − 5.5M| = |30 × ${hour % 12} − 5.5 × ${minute}| = ${fmt(raw)}°${raw > 180 ? `; the smaller angle is 360 − ${fmt(raw)} = ${fmt(angle)}°` : ""}. The hour hand moves 0.5° per minute, which is why it's 5.5, not 6.`,
      seconds: 45,
    });
  },
  calendars(rnd) {
    const year = int(rnd, 2001, 2035);
    const month = int(rnd, 0, 11);
    const day = int(rnd, 1, 28);
    const date = new Date(Date.UTC(year, month, day));
    const reference = Date.UTC(2000, 0, 1); // a Saturday
    const days = Math.round((date.getTime() - reference) / 86400000);
    const weekday = WEEKDAYS[date.getUTCDay()];
    return mcq(rnd, {
      prompt: `What day of the week was ${day} ${MONTHS[month]} ${year}?`,
      answer: weekday,
      distractors: [WEEKDAYS[(date.getUTCDay() + 1) % 7], WEEKDAYS[(date.getUTCDay() + 6) % 7], WEEKDAYS[(date.getUTCDay() + 2) % 7], WEEKDAYS[(date.getUTCDay() + 3) % 7]],
      explanation: `1 January 2000 was a Saturday. ${day} ${MONTHS[month]} ${year} is ${days} days later; ${days} mod 7 = ${days % 7} odd day${days % 7 === 1 ? "" : "s"}, so move ${days % 7} day${days % 7 === 1 ? "" : "s"} on from Saturday: ${weekday}.`,
      seconds: 90,
    });
  },
  "number-series"(rnd) {
    const kind = pick(rnd, ["arithmetic", "geometric", "squares", "second-order"]);
    let terms;
    let next;
    let rule;
    if (kind === "arithmetic") {
      const start = int(rnd, 2, 40);
      const step = int(rnd, 3, 15);
      terms = Array.from({ length: 5 }, (_, i) => start + step * i);
      next = start + step * 5;
      rule = `add ${step} each time`;
    } else if (kind === "geometric") {
      const start = int(rnd, 2, 6);
      const ratio = int(rnd, 2, 3);
      terms = Array.from({ length: 5 }, (_, i) => start * ratio ** i);
      next = start * ratio ** 5;
      rule = `multiply by ${ratio} each time`;
    } else if (kind === "squares") {
      const offset = int(rnd, -3, 5);
      const from = int(rnd, 2, 6);
      terms = Array.from({ length: 5 }, (_, i) => (from + i) ** 2 + offset);
      next = (from + 5) ** 2 + offset;
      rule = `n² ${offset >= 0 ? "+" : "−"} ${Math.abs(offset)} for n = ${from}, ${from + 1}, …`;
    } else {
      const start = int(rnd, 1, 10);
      const firstGap = int(rnd, 1, 5);
      const growth = int(rnd, 1, 4);
      terms = [start];
      for (let i = 0; i < 4; i += 1) terms.push(terms[i] + firstGap + growth * i);
      next = terms[4] + firstGap + growth * 4;
      rule = `the gaps grow by ${growth}: ${[0, 1, 2, 3, 4].map((i) => firstGap + growth * i).join(", ")}`;
    }
    return mcq(rnd, {
      prompt: `What comes next? ${terms.join(", ")}, ?`,
      answer: String(next),
      distractors: [String(next + 1), String(next - (terms[4] - terms[3])), String(terms[4] + (terms[4] - terms[3])), String(next + (terms[4] - terms[3]))],
      explanation: `Rule: ${rule}. Next term = ${next}.`,
      seconds: 45,
    });
  },
  "coding-decoding"(rnd) {
    const words = ["CAT", "DOG", "BOOK", "CODE", "TREE", "LAMP", "RING", "STAR", "FISH", "MILK", "DESK", "PLAN"];
    const shift = pick(rnd, [1, 2, 3, 4, -1, -2]);
    const encode = (word, by) => word.split("").map((ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + by + 26) % 26) + 65)).join("");
    const sample = pick(rnd, words);
    let target = pick(rnd, words);
    while (target === sample) target = pick(rnd, words);
    return mcq(rnd, {
      prompt: `In a code, ${sample} is written as ${encode(sample, shift)}. How is ${target} written in that code?`,
      answer: encode(target, shift),
      distractors: [encode(target, -shift), encode(target, shift + 1), encode(target, shift - 1), encode(target, shift).split("").reverse().join("")],
      explanation: `Each letter moves ${Math.abs(shift)} place${Math.abs(shift) === 1 ? "" : "s"} ${shift > 0 ? "forward" : "back"} in the alphabet (${sample[0]} → ${encode(sample[0], shift)}). Applying that to ${target} gives ${encode(target, shift)}.`,
      seconds: 45,
    });
  },
  directions(rnd) {
    const [dx, dy, hyp] = pick(rnd, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15]]);
    const extra = int(rnd, 2, 6);
    const east = rnd() < 0.5;
    const steps = [`${dy + extra} km north`, `${dx} km ${east ? "east" : "west"}`, `${extra} km south`];
    return mcq(rnd, {
      prompt: `Maya walks ${steps.join(", then ")}. How far is she from her starting point in a straight line?`,
      answer: `${hyp} km`,
      distractors: [`${dx + dy} km`, `${dy + extra + dx + extra} km`, `${hyp + extra} km`, `${Math.abs(dx - dy) || 1} km`],
      explanation: `Net north = ${dy + extra} − ${extra} = ${dy} km; net ${east ? "east" : "west"} = ${dx} km. Distance = √(${dy}² + ${dx}²) = ${hyp} km.`,
      seconds: 60,
    });
  },
  "odd-one-out"(rnd) {
    const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73];
    const oddComposites = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91];
    const chosen = seededShuffle(primes, Math.floor(rnd() * 1e9)).slice(0, 3);
    const odd = pick(rnd, oddComposites);
    const factor = [3, 7, 11, 13].find((p) => odd % p === 0);
    return mcq(rnd, {
      prompt: `Which number is the odd one out? ${seededShuffle([...chosen, odd], Math.floor(rnd() * 1e9)).join(", ")}`,
      answer: String(odd),
      distractors: chosen.map(String),
      explanation: `${chosen.join(", ")} are prime. ${odd} = ${factor} × ${odd / factor}, so it isn't.`,
      seconds: 40,
    });
  },
};

/* ── verbal (hand-written bank) ────────────────────────────────────────── */

const VERBAL_BANK = {
  synonyms: [
    ["Choose the word closest in meaning to DILIGENT.", "Hard-working", ["Careless", "Clever", "Hesitant"], "Diligent means showing steady, careful effort."],
    ["Choose the word closest in meaning to CANDID.", "Frank", ["Secretive", "Sweet", "Cautious"], "A candid remark is open and honest."],
    ["Choose the word closest in meaning to MITIGATE.", "Lessen", ["Worsen", "Delay", "Measure"], "To mitigate is to make something less severe."],
    ["Choose the word closest in meaning to CONCISE.", "Brief", ["Accurate", "Wordy", "Complex"], "Concise writing says a lot in few words."],
    ["Choose the word closest in meaning to ARDUOUS.", "Strenuous", ["Pleasant", "Brief", "Artistic"], "An arduous task demands great effort."],
    ["Choose the word closest in meaning to PRUDENT.", "Sensible", ["Reckless", "Proud", "Hasty"], "Prudent means showing good judgement about the future."],
    ["Choose the word closest in meaning to OBSOLETE.", "Outdated", ["Obvious", "Hidden", "Durable"], "Obsolete things are no longer in use."],
    ["Choose the word closest in meaning to AMBIGUOUS.", "Unclear", ["Ambitious", "Certain", "Friendly"], "Ambiguous means open to more than one interpretation."],
    ["Choose the word closest in meaning to RESILIENT.", "Tough", ["Fragile", "Silent", "Resistant to change"], "Resilient people recover quickly from setbacks."],
    ["Choose the word closest in meaning to METICULOUS.", "Painstaking", ["Messy", "Quick", "Musical"], "Meticulous means paying great attention to detail."],
  ],
  antonyms: [
    ["Choose the word most opposite in meaning to SCARCE.", "Plentiful", ["Rare", "Scared", "Tiny"], "Scarce means in short supply; plentiful is the opposite."],
    ["Choose the word most opposite in meaning to OPAQUE.", "Transparent", ["Dark", "Heavy", "Solid"], "Opaque things block light; transparent ones let it through."],
    ["Choose the word most opposite in meaning to FRUGAL.", "Extravagant", ["Thrifty", "Fragile", "Generous only to friends"], "Frugal means economical; extravagant means wasteful."],
    ["Choose the word most opposite in meaning to VERBOSE.", "Succinct", ["Loud", "Verbal", "Lengthy"], "Verbose means using too many words."],
    ["Choose the word most opposite in meaning to BENEVOLENT.", "Malicious", ["Kind", "Lazy", "Nervous"], "Benevolent means well-meaning; malicious means intending harm."],
    ["Choose the word most opposite in meaning to TRANSIENT.", "Permanent", ["Fleeting", "Moving", "Transparent"], "Transient means lasting only a short time."],
    ["Choose the word most opposite in meaning to CONDEMN.", "Praise", ["Blame", "Contain", "Forgive later"], "To condemn is to express strong disapproval."],
    ["Choose the word most opposite in meaning to TIMID.", "Bold", ["Shy", "Tiny", "Punctual"], "Timid means lacking courage."],
    ["Choose the word most opposite in meaning to ASCEND.", "Descend", ["Climb", "Assent", "Rise"], "Ascend means go up; descend means go down."],
    ["Choose the word most opposite in meaning to NOVICE.", "Expert", ["Beginner", "Author", "Newcomer"], "A novice is new to something; an expert is highly skilled."],
  ],
  "sentence-correction": [
    ["Pick the grammatically correct sentence.", "Neither of the answers is correct.", ["Neither of the answers are correct.", "Neither of the answer is correct.", "Neither of the answers were correct."], "‘Neither’ is singular, so it takes ‘is’."],
    ["Pick the grammatically correct sentence.", "She has lived here since 2019.", ["She is living here since 2019.", "She lives here since 2019.", "She has lived here from 2019."], "‘Since’ with a point in time takes the present perfect."],
    ["Pick the grammatically correct sentence.", "Each of the students has a laptop.", ["Each of the students have a laptop.", "Each of the student has a laptop.", "Each of the students having a laptop."], "‘Each’ is singular."],
    ["Pick the grammatically correct sentence.", "If I were you, I would apply.", ["If I was you, I will apply.", "If I am you, I would apply.", "If I were you, I will apply."], "Hypotheticals use ‘were’ with ‘would’."],
    ["Pick the grammatically correct sentence.", "The team is meeting its deadline.", ["The team are meeting its deadline.", "The team is meeting it's deadline.", "The team is meeting their's deadline."], "‘Its’ is the possessive; ‘it's’ means ‘it is’."],
    ["Pick the grammatically correct sentence.", "He is one of the engineers who work late.", ["He is one of the engineers who works late.", "He is one of the engineer who work late.", "He is one of engineers who works late."], "‘Who’ refers to ‘engineers’ (plural), so ‘work’."],
    ["Pick the grammatically correct sentence.", "Fewer people attended this year.", ["Less people attended this year.", "Lesser people attended this year.", "Few people attended more this year."], "Use ‘fewer’ for countable nouns."],
    ["Pick the grammatically correct sentence.", "Between you and me, the plan is risky.", ["Between you and I, the plan is risky.", "Among you and me, the plan is risky.", "Between you and myself, the plan is risky."], "Prepositions take object pronouns: ‘me’."],
  ],
  "fill-blanks": [
    ["The results were consistent ___ our predictions.", "with", ["to", "by", "for"], "‘Consistent with’ is the standard pairing."],
    ["She is proficient ___ three languages.", "in", ["at", "on", "with"], "‘Proficient in’ a subject or skill."],
    ["The committee will ___ its decision next week.", "announce", ["pronounce", "denounce", "renounce"], "To announce is to make public."],
    ["His argument was so ___ that nobody could refute it.", "cogent", ["vague", "flimsy", "tentative"], "Cogent means clear and convincing."],
    ["We need to ___ the risks before we launch.", "assess", ["access", "excess", "assist"], "To assess is to evaluate."],
    ["The new policy will ___ all employees.", "affect", ["effect", "infect", "afflict"], "‘Affect’ is the verb; ‘effect’ is usually the noun."],
    ["Despite the rain, the event went ___ as planned.", "ahead", ["forward on", "along", "upon"], "‘Went ahead’ means proceeded."],
    ["The data is ___ to change without notice.", "subject", ["liable of", "prone for", "open with"], "‘Subject to’ means likely to be affected by."],
  ],
};

function verbalQuestion(topic, index, rnd) {
  const bank = VERBAL_BANK[topic];
  const [prompt, answer, distractors, explanation] = bank[index % bank.length];
  return mcq(rnd, { prompt, answer, distractors, explanation, seconds: 30 });
}

/* ── catalog ───────────────────────────────────────────────────────────── */

export const AREAS = [
  { id: "quant", title: "Quantitative", summary: "Arithmetic, percentages, interest, work and motion.", topics: [
    ["percentages", "Percentages"], ["profit-loss", "Profit & loss"], ["simple-interest", "Simple interest"], ["compound-interest", "Compound interest"], ["ratio", "Ratio & proportion"], ["averages", "Averages"], ["time-work", "Time & work"], ["speed-distance", "Speed & distance"], ["lcm-hcf", "LCM & HCF"], ["remainders", "Remainders"],
  ] },
  { id: "logical", title: "Logical", summary: "Patterns, codes, clocks, calendars and directions.", topics: [
    ["clocks", "Clocks"], ["calendars", "Calendars"], ["number-series", "Number series"], ["coding-decoding", "Coding–decoding"], ["directions", "Direction sense"], ["odd-one-out", "Odd one out"],
  ] },
  { id: "verbal", title: "Verbal", summary: "Vocabulary, grammar and usage.", topics: [
    ["synonyms", "Synonyms"], ["antonyms", "Antonyms"], ["sentence-correction", "Sentence correction"], ["fill-blanks", "Fill in the blanks"],
  ] },
].map((area) => ({ ...area, topics: area.topics.map(([id, title]) => ({ id, title, area: area.id, generated: area.id !== "verbal", bankSize: VERBAL_BANK[id]?.length || null })) }));

export const TOPICS = Object.fromEntries(AREAS.flatMap((area) => area.topics.map((topic) => [topic.id, topic])));

export function generateQuestion(topicId, seed, index = 0) {
  const rnd = seededRandom(`${topicId}|${seed}|${index}`);
  const generator = QUANT[topicId] || LOGICAL[topicId];
  const base = generator ? generator(rnd) : verbalQuestion(topicId, index, rnd);
  return { id: `${topicId}:${seed}:${index}`, topic: topicId, ...base };
}

/** A practice set: `count` distinct questions from one topic. */
export function practiceSet(topicId, setNumber, count = 10) {
  const topic = TOPICS[topicId];
  const size = topic?.bankSize ? Math.min(count, topic.bankSize) : count;
  const questions = [];
  const prompts = new Set();
  for (let index = 0; questions.length < size && index < size * 6; index += 1) {
    // Verbal sets walk the bank in a seeded order, so sets differ in order.
    const bankIndex = topic?.bankSize ? seededShuffle([...Array(topic.bankSize).keys()], `${topicId}#${setNumber}`)[index % topic.bankSize] : index;
    const question = generateQuestion(topicId, `set-${setNumber}`, bankIndex);
    if (!prompts.has(question.prompt)) { prompts.add(question.prompt); questions.push(question); }
  }
  return questions;
}

/** A timed test mixing an area's topics (or all areas). */
export function buildMock(areaId, seed, count = 20) {
  const topics = (areaId === "mixed" ? AREAS.flatMap((area) => area.topics) : AREAS.find((area) => area.id === areaId)?.topics || []).map((topic) => topic.id);
  const order = seededShuffle(topics, `mock-${seed}`);
  const questions = [];
  const prompts = new Set();
  let index = 0;
  while (questions.length < count && index < count * 8) {
    const topicId = order[index % order.length];
    const question = generateQuestion(topicId, `mock-${seed}`, index);
    if (!prompts.has(question.prompt)) { prompts.add(question.prompt); questions.push(question); }
    index += 1;
  }
  return questions;
}

export const DEFAULT_POLICY = { correct: 1, wrong: -0.25, skipped: 0 };

/** Deterministic scoring against the policy frozen when the session started. */
export function scoreSession(questions, answers, policy = DEFAULT_POLICY) {
  const byTopic = {};
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  questions.forEach((question) => {
    const choice = answers[question.id]?.choice;
    const bucket = (byTopic[question.topic] ||= { correct: 0, wrong: 0, skipped: 0, total: 0, seconds: 0 });
    bucket.total += 1;
    bucket.seconds += answers[question.id]?.seconds || 0;
    if (choice == null) { skipped += 1; bucket.skipped += 1; } else if (choice === question.answer) { correct += 1; bucket.correct += 1; } else { wrong += 1; bucket.wrong += 1; }
  });
  const score = correct * policy.correct + wrong * policy.wrong + skipped * policy.skipped;
  return { score: round2(score), max: questions.length * policy.correct, correct, wrong, skipped, byTopic, accuracy: correct + wrong ? correct / (correct + wrong) : null };
}
