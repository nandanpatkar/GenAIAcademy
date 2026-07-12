// Auto-generated missing manual structure data
export const MANUAL_STRUCTURE = [
  {
    "slug": "logic",
    "name": "Logic",
    "icon": "ti-logic-and",
    "blurb": "Clear reasoning from the ground up - true/false, if-then, proof, and spotting bad arguments.",
    "guides": [
      {
        "slug": "what-logic-actually-is",
        "title": "What Logic Actually Is",
        "summary": "Logic is the skill of working out what follows from what - the quiet foundation under every line of code, every proof, and every argument you'll ever need to judge. This is where it starts.",
        "order": 1,
        "phases": [
          {
            "slug": "01-logic-is-the-skill-under-everything",
            "title": "Logic Is the Skill Under Everything",
            "phaseNum": "1",
            "order": 1,
            "summary": "Logic is the study of what follows from what - not facts, but the connections between them. It's the quiet foundation under code, math, and every argument, and it's learnable.",
            "filePath": "/guides/logic/what-logic-actually-is/01-logic-is-the-skill-under-everything.md"
          },
          {
            "slug": "02-statements-truth-and-validity",
            "title": "Statements, Truth, and Validity",
            "phaseNum": "2",
            "order": 2,
            "summary": "A statement can be true; an argument can be valid; only a sound argument is both. Confusing truth with validity is the single biggest reasoning mistake - here's how to never make it again.",
            "filePath": "/guides/logic/what-logic-actually-is/02-statements-truth-and-validity.md"
          },
          {
            "slug": "03-the-three-ways-we-reason",
            "title": "The Three Ways We Reason",
            "phaseNum": "3",
            "order": 3,
            "summary": "Deduction guarantees, induction generalizes, abduction guesses the best explanation. Knowing which of the three you're using - and where each fails - is the core of reasoning well.",
            "filePath": "/guides/logic/what-logic-actually-is/03-the-three-ways-we-reason.md"
          }
        ]
      },
      {
        "slug": "propositional-logic",
        "title": "Propositional Logic",
        "summary": "The algebra of true and false: how AND, OR, and NOT combine statements, how truth tables prove what a compound claim really does, and the equivalences (like De Morgan's laws) that let you rewrite and negate conditions with confidence.",
        "order": 2,
        "phases": [
          {
            "slug": "01-connectives-and-or-not",
            "title": "Connectives: AND, OR, NOT",
            "phaseNum": "1",
            "order": 1,
            "summary": "AND is true only when both parts are; OR is true when at least one is (the inclusive or that trips people up); NOT flips. The three operators that build every compound statement.",
            "filePath": "/guides/logic/propositional-logic/01-connectives-and-or-not.md"
          },
          {
            "slug": "02-truth-tables",
            "title": "Truth Tables",
            "phaseNum": "2",
            "order": 2,
            "summary": "A truth table lists every possible combination of true/false for the inputs and shows the result - the foolproof way to know exactly what a compound statement does, and to spot tautologies and contradictions.",
            "filePath": "/guides/logic/propositional-logic/02-truth-tables.md"
          },
          {
            "slug": "03-equivalences-and-de-morgan",
            "title": "Equivalences & De Morgan's Laws",
            "phaseNum": "3",
            "order": 3,
            "summary": "Two statements are logically equivalent when they have identical truth tables. De Morgan's laws - how to correctly distribute a NOT across AND/OR - are the equivalence you'll use most when negating and simplifying conditions.",
            "filePath": "/guides/logic/propositional-logic/03-equivalences-and-de-morgan.md"
          }
        ]
      },
      {
        "slug": "implication-and-conditionals",
        "title": "Implication & Conditionals",
        "summary": "'If P then Q' is the most misunderstood idea in logic. This guide nails what it really means (and when it's true), untangles converse/inverse/contrapositive, and makes the difference between necessary and sufficient conditions finally click.",
        "order": 3,
        "phases": [
          {
            "slug": "01-what-if-p-then-q-means",
            "title": "What \\\"If P Then Q\\\" Really Means",
            "phaseNum": "1",
            "order": 1,
            "summary": "A conditional 'if P then Q' is false in exactly one situation: P true and Q false. Everywhere else it's true - including the surprising 'vacuously true' cases where P is false.",
            "filePath": "/guides/logic/implication-and-conditionals/01-what-if-p-then-q-means.md"
          },
          {
            "slug": "02-converse-inverse-contrapositive",
            "title": "Converse, Inverse, Contrapositive",
            "phaseNum": "2",
            "order": 2,
            "summary": "From 'if P then Q' you can form three variants. The contrapositive ('if not Q then not P') is always equivalent; the converse and inverse are not - and assuming they are is the most common reasoning error there is.",
            "filePath": "/guides/logic/implication-and-conditionals/02-converse-inverse-contrapositive.md"
          },
          {
            "slug": "03-necessary-and-sufficient",
            "title": "Necessary vs Sufficient Conditions",
            "phaseNum": "3",
            "order": 3,
            "summary": "If P is enough to guarantee Q, P is sufficient. If Q can't happen without P, P is necessary. 'If and only if' means both. Mixing these up is behind a surprising amount of buggy logic and muddled requirements.",
            "filePath": "/guides/logic/implication-and-conditionals/03-necessary-and-sufficient.md"
          }
        ]
      },
      {
        "slug": "predicate-logic-and-quantifiers",
        "title": "Predicate Logic & Quantifiers",
        "summary": "Propositional logic treats whole statements as atoms. Predicate logic looks inside them - at properties of things and the words 'for all' and 'there exists' - which is how you say precise things about whole collections at once.",
        "order": 4,
        "phases": [
          {
            "slug": "01-predicates-statements-with-variables",
            "title": "Predicates: Statements With Variables",
            "phaseNum": "1",
            "order": 1,
            "summary": "A predicate is a statement with a blank - 'x is even' - that becomes true or false only once you fill the blank. Plus the 'domain': the set of things the blank is allowed to be.",
            "filePath": "/guides/logic/predicate-logic-and-quantifiers/01-predicates-statements-with-variables.md"
          },
          {
            "slug": "02-quantifiers-for-all-there-exists",
            "title": "Quantifiers: For All and There Exists",
            "phaseNum": "2",
            "order": 2,
            "summary": "\u2200 ('for all') claims a predicate holds for every element of the domain; \u2203 ('there exists') claims it holds for at least one. One counterexample kills a 'for all'; one example proves a 'there exists.'",
            "filePath": "/guides/logic/predicate-logic-and-quantifiers/02-quantifiers-for-all-there-exists.md"
          },
          {
            "slug": "03-negating-and-nesting-quantifiers",
            "title": "Negating & Nesting Quantifiers",
            "phaseNum": "3",
            "order": 3,
            "summary": "To negate 'for all', flip to 'there exists a counterexample' (and vice versa) - the quantifier version of De Morgan. And when quantifiers nest, their order changes the meaning entirely.",
            "filePath": "/guides/logic/predicate-logic-and-quantifiers/03-negating-and-nesting-quantifiers.md"
          }
        ]
      },
      {
        "slug": "boolean-algebra-and-logic-gates",
        "title": "Boolean Algebra & Logic Gates",
        "summary": "The same AND/OR/NOT you already know, turned into an algebra you can compute with - and then etched into hardware as logic gates. This is the bridge from 'true and false' all the way down to how a CPU adds two numbers.",
        "order": 5,
        "phases": [
          {
            "slug": "01-boolean-algebra-the-laws",
            "title": "Boolean Algebra: The Laws",
            "phaseNum": "1",
            "order": 1,
            "summary": "Treat true/false as 1/0 and AND/OR/NOT as operations, and you get an algebra with laws - identity, complement, distribution, De Morgan - that let you simplify a tangled condition the way you simplify ordinary algebra.",
            "filePath": "/guides/logic/boolean-algebra-and-logic-gates/01-boolean-algebra-the-laws.md"
          },
          {
            "slug": "02-logic-gates-logic-made-physical",
            "title": "Logic Gates: Logic Made Physical",
            "phaseNum": "2",
            "order": 2,
            "summary": "A logic gate is AND, OR, or NOT built as a physical component that takes electrical signals (1s and 0s) and outputs one. Add NAND, NOR, and XOR - and learn why NAND alone can build every other gate.",
            "filePath": "/guides/logic/boolean-algebra-and-logic-gates/02-logic-gates-logic-made-physical.md"
          },
          {
            "slug": "03-from-gates-to-a-computer",
            "title": "From Gates to a Computer",
            "phaseNum": "3",
            "order": 3,
            "summary": "Wire a few gates together and they start to add: a half-adder from XOR and AND, a full adder that chains, and the jump from 'adds bits' to the arithmetic unit inside a CPU.",
            "filePath": "/guides/logic/boolean-algebra-and-logic-gates/03-from-gates-to-a-computer.md"
          }
        ]
      },
      {
        "slug": "what-a-proof-is",
        "title": "What a Proof Is",
        "summary": "A proof isn't intimidating ceremony - it's an argument so airtight it leaves no room for doubt: a chain of valid steps from things you already accept to the thing you're claiming. Here's how proofs actually work, including the famous techniques.",
        "order": 6,
        "phases": [
          {
            "slug": "01-what-a-proof-actually-is",
            "title": "What a Proof Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A proof is a gap-free chain of valid steps from things you already accept (axioms, definitions, known facts) to the claim you want to establish. Unlike evidence, a correct proof makes the conclusion certain.",
            "filePath": "/guides/logic/what-a-proof-is/01-what-a-proof-actually-is.md"
          },
          {
            "slug": "02-the-main-proof-techniques",
            "title": "The Main Proof Techniques",
            "phaseNum": "2",
            "order": 2,
            "summary": "Most proofs use one of a few shapes: prove it directly, assume the opposite and hit a contradiction, prove the contrapositive instead, split into cases, or - to disprove a universal claim - produce a single counterexample.",
            "filePath": "/guides/logic/what-a-proof-is/02-the-main-proof-techniques.md"
          },
          {
            "slug": "03-proof-by-induction",
            "title": "Proof by Induction",
            "phaseNum": "3",
            "order": 3,
            "summary": "Induction proves a statement for all natural numbers with two steps: show it holds for the first case, then show that if it holds for one case it holds for the next. Like dominoes - knock the first, and the rule topples the rest.",
            "filePath": "/guides/logic/what-a-proof-is/03-proof-by-induction.md"
          }
        ]
      },
      {
        "slug": "critical-thinking-and-fallacies",
        "title": "Critical Thinking & Fallacies",
        "summary": "A fallacy is an argument that feels convincing but is logically broken. Learning to name the common ones - and the habits of clear thinking that beat them - is the most practical self-defense there is against being misled.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-a-fallacy-is",
            "title": "What a Fallacy Is (and Why They Work)",
            "phaseNum": "1",
            "order": 1,
            "summary": "A fallacy is an argument that's persuasive but logically broken. Formal fallacies break the structure; informal ones smuggle in irrelevance or emotion. They work because they exploit how human brains take shortcuts.",
            "filePath": "/guides/logic/critical-thinking-and-fallacies/01-what-a-fallacy-is.md"
          },
          {
            "slug": "02-the-fallacies-youll-meet-most",
            "title": "The Fallacies You'll Meet Most",
            "phaseNum": "2",
            "order": 2,
            "summary": "A field guide to the fallacies you'll actually encounter - ad hominem, straw man, false dilemma, slippery slope, appeal to authority/emotion, hasty generalization, circular reasoning, and post hoc (correlation isn't causation).",
            "filePath": "/guides/logic/critical-thinking-and-fallacies/02-the-fallacies-youll-meet-most.md"
          },
          {
            "slug": "03-thinking-clearly-a-practical-toolkit",
            "title": "Thinking Clearly: A Practical Toolkit",
            "phaseNum": "3",
            "order": 3,
            "summary": "The habits that beat fallacies and bias: steelman instead of strawman, separate the claim from the evidence, ask 'what would change my mind?', check the source, and remember that fluent isn't the same as true.",
            "filePath": "/guides/logic/critical-thinking-and-fallacies/03-thinking-clearly-a-practical-toolkit.md"
          }
        ]
      },
      {
        "slug": "formal-methods-and-specification",
        "title": "Formal Methods and Specification",
        "summary": "Describe what a system must do, and why it is correct, before you build it: state machines, invariants, and specify-before-you-code.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-blueprint-not-the-building",
            "title": "The Blueprint, Not the Building",
            "phaseNum": "1",
            "order": 1,
            "summary": "A specification describes what a system must do and why it's correct, separate from the code that does it - the blueprint, not the building.",
            "filePath": "/guides/logic/formal-methods-and-specification/01-the-blueprint-not-the-building.md"
          },
          {
            "slug": "02-states-transitions-invariants",
            "title": "States, Transitions, and Invariants",
            "phaseNum": "2",
            "order": 2,
            "summary": "Model any system as states plus allowed transitions, then pin down what must always be true (invariants) and what must eventually happen (liveness).",
            "filePath": "/guides/logic/formal-methods-and-specification/02-states-transitions-invariants.md"
          },
          {
            "slug": "03-checking-before-you-build",
            "title": "Checking the Design Before You Build",
            "phaseNum": "3",
            "order": 3,
            "summary": "A model checker explores every reachable state of your spec and reports any that break an invariant - finding design bugs before code exists, with TLA+ as the on-ramp.",
            "filePath": "/guides/logic/formal-methods-and-specification/03-checking-before-you-build.md"
          }
        ]
      },
      {
        "slug": "short-circuit-evaluation",
        "title": "Short-Circuit Evaluation",
        "summary": "Why && and || stop evaluating the moment the answer is already determined, and how that becomes both a useful coding pattern and a source of subtle bugs.",
        "order": 9,
        "phases": [
          {
            "slug": "01-the-core-rule",
            "title": "Why bother checking the second half",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why && and || stop evaluating the moment the answer is already determined, and how that becomes both a useful coding pattern and a source of subtle bugs.",
            "filePath": "/guides/logic/short-circuit-evaluation/01-the-core-rule.md"
          },
          {
            "slug": "02-real-patterns",
            "title": "Where this becomes a real pattern",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why && and || stop evaluating the moment the answer is already determined, and how that becomes both a useful coding pattern and a source of subtle bugs.",
            "filePath": "/guides/logic/short-circuit-evaluation/02-real-patterns.md"
          },
          {
            "slug": "03-the-gotcha",
            "title": "The gotcha",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why && and || stop evaluating the moment the answer is already determined, and how that becomes both a useful coding pattern and a source of subtle bugs.",
            "filePath": "/guides/logic/short-circuit-evaluation/03-the-gotcha.md"
          }
        ]
      },
      {
        "slug": "model-checking-in-practice",
        "title": "Model Checking in Practice",
        "summary": "Write a real spec, understand exhaustive state-space exploration, and see a genuine concurrency bug a model checker catches before code exists.",
        "order": 10,
        "phases": [
          {
            "slug": "01-writing-a-real-spec",
            "title": "Writing a Real Spec",
            "phaseNum": "1",
            "order": 1,
            "summary": "Specify a mutual-exclusion lock completely: state, transitions, a safety property, and a liveness property, in enough detail to actually check.",
            "filePath": "/guides/logic/model-checking-in-practice/01-writing-a-real-spec.md"
          },
          {
            "slug": "02-exhaustive-state-space-exploration",
            "title": "Exhaustive State-Space Exploration",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a model checker actually walks a state graph, why that's fundamentally different from testing, and why state explosion is a real ceiling you work around rather than ignore.",
            "filePath": "/guides/logic/model-checking-in-practice/02-exhaustive-state-space-exploration.md"
          },
          {
            "slug": "03-a-real-concurrency-bug-caught-before-code",
            "title": "A Real Concurrency Bug, Caught Before Code",
            "phaseNum": "3",
            "order": 3,
            "summary": "A worked lost-update race in a connection pool's reference count, the interleaving a model checker finds that human review misses, and the honest limits of model checking.",
            "filePath": "/guides/logic/model-checking-in-practice/03-a-real-concurrency-bug-caught-before-code.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "mathematics",
    "name": "Mathematics",
    "icon": "ti-math-symbols",
    "blurb": "The language reality is written in - sets, numbers, probability, and more - taught from intuition.",
    "guides": [
      {
        "slug": "why-math-isnt-your-enemy",
        "title": "Why Math Isn't Your Enemy",
        "summary": "If you think you're 'bad at math,' you were taught it wrong - not built wrong. This guide reframes what math is, decodes the scary notation, and hands you the mindset that finally makes it click.",
        "order": 1,
        "phases": [
          {
            "slug": "01-you-were-lied-to-about-math",
            "title": "You Were Lied To About Math",
            "phaseNum": "1",
            "order": 1,
            "summary": "'I'm bad at math' is a scar from bad teaching, not a fact about you. Math is a language for patterns, not a talent you lack - and this is how the relationship gets repaired.",
            "filePath": "/guides/mathematics/why-math-isnt-your-enemy/01-you-were-lied-to-about-math.md"
          },
          {
            "slug": "02-how-to-read-math-notation",
            "title": "How to Read Math Notation",
            "phaseNum": "2",
            "order": 2,
            "summary": "Math notation is shorthand, not a secret code. Variables, f(x), subscripts, \u03a3, \u2208, \u2200 - each symbol abbreviates one plain idea. Learn to read them aloud and the fear disappears.",
            "filePath": "/guides/mathematics/why-math-isnt-your-enemy/02-how-to-read-math-notation.md"
          },
          {
            "slug": "03-the-mindset-that-makes-math-click",
            "title": "The Mindset That Makes Math Click",
            "phaseNum": "3",
            "order": 3,
            "summary": "Abstraction, precision, and generalization are the three habits that make math click - plus how to actually study it so it sticks, and why it's the language reality is written in.",
            "filePath": "/guides/mathematics/why-math-isnt-your-enemy/03-the-mindset-that-makes-math-click.md"
          }
        ]
      },
      {
        "slug": "sets-relations-and-functions",
        "title": "Sets, Relations & Functions",
        "summary": "The three ideas almost all of math (and a lot of code) is built from: a set is a collection of distinct things, a relation connects things, and a function maps each input to exactly one output. Learn these and the rest of math has a vocabulary.",
        "order": 2,
        "phases": [
          {
            "slug": "01-sets",
            "title": "Sets: Collections of Distinct Things",
            "phaseNum": "1",
            "order": 1,
            "summary": "A set is an unordered collection of distinct elements. Membership, subsets, and the three core operations - union, intersection, difference - plus the empty set, explained with plain intuition and runnable code.",
            "filePath": "/guides/mathematics/sets-relations-and-functions/01-sets.md"
          },
          {
            "slug": "02-relations-and-functions",
            "title": "Relations & Functions",
            "phaseNum": "2",
            "order": 2,
            "summary": "A relation is a set of ordered pairs - a way of connecting things. A function is a special relation where every input maps to exactly one output. Domain, codomain, and range, made concrete.",
            "filePath": "/guides/mathematics/sets-relations-and-functions/02-relations-and-functions.md"
          },
          {
            "slug": "03-the-vocabulary-of-everything",
            "title": "Why This Is the Vocabulary of Everything",
            "phaseNum": "3",
            "order": 3,
            "summary": "Sets and functions aren't abstract trivia - they're the hidden vocabulary under types, database tables, and data structures. See the same three ideas show up everywhere you build.",
            "filePath": "/guides/mathematics/sets-relations-and-functions/03-the-vocabulary-of-everything.md"
          }
        ]
      },
      {
        "slug": "numbers-and-number-systems",
        "title": "Numbers & Number Systems",
        "summary": "Numbers come in expanding families - counting numbers, integers, fractions, the reals - each invented to fix something the last couldn't do. And the same number can be written in different bases, which is the whole reason computers think in binary and hex.",
        "order": 3,
        "phases": [
          {
            "slug": "01-the-families-of-numbers",
            "title": "The Families of Numbers",
            "phaseNum": "1",
            "order": 1,
            "summary": "Naturals, integers, rationals, irrationals, reals - each family was invented to make an operation always work: subtraction needed negatives, division needed fractions, geometry needed irrationals. They nest like Russian dolls.",
            "filePath": "/guides/mathematics/numbers-and-number-systems/01-the-families-of-numbers.md"
          },
          {
            "slug": "02-bases-binary-decimal-hex",
            "title": "Bases: Binary, Decimal, Hex",
            "phaseNum": "2",
            "order": 2,
            "summary": "A base is how many digits you count with before carrying. Decimal uses ten, binary two, hex sixteen. Positional notation explains all three - and why computers store binary and humans read it as hex.",
            "filePath": "/guides/mathematics/numbers-and-number-systems/02-bases-binary-decimal-hex.md"
          },
          {
            "slug": "03-modular-arithmetic-clock-math",
            "title": "Modular Arithmetic: Clock Math",
            "phaseNum": "3",
            "order": 3,
            "summary": "Modular arithmetic is the math of remainders and wrap-around - the reason 15:00 is 3 o'clock. It quietly runs hashing, parity checks, cyclic buffers, and cryptography.",
            "filePath": "/guides/mathematics/numbers-and-number-systems/03-modular-arithmetic-clock-math.md"
          }
        ]
      },
      {
        "slug": "counting-and-combinatorics",
        "title": "Counting & Combinatorics",
        "summary": "How to count possibilities without listing them: multiply independent choices, and know when order matters (permutations) versus when it doesn't (combinations). It's the math behind probability, password strength, and why brute force blows up.",
        "order": 4,
        "phases": [
          {
            "slug": "01-the-multiplication-principle",
            "title": "The Multiplication Principle",
            "phaseNum": "1",
            "order": 1,
            "summary": "If one choice can be made m ways and the next n ways, the two together can be made m \u00d7 n ways. This single rule - multiply independent choices - is the engine behind almost all counting.",
            "filePath": "/guides/mathematics/counting-and-combinatorics/01-the-multiplication-principle.md"
          },
          {
            "slug": "02-permutations-and-combinations",
            "title": "Permutations & Combinations",
            "phaseNum": "2",
            "order": 2,
            "summary": "When order matters, you count permutations (n! and nPr). When order doesn't matter, you count combinations (nCr). Knowing which question you're asking is the whole game.",
            "filePath": "/guides/mathematics/counting-and-combinatorics/02-permutations-and-combinations.md"
          },
          {
            "slug": "03-why-counting-matters",
            "title": "Why Counting Matters",
            "phaseNum": "3",
            "order": 3,
            "summary": "Counting is the foundation of probability (favorable outcomes over total), the reason a longer password is exponentially stronger, and the reason some problems explode beyond brute force. The same idea, three big payoffs.",
            "filePath": "/guides/mathematics/counting-and-combinatorics/03-why-counting-matters.md"
          }
        ]
      },
      {
        "slug": "probability-and-statistics",
        "title": "Probability & Statistics",
        "summary": "Probability measures how likely something is; statistics makes sense of data once it's collected. Together they're the everyday superpower for reasoning under uncertainty - and the single best defense against being fooled by numbers.",
        "order": 5,
        "phases": [
          {
            "slug": "01-probability-measuring-uncertainty",
            "title": "Probability: Measuring Uncertainty",
            "phaseNum": "1",
            "order": 1,
            "summary": "Probability puts a number from 0 to 1 on how likely something is. For equally likely outcomes it's favorable over total; independent events multiply, mutually exclusive ones add, and expected value tells you the long-run average.",
            "filePath": "/guides/mathematics/probability-and-statistics/01-probability-measuring-uncertainty.md"
          },
          {
            "slug": "02-reading-data-statistics",
            "title": "Reading Data: Statistics That Don't Lie",
            "phaseNum": "2",
            "order": 2,
            "summary": "Mean, median, and mode summarize the center of data; range and standard deviation describe its spread; and the distribution describes its shape. Knowing when the mean betrays you is half the skill.",
            "filePath": "/guides/mathematics/probability-and-statistics/02-reading-data-statistics.md"
          },
          {
            "slug": "03-how-statistics-mislead-you",
            "title": "How Statistics Mislead You",
            "phaseNum": "3",
            "order": 3,
            "summary": "The same statistics that explain the world are used to distort it: correlation sold as causation, biased samples, ignored base rates, cherry-picked results, and charts engineered to deceive. Here's how to catch each one.",
            "filePath": "/guides/mathematics/probability-and-statistics/03-how-statistics-mislead-you.md"
          }
        ]
      },
      {
        "slug": "linear-algebra-what-happens-if-i-change-this",
        "title": "Linear Algebra: The Math of What Happens If I Change This?",
        "summary": "Linear algebra is the math of transformation: what happens when you stretch, rotate, or combine things. Every photo filter, 3D game, and machine learning model is built from it. This guide starts from real movement and builds up to matrices without the terror.",
        "order": 6,
        "phases": [
          {
            "slug": "01-vectors-as-arrows-in-the-real-world",
            "title": "Vectors as Arrows in the Real World",
            "phaseNum": "1",
            "order": 1,
            "summary": "A vector is nothing more than an arrow: it has a direction and a length. Adding vectors is combining movements. By the end, you will have built the mental model that makes every later idea in linear algebra feel obvious.",
            "filePath": "/guides/mathematics/linear-algebra-what-happens-if-i-change-this/01-vectors-as-arrows-in-the-real-world.md"
          },
          {
            "slug": "02-matrices-as-recipes-for-transformation",
            "title": "Matrices as Recipes for Transformation",
            "phaseNum": "2",
            "order": 2,
            "summary": "A matrix is a compact way to say 'stretch this,' 'rotate that,' or 'skew everything.' Matrix multiplication is the act of applying one transformation after another. By the end, a matrix will look like a recipe card, not a wall of numbers.",
            "filePath": "/guides/mathematics/linear-algebra-what-happens-if-i-change-this/02-matrices-as-recipes-for-transformation.md"
          },
          {
            "slug": "03-why-this-is-everywhere",
            "title": "Why This Is Everywhere",
            "phaseNum": "3",
            "order": 3,
            "summary": "Vectors and matrices are not abstract exercises. They are the machinery behind Google search, Netflix recommendations, every photo filter, and every neural network. This phase connects the arrows and recipes you have learned to the systems you use every day.",
            "filePath": "/guides/mathematics/linear-algebra-what-happens-if-i-change-this/03-why-this-is-everywhere.md"
          }
        ]
      },
      {
        "slug": "number-theory-the-secret-life-of-integers",
        "title": "Number Theory: The Secret Life of Integers",
        "summary": "Number theory is the math of which numbers behave nicely - and it is the reason your credit card number can travel over the internet without being stolen. This guide starts from prime fingerprints and builds up to the clock math that secures your browser.",
        "order": 7,
        "phases": [
          {
            "slug": "01-primes-and-the-building-blocks-of-numbers",
            "title": "Primes and the Building Blocks of Numbers",
            "phaseNum": "1",
            "order": 1,
            "summary": "A prime number is a number that cannot be built from smaller numbers. Every other number can be factored into primes in exactly one way, like a unique fingerprint. This phase shows why that matters and how to find the factors of any number.",
            "filePath": "/guides/mathematics/number-theory-the-secret-life-of-integers/01-primes-and-the-building-blocks-of-numbers.md"
          },
          {
            "slug": "02-the-clock-math-you-already-know",
            "title": "The Clock Math You Already Know",
            "phaseNum": "2",
            "order": 2,
            "summary": "Modular arithmetic is the math of remainders and wrap-around. You already use it to read a clock. This phase extends that instinct into modular exponentiation, the Euclidean algorithm in disguise, and the reason the same math that tells you what time it is also secures your data.",
            "filePath": "/guides/mathematics/number-theory-the-secret-life-of-integers/02-the-clock-math-you-already-know.md"
          },
          {
            "slug": "03-how-the-internet-stays-secret",
            "title": "How the Internet Stays Secret",
            "phaseNum": "3",
            "order": 3,
            "summary": "RSA encryption works because multiplying two large primes is easy, but factoring their product back apart is nearly impossible. This phase explains the one-way street that keeps your credit card number private, and connects it to the hashing and checksums you use every day.",
            "filePath": "/guides/mathematics/number-theory-the-secret-life-of-integers/03-how-the-internet-stays-secret.md"
          }
        ]
      },
      {
        "slug": "graph-theory-whats-connected-to-what",
        "title": "Graph Theory: The Math of What's Connected to What",
        "summary": "A graph is a map of relationships: who is friends with whom, which files import which other files, how data flows through a network. This guide teaches you to think in connections, find the shortest path, and see the graph theory running your package manager, your social feed, and the internet itself.",
        "order": 8,
        "phases": [
          {
            "slug": "01-nodes-edges-and-the-graphs-you-already-use",
            "title": "Nodes, Edges, and the Graphs You Already Use",
            "phaseNum": "1",
            "order": 1,
            "summary": "A graph is nothing more than a collection of things and the connections between them. The things are nodes, the connections are edges, and the pattern shows up in social networks, dependency trees, and the internet itself. This phase teaches you to see and draw graphs.",
            "filePath": "/guides/mathematics/graph-theory-whats-connected-to-what/01-nodes-edges-and-the-graphs-you-already-use.md"
          },
          {
            "slug": "02-finding-the-shortest-path-and-detecting-cycles",
            "title": "Finding the Shortest Path and Detecting Cycles",
            "phaseNum": "2",
            "order": 2,
            "summary": "Once you can draw a graph, the natural questions are: what is the shortest route from A to B, and does this graph loop back on itself? This phase covers BFS, DFS, Dijkstra's algorithm, and the cycle detection that saves package managers from infinite loops.",
            "filePath": "/guides/mathematics/graph-theory-whats-connected-to-what/02-finding-the-shortest-path-and-detecting-cycles.md"
          },
          {
            "slug": "03-graphs-that-run-the-world",
            "title": "Graphs That Run the World",
            "phaseNum": "3",
            "order": 3,
            "summary": "Graphs are not a niche math topic. They are the structure behind Google search, social networks, package managers, and the internet itself. This phase connects the nodes and edges you have learned to the systems you use every day.",
            "filePath": "/guides/mathematics/graph-theory-whats-connected-to-what/03-graphs-that-run-the-world.md"
          }
        ]
      },
      {
        "slug": "calculus-how-things-change",
        "title": "Calculus: The Math of How Things Change",
        "summary": "Calculus is not about memorizing derivative rules. It is the math of change: how fast something is moving, how to find the best possible outcome, how to add up a million tiny pieces. This guide starts from a car's speedometer and builds up to the ideas behind machine learning gradients and physics simulations.",
        "order": 9,
        "phases": [
          {
            "slug": "01-derivatives-as-right-now-speed",
            "title": "Derivatives as Right Now Speed",
            "phaseNum": "1",
            "order": 1,
            "summary": "A derivative is the answer to 'how fast, right now?' It is the slope of a curve at a single point, the instantaneous velocity of a moving object, and the marginal cost of producing one more unit. This phase builds the intuition before introducing a single formula.",
            "filePath": "/guides/mathematics/calculus-how-things-change/01-derivatives-as-right-now-speed.md"
          },
          {
            "slug": "02-optimization-and-whats-the-best-i-can-do",
            "title": "Optimization and What Is the Best I Can Do",
            "phaseNum": "2",
            "order": 2,
            "summary": "Optimization is the art of finding the best possible outcome: the maximum profit, the minimum cost, the fastest route. Calculus makes it systematic by showing that the best outcome happens where the derivative is zero. This phase connects that idea to machine learning, tuning, and everyday decisions.",
            "filePath": "/guides/mathematics/calculus-how-things-change/02-optimization-and-whats-the-best-i-can-do.md"
          },
          {
            "slug": "03-integrals-as-the-total-so-far",
            "title": "Integrals as the Total So Far",
            "phaseNum": "3",
            "order": 3,
            "summary": "An integral is the answer to 'what is the total so far?' It adds up a million tiny pieces to compute area under a curve, total distance from speed, or expected value from a probability distribution. This phase connects the integral to profiling data, physics, and the expected value you met in probability.",
            "filePath": "/guides/mathematics/calculus-how-things-change/03-integrals-as-the-total-so-far.md"
          }
        ]
      },
      {
        "slug": "trigonometry-circles-and-waves",
        "title": "Trigonometry: The Math of Circles and Waves",
        "summary": "Trigonometry is not 'memorize SOH CAH TOA.' It is the math of anything that repeats: sound waves, seasons, rotations, heartbeats. This guide starts from a point moving around a circle and builds up to the sine, cosine, and tangent that power graphics, audio, and animation.",
        "order": 10,
        "phases": [
          {
            "slug": "01-the-unit-circle-and-why-sine-cosine-exist",
            "title": "The Unit Circle and Why Sine/Cosine Exist",
            "phaseNum": "1",
            "order": 1,
            "summary": "Trigonometry starts with a point moving around a circle. The height of that point is sine. The horizontal position is cosine. This phase explains why those functions exist, how to read the unit circle, and why radians are the natural way to measure angles.",
            "filePath": "/guides/mathematics/trigonometry-circles-and-waves/01-the-unit-circle-and-why-sine-cosine-exist.md"
          },
          {
            "slug": "02-waves-frequencies-and-the-real-world",
            "title": "Waves, Frequencies, and the Real World",
            "phaseNum": "2",
            "order": 2,
            "summary": "A sine wave is the shape of every repeating phenomenon: sound, light, seasons, heartbeats. This phase shows how amplitude, frequency, and phase shift turn a single circle into the full language of waves, and how to generate a simple audio tone with code.",
            "filePath": "/guides/mathematics/trigonometry-circles-and-waves/02-waves-frequencies-and-the-real-world.md"
          },
          {
            "slug": "03-rotation-navigation-and-where-am-i-facing",
            "title": "Rotation, Navigation, and Where Am I Facing",
            "phaseNum": "3",
            "order": 3,
            "summary": "Trigonometry is the math of direction. Rotating a sprite, pointing a camera, triangulating a position: all of them use sine and cosine to turn an angle into a coordinate. This phase connects the circle to the graphics, audio, and navigation systems you use every day.",
            "filePath": "/guides/mathematics/trigonometry-circles-and-waves/03-rotation-navigation-and-where-am-i-facing.md"
          }
        ]
      },
      {
        "slug": "how-to-think-like-a-mathematician",
        "title": "How to Think Like a Mathematician",
        "summary": "Problem-solving as a learnable craft: Polya's four steps, trying small cases, finding invariants, and getting unstuck when you are stuck.",
        "order": 11,
        "phases": [
          {
            "slug": "01-the-loop",
            "title": "The Loop: Understand, Plan, Do, Look Back",
            "phaseNum": "1",
            "order": 1,
            "summary": "Problem-solving as a learnable craft: Polya's four steps, trying small cases, finding invariants, and getting unstuck when you are stuck.",
            "filePath": "/guides/mathematics/how-to-think-like-a-mathematician/01-the-loop.md"
          },
          {
            "slug": "02-the-moves",
            "title": "The Moves: How to Actually Get an Idea",
            "phaseNum": "2",
            "order": 2,
            "summary": "Problem-solving as a learnable craft: Polya's four steps, trying small cases, finding invariants, and getting unstuck when you are stuck.",
            "filePath": "/guides/mathematics/how-to-think-like-a-mathematician/02-the-moves.md"
          },
          {
            "slug": "03-stuck-is-the-job",
            "title": "Stuck Is the Job: Getting Unstuck",
            "phaseNum": "3",
            "order": 3,
            "summary": "Problem-solving as a learnable craft: Polya's four steps, trying small cases, finding invariants, and getting unstuck when you are stuck.",
            "filePath": "/guides/mathematics/how-to-think-like-a-mathematician/03-stuck-is-the-job.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "physics",
    "name": "Physics",
    "icon": "ti-atom",
    "blurb": "How the physical world really works, in plain language - motion, energy, light, and quantum rules.",
    "guides": [
      {
        "slug": "what-physics-actually-is",
        "title": "What Physics Actually Is",
        "summary": "Physics is the craft of predicting the world with simple models: measurement, units, and the idea that a few rules explain enormous amounts.",
        "order": 1,
        "phases": [
          {
            "slug": "01-what-a-model-is",
            "title": "What a Model Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Physics is the craft of predicting the world with simple models: measurement, units, and the idea that a few rules explain enormous amounts.",
            "filePath": "/guides/physics/what-physics-actually-is/01-what-a-model-is.md"
          },
          {
            "slug": "02-measurement-and-units",
            "title": "Measurement and Units (Your Built-In Mistake Detector)",
            "phaseNum": "2",
            "order": 2,
            "summary": "Physics is the craft of predicting the world with simple models: measurement, units, and the idea that a few rules explain enormous amounts.",
            "filePath": "/guides/physics/what-physics-actually-is/02-measurement-and-units.md"
          },
          {
            "slug": "03-conservation-and-the-loop",
            "title": "The Deepest Idea: Things That Never Change",
            "phaseNum": "3",
            "order": 3,
            "summary": "Physics is the craft of predicting the world with simple models: measurement, units, and the idea that a few rules explain enormous amounts.",
            "filePath": "/guides/physics/what-physics-actually-is/03-conservation-and-the-loop.md"
          }
        ]
      },
      {
        "slug": "energy-forces-and-motion",
        "title": "Energy, Forces, and Motion",
        "summary": "Newton without the dread: what a force really is, why things keep moving, and energy as the currency that is never created or destroyed.",
        "order": 2,
        "phases": [
          {
            "slug": "01-what-a-force-really-is",
            "title": "What a force really is (and why motion sticks)",
            "phaseNum": "1",
            "order": 1,
            "summary": "Newton without the dread: what a force really is, why things keep moving, and energy as the currency that is never created or destroyed.",
            "filePath": "/guides/physics/energy-forces-and-motion/01-what-a-force-really-is.md"
          },
          {
            "slug": "02-how-forces-change-motion",
            "title": "How forces change motion",
            "phaseNum": "2",
            "order": 2,
            "summary": "Newton without the dread: what a force really is, why things keep moving, and energy as the currency that is never created or destroyed.",
            "filePath": "/guides/physics/energy-forces-and-motion/02-how-forces-change-motion.md"
          },
          {
            "slug": "03-energy-and-momentum",
            "title": "Energy and momentum: the currencies that never vanish",
            "phaseNum": "3",
            "order": 3,
            "summary": "Newton without the dread: what a force really is, why things keep moving, and energy as the currency that is never created or destroyed.",
            "filePath": "/guides/physics/energy-forces-and-motion/03-energy-and-momentum.md"
          }
        ]
      },
      {
        "slug": "the-quantum-world-for-humans",
        "title": "The Quantum World, for Humans",
        "summary": "What is actually true about the quantum world, minus the mysticism: superposition, uncertainty, and entanglement, explained without lying to you.",
        "order": 3,
        "phases": [
          {
            "slug": "01-waves-particles-double-slit",
            "title": "Waves, particles, and the double slit",
            "phaseNum": "1",
            "order": 1,
            "summary": "What is actually true about the quantum world, minus the mysticism: superposition, uncertainty, and entanglement, explained without lying to you.",
            "filePath": "/guides/physics/the-quantum-world-for-humans/01-waves-particles-double-slit.md"
          },
          {
            "slug": "02-superposition-and-uncertainty",
            "title": "Superposition and uncertainty (the real ones)",
            "phaseNum": "2",
            "order": 2,
            "summary": "What is actually true about the quantum world, minus the mysticism: superposition, uncertainty, and entanglement, explained without lying to you.",
            "filePath": "/guides/physics/the-quantum-world-for-humans/02-superposition-and-uncertainty.md"
          },
          {
            "slug": "03-entanglement-and-its-limits",
            "title": "Entanglement, and why it can't send a message",
            "phaseNum": "3",
            "order": 3,
            "summary": "What is actually true about the quantum world, minus the mysticism: superposition, uncertainty, and entanglement, explained without lying to you.",
            "filePath": "/guides/physics/the-quantum-world-for-humans/03-entanglement-and-its-limits.md"
          }
        ]
      },
      {
        "slug": "light-waves-and-fields",
        "title": "Light, Waves, and Fields",
        "summary": "Why light, radio, sound, and ripples on a pond are the same idea: waves and fields, the electromagnetic spectrum, and what color really is.",
        "order": 4,
        "phases": [
          {
            "slug": "01-what-a-wave-actually-is",
            "title": "What a wave actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why light, radio, sound, and ripples on a pond are the same idea: waves and fields, the electromagnetic spectrum, and what color really is.",
            "filePath": "/guides/physics/light-waves-and-fields/01-what-a-wave-actually-is.md"
          },
          {
            "slug": "02-light-is-one-wave-on-a-dial",
            "title": "Light is one wave on a giant dial",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why light, radio, sound, and ripples on a pond are the same idea: waves and fields, the electromagnetic spectrum, and what color really is.",
            "filePath": "/guides/physics/light-waves-and-fields/02-light-is-one-wave-on-a-dial.md"
          },
          {
            "slug": "03-when-waves-meet-themselves",
            "title": "When waves meet themselves",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why light, radio, sound, and ripples on a pond are the same idea: waves and fields, the electromagnetic spectrum, and what color really is.",
            "filePath": "/guides/physics/light-waves-and-fields/03-when-waves-meet-themselves.md"
          }
        ]
      },
      {
        "slug": "relativity-space-time-and-gravity",
        "title": "Relativity: Space, Time, and Gravity",
        "summary": "Why moving clocks run slow and gravity is curved spacetime, in plain language - special and general relativity, with GPS as the everyday proof.",
        "order": 5,
        "phases": [
          {
            "slug": "01-special-relativity-one-rule",
            "title": "Special Relativity: One Rule, Strange Consequences",
            "phaseNum": "1",
            "order": 1,
            "summary": "The speed of light is the same for every observer - and that one unbending fact forces moving clocks to run slow, lengths to shrink, and mass to be frozen energy.",
            "filePath": "/guides/physics/relativity-space-time-and-gravity/01-special-relativity-one-rule.md"
          },
          {
            "slug": "02-general-relativity-curved-spacetime",
            "title": "General Relativity: Gravity Is Curved Spacetime",
            "phaseNum": "2",
            "order": 2,
            "summary": "Standing on Earth feels identical to accelerating in a rocket - and from that one observation gravity turns out to be the curving of spacetime by mass, not a force pulling at all.",
            "filePath": "/guides/physics/relativity-space-time-and-gravity/02-general-relativity-curved-spacetime.md"
          },
          {
            "slug": "03-the-evidence-and-the-everyday",
            "title": "The Evidence and the Everyday",
            "phaseNum": "3",
            "order": 3,
            "summary": "GPS would drift kilometers a day without relativity, starlight bends around the Sun, Mercury's orbit drifts on schedule, and LIGO heard spacetime ring - the proof that relativity is real, not theory.",
            "filePath": "/guides/physics/relativity-space-time-and-gravity/03-the-evidence-and-the-everyday.md"
          }
        ]
      },
      {
        "slug": "heat-energy-and-entropy",
        "title": "Heat, Energy, and Entropy",
        "summary": "The laws of thermodynamics without the dread - energy is conserved, entropy always grows, and that one-way arrow explains heat engines, perpetual-motion failure, and the direction of time.",
        "order": 6,
        "phases": [
          {
            "slug": "01-energy-and-the-first-law",
            "title": "Energy and the First Law",
            "phaseNum": "1",
            "order": 1,
            "summary": "Heat is energy in transit, not a substance things contain. Temperature and heat are different. And the first law: energy is never created or destroyed, only moved and reshaped.",
            "filePath": "/guides/physics/heat-energy-and-entropy/01-energy-and-the-first-law.md"
          },
          {
            "slug": "02-entropy-and-the-second-law",
            "title": "Entropy and the Second Law",
            "phaseNum": "2",
            "order": 2,
            "summary": "Entropy is a count of microscopic arrangements, not mess. The second law says it never decreases in an isolated system - which is why heat flows one way, engines leak, and 'you can't break even.'",
            "filePath": "/guides/physics/heat-energy-and-entropy/02-entropy-and-the-second-law.md"
          },
          {
            "slug": "03-the-arrow-of-time",
            "title": "The Arrow of Time",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why time has a direction: entropy. Eggs don't unscramble, the heat-death idea, how Maxwell's demon is defeated, and the honest cost of erasing one bit of information.",
            "filePath": "/guides/physics/heat-energy-and-entropy/03-the-arrow-of-time.md"
          }
        ]
      },
      {
        "slug": "quantum-computing-for-humans",
        "title": "Quantum Computing, for Humans",
        "summary": "What a quantum computer really is and is not - qubits, superposition, and interference used to make right answers likelier, not a magic box that tries all answers at once.",
        "order": 7,
        "phases": [
          {
            "slug": "01-the-qubit",
            "title": "The qubit, and the lie about parallel answers",
            "phaseNum": "1",
            "order": 1,
            "summary": "A qubit holds a superposition with amplitudes and a phase, and qubits can entangle - but you still get one ordinary answer when you measure, with odds set by those amplitudes.",
            "filePath": "/guides/physics/quantum-computing-for-humans/01-the-qubit.md"
          },
          {
            "slug": "02-interference-is-the-engine",
            "title": "Interference is the engine",
            "phaseNum": "2",
            "order": 2,
            "summary": "A quantum algorithm arranges amplitudes so wrong answers cancel and right answers reinforce - constructive and destructive interference make the correct measurement likely. That orchestration is the whole trick.",
            "filePath": "/guides/physics/quantum-computing-for-humans/02-interference-is-the-engine.md"
          },
          {
            "slug": "03-what-it-actually-buys-you",
            "title": "What it actually buys you, and the sober reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Where quantum computing has real advantage - Shor's factoring threatens RSA, Grover's gives a square-root speedup - the many problems it doesn't help, and why decoherence and error correction keep today's machines noisy.",
            "filePath": "/guides/physics/quantum-computing-for-humans/03-what-it-actually-buys-you.md"
          }
        ]
      },
      {
        "slug": "the-physics-of-computation",
        "title": "The Physics of Computation",
        "summary": "A bit is a physical thing, not an abstraction - and that fact sets hard, measured limits on every computer that will ever exist, from your laptop to whatever comes after silicon.",
        "order": 8,
        "phases": [
          {
            "slug": "01-a-bit-is-a-physical-thing",
            "title": "A Bit Is a Physical Thing",
            "phaseNum": "1",
            "order": 1,
            "summary": "A bit is never just an abstraction - it's a voltage, a charge, or a magnetic domain, and changing or erasing it costs real, measurable energy. Landauer's principle sets the floor.",
            "filePath": "/guides/physics/the-physics-of-computation/01-a-bit-is-a-physical-thing.md"
          },
          {
            "slug": "02-the-thermodynamic-limits-of-computing",
            "title": "The Thermodynamic Limits of Computing",
            "phaseNum": "2",
            "order": 2,
            "summary": "Chips can't shrink and speed up forever because heat dissipation is a real wall, not an engineering choice - and reversible computing is the theoretical way around it, though nobody has built a practical general-purpose version yet.",
            "filePath": "/guides/physics/the-physics-of-computation/02-the-thermodynamic-limits-of-computing.md"
          },
          {
            "slug": "03-information-theory-meets-physics",
            "title": "Information Theory Meets Physics",
            "phaseNum": "3",
            "order": 3,
            "summary": "Shannon entropy and thermodynamic entropy are the same formula, not a loose analogy - and that identity is why Landauer's principle works and why every real computer answers to physical law.",
            "filePath": "/guides/physics/the-physics-of-computation/03-information-theory-meets-physics.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "operating-systems",
    "name": "Operating Systems",
    "icon": "ti-device-desktop",
    "blurb": "Windows, macOS, and Linux - what they're really doing under the hood.",
    "guides": [
      {
        "slug": "what-an-operating-system-is",
        "title": "What an Operating System Actually Is",
        "summary": "The operating system is the manager sitting between your programs and the hardware; understand the kernel, processes, memory, and files and your whole computer stops being a mystery box.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-manager-in-the-middle",
            "title": "The Manager in the Middle",
            "phaseNum": "1",
            "order": 1,
            "summary": "An operating system is the layer between your programs and the hardware - it manages the machine's resources and shares them safely, so no program has to (or is allowed to) touch the hardware directly.",
            "filePath": "/guides/operating-systems/what-an-operating-system-is/01-the-manager-in-the-middle.md"
          },
          {
            "slug": "02-the-four-jobs",
            "title": "The Four Jobs Every OS Does",
            "phaseNum": "2",
            "order": 2,
            "summary": "Every operating system manages four things for you: running programs (processes), memory, files, and devices - understand these four and you understand what the OS spends its time doing.",
            "filePath": "/guides/operating-systems/what-an-operating-system-is/02-the-four-jobs.md"
          },
          {
            "slug": "03-see-it-yourself",
            "title": "See It Yourself",
            "phaseNum": "3",
            "order": 3,
            "summary": "Watch the OS manage processes and memory live in Task Manager / Activity Monitor / top, follow what happens from power button to desktop, and see how Windows, macOS, and Linux are the same model in different clothes.",
            "filePath": "/guides/operating-systems/what-an-operating-system-is/03-see-it-yourself.md"
          }
        ]
      },
      {
        "slug": "the-filesystem-explained",
        "title": "The Filesystem, Explained",
        "summary": "A filesystem is the tree of files and folders the OS lays over raw numbered storage; a path is an address into that tree, permissions decide who may touch each file, and a few simple rules explain almost every 'file not found' or 'permission denied' you'll ever hit.",
        "order": 2,
        "phases": [
          {
            "slug": "01-what-a-filesystem-is",
            "title": "What a Filesystem Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A disk is just numbered storage; the OS imposes a tree of folders and files on top of it, and a path is the address that walks you down that tree from the root to one file.",
            "filePath": "/guides/operating-systems/the-filesystem-explained/01-what-a-filesystem-is.md"
          },
          {
            "slug": "02-permissions-and-ownership",
            "title": "Permissions & Ownership",
            "phaseNum": "2",
            "order": 2,
            "summary": "Every file has an owner and rules for who can read, write, or run it; 'permission denied' means you tried to do something the rules don't allow you to - and that's a protection, not a punishment.",
            "filePath": "/guides/operating-systems/the-filesystem-explained/02-permissions-and-ownership.md"
          },
          {
            "slug": "03-where-things-live",
            "title": "Where Things Live & Finding Them",
            "phaseNum": "3",
            "order": 3,
            "summary": "How the OS turns a path into real bytes, why hidden dotfiles and file extensions are just naming conventions, where standard things live, and how to find any file - with a cheat for the three classic errors.",
            "filePath": "/guides/operating-systems/the-filesystem-explained/03-where-things-live.md"
          }
        ]
      },
      {
        "slug": "the-terminal-and-shell",
        "title": "The Terminal & Shell, Explained",
        "summary": "What the black window actually is, the difference between the terminal and the shell, the everyday commands worth knowing, and the real power features - pipes, redirection, wildcards, and PATH - that make typing beat clicking.",
        "order": 3,
        "phases": [
          {
            "slug": "01-terminal-vs-shell",
            "title": "What the Terminal and Shell Actually Are",
            "phaseNum": "1",
            "order": 1,
            "summary": "The terminal is the window; the shell (bash, zsh, PowerShell) is the program inside it that reads your typed commands and asks the OS to run them. Together they form a read-eval-print loop, and the prompt is the shell saying it's ready.",
            "filePath": "/guides/operating-systems/the-terminal-and-shell/01-terminal-vs-shell.md"
          },
          {
            "slug": "02-essential-commands",
            "title": "The Essential Commands",
            "phaseNum": "2",
            "order": 2,
            "summary": "The anatomy of a command (command + options + arguments), then the everyday toolkit: pwd, ls, cd, cat, less, mkdir, cp, mv, and rm - each with a real transcript, explained for real, and the gotchas that bite beginners (rm has no undo; quote filenames with spaces).",
            "filePath": "/guides/operating-systems/the-terminal-and-shell/02-essential-commands.md"
          },
          {
            "slug": "03-pipes-redirection-wildcards-path",
            "title": "The Real Power: Pipes, Redirection, Wildcards & PATH",
            "phaseNum": "3",
            "order": 3,
            "summary": "The features that make typing beat clicking: | pipes the output of one command into the next, > and >> redirect output into files, * matches groups of filenames, and PATH is the list of folders the shell searches to find which program a command name means.",
            "filePath": "/guides/operating-systems/the-terminal-and-shell/03-pipes-redirection-wildcards-path.md"
          }
        ]
      },
      {
        "slug": "processes-memory-and-cpu",
        "title": "Processes, Memory & the CPU - Diagnosing a Slow or Stuck Machine",
        "summary": "What '100% CPU' and 'out of memory' actually mean, and how to find the one process that's the culprit - using top and Task Manager you already have.",
        "order": 4,
        "phases": [
          {
            "slug": "01-processes-up-close",
            "title": "Processes, Up Close",
            "phaseNum": "1",
            "order": 1,
            "summary": "A process has an ID (PID) and a parent, runs in the foreground or background, sits in a state (running, sleeping, zombie), and is stopped by signals - which is all Ctrl-C, kill, and 'End task' really send.",
            "filePath": "/guides/operating-systems/processes-memory-and-cpu/01-processes-up-close.md"
          },
          {
            "slug": "02-what-100-cpu-really-means",
            "title": "What '100% CPU' Really Means",
            "phaseNum": "2",
            "order": 2,
            "summary": "Your CPU has several cores; the scheduler gives processes rapid turns. '100% CPU' usually means one runaway process pinning a core - find it by sorting top / Task Manager by CPU.",
            "filePath": "/guides/operating-systems/processes-memory-and-cpu/02-what-100-cpu-really-means.md"
          },
          {
            "slug": "03-what-out-of-memory-really-means",
            "title": "What 'Out of Memory' Really Means",
            "phaseNum": "3",
            "order": 3,
            "summary": "RAM is the fast desk; when it fills, the OS pages cold data to slow disk (swap), which is why a low-memory machine crawls - and if even that isn't enough, the OOM killer ends a process to survive.",
            "filePath": "/guides/operating-systems/processes-memory-and-cpu/03-what-out-of-memory-really-means.md"
          }
        ]
      },
      {
        "slug": "linux-from-zero",
        "title": "Linux From Zero - For People Who've Never Used It and Are a Little Scared",
        "summary": "What Linux actually is, how to find your way around its filesystem and install software, how users and permissions work, and how to start and read background services - for someone who's never touched it.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-linux-actually-is",
            "title": "What Linux Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Linux is a kernel; Ubuntu, Fedora, and Debian are the same kernel with different packaging around it. That one idea explains the distros, where Linux runs, and what free and open source means.",
            "filePath": "/guides/operating-systems/linux-from-zero/01-what-linux-actually-is.md"
          },
          {
            "slug": "02-getting-around",
            "title": "Getting Around",
            "phaseNum": "2",
            "order": 2,
            "summary": "The Linux filesystem isn't C:\\\\ and Program Files - it's one tree where /etc holds config, /var holds logs and data, /home holds your stuff, and software is installed from a package manager (apt/dnf), not downloaded installers.",
            "filePath": "/guides/operating-systems/linux-from-zero/02-getting-around.md"
          },
          {
            "slug": "03-users-permissions-sudo",
            "title": "Users, Permissions, and sudo",
            "phaseNum": "3",
            "order": 3,
            "summary": "Root is the all-powerful admin user you don't log in as; sudo lets your normal user borrow root's power for one command; and every file's rwx permissions for owner/group/others decide who can do what.",
            "filePath": "/guides/operating-systems/linux-from-zero/03-users-permissions-sudo.md"
          },
          {
            "slug": "04-services-and-logs",
            "title": "Services and Logs",
            "phaseNum": "4",
            "order": 4,
            "summary": "A service (daemon) is a program that runs quietly in the background; systemctl starts, stops, checks, and enables them; journalctl shows their logs - plus a first-day snags cheat-card for when things go wrong.",
            "filePath": "/guides/operating-systems/linux-from-zero/04-services-and-logs.md"
          }
        ]
      },
      {
        "slug": "windows-for-power-users",
        "title": "Windows for People Who Use It Every Day",
        "summary": "What's actually underneath Windows - the NT kernel, drive letters and the real folder layout, services and the registry, and PowerShell - explained for someone who's used Windows for years but was never shown the manual.",
        "order": 6,
        "phases": [
          {
            "slug": "01-windows-under-the-hood",
            "title": "Windows Under the Hood",
            "phaseNum": "1",
            "order": 1,
            "summary": "Windows runs on the NT kernel; drive letters like C:\\\\ map to volumes; programs live in Program Files while your settings hide in AppData; 'Run as administrator' is a user-space program asking the trusted side for permission; and Windows differs from Unix in backslashes, .exe files, and the registry instead of config files.",
            "filePath": "/guides/operating-systems/windows-for-power-users/01-windows-under-the-hood.md"
          },
          {
            "slug": "02-services-task-manager-registry",
            "title": "Services, Task Manager & the Registry",
            "phaseNum": "2",
            "order": 2,
            "summary": "Windows services are background programs that run without a window; Task Manager's Startup, Details, and End-task tabs let you see and control every running process; and the registry is a central settings database organized into hives, keys, and values that you edit carefully.",
            "filePath": "/guides/operating-systems/windows-for-power-users/02-services-task-manager-registry.md"
          },
          {
            "slug": "03-powershell-basics",
            "title": "PowerShell Basics",
            "phaseNum": "3",
            "order": 3,
            "summary": "PowerShell is a modern shell whose big idea is that commands pass objects, not plain text; cmdlets are named Verb-Noun (Get-Process, Get-ChildItem, Stop-Process); you pipe objects from one cmdlet to the next; and running a script for the first time hits the execution-policy gotcha.",
            "filePath": "/guides/operating-systems/windows-for-power-users/03-powershell-basics.md"
          }
        ]
      },
      {
        "slug": "macos-under-the-hood",
        "title": "macOS Under the Hood",
        "summary": "macOS is a polished Unix machine - Darwin and the XNU kernel underneath, a real Unix filesystem hiding beneath the Finder, apps that are secretly folders, and a Terminal that feels like Linux because it nearly is.",
        "order": 7,
        "phases": [
          {
            "slug": "01-macos-is-unix",
            "title": "macOS Is Unix",
            "phaseNum": "1",
            "order": 1,
            "summary": "macOS is built on Darwin, an open-source Unix foundation with the XNU kernel and a BSD heritage - which is why the Terminal feels like Linux and why a real Unix filesystem (/, /usr, /etc, /Users) sits underneath Finder's friendly view.",
            "filePath": "/guides/operating-systems/macos-under-the-hood/01-macos-is-unix.md"
          },
          {
            "slug": "02-apps-bundles-and-where-things-live",
            "title": "Apps, Bundles & Where Things Live",
            "phaseNum": "2",
            "order": 2,
            "summary": "A .app is actually a folder (a bundle), not a single file; macOS has several Library folders (system, /Library, and ~/Library) holding preferences as plist files, caches, and application support; and Homebrew is how you install real CLI tools.",
            "filePath": "/guides/operating-systems/macos-under-the-hood/02-apps-bundles-and-where-things-live.md"
          },
          {
            "slug": "03-under-the-surface",
            "title": "Under the Surface",
            "phaseNum": "3",
            "order": 3,
            "summary": "The Terminal runs zsh, macOS's default shell; launchd is the service manager that starts and supervises everything (macOS's answer to Linux's systemd); and Gatekeeper, SIP, and permission prompts are the security layers a power user meets - plus where macOS really differs from Linux.",
            "filePath": "/guides/operating-systems/macos-under-the-hood/03-under-the-surface.md"
          }
        ]
      },
      {
        "slug": "linux-for-servers",
        "title": "Linux for Servers",
        "summary": "The leap from desktop Linux to running a real server: a headless box you reach over SSH, services managed by systemd, logs read with journalctl, and a small discipline of users, cron, firewall, and updates that keeps it safe.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-server-mindset",
            "title": "The Server Mindset",
            "phaseNum": "1",
            "order": 1,
            "summary": "A server is the same Linux you know, but headless: no GUI, reached over SSH, and built around config files and long-running services instead of a desktop you click. Here's the shift in posture, and the basic ssh connect.",
            "filePath": "/guides/operating-systems/linux-for-servers/01-the-server-mindset.md"
          },
          {
            "slug": "02-managing-services-with-systemd",
            "title": "Managing Services with systemd",
            "phaseNum": "2",
            "order": 2,
            "summary": "systemd is the first process and the service manager on modern Linux. Here's what it actually is, how systemctl starts/stops/restarts/enables services and reads their status, and how journalctl shows you their logs.",
            "filePath": "/guides/operating-systems/linux-for-servers/02-managing-services-with-systemd.md"
          },
          {
            "slug": "03-running-it-safely",
            "title": "Running It Safely",
            "phaseNum": "3",
            "order": 3,
            "summary": "The discipline that keeps a server alive and uncompromised: least-privilege users and sudo, scheduled jobs with cron, a firewall with ufw, SSH hardening (keys over passwords), and keeping packages updated - ending in a hardening cheat-card.",
            "filePath": "/guides/operating-systems/linux-for-servers/03-running-it-safely.md"
          }
        ]
      },
      {
        "slug": "editing-in-the-terminal",
        "title": "Editing in the Terminal",
        "summary": "vim and nano survival: open, edit, save, and (the part everyone fears) quit, without losing your work or your SSH session.",
        "order": 9,
        "phases": [
          {
            "slug": "01-why-edit-in-the-terminal",
            "title": "Why edit in the terminal at all",
            "phaseNum": "1",
            "order": 1,
            "summary": "On servers and over SSH there's often no desktop and no mouse - the only way to change a file is a terminal editor. nano is the gentle default that shows its shortcuts on screen; vim is everywhere and worth respecting.",
            "filePath": "/guides/operating-systems/editing-in-the-terminal/01-why-edit-in-the-terminal.md"
          },
          {
            "slug": "02-nano-the-gentle-default",
            "title": "nano: the gentle default",
            "phaseNum": "2",
            "order": 2,
            "summary": "nano works the way your instincts expect: type to insert, arrow keys to move, and a menu of shortcuts at the bottom of the screen the whole time. Ctrl+O saves, Ctrl+X quits - and it never hides the exit.",
            "filePath": "/guides/operating-systems/editing-in-the-terminal/02-nano-the-gentle-default.md"
          },
          {
            "slug": "03-vim-modes-and-escaping",
            "title": "vim: the mode that traps everyone, and the way out",
            "phaseNum": "3",
            "order": 3,
            "summary": "vim's one big idea is modes: normal mode (keys are commands) and insert mode (keys are text). Press Esc to get to normal, then :wq to save and quit or :q! to quit and throw everything away. That's the escape.",
            "filePath": "/guides/operating-systems/editing-in-the-terminal/03-vim-modes-and-escaping.md"
          }
        ]
      },
      {
        "slug": "how-your-computer-boots",
        "title": "How Your Computer Boots",
        "summary": "What actually happens between pressing the power button and reaching a login screen \u2014 firmware, bootloader, and kernel handing off control in sequence.",
        "order": 10,
        "phases": [
          {
            "slug": "01-power-to-post",
            "title": "Power to POST to firmware",
            "phaseNum": "1",
            "order": 1,
            "summary": "What actually happens between pressing the power button and reaching a login screen \u2014 firmware, bootloader, and kernel handing off control in sequence.",
            "filePath": "/guides/operating-systems/how-your-computer-boots/01-power-to-post.md"
          },
          {
            "slug": "02-the-bootloader",
            "title": "The bootloader's job",
            "phaseNum": "2",
            "order": 2,
            "summary": "What actually happens between pressing the power button and reaching a login screen \u2014 firmware, bootloader, and kernel handing off control in sequence.",
            "filePath": "/guides/operating-systems/how-your-computer-boots/02-the-bootloader.md"
          },
          {
            "slug": "03-kernel-init-to-login",
            "title": "Kernel init to login screen",
            "phaseNum": "3",
            "order": 3,
            "summary": "What actually happens between pressing the power button and reaching a login screen \u2014 firmware, bootloader, and kernel handing off control in sequence.",
            "filePath": "/guides/operating-systems/how-your-computer-boots/03-kernel-init-to-login.md"
          }
        ]
      },
      {
        "slug": "deadlocks-explained",
        "title": "Deadlocks Explained",
        "summary": "What a deadlock actually is, the four conditions that must all be true for one to happen, and how to prevent and detect them in real code.",
        "order": 11,
        "phases": [
          {
            "slug": "01-what-a-deadlock-is",
            "title": "What a deadlock actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "What a deadlock actually is, the four conditions that must all be true for one to happen, and how to prevent and detect them in real code.",
            "filePath": "/guides/operating-systems/deadlocks-explained/01-what-a-deadlock-is.md"
          },
          {
            "slug": "02-the-four-conditions",
            "title": "The four conditions that must all be true",
            "phaseNum": "2",
            "order": 2,
            "summary": "What a deadlock actually is, the four conditions that must all be true for one to happen, and how to prevent and detect them in real code.",
            "filePath": "/guides/operating-systems/deadlocks-explained/02-the-four-conditions.md"
          },
          {
            "slug": "03-preventing-and-detecting",
            "title": "Preventing and detecting them in real code",
            "phaseNum": "3",
            "order": 3,
            "summary": "What a deadlock actually is, the four conditions that must all be true for one to happen, and how to prevent and detect them in real code.",
            "filePath": "/guides/operating-systems/deadlocks-explained/03-preventing-and-detecting.md"
          }
        ]
      },
      {
        "slug": "system-calls-explained",
        "title": "System Calls Explained",
        "summary": "The controlled doorway between your program and the kernel \u2014 why it exists, what happens during one, and why it matters for real performance.",
        "order": 12,
        "phases": [
          {
            "slug": "01-user-mode-vs-kernel-mode",
            "title": "Why programs can't touch hardware directly",
            "phaseNum": "1",
            "order": 1,
            "summary": "The controlled doorway between your program and the kernel \u2014 why it exists, what happens during one, and why it matters for real performance.",
            "filePath": "/guides/operating-systems/system-calls-explained/01-user-mode-vs-kernel-mode.md"
          },
          {
            "slug": "02-the-mechanics-of-a-syscall",
            "title": "What actually happens during a syscall",
            "phaseNum": "2",
            "order": 2,
            "summary": "The controlled doorway between your program and the kernel \u2014 why it exists, what happens during one, and why it matters for real performance.",
            "filePath": "/guides/operating-systems/system-calls-explained/02-the-mechanics-of-a-syscall.md"
          },
          {
            "slug": "03-why-syscalls-matter-for-performance",
            "title": "Why syscalls matter for real performance",
            "phaseNum": "3",
            "order": 3,
            "summary": "The controlled doorway between your program and the kernel \u2014 why it exists, what happens during one, and why it matters for real performance.",
            "filePath": "/guides/operating-systems/system-calls-explained/03-why-syscalls-matter-for-performance.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "hardware",
    "name": "Hardware",
    "icon": "ti-cpu",
    "blurb": "How the machine is actually built and talks to itself - from the chip to the device on your desk.",
    "guides": [
      {
        "slug": "how-a-computer-works",
        "title": "How a Computer Actually Works - The Parts, Explained Plainly",
        "summary": "What the handful of parts inside a computer actually are, how they work together to run a program, and why that explains everything from 'my laptop is slow' to which specs to care about when you buy one.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-parts",
            "title": "The Parts and What They Do",
            "phaseNum": "1",
            "order": 1,
            "summary": "A computer is a machine that follows instructions very fast, built from a handful of parts: the CPU does the work, RAM is the fast temporary workspace, storage is the permanent filing cabinet, and the motherboard's wiring connects them all - fed by power and reached through the things you plug in.",
            "filePath": "/guides/hardware/how-a-computer-works/01-the-parts.md"
          },
          {
            "slug": "02-running-a-program",
            "title": "How They Work Together to Run a Program",
            "phaseNum": "2",
            "order": 2,
            "summary": "A program lives in storage, gets copied into RAM to be used, and the CPU reads its instructions one at a time in a fetch-then-execute loop - and because the CPU is fast, RAM slower, and storage much slower, data has to keep moving up toward the CPU to keep everything quick.",
            "filePath": "/guides/hardware/how-a-computer-works/02-running-a-program.md"
          },
          {
            "slug": "03-fast-vs-slow",
            "title": "Why This Explains 'Fast vs Slow' (and Buying a Computer)",
            "phaseNum": "3",
            "order": 3,
            "summary": "The parts model explains real life: CPU cores and GHz, the amount of RAM, and SSD size each map to a part you now understand - and 'my computer is slow' almost always traces to one of them, so you can diagnose it instead of just suffering.",
            "filePath": "/guides/hardware/how-a-computer-works/03-fast-vs-slow.md"
          }
        ]
      },
      {
        "slug": "cpu-ram-and-storage",
        "title": "CPU, RAM & Storage, Explained",
        "summary": "The three components that decide whether a computer feels fast - the CPU, the RAM, and the storage - each properly explained, plus the one idea (the memory hierarchy) that ties them together.",
        "order": 2,
        "phases": [
          {
            "slug": "01-the-cpu-the-worker",
            "title": "The CPU \u2014 the Worker",
            "phaseNum": "1",
            "order": 1,
            "summary": "The CPU runs your programs by repeating one tiny loop \u2014 fetch an instruction, execute it, repeat \u2014 billions of times a second; clock speed (GHz) is how fast it loops, cores are how many can loop at once, and cache is the sliver of ultra-fast memory that keeps it fed.",
            "filePath": "/guides/hardware/cpu-ram-and-storage/01-the-cpu-the-worker.md"
          },
          {
            "slug": "02-ram-the-workspace",
            "title": "RAM \u2014 the Workspace",
            "phaseNum": "2",
            "order": 2,
            "summary": "RAM is your computer's working memory \u2014 fast, but wiped the moment the power goes off; it holds whatever's actively in use, and when it runs out the system slows to a crawl as it shuffles data to slower storage to cope.",
            "filePath": "/guides/hardware/cpu-ram-and-storage/02-ram-the-workspace.md"
          },
          {
            "slug": "03-storage-the-filing-cabinet",
            "title": "Storage \u2014 the Filing Cabinet",
            "phaseNum": "3",
            "order": 3,
            "summary": "Storage is where your data lives when the power's off \u2014 big and permanent but slower than RAM; capacity is how much it holds and speed is how fast it hands data over, and the memory hierarchy (cache \u2192 RAM \u2192 storage) ties all three parts together.",
            "filePath": "/guides/hardware/cpu-ram-and-storage/03-storage-the-filing-cabinet.md"
          }
        ]
      },
      {
        "slug": "storage-hdd-ssd-nvme",
        "title": "Storage Deep-Dive: HDD vs SSD vs NVMe",
        "summary": "How data is physically stored on HDDs, SSDs, and NVMe drives - why a spinning disk is slow at random access, why flash makes an old machine feel new, and why the cable an SSD plugs into can quietly cap its speed.",
        "order": 3,
        "phases": [
          {
            "slug": "01-hdd-spinning-rust",
            "title": "HDD - Spinning Rust",
            "phaseNum": "1",
            "order": 1,
            "summary": "A hard disk drive stores data on spinning metal platters that a tiny arm physically flies across; that mechanical movement is why random access is slow (seek time plus rotational latency) while sequential reads stay reasonable - and why HDDs are still the cheapest way to store a lot of data.",
            "filePath": "/guides/hardware/storage-hdd-ssd-nvme/01-hdd-spinning-rust.md"
          },
          {
            "slug": "02-ssd-flash-no-moving-parts",
            "title": "SSD - Flash, No Moving Parts",
            "phaseNum": "2",
            "order": 2,
            "summary": "A solid-state drive stores data in flash memory cells with no moving parts, so reaching scattered data costs almost nothing and random access becomes dramatically faster than an HDD; the trade-offs are higher cost per gigabyte and cells that wear out with writes, which wear-leveling spreads out - and this is why an SSD makes an old computer feel new.",
            "filePath": "/guides/hardware/storage-hdd-ssd-nvme/02-ssd-flash-no-moving-parts.md"
          },
          {
            "slug": "03-nvme-vs-sata",
            "title": "NVMe vs SATA - the Interface Bottleneck",
            "phaseNum": "3",
            "order": 3,
            "summary": "An SSD's flash can be far faster than the connection it plugs into; SATA was designed for spinning disks and caps SSD speed, while NVMe over PCIe gives flash a much wider, lower-overhead path - here's how to tell which interface you have and which storage to pick for common cases.",
            "filePath": "/guides/hardware/storage-hdd-ssd-nvme/03-nvme-vs-sata.md"
          }
        ]
      },
      {
        "slug": "how-data-moves-inside-a-machine",
        "title": "How Data Moves Inside a Machine",
        "summary": "The roads and traffic signals inside your computer: what a bus is, how the CPU reads and writes RAM by address, how it reaches out to devices, and how interrupts let a device get the CPU's attention the instant something happens.",
        "order": 4,
        "phases": [
          {
            "slug": "01-buses-and-addresses",
            "title": "Buses & Addresses",
            "phaseNum": "1",
            "order": 1,
            "summary": "A bus is shared wiring that carries data between components; every byte of RAM has its own number (an address); and the CPU reads and writes memory by putting an address on the bus and saying read or write.",
            "filePath": "/guides/hardware/how-data-moves-inside-a-machine/01-buses-and-addresses.md"
          },
          {
            "slug": "02-how-the-cpu-talks-to-devices",
            "title": "How the CPU Talks to Devices (I/O)",
            "phaseNum": "2",
            "order": 2,
            "summary": "The CPU reaches devices the same way it reaches RAM - over buses - using memory-mapped I/O or port I/O; and DMA lets a device move data to and from RAM on its own, so the CPU isn't tied up copying every byte.",
            "filePath": "/guides/hardware/how-data-moves-inside-a-machine/02-how-the-cpu-talks-to-devices.md"
          },
          {
            "slug": "03-interrupts",
            "title": "Interrupts - Getting the CPU's Attention",
            "phaseNum": "3",
            "order": 3,
            "summary": "Instead of the CPU constantly checking whether a device is ready (polling), an interrupt is a signal that makes the CPU pause what it's doing and handle the event the instant it happens - which is what makes a computer feel responsive.",
            "filePath": "/guides/hardware/how-data-moves-inside-a-machine/03-interrupts.md"
          }
        ]
      },
      {
        "slug": "how-devices-connect",
        "title": "How Devices Connect (USB, PCIe, GPUs & Peripherals)",
        "summary": "How the outside world and expansion cards plug into a computer: the USB host/device model, the PCIe highway inside the case, and how GPUs and everyday peripherals present themselves to the system.",
        "order": 5,
        "phases": [
          {
            "slug": "01-usb-and-the-host-device-model",
            "title": "USB & the Host/Device Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "USB has one host (the computer) in charge of many devices; plugging something in triggers enumeration - the host detects the device, asks what it is, and loads a driver. Hubs let one port branch into many, and USB's confusing names describe speed and a connector shape, not the same thing.",
            "filePath": "/guides/hardware/how-devices-connect/01-usb-and-the-host-device-model.md"
          },
          {
            "slug": "02-pcie-the-internal-highway",
            "title": "PCIe - the High-Speed Internal Highway",
            "phaseNum": "2",
            "order": 2,
            "summary": "PCIe is the fast expansion bus inside the case. It moves data over lanes - independent parallel pairs of wires - and slots are sized by how many lanes they carry (x1, x4, x8, x16). Lane count sets bandwidth; the generation sets the speed per lane. GPUs, NVMe SSDs, and network cards all plug in here.",
            "filePath": "/guides/hardware/how-devices-connect/02-pcie-the-internal-highway.md"
          },
          {
            "slug": "03-gpus-and-peripherals",
            "title": "GPUs & Peripherals",
            "phaseNum": "3",
            "order": 3,
            "summary": "A GPU exists to do massively parallel work - graphics and now machine learning - and connects over PCIe, where feeding it data is often the real bottleneck. Everyday peripherals (keyboard, mouse, display, webcam) present themselves through standard device classes, so one generic driver can handle thousands of models.",
            "filePath": "/guides/hardware/how-devices-connect/03-gpus-and-peripherals.md"
          }
        ]
      },
      {
        "slug": "inside-a-server-and-data-center",
        "title": "Inside a Server & Data-Center Hardware",
        "summary": "What a server actually is as a physical machine, why it's built differently from your laptop, how it's made not to stop, and what 'the cloud' is really made of - rooms full of these machines.",
        "order": 6,
        "phases": [
          {
            "slug": "01-a-server-vs-your-laptop",
            "title": "A Server vs Your Laptop",
            "phaseNum": "1",
            "order": 1,
            "summary": "A server has the same fundamental parts as your laptop - CPU, RAM, storage - but arranged around different priorities: rack-mount form factor measured in U, ECC memory that catches bit errors, more cores and sockets, redundant power supplies, and a tiny always-on management computer (BMC/IPMI) you can reach even when the machine is 'off'.",
            "filePath": "/guides/hardware/inside-a-server-and-data-center/01-a-server-vs-your-laptop.md"
          },
          {
            "slug": "02-built-not-to-stop",
            "title": "Built Not to Stop - Redundancy & Reliability",
            "phaseNum": "2",
            "order": 2,
            "summary": "The reliability mindset in hardware: one principle - eliminate the single point of failure - expressed through RAID (combining disks for redundancy and/or speed), hot-swap drives and power supplies you can replace without powering down, and pairing every critical part. Plus the rule that has saved careers: RAID is not a backup.",
            "filePath": "/guides/hardware/inside-a-server-and-data-center/02-built-not-to-stop.md"
          },
          {
            "slug": "03-the-data-center-and-the-cloud",
            "title": "The Data Center & \\\"The Cloud\\\"",
            "phaseNum": "3",
            "order": 3,
            "summary": "Zoom out from one server to the building: rows of racks, top-of-rack networking, the power and cooling that actually limit a data center, and redundancy applied at building scale. Then a precise answer to what 'the cloud' is - a cloud VM is a slice of a real server in one of these rooms. The cloud is someone else's computer, made exact.",
            "filePath": "/guides/hardware/inside-a-server-and-data-center/03-the-data-center-and-the-cloud.md"
          }
        ]
      },
      {
        "slug": "why-your-computer-is-slow",
        "title": "Why Your Computer Is Slow",
        "summary": "What to actually upgrade (RAM versus SSD versus CPU) instead of guessing, by learning to read which part is the real bottleneck.",
        "order": 7,
        "phases": [
          {
            "slug": "01-the-bottleneck-mental-model",
            "title": "The bottleneck: your computer is only as fast as its slowest link",
            "phaseNum": "1",
            "order": 1,
            "summary": "What to actually upgrade (RAM versus SSD versus CPU) instead of guessing, by learning to read which part is the real bottleneck.",
            "filePath": "/guides/hardware/why-your-computer-is-slow/01-the-bottleneck-mental-model.md"
          },
          {
            "slug": "02-reading-the-gauges",
            "title": "Reading the gauges: Task Manager and Activity Monitor",
            "phaseNum": "2",
            "order": 2,
            "summary": "What to actually upgrade (RAM versus SSD versus CPU) instead of guessing, by learning to read which part is the real bottleneck.",
            "filePath": "/guides/hardware/why-your-computer-is-slow/02-reading-the-gauges.md"
          },
          {
            "slug": "03-what-to-upgrade",
            "title": "The verdict: what to actually upgrade",
            "phaseNum": "3",
            "order": 3,
            "summary": "What to actually upgrade (RAM versus SSD versus CPU) instead of guessing, by learning to read which part is the real bottleneck.",
            "filePath": "/guides/hardware/why-your-computer-is-slow/03-what-to-upgrade.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "networking",
    "name": "Networking",
    "icon": "ti-network",
    "blurb": "How the internet really works, and how to design networks that hold up.",
    "guides": [
      {
        "slug": "how-the-internet-works",
        "title": "How the Internet Actually Works",
        "summary": "The absolute basics of networking: what happens when you open a web page - how your request travels to a server and back, how machines find each other by address and name, and how they agree on a shared language.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-journey-of-one-request",
            "title": "The Journey of One Request",
            "phaseNum": "1",
            "order": 1,
            "summary": "When you open a web page, your request travels from your device through your home router, out through your ISP, across the internet to a server, and the answer comes back - all carried in small labeled chunks called packets.",
            "filePath": "/guides/networking/how-the-internet-works/01-the-journey-of-one-request.md"
          },
          {
            "slug": "02-addresses-and-names",
            "title": "Addresses & Names",
            "phaseNum": "2",
            "order": 2,
            "summary": "Every machine on the internet has an IP address - a number that identifies it. DNS is the internet's phone book: it turns human-friendly names like example.com into those numbers, so you can remember names while machines route by numbers.",
            "filePath": "/guides/networking/how-the-internet-works/02-addresses-and-names.md"
          },
          {
            "slug": "03-client-server-and-protocols",
            "title": "Client, Server & Talking the Same Language",
            "phaseNum": "3",
            "order": 3,
            "summary": "The internet runs on the client/server model - one machine asks, another answers - and on protocols: shared agreements about how to talk. HTTP is the agreement for asking for web pages; TCP is the agreement that carries it reliably. The internet is many simple agreements stacked up.",
            "filePath": "/guides/networking/how-the-internet-works/03-client-server-and-protocols.md"
          }
        ]
      },
      {
        "slug": "ip-dns-and-ports",
        "title": "IP Addresses, DNS & Ports, Explained",
        "summary": "The address book of the internet: what an IP address really is, how DNS turns names like example.com into numbers, and how ports let one machine run many services at once.",
        "order": 2,
        "phases": [
          {
            "slug": "01-ip-addresses",
            "title": "IP Addresses - A Machine's Number",
            "phaseNum": "1",
            "order": 1,
            "summary": "An IP address is the number that identifies one machine on a network; IPv4 ran out of numbers so IPv6 added far more, and your home devices share a single public IP while each keeps a private one.",
            "filePath": "/guides/networking/ip-dns-and-ports/01-ip-addresses.md"
          },
          {
            "slug": "02-dns",
            "title": "DNS - Names to Numbers",
            "phaseNum": "2",
            "order": 2,
            "summary": "DNS is the internet's phone book: typing example.com triggers a lookup that returns an IP address, handled by a chain of resolvers and sped up by caching - and when it breaks, sites feel down even when they aren't.",
            "filePath": "/guides/networking/ip-dns-and-ports/02-dns.md"
          },
          {
            "slug": "03-ports",
            "title": "Ports - One Machine, Many Doors",
            "phaseNum": "3",
            "order": 3,
            "summary": "A single machine runs many services at once, each behind a numbered port; the real address of a service is the IP plus the port, and common ports (80/443 web, 22 SSH) tell you what's listening where.",
            "filePath": "/guides/networking/ip-dns-and-ports/03-ports.md"
          }
        ]
      },
      {
        "slug": "http-explained",
        "title": "HTTP, Explained - the language the web speaks",
        "summary": "What HTTP actually is: every time you load a page, your browser sends a request and a server sends a response. This guide makes that conversation - methods, status codes, headers, cookies, and the S in HTTPS - finally make sense.",
        "order": 3,
        "phases": [
          {
            "slug": "01-request-and-response",
            "title": "Request & Response - the core model",
            "phaseNum": "1",
            "order": 1,
            "summary": "The whole of HTTP is one pattern: the client sends a request, the server sends a response. This phase shows that exchange annotated, then breaks down a URL into its parts - scheme, host, path, and query.",
            "filePath": "/guides/networking/http-explained/01-request-and-response.md"
          },
          {
            "slug": "02-methods-and-status-codes",
            "title": "Methods & Status Codes - the verbs and the replies",
            "phaseNum": "2",
            "order": 2,
            "summary": "The four everyday HTTP methods (GET, POST, PUT, DELETE) and what each one means, plus the four families of status codes (2xx success, 3xx redirect, 4xx your fault, 5xx server's fault) and how to read any code calmly.",
            "filePath": "/guides/networking/http-explained/02-methods-and-status-codes.md"
          },
          {
            "slug": "03-headers-cookies-and-https",
            "title": "Headers, Cookies & the S in HTTPS",
            "phaseNum": "3",
            "order": 3,
            "summary": "The extra notes every HTTP message carries (headers - content type, authentication, and more), how cookies let a site remember who you are, and what the S in HTTPS actually buys you: encryption so others can't read or tamper with the conversation.",
            "filePath": "/guides/networking/http-explained/03-headers-cookies-and-https.md"
          }
        ]
      },
      {
        "slug": "your-home-network",
        "title": "Your Home Network, Explained",
        "summary": "What that box on your shelf actually is - the modem connects you to your ISP, the router shares that connection with all your devices, NAT lets them share one public IP, and a few settings keep the whole thing safe.",
        "order": 4,
        "phases": [
          {
            "slug": "01-the-router-and-the-modem",
            "title": "The Router (and the Modem)",
            "phaseNum": "1",
            "order": 1,
            "summary": "The modem connects your home to your ISP; the router shares that one connection among all your devices and runs your local network. Two different jobs, sometimes in one box.",
            "filePath": "/guides/networking/your-home-network/01-the-router-and-the-modem.md"
          },
          {
            "slug": "02-nat-and-private-ips",
            "title": "NAT & Private IPs",
            "phaseNum": "2",
            "order": 2,
            "summary": "Your devices all have private 192.168.x.x addresses and share one public IP. NAT is the router's translation trick that makes that work - and it's why the internet can't reach straight into your laptop.",
            "filePath": "/guides/networking/your-home-network/02-nat-and-private-ips.md"
          },
          {
            "slug": "03-wifi-and-keeping-it-safe",
            "title": "Wi-Fi & Keeping It Safe",
            "phaseNum": "3",
            "order": 3,
            "summary": "What the SSID, the bands (2.4 vs 5 GHz), and channels really are - plus the router's firewall and the handful of security settings that actually keep strangers off your network.",
            "filePath": "/guides/networking/your-home-network/03-wifi-and-keeping-it-safe.md"
          }
        ]
      },
      {
        "slug": "tcp-ip-model",
        "title": "The TCP/IP Model Without the Acronym Soup",
        "summary": "The layered model, finally intuitive: each layer does one job and trusts the layer below, like nesting envelopes - Link, Internet, Transport, Application, plus TCP vs UDP and a packet's round trip.",
        "order": 5,
        "phases": [
          {
            "slug": "01-why-layers",
            "title": "Why Layers?",
            "phaseNum": "1",
            "order": 1,
            "summary": "Each network layer does one job and trusts the layer below it - like nesting a letter in envelopes, where the writer ignores the trucks and the trucks ignore the words. That wrapping is called encapsulation.",
            "filePath": "/guides/networking/tcp-ip-model/01-why-layers.md"
          },
          {
            "slug": "02-the-four-layers",
            "title": "The Four Layers",
            "phaseNum": "2",
            "order": 2,
            "summary": "Link gets data to the next hop, Internet (IP) addresses and routes it across networks, Transport (TCP/UDP) delivers it to the right program, Application (HTTP/DNS) is what you actually use - mapped onto one real web request.",
            "filePath": "/guides/networking/tcp-ip-model/02-the-four-layers.md"
          },
          {
            "slug": "03-tcp-udp-and-the-round-trip",
            "title": "TCP vs UDP & a Packet's Round Trip",
            "phaseNum": "3",
            "order": 3,
            "summary": "TCP is reliable, ordered, and connection-based (the handshake); UDP is fast and fire-and-forget (video, games, DNS). Then: one packet traced down the stack on send and back up on receive - plus the OSI-7-vs-TCP/IP-4 confusion, settled.",
            "filePath": "/guides/networking/tcp-ip-model/03-tcp-udp-and-the-round-trip.md"
          }
        ]
      },
      {
        "slug": "troubleshooting-networks",
        "title": "Troubleshooting Networks",
        "summary": "A calm, methodical way to debug 'the internet is broken' - work up the layers (link, IP, gateway, DNS, destination), then use ping, traceroute, dig, and a packet capture to read exactly where the conversation died.",
        "order": 6,
        "phases": [
          {
            "slug": "01-work-up-the-layers",
            "title": "Work Up the Layers",
            "phaseNum": "1",
            "order": 1,
            "summary": "Instead of guessing, ask one yes/no question per rung - link up? have an IP? reach the gateway? resolve a name? reach the destination? - and the first 'no' is your answer.",
            "filePath": "/guides/networking/troubleshooting-networks/01-work-up-the-layers.md"
          },
          {
            "slug": "02-the-core-tools",
            "title": "The Core Tools",
            "phaseNum": "2",
            "order": 2,
            "summary": "ping tells you reachability and latency, traceroute/tracert shows the path and where it dies, and dig/nslookup answers 'is it DNS?' - here's how to read what each one's output actually means.",
            "filePath": "/guides/networking/troubleshooting-networks/02-the-core-tools.md"
          },
          {
            "slug": "03-reading-a-packet-capture",
            "title": "Reading a Packet Capture",
            "phaseNum": "3",
            "order": 3,
            "summary": "A packet capture is every packet on the wire, in order; learn to read the handshake, retransmissions, resets, and which side went quiet - so you can pinpoint exactly where a conversation broke.",
            "filePath": "/guides/networking/troubleshooting-networks/03-reading-a-packet-capture.md"
          }
        ]
      },
      {
        "slug": "designing-an-enterprise-network",
        "title": "Designing an Enterprise Network",
        "summary": "How to grow from a single home router into a network that holds up: segmentation to limit blast radius, scaling and redundancy to survive load and failure, and a security edge - firewalls, DMZ, VPN, zero-trust - that keeps the inside safe.",
        "order": 7,
        "phases": [
          {
            "slug": "01-segmentation",
            "title": "Segmentation",
            "phaseNum": "1",
            "order": 1,
            "summary": "Carving one big network into pieces - subnets and a calm take on CIDR and address planning, VLANs to separate departments on shared hardware, and why segmentation limits both the blast radius of a breach and everyday contention.",
            "filePath": "/guides/networking/designing-an-enterprise-network/01-segmentation.md"
          },
          {
            "slug": "02-scaling-and-reliability",
            "title": "Scaling & Reliability",
            "phaseNum": "2",
            "order": 2,
            "summary": "Keeping a network up under load and through failure - load balancers that spread traffic across many servers, redundancy so no single link or box is a single point of failure, and the infrastructure services (DHCP, internal DNS) a real network quietly runs on.",
            "filePath": "/guides/networking/designing-an-enterprise-network/02-scaling-and-reliability.md"
          },
          {
            "slug": "03-security-and-the-edge",
            "title": "Security & the Edge",
            "phaseNum": "3",
            "order": 3,
            "summary": "The perimeter and beyond - firewalls and stateful filtering, the DMZ that keeps public-facing services apart from the internal network, VPNs for secure remote access, and why zero-trust thinking replaces blind faith in the perimeter. Ties the whole design back to segmentation.",
            "filePath": "/guides/networking/designing-an-enterprise-network/03-security-and-the-edge.md"
          }
        ]
      },
      {
        "slug": "what-a-vpn-does",
        "title": "What a VPN Actually Does",
        "summary": "What a VPN really routes and hides, and what it does not: the encrypted-tunnel model, who can see what, and when a VPN is mostly theater.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-tunnel",
            "title": "The Tunnel - What a VPN Really Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A VPN is an encrypted tunnel to a relay server: it doesn't make you vanish, it routes all your traffic through one trusted machine that fetches the internet on your behalf.",
            "filePath": "/guides/networking/what-a-vpn-does/01-the-tunnel.md"
          },
          {
            "slug": "02-who-sees-what",
            "title": "Who Sees What - The Visibility Ledger",
            "phaseNum": "2",
            "order": 2,
            "summary": "Exactly what changes when the tunnel is on: your ISP loses sight of your destinations, websites see the VPN's address, and the VPN provider inherits the view your ISP used to have.",
            "filePath": "/guides/networking/what-a-vpn-does/02-who-sees-what.md"
          },
          {
            "slug": "03-where-the-promises-break",
            "title": "Where the Promises Break",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest part: HTTPS already encrypted your pages, you are not anonymous, and the VPN provider now sees what your ISP used to - when a VPN truly helps and when it's pure theater.",
            "filePath": "/guides/networking/what-a-vpn-does/03-where-the-promises-break.md"
          }
        ]
      },
      {
        "slug": "email-demystified",
        "title": "Email, Demystified (SPF, DKIM, DMARC)",
        "summary": "How email really travels and why yours lands in spam: SMTP, plus the three DNS records that prove a message is truly from your domain.",
        "order": 9,
        "phases": [
          {
            "slug": "01-the-journey-of-one-email",
            "title": "The Journey of One Email",
            "phaseNum": "1",
            "order": 1,
            "summary": "How email really travels and why yours lands in spam: SMTP, plus the three DNS records that prove a message is truly from your domain.",
            "filePath": "/guides/networking/email-demystified/01-the-journey-of-one-email.md"
          },
          {
            "slug": "02-spf-dkim-dmarc",
            "title": "The Three Proofs: SPF, DKIM, DMARC",
            "phaseNum": "2",
            "order": 2,
            "summary": "How email really travels and why yours lands in spam: SMTP, plus the three DNS records that prove a message is truly from your domain.",
            "filePath": "/guides/networking/email-demystified/02-spf-dkim-dmarc.md"
          },
          {
            "slug": "03-fixing-deliverability",
            "title": "Fixing Deliverability",
            "phaseNum": "3",
            "order": 3,
            "summary": "How email really travels and why yours lands in spam: SMTP, plus the three DNS records that prove a message is truly from your domain.",
            "filePath": "/guides/networking/email-demystified/03-fixing-deliverability.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "programming-concepts",
    "name": "Programming Concepts",
    "icon": "ti-bulb",
    "blurb": "The ideas under every language - how code runs, data structures, async, memory, big-O, and tool choice.",
    "guides": [
      {
        "slug": "programming-from-zero",
        "title": "Programming From Zero",
        "summary": "What a program actually is, the building blocks every language shares (variables, types, operators), and how code makes decisions and reuses work with if/else, loops, and functions.",
        "order": 1,
        "phases": [
          {
            "slug": "01-what-a-program-is",
            "title": "What a Program Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A program is a precise list of instructions a computer follows in order, top to bottom, doing exactly what you wrote and nothing else; your first example is one line that prints text.",
            "filePath": "/guides/programming-concepts/programming-from-zero/01-what-a-program-is.md"
          },
          {
            "slug": "02-building-blocks",
            "title": "The Building Blocks: Variables, Types & Operators",
            "phaseNum": "2",
            "order": 2,
            "summary": "Variables are named boxes that hold values; values come in types (numbers, text/strings, booleans); operators do math and comparison - and = means assign while == means compare.",
            "filePath": "/guides/programming-concepts/programming-from-zero/02-building-blocks.md"
          },
          {
            "slug": "03-control-flow-and-functions",
            "title": "Making Decisions & Reusing Work: Control Flow & Functions",
            "phaseNum": "3",
            "order": 3,
            "summary": "if/else lets a program branch on a condition, loops repeat work without copy-paste, and functions bundle instructions into a named, reusable tool you call by name - the most powerful idea a beginner can learn.",
            "filePath": "/guides/programming-concepts/programming-from-zero/03-control-flow-and-functions.md"
          }
        ]
      },
      {
        "slug": "what-happens-when-code-runs",
        "title": "What Actually Happens When Your Code Runs",
        "summary": "The journey from the text you type to a living program: how source code gets translated into machine instructions, where your data lives while it runs, and what 'running' actually means to the operating system and CPU.",
        "order": 2,
        "phases": [
          {
            "slug": "01-source-to-machine",
            "title": "From Source Code to Something the Machine Runs",
            "phaseNum": "1",
            "order": 1,
            "summary": "Your source code is just text; the CPU only runs machine instructions. A compiler translates the whole program ahead of time; an interpreter translates and runs it line by line as it goes - and that one difference explains most of the trade-offs you'll hear about.",
            "filePath": "/guides/programming-concepts/what-happens-when-code-runs/01-source-to-machine.md"
          },
          {
            "slug": "02-stack-and-heap",
            "title": "Where Your Data Lives: the Stack & the Heap",
            "phaseNum": "2",
            "order": 2,
            "summary": "While your program runs, every value lives in memory in one of two places: the stack - fast, automatic, tied to function calls - or the heap, flexible and for data that must outlive the function that made it. 'Stack overflow' is what happens when the stack runs out of room.",
            "filePath": "/guides/programming-concepts/what-happens-when-code-runs/02-stack-and-heap.md"
          },
          {
            "slug": "03-what-running-means",
            "title": "What \\\"Running\\\" Means",
            "phaseNum": "3",
            "order": 3,
            "summary": "When you run a program, the operating system loads it into RAM and turns it into a process - and the OS then schedules that process onto the CPU, which executes its machine instructions a step at a time. This ties the whole chain together: source \u2192 translated \u2192 process \u2192 CPU executes.",
            "filePath": "/guides/programming-concepts/what-happens-when-code-runs/03-what-running-means.md"
          }
        ]
      },
      {
        "slug": "data-structures-explained",
        "title": "Data Structures, Explained",
        "summary": "The handful of containers you actually use day to day - arrays/lists, maps, sets, stacks, queues, and linked lists - what each one is really good at, and how to pick the right one without overthinking it.",
        "order": 3,
        "phases": [
          {
            "slug": "01-arrays-and-lists",
            "title": "Arrays & Lists - Ordered Collections",
            "phaseNum": "1",
            "order": 1,
            "summary": "An array (or list) is an ordered row of numbered slots: jumping to any slot by its index is instant, adding to the end is cheap, but inserting in the middle means shoving everything over.",
            "filePath": "/guides/programming-concepts/data-structures-explained/01-arrays-and-lists.md"
          },
          {
            "slug": "02-maps-and-sets",
            "title": "Maps & Sets - Lookup by Key",
            "phaseNum": "2",
            "order": 2,
            "summary": "A map stores key \u2192 value pairs so you can fetch a value instantly by its key, no scanning required; a set is the same trick used to track a bag of unique items. Both rely on 'hashing' - a label that jumps you straight to the value.",
            "filePath": "/guides/programming-concepts/data-structures-explained/02-maps-and-sets.md"
          },
          {
            "slug": "03-choosing-the-right-one",
            "title": "Choosing the Right One",
            "phaseNum": "3",
            "order": 3,
            "summary": "A three-question decision guide - need order? need fast lookup by key? need uniqueness? - plus a side-by-side table of what's fast vs slow per container, with Big-O introduced only as intuition (constant vs grows-with-size).",
            "filePath": "/guides/programming-concepts/data-structures-explained/03-choosing-the-right-one.md"
          },
          {
            "slug": "04-stacks-queues-and-linked-lists",
            "title": "Stacks, Queues & Linked Lists",
            "phaseNum": "4",
            "order": 4,
            "summary": "Two access-order variants on a list - a stack (LIFO, last in first out) and a queue (FIFO, first in first out) - plus linked lists: nodes chained by pointers instead of sitting in one contiguous row, trading fast index access for cheap insertion.",
            "filePath": "/guides/programming-concepts/data-structures-explained/04-stacks-queues-and-linked-lists.md"
          }
        ]
      },
      {
        "slug": "regular-expressions-explained",
        "title": "Regular Expressions, Explained",
        "summary": "A regex is a pattern that describes the shape of text - not code you run, but text you describe. Learn the mental model, the small toolkit you'll use 90% of the time, and how to avoid the classic traps.",
        "order": 4,
        "phases": [
          {
            "slug": "01-what-a-regex-actually-is",
            "title": "What a Regex Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A regex is a pattern that describes the shape of text. You don't write code that searches - you describe what you're looking for, and a regex engine does the searching.",
            "filePath": "/guides/programming-concepts/regular-expressions-explained/01-what-a-regex-actually-is.md"
          },
          {
            "slug": "02-the-core-toolkit",
            "title": "The Core Toolkit",
            "phaseNum": "2",
            "order": 2,
            "summary": "The pieces you'll use 90% of the time: literals, character classes (\\\\d \\\\w \\\\s and [...]), quantifiers (* + ? {n}), anchors (^ $), and groups (...) - built up to matching a real date.",
            "filePath": "/guides/programming-concepts/regular-expressions-explained/02-the-core-toolkit.md"
          },
          {
            "slug": "03-using-regex-for-real",
            "title": "Using Regex for Real (and the Gotchas)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Where you actually meet regex - editor search/replace, grep, and code - and the classic traps: greedy vs lazy matching, escaping special characters, and regex becoming write-only. The cure is to test on real samples and build incrementally.",
            "filePath": "/guides/programming-concepts/regular-expressions-explained/03-using-regex-for-real.md"
          }
        ]
      },
      {
        "slug": "async-await-and-the-event-loop",
        "title": "Async/Await & the Event Loop",
        "summary": "Async exists because programs spend most of their time waiting; the event loop is a single thread plus a queue of ready-to-continue work; and async/await is just readable syntax over 'a value that isn't here yet.'",
        "order": 5,
        "phases": [
          {
            "slug": "01-why-async-exists",
            "title": "Why Async Exists",
            "phaseNum": "1",
            "order": 1,
            "summary": "A huge fraction of programming is waiting - on the network, the disk, a timer. Blocking stops the worker dead while it waits; non-blocking starts the wait, does other useful work, and comes back when the result is ready.",
            "filePath": "/guides/programming-concepts/async-await-and-the-event-loop/01-why-async-exists.md"
          },
          {
            "slug": "02-the-event-loop",
            "title": "The Event Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "The event loop is a single thread running your code plus a queue of 'things ready to continue'; it runs one piece to completion, then picks the next ready task - which is how one thread stays concurrent, and why a long synchronous task freezes everything.",
            "filePath": "/guides/programming-concepts/async-await-and-the-event-loop/02-the-event-loop.md"
          },
          {
            "slug": "03-promises-and-async-await",
            "title": "Promises & async/await",
            "phaseNum": "3",
            "order": 3,
            "summary": "A promise is a value that isn't here yet; await means 'pause this function until the value is ready, without freezing the event loop.' async/await is readable syntax over the exact same model - and forgetting await or ignoring a rejection are the two mistakes that bite everyone.",
            "filePath": "/guides/programming-concepts/async-await-and-the-event-loop/03-promises-and-async-await.md"
          }
        ]
      },
      {
        "slug": "memory-and-garbage-collection",
        "title": "Memory & Garbage Collection, Explained",
        "summary": "What actually happens to the objects your code creates: where they live in memory, why some of them have to be cleaned up, and how the two big approaches - freeing memory by hand versus a garbage collector that does it for you - really work.",
        "order": 6,
        "phases": [
          {
            "slug": "01-where-objects-live",
            "title": "Where Objects Live & How They're Allocated",
            "phaseNum": "1",
            "order": 1,
            "summary": "A quick recap of the stack (fast, automatic) versus the heap (flexible, manual), then the heart of it: the heap is where objects that outlive a function go, and the hard problem is knowing when it's safe to reclaim that memory.",
            "filePath": "/guides/programming-concepts/memory-and-garbage-collection/01-where-objects-live.md"
          },
          {
            "slug": "02-manual-vs-automatic",
            "title": "Manual vs Automatic Memory",
            "phaseNum": "2",
            "order": 2,
            "summary": "Two ways to answer 'when is it safe to reclaim memory?': manual (C/C++ - you allocate and free, total control but footguns like use-after-free and leaks) versus automatic (Java/Go/Python/JS - a garbage collector does it for you, safe but with a cost), plus Rust's ownership as a third way.",
            "filePath": "/guides/programming-concepts/memory-and-garbage-collection/02-manual-vs-automatic.md"
          },
          {
            "slug": "03-how-garbage-collection-works",
            "title": "How Garbage Collection Actually Works",
            "phaseNum": "3",
            "order": 3,
            "summary": "The core idea is reachability: anything you can still reach from your live variables is kept, everything else is garbage. Mark-and-sweep at a gentle level, why a garbage-collected program can hiccup (GC pauses), and the uncomfortable truth that memory leaks still happen in GC languages - with the classic cause and its cure.",
            "filePath": "/guides/programming-concepts/memory-and-garbage-collection/03-how-garbage-collection-works.md"
          }
        ]
      },
      {
        "slug": "languages-explained-like-a-human",
        "title": "Python, JavaScript, Go & Rust - Explained Like a Human",
        "summary": "What each major language is actually for and what it feels like to use, so you can choose one on purpose instead of by hype - the axes that make languages different, an honest look at four of them, and a practical way to pick.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-makes-languages-different",
            "title": "What Actually Makes Languages Different",
            "phaseNum": "1",
            "order": 1,
            "summary": "The four axes that actually separate programming languages - typed vs dynamic, compiled vs interpreted, how memory is managed, and where the language runs - so any language becomes a point on a map you can reason about.",
            "filePath": "/guides/programming-concepts/languages-explained-like-a-human/01-what-makes-languages-different.md"
          },
          {
            "slug": "02-the-four-honestly",
            "title": "The Four, Honestly",
            "phaseNum": "2",
            "order": 2,
            "summary": "A fair, hype-free look at Python, JavaScript/Node, Go, and Rust - what each is genuinely for, a tiny taste of how it reads, and the honest pros and cons of each, placed on the four axes from Phase 1.",
            "filePath": "/guides/programming-concepts/languages-explained-like-a-human/02-the-four-honestly.md"
          },
          {
            "slug": "03-how-to-choose",
            "title": "How to Choose",
            "phaseNum": "3",
            "order": 3,
            "summary": "A practical, judgment-flagged way to pick a language by what you're building and the people around you instead of by hype - a side-by-side comparison table, a decision walkthrough, and the reassurance that concepts transfer and your first language matters less than the internet says.",
            "filePath": "/guides/programming-concepts/languages-explained-like-a-human/03-how-to-choose.md"
          }
        ]
      },
      {
        "slug": "oop-vs-functional",
        "title": "Object-Oriented vs Functional, Honestly",
        "summary": "Two ways of organizing code, demystified: what object-oriented programming actually is, what functional programming actually is, and the honest truth about which to reach for and when.",
        "order": 8,
        "phases": [
          {
            "slug": "01-what-oop-actually-is",
            "title": "What OOP Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Object-oriented programming bundles data together with the behavior that acts on it; encapsulation, inheritance, and polymorphism each solve a specific problem - here's the plain-language version of each.",
            "filePath": "/guides/programming-concepts/oop-vs-functional/01-what-oop-actually-is.md"
          },
          {
            "slug": "02-what-functional-actually-is",
            "title": "What Functional Programming Actually Is",
            "phaseNum": "2",
            "order": 2,
            "summary": "Functional programming makes functions the core unit, avoids changing data in place (immutability), favors pure functions with no side effects, and builds big behavior by composing small functions - which is what makes the code easier to test and reason about.",
            "filePath": "/guides/programming-concepts/oop-vs-functional/02-what-functional-actually-is.md"
          },
          {
            "slug": "03-which-when",
            "title": "Honestly: Which, When?",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest truth is that most real languages and codebases are both - OOP and FP are tools, not religions. Here's a fair comparison of where each one genuinely shines, with the judgment calls flagged as judgment.",
            "filePath": "/guides/programming-concepts/oop-vs-functional/03-which-when.md"
          }
        ]
      },
      {
        "slug": "dates-and-time-zones",
        "title": "Dates and Time Zones",
        "summary": "The bug that corrupts data and breaks launches: UTC versus local, offsets versus zones, DST, and the rules that keep time from wrecking your app.",
        "order": 9,
        "phases": [
          {
            "slug": "01-a-moment-is-not-a-clock-reading",
            "title": "A Moment Is Not a Clock Reading",
            "phaseNum": "1",
            "order": 1,
            "summary": "The core split: an instant on the timeline versus the local wall-clock string a human reads. UTC, Unix timestamps, and why '3pm' is not a moment until you say where.",
            "filePath": "/guides/programming-concepts/dates-and-time-zones/01-a-moment-is-not-a-clock-reading.md"
          },
          {
            "slug": "02-offsets-zones-and-the-golden-rules",
            "title": "Offsets, Zones, and the Golden Rules",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why +02:00 is not the same as Europe/Berlin, what the IANA database actually is, and the small set of rules that keep your time handling safe.",
            "filePath": "/guides/programming-concepts/dates-and-time-zones/02-offsets-zones-and-the-golden-rules.md"
          },
          {
            "slug": "03-the-2am-that-happens-twice",
            "title": "The 2am That Happens Twice",
            "phaseNum": "3",
            "order": 3,
            "summary": "Daylight saving creates gaps where time skips and overlaps where it repeats. The off-by-one-hour bug, the ambiguous timestamp, and why naive math breaks.",
            "filePath": "/guides/programming-concepts/dates-and-time-zones/03-the-2am-that-happens-twice.md"
          }
        ]
      },
      {
        "slug": "character-encodings-unicode",
        "title": "Character Encodings and Unicode",
        "summary": "Why text turns into garbled symbols, how UTF-8 actually works, and the difference between bytes, code points, and the characters a user sees.",
        "order": 10,
        "phases": [
          {
            "slug": "01-bytes-are-not-characters",
            "title": "Bytes Are Not Characters",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why text turns into garbled symbols, how UTF-8 actually works, and the difference between bytes, code points, and the characters a user sees.",
            "filePath": "/guides/programming-concepts/character-encodings-unicode/01-bytes-are-not-characters.md"
          },
          {
            "slug": "02-how-utf-8-actually-works",
            "title": "How UTF-8 Actually Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why text turns into garbled symbols, how UTF-8 actually works, and the difference between bytes, code points, and the characters a user sees.",
            "filePath": "/guides/programming-concepts/character-encodings-unicode/02-how-utf-8-actually-works.md"
          },
          {
            "slug": "03-when-text-lies",
            "title": "When Text Lies: Emoji, Graphemes, and the BOM",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why text turns into garbled symbols, how UTF-8 actually works, and the difference between bytes, code points, and the characters a user sees.",
            "filePath": "/guides/programming-concepts/character-encodings-unicode/03-when-text-lies.md"
          }
        ]
      },
      {
        "slug": "floating-point-and-money",
        "title": "Floating Point and Money",
        "summary": "Why 0.1 plus 0.2 is not 0.3, what floats can and cannot represent, and the iron rule: never store money in a float.",
        "order": 11,
        "phases": [
          {
            "slug": "01-why-floats-surprise-you",
            "title": "Why Floats Surprise You",
            "phaseNum": "1",
            "order": 1,
            "summary": "A float stores numbers in binary, so most decimal fractions can't be represented exactly - which is why 0.1 plus 0.2 lands a hair off 0.3.",
            "filePath": "/guides/programming-concepts/floating-point-and-money/01-why-floats-surprise-you.md"
          },
          {
            "slug": "02-where-it-bites",
            "title": "Where It Bites",
            "phaseNum": "2",
            "order": 2,
            "summary": "The three places float rounding turns into real bugs - money totals that miss by a cent, exact equality checks that fail, and long summations that drift.",
            "filePath": "/guides/programming-concepts/floating-point-and-money/02-where-it-bites.md"
          },
          {
            "slug": "03-the-fixes",
            "title": "The Fixes (and When Floats Are Fine)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Store money as integer cents or a decimal type, compare floats with a tolerance instead of ==, and know the cases where floats are exactly the right tool.",
            "filePath": "/guides/programming-concepts/floating-point-and-money/03-the-fixes.md"
          }
        ]
      },
      {
        "slug": "closures-and-scope",
        "title": "Closures and Scope",
        "summary": "Why a function remembers variables from where it was born: scope, closures, and the captured-variable bugs that bite in every language with first-class functions.",
        "order": 12,
        "phases": [
          {
            "slug": "01-scope-and-the-backpack",
            "title": "Scope and the Backpack",
            "phaseNum": "1",
            "order": 1,
            "summary": "Lexical scope means a function can see the variables around where it was written, and a closure is that function plus the captured variables it carries with it after the surrounding code is gone.",
            "filePath": "/guides/programming-concepts/closures-and-scope/01-scope-and-the-backpack.md"
          },
          {
            "slug": "02-closures-you-will-write",
            "title": "Closures You'll Actually Write",
            "phaseNum": "2",
            "order": 2,
            "summary": "The everyday jobs closures do: private state nothing else can touch, pre-loading an argument so a function carries its own configuration, and callbacks that remember the context they were created in.",
            "filePath": "/guides/programming-concepts/closures-and-scope/02-closures-you-will-write.md"
          },
          {
            "slug": "03-the-loop-bug-and-gotchas",
            "title": "The Loop Bug and Other Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "The classic trap where every callback created in a loop sees the final value of the loop variable, why it happens - capture is by reference, not by snapshot - and the small fixes in JavaScript and Python.",
            "filePath": "/guides/programming-concepts/closures-and-scope/03-the-loop-bug-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "recursion-finally-clicks",
        "title": "Recursion, Finally",
        "summary": "The mental model that makes recursion stop being scary: a base case, a step toward it, and trust - plus when it blows the stack and how to avoid it.",
        "order": 13,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The mental model: stop, shrink, trust",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model that makes recursion stop being scary: a base case, a step toward it, and trust - plus when it blows the stack and how to avoid it.",
            "filePath": "/guides/programming-concepts/recursion-finally-clicks/01-the-mental-model.md"
          },
          {
            "slug": "02-writing-recursion-that-works",
            "title": "Writing recursion that works",
            "phaseNum": "2",
            "order": 2,
            "summary": "The mental model that makes recursion stop being scary: a base case, a step toward it, and trust - plus when it blows the stack and how to avoid it.",
            "filePath": "/guides/programming-concepts/recursion-finally-clicks/02-writing-recursion-that-works.md"
          },
          {
            "slug": "03-when-it-breaks",
            "title": "When it breaks: the stack, and when to use a loop instead",
            "phaseNum": "3",
            "order": 3,
            "summary": "The mental model that makes recursion stop being scary: a base case, a step toward it, and trust - plus when it blows the stack and how to avoid it.",
            "filePath": "/guides/programming-concepts/recursion-finally-clicks/03-when-it-breaks.md"
          }
        ]
      },
      {
        "slug": "pointers-and-references",
        "title": "Pointers and References",
        "summary": "A pointer or reference is a variable holding a memory address instead of a value \u2014 the idea underneath sharing, mutation, and half the bugs that make you say 'but I didn't touch that variable.'",
        "order": 14,
        "phases": [
          {
            "slug": "01-a-box-with-an-address",
            "title": "A box with an address instead of a value",
            "phaseNum": "1",
            "order": 1,
            "summary": "A pointer or reference is a variable holding a memory address instead of a value \u2014 the idea underneath sharing, mutation, and half the bugs that make you say 'but I didn't touch that variable.'",
            "filePath": "/guides/programming-concepts/pointers-and-references/01-a-box-with-an-address.md"
          },
          {
            "slug": "02-pointers-vs-references-across-languages",
            "title": "Pointers vs. references across languages",
            "phaseNum": "2",
            "order": 2,
            "summary": "A pointer or reference is a variable holding a memory address instead of a value \u2014 the idea underneath sharing, mutation, and half the bugs that make you say 'but I didn't touch that variable.'",
            "filePath": "/guides/programming-concepts/pointers-and-references/02-pointers-vs-references-across-languages.md"
          },
          {
            "slug": "03-the-classic-gotchas",
            "title": "The classic gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "A pointer or reference is a variable holding a memory address instead of a value \u2014 the idea underneath sharing, mutation, and half the bugs that make you say 'but I didn't touch that variable.'",
            "filePath": "/guides/programming-concepts/pointers-and-references/03-the-classic-gotchas.md"
          }
        ]
      },
      {
        "slug": "how-garbage-collectors-work",
        "title": "How Garbage Collectors Actually Work",
        "summary": "The engineering deep dive behind automatic memory management: reference counting vs. mark-and-sweep, why generational and concurrent collectors exist, and how to read a real GC log and tune the knobs that matter.",
        "order": 15,
        "phases": [
          {
            "slug": "01-reference-counting-and-mark-sweep",
            "title": "Reference Counting and Mark-Sweep, the Two Basic Ideas",
            "phaseNum": "1",
            "order": 1,
            "summary": "The two founding strategies for automatic memory management: counting who points at an object and freeing it at zero, versus tracing reachability from roots and sweeping what's left. Why reference counting alone can't handle cycles.",
            "filePath": "/guides/programming-concepts/how-garbage-collectors-work/01-reference-counting-and-mark-sweep.md"
          },
          {
            "slug": "02-generational-and-concurrent-collectors",
            "title": "Generational and Concurrent Collectors",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why splitting the heap into young and old generations is the single biggest win in GC design, and how tri-color marking lets a modern collector trace reachability while your program keeps running instead of freezing it.",
            "filePath": "/guides/programming-concepts/how-garbage-collectors-work/02-generational-and-concurrent-collectors.md"
          },
          {
            "slug": "03-reading-and-tuning-a-real-gc",
            "title": "Reading and Tuning a Real GC",
            "phaseNum": "3",
            "order": 3,
            "summary": "What a real GC log actually shows, the handful of tuning knobs that matter versus the ones that rarely do, and the honest first move before tuning: allocate less. Plus Rust's alternative - no collector at all.",
            "filePath": "/guides/programming-concepts/how-garbage-collectors-work/03-reading-and-tuning-a-real-gc.md"
          }
        ]
      },
      {
        "slug": "sorting-and-searching-explained",
        "title": "Sorting & Searching, Explained",
        "summary": "How computers find things fast and put things in order: linear vs. binary search, then the classic sorts - bubble, merge, and quick - with the intuition behind each one's speed, not just the code.",
        "order": 16,
        "phases": [
          {
            "slug": "01-linear-vs-binary-search",
            "title": "Linear vs. Binary Search",
            "phaseNum": "1",
            "order": 1,
            "summary": "Linear search checks every item one by one - simple, works on anything, but gets slower the bigger the data. Binary search exploits sorted order to throw away half the remaining data on every step.",
            "filePath": "/guides/programming-concepts/sorting-and-searching-explained/01-linear-vs-binary-search.md"
          },
          {
            "slug": "02-binary-search-implemented",
            "title": "Binary Search, Implemented",
            "phaseNum": "2",
            "order": 2,
            "summary": "The real binary search algorithm on a sorted array - the iterative version, its O(log n) complexity, and the off-by-one bugs (wrong midpoint, wrong bound update) that trip up almost everyone the first time.",
            "filePath": "/guides/programming-concepts/sorting-and-searching-explained/02-binary-search-implemented.md"
          },
          {
            "slug": "03-bubble-sort",
            "title": "Bubble Sort: Compare, Swap, Repeat",
            "phaseNum": "3",
            "order": 3,
            "summary": "The simplest sort there is: walk the list, swap any two neighbors that are out of order, repeat until nothing swaps. Easy to trust, O(n\u00b2), and the foundation the next phase's faster sorts improve on.",
            "filePath": "/guides/programming-concepts/sorting-and-searching-explained/03-bubble-sort.md"
          },
          {
            "slug": "04-merge-sort-and-quick-sort",
            "title": "Merge Sort (and Quick Sort)",
            "phaseNum": "4",
            "order": 4,
            "summary": "Merge sort splits the list in half, recursively sorts each half, then merges the sorted halves back together - O(n log n), guaranteed. Quick sort gets the same speed by partitioning around a pivot instead.",
            "filePath": "/guides/programming-concepts/sorting-and-searching-explained/04-merge-sort-and-quick-sort.md"
          }
        ]
      },
      {
        "slug": "trees-and-binary-search-trees",
        "title": "Trees & Binary Search Trees",
        "summary": "What a tree actually is - nodes, root, children, leaves - then the binary search tree specifically: the ordering rule that makes search and insert fast, with real code building and searching one.",
        "order": 17,
        "phases": [
          {
            "slug": "01-what-a-tree-is",
            "title": "What a Tree Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A tree is nodes connected in a branching, one-parent-per-node shape: a root at the top, children below it, leaves where the branching stops. File systems, org charts, and the DOM are all trees wearing different clothes.",
            "filePath": "/guides/programming-concepts/trees-and-binary-search-trees/01-what-a-tree-is.md"
          },
          {
            "slug": "02-binary-search-trees",
            "title": "Binary Search Trees",
            "phaseNum": "2",
            "order": 2,
            "summary": "A binary search tree adds one rule to a tree: every node's left subtree holds smaller values, its right subtree holds bigger ones. That single invariant is what makes searching and inserting fast - real code building and searching one.",
            "filePath": "/guides/programming-concepts/trees-and-binary-search-trees/02-binary-search-trees.md"
          },
          {
            "slug": "03-bst-performance-and-gotchas",
            "title": "BST Performance & Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "A binary search tree is O(log n) when balanced - but inserting already-sorted data can degrade it into a lopsided chain with O(n) search, no better than a linked list. Real code and the fix: self-balancing trees.",
            "filePath": "/guides/programming-concepts/trees-and-binary-search-trees/03-bst-performance-and-gotchas.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "programming-languages",
    "name": "Programming Languages",
    "icon": "ti-code",
    "blurb": "Python, JavaScript, TypeScript, Java, C#, Go, and Rust - each language end to end.",
    "guides": [
      {
        "slug": "python-from-zero",
        "title": "Python From Zero",
        "summary": "Learn Python from nothing to genuinely advanced: install and the basics, then objects and tooling, then the deep half - the data model, generators, decorators, typing, concurrency and the GIL, performance, and packaging - all in small, runnable steps with honest explanations.",
        "order": 1,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program",
            "phaseNum": "1",
            "order": 1,
            "summary": "Install Python 3 on Windows, macOS, or Linux, confirm it works with python3 --version, try the interactive REPL, then write and run a hello.py file with python3 hello.py.",
            "filePath": "/guides/programming-languages/python-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-syntax-values-and-types",
            "title": "Syntax, Values & Types",
            "phaseNum": "2",
            "order": 2,
            "summary": "Python uses indentation as structure (not braces), variables are names pointing at values, the core types are int/float/str/bool/None, f-strings format text, and typing is dynamic - plus the = vs == and integer-vs-float-division traps.",
            "filePath": "/guides/programming-languages/python-from-zero/02-syntax-values-and-types.md"
          },
          {
            "slug": "03-collections",
            "title": "Collections - Lists, Tuples, Dicts & Sets",
            "phaseNum": "3",
            "order": 3,
            "summary": "Python's four everyday collections: lists (ordered, changeable), tuples (ordered, fixed), dicts (key-to-value lookups), and sets (unique items) - how to index and slice them, which are mutable, and the aliasing trap where two names share one list.",
            "filePath": "/guides/programming-languages/python-from-zero/03-collections.md"
          },
          {
            "slug": "04-control-flow-and-functions",
            "title": "Control Flow & Functions",
            "phaseNum": "4",
            "order": 4,
            "summary": "Make programs decide with if/elif/else, repeat with for and while loops, and package reusable logic with def - parameters, defaults, and return values - plus truthiness and the classic mutable-default-argument trap.",
            "filePath": "/guides/programming-languages/python-from-zero/04-control-flow-and-functions.md"
          },
          {
            "slug": "05-modules-and-project-layout",
            "title": "Modules & Project Layout",
            "phaseNum": "5",
            "order": 5,
            "summary": "Split code across files with import, pull in the standard library, write your own modules, understand the if __name__ == '__main__' guard, and lay out a small project so it stays sane as it grows.",
            "filePath": "/guides/programming-languages/python-from-zero/05-modules-and-project-layout.md"
          },
          {
            "slug": "06-objects-and-classes",
            "title": "Objects & Classes - Python's OOP",
            "phaseNum": "6",
            "order": 6,
            "summary": "A class bundles data together with the behavior that acts on it; here's __init__, self, instances, methods, attributes, and inheritance - explained as one mental model, not a pile of keywords.",
            "filePath": "/guides/programming-languages/python-from-zero/06-objects-and-classes.md"
          },
          {
            "slug": "07-errors-and-io",
            "title": "Errors & I/O - Exceptions and Files",
            "phaseNum": "7",
            "order": 7,
            "summary": "Exceptions are Python's way of saying 'I can't continue' - here's try/except/finally, raise, reading and writing files with `with open(...)`, and why Python prefers asking forgiveness over asking permission.",
            "filePath": "/guides/programming-languages/python-from-zero/07-errors-and-io.md"
          },
          {
            "slug": "08-ecosystem-and-tooling",
            "title": "The Ecosystem & Tooling",
            "phaseNum": "8",
            "order": 8,
            "summary": "pip installs packages, virtual environments keep projects from poisoning each other, requirements.txt/pyproject.toml record what you depend on, and black/ruff/pytest keep your code clean and tested - the everyday toolbox, explained.",
            "filePath": "/guides/programming-languages/python-from-zero/08-ecosystem-and-tooling.md"
          },
          {
            "slug": "09-idioms-and-gotchas",
            "title": "Idioms & Common Gotchas",
            "phaseNum": "9",
            "order": 9,
            "summary": "The Pythonic idioms that make code read like a local wrote it - comprehensions, unpacking, enumerate/zip, truthiness, context managers - plus a cheat-card of the gotchas (mutable defaults, late-binding closures, is vs ==) that bite everyone exactly once.",
            "filePath": "/guides/programming-languages/python-from-zero/09-idioms-and-gotchas.md"
          },
          {
            "slug": "10-the-data-model",
            "title": "The Data Model & Dunder Methods",
            "phaseNum": "10",
            "order": 10,
            "summary": "Python's built-in syntax is secretly calling your methods: len(x) runs x.__len__(), a + b runs a.__add__(b), print(x) runs x.__repr__/__str__. Here's the data model - __repr__ vs __str__, __eq__ and __hash__, __getitem__/__iter__, and operator overloading - explained as one dispatch rule, not a list of magic names.",
            "filePath": "/guides/programming-languages/python-from-zero/10-the-data-model.md"
          },
          {
            "slug": "11-iterators-and-generators",
            "title": "Iterators & Generators",
            "phaseNum": "11",
            "order": 11,
            "summary": "Laziness is the big win: produce values one at a time instead of building a giant list. Here's the iterator protocol, generators with yield, generator expressions vs list comprehensions, and how to process a 10 GB file or an infinite sequence without loading it into RAM.",
            "filePath": "/guides/programming-languages/python-from-zero/11-iterators-and-generators.md"
          },
          {
            "slug": "12-decorators",
            "title": "Decorators",
            "phaseNum": "12",
            "order": 12,
            "summary": "The @ symbol stops being magic once you see what it really is - a decorator is just a function that takes a function and returns a wrapped one, and @decorator is sugar for f = decorator(f); here's the build-up, functools.wraps, decorators that take arguments, and where you've already been using them.",
            "filePath": "/guides/programming-languages/python-from-zero/12-decorators.md"
          },
          {
            "slug": "13-context-managers",
            "title": "Context Managers",
            "phaseNum": "13",
            "order": 13,
            "summary": "The with statement is Python's promise that setup gets a matching teardown - files close, locks release, transactions finish - even when an exception fires; here's the __enter__/__exit__ protocol and the easier @contextmanager generator behind it.",
            "filePath": "/guides/programming-languages/python-from-zero/13-context-managers.md"
          },
          {
            "slug": "14-type-hints",
            "title": "Type Hints & mypy",
            "phaseNum": "14",
            "order": 14,
            "summary": "Python is dynamically typed, but gradual typing lets you annotate types and have a checker (mypy) catch a whole class of bugs before you ever run the code - without changing how the program runs.",
            "filePath": "/guides/programming-languages/python-from-zero/14-type-hints.md"
          },
          {
            "slug": "15-dataclasses",
            "title": "Dataclasses & Modern Modeling",
            "phaseNum": "15",
            "order": 15,
            "summary": "Writing __init__/__repr__/__eq__ by hand for a bag-of-fields class is pure boilerplate; @dataclass generates them from typed fields, field(default_factory=...) dodges the mutable-default trap, frozen=True gives you immutable hashable instances, NamedTuple is the lightweight alternative, and pydantic guards the boundary.",
            "filePath": "/guides/programming-languages/python-from-zero/15-dataclasses.md"
          },
          {
            "slug": "16-concurrency-and-the-gil",
            "title": "Concurrency & the GIL",
            "phaseNum": "16",
            "order": 16,
            "summary": "Python gives you three tools - threading, multiprocessing, and asyncio - that solve different problems; here's the GIL explained honestly (one thread runs Python at a time, but it's released during I/O), and the one decision rule that tells you which tool to reach for: I/O-bound \u2192 threads or asyncio, CPU-bound \u2192 multiprocessing.",
            "filePath": "/guides/programming-languages/python-from-zero/16-concurrency-and-the-gil.md"
          },
          {
            "slug": "17-performance-and-memory",
            "title": "Performance & Memory",
            "phaseNum": "17",
            "order": 17,
            "summary": "Why Python is called 'slow' (interpreted + dynamic, so types are looked up at runtime), how CPython actually runs your code (source \u2192 bytecode \u2192 eval loop), how memory is freed (reference counting plus a cyclic garbage collector), and the one rule that matters - measure, don't guess - followed by the real speedups in the order that actually pays off.",
            "filePath": "/guides/programming-languages/python-from-zero/17-performance-and-memory.md"
          },
          {
            "slug": "18-packaging-and-environments",
            "title": "Packaging & Environments",
            "phaseNum": "18",
            "order": 18,
            "summary": "Turn a folder of scripts into something other people can pip install - virtual environments isolate per-project deps, pyproject.toml is the modern descriptor, python -m build makes a wheel, and twine/uv publish push it to PyPI.",
            "filePath": "/guides/programming-languages/python-from-zero/18-packaging-and-environments.md"
          },
          {
            "slug": "19-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "19",
            "order": 19,
            "summary": "An honest map of where Python goes from here - web (Django/FastAPI), data (pandas/NumPy), automation, and packaging - framed as signposts, not hype, with a nudge toward building something real.",
            "filePath": "/guides/programming-languages/python-from-zero/19-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "javascript-from-zero",
        "title": "JavaScript From Zero",
        "summary": "Learn JavaScript from nothing to genuinely advanced: where it runs, values and types, collections, control flow, modules, async and the DOM - then the deep half: scope and closures, this and prototypes, generators, the event loop, functional JS, bundlers, performance, and the road to TypeScript. Small, runnable steps, honest explanations.",
        "order": 2,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program",
            "phaseNum": "1",
            "order": 1,
            "summary": "JavaScript runs in two different places - the browser console and Node.js. Install Node, check the version, run a hello.js file, and try the browser console; learn why the two runtimes are not the same.",
            "filePath": "/guides/programming-languages/javascript-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-syntax-values-and-types",
            "title": "Syntax, Values & Types",
            "phaseNum": "2",
            "order": 2,
            "summary": "How to name values with let and const (and why not var), the primitive types (string, number, boolean, null, undefined), template literals, and what dynamic, loose typing means - including the == vs === trap, NaN, and floating-point money.",
            "filePath": "/guides/programming-languages/javascript-from-zero/02-syntax-values-and-types.md"
          },
          {
            "slug": "03-collections",
            "title": "Collections - Arrays & Objects",
            "phaseNum": "3",
            "order": 3,
            "summary": "Arrays are ordered lists with powerful methods like map, filter, and reduce; objects are labeled key/value bundles; Map and Set exist for special cases. Plus the reference-vs-value rule that explains why two equal-looking arrays aren't equal.",
            "filePath": "/guides/programming-languages/javascript-from-zero/03-collections.md"
          },
          {
            "slug": "04-control-flow-and-functions",
            "title": "Control Flow & Functions",
            "phaseNum": "4",
            "order": 4,
            "summary": "Make decisions with if/else, repeat with for/of and while, and package reusable behavior in functions - declarations, arrow functions, parameters and defaults. Functions are values you can pass around, and a first look at why 'this' is tricky.",
            "filePath": "/guides/programming-languages/javascript-from-zero/04-control-flow-and-functions.md"
          },
          {
            "slug": "05-modules-and-project-layout",
            "title": "Modules & Project Layout",
            "phaseNum": "5",
            "order": 5,
            "summary": "Split code across files with ES modules (import/export), understand what package.json and node_modules are, and learn a sane small project layout - the foundation you'll build the async work in Phase 6 on top of.",
            "filePath": "/guides/programming-languages/javascript-from-zero/05-modules-and-project-layout.md"
          },
          {
            "slug": "06-async-and-the-dom",
            "title": "Async & the DOM - JavaScript's Big Idea",
            "phaseNum": "6",
            "order": 6,
            "summary": "JavaScript runs on a single thread with an event loop, so slow work (network, timers) is handled asynchronously - callbacks gave way to Promises and then async/await; in the browser, JS reads and changes a live tree called the DOM and reacts to events.",
            "filePath": "/guides/programming-languages/javascript-from-zero/06-async-and-the-dom.md"
          },
          {
            "slug": "07-errors-and-io",
            "title": "Errors & I/O - When Things Go Wrong and Data Comes In",
            "phaseNum": "7",
            "order": 7,
            "summary": "Handle failures with try/catch/finally and throw, catch rejected Promises by wrapping await in try/catch, and read the outside world the way each runtime does it: fetch in the browser, fs in Node - with JSON parsing in both.",
            "filePath": "/guides/programming-languages/javascript-from-zero/07-errors-and-io.md"
          },
          {
            "slug": "08-ecosystem-and-tooling",
            "title": "The Ecosystem & Tooling - npm, Runtimes, and the Tools Everyone Uses",
            "phaseNum": "8",
            "order": 8,
            "summary": "npm installs packages and runs package.json scripts; JavaScript runs in two worlds (browser and Node, with Deno/Bun as newer runtimes); Vite bundles for the browser, Prettier formats, ESLint lints, and Vitest/Jest run your tests.",
            "filePath": "/guides/programming-languages/javascript-from-zero/08-ecosystem-and-tooling.md"
          },
          {
            "slug": "09-idioms-and-gotchas",
            "title": "Idioms & Common Gotchas - Write It Like a Local, Dodge the Traps",
            "phaseNum": "9",
            "order": 9,
            "summary": "Modern JS idioms - destructuring, spread/rest, optional chaining, nullish coalescing, array methods over loops, modules over globals - plus a cheat-card for the classic traps: == vs ===, this, hoisting, NaN, floating point, shared references, and truthy/falsy surprises.",
            "filePath": "/guides/programming-languages/javascript-from-zero/09-idioms-and-gotchas.md"
          },
          {
            "slug": "10-scope-and-closures",
            "title": "Scope, Closures & Hoisting - How JavaScript Remembers",
            "phaseNum": "10",
            "order": 10,
            "summary": "What scope actually is, how a variable lookup walks the scope chain, why var leaks and let/const don't, hoisting and the temporal dead zone, and the headline idea - closures: functions that remember where they were born.",
            "filePath": "/guides/programming-languages/javascript-from-zero/10-scope-and-closures.md"
          },
          {
            "slug": "11-this-prototypes-and-objects",
            "title": "this, Prototypes & the Object Model - How Objects Really Work",
            "phaseNum": "11",
            "order": 11,
            "summary": "Go deep on the parts of JavaScript that confuse everyone: how this is decided by the call, what call/apply/bind do, why arrow functions are different, the prototype chain, and why classes are just sugar over it.",
            "filePath": "/guides/programming-languages/javascript-from-zero/11-this-prototypes-and-objects.md"
          },
          {
            "slug": "12-iterators-generators-symbols",
            "title": "Iterators, Generators & Symbols - Producing Values on Demand",
            "phaseNum": "12",
            "order": 12,
            "summary": "What for...of really does, why the protocol hangs off a Symbol, how to make your own objects iterable, and how generators let one function pause, resume, and stream values lazily - even infinitely.",
            "filePath": "/guides/programming-languages/javascript-from-zero/12-iterators-generators-symbols.md"
          },
          {
            "slug": "13-the-event-loop-deep",
            "title": "The Event Loop, Deep - Tasks, Microtasks & Why Order Surprises You",
            "phaseNum": "13",
            "order": 13,
            "summary": "JavaScript runs on one thread, so 'async' means deferred, not parallel. Here's the runtime model: the call stack, microtask vs macrotask queues, the drain-everything rule, and why a Promise always beats setTimeout(0).",
            "filePath": "/guides/programming-languages/javascript-from-zero/13-the-event-loop-deep.md"
          },
          {
            "slug": "14-functional-javascript",
            "title": "Functional JavaScript - Functions as Building Blocks",
            "phaseNum": "14",
            "order": 14,
            "summary": "Treat functions as values you pass around and combine. Pure functions, immutability, higher-order functions, and composition - the small set of ideas that make JavaScript code testable, predictable, and easy to reason about.",
            "filePath": "/guides/programming-languages/javascript-from-zero/14-functional-javascript.md"
          },
          {
            "slug": "15-modules-and-bundlers",
            "title": "Modules & Bundlers, Deep - From Files to a Shippable App",
            "phaseNum": "15",
            "order": 15,
            "summary": "ESM vs CommonJS and why static imports matter, what a bundler actually does to your import graph, how tree-shaking drops dead code, and using dynamic import() to split heavy code into chunks loaded on demand.",
            "filePath": "/guides/programming-languages/javascript-from-zero/15-modules-and-bundlers.md"
          },
          {
            "slug": "16-performance-and-memory",
            "title": "Performance & Memory - How V8 Runs Your Code",
            "phaseNum": "16",
            "order": 16,
            "summary": "How V8's JIT turns hot JavaScript into fast machine code, why consistent object shapes matter, why algorithmic cost beats micro-optimizing, how garbage collection reclaims memory, and how leaks still sneak in.",
            "filePath": "/guides/programming-languages/javascript-from-zero/16-performance-and-memory.md"
          },
          {
            "slug": "17-types-and-typescript",
            "title": "Types & the Road to TypeScript - Catching Bugs Before They Run",
            "phaseNum": "17",
            "order": 17,
            "summary": "Why dynamic typing lets type bugs slip to runtime, what static typing buys you, how TypeScript layers types onto plain JS, the no-build JSDoc on-ramp, and where to go next.",
            "filePath": "/guides/programming-languages/javascript-from-zero/17-types-and-typescript.md"
          },
          {
            "slug": "18-where-to-go-next",
            "title": "Where to Go Next - Honest Signposts From Here",
            "phaseNum": "18",
            "order": 18,
            "summary": "You know the language; here's the honest map of what's next - frontend frameworks (React/Vue/Svelte), backend with Node/Express, TypeScript (typed JS, strongly worth it), full-stack - plus what to actually build to make it stick.",
            "filePath": "/guides/programming-languages/javascript-from-zero/18-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "typescript-from-zero",
        "title": "TypeScript From Zero",
        "summary": "Learn TypeScript from nothing to genuinely advanced: install it and the basics - types, functions, interfaces, unions, generics, classes, and the build - then the deep half: the structural type system, utility and mapped types, conditional and template-literal types, and typing the real world. Mental-model-first, with honest explanations.",
        "order": 3,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program - tsc, tsconfig, and the Compile Step",
            "phaseNum": "1",
            "order": 1,
            "summary": "TypeScript never runs directly - the tsc compiler checks your types and emits plain JavaScript that Node or the browser runs. Install it, write a typed program, watch the checker catch a bug, and meet tsconfig.",
            "filePath": "/guides/programming-languages/typescript-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-why-types-and-basic-types",
            "title": "Why Types & the Basic Types - What the Checker Buys You",
            "phaseNum": "2",
            "order": 2,
            "summary": "The concrete payoff of types - a silent NaN bug caught at edit-time - plus the primitives, inference (you annotate less than you think), arrays and tuples, and why unknown beats any.",
            "filePath": "/guides/programming-languages/typescript-from-zero/02-why-types-and-basic-types.md"
          },
          {
            "slug": "03-functions-and-annotations",
            "title": "Functions & Annotations - Typing the Boundaries",
            "phaseNum": "3",
            "order": 3,
            "summary": "Functions are the contracts between parts of your program - the highest-value place for types. Parameter and return types, arrow functions, optional and default and rest parameters, and the void/never distinction.",
            "filePath": "/guides/programming-languages/typescript-from-zero/03-functions-and-annotations.md"
          },
          {
            "slug": "04-objects-interfaces-and-types",
            "title": "Objects, Interfaces & Type Aliases - Describing Shapes",
            "phaseNum": "4",
            "order": 4,
            "summary": "Real data is objects. Here's how to name an object's shape once with interface or type, reuse it everywhere, mark fields optional or readonly, extend shapes, and pick between interface and type without agonizing.",
            "filePath": "/guides/programming-languages/typescript-from-zero/04-objects-interfaces-and-types.md"
          },
          {
            "slug": "05-unions-and-narrowing",
            "title": "Unions, Literals & Narrowing - One of Several Shapes",
            "phaseNum": "5",
            "order": 5,
            "summary": "Real values are often one of several possibilities. Union and literal types model that directly, then narrowing forces you to handle each case - peaking with discriminated unions and exhaustiveness checks the compiler enforces.",
            "filePath": "/guides/programming-languages/typescript-from-zero/05-unions-and-narrowing.md"
          },
          {
            "slug": "06-generics",
            "title": "Generics - Reusable Code That Keeps Its Types",
            "phaseNum": "6",
            "order": 6,
            "summary": "Generics let one function or type work over many types without throwing the types away like `any` does. Type parameters, multiple parameters, constraints with extends and keyof, and generic types, interfaces, and classes.",
            "filePath": "/guides/programming-languages/typescript-from-zero/06-generics.md"
          },
          {
            "slug": "07-classes-and-oop",
            "title": "Classes & OOP in TypeScript - Types on Objects With Behavior",
            "phaseNum": "7",
            "order": 7,
            "summary": "JavaScript already has classes; TypeScript adds a type layer - field types, visibility, and contracts. Learn typed fields, access modifiers, parameter properties, readonly, getters/setters, and implements vs abstract.",
            "filePath": "/guides/programming-languages/typescript-from-zero/07-classes-and-oop.md"
          },
          {
            "slug": "08-modules-and-tsconfig",
            "title": "Modules, tsconfig & the Build - Configuring the Compiler",
            "phaseNum": "8",
            "order": 8,
            "summary": "How TS shares code with ES modules and type-only imports, what tsconfig.json controls, the compiler options that actually matter, why strict mode is non-negotiable, and where tsc fits alongside a bundler.",
            "filePath": "/guides/programming-languages/typescript-from-zero/08-modules-and-tsconfig.md"
          },
          {
            "slug": "09-the-type-system-deep",
            "title": "The Type System, Deep - Structural Typing & How Inference Works",
            "phaseNum": "9",
            "order": 9,
            "summary": "How TypeScript really decides if two types fit: structural (shape-based) typing, assignability, excess-property checks, literal widening, as const, and how inference flows from context.",
            "filePath": "/guides/programming-languages/typescript-from-zero/09-the-type-system-deep.md"
          },
          {
            "slug": "10-utility-and-mapped-types",
            "title": "Utility & Mapped Types - Deriving Types From Types",
            "phaseNum": "10",
            "order": 10,
            "summary": "Stop hand-maintaining parallel types. Use keyof, indexed access, the built-in utility types, and mapped types to derive one type from another so they can never drift apart.",
            "filePath": "/guides/programming-languages/typescript-from-zero/10-utility-and-mapped-types.md"
          },
          {
            "slug": "11-conditional-and-template-types",
            "title": "Conditional & Template Literal Types - Types That Make Decisions",
            "phaseNum": "11",
            "order": 11,
            "summary": "Types can branch and pattern-match: conditional types are a type-level ternary, infer reaches inside a type, and template literal types build string types from patterns. Learn to read the magic and write the simple cases.",
            "filePath": "/guides/programming-languages/typescript-from-zero/11-conditional-and-template-types.md"
          },
          {
            "slug": "12-typing-the-real-world",
            "title": "Typing the Real World - Libraries, Declarations & Untyped Data",
            "phaseNum": "12",
            "order": 12,
            "summary": "The reality check: your code is type-safe, but libraries, the network, and JSON are not. How @types and .d.ts files work, why fetch and JSON.parse lie, what `as` really costs, and how runtime validation closes the gap.",
            "filePath": "/guides/programming-languages/typescript-from-zero/12-typing-the-real-world.md"
          },
          {
            "slug": "13-where-to-go-next",
            "title": "Where to Go Next - Putting TypeScript to Work",
            "phaseNum": "13",
            "order": 13,
            "summary": "You learned the durable, hard part - the type system itself. Here's the honest map of where to apply it: typed React, typed Node APIs, and the modern superpower of end-to-end type safety with tools like tRPC and Prisma.",
            "filePath": "/guides/programming-languages/typescript-from-zero/13-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "go-from-zero",
        "title": "Go From Zero",
        "summary": "Learn Go from nothing to genuinely advanced: install it and the basics, then the deep half - interfaces, generics, real concurrency patterns, error handling, the runtime scheduler and GC, testing and profiling, the standard library, and performance - all mental-model-first, with honest explanations.",
        "order": 4,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program",
            "phaseNum": "1",
            "order": 1,
            "summary": "Install the Go toolchain from go.dev, confirm it with go version, write a three-line hello.go, run it with go run - and meet Go's surprise: unused imports and variables are compile errors, not warnings.",
            "filePath": "/guides/programming-languages/go-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-syntax-values-and-types",
            "title": "Syntax, Values & Types",
            "phaseNum": "2",
            "order": 2,
            "summary": "Declare values with var and the := shortcut, understand Go's static typing and basic types, rely on zero values so nothing is ever uninitialized, and print with Println and Printf - plus the two gotchas that trip up newcomers.",
            "filePath": "/guides/programming-languages/go-from-zero/02-syntax-values-and-types.md"
          },
          {
            "slug": "03-collections",
            "title": "Collections",
            "phaseNum": "3",
            "order": 3,
            "summary": "Arrays vs slices (the one you'll actually use), growing slices with append, len and cap, key-value maps, and looping over both with range - including the nil-map panic and slice-aliasing surprises that catch everyone once.",
            "filePath": "/guides/programming-languages/go-from-zero/03-collections.md"
          },
          {
            "slug": "04-control-flow-and-functions",
            "title": "Control Flow & Functions",
            "phaseNum": "4",
            "order": 4,
            "summary": "Make decisions with if (including its init statement) and switch, loop with Go's single for (it has no other), write functions that return multiple values - the signature that defines Go - and meet defer.",
            "filePath": "/guides/programming-languages/go-from-zero/04-control-flow-and-functions.md"
          },
          {
            "slug": "05-modules-and-project-layout",
            "title": "Modules & Project Layout",
            "phaseNum": "5",
            "order": 5,
            "summary": "Turn a folder into a module with go mod init, split code into packages, learn why a capital first letter makes an identifier public, import your own and others' packages, know go build vs go run, and lay out a small project sanely.",
            "filePath": "/guides/programming-languages/go-from-zero/05-modules-and-project-layout.md"
          },
          {
            "slug": "06-goroutines-and-channels",
            "title": "Goroutines & Channels - Go's Concurrency",
            "phaseNum": "6",
            "order": 6,
            "summary": "A goroutine is a cheap concurrent task you start with the word 'go'; channels are typed pipes that pass values between goroutines and synchronize them, so you share memory by communicating instead of locking it.",
            "filePath": "/guides/programming-languages/go-from-zero/06-goroutines-and-channels.md"
          },
          {
            "slug": "07-errors-and-io",
            "title": "Errors & I/O - Errors Are Values",
            "phaseNum": "7",
            "order": 7,
            "summary": "In Go an error is an ordinary value you check with 'if err != nil', return up the call stack, wrap with %w, and inspect using errors.Is and errors.As - plus reading files with os and bufio, and why panic/recover is the rare exception.",
            "filePath": "/guides/programming-languages/go-from-zero/07-errors-and-io.md"
          },
          {
            "slug": "08-ecosystem-and-tooling",
            "title": "The Ecosystem & Tooling - Batteries Included",
            "phaseNum": "8",
            "order": 8,
            "summary": "Go ships one toolchain that does everything: go build, go run, go test, go vet, and go fmt (which ends formatting debates), go mod for dependencies, a strong standard library, and golangci-lint as the one extra you'll want.",
            "filePath": "/guides/programming-languages/go-from-zero/08-ecosystem-and-tooling.md"
          },
          {
            "slug": "09-idioms-and-gotchas",
            "title": "Idioms & Common Gotchas",
            "phaseNum": "9",
            "order": 9,
            "summary": "The conventions that make Go feel like Go - small implicitly-satisfied interfaces, struct embedding for composition, 'accept interfaces, return structs,' and defer for cleanup - plus a cheat-card of the gotchas that bite everyone once.",
            "filePath": "/guides/programming-languages/go-from-zero/09-idioms-and-gotchas.md"
          },
          {
            "slug": "10-interfaces-in-depth",
            "title": "Interfaces in Depth - Behavior, Not Hierarchy",
            "phaseNum": "10",
            "order": 10,
            "summary": "An interface value is secretly a (type, value) pair - and that one fact explains type assertions, type switches, the empty interface, and the infamous nil-interface trap that makes a nil error fail an `== nil` check.",
            "filePath": "/guides/programming-languages/go-from-zero/10-interfaces-in-depth.md"
          },
          {
            "slug": "11-generics-and-advanced-types",
            "title": "Generics & Advanced Types - One Function, Many Types",
            "phaseNum": "11",
            "order": 11,
            "summary": "Type parameters let one function or struct work across many types without losing type safety. Here's the problem generics solve, constraints and type sets, generic types, and the method-set rule that trips everyone up.",
            "filePath": "/guides/programming-languages/go-from-zero/11-generics-and-advanced-types.md"
          },
          {
            "slug": "12-concurrency-patterns",
            "title": "Concurrency Patterns - From Goroutines to Real Systems",
            "phaseNum": "12",
            "order": 12,
            "summary": "Phase 6 gave you goroutines and channels. Here are the patterns real programs run on: select, context for cancellation, worker pools, fan-out/fan-in, the sync toolbox, and the race detector that finds bugs you can't read.",
            "filePath": "/guides/programming-languages/go-from-zero/12-concurrency-patterns.md"
          },
          {
            "slug": "13-error-handling-deep",
            "title": "Error Handling, Deep - Wrapping, Inspecting & Recovering",
            "phaseNum": "13",
            "order": 13,
            "summary": "Go past 'if err != nil': add context by wrapping with %w, inspect chains with errors.Is and errors.As, design sentinel and custom error types, and learn the one rule for when panic and recover are actually the right tool.",
            "filePath": "/guides/programming-languages/go-from-zero/13-error-handling-deep.md"
          },
          {
            "slug": "14-runtime-scheduler-and-memory",
            "title": "The Runtime: Scheduler, Memory & GC - What Go Does for You",
            "phaseNum": "14",
            "order": 14,
            "summary": "What's underneath goroutines: why they're cheap, how the GMP scheduler multiplexes them onto threads, where values live (stack vs heap), what escape analysis decides, and how Go's concurrent GC keeps memory clean for you.",
            "filePath": "/guides/programming-languages/go-from-zero/14-runtime-scheduler-and-memory.md"
          },
          {
            "slug": "15-testing-benchmarks-profiling",
            "title": "Testing, Benchmarks & Profiling - Proving It Works and Finding the Slow Part",
            "phaseNum": "15",
            "order": 15,
            "summary": "Go deeper into Go's built-in testing toolchain: table-driven tests and subtests, benchmarks that measure ns/op and allocs/op, pprof profiling so you measure instead of guess, plus coverage and fuzzing.",
            "filePath": "/guides/programming-languages/go-from-zero/15-testing-benchmarks-profiling.md"
          },
          {
            "slug": "16-standard-library",
            "title": "The Standard Library as Design - Small Interfaces, Big Reach",
            "phaseNum": "16",
            "order": 16,
            "summary": "Go's standard library is a masterclass in small composable interfaces - io.Reader/io.Writer let files, sockets, buffers, and gzip all plug together, plus a tour of context, encoding/json, and net/http.",
            "filePath": "/guides/programming-languages/go-from-zero/16-standard-library.md"
          },
          {
            "slug": "17-performance-and-optimization",
            "title": "Performance & Optimization - Measure, Then Cut Allocations",
            "phaseNum": "17",
            "order": 17,
            "summary": "Performance work in Go is measurement first, algorithm second, allocations third. Find the real hot spot with benchmarks and pprof, fix the big-O, then cut heap churn - and know when good-enough is good enough.",
            "filePath": "/guides/programming-languages/go-from-zero/17-performance-and-optimization.md"
          },
          {
            "slug": "18-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "18",
            "order": 18,
            "summary": "Honest signposts for what to build with Go now - web services with net/http or chi/gin, CLIs with cobra, and Go's home turf of cloud and infrastructure tooling (Docker and Kubernetes are written in Go) - plus what to build next.",
            "filePath": "/guides/programming-languages/go-from-zero/18-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "rust-from-zero",
        "title": "Rust From Zero",
        "summary": "Learn Rust from nothing to genuinely advanced: install it and the basics, then ownership - and then the deep half: lifetimes, traits and generics, smart pointers, error handling, fearless concurrency, iterators, macros, and performance and unsafe. Mental-model-first, with honest explanations.",
        "order": 5,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program",
            "phaseNum": "1",
            "order": 1,
            "summary": "Install the Rust toolchain with rustup, confirm rustc and cargo are there, then create and run your first program with cargo new and cargo run - the workflow you'll use every day.",
            "filePath": "/guides/programming-languages/rust-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-syntax-values-and-types",
            "title": "Syntax, Values & Types",
            "phaseNum": "2",
            "order": 2,
            "summary": "let binds values and they're immutable by default (mut makes them changeable); Rust is statically typed but infers most types; meet i32, f64, bool, char, &str and String, plus shadowing.",
            "filePath": "/guides/programming-languages/rust-from-zero/02-syntax-values-and-types.md"
          },
          {
            "slug": "03-collections",
            "title": "Collections",
            "phaseNum": "3",
            "order": 3,
            "summary": "Hold many values: Vec<T> is the growable list you'll use daily, arrays are fixed-size, HashMap stores key-value pairs - plus the String vs &str distinction that confuses everyone, finally explained.",
            "filePath": "/guides/programming-languages/rust-from-zero/03-collections.md"
          },
          {
            "slug": "04-control-flow-and-functions",
            "title": "Control Flow & Functions",
            "phaseNum": "4",
            "order": 4,
            "summary": "Make decisions and bundle logic: if and match are expressions that produce values, loop/while/for cover repetition, match is exhaustive (the compiler forces you to handle every case), and functions return their last expression without writing return.",
            "filePath": "/guides/programming-languages/rust-from-zero/04-control-flow-and-functions.md"
          },
          {
            "slug": "05-modules-and-project-layout",
            "title": "Modules & Project Layout",
            "phaseNum": "5",
            "order": 5,
            "summary": "Organize a real project: what Cargo.toml, src/main.rs, and src/lib.rs are for; how mod creates modules, pub makes things public, and use brings names into scope; what a crate is and how to add one.",
            "filePath": "/guides/programming-languages/rust-from-zero/05-modules-and-project-layout.md"
          },
          {
            "slug": "06-ownership-and-borrowing",
            "title": "Ownership & Borrowing - Rust's Big Idea",
            "phaseNum": "6",
            "order": 6,
            "summary": "Every value in Rust has exactly one owner; assigning or passing it moves ownership; you borrow with & (shared, many) or &mut (exclusive, one) - and that single set of rules gives memory safety with no garbage collector and no manual free.",
            "filePath": "/guides/programming-languages/rust-from-zero/06-ownership-and-borrowing.md"
          },
          {
            "slug": "07-errors-and-io",
            "title": "Errors & I/O - Failure in the Type System",
            "phaseNum": "7",
            "order": 7,
            "summary": "Rust puts failure and absence in the type itself: Result<T, E> for things that can fail and Option<T> for things that can be missing; you handle them with match or the ? operator, reserve panic! for truly unrecoverable bugs, and read files with std::fs.",
            "filePath": "/guides/programming-languages/rust-from-zero/07-errors-and-io.md"
          },
          {
            "slug": "08-ecosystem-and-tooling",
            "title": "The Ecosystem & Tooling - Cargo Does Everything",
            "phaseNum": "8",
            "order": 8,
            "summary": "Cargo is the one tool you'll live in: it builds, runs, tests, and adds dependencies; Cargo.toml + crates.io manage your packages; rustfmt formats your code and clippy is the famously helpful linter that teaches you idiomatic Rust.",
            "filePath": "/guides/programming-languages/rust-from-zero/08-ecosystem-and-tooling.md"
          },
          {
            "slug": "09-idioms-and-gotchas",
            "title": "Idioms & Common Gotchas - Writing Rust Like a Rustacean",
            "phaseNum": "9",
            "order": 9,
            "summary": "The handful of patterns that make code feel like real Rust - enums with exhaustive match, traits for shared behavior, iterator combinators (map/filter/collect), Option/Result combinators, and borrowing over cloning - plus a cheat-card of the gotchas that bite every newcomer.",
            "filePath": "/guides/programming-languages/rust-from-zero/09-idioms-and-gotchas.md"
          },
          {
            "slug": "10-lifetimes-and-borrowing",
            "title": "Lifetimes & the Borrow Checker, Deep - Making References Provable",
            "phaseNum": "10",
            "order": 10,
            "summary": "A reference must never outlive its data. Lifetimes are how the compiler proves that - a region of code, not a thing you create. Here's why functions sometimes need 'a, why you rarely write it (elision), references in structs, and what 'static really means.",
            "filePath": "/guides/programming-languages/rust-from-zero/10-lifetimes-and-borrowing.md"
          },
          {
            "slug": "11-traits-and-generics",
            "title": "Traits & Generics, Deep - Shared Behavior Without Inheritance",
            "phaseNum": "11",
            "order": 11,
            "summary": "Traits define shared behavior; generics write code once for many types; together they give Rust polymorphism without inheritance. Default methods, trait bounds, monomorphization, associated types, static vs dynamic dispatch, and the orphan rule.",
            "filePath": "/guides/programming-languages/rust-from-zero/11-traits-and-generics.md"
          },
          {
            "slug": "12-smart-pointers",
            "title": "Smart Pointers & Interior Mutability - Box, Rc, RefCell & Friends",
            "phaseNum": "12",
            "order": 12,
            "summary": "Ownership has one owner and compile-time borrow rules. Smart pointers bend those rules in controlled ways: Box for heap, Rc/Arc for shared ownership, RefCell to mutate through a shared reference - and Deref/Drop are the machinery underneath.",
            "filePath": "/guides/programming-languages/rust-from-zero/12-smart-pointers.md"
          },
          {
            "slug": "13-error-handling-deep",
            "title": "Error Handling, Deep - Result, ?, and Custom Errors",
            "phaseNum": "13",
            "order": 13,
            "summary": "Go past the basics: what ? really does, how the From trait makes errors flow through one operator, hand-rolled error enums, and the thiserror/anyhow split that real Rust projects rely on.",
            "filePath": "/guides/programming-languages/rust-from-zero/13-error-handling-deep.md"
          },
          {
            "slug": "14-fearless-concurrency",
            "title": "Fearless Concurrency - Threads the Compiler Keeps Safe",
            "phaseNum": "14",
            "order": 14,
            "summary": "Rust's ownership rules extend to threads, so the compiler rejects data races at compile time. Here's spawning threads, why naive sharing won't compile, Arc<Mutex<T>>, the Send/Sync marker traits, channels, and a taste of async.",
            "filePath": "/guides/programming-languages/rust-from-zero/14-fearless-concurrency.md"
          },
          {
            "slug": "15-closures-and-iterators",
            "title": "Closures, Iterators & Zero-Cost Abstractions - Expressive and Fast",
            "phaseNum": "15",
            "order": 15,
            "summary": "Closures capture their environment, the Fn/FnMut/FnOnce traits decide how, and the Iterator trait turns one tiny method into a whole pipeline - all compiling down to the same machine code as a hand-written loop, for free.",
            "filePath": "/guides/programming-languages/rust-from-zero/15-closures-and-iterators.md"
          },
          {
            "slug": "16-macros",
            "title": "Macros & Metaprogramming - Code That Writes Code",
            "phaseNum": "16",
            "order": 16,
            "summary": "Why println! has a bang, how macros run at compile time and expand into ordinary Rust, writing a small macro_rules!, when a declarative macro earns its keep, and the derive/procedural macros you'll actually use.",
            "filePath": "/guides/programming-languages/rust-from-zero/16-macros.md"
          },
          {
            "slug": "17-performance-and-unsafe",
            "title": "Performance, Unsafe & the Ecosystem - The Last Mile",
            "phaseNum": "17",
            "order": 17,
            "summary": "Why Rust is fast without you trying, the one build flag everyone forgets, measuring before optimizing, what `unsafe` really unlocks (and what it doesn't), and the daily-driver crates worth knowing by name.",
            "filePath": "/guides/programming-languages/rust-from-zero/17-performance-and-unsafe.md"
          },
          {
            "slug": "18-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "18",
            "order": 18,
            "summary": "Honest signposts for what to build with Rust next - CLI tools, web servers, systems and embedded, WebAssembly - plus the official Book as the deep dive, and a reminder that the borrow checker stops fighting you sooner than you think.",
            "filePath": "/guides/programming-languages/rust-from-zero/18-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "java-from-zero",
        "title": "Java From Zero",
        "summary": "Learn Java from nothing to genuinely advanced: install the JDK and the basics - types, classes, objects, collections - then the deep half: generics, lambdas and streams, modern records and pattern matching, concurrency, the JVM and its garbage collector, testing, and performance. Mental-model-first, with honest explanations.",
        "order": 6,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program - The JDK, javac & the JVM",
            "phaseNum": "1",
            "order": 1,
            "summary": "Java compiles to bytecode that runs on the JVM - write once, run anywhere. Install a JDK, write Hello.java, compile it with javac, run it with java, and learn why everything lives in a class.",
            "filePath": "/guides/programming-languages/java-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-syntax-values-and-types",
            "title": "Syntax, Values & Types - Primitives, Objects & Static Typing",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Java thinks about values: a compiler-checked type on every variable, the deep split between primitives and objects, wrapper types and autoboxing, the var keyword, and why you never compare strings with ==",
            "filePath": "/guides/programming-languages/java-from-zero/02-syntax-values-and-types.md"
          },
          {
            "slug": "03-collections",
            "title": "Collections - Arrays, Lists, Maps & Sets",
            "phaseNum": "3",
            "order": 3,
            "summary": "Arrays are fixed and rigid; the Collections Framework is where real Java lives. Here's the List/Map/Set mental model, ArrayList, HashMap, and HashSet - and why you program to the interface.",
            "filePath": "/guides/programming-languages/java-from-zero/03-collections.md"
          },
          {
            "slug": "04-control-flow-and-methods",
            "title": "Control Flow & Methods - Decisions, Loops & Reusable Logic",
            "phaseNum": "4",
            "order": 4,
            "summary": "How Java branches with if/else and switch, repeats with for/while/for-each, and packages logic into methods - plus method overloading and why the compiler picks the right one.",
            "filePath": "/guides/programming-languages/java-from-zero/04-control-flow-and-methods.md"
          },
          {
            "slug": "05-classes-and-objects",
            "title": "Classes & Objects - Java's Whole Worldview",
            "phaseNum": "5",
            "order": 5,
            "summary": "A class is a blueprint; an object is one thing built from it with new. Here's fields, constructors, this, instance vs static, encapsulation, and the toString/equals/hashCode trio every Java beginner trips on.",
            "filePath": "/guides/programming-languages/java-from-zero/05-classes-and-objects.md"
          },
          {
            "slug": "06-inheritance-and-interfaces",
            "title": "Inheritance & Interfaces - Sharing Behavior",
            "phaseNum": "6",
            "order": 6,
            "summary": "How Java classes share behavior: inheritance with extends, overriding methods, polymorphism, interfaces as contracts, and the honest call between an interface and an abstract class.",
            "filePath": "/guides/programming-languages/java-from-zero/06-inheritance-and-interfaces.md"
          },
          {
            "slug": "07-errors-and-io",
            "title": "Errors & I/O - Exceptions, Resources & Files",
            "phaseNum": "7",
            "order": 7,
            "summary": "Java's error model is the exception - a thrown object that unwinds the stack until caught. Here's try/catch/finally, the checked-vs-unchecked split the compiler enforces, throwing your own, try-with-resources, and modern file I/O.",
            "filePath": "/guides/programming-languages/java-from-zero/07-errors-and-io.md"
          },
          {
            "slug": "08-packages-and-tooling",
            "title": "Packages, Build & Tooling - From Files to a Real Project",
            "phaseNum": "8",
            "order": 8,
            "summary": "How Java organizes code into packages, how the classpath lets the JVM find your classes and libraries, why Maven and Gradle exist, and what JARs and dependencies really are.",
            "filePath": "/guides/programming-languages/java-from-zero/08-packages-and-tooling.md"
          },
          {
            "slug": "09-idioms-and-gotchas",
            "title": "Idioms & Common Gotchas - Write It Like a Java Dev, Dodge the Traps",
            "phaseNum": "9",
            "order": 9,
            "summary": "Java idioms that make code read like Java - program to interfaces, prefer immutability, return Optional not null, loop with streams, write real equals/hashCode - plus a cheat-card for the classics: == vs equals, NPEs, autoboxing, integer division, and shared state.",
            "filePath": "/guides/programming-languages/java-from-zero/09-idioms-and-gotchas.md"
          },
          {
            "slug": "10-generics-deep",
            "title": "Generics, Deep - Type Safety Without Duplication",
            "phaseNum": "10",
            "order": 10,
            "summary": "Generics move type safety from runtime to compile time. Generic methods and classes, bounded type parameters, wildcards and PECS, and why type erasure makes generics vanish at runtime.",
            "filePath": "/guides/programming-languages/java-from-zero/10-generics-deep.md"
          },
          {
            "slug": "11-lambdas-and-functional-interfaces",
            "title": "Lambdas & Functional Interfaces - Functions as Values",
            "phaseNum": "11",
            "order": 11,
            "summary": "Lambdas let you pass behavior around like data. Here's the mental model: a lambda is an instance of a functional interface (a SAM), why that target type is required, the built-in vocabulary Streams speaks, and method references.",
            "filePath": "/guides/programming-languages/java-from-zero/11-lambdas-and-functional-interfaces.md"
          },
          {
            "slug": "12-streams-api",
            "title": "The Streams API - Declarative Data Pipelines",
            "phaseNum": "12",
            "order": 12,
            "summary": "Streams let you describe what to do to a collection - filter, map, reduce - as a readable pipeline instead of a hand-rolled loop. Here's the source/intermediate/terminal shape, laziness, the common operations, Collectors (including groupingBy), and when parallel streams help.",
            "filePath": "/guides/programming-languages/java-from-zero/12-streams-api.md"
          },
          {
            "slug": "13-records-and-modern-java",
            "title": "Records, Sealed Types & Modern Java - Less Boilerplate, More Safety",
            "phaseNum": "13",
            "order": 13,
            "summary": "Modern Java fixes old pain: records collapse data classes to one line, sealed types fence a hierarchy, switch becomes an expression, and pattern matching plus Optional kill whole categories of boilerplate and null bugs.",
            "filePath": "/guides/programming-languages/java-from-zero/13-records-and-modern-java.md"
          },
          {
            "slug": "14-concurrency-and-threads",
            "title": "Concurrency & Threads - Doing Many Things at Once, Safely",
            "phaseNum": "14",
            "order": 14,
            "summary": "Threads let your program do many things at once - and quietly corrupt shared data while doing it. Here's race conditions, synchronized, the memory model, the java.util.concurrent toolkit, and virtual threads.",
            "filePath": "/guides/programming-languages/java-from-zero/14-concurrency-and-threads.md"
          },
          {
            "slug": "15-the-jvm-memory-and-gc",
            "title": "The JVM: Memory, GC & JIT - What Runs Your Bytecode",
            "phaseNum": "15",
            "order": 15,
            "summary": "What's underneath every Java program: the virtual machine that runs your bytecode, splits memory into stack and heap, collects garbage so you never free(), and recompiles hot code to native speed.",
            "filePath": "/guides/programming-languages/java-from-zero/15-the-jvm-memory-and-gc.md"
          },
          {
            "slug": "16-testing-and-profiling",
            "title": "Testing, Build & Profiling - Proving It Works, Finding the Slow Part",
            "phaseNum": "16",
            "order": 16,
            "summary": "JUnit 5 tests with the arrange-act-assert shape, parameterized and nested cases, Mockito in moderation, why naive microbenchmarks lie and how JMH fixes them, plus JFR profiling and JaCoCo coverage.",
            "filePath": "/guides/programming-languages/java-from-zero/16-testing-and-profiling.md"
          },
          {
            "slug": "17-performance-and-ecosystem",
            "title": "Performance & the Ecosystem - Measure, Then Cut Allocations",
            "phaseNum": "17",
            "order": 17,
            "summary": "Java performance is measurement first, algorithm second, allocations third. Profile the real hot path, fix the big-O, cut the short-lived objects that pressure the GC - then meet the ecosystem you're now ready for.",
            "filePath": "/guides/programming-languages/java-from-zero/17-performance-and-ecosystem.md"
          },
          {
            "slug": "18-where-to-go-next",
            "title": "Where to Go Next - Putting Java to Work",
            "phaseNum": "18",
            "order": 18,
            "summary": "You learned the language and the JVM; now you apply it. Honest signposts to the branches from here - Spring Boot, Android, big data, Jakarta EE - plus what to build to make it stick.",
            "filePath": "/guides/programming-languages/java-from-zero/18-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "csharp-from-zero",
        "title": "C# From Zero",
        "summary": "Learn C# from nothing to genuinely advanced: install .NET and the basics - types, classes, objects, collections - then the deep half: generics, delegates and lambdas, LINQ, modern records and pattern matching, async/await, the .NET runtime and its garbage collector, testing, and performance. Mental-model-first, with honest explanations.",
        "order": 7,
        "phases": [
          {
            "slug": "01-install-and-first-program",
            "title": "Install & Your First Program - .NET, the dotnet CLI & the CLR",
            "phaseNum": "1",
            "order": 1,
            "summary": "Get the .NET SDK installed, write a one-line program with top-level statements, and run it with dotnet - plus the mental model of how C# compiles to IL that the CLR JITs to native code.",
            "filePath": "/guides/programming-languages/csharp-from-zero/01-install-and-first-program.md"
          },
          {
            "slug": "02-syntax-values-and-types",
            "title": "Syntax, Values & Types - Value vs Reference & Static Typing",
            "phaseNum": "2",
            "order": 2,
            "summary": "C#'s static type system, the value-vs-reference split that decides whether assignment copies or shares, var for inference, nullable types that kill the null-reference crash, and strings done right.",
            "filePath": "/guides/programming-languages/csharp-from-zero/02-syntax-values-and-types.md"
          },
          {
            "slug": "03-collections",
            "title": "Collections - Arrays, Lists, Dictionaries & Sets",
            "phaseNum": "3",
            "order": 3,
            "summary": "The four containers you'll reach for daily - fixed arrays, growable lists, key-value dictionaries, and unique-only sets - plus the generics mental model and the interfaces (IEnumerable, ICollection, IList) that tie them together.",
            "filePath": "/guides/programming-languages/csharp-from-zero/03-collections.md"
          },
          {
            "slug": "04-control-flow-and-methods",
            "title": "Control Flow & Methods - Decisions, Loops & Reusable Logic",
            "phaseNum": "4",
            "order": 4,
            "summary": "Branch with if and switch (statement and expression), loop with for/while/do-while/foreach, and package logic into methods - with optional, named, ref/out parameters and overloading explained from scratch.",
            "filePath": "/guides/programming-languages/csharp-from-zero/04-control-flow-and-methods.md"
          },
          {
            "slug": "05-classes-and-objects",
            "title": "Classes & Objects - The Spine of C#",
            "phaseNum": "5",
            "order": 5,
            "summary": "A class is a blueprint; an object is one built with new. Here's how fields, constructors, this, and C#'s signature feature - properties - fit together, plus encapsulation, static, and overriding ToString.",
            "filePath": "/guides/programming-languages/csharp-from-zero/05-classes-and-objects.md"
          },
          {
            "slug": "06-inheritance-and-interfaces",
            "title": "Inheritance & Interfaces - Sharing Behavior",
            "phaseNum": "6",
            "order": 6,
            "summary": "How one class builds on another with inheritance, how virtual/override give you polymorphism, and how interfaces let unrelated classes promise the same behavior - plus abstract, sealed, and when to choose which.",
            "filePath": "/guides/programming-languages/csharp-from-zero/06-inheritance-and-interfaces.md"
          },
          {
            "slug": "07-errors-and-io",
            "title": "Errors & I/O - Exceptions, Resources & Files",
            "phaseNum": "7",
            "order": 7,
            "summary": "How C# signals failure with exceptions: try/catch/finally, catching specific types, throwing your own, deterministic cleanup with using/IDisposable, and reading and writing files without leaking handles.",
            "filePath": "/guides/programming-languages/csharp-from-zero/07-errors-and-io.md"
          },
          {
            "slug": "08-projects-and-tooling",
            "title": "Projects, NuGet & Tooling - From Files to a Real Solution",
            "phaseNum": "8",
            "order": 8,
            "summary": "How real C# code is organized and shipped: namespaces and using, the .csproj project file and .sln solution, NuGet packages, dotnet build vs publish, and the wider toolchain you'll live in daily.",
            "filePath": "/guides/programming-languages/csharp-from-zero/08-projects-and-tooling.md"
          },
          {
            "slug": "09-idioms-and-gotchas",
            "title": "Idioms & Common Gotchas - Write It Like a C# Dev, Dodge the Traps",
            "phaseNum": "9",
            "order": 9,
            "summary": "C# idioms that make code read like C# - properties over fields, var when obvious, string interpolation, null-handling operators, nullable reference types - plus a cheat-card for the classics: == vs Equals, NullReferenceException, deferred LINQ, integer division, and async void.",
            "filePath": "/guides/programming-languages/csharp-from-zero/09-idioms-and-gotchas.md"
          },
          {
            "slug": "10-generics-deep",
            "title": "Generics, Deep - Type Safety Without Duplication",
            "phaseNum": "10",
            "order": 10,
            "summary": "Generics let you write code once that works for many types - with compile-time safety and no boxing. Generic methods and classes, constraints, covariance/contravariance, and why C# generics are reified, not erased like Java's.",
            "filePath": "/guides/programming-languages/csharp-from-zero/10-generics-deep.md"
          },
          {
            "slug": "11-delegates-and-lambdas",
            "title": "Delegates, Lambdas & Events - Functions as Values",
            "phaseNum": "11",
            "order": 11,
            "summary": "Functions become values you can store, pass, and call later: delegates as typed function pointers, lambdas as inline functions, the Func/Action/Predicate vocabulary, how closures capture variables, and events as safe publish/subscribe.",
            "filePath": "/guides/programming-languages/csharp-from-zero/11-delegates-and-lambdas.md"
          },
          {
            "slug": "12-linq",
            "title": "LINQ - Querying Anything, Declaratively",
            "phaseNum": "12",
            "order": 12,
            "summary": "LINQ lets you ask collections, databases, and XML what you want instead of writing the loop that gets it. Method vs query syntax, the deferred-execution trap, and the operators you'll lean on.",
            "filePath": "/guides/programming-languages/csharp-from-zero/12-linq.md"
          },
          {
            "slug": "13-records-and-modern-csharp",
            "title": "Records, Pattern Matching & Modern C# - Less Boilerplate, More Safety",
            "phaseNum": "13",
            "order": 13,
            "summary": "Records give you immutable value types in one line. Pattern matching lets you ask 'what shape is this data?' cleanly. Plus init/required members and nullable reference types - the features that make modern C# concise and safe.",
            "filePath": "/guides/programming-languages/csharp-from-zero/13-records-and-modern-csharp.md"
          },
          {
            "slug": "14-async-await-and-tasks",
            "title": "async/await & Tasks - Concurrency Without the Pain",
            "phaseNum": "14",
            "order": 14,
            "summary": "C# pioneered async/await. Here's the real mental model: a Task is work that finishes later, await suspends your method without blocking a thread, and the deadlock + async-void traps that bite everyone once.",
            "filePath": "/guides/programming-languages/csharp-from-zero/14-async-await-and-tasks.md"
          },
          {
            "slug": "15-the-dotnet-runtime-and-gc",
            "title": "The .NET Runtime: Memory, GC & JIT - What Runs Your IL",
            "phaseNum": "15",
            "order": 15,
            "summary": "What happens under your C#: IL runs on the CLR, which decides whether values live on the stack or the managed heap, garbage-collects what you stop using across generations, and JIT-compiles hot code to native. Plus why GC frees memory but not files.",
            "filePath": "/guides/programming-languages/csharp-from-zero/15-the-dotnet-runtime-and-gc.md"
          },
          {
            "slug": "16-testing-and-profiling",
            "title": "Testing, Build & Profiling - Proving It Works, Finding the Slow Part",
            "phaseNum": "16",
            "order": 16,
            "summary": "Prove C# correct with xUnit facts and theories, isolate units with Moq, measure honestly with BenchmarkDotNet (because Stopwatch loops lie), and find real hotspots with dotnet-trace and coverlet.",
            "filePath": "/guides/programming-languages/csharp-from-zero/16-testing-and-profiling.md"
          },
          {
            "slug": "17-performance-and-ecosystem",
            "title": "Performance & the Ecosystem - Measure, Then Cut Allocations",
            "phaseNum": "17",
            "order": 17,
            "summary": "Performance in C# is measurement first, algorithm second, allocations third. Profile to find the real hot path, fix the big-O, cut GC pressure - then meet the .NET ecosystem you're now ready for.",
            "filePath": "/guides/programming-languages/csharp-from-zero/17-performance-and-ecosystem.md"
          },
          {
            "slug": "18-where-to-go-next",
            "title": "Where to Go Next - Putting C# to Work",
            "phaseNum": "18",
            "order": 18,
            "summary": "You know the language and the .NET runtime; here's the honest map of where to apply it - web with ASP.NET Core, Blazor, mobile/desktop with MAUI, games with Unity - and what to build to make it stick.",
            "filePath": "/guides/programming-languages/csharp-from-zero/18-where-to-go-next.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "web-fundamentals",
    "name": "Web Fundamentals",
    "icon": "ti-world-www",
    "blurb": "HTML, CSS, and how the browser actually works - the web platform itself, learned properly.",
    "guides": [
      {
        "slug": "what-the-web-actually-is",
        "title": "What the Web Actually Is",
        "summary": "The web isn't magic - it's two programs talking. This guide builds the mental model everything else in Web Fundamentals depends on: browsers and servers, URLs and DNS, and the three languages (HTML, CSS, JS) that make a page.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-client-server-model",
            "title": "The Client-Server Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "A browser is a program that asks for things; a server is a program that answers. This phase walks the full request/response cycle and shows you how to watch it happen live in DevTools.",
            "filePath": "/guides/web-fundamentals/what-the-web-actually-is/01-the-client-server-model.md"
          },
          {
            "slug": "02-urls-dns-and-http-together",
            "title": "URLs, DNS, and HTTP, Together",
            "phaseNum": "2",
            "order": 2,
            "summary": "A URL is a structured address, DNS turns its hostname into an IP address, and HTTP is the actual message format underneath. This phase connects all three into one picture.",
            "filePath": "/guides/web-fundamentals/what-the-web-actually-is/02-urls-dns-and-http-together.md"
          },
          {
            "slug": "03-html-css-and-javascript-three-jobs-three-languages",
            "title": "HTML, CSS, and JavaScript: Three Jobs, Three Languages",
            "phaseNum": "3",
            "order": 3,
            "summary": "Every web page separates three concerns into three languages: HTML for structure, CSS for presentation, JavaScript for behavior. This phase shows all three on one page so you know exactly what each one is for.",
            "filePath": "/guides/web-fundamentals/what-the-web-actually-is/03-html-css-and-javascript-three-jobs-three-languages.md"
          }
        ]
      },
      {
        "slug": "html-from-zero",
        "title": "HTML From Zero",
        "summary": "HTML is the structure underneath every web page - the tags that say 'this is a heading, this is a link, this is a list.' Build a real About Me page from an empty skeleton to a fully semantic document.",
        "order": 2,
        "phases": [
          {
            "slug": "01-your-first-page-elements-tags-and-structure",
            "title": "Your First Page: Elements, Tags, and Structure",
            "phaseNum": "1",
            "order": 1,
            "summary": "A tag marks where something starts or ends, an element is the whole marked-up thing, and every HTML page needs the same three-part skeleton. Build the empty shell of an About Me page.",
            "filePath": "/guides/web-fundamentals/html-from-zero/01-your-first-page-elements-tags-and-structure.md"
          },
          {
            "slug": "02-text-lists-links-and-images",
            "title": "Text, Lists, Links, and Images",
            "phaseNum": "2",
            "order": 2,
            "summary": "Headings, paragraphs, semantic emphasis, lists, links, and images with real alt text - fill the About Me skeleton with actual content.",
            "filePath": "/guides/web-fundamentals/html-from-zero/02-text-lists-links-and-images.md"
          },
          {
            "slug": "03-semantic-html-and-document-structure",
            "title": "Semantic HTML and Document Structure",
            "phaseNum": "3",
            "order": 3,
            "summary": "Swap generic <div> soup for <header>, <nav>, <main>, <section>, and <footer> - tags that describe a page's structure instead of hiding it, which is what screen readers and search engines actually read.",
            "filePath": "/guides/web-fundamentals/html-from-zero/03-semantic-html-and-document-structure.md"
          }
        ]
      },
      {
        "slug": "css-without-tears",
        "title": "CSS Without Tears",
        "summary": "CSS looks like a pile of unrelated rules until you learn the handful of ideas underneath it - selectors, the box model, units, and positioning. This guide builds all four on one running example.",
        "order": 3,
        "phases": [
          {
            "slug": "01-selectors-and-the-cascade",
            "title": "Selectors and the Cascade",
            "phaseNum": "1",
            "order": 1,
            "summary": "How CSS decides which rule wins when two rules target the same element, what properties inherit from parent to child, and when !important is legitimate versus a code smell.",
            "filePath": "/guides/web-fundamentals/css-without-tears/01-selectors-and-the-cascade.md"
          },
          {
            "slug": "02-the-box-model",
            "title": "The Box Model",
            "phaseNum": "2",
            "order": 2,
            "summary": "Every HTML element is a box made of content, padding, border, and margin - and why almost every real stylesheet sets box-sizing: border-box globally to stop that box from surprising you.",
            "filePath": "/guides/web-fundamentals/css-without-tears/02-the-box-model.md"
          },
          {
            "slug": "03-colors-units-and-typography",
            "title": "Colors, Units, and Typography",
            "phaseNum": "3",
            "order": 3,
            "summary": "Hex, rgb, and hsl color syntax, why rem is the right default unit for font sizes because it respects the user's browser settings, and the line-height mistake that makes text feel cramped.",
            "filePath": "/guides/web-fundamentals/css-without-tears/03-colors-units-and-typography.md"
          },
          {
            "slug": "04-positioning",
            "title": "Positioning",
            "phaseNum": "4",
            "order": 4,
            "summary": "What static, relative, absolute, fixed, and sticky actually reposition an element relative to, worked through a sticky header and a centered modal overlay.",
            "filePath": "/guides/web-fundamentals/css-without-tears/04-positioning.md"
          }
        ]
      },
      {
        "slug": "flexbox-and-grid",
        "title": "Flexbox and Grid",
        "summary": "The two CSS layout systems that replaced floats and hacks: Flexbox for rows and columns, Grid for full two-dimensional layouts, and how to pick between them.",
        "order": 4,
        "phases": [
          {
            "slug": "01-flexbox-one-dimensional-layout",
            "title": "Flexbox: One-Dimensional Layout",
            "phaseNum": "1",
            "order": 1,
            "summary": "How display: flex lines up boxes along a single axis, with justify-content, align-items, wrapping, and flex-grow/shrink/basis for building a navbar and a row of equal-width cards.",
            "filePath": "/guides/web-fundamentals/flexbox-and-grid/01-flexbox-one-dimensional-layout.md"
          },
          {
            "slug": "02-css-grid-two-dimensional-layout",
            "title": "CSS Grid: Two-Dimensional Layout",
            "phaseNum": "2",
            "order": 2,
            "summary": "How display: grid lays out rows and columns together, using grid-template-columns/rows, gap, named grid-template-areas, and spanning, to build a dashboard layout and a responsive photo gallery.",
            "filePath": "/guides/web-fundamentals/flexbox-and-grid/02-css-grid-two-dimensional-layout.md"
          },
          {
            "slug": "03-choosing-between-them-and-combining-them",
            "title": "Choosing Between Them (and Combining Them)",
            "phaseNum": "3",
            "order": 3,
            "summary": "The rule of thumb for Flexbox vs Grid, why they compose rather than compete, and a holy grail layout that uses both together.",
            "filePath": "/guides/web-fundamentals/flexbox-and-grid/03-choosing-between-them-and-combining-them.md"
          }
        ]
      },
      {
        "slug": "the-dom-explained",
        "title": "The DOM Explained",
        "summary": "The DOM is the live, in-memory tree the browser builds from your HTML - and the thing JavaScript actually touches. Learn how it differs from the HTML source, how to select and change elements, and how events bubble.",
        "order": 5,
        "phases": [
          {
            "slug": "01-the-dom-is-not-the-html",
            "title": "The DOM Is Not the HTML",
            "phaseNum": "1",
            "order": 1,
            "summary": "The browser parses HTML into a live tree of objects called the DOM. JavaScript reads and changes that tree, not the original HTML text - which is why View Source and devtools can show two different pages.",
            "filePath": "/guides/web-fundamentals/the-dom-explained/01-the-dom-is-not-the-html.md"
          },
          {
            "slug": "02-selecting-and-modifying-elements",
            "title": "Selecting and Modifying Elements",
            "phaseNum": "2",
            "order": 2,
            "summary": "How to find elements with querySelector and querySelectorAll, change classes with classList, set text safely with textContent instead of innerHTML, and read or write inline styles.",
            "filePath": "/guides/web-fundamentals/the-dom-explained/02-selecting-and-modifying-elements.md"
          },
          {
            "slug": "03-events-listening-bubbling-and-delegation",
            "title": "Events: Listening, Bubbling, and Delegation",
            "phaseNum": "3",
            "order": 3,
            "summary": "How addEventListener and the event object work, why events bubble from child to parent, and how to use that to handle a whole list of items with a single delegated listener.",
            "filePath": "/guides/web-fundamentals/the-dom-explained/03-events-listening-bubbling-and-delegation.md"
          }
        ]
      },
      {
        "slug": "forms-that-work",
        "title": "Forms That Work",
        "summary": "Forms are how the web collects input - and most of what makes them good or broken lives in details people skip. Build one real signup form and wire up labels, validation, and submission the right way.",
        "order": 6,
        "phases": [
          {
            "slug": "01-inputs-labels-and-why-label-matters",
            "title": "Inputs, Labels, and Why `<label>` Matters",
            "phaseNum": "1",
            "order": 1,
            "summary": "Input types set the keyboard and validation a field gets for free. The `<label>` element is what makes that field usable at all - not decoration.",
            "filePath": "/guides/web-fundamentals/forms-that-work/01-inputs-labels-and-why-label-matters.md"
          },
          {
            "slug": "02-validation-built-in-vs-custom",
            "title": "Validation: Built-in vs. Custom",
            "phaseNum": "2",
            "order": 2,
            "summary": "HTML validates form fields for free with required, pattern, and type checks - but password confirmation and server-side checks like 'is this email taken' still need JavaScript.",
            "filePath": "/guides/web-fundamentals/forms-that-work/02-validation-built-in-vs-custom.md"
          },
          {
            "slug": "03-submitting-data-get-vs-post-formdata-and-fetch",
            "title": "Submitting Data: GET vs. POST, FormData, and Fetch",
            "phaseNum": "3",
            "order": 3,
            "summary": "A plain form submit navigates the whole page. preventDefault() plus fetch and FormData sends the same data without leaving the page - and lets you handle server errors gracefully.",
            "filePath": "/guides/web-fundamentals/forms-that-work/03-submitting-data-get-vs-post-formdata-and-fetch.md"
          }
        ]
      },
      {
        "slug": "how-the-browser-renders-a-page",
        "title": "How the Browser Renders a Page",
        "summary": "What happens between the browser receiving HTML/CSS bytes and pixels showing on screen - parsing, the render tree, layout, paint, and why some style changes are far more expensive than others.",
        "order": 7,
        "phases": [
          {
            "slug": "01-parsing-from-bytes-to-dom-and-cssom",
            "title": "Parsing: From Bytes to DOM and CSSOM",
            "phaseNum": "1",
            "order": 1,
            "summary": "The browser builds the DOM while HTML is still streaming in, builds the CSSOM from CSS in parallel, and a script tag without defer or async can stop both cold.",
            "filePath": "/guides/web-fundamentals/how-the-browser-renders-a-page/01-parsing-from-bytes-to-dom-and-cssom.md"
          },
          {
            "slug": "02-the-render-tree-layout-and-paint",
            "title": "The Render Tree, Layout, and Paint",
            "phaseNum": "2",
            "order": 2,
            "summary": "The DOM and CSSOM combine into a render tree of only the visible boxes, layout computes each box's exact size and position, and paint fills in the actual pixels.",
            "filePath": "/guides/web-fundamentals/how-the-browser-renders-a-page/02-the-render-tree-layout-and-paint.md"
          },
          {
            "slug": "03-why-some-changes-are-expensive",
            "title": "Why Some Changes Are Expensive",
            "phaseNum": "3",
            "order": 3,
            "summary": "Changing geometry re-runs layout, paint, and composite; changing color skips layout; changing transform or opacity can skip both and run on the compositor thread, which is why they're the go-to properties for smooth animation.",
            "filePath": "/guides/web-fundamentals/how-the-browser-renders-a-page/03-why-some-changes-are-expensive.md"
          }
        ]
      },
      {
        "slug": "responsive-design",
        "title": "Responsive Design",
        "summary": "How to build a layout that works from a phone screen to a desktop monitor: the viewport meta tag, media queries, fluid units, and responsive images.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-viewport-and-media-queries",
            "title": "The Viewport and Media Queries",
            "phaseNum": "1",
            "order": 1,
            "summary": "The viewport meta tag stops mobile browsers from rendering a shrunk-down desktop page, and @media queries let you apply different CSS at different screen widths.",
            "filePath": "/guides/web-fundamentals/responsive-design/01-the-viewport-and-media-queries.md"
          },
          {
            "slug": "02-fluid-layouts",
            "title": "Fluid Layouts",
            "phaseNum": "2",
            "order": 2,
            "summary": "Building layouts from relative units and wrapping Flexbox/Grid instead of fixed pixel widths, plus clamp() for typography and spacing that scale continuously without extra media queries.",
            "filePath": "/guides/web-fundamentals/responsive-design/02-fluid-layouts.md"
          },
          {
            "slug": "03-responsive-images-and-mobile-first-workflow",
            "title": "Responsive Images and Mobile-First Workflow",
            "phaseNum": "3",
            "order": 3,
            "summary": "Serving the right image size with srcset/sizes, swapping images entirely with <picture>, and why writing CSS mobile-first (min-width up) beats desktop-first (max-width overrides down).",
            "filePath": "/guides/web-fundamentals/responsive-design/03-responsive-images-and-mobile-first-workflow.md"
          }
        ]
      },
      {
        "slug": "accessibility-from-day-one",
        "title": "Accessibility From Day One",
        "summary": "Accessibility isn't a checklist bolted on at the end - it's a byproduct of using HTML correctly. Learn why it matters, how ARIA and focus management fill the gaps semantic HTML leaves, and how to test with a real screen reader.",
        "order": 9,
        "phases": [
          {
            "slug": "01-why-accessibility-isnt-optional",
            "title": "Why Accessibility Isn't Optional",
            "phaseNum": "1",
            "order": 1,
            "summary": "Screen reader users, keyboard-only users, and people with low vision are a normal part of your audience. The four WCAG pillars explain what accessible means, and semantic HTML already covers most of it.",
            "filePath": "/guides/web-fundamentals/accessibility-from-day-one/01-why-accessibility-isnt-optional.md"
          },
          {
            "slug": "02-aria-focus-management-and-keyboard-navigation",
            "title": "ARIA, Focus Management, and Keyboard Navigation",
            "phaseNum": "2",
            "order": 2,
            "summary": "ARIA fills the gaps native HTML leaves, but bad ARIA is worse than none. Learn the first rule of ARIA, how tabindex works, why removing focus outlines without a replacement breaks keyboard navigation, and how to trap focus in a modal.",
            "filePath": "/guides/web-fundamentals/accessibility-from-day-one/02-aria-focus-management-and-keyboard-navigation.md"
          },
          {
            "slug": "03-testing-with-a-screen-reader-and-automated-tools",
            "title": "Testing with a Screen Reader and Automated Tools",
            "phaseNum": "3",
            "order": 3,
            "summary": "Turn on VoiceOver or NVDA and tab through a real page to hear what a screen reader user hears. Then add Lighthouse and axe - automated tools that catch about a third of issues, which is why manual testing still matters.",
            "filePath": "/guides/web-fundamentals/accessibility-from-day-one/03-testing-with-a-screen-reader-and-automated-tools.md"
          }
        ]
      },
      {
        "slug": "browser-storage-and-cookies",
        "title": "Browser Storage and Cookies",
        "summary": "How browsers remember things between page loads: cookies and their security attributes, localStorage/sessionStorage/IndexedDB, and which one to reach for depending on what you're storing.",
        "order": 10,
        "phases": [
          {
            "slug": "01-cookies-explained",
            "title": "Cookies: What They Are and Why They Got Complicated",
            "phaseNum": "1",
            "order": 1,
            "summary": "A cookie is a small name=value string the browser stores and automatically attaches to every matching request - and that automatic behavior is both why cookies power login sessions and why they're a security surface.",
            "filePath": "/guides/web-fundamentals/browser-storage-and-cookies/01-cookies-explained.md"
          },
          {
            "slug": "02-storage-apis",
            "title": "localStorage, sessionStorage, and IndexedDB",
            "phaseNum": "2",
            "order": 2,
            "summary": "Three client-side storage APIs that, unlike cookies, never get sent over the network: localStorage persists indefinitely, sessionStorage dies with the tab, and IndexedDB handles the size and structure localStorage can't.",
            "filePath": "/guides/web-fundamentals/browser-storage-and-cookies/02-storage-apis.md"
          },
          {
            "slug": "03-choosing-storage",
            "title": "Choosing the Right Storage for the Job",
            "phaseNum": "3",
            "order": 3,
            "summary": "A decision guide for picking cookies, localStorage, sessionStorage, or IndexedDB based on what the data is and who needs to see it - worked through with a complete dark mode example.",
            "filePath": "/guides/web-fundamentals/browser-storage-and-cookies/03-choosing-storage.md"
          }
        ]
      },
      {
        "slug": "building-your-own-mini-framework",
        "title": "Building Your Own Mini Framework",
        "summary": "React, Vue, and Svelte feel like magic until you build the two ideas underneath them yourself: a virtual DOM diff and a signal-based reactivity system. Write both from scratch in plain JavaScript.",
        "order": 11,
        "phases": [
          {
            "slug": "01-a-virtual-dom-from-scratch",
            "title": "A Virtual DOM From Scratch",
            "phaseNum": "1",
            "order": 1,
            "summary": "Build a real diff() and patch() pair that compares two plain-object trees and updates only the DOM nodes that changed - the core trick behind every virtual-DOM framework.",
            "filePath": "/guides/web-fundamentals/building-your-own-mini-framework/01-a-virtual-dom-from-scratch.md"
          },
          {
            "slug": "02-reactivity-without-magic",
            "title": "Reactivity Without Magic",
            "phaseNum": "2",
            "order": 2,
            "summary": "Build a signal from scratch - a value plus a list of subscribers - and wire it to phase 1's diff/patch renderer so changing state triggers a real re-render.",
            "filePath": "/guides/web-fundamentals/building-your-own-mini-framework/02-reactivity-without-magic.md"
          },
          {
            "slug": "03-what-react-vue-svelte-actually-add-on-top",
            "title": "What React/Vue/Svelte Actually Add On Top",
            "phaseNum": "3",
            "order": 3,
            "summary": "The mini virtual DOM and signal system from phases 1-2 cover the core loop - here's the real gap between that and a production framework: lifecycle, batching, keyed diffing, scheduling, and compilers.",
            "filePath": "/guides/web-fundamentals/building-your-own-mini-framework/03-what-react-vue-svelte-actually-add-on-top.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "frameworks",
    "name": "Frameworks & Libraries",
    "icon": "ti-stack-2",
    "blurb": "Django, FastAPI, React, Next, Spring Boot, and friends.",
    "guides": [
      {
        "slug": "what-a-framework-even-is",
        "title": "What a Framework Even Is",
        "summary": "The mental model under every framework you'll ever learn: what a framework actually is (and how it differs from a library), why they exist, the real price of their 'magic,' the handful of parts every framework shares, and how to choose and learn one fast.",
        "order": 1,
        "phases": [
          {
            "slug": "01-framework-vs-library",
            "title": "Framework vs Library - Who Calls Whom",
            "phaseNum": "1",
            "order": 1,
            "summary": "The one idea behind the whole 'framework' label: a library is code you call when you need it, while a framework is code that calls you - control inverts, and that reversal is the entire distinction.",
            "filePath": "/guides/frameworks/what-a-framework-even-is/01-framework-vs-library.md"
          },
          {
            "slug": "02-why-frameworks-exist",
            "title": "Why Frameworks Exist",
            "phaseNum": "2",
            "order": 2,
            "summary": "The honest case for frameworks: they pre-solve the plumbing every app needs, set sane conventions, ship safe-by-default security, free you to build what's unique, and hand you a whole ecosystem.",
            "filePath": "/guides/frameworks/what-a-framework-even-is/02-why-frameworks-exist.md"
          },
          {
            "slug": "03-the-price-of-magic",
            "title": "The Price of Magic",
            "phaseNum": "3",
            "order": 3,
            "summary": "The same power that makes frameworks worth it carries a bill: hidden 'magic,' a debugging tax through code you didn't write, a second thing to learn, lock-in, and abstractions that eventually leak.",
            "filePath": "/guides/frameworks/what-a-framework-even-is/03-the-price-of-magic.md"
          },
          {
            "slug": "04-the-anatomy-of-any-framework",
            "title": "The Anatomy of (Almost) Any Framework",
            "phaseNum": "4",
            "order": 4,
            "summary": "Most web frameworks share the same handful of parts - routing, middleware, handlers, a data layer, templating, and a lifecycle. Learn the parts once and every new framework becomes 'where does THIS one put each piece?'",
            "filePath": "/guides/frameworks/what-a-framework-even-is/04-the-anatomy-of-any-framework.md"
          },
          {
            "slug": "05-choosing-and-learning-a-framework",
            "title": "Choosing & Learning a Framework",
            "phaseNum": "5",
            "order": 5,
            "summary": "How to pick a framework by your goal and learn it fast - the three tiers we organize this category by (popular, battle-tested, roots), and a repeatable recipe that beats reading docs front to back.",
            "filePath": "/guides/frameworks/what-a-framework-even-is/05-choosing-and-learning-a-framework.md"
          }
        ]
      },
      {
        "slug": "spring-boot-from-zero",
        "title": "Spring Boot From Zero",
        "summary": "Learn Spring Boot the way it's actually used: what auto-configuration really does, dependency injection and beans, building a REST API, configuration and profiles, persistence with Spring Data JPA, the service layer and validation, error handling, testing, security, and shipping to production. Mental-model-first, magic demystified.",
        "order": 2,
        "phases": [
          {
            "slug": "01-what-spring-boot-is",
            "title": "What Spring Boot Is & Your First App",
            "phaseNum": "1",
            "order": 1,
            "summary": "Spring is the giant toolbox; Spring Boot is Spring with auto-configuration, sensible defaults, and an embedded server so you go from zero to a running web app in minutes.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/01-what-spring-boot-is.md"
          },
          {
            "slug": "02-dependency-injection-and-beans",
            "title": "Dependency Injection & Beans",
            "phaseNum": "2",
            "order": 2,
            "summary": "The heart of Spring: why dependency injection exists, what the IoC container and a bean actually are, declaring beans with @Component/@Service, and constructor injection over field @Autowired.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/02-dependency-injection-and-beans.md"
          },
          {
            "slug": "03-rest-controllers",
            "title": "Building a REST API: Controllers",
            "phaseNum": "3",
            "order": 3,
            "summary": "Turn a Spring app into a real HTTP API: @RestController, GET/POST mappings, path variables and query params, JSON request bodies, ResponseEntity for status codes, and how a request actually flows.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/03-rest-controllers.md"
          },
          {
            "slug": "04-configuration-and-profiles",
            "title": "Configuration & Profiles",
            "phaseNum": "4",
            "order": 4,
            "summary": "How Spring Boot reads externalized config: application.yml, @Value and @ConfigurationProperties, the precedence order that lets one jar run anywhere, profiles per environment, and keeping secrets out of your code.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/04-configuration-and-profiles.md"
          },
          {
            "slug": "05-persistence-with-jpa",
            "title": "Persistence with Spring Data JPA",
            "phaseNum": "5",
            "order": 5,
            "summary": "Map a Book object to a database table with JPA, then let Spring Data generate a whole repository for you \u2014 save, find, derived queries \u2014 and learn where the ORM magic stops and you still owe the database your attention.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/05-persistence-with-jpa.md"
          },
          {
            "slug": "06-service-layer-and-validation",
            "title": "The Service Layer, DTOs & Validation",
            "phaseNum": "6",
            "order": 6,
            "summary": "Give your API a spine: a thin controller, a transactional service holding business logic, DTOs that decouple the API from the database, and Bean Validation that rejects bad input before it ever reaches your code.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/06-service-layer-and-validation.md"
          },
          {
            "slug": "07-error-handling",
            "title": "Error Handling Done Right",
            "phaseNum": "7",
            "order": 7,
            "summary": "Turn raw exceptions into honest HTTP responses: per-controller @ExceptionHandler, app-wide @RestControllerAdvice, the right status code for each failure, and one consistent error body with Spring's ProblemDetail.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/07-error-handling.md"
          },
          {
            "slug": "08-testing-spring-boot",
            "title": "Testing Spring Boot Apps",
            "phaseNum": "8",
            "order": 8,
            "summary": "Cash in the layering from Phase 6: unit-test the service with a mocked repository, slice-test the web layer with @WebMvcTest + MockMvc and the JPA layer with @DataJpaTest, then go end-to-end with @SpringBootTest and Testcontainers.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/08-testing-spring-boot.md"
          },
          {
            "slug": "09-security-with-spring-security",
            "title": "Security with Spring Security",
            "phaseNum": "9",
            "order": 9,
            "summary": "Spring Security is a chain of servlet filters every request passes before your controller. Master that one idea and the rest \u2014 authN vs authZ, the SecurityFilterChain bean, password encoding, and stateless JWT \u2014 stops being voodoo.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/09-security-with-spring-security.md"
          },
          {
            "slug": "10-production-actuator-and-deploy",
            "title": "Production: Actuator, Packaging & Deployment",
            "phaseNum": "10",
            "order": 10,
            "summary": "Take a Spring Boot app from 'runs on my machine' to production: Actuator health and metrics endpoints, building a self-contained fat jar, prod config, Dockerizing, and where it actually runs.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/10-production-actuator-and-deploy.md"
          },
          {
            "slug": "11-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "11",
            "order": 11,
            "summary": "You can build a layered, tested, secured REST API and deploy it. Honest signposts to where Spring goes from here \u2014 microservices, reactive, messaging \u2014 plus what to build.",
            "filePath": "/guides/frameworks/spring-boot-from-zero/11-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "hibernate-and-jpa-from-zero",
        "title": "Hibernate & JPA From Zero",
        "summary": "Learn the ORM that sits under most Java backends: what an ORM really is, JPA vs Hibernate, entities and mapping, the EntityManager and persistence context, transactions and dirty checking, relationships, lazy-vs-eager fetching and the N+1 trap, JPQL and the Criteria API, inheritance, and caching. The magic Spring Data JPA hides, made plain.",
        "order": 3,
        "phases": [
          {
            "slug": "01-what-an-orm-is",
            "title": "What an ORM Is & Why Hibernate Exists",
            "phaseNum": "1",
            "order": 1,
            "summary": "Your Java code thinks in objects; your database thinks in tables. An ORM bridges that gap so you work with objects and it writes the SQL. Here's the mental model, JPA vs Hibernate, and a minimal setup.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/01-what-an-orm-is.md"
          },
          {
            "slug": "02-entities-and-mapping",
            "title": "Entities & Basic Mapping",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a plain Java class becomes a database table: @Entity, @Id and key generation, @Column and @Table mapping, how Java types map to SQL, and letting Hibernate generate the schema.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/02-entities-and-mapping.md"
          },
          {
            "slug": "03-entitymanager-and-persistence-context",
            "title": "The EntityManager & Persistence Context",
            "phaseNum": "3",
            "order": 3,
            "summary": "The heart of Hibernate: the EntityManager is your handle to JPA, the persistence context is a per-transaction identity map and first-level cache, and every entity lives in one of four states.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/03-entitymanager-and-persistence-context.md"
          },
          {
            "slug": "04-transactions-and-unit-of-work",
            "title": "Transactions & the Unit of Work",
            "phaseNum": "4",
            "order": 4,
            "summary": "Why changing a field updates the row with no save call: transactions scope the persistence context, dirty checking diffs your managed objects, and flush sends the SQL \u2014 commit makes it stick.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/04-transactions-and-unit-of-work.md"
          },
          {
            "slug": "05-mapping-relationships",
            "title": "Mapping Relationships",
            "phaseNum": "5",
            "order": 5,
            "summary": "How JPA maps foreign keys to object references: @ManyToOne, @OneToMany with mappedBy, @ManyToMany join tables, owning vs inverse side, and the cascade and bidirectional-sync mistakes that cause most relationship bugs.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/05-mapping-relationships.md"
          },
          {
            "slug": "06-fetching-and-n-plus-1",
            "title": "Lazy vs Eager Fetching & the N+1 Problem",
            "phaseNum": "6",
            "order": 6,
            "summary": "How Hibernate decides when to load related data, why lazy loading throws LazyInitializationException, how the N+1 problem quietly turns one query into hundreds, and how JOIN FETCH, entity graphs, and batch fetching fix it.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/06-fetching-and-n-plus-1.md"
          },
          {
            "slug": "07-querying-jpql-criteria",
            "title": "Querying: JPQL, Criteria & Native SQL",
            "phaseNum": "7",
            "order": 7,
            "summary": "How JPA gives you three layers of querying \u2014 JPQL for everyday object queries, the Criteria API for dynamic ones, and native SQL as the escape hatch \u2014 plus parameters, joins, and DTO projections.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/07-querying-jpql-criteria.md"
          },
          {
            "slug": "08-inheritance-and-embeddables",
            "title": "Inheritance & Embeddables",
            "phaseNum": "8",
            "order": 8,
            "summary": "How to map a Java class hierarchy onto tables (SINGLE_TABLE, JOINED, TABLE_PER_CLASS) and how embeddables fold a value object's fields into the owning table \u2014 plus when to reach for each.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/08-inheritance-and-embeddables.md"
          },
          {
            "slug": "09-caching-and-performance",
            "title": "Caching & Performance",
            "phaseNum": "9",
            "order": 9,
            "summary": "How Hibernate's two caches work, how to batch writes instead of dribbling out one INSERT at a time, why reading the emitted SQL is the real skill, and when to step around the ORM entirely.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/09-caching-and-performance.md"
          },
          {
            "slug": "10-where-to-go-next",
            "title": "Hibernate in the Real World & Where to Go Next",
            "phaseNum": "10",
            "order": 10,
            "summary": "How Hibernate actually shows up in production: as Spring Data JPA, behind versioned schema migrations, and beside raw SQL when the job calls for it. Plus what to build next.",
            "filePath": "/guides/frameworks/hibernate-and-jpa-from-zero/10-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "jakarta-ee-from-zero",
        "title": "Jakarta EE From Zero",
        "summary": "Learn the enterprise Java standard that runs a huge share of big-company backends: what Jakarta EE actually is (specs vs app servers), CDI dependency injection, JAX-RS REST APIs, Jakarta Persistence, JTA transactions, validation and JSON binding, enterprise beans and messaging, security, and the cloud-native MicroProfile direction.",
        "order": 4,
        "phases": [
          {
            "slug": "01-what-jakarta-ee-is",
            "title": "What Jakarta EE Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Jakarta EE is a set of standard enterprise Java APIs that vendors implement; you code to the spec and a server provides the engine. Covers the specs, the javax-to-jakarta rename, and how it differs from Spring.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/01-what-jakarta-ee-is.md"
          },
          {
            "slug": "02-the-app-server-and-deployment",
            "title": "The Application Server & Deployment",
            "phaseNum": "2",
            "order": 2,
            "summary": "How classic Jakarta EE runs: your app deploys INTO a running application server that provides the specs. WAR/EAR packaging, app server vs servlet container, and the modern self-contained shift.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/02-the-app-server-and-deployment.md"
          },
          {
            "slug": "03-cdi-dependency-injection",
            "title": "CDI: Contexts & Dependency Injection",
            "phaseNum": "3",
            "order": 3,
            "summary": "CDI is Jakarta EE's standard dependency-injection container: @Inject wires beans, scopes manage lifecycle, qualifiers pick implementations, and producers/interceptors extend it \u2014 the backbone every other spec plugs into.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/03-cdi-dependency-injection.md"
          },
          {
            "slug": "04-jax-rs-rest-apis",
            "title": "JAX-RS: Building REST APIs",
            "phaseNum": "4",
            "order": 4,
            "summary": "Expose your CDI beans over HTTP the standard way: an @ApplicationPath bootstrap, @Path resource classes, the HTTP-method annotations, path and query params, JSON-B binding, and Response for honest status codes.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/04-jax-rs-rest-apis.md"
          },
          {
            "slug": "05-jakarta-persistence",
            "title": "Jakarta Persistence (JPA)",
            "phaseNum": "5",
            "order": 5,
            "summary": "JPA inside a Jakarta EE container: the persistence unit and persistence.xml, the container-injected @PersistenceContext EntityManager, and how Hibernate fits under it all.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/05-jakarta-persistence.md"
          },
          {
            "slug": "06-transactions-with-jta",
            "title": "Transactions with JTA",
            "phaseNum": "6",
            "order": 6,
            "summary": "How the Jakarta EE container runs transactions for you: declarative @Transactional on a CDI bean, what JTA coordinates, transaction attributes, the checked-exception rollback trap, and how it all scopes the persistence context.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/06-transactions-with-jta.md"
          },
          {
            "slug": "07-validation-and-json-binding",
            "title": "Validation & JSON Binding",
            "phaseNum": "7",
            "order": 7,
            "summary": "Reject bad input at the door with Jakarta Bean Validation, control object-to-JSON mapping with JSON-B, and see how @Valid, JSON-B, CDI, and JPA fit into one request flow.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/07-validation-and-json-binding.md"
          },
          {
            "slug": "08-enterprise-beans-and-messaging",
            "title": "Enterprise Beans & Messaging",
            "phaseNum": "8",
            "order": 8,
            "summary": "Enterprise beans (EJB) give you pooling, transactions, scheduling, and async for free; Jakarta Messaging lets services hand work to each other through queues \u2014 the enterprise way to stay loosely coupled.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/08-enterprise-beans-and-messaging.md"
          },
          {
            "slug": "09-jakarta-security",
            "title": "Jakarta Security",
            "phaseNum": "9",
            "order": 9,
            "summary": "Secure your Product REST API the standard way: an HttpAuthenticationMechanism proves who you are, an identity store validates credentials, and @RolesAllowed decides what you can do \u2014 with JWT for stateless APIs.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/09-jakarta-security.md"
          },
          {
            "slug": "10-microprofile-and-where-next",
            "title": "MicroProfile & Where to Go Next",
            "phaseNum": "10",
            "order": 10,
            "summary": "You can build a standard Jakarta EE service end to end. Now meet MicroProfile, the runtimes like Quarkus and Helidon, where this fits in a career, and what to build next.",
            "filePath": "/guides/frameworks/jakarta-ee-from-zero/10-microprofile-and-where-next.md"
          }
        ]
      },
      {
        "slug": "quarkus-from-zero",
        "title": "Quarkus From Zero",
        "summary": "Learn the cloud-native Java framework built for fast startup and low memory: why Quarkus moves work to build time, its loved dev mode, REST APIs, build-time CDI, Hibernate with Panache, configuration, reactive programming with Mutiny, testing, and compiling to a native executable. The standards you know, made supersonic.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-quarkus-is",
            "title": "What Quarkus Is & Why It's Fast",
            "phaseNum": "1",
            "order": 1,
            "summary": "Quarkus is a cloud-native Java framework that moves framework wiring from startup to build time, so apps boot in milliseconds, use little memory, and can compile to native machine code.",
            "filePath": "/guides/frameworks/quarkus-from-zero/01-what-quarkus-is.md"
          },
          {
            "slug": "02-dev-mode-and-dx",
            "title": "Dev Mode & the Developer Experience",
            "phaseNum": "2",
            "order": 2,
            "summary": "Quarkus's signature: live reload that recompiles on the next request, a built-in Dev UI, continuous testing, and Dev Services that auto-start throwaway databases \u2014 the fast feedback loop teams fall in love with.",
            "filePath": "/guides/frameworks/quarkus-from-zero/02-dev-mode-and-dx.md"
          },
          {
            "slug": "03-rest-apis",
            "title": "Building REST APIs",
            "phaseNum": "3",
            "order": 3,
            "summary": "Expose a Product over HTTP with Quarkus REST (RESTEasy Reactive): the standard JAX-RS annotations, path and query params, JSON request bodies via the rest-jackson extension, RestResponse for status codes, and the imperative-vs-reactive choice.",
            "filePath": "/guides/frameworks/quarkus-from-zero/03-rest-apis.md"
          },
          {
            "slug": "04-cdi-with-arc",
            "title": "CDI in Quarkus (ArC)",
            "phaseNum": "4",
            "order": 4,
            "summary": "Quarkus's DI container is ArC: the same CDI standard \u2014 @Inject, @ApplicationScoped \u2014 but the wiring graph is computed at build time, which is what makes fast boot and native images possible.",
            "filePath": "/guides/frameworks/quarkus-from-zero/04-cdi-with-arc.md"
          },
          {
            "slug": "05-persistence-with-panache",
            "title": "Persistence: Hibernate with Panache",
            "phaseNum": "5",
            "order": 5,
            "summary": "Panache is a thin Quarkus layer over Hibernate ORM that strips the boilerplate. Learn active-record and repository patterns, simplified queries, transactions, and zero-config Dev Services databases.",
            "filePath": "/guides/frameworks/quarkus-from-zero/05-persistence-with-panache.md"
          },
          {
            "slug": "06-configuration",
            "title": "Configuration",
            "phaseNum": "6",
            "order": 6,
            "summary": "How Quarkus externalizes config with MicroProfile: application.properties, @ConfigProperty, type-safe @ConfigMapping, dev/test/prod profiles, source precedence, and the build-time vs runtime trap unique to Quarkus.",
            "filePath": "/guides/frameworks/quarkus-from-zero/06-configuration.md"
          },
          {
            "slug": "07-reactive-with-mutiny",
            "title": "Reactive Quarkus with Mutiny",
            "phaseNum": "7",
            "order": 7,
            "summary": "Demystifies reactive Quarkus: why non-blocking exists, Mutiny's Uni and Multi, building reactive pipelines and endpoints with reactive Panache, and the honest verdict on when reactive earns its complexity versus plain imperative.",
            "filePath": "/guides/frameworks/quarkus-from-zero/07-reactive-with-mutiny.md"
          },
          {
            "slug": "08-testing",
            "title": "Testing Quarkus Apps",
            "phaseNum": "8",
            "order": 8,
            "summary": "@QuarkusTest boots a real app fast enough to lean on, REST Assured asserts the HTTP contract, Dev Services hands tests a real database, and @QuarkusIntegrationTest runs the suite against the native binary.",
            "filePath": "/guides/frameworks/quarkus-from-zero/08-testing.md"
          },
          {
            "slug": "09-native-compilation",
            "title": "Native Compilation & Containers",
            "phaseNum": "9",
            "order": 9,
            "summary": "How Quarkus compiles your Product service to a standalone native executable with GraalVM, why build-time wiring makes that possible, the reflection gotcha, and packaging tiny containers for Kubernetes.",
            "filePath": "/guides/frameworks/quarkus-from-zero/09-native-compilation.md"
          },
          {
            "slug": "10-where-to-go-next",
            "title": "Production & Where to Go Next",
            "phaseNum": "10",
            "order": 10,
            "summary": "You can build a fast Quarkus service and know why it's fast. Here's the production essentials \u2014 health, metrics, tracing, Kubernetes \u2014 the extension ecosystem, an honest look at the field, and what to build next.",
            "filePath": "/guides/frameworks/quarkus-from-zero/10-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "spring-framework-from-zero",
        "title": "Spring Framework (Core) From Zero",
        "summary": "Learn the Spring that Spring Boot auto-configures: the IoC container and ApplicationContext, defining beans with @Configuration and @Bean, dependency injection in depth, bean scopes and lifecycle, AOP and the proxies that power @Transactional, and Spring MVC without Boot. Write the config Boot hides - and the magic disappears.",
        "order": 6,
        "phases": [
          {
            "slug": "01-spring-without-boot",
            "title": "Spring Without Boot \u2014 Why Core Spring?",
            "phaseNum": "1",
            "order": 1,
            "summary": "Spring Boot is core Spring plus auto-configuration, starters, and an embedded server. Here we build a Spring app by hand so every piece Boot generates becomes visible.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/01-spring-without-boot.md"
          },
          {
            "slug": "02-the-ioc-container",
            "title": "The IoC Container & ApplicationContext",
            "phaseNum": "2",
            "order": 2,
            "summary": "The container deeply: Inversion of Control made concrete, what a bean really is, BeanFactory vs ApplicationContext, how the container bootstraps your object graph, and why you rarely call getBean.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/02-the-ioc-container.md"
          },
          {
            "slug": "03-defining-beans",
            "title": "Defining Beans: @Configuration & @Bean",
            "phaseNum": "3",
            "order": 3,
            "summary": "The two ways to put beans in the container \u2014 @Bean factory methods and component scanning \u2014 when to reach for each, and why @Bean methods are the manual version of Boot's auto-configuration.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/03-defining-beans.md"
          },
          {
            "slug": "04-dependency-injection-deep",
            "title": "Dependency Injection, Deep",
            "phaseNum": "4",
            "order": 4,
            "summary": "Constructor vs setter vs field injection and why constructor wins, exactly how @Autowired resolves a bean, fixing ambiguity with @Primary and @Qualifier, injecting collections of beans, and @Value for config.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/04-dependency-injection-deep.md"
          },
          {
            "slug": "05-bean-scopes-and-lifecycle",
            "title": "Bean Scopes & Lifecycle",
            "phaseNum": "5",
            "order": 5,
            "summary": "How many instances the container makes and how long they live: singleton vs prototype vs web scopes, the thread-safety trap of shared singletons, the prototype-in-singleton gotcha, the full bean lifecycle, and BeanPostProcessor.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/05-bean-scopes-and-lifecycle.md"
          },
          {
            "slug": "06-spring-aop-and-proxies",
            "title": "Spring AOP & Proxies",
            "phaseNum": "6",
            "order": 6,
            "summary": "How aspect-oriented programming works in Spring \u2014 and the proxy mechanism behind it. This is the phase that demystifies @Transactional, @Async, and @Cacheable, and explains the self-invocation gotcha at its root.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/06-spring-aop-and-proxies.md"
          },
          {
            "slug": "07-spring-mvc-without-boot",
            "title": "Spring MVC Without Boot",
            "phaseNum": "7",
            "order": 7,
            "summary": "How Spring MVC actually works under the hood: the DispatcherServlet front controller, wiring the web layer by hand, and the realization that Boot configures all of this for you.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/07-spring-mvc-without-boot.md"
          },
          {
            "slug": "08-from-core-spring-to-boot",
            "title": "From Core Spring to Spring Boot",
            "phaseNum": "8",
            "order": 8,
            "summary": "Tie it all together: Spring Boot is core Spring plus auto-configuration, starters, and an embedded server. You can now assemble a Spring app by hand - the magic is gone.",
            "filePath": "/guides/frameworks/spring-framework-from-zero/08-from-core-spring-to-boot.md"
          }
        ]
      },
      {
        "slug": "the-servlet-api",
        "title": "The Servlet API From Zero",
        "summary": "Learn the foundation under every Java web framework: what a servlet is, the servlet container and its thread-per-request lifecycle, handling HTTP by hand with HttpServlet, URL mapping and the front-controller pattern, filters and the filter chain, and sessions. Spring's DispatcherServlet, JAX-RS, and middleware all live on top of this \u2014 see it bare.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-a-servlet-is",
            "title": "What a Servlet Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A servlet is a Java object that handles an HTTP request and produces a response \u2014 the base unit every Java web framework is built on. Here's the mental model and a first one.",
            "filePath": "/guides/frameworks/the-servlet-api/01-what-a-servlet-is.md"
          },
          {
            "slug": "02-the-servlet-container-and-lifecycle",
            "title": "The Servlet Container & Lifecycle",
            "phaseNum": "2",
            "order": 2,
            "summary": "How the container runs a servlet: init/service/destroy, one shared instance serving every request on its own thread, and why that shared instance is exactly why your servlets (and Spring controllers) must be stateless.",
            "filePath": "/guides/frameworks/the-servlet-api/02-the-servlet-container-and-lifecycle.md"
          },
          {
            "slug": "03-handling-requests",
            "title": "Handling Requests with HttpServlet",
            "phaseNum": "3",
            "order": 3,
            "summary": "Override doGet/doPost on HttpServlet, read params, headers, and the raw body from the request, write status, headers, and JSON to the response - the unglamorous truth beneath @GetMapping.",
            "filePath": "/guides/frameworks/the-servlet-api/03-handling-requests.md"
          },
          {
            "slug": "04-mapping-and-the-front-controller",
            "title": "Mapping & the Front-Controller Pattern",
            "phaseNum": "4",
            "order": 4,
            "summary": "How the container decides which servlet handles which URL, why one-servlet-per-URL doesn't scale, and the front-controller pattern \u2014 one servlet routing everything \u2014 that is exactly what Spring's DispatcherServlet does.",
            "filePath": "/guides/frameworks/the-servlet-api/04-mapping-and-the-front-controller.md"
          },
          {
            "slug": "05-filters-and-the-chain",
            "title": "Filters & the Chain",
            "phaseNum": "5",
            "order": 5,
            "summary": "A filter intercepts every request before your servlet and the response after, without the servlet knowing. Chained together, filters are the root of what every framework calls middleware.",
            "filePath": "/guides/frameworks/the-servlet-api/05-filters-and-the-chain.md"
          },
          {
            "slug": "06-sessions-and-state",
            "title": "Sessions & State",
            "phaseNum": "6",
            "order": 6,
            "summary": "HTTP forgets you between requests, yet apps keep you logged in. Here's the mechanism: a session id in a cookie, server-side state behind it \u2014 and the stateless token alternative.",
            "filePath": "/guides/frameworks/the-servlet-api/06-sessions-and-state.md"
          },
          {
            "slug": "07-from-servlets-to-frameworks",
            "title": "From Servlets to Frameworks",
            "phaseNum": "7",
            "order": 7,
            "summary": "The payoff: see the servlet under every Java web framework. DispatcherServlet, @GetMapping, Spring Security, middleware, and JAX-RS all map back to the lifecycle, front controller, and filter chain you now know.",
            "filePath": "/guides/frameworks/the-servlet-api/07-from-servlets-to-frameworks.md"
          }
        ]
      },
      {
        "slug": "fastapi-from-zero",
        "title": "FastAPI From Zero",
        "summary": "Learn the modern Python API framework the way it's actually used: type-hint-driven routing, Pydantic models and automatic validation, response models, the Depends() dependency system, async and concurrency done right, databases, authentication with OAuth2/JWT, testing, and deployment. Plus the killer feature \u2014 automatic interactive docs \u2014 explained, not just shown.",
        "order": 8,
        "phases": [
          {
            "slug": "01-what-fastapi-is",
            "title": "What FastAPI Is & Your First App",
            "phaseNum": "1",
            "order": 1,
            "summary": "FastAPI is a modern async Python framework where your type hints become validation, docs, and serialization all at once. Install it, write a five-line app, run it, and watch the interactive docs appear for free.",
            "filePath": "/guides/frameworks/fastapi-from-zero/01-what-fastapi-is.md"
          },
          {
            "slug": "02-path-operations-and-parameters",
            "title": "Path Operations & Parameters",
            "phaseNum": "2",
            "order": 2,
            "summary": "How routes work in FastAPI: the decorator picks the HTTP method and path, path and query parameters come from your function signature, and the type hints parse and validate everything for free.",
            "filePath": "/guides/frameworks/fastapi-from-zero/02-path-operations-and-parameters.md"
          },
          {
            "slug": "03-pydantic-models-and-validation",
            "title": "Pydantic Models & Validation",
            "phaseNum": "3",
            "order": 3,
            "summary": "Pydantic turns a class of typed fields into a runtime gate that validates and coerces incoming data \u2014 and it's pure Python, so you can run it right here. It's the engine behind FastAPI request bodies and automatic 422 errors.",
            "filePath": "/guides/frameworks/fastapi-from-zero/03-pydantic-models-and-validation.md"
          },
          {
            "slug": "04-response-models-and-status-codes",
            "title": "Response Models & Status Codes",
            "phaseNum": "4",
            "order": 4,
            "summary": "Shape what your endpoints return with response_model, split input from output models so clients can't set or see internal fields, and return honest HTTP status codes including clean 404s via HTTPException.",
            "filePath": "/guides/frameworks/fastapi-from-zero/04-response-models-and-status-codes.md"
          },
          {
            "slug": "05-dependency-injection",
            "title": "Dependency Injection with Depends()",
            "phaseNum": "5",
            "order": 5,
            "summary": "FastAPI's Depends() lets an endpoint declare what it needs and have the framework supply it \u2014 pagination, DB sessions, auth \u2014 as plain reusable functions, with yield for setup/teardown.",
            "filePath": "/guides/frameworks/fastapi-from-zero/05-dependency-injection.md"
          },
          {
            "slug": "06-async-and-concurrency",
            "title": "Async & Concurrency",
            "phaseNum": "6",
            "order": 6,
            "summary": "How FastAPI's event loop serves many requests on one thread, when to write async def vs plain def, and the #1 performance bug \u2014 blocking the event loop with a sync call inside async def.",
            "filePath": "/guides/frameworks/fastapi-from-zero/06-async-and-concurrency.md"
          },
          {
            "slug": "07-databases-with-sqlmodel",
            "title": "Databases with SQLModel",
            "phaseNum": "7",
            "order": 7,
            "summary": "Make the get_db yield-dependency real with SQLModel \u2014 one class that's both your Pydantic model and your table \u2014 and wire create, read, update, and delete into the Book endpoints.",
            "filePath": "/guides/frameworks/fastapi-from-zero/07-databases-with-sqlmodel.md"
          },
          {
            "slug": "08-authentication-and-security",
            "title": "Authentication & Security",
            "phaseNum": "8",
            "order": 8,
            "summary": "Protect your Book API the FastAPI way: hash passwords, issue JWT access tokens from an OAuth2 password flow, and gate endpoints with a get_current_user dependency \u2014 plus the security must-knows.",
            "filePath": "/guides/frameworks/fastapi-from-zero/08-authentication-and-security.md"
          },
          {
            "slug": "09-testing-and-project-structure",
            "title": "Testing & Project Structure",
            "phaseNum": "9",
            "order": 9,
            "summary": "Test FastAPI in-process with TestClient, swap real dependencies for fakes via dependency_overrides, and grow past one giant main.py with APIRouter and a sane project layout.",
            "filePath": "/guides/frameworks/fastapi-from-zero/09-testing-and-project-structure.md"
          },
          {
            "slug": "10-where-to-go-next",
            "title": "Production & Where to Go Next",
            "phaseNum": "10",
            "order": 10,
            "summary": "You can build a validated, authenticated, tested, DB-backed FastAPI API. Now deploy it with uvicorn/gunicorn behind a proxy, learn background tasks, dodge the async pitfalls, and pick your next build.",
            "filePath": "/guides/frameworks/fastapi-from-zero/10-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "django-from-zero",
        "title": "Django From Zero",
        "summary": "Learn the batteries-included Python web framework: the project/app structure and MTV pattern, URLs and views, the ORM and migrations, the famous auto-admin, templates, forms and CSRF, the ORM in depth (and the N+1 trap), the built-in auth system, class-based views and Django REST Framework, testing, and production. The framework that ships with everything, explained.",
        "order": 9,
        "phases": [
          {
            "slug": "01-what-django-is",
            "title": "What Django Is & Your First Project",
            "phaseNum": "1",
            "order": 1,
            "summary": "Django is the batteries-included Python web framework: ORM, migrations, admin, auth, and templates in one box. Meet the MTV pattern, the project-vs-app split, and manage.py, then scaffold a blog.",
            "filePath": "/guides/frameworks/django-from-zero/01-what-django-is.md"
          },
          {
            "slug": "02-urls-and-views",
            "title": "URLs & Views",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a Django request becomes a response: the URLconf that maps URLs to views, function views that take an HttpRequest and return an HttpResponse, captured URL parameters, the request/response objects, and named URLs.",
            "filePath": "/guides/frameworks/django-from-zero/02-urls-and-views.md"
          },
          {
            "slug": "03-models-and-the-orm",
            "title": "Models & the ORM",
            "phaseNum": "3",
            "order": 3,
            "summary": "Define your data as Python classes, let migrations build the tables, and query the database in Python instead of SQL \u2014 Django's built-in ORM, the makemigrations/migrate loop, and the blog's Post and Comment models.",
            "filePath": "/guides/frameworks/django-from-zero/03-models-and-the-orm.md"
          },
          {
            "slug": "04-the-django-admin",
            "title": "The Django Admin",
            "phaseNum": "4",
            "order": 4,
            "summary": "Django reads your models and generates a complete web back-office \u2014 list, search, filter, create, edit, delete \u2014 for free. Register your models, customize with ModelAdmin and inlines, and know its limits.",
            "filePath": "/guides/frameworks/django-from-zero/04-the-django-admin.md"
          },
          {
            "slug": "05-templates-and-mtv",
            "title": "Templates & the MTV Pattern",
            "phaseNum": "5",
            "order": 5,
            "summary": "How Django turns data into HTML: where templates fit in MTV, the template language, the context dict, template inheritance for shared layout, and the auto-escaping that quietly blocks XSS.",
            "filePath": "/guides/frameworks/django-from-zero/05-templates-and-mtv.md"
          },
          {
            "slug": "06-forms-and-validation",
            "title": "Forms & Validation",
            "phaseNum": "6",
            "order": 6,
            "summary": "How data flows back into your app: a Form class declares fields, ModelForm builds one from a model, the GET/POST view pattern handles it, validation cleans it, and csrf_token keeps it safe.",
            "filePath": "/guides/frameworks/django-from-zero/06-forms-and-validation.md"
          },
          {
            "slug": "07-the-orm-deeper",
            "title": "The ORM, Deeper",
            "phaseNum": "7",
            "order": 7,
            "summary": "QuerySets are lazy and chainable, field lookups and Q/F give you real query power, and the N+1 trap quietly fires a query per row \u2014 until select_related and prefetch_related collapse it.",
            "filePath": "/guides/frameworks/django-from-zero/07-the-orm-deeper.md"
          },
          {
            "slug": "08-users-auth-and-sessions",
            "title": "Users, Auth & Sessions",
            "phaseNum": "8",
            "order": 8,
            "summary": "Django's batteries-included auth: the built-in User model and request.user, login/logout views, protecting views with login_required and permissions, and the session machinery that keeps a user logged in.",
            "filePath": "/guides/frameworks/django-from-zero/08-users-auth-and-sessions.md"
          },
          {
            "slug": "09-class-based-views-and-drf",
            "title": "Class-Based Views & Django REST Framework",
            "phaseNum": "9",
            "order": 9,
            "summary": "Views as classes with one method per HTTP verb, Django's ready-made generic views for standard CRUD, and Django REST Framework for building JSON APIs on top of the ORM you already have.",
            "filePath": "/guides/frameworks/django-from-zero/09-class-based-views-and-drf.md"
          },
          {
            "slug": "10-testing-and-project-structure",
            "title": "Testing & Project Structure",
            "phaseNum": "10",
            "order": 10,
            "summary": "Test Django for real \u2014 the TestCase test runner with its throwaway database, the in-process test Client for views, fixtures and setUpTestData, plus how to structure apps and keep settings (and secrets) sane.",
            "filePath": "/guides/frameworks/django-from-zero/10-testing-and-project-structure.md"
          },
          {
            "slug": "11-where-to-go-next",
            "title": "Production & Where to Go Next",
            "phaseNum": "11",
            "order": 11,
            "summary": "You can build a database-backed, admin-managed, authenticated Django app. Now deploy it with gunicorn behind nginx, serve static files for real, run the security checklist, and pick your next build.",
            "filePath": "/guides/frameworks/django-from-zero/11-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "pandas-from-zero",
        "title": "pandas From Zero",
        "summary": "Learn the Python data-analysis workhorse: the DataFrame mental model, loading and inspecting data, selecting and filtering, cleaning messy data, transforming with vectorized operations, the split-apply-combine power of groupby, joining datasets, time series, reshaping and pivoting, and plotting. The tool every Python data person reaches for, explained idea-first.",
        "order": 10,
        "phases": [
          {
            "slug": "01-what-pandas-is",
            "title": "What pandas Is & the DataFrame",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model that makes pandas click: a DataFrame is a spreadsheet or SQL table living in memory that you manipulate with code. Meet the Series, the DataFrame, the index, and the column-first habit.",
            "filePath": "/guides/frameworks/pandas-from-zero/01-what-pandas-is.md"
          },
          {
            "slug": "02-loading-and-inspecting-data",
            "title": "Loading & Inspecting Data",
            "phaseNum": "2",
            "order": 2,
            "summary": "How real analysis starts: read_csv (and read_excel/json/sql/parquet) to load data, then head/info/describe/value_counts to know exactly what you've got before you trust a single number.",
            "filePath": "/guides/frameworks/pandas-from-zero/02-loading-and-inspecting-data.md"
          },
          {
            "slug": "03-selecting-and-filtering",
            "title": "Selecting & Filtering",
            "phaseNum": "3",
            "order": 3,
            "summary": "Pull out the columns and rows you actually want: single vs double brackets, loc vs iloc, boolean masks, combining conditions safely, and query().",
            "filePath": "/guides/frameworks/pandas-from-zero/03-selecting-and-filtering.md"
          },
          {
            "slug": "04-cleaning-data",
            "title": "Cleaning Data",
            "phaseNum": "4",
            "order": 4,
            "summary": "Real data is messy. Find and handle missing values with isna/dropna/fillna, fix wrong types with astype and to_numeric/to_datetime, kill duplicates, rename columns, and scrub strings with the .str accessor.",
            "filePath": "/guides/frameworks/pandas-from-zero/04-cleaning-data.md"
          },
          {
            "slug": "05-transforming-data",
            "title": "Transforming Data",
            "phaseNum": "5",
            "order": 5,
            "summary": "Derive new columns the pandas way: vectorized arithmetic, np.where and pd.cut for conditionals, map and replace for translation, apply as the flexible escape hatch \u2014 and why looping over rows is the #1 performance mistake.",
            "filePath": "/guides/frameworks/pandas-from-zero/05-transforming-data.md"
          },
          {
            "slug": "06-groupby-and-aggregation",
            "title": "GroupBy & Aggregation",
            "phaseNum": "6",
            "order": 6,
            "summary": "The split-apply-combine pattern behind almost every analysis: group rows by a key, apply a function to each group, combine the results. Basic groupby, multiple keys, named agg, and transform vs aggregate.",
            "filePath": "/guides/frameworks/pandas-from-zero/06-groupby-and-aggregation.md"
          },
          {
            "slug": "07-joining-and-combining",
            "title": "Joining & Combining",
            "phaseNum": "7",
            "order": 7,
            "summary": "Stitch separate tables together: merge is the SQL join in DataFrame clothing (inner/left/right/outer), the key traps that explode your row count, and concat for stacking more of the same data.",
            "filePath": "/guides/frameworks/pandas-from-zero/07-joining-and-combining.md"
          },
          {
            "slug": "08-time-series",
            "title": "Time Series & Dates",
            "phaseNum": "8",
            "order": 8,
            "summary": "Turn date strings into real datetimes with to_datetime, pull date parts with the .dt accessor, slice by partial dates via a DatetimeIndex, and roll daily data up to any period with resample \u2014 groupby over time.",
            "filePath": "/guides/frameworks/pandas-from-zero/08-time-series.md"
          },
          {
            "slug": "09-reshaping-and-pivoting",
            "title": "Reshaping & Pivoting",
            "phaseNum": "9",
            "order": 9,
            "summary": "The same data wears two shapes \u2014 long (one row per observation) and wide (categories as columns). Reshape freely with pivot_table, melt, stack/unstack, and crosstab.",
            "filePath": "/guides/frameworks/pandas-from-zero/09-reshaping-and-pivoting.md"
          },
          {
            "slug": "10-plotting-and-where-next",
            "title": "Plotting & Where to Go Next",
            "phaseNum": "10",
            "order": 10,
            "summary": "Make quick charts straight off a DataFrame, write your results back out to any format, learn the vectorization and scaling limits honestly, and pick a real project to carry all the way home.",
            "filePath": "/guides/frameworks/pandas-from-zero/10-plotting-and-where-next.md"
          }
        ]
      },
      {
        "slug": "pytorch-from-zero",
        "title": "PyTorch From Zero",
        "summary": "Learn the deep-learning framework that runs modern AI: tensors and the GPU, autograd (automatic differentiation), building models with nn.Module, loss functions and optimizers, the training loop, Dataset/DataLoader, training a real classifier, saving and inference, performance pitfalls, and where to go. The three ideas under all of it \u2014 tensors, autograd, the loop \u2014 made plain.",
        "order": 11,
        "phases": [
          {
            "slug": "01-what-pytorch-is-and-tensors",
            "title": "What PyTorch Is & Tensors",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model that makes PyTorch click: a tensor is a NumPy array with two superpowers \u2014 it runs on a GPU and it tracks gradients. Meet tensors, how to make them, and shape, dtype, device.",
            "filePath": "/guides/frameworks/pytorch-from-zero/01-what-pytorch-is-and-tensors.md"
          },
          {
            "slug": "02-tensor-operations-and-gpu",
            "title": "Tensor Operations & the GPU",
            "phaseNum": "2",
            "order": 2,
            "summary": "Do real math on tensors: elementwise ops, matrix multiply (the heart of neural nets), broadcasting, reshaping and indexing, then move the whole thing onto a GPU with device-agnostic code.",
            "filePath": "/guides/frameworks/pytorch-from-zero/02-tensor-operations-and-gpu.md"
          },
          {
            "slug": "03-autograd",
            "title": "Autograd: Automatic Differentiation",
            "phaseNum": "3",
            "order": 3,
            "summary": "The conceptual heart of PyTorch: how requires_grad records your math into a computation graph and .backward() walks it in reverse to compute every gradient automatically \u2014 the engine that makes training possible.",
            "filePath": "/guides/frameworks/pytorch-from-zero/03-autograd.md"
          },
          {
            "slug": "04-building-models-with-nn-module",
            "title": "Building Models with nn.Module",
            "phaseNum": "4",
            "order": 4,
            "summary": "A model is a Python class: subclass nn.Module, define layers in __init__ and the forward pass in forward(). Covers nn.Linear, activations, nn.Sequential, and how parameters are tracked.",
            "filePath": "/guides/frameworks/pytorch-from-zero/04-building-models-with-nn-module.md"
          },
          {
            "slug": "05-loss-and-optimizers",
            "title": "Loss Functions & Optimizers",
            "phaseNum": "5",
            "order": 5,
            "summary": "How a model knows it's wrong and how it fixes itself: loss functions turn predictions vs. truth into one number, and optimizers (SGD, Adam) use the gradients to nudge the weights.",
            "filePath": "/guides/frameworks/pytorch-from-zero/05-loss-and-optimizers.md"
          },
          {
            "slug": "06-the-training-loop",
            "title": "The Training Loop",
            "phaseNum": "6",
            "order": 6,
            "summary": "The five-line ritual that trains every PyTorch model: forward, loss, zero_grad, backward, step, repeated over epochs and batches \u2014 why each line is there and what breaks without it.",
            "filePath": "/guides/frameworks/pytorch-from-zero/06-the-training-loop.md"
          },
          {
            "slug": "07-datasets-and-dataloaders",
            "title": "Data: Dataset & DataLoader",
            "phaseNum": "7",
            "order": 7,
            "summary": "How PyTorch feeds data to the training loop: Dataset knows how to fetch one sample, DataLoader batches, shuffles, and parallel-loads them. The plumbing that turns raw data into the batches your loop consumes.",
            "filePath": "/guides/frameworks/pytorch-from-zero/07-datasets-and-dataloaders.md"
          },
          {
            "slug": "08-training-a-classifier",
            "title": "Training a Real Classifier",
            "phaseNum": "8",
            "order": 8,
            "summary": "The payoff: assemble tensors, an nn.Module, a loss, an optimizer, the training loop, and DataLoaders into a working MNIST digit classifier \u2014 train it, evaluate it honestly, and read the results.",
            "filePath": "/guides/frameworks/pytorch-from-zero/08-training-a-classifier.md"
          },
          {
            "slug": "09-saving-loading-inference",
            "title": "Saving, Loading & Inference",
            "phaseNum": "9",
            "order": 9,
            "summary": "Save a trained model's state_dict, recreate the architecture and load it back, then run predictions correctly with eval() and no_grad() \u2014 turning raw logits into a labeled answer with confidence.",
            "filePath": "/guides/frameworks/pytorch-from-zero/09-saving-loading-inference.md"
          },
          {
            "slug": "10-gpus-performance-pitfalls",
            "title": "GPUs, Performance & Common Pitfalls",
            "phaseNum": "10",
            "order": 10,
            "summary": "A field guide to the PyTorch bugs that waste days \u2014 device mismatches, CUDA out-of-memory, silent training failures \u2014 plus how to keep the GPU fed and debug like a pro.",
            "filePath": "/guides/frameworks/pytorch-from-zero/10-gpus-performance-pitfalls.md"
          },
          {
            "slug": "11-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "11",
            "order": 11,
            "summary": "You can train and save a real classifier. Now skip training from scratch \u2014 fine-tune pretrained models, meet the ecosystem (Hugging Face, Lightning), see how LLMs are just PyTorch, and pick what to build.",
            "filePath": "/guides/frameworks/pytorch-from-zero/11-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "flask-from-zero",
        "title": "Flask From Zero",
        "summary": "Learn the Python micro-framework that teaches you what a framework's minimum really is: routing and views, Jinja2 templates, forms and request data, databases via Flask-SQLAlchemy, blueprints and the app-factory pattern, sessions and auth, building a JSON API, and testing and deployment. Small core, your choices on top.",
        "order": 12,
        "phases": [
          {
            "slug": "01-what-flask-is",
            "title": "What Flask Is & Your First App",
            "phaseNum": "1",
            "order": 1,
            "summary": "Flask is the micro-framework: a small core of routing, requests, and Jinja templates, with everything else left to extensions you choose. Install it, write a tiny app, run it, and meet decorator routing.",
            "filePath": "/guides/frameworks/flask-from-zero/01-what-flask-is.md"
          },
          {
            "slug": "02-routing-and-views",
            "title": "Routing & Views",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Flask turns a URL into a response: dynamic URL segments with converters, branching on HTTP methods, reading the request object, returning the right kind of response, and keeping views thin.",
            "filePath": "/guides/frameworks/flask-from-zero/02-routing-and-views.md"
          },
          {
            "slug": "03-templates-with-jinja",
            "title": "Templates with Jinja2",
            "phaseNum": "3",
            "order": 3,
            "summary": "How Flask turns data into HTML with Jinja2: rendering templates, the Jinja language, the context you pass, template inheritance for shared layout, and the auto-escaping that quietly blocks XSS.",
            "filePath": "/guides/frameworks/flask-from-zero/03-templates-with-jinja.md"
          },
          {
            "slug": "04-forms-and-request-data",
            "title": "Forms & Request Data",
            "phaseNum": "4",
            "order": 4,
            "summary": "Take in user-submitted data the right way: read raw form fields, apply the POST/redirect/GET pattern, validate and flash messages, then graduate to Flask-WTF for form classes, validators, and built-in CSRF protection.",
            "filePath": "/guides/frameworks/flask-from-zero/04-forms-and-request-data.md"
          },
          {
            "slug": "05-database-with-sqlalchemy",
            "title": "Working with a Database",
            "phaseNum": "5",
            "order": 5,
            "summary": "Flask ships no ORM \u2014 you add one. Wire in Flask-SQLAlchemy, define a Note model, do CRUD through the session, and watch Flask's add-an-extension philosophy work in the open.",
            "filePath": "/guides/frameworks/flask-from-zero/05-database-with-sqlalchemy.md"
          },
          {
            "slug": "06-blueprints-and-app-factory",
            "title": "Blueprints & the App Factory",
            "phaseNum": "6",
            "order": 6,
            "summary": "One app.py stops scaling. Flask's answer is blueprints (modular route groups) plus the app factory \u2014 a create_app() function that wires extensions and breaks the classic circular-import trap.",
            "filePath": "/guides/frameworks/flask-from-zero/06-blueprints-and-app-factory.md"
          },
          {
            "slug": "07-sessions-auth-and-extensions",
            "title": "Sessions, Auth & Extensions",
            "phaseNum": "7",
            "order": 7,
            "summary": "Flask's session is a signed cookie; real login is an extension you add. Wire Flask-Login into the notes app, protect note-creation with @login_required, and see the ecosystem that keeps Flask small.",
            "filePath": "/guides/frameworks/flask-from-zero/07-sessions-auth-and-extensions.md"
          },
          {
            "slug": "08-building-a-json-api",
            "title": "Building a JSON API with Flask",
            "phaseNum": "8",
            "order": 8,
            "summary": "Turn your notes app into a JSON API: return jsonify instead of templates, read request bodies, set status codes, serve JSON errors, and decide honestly when Flask fits versus FastAPI.",
            "filePath": "/guides/frameworks/flask-from-zero/08-building-a-json-api.md"
          },
          {
            "slug": "09-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "9",
            "order": 9,
            "summary": "Test your notes app in-process with Flask's test client and a pytest app-factory fixture, then ship it for real \u2014 behind gunicorn, not the dev server \u2014 with safe production config and a minimal Dockerfile.",
            "filePath": "/guides/frameworks/flask-from-zero/09-testing-and-production.md"
          },
          {
            "slug": "10-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "10",
            "order": 10,
            "summary": "You can build a structured, database-backed, authenticated, tested, deployable Flask app and a JSON API. Now meet the extension landscape, the async truth, an honest framework map, and what to build next.",
            "filePath": "/guides/frameworks/flask-from-zero/10-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "sqlalchemy-from-zero",
        "title": "SQLAlchemy From Zero",
        "summary": "Learn Python's premier database toolkit - the ORM under Flask-SQLAlchemy and SQLModel: Core vs ORM, the engine and connections, declarative models, the Session and unit of work, the modern select() query API, relationships, loading strategies and the N+1 trap, and Alembic migrations. The library those wrappers wrap, made plain.",
        "order": 13,
        "phases": [
          {
            "slug": "01-what-sqlalchemy-is",
            "title": "What SQLAlchemy Is (Core vs ORM)",
            "phaseNum": "1",
            "order": 1,
            "summary": "SQLAlchemy is Python's database toolkit, built in two layers: Core (a Pythonic SQL expression language) and the ORM (maps classes to tables) on top of it. Here's the mental model that makes everything else click.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/01-what-sqlalchemy-is.md"
          },
          {
            "slug": "02-the-engine-and-connecting",
            "title": "The Engine & Connecting",
            "phaseNum": "2",
            "order": 2,
            "summary": "Meet the Engine \u2014 SQLAlchemy's central source of DB connectivity and its connection pool. Connect, run raw SQL safely with text(), manage transactions with begin(), and read Result objects.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/02-the-engine-and-connecting.md"
          },
          {
            "slug": "03-defining-models",
            "title": "Defining Models",
            "phaseNum": "3",
            "order": 3,
            "summary": "Turn plain Python classes into database tables with SQLAlchemy 2.0 declarative models: DeclarativeBase, Mapped + mapped_column, column types and options, and create_all to build the schema.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/03-defining-models.md"
          },
          {
            "slug": "04-the-session-and-unit-of-work",
            "title": "The Session & Unit of Work",
            "phaseNum": "4",
            "order": 4,
            "summary": "The heart of the ORM: the Session is your handle to SQLAlchemy, an identity map and unit of work that batches changes, tracks dirty objects, and flushes them as one \u2014 with object states explaining every behavior.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/04-the-session-and-unit-of-work.md"
          },
          {
            "slug": "05-querying-with-select",
            "title": "Querying with select()",
            "phaseNum": "5",
            "order": 5,
            "summary": "Read data the SQLAlchemy 2.0 way: build a select() statement, execute it through the Session, pull objects with scalars/scalar/get, and filter, order, limit, and join \u2014 watching the SQL the whole time.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/05-querying-with-select.md"
          },
          {
            "slug": "06-relationships",
            "title": "Relationships",
            "phaseNum": "6",
            "order": 6,
            "summary": "Map foreign keys to navigable attributes with SQLAlchemy 2.0 relationship(): one-to-many with back_populates, many-to-many via an association table, the both-sides sync gotcha, and cascades.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/06-relationships.md"
          },
          {
            "slug": "07-loading-strategies-and-n-plus-1",
            "title": "Loading Strategies & the N+1 Trap",
            "phaseNum": "7",
            "order": 7,
            "summary": "Why a relationship() fires a query the moment you touch it, how that quietly becomes the N+1 disaster, the DetachedInstanceError it causes, and how selectinload and joinedload collapse the flood back to one or two queries.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/07-loading-strategies-and-n-plus-1.md"
          },
          {
            "slug": "08-migrations-with-alembic",
            "title": "Migrations with Alembic",
            "phaseNum": "8",
            "order": 8,
            "summary": "Why create_all can't evolve a live schema, and how Alembic gives you version-controlled migrations: init, autogenerate, review, upgrade, downgrade - the safe loop for changing tables that already hold data.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/08-migrations-with-alembic.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "SQLAlchemy in the Real World & Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "How SQLAlchemy actually shows up: as Flask-SQLAlchemy, as SQLModel, with async drivers, and beside raw SQL when the ORM gets awkward. Plus what to build next.",
            "filePath": "/guides/frameworks/sqlalchemy-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "wsgi-and-asgi-explained",
        "title": "WSGI & ASGI Explained",
        "summary": "Learn the protocol every Python web framework sits on: what WSGI is and the problem it solved, a bare WSGI app with no framework, WSGI servers and middleware, why ASGI exists for async, a bare ASGI app and its servers, and how Flask, Django, and FastAPI are all built on these contracts. The bottom layer, made visible.",
        "order": 14,
        "phases": [
          {
            "slug": "01-what-wsgi-is",
            "title": "What WSGI Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "WSGI is the standard contract between a Python web server and a Python web app - a callable taking (environ, start_response). Write to it once, run on any compliant server.",
            "filePath": "/guides/frameworks/wsgi-and-asgi-explained/01-what-wsgi-is.md"
          },
          {
            "slug": "02-a-wsgi-app-from-scratch",
            "title": "A WSGI App From Scratch",
            "phaseNum": "2",
            "order": 2,
            "summary": "Write a real web app in a dozen lines with no framework - a plain WSGI callable that reads the request from environ, routes by hand, and returns bytes - then see exactly what Flask adds on top.",
            "filePath": "/guides/frameworks/wsgi-and-asgi-explained/02-a-wsgi-app-from-scratch.md"
          },
          {
            "slug": "03-the-wsgi-server-and-middleware",
            "title": "The WSGI Server & Middleware",
            "phaseNum": "3",
            "order": 3,
            "summary": "The dev server isn't enough for production. gunicorn and friends import your WSGI app and run worker processes to serve it, and middleware is a WSGI app that wraps your WSGI app - the root of framework middleware.",
            "filePath": "/guides/frameworks/wsgi-and-asgi-explained/03-the-wsgi-server-and-middleware.md"
          },
          {
            "slug": "04-why-asgi-exists",
            "title": "Why ASGI Exists",
            "phaseNum": "4",
            "order": 4,
            "summary": "WSGI's synchronous worker blocks for a whole request and can't do websockets at all. ASGI fixes both with an async, event-based contract built for high I/O concurrency and long-lived connections.",
            "filePath": "/guides/frameworks/wsgi-and-asgi-explained/04-why-asgi-exists.md"
          },
          {
            "slug": "05-an-asgi-app-and-the-servers",
            "title": "An ASGI App & the Servers",
            "phaseNum": "5",
            "order": 5,
            "summary": "Write a bare ASGI app with scope/receive/send, read the request, run it under uvicorn, glimpse lifespan and websockets, then see FastAPI as ergonomics over this exact machinery.",
            "filePath": "/guides/frameworks/wsgi-and-asgi-explained/05-an-asgi-app-and-the-servers.md"
          },
          {
            "slug": "06-from-protocol-to-framework",
            "title": "From Protocol to Framework",
            "phaseNum": "6",
            "order": 6,
            "summary": "The payoff: see the WSGI or ASGI callable under every Python web framework. Flask, Django, FastAPI, routing, request objects, middleware, and the deploy story all map back to one small contract.",
            "filePath": "/guides/frameworks/wsgi-and-asgi-explained/06-from-protocol-to-framework.md"
          }
        ]
      },
      {
        "slug": "celery-from-zero",
        "title": "Celery From Zero",
        "summary": "Learn the distributed task queue that runs background work for Python web apps: the broker/worker/result model, defining and calling tasks, results and state, retries and error handling, scheduled tasks with Celery Beat, and production scaling, monitoring, and the pitfalls. Move slow work off the request and run it reliably.",
        "order": 15,
        "phases": [
          {
            "slug": "01-what-celery-is",
            "title": "What Celery Is & Why",
            "phaseNum": "1",
            "order": 1,
            "summary": "Some work is too slow to do inside a web request. Celery moves it to the background: you define tasks, your app enqueues them, and separate worker processes run them through a broker.",
            "filePath": "/guides/frameworks/celery-from-zero/01-what-celery-is.md"
          },
          {
            "slug": "02-the-broker-and-worker",
            "title": "The Broker & Worker",
            "phaseNum": "2",
            "order": 2,
            "summary": "Meet the two processes that make Celery work: the broker (a Redis or RabbitMQ queue holding pending task messages) and the worker (a separate process that drains the queue and runs tasks).",
            "filePath": "/guides/frameworks/celery-from-zero/02-the-broker-and-worker.md"
          },
          {
            "slug": "03-defining-and-calling-tasks",
            "title": "Defining & Calling Tasks",
            "phaseNum": "3",
            "order": 3,
            "summary": "How to register a function as a Celery task, send it to the worker with .delay() and .apply_async(), and why arguments must be serializable simple data.",
            "filePath": "/guides/frameworks/celery-from-zero/03-defining-and-calling-tasks.md"
          },
          {
            "slug": "04-results-and-state",
            "title": "Results & State",
            "phaseNum": "4",
            "order": 4,
            "summary": "How Celery stores task return values and status in a result backend, how to query them with AsyncResult, what the task states mean, and when you actually need results at all.",
            "filePath": "/guides/frameworks/celery-from-zero/04-results-and-state.md"
          },
          {
            "slug": "05-retries-and-error-handling",
            "title": "Retries & Error Handling",
            "phaseNum": "5",
            "order": 5,
            "summary": "Why background tasks fail, how to retry transient errors with backoff, why retried tasks must be idempotent, the acks_late trade-off, and how to surface permanent failures.",
            "filePath": "/guides/frameworks/celery-from-zero/05-retries-and-error-handling.md"
          },
          {
            "slug": "06-scheduled-tasks-celery-beat",
            "title": "Scheduled Tasks with Celery Beat",
            "phaseNum": "6",
            "order": 6,
            "summary": "Run Celery tasks on a timetable with Celery Beat \u2014 a scheduler that enqueues jobs on intervals or crontab schedules, while your normal workers do the actual work.",
            "filePath": "/guides/frameworks/celery-from-zero/06-scheduled-tasks-celery-beat.md"
          },
          {
            "slug": "07-production-scaling-monitoring",
            "title": "Production: Scaling, Monitoring & Pitfalls",
            "phaseNum": "7",
            "order": 7,
            "summary": "Scaling Celery with more workers and dedicated queues, seeing your tasks with Flower and metrics, a pitfall cheat-card, worker reliability knobs, and the deployment shape that makes Celery rock-solid.",
            "filePath": "/guides/frameworks/celery-from-zero/07-production-scaling-monitoring.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "You can define, call, retry, schedule, scale, and monitor background tasks. Now plug Celery into your web framework, compose tasks with canvas, weigh the alternatives honestly, and build something real.",
            "filePath": "/guides/frameworks/celery-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "gin-from-zero",
        "title": "Gin From Zero",
        "summary": "Learn Go's most popular web framework: the engine and your first server, routing and route groups, binding and validating JSON, responses and rendering, middleware, building a full REST API, error handling and project structure, and testing and production. A thin, fast layer over net/http that you'll meet in most Go web jobs.",
        "order": 16,
        "phases": [
          {
            "slug": "01-what-gin-is",
            "title": "What Gin Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "Gin is a thin, fast layer over net/http: an engine holds your routes and a context handles each request. Install it, write a tiny server, run it, and meet the engine and context.",
            "filePath": "/guides/frameworks/gin-from-zero/01-what-gin-is.md"
          },
          {
            "slug": "02-routing-and-groups",
            "title": "Routing & Route Groups",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Gin matches a request to a handler: HTTP methods, path and query params, wildcards, and route groups for versioning and shared prefixes \u2014 built on the tasks API.",
            "filePath": "/guides/frameworks/gin-from-zero/02-routing-and-groups.md"
          },
          {
            "slug": "03-binding-and-validation",
            "title": "Binding & Validating Input",
            "phaseNum": "3",
            "order": 3,
            "summary": "Decode JSON, query strings, and URI params straight onto typed Go structs and validate them in one step with ShouldBind* and struct tags, so handlers stop poking at raw request data.",
            "filePath": "/guides/frameworks/gin-from-zero/03-binding-and-validation.md"
          },
          {
            "slug": "04-responses-and-rendering",
            "title": "Responses & Rendering",
            "phaseNum": "4",
            "order": 4,
            "summary": "Pick one render helper and one status code to answer a request: c.JSON for APIs, plus String, Data, File, and Redirect, HTML templates with auto-escaping, and serving static files.",
            "filePath": "/guides/frameworks/gin-from-zero/04-responses-and-rendering.md"
          },
          {
            "slug": "05-middleware",
            "title": "Middleware",
            "phaseNum": "5",
            "order": 5,
            "summary": "Middleware is a handler that runs around your handlers. Learn c.Next(), c.Abort(), passing data with c.Set/c.Get, the built-in Logger and Recovery, and writing your own.",
            "filePath": "/guides/frameworks/gin-from-zero/05-middleware.md"
          },
          {
            "slug": "06-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "6",
            "order": 6,
            "summary": "Assemble routing, binding, and responses into full CRUD for the tasks resource: an in-memory store guarded by a mutex, five handlers over one collection, wired to a versioned route group.",
            "filePath": "/guides/frameworks/gin-from-zero/06-building-a-rest-api.md"
          },
          {
            "slug": "07-errors-and-structure",
            "title": "Error Handling & Project Structure",
            "phaseNum": "7",
            "order": 7,
            "summary": "Make handlers thin translators between HTTP and your domain, return one consistent JSON error shape with c.Error and a middleware, map sentinel errors to status codes, and split the single-file tasks app into packages.",
            "filePath": "/guides/frameworks/gin-from-zero/07-errors-and-structure.md"
          },
          {
            "slug": "08-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "8",
            "order": 8,
            "summary": "Test a Gin app in-memory with net/http/httptest (no ports), structure it as a setupRouter() you build in main and tests, then ship it with ReleaseMode, real timeouts, and graceful shutdown.",
            "filePath": "/guides/frameworks/gin-from-zero/08-testing-and-production.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "You can build, structure, test, and ship a real Gin REST API. Now the honest map: Gin vs Echo, chi, Fiber, and net/http, the database layer, and what to build.",
            "filePath": "/guides/frameworks/gin-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "echo-from-zero",
        "title": "Echo From Zero",
        "summary": "Learn Echo, the high-performance Go web framework: the instance and your first server, routing and groups, binding and validation, responses and rendering, middleware, a full REST API with centralized error handling, and testing and production. A clean, batteries-included alternative to Gin you'll find across Go shops.",
        "order": 17,
        "phases": [
          {
            "slug": "01-what-echo-is",
            "title": "What Echo Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "Echo is a fast Go web framework over net/http where handlers return errors and a central handler renders them. Install it, write a tiny server, run it, and meet the instance and context.",
            "filePath": "/guides/frameworks/echo-from-zero/01-what-echo-is.md"
          },
          {
            "slug": "02-routing-and-groups",
            "title": "Routing & Groups",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Echo matches requests: methods and paths to handlers, path and query params via the context, and route groups that share a prefix and middleware.",
            "filePath": "/guides/frameworks/echo-from-zero/02-routing-and-groups.md"
          },
          {
            "slug": "03-binding-and-validation",
            "title": "Binding & Validation",
            "phaseNum": "3",
            "order": 3,
            "summary": "Decode request bodies into structs with c.Bind, then check them with a validator you wire up yourself \u2014 Echo keeps binding and validation as two deliberate, separate steps.",
            "filePath": "/guides/frameworks/echo-from-zero/03-binding-and-validation.md"
          },
          {
            "slug": "04-responses-and-rendering",
            "title": "Responses & Rendering",
            "phaseNum": "4",
            "order": 4,
            "summary": "How Echo sends data back: every response helper returns an error you return \u2014 JSON with status codes, String/Blob/File/Redirect/NoContent, HTML templates via a Renderer, and serving static files.",
            "filePath": "/guides/frameworks/echo-from-zero/04-responses-and-rendering.md"
          },
          {
            "slug": "05-middleware",
            "title": "Middleware",
            "phaseNum": "5",
            "order": 5,
            "summary": "Middleware in Echo wraps a handler \u2014 func(next) handler \u2014 and the chain runs around your handler while the error flows back out. Built-ins, scopes, and a real auth middleware.",
            "filePath": "/guides/frameworks/echo-from-zero/05-middleware.md"
          },
          {
            "slug": "06-rest-api-and-errors",
            "title": "A REST API with Error Handling",
            "phaseNum": "6",
            "order": 6,
            "summary": "Build full CRUD for the books API \u2014 five handlers over one collection \u2014 and wire Echo's centralized HTTPErrorHandler so every failure path returns one consistent JSON error shape.",
            "filePath": "/guides/frameworks/echo-from-zero/06-rest-api-and-errors.md"
          },
          {
            "slug": "07-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "7",
            "order": 7,
            "summary": "Test Echo in-memory with net/http/httptest (no ports) using NewContext or ServeHTTP, then ship it: HideBanner/HidePort, real server timeouts, graceful shutdown, and a static-binary container behind a proxy.",
            "filePath": "/guides/frameworks/echo-from-zero/07-testing-and-production.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "Look at the real REST API you can now build with Echo, then the honest map: Echo vs Gin, chi, and net/http, the database layer you'll add next, and one thing to build.",
            "filePath": "/guides/frameworks/echo-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "chi-from-zero",
        "title": "chi From Zero",
        "summary": "Learn chi, the lightweight idiomatic Go router: why it stays compatible with net/http, routing and URL params, sub-routers, the stdlib-style middleware stack, reading and writing requests with the standard library, building a REST API, and structuring and testing it. The framework that's barely a framework \u2014 and the clearest bridge to plain net/http.",
        "order": 18,
        "phases": [
          {
            "slug": "01-what-chi-is",
            "title": "What chi Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "chi is a lightweight idiomatic Go router that stays 100% compatible with net/http: handlers and middleware are plain stdlib types. Install it, write a tiny server, and meet the philosophy.",
            "filePath": "/guides/frameworks/chi-from-zero/01-what-chi-is.md"
          },
          {
            "slug": "02-routing-and-subrouters",
            "title": "Routing, URL Params & Sub-routers",
            "phaseNum": "2",
            "order": 2,
            "summary": "How chi maps method plus pattern to plain http.HandlerFuncs, reads URL params with chi.URLParam, and groups related routes with Route, Mount, and nested sub-routers.",
            "filePath": "/guides/frameworks/chi-from-zero/02-routing-and-subrouters.md"
          },
          {
            "slug": "03-middleware",
            "title": "Middleware the Standard Way",
            "phaseNum": "3",
            "order": 3,
            "summary": "Middleware in chi is plain net/http: a func(http.Handler) http.Handler that wraps the next handler. Learn to write one, register with Use and With, use chi's built-ins, and pass data via context.",
            "filePath": "/guides/frameworks/chi-from-zero/03-middleware.md"
          },
          {
            "slug": "04-requests-and-responses",
            "title": "Requests & Responses with the Standard Library",
            "phaseNum": "4",
            "order": 4,
            "summary": "chi gives you a router and nothing else for I/O \u2014 so you read JSON with encoding/json, write it with a tiny helper, and set headers, status, and body in the right order.",
            "filePath": "/guides/frameworks/chi-from-zero/04-requests-and-responses.md"
          },
          {
            "slug": "05-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "5",
            "order": 5,
            "summary": "Assemble routing, middleware, and stdlib JSON I/O into full CRUD for the articles resource \u2014 five plain http.HandlerFuncs over a mutex-guarded in-memory store, mounted on a chi sub-router.",
            "filePath": "/guides/frameworks/chi-from-zero/05-building-a-rest-api.md"
          },
          {
            "slug": "06-structure-and-testing",
            "title": "Structuring & Testing",
            "phaseNum": "6",
            "order": 6,
            "summary": "Grow the articles API into packages with a dependency-holding Handler struct, pass request-scoped values through context safely, and test the whole router with net/http/httptest.",
            "filePath": "/guides/frameworks/chi-from-zero/06-structure-and-testing.md"
          },
          {
            "slug": "07-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "7",
            "order": 7,
            "summary": "Look at what you can build now, see honestly where chi sits next to Gin, Echo, and the improved Go 1.22 net/http mux, add a real database, and take the articles API home.",
            "filePath": "/guides/frameworks/chi-from-zero/07-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "gorm-from-zero",
        "title": "GORM From Zero",
        "summary": "Learn Go's most popular ORM: connecting and the model, auto-migration, create and read, querying, update and delete with soft deletes, associations, preloading and the N+1 trap, transactions and hooks and real migrations. The data layer most Go web services use, made plain \u2014 including where to drop back to SQL.",
        "order": 19,
        "phases": [
          {
            "slug": "01-what-gorm-is",
            "title": "What GORM Is & Connecting",
            "phaseNum": "1",
            "order": 1,
            "summary": "GORM is Go's de-facto ORM: structs become tables and *gorm.DB is the query you chain. Open a SQLite connection, turn on the SQL logger, and meet the blog schema.",
            "filePath": "/guides/frameworks/gorm-from-zero/01-what-gorm-is.md"
          },
          {
            "slug": "02-models-and-migration",
            "title": "Models & Auto-Migration",
            "phaseNum": "2",
            "order": 2,
            "summary": "Define tables as Go structs, shape columns with struct tags, embed gorm.Model for ID and timestamps, and let AutoMigrate make the database match your code.",
            "filePath": "/guides/frameworks/gorm-from-zero/02-models-and-migration.md"
          },
          {
            "slug": "03-create-and-read",
            "title": "Create & Read",
            "phaseNum": "3",
            "order": 3,
            "summary": "Insert rows with Create and read them back with the four finders \u2014 First, Take, Last, and Find \u2014 plus the ErrRecordNotFound pattern and why parameterized placeholders keep you safe.",
            "filePath": "/guides/frameworks/gorm-from-zero/03-create-and-read.md"
          },
          {
            "slug": "04-querying",
            "title": "Querying",
            "phaseNum": "4",
            "order": 4,
            "summary": "Build real queries with GORM: Where in all its forms, the struct-vs-map zero-value trap, Order/Limit/Offset for pagination, Select and Count, and reusable scopes \u2014 always watching the SQL.",
            "filePath": "/guides/frameworks/gorm-from-zero/04-querying.md"
          },
          {
            "slug": "05-update-and-delete",
            "title": "Update & Delete",
            "phaseNum": "5",
            "order": 5,
            "summary": "Updating rows with Update/Updates/Save, the struct zero-value trap (and the map fix), bulk updates with the global-update block, and soft vs hard deletes with Unscoped.",
            "filePath": "/guides/frameworks/gorm-from-zero/05-update-and-delete.md"
          },
          {
            "slug": "06-associations",
            "title": "Associations",
            "phaseNum": "6",
            "order": 6,
            "summary": "Wire tables together with GORM: belongs-to, has-many, has-one, and many-to-many. See the foreign keys AutoMigrate builds, create nested records, and manage relations with association mode.",
            "filePath": "/guides/frameworks/gorm-from-zero/06-associations.md"
          },
          {
            "slug": "07-preloading-and-n-plus-1",
            "title": "Preloading & the N+1 Trap",
            "phaseNum": "7",
            "order": 7,
            "summary": "GORM never lazy-loads associations, so Posts comes back empty until you ask. Learn Preload's two-query pattern, the N+1 explosion that bites everyone, nested loads, and Joins vs Preload.",
            "filePath": "/guides/frameworks/gorm-from-zero/07-preloading-and-n-plus-1.md"
          },
          {
            "slug": "08-transactions-hooks-migrations",
            "title": "Transactions, Hooks & Migrations",
            "phaseNum": "8",
            "order": 8,
            "summary": "Make several writes all-or-nothing with transactions, run your code around DB ops with lifecycle hooks, and version your schema with real migrations instead of leaning on AutoMigrate.",
            "filePath": "/guides/frameworks/gorm-from-zero/08-transactions-hooks-migrations.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "GORM in the Real World & Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "Where GORM lands in real Go services: dropping to raw SQL when it helps, GORM vs sqlc/sqlx/ent, the caveats that bite everyone, production pool and context tips, and what to build next.",
            "filePath": "/guides/frameworks/gorm-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "web-services-with-only-net-http",
        "title": "Web Services With Only net/http",
        "summary": "Build real Go web services using nothing but the standard library: the Handler/ServeMux/Server mental model, routing by hand, reading requests and writing JSON, middleware as plain wrappers, a full JSON REST API with no framework, project structure with context and graceful shutdown, and exactly what Gin/Echo/chi add on top. The foundation every Go framework is built on.",
        "order": 20,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The net/http Mental Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "The whole net/http architecture in three types - Handler, ServeMux, Server (plus the HandlerFunc adapter) - and the one mental model that ties them together: the mux routes a request to a handler, the handler writes the response.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/01-the-mental-model.md"
          },
          {
            "slug": "02-handlers-and-routing",
            "title": "Handlers & Routing by Hand",
            "phaseNum": "2",
            "order": 2,
            "summary": "Map URL patterns to handlers with HandlerFunc and the Go 1.22 method+path router - GET/POST/{id} patterns, r.PathValue, the old switch-on-method way, subtrees, and conflict panics.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/02-handlers-and-routing.md"
          },
          {
            "slug": "03-requests-and-json",
            "title": "Reading Requests, Writing JSON",
            "phaseNum": "3",
            "order": 3,
            "summary": "Pull data out of a request with PathValue, query, headers, and JSON body decoding, then write JSON back in the right header-status-body order \u2014 including the superfluous-WriteHeader trap and validation by hand.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/03-requests-and-json.md"
          },
          {
            "slug": "04-middleware-is-a-wrapper",
            "title": "Middleware Is Just a Wrapper",
            "phaseNum": "4",
            "order": 4,
            "summary": "Middleware in net/http is a function that takes an http.Handler and returns a new one. Build logging and auth middleware, chain them by wrapping, and pass data down with context.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/04-middleware-is-a-wrapper.md"
          },
          {
            "slug": "05-rest-api-no-framework",
            "title": "A JSON REST API With No Framework",
            "phaseNum": "5",
            "order": 5,
            "summary": "Assemble routing, JSON I/O, and middleware into a full CRUD messages API on the Go 1.22 mux - five handlers over one in-memory store, mutex-guarded, no framework anywhere.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/05-rest-api-no-framework.md"
          },
          {
            "slug": "06-structure-and-shutdown",
            "title": "Structure, Context & Graceful Shutdown",
            "phaseNum": "6",
            "order": 6,
            "summary": "Wire dependencies onto a struct with handler methods and a routes() seam, carry cancellation and request-scoped values through context, harden http.Server with timeouts, and shut down cleanly by draining in-flight requests.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/06-structure-and-shutdown.md"
          },
          {
            "slug": "07-what-frameworks-add",
            "title": "What the Frameworks Add",
            "phaseNum": "7",
            "order": 7,
            "summary": "Map Gin, Echo, and chi back onto the net/http you just built - router, context, middleware, binding - and decide honestly whether you even need a framework now that the stdlib mux does method+path routing.",
            "filePath": "/guides/frameworks/web-services-with-only-net-http/07-what-frameworks-add.md"
          }
        ]
      },
      {
        "slug": "extjs-from-zero",
        "title": "Ext JS From Zero",
        "summary": "Learn the config-driven enterprise JavaScript framework that thousands of internal apps still run on \u2014 and that almost nobody documents well: the class system, components and the containment tree, layouts, the data package (Model/Store/proxy/reader), the Grid and forms, MVVM with ViewControllers and ViewModels and binding, and Sencha Cmd. The magic, made explainable \u2014 especially if you got thrown into a legacy Ext JS codebase with no map.",
        "order": 21,
        "phases": [
          {
            "slug": "01-what-extjs-is",
            "title": "What Ext JS Even Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Ext JS describes a UI as a tree of config objects and the framework builds it. Meet components, containment, xtype, the Classic vs Modern toolkits, and why it feels nothing like React.",
            "filePath": "/guides/frameworks/extjs-from-zero/01-what-extjs-is.md"
          },
          {
            "slug": "02-the-class-system",
            "title": "The Class System",
            "phaseNum": "2",
            "order": 2,
            "summary": "Ext JS has its own class system, built before ES2015. Learn Ext.define, extend and callParent, the config-block getters/setters, xtype vs Ext.create, requires, and mixins.",
            "filePath": "/guides/frameworks/extjs-from-zero/02-the-class-system.md"
          },
          {
            "slug": "03-components-and-containers",
            "title": "Components & the Containment Tree",
            "phaseNum": "3",
            "order": 3,
            "summary": "Every visible thing in Ext JS is a component, components nest inside containers via items, and you find them by reference and component query \u2014 never by global id.",
            "filePath": "/guides/frameworks/extjs-from-zero/03-components-and-containers.md"
          },
          {
            "slug": "04-layouts",
            "title": "Layouts: How Things Get Positioned",
            "phaseNum": "4",
            "order": 4,
            "summary": "In Ext JS the parent container's layout sizes and positions its children \u2014 not CSS. Meet fit, hbox/vbox, border, and card, and learn why 'nothing shows up' is a layout bug.",
            "filePath": "/guides/frameworks/extjs-from-zero/04-layouts.md"
          },
          {
            "slug": "05-the-data-package",
            "title": "The Data Package",
            "phaseNum": "5",
            "order": 5,
            "summary": "How server data reaches the screen in Ext JS: Model defines a record's shape, Store holds the collection, a proxy fetches and saves it, and a reader parses the response.",
            "filePath": "/guides/frameworks/extjs-from-zero/05-the-data-package.md"
          },
          {
            "slug": "06-the-grid-and-forms",
            "title": "The Grid & Forms",
            "phaseNum": "6",
            "order": 6,
            "summary": "The Grid is a store rendered as rows; the form is fields over one record. Build a users grid with columns and renderers, add editing plugins and paging, then wire a form to edit the selected row.",
            "filePath": "/guides/frameworks/extjs-from-zero/06-the-grid-and-forms.md"
          },
          {
            "slug": "07-mvvm-and-binding",
            "title": "MVVM: ViewControllers, ViewModels & Binding",
            "phaseNum": "7",
            "order": 7,
            "summary": "Modern Ext JS splits a view into a ViewController (its behavior), a ViewModel (its data), and bind (the wire between them) \u2014 plus formulas and the legacy MVC controllers you'll still meet in old code.",
            "filePath": "/guides/frameworks/extjs-from-zero/07-mvvm-and-binding.md"
          },
          {
            "slug": "08-sencha-cmd-and-survival",
            "title": "Sencha Cmd, Theming & Surviving a Legacy Codebase",
            "phaseNum": "8",
            "order": 8,
            "summary": "The build tool that confuses everyone (Sencha Cmd + app.json), SASS theming in a sentence, a practical survival kit for legacy Ext JS, an honest look at where the framework sits, and where to go next.",
            "filePath": "/guides/frameworks/extjs-from-zero/08-sencha-cmd-and-survival.md"
          }
        ]
      },
      {
        "slug": "axum-from-zero",
        "title": "axum From Zero",
        "summary": "Learn the Tokio team's Rust web framework \u2014 the one this very platform runs on: the router and your first server, routing and extractors, handlers and IntoResponse, shared state, middleware with Tower, a full REST API, error handling that uses Rust's type system, and testing and production. Built on hyper and tower, ergonomic without macros.",
        "order": 22,
        "phases": [
          {
            "slug": "01-what-axum-is",
            "title": "What axum Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "axum maps paths to plain async fn handlers and turns their return values into responses \u2014 no macros. Install it, write a first server on Tokio, run it, and meet the Router and the books API.",
            "filePath": "/guides/frameworks/axum-from-zero/01-what-axum-is.md"
          },
          {
            "slug": "02-routing-and-extractors",
            "title": "Routing & Extractors",
            "phaseNum": "2",
            "order": 2,
            "summary": "Routes are method + path \u2192 handler, and a handler's parameters are extractors that pull typed data from the request. Path, Query, and nesting routers for versioned APIs.",
            "filePath": "/guides/frameworks/axum-from-zero/02-routing-and-extractors.md"
          },
          {
            "slug": "03-handlers-and-intoresponse",
            "title": "Handlers & IntoResponse",
            "phaseNum": "3",
            "order": 3,
            "summary": "How axum handlers really work: arguments extract from the request, the return value becomes the response. Json in and out, IntoResponse, status codes, and reading the trait-bound error.",
            "filePath": "/guides/frameworks/axum-from-zero/03-handlers-and-intoresponse.md"
          },
          {
            "slug": "04-shared-state",
            "title": "Shared State",
            "phaseNum": "4",
            "order": 4,
            "summary": "How axum hands shared dependencies \u2014 a store, a config, a database pool \u2014 to stateless handlers via State<T> and with_state, why the state type must be Clone, and why mutable data lives behind Arc<Mutex>.",
            "filePath": "/guides/frameworks/axum-from-zero/04-shared-state.md"
          },
          {
            "slug": "05-middleware-and-tower",
            "title": "Middleware with Tower",
            "phaseNum": "5",
            "order": 5,
            "summary": "Middleware in axum is a tower Layer wrapping your whole service. Add ready-made tower-http layers, stack them with ServiceBuilder, write custom middleware with from_fn, and master layer ordering.",
            "filePath": "/guides/frameworks/axum-from-zero/05-middleware-and-tower.md"
          },
          {
            "slug": "06-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "6",
            "order": 6,
            "summary": "Wire the books API into full CRUD \u2014 five async handlers over one shared store, each composing State, Path, and Json, returning status codes and JSON through IntoResponse.",
            "filePath": "/guides/frameworks/axum-from-zero/06-building-a-rest-api.md"
          },
          {
            "slug": "07-error-handling",
            "title": "Error Handling",
            "phaseNum": "7",
            "order": 7,
            "summary": "A custom AppError type that implements IntoResponse turns errors into return values: handlers return Result, the ? operator propagates and converts them, and From impls fold foreign errors into one JSON shape.",
            "filePath": "/guides/frameworks/axum-from-zero/07-error-handling.md"
          },
          {
            "slug": "08-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "8",
            "order": 8,
            "summary": "Test an axum app in memory with tower's oneshot (no ports), structure it as a fn app() shared by main and tests, then ship it with graceful shutdown, a distroless container, env config, and real tracing logs.",
            "filePath": "/guides/frameworks/axum-from-zero/08-testing-and-production.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "You can build, layer, test, and ship a real axum API. Now the honest map: axum vs actix/Rocket, the data layer (sqlx/SeaORM/Diesel), the tokio/hyper/tower roots, and what to build.",
            "filePath": "/guides/frameworks/axum-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "actix-web-from-zero",
        "title": "actix-web From Zero",
        "summary": "Learn one of the fastest Rust web frameworks: the App and HttpServer, routing and extractors, responders, shared state with web::Data, middleware, a full REST API with the ResponseError trait, and testing and production. Mature, batteries-included, and a perennial benchmark leader.",
        "order": 23,
        "phases": [
          {
            "slug": "01-what-actix-web-is",
            "title": "What actix-web Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "actix-web runs your routes across worker threads: an App holds them, an HttpServer runs copies of it, and a handler is an async fn returning a Responder. Install it, write a first server, run it.",
            "filePath": "/guides/frameworks/actix-web-from-zero/01-what-actix-web-is.md"
          },
          {
            "slug": "02-routing-and-extractors",
            "title": "Routing & Extractors",
            "phaseNum": "2",
            "order": 2,
            "summary": "How actix-web matches a request to a handler: routes as method + path, builder vs attribute-macro registration, web::scope for versioning, and the Path/Query/Json extractors that turn a request into typed handler arguments.",
            "filePath": "/guides/frameworks/actix-web-from-zero/02-routing-and-extractors.md"
          },
          {
            "slug": "03-responders",
            "title": "Responders",
            "phaseNum": "3",
            "order": 3,
            "summary": "How handlers turn into HTTP responses: the Responder trait, the HttpResponse builder for status control, web::Json shorthand, the different-branches type trap, and when to reach for impl Responder.",
            "filePath": "/guides/frameworks/actix-web-from-zero/03-responders.md"
          },
          {
            "slug": "04-shared-state",
            "title": "Shared State with web::Data",
            "phaseNum": "4",
            "order": 4,
            "summary": "How handlers share a database pool or in-memory store via web::Data \u2014 and the per-worker closure trap that hands each worker its own copy unless you build state once and clone it in.",
            "filePath": "/guides/frameworks/actix-web-from-zero/04-shared-state.md"
          },
          {
            "slug": "05-middleware",
            "title": "Middleware",
            "phaseNum": "5",
            "order": 5,
            "summary": "Middleware wraps your service. Attach it with .wrap(), reach for built-ins like Logger and Compress, master the wrap-order rule, and write your own with from_fn.",
            "filePath": "/guides/frameworks/actix-web-from-zero/05-middleware.md"
          },
          {
            "slug": "06-rest-api-and-errors",
            "title": "A REST API with Error Handling",
            "phaseNum": "6",
            "order": 6,
            "summary": "Build full CRUD over the shared web::Data store, then meet actix's idiomatic error story \u2014 the ResponseError trait \u2014 so every handler returns Result and varies status without juggling response types.",
            "filePath": "/guides/frameworks/actix-web-from-zero/06-rest-api-and-errors.md"
          },
          {
            "slug": "07-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "7",
            "order": 7,
            "summary": "Test an actix-web app in memory with actix_web::test (no ports), share routes between main and tests via .configure(), then ship it with workers, built-in graceful shutdown, and env config.",
            "filePath": "/guides/frameworks/actix-web-from-zero/07-testing-and-production.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "You can build, test, and ship a real actix-web API. Now the honest map: actix-web vs axum/Rocket, the data layer (sqlx/SeaORM/Diesel), the Tokio roots, and what to build.",
            "filePath": "/guides/frameworks/actix-web-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "rocket-from-zero",
        "title": "Rocket From Zero",
        "summary": "Learn Rust's most ergonomic web framework: attribute-route handlers and launch, dynamic paths, request guards and data, responders, managed state and fairings, a full REST API with error catchers, and testing and config. The framework that makes Rust web code read almost like Flask \u2014 powered by macros.",
        "order": 24,
        "phases": [
          {
            "slug": "01-what-rocket-is",
            "title": "What Rocket Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "Rocket is Rust's ergonomic web framework: write an attribute over a function and you have a route. Install it, write a tiny server, run it, and meet the macros that wire everything together.",
            "filePath": "/guides/frameworks/rocket-from-zero/01-what-rocket-is.md"
          },
          {
            "slug": "02-routing-and-paths",
            "title": "Routing & Dynamic Paths",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Rocket maps URLs to functions: method attributes, dynamic path segments with FromParam, multi-segment PathBuf, optional query params, and why a route must live in routes! to ever run.",
            "filePath": "/guides/frameworks/rocket-from-zero/02-routing-and-paths.md"
          },
          {
            "slug": "03-guards-and-data",
            "title": "Request Guards & Data",
            "phaseNum": "3",
            "order": 3,
            "summary": "How a handler reads the request body with Json and Form, and how request guards turn auth into a type in your function signature \u2014 checked before the handler ever runs.",
            "filePath": "/guides/frameworks/rocket-from-zero/03-guards-and-data.md"
          },
          {
            "slug": "04-responders",
            "title": "Responders",
            "phaseNum": "4",
            "order": 4,
            "summary": "Your handler's return type IS the HTTP response. Learn Rocket's built-in responders \u2014 Json, Option for free 404s, Result, (Status, T) \u2014 and how to build your own.",
            "filePath": "/guides/frameworks/rocket-from-zero/04-responders.md"
          },
          {
            "slug": "05-state-and-fairings",
            "title": "Managed State & Fairings",
            "phaseNum": "5",
            "order": 5,
            "summary": "Share dependencies across handlers with managed state and the &State<T> guard, then hook into the whole request/response lifecycle with fairings \u2014 Rocket's middleware.",
            "filePath": "/guides/frameworks/rocket-from-zero/05-state-and-fairings.md"
          },
          {
            "slug": "06-rest-api-and-catchers",
            "title": "A REST API with Error Catchers",
            "phaseNum": "6",
            "order": 6,
            "summary": "Wire five attribute-routed handlers over managed state into a full CRUD books API, then add #[catch(404)] error catchers for a consistent JSON error shape across the whole service.",
            "filePath": "/guides/frameworks/rocket-from-zero/06-rest-api-and-catchers.md"
          },
          {
            "slug": "07-testing-and-config",
            "title": "Testing & Configuration",
            "phaseNum": "7",
            "order": 7,
            "summary": "Test your Rocket books API in-process with the local Client \u2014 no ports, no network \u2014 then configure it with Rocket.toml profiles and ROCKET_* env vars, and harden it for production.",
            "filePath": "/guides/frameworks/rocket-from-zero/07-testing-and-config.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "You can build, test, and configure a real Rocket API. Now the honest map: Rocket vs axum/actix, a real database via rocket_db_pools/sqlx, the Tokio roots, and what to build.",
            "filePath": "/guides/frameworks/rocket-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "tokio-the-async-runtime",
        "title": "Tokio: The Async Runtime",
        "summary": "Learn the runtime every async Rust web framework sits on: why Rust async needs a runtime at all, futures and how await works, spawning tasks, the multi-threaded work-stealing scheduler and blocking, channels and synchronization, and select with timeouts. The engine under axum, actix, and Rocket - made visible.",
        "order": 25,
        "phases": [
          {
            "slug": "01-what-tokio-is",
            "title": "What Tokio Is & Why Futures Need a Runtime",
            "phaseNum": "1",
            "order": 1,
            "summary": "Rust ships async/await and the Future trait but no runtime - futures are inert and do nothing until polled. Tokio is the engine that drives them, and #[tokio::main] wires it up.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/01-what-tokio-is.md"
          },
          {
            "slug": "02-async-await-futures",
            "title": "Async, Await & Futures",
            "phaseNum": "2",
            "order": 2,
            "summary": "How an async fn becomes a state machine implementing Future, what .await actually does at runtime, and why cooperative yielding means CPU-bound code starves Tokio.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/02-async-await-futures.md"
          },
          {
            "slug": "03-tasks-and-spawning",
            "title": "Tasks & Spawning",
            "phaseNum": "3",
            "order": 3,
            "summary": "Spawn independent work with tokio::spawn, await its JoinHandle, see why tasks are cheap green threads, learn the 'static/Send rules, and use join!/try_join! for concurrency without spawning.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/03-tasks-and-spawning.md"
          },
          {
            "slug": "04-runtime-and-scheduler",
            "title": "The Runtime & Scheduler",
            "phaseNum": "4",
            "order": 4,
            "summary": "How Tokio's multi-threaded work-stealing scheduler runs thousands of tasks on a handful of threads, why blocking a worker is the cardinal sin, and how spawn_blocking saves you.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/04-runtime-and-scheduler.md"
          },
          {
            "slug": "05-channels-and-sync",
            "title": "Channels & Synchronization",
            "phaseNum": "5",
            "order": 5,
            "summary": "How Tokio tasks coordinate: message passing with mpsc, oneshot, broadcast, and watch channels, plus async-aware Mutex versus std Mutex and the don't-hold-a-guard-across-await rule.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/05-channels-and-sync.md"
          },
          {
            "slug": "06-select-and-timeouts",
            "title": "select! & Timeouts",
            "phaseNum": "6",
            "order": 6,
            "summary": "Race several futures with tokio::select! - first to finish wins, the rest get cancelled. Master cancellation safety, timeout for bounding ops, interval for ticks, and graceful shutdown.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/06-select-and-timeouts.md"
          },
          {
            "slug": "07-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "7",
            "order": 7,
            "summary": "The payoff: see how axum, actix, and Rocket are Tokio apps, tour the async ecosystem (net/io/fs/time, hyper, tonic, reqwest, sqlx), weigh the alternatives, and pick something concurrent to build.",
            "filePath": "/guides/frameworks/tokio-the-async-runtime/07-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "hyper-and-tower",
        "title": "hyper & tower: The HTTP and Middleware Under axum",
        "summary": "Learn the two libraries every Rust web framework is built on: hyper, the low-level HTTP implementation, and tower, the universal async Service abstraction. The Service trait, Layers and middleware composition, the tower-http toolbox, and exactly how axum is a tower Service over hyper. The bottom of the Rust web stack, made visible.",
        "order": 26,
        "phases": [
          {
            "slug": "01-what-hyper-and-tower-are",
            "title": "What hyper & tower Are",
            "phaseNum": "1",
            "order": 1,
            "summary": "hyper is Rust's low-level HTTP library; tower is the Service abstraction for async request-to-response plus composable Layers. Together they're the foundation axum is built on.",
            "filePath": "/guides/frameworks/hyper-and-tower/01-what-hyper-and-tower-are.md"
          },
          {
            "slug": "02-hyper-the-http-library",
            "title": "hyper: The HTTP Library",
            "phaseNum": "2",
            "order": 2,
            "summary": "How hyper actually speaks HTTP on a socket: the http crate's Request and Response, body types and the Body trait, and serving a connection with TokioIo and service_fn.",
            "filePath": "/guides/frameworks/hyper-and-tower/02-hyper-the-http-library.md"
          },
          {
            "slug": "03-the-service-trait",
            "title": "The Service Trait",
            "phaseNum": "3",
            "order": 3,
            "summary": "tower::Service is the universal async request-to-response shape: call does the work, poll_ready signals readiness for backpressure. Why it's generic, why it composes, and service_fn as the easy path.",
            "filePath": "/guides/frameworks/hyper-and-tower/03-the-service-trait.md"
          },
          {
            "slug": "04-layers-and-middleware",
            "title": "Layers & Middleware",
            "phaseNum": "4",
            "order": 4,
            "summary": "Middleware is a Service that wraps another Service; a tower::Layer is the factory that does the wrapping. Compose layers cleanly with ServiceBuilder, and learn the ordering rule that trips everyone up.",
            "filePath": "/guides/frameworks/hyper-and-tower/04-layers-and-middleware.md"
          },
          {
            "slug": "05-tower-http",
            "title": "The tower-http Toolbox",
            "phaseNum": "5",
            "order": 5,
            "summary": "tower-http is a box of ready-made Layers \u2014 tracing, CORS, compression, timeouts, body limits, static files \u2014 that snap onto any HTTP tower service. The concrete payoff of the Service/Layer abstraction.",
            "filePath": "/guides/frameworks/hyper-and-tower/05-tower-http.md"
          },
          {
            "slug": "06-how-axum-uses-them",
            "title": "How axum Uses Them",
            "phaseNum": "6",
            "order": 6,
            "summary": "The payoff: axum's Router is a tower Service, axum::serve is hyper, .layer is a tower Layer, and extractors are typed sugar over hyper's raw Request/Response. Every axum concept maps to a root.",
            "filePath": "/guides/frameworks/hyper-and-tower/06-how-axum-uses-them.md"
          },
          {
            "slug": "07-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "7",
            "order": 7,
            "summary": "The payoff: the same Service and Layer model that runs an axum server also runs gRPC with tonic and outbound clients with retry, timeout, and load balancing. One mental model for the whole Rust web stack.",
            "filePath": "/guides/frameworks/hyper-and-tower/07-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "aspnet-core-from-zero",
        "title": "ASP.NET Core From Zero",
        "summary": "Learn Microsoft's modern, cross-platform web framework: minimal APIs and your first server, routing, model binding and validation, dependency injection, the middleware pipeline, building a REST API, authentication, and testing and production. The framework behind a huge share of enterprise backends, taught mental-model-first.",
        "order": 27,
        "phases": [
          {
            "slug": "01-what-aspnet-core-is",
            "title": "What ASP.NET Core Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "ASP.NET Core is Microsoft's modern, cross-platform web framework. A request flows through a middleware pipeline to your code, which gets services via dependency injection. Build and run a minimal API.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/01-what-aspnet-core-is.md"
          },
          {
            "slug": "02-routing-and-minimal-apis",
            "title": "Routing & Minimal APIs",
            "phaseNum": "2",
            "order": 2,
            "summary": "How ASP.NET Core matches a request to your code: MapGet/MapPost and friends, binding route and query parameters, returning the right status with Results, and grouping endpoints with MapGroup.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/02-routing-and-minimal-apis.md"
          },
          {
            "slug": "03-model-binding-and-validation",
            "title": "Model Binding & Validation",
            "phaseNum": "3",
            "order": 3,
            "summary": "How ASP.NET Core turns a raw HTTP request into typed C# parameters, and how to check those values with data annotations \u2014 including the honest minimal-API gotcha that validation isn't automatic.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/03-model-binding-and-validation.md"
          },
          {
            "slug": "04-dependency-injection",
            "title": "Dependency Injection",
            "phaseNum": "4",
            "order": 4,
            "summary": "Register services against interfaces in one place and let the framework construct and supply them. Covers the three lifetimes, constructor and handler injection, and the captive-dependency trap.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/04-dependency-injection.md"
          },
          {
            "slug": "05-middleware-pipeline",
            "title": "The Middleware Pipeline",
            "phaseNum": "5",
            "order": 5,
            "summary": "How a request flows through an ordered chain of middleware \u2014 Use, Run, and Map \u2014 why ordering is everything, how to short-circuit, and how to write your own.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/05-middleware-pipeline.md"
          },
          {
            "slug": "06-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "6",
            "order": 6,
            "summary": "Assemble routing, model binding, validation, and DI into a full CRUD products API \u2014 five endpoints over one collection, backed by a thread-safe in-memory repository and returning typed Results.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/06-building-a-rest-api.md"
          },
          {
            "slug": "07-auth",
            "title": "Authentication & Authorization",
            "phaseNum": "7",
            "order": 7,
            "summary": "JWT bearer auth in ASP.NET Core: the who-then-what mental model, validating tokens, the all-important middleware order, and protecting endpoints with Authorize, policies, and roles.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/07-auth.md"
          },
          {
            "slug": "08-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "8",
            "order": 8,
            "summary": "Test the whole app in memory with WebApplicationFactory and HttpClient, override services for fakes, layer configuration with appsettings and ASPNETCORE_ENVIRONMENT, then publish and ship behind Kestrel in a small Docker image.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/08-testing-and-production.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "You can build a real ASP.NET Core API end to end. Now the honest map: minimal APIs vs controllers, EF Core, Blazor, SignalR and gRPC, the roots, and what to build.",
            "filePath": "/guides/frameworks/aspnet-core-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "efcore-from-zero",
        "title": "EF Core From Zero",
        "summary": "Learn Entity Framework Core, .NET's flagship ORM: the DbContext and connecting, entity models and migrations, create and read, LINQ querying, change tracking and SaveChanges, relationships, loading strategies and the N+1 trap, and transactions. The data layer most ASP.NET Core apps use \u2014 including where to drop to SQL.",
        "order": 28,
        "phases": [
          {
            "slug": "01-what-efcore-is",
            "title": "What EF Core Is & the DbContext",
            "phaseNum": "1",
            "order": 1,
            "summary": "EF Core is .NET's flagship ORM: a DbContext is your change-tracking session, DbSets are tables, and LINQ becomes SQL. Connect to SQLite, save a row, and watch the SQL.",
            "filePath": "/guides/frameworks/efcore-from-zero/01-what-efcore-is.md"
          },
          {
            "slug": "02-models-and-migrations",
            "title": "Entity Models & Migrations",
            "phaseNum": "2",
            "order": 2,
            "summary": "Define tables as plain C# classes that EF Core maps by convention, tune them with data annotations or the Fluent API, and evolve your schema safely with versioned dotnet ef migrations.",
            "filePath": "/guides/frameworks/efcore-from-zero/02-models-and-migrations.md"
          },
          {
            "slug": "03-create-and-read",
            "title": "Create & Read",
            "phaseNum": "3",
            "order": 3,
            "summary": "Insert rows with Add plus SaveChanges and watch EF write back the generated Id, then read them back with Find, First, Single, and ToList \u2014 and know when each one throws.",
            "filePath": "/guides/frameworks/efcore-from-zero/03-create-and-read.md"
          },
          {
            "slug": "04-querying-with-linq",
            "title": "Querying with LINQ",
            "phaseNum": "4",
            "order": 4,
            "summary": "Read data with LINQ over IQueryable: Where/OrderBy/Take, deferred execution, Select projection to DTOs, AsNoTracking for read speed, and keeping predicates translatable to SQL.",
            "filePath": "/guides/frameworks/efcore-from-zero/04-querying-with-linq.md"
          },
          {
            "slug": "05-change-tracking",
            "title": "Change Tracking & SaveChanges",
            "phaseNum": "5",
            "order": 5,
            "summary": "How EF Core's DbContext acts as a unit of work: it tracks the entities it hands you, diffs them against a snapshot, and batches the minimal SQL when you call SaveChanges.",
            "filePath": "/guides/frameworks/efcore-from-zero/05-change-tracking.md"
          },
          {
            "slug": "06-relationships",
            "title": "Relationships",
            "phaseNum": "6",
            "order": 6,
            "summary": "Model relationships in EF Core as foreign keys plus navigation properties: one-to-many, one-to-one, many-to-many with auto join tables, the Fluent API for control, and creating nested graphs.",
            "filePath": "/guides/frameworks/efcore-from-zero/06-relationships.md"
          },
          {
            "slug": "07-loading-and-n-plus-1",
            "title": "Loading Strategies & the N+1 Trap",
            "phaseNum": "7",
            "order": 7,
            "summary": "How EF Core loads related data: Include and ThenInclude (eager), lazy loading proxies, explicit loading, and the N+1 query trap that bites everyone \u2014 plus projection and split queries.",
            "filePath": "/guides/frameworks/efcore-from-zero/07-loading-and-n-plus-1.md"
          },
          {
            "slug": "08-transactions-and-migrations",
            "title": "Transactions & Migrations in Production",
            "phaseNum": "8",
            "order": 8,
            "summary": "Group multiple writes into all-or-nothing transactions, guard concurrent edits with a rowversion concurrency token, and apply migrations safely on a live database without racing app instances.",
            "filePath": "/guides/frameworks/efcore-from-zero/08-transactions-and-migrations.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "EF Core in the Real World & Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "Where EF Core lands in real .NET apps: dropping to raw SQL with FromSql/ExecuteSql, EF Core vs Dapper vs ADO.NET, the caveats that bite, ASP.NET Core integration, and what to build.",
            "filePath": "/guides/frameworks/efcore-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "blazor-from-zero",
        "title": "Blazor From Zero",
        "summary": "Learn to build interactive web UIs in C# instead of JavaScript: components and Razor, the Server vs WebAssembly hosting models, data binding, events and the component lifecycle, forms and validation, component communication and state, and calling APIs with dependency injection. Microsoft's answer to single-page apps, taught mental-model-first.",
        "order": 29,
        "phases": [
          {
            "slug": "01-what-blazor-is",
            "title": "What Blazor Is (Server vs WebAssembly)",
            "phaseNum": "1",
            "order": 1,
            "summary": "Blazor builds interactive web UIs in C# instead of JavaScript, from components that re-render on state change. Meet a component, the Server vs WebAssembly hosting models, and run your first app.",
            "filePath": "/guides/frameworks/blazor-from-zero/01-what-blazor-is.md"
          },
          {
            "slug": "02-components-and-razor",
            "title": "Components & Razor",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a Blazor component works: a .razor file mixing HTML markup with C# in an @code block, compiled into one class \u2014 plus Razor essentials, directives, and composing components into a tree.",
            "filePath": "/guides/frameworks/blazor-from-zero/02-components-and-razor.md"
          },
          {
            "slug": "03-data-binding",
            "title": "Data Binding",
            "phaseNum": "3",
            "order": 3,
            "summary": "How Blazor ties markup to state: one-way (@field renders into the DOM) and two-way (@bind links inputs to C# fields both ways), plus @bind:event, @bind:format, and @bind:after.",
            "filePath": "/guides/frameworks/blazor-from-zero/03-data-binding.md"
          },
          {
            "slug": "04-events-and-lifecycle",
            "title": "Events & the Component Lifecycle",
            "phaseNum": "4",
            "order": 4,
            "summary": "Wire up @onclick and other DOM events to C# methods, run code at the right moment with OnInitializedAsync and friends, and use StateHasChanged to force a re-render when state changes outside Blazor's view.",
            "filePath": "/guides/frameworks/blazor-from-zero/04-events-and-lifecycle.md"
          },
          {
            "slug": "05-forms-and-validation",
            "title": "Forms & Validation",
            "phaseNum": "5",
            "order": 5,
            "summary": "Build a product create/edit form with EditForm, the built-in input components, and DataAnnotationsValidator \u2014 wiring model annotations to validation messages and the OnValidSubmit event.",
            "filePath": "/guides/frameworks/blazor-from-zero/05-forms-and-validation.md"
          },
          {
            "slug": "06-communication-and-state",
            "title": "Component Communication & State",
            "phaseNum": "6",
            "order": 6,
            "summary": "How Blazor components talk: parameters down, events up with EventCallback, cascading values for deep data, and a DI-registered service for app-wide shared state.",
            "filePath": "/guides/frameworks/blazor-from-zero/06-communication-and-state.md"
          },
          {
            "slug": "07-calling-apis-and-di",
            "title": "Calling APIs & Dependency Injection",
            "phaseNum": "7",
            "order": 7,
            "summary": "Inject collaborators into components with @inject, register services in Program.cs, and load data from a backend with HttpClient and the System.Net.Http.Json helpers \u2014 building a real products UI.",
            "filePath": "/guides/frameworks/blazor-from-zero/07-calling-apis-and-di.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "You can build interactive web UIs in C#. Now meet Blazor vs the JS frameworks, the .NET 8 render modes, component and state libraries, and the one project to build next.",
            "filePath": "/guides/frameworks/blazor-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "the-aspnet-pipeline-and-kestrel",
        "title": "The ASP.NET Pipeline & Kestrel",
        "summary": "Learn what ASP.NET Core is actually built on: Kestrel the web server, the middleware pipeline and the request delegate, the host and its built-in dependency-injection container and configuration, and how minimal APIs and MVC are conveniences over endpoint routing. The plumbing under every .NET web app, made visible.",
        "order": 30,
        "phases": [
          {
            "slug": "01-what-kestrel-and-the-pipeline-are",
            "title": "What Kestrel & the Pipeline Are",
            "phaseNum": "1",
            "order": 1,
            "summary": "ASP.NET Core in three pieces \u2014 Kestrel the web server, the middleware pipeline every request flows through, and the host that wires it all together \u2014 and how Program.cs maps onto them.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/01-what-kestrel-and-the-pipeline-are.md"
          },
          {
            "slug": "02-kestrel-the-web-server",
            "title": "Kestrel: The Web Server",
            "phaseNum": "2",
            "order": 2,
            "summary": "Kestrel is the cross-platform server that owns the socket, speaks HTTP, and hands each request to your pipeline as an HttpContext. Configuring ports, and why a reverse proxy is a choice.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/02-kestrel-the-web-server.md"
          },
          {
            "slug": "03-the-middleware-pipeline",
            "title": "The Middleware Pipeline",
            "phaseNum": "3",
            "order": 3,
            "summary": "How Kestrel feeds each request through an ordered onion of middleware \u2014 Use, Run, Map \u2014 why registration order is the law, and how short-circuiting serves or rejects requests early.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/03-the-middleware-pipeline.md"
          },
          {
            "slug": "04-the-request-delegate",
            "title": "The RequestDelegate",
            "phaseNum": "4",
            "order": 4,
            "summary": "Strip away the sugar and a whole ASP.NET Core app is one RequestDelegate. Middleware is a function that wraps the next delegate to make a new one \u2014 here's what that means.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/04-the-request-delegate.md"
          },
          {
            "slug": "05-host-di-configuration",
            "title": "The Host, DI & Configuration",
            "phaseNum": "5",
            "order": 5,
            "summary": "How WebApplicationBuilder wires up the DI container, layered configuration, logging, and Kestrel before your app exists \u2014 plus the options pattern, environments, and the generic host running background work.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/05-host-di-configuration.md"
          },
          {
            "slug": "06-how-minimal-apis-and-mvc-sit-on-top",
            "title": "How Minimal APIs & MVC Sit on Top",
            "phaseNum": "6",
            "order": 6,
            "summary": "The payoff: your minimal API delegates and MVC actions are endpoints, and endpoint routing matches a request to one (UseRouting) then runs it (the endpoint middleware). The conveniences map back onto the pipeline.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/06-how-minimal-apis-and-mvc-sit-on-top.md"
          },
          {
            "slug": "07-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "7",
            "order": 7,
            "summary": "Pull the whole machine together \u2014 host, pipeline, RequestDelegate, Kestrel \u2014 then point your new X-ray vision at performance, the ecosystem (BackgroundService, health checks, OpenTelemetry, YARP), and the parallel under every web stack.",
            "filePath": "/guides/frameworks/the-aspnet-pipeline-and-kestrel/07-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "unity-from-zero",
        "title": "Unity From Zero",
        "summary": "Learn the game engine behind a huge share of the games industry: the editor, GameObjects and Components, the MonoBehaviour script lifecycle, transforms and input and movement, physics and collisions, prefabs and instantiation, UI and audio, and building your game. C# game development, taught mental-model-first.",
        "order": 31,
        "phases": [
          {
            "slug": "01-what-unity-is",
            "title": "What Unity Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Unity is a game engine plus editor: it handles rendering, physics, audio, input, and builds, while you supply assets and C# scripts. Its core idea is composition - scenes hold GameObjects, GameObjects hold Components.",
            "filePath": "/guides/frameworks/unity-from-zero/01-what-unity-is.md"
          },
          {
            "slug": "02-the-editor",
            "title": "The Editor",
            "phaseNum": "2",
            "order": 2,
            "summary": "Tour the Unity editor: the Hierarchy, Scene, Game, Inspector, Project, and Console windows, how Play mode works, the edits-during-Play trap, and building the first scene of your game.",
            "filePath": "/guides/frameworks/unity-from-zero/02-the-editor.md"
          },
          {
            "slug": "03-gameobjects-and-components",
            "title": "GameObjects & Components",
            "phaseNum": "3",
            "order": 3,
            "summary": "The core Unity pattern: a GameObject is an empty bag of Components. The Transform is always there; looks, physics, and behavior are Components you attach - composition over inheritance.",
            "filePath": "/guides/frameworks/unity-from-zero/03-gameobjects-and-components.md"
          },
          {
            "slug": "04-monobehaviour-and-the-game-loop",
            "title": "MonoBehaviour & the Game Loop",
            "phaseNum": "4",
            "order": 4,
            "summary": "How a C# script becomes a Component the engine drives: the MonoBehaviour lifecycle, Start vs Update, frame-rate-independent movement with Time.deltaTime, and Inspector-tweakable fields.",
            "filePath": "/guides/frameworks/unity-from-zero/04-monobehaviour-and-the-game-loop.md"
          },
          {
            "slug": "05-transforms-input-movement",
            "title": "Transforms, Input & Movement",
            "phaseNum": "5",
            "order": 5,
            "summary": "Move a GameObject by changing its Transform every frame, scaled by Time.deltaTime and driven by input. Vector3, transform.position, Input.GetAxis, the modern Input System, and a real PlayerMovement script.",
            "filePath": "/guides/frameworks/unity-from-zero/05-transforms-input-movement.md"
          },
          {
            "slug": "06-physics-and-collisions",
            "title": "Physics & Collisions",
            "phaseNum": "6",
            "order": 6,
            "summary": "Hand an object to the physics engine with a Rigidbody, give it shape with Colliders, and react to contact with OnCollisionEnter and OnTriggerEnter - the right way to move characters and collect pickups.",
            "filePath": "/guides/frameworks/unity-from-zero/06-physics-and-collisions.md"
          },
          {
            "slug": "07-prefabs-and-instantiation",
            "title": "Prefabs & Instantiation",
            "phaseNum": "7",
            "order": 7,
            "summary": "Prefabs are reusable GameObject templates: edit once, every copy updates. Spawn them at runtime with Instantiate, remove them with Destroy, and meet object pooling for spawn-heavy games.",
            "filePath": "/guides/frameworks/unity-from-zero/07-prefabs-and-instantiation.md"
          },
          {
            "slug": "08-ui-audio-and-building",
            "title": "UI, Audio & Building",
            "phaseNum": "8",
            "order": 8,
            "summary": "Turn the pickups demo into a real game: a Canvas with TextMeshPro score text, a GameManager holding shared state, an AudioSource for pickup sounds and music, then a build that exports your scenes to a platform.",
            "filePath": "/guides/frameworks/unity-from-zero/08-ui-audio-and-building.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "You built a real game in Unity. Now: how Unity compares to Godot and Unreal, the engine features to learn next, the truth that gamedev is more than code, and what to build.",
            "filePath": "/guides/frameworks/unity-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "dotnet-maui-from-zero",
        "title": ".NET MAUI From Zero",
        "summary": "Learn Microsoft's cross-platform UI framework: one C# codebase that ships to Android, iOS, macOS, and Windows. XAML and layouts, controls and data binding, the MVVM pattern, navigation with Shell, calling APIs and local storage, and platform features and deployment. Write once, run native, taught mental-model-first.",
        "order": 32,
        "phases": [
          {
            "slug": "01-what-maui-is",
            "title": "What MAUI Is & Your First App",
            "phaseNum": "1",
            "order": 1,
            "summary": "MAUI builds native Android, iOS, macOS, and Windows apps from one C# codebase. Meet the XAML + code-behind shape, the MVVM mental model, and scaffold and run your first app.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/01-what-maui-is.md"
          },
          {
            "slug": "02-xaml-and-layouts",
            "title": "XAML & Layouts",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a MAUI page is built: one root layout holding controls, arranged with stack layouts and Grid. XAML markup, key properties, and the notes app's main screen, mental-model first.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/02-xaml-and-layouts.md"
          },
          {
            "slug": "03-controls-and-data-binding",
            "title": "Controls & Data Binding",
            "phaseNum": "3",
            "order": 3,
            "summary": "Wire controls to data with BindingContext and {Binding}, pick OneWay vs TwoWay modes, understand why live updates need change notifications, and render lists with CollectionView.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/03-controls-and-data-binding.md"
          },
          {
            "slug": "04-mvvm",
            "title": "The MVVM Pattern",
            "phaseNum": "4",
            "order": 4,
            "summary": "Structure a MAUI app with MVVM: a testable ViewModel holds state and commands, INotifyPropertyChanged keeps the UI in sync, and CommunityToolkit.Mvvm removes the boilerplate.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/04-mvvm.md"
          },
          {
            "slug": "05-navigation-with-shell",
            "title": "Navigation with Shell",
            "phaseNum": "5",
            "order": 5,
            "summary": "Use MAUI Shell to describe your app's tabs and flyout in one file, move between screens with URI-style routes via GoToAsync, register detail pages, and pass parameters by id.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/05-navigation-with-shell.md"
          },
          {
            "slug": "06-data-and-apis",
            "title": "Data & Calling APIs",
            "phaseNum": "6",
            "order": 6,
            "summary": "Give the notes app a real backend: call an HTTP API with HttpClient and JSON, then persist locally with Preferences, SecureStorage, files, and SQLite \u2014 choosing storage by size, structure, and sensitivity.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/06-data-and-apis.md"
          },
          {
            "slug": "07-platform-features-and-deployment",
            "title": "Platform Features & Deployment",
            "phaseNum": "7",
            "order": 7,
            "summary": "One C# call reaches each platform's native features \u2014 sensors, connectivity, permissions. When that's not enough, drop into per-platform code. Then package your app for the stores.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/07-platform-features-and-deployment.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "You can ship a native cross-platform app in C#. Now meet MAUI vs Flutter and React Native, Blazor Hybrid and CommunityToolkit.Maui, the ASP.NET Core pairing, and what to build next.",
            "filePath": "/guides/frameworks/dotnet-maui-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "express-from-zero",
        "title": "Express From Zero",
        "summary": "Learn the minimalist web framework that defined Node.js backends: routing, the middleware chain that is Express's whole personality, the request and response objects, building a REST API, error handling, serving and structuring an app, and testing and production. Small core, middleware for everything else.",
        "order": 33,
        "phases": [
          {
            "slug": "01-what-express-is",
            "title": "What Express Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "Express is the minimalist Node.js web framework \u2014 a thin layer over the built-in http module. Install it, write a tiny server, run it, and meet the one idea: the middleware chain.",
            "filePath": "/guides/frameworks/express-from-zero/01-what-express-is.md"
          },
          {
            "slug": "02-routing",
            "title": "Routing",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Express turns a method and a path into a handler: method routes, route params via req.params, query strings via req.query, modular routers, and why route order decides which handler wins.",
            "filePath": "/guides/frameworks/express-from-zero/02-routing.md"
          },
          {
            "slug": "03-middleware",
            "title": "Middleware",
            "phaseNum": "3",
            "order": 3,
            "summary": "Middleware is the (req, res, next) function chain that is Express's whole personality: read or modify, respond, or call next. Covers ordering, built-in and third-party middleware, and attaching data to req.",
            "filePath": "/guides/frameworks/express-from-zero/03-middleware.md"
          },
          {
            "slug": "04-request-and-response",
            "title": "Request & Response",
            "phaseNum": "4",
            "order": 4,
            "summary": "Read input from req (params, query, body, headers), write output with res (status + json), pick honest status codes, and validate untrusted input before you ever touch it.",
            "filePath": "/guides/frameworks/express-from-zero/04-request-and-response.md"
          },
          {
            "slug": "05-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "5",
            "order": 5,
            "summary": "Assemble routing, middleware, and request/response validation into a full CRUD REST API: a tasks resource with five route handlers on one Router, an in-memory store, and the right status codes.",
            "filePath": "/guides/frameworks/express-from-zero/05-building-a-rest-api.md"
          },
          {
            "slug": "06-error-handling",
            "title": "Error Handling",
            "phaseNum": "6",
            "order": 6,
            "summary": "Express routes errors to a special four-argument middleware registered last. Covers next(err), a custom AppError class, the async-error trap (Express 4 vs 5), the asyncHandler wrapper, and a 404 catch-all.",
            "filePath": "/guides/frameworks/express-from-zero/06-error-handling.md"
          },
          {
            "slug": "07-serving-and-structure",
            "title": "Serving & Structuring an App",
            "phaseNum": "7",
            "order": 7,
            "summary": "Grow the one-file tasks API into a real shape: serve static files, split by responsibility into routes/controllers/services, separate app-building from server-starting, and read config from the environment.",
            "filePath": "/guides/frameworks/express-from-zero/07-serving-and-structure.md"
          },
          {
            "slug": "08-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "8",
            "order": 8,
            "summary": "Test the tasks API in memory with supertest and a runner, then harden it for production: env config, helmet/cors/compression/rate-limit, graceful shutdown, and a reverse proxy.",
            "filePath": "/guides/frameworks/express-from-zero/08-testing-and-production.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "What you can build now, how Express compares to Fastify, NestJS, and bare node:http, the Express 5 async-error win, the ecosystem you'll reach for, and one concrete thing to go build.",
            "filePath": "/guides/frameworks/express-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "fastify-from-zero",
        "title": "Fastify From Zero",
        "summary": "Learn the fast, schema-first Node.js framework: routing with JSON-schema validation and serialization, the encapsulated plugin system, the request/reply lifecycle and hooks, building a REST API, error handling, and testing and production. A modern, performance-focused alternative to Express that bakes in validation and structure.",
        "order": 34,
        "phases": [
          {
            "slug": "01-what-fastify-is",
            "title": "What Fastify Is & Your First Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "Fastify is the fast, schema-first Node.js framework \u2014 an Express alternative with validation built in. Install it, write a tiny async server, run it, and meet the two ideas that define it.",
            "filePath": "/guides/frameworks/fastify-from-zero/01-what-fastify-is.md"
          },
          {
            "slug": "02-routing-and-schemas",
            "title": "Routing & Schemas",
            "phaseNum": "2",
            "order": 2,
            "summary": "Routing in Fastify by method, params, query, and body \u2014 and attaching a JSON Schema to a route so Fastify validates input and fast-serializes output for you, no validation code required.",
            "filePath": "/guides/frameworks/fastify-from-zero/02-routing-and-schemas.md"
          },
          {
            "slug": "03-the-plugin-system",
            "title": "The Plugin System",
            "phaseNum": "3",
            "order": 3,
            "summary": "How Fastify organizes apps as a tree of encapsulated plugins: writing a plugin, registering it with a prefix, decorating the instance, and using fastify-plugin to share across the whole app.",
            "filePath": "/guides/frameworks/fastify-from-zero/03-the-plugin-system.md"
          },
          {
            "slug": "04-hooks-and-lifecycle",
            "title": "Hooks & the Lifecycle",
            "phaseNum": "4",
            "order": 4,
            "summary": "Every request flows through a named request/reply lifecycle. Hooks let you run code at each stage \u2014 onRequest, preHandler, onSend \u2014 and they respect plugin encapsulation, so you can guard one route group cleanly.",
            "filePath": "/guides/frameworks/fastify-from-zero/04-hooks-and-lifecycle.md"
          },
          {
            "slug": "05-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "5",
            "order": 5,
            "summary": "Assemble routing, schemas, plugins, and hooks into a full books CRUD API: five schema-backed routes in one encapsulated plugin over an in-memory collection, with tiny handlers because validation lives in the schema.",
            "filePath": "/guides/frameworks/fastify-from-zero/05-building-a-rest-api.md"
          },
          {
            "slug": "06-error-handling",
            "title": "Error Handling",
            "phaseNum": "6",
            "order": 6,
            "summary": "How Fastify makes most error handling automatic \u2014 schema-validation 400s and auto-caught async throws \u2014 and how one setErrorHandler, typed errors, and setNotFoundHandler shape the rest into consistent responses.",
            "filePath": "/guides/frameworks/fastify-from-zero/06-error-handling.md"
          },
          {
            "slug": "07-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "7",
            "order": 7,
            "summary": "Test the books API in process with Fastify's built-in app.inject(), structure the app as a buildApp() function, then harden for production with pino logging, graceful shutdown, env config, and official plugins.",
            "filePath": "/guides/frameworks/fastify-from-zero/07-testing-and-production.md"
          },
          {
            "slug": "08-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "8",
            "order": 8,
            "summary": "What you can build now, how Fastify compares to Express, NestJS, and bare node:http, the @fastify/* plugin ecosystem, TypeScript type providers, and one concrete thing to go build.",
            "filePath": "/guides/frameworks/fastify-from-zero/08-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "nestjs-from-zero",
        "title": "NestJS From Zero",
        "summary": "Learn the opinionated, TypeScript-first Node framework for structured backends: controllers and routing, providers and dependency injection, modules, DTOs and validation pipes, building a REST API with a service layer, guards and interceptors and middleware, and testing and production. Angular-style architecture over Express or Fastify.",
        "order": 35,
        "phases": [
          {
            "slug": "01-what-nestjs-is",
            "title": "What NestJS Is & Your First App",
            "phaseNum": "1",
            "order": 1,
            "summary": "NestJS brings real architecture to Node \u2014 controllers, providers, dependency injection, and modules wired by decorators. Scaffold an app with the CLI, read main.ts, and serve your first JSON route.",
            "filePath": "/guides/frameworks/nestjs-from-zero/01-what-nestjs-is.md"
          },
          {
            "slug": "02-controllers-and-routing",
            "title": "Controllers & Routing",
            "phaseNum": "2",
            "order": 2,
            "summary": "How controllers map HTTP requests to methods: @Controller base paths, route decorators, parameter decorators for params/query/body, and returning values that Nest auto-serializes to JSON.",
            "filePath": "/guides/frameworks/nestjs-from-zero/02-controllers-and-routing.md"
          },
          {
            "slug": "03-providers-and-di",
            "title": "Providers & Dependency Injection",
            "phaseNum": "3",
            "order": 3,
            "summary": "How Nest's @Injectable services hold your logic and how the IoC container wires them into controllers via constructor injection \u2014 thin controllers, swappable deps, and the startup errors when wiring breaks.",
            "filePath": "/guides/frameworks/nestjs-from-zero/03-providers-and-di.md"
          },
          {
            "slug": "04-modules",
            "title": "Modules",
            "phaseNum": "4",
            "order": 4,
            "summary": "Modules group a feature's controllers and providers; the app is a tree of modules rooted at AppModule. Learn @Module, imports/exports, and why providers are private by default.",
            "filePath": "/guides/frameworks/nestjs-from-zero/04-modules.md"
          },
          {
            "slug": "05-dtos-validation-pipes",
            "title": "DTOs, Validation & Pipes",
            "phaseNum": "5",
            "order": 5,
            "summary": "Describe request bodies with DTO classes, annotate them with class-validator rules, and let the global ValidationPipe enforce them \u2014 auto-400 on bad input, zero validation code in your controllers.",
            "filePath": "/guides/frameworks/nestjs-from-zero/05-dtos-validation-pipes.md"
          },
          {
            "slug": "06-building-a-rest-api",
            "title": "Building a REST API",
            "phaseNum": "6",
            "order": 6,
            "summary": "Assemble the whole tasks resource \u2014 thin controller, service with the logic and store, DTOs for input, module for wiring \u2014 into full CRUD, throwing built-in HTTP exceptions that auto-map to status codes.",
            "filePath": "/guides/frameworks/nestjs-from-zero/06-building-a-rest-api.md"
          },
          {
            "slug": "07-guards-interceptors-middleware",
            "title": "Guards, Interceptors & Middleware",
            "phaseNum": "7",
            "order": 7,
            "summary": "Nest's request pipeline has named building blocks, each with one job: guards decide who gets in, interceptors wrap the handler, pipes validate input, filters shape errors, middleware does Express-style work.",
            "filePath": "/guides/frameworks/nestjs-from-zero/07-guards-interceptors-middleware.md"
          },
          {
            "slug": "08-testing-and-production",
            "title": "Testing & Production",
            "phaseNum": "8",
            "order": 8,
            "summary": "Use Nest's DI test module to swap mocks for real deps in unit tests, boot the whole app for e2e tests with supertest, centralize config with @nestjs/config, and ship a compiled production build.",
            "filePath": "/guides/frameworks/nestjs-from-zero/08-testing-and-production.md"
          },
          {
            "slug": "09-where-to-go-next",
            "title": "Where to Go Next",
            "phaseNum": "9",
            "order": 9,
            "summary": "What you can build now, how NestJS compares to Express and Fastify, the official ecosystem you'll reach for, and one concrete project to carry the tasks API all the way home.",
            "filePath": "/guides/frameworks/nestjs-from-zero/09-where-to-go-next.md"
          }
        ]
      },
      {
        "slug": "build-a-server-with-node-http",
        "title": "Build a Server With Only node:http",
        "summary": "Build a real web server using nothing but Node's built-in http module: the server/request/response model, reading requests and writing JSON, routing by hand, middleware as plain functions, a full REST API with no framework, async and streams and structure, and exactly what Express adds on top. The foundation every Node framework is built on.",
        "order": 36,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The node:http Mental Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "Node ships a complete HTTP server in node:http; createServer calls your one (req, res) listener for every request, and you write the routing and middleware yourself.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/01-the-mental-model.md"
          },
          {
            "slug": "02-requests-and-responses",
            "title": "Handling Requests & Responses",
            "phaseNum": "2",
            "order": 2,
            "summary": "Read method, URL, headers, and the body-stream off req; write a status, headers, and JSON to res. The manual request/response work that express.json() hides from you.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/02-requests-and-responses.md"
          },
          {
            "slug": "03-routing-by-hand",
            "title": "Routing by Hand",
            "phaseNum": "3",
            "order": 3,
            "summary": "node:http has no router \u2014 you dispatch by inspecting req.method and the URL yourself, match path params with regex, and watch the if-ladder grow into the exact problem Express solves.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/03-routing-by-hand.md"
          },
          {
            "slug": "04-middleware-is-a-function",
            "title": "Middleware Is Just a Function",
            "phaseNum": "4",
            "order": 4,
            "summary": "Middleware in node:http has no special machinery \u2014 it's a plain function you call before your handler to log, authenticate, or parse, and that can short-circuit by responding and returning.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/04-middleware-is-a-function.md"
          },
          {
            "slug": "05-rest-api-no-framework",
            "title": "A JSON REST API With No Framework",
            "phaseNum": "5",
            "order": 5,
            "summary": "Assemble the request/response helpers, hand-rolled routing, and middleware into a full CRUD messages API \u2014 five operations, manual validation, correct status codes, standard library only.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/05-rest-api-no-framework.md"
          },
          {
            "slug": "06-async-streams-structure",
            "title": "Async, Streams & Structure",
            "phaseNum": "6",
            "order": 6,
            "summary": "Real node:http servers are async, stream data instead of buffering it, shut down gracefully on SIGTERM, and split one growing file into modules. The production-shaped version of everything you've built.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/06-async-streams-structure.md"
          },
          {
            "slug": "07-what-express-adds",
            "title": "What Express Adds",
            "phaseNum": "7",
            "order": 7,
            "summary": "Map Express back onto the node:http you just built \u2014 routing, body parsing, middleware, response helpers, error handling \u2014 and decide honestly whether a tiny service even needs a framework.",
            "filePath": "/guides/frameworks/build-a-server-with-node-http/07-what-express-adds.md"
          }
        ]
      },
      {
        "slug": "choosing-your-first-framework",
        "title": "Choosing Your First Framework",
        "summary": "A decisive, practical answer to 'given I know language X, which framework should I actually start with' - one recommendation per language, plus when to skip a framework entirely.",
        "order": 37,
        "phases": [
          {
            "slug": "01-you-dont-need-to-learn-ten-frameworks",
            "title": "You Don't Need to Learn Ten Frameworks",
            "phaseNum": "1",
            "order": 1,
            "summary": "The real question isn't which framework is best - it's which ONE matches the language you already know and the thing you're building right now.",
            "filePath": "/guides/frameworks/choosing-your-first-framework/01-you-dont-need-to-learn-ten-frameworks.md"
          },
          {
            "slug": "02-a-starting-point-language-by-language",
            "title": "A Starting Point, Language by Language",
            "phaseNum": "2",
            "order": 2,
            "summary": "One opinionated framework recommendation per language - Flask for Python, Express for JavaScript/Node, Gin for Go, Axum for Rust, Spring Boot for Java, ASP.NET Core for C# - with the reason each beats the flashier alternative for a first project.",
            "filePath": "/guides/frameworks/choosing-your-first-framework/02-a-starting-point-language-by-language.md"
          },
          {
            "slug": "03-when-you-dont-need-a-framework-yet",
            "title": "When You Don't Need a Framework Yet",
            "phaseNum": "3",
            "order": 3,
            "summary": "Sometimes the standard library is enough for what you're building - the honest alternative to picking a framework, and why knowing that boundary matters more than picking fast.",
            "filePath": "/guides/frameworks/choosing-your-first-framework/03-when-you-dont-need-a-framework-yet.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "version-control",
    "name": "Version Control",
    "icon": "ti-git-branch",
    "blurb": "Git and friends: what they actually do, and how to stay calm when they break.",
    "guides": [
      {
        "slug": "git-from-zero",
        "title": "Git From Zero - Version Control for People Who've Never Used It",
        "summary": "Start from nothing: what version control is, how to install Git, make your first commit, and get your code on GitHub - calmly, with every step explained.",
        "order": 1,
        "phases": [
          {
            "slug": "01-what-is-version-control",
            "title": "What Version Control Even Is (and Getting Git Installed)",
            "phaseNum": "1",
            "order": 1,
            "summary": "Version control is named save-points for your whole project; Git is the tool, GitHub is a website that hosts copies; install Git and tell it who you are.",
            "filePath": "/guides/version-control/git-from-zero/01-what-is-version-control.md"
          },
          {
            "slug": "02-your-first-repository",
            "title": "Your First Repository - init, add, commit, log",
            "phaseNum": "2",
            "order": 2,
            "summary": "Make a project Git watches with init, then take your first snapshots: edit a file, git add it, git commit it, and see your history with git log - all offline.",
            "filePath": "/guides/version-control/git-from-zero/02-your-first-repository.md"
          },
          {
            "slug": "03-putting-it-on-github",
            "title": "Putting It on GitHub - remote, push, and clone",
            "phaseNum": "3",
            "order": 3,
            "summary": "Create a GitHub repo, connect it with git remote add, get past the authentication step that stumps beginners, push your commits up, and clone an existing repo down.",
            "filePath": "/guides/version-control/git-from-zero/03-putting-it-on-github.md"
          },
          {
            "slug": "04-first-day-snags",
            "title": "When the First Day Goes Sideways - Beginner Errors, Calmly Fixed",
            "phaseNum": "4",
            "order": 4,
            "summary": "The handful of errors that ambush every Git beginner - command not found, identity unknown, auth failed, rejected push, stuck in Vim - each with a calm one-line fix and why it happened.",
            "filePath": "/guides/version-control/git-from-zero/04-first-day-snags.md"
          }
        ]
      },
      {
        "slug": "git-explained-like-a-human",
        "title": "Git, Explained Like You're a Human",
        "summary": "What Git actually is, what every everyday command really does, and how to stay calm when it breaks.",
        "order": 2,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The Mental Model - What Git Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Commits are snapshots, branches are sticky notes pointing at commits, HEAD is 'you are here', and almost nothing is ever truly deleted.",
            "filePath": "/guides/version-control/git-explained-like-a-human/01-the-mental-model.md"
          },
          {
            "slug": "02-everyday-commands",
            "title": "The Everyday Commands - What Each One Really Does",
            "phaseNum": "2",
            "order": 2,
            "summary": "status, add, commit, log, diff, branch, switch, merge, fetch, pull, push, and stash - what each actually does, when to reach for it, and the gotcha.",
            "filePath": "/guides/version-control/git-explained-like-a-human/02-everyday-commands.md"
          },
          {
            "slug": "03-when-it-breaks",
            "title": "When It Breaks - Common 'Oh No' Moments, Calmly Fixed",
            "phaseNum": "3",
            "order": 3,
            "summary": "Committed to the wrong branch, undo a commit but keep the work, merge conflicts, fix a commit message, unstage files - the everyday Git scares and their calm fixes.",
            "filePath": "/guides/version-control/git-explained-like-a-human/03-when-it-breaks.md"
          }
        ]
      },
      {
        "slug": "git-with-other-people",
        "title": "Git With Other People - Branches, Pull Requests, and Not Stepping on Toes",
        "summary": "How real teams use Git: feature branches, keeping your work in sync with a moving main, and getting changes in through pull requests - without overwriting anyone.",
        "order": 3,
        "phases": [
          {
            "slug": "01-the-feature-branch-workflow",
            "title": "The Feature-Branch Workflow - Why Nobody Touches main",
            "phaseNum": "1",
            "order": 1,
            "summary": "On a team you do every piece of work on its own short-lived branch off main, then merge it back through review - keeping main always-working and your changes isolated.",
            "filePath": "/guides/version-control/git-with-other-people/01-the-feature-branch-workflow.md"
          },
          {
            "slug": "02-staying-in-sync",
            "title": "Staying in Sync - Keeping Up With a Moving main",
            "phaseNum": "2",
            "order": 2,
            "summary": "main keeps moving while you work; learn what tracking branches tell you, how to fold the latest main into your branch regularly, and how to handle team conflicts and rejected pushes calmly.",
            "filePath": "/guides/version-control/git-with-other-people/02-staying-in-sync.md"
          },
          {
            "slug": "03-pull-requests-and-review",
            "title": "Pull Requests & Review - Getting Your Work Into main",
            "phaseNum": "3",
            "order": 3,
            "summary": "A pull request is a reviewable request to merge your branch into main; learn the PR flow, the three merge buttons, cleaning up after, fixing PR conflicts, and tagging a release.",
            "filePath": "/guides/version-control/git-with-other-people/03-pull-requests-and-review.md"
          }
        ]
      },
      {
        "slug": "git-disaster-recovery",
        "title": "Git Disaster Recovery - Getting Back What You Thought You Lost",
        "summary": "The advanced rescue kit: recover 'lost' commits with the reflog, use rebase safely, and undo work you've already pushed - calmly, even at 2am.",
        "order": 4,
        "phases": [
          {
            "slug": "01-the-reflog",
            "title": "The Reflog - Your Safety Net",
            "phaseNum": "1",
            "order": 1,
            "summary": "The reflog is Git's private diary of everywhere HEAD has been; with it you can recover commits a bad reset --hard threw away, find work from a detached HEAD, and restore a deleted branch.",
            "filePath": "/guides/version-control/git-disaster-recovery/01-the-reflog.md"
          },
          {
            "slug": "02-rebase-without-fear",
            "title": "Rebase Without Fear",
            "phaseNum": "2",
            "order": 2,
            "summary": "Rebase replays your commits onto a new base as brand-new commits; use it to keep history linear and tidy it before a PR, follow the one golden rule, and rescue a rebase gone wrong.",
            "filePath": "/guides/version-control/git-disaster-recovery/02-rebase-without-fear.md"
          },
          {
            "slug": "03-undoing-pushed-history",
            "title": "Undoing What You've Already Pushed",
            "phaseNum": "3",
            "order": 3,
            "summary": "Once a commit is pushed others may have it; undo it safely with git revert on shared branches, and only rewrite pushed history on your own branch with --force-with-lease, never plain --force.",
            "filePath": "/guides/version-control/git-disaster-recovery/03-undoing-pushed-history.md"
          }
        ]
      },
      {
        "slug": "gitignore-lfs-submodules",
        "title": "gitignore, LFS, and Submodules",
        "summary": "Keep junk, secrets, and giant files out of your repo, and tame the submodule: the settings that stop you committing node_modules or a 2GB video.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-git-tracks",
            "title": "What Git tracks (and what \\\"ignore\\\" really means)",
            "phaseNum": "1",
            "order": 1,
            "summary": "Keep junk, secrets, and giant files out of your repo, and tame the submodule: the settings that stop you committing node_modules or a 2GB video.",
            "filePath": "/guides/version-control/gitignore-lfs-submodules/01-what-git-tracks.md"
          },
          {
            "slug": "02-ignoring-untracking-lfs",
            "title": "Ignoring, untracking, and LFS for big files",
            "phaseNum": "2",
            "order": 2,
            "summary": "Keep junk, secrets, and giant files out of your repo, and tame the submodule: the settings that stop you committing node_modules or a 2GB video.",
            "filePath": "/guides/version-control/gitignore-lfs-submodules/02-ignoring-untracking-lfs.md"
          },
          {
            "slug": "03-secrets-and-submodules",
            "title": "Leaked secrets and the submodule trap",
            "phaseNum": "3",
            "order": 3,
            "summary": "Keep junk, secrets, and giant files out of your repo, and tame the submodule: the settings that stop you committing node_modules or a 2GB video.",
            "filePath": "/guides/version-control/gitignore-lfs-submodules/03-secrets-and-submodules.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "debugging",
    "name": "Debugging & Troubleshooting",
    "icon": "ti-bug",
    "blurb": "Reading the error, finding the real cause, and fixing it calmly instead of guessing.",
    "guides": [
      {
        "slug": "what-an-error-message-tells-you",
        "title": "What an Error Message Is Actually Telling You",
        "summary": "An error message is not the computer scolding you - it's a precise report of what went wrong and where. This guide teaches you to read its anatomy, recognize the common families, and work through one calmly.",
        "order": 1,
        "phases": [
          {
            "slug": "01-information-not-insult",
            "title": "An Error Is Information, Not an Insult",
            "phaseNum": "1",
            "order": 1,
            "summary": "An error message is the computer reporting what it tried and why it stopped. Almost every one has the same three parts: the error type, the message, and the location.",
            "filePath": "/guides/debugging/what-an-error-message-tells-you/01-information-not-insult.md"
          },
          {
            "slug": "02-common-families",
            "title": "The Common Error Families",
            "phaseNum": "2",
            "order": 2,
            "summary": "Most errors you'll meet belong to a handful of families: syntax vs runtime errors, null/undefined, type mismatches, not-found, and permission denied. Recognize the family and you're halfway to the fix.",
            "filePath": "/guides/debugging/what-an-error-message-tells-you/02-common-families.md"
          },
          {
            "slug": "03-what-to-do",
            "title": "What to Actually Do With One",
            "phaseNum": "3",
            "order": 3,
            "summary": "The calm, repeatable method for resolving any error: read it literally top line first, find your line, reproduce it small, search the exact message, and rubber-duck when stuck. With a symptom-to-first-move cheat-card.",
            "filePath": "/guides/debugging/what-an-error-message-tells-you/03-what-to-do.md"
          }
        ]
      },
      {
        "slug": "reading-a-stack-trace",
        "title": "Reading a Stack Trace at 2am",
        "summary": "A stack trace is the call stack frozen at the instant of failure - this guide teaches you to read one calmly: what it actually is, how to find your code in the noise, and how to go from trace to fix.",
        "order": 2,
        "phases": [
          {
            "slug": "01-what-a-stack-trace-is",
            "title": "What a Stack Trace Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Programs run as a call stack - functions calling functions, stacked on top of each other. A stack trace is that stack frozen at the instant of failure: where it broke, and the chain of who-called-whom that led there.",
            "filePath": "/guides/debugging/reading-a-stack-trace/01-what-a-stack-trace-is.md"
          },
          {
            "slug": "02-how-to-read-one",
            "title": "How to Read One (Without Panicking)",
            "phaseNum": "2",
            "order": 2,
            "summary": "The reading method: the top line is the error type and message, read toward the crash point, then find your code among the framework noise. Annotated real-looking traces in Python and JavaScript, plus a symptom cheat-card.",
            "filePath": "/guides/debugging/reading-a-stack-trace/02-how-to-read-one.md"
          },
          {
            "slug": "03-from-trace-to-fix",
            "title": "From Trace to Fix",
            "phaseNum": "3",
            "order": 3,
            "summary": "The crash line is the symptom; the cause is often a few frames below it. How to follow 'Caused by:' / chained exceptions, what to do when the whole trace is library code (you passed it something bad), and how to reproduce and search the top line to land the fix.",
            "filePath": "/guides/debugging/reading-a-stack-trace/03-from-trace-to-fix.md"
          }
        ]
      },
      {
        "slug": "reading-logs-without-drowning",
        "title": "Reading Logs Without Drowning",
        "summary": "What logs actually are, how to find the one line that matters in a flood of them, and how to write logs that help future-you instead of burying them.",
        "order": 3,
        "phases": [
          {
            "slug": "01-what-logs-actually-are",
            "title": "What Logs Actually Are",
            "phaseNum": "1",
            "order": 1,
            "summary": "A log is a running diary a program writes about its own life; each line has a timestamp, a level (DEBUG/INFO/WARN/ERROR/FATAL), a source, and a message - and knowing the parts lets you read any log.",
            "filePath": "/guides/debugging/reading-logs-without-drowning/01-what-logs-actually-are.md"
          },
          {
            "slug": "02-finding-the-needle",
            "title": "Finding the Needle",
            "phaseNum": "2",
            "order": 2,
            "summary": "The practical moves for finding the one line that matters: watch logs live with tail -f, filter with grep, zoom to the moment of failure by timestamp, and follow a single request through using a correlation ID.",
            "filePath": "/guides/debugging/reading-logs-without-drowning/02-finding-the-needle.md"
          },
          {
            "slug": "03-logs-that-help-future-you",
            "title": "Logs That Help Future-You",
            "phaseNum": "3",
            "order": 3,
            "summary": "What makes a log line genuinely useful - structured key/value fields, levels used honestly, and enough context to act - plus the writing habits that save future-you, and a light nod to log aggregators.",
            "filePath": "/guides/debugging/reading-logs-without-drowning/03-logs-that-help-future-you.md"
          }
        ]
      },
      {
        "slug": "how-to-reproduce-a-bug",
        "title": "How to Reproduce a Bug",
        "summary": "Reproduction is the skill that makes every fix possible: turn a vague report into a bug you can trigger on demand, shrink it to its essence, and tame the intermittent ones that won't show up when you're watching.",
        "order": 4,
        "phases": [
          {
            "slug": "01-why-reproduction-is-the-whole-game",
            "title": "Why Reproduction Is the Whole Game",
            "phaseNum": "1",
            "order": 1,
            "summary": "You can't fix - or verify a fix for - a bug you can't trigger on demand. Reproduction converts a vague report into a controllable experiment. The whole skill is two moves: make it happen reliably, then shrink it.",
            "filePath": "/guides/debugging/how-to-reproduce-a-bug/01-why-reproduction-is-the-whole-game.md"
          },
          {
            "slug": "02-nailing-it-down",
            "title": "Nailing It Down",
            "phaseNum": "2",
            "order": 2,
            "summary": "Four variables decide whether a bug reproduces: the exact steps, the environment, the input data, and the state/timing. Pin all four, then shrink to a minimal reproduction by removing everything that isn't load-bearing. 'Works on my machine' is one of these four differing.",
            "filePath": "/guides/debugging/how-to-reproduce-a-bug/02-nailing-it-down.md"
          },
          {
            "slug": "03-when-it-wont-reproduce",
            "title": "When It Won't Reproduce (Heisenbugs)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Intermittent bugs have a hidden input you haven't pinned: timing/races, uninitialized state, an external dependency, or caching. The tactics that make them reliable: log around it, force the timing, control randomness and the clock, and pin the dependency.",
            "filePath": "/guides/debugging/how-to-reproduce-a-bug/03-when-it-wont-reproduce.md"
          }
        ]
      },
      {
        "slug": "using-a-debugger",
        "title": "Using a Debugger (Breakpoints, Stepping & Watch)",
        "summary": "What a debugger actually is - a way to pause your program mid-run and inspect everything that's true at that instant - and how breakpoints, stepping, and watch expressions transfer across every IDE, language, and browser devtools.",
        "order": 5,
        "phases": [
          {
            "slug": "01-why-a-debugger-beats-print",
            "title": "Why a Debugger Beats print()",
            "phaseNum": "1",
            "order": 1,
            "summary": "A debugger pauses your program mid-run and lets you inspect everything that's true at that instant, instead of editing in print statements, re-running, and guessing - and print/log debugging is still fine in plenty of cases.",
            "filePath": "/guides/debugging/using-a-debugger/01-why-a-debugger-beats-print.md"
          },
          {
            "slug": "02-the-core-moves",
            "title": "The Core Moves",
            "phaseNum": "2",
            "order": 2,
            "summary": "The universal debugger controls that transfer across every IDE, language, and browser devtools: setting breakpoints, stepping over / into / out, inspecting variables and the call stack, and watch expressions - with an ASCII sketch of a paused session.",
            "filePath": "/guides/debugging/using-a-debugger/02-the-core-moves.md"
          },
          {
            "slug": "03-debugging-for-real",
            "title": "Debugging for Real",
            "phaseNum": "3",
            "order": 3,
            "summary": "Leveling up: conditional breakpoints that pause only when X is true, watchpoints that pause when a value changes, debugging across the stack (backend in your IDE plus frontend in browser devtools), reading the call stack at a breakpoint, and the gotcha where a breakpoint changes the timing of a race condition.",
            "filePath": "/guides/debugging/using-a-debugger/03-debugging-for-real.md"
          }
        ]
      },
      {
        "slug": "bisecting-a-bug",
        "title": "Bisecting a Bug (git bisect & Binary-Search Thinking)",
        "summary": "When something worked before and is broken now, you don't search commit by commit - you halve the suspect range each test, so 1000 commits take about 10 checks; git bisect automates the hunt, and the same halving idea finds the bad config line, input row, or dependency.",
        "order": 6,
        "phases": [
          {
            "slug": "01-binary-search-thinking",
            "title": "Binary-Search Thinking - Halving the Haystack",
            "phaseNum": "1",
            "order": 1,
            "summary": "When something worked before and is broken now, you don't test suspects one by one - you test the midpoint, throw away the half you just cleared, and repeat; doubling the haystack adds only one more check, so a thousand commits take about ten.",
            "filePath": "/guides/debugging/bisecting-a-bug/01-binary-search-thinking.md"
          },
          {
            "slug": "02-git-bisect",
            "title": "git bisect - Letting Git Drive the Search",
            "phaseNum": "2",
            "order": 2,
            "summary": "Tell Git one known-good commit and one known-bad commit; it checks out the midpoint, you test and mark it good or bad, and after about ten rounds it names the exact first bad commit - then git bisect reset puts you back, and git bisect run automates the whole loop.",
            "filePath": "/guides/debugging/bisecting-a-bug/02-git-bisect.md"
          },
          {
            "slug": "03-bisecting-beyond-git",
            "title": "Bisecting Beyond Git - The Method Is Everywhere",
            "phaseNum": "3",
            "order": 3,
            "summary": "The halving idea isn't about commits - it's about any 'worked before / broken now' problem: which config line, which input row, which dependency, or which block of code is the culprit, all found by clearing half at a time; the one rule is that your yes/no test must be reliable, never flaky.",
            "filePath": "/guides/debugging/bisecting-a-bug/03-bisecting-beyond-git.md"
          }
        ]
      },
      {
        "slug": "when-prod-is-down",
        "title": "When Prod Is Down: Staying Calm",
        "summary": "How to handle a production outage without panicking: assess the blast radius, stop the bleeding before you diagnose, run the incident with clear comms, and turn the wreckage into a blameless postmortem that prevents the next one.",
        "order": 7,
        "phases": [
          {
            "slug": "01-the-first-five-minutes",
            "title": "The First Five Minutes",
            "phaseNum": "1",
            "order": 1,
            "summary": "When prod is down, don't panic and don't start randomly changing things: assess the blast radius (who and what is affected, how bad), then stop the bleeding before you diagnose. Restore service first, understand later.",
            "filePath": "/guides/debugging/when-prod-is-down/01-the-first-five-minutes.md"
          },
          {
            "slug": "02-triage-and-mitigate",
            "title": "Triage & Mitigate",
            "phaseNum": "2",
            "order": 2,
            "summary": "The fastest paths back to green during an outage - roll back the last deploy, flip the feature flag off, scale up, fail over - and how to actually run the incident: one coordinator, a clear comms channel, and a timeline written as you go. Mitigation over root cause, in the moment.",
            "filePath": "/guides/debugging/when-prod-is-down/02-triage-and-mitigate.md"
          },
          {
            "slug": "03-after-the-blameless-postmortem",
            "title": "After: the Blameless Postmortem",
            "phaseNum": "3",
            "order": 3,
            "summary": "Once the outage is over: build the timeline, separate root cause from contributing factors, protect the blameless rule (systems fail, not people), and turn the incident into prevention with concrete action items, alerts, and guardrails. Every outage is tuition - make it buy something.",
            "filePath": "/guides/debugging/when-prod-is-down/03-after-the-blameless-postmortem.md"
          }
        ]
      },
      {
        "slug": "debugging-in-the-browser",
        "title": "Debugging in the Browser",
        "summary": "Browser DevTools without the overwhelm: the Console, breakpoints in the Sources panel, and the Network tab solve most frontend mysteries.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-devtools-map-and-the-console",
            "title": "The DevTools Map and the Console",
            "phaseNum": "1",
            "order": 1,
            "summary": "DevTools is a live window into the running page, not a separate program. Learn the panel map and the one you'll live in: the Console - errors, logging, and live evaluation.",
            "filePath": "/guides/debugging/debugging-in-the-browser/01-the-devtools-map-and-the-console.md"
          },
          {
            "slug": "02-breakpoints-and-the-network-tab",
            "title": "Breakpoints and the Network Tab",
            "phaseNum": "2",
            "order": 2,
            "summary": "Pause your JavaScript with breakpoints in the Sources panel instead of scattering logs, then use the Network tab to find the request that failed and read what came back.",
            "filePath": "/guides/debugging/debugging-in-the-browser/02-breakpoints-and-the-network-tab.md"
          },
          {
            "slug": "03-a-real-investigation",
            "title": "A Real Investigation",
            "phaseNum": "3",
            "order": 3,
            "summary": "Walk one why-is-this-broken bug end to end across Console, Network, Sources, and Elements - plus the gotchas (caching, scope, source maps) that send people chasing ghosts.",
            "filePath": "/guides/debugging/debugging-in-the-browser/03-a-real-investigation.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "testing",
    "name": "Testing",
    "icon": "ti-test-pipe",
    "blurb": "Unit, integration, end-to-end, and load tests - plus TDD/BDD - that actually catch the bug.",
    "guides": [
      {
        "slug": "why-test-at-all",
        "title": "Why Test At All?",
        "summary": "Tests are a safety net that let you change code without fear - this guide gives you the mental model that makes testing feel like a gift instead of a chore, before you write a single test.",
        "order": 1,
        "phases": [
          {
            "slug": "01-tests-are-a-safety-net",
            "title": "Tests Are a Safety Net",
            "phaseNum": "1",
            "order": 1,
            "summary": "The real value of a test isn't catching bugs once - it's letting you change working code without fear, because a test will shout the moment you break something.",
            "filePath": "/guides/testing/why-test-at-all/01-tests-are-a-safety-net.md"
          },
          {
            "slug": "02-what-a-test-actually-is",
            "title": "What a Test Actually Is",
            "phaseNum": "2",
            "order": 2,
            "summary": "A test is a small program that runs your real code with known inputs and asserts the result is what you expect - if the assertion fails, the test fails. Shown passing and failing.",
            "filePath": "/guides/testing/why-test-at-all/02-what-a-test-actually-is.md"
          },
          {
            "slug": "03-whats-worth-testing",
            "title": "What's Worth Testing (Honestly)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Test the logic that matters, the bug you just fixed, and the tricky edge cases - don't chase 100% coverage of trivial code, and watch out for brittle tests and tests that test nothing.",
            "filePath": "/guides/testing/why-test-at-all/03-whats-worth-testing.md"
          }
        ]
      },
      {
        "slug": "your-first-unit-test",
        "title": "Your First Unit Test",
        "summary": "Write and run a real unit test from scratch: learn the Arrange-Act-Assert shape, watch a test pass green and fail red, and pick up the habits that make a test worth keeping.",
        "order": 2,
        "phases": [
          {
            "slug": "01-arrange-act-assert",
            "title": "Arrange, Act, Assert",
            "phaseNum": "1",
            "order": 1,
            "summary": "Every test, in every language, has the same three parts: arrange the inputs, act by calling the code, assert the result is what you expected. We map them onto a tiny real function.",
            "filePath": "/guides/testing/your-first-unit-test/01-arrange-act-assert.md"
          },
          {
            "slug": "02-write-it-and-run-it",
            "title": "Write It and Run It",
            "phaseNum": "2",
            "order": 2,
            "summary": "Create the test file, run pytest, and read a green pass - then break the code on purpose to see a red failure and learn to read the expected-vs-actual output.",
            "filePath": "/guides/testing/your-first-unit-test/02-write-it-and-run-it.md"
          },
          {
            "slug": "03-what-makes-a-good-test",
            "title": "What Makes a Good Test",
            "phaseNum": "3",
            "order": 3,
            "summary": "The habits that make a test trustworthy: test one behavior, name it for what it checks, keep it fast and independent, cover the edge cases, and never trust a test that passes even when the code is wrong.",
            "filePath": "/guides/testing/your-first-unit-test/03-what-makes-a-good-test.md"
          }
        ]
      },
      {
        "slug": "unit-integration-e2e",
        "title": "Unit, Integration & E2E Tests, Explained",
        "summary": "What the three levels of testing actually are, what each one catches and costs, and how to get the mix right so your suite stays fast and your failures point somewhere useful.",
        "order": 3,
        "phases": [
          {
            "slug": "01-the-testing-pyramid",
            "title": "The Testing Pyramid",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model behind the three levels: many small fast tests at the bottom, fewer big slow tests at the top - and why that shape gives you speed plus failures that point at the bug.",
            "filePath": "/guides/testing/unit-integration-e2e/01-the-testing-pyramid.md"
          },
          {
            "slug": "02-the-three-levels",
            "title": "The Three Levels",
            "phaseNum": "2",
            "order": 2,
            "summary": "Unit, integration, and end-to-end tests one at a time: what each one catches, what each costs in speed and flakiness, and a concrete worked example of each.",
            "filePath": "/guides/testing/unit-integration-e2e/02-the-three-levels.md"
          },
          {
            "slug": "03-getting-the-mix-right",
            "title": "Getting the Mix Right",
            "phaseNum": "3",
            "order": 3,
            "summary": "The practical strategy: lots of unit, some integration, a few E2E; how to decide which level a given risk belongs at; and why the 'ice-cream cone' anti-pattern of all-E2E quietly wrecks teams.",
            "filePath": "/guides/testing/unit-integration-e2e/03-getting-the-mix-right.md"
          }
        ]
      },
      {
        "slug": "mocking-and-test-doubles",
        "title": "Mocking, Stubbing & Test Doubles",
        "summary": "What test doubles actually are, the difference between a dummy, stub, fake, spy, and mock, and the judgment call of when to fake a dependency versus use the real thing.",
        "order": 4,
        "phases": [
          {
            "slug": "01-why-fake-anything",
            "title": "Why Fake Anything?",
            "phaseNum": "1",
            "order": 1,
            "summary": "Your code talks to slow, unreliable, and expensive things; to test your own logic in isolation you replace those dependencies with stand-ins - the stunt-double mental model.",
            "filePath": "/guides/testing/mocking-and-test-doubles/01-why-fake-anything.md"
          },
          {
            "slug": "02-the-doubles-defined-honestly",
            "title": "The Doubles, Defined Honestly",
            "phaseNum": "2",
            "order": 2,
            "summary": "The five kinds of test double - dummy, stub, fake, spy, and mock - what each is for, with a small example, and why people call all of them 'mocks.'",
            "filePath": "/guides/testing/mocking-and-test-doubles/02-the-doubles-defined-honestly.md"
          },
          {
            "slug": "03-when-mocking-helps-vs-hurts",
            "title": "When Mocking Helps vs Hurts",
            "phaseNum": "3",
            "order": 3,
            "summary": "Mock at the boundaries (external systems), not your own internals; avoid the over-mocking trap of green tests over a broken product; prefer real objects or fakes when they're cheap.",
            "filePath": "/guides/testing/mocking-and-test-doubles/03-when-mocking-helps-vs-hurts.md"
          }
        ]
      },
      {
        "slug": "tdd-and-bdd-honestly",
        "title": "TDD & BDD, Honestly",
        "summary": "What test-driven and behavior-driven development actually are, the red-green-refactor and Given/When/Then cycles, and an honest take on when each one earns its keep - and when it's just ritual.",
        "order": 5,
        "phases": [
          {
            "slug": "01-red-green-refactor",
            "title": "TDD: Red, Green, Refactor",
            "phaseNum": "1",
            "order": 1,
            "summary": "Test-driven development is a design discipline: write a failing test first (red), make it pass with the simplest code (green), then clean up (refactor) - using the test to pin down what you want before you build it.",
            "filePath": "/guides/testing/tdd-and-bdd-honestly/01-red-green-refactor.md"
          },
          {
            "slug": "02-describing-behavior",
            "title": "BDD: Describing Behavior",
            "phaseNum": "2",
            "order": 2,
            "summary": "Behavior-driven development frames tests as readable behavior using Given/When/Then language, so non-developers can understand and even help write them - a collaboration and vocabulary layer that sits on top of the TDD loop.",
            "filePath": "/guides/testing/tdd-and-bdd-honestly/02-describing-behavior.md"
          },
          {
            "slug": "03-when-they-help",
            "title": "Honestly: When They Help, When They Don't",
            "phaseNum": "3",
            "order": 3,
            "summary": "An honest, judgment-flagged take: TDD shines for well-understood logic and bug fixes and fights you on exploratory or UI work; BDD pays off when business stakeholders are involved and is overhead when they're not - and cargo-culting the ritual without the benefit helps no one.",
            "filePath": "/guides/testing/tdd-and-bdd-honestly/03-when-they-help.md"
          }
        ]
      },
      {
        "slug": "testing-in-ci",
        "title": "Testing in CI (What Runs on Every Push)",
        "summary": "CI is a server that automatically runs your test suite on every push and pull request, so broken code can't quietly reach main - here's the mental model, what a run actually does, and how to keep it trustworthy.",
        "order": 6,
        "phases": [
          {
            "slug": "01-what-ci-testing-actually-is",
            "title": "What CI Testing Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "CI is a server that automatically runs your full test suite on every push and pull request; the green check on a PR means those tests passed on a clean machine, which is why it beats 'it passed on my machine'.",
            "filePath": "/guides/testing/testing-in-ci/01-what-ci-testing-actually-is.md"
          },
          {
            "slug": "02-inside-the-pipeline",
            "title": "Inside the Pipeline",
            "phaseNum": "2",
            "order": 2,
            "summary": "A CI run checks out your code on a clean machine, installs dependencies, runs lint and tests (sometimes across several versions or OSes), and reports pass or fail; here's an annotated GitHub Actions config and a real run log, focused on the test step.",
            "filePath": "/guides/testing/testing-in-ci/02-inside-the-pipeline.md"
          },
          {
            "slug": "03-keeping-ci-trustworthy",
            "title": "Keeping CI Trustworthy",
            "phaseNum": "3",
            "order": 3,
            "summary": "Flaky tests - ones that pass or fail randomly - are what destroy CI's value, because people start ignoring red; here's why flakiness happens (timing, order, shared state), how to keep the suite fast and reliable, and how required checks protect main.",
            "filePath": "/guides/testing/testing-in-ci/03-keeping-ci-trustworthy.md"
          }
        ]
      },
      {
        "slug": "load-and-performance-testing",
        "title": "Load & Performance Testing",
        "summary": "Your tests prove the app is correct; load tests prove it survives a thousand people showing up at once. Here's the mental model, the metrics that actually matter (percentiles, not averages), and how to run one test and read where it breaks.",
        "order": 7,
        "phases": [
          {
            "slug": "01-why-load-test",
            "title": "Why Load-Test",
            "phaseNum": "1",
            "order": 1,
            "summary": "Correctness tests ask 'is it right?' for one user; load tests ask 'does it still work when a crowd arrives at once?' Here's the mental model, the launch-day scenario, and what you're trying to learn before your users learn it for you.",
            "filePath": "/guides/testing/load-and-performance-testing/01-why-load-test.md"
          },
          {
            "slug": "02-the-metrics-that-matter",
            "title": "The Metrics That Matter",
            "phaseNum": "2",
            "order": 2,
            "summary": "Three numbers tell the story: throughput (requests/sec), latency (and why you read percentiles p50/p95/p99, not averages - the slow tail is what users feel), and error rate under load. Plus the four test types: load, stress, soak, and spike.",
            "filePath": "/guides/testing/load-and-performance-testing/02-the-metrics-that-matter.md"
          },
          {
            "slug": "03-running-one-and-reading-it",
            "title": "Running One & Reading It",
            "phaseNum": "3",
            "order": 3,
            "summary": "The workflow end to end: pick a realistic scenario, ramp up virtual users, watch throughput/latency/errors, and find the knee - the point where latency spikes and errors climb. With an illustrative readout, and the traps (test like production, or the numbers lie) that fool first-timers.",
            "filePath": "/guides/testing/load-and-performance-testing/03-running-one-and-reading-it.md"
          }
        ]
      },
      {
        "slug": "flaky-tests",
        "title": "Flaky Tests",
        "summary": "Why a test passes and fails with no code change, the usual culprits, and how to kill flakiness for good instead of hiding it behind retries.",
        "order": 8,
        "phases": [
          {
            "slug": "01-what-a-flaky-test-is",
            "title": "What a Flaky Test Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A flaky test is nondeterministic: the same code yields different results because hidden inputs - time, order, randomness, the network - leak into a test that should be a pure function.",
            "filePath": "/guides/testing/flaky-tests/01-what-a-flaky-test-is.md"
          },
          {
            "slug": "02-the-usual-culprits",
            "title": "The Usual Culprits",
            "phaseNum": "2",
            "order": 2,
            "summary": "A field guide to the five everyday sources of flakiness - timing and sleeps, async not awaited, test order and shared state, real externals, and leaked resources - and the fingerprint each one leaves.",
            "filePath": "/guides/testing/flaky-tests/02-the-usual-culprits.md"
          },
          {
            "slug": "03-diagnose-fix-quarantine",
            "title": "Diagnose, Fix, Quarantine",
            "phaseNum": "3",
            "order": 3,
            "summary": "The playbook for killing flakiness: rerun and isolate and seed to find the cause, control time/randomness/state/externals to fix it, and quarantine - never silently ignore - when you can't fix it today.",
            "filePath": "/guides/testing/flaky-tests/03-diagnose-fix-quarantine.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "databases",
    "name": "Databases",
    "icon": "ti-database",
    "blurb": "Schemas, queries, and the production lessons that come with them.",
    "guides": [
      {
        "slug": "what-a-database-is",
        "title": "What a Database Actually Is",
        "summary": "A database isn't a fancy spreadsheet \u2014 it's an organized store of data plus a program (the DBMS) that guards integrity, answers questions fast, and lets many people use it at once without stepping on each other.",
        "order": 1,
        "phases": [
          {
            "slug": "01-more-than-a-spreadsheet",
            "title": "More Than a Spreadsheet",
            "phaseNum": "1",
            "order": 1,
            "summary": "A database is two things at once: an organized store of data, plus a running program (the DBMS) that controls access, protects integrity, and lets many people use the data at the same time \u2014 which is exactly what files and spreadsheets can't do.",
            "filePath": "/guides/databases/what-a-database-is/01-more-than-a-spreadsheet.md"
          },
          {
            "slug": "02-tables-rows-columns-keys",
            "title": "Tables, Rows, Columns & Keys",
            "phaseNum": "2",
            "order": 2,
            "summary": "The relational model in plain terms: data lives in tables made of rows (records) and typed columns (fields), the schema is the agreed shape every row must follow, and a key is the unique id that lets you point to exactly one row.",
            "filePath": "/guides/databases/what-a-database-is/02-tables-rows-columns-keys.md"
          },
          {
            "slug": "03-the-database-vs-your-app",
            "title": "The Database vs Your App",
            "phaseNum": "3",
            "order": 3,
            "summary": "A database is a separate server program you talk to over a connection, using a language called SQL to ask for and change data \u2014 and relational databases like PostgreSQL and MySQL are one family in a larger landscape.",
            "filePath": "/guides/databases/what-a-database-is/03-the-database-vs-your-app.md"
          }
        ]
      },
      {
        "slug": "querying-basics-select-where",
        "title": "SELECT, WHERE & Friends: Querying Basics",
        "summary": "How to read and change data with SQL: the SELECT query shape, filtering and sorting with WHERE/ORDER BY/LIMIT, and adding/changing/removing rows with INSERT/UPDATE/DELETE \u2014 without the career-defining accidents.",
        "order": 2,
        "phases": [
          {
            "slug": "01-asking-for-data",
            "title": "Asking for Data: SELECT ... FROM",
            "phaseNum": "1",
            "order": 1,
            "summary": "Every query starts from the same shape \u2014 SELECT which columns FROM which table. Learn to pick specific columns vs. grab everything with *, and how to read the rows-and-columns result set you get back.",
            "filePath": "/guides/databases/querying-basics-select-where/01-asking-for-data.md"
          },
          {
            "slug": "02-filtering-and-sorting",
            "title": "Filtering & Sorting: WHERE, ORDER BY, LIMIT",
            "phaseNum": "2",
            "order": 2,
            "summary": "Narrow a query to the rows you actually want with WHERE (=, >, LIKE, IN, AND/OR), put them in order with ORDER BY, and take only the top few with LIMIT \u2014 plus the NULL trap that means you must use IS NULL, not = NULL.",
            "filePath": "/guides/databases/querying-basics-select-where/02-filtering-and-sorting.md"
          },
          {
            "slug": "03-changing-data",
            "title": "Changing Data: INSERT, UPDATE, DELETE",
            "phaseNum": "3",
            "order": 3,
            "summary": "Add rows with INSERT, modify them with UPDATE, and remove them with DELETE \u2014 and the career-defining gotcha: an UPDATE or DELETE without a WHERE rewrites or erases every row in the table. Learn the WHERE-first habit and how transactions can undo a mistake.",
            "filePath": "/guides/databases/querying-basics-select-where/03-changing-data.md"
          }
        ]
      },
      {
        "slug": "relationships-and-keys",
        "title": "Relationships & Keys (Primary & Foreign)",
        "summary": "Why real data lives in several linked tables instead of one big one, what primary and foreign keys actually are, and how they let the database enforce that your records stay connected and consistent.",
        "order": 3,
        "phases": [
          {
            "slug": "01-why-split-data-into-tables",
            "title": "Why Split Data Into Tables",
            "phaseNum": "1",
            "order": 1,
            "summary": "One giant table repeats the same facts in row after row, which lets them drift out of sync; the fix is to store each kind of thing once, in its own table, and have the other tables reference it.",
            "filePath": "/guides/databases/relationships-and-keys/01-why-split-data-into-tables.md"
          },
          {
            "slug": "02-primary-keys",
            "title": "Primary Keys",
            "phaseNum": "2",
            "order": 2,
            "summary": "A primary key is the one column whose value uniquely and permanently names each row, so the rest of the database has a stable thing to point at; auto-incrementing numbers usually beat real-world values for the job.",
            "filePath": "/guides/databases/relationships-and-keys/02-primary-keys.md"
          },
          {
            "slug": "03-foreign-keys-and-referential-integrity",
            "title": "Foreign Keys & Referential Integrity",
            "phaseNum": "3",
            "order": 3,
            "summary": "A foreign key is a column that holds another table's primary key, turning a loose number into an enforced link; it models one-to-many and (via junction tables) many-to-many, and lets the database refuse to create orphaned rows.",
            "filePath": "/guides/databases/relationships-and-keys/03-foreign-keys-and-referential-integrity.md"
          }
        ]
      },
      {
        "slug": "sql-joins-explained",
        "title": "SQL Joins, Finally Explained",
        "summary": "What a JOIN actually is, why your data lives in separate tables in the first place, and how INNER, LEFT, and the others stitch those tables back together without surprising you.",
        "order": 4,
        "phases": [
          {
            "slug": "01-why-joins-exist",
            "title": "Why Joins Exist",
            "phaseNum": "1",
            "order": 1,
            "summary": "You split data into separate, linked tables on purpose; a JOIN matches rows from one table to rows in another using the shared key, so you can ask questions that span both.",
            "filePath": "/guides/databases/sql-joins-explained/01-why-joins-exist.md"
          },
          {
            "slug": "02-inner-vs-left",
            "title": "INNER vs LEFT (and the Others)",
            "phaseNum": "2",
            "order": 2,
            "summary": "INNER JOIN keeps only rows that match on both sides; LEFT JOIN keeps every row from the left table and fills NULLs where there's no match. RIGHT and FULL are the mirror and the union of those two.",
            "filePath": "/guides/databases/sql-joins-explained/02-inner-vs-left.md"
          },
          {
            "slug": "03-join-gotchas",
            "title": "Join Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "The accidental cartesian explosion from a missing or wrong ON condition, NULLs from outer joins quietly breaking your WHERE, joining on the wrong columns, and a simple row-count sanity check to catch all three.",
            "filePath": "/guides/databases/sql-joins-explained/03-join-gotchas.md"
          }
        ]
      },
      {
        "slug": "why-is-my-query-slow",
        "title": "Why Is My Query Slow? (Indexes & EXPLAIN)",
        "summary": "A query that's instant on your laptop crawls in production because the database is reading every row to find matches; an index lets it jump straight to them, and EXPLAIN lets you see which one is happening.",
        "order": 5,
        "phases": [
          {
            "slug": "01-the-full-table-scan",
            "title": "The Full-Table Scan",
            "phaseNum": "1",
            "order": 1,
            "summary": "A database with no help reads every single row to find your matches \u2014 a full-table scan. That's invisible on 100 rows and brutal on 10 million, which is why a query is fast on your laptop and dying in prod.",
            "filePath": "/guides/databases/why-is-my-query-slow/01-the-full-table-scan.md"
          },
          {
            "slug": "02-indexes",
            "title": "Indexes",
            "phaseNum": "2",
            "order": 2,
            "summary": "An index is a separate, sorted structure (a B-tree) that lets the database jump straight to matching rows instead of scanning every one \u2014 like the index at the back of a book. It speeds up reads but costs you on writes and disk, so index the columns you filter, join, and sort on, not everything.",
            "filePath": "/guides/databases/why-is-my-query-slow/02-indexes.md"
          },
          {
            "slug": "03-reading-explain",
            "title": "Reading EXPLAIN",
            "phaseNum": "3",
            "order": 3,
            "summary": "EXPLAIN shows the database's plan for a query and EXPLAIN ANALYZE actually runs it; learn to read seq scan vs. index scan, compare estimated vs. actual rows to spot a bad plan, and follow the measure-add-index-recheck loop to fix a slow query for real.",
            "filePath": "/guides/databases/why-is-my-query-slow/03-reading-explain.md"
          }
        ]
      },
      {
        "slug": "transactions-and-acid",
        "title": "Transactions & ACID, Explained",
        "summary": "What a database transaction actually is, the four ACID guarantees in plain language, and what really goes wrong when transactions overlap \u2014 so you can make multiple changes all-or-nothing without losing sleep.",
        "order": 6,
        "phases": [
          {
            "slug": "01-what-a-transaction-is",
            "title": "What a Transaction Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A transaction is a bundle of database changes that either all happen or none do; you mark its edges with BEGIN, seal it with COMMIT, and throw the whole thing away with ROLLBACK.",
            "filePath": "/guides/databases/transactions-and-acid/01-what-a-transaction-is.md"
          },
          {
            "slug": "02-acid-explained",
            "title": "ACID, Explained",
            "phaseNum": "2",
            "order": 2,
            "summary": "ACID is four promises a database makes about transactions: Atomicity (all-or-nothing), Consistency (the rules always hold), Isolation (concurrent transactions don't corrupt each other), and Durability (once committed, it survives a crash).",
            "filePath": "/guides/databases/transactions-and-acid/02-acid-explained.md"
          },
          {
            "slug": "03-isolation-and-concurrency",
            "title": "Isolation & Concurrency in Real Life",
            "phaseNum": "3",
            "order": 3,
            "summary": "When transactions overlap you get dirty reads, non-repeatable reads, and phantoms; isolation levels are the dial that trades safety for speed; and deadlocks happen when two transactions wait on each other \u2014 apps handle them by retrying.",
            "filePath": "/guides/databases/transactions-and-acid/03-isolation-and-concurrency.md"
          }
        ]
      },
      {
        "slug": "database-migrations",
        "title": "Database Migrations Without Fear",
        "summary": "What a migration actually is (git for your schema), the golden pattern for changing live data safely, and the dangerous migrations that lock tables or break the running app \u2014 so you can change a production schema without losing data or taking downtime.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-a-migration-is",
            "title": "What a Migration Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A migration is a versioned, ordered change to your schema \u2014 checked into source control and applied the same way in every environment, like git for your database structure \u2014 usually with an 'up' that applies it and a 'down' that rolls it back.",
            "filePath": "/guides/databases/database-migrations/01-what-a-migration-is.md"
          },
          {
            "slug": "02-doing-it-safely-on-live-data",
            "title": "Doing It Safely on Live Data",
            "phaseNum": "2",
            "order": 2,
            "summary": "The golden pattern for live schema changes: add new structure first, backfill the data, then switch the app over \u2014 and the expand/contract (parallel-change) approach that keeps the running app working through a rename or type change with zero downtime.",
            "filePath": "/guides/databases/database-migrations/02-doing-it-safely-on-live-data.md"
          },
          {
            "slug": "03-the-dangerous-migrations",
            "title": "The Dangerous Migrations",
            "phaseNum": "3",
            "order": 3,
            "summary": "The migrations that bite: long locks on big tables that freeze writes for minutes, dropping or renaming columns the running app still uses, and non-nullable columns without defaults \u2014 plus always having a rollback plan and a real backup before you run anything destructive.",
            "filePath": "/guides/databases/database-migrations/03-the-dangerous-migrations.md"
          }
        ]
      },
      {
        "slug": "sql-vs-nosql",
        "title": "SQL vs NoSQL, Honestly",
        "summary": "A fair, two-sided look at relational vs NoSQL databases \u2014 what each is actually shaped for, the real trade-offs, and how to choose without joining a holy war.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-models",
            "title": "The Relational Model & What 'NoSQL' Even Means",
            "phaseNum": "1",
            "order": 1,
            "summary": "Relational means tables linked by relationships and queried with SQL; NoSQL is an umbrella over four different families \u2014 document, key-value, wide-column, and graph \u2014 each shaped for a different access pattern.",
            "filePath": "/guides/databases/sql-vs-nosql/01-the-models.md"
          },
          {
            "slug": "02-the-trade-offs",
            "title": "The Honest Trade-offs",
            "phaseNum": "2",
            "order": 2,
            "summary": "The real two-sided trade-offs: schema flexibility vs enforced integrity, joins vs denormalization, consistency vs horizontal scale, and query power vs raw speed for a known access pattern.",
            "filePath": "/guides/databases/sql-vs-nosql/02-the-trade-offs.md"
          },
          {
            "slug": "03-how-to-choose",
            "title": "How to Actually Choose",
            "phaseNum": "3",
            "order": 3,
            "summary": "The judgment call: a relational database is the boring-correct default for most apps; reach for a specific NoSQL store for a specific access pattern. Plus the two traps \u2014 NoSQL isn't schemaless, and you're allowed to mix.",
            "filePath": "/guides/databases/sql-vs-nosql/03-how-to-choose.md"
          }
        ]
      },
      {
        "slug": "scaling-a-database",
        "title": "Scaling a Database (Replication & Sharding)",
        "summary": "When one database box isn't enough: how to scale up and optimize first, scale reads with replication (and live with replication lag), and only then scale writes with sharding \u2014 and why sharding is the expensive last resort.",
        "order": 9,
        "phases": [
          {
            "slug": "01-the-bottleneck",
            "title": "The Bottleneck",
            "phaseNum": "1",
            "order": 1,
            "summary": "Before you scale out, scale up and optimize: indexes, queries, caching, and connection pooling fix most 'we need to scale' problems. And first figure out whether you're read-heavy or write-heavy \u2014 the two have completely different cures.",
            "filePath": "/guides/databases/scaling-a-database/01-the-bottleneck.md"
          },
          {
            "slug": "02-replication",
            "title": "Replication",
            "phaseNum": "2",
            "order": 2,
            "summary": "Keep live copies of your database: a leader takes all writes and streams them to followers, which serve reads. This scales reads and gives you failover \u2014 but followers can lag behind the leader, so your app must be ready for slightly stale reads.",
            "filePath": "/guides/databases/scaling-a-database/02-replication.md"
          },
          {
            "slug": "03-sharding",
            "title": "Sharding",
            "phaseNum": "3",
            "order": 3,
            "summary": "When writes outgrow one machine, sharding splits the data across machines by a shard key so each shard owns a slice of writes. It scales writes \u2014 at a steep cost: choosing the key, cross-shard queries and joins, rebalancing, and losing cross-shard transactions. The honest last resort.",
            "filePath": "/guides/databases/scaling-a-database/03-sharding.md"
          }
        ]
      },
      {
        "slug": "how-an-orm-works",
        "title": "How an ORM Works",
        "summary": "Understand the pattern under every ORM \u2014 Hibernate, SQLAlchemy, GORM, EF Core \u2014 instead of memorizing one library's API: the object-relational mismatch, mapping objects to tables, the identity map and unit of work, change tracking and dirty checking, lazy loading and the N+1 trap, how a query builder becomes SQL, and when not to use an ORM at all. Language-agnostic, concept-first.",
        "order": 10,
        "phases": [
          {
            "slug": "01-what-an-orm-is",
            "title": "What an ORM Is (the Mismatch)",
            "phaseNum": "1",
            "order": 1,
            "summary": "An ORM translates between your code's objects and a database's rows because the two don't line up \u2014 the object-relational impedance mismatch. Meet that mismatch and the four jobs every ORM does.",
            "filePath": "/guides/databases/how-an-orm-works/01-what-an-orm-is.md"
          },
          {
            "slug": "02-mapping-objects-to-tables",
            "title": "Mapping Objects to Tables",
            "phaseNum": "2",
            "order": 2,
            "summary": "The first job every ORM does: a set of correspondence rules turning classes into tables, fields into columns, references into foreign keys, and collections into one-to-many \u2014 by convention plus configuration.",
            "filePath": "/guides/databases/how-an-orm-works/02-mapping-objects-to-tables.md"
          },
          {
            "slug": "03-identity-map-and-unit-of-work",
            "title": "The Identity Map & Unit of Work",
            "phaseNum": "3",
            "order": 3,
            "summary": "Inside the ORM session: how it keeps one in-memory object per row (the identity map) and batches every change into a single all-or-nothing commit (the unit of work).",
            "filePath": "/guides/databases/how-an-orm-works/03-identity-map-and-unit-of-work.md"
          },
          {
            "slug": "04-change-tracking",
            "title": "Change Tracking & Dirty Checking",
            "phaseNum": "4",
            "order": 4,
            "summary": "How an ORM knows what to UPDATE without you calling save \u2014 snapshots and dirty checking, proxies and notifications, and the detached-object trap that bites every web app.",
            "filePath": "/guides/databases/how-an-orm-works/04-change-tracking.md"
          },
          {
            "slug": "05-lazy-loading-and-n-plus-1",
            "title": "Lazy Loading & the N+1 Trap",
            "phaseNum": "5",
            "order": 5,
            "summary": "When related data loads \u2014 lazy (on access) vs eager (up front) \u2014 and the N+1 query explosion every ORM can cause in an innocent loop, plus the fix and how to choose per query.",
            "filePath": "/guides/databases/how-an-orm-works/05-lazy-loading-and-n-plus-1.md"
          },
          {
            "slug": "06-building-the-query",
            "title": "Building the Query (to SQL)",
            "phaseNum": "6",
            "order": 6,
            "summary": "The ORM's fourth job: you describe a query in objects \u2014 a method chain, criteria, LINQ, or QuerySet \u2014 and it compiles that to parameterized SQL, runs nothing until you enumerate, and stays injection-safe by default.",
            "filePath": "/guides/databases/how-an-orm-works/06-building-the-query.md"
          },
          {
            "slug": "07-when-not-to-use-an-orm",
            "title": "When Not to Use an ORM",
            "phaseNum": "7",
            "order": 7,
            "summary": "The honest limits of ORMs \u2014 where they shine (CRUD over object graphs) versus where to reach for raw SQL or a micro-ORM, the alternatives spectrum, and where to go next.",
            "filePath": "/guides/databases/how-an-orm-works/07-when-not-to-use-an-orm.md"
          }
        ]
      },
      {
        "slug": "n-plus-one-queries",
        "title": "The N+1 Query Problem",
        "summary": "The ORM trap that is fast on seed data and dead in production: one query quietly becomes N+1. How to spot it and fix it.",
        "order": 11,
        "phases": [
          {
            "slug": "01-what-n-plus-one-is",
            "title": "What N+1 actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "The ORM trap that is fast on seed data and dead in production: one query quietly becomes N+1. How to spot it and fix it.",
            "filePath": "/guides/databases/n-plus-one-queries/01-what-n-plus-one-is.md"
          },
          {
            "slug": "02-seeing-it-in-the-logs",
            "title": "Seeing it in your logs",
            "phaseNum": "2",
            "order": 2,
            "summary": "The ORM trap that is fast on seed data and dead in production: one query quietly becomes N+1. How to spot it and fix it.",
            "filePath": "/guides/databases/n-plus-one-queries/02-seeing-it-in-the-logs.md"
          },
          {
            "slug": "03-fixing-it",
            "title": "Fixing it without over-fetching",
            "phaseNum": "3",
            "order": 3,
            "summary": "The ORM trap that is fast on seed data and dead in production: one query quietly becomes N+1. How to spot it and fix it.",
            "filePath": "/guides/databases/n-plus-one-queries/03-fixing-it.md"
          }
        ]
      },
      {
        "slug": "connection-pools",
        "title": "Database Connection Pools",
        "summary": "Why too many connections takes down production, what a database connection actually costs, and how pool sizing keeps app and database alive.",
        "order": 12,
        "phases": [
          {
            "slug": "01-what-a-connection-costs",
            "title": "What a connection actually costs",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why too many connections takes down production, what a database connection actually costs, and how pool sizing keeps app and database alive.",
            "filePath": "/guides/databases/connection-pools/01-what-a-connection-costs.md"
          },
          {
            "slug": "02-how-a-pool-works",
            "title": "How a pool works and how to size it",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why too many connections takes down production, what a database connection actually costs, and how pool sizing keeps app and database alive.",
            "filePath": "/guides/databases/connection-pools/02-how-a-pool-works.md"
          },
          {
            "slug": "03-when-pools-break",
            "title": "When pools break: exhaustion, leaks, and serverless storms",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why too many connections takes down production, what a database connection actually costs, and how pool sizing keeps app and database alive.",
            "filePath": "/guides/databases/connection-pools/03-when-pools-break.md"
          }
        ]
      },
      {
        "slug": "database-backups-and-restores",
        "title": "Database Backups and Restores",
        "summary": "A backup you have never restored is a hope, not a backup. Logical versus physical dumps, point-in-time recovery, and testing the restore.",
        "order": 13,
        "phases": [
          {
            "slug": "01-the-restore-is-the-real-thing",
            "title": "The Restore Is the Real Thing",
            "phaseNum": "1",
            "order": 1,
            "summary": "A backup exists only to be restored, so the restore is the thing you actually measure and test. RPO and RTO in plain terms, and why 'we have backups' carries no information.",
            "filePath": "/guides/databases/database-backups-and-restores/01-the-restore-is-the-real-thing.md"
          },
          {
            "slug": "02-the-three-kinds-of-backup",
            "title": "The Three Kinds of Backup",
            "phaseNum": "2",
            "order": 2,
            "summary": "Logical dumps versus physical snapshots versus the write-ahead log, what each one gives you, and how the WAL unlocks point-in-time recovery to the second before the bad command.",
            "filePath": "/guides/databases/database-backups-and-restores/02-the-three-kinds-of-backup.md"
          },
          {
            "slug": "03-when-it-breaks",
            "title": "When It Breaks",
            "phaseNum": "3",
            "order": 3,
            "summary": "The cautionary tale of the backup job that wrote empty files for months, the 3-2-1 rule, and how to automate, verify, and drill the restore so it works the day you need it.",
            "filePath": "/guides/databases/database-backups-and-restores/03-when-it-breaks.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "data-analytics",
    "name": "Data & Analytics",
    "icon": "ti-chart-histogram",
    "blurb": "Data pipelines, engineering, BI, and the ML basics - turning raw data into answers.",
    "guides": [
      {
        "slug": "what-is-data-engineering",
        "title": "What \\\"Data Engineering\\\" Even Is",
        "summary": "Data engineering is the plumbing that turns messy raw data into clean, trusted data people can make decisions on \u2014 here's the pipeline mental model and the pieces that make it up.",
        "order": 1,
        "phases": [
          {
            "slug": "01-from-raw-data-to-a-trusted-answer",
            "title": "From Raw Data to a Trusted Answer",
            "phaseNum": "1",
            "order": 1,
            "summary": "Data engineering builds the plumbing that turns messy raw data into clean, reliable data people can decide on \u2014 picture a river that flows through stages, getting clearer as it goes.",
            "filePath": "/guides/data-analytics/what-is-data-engineering/01-from-raw-data-to-a-trusted-answer.md"
          },
          {
            "slug": "02-the-pieces-of-the-pipeline",
            "title": "The Pieces of the Pipeline",
            "phaseNum": "2",
            "order": 2,
            "summary": "Walk the river stage by stage \u2014 sources, ingestion, storage, transform, serve \u2014 see what each does, and learn how a data engineer differs from an analyst and a scientist.",
            "filePath": "/guides/data-analytics/what-is-data-engineering/02-the-pieces-of-the-pipeline.md"
          },
          {
            "slug": "03-why-its-its-own-discipline",
            "title": "Why It's Its Own Discipline",
            "phaseNum": "3",
            "order": 3,
            "summary": "What makes data engineering genuinely hard and distinct: scale, reliability and reproducibility, schema drift, and trust \u2014 and why one bad row quietly poisons every decision downstream.",
            "filePath": "/guides/data-analytics/what-is-data-engineering/03-why-its-its-own-discipline.md"
          }
        ]
      },
      {
        "slug": "spreadsheets-to-sql-to-pipelines",
        "title": "Spreadsheets \u2192 SQL \u2192 Pipelines",
        "summary": "The natural progression most data work actually follows \u2014 start in a spreadsheet, graduate to SQL when the sheet breaks, and build a pipeline when the work has to run itself.",
        "order": 2,
        "phases": [
          {
            "slug": "01-where-everyone-starts-spreadsheets",
            "title": "Where Everyone Starts: Spreadsheets",
            "phaseNum": "1",
            "order": 1,
            "summary": "Spreadsheets win because they're visible, flexible, and instant \u2014 and they break on size, missing types, copy-paste errors, no single source of truth, and manual steps that can't be repeated.",
            "filePath": "/guides/data-analytics/spreadsheets-to-sql-to-pipelines/01-where-everyone-starts-spreadsheets.md"
          },
          {
            "slug": "02-outgrowing-the-sheet-sql-and-databases",
            "title": "Outgrowing the Sheet: SQL & Databases",
            "phaseNum": "2",
            "order": 2,
            "summary": "A database gives you one shared source of truth, real declared types and constraints, fast querying over millions of rows, and safe multi-user access \u2014 and SQL is how you ask it questions.",
            "filePath": "/guides/data-analytics/spreadsheets-to-sql-to-pipelines/02-outgrowing-the-sheet-sql-and-databases.md"
          },
          {
            "slug": "03-when-it-has-to-run-itself-pipelines",
            "title": "When It Has to Run Itself: Pipelines",
            "phaseNum": "3",
            "order": 3,
            "summary": "When data work must be automated, scheduled, and repeatable with no human redoing it every week, you build a pipeline \u2014 gaining reliability, reproducibility, and scale at the cost of engineering effort.",
            "filePath": "/guides/data-analytics/spreadsheets-to-sql-to-pipelines/03-when-it-has-to-run-itself-pipelines.md"
          }
        ]
      },
      {
        "slug": "etl-elt-pipelines",
        "title": "ETL & ELT Pipelines, Explained",
        "summary": "What a data pipeline actually is, the difference between transforming before or after you load, and what it takes to make a scheduled pipeline run reliably instead of just running.",
        "order": 3,
        "phases": [
          {
            "slug": "01-extract-transform-load",
            "title": "Extract, Transform, Load",
            "phaseNum": "1",
            "order": 1,
            "summary": "A pipeline is an assembly line with three stages: extract pulls data from sources, transform cleans and reshapes it, and load writes it where people use it.",
            "filePath": "/guides/data-analytics/etl-elt-pipelines/01-extract-transform-load.md"
          },
          {
            "slug": "02-etl-vs-elt",
            "title": "ETL vs ELT",
            "phaseNum": "2",
            "order": 2,
            "summary": "ETL transforms before loading (the classic order, born when compute was scarce); ELT loads raw data first and transforms it inside a powerful cloud warehouse \u2014 preserving the raw data and letting you transform with SQL.",
            "filePath": "/guides/data-analytics/etl-elt-pipelines/02-etl-vs-elt.md"
          },
          {
            "slug": "03-orchestration",
            "title": "Orchestration: Making It Run Reliably",
            "phaseNum": "3",
            "order": 3,
            "summary": "A real pipeline is a scheduled, multi-step job: dependencies form a DAG, steps run on a schedule with retries, and steps must be idempotent so re-runs and backfills don't double-count \u2014 because 'it ran' is not the same as 'it ran correctly.'",
            "filePath": "/guides/data-analytics/etl-elt-pipelines/03-orchestration.md"
          }
        ]
      },
      {
        "slug": "warehouses-vs-lakes",
        "title": "Data Warehouses vs Lakes, Honestly",
        "summary": "What a data warehouse actually is, what a data lake (and lakehouse) actually is, and how to choose or combine them without ending up with an expensive bill or a data swamp.",
        "order": 4,
        "phases": [
          {
            "slug": "01-the-warehouse",
            "title": "The Warehouse \u2014 A Database Built for Analytics",
            "phaseNum": "1",
            "order": 1,
            "summary": "A data warehouse is a database optimized for analytical questions over huge tables, not for app transactions: structured, schema-on-write, and columnar so aggregations stay fast.",
            "filePath": "/guides/data-analytics/warehouses-vs-lakes/01-the-warehouse.md"
          },
          {
            "slug": "02-the-lake-and-lakehouse",
            "title": "The Lake (and Lakehouse) \u2014 Store Everything, Decide Later",
            "phaseNum": "2",
            "order": 2,
            "summary": "A data lake stores everything raw and cheap as files in object storage with schema-on-read, which buys flexibility for ML and unstructured data but risks becoming a data swamp; the lakehouse adds warehouse-like tables on top of lake storage.",
            "filePath": "/guides/data-analytics/warehouses-vs-lakes/02-the-lake-and-lakehouse.md"
          },
          {
            "slug": "03-choosing-and-combining",
            "title": "Choosing & Combining \u2014 It's Rarely Either/Or",
            "phaseNum": "3",
            "order": 3,
            "summary": "An honest side-by-side of warehouse vs lake, why most organizations land raw data in a lake then model curated tables in a warehouse for BI, and why governance is the difference between a useful lake and a data swamp.",
            "filePath": "/guides/data-analytics/warehouses-vs-lakes/03-choosing-and-combining.md"
          }
        ]
      },
      {
        "slug": "bi-dashboards-that-work",
        "title": "Building a BI Dashboard That's Actually Useful",
        "summary": "A dashboard is an answer to a recurring question, not a pile of charts. Start from the decision, pick metrics that change minds, and design something people actually open.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-bi-actually-is",
            "title": "What BI Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Business intelligence is helping people make decisions with data. A dashboard is an answer to a recurring question, not a pile of charts \u2014 so start from the decision and work backward to the metric.",
            "filePath": "/guides/data-analytics/bi-dashboards-that-work/01-what-bi-actually-is.md"
          },
          {
            "slug": "02-metrics-that-inform",
            "title": "Metrics That Inform vs Vanity Metrics",
            "phaseNum": "2",
            "order": 2,
            "summary": "A useful metric changes a decision; a vanity metric only feels good. Choose the right aggregation, the right denominator, and add the context \u2014 comparison, target, trend \u2014 that turns a number into meaning.",
            "filePath": "/guides/data-analytics/bi-dashboards-that-work/02-metrics-that-inform.md"
          },
          {
            "slug": "03-designing-one-people-use",
            "title": "Designing One People Actually Use",
            "phaseNum": "3",
            "order": 3,
            "summary": "Lay out the most important answer first, pick the chart that fits the question, and dodge the traps that mislead even with good data: bad axes, wrong aggregation, no context, and the dashboard with no owner.",
            "filePath": "/guides/data-analytics/bi-dashboards-that-work/03-designing-one-people-use.md"
          }
        ]
      },
      {
        "slug": "ml-basics-for-data-people",
        "title": "ML Basics for Data People",
        "summary": "What machine learning actually is from a data perspective \u2014 learning patterns from history instead of hand-writing rules, the workflow from features to evaluation, and why ML lives or dies on your data.",
        "order": 6,
        "phases": [
          {
            "slug": "01-what-ml-actually-is",
            "title": "What ML Actually Is (for Data People)",
            "phaseNum": "1",
            "order": 1,
            "summary": "Machine learning learns patterns from historical data to predict on new data, instead of you hand-writing rules \u2014 supervised learning predicts from labeled examples, unsupervised finds structure with no labels.",
            "filePath": "/guides/data-analytics/ml-basics-for-data-people/01-what-ml-actually-is.md"
          },
          {
            "slug": "02-the-workflow",
            "title": "The Workflow",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a supervised ML project actually flows: features are the input columns the model learns from, you split into train and test to measure on unseen data, you train, then you evaluate \u2014 and accuracy alone can hide a useless model.",
            "filePath": "/guides/data-analytics/ml-basics-for-data-people/02-the-workflow.md"
          },
          {
            "slug": "03-where-data-people-fit",
            "title": "Where Data People Fit",
            "phaseNum": "3",
            "order": 3,
            "summary": "The unglamorous truth: ML lives or dies on data \u2014 clean inputs, good features, leak-free splits, reliable pipelines. The model is the easy part, and that's exactly where a data person is most valuable.",
            "filePath": "/guides/data-analytics/ml-basics-for-data-people/03-where-data-people-fit.md"
          }
        ]
      },
      {
        "slug": "data-quality-and-observability",
        "title": "Data Quality & Pipeline Observability",
        "summary": "How to trust the numbers your pipelines produce: why a green job can still ship wrong data, the checks that catch silent breakage, and the observability that finds it before a human makes a decision on it.",
        "order": 7,
        "phases": [
          {
            "slug": "01-why-trust-is-the-whole-product",
            "title": "Why Trust Is the Whole Product",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model: data can be broken even when the job is green. A silent data bug \u2014 wrong numbers from a pipeline that 'succeeded' \u2014 is worse than a loud crash, because nobody knows to look until a decision is made on it.",
            "filePath": "/guides/data-analytics/data-quality-and-observability/01-why-trust-is-the-whole-product.md"
          },
          {
            "slug": "02-data-quality-checks",
            "title": "Data Quality Checks",
            "phaseNum": "2",
            "order": 2,
            "summary": "The dimensions worth testing automatically \u2014 freshness, volume, schema, and validity (nulls, uniqueness, ranges) \u2014 where to run them so the pipeline fails fast, and an annotated check that turns a silent data bug into a loud one.",
            "filePath": "/guides/data-analytics/data-quality-and-observability/02-data-quality-checks.md"
          },
          {
            "slug": "03-pipeline-observability",
            "title": "Pipeline Observability",
            "phaseNum": "3",
            "order": 3,
            "summary": "Seeing the whole system: lineage to trace which downstream tables a broken source poisons, monitoring and alerting on your quality checks, and data SLAs \u2014 so the silent failure trips a wire before a human ever reads the bad number. Plus how to avoid alert fatigue.",
            "filePath": "/guides/data-analytics/data-quality-and-observability/03-pipeline-observability.md"
          }
        ]
      },
      {
        "slug": "sql-window-functions",
        "title": "SQL Window Functions",
        "summary": "The analyst superpower: running totals, rankings, and row-to-row comparisons without collapsing rows. OVER, PARTITION BY, and lag and lead.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-window-not-the-group",
            "title": "The window, not the group",
            "phaseNum": "1",
            "order": 1,
            "summary": "The analyst superpower: running totals, rankings, and row-to-row comparisons without collapsing rows. OVER, PARTITION BY, and lag and lead.",
            "filePath": "/guides/data-analytics/sql-window-functions/01-the-window-not-the-group.md"
          },
          {
            "slug": "02-over-partition-order",
            "title": "OVER, PARTITION BY, ORDER BY",
            "phaseNum": "2",
            "order": 2,
            "summary": "The analyst superpower: running totals, rankings, and row-to-row comparisons without collapsing rows. OVER, PARTITION BY, and lag and lead.",
            "filePath": "/guides/data-analytics/sql-window-functions/02-over-partition-order.md"
          },
          {
            "slug": "03-frames-and-top-n",
            "title": "Frames, moving averages, and top-N-per-group",
            "phaseNum": "3",
            "order": 3,
            "summary": "The analyst superpower: running totals, rankings, and row-to-row comparisons without collapsing rows. OVER, PARTITION BY, and lag and lead.",
            "filePath": "/guides/data-analytics/sql-window-functions/03-frames-and-top-n.md"
          }
        ]
      },
      {
        "slug": "metrics-that-lie",
        "title": "Metrics That Lie",
        "summary": "How honest-looking numbers mislead: averages hiding skew, survivorship bias, Simpson's paradox, and vanity metrics. Read a dashboard without being fooled.",
        "order": 9,
        "phases": [
          {
            "slug": "01-the-average-is-lying",
            "title": "The Average Is Lying to You",
            "phaseNum": "1",
            "order": 1,
            "summary": "How honest-looking numbers mislead: averages hiding skew, survivorship bias, Simpson's paradox, and vanity metrics. Read a dashboard without being fooled.",
            "filePath": "/guides/data-analytics/metrics-that-lie/01-the-average-is-lying.md"
          },
          {
            "slug": "02-the-data-you-never-see",
            "title": "The Data You Never See",
            "phaseNum": "2",
            "order": 2,
            "summary": "How honest-looking numbers mislead: averages hiding skew, survivorship bias, Simpson's paradox, and vanity metrics. Read a dashboard without being fooled.",
            "filePath": "/guides/data-analytics/metrics-that-lie/02-the-data-you-never-see.md"
          },
          {
            "slug": "03-reading-without-getting-fooled",
            "title": "Reading a Dashboard Without Getting Fooled",
            "phaseNum": "3",
            "order": 3,
            "summary": "How honest-looking numbers mislead: averages hiding skew, survivorship bias, Simpson's paradox, and vanity metrics. Read a dashboard without being fooled.",
            "filePath": "/guides/data-analytics/metrics-that-lie/03-reading-without-getting-fooled.md"
          }
        ]
      },
      {
        "slug": "ab-testing-explained",
        "title": "A/B Testing, Explained",
        "summary": "How randomized splits let you measure which variant actually performs better, and the three ways teams accidentally fool themselves with the results.",
        "order": 10,
        "phases": [
          {
            "slug": "01-why-randomize",
            "title": "Why you'd randomize at all",
            "phaseNum": "1",
            "order": 1,
            "summary": "How randomized splits let you measure which variant actually performs better, and the three ways teams accidentally fool themselves with the results.",
            "filePath": "/guides/data-analytics/ab-testing-explained/01-why-randomize.md"
          },
          {
            "slug": "02-structuring-a-test",
            "title": "How a real test is structured",
            "phaseNum": "2",
            "order": 2,
            "summary": "How randomized splits let you measure which variant actually performs better, and the three ways teams accidentally fool themselves with the results.",
            "filePath": "/guides/data-analytics/ab-testing-explained/02-structuring-a-test.md"
          },
          {
            "slug": "03-how-teams-fool-themselves",
            "title": "How teams fool themselves",
            "phaseNum": "3",
            "order": 3,
            "summary": "How randomized splits let you measure which variant actually performs better, and the three ways teams accidentally fool themselves with the results.",
            "filePath": "/guides/data-analytics/ab-testing-explained/03-how-teams-fool-themselves.md"
          }
        ]
      },
      {
        "slug": "star-schema-explained",
        "title": "The Star Schema, Explained",
        "summary": "The dimensional-modeling pattern behind most data warehouses \u2014 one fact table surrounded by dimension tables \u2014 and why it's shaped that way on purpose.",
        "order": 11,
        "phases": [
          {
            "slug": "01-facts-vs-dimensions",
            "title": "Facts vs. dimensions",
            "phaseNum": "1",
            "order": 1,
            "summary": "The dimensional-modeling pattern behind most data warehouses \u2014 one fact table surrounded by dimension tables \u2014 and why it's shaped that way on purpose.",
            "filePath": "/guides/data-analytics/star-schema-explained/01-facts-vs-dimensions.md"
          },
          {
            "slug": "02-why-a-star",
            "title": "Why it's shaped like a star",
            "phaseNum": "2",
            "order": 2,
            "summary": "The dimensional-modeling pattern behind most data warehouses \u2014 one fact table surrounded by dimension tables \u2014 and why it's shaped that way on purpose.",
            "filePath": "/guides/data-analytics/star-schema-explained/02-why-a-star.md"
          },
          {
            "slug": "03-star-vs-snowflake",
            "title": "Star vs. snowflake, and when to use it",
            "phaseNum": "3",
            "order": 3,
            "summary": "The dimensional-modeling pattern behind most data warehouses \u2014 one fact table surrounded by dimension tables \u2014 and why it's shaped that way on purpose.",
            "filePath": "/guides/data-analytics/star-schema-explained/03-star-vs-snowflake.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "apis",
    "name": "APIs & Integration",
    "icon": "ti-plug-connected",
    "blurb": "REST, GraphQL, gRPC, webhooks, and message queues - how systems talk to each other.",
    "guides": [
      {
        "slug": "what-an-api-is",
        "title": "What an API Actually Is",
        "summary": "An API is a defined way for one program to ask another for something \u2014 a contract that says what you can ask and what you'll get back \u2014 and this guide builds that mental model from the ground up before you touch any code.",
        "order": 1,
        "phases": [
          {
            "slug": "01-a-contract-between-programs",
            "title": "A Contract Between Programs",
            "phaseNum": "1",
            "order": 1,
            "summary": "An API is a defined way for one program to ask another for something \u2014 a promise about what you can ask and what you'll get back \u2014 while the internals stay hidden, the way a restaurant menu lets you order without going into the kitchen.",
            "filePath": "/guides/apis/what-an-api-is/01-a-contract-between-programs.md"
          },
          {
            "slug": "02-why-apis-exist",
            "title": "Why APIs Exist",
            "phaseNum": "2",
            "order": 2,
            "summary": "APIs exist for three reasons \u2014 reuse (don't rebuild maps or payments yourself), separation (the frontend talks to the backend through a clean line), and integration (your app uses someone else's service) \u2014 all resting on one idea: a stable boundary you can depend on while the other side changes.",
            "filePath": "/guides/apis/what-an-api-is/02-why-apis-exist.md"
          },
          {
            "slug": "03-kinds-of-apis",
            "title": "Kinds of APIs",
            "phaseNum": "3",
            "order": 3,
            "summary": "APIs come in two broad kinds \u2014 local/library APIs that live inside your own program, and web APIs you reach across the network \u2014 and within web APIs there are a few common styles (REST, GraphQL, gRPC) that this guide names but doesn't teach, pointing you to HTTP and JSON next.",
            "filePath": "/guides/apis/what-an-api-is/03-kinds-of-apis.md"
          }
        ]
      },
      {
        "slug": "http-and-json-api-basics",
        "title": "HTTP & JSON: the API Building Blocks",
        "summary": "Every web API is made of two things: HTTP carries the message, JSON carries the data. Learn both well enough to read any API call with confidence.",
        "order": 2,
        "phases": [
          {
            "slug": "01-http-the-transport",
            "title": "HTTP, the Transport",
            "phaseNum": "1",
            "order": 1,
            "summary": "A web API rides on HTTP: every call is a request (method + URL + headers) and a response (status code + headers + body). Here's the API-shaped recap.",
            "filePath": "/guides/apis/http-and-json-api-basics/01-http-the-transport.md"
          },
          {
            "slug": "02-json-the-data-format",
            "title": "JSON, the Data Format",
            "phaseNum": "2",
            "order": 2,
            "summary": "JSON is structured data written as text: objects, arrays, strings, numbers, booleans, and null. It won because it's human-readable and language-neutral. Here's how to read and write it.",
            "filePath": "/guides/apis/http-and-json-api-basics/02-json-the-data-format.md"
          },
          {
            "slug": "03-a-real-api-call",
            "title": "A Real API Call",
            "phaseNum": "3",
            "order": 3,
            "summary": "Put HTTP and JSON together: GET a JSON API and read the response, then POST a JSON body with the right headers. Annotated curl transcripts of both.",
            "filePath": "/guides/apis/http-and-json-api-basics/03-a-real-api-call.md"
          }
        ]
      },
      {
        "slug": "rest-apis-explained",
        "title": "REST APIs, Explained",
        "summary": "The mental model behind the web's dominant API style \u2014 things live at URLs, HTTP methods are the verbs you apply to them, and every request stands on its own.",
        "order": 3,
        "phases": [
          {
            "slug": "01-resources-and-verbs",
            "title": "Resources & Verbs \u2014 The REST Mental Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "The whole of REST rests on three ideas: things (resources) live at URLs, HTTP methods are the verbs you apply to them, and every request carries everything the server needs (statelessness).",
            "filePath": "/guides/apis/rest-apis-explained/01-resources-and-verbs.md"
          },
          {
            "slug": "02-designing-endpoints",
            "title": "Designing Endpoints \u2014 Conventions That Read Well",
            "phaseNum": "2",
            "order": 2,
            "summary": "The practical conventions of good REST: name URLs with nouns not verbs, treat collections and items consistently, return meaningful status codes, and use query params for filtering, sorting, and pagination.",
            "filePath": "/guides/apis/rest-apis-explained/02-designing-endpoints.md"
          },
          {
            "slug": "03-rest-in-the-real-world",
            "title": "REST in the Real World \u2014 Where It Bends and Where It Breaks",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest truth: REST is a style, not a strict law, and most 'REST' APIs are pragmatic. Here are its real pain points \u2014 over- and under-fetching, too many round trips, and versioning \u2014 and where they lead.",
            "filePath": "/guides/apis/rest-apis-explained/03-rest-in-the-real-world.md"
          }
        ]
      },
      {
        "slug": "reading-api-docs-postman",
        "title": "Reading API Docs & Using Postman",
        "summary": "How to go from an unfamiliar API docs page to a working request: read the reference, fire the call in Postman or curl, and read the response \u2014 without guessing.",
        "order": 4,
        "phases": [
          {
            "slug": "01-how-to-read-api-docs",
            "title": "How to Read API Docs",
            "phaseNum": "1",
            "order": 1,
            "summary": "Every API reference is telling you the same five things: the base URL, the endpoint and method, the parameters, the auth requirement, and an example request and response. Learn where each one lives so you can skim straight to it.",
            "filePath": "/guides/apis/reading-api-docs-postman/01-how-to-read-api-docs.md"
          },
          {
            "slug": "02-making-the-request",
            "title": "Making the Request (Postman & curl)",
            "phaseNum": "2",
            "order": 2,
            "summary": "Postman and curl are two interfaces to the same thing \u2014 building an HTTP request out of a method, URL, headers, and body. Build one GET-with-auth request both ways, with an annotated curl transcript.",
            "filePath": "/guides/apis/reading-api-docs-postman/02-making-the-request.md"
          },
          {
            "slug": "03-reading-the-response",
            "title": "Reading the Response & Iterating",
            "phaseNum": "3",
            "order": 3,
            "summary": "Read the status code before the body, tweak parameters and re-send, and save requests into Postman collections with variables for base URL and token \u2014 without ever leaking your API key.",
            "filePath": "/guides/apis/reading-api-docs-postman/03-reading-the-response.md"
          }
        ]
      },
      {
        "slug": "graphql-explained",
        "title": "GraphQL, Explained",
        "summary": "What GraphQL actually is, the REST pain it was built to fix, how its typed schema and single endpoint work, and the honest trade-offs that tell you when to reach for it and when not to.",
        "order": 5,
        "phases": [
          {
            "slug": "01-the-problem-rest-leaves",
            "title": "The Problem REST Leaves",
            "phaseNum": "1",
            "order": 1,
            "summary": "REST endpoints over-fetch (they hand you more fields than you asked for) and under-fetch (you need several round trips to build one screen); GraphQL's pitch is to ask for exactly the fields you want and get exactly those, in one request.",
            "filePath": "/guides/apis/graphql-explained/01-the-problem-rest-leaves.md"
          },
          {
            "slug": "02-how-graphql-works",
            "title": "How GraphQL Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "The pieces that make GraphQL run: a typed schema as the contract, one endpoint for everything, queries for reads and mutations for writes, and the rule that the response mirrors the request \u2014 shown with an annotated query and its matching JSON.",
            "filePath": "/guides/apis/graphql-explained/02-how-graphql-works.md"
          },
          {
            "slug": "03-the-honest-trade-offs",
            "title": "The Honest Trade-offs",
            "phaseNum": "3",
            "order": 3,
            "summary": "GraphQL isn't free: caching is harder than REST because there's no URL-per-resource, the N+1 problem hits resolvers on the server, flexible queries open the door to complexity and abuse, and you take on extra tooling. When REST or gRPC is the better choice.",
            "filePath": "/guides/apis/graphql-explained/03-the-honest-trade-offs.md"
          }
        ]
      },
      {
        "slug": "grpc-explained",
        "title": "gRPC, Explained",
        "summary": "What gRPC actually is \u2014 a contract-first way for internal services to call each other fast \u2014 how the .proto file, code generation, and HTTP/2 streaming fit together, and the honest trade-offs versus REST and GraphQL.",
        "order": 6,
        "phases": [
          {
            "slug": "01-the-problem-grpc-solves",
            "title": "The Problem gRPC Solves",
            "phaseNum": "1",
            "order": 1,
            "summary": "Internal services that call each other thousands of times need both speed and a strict typed contract; gRPC answers with contract-first design (Protocol Buffers) and compact binary messages over HTTP/2.",
            "filePath": "/guides/apis/grpc-explained/01-the-problem-grpc-solves.md"
          },
          {
            "slug": "02-how-grpc-works",
            "title": "How gRPC Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "The .proto file defines services and messages; a code generator turns it into client and server stubs in many languages; messages travel as compact binary; and gRPC offers four call types \u2014 unary plus three streaming modes.",
            "filePath": "/guides/apis/grpc-explained/02-how-grpc-works.md"
          },
          {
            "slug": "03-the-honest-trade-offs",
            "title": "The Honest Trade-offs",
            "phaseNum": "3",
            "order": 3,
            "summary": "gRPC's binary payloads aren't human-readable and need special tools to debug; browsers can't speak it directly without grpc-web and a proxy; the learning curve is real. It shines for internal microservice traffic and is a poor fit for public, browser-facing APIs \u2014 with a fair REST-vs-GraphQL-vs-gRPC table.",
            "filePath": "/guides/apis/grpc-explained/03-the-honest-trade-offs.md"
          }
        ]
      },
      {
        "slug": "webhooks-and-message-queues",
        "title": "Webhooks & Message Queues \u2014 Events and Async Integration Beyond Request/Response",
        "summary": "How services talk to each other when one of them isn't waiting for an answer: webhooks let another system call your URL when something happens, and message queues let your own services hand off work to be done later.",
        "order": 7,
        "phases": [
          {
            "slug": "01-push-vs-pull-webhooks",
            "title": "Push vs Pull: Webhooks",
            "phaseNum": "1",
            "order": 1,
            "summary": "Polling means asking 'any news?' over and over and mostly hearing 'no'; a webhook flips it so the other service POSTs to your URL the moment something happens \u2014 and because anyone can POST to that URL, you must verify the request is genuine.",
            "filePath": "/guides/apis/webhooks-and-message-queues/01-push-vs-pull-webhooks.md"
          },
          {
            "slug": "02-message-queues",
            "title": "Message Queues",
            "phaseNum": "2",
            "order": 2,
            "summary": "A message queue is a shared to-do list between your services: a producer drops a message and moves on, a consumer picks it up when it's ready \u2014 which decouples them, absorbs traffic spikes, and lets work survive even if the consumer is temporarily down.",
            "filePath": "/guides/apis/webhooks-and-message-queues/02-message-queues.md"
          },
          {
            "slug": "03-when-to-use-which",
            "title": "When to Use Which (and the Gotchas)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Webhooks are for cross-system event notifications; queues are for internal async work and smoothing load \u2014 and both deliver at-least-once, so the same event can arrive twice, which is why your handlers must be idempotent. Plus retries, ordering, and dead-letter queues, gently.",
            "filePath": "/guides/apis/webhooks-and-message-queues/03-when-to-use-which.md"
          }
        ]
      },
      {
        "slug": "designing-apis-that-last",
        "title": "Versioning & Designing APIs That Last",
        "summary": "An API is a promise to everyone who built on it: what counts as a breaking change, how to evolve without breaking clients (additive-first, then versioning + deprecation), and the durable-API checklist \u2014 consistent shapes, pagination, idempotency, rate limits, and great docs.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-contract-is-forever",
            "title": "The Contract Is Forever",
            "phaseNum": "1",
            "order": 1,
            "summary": "The moment a client depends on your API, a breaking change breaks them silently in production; this phase defines what counts as breaking (removing or renaming fields, changing types or meaning) versus a safe additive change, and the mindset that follows.",
            "filePath": "/guides/apis/designing-apis-that-last/01-the-contract-is-forever.md"
          },
          {
            "slug": "02-versioning-strategies",
            "title": "Versioning Strategies",
            "phaseNum": "2",
            "order": 2,
            "summary": "How to evolve an API without breaking clients: prefer additive changes, and when you must break, version (URL /v2/ vs header), run versions in parallel, and deprecate on a clear timeline with real communication \u2014 with the honest trade-offs of each approach.",
            "filePath": "/guides/apis/designing-apis-that-last/02-versioning-strategies.md"
          },
          {
            "slug": "03-designing-for-longevity",
            "title": "Designing for Longevity",
            "phaseNum": "3",
            "order": 3,
            "summary": "The durable-API checklist: consistent resource and error shapes, pagination from day one, idempotency keys for safe retries, rate limits, sensible defaults, and great docs \u2014 plus the trap of leaking your internal database structure into your public contract.",
            "filePath": "/guides/apis/designing-apis-that-last/03-designing-for-longevity.md"
          }
        ]
      },
      {
        "slug": "rate-limits-and-retries",
        "title": "Rate Limits and Retries",
        "summary": "Calling a flaky or throttled API without melting it or yourself: 429s, exponential backoff with jitter, idempotency, and circuit breakers.",
        "order": 9,
        "phases": [
          {
            "slug": "01-why-apis-push-back",
            "title": "Why APIs Push Back",
            "phaseNum": "1",
            "order": 1,
            "summary": "Rate limits aren't an insult \u2014 they're how a shared service stays up for everyone. Token buckets, the 429 status, and the Retry-After header that tells you exactly how long to wait.",
            "filePath": "/guides/apis/rate-limits-and-retries/01-why-apis-push-back.md"
          },
          {
            "slug": "02-retrying-without-making-it-worse",
            "title": "Retrying Without Making It Worse",
            "phaseNum": "2",
            "order": 2,
            "summary": "Exponential backoff, why jitter is non-negotiable, a retry budget so you give up gracefully, and the golden rule of only retrying requests that are safe to repeat.",
            "filePath": "/guides/apis/rate-limits-and-retries/02-retrying-without-making-it-worse.md"
          },
          {
            "slug": "03-when-retrying-isnt-enough",
            "title": "When Retrying Isn't Enough",
            "phaseNum": "3",
            "order": 3,
            "summary": "The thundering-herd problem, the circuit breaker that stops you hammering a downed service, and what it really means to be a good client.",
            "filePath": "/guides/apis/rate-limits-and-retries/03-when-retrying-isnt-enough.md"
          }
        ]
      },
      {
        "slug": "realtime-apis-websockets-sse",
        "title": "Realtime APIs: WebSockets vs SSE vs Polling",
        "summary": "How to push live updates: the honest tradeoffs between polling, Server-Sent Events, and WebSockets, and which to reach for when.",
        "order": 10,
        "phases": [
          {
            "slug": "01-why-http-cant-push",
            "title": "Why HTTP Can't Push",
            "phaseNum": "1",
            "order": 1,
            "summary": "Plain HTTP is a pull: the client asks, the server answers, the line hangs up. Realtime means the server needs to start the conversation \u2014 and the three patterns (polling, SSE, WebSockets) are three ways to make that possible.",
            "filePath": "/guides/apis/realtime-apis-websockets-sse/01-why-http-cant-push.md"
          },
          {
            "slug": "02-the-three-patterns",
            "title": "The Three Patterns in Practice",
            "phaseNum": "2",
            "order": 2,
            "summary": "Hands-on: long-polling that holds the request open, a real SSE stream the browser reconnects for free, and a full-duplex WebSocket \u2014 plus the comparison table that tells you which to grab.",
            "filePath": "/guides/apis/realtime-apis-websockets-sse/02-the-three-patterns.md"
          },
          {
            "slug": "03-when-it-breaks-at-scale",
            "title": "When It Breaks at Scale",
            "phaseNum": "3",
            "order": 3,
            "summary": "One server is easy; many servers is the hard part. Sticky sessions, the fan-out problem, a pub/sub backplane, and the honest case for reaching for the simplest pattern that fits.",
            "filePath": "/guides/apis/realtime-apis-websockets-sse/03-when-it-breaks-at-scale.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "architecture",
    "name": "Architecture",
    "icon": "ti-sitemap",
    "blurb": "Designing systems that survive contact with real load and real teams.",
    "guides": [
      {
        "slug": "what-architecture-means",
        "title": "What \\\"Architecture\\\" Even Means",
        "summary": "Software architecture is the high-level shape of a system \u2014 the major parts and how they talk \u2014 and the small set of decisions that are expensive to change later; this guide gives you the mental model from scratch.",
        "order": 1,
        "phases": [
          {
            "slug": "01-boxes-and-arrows",
            "title": "Boxes and Arrows",
            "phaseNum": "1",
            "order": 1,
            "summary": "Software architecture is the high-level shape of a system: the major components (the boxes) and how they talk to each other (the arrows), decided before you build \u2014 like a building's floor plan.",
            "filePath": "/guides/architecture/what-architecture-means/01-boxes-and-arrows.md"
          },
          {
            "slug": "02-why-it-matters",
            "title": "Why It Matters",
            "phaseNum": "2",
            "order": 2,
            "summary": "Architecture is the set of decisions that are expensive to change later, and it's driven as much by non-functional needs \u2014 scale, reliability, security, team size \u2014 as by the features themselves.",
            "filePath": "/guides/architecture/what-architecture-means/02-why-it-matters.md"
          },
          {
            "slug": "03-thinking-in-trade-offs",
            "title": "Thinking in Trade-offs",
            "phaseNum": "3",
            "order": 3,
            "summary": "There is no 'best' architecture, only fitting ones \u2014 every choice trades something away; Conway's Law means your system mirrors your org, and the golden beginner rule is to start simple and add complexity only when a real problem demands it.",
            "filePath": "/guides/architecture/what-architecture-means/03-thinking-in-trade-offs.md"
          }
        ]
      },
      {
        "slug": "monolith-vs-microservices",
        "title": "Monolith vs Microservices, Honestly",
        "summary": "What a monolith and microservices each actually are, the real strengths and real costs of both, and an honest way to choose instead of cargo-culting the architecture everyone's blogging about.",
        "order": 2,
        "phases": [
          {
            "slug": "01-the-monolith",
            "title": "The Monolith",
            "phaseNum": "1",
            "order": 1,
            "summary": "A monolith is one deployable application holding all your features; it's simple to build, deploy, and debug, transactions are easy, and it strains mainly when one big team shares one codebase or one part needs to scale on its own.",
            "filePath": "/guides/architecture/monolith-vs-microservices/01-the-monolith.md"
          },
          {
            "slug": "02-microservices",
            "title": "Microservices",
            "phaseNum": "2",
            "order": 2,
            "summary": "Microservices split your system into many small independently-deployed services; you gain independent scaling, team autonomy, and fault isolation, and you pay with network calls everywhere, distributed debugging, cross-service data consistency, and serious operational overhead.",
            "filePath": "/guides/architecture/monolith-vs-microservices/02-microservices.md"
          },
          {
            "slug": "03-how-to-actually-choose",
            "title": "How to Actually Choose",
            "phaseNum": "3",
            "order": 3,
            "summary": "A judgment-flagged way to decide: most teams should start with a well-structured monolith and split out a service only when they feel a specific, named pain \u2014 and should avoid the two classic traps, the distributed monolith and premature splitting.",
            "filePath": "/guides/architecture/monolith-vs-microservices/03-how-to-actually-choose.md"
          }
        ]
      },
      {
        "slug": "caching-explained",
        "title": "Caching, Explained",
        "summary": "A cache is a copy of an expensive-to-produce answer kept somewhere fast so you don't redo the work. This guide covers what a cache really is, where caches live, and why keeping them honest is the genuinely hard part.",
        "order": 3,
        "phases": [
          {
            "slug": "01-what-a-cache-actually-is",
            "title": "What a Cache Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A cache keeps a copy of an expensive-to-produce result somewhere fast, so you serve it again instead of recomputing it. A 'hit' is when the copy is there; a 'miss' is when you have to do the real work.",
            "filePath": "/guides/architecture/caching-explained/01-what-a-cache-actually-is.md"
          },
          {
            "slug": "02-where-caches-live",
            "title": "Where Caches Live",
            "phaseNum": "2",
            "order": 2,
            "summary": "A single request can pass through several caches in a row: the browser's own cache, a CDN at the network edge, your application cache (in-memory or Redis), and the database's internal caches. Each layer is good at a different job.",
            "filePath": "/guides/architecture/caching-explained/02-where-caches-live.md"
          },
          {
            "slug": "03-invalidation-and-staleness",
            "title": "The Hard Part \u2014 Invalidation & Staleness",
            "phaseNum": "3",
            "order": 3,
            "summary": "Caches hold copies, so the copy can drift from the truth \u2014 that's staleness. This phase covers TTLs, eviction (LRU), write-through vs. cache-aside, and when not to cache at all.",
            "filePath": "/guides/architecture/caching-explained/03-invalidation-and-staleness.md"
          }
        ]
      },
      {
        "slug": "designing-for-scale",
        "title": "Designing for Scale (Load Balancing & Statelessness)",
        "summary": "How to take on more load without falling over: scale out instead of just up, make your servers stateless so any box can handle any request, put a load balancer in front, and push the parts that can't be cloned \u2014 sessions, the database, the cache \u2014 out to the edges.",
        "order": 4,
        "phases": [
          {
            "slug": "01-scale-up-vs-scale-out",
            "title": "Scale Up vs Scale Out, and Why Statelessness Matters",
            "phaseNum": "1",
            "order": 1,
            "summary": "Scaling up means a bigger box \u2014 simple, but capped and a single point of failure. Scaling out means more boxes \u2014 the real answer for big scale. The property that makes scaling out possible is statelessness: if any server can handle any request, you can add servers freely.",
            "filePath": "/guides/architecture/designing-for-scale/01-scale-up-vs-scale-out.md"
          },
          {
            "slug": "02-load-balancing",
            "title": "Load Balancing",
            "phaseNum": "2",
            "order": 2,
            "summary": "A load balancer sits in front of your pool of identical servers and spreads incoming requests across them, checks which ones are healthy, and stops sending traffic to the ones that aren't. The sticky-session trap re-introduces statefulness; externalizing state is the cleaner fix.",
            "filePath": "/guides/architecture/designing-for-scale/02-load-balancing.md"
          },
          {
            "slug": "03-scaling-the-stateful-bits",
            "title": "Scaling the Stateful Bits",
            "phaseNum": "3",
            "order": 3,
            "summary": "Statelessness lets you clone your app servers freely \u2014 but some things can't be cloned: sessions (move them to a shared store like Redis), the database (the usual bottleneck), and load you can shed with caching. Scaling is mostly the art of pushing state out to the edges so the middle can be cloned.",
            "filePath": "/guides/architecture/designing-for-scale/03-scaling-the-stateful-bits.md"
          }
        ]
      },
      {
        "slug": "designing-for-failure",
        "title": "Designing for Failure (Retries, Timeouts & Circuit Breakers)",
        "summary": "How to build distributed systems that bend instead of break: assume failure everywhere, add timeouts and backoff retries and circuit breakers, then fail soft with degradation, fallbacks, and bulkheads so one sick dependency can't sink the whole ship.",
        "order": 5,
        "phases": [
          {
            "slug": "01-everything-fails",
            "title": "Everything Fails",
            "phaseNum": "1",
            "order": 1,
            "summary": "In a distributed system, networks drop, services slow, and dependencies die \u2014 not if but when; the fallacies of distributed computing explain why, and a single slow dependency can take your whole system down through cascading failure.",
            "filePath": "/guides/architecture/designing-for-failure/01-everything-fails.md"
          },
          {
            "slug": "02-the-core-patterns",
            "title": "The Core Patterns",
            "phaseNum": "2",
            "order": 2,
            "summary": "The three defenses you reach for constantly: timeouts so you never wait forever, retries with exponential backoff and jitter for transient failures on idempotent operations only, and circuit breakers that stop hammering a dead dependency and fail fast until it recovers.",
            "filePath": "/guides/architecture/designing-for-failure/02-the-core-patterns.md"
          },
          {
            "slug": "03-failing-soft",
            "title": "Failing Soft: Degradation & Redundancy",
            "phaseNum": "3",
            "order": 3,
            "summary": "When a part fails anyway, lose a feature instead of the product: serve cached, partial, or default results via graceful degradation and fallbacks, isolate failures with bulkheads so one drowning feature can't sink the rest, add redundancy, and avoid the retry storm that turns a small outage into a big one.",
            "filePath": "/guides/architecture/designing-for-failure/03-failing-soft.md"
          }
        ]
      },
      {
        "slug": "event-driven-architecture",
        "title": "Event-Driven Architecture",
        "summary": "Systems that talk by emitting events instead of calling each other directly: queues, pub/sub, and choreography versus orchestration.",
        "order": 6,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "Announce, Don't Call",
            "phaseNum": "1",
            "order": 1,
            "summary": "Systems that talk by emitting events instead of calling each other directly: queues, pub/sub, and choreography versus orchestration.",
            "filePath": "/guides/architecture/event-driven-architecture/01-the-mental-model.md"
          },
          {
            "slug": "02-how-events-flow",
            "title": "How Events Really Flow",
            "phaseNum": "2",
            "order": 2,
            "summary": "Systems that talk by emitting events instead of calling each other directly: queues, pub/sub, and choreography versus orchestration.",
            "filePath": "/guides/architecture/event-driven-architecture/02-how-events-flow.md"
          },
          {
            "slug": "03-the-bill-comes-due",
            "title": "The Bill Comes Due",
            "phaseNum": "3",
            "order": 3,
            "summary": "Systems that talk by emitting events instead of calling each other directly: queues, pub/sub, and choreography versus orchestration.",
            "filePath": "/guides/architecture/event-driven-architecture/03-the-bill-comes-due.md"
          }
        ]
      },
      {
        "slug": "the-twelve-factor-app",
        "title": "The Twelve-Factor App",
        "summary": "The canonical checklist for an app that is actually shippable and scalable: config in the environment, stateless processes, logs as streams, and more.",
        "order": 7,
        "phases": [
          {
            "slug": "01-codebase-deps-config",
            "title": "One codebase, clean dependencies, config outside the code",
            "phaseNum": "1",
            "order": 1,
            "summary": "The canonical checklist for an app that is actually shippable and scalable: config in the environment, stateless processes, logs as streams, and more.",
            "filePath": "/guides/architecture/the-twelve-factor-app/01-codebase-deps-config.md"
          },
          {
            "slug": "02-processes-and-scale",
            "title": "Stateless processes, port binding, and scaling out",
            "phaseNum": "2",
            "order": 2,
            "summary": "The canonical checklist for an app that is actually shippable and scalable: config in the environment, stateless processes, logs as streams, and more.",
            "filePath": "/guides/architecture/the-twelve-factor-app/02-processes-and-scale.md"
          },
          {
            "slug": "03-parity-logs-ops",
            "title": "Dev-prod parity, logs as streams, and the operations factors",
            "phaseNum": "3",
            "order": 3,
            "summary": "The canonical checklist for an app that is actually shippable and scalable: config in the environment, stateless processes, logs as streams, and more.",
            "filePath": "/guides/architecture/the-twelve-factor-app/03-parity-logs-ops.md"
          }
        ]
      },
      {
        "slug": "api-gateway-explained",
        "title": "API Gateway, Explained",
        "summary": "A single front door in front of many backend services \u2014 what an API gateway actually does, and when it earns its keep versus when it's overkill.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-single-front-door",
            "title": "The single front door",
            "phaseNum": "1",
            "order": 1,
            "summary": "A single front door in front of many backend services \u2014 what an API gateway actually does, and when it earns its keep versus when it's overkill.",
            "filePath": "/guides/architecture/api-gateway-explained/01-the-single-front-door.md"
          },
          {
            "slug": "02-what-a-gateway-actually-does",
            "title": "What a gateway actually does",
            "phaseNum": "2",
            "order": 2,
            "summary": "A single front door in front of many backend services \u2014 what an API gateway actually does, and when it earns its keep versus when it's overkill.",
            "filePath": "/guides/architecture/api-gateway-explained/02-what-a-gateway-actually-does.md"
          },
          {
            "slug": "03-tradeoffs-and-real-examples",
            "title": "Tradeoffs and real examples",
            "phaseNum": "3",
            "order": 3,
            "summary": "A single front door in front of many backend services \u2014 what an API gateway actually does, and when it earns its keep versus when it's overkill.",
            "filePath": "/guides/architecture/api-gateway-explained/03-tradeoffs-and-real-examples.md"
          }
        ]
      },
      {
        "slug": "the-cap-theorem",
        "title": "The CAP Theorem",
        "summary": "In a distributed system, a network partition forces a choice between consistency and availability \u2014 what CAP actually claims, why the choice is unavoidable, and what it looks like in real databases.",
        "order": 9,
        "phases": [
          {
            "slug": "01-the-three-letters",
            "title": "The three letters",
            "phaseNum": "1",
            "order": 1,
            "summary": "In a distributed system, a network partition forces a choice between consistency and availability \u2014 what CAP actually claims, why the choice is unavoidable, and what it looks like in real databases.",
            "filePath": "/guides/architecture/the-cap-theorem/01-the-three-letters.md"
          },
          {
            "slug": "02-why-you-cant-have-all-three",
            "title": "Why you can't have all three",
            "phaseNum": "2",
            "order": 2,
            "summary": "In a distributed system, a network partition forces a choice between consistency and availability \u2014 what CAP actually claims, why the choice is unavoidable, and what it looks like in real databases.",
            "filePath": "/guides/architecture/the-cap-theorem/02-why-you-cant-have-all-three.md"
          },
          {
            "slug": "03-what-this-looks-like-in-real-databases",
            "title": "What this looks like in real databases",
            "phaseNum": "3",
            "order": 3,
            "summary": "In a distributed system, a network partition forces a choice between consistency and availability \u2014 what CAP actually claims, why the choice is unavoidable, and what it looks like in real databases.",
            "filePath": "/guides/architecture/the-cap-theorem/03-what-this-looks-like-in-real-databases.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "devops",
    "name": "DevOps",
    "icon": "ti-infinity",
    "blurb": "CI/CD, automation, and infrastructure as code - shipping safely and repeatedly.",
    "guides": [
      {
        "slug": "what-devops-is",
        "title": "What DevOps Actually Is",
        "summary": "DevOps isn't a team or a tool \u2014 it's the way of working where the people who build software and the people who run it share one loop and one responsibility, so changes ship faster and break less.",
        "order": 1,
        "phases": [
          {
            "slug": "01-not-a-team",
            "title": "Not a Team, a Way of Working",
            "phaseNum": "1",
            "order": 1,
            "summary": "DevOps is the way of working that removes the wall between the people who write code (dev) and the people who run it (ops), so a single loop owns the whole journey from build to ship to run.",
            "filePath": "/guides/devops/what-devops-is/01-not-a-team.md"
          },
          {
            "slug": "02-the-loop",
            "title": "The Loop: Build \u2192 Test \u2192 Ship \u2192 Observe",
            "phaseNum": "2",
            "order": 2,
            "summary": "DevOps runs as a continuous loop \u2014 build, test, ship, observe, repeat \u2014 and automation plus fast feedback are what make that loop both fast and safe instead of slow and scary.",
            "filePath": "/guides/devops/what-devops-is/02-the-loop.md"
          },
          {
            "slug": "03-the-culture",
            "title": "The Culture Underneath",
            "phaseNum": "3",
            "order": 3,
            "summary": "The habits that make DevOps real: shared ownership of the whole loop, automating toil instead of doing it by hand, shipping small changes often, and learning from failure without blame \u2014 none of which come from a job title or a tool.",
            "filePath": "/guides/devops/what-devops-is/03-the-culture.md"
          }
        ]
      },
      {
        "slug": "env-vars-and-config",
        "title": "Environment Variables & Config (.env, YAML)",
        "summary": "What config files really do, why settings live outside your code, how environment variables and .env files work, and how YAML/JSON/TOML and config precedence fit together.",
        "order": 2,
        "phases": [
          {
            "slug": "01-why-config-lives-outside-code",
            "title": "Why Config Lives Outside Code",
            "phaseNum": "1",
            "order": 1,
            "summary": "The same application runs in development, staging, and production with different settings; configuration is the layer that separates what changes per environment from the code, so you ship one codebase everywhere.",
            "filePath": "/guides/devops/env-vars-and-config/01-why-config-lives-outside-code.md"
          },
          {
            "slug": "02-env-vars-and-dotenv",
            "title": "Environment Variables & .env Files",
            "phaseNum": "2",
            "order": 2,
            "summary": "An environment variable is a name=value pair the operating system hands your process; here's how to read one from the shell and from code, and how .env files load them for local development \u2014 plus why you must never commit a .env file.",
            "filePath": "/guides/devops/env-vars-and-config/02-env-vars-and-dotenv.md"
          },
          {
            "slug": "03-config-files-yaml",
            "title": "Config Files: YAML & Friends",
            "phaseNum": "3",
            "order": 3,
            "summary": "When config grows past a few values you reach for structured files \u2014 YAML, JSON, or TOML; here's how YAML works, the indentation trap that bites everyone, and the precedence order (defaults < file < environment variable) that decides which setting wins.",
            "filePath": "/guides/devops/env-vars-and-config/03-config-files-yaml.md"
          }
        ]
      },
      {
        "slug": "build-and-release-basics",
        "title": "Build & Release Basics",
        "summary": "How source code becomes a thing you can actually ship: what a build produces, why you version and freeze artifacts, and how the same artifact moves from dev to staging to prod.",
        "order": 3,
        "phases": [
          {
            "slug": "01-what-building-produces",
            "title": "What 'Building' Actually Produces",
            "phaseNum": "1",
            "order": 1,
            "summary": "A build turns your human-readable source code into a single packaged thing \u2014 a binary, a bundle, or a container image \u2014 that a computer can actually run, produced by a repeatable recipe.",
            "filePath": "/guides/devops/build-and-release-basics/01-what-building-produces.md"
          },
          {
            "slug": "02-versions-and-artifacts",
            "title": "Versions & Artifacts",
            "phaseNum": "2",
            "order": 2,
            "summary": "Give each release a version number so people can talk about it, freeze the artifact so it never changes after it's built, and store it in a registry so the exact same build can be fetched anywhere.",
            "filePath": "/guides/devops/build-and-release-basics/02-versions-and-artifacts.md"
          },
          {
            "slug": "03-environments-and-promotion",
            "title": "Environments & Promotion",
            "phaseNum": "3",
            "order": 3,
            "summary": "Dev, staging, and prod are separate copies of your running system; you promote the same frozen artifact through them instead of rebuilding, and feed each one its own config \u2014 which is why 'works in staging, breaks in prod' is almost always a config difference.",
            "filePath": "/guides/devops/build-and-release-basics/03-environments-and-promotion.md"
          }
        ]
      },
      {
        "slug": "what-cicd-does",
        "title": "What a CI/CD Pipeline Actually Does",
        "summary": "CI/CD is the automated path from a commit to production: every change is built and tested automatically, and releases become small, frequent, and safe to roll back.",
        "order": 4,
        "phases": [
          {
            "slug": "01-continuous-integration",
            "title": "CI: Continuous Integration",
            "phaseNum": "1",
            "order": 1,
            "summary": "Continuous Integration means every change you push is automatically built and tested by a server, so breakage surfaces in minutes \u2014 the red/green gate that protects the shared branch.",
            "filePath": "/guides/devops/what-cicd-does/01-continuous-integration.md"
          },
          {
            "slug": "02-delivery-vs-deployment",
            "title": "CD: Delivery vs Deployment",
            "phaseNum": "2",
            "order": 2,
            "summary": "CD means two different things \u2014 continuous delivery (always release-ready, a human clicks deploy) and continuous deployment (every green change ships automatically); plus the build\u2192test\u2192deploy stages and gentle deploy strategies.",
            "filePath": "/guides/devops/what-cicd-does/02-delivery-vs-deployment.md"
          },
          {
            "slug": "03-why-its-worth-it",
            "title": "Why It's Worth It",
            "phaseNum": "3",
            "order": 3,
            "summary": "CI/CD pays off through small frequent releases, fast feedback, and rollback confidence \u2014 but a pipeline is only as trustworthy as the tests inside it, and flaky tests poison the whole thing.",
            "filePath": "/guides/devops/what-cicd-does/03-why-its-worth-it.md"
          }
        ]
      },
      {
        "slug": "your-first-pipeline-github-actions",
        "title": "Your First Pipeline (GitHub Actions)",
        "summary": "What a GitHub Actions workflow actually is \u2014 events trigger jobs made of steps that run on a runner \u2014 then a real ci.yml decoded line by line, plus caching, matrices, secrets, and required checks.",
        "order": 5,
        "phases": [
          {
            "slug": "01-anatomy-of-a-workflow",
            "title": "The Anatomy of a Workflow",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model behind GitHub Actions: an event triggers a workflow, which is made of jobs, which are made of steps, all running on a fresh machine called a runner \u2014 and how the YAML maps onto each of those words.",
            "filePath": "/guides/devops/your-first-pipeline-github-actions/01-anatomy-of-a-workflow.md"
          },
          {
            "slug": "02-building-it-up",
            "title": "Building It Up",
            "phaseNum": "2",
            "order": 2,
            "summary": "A real .github/workflows/ci.yml that checks out your code, sets up the language, installs dependencies, and runs tests \u2014 every line explained, with a green run log and a failing one so you can read both.",
            "filePath": "/guides/devops/your-first-pipeline-github-actions/02-building-it-up.md"
          },
          {
            "slug": "03-beyond-the-basics",
            "title": "Beyond the Basics",
            "phaseNum": "3",
            "order": 3,
            "summary": "Make CI fast and trustworthy: cache dependencies so installs aren't re-downloaded every run, use a matrix to test multiple versions at once, handle secrets safely, and require checks to pass before a merge.",
            "filePath": "/guides/devops/your-first-pipeline-github-actions/03-beyond-the-basics.md"
          }
        ]
      },
      {
        "slug": "automating-the-boring-stuff",
        "title": "Automating the Boring Stuff (Ops Scripting)",
        "summary": "Turn the manual tasks you keep redoing by hand into scripts that are faster, repeatable, and self-documenting \u2014 from the when-to-automate mindset to a real bash backup script to knowing when to reach for Python and cron.",
        "order": 6,
        "phases": [
          {
            "slug": "01-if-youve-done-it-twice",
            "title": "If You've Done It Twice, Script It",
            "phaseNum": "1",
            "order": 1,
            "summary": "Manual steps are slow, error-prone, and unrepeatable; a script is documentation that runs. The mindset shift, and an honest test for when automating is worth it \u2014 and when it isn't.",
            "filePath": "/guides/devops/automating-the-boring-stuff/01-if-youve-done-it-twice.md"
          },
          {
            "slug": "02-shell-scripting-essentials",
            "title": "Shell Scripting Essentials",
            "phaseNum": "2",
            "order": 2,
            "summary": "Build a real bash script piece by piece \u2014 variables, arguments, conditionals, loops, exit codes \u2014 and learn the one line, set -euo pipefail, that turns a silent disaster into a loud, safe failure.",
            "filePath": "/guides/devops/automating-the-boring-stuff/02-shell-scripting-essentials.md"
          },
          {
            "slug": "03-when-to-reach-for-python",
            "title": "When to Reach for Python",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest signs that bash is the wrong tool \u2014 data structures, parsing, cross-platform \u2014 and how to schedule automation with cron, made safe by idempotency, dry-run, and logging.",
            "filePath": "/guides/devops/automating-the-boring-stuff/03-when-to-reach-for-python.md"
          }
        ]
      },
      {
        "slug": "infrastructure-as-code-terraform",
        "title": "Infrastructure as Code (Terraform Basics)",
        "summary": "Stop clicking around in cloud consoles. Define your servers, networks, and databases in version-controlled files you can review and apply \u2014 that's Infrastructure as Code, and Terraform is how a huge slice of the industry does it.",
        "order": 7,
        "phases": [
          {
            "slug": "01-why-click-ops-doesnt-scale",
            "title": "Why Click-Ops Doesn't Scale",
            "phaseNum": "1",
            "order": 1,
            "summary": "Clicking through a cloud console is unrepeatable, undocumented, and drifts over time. Infrastructure as Code fixes this by letting you declare the desired state of your infrastructure in version-controlled files \u2014 you describe what you want, not the steps to get there.",
            "filePath": "/guides/devops/infrastructure-as-code-terraform/01-why-click-ops-doesnt-scale.md"
          },
          {
            "slug": "02-how-terraform-works",
            "title": "How Terraform Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "Terraform reads declarative .tf files describing the resources you want, then runs a core loop \u2014 init pulls plugins, plan previews the diff, apply makes it real. State is the file where Terraform records what it built, and for teams that state must be stored remotely and locked.",
            "filePath": "/guides/devops/infrastructure-as-code-terraform/02-how-terraform-works.md"
          },
          {
            "slug": "03-using-it-safely",
            "title": "Using It Safely",
            "phaseNum": "3",
            "order": 3,
            "summary": "The safety habits that make Terraform trustworthy: always read the plan before you apply, use modules to reuse infrastructure instead of copy-pasting, and respect the three dangers \u2014 drift when someone changes things by hand, destroy operations that delete real resources, and secrets that end up readable in state.",
            "filePath": "/guides/devops/infrastructure-as-code-terraform/03-using-it-safely.md"
          }
        ]
      },
      {
        "slug": "zero-downtime-deploys",
        "title": "Zero-Downtime Deploys",
        "summary": "Ship a new version without a maintenance window: rolling, blue-green, and canary deploys, plus the health checks and migrations that make them safe.",
        "order": 8,
        "phases": [
          {
            "slug": "01-why-naive-deploys-hurt",
            "title": "Why Naive Deploys Hurt",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model: a deploy means two versions of your code want to exist at once, and stop-and-replace drops every request in that gap.",
            "filePath": "/guides/devops/zero-downtime-deploys/01-why-naive-deploys-hurt.md"
          },
          {
            "slug": "02-the-three-strategies",
            "title": "The Three Strategies",
            "phaseNum": "2",
            "order": 2,
            "summary": "Rolling, blue-green, and canary: how each moves live traffic from the old version to the new without a gap, and when to reach for which.",
            "filePath": "/guides/devops/zero-downtime-deploys/02-the-three-strategies.md"
          },
          {
            "slug": "03-migrations-and-health",
            "title": "The Hard Part \u2014 Migrations and Health",
            "phaseNum": "3",
            "order": 3,
            "summary": "The database is what actually bites you: backward-compatible expand-then-contract migrations, plus health checks and connection draining that let the balancer route safely.",
            "filePath": "/guides/devops/zero-downtime-deploys/03-migrations-and-health.md"
          }
        ]
      },
      {
        "slug": "feature-flags-and-rollbacks",
        "title": "Feature Flags and Rollbacks",
        "summary": "Ship code dark, flip it on for a few users, and turn it off instantly when it breaks: feature flags decouple deploy from release.",
        "order": 9,
        "phases": [
          {
            "slug": "01-deploy-is-not-release",
            "title": "The switch in your code",
            "phaseNum": "1",
            "order": 1,
            "summary": "Ship code dark, flip it on for a few users, and turn it off instantly when it breaks: feature flags decouple deploy from release.",
            "filePath": "/guides/devops/feature-flags-and-rollbacks/01-deploy-is-not-release.md"
          },
          {
            "slug": "02-rollouts-and-kill-switches",
            "title": "Living with flags",
            "phaseNum": "2",
            "order": 2,
            "summary": "Ship code dark, flip it on for a few users, and turn it off instantly when it breaks: feature flags decouple deploy from release.",
            "filePath": "/guides/devops/feature-flags-and-rollbacks/02-rollouts-and-kill-switches.md"
          },
          {
            "slug": "03-flag-debt-and-rollback",
            "title": "The bill comes due",
            "phaseNum": "3",
            "order": 3,
            "summary": "Ship code dark, flip it on for a few users, and turn it off instantly when it breaks: feature flags decouple deploy from release.",
            "filePath": "/guides/devops/feature-flags-and-rollbacks/03-flag-debt-and-rollback.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "infrastructure",
    "name": "Infrastructure & Cloud",
    "icon": "ti-cloud",
    "blurb": "Servers, containers, and cloud platforms - where your code actually runs.",
    "guides": [
      {
        "slug": "what-a-server-is",
        "title": "What a Server Actually Is",
        "summary": "A server is just a computer running a program that waits for requests and answers them - this guide demystifies the word, the role, and the path from a box under a desk to the cloud.",
        "order": 1,
        "phases": [
          {
            "slug": "01-a-computer-thats-always-on",
            "title": "A Computer That's Always On",
            "phaseNum": "1",
            "order": 1,
            "summary": "A server is an ordinary computer running a program that waits for requests and answers them - and the client/server model is just one side asking and the other side responding.",
            "filePath": "/guides/infrastructure/what-a-server-is/01-a-computer-thats-always-on.md"
          },
          {
            "slug": "02-what-makes-it-a-server",
            "title": "What Makes It a \\\"Server\\\"",
            "phaseNum": "2",
            "order": 2,
            "summary": "A computer earns the name 'server' through how it's run: headless, always-on, reachable at a network address, and running server software that plays the request/response role.",
            "filePath": "/guides/infrastructure/what-a-server-is/02-what-makes-it-a-server.md"
          },
          {
            "slug": "03-from-a-box-to-the-cloud",
            "title": "From a Box to the Cloud",
            "phaseNum": "3",
            "order": 3,
            "summary": "The ladder from a physical server to a virtual machine to a cloud instance to serverless - and why 'the cloud is someone else's computer' is precisely true.",
            "filePath": "/guides/infrastructure/what-a-server-is/03-from-a-box-to-the-cloud.md"
          }
        ]
      },
      {
        "slug": "ssh-and-keys",
        "title": "SSH & Keys, Explained",
        "summary": "What SSH actually is (an encrypted remote terminal into another machine), how key pairs replace passwords, and how to live with SSH day to day - config shortcuts, the agent, and the errors that bite everyone.",
        "order": 2,
        "phases": [
          {
            "slug": "01-what-ssh-is",
            "title": "What SSH Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "SSH is an encrypted terminal into another machine: ssh user@host opens a session, the first-connection fingerprint prompt is SSH asking 'is this really the server?', and a session is just a remote shell that ends when you log out.",
            "filePath": "/guides/infrastructure/ssh-and-keys/01-what-ssh-is.md"
          },
          {
            "slug": "02-key-pairs-demystified",
            "title": "Key Pairs, Demystified",
            "phaseNum": "2",
            "order": 2,
            "summary": "A key pair is a padlock (public key) you hang on the server and the only key (private key) that opens it; it beats passwords because no secret ever travels and it resists brute force. Generate one with ssh-keygen, keep it in ~/.ssh, and install the public half with ssh-copy-id.",
            "filePath": "/guides/infrastructure/ssh-and-keys/02-key-pairs-demystified.md"
          },
          {
            "slug": "03-living-with-ssh",
            "title": "Living With SSH",
            "phaseNum": "3",
            "order": 3,
            "summary": "Make SSH pleasant: ~/.ssh/config turns long host strings into short names, the ssh-agent remembers your passphrase for the session, and a cheat-card maps the common errors - Permission denied (publickey) and the changed host-key warning - to calm fixes.",
            "filePath": "/guides/infrastructure/ssh-and-keys/03-living-with-ssh.md"
          }
        ]
      },
      {
        "slug": "docker-without-the-magic",
        "title": "Docker Without the Magic",
        "summary": "What a container actually is, how a Dockerfile builds an image layer by layer, and the gotchas that bite everyone - so 'works on my machine' stops being a thing that happens to you.",
        "order": 3,
        "phases": [
          {
            "slug": "01-image-vs-container",
            "title": "Image vs Container (and Why Not a VM)",
            "phaseNum": "1",
            "order": 1,
            "summary": "An image is a frozen, layered snapshot of a filesystem plus how to run it (like a class); a container is a running instance of that image (like an object); both are far lighter than a VM because they share the host's kernel.",
            "filePath": "/guides/infrastructure/docker-without-the-magic/01-image-vs-container.md"
          },
          {
            "slug": "02-the-dockerfile-and-layers",
            "title": "Building an Image: the Dockerfile & Layers",
            "phaseNum": "2",
            "order": 2,
            "summary": "A Dockerfile is a recipe and each instruction builds a cached layer, which is why instruction order decides your rebuild speed; then docker build, docker run with published ports, and pull/push to a registry.",
            "filePath": "/guides/infrastructure/docker-without-the-magic/02-the-dockerfile-and-layers.md"
          },
          {
            "slug": "03-volumes-and-the-gotchas",
            "title": "Volumes & the Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Containers are ephemeral so data dies with them unless you use a volume; config belongs in environment variables; and the classic traps - bloated images, secrets baked into layers, the unpublished port - named before they bite.",
            "filePath": "/guides/infrastructure/docker-without-the-magic/03-volumes-and-the-gotchas.md"
          }
        ]
      },
      {
        "slug": "docker-compose-for-real-projects",
        "title": "Docker Compose for Real Projects",
        "summary": "Real apps are several containers at once - web, API, database, cache. Compose declares the whole stack in one file and brings it up with a single command.",
        "order": 4,
        "phases": [
          {
            "slug": "01-why-one-container-isnt-enough",
            "title": "Why One Container Isn't Enough",
            "phaseNum": "1",
            "order": 1,
            "summary": "Real apps are a stack of cooperating containers - web, API, database, cache. Running them by hand is a juggling act; Compose declares the whole stack in one file you bring up with one command.",
            "filePath": "/guides/infrastructure/docker-compose-for-real-projects/01-why-one-container-isnt-enough.md"
          },
          {
            "slug": "02-the-compose-file",
            "title": "The compose file",
            "phaseNum": "2",
            "order": 2,
            "summary": "A guided tour of docker-compose.yml - services, image vs build, ports, environment, depends_on, and named volumes - then bringing the stack up, watching its logs, and tearing it down.",
            "filePath": "/guides/infrastructure/docker-compose-for-real-projects/02-the-compose-file.md"
          },
          {
            "slug": "03-networking-volumes-and-dev-workflow",
            "title": "Networking, Volumes & Dev Workflow",
            "phaseNum": "3",
            "order": 3,
            "summary": "How services reach each other by name on a Compose network, how named volumes keep your database, how bind-mounts give live-reload in dev - and the two traps: depends_on waits for start not readiness, and dev compose isn't prod compose.",
            "filePath": "/guides/infrastructure/docker-compose-for-real-projects/03-networking-volumes-and-dev-workflow.md"
          }
        ]
      },
      {
        "slug": "deploying-to-a-vps",
        "title": "Deploying to a VPS (From Zero to Live)",
        "summary": "How to get your app onto a rented Linux box and reachable on the real internet - from spinning up the server and SSHing in, to running your app as a service that survives crashes and reboots, to a domain, a reverse proxy, and HTTPS.",
        "order": 5,
        "phases": [
          {
            "slug": "01-get-a-box-and-get-in",
            "title": "Get a Box and Get In",
            "phaseNum": "1",
            "order": 1,
            "summary": "A VPS is a rented slice of a Linux server you control entirely. Here's what that means, how to create one, how to SSH in for the first time, and the three first-login hardening steps - a non-root user, system updates, and a firewall - that protect a box exposed to the open internet.",
            "filePath": "/guides/infrastructure/deploying-to-a-vps/01-get-a-box-and-get-in.md"
          },
          {
            "slug": "02-run-your-app-as-a-service",
            "title": "Run Your App as a Service",
            "phaseNum": "2",
            "order": 2,
            "summary": "Getting your code onto the box, running it once by hand, then handing it to systemd so it restarts on crash, comes back after a reboot, and survives your terminal closing. Plus how to confirm it's actually listening on its port.",
            "filePath": "/guides/infrastructure/deploying-to-a-vps/02-run-your-app-as-a-service.md"
          },
          {
            "slug": "03-make-it-public-and-safe",
            "title": "Make It Public & Safe",
            "phaseNum": "3",
            "order": 3,
            "summary": "Pointing a domain at your box with a DNS A record, putting nginx in front as a reverse proxy so your private app port is never exposed, and getting a free HTTPS certificate from Let's Encrypt - plus the safety rules that keep the whole thing from biting you later.",
            "filePath": "/guides/infrastructure/deploying-to-a-vps/03-make-it-public-and-safe.md"
          }
        ]
      },
      {
        "slug": "load-balancers-and-nginx",
        "title": "Load Balancers & Reverse Proxies (nginx)",
        "summary": "What a reverse proxy actually is, why you put nginx in front of your app, how load balancing spreads traffic across instances, and what nginx really does in production - TLS, gzip, caching, and rate limiting.",
        "order": 6,
        "phases": [
          {
            "slug": "01-what-a-reverse-proxy-is",
            "title": "What a Reverse Proxy Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "A reverse proxy is a server that sits in front of your app and forwards requests to it - the public front door that handles TLS, serves static files, and hides your app behind one clean entry point.",
            "filePath": "/guides/infrastructure/load-balancers-and-nginx/01-what-a-reverse-proxy-is.md"
          },
          {
            "slug": "02-load-balancing",
            "title": "Load Balancing",
            "phaseNum": "2",
            "order": 2,
            "summary": "When one app instance can't handle the traffic, the proxy spreads requests across a pool of identical instances - with health checks to skip the dead ones and a strategy like round-robin or least-connections to decide who gets the next request.",
            "filePath": "/guides/infrastructure/load-balancers-and-nginx/02-load-balancing.md"
          },
          {
            "slug": "03-what-nginx-does-in-practice",
            "title": "What nginx Does in Practice",
            "phaseNum": "3",
            "order": 3,
            "summary": "The jobs nginx actually does day to day in front of your app - terminating TLS/HTTPS, gzip compression, caching static assets, and rate limiting - plus the everyday skill of testing and reloading config safely without restarting and dropping connections.",
            "filePath": "/guides/infrastructure/load-balancers-and-nginx/03-what-nginx-does-in-practice.md"
          }
        ]
      },
      {
        "slug": "cloud-platforms-explained",
        "title": "Cloud Platforms, Explained (AWS / GCP / Azure)",
        "summary": "What 'the cloud' actually sells, the handful of building blocks that matter across AWS, GCP, and Azure, and how to stay sane about bills, permissions, and lock-in.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-the-cloud-sells",
            "title": "What \\\"The Cloud\\\" Actually Sells",
            "phaseNum": "1",
            "order": 1,
            "summary": "The cloud rents you computing on demand - compute, storage, network, and managed services - instead of making you own servers; you pay for what you use, and the big three are the same shape with different names.",
            "filePath": "/guides/infrastructure/cloud-platforms-explained/01-what-the-cloud-sells.md"
          },
          {
            "slug": "02-the-building-blocks",
            "title": "The Building Blocks (Across Vendors)",
            "phaseNum": "2",
            "order": 2,
            "summary": "The handful of cloud pieces that actually matter - compute (EC2/Compute Engine/VMs), object storage (S3/Cloud Storage/Blob), managed databases (RDS/Cloud SQL/Azure SQL), networking (VPC), and identity (IAM) - explained once and name-mapped across AWS, GCP, and Azure.",
            "filePath": "/guides/infrastructure/cloud-platforms-explained/02-the-building-blocks.md"
          },
          {
            "slug": "03-iaas-paas-serverless",
            "title": "IaaS vs PaaS vs Serverless, and Staying Sane",
            "phaseNum": "3",
            "order": 3,
            "summary": "The spectrum from raw VMs (IaaS) to managed platforms (PaaS) to functions (serverless) - more managed means less control and less ops - plus the three gotchas that actually hurt: surprise bills, IAM complexity, and lock-in.",
            "filePath": "/guides/infrastructure/cloud-platforms-explained/03-iaas-paas-serverless.md"
          }
        ]
      },
      {
        "slug": "kubernetes-without-the-hype",
        "title": "Kubernetes, Explained Without the Hype",
        "summary": "What Kubernetes actually does (keeps your declared desired state true across many machines), the handful of objects you really meet - Pod, Deployment, Service, controllers - and an honest answer to whether you need it at all.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-problem-k8s-solves",
            "title": "The Problem K8s Solves",
            "phaseNum": "1",
            "order": 1,
            "summary": "Running many containers across many machines by hand is brutal - placement, restarts, scaling, networking, rollouts. Kubernetes is a container orchestrator: you declare the desired state and it works continuously to make reality match.",
            "filePath": "/guides/infrastructure/kubernetes-without-the-hype/01-the-problem-k8s-solves.md"
          },
          {
            "slug": "02-the-core-objects",
            "title": "The Core Objects",
            "phaseNum": "2",
            "order": 2,
            "summary": "The pieces you actually meet: the Pod (one or more containers), the Deployment (desired replicas + safe rollouts), the Service (a stable address + load balancing), and the controllers that reconcile actual toward desired - shown with annotated YAML and kubectl transcripts.",
            "filePath": "/guides/infrastructure/kubernetes-without-the-hype/02-the-core-objects.md"
          },
          {
            "slug": "03-should-you-even-use-it",
            "title": "Should You Even Use It?",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest cost-benefit: Kubernetes is powerful and genuinely complex, and the operational cost is real. Most small apps are happier on a VPS or a PaaS. When k8s actually earns its keep - real scale, many services, a platform team - and how to dodge resume-driven Kubernetes.",
            "filePath": "/guides/infrastructure/kubernetes-without-the-hype/03-should-you-even-use-it.md"
          }
        ]
      },
      {
        "slug": "ship-your-side-project",
        "title": "Ship Your Side Project to the Internet",
        "summary": "The full journey from 'it works on my laptop' to 'a stranger can use it at a real URL' - pick a VPS, SSH in, run it with Docker, point a domain, put it behind Cloudflare, and auto-deploy on merge - with every first-time gotcha flagged.",
        "order": 9,
        "phases": [
          {
            "slug": "01-pick-a-vps",
            "title": "Pick a Cheap VPS",
            "phaseNum": "1",
            "order": 1,
            "summary": "A small VPS is plenty to start - but the box has to survive the build, not just the run, and the billing keeps charging while it's powered off. Pick for build-RAM, and delete (not stop) to stop paying.",
            "filePath": "/guides/infrastructure/ship-your-side-project/01-pick-a-vps.md"
          },
          {
            "slug": "02-ssh-in-with-a-key",
            "title": "SSH In With a Key",
            "phaseNum": "2",
            "order": 2,
            "summary": "Get onto the box with an SSH key, not a password: generate a keypair, put the public half in authorized_keys, and work through the 'Permission denied (publickey)' decision tree when it won't let you in.",
            "filePath": "/guides/infrastructure/ship-your-side-project/02-ssh-in-with-a-key.md"
          },
          {
            "slug": "03-docker-and-your-repo",
            "title": "Docker & Your Private Repo",
            "phaseNum": "3",
            "order": 3,
            "summary": "Install Docker, pull your PRIVATE repo onto the box with a read-only deploy key, and bring it up with compose - dodging the two .env traps that waste everyone's first afternoon: a $ in a value, and restart not re-reading .env.",
            "filePath": "/guides/infrastructure/ship-your-side-project/03-docker-and-your-repo.md"
          },
          {
            "slug": "04-domains-and-dns",
            "title": "Domains & DNS",
            "phaseNum": "4",
            "order": 4,
            "summary": "Buy a domain, point its nameservers at a DNS provider, and add an A record for the apex and a CNAME for www - knowing that the apex usually can't be a CNAME, and that a .dev domain refuses to load over plain HTTP.",
            "filePath": "/guides/infrastructure/ship-your-side-project/04-domains-and-dns.md"
          },
          {
            "slug": "05-behind-cloudflare",
            "title": "Behind Cloudflare",
            "phaseNum": "5",
            "order": 5,
            "summary": "Put your site behind Cloudflare for free HTTPS and protection - via a proxied DNS record or, better, a Cloudflare Tunnel that needs no open ports - then fix the app-side must-dos (public origin, CSRF, secure cookies) and firewall the origin so nobody bypasses Cloudflare.",
            "filePath": "/guides/infrastructure/ship-your-side-project/05-behind-cloudflare.md"
          },
          {
            "slug": "06-auto-deploy-on-merge",
            "title": "Auto-Deploy on Merge",
            "phaseNum": "6",
            "order": 6,
            "summary": "Close the loop: a GitHub Actions workflow that, on every merge to main, SSHes into your box and pulls + recreates the stack - so shipping is a merge, not a chore - with the build-OOM and restart-vs-recreate traps handled.",
            "filePath": "/guides/infrastructure/ship-your-side-project/06-auto-deploy-on-merge.md"
          }
        ]
      },
      {
        "slug": "backups-and-disaster-recovery",
        "title": "Backups and Disaster Recovery",
        "summary": "The 3-2-1 rule, RPO and RTO, and the one practice that matters most: actually testing the restore before the disaster forces you to.",
        "order": 10,
        "phases": [
          {
            "slug": "01-backup-vs-disaster-recovery",
            "title": "Backup vs Disaster Recovery",
            "phaseNum": "1",
            "order": 1,
            "summary": "The two different problems hiding under one word, and the 3-2-1 rule that makes a backup trustworthy.",
            "filePath": "/guides/infrastructure/backups-and-disaster-recovery/01-backup-vs-disaster-recovery.md"
          },
          {
            "slug": "02-rpo-rto-and-cost",
            "title": "RPO, RTO, and the Cost Dial",
            "phaseNum": "2",
            "order": 2,
            "summary": "How much data you can lose and how long you can be down, and how those two numbers set your backup budget.",
            "filePath": "/guides/infrastructure/backups-and-disaster-recovery/02-rpo-rto-and-cost.md"
          },
          {
            "slug": "03-testing-and-ransomware",
            "title": "The Untested Backup, and Ransomware",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why the restore drill is the only proof that counts, and the offline, immutable copy that survives an attacker.",
            "filePath": "/guides/infrastructure/backups-and-disaster-recovery/03-testing-and-ransomware.md"
          }
        ]
      },
      {
        "slug": "object-storage-s3",
        "title": "Object Storage (S3)",
        "summary": "Buckets, keys, and signed URLs - how cloud object storage really works, what it is good and bad at, and the public-bucket leak that makes the news.",
        "order": 11,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "What it actually is: a giant key-to-blob map",
            "phaseNum": "1",
            "order": 1,
            "summary": "Buckets, keys, and signed URLs - how cloud object storage really works, what it is good and bad at, and the public-bucket leak that makes the news.",
            "filePath": "/guides/infrastructure/object-storage-s3/01-the-mental-model.md"
          },
          {
            "slug": "02-keys-and-access",
            "title": "How you really work with it: keys, uploads, and signed URLs",
            "phaseNum": "2",
            "order": 2,
            "summary": "Buckets, keys, and signed URLs - how cloud object storage really works, what it is good and bad at, and the public-bucket leak that makes the news.",
            "filePath": "/guides/infrastructure/object-storage-s3/02-keys-and-access.md"
          },
          {
            "slug": "03-where-it-bites",
            "title": "Where it bites: leaks, edits, and consistency",
            "phaseNum": "3",
            "order": 3,
            "summary": "Buckets, keys, and signed URLs - how cloud object storage really works, what it is good and bad at, and the public-bucket leak that makes the news.",
            "filePath": "/guides/infrastructure/object-storage-s3/03-where-it-bites.md"
          }
        ]
      },
      {
        "slug": "auto-scaling-explained",
        "title": "Auto-Scaling, Explained",
        "summary": "Why fixed capacity always loses to real traffic, how auto-scaling decides when to add or remove servers, and the gotchas that catch teams who turn it on and walk away without a load balancer.",
        "order": 12,
        "phases": [
          {
            "slug": "01-why-you-need-this",
            "title": "Why You'd Want This at All",
            "phaseNum": "1",
            "order": 1,
            "summary": "The peak-vs-average traffic problem \u2014 why provisioning for your busiest moment is expensive and provisioning for average traffic is risky.",
            "filePath": "/guides/infrastructure/auto-scaling-explained/01-why-you-need-this.md"
          },
          {
            "slug": "02-how-it-decides",
            "title": "How It Actually Decides to Scale",
            "phaseNum": "2",
            "order": 2,
            "summary": "Metrics, thresholds, cooldown periods, and scaling policies \u2014 the mechanism that turns a number like CPU usage into an actual scale-up or scale-down event.",
            "filePath": "/guides/infrastructure/auto-scaling-explained/02-how-it-decides.md"
          },
          {
            "slug": "03-the-gotchas",
            "title": "The Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Cold-start lag, the thundering herd of a spike arriving before new capacity is ready, and why auto-scaling only works paired with a load balancer.",
            "filePath": "/guides/infrastructure/auto-scaling-explained/03-the-gotchas.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "performance",
    "name": "Performance",
    "icon": "ti-gauge",
    "blurb": "Finding the slow thing, and the tools that show you where it hides.",
    "guides": [
      {
        "slug": "what-performance-means",
        "title": "What \\\"Performance\\\" Even Means",
        "summary": "Performance is two different numbers (latency and throughput), the rule that you measure before you optimize, and the truth that 'fast enough' is defined by a requirement and by what users actually feel.",
        "order": 1,
        "phases": [
          {
            "slug": "01-latency-vs-throughput",
            "title": "Latency vs Throughput",
            "phaseNum": "1",
            "order": 1,
            "summary": "Latency is how long one operation takes; throughput is how many operations finish per second. They're different numbers, and improving one can quietly hurt the other.",
            "filePath": "/guides/performance/what-performance-means/01-latency-vs-throughput.md"
          },
          {
            "slug": "02-measure-before-you-optimize",
            "title": "Measure Before You Optimize",
            "phaseNum": "2",
            "order": 2,
            "summary": "The cardinal rule of performance: humans guess wrong about what's slow, so measure first, find the real bottleneck - the slowest stage that caps the whole system - and fix that, not what you assumed.",
            "filePath": "/guides/performance/what-performance-means/02-measure-before-you-optimize.md"
          },
          {
            "slug": "03-what-fast-enough-means",
            "title": "What \\\"Fast Enough\\\" Means",
            "phaseNum": "3",
            "order": 3,
            "summary": "Fast is relative - to a requirement and to human perception. The slowest requests (tail latency, the high percentiles) are what users actually feel, and optimizing past 'fast enough' is wasted effort.",
            "filePath": "/guides/performance/what-performance-means/03-what-fast-enough-means.md"
          }
        ]
      },
      {
        "slug": "big-o-without-the-math-panic",
        "title": "Big-O Without the Math Panic",
        "summary": "Big-O isn't a math exam - it's a simple way to ask 'when my data gets bigger, does the work get a little bigger, a lot bigger, or catastrophically bigger?' This guide gives you that intuition with zero proofs.",
        "order": 2,
        "phases": [
          {
            "slug": "01-its-about-how-things-grow",
            "title": "It's About How Things GROW",
            "phaseNum": "1",
            "order": 1,
            "summary": "Big-O describes how the amount of work changes as the input grows - not how many seconds something takes. The one question: if I double the data, does the work barely change, double, or square?",
            "filePath": "/guides/performance/big-o-without-the-math-panic/01-its-about-how-things-grow.md"
          },
          {
            "slug": "02-the-few-you-actually-meet",
            "title": "The Few You Actually Meet",
            "phaseNum": "2",
            "order": 2,
            "summary": "In real code you mostly see five Big-O shapes: O(1) constant, O(n) linear, O(n\u00b2) quadratic, O(log n) logarithmic, and O(n log n). Here's each one in plain language, with a table for naming them from the code.",
            "filePath": "/guides/performance/big-o-without-the-math-panic/02-the-few-you-actually-meet.md"
          },
          {
            "slug": "03-why-it-matters-in-real-life",
            "title": "Why It Matters in Real Life",
            "phaseNum": "3",
            "order": 3,
            "summary": "The same code can be fine at 100 items and hang at 10 million - that's accidental quadratic. Choosing the right data structure changes the Big-O. And because Big-O ignores constants, sometimes the 'slower' algorithm wins on real data, so measure.",
            "filePath": "/guides/performance/big-o-without-the-math-panic/03-why-it-matters-in-real-life.md"
          }
        ]
      },
      {
        "slug": "profiling-101",
        "title": "Finding the Slow Thing (Profiling 101)",
        "summary": "A profiler watches your program run and tells you where the time actually goes, so you fix the real bottleneck instead of guessing. Learn to read a profile and a flame graph, then run the measure-change-remeasure loop.",
        "order": 3,
        "phases": [
          {
            "slug": "01-measure-dont-guess",
            "title": "Measure, Don't Guess",
            "phaseNum": "1",
            "order": 1,
            "summary": "A profiler watches your program run and reports where the time actually goes. Your intuition about the slow part is usually wrong, and most of the time hides in a small spot - so measure first.",
            "filePath": "/guides/performance/profiling-101/01-measure-dont-guess.md"
          },
          {
            "slug": "02-reading-a-profile",
            "title": "Reading a Profile",
            "phaseNum": "2",
            "order": 2,
            "summary": "A profile ranks functions by time. The key distinction is self time (spent in the function itself) vs. cumulative time (it plus everything it called). A flame graph draws this as boxes where width = total time - the wide bar is your target.",
            "filePath": "/guides/performance/profiling-101/02-reading-a-profile.md"
          },
          {
            "slug": "03-from-profile-to-fix",
            "title": "From Profile to Fix",
            "phaseNum": "3",
            "order": 3,
            "summary": "The loop: confirm the hypothesis, change exactly one thing, re-measure. The common wins are an accidental O(n\u00b2), an N+1 query, and repeated work you can cache. Profile a realistic workload, and don't optimize cold paths.",
            "filePath": "/guides/performance/profiling-101/03-from-profile-to-fix.md"
          }
        ]
      },
      {
        "slug": "observability-logs-metrics-traces",
        "title": "Observability: Logs, Metrics & Traces",
        "summary": "What observability actually is, how logs, metrics, and traces each see a different slice of your running system, and how to use all three together to find out why something is slow.",
        "order": 4,
        "phases": [
          {
            "slug": "01-monitoring-vs-observability",
            "title": "Monitoring vs Observability",
            "phaseNum": "1",
            "order": 1,
            "summary": "Monitoring watches the known things you already set up alerts for; observability is being able to ask brand-new questions about why a system is misbehaving, without shipping new code to answer them.",
            "filePath": "/guides/performance/observability-logs-metrics-traces/01-monitoring-vs-observability.md"
          },
          {
            "slug": "02-the-three-pillars",
            "title": "The Three Pillars",
            "phaseNum": "2",
            "order": 2,
            "summary": "Logs are discrete events, metrics are numbers aggregated over time (counters, gauges, histograms), and traces follow one request across services as a tree of spans - each sees something the others can't.",
            "filePath": "/guides/performance/observability-logs-metrics-traces/02-the-three-pillars.md"
          },
          {
            "slug": "03-putting-them-together",
            "title": "Putting Them Together",
            "phaseNum": "3",
            "order": 3,
            "summary": "Debug a real slowdown end to end - a metric alert points at the symptom, a trace finds the slow service, logs explain why - plus a quick map of the tool landscape and the two traps that bite teams: cardinality explosions and alert fatigue.",
            "filePath": "/guides/performance/observability-logs-metrics-traces/03-putting-them-together.md"
          }
        ]
      },
      {
        "slug": "reading-dynatrace",
        "title": "Reading Dynatrace (What It's Showing You)",
        "summary": "What Dynatrace actually is, how to follow one request through a distributed trace, and how to read a 'Problem' and its proposed root cause without trusting it blindly.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-dynatrace-actually-is",
            "title": "What Dynatrace Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Dynatrace is an APM platform that auto-instruments your services and keeps one live model of every entity and how they connect - an always-on x-ray of your system, not a pile of dashboards.",
            "filePath": "/guides/performance/reading-dynatrace/01-what-dynatrace-actually-is.md"
          },
          {
            "slug": "02-reading-a-service-flow-and-a-trace",
            "title": "Reading a Service Flow & a Trace",
            "phaseNum": "2",
            "order": 2,
            "summary": "Follow one request across services, read the response-time breakdown to see where the milliseconds actually go, and spot the slow tier or failing dependency in a distributed trace.",
            "filePath": "/guides/performance/reading-dynatrace/02-reading-a-service-flow-and-a-trace.md"
          },
          {
            "slug": "03-problems-and-root-cause",
            "title": "Problems & Root Cause",
            "phaseNum": "3",
            "order": 3,
            "summary": "How Dynatrace folds many correlated symptoms into one 'Problem' and proposes a root cause, how to walk from alert to affected entities to the actual cause, and why you verify that cause instead of trusting it blindly.",
            "filePath": "/guides/performance/reading-dynatrace/03-problems-and-root-cause.md"
          }
        ]
      },
      {
        "slug": "reading-graylog",
        "title": "Reading Graylog (Log Search & Streams)",
        "summary": "What centralized logging actually is, how to search across dozens of servers from one box, and how streams, dashboards, and alerts turn a flood of logs into something you can stand on.",
        "order": 6,
        "phases": [
          {
            "slug": "01-why-centralized-logs",
            "title": "Why Centralized Logs",
            "phaseNum": "1",
            "order": 1,
            "summary": "On one box you grep a file; across a fleet you can't - so Graylog and ELK ship every log into one searchable place, where the big shift is structured fields instead of raw text.",
            "filePath": "/guides/performance/reading-graylog/01-why-centralized-logs.md"
          },
          {
            "slug": "02-searching-effectively",
            "title": "Searching Effectively",
            "phaseNum": "2",
            "order": 2,
            "summary": "The query model: field:value searches, time-range scoping as your biggest lever, boolean operators, following one request by its correlation id, and reading the histogram to find the spike.",
            "filePath": "/guides/performance/reading-graylog/02-searching-effectively.md"
          },
          {
            "slug": "03-streams-dashboards-alerts",
            "title": "Streams, Dashboards & Alerts",
            "phaseNum": "3",
            "order": 3,
            "summary": "Route subsets of logs into streams (like just prod ERRORs), save dashboards you can glance at, and alert on log conditions so the system pages you - plus the trade-offs of what to log, retention, and never logging secrets.",
            "filePath": "/guides/performance/reading-graylog/03-streams-dashboards-alerts.md"
          }
        ]
      },
      {
        "slug": "prometheus-and-grafana",
        "title": "Prometheus & Grafana, Explained",
        "summary": "Prometheus scrapes and stores your metrics; Grafana queries and draws them. What each one actually does, how to read a PromQL query, and how to build dashboards and alerts that don't lie to you.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-each-one-does",
            "title": "What Each One Does",
            "phaseNum": "1",
            "order": 1,
            "summary": "Prometheus is a time-series database that scrapes metrics from your services and stores them; Grafana is the dashboard layer that queries and visualizes them. Two tools, two jobs: collect-and-store vs display.",
            "filePath": "/guides/performance/prometheus-and-grafana/01-what-each-one-does.md"
          },
          {
            "slug": "02-metrics-and-promql",
            "title": "Metrics & a Taste of PromQL",
            "phaseNum": "2",
            "order": 2,
            "summary": "The three metric types (counter, gauge, histogram), what labels are for, and how to read a real PromQL query - including why you graph rate() over a counter instead of the raw number.",
            "filePath": "/guides/performance/prometheus-and-grafana/02-metrics-and-promql.md"
          },
          {
            "slug": "03-dashboards-and-alerting",
            "title": "Dashboards & Alerting",
            "phaseNum": "3",
            "order": 3,
            "summary": "Build a panel that answers a real question, use RED/USE to decide what to chart, and fire an alert on a condition with Alertmanager - while avoiding dashboards nobody reads, alert fatigue, and cardinality blowups.",
            "filePath": "/guides/performance/prometheus-and-grafana/03-dashboards-and-alerting.md"
          }
        ]
      },
      {
        "slug": "optimizing-real-systems",
        "title": "Optimizing Real Systems",
        "summary": "Putting measurement to work end to end: run a disciplined optimization loop against a target, learn where the time actually goes in real systems, and ship speed safely in production without breaking correctness.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-optimization-loop",
            "title": "The Optimization Loop",
            "phaseNum": "1",
            "order": 1,
            "summary": "Optimization is a loop: measure, find the bottleneck, form one hypothesis, change exactly one thing, re-measure, repeat - against a target you set in advance, stopping the moment you hit it. Optimizing without a baseline or a target is how you lose weeks.",
            "filePath": "/guides/performance/optimizing-real-systems/01-the-optimization-loop.md"
          },
          {
            "slug": "02-where-the-time-goes",
            "title": "Where the Time Actually Goes",
            "phaseNum": "2",
            "order": 2,
            "summary": "In real systems the time is almost never where you guess. Ranked by how often they're the real bottleneck: the database (N+1, missing indexes), the network (chatty calls, payload size), I/O and serialization, then CPU and algorithms - and the biggest lever of all, doing less work via caching.",
            "filePath": "/guides/performance/optimizing-real-systems/02-where-the-time-goes.md"
          },
          {
            "slug": "03-optimizing-safely-in-production",
            "title": "Optimizing Safely in Production",
            "phaseNum": "3",
            "order": 3,
            "summary": "A benchmark win is a hypothesis, not a result - verify it with real traffic and observability, judge it by percentiles (p95/p99) not averages, and avoid the three classic traps: micro-optimizing a cold path, optimizing the wrong layer, and trading correctness or readability for speed you didn't need.",
            "filePath": "/guides/performance/optimizing-real-systems/03-optimizing-safely-in-production.md"
          }
        ]
      },
      {
        "slug": "web-performance-core-web-vitals",
        "title": "Web Performance and Core Web Vitals",
        "summary": "What actually makes a page feel fast: LCP, CLS, and INP, the Network tab and bundle size, and the fixes that move the numbers.",
        "order": 9,
        "phases": [
          {
            "slug": "01-perceived-performance-and-the-three-vitals",
            "title": "Perceived Performance and the Three Vitals",
            "phaseNum": "1",
            "order": 1,
            "summary": "Performance is what the user feels, not what a server log says. The three Core Web Vitals - LCP, CLS, and INP - turn loading, visual stability, and responsiveness into numbers you can chase.",
            "filePath": "/guides/performance/web-performance-core-web-vitals/01-perceived-performance-and-the-three-vitals.md"
          },
          {
            "slug": "02-measuring-what-users-feel",
            "title": "Measuring What Users Feel",
            "phaseNum": "2",
            "order": 2,
            "summary": "Lab versus field data, why Lighthouse and real users disagree, and how to read the Network tab to see where the time and the bytes actually go.",
            "filePath": "/guides/performance/web-performance-core-web-vitals/02-measuring-what-users-feel.md"
          },
          {
            "slug": "03-the-levers-that-move-the-numbers",
            "title": "The Levers That Move the Numbers",
            "phaseNum": "3",
            "order": 3,
            "summary": "The fixes that pay: bundle size and code splitting, image optimization, caching and a CDN, killing render-blocking resources, and sizing media so the layout stops jumping.",
            "filePath": "/guides/performance/web-performance-core-web-vitals/03-the-levers-that-move-the-numbers.md"
          }
        ]
      },
      {
        "slug": "lazy-loading-explained",
        "title": "Lazy Loading Explained",
        "summary": "Why deferring work until it's actually needed is one of the cheapest performance wins available, and where it stops paying off.",
        "order": 10,
        "phases": [
          {
            "slug": "01-dont-do-work-nobody-asked-for",
            "title": "Don't do work nobody asked for yet",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why deferring work until it's actually needed is one of the cheapest performance wins available, and where it stops paying off.",
            "filePath": "/guides/performance/lazy-loading-explained/01-dont-do-work-nobody-asked-for.md"
          },
          {
            "slug": "02-where-youll-use-it",
            "title": "Where you'll actually use it",
            "phaseNum": "2",
            "order": 2,
            "summary": "Why deferring work until it's actually needed is one of the cheapest performance wins available, and where it stops paying off.",
            "filePath": "/guides/performance/lazy-loading-explained/02-where-youll-use-it.md"
          },
          {
            "slug": "03-the-tradeoff",
            "title": "The tradeoff",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why deferring work until it's actually needed is one of the cheapest performance wins available, and where it stops paying off.",
            "filePath": "/guides/performance/lazy-loading-explained/03-the-tradeoff.md"
          }
        ]
      },
      {
        "slug": "memoization-explained",
        "title": "Memoization Explained",
        "summary": "How caching a pure function's return value by its arguments lets you skip redoing the same expensive work twice, and where that trick quietly breaks.",
        "order": 11,
        "phases": [
          {
            "slug": "01-dont-compute-twice",
            "title": "Don't compute the same answer twice",
            "phaseNum": "1",
            "order": 1,
            "summary": "How caching a pure function's return value by its arguments lets you skip redoing the same expensive work twice, and where that trick quietly breaks.",
            "filePath": "/guides/performance/memoization-explained/01-dont-compute-twice.md"
          },
          {
            "slug": "02-how-to-implement-it",
            "title": "How to actually implement it",
            "phaseNum": "2",
            "order": 2,
            "summary": "How caching a pure function's return value by its arguments lets you skip redoing the same expensive work twice, and where that trick quietly breaks.",
            "filePath": "/guides/performance/memoization-explained/02-how-to-implement-it.md"
          },
          {
            "slug": "03-when-it-backfires",
            "title": "When it backfires",
            "phaseNum": "3",
            "order": 3,
            "summary": "How caching a pure function's return value by its arguments lets you skip redoing the same expensive work twice, and where that trick quietly breaks.",
            "filePath": "/guides/performance/memoization-explained/03-when-it-backfires.md"
          }
        ]
      },
      {
        "slug": "debouncing-and-throttling",
        "title": "Debouncing and Throttling",
        "summary": "Two related techniques for taming a firehose of events \u2014 waiting for a pause versus capping the rate \u2014 and how to pick between them.",
        "order": 12,
        "phases": [
          {
            "slug": "01-the-firehose-problem",
            "title": "The firehose problem",
            "phaseNum": "1",
            "order": 1,
            "summary": "Two related techniques for taming a firehose of events \u2014 waiting for a pause versus capping the rate \u2014 and how to pick between them.",
            "filePath": "/guides/performance/debouncing-and-throttling/01-the-firehose-problem.md"
          },
          {
            "slug": "02-debounce",
            "title": "Debounce: wait for a pause",
            "phaseNum": "2",
            "order": 2,
            "summary": "Two related techniques for taming a firehose of events \u2014 waiting for a pause versus capping the rate \u2014 and how to pick between them.",
            "filePath": "/guides/performance/debouncing-and-throttling/02-debounce.md"
          },
          {
            "slug": "03-throttle",
            "title": "Throttle: cap the rate",
            "phaseNum": "3",
            "order": 3,
            "summary": "Two related techniques for taming a firehose of events \u2014 waiting for a pause versus capping the rate \u2014 and how to pick between them.",
            "filePath": "/guides/performance/debouncing-and-throttling/03-throttle.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "security",
    "name": "Security",
    "icon": "ti-shield-lock",
    "blurb": "The threats, the defaults, and the habits that keep you out of the news.",
    "guides": [
      {
        "slug": "what-security-means",
        "title": "What \\\"Security\\\" Even Means (Threat Modeling Basics)",
        "summary": "Security is protecting confidentiality, integrity, and availability against people who want your system to break - and threat modeling is just four plain questions that turn that vague worry into a plan.",
        "order": 1,
        "phases": [
          {
            "slug": "01-think-like-an-attacker",
            "title": "Think Like an Attacker",
            "phaseNum": "1",
            "order": 1,
            "summary": "Security means protecting three things - confidentiality, integrity, and availability (the CIA triad) - against people who actively want your system to break; the core skill is shifting from 'does it work?' to 'how could this be abused?'",
            "filePath": "/guides/security/what-security-means/01-think-like-an-attacker.md"
          },
          {
            "slug": "02-threat-modeling-lightly",
            "title": "Threat Modeling, Lightly",
            "phaseNum": "2",
            "order": 2,
            "summary": "Threat modeling is four plain questions - what are we protecting, who'd attack it and why, how could they get in, and what do we do about it - plus the idea of a trust boundary: the line where data crosses from somewhere you don't control into somewhere you do.",
            "filePath": "/guides/security/what-security-means/02-threat-modeling-lightly.md"
          },
          {
            "slug": "03-defense-in-depth",
            "title": "Defense in Depth & Least Privilege",
            "phaseNum": "3",
            "order": 3,
            "summary": "No single wall is enough, so you build layers (defense in depth); you give every component the minimum access it needs (least privilege); and you assume a breach will happen and design to limit the blast radius - while remembering that obscurity isn't security and humans are the softest target.",
            "filePath": "/guides/security/what-security-means/03-defense-in-depth.md"
          }
        ]
      },
      {
        "slug": "how-passwords-are-stored",
        "title": "How Passwords Should Be Stored (Hashing)",
        "summary": "Never store passwords in plain text. Store a one-way hash made with a slow, salted, password-specific algorithm like bcrypt, scrypt, or Argon2 - so a stolen database doesn't hand attackers everyone's password.",
        "order": 2,
        "phases": [
          {
            "slug": "01-hashing-not-encrypting",
            "title": "Hashing, Not Encrypting",
            "phaseNum": "1",
            "order": 1,
            "summary": "Store a one-way hash of the password, never the password itself. On login, hash the attempt and compare hashes - so a stolen database reveals no passwords. Hashing is not encryption.",
            "filePath": "/guides/security/how-passwords-are-stored/01-hashing-not-encrypting.md"
          },
          {
            "slug": "02-salt-and-fast-hashes",
            "title": "Salt (and Why Plain SHA-256 Isn't Enough)",
            "phaseNum": "2",
            "order": 2,
            "summary": "Identical passwords hash identically, which rainbow tables exploit. A per-user random salt fixes that. And general-purpose hashes like MD5 and SHA-256 are far too fast - attackers can try enormous numbers of guesses per second.",
            "filePath": "/guides/security/how-passwords-are-stored/02-salt-and-fast-hashes.md"
          },
          {
            "slug": "03-use-a-slow-hash",
            "title": "Use a Slow Hash Built for Passwords",
            "phaseNum": "3",
            "order": 3,
            "summary": "bcrypt, scrypt, and Argon2 are deliberately slow, salted, and tunable via a work factor. Use a vetted library, never roll your own, verify with a constant-time compare, and add a breach/strength check at signup.",
            "filePath": "/guides/security/how-passwords-are-stored/03-use-a-slow-hash.md"
          }
        ]
      },
      {
        "slug": "cors-explained",
        "title": "CORS, Explained (and Why It Keeps Blocking You)",
        "summary": "What CORS actually is - the browser protecting users by refusing to let one site read another's responses - how to read the error and the headers, and how to fix it on the server without opening a security hole.",
        "order": 3,
        "phases": [
          {
            "slug": "01-why-the-browser-blocks-you",
            "title": "Why the Browser Blocks You",
            "phaseNum": "1",
            "order": 1,
            "summary": "The same-origin policy means a web page can't read responses from a different origin by default - to protect the logged-in user. CORS is the server's way to say which other origins are allowed.",
            "filePath": "/guides/security/cors-explained/01-why-the-browser-blocks-you.md"
          },
          {
            "slug": "02-reading-the-error-and-the-headers",
            "title": "Reading the Error & the Headers",
            "phaseNum": "2",
            "order": 2,
            "summary": "Decode the classic 'blocked by CORS policy' console error, the request's Origin header, the response's Access-Control-Allow-Origin header, and the preflight OPTIONS request that fires before non-simple requests.",
            "filePath": "/guides/security/cors-explained/02-reading-the-error-and-the-headers.md"
          },
          {
            "slug": "03-fixing-it-properly",
            "title": "Fixing It Properly",
            "phaseNum": "3",
            "order": 3,
            "summary": "Set the right Access-Control-Allow-* headers on the server (not the client), why credentials and wildcard origins can't be combined, why you shouldn't slap Allow-Origin: * on a credentialed or private API, plus a symptom-to-fix cheat-card and a dev-proxy workaround.",
            "filePath": "/guides/security/cors-explained/03-fixing-it-properly.md"
          }
        ]
      },
      {
        "slug": "auth-vs-authz",
        "title": "Auth vs Authz (Sessions, JWT, OAuth)",
        "summary": "Authentication is proving who you are; authorization is what you're allowed to do - and after login, the server keeps you logged in with either a server-side session or a stateless token like a JWT. This guide untangles all of it, plus OAuth and 'Sign in with Google'.",
        "order": 4,
        "phases": [
          {
            "slug": "01-authentication-vs-authorization",
            "title": "Authentication vs Authorization",
            "phaseNum": "1",
            "order": 1,
            "summary": "Authentication (authn) answers 'who are you?' by proving identity; authorization (authz) answers 'what are you allowed to do?' by checking permissions. They're separate steps, they happen in that order, and you need both.",
            "filePath": "/guides/security/auth-vs-authz/01-authentication-vs-authorization.md"
          },
          {
            "slug": "02-sessions-vs-tokens",
            "title": "Keeping You Logged In: Sessions vs Tokens",
            "phaseNum": "2",
            "order": 2,
            "summary": "After you log in, the server has to remember you on every following request. Two approaches: a server-side session (a random id in a cookie, with the real state kept on the server) or a stateless signed token like a JWT (the client holds the data, the server just verifies the signature). Each has honest trade-offs around revocation, size, and scaling.",
            "filePath": "/guides/security/auth-vs-authz/02-sessions-vs-tokens.md"
          },
          {
            "slug": "03-oauth-and-sign-in-with",
            "title": "Delegated Access: OAuth & 'Sign in with\u2026'",
            "phaseNum": "3",
            "order": 3,
            "summary": "OAuth 2.0 lets one app get limited access to your data on another service without you handing over your password - the valet-key model. This phase covers the flow, access vs refresh tokens, scopes, and the difference between OAuth (authorization) and OpenID Connect, the thin layer on top that does authentication ('Sign in with Google').",
            "filePath": "/guides/security/auth-vs-authz/03-oauth-and-sign-in-with.md"
          }
        ]
      },
      {
        "slug": "https-and-tls",
        "title": "HTTPS / TLS, Explained",
        "summary": "What the padlock in your browser actually means: how TLS adds encryption, integrity, and server authentication on top of plain HTTP, how the handshake agrees on a key, and how certificates and Certificate Authorities decide who to trust.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-https-protects",
            "title": "What HTTPS Protects (and Doesn't)",
            "phaseNum": "1",
            "order": 1,
            "summary": "TLS wraps plain HTTP in three guarantees - encryption so eavesdroppers can't read it, integrity so nobody can tamper with it undetected, and authentication so you know you reached the real server. The padlock proves the connection is encrypted to whoever holds the certificate; it does not prove the site is honest or safe.",
            "filePath": "/guides/security/https-and-tls/01-what-https-protects.md"
          },
          {
            "slug": "02-the-handshake-and-keys",
            "title": "The Handshake & Keys",
            "phaseNum": "2",
            "order": 2,
            "summary": "How two strangers agree on a shared secret over an open wire: slow asymmetric (public/private key) cryptography is used to bootstrap trust and agree on a key, then fast symmetric encryption protects all the actual data. A walk through the TLS handshake with an ASCII diagram, and where TLS sits in the stack.",
            "filePath": "/guides/security/https-and-tls/02-the-handshake-and-keys.md"
          },
          {
            "slug": "03-certificates-and-trust",
            "title": "Certificates & Trust",
            "phaseNum": "3",
            "order": 3,
            "summary": "A certificate binds a domain to a public key and is signed by a Certificate Authority your browser already trusts - that chain of trust is what lets you believe you reached the real server. How Let's Encrypt made certificates free and automatic, and how to read certificate errors (expired, name mismatch, self-signed) calmly without clicking through warnings on real sites.",
            "filePath": "/guides/security/https-and-tls/03-certificates-and-trust.md"
          }
        ]
      },
      {
        "slug": "sql-injection-and-xss",
        "title": "SQL Injection & XSS, Explained",
        "summary": "The two classic injection holes share one root cause - user input getting treated as code - and one cure: keep data as data. Learn the mental model, then how to close SQL injection with parameterized queries and XSS with context-aware output encoding.",
        "order": 6,
        "phases": [
          {
            "slug": "01-the-one-bug-underneath-both",
            "title": "The One Bug Underneath Both: Mixing Data with Code",
            "phaseNum": "1",
            "order": 1,
            "summary": "SQL injection and XSS are the same bug: user input gets handed to a machine that reads it as instructions instead of as plain data. The cure for both is to keep a clean line between data and code.",
            "filePath": "/guides/security/sql-injection-and-xss/01-the-one-bug-underneath-both.md"
          },
          {
            "slug": "02-sql-injection",
            "title": "SQL Injection",
            "phaseNum": "2",
            "order": 2,
            "summary": "A query built by gluing strings together lets user input rewrite what the query does - reading, changing, or destroying data. The real fix is parameterized queries: hand the database the SQL and the values on separate channels so input is always treated as a value, never as SQL.",
            "filePath": "/guides/security/sql-injection-and-xss/02-sql-injection.md"
          },
          {
            "slug": "03-cross-site-scripting",
            "title": "Cross-Site Scripting (XSS)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Untrusted input rendered straight into a page is read by the browser as HTML and JavaScript, so it runs in other users' browsers - stealing sessions, defacing pages. The fix is context-aware output encoding (ideally an auto-escaping template engine), with a Content-Security-Policy as defense-in-depth.",
            "filePath": "/guides/security/sql-injection-and-xss/03-cross-site-scripting.md"
          }
        ]
      },
      {
        "slug": "owasp-top-10",
        "title": "The OWASP Top 10, Explained",
        "summary": "What OWASP and the Top 10 actually are - a shared checklist and vocabulary for the most common, most damaging ways web apps get broken into, and how to use it without fooling yourself into a false sense of security.",
        "order": 7,
        "phases": [
          {
            "slug": "01-what-owasp-is",
            "title": "What OWASP & the Top 10 Are",
            "phaseNum": "1",
            "order": 1,
            "summary": "OWASP is a nonprofit; the Top 10 is its periodically-updated list of the most common and impactful categories of web application security risk - a shared checklist and vocabulary, not a tool or a standard you install.",
            "filePath": "/guides/security/owasp-top-10/01-what-owasp-is.md"
          },
          {
            "slug": "02-the-big-categories",
            "title": "The Big Categories, in Plain English",
            "phaseNum": "2",
            "order": 2,
            "summary": "A plain-English walk through the major recurring OWASP categories - Broken Access Control, Injection, Cryptographic Failures, Auth failures, Security Misconfiguration, Vulnerable Components, SSRF, and Insecure Design - each with a one-line 'what it is + the fix.'",
            "filePath": "/guides/security/owasp-top-10/02-the-big-categories.md"
          },
          {
            "slug": "03-how-to-use-it",
            "title": "How to Actually Use It",
            "phaseNum": "3",
            "order": 3,
            "summary": "The OWASP Top 10 is a checklist, not a guarantee - thread it into design, code review, and dependency updates, lean on defense in depth, and never treat 'we checked it once' as 'we're secure.'",
            "filePath": "/guides/security/owasp-top-10/03-how-to-use-it.md"
          }
        ]
      },
      {
        "slug": "secrets-management",
        "title": "Secrets Management (Don't Commit Your Keys)",
        "summary": "What counts as a secret and why it leaks, how to keep API keys and passwords out of your code and out of Git, and how teams store, inject, and rotate secrets safely in production.",
        "order": 8,
        "phases": [
          {
            "slug": "01-what-counts-as-a-secret",
            "title": "What Counts as a Secret & Why It Leaks",
            "phaseNum": "1",
            "order": 1,
            "summary": "A secret is a key to something that costs money or data; the four kinds are API keys, database passwords, tokens, and private keys, and the number-one way they leak is being hardcoded into source and committed to Git.",
            "filePath": "/guides/security/secrets-management/01-what-counts-as-a-secret.md"
          },
          {
            "slug": "02-keep-them-out-of-code",
            "title": "Keep Them Out of Code",
            "phaseNum": "2",
            "order": 2,
            "summary": "Move secrets out of source into environment variables or a .env file, keep that file out of Git with .gitignore, commit a .env.example with placeholders, add a pre-commit secret scanner, and rotate any secret that was ever committed because it lives in Git history forever.",
            "filePath": "/guides/security/secrets-management/02-keep-them-out-of-code.md"
          },
          {
            "slug": "03-real-secrets-management",
            "title": "Real Secrets Management",
            "phaseNum": "3",
            "order": 3,
            "summary": "For teams and production: a secrets manager stores keys centrally, encrypted, access-controlled, and audited; inject them at runtime instead of baking them into images; grant least privilege per key; and make rotation routine because any secret will eventually leak. Includes a leaked-secret response cheat-card.",
            "filePath": "/guides/security/secrets-management/03-real-secrets-management.md"
          }
        ]
      },
      {
        "slug": "supply-chain-security",
        "title": "Supply-Chain Security",
        "summary": "Your dependencies are your attack surface: the npm install that owned you, lockfiles, typosquatting, and how to trust code you did not write.",
        "order": 9,
        "phases": [
          {
            "slug": "01-the-real-attack-surface",
            "title": "Your code is mostly other people's code",
            "phaseNum": "1",
            "order": 1,
            "summary": "Your dependencies are your attack surface: the npm install that owned you, lockfiles, typosquatting, and how to trust code you did not write.",
            "filePath": "/guides/security/supply-chain-security/01-the-real-attack-surface.md"
          },
          {
            "slug": "02-everyday-defenses",
            "title": "Pinning, scanning, and seeing what you ship",
            "phaseNum": "2",
            "order": 2,
            "summary": "Your dependencies are your attack surface: the npm install that owned you, lockfiles, typosquatting, and how to trust code you did not write.",
            "filePath": "/guides/security/supply-chain-security/02-everyday-defenses.md"
          },
          {
            "slug": "03-when-it-breaks",
            "title": "The terrible day, and what stops it",
            "phaseNum": "3",
            "order": 3,
            "summary": "Your dependencies are your attack surface: the npm install that owned you, lockfiles, typosquatting, and how to trust code you did not write.",
            "filePath": "/guides/security/supply-chain-security/03-when-it-breaks.md"
          }
        ]
      },
      {
        "slug": "security-headers-csp-hsts",
        "title": "Security Headers: CSP, HSTS, and Friends",
        "summary": "The HTTP response headers that harden a website - Content-Security-Policy, HSTS, and the rest - explained by the exact attack each one stops.",
        "order": 10,
        "phases": [
          {
            "slug": "01-headers-are-a-fence",
            "title": "Headers Are a Fence, Not a Lock",
            "phaseNum": "1",
            "order": 1,
            "summary": "Security headers are instructions you send the browser, telling it to enforce extra rules on your behalf - cheap, high-leverage defense that adds layers around code you can't make perfect.",
            "filePath": "/guides/security/security-headers-csp-hsts/01-headers-are-a-fence.md"
          },
          {
            "slug": "02-the-everyday-set",
            "title": "The Everyday Hardening Set",
            "phaseNum": "2",
            "order": 2,
            "summary": "The headers you set on nearly every site - HSTS, X-Content-Type-Options, frame defenses, Referrer-Policy, and the cookie flags - each explained by the exact attack it stops.",
            "filePath": "/guides/security/security-headers-csp-hsts/02-the-everyday-set.md"
          },
          {
            "slug": "03-rolling-out-csp",
            "title": "Rolling Out CSP Without Breaking the Site",
            "phaseNum": "3",
            "order": 3,
            "summary": "Content-Security-Policy limits where scripts and resources may load from, blunting XSS - here's how to deploy it in report-only mode first, read the violations, and tighten without taking your own site down.",
            "filePath": "/guides/security/security-headers-csp-hsts/03-rolling-out-csp.md"
          }
        ]
      },
      {
        "slug": "two-factor-authentication",
        "title": "Two-Factor Authentication, Explained",
        "summary": "Why a password alone isn't enough anymore, how the common second factors actually work under the hood, and which ones to trust with your real accounts.",
        "order": 11,
        "phases": [
          {
            "slug": "01-one-secret-isnt-enough",
            "title": "One Secret Isn't Enough",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why passwords alone keep failing \u2014 reuse, phishing, and breaches \u2014 and the something-you-know/have/are framework that fixes it.",
            "filePath": "/guides/security/two-factor-authentication/01-one-secret-isnt-enough.md"
          },
          {
            "slug": "02-how-the-methods-work",
            "title": "How the Common Methods Actually Work",
            "phaseNum": "2",
            "order": 2,
            "summary": "SMS codes, authenticator apps (TOTP), and hardware keys (WebAuthn) all count as 2FA \u2014 but they resist attacks very differently.",
            "filePath": "/guides/security/two-factor-authentication/02-how-the-methods-work.md"
          },
          {
            "slug": "03-what-this-means-for-you",
            "title": "What This Means for You",
            "phaseNum": "3",
            "order": 3,
            "summary": "What to actually turn on as a user or builder, why backup codes matter, and the account-recovery tradeoff that 2FA introduces.",
            "filePath": "/guides/security/two-factor-authentication/03-what-this-means-for-you.md"
          }
        ]
      },
      {
        "slug": "threat-modeling-a-real-system",
        "title": "Threat Modeling a Real System",
        "summary": "How to systematically find the security gaps in a whole system - not one vulnerability at a time, but by drawing the data flows, marking trust boundaries, and working through STRIDE against a real example: a file-sharing app with uploads, accounts, and payments.",
        "order": 12,
        "phases": [
          {
            "slug": "01-drawing-the-system",
            "title": "Drawing the System",
            "phaseNum": "1",
            "order": 1,
            "summary": "How to draw a data-flow diagram of a real application and mark its trust boundaries - the setup every STRIDE pass depends on.",
            "filePath": "/guides/security/threat-modeling-a-real-system/01-drawing-the-system.md"
          },
          {
            "slug": "02-stride-applied",
            "title": "STRIDE, Applied",
            "phaseNum": "2",
            "order": 2,
            "summary": "Walking each STRIDE category against a real app's trust boundaries - concrete findings on the file-sharing example, not abstract definitions.",
            "filePath": "/guides/security/threat-modeling-a-real-system/02-stride-applied.md"
          },
          {
            "slug": "03-from-threats-to-action",
            "title": "From Threats to Action",
            "phaseNum": "3",
            "order": 3,
            "summary": "Prioritizing threat-model findings by real risk, turning them into concrete fixes, and being honest about what threat modeling doesn't replace.",
            "filePath": "/guides/security/threat-modeling-a-real-system/03-from-threats-to-action.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "ai-ml",
    "name": "AI & Machine Learning",
    "icon": "ti-brain",
    "blurb": "Models, training, and putting AI into products - without hype or hand-waving.",
    "guides": [
      {
        "slug": "what-ai-and-ml-are",
        "title": "What AI & Machine Learning Actually Are",
        "summary": "AI is a big umbrella, machine learning is the part of it that learns rules from examples instead of being hand-coded, and today's chatbots are powerful pattern-matchers \u2014 not minds \u2014 that can be confidently wrong.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-nested-circles",
            "title": "AI vs ML vs Deep Learning vs LLMs",
            "phaseNum": "1",
            "order": 1,
            "summary": "AI is the big umbrella, machine learning is the part of AI that learns from data, deep learning is the part of ML that uses neural networks, and today's LLMs are one famous kind of deep learning \u2014 four nested circles, not four rival things.",
            "filePath": "/guides/ai-ml/what-ai-and-ml-are/01-the-nested-circles.md"
          },
          {
            "slug": "02-rules-vs-learning",
            "title": "Rules vs Learning",
            "phaseNum": "2",
            "order": 2,
            "summary": "Traditional code is rules a human writes by hand; machine learning shows the machine examples and lets it learn the rules itself \u2014 a shift that wins when the rules are too messy to write down, and loses when they aren't.",
            "filePath": "/guides/ai-ml/what-ai-and-ml-are/02-rules-vs-learning.md"
          },
          {
            "slug": "03-what-ai-is-and-isnt",
            "title": "What AI Is and Isn't",
            "phaseNum": "3",
            "order": 3,
            "summary": "Today's AI is powerful pattern-matching and prediction, not understanding \u2014 which is why it can be confidently wrong, mirrors the biases in its training data, and has no built-in sense of what's true.",
            "filePath": "/guides/ai-ml/what-ai-and-ml-are/03-what-ai-is-and-isnt.md"
          }
        ]
      },
      {
        "slug": "how-a-model-learns",
        "title": "How a Model Learns (Training, in Plain English)",
        "summary": "What 'training' actually does to a machine learning model \u2014 a model is a bundle of adjustable numbers, and training nudges those numbers until its predictions match known examples.",
        "order": 2,
        "phases": [
          {
            "slug": "01-data-weights-predictions",
            "title": "Data \u2192 Weights \u2192 Predictions",
            "phaseNum": "1",
            "order": 1,
            "summary": "A model is a big bundle of adjustable numbers called weights; training sets those numbers, and predicting means running a new input through them to get an answer.",
            "filePath": "/guides/ai-ml/how-a-model-learns/01-data-weights-predictions.md"
          },
          {
            "slug": "02-learning-by-being-wrong",
            "title": "Learning by Being Wrong",
            "phaseNum": "2",
            "order": 2,
            "summary": "Training is a loop: the model predicts, we measure how wrong it was (the loss), we nudge the weights to make it a little less wrong, and we repeat over millions of examples.",
            "filePath": "/guides/ai-ml/how-a-model-learns/02-learning-by-being-wrong.md"
          },
          {
            "slug": "03-overfitting-and-test-sets",
            "title": "Overfitting & Why Test Sets Exist",
            "phaseNum": "3",
            "order": 3,
            "summary": "A model can memorize its training data instead of learning the real pattern; we hold back data it never sees (validation and test sets) to catch that, and a model is only as fair as the data it learned from.",
            "filePath": "/guides/ai-ml/how-a-model-learns/03-overfitting-and-test-sets.md"
          }
        ]
      },
      {
        "slug": "using-an-llm-api",
        "title": "Using an LLM API in Your App",
        "summary": "Calling a hosted language model is a normal HTTP request: you POST a list of messages, you get back generated text \u2014 and this guide builds the mental model, the cost picture, and the reliability habits you need to ship it without a foot-gun.",
        "order": 3,
        "phases": [
          {
            "slug": "01-its-just-an-api-call",
            "title": "It's Just an API Call",
            "phaseNum": "1",
            "order": 1,
            "summary": "An LLM API is a normal HTTP request: you POST a list of messages with roles (system, user), and you get back a generated assistant reply \u2014 here's the exact request and response shape, annotated.",
            "filePath": "/guides/ai-ml/using-an-llm-api/01-its-just-an-api-call.md"
          },
          {
            "slug": "02-tokens-context-and-cost",
            "title": "Tokens, Context & Cost",
            "phaseNum": "2",
            "order": 2,
            "summary": "A token is a chunk of text; the context window is the model's limited short-term memory that input and output must both fit inside; and you pay per token \u2014 so long histories cost more and can overflow. Plus streaming for responsiveness.",
            "filePath": "/guides/ai-ml/using-an-llm-api/02-tokens-context-and-cost.md"
          },
          {
            "slug": "03-building-reliably",
            "title": "Building Reliably",
            "phaseNum": "3",
            "order": 3,
            "summary": "The model is non-deterministic, can be confidently wrong, can be slow, and can fail \u2014 so build for it: control randomness with temperature, verify outputs instead of trusting them, handle timeouts and retries, and ask for structured output like JSON.",
            "filePath": "/guides/ai-ml/using-an-llm-api/03-building-reliably.md"
          }
        ]
      },
      {
        "slug": "prompt-engineering-honestly",
        "title": "Prompt Engineering, Honestly",
        "summary": "What actually improves the output of a language model \u2014 clear, specific, well-structured instructions \u2014 and what's just folklore, explained without the hype.",
        "order": 4,
        "phases": [
          {
            "slug": "01-instruction-not-a-spell",
            "title": "A Prompt Is an Instruction, Not a Spell",
            "phaseNum": "1",
            "order": 1,
            "summary": "A language model predicts the most likely continuation of your text, so clear, specific, well-structured instructions get better outputs and vague ones get vague outputs.",
            "filePath": "/guides/ai-ml/prompt-engineering-honestly/01-instruction-not-a-spell.md"
          },
          {
            "slug": "02-techniques-that-help",
            "title": "The Techniques That Actually Help",
            "phaseNum": "2",
            "order": 2,
            "summary": "The handful of prompting techniques that genuinely improve output: give context and a role, be specific about format and length, show examples, break hard tasks into steps, and say what to do rather than only what not to.",
            "filePath": "/guides/ai-ml/prompt-engineering-honestly/02-techniques-that-help.md"
          },
          {
            "slug": "03-honest-limits",
            "title": "Honest Limits",
            "phaseNum": "3",
            "order": 3,
            "summary": "What prompting can't do: it can't add knowledge the model lacks, can't guarantee correctness, and 'magic phrases' are mostly folklore \u2014 the real work is iteration, testing on real cases, and watching for prompt injection.",
            "filePath": "/guides/ai-ml/prompt-engineering-honestly/03-honest-limits.md"
          }
        ]
      },
      {
        "slug": "embeddings-and-vector-search",
        "title": "Embeddings & Vector Search, Explained",
        "summary": "What an embedding actually is (meaning turned into a list of numbers), how 'nearness' between two pieces of text is measured, and how vector databases search millions of them by meaning instead of keywords.",
        "order": 5,
        "phases": [
          {
            "slug": "01-meaning-as-coordinates",
            "title": "Meaning as Coordinates \u2014 What an Embedding Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "An embedding is a list of numbers (a vector) that captures the meaning of a piece of text or image, placing it on a map where similar meanings land near each other and unrelated ones land far apart.",
            "filePath": "/guides/ai-ml/embeddings-and-vector-search/01-meaning-as-coordinates.md"
          },
          {
            "slug": "02-measuring-similarity",
            "title": "Measuring Similarity \u2014 From 'Near' to Search by Meaning",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a computer measures how 'near' two vectors are (cosine similarity / distance), and why embedding your query and finding the nearest stored vectors gives you search by meaning that handles synonyms and paraphrase, not keyword matching.",
            "filePath": "/guides/ai-ml/embeddings-and-vector-search/02-measuring-similarity.md"
          },
          {
            "slug": "03-vector-databases-and-the-gotchas",
            "title": "Vector Databases & the Gotchas \u2014 Searching Millions, Without Getting Burned",
            "phaseNum": "3",
            "order": 3,
            "summary": "How vector databases store millions of embeddings and find nearest neighbors fast using approximate (ANN) indexes, the main tools (pgvector, FAISS, Pinecone, and friends), and the three traps that quietly ruin results: cross-model vectors, chunking, and confusing similarity with correctness.",
            "filePath": "/guides/ai-ml/embeddings-and-vector-search/03-vector-databases-and-the-gotchas.md"
          }
        ]
      },
      {
        "slug": "rag-explained",
        "title": "RAG (Retrieval-Augmented Generation), Explained",
        "summary": "What RAG actually is \u2014 retrieving the right facts from your own data first, then asking the model to answer using them \u2014 why an LLM needs it, how the pipeline works end to end, and why good RAG is mostly good retrieval.",
        "order": 6,
        "phases": [
          {
            "slug": "01-the-problem-rag-solves",
            "title": "The Problem RAG Solves",
            "phaseNum": "1",
            "order": 1,
            "summary": "An LLM only knows its training data \u2014 stale, generic, and blind to your docs \u2014 so it fills the gaps by making things up. RAG fixes this by retrieving the relevant facts first and asking the model to answer using them: the open-book exam.",
            "filePath": "/guides/ai-ml/rag-explained/01-the-problem-rag-solves.md"
          },
          {
            "slug": "02-how-rag-works",
            "title": "How RAG Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "The RAG pipeline end to end: chunk your documents, embed the chunks into a vector store ahead of time, then at query time embed the question, retrieve the most relevant chunks, stuff them into the prompt as context, and generate the answer.",
            "filePath": "/guides/ai-ml/rag-explained/02-how-rag-works.md"
          },
          {
            "slug": "03-why-its-harder-than-it-looks",
            "title": "Why It's Harder Than It Looks",
            "phaseNum": "3",
            "order": 3,
            "summary": "RAG quality is retrieval quality. The failure modes \u2014 bad chunking, the model ignoring or misusing context, retrieving irrelevant or stale chunks, and thin context that still leaves it hallucinating \u2014 plus how to defend (cite sources, evaluate retrieval, keep the index fresh), and the honest line between RAG and fine-tuning.",
            "filePath": "/guides/ai-ml/rag-explained/03-why-its-harder-than-it-looks.md"
          }
        ]
      },
      {
        "slug": "running-models-locally",
        "title": "Running Models Locally",
        "summary": "What it really means to run an LLM on your own machine \u2014 the honest trade-off against a hosted API, a real Ollama session from download to local API call, and how model size, RAM/VRAM, and quantization decide whether it runs at all.",
        "order": 7,
        "phases": [
          {
            "slug": "01-why-run-locally",
            "title": "Why (and Why Not) Run Locally",
            "phaseNum": "1",
            "order": 1,
            "summary": "The honest trade-off between running an LLM on your own machine and calling a hosted API: privacy, zero per-token cost, offline use, and control \u2014 weighed against weaker models, your hardware's limits, and setup effort.",
            "filePath": "/guides/ai-ml/running-models-locally/01-why-run-locally.md"
          },
          {
            "slug": "02-getting-one-running",
            "title": "Getting One Running (Ollama)",
            "phaseNum": "2",
            "order": 2,
            "summary": "The mental model \u2014 download an open-weights model and run it locally \u2014 then a real Ollama session: pull a model, chat with it in the terminal, and hit its local API endpoint from your own code.",
            "filePath": "/guides/ai-ml/running-models-locally/02-getting-one-running.md"
          },
          {
            "slug": "03-hardware-and-quantization",
            "title": "Hardware, Quantization & Reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "What actually decides whether a model runs: its size in parameters versus your RAM/VRAM, and quantization \u2014 shrinking the weights to fit, trading a little quality for a lot of memory. CPU versus GPU speed, and how to match a model to your machine.",
            "filePath": "/guides/ai-ml/running-models-locally/03-hardware-and-quantization.md"
          }
        ]
      },
      {
        "slug": "fine-tuning-vs-prompting",
        "title": "Fine-Tuning vs Prompting, Honestly",
        "summary": "When training your own model is \u2014 and isn't \u2014 worth it: prompting steers at request time, RAG adds knowledge, fine-tuning changes the model's default behavior, and the honest order is to try them cheapest-first.",
        "order": 8,
        "phases": [
          {
            "slug": "01-three-ways-to-steer-a-model",
            "title": "Three Ways to Steer a Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "The three ways to change what a model gives you: prompting changes the instructions at request time, RAG injects knowledge at request time, and fine-tuning adjusts the model's weights to change its default behavior \u2014 RAG adds knowledge, fine-tuning teaches behavior.",
            "filePath": "/guides/ai-ml/fine-tuning-vs-prompting/01-three-ways-to-steer-a-model.md"
          },
          {
            "slug": "02-what-fine-tuning-actually-involves",
            "title": "What Fine-Tuning Actually Involves",
            "phaseNum": "2",
            "order": 2,
            "summary": "The real work of fine-tuning: building a curated dataset of high-quality example pairs (where most of the cost lives), running the training, hosting and serving the tuned model, the lighter LoRA approach, and how you'd actually know if it worked.",
            "filePath": "/guides/ai-ml/fine-tuning-vs-prompting/02-what-fine-tuning-actually-involves.md"
          },
          {
            "slug": "03-choosing-the-honest-order",
            "title": "Choosing \u2014 the Honest Order",
            "phaseNum": "3",
            "order": 3,
            "summary": "The decision order: try prompting, then add RAG, then fine-tune \u2014 because each step costs more and locks you in more. Fine-tune for consistent format/style/tone or a narrow task at scale, never to teach facts, and never before prompting is exhausted, with a decision table and the traps to avoid.",
            "filePath": "/guides/ai-ml/fine-tuning-vs-prompting/03-choosing-the-honest-order.md"
          }
        ]
      },
      {
        "slug": "evaluating-llm-output",
        "title": "Evaluating LLM Output",
        "summary": "Evals, not vibes: how to measure whether an LLM feature actually works, catch prompt regressions, and ship changes with confidence.",
        "order": 9,
        "phases": [
          {
            "slug": "01-why-vibes-dont-scale",
            "title": "Why Vibes Don't Scale",
            "phaseNum": "1",
            "order": 1,
            "summary": "You can't improve what you don't measure: eyeballing a few examples lies to you, and an eval is a real input set plus an expected behavior you can score.",
            "filePath": "/guides/ai-ml/evaluating-llm-output/01-why-vibes-dont-scale.md"
          },
          {
            "slug": "02-how-to-grade-output",
            "title": "How to Actually Grade Output",
            "phaseNum": "2",
            "order": 2,
            "summary": "The three ways to score model output \u2014 exact and rule-based checks, reference-based metrics, and LLM-as-judge \u2014 with where each one fits and where each one lies to you.",
            "filePath": "/guides/ai-ml/evaluating-llm-output/02-how-to-grade-output.md"
          },
          {
            "slug": "03-evals-as-a-habit",
            "title": "Evals as a Habit",
            "phaseNum": "3",
            "order": 3,
            "summary": "Run evals on every prompt change and model upgrade to catch regressions, track quality over time, and know where offline evals end and production monitoring begins.",
            "filePath": "/guides/ai-ml/evaluating-llm-output/03-evals-as-a-habit.md"
          }
        ]
      },
      {
        "slug": "building-an-ai-agent",
        "title": "Building an AI Agent",
        "summary": "What an agent actually is under the hood: the model plus tools plus a loop. Function-calling, the reasoning-acting cycle, and where agents go wrong.",
        "order": 10,
        "phases": [
          {
            "slug": "01-an-agent-is-a-loop",
            "title": "An Agent Is a Loop",
            "phaseNum": "1",
            "order": 1,
            "summary": "The mental model for an AI agent: a language model given tools and a loop. It reasons, decides to call a tool, reads the result, and repeats until done \u2014 and you write the loop, the model makes the choices.",
            "filePath": "/guides/ai-ml/building-an-ai-agent/01-an-agent-is-a-loop.md"
          },
          {
            "slug": "02-the-reasoning-acting-cycle",
            "title": "The Reasoning-Acting Cycle",
            "phaseNum": "2",
            "order": 2,
            "summary": "How the loop really runs: function-calling with a JSON schema, the turn-by-turn message exchange between your code and the model, how tool results feed back, and what memory actually means for an agent.",
            "filePath": "/guides/ai-ml/building-an-ai-agent/02-the-reasoning-acting-cycle.md"
          },
          {
            "slug": "03-where-agents-go-wrong",
            "title": "Where Agents Go Wrong",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest failure modes: infinite loops, hallucinated tool calls, runaway cost, and unsafe actions \u2014 plus the guardrails that contain them: step budgets, validation, approval gates, and observability.",
            "filePath": "/guides/ai-ml/building-an-ai-agent/03-where-agents-go-wrong.md"
          }
        ]
      },
      {
        "slug": "prompt-injection-and-guardrails",
        "title": "Prompt Injection and Guardrails",
        "summary": "Why untrusted text in an LLM's prompt is dangerous, how injection hijacks the model, and the guardrails that actually contain it.",
        "order": 11,
        "phases": [
          {
            "slug": "01-instructions-vs-data",
            "title": "Why the Model Can't Tell Instructions From Data",
            "phaseNum": "1",
            "order": 1,
            "summary": "To an LLM, your system instructions and any text you paste into the context arrive as one undifferentiated stream of tokens \u2014 there is no privileged channel that says 'this part is the rules.'",
            "filePath": "/guides/ai-ml/prompt-injection-and-guardrails/01-instructions-vs-data.md"
          },
          {
            "slug": "02-how-injection-works",
            "title": "How Injection Actually Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "Direct injection comes from the user; indirect injection hides in content the model fetches \u2014 a web page, a document, an email \u2014 and both aim to hijack actions or exfiltrate data.",
            "filePath": "/guides/ai-ml/prompt-injection-and-guardrails/02-how-injection-works.md"
          },
          {
            "slug": "03-guardrails-that-hold",
            "title": "Guardrails That Hold",
            "phaseNum": "3",
            "order": 3,
            "summary": "You can't stop the model from being fooled, so you contain it: separate trust levels, least-privilege tools, validated output, and a human in the loop for anything irreversible.",
            "filePath": "/guides/ai-ml/prompt-injection-and-guardrails/03-guardrails-that-hold.md"
          }
        ]
      },
      {
        "slug": "how-a-neural-network-is-structured",
        "title": "How a Neural Network Is Structured",
        "summary": "The structural anatomy of a neural network \u2014 layers, weights, biases, activation functions, and how one prediction flows through it \u2014 without touching how training works.",
        "order": 12,
        "phases": [
          {
            "slug": "01-neurons-and-layers",
            "title": "Neurons, Layers, and What \\\"Network\\\" Means",
            "phaseNum": "1",
            "order": 1,
            "summary": "The layered picture of a neural network \u2014 input, hidden, and output layers \u2014 and what a single neuron structurally is.",
            "filePath": "/guides/ai-ml/how-a-neural-network-is-structured/01-neurons-and-layers.md"
          },
          {
            "slug": "02-weights-and-activations",
            "title": "Weights, Biases, and Activation Functions",
            "phaseNum": "2",
            "order": 2,
            "summary": "What a neuron actually computes \u2014 a weighted sum plus a bias, then squashed through a non-linear activation function \u2014 and why skipping that non-linearity collapses the whole network into one big linear function.",
            "filePath": "/guides/ai-ml/how-a-neural-network-is-structured/02-weights-and-activations.md"
          },
          {
            "slug": "03-the-forward-pass",
            "title": "The Forward Pass",
            "phaseNum": "3",
            "order": 3,
            "summary": "How one prediction flows through the entire network structure end to end, from the input layer to the output layer \u2014 and where to go next to learn how the weights get set.",
            "filePath": "/guides/ai-ml/how-a-neural-network-is-structured/03-the-forward-pass.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "working-with-ai",
    "name": "Working with AI",
    "icon": "ti-robot",
    "blurb": "Practical AI for everyone - prompting, agents, CLIs, MCP, skills, and loops.",
    "guides": [
      {
        "slug": "what-ai-assistants-really-are",
        "title": "What an AI Assistant Really Is",
        "summary": "Demystify the thing behind the chat box: a model that predicts text, wrapped in tools and a loop. Once you see the three parts, agents stop being magic.",
        "order": 1,
        "phases": [
          {
            "slug": "01-model-tools-loop",
            "title": "The Model, the Tools, and the Loop",
            "phaseNum": "1",
            "order": 1,
            "summary": "The three parts every AI assistant is built from - a text-predicting model, tools that let it act, and a loop that runs the cycle - explained without math.",
            "filePath": "/guides/working-with-ai/what-ai-assistants-really-are/01-model-tools-loop.md"
          },
          {
            "slug": "02-chatbot-vs-agent",
            "title": "Chatbot vs Agent",
            "phaseNum": "2",
            "order": 2,
            "summary": "The line between something that only talks and something that takes actions for you - what changes when the loop runs many times, with concrete examples and the new risks it brings.",
            "filePath": "/guides/working-with-ai/what-ai-assistants-really-are/02-chatbot-vs-agent.md"
          },
          {
            "slug": "03-what-its-bad-at",
            "title": "What It Is Bad At",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest failure modes - confident wrong answers, no real memory, shaky exact math, and blindness to your private facts and recent events - and how to work around each.",
            "filePath": "/guides/working-with-ai/what-ai-assistants-really-are/03-what-its-bad-at.md"
          }
        ]
      },
      {
        "slug": "prompting-that-works",
        "title": "Prompting That Actually Works",
        "summary": "Stop guessing at magic words. Clear instructions, the right context, and a few reliable patterns get better results than any secret prompt.",
        "order": 2,
        "phases": [
          {
            "slug": "01-say-what-you-want",
            "title": "Say What You Actually Want",
            "phaseNum": "1",
            "order": 1,
            "summary": "The biggest gains come from clarity, not cleverness - spell out your goal, the context, the constraints, and the format you want back.",
            "filePath": "/guides/working-with-ai/prompting-that-works/01-say-what-you-want.md"
          },
          {
            "slug": "02-patterns-that-help",
            "title": "Patterns That Help",
            "phaseNum": "2",
            "order": 2,
            "summary": "A handful of reliable moves - assign a role, ask for steps, show an example, pin the output format, and let it think first - that lift answer quality across almost any task.",
            "filePath": "/guides/working-with-ai/prompting-that-works/02-patterns-that-help.md"
          },
          {
            "slug": "03-iterate-dont-one-shot",
            "title": "Iterate, Do Not One-Shot",
            "phaseNum": "3",
            "order": 3,
            "summary": "Treat the AI as a conversation you steer - refine, correct, and give feedback - and learn the moment when starting a fresh chat beats fighting a tangled one.",
            "filePath": "/guides/working-with-ai/prompting-that-works/03-iterate-dont-one-shot.md"
          }
        ]
      },
      {
        "slug": "trusting-ai-output",
        "title": "When to Trust AI",
        "summary": "AI sounds equally confident when it is right and when it is making things up. Learn why, and the habits that catch the difference before it costs you.",
        "order": 3,
        "phases": [
          {
            "slug": "01-why-it-makes-things-up",
            "title": "Why It Makes Things Up",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why AI invents convincing falsehoods: it is built to produce plausible-sounding text, not to check whether that text is true.",
            "filePath": "/guides/working-with-ai/trusting-ai-output/01-why-it-makes-things-up.md"
          },
          {
            "slug": "02-verification-habits",
            "title": "Verification Habits",
            "phaseNum": "2",
            "order": 2,
            "summary": "A small set of fast routines - asking for sources, cross-checking what matters, and using AI to draft rather than decide - that catch the big mistakes.",
            "filePath": "/guides/working-with-ai/trusting-ai-output/02-verification-habits.md"
          },
          {
            "slug": "03-where-it-fails",
            "title": "Where It Fails",
            "phaseNum": "3",
            "order": 3,
            "summary": "The predictable weak spots - exact arithmetic, recent events, niche facts, your private data, and confident citations - where you should check by default.",
            "filePath": "/guides/working-with-ai/trusting-ai-output/03-where-it-fails.md"
          }
        ]
      },
      {
        "slug": "ai-privacy-and-safety",
        "title": "AI Privacy and What Not to Paste",
        "summary": "Before you paste that document into a chatbot, know where it goes and what could come back to bite you. A practical privacy guide for everyday AI use.",
        "order": 4,
        "phases": [
          {
            "slug": "01-where-your-words-go",
            "title": "Where Your Words Go",
            "phaseNum": "1",
            "order": 1,
            "summary": "What actually happens to the text you type into a chatbot - whether it trains the model, how long it's kept, and why a business account is a different animal from a free one.",
            "filePath": "/guides/working-with-ai/ai-privacy-and-safety/01-where-your-words-go.md"
          },
          {
            "slug": "02-what-not-to-paste",
            "title": "What Not to Paste",
            "phaseNum": "2",
            "order": 2,
            "summary": "A concrete list of the data that should never go into a general chatbot - secrets, credentials, customer personal information, regulated data, and unreleased company plans - with examples of each.",
            "filePath": "/guides/working-with-ai/ai-privacy-and-safety/02-what-not-to-paste.md"
          },
          {
            "slug": "03-safer-habits-and-rules",
            "title": "Safer Habits and Org Rules",
            "phaseNum": "3",
            "order": 3,
            "summary": "The everyday habits that let you keep using AI safely - redacting before you paste, sticking to approved tools, knowing when a local model fits, and actually reading your organization's AI policy.",
            "filePath": "/guides/working-with-ai/ai-privacy-and-safety/03-safer-habits-and-rules.md"
          }
        ]
      },
      {
        "slug": "ai-agents-explained",
        "title": "AI Agents, Explained",
        "summary": "An agent is a chatbot that can act: it plans, uses tools, looks at the result, and tries again. Here is the loop, the power, and where to keep it on a leash.",
        "order": 5,
        "phases": [
          {
            "slug": "01-from-answering-to-doing",
            "title": "From Answering to Doing",
            "phaseNum": "1",
            "order": 1,
            "summary": "What turns a chatbot into an agent: handing the model real tools and the freedom to use them toward a goal instead of producing one reply.",
            "filePath": "/guides/working-with-ai/ai-agents-explained/01-from-answering-to-doing.md"
          },
          {
            "slug": "02-the-act-observe-loop",
            "title": "The Act-Observe Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "The cycle at the heart of every agent: plan a step, act, observe the result, adjust, and repeat until the goal is met or it gets stuck.",
            "filePath": "/guides/working-with-ai/ai-agents-explained/02-the-act-observe-loop.md"
          },
          {
            "slug": "03-autonomy-and-guardrails",
            "title": "Autonomy and Guardrails",
            "phaseNum": "3",
            "order": 3,
            "summary": "How much rope to give an agent: permissions, approvals, sandboxes, and human-in-the-loop, and how to match the leash to the stakes.",
            "filePath": "/guides/working-with-ai/ai-agents-explained/03-autonomy-and-guardrails.md"
          }
        ]
      },
      {
        "slug": "ai-in-the-terminal-clis",
        "title": "AI in the Terminal (CLIs)",
        "summary": "Coding agents that live in your terminal can read files, run commands, and edit code on your say-so. The workflow, the habits, and how the main CLIs compare.",
        "order": 6,
        "phases": [
          {
            "slug": "01-why-an-agent-in-your-terminal",
            "title": "Why an Agent in Your Terminal",
            "phaseNum": "1",
            "order": 1,
            "summary": "The shift from copy-pasting snippets out of a chatbot to an agent that works inside your real project, with your files and your commands.",
            "filePath": "/guides/working-with-ai/ai-in-the-terminal-clis/01-why-an-agent-in-your-terminal.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The Everyday Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "How a normal session actually flows: describe the goal, let it work, read the diff, approve or correct - and how permission modes keep you in control.",
            "filePath": "/guides/working-with-ai/ai-in-the-terminal-clis/02-the-everyday-loop.md"
          },
          {
            "slug": "03-claude-code-codex-gemini",
            "title": "Claude Code, Codex, and Gemini CLI",
            "phaseNum": "3",
            "order": 3,
            "summary": "An honest comparison of the three main terminal coding agents - what they share, where they differ, and how to pick one without overthinking it.",
            "filePath": "/guides/working-with-ai/ai-in-the-terminal-clis/03-claude-code-codex-gemini.md"
          }
        ]
      },
      {
        "slug": "ai-in-your-editor",
        "title": "AI in Your Editor",
        "summary": "From autocomplete to a chat that knows your codebase: how editor AI like Copilot and Cursor actually helps, and the one discipline that keeps it from hurting.",
        "order": 7,
        "phases": [
          {
            "slug": "01-autocomplete-to-conversation",
            "title": "Autocomplete to Conversation",
            "phaseNum": "1",
            "order": 1,
            "summary": "The range of editor AI, from inline next-line suggestions to a chat that edits your files, and what Copilot and Cursor each actually do.",
            "filePath": "/guides/working-with-ai/ai-in-your-editor/01-autocomplete-to-conversation.md"
          },
          {
            "slug": "02-prompting-inside-the-ide",
            "title": "Prompting Inside the IDE",
            "phaseNum": "2",
            "order": 2,
            "summary": "How to feed editor AI the right context - selections, specific files, and project rules - so its suggestions match your code instead of a generic version.",
            "filePath": "/guides/working-with-ai/ai-in-your-editor/02-prompting-inside-the-ide.md"
          },
          {
            "slug": "03-always-review-the-diff",
            "title": "Always Review the Diff",
            "phaseNum": "3",
            "order": 3,
            "summary": "The one non-negotiable habit of editor AI: reading every change before you accept it, and how to spot edits that look right but quietly aren't.",
            "filePath": "/guides/working-with-ai/ai-in-your-editor/03-always-review-the-diff.md"
          }
        ]
      },
      {
        "slug": "what-is-mcp",
        "title": "What Is MCP (Model Context Protocol)",
        "summary": "MCP is the standard plug that lets an AI assistant talk to your tools and data, the same way USB-C connects any device. What it is, how it is shaped, and how to add one safely.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-usb-c-port-for-ai",
            "title": "The USB-C Port for AI",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why one open protocol lets any AI app connect to any tool or data source without someone hand-writing custom glue for every pair.",
            "filePath": "/guides/working-with-ai/what-is-mcp/01-the-usb-c-port-for-ai.md"
          },
          {
            "slug": "02-servers-tools-resources",
            "title": "Servers, Tools, and Resources",
            "phaseNum": "2",
            "order": 2,
            "summary": "What's actually inside an MCP connection: servers that expose tools to call, resources to read, and prompts to reuse.",
            "filePath": "/guides/working-with-ai/what-is-mcp/02-servers-tools-resources.md"
          },
          {
            "slug": "03-adding-one-safely",
            "title": "Adding One Safely",
            "phaseNum": "3",
            "order": 3,
            "summary": "How to configure an MCP server, what access it gets once connected, and the trust question to settle before you plug anything in.",
            "filePath": "/guides/working-with-ai/what-is-mcp/03-adding-one-safely.md"
          }
        ]
      },
      {
        "slug": "ai-skills-and-plugins",
        "title": "Skills and Plugins",
        "summary": "Two ways to extend an AI assistant: skills teach it reusable know-how, plugins give it new powers. What each is, how they differ, and how to add or write your own.",
        "order": 9,
        "phases": [
          {
            "slug": "01-skills-reusable-knowhow",
            "title": "Skills: Reusable Know-How",
            "phaseNum": "1",
            "order": 1,
            "summary": "A skill is packaged instructions and reference files the assistant loads only when a task calls for it, so you stop re-explaining the same thing every session.",
            "filePath": "/guides/working-with-ai/ai-skills-and-plugins/01-skills-reusable-knowhow.md"
          },
          {
            "slug": "02-plugins-new-powers",
            "title": "Plugins: New Powers",
            "phaseNum": "2",
            "order": 2,
            "summary": "Plugins bundle commands, tools, and connectors that let the assistant reach outside systems and take real actions, going beyond what guidance alone can do.",
            "filePath": "/guides/working-with-ai/ai-skills-and-plugins/02-plugins-new-powers.md"
          },
          {
            "slug": "03-adding-and-writing-your-own",
            "title": "Adding and Writing Your Own",
            "phaseNum": "3",
            "order": 3,
            "summary": "How to install a skill or plugin someone else built, then author a small skill of your own - its description, its instructions, and what makes it trigger.",
            "filePath": "/guides/working-with-ai/ai-skills-and-plugins/03-adding-and-writing-your-own.md"
          }
        ]
      },
      {
        "slug": "context-engineering",
        "title": "Context Engineering",
        "summary": "The model only knows what is in front of it. Context engineering is the craft of controlling that window: what to include, what to cut, and what to pull in on demand.",
        "order": 10,
        "phases": [
          {
            "slug": "01-only-knows-what-it-sees",
            "title": "The Model Only Knows What It Sees",
            "phaseNum": "1",
            "order": 1,
            "summary": "The context window is the model's working memory, and what you put in it matters more than how cleverly you word the request.",
            "filePath": "/guides/working-with-ai/context-engineering/01-only-knows-what-it-sees.md"
          },
          {
            "slug": "02-managing-the-window",
            "title": "Managing the Window",
            "phaseNum": "2",
            "order": 2,
            "summary": "The practical moves for filling the window well: choosing what to include, compressing long material, pulling in documents on demand, and giving a tool memory that survives across sessions.",
            "filePath": "/guides/working-with-ai/context-engineering/02-managing-the-window.md"
          },
          {
            "slug": "03-context-rot-and-fixes",
            "title": "Context Rot and Fixes",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why long sessions slowly fill with noise and the model loses the plot, and the handful of fixes - compaction, fresh starts, and pruning - that keep the signal high.",
            "filePath": "/guides/working-with-ai/context-engineering/03-context-rot-and-fixes.md"
          }
        ]
      },
      {
        "slug": "loop-engineering",
        "title": "Loop Engineering",
        "summary": "The newest piece of the agent puzzle: designing the act-check-repeat loop so the AI corrects itself instead of confidently finishing wrong. A practical look at a term still settling.",
        "order": 11,
        "phases": [
          {
            "slug": "01-act-check-repeat",
            "title": "Act, Check, Repeat",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why the act-check-repeat loop, not the single answer, is the real unit of AI work - and where one-shot prompting quietly breaks down.",
            "filePath": "/guides/working-with-ai/loop-engineering/01-act-check-repeat.md"
          },
          {
            "slug": "02-designing-a-good-loop",
            "title": "Designing a Good Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "The three ingredients that make an agent's loop self-correcting: a goal it can verify, feedback it can act on, and a clear condition for stopping.",
            "filePath": "/guides/working-with-ai/loop-engineering/02-designing-a-good-loop.md"
          },
          {
            "slug": "03-a-new-term-honestly",
            "title": "A New Term, Honestly",
            "phaseNum": "3",
            "order": 3,
            "summary": "Where 'loop engineering' came from, how it sits next to prompt and context engineering, and which parts of the term are still genuinely up for grabs.",
            "filePath": "/guides/working-with-ai/loop-engineering/03-a-new-term-honestly.md"
          }
        ]
      },
      {
        "slug": "vibe-coding",
        "title": "Vibe Coding",
        "summary": "Building software by describing what you want and letting AI write it. What vibe coding is, where it genuinely shines, and where it quietly bites.",
        "order": 12,
        "phases": [
          {
            "slug": "01-describing-software-into-existence",
            "title": "Describing Software Into Existence",
            "phaseNum": "1",
            "order": 1,
            "summary": "What vibe coding means, who named it, and what the describe-run-react loop feels like when you're not an engineer.",
            "filePath": "/guides/working-with-ai/vibe-coding/01-describing-software-into-existence.md"
          },
          {
            "slug": "02-where-it-shines",
            "title": "Where It Shines",
            "phaseNum": "2",
            "order": 2,
            "summary": "The work vibe coding is genuinely great at - prototypes, personal tools, learning, and throwaway scripts where speed beats perfection.",
            "filePath": "/guides/working-with-ai/vibe-coding/02-where-it-shines.md"
          },
          {
            "slug": "03-where-it-bites",
            "title": "Where It Bites",
            "phaseNum": "3",
            "order": 3,
            "summary": "The failure modes - the last-mile wall, code you can't debug, and the security and maintenance risks that surface only later.",
            "filePath": "/guides/working-with-ai/vibe-coding/03-where-it-bites.md"
          }
        ]
      },
      {
        "slug": "rag-explained-simply",
        "title": "RAG in Plain English",
        "summary": "Retrieval-augmented generation is how you get an AI to answer from your documents instead of its memory. The idea, the moving parts, and why it goes wrong.",
        "order": 13,
        "phases": [
          {
            "slug": "01-give-the-ai-your-documents",
            "title": "Give the AI Your Documents",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why a plain chatbot can't answer from your private or current files, and what retrieval changes about that.",
            "filePath": "/guides/working-with-ai/rag-explained-simply/01-give-the-ai-your-documents.md"
          },
          {
            "slug": "02-how-it-works",
            "title": "How It Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "The four-step pipeline: split documents into chunks, turn them into searchable vectors, retrieve the relevant ones, and hand them to the model to answer.",
            "filePath": "/guides/working-with-ai/rag-explained-simply/02-how-it-works.md"
          },
          {
            "slug": "03-why-it-goes-wrong",
            "title": "Why It Goes Wrong",
            "phaseNum": "3",
            "order": 3,
            "summary": "The four common failure modes - bad chunking, stale data, wrong-passage retrieval, and ungrounded answers - and how to catch each one.",
            "filePath": "/guides/working-with-ai/rag-explained-simply/03-why-it-goes-wrong.md"
          }
        ]
      },
      {
        "slug": "local-ai-with-ollama",
        "title": "Running AI Locally (Ollama)",
        "summary": "Run a capable model on your own machine: private, free per use, and offline. What Ollama does, how to start, and the honest tradeoffs versus the big cloud models.",
        "order": 14,
        "phases": [
          {
            "slug": "01-why-run-a-model-yourself",
            "title": "Why Run a Model Yourself",
            "phaseNum": "1",
            "order": 1,
            "summary": "The four real reasons to run a local model - privacy, no per-use cost, offline access, and tinkering - and an honest read on who it suits and who it doesn't.",
            "filePath": "/guides/working-with-ai/local-ai-with-ollama/01-why-run-a-model-yourself.md"
          },
          {
            "slug": "02-getting-started-with-ollama",
            "title": "Getting Started with Ollama",
            "phaseNum": "2",
            "order": 2,
            "summary": "From nothing to a working local chat: install Ollama, pull a model, talk to it in the terminal, and size up the hardware you actually need.",
            "filePath": "/guides/working-with-ai/local-ai-with-ollama/02-getting-started-with-ollama.md"
          },
          {
            "slug": "03-limits-vs-the-cloud",
            "title": "Limits vs the Cloud",
            "phaseNum": "3",
            "order": 3,
            "summary": "Where a local model trails a frontier cloud model - quality, speed, and how much it can read at once - and a clear rule for choosing between them.",
            "filePath": "/guides/working-with-ai/local-ai-with-ollama/03-limits-vs-the-cloud.md"
          }
        ]
      },
      {
        "slug": "automate-work-with-ai",
        "title": "Automate Your Work with No-Code and AI",
        "summary": "The crossover that makes both worlds click: a no-code automation that calls an AI step. Triage, summarize, and draft on autopilot, with guardrails so it does not run wild.",
        "order": 15,
        "phases": [
          {
            "slug": "01-the-crossover",
            "title": "The Crossover",
            "phaseNum": "1",
            "order": 1,
            "summary": "Why a no-code automation with an AI step in the middle does work neither tool can do alone, and what that 'AI-in-the-loop' flow looks like.",
            "filePath": "/guides/working-with-ai/automate-work-with-ai/01-the-crossover.md"
          },
          {
            "slug": "02-a-real-example",
            "title": "A Real Example",
            "phaseNum": "2",
            "order": 2,
            "summary": "A step-by-step build of an email triage flow: incoming mail classified by AI, routed, and drafted into ready-to-send replies inside an automation tool.",
            "filePath": "/guides/working-with-ai/automate-work-with-ai/02-a-real-example.md"
          },
          {
            "slug": "03-guardrails",
            "title": "Guardrails",
            "phaseNum": "3",
            "order": 3,
            "summary": "The safety rails that keep an AI automation trustworthy: cost limits, catching wrong answers, human approval steps, and logging every run.",
            "filePath": "/guides/working-with-ai/automate-work-with-ai/03-guardrails.md"
          }
        ]
      },
      {
        "slug": "building-a-multi-agent-system",
        "title": "Building a Multi-Agent System",
        "summary": "When one agent juggling too much starts dropping things, the fix is splitting work across several narrower agents. The real orchestration patterns, and the failure modes that come with them.",
        "order": 16,
        "phases": [
          {
            "slug": "01-why-one-agent-isnt-enough",
            "title": "Why One Agent Isn't Enough",
            "phaseNum": "1",
            "order": 1,
            "summary": "A single agent juggling unrelated concerns tends to lose focus. Splitting work across specialized agents fixes that \u2014 at the cost of real coordination overhead. Both halves of that trade, honestly.",
            "filePath": "/guides/working-with-ai/building-a-multi-agent-system/01-why-one-agent-isnt-enough.md"
          },
          {
            "slug": "02-orchestration-patterns",
            "title": "Orchestration Patterns",
            "phaseNum": "2",
            "order": 2,
            "summary": "Three nameable shapes for coordinating multiple agents \u2014 linear pipeline, fan-out/fan-in, and supervisor-worker \u2014 with a concrete scenario for each.",
            "filePath": "/guides/working-with-ai/building-a-multi-agent-system/02-orchestration-patterns.md"
          },
          {
            "slug": "03-failure-recovery-and-guardrails",
            "title": "Failure Recovery and Guardrails",
            "phaseNum": "3",
            "order": 3,
            "summary": "What happens when a sub-agent fails, hallucinates, or loops \u2014 and the guardrails that contain it: timeouts, retry limits, output validation, and hard budget caps.",
            "filePath": "/guides/working-with-ai/building-a-multi-agent-system/03-failure-recovery-and-guardrails.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "no-code",
    "name": "No-Code & Automation",
    "icon": "ti-puzzle",
    "blurb": "Build apps and automate work without (much) code - Zapier, Make, n8n, Airtable, Retool.",
    "guides": [
      {
        "slug": "no-code-vs-code",
        "title": "No-Code, Low-Code, or Code?",
        "summary": "When to reach for a no-code tool, when low-code earns its keep, and when you should write code yourself - a clear-eyed decision framework, not a sales pitch.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-spectrum",
            "title": "The Spectrum: No-Code to Full Code",
            "phaseNum": "1",
            "order": 1,
            "summary": "What no-code, low-code, and code actually mean as points on a dial, with concrete examples and a look at what a no-code tool generates under the hood.",
            "filePath": "/guides/no-code/no-code-vs-code/01-the-spectrum.md"
          },
          {
            "slug": "02-the-real-tradeoffs",
            "title": "The Real Tradeoffs",
            "phaseNum": "2",
            "order": 2,
            "summary": "Speed now versus control later, vendor lock-in, the capability ceiling, what your bill does as you scale, and who maintains it once the builder leaves.",
            "filePath": "/guides/no-code/no-code-vs-code/02-the-real-tradeoffs.md"
          },
          {
            "slug": "03-choosing",
            "title": "A Decision Framework",
            "phaseNum": "3",
            "order": 3,
            "summary": "A short set of questions to pick the right tier, the signs you've outgrown no-code, and the hybrid pattern: no-code front, code where it matters.",
            "filePath": "/guides/no-code/no-code-vs-code/03-choosing.md"
          }
        ]
      },
      {
        "slug": "automation-triggers-and-actions",
        "title": "Automation: Triggers & Actions",
        "summary": "The trigger-and-action mental model that every automation tool (Zapier, Make, n8n, Power Automate) is built on - learn it once and they all click.",
        "order": 2,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "Triggers, Actions, and the Flow",
            "phaseNum": "1",
            "order": 1,
            "summary": "The universal something-happens-then-steps-run model behind every automation tool, plus how data travels from one step to the next.",
            "filePath": "/guides/no-code/automation-triggers-and-actions/01-the-mental-model.md"
          },
          {
            "slug": "02-building-a-real-flow",
            "title": "Building a Multi-Step Flow",
            "phaseNum": "2",
            "order": 2,
            "summary": "A worked end-to-end automation showing filters, branches, data mapping, lookups, and formatting - the pieces that turn a two-step toy into something useful.",
            "filePath": "/guides/no-code/automation-triggers-and-actions/02-building-a-real-flow.md"
          },
          {
            "slug": "03-when-it-breaks",
            "title": "When Automations Break",
            "phaseNum": "3",
            "order": 3,
            "summary": "The failure modes nobody warns you about - errors, retries, rate limits, duplicate runs, silent failures - and how to monitor a flow you actually rely on.",
            "filePath": "/guides/no-code/automation-triggers-and-actions/03-when-it-breaks.md"
          }
        ]
      },
      {
        "slug": "zapier",
        "title": "Zapier",
        "summary": "Connect the apps you already use with no code: build Zaps from a trigger and actions, add filters and paths, and avoid the task-limit and duplicate-run traps.",
        "order": 3,
        "phases": [
          {
            "slug": "01-your-first-zap",
            "title": "Your First Zap",
            "phaseNum": "1",
            "order": 1,
            "summary": "Build a working trigger-and-action automation, connect your app accounts, learn the Zap editor, and understand what a Zap can and can't do.",
            "filePath": "/guides/no-code/zapier/01-your-first-zap.md"
          },
          {
            "slug": "02-multi-step-and-filters",
            "title": "Multi-Step Zaps, Filters & Formatting",
            "phaseNum": "2",
            "order": 2,
            "summary": "Chain several actions, stop runs with Filter, branch with Paths, clean data with Formatter, and reliably pass fields from one step to the next.",
            "filePath": "/guides/no-code/zapier/02-multi-step-and-filters.md"
          },
          {
            "slug": "03-recipes-and-gotchas",
            "title": "Recipes, Limits & Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Understand task-based pricing, polling vs instant triggers, deduplication, error handling and replay, plus a few high-value real-world Zap recipes.",
            "filePath": "/guides/no-code/zapier/03-recipes-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "make-automation",
        "title": "Make",
        "summary": "The visual, operations-priced automation tool (formerly Integromat): build scenarios from modules, map and transform arrays, and handle errors deliberately.",
        "order": 4,
        "phases": [
          {
            "slug": "01-scenarios-and-modules",
            "title": "Scenarios & Modules",
            "phaseNum": "1",
            "order": 1,
            "summary": "How Make's canvas works: scenarios, modules, the bundles that flow between them, and what makes it different from checklist-style tools like Zapier.",
            "filePath": "/guides/no-code/make-automation/01-scenarios-and-modules.md"
          },
          {
            "slug": "02-data-mapping-and-iterators",
            "title": "Data Mapping, Arrays & Iterators",
            "phaseNum": "2",
            "order": 2,
            "summary": "Mapping fields between modules, transforming values with functions, and handling lists with routers, iterators, and the array aggregator.",
            "filePath": "/guides/no-code/make-automation/02-data-mapping-and-iterators.md"
          },
          {
            "slug": "03-errors-and-cost",
            "title": "Error Handling, Scheduling & Operations Cost",
            "phaseNum": "3",
            "order": 3,
            "summary": "Catching failures with error handlers and rollback, controlling when scenarios run, and understanding the operations-based pricing that surprises people.",
            "filePath": "/guides/no-code/make-automation/03-errors-and-cost.md"
          }
        ]
      },
      {
        "slug": "n8n",
        "title": "n8n",
        "summary": "The open-source, self-hostable automation tool that lets you drop to code when you need to - nodes and workflows, credentials, and real automations including AI steps.",
        "order": 5,
        "phases": [
          {
            "slug": "01-nodes-and-workflows",
            "title": "Nodes & Workflows",
            "phaseNum": "1",
            "order": 1,
            "summary": "The core mental model - nodes, the connections between them, the visual editor, executions, and why teams choose an open-source, self-hostable tool.",
            "filePath": "/guides/no-code/n8n/01-nodes-and-workflows.md"
          },
          {
            "slug": "02-self-host-and-code",
            "title": "Self-Host, Credentials & the Code Node",
            "phaseNum": "2",
            "order": 2,
            "summary": "The grown-up concerns - running n8n yourself versus n8n Cloud, where credentials and secrets live, expressions that pass data between steps, and the Code node for when no-code runs out.",
            "filePath": "/guides/no-code/n8n/02-self-host-and-code.md"
          },
          {
            "slug": "03-real-automations-and-ai",
            "title": "Real Automations (and AI Nodes)",
            "phaseNum": "3",
            "order": 3,
            "summary": "Building it for real - a concrete multi-step automation end to end, how webhooks let the outside world trigger a flow, and using AI/LLM nodes to add a thinking step.",
            "filePath": "/guides/no-code/n8n/03-real-automations-and-ai.md"
          }
        ]
      },
      {
        "slug": "power-automate",
        "title": "Power Automate",
        "summary": "Microsoft's automation tool that lives where your work already is (365, Teams, SharePoint): cloud flows, connectors and approvals, plus desktop RPA and its governance limits.",
        "order": 6,
        "phases": [
          {
            "slug": "01-flows-in-the-microsoft-world",
            "title": "Flows in the Microsoft World",
            "phaseNum": "1",
            "order": 1,
            "summary": "How cloud flows work - the trigger-and-action model, the connector ecosystem, and why Power Automate wins by default in any 365 shop.",
            "filePath": "/guides/no-code/power-automate/01-flows-in-the-microsoft-world.md"
          },
          {
            "slug": "02-connectors-and-approvals",
            "title": "Connectors, Approvals & Data",
            "phaseNum": "2",
            "order": 2,
            "summary": "The standard-versus-premium connector split that drives your bill, the built-in approval system, and how flows read and write SharePoint and Dataverse with expressions.",
            "filePath": "/guides/no-code/power-automate/02-connectors-and-approvals.md"
          },
          {
            "slug": "03-desktop-rpa-and-limits",
            "title": "Desktop RPA, Governance & Limits",
            "phaseNum": "3",
            "order": 3,
            "summary": "Power Automate Desktop for clicking through legacy apps that have no API, the licensing gotchas that catch RPA builders, and the admin governance that keeps it all from becoming a mess.",
            "filePath": "/guides/no-code/power-automate/03-desktop-rpa-and-limits.md"
          }
        ]
      },
      {
        "slug": "airtable",
        "title": "Airtable",
        "summary": "The spreadsheet that is really a database: bases, fields and linked records, views, built-in automations, and Interfaces - plus the point where it stops being the right tool.",
        "order": 7,
        "phases": [
          {
            "slug": "01-a-smart-spreadsheet",
            "title": "A Spreadsheet That's Really a Database",
            "phaseNum": "1",
            "order": 1,
            "summary": "How bases, tables, typed fields, and records work - and why linked records make Airtable behave like a database instead of a flat grid.",
            "filePath": "/guides/no-code/airtable/01-a-smart-spreadsheet.md"
          },
          {
            "slug": "02-links-views-automations",
            "title": "Links, Views & Automations",
            "phaseNum": "2",
            "order": 2,
            "summary": "Pulling data across linked tables with lookups and rollups, seeing the same records as a grid, kanban, or calendar, filtering them, and letting automations do routine work.",
            "filePath": "/guides/no-code/airtable/02-links-views-automations.md"
          },
          {
            "slug": "03-interfaces-and-limits",
            "title": "Interfaces, Sharing & When It Breaks",
            "phaseNum": "3",
            "order": 3,
            "summary": "Building Interfaces as clean app screens on top of your data, controlling who sees what, the real record and performance limits, and how to tell when you've outgrown Airtable.",
            "filePath": "/guides/no-code/airtable/03-interfaces-and-limits.md"
          }
        ]
      },
      {
        "slug": "retool",
        "title": "Retool",
        "summary": "Build internal tools and admin panels fast by dragging components onto real data sources, wiring queries and state - then ship them with auth and deployment that hold up.",
        "order": 8,
        "phases": [
          {
            "slug": "01-internal-tools-fast",
            "title": "Internal Tools, Fast",
            "phaseNum": "1",
            "order": 1,
            "summary": "What an internal tool actually is, how Retool's drag-a-component-onto-data model works, and how to connect your first database or API.",
            "filePath": "/guides/no-code/retool/01-internal-tools-fast.md"
          },
          {
            "slug": "02-wiring-data-and-queries",
            "title": "Wiring Data, Queries & State",
            "phaseNum": "2",
            "order": 2,
            "summary": "How queries fetch and write data, how components bind to that data and to each other, and how transformers, events, and app state make a tool actually do something.",
            "filePath": "/guides/no-code/retool/02-wiring-data-and-queries.md"
          },
          {
            "slug": "03-auth-deploy-gotchas",
            "title": "Auth, Deployment & Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Locking down who can do what, choosing between Retool cloud and self-hosting, getting changes through review safely, and recognizing where Retool gets awkward.",
            "filePath": "/guides/no-code/retool/03-auth-deploy-gotchas.md"
          }
        ]
      },
      {
        "slug": "webflow",
        "title": "Webflow",
        "summary": "Design and ship professional marketing sites without hand-coding HTML/CSS: the visual canvas that maps to real web concepts, a built-in CMS, and hosting/SEO realities.",
        "order": 9,
        "phases": [
          {
            "slug": "01-design-grade-sites",
            "title": "Design-Grade Sites Without Hand-Coding",
            "phaseNum": "1",
            "order": 1,
            "summary": "How Webflow's visual canvas maps to real web building blocks - boxes, alignment, and reusable styles - so the editor stops feeling random.",
            "filePath": "/guides/no-code/webflow/01-design-grade-sites.md"
          },
          {
            "slug": "02-cms-and-dynamic-content",
            "title": "The CMS & Dynamic Content",
            "phaseNum": "2",
            "order": 2,
            "summary": "How Webflow's CMS Collections store repeating content and feed one reusable template - so a blog or catalog builds itself from your entries instead of copy-pasted pages.",
            "filePath": "/guides/no-code/webflow/02-cms-and-dynamic-content.md"
          },
          {
            "slug": "03-hosting-seo-handoff",
            "title": "Hosting, SEO & Handoff",
            "phaseNum": "3",
            "order": 3,
            "summary": "The unglamorous decisive part of shipping a Webflow site: publishing and domains, the SEO and speed controls that actually matter, export limits, and handing editing to a non-technical client.",
            "filePath": "/guides/no-code/webflow/03-hosting-seo-handoff.md"
          }
        ]
      },
      {
        "slug": "outsystems-and-mendix",
        "title": "OutSystems & Mendix",
        "summary": "The two enterprise low-code platforms that show up in big-company job postings: what they actually are, what a real project looks like, and the lock-in and cost to weigh.",
        "order": 10,
        "phases": [
          {
            "slug": "01-what-enterprise-low-code-is",
            "title": "What Enterprise Low-Code Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "How model-driven development and visual logic let big companies build apps fast, who pays for it, and how OutSystems and Mendix differ at a glance.",
            "filePath": "/guides/no-code/outsystems-and-mendix/01-what-enterprise-low-code-is.md"
          },
          {
            "slug": "02-a-real-project",
            "title": "What a Real Project Looks Like",
            "phaseNum": "2",
            "order": 2,
            "summary": "A walkthrough of building a real business app on these platforms - data model, screens, logic, integrations, the deployment pipeline, and the team roles around it.",
            "filePath": "/guides/no-code/outsystems-and-mendix/02-a-real-project.md"
          },
          {
            "slug": "03-lock-in-cost-fit",
            "title": "Lock-In, Cost & When It Fits",
            "phaseNum": "3",
            "order": 3,
            "summary": "The honest tradeoffs: how licensing is priced, how deep the vendor lock-in runs, what the skills market looks like, where the escape hatches are, and when to choose it or walk away.",
            "filePath": "/guides/no-code/outsystems-and-mendix/03-lock-in-cost-fit.md"
          }
        ]
      },
      {
        "slug": "production-grade-no-code",
        "title": "Production-Grade No-Code",
        "summary": "What separates a demo automation from one that survives real traffic - failure modes, error handling and retries, and knowing when to drop into code.",
        "order": 11,
        "phases": [
          {
            "slug": "01-where-automations-actually-fail",
            "title": "Where No-Code Automations Actually Fail",
            "phaseNum": "1",
            "order": 1,
            "summary": "The failure modes beginners never hit in a demo - rate limits, partial failures with no rollback, and silent errors that stop a workflow without telling anyone.",
            "filePath": "/guides/no-code/production-grade-no-code/01-where-automations-actually-fail.md"
          },
          {
            "slug": "02-error-handling-and-retries",
            "title": "Error Handling and Retries in a Visual Workflow",
            "phaseNum": "2",
            "order": 2,
            "summary": "Building real defenses into a no-code workflow - idempotency so retries can't double-charge, dead-letter storage for failed runs, and alerting that doesn't depend on someone checking a dashboard.",
            "filePath": "/guides/no-code/production-grade-no-code/02-error-handling-and-retries.md"
          },
          {
            "slug": "03-the-hybrid-escape-hatch",
            "title": "The Hybrid Escape Hatch",
            "phaseNum": "3",
            "order": 3,
            "summary": "When dropping a single code step or small API into an otherwise-visual workflow is the right call, not a failure of no-code - and how to do it without losing the benefits of the visual builder.",
            "filePath": "/guides/no-code/production-grade-no-code/03-the-hybrid-escape-hatch.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "tooling",
    "name": "Tools & Workflow",
    "icon": "ti-tools",
    "blurb": "The tools a job expects you to know - migrations, builds, containers, cloud, auth, observability.",
    "guides": [
      {
        "slug": "what-tooling-even-is",
        "title": "What Tooling Even Is",
        "summary": "The Tools & Workflow category has 54+ guides and no single job needs all of them. This is the map: why the tool list is long on purpose, the ~12 themes underneath the names, and how to learn whichever one your job hands you.",
        "order": 0,
        "phases": [
          {
            "slug": "01-why-there-are-50-plus-tools",
            "title": "Why There Are 50+ Tools",
            "phaseNum": "1",
            "order": 1,
            "summary": "The industry's actual expectation isn't knowing every tool - it's knowing the underlying concept well enough to pick up whichever specific tool your job hands you in a few days.",
            "filePath": "/guides/tooling/what-tooling-even-is/01-why-there-are-50-plus-tools.md"
          },
          {
            "slug": "02-the-themes-underneath-the-tool-names",
            "title": "The Themes Underneath the Tool Names",
            "phaseNum": "2",
            "order": 2,
            "summary": "The 54 tools in this category cluster into about a dozen real-world problems - migrations, builds, messaging, CI/CD, containers, infra as code, cloud, observability, testing, code quality, auth, and secrets. Find your theme, skip the rest.",
            "filePath": "/guides/tooling/what-tooling-even-is/02-the-themes-underneath-the-tool-names.md"
          },
          {
            "slug": "03-how-to-learn-a-new-tool-fast",
            "title": "How to Learn a New Tool Fast",
            "phaseNum": "3",
            "order": 3,
            "summary": "A repeatable four-step approach for when your job suddenly needs a tool you've never touched: smallest hello world first, find what breaks early, bookmark one docs page, and expect fluency to come from use, not reading.",
            "filePath": "/guides/tooling/what-tooling-even-is/03-how-to-learn-a-new-tool-fast.md"
          },
          {
            "slug": "04-picking-where-to-start",
            "title": "Picking Where to Start",
            "phaseNum": "4",
            "order": 4,
            "summary": "Concrete first-tool picks by common situation - starting backend work, joining a Kubernetes team, doing observability for the first time, or picking up CI/CD or auth cold.",
            "filePath": "/guides/tooling/what-tooling-even-is/04-picking-where-to-start.md"
          }
        ]
      },
      {
        "slug": "flyway-database-migrations",
        "title": "Flyway, From Zero",
        "summary": "Version-control your database schema with Flyway: numbered, immutable migration files applied in order, so every environment ends up with the exact same schema.",
        "order": 1,
        "phases": [
          {
            "slug": "01-schema-is-code",
            "title": "A Schema Is Code",
            "phaseNum": "1",
            "order": 1,
            "summary": "Version-control your database schema with Flyway: numbered, immutable migration files applied in order, so every environment ends up with the exact same schema.",
            "filePath": "/guides/tooling/flyway-database-migrations/01-schema-is-code.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The Everyday Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Version-control your database schema with Flyway: numbered, immutable migration files applied in order, so every environment ends up with the exact same schema.",
            "filePath": "/guides/tooling/flyway-database-migrations/02-the-everyday-loop.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production Reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Version-control your database schema with Flyway: numbered, immutable migration files applied in order, so every environment ends up with the exact same schema.",
            "filePath": "/guides/tooling/flyway-database-migrations/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "liquibase-database-migrations",
        "title": "Liquibase, From Zero",
        "summary": "Database migrations with Liquibase: changesets in SQL, YAML, or XML, a tracked changelog, and database-agnostic changes when you need to target more than one engine.",
        "order": 2,
        "phases": [
          {
            "slug": "01-the-changelog-and-the-changeset",
            "title": "The mental model: changelog and changeset",
            "phaseNum": "1",
            "order": 1,
            "summary": "Database migrations with Liquibase: changesets in SQL, YAML, or XML, a tracked changelog, and database-agnostic changes when you need to target more than one engine.",
            "filePath": "/guides/tooling/liquibase-database-migrations/01-the-changelog-and-the-changeset.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop: write, update, status, rollback",
            "phaseNum": "2",
            "order": 2,
            "summary": "Database migrations with Liquibase: changesets in SQL, YAML, or XML, a tracked changelog, and database-agnostic changes when you need to target more than one engine.",
            "filePath": "/guides/tooling/liquibase-database-migrations/02-the-everyday-loop.md"
          },
          {
            "slug": "03-when-abstraction-earns-its-keep",
            "title": "When the abstraction earns its keep",
            "phaseNum": "3",
            "order": 3,
            "summary": "Database migrations with Liquibase: changesets in SQL, YAML, or XML, a tracked changelog, and database-agnostic changes when you need to target more than one engine.",
            "filePath": "/guides/tooling/liquibase-database-migrations/03-when-abstraction-earns-its-keep.md"
          }
        ]
      },
      {
        "slug": "alembic-migrations",
        "title": "Alembic, From Zero",
        "summary": "Schema migrations for Python and SQLAlchemy with Alembic: autogenerate from your models, review the diff, and apply with upgrade/downgrade.",
        "order": 3,
        "phases": [
          {
            "slug": "01-the-version-table-is-the-whole-idea",
            "title": "The version table is the whole idea",
            "phaseNum": "1",
            "order": 1,
            "summary": "Schema migrations for Python and SQLAlchemy with Alembic: autogenerate from your models, review the diff, and apply with upgrade/downgrade.",
            "filePath": "/guides/tooling/alembic-migrations/01-the-version-table-is-the-whole-idea.md"
          },
          {
            "slug": "02-the-daily-loop",
            "title": "The daily loop: autogenerate, review, upgrade",
            "phaseNum": "2",
            "order": 2,
            "summary": "Schema migrations for Python and SQLAlchemy with Alembic: autogenerate from your models, review the diff, and apply with upgrade/downgrade.",
            "filePath": "/guides/tooling/alembic-migrations/02-the-daily-loop.md"
          },
          {
            "slug": "03-the-autogenerate-trap-and-heads",
            "title": "The autogenerate trap, heads, and merges",
            "phaseNum": "3",
            "order": 3,
            "summary": "Schema migrations for Python and SQLAlchemy with Alembic: autogenerate from your models, review the diff, and apply with upgrade/downgrade.",
            "filePath": "/guides/tooling/alembic-migrations/03-the-autogenerate-trap-and-heads.md"
          }
        ]
      },
      {
        "slug": "prisma-migrate",
        "title": "Prisma Migrate, From Zero",
        "summary": "Schema-first migrations in the Node world: edit your Prisma schema, generate a migration, and keep dev and production in sync without drift.",
        "order": 4,
        "phases": [
          {
            "slug": "01-schema-is-the-source-of-truth",
            "title": "Schema is the source of truth",
            "phaseNum": "1",
            "order": 1,
            "summary": "Schema-first migrations in the Node world: edit your Prisma schema, generate a migration, and keep dev and production in sync without drift.",
            "filePath": "/guides/tooling/prisma-migrate/01-schema-is-the-source-of-truth.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Schema-first migrations in the Node world: edit your Prisma schema, generate a migration, and keep dev and production in sync without drift.",
            "filePath": "/guides/tooling/prisma-migrate/02-the-everyday-loop.md"
          },
          {
            "slug": "03-drift-shadows-and-production",
            "title": "Drift, shadows, and production",
            "phaseNum": "3",
            "order": 3,
            "summary": "Schema-first migrations in the Node world: edit your Prisma schema, generate a migration, and keep dev and production in sync without drift.",
            "filePath": "/guides/tooling/prisma-migrate/03-drift-shadows-and-production.md"
          }
        ]
      },
      {
        "slug": "golang-migrate-and-atlas",
        "title": "golang-migrate and Atlas",
        "summary": "Database migrations for Go and beyond: golang-migrate's plain up/down SQL files versus Atlas's declarative, diff-the-desired-state approach.",
        "order": 5,
        "phases": [
          {
            "slug": "01-two-philosophies",
            "title": "Two philosophies of change",
            "phaseNum": "1",
            "order": 1,
            "summary": "Database migrations for Go and beyond: golang-migrate's plain up/down SQL files versus Atlas's declarative, diff-the-desired-state approach.",
            "filePath": "/guides/tooling/golang-migrate-and-atlas/01-two-philosophies.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Database migrations for Go and beyond: golang-migrate's plain up/down SQL files versus Atlas's declarative, diff-the-desired-state approach.",
            "filePath": "/guides/tooling/golang-migrate-and-atlas/02-the-everyday-loop.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Database migrations for Go and beyond: golang-migrate's plain up/down SQL files versus Atlas's declarative, diff-the-desired-state approach.",
            "filePath": "/guides/tooling/golang-migrate-and-atlas/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "dbmate-and-sqitch",
        "title": "dbmate and Sqitch",
        "summary": "Lightweight, framework-agnostic database migrations: dbmate's simple timestamped SQL files and Sqitch's dependency-graph approach with verify and revert.",
        "order": 6,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "Two ways to order change",
            "phaseNum": "1",
            "order": 1,
            "summary": "Lightweight, framework-agnostic database migrations: dbmate's simple timestamped SQL files and Sqitch's dependency-graph approach with verify and revert.",
            "filePath": "/guides/tooling/dbmate-and-sqitch/01-the-mental-model.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Lightweight, framework-agnostic database migrations: dbmate's simple timestamped SQL files and Sqitch's dependency-graph approach with verify and revert.",
            "filePath": "/guides/tooling/dbmate-and-sqitch/02-the-everyday-loop.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Lightweight, framework-agnostic database migrations: dbmate's simple timestamped SQL files and Sqitch's dependency-graph approach with verify and revert.",
            "filePath": "/guides/tooling/dbmate-and-sqitch/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "maven-from-zero",
        "title": "Maven, From Zero",
        "summary": "Java's build tool and dependency manager: the POM, the build lifecycle, coordinates and repositories, and why 'it works on Maven Central' is the default.",
        "order": 7,
        "phases": [
          {
            "slug": "01-convention-over-configuration",
            "title": "The mental model: convention over configuration",
            "phaseNum": "1",
            "order": 1,
            "summary": "Java's build tool and dependency manager: the POM, the build lifecycle, coordinates and repositories, and why 'it works on Maven Central' is the default.",
            "filePath": "/guides/tooling/maven-from-zero/01-convention-over-configuration.md"
          },
          {
            "slug": "02-pom-coordinates-lifecycle",
            "title": "The everyday core: POM, coordinates, and the lifecycle",
            "phaseNum": "2",
            "order": 2,
            "summary": "Java's build tool and dependency manager: the POM, the build lifecycle, coordinates and repositories, and why 'it works on Maven Central' is the default.",
            "filePath": "/guides/tooling/maven-from-zero/02-pom-coordinates-lifecycle.md"
          },
          {
            "slug": "03-conflicts-and-multi-module",
            "title": "Production reality: conflicts, the local repo, and multi-module",
            "phaseNum": "3",
            "order": 3,
            "summary": "Java's build tool and dependency manager: the POM, the build lifecycle, coordinates and repositories, and why 'it works on Maven Central' is the default.",
            "filePath": "/guides/tooling/maven-from-zero/03-conflicts-and-multi-module.md"
          }
        ]
      },
      {
        "slug": "gradle-from-zero",
        "title": "Gradle, From Zero",
        "summary": "The flexible build tool behind Java, Kotlin, and Android: tasks and the build graph, the Groovy/Kotlin DSL, dependency configurations, and the build cache.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-build-is-a-graph",
            "title": "The Build Is a Graph",
            "phaseNum": "1",
            "order": 1,
            "summary": "The flexible build tool behind Java, Kotlin, and Android: tasks and the build graph, the Groovy/Kotlin DSL, dependency configurations, and the build cache.",
            "filePath": "/guides/tooling/gradle-from-zero/01-the-build-is-a-graph.md"
          },
          {
            "slug": "02-the-build-script-you-live-in",
            "title": "The Build Script You Live In",
            "phaseNum": "2",
            "order": 2,
            "summary": "The flexible build tool behind Java, Kotlin, and Android: tasks and the build graph, the Groovy/Kotlin DSL, dependency configurations, and the build cache.",
            "filePath": "/guides/tooling/gradle-from-zero/02-the-build-script-you-live-in.md"
          },
          {
            "slug": "03-why-its-fast-and-where-it-bites",
            "title": "Why It's Fast, and Where It Bites",
            "phaseNum": "3",
            "order": 3,
            "summary": "The flexible build tool behind Java, Kotlin, and Android: tasks and the build graph, the Groovy/Kotlin DSL, dependency configurations, and the build cache.",
            "filePath": "/guides/tooling/gradle-from-zero/03-why-its-fast-and-where-it-bites.md"
          }
        ]
      },
      {
        "slug": "npm-pnpm-yarn",
        "title": "npm, pnpm, and Yarn",
        "summary": "Node package managers explained: package.json, the lockfile that pins your real dependency tree, semver ranges, and why pnpm's content-addressed store is so fast.",
        "order": 9,
        "phases": [
          {
            "slug": "01-manifest-and-lockfile",
            "title": "The Manifest and the Lockfile",
            "phaseNum": "1",
            "order": 1,
            "summary": "package.json is your wish list of dependencies and ranges; the lockfile is the receipt that pins the exact resolved tree, including every transitive dependency, so installs are reproducible.",
            "filePath": "/guides/tooling/npm-pnpm-yarn/01-manifest-and-lockfile.md"
          },
          {
            "slug": "02-installing-and-workspaces",
            "title": "Installing, Updating, and Workspaces",
            "phaseNum": "2",
            "order": 2,
            "summary": "The everyday commands across npm, pnpm, and Yarn; how semver caret and tilde ranges decide what an update actually changes; and how workspaces hold many packages in one repo.",
            "filePath": "/guides/tooling/npm-pnpm-yarn/02-installing-and-workspaces.md"
          },
          {
            "slug": "03-store-and-gotchas",
            "title": "node_modules, the pnpm Store, and the Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why node_modules got so big, how pnpm's content-addressed store makes installs fast and disk-cheap, the strictness that catches phantom dependencies, and the traps that bite every team.",
            "filePath": "/guides/tooling/npm-pnpm-yarn/03-store-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "python-packaging-pip-poetry-uv",
        "title": "Python Packaging: pip, venv, Poetry, uv",
        "summary": "Taming Python environments: virtual environments, pip and requirements, the modern pyproject.toml with Poetry, and uv's blazing resolver - without dependency hell.",
        "order": 10,
        "phases": [
          {
            "slug": "01-why-environments-exist",
            "title": "Why Environments Exist (and the Global-Install Trap)",
            "phaseNum": "1",
            "order": 1,
            "summary": "Taming Python environments: virtual environments, pip and requirements, the modern pyproject.toml with Poetry, and uv's blazing resolver - without dependency hell.",
            "filePath": "/guides/tooling/python-packaging-pip-poetry-uv/01-why-environments-exist.md"
          },
          {
            "slug": "02-pip-requirements-poetry",
            "title": "The Daily Driver: pip, requirements, and Poetry",
            "phaseNum": "2",
            "order": 2,
            "summary": "Taming Python environments: virtual environments, pip and requirements, the modern pyproject.toml with Poetry, and uv's blazing resolver - without dependency hell.",
            "filePath": "/guides/tooling/python-packaging-pip-poetry-uv/02-pip-requirements-poetry.md"
          },
          {
            "slug": "03-uv-lockfiles-production",
            "title": "uv, Lockfiles, and Surviving Production",
            "phaseNum": "3",
            "order": 3,
            "summary": "Taming Python environments: virtual environments, pip and requirements, the modern pyproject.toml with Poetry, and uv's blazing resolver - without dependency hell.",
            "filePath": "/guides/tooling/python-packaging-pip-poetry-uv/03-uv-lockfiles-production.md"
          }
        ]
      },
      {
        "slug": "make-and-makefiles",
        "title": "Make and Makefiles",
        "summary": "The 50-year-old build tool that still runs everything: targets, prerequisites, and recipes - a dependency graph that rebuilds only what changed.",
        "order": 11,
        "phases": [
          {
            "slug": "01-the-dependency-graph",
            "title": "The Dependency Graph in Your Head",
            "phaseNum": "1",
            "order": 1,
            "summary": "The 50-year-old build tool that still runs everything: targets, prerequisites, and recipes - a dependency graph that rebuilds only what changed.",
            "filePath": "/guides/tooling/make-and-makefiles/01-the-dependency-graph.md"
          },
          {
            "slug": "02-targets-tasks-variables",
            "title": "Targets, Tasks, and Variables",
            "phaseNum": "2",
            "order": 2,
            "summary": "The 50-year-old build tool that still runs everything: targets, prerequisites, and recipes - a dependency graph that rebuilds only what changed.",
            "filePath": "/guides/tooling/make-and-makefiles/02-targets-tasks-variables.md"
          },
          {
            "slug": "03-gotchas-and-why-it-endures",
            "title": "The Tab, Stale Builds, and Why It Endures",
            "phaseNum": "3",
            "order": 3,
            "summary": "The 50-year-old build tool that still runs everything: targets, prerequisites, and recipes - a dependency graph that rebuilds only what changed.",
            "filePath": "/guides/tooling/make-and-makefiles/03-gotchas-and-why-it-endures.md"
          }
        ]
      },
      {
        "slug": "bazel-from-zero",
        "title": "Bazel, From Zero",
        "summary": "Google's build system for huge, multi-language repos: hermetic, reproducible builds with aggressive caching and parallelism - and the steep tradeoff that buys.",
        "order": 12,
        "phases": [
          {
            "slug": "01-the-graph-and-why-hermetic",
            "title": "The Graph, and Why Hermetic",
            "phaseNum": "1",
            "order": 1,
            "summary": "Google's build system for huge, multi-language repos: hermetic, reproducible builds with aggressive caching and parallelism - and the steep tradeoff that buys.",
            "filePath": "/guides/tooling/bazel-from-zero/01-the-graph-and-why-hermetic.md"
          },
          {
            "slug": "02-build-files-and-the-daily-loop",
            "title": "BUILD Files and the Daily Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Google's build system for huge, multi-language repos: hermetic, reproducible builds with aggressive caching and parallelism - and the steep tradeoff that buys.",
            "filePath": "/guides/tooling/bazel-from-zero/02-build-files-and-the-daily-loop.md"
          },
          {
            "slug": "03-caching-cold-starts-and-when-not-to",
            "title": "Caching, Cold Starts, and When Not To",
            "phaseNum": "3",
            "order": 3,
            "summary": "Google's build system for huge, multi-language repos: hermetic, reproducible builds with aggressive caching and parallelism - and the steep tradeoff that buys.",
            "filePath": "/guides/tooling/bazel-from-zero/03-caching-cold-starts-and-when-not-to.md"
          }
        ]
      },
      {
        "slug": "kafka-from-zero",
        "title": "Kafka, From Zero",
        "summary": "The distributed log everyone runs in production: topics, partitions, offsets, and consumer groups - append-only streams you can replay, not a traditional queue.",
        "order": 13,
        "phases": [
          {
            "slug": "01-its-a-log-not-a-queue",
            "title": "It's a Log, Not a Queue",
            "phaseNum": "1",
            "order": 1,
            "summary": "Kafka is a durable, append-only log split into partitions; consumers track their own position with offsets and reading never deletes anything, which is why one stream can feed many readers and be replayed.",
            "filePath": "/guides/tooling/kafka-from-zero/01-its-a-log-not-a-queue.md"
          },
          {
            "slug": "02-producing-and-consuming",
            "title": "Producing and Consuming for Real",
            "phaseNum": "2",
            "order": 2,
            "summary": "The everyday loop: producers pick a partition by key, consumer groups split partitions among members for parallelism, and committing offsets is how you remember what you've processed.",
            "filePath": "/guides/tooling/kafka-from-zero/02-producing-and-consuming.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production Reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Delivery guarantees and why duplicates happen, building idempotent consumers, surviving rebalances, how retention quietly deletes old data, and when Kafka is the wrong tool.",
            "filePath": "/guides/tooling/kafka-from-zero/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "redis-from-zero",
        "title": "Redis, From Zero",
        "summary": "The in-memory data store that does ten jobs: cache, session store, queue, rate limiter, and lock - with data structures, TTLs, and the persistence tradeoff.",
        "order": 14,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The mental model: one RAM-speed dictionary",
            "phaseNum": "1",
            "order": 1,
            "summary": "The in-memory data store that does ten jobs: cache, session store, queue, rate limiter, and lock - with data structures, TTLs, and the persistence tradeoff.",
            "filePath": "/guides/tooling/redis-from-zero/01-the-mental-model.md"
          },
          {
            "slug": "02-the-everyday-core",
            "title": "The everyday core: caching, TTLs, and the patterns",
            "phaseNum": "2",
            "order": 2,
            "summary": "The in-memory data store that does ten jobs: cache, session store, queue, rate limiter, and lock - with data structures, TTLs, and the persistence tradeoff.",
            "filePath": "/guides/tooling/redis-from-zero/02-the-everyday-core.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production reality: persistence, locks, and the sharp edges",
            "phaseNum": "3",
            "order": 3,
            "summary": "The in-memory data store that does ten jobs: cache, session store, queue, rate limiter, and lock - with data structures, TTLs, and the persistence tradeoff.",
            "filePath": "/guides/tooling/redis-from-zero/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "rabbitmq-from-zero",
        "title": "RabbitMQ, From Zero",
        "summary": "The classic message broker: exchanges, queues, and bindings route messages to workers, with acknowledgements and dead-letter queues for reliable delivery.",
        "order": 15,
        "phases": [
          {
            "slug": "01-the-smart-post-office",
            "title": "Phase 1: The Smart Post Office",
            "phaseNum": "1",
            "order": 1,
            "summary": "The classic message broker: exchanges, queues, and bindings route messages to workers, with acknowledgements and dead-letter queues for reliable delivery.",
            "filePath": "/guides/tooling/rabbitmq-from-zero/01-the-smart-post-office.md"
          },
          {
            "slug": "02-publishing-and-consuming",
            "title": "Phase 2: Publishing and Consuming for Real",
            "phaseNum": "2",
            "order": 2,
            "summary": "The classic message broker: exchanges, queues, and bindings route messages to workers, with acknowledgements and dead-letter queues for reliable delivery.",
            "filePath": "/guides/tooling/rabbitmq-from-zero/02-publishing-and-consuming.md"
          },
          {
            "slug": "03-when-delivery-goes-wrong",
            "title": "Phase 3: When Delivery Goes Wrong",
            "phaseNum": "3",
            "order": 3,
            "summary": "The classic message broker: exchanges, queues, and bindings route messages to workers, with acknowledgements and dead-letter queues for reliable delivery.",
            "filePath": "/guides/tooling/rabbitmq-from-zero/03-when-delivery-goes-wrong.md"
          }
        ]
      },
      {
        "slug": "nats-and-sqs",
        "title": "NATS and Amazon SQS",
        "summary": "Two lighter messaging options: NATS for fast, simple pub/sub and request-reply, and SQS for a fully managed, zero-ops cloud queue.",
        "order": 16,
        "phases": [
          {
            "slug": "01-not-everything-needs-kafka",
            "title": "Phase 1: Not Everything Needs Kafka",
            "phaseNum": "1",
            "order": 1,
            "summary": "Two lighter messaging options: NATS for fast, simple pub/sub and request-reply, and SQS for a fully managed, zero-ops cloud queue.",
            "filePath": "/guides/tooling/nats-and-sqs/01-not-everything-needs-kafka.md"
          },
          {
            "slug": "02-sending-and-receiving-for-real",
            "title": "Phase 2: Sending and Receiving for Real",
            "phaseNum": "2",
            "order": 2,
            "summary": "Two lighter messaging options: NATS for fast, simple pub/sub and request-reply, and SQS for a fully managed, zero-ops cloud queue.",
            "filePath": "/guides/tooling/nats-and-sqs/02-sending-and-receiving-for-real.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Phase 3: Production Reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Two lighter messaging options: NATS for fast, simple pub/sub and request-reply, and SQS for a fully managed, zero-ops cloud queue.",
            "filePath": "/guides/tooling/nats-and-sqs/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "gitlab-ci-cd",
        "title": "GitLab CI/CD, From Zero",
        "summary": "Pipelines defined in .gitlab-ci.yml: stages, jobs, and runners that build, test, and deploy on every push - with artifacts, caching, and environments.",
        "order": 17,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "Phase 1: The Mental Model - One File, A Pipeline, A Machine",
            "phaseNum": "1",
            "order": 1,
            "summary": "Pipelines defined in .gitlab-ci.yml: stages, jobs, and runners that build, test, and deploy on every push - with artifacts, caching, and environments.",
            "filePath": "/guides/tooling/gitlab-ci-cd/01-the-mental-model.md"
          },
          {
            "slug": "02-artifacts-cache-rules",
            "title": "Phase 2: The Everyday Core - Artifacts, Cache, and Rules",
            "phaseNum": "2",
            "order": 2,
            "summary": "Pipelines defined in .gitlab-ci.yml: stages, jobs, and runners that build, test, and deploy on every push - with artifacts, caching, and environments.",
            "filePath": "/guides/tooling/gitlab-ci-cd/02-artifacts-cache-rules.md"
          },
          {
            "slug": "03-environments-gates-secrets",
            "title": "Phase 3: Production Reality - Environments, Gates, and Secrets",
            "phaseNum": "3",
            "order": 3,
            "summary": "Pipelines defined in .gitlab-ci.yml: stages, jobs, and runners that build, test, and deploy on every push - with artifacts, caching, and environments.",
            "filePath": "/guides/tooling/gitlab-ci-cd/03-environments-gates-secrets.md"
          }
        ]
      },
      {
        "slug": "jenkins-from-zero",
        "title": "Jenkins, From Zero",
        "summary": "The CI server that still runs much of enterprise: the Jenkinsfile pipeline-as-code, stages and steps, agents, and the plugin ecosystem for better and worse.",
        "order": 18,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The mental model: what Jenkins is and why it won't die",
            "phaseNum": "1",
            "order": 1,
            "summary": "The CI server that still runs much of enterprise: the Jenkinsfile pipeline-as-code, stages and steps, agents, and the plugin ecosystem for better and worse.",
            "filePath": "/guides/tooling/jenkins-from-zero/01-the-mental-model.md"
          },
          {
            "slug": "02-the-jenkinsfile",
            "title": "The Jenkinsfile: pipeline, agent, stages, steps",
            "phaseNum": "2",
            "order": 2,
            "summary": "The CI server that still runs much of enterprise: the Jenkinsfile pipeline-as-code, stages and steps, agents, and the plugin ecosystem for better and worse.",
            "filePath": "/guides/tooling/jenkins-from-zero/02-the-jenkinsfile.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production reality: plugins, credentials, and the tradeoffs",
            "phaseNum": "3",
            "order": 3,
            "summary": "The CI server that still runs much of enterprise: the Jenkinsfile pipeline-as-code, stages and steps, agents, and the plugin ecosystem for better and worse.",
            "filePath": "/guides/tooling/jenkins-from-zero/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "argo-cd-and-gitops",
        "title": "Argo CD and GitOps",
        "summary": "Deployment by pull, not push: GitOps makes a Git repo the source of truth for your cluster, and Argo CD continuously reconciles reality to match it.",
        "order": 19,
        "phases": [
          {
            "slug": "01-the-pull-model",
            "title": "The pull model: Git as the source of truth",
            "phaseNum": "1",
            "order": 1,
            "summary": "Deployment by pull, not push: GitOps makes a Git repo the source of truth for your cluster, and Argo CD continuously reconciles reality to match it.",
            "filePath": "/guides/tooling/argo-cd-and-gitops/01-the-pull-model.md"
          },
          {
            "slug": "02-daily-loop",
            "title": "Your daily loop: apps, sync, and rollback",
            "phaseNum": "2",
            "order": 2,
            "summary": "Deployment by pull, not push: GitOps makes a Git repo the source of truth for your cluster, and Argo CD continuously reconciles reality to match it.",
            "filePath": "/guides/tooling/argo-cd-and-gitops/02-daily-loop.md"
          },
          {
            "slug": "03-when-it-bites",
            "title": "When reconciliation bites: drift, waves, and secrets",
            "phaseNum": "3",
            "order": 3,
            "summary": "Deployment by pull, not push: GitOps makes a Git repo the source of truth for your cluster, and Argo CD continuously reconciles reality to match it.",
            "filePath": "/guides/tooling/argo-cd-and-gitops/03-when-it-bites.md"
          }
        ]
      },
      {
        "slug": "circleci-from-zero",
        "title": "CircleCI, From Zero",
        "summary": "Cloud-native CI/CD with config.yml: jobs, workflows, executors, and orbs - fast parallel pipelines without running your own server.",
        "order": 20,
        "phases": [
          {
            "slug": "01-the-four-nouns",
            "title": "The four nouns: jobs, executors, steps, workflows",
            "phaseNum": "1",
            "order": 1,
            "summary": "Cloud-native CI/CD with config.yml: jobs, workflows, executors, and orbs - fast parallel pipelines without running your own server.",
            "filePath": "/guides/tooling/circleci-from-zero/01-the-four-nouns.md"
          },
          {
            "slug": "02-writing-a-real-config",
            "title": "Writing a real config: caching, orbs, and fan-out",
            "phaseNum": "2",
            "order": 2,
            "summary": "Cloud-native CI/CD with config.yml: jobs, workflows, executors, and orbs - fast parallel pipelines without running your own server.",
            "filePath": "/guides/tooling/circleci-from-zero/02-writing-a-real-config.md"
          },
          {
            "slug": "03-when-it-breaks",
            "title": "When it breaks: flaky tests, slow builds, and managed-CI tradeoffs",
            "phaseNum": "3",
            "order": 3,
            "summary": "Cloud-native CI/CD with config.yml: jobs, workflows, executors, and orbs - fast parallel pipelines without running your own server.",
            "filePath": "/guides/tooling/circleci-from-zero/03-when-it-breaks.md"
          }
        ]
      },
      {
        "slug": "helm-from-zero",
        "title": "Helm, From Zero",
        "summary": "The package manager for Kubernetes: charts template your manifests, values parameterize them per environment, and releases are versioned and rollback-able.",
        "order": 21,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The Mental Model: A Chart Is Templated Manifests",
            "phaseNum": "1",
            "order": 1,
            "summary": "The package manager for Kubernetes: charts template your manifests, values parameterize them per environment, and releases are versioned and rollback-able.",
            "filePath": "/guides/tooling/helm-from-zero/01-the-mental-model.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The Everyday Loop: Install, Upgrade, Rollback",
            "phaseNum": "2",
            "order": 2,
            "summary": "The package manager for Kubernetes: charts template your manifests, values parameterize them per environment, and releases are versioned and rollback-able.",
            "filePath": "/guides/tooling/helm-from-zero/02-the-everyday-loop.md"
          },
          {
            "slug": "03-where-it-bites",
            "title": "Where It Bites: Templating Gotchas and When Not to Use Helm",
            "phaseNum": "3",
            "order": 3,
            "summary": "The package manager for Kubernetes: charts template your manifests, values parameterize them per environment, and releases are versioned and rollback-able.",
            "filePath": "/guides/tooling/helm-from-zero/03-where-it-bites.md"
          }
        ]
      },
      {
        "slug": "kubectl-day-to-day",
        "title": "kubectl, Day to Day",
        "summary": "The Kubernetes commands you actually use: get/describe/logs/exec to see what's happening, apply to change it, and the debugging loop when a pod won't start.",
        "order": 22,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The mental model: kubectl talks to one API",
            "phaseNum": "1",
            "order": 1,
            "summary": "The Kubernetes commands you actually use: get/describe/logs/exec to see what's happening, apply to change it, and the debugging loop when a pod won't start.",
            "filePath": "/guides/tooling/kubectl-day-to-day/01-the-mental-model.md"
          },
          {
            "slug": "02-the-everyday-commands",
            "title": "The commands you actually run",
            "phaseNum": "2",
            "order": 2,
            "summary": "The Kubernetes commands you actually use: get/describe/logs/exec to see what's happening, apply to change it, and the debugging loop when a pod won't start.",
            "filePath": "/guides/tooling/kubectl-day-to-day/02-the-everyday-commands.md"
          },
          {
            "slug": "03-when-pods-wont-start",
            "title": "When a pod won't start: the debugging loop",
            "phaseNum": "3",
            "order": 3,
            "summary": "The Kubernetes commands you actually use: get/describe/logs/exec to see what's happening, apply to change it, and the debugging loop when a pod won't start.",
            "filePath": "/guides/tooling/kubectl-day-to-day/03-when-pods-wont-start.md"
          }
        ]
      },
      {
        "slug": "podman-from-zero",
        "title": "Podman, From Zero",
        "summary": "The daemonless, rootless container engine: a drop-in for most Docker commands, plus pods and the security win of running without a root daemon.",
        "order": 23,
        "phases": [
          {
            "slug": "01-what-podman-actually-is",
            "title": "What Podman Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "The daemonless, rootless container engine: a drop-in for most Docker commands, plus pods and the security win of running without a root daemon.",
            "filePath": "/guides/tooling/podman-from-zero/01-what-podman-actually-is.md"
          },
          {
            "slug": "02-running-containers-and-pods",
            "title": "Running Containers and Pods",
            "phaseNum": "2",
            "order": 2,
            "summary": "The daemonless, rootless container engine: a drop-in for most Docker commands, plus pods and the security win of running without a root daemon.",
            "filePath": "/guides/tooling/podman-from-zero/02-running-containers-and-pods.md"
          },
          {
            "slug": "03-production-reality-and-gotchas",
            "title": "Production Reality and Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "The daemonless, rootless container engine: a drop-in for most Docker commands, plus pods and the security win of running without a root daemon.",
            "filePath": "/guides/tooling/podman-from-zero/03-production-reality-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "ansible-from-zero",
        "title": "Ansible, From Zero",
        "summary": "Configuration management without agents: SSH into your servers and run idempotent playbooks that bring them to a desired state, every time.",
        "order": 24,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "What Ansible Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Configuration management without agents: SSH into your servers and run idempotent playbooks that bring them to a desired state, every time.",
            "filePath": "/guides/tooling/ansible-from-zero/01-the-mental-model.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The Everyday Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Configuration management without agents: SSH into your servers and run idempotent playbooks that bring them to a desired state, every time.",
            "filePath": "/guides/tooling/ansible-from-zero/02-the-everyday-loop.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production Reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Configuration management without agents: SSH into your servers and run idempotent playbooks that bring them to a desired state, every time.",
            "filePath": "/guides/tooling/ansible-from-zero/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "pulumi-from-zero",
        "title": "Pulumi, From Zero",
        "summary": "Infrastructure as actual code: define cloud resources in TypeScript, Python, or Go, with real loops and functions, while Pulumi tracks state like Terraform.",
        "order": 25,
        "phases": [
          {
            "slug": "01-what-pulumi-actually-is",
            "title": "What Pulumi actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Infrastructure as actual code: define cloud resources in TypeScript, Python, or Go, with real loops and functions, while Pulumi tracks state like Terraform.",
            "filePath": "/guides/tooling/pulumi-from-zero/01-what-pulumi-actually-is.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Infrastructure as actual code: define cloud resources in TypeScript, Python, or Go, with real loops and functions, while Pulumi tracks state like Terraform.",
            "filePath": "/guides/tooling/pulumi-from-zero/02-the-everyday-loop.md"
          },
          {
            "slug": "03-where-the-rope-gets-you",
            "title": "Where the rope gets you",
            "phaseNum": "3",
            "order": 3,
            "summary": "Infrastructure as actual code: define cloud resources in TypeScript, Python, or Go, with real loops and functions, while Pulumi tracks state like Terraform.",
            "filePath": "/guides/tooling/pulumi-from-zero/03-where-the-rope-gets-you.md"
          }
        ]
      },
      {
        "slug": "aws-cloudformation",
        "title": "AWS CloudFormation",
        "summary": "AWS's native infrastructure as code: declare resources in a template, and CloudFormation creates, updates, and rolls back the whole stack as one unit.",
        "order": 26,
        "phases": [
          {
            "slug": "01-templates-and-stacks",
            "title": "The mental model: templates and stacks",
            "phaseNum": "1",
            "order": 1,
            "summary": "AWS's native infrastructure as code: declare resources in a template, and CloudFormation creates, updates, and rolls back the whole stack as one unit.",
            "filePath": "/guides/tooling/aws-cloudformation/01-templates-and-stacks.md"
          },
          {
            "slug": "02-writing-and-changing-stacks",
            "title": "Writing and changing stacks for real",
            "phaseNum": "2",
            "order": 2,
            "summary": "AWS's native infrastructure as code: declare resources in a template, and CloudFormation creates, updates, and rolls back the whole stack as one unit.",
            "filePath": "/guides/tooling/aws-cloudformation/02-writing-and-changing-stacks.md"
          },
          {
            "slug": "03-rollback-drift-and-reality",
            "title": "When it breaks: rollback, drift, and Terraform",
            "phaseNum": "3",
            "order": 3,
            "summary": "AWS's native infrastructure as code: declare resources in a template, and CloudFormation creates, updates, and rolls back the whole stack as one unit.",
            "filePath": "/guides/tooling/aws-cloudformation/03-rollback-drift-and-reality.md"
          }
        ]
      },
      {
        "slug": "aws-core-services",
        "title": "AWS Core Services",
        "summary": "The handful of AWS services behind most apps: S3, EC2, RDS, IAM, and Lambda - what each does, how they fit together, and the IAM model that gates it all.",
        "order": 27,
        "phases": [
          {
            "slug": "01-the-five-that-matter",
            "title": "The five services that matter",
            "phaseNum": "1",
            "order": 1,
            "summary": "The handful of AWS services behind most apps: S3, EC2, RDS, IAM, and Lambda - what each does, how they fit together, and the IAM model that gates it all.",
            "filePath": "/guides/tooling/aws-core-services/01-the-five-that-matter.md"
          },
          {
            "slug": "02-wiring-an-app",
            "title": "Wiring them into an app",
            "phaseNum": "2",
            "order": 2,
            "summary": "The handful of AWS services behind most apps: S3, EC2, RDS, IAM, and Lambda - what each does, how they fit together, and the IAM model that gates it all.",
            "filePath": "/guides/tooling/aws-core-services/02-wiring-an-app.md"
          },
          {
            "slug": "03-iam-and-what-bites-you",
            "title": "IAM, least privilege, and what bites you",
            "phaseNum": "3",
            "order": 3,
            "summary": "The handful of AWS services behind most apps: S3, EC2, RDS, IAM, and Lambda - what each does, how they fit together, and the IAM model that gates it all.",
            "filePath": "/guides/tooling/aws-core-services/03-iam-and-what-bites-you.md"
          }
        ]
      },
      {
        "slug": "azure-fundamentals",
        "title": "Azure Fundamentals",
        "summary": "Microsoft's cloud for people who know AWS or none: resource groups and subscriptions, the core compute/storage/database services, and Entra ID for identity.",
        "order": 28,
        "phases": [
          {
            "slug": "01-the-container-hierarchy",
            "title": "The container hierarchy: how Azure is organized",
            "phaseNum": "1",
            "order": 1,
            "summary": "Microsoft's cloud for people who know AWS or none: resource groups and subscriptions, the core compute/storage/database services, and Entra ID for identity.",
            "filePath": "/guides/tooling/azure-fundamentals/01-the-container-hierarchy.md"
          },
          {
            "slug": "02-the-services-you-use",
            "title": "The services you'll actually use",
            "phaseNum": "2",
            "order": 2,
            "summary": "Microsoft's cloud for people who know AWS or none: resource groups and subscriptions, the core compute/storage/database services, and Entra ID for identity.",
            "filePath": "/guides/tooling/azure-fundamentals/02-the-services-you-use.md"
          },
          {
            "slug": "03-identity-and-production",
            "title": "Identity, access, and production reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Microsoft's cloud for people who know AWS or none: resource groups and subscriptions, the core compute/storage/database services, and Entra ID for identity.",
            "filePath": "/guides/tooling/azure-fundamentals/03-identity-and-production.md"
          }
        ]
      },
      {
        "slug": "gcp-fundamentals",
        "title": "GCP Fundamentals",
        "summary": "Google Cloud essentials: projects as the unit of organization, the core compute and storage services, and IAM - with a quick map from AWS terms.",
        "order": 29,
        "phases": [
          {
            "slug": "01-the-project-is-the-unit",
            "title": "The project is the unit of everything",
            "phaseNum": "1",
            "order": 1,
            "summary": "Google Cloud essentials: projects as the unit of organization, the core compute and storage services, and IAM - with a quick map from AWS terms.",
            "filePath": "/guides/tooling/gcp-fundamentals/01-the-project-is-the-unit.md"
          },
          {
            "slug": "02-the-services-you-use",
            "title": "The services you'll actually use",
            "phaseNum": "2",
            "order": 2,
            "summary": "Google Cloud essentials: projects as the unit of organization, the core compute and storage services, and IAM - with a quick map from AWS terms.",
            "filePath": "/guides/tooling/gcp-fundamentals/02-the-services-you-use.md"
          },
          {
            "slug": "03-iam-billing-and-the-aws-map",
            "title": "IAM, billing, and the AWS map",
            "phaseNum": "3",
            "order": 3,
            "summary": "Google Cloud essentials: projects as the unit of organization, the core compute and storage services, and IAM - with a quick map from AWS terms.",
            "filePath": "/guides/tooling/gcp-fundamentals/03-iam-billing-and-the-aws-map.md"
          }
        ]
      },
      {
        "slug": "opentelemetry-from-zero",
        "title": "OpenTelemetry, From Zero",
        "summary": "The vendor-neutral standard for telemetry: traces, metrics, and logs from one instrumentation, exported anywhere via the OTel collector.",
        "order": 30,
        "phases": [
          {
            "slug": "01-what-otel-actually-is",
            "title": "What OpenTelemetry actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "The vendor-neutral standard for telemetry: traces, metrics, and logs from one instrumentation, exported anywhere via the OTel collector.",
            "filePath": "/guides/tooling/opentelemetry-from-zero/01-what-otel-actually-is.md"
          },
          {
            "slug": "02-instrumenting-and-exporting",
            "title": "Instrumenting and exporting",
            "phaseNum": "2",
            "order": 2,
            "summary": "The vendor-neutral standard for telemetry: traces, metrics, and logs from one instrumentation, exported anywhere via the OTel collector.",
            "filePath": "/guides/tooling/opentelemetry-from-zero/02-instrumenting-and-exporting.md"
          },
          {
            "slug": "03-sampling-cost-and-reality",
            "title": "Sampling, cost, and reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "The vendor-neutral standard for telemetry: traces, metrics, and logs from one instrumentation, exported anywhere via the OTel collector.",
            "filePath": "/guides/tooling/opentelemetry-from-zero/03-sampling-cost-and-reality.md"
          }
        ]
      },
      {
        "slug": "sentry-error-tracking",
        "title": "Sentry, From Zero",
        "summary": "Error tracking that turns a vague bug report into a stack trace: grouped issues, the breadcrumbs and context around a crash, releases, and source maps.",
        "order": 31,
        "phases": [
          {
            "slug": "01-what-sentry-actually-is",
            "title": "What Sentry actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Error tracking that turns a vague bug report into a stack trace: grouped issues, the breadcrumbs and context around a crash, releases, and source maps.",
            "filePath": "/guides/tooling/sentry-error-tracking/01-what-sentry-actually-is.md"
          },
          {
            "slug": "02-capturing-and-reading-an-issue",
            "title": "Capturing and reading an issue",
            "phaseNum": "2",
            "order": 2,
            "summary": "Error tracking that turns a vague bug report into a stack trace: grouped issues, the breadcrumbs and context around a crash, releases, and source maps.",
            "filePath": "/guides/tooling/sentry-error-tracking/02-capturing-and-reading-an-issue.md"
          },
          {
            "slug": "03-releases-source-maps-and-noise",
            "title": "Releases, source maps, and noise",
            "phaseNum": "3",
            "order": 3,
            "summary": "Error tracking that turns a vague bug report into a stack trace: grouped issues, the breadcrumbs and context around a crash, releases, and source maps.",
            "filePath": "/guides/tooling/sentry-error-tracking/03-releases-source-maps-and-noise.md"
          }
        ]
      },
      {
        "slug": "elk-elasticsearch-stack",
        "title": "The ELK Stack",
        "summary": "Centralized logging with Elasticsearch, Logstash, and Kibana: ship logs from everywhere, index them, and search and visualize across your whole fleet.",
        "order": 32,
        "phases": [
          {
            "slug": "01-what-elk-actually-is",
            "title": "What ELK actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Centralized logging with Elasticsearch, Logstash, and Kibana: ship logs from everywhere, index them, and search and visualize across your whole fleet.",
            "filePath": "/guides/tooling/elk-elasticsearch-stack/01-what-elk-actually-is.md"
          },
          {
            "slug": "02-shipping-structuring-searching",
            "title": "Shipping, structuring, and searching",
            "phaseNum": "2",
            "order": 2,
            "summary": "Centralized logging with Elasticsearch, Logstash, and Kibana: ship logs from everywhere, index them, and search and visualize across your whole fleet.",
            "filePath": "/guides/tooling/elk-elasticsearch-stack/02-shipping-structuring-searching.md"
          },
          {
            "slug": "03-cost-retention-production",
            "title": "Cost, retention, and production reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Centralized logging with Elasticsearch, Logstash, and Kibana: ship logs from everywhere, index them, and search and visualize across your whole fleet.",
            "filePath": "/guides/tooling/elk-elasticsearch-stack/03-cost-retention-production.md"
          }
        ]
      },
      {
        "slug": "datadog-from-zero",
        "title": "Datadog, From Zero",
        "summary": "The all-in-one observability platform: the agent, metrics and dashboards, APM traces, log management, and monitors - plus the bill that surprises teams.",
        "order": 33,
        "phases": [
          {
            "slug": "01-what-datadog-actually-is",
            "title": "What Datadog actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "The all-in-one observability platform: the agent, metrics and dashboards, APM traces, log management, and monitors - plus the bill that surprises teams.",
            "filePath": "/guides/tooling/datadog-from-zero/01-what-datadog-actually-is.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "The all-in-one observability platform: the agent, metrics and dashboards, APM traces, log management, and monitors - plus the bill that surprises teams.",
            "filePath": "/guides/tooling/datadog-from-zero/02-the-everyday-loop.md"
          },
          {
            "slug": "03-the-bill-and-how-it-sneaks-up",
            "title": "The bill, and how it sneaks up",
            "phaseNum": "3",
            "order": 3,
            "summary": "The all-in-one observability platform: the agent, metrics and dashboards, APM traces, log management, and monitors - plus the bill that surprises teams.",
            "filePath": "/guides/tooling/datadog-from-zero/03-the-bill-and-how-it-sneaks-up.md"
          }
        ]
      },
      {
        "slug": "grafana-loki-logs",
        "title": "Grafana Loki",
        "summary": "Logs that act like Prometheus: Loki indexes only labels (not full text), making centralized logging cheap, and ties them to your metrics in Grafana.",
        "order": 34,
        "phases": [
          {
            "slug": "01-what-loki-actually-is",
            "title": "What Loki actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Logs that act like Prometheus: Loki indexes only labels (not full text), making centralized logging cheap, and ties them to your metrics in Grafana.",
            "filePath": "/guides/tooling/grafana-loki-logs/01-what-loki-actually-is.md"
          },
          {
            "slug": "02-shipping-and-querying-logql",
            "title": "Shipping logs and querying with LogQL",
            "phaseNum": "2",
            "order": 2,
            "summary": "Logs that act like Prometheus: Loki indexes only labels (not full text), making centralized logging cheap, and ties them to your metrics in Grafana.",
            "filePath": "/guides/tooling/grafana-loki-logs/02-shipping-and-querying-logql.md"
          },
          {
            "slug": "03-cardinality-cost-tradeoffs",
            "title": "Cardinality, cost, and the Elasticsearch tradeoff",
            "phaseNum": "3",
            "order": 3,
            "summary": "Logs that act like Prometheus: Loki indexes only labels (not full text), making centralized logging cheap, and ties them to your metrics in Grafana.",
            "filePath": "/guides/tooling/grafana-loki-logs/03-cardinality-cost-tradeoffs.md"
          }
        ]
      },
      {
        "slug": "pytest-from-zero",
        "title": "Pytest, From Zero",
        "summary": "Python testing that gets out of your way: plain assert, fixtures for setup and teardown, parametrize for table-driven tests, and a rich plugin ecosystem.",
        "order": 35,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The mental model: plain assert and zero-config discovery",
            "phaseNum": "1",
            "order": 1,
            "summary": "Python testing that gets out of your way: plain assert, fixtures for setup and teardown, parametrize for table-driven tests, and a rich plugin ecosystem.",
            "filePath": "/guides/tooling/pytest-from-zero/01-the-mental-model.md"
          },
          {
            "slug": "02-fixtures-parametrize-marks",
            "title": "The everyday core: fixtures, parametrize, and marks",
            "phaseNum": "2",
            "order": 2,
            "summary": "Python testing that gets out of your way: plain assert, fixtures for setup and teardown, parametrize for table-driven tests, and a rich plugin ecosystem.",
            "filePath": "/guides/tooling/pytest-from-zero/02-fixtures-parametrize-marks.md"
          },
          {
            "slug": "03-conftest-monkeypatch-gotchas",
            "title": "Production reality: conftest, monkeypatch, and the gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Python testing that gets out of your way: plain assert, fixtures for setup and teardown, parametrize for table-driven tests, and a rich plugin ecosystem.",
            "filePath": "/guides/tooling/pytest-from-zero/03-conftest-monkeypatch-gotchas.md"
          }
        ]
      },
      {
        "slug": "junit-and-mockito",
        "title": "JUnit and Mockito",
        "summary": "The Java testing duo: JUnit 5 for structuring and running tests with assertions and lifecycle, and Mockito for mocking the collaborators you want to isolate.",
        "order": 36,
        "phases": [
          {
            "slug": "01-what-junit-5-actually-is",
            "title": "What JUnit 5 actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "The Java testing duo: JUnit 5 for structuring and running tests with assertions and lifecycle, and Mockito for mocking the collaborators you want to isolate.",
            "filePath": "/guides/tooling/junit-and-mockito/01-what-junit-5-actually-is.md"
          },
          {
            "slug": "02-mocking-with-mockito",
            "title": "Mocking with Mockito",
            "phaseNum": "2",
            "order": 2,
            "summary": "The Java testing duo: JUnit 5 for structuring and running tests with assertions and lifecycle, and Mockito for mocking the collaborators you want to isolate.",
            "filePath": "/guides/tooling/junit-and-mockito/02-mocking-with-mockito.md"
          },
          {
            "slug": "03-when-tests-lie",
            "title": "When tests lie",
            "phaseNum": "3",
            "order": 3,
            "summary": "The Java testing duo: JUnit 5 for structuring and running tests with assertions and lifecycle, and Mockito for mocking the collaborators you want to isolate.",
            "filePath": "/guides/tooling/junit-and-mockito/03-when-tests-lie.md"
          }
        ]
      },
      {
        "slug": "jest-and-vitest",
        "title": "Jest and Vitest",
        "summary": "JavaScript and TypeScript testing: Jest's batteries-included matchers, mocks, and snapshots - and Vitest, the faster, Vite-native drop-in with the same API.",
        "order": 37,
        "phases": [
          {
            "slug": "01-the-test-runner-model",
            "title": "The model: what a test runner does",
            "phaseNum": "1",
            "order": 1,
            "summary": "JavaScript and TypeScript testing: Jest's batteries-included matchers, mocks, and snapshots - and Vitest, the faster, Vite-native drop-in with the same API.",
            "filePath": "/guides/tooling/jest-and-vitest/01-the-test-runner-model.md"
          },
          {
            "slug": "02-matchers-mocks-async",
            "title": "The daily core: matchers, mocks, async, timers",
            "phaseNum": "2",
            "order": 2,
            "summary": "JavaScript and TypeScript testing: Jest's batteries-included matchers, mocks, and snapshots - and Vitest, the faster, Vite-native drop-in with the same API.",
            "filePath": "/guides/tooling/jest-and-vitest/02-matchers-mocks-async.md"
          },
          {
            "slug": "03-snapshots-flakiness-choosing",
            "title": "Production reality: snapshots, flakiness, and Jest vs Vitest",
            "phaseNum": "3",
            "order": 3,
            "summary": "JavaScript and TypeScript testing: Jest's batteries-included matchers, mocks, and snapshots - and Vitest, the faster, Vite-native drop-in with the same API.",
            "filePath": "/guides/tooling/jest-and-vitest/03-snapshots-flakiness-choosing.md"
          }
        ]
      },
      {
        "slug": "playwright-from-zero",
        "title": "Playwright, From Zero",
        "summary": "Reliable browser end-to-end tests: auto-waiting locators that kill flakiness, cross-browser runs, tracing, and codegen to record a test by clicking.",
        "order": 38,
        "phases": [
          {
            "slug": "01-the-mental-model",
            "title": "The mental model: a browser you can boss around",
            "phaseNum": "1",
            "order": 1,
            "summary": "Reliable browser end-to-end tests: auto-waiting locators that kill flakiness, cross-browser runs, tracing, and codegen to record a test by clicking.",
            "filePath": "/guides/tooling/playwright-from-zero/01-the-mental-model.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop: write, run, debug",
            "phaseNum": "2",
            "order": 2,
            "summary": "Reliable browser end-to-end tests: auto-waiting locators that kill flakiness, cross-browser runs, tracing, and codegen to record a test by clicking.",
            "filePath": "/guides/tooling/playwright-from-zero/02-the-everyday-loop.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production reality: the things that bite",
            "phaseNum": "3",
            "order": 3,
            "summary": "Reliable browser end-to-end tests: auto-waiting locators that kill flakiness, cross-browser runs, tracing, and codegen to record a test by clicking.",
            "filePath": "/guides/tooling/playwright-from-zero/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "cypress-and-selenium",
        "title": "Cypress and Selenium",
        "summary": "Two more ways to test in a browser: Cypress's developer-friendly in-browser runner, and Selenium/WebDriver, the long-standing cross-language standard.",
        "order": 39,
        "phases": [
          {
            "slug": "01-two-tools-two-architectures",
            "title": "Two Tools, Two Architectures",
            "phaseNum": "1",
            "order": 1,
            "summary": "Two more ways to test in a browser: Cypress's developer-friendly in-browser runner, and Selenium/WebDriver, the long-standing cross-language standard.",
            "filePath": "/guides/tooling/cypress-and-selenium/01-two-tools-two-architectures.md"
          },
          {
            "slug": "02-writing-and-running-tests",
            "title": "Writing and Running Tests",
            "phaseNum": "2",
            "order": 2,
            "summary": "Two more ways to test in a browser: Cypress's developer-friendly in-browser runner, and Selenium/WebDriver, the long-standing cross-language standard.",
            "filePath": "/guides/tooling/cypress-and-selenium/02-writing-and-running-tests.md"
          },
          {
            "slug": "03-limits-flake-and-choosing",
            "title": "Limits, Flake, and Choosing",
            "phaseNum": "3",
            "order": 3,
            "summary": "Two more ways to test in a browser: Cypress's developer-friendly in-browser runner, and Selenium/WebDriver, the long-standing cross-language standard.",
            "filePath": "/guides/tooling/cypress-and-selenium/03-limits-flake-and-choosing.md"
          }
        ]
      },
      {
        "slug": "testcontainers-from-zero",
        "title": "Testcontainers, From Zero",
        "summary": "Integration tests against the real thing: spin up a throwaway Postgres, Kafka, or Redis in Docker for each test run, then tear it down automatically.",
        "order": 40,
        "phases": [
          {
            "slug": "01-why-mocks-lie",
            "title": "Why mocks lie and what a container gives you",
            "phaseNum": "1",
            "order": 1,
            "summary": "Integration tests against the real thing: spin up a throwaway Postgres, Kafka, or Redis in Docker for each test run, then tear it down automatically.",
            "filePath": "/guides/tooling/testcontainers-from-zero/01-why-mocks-lie.md"
          },
          {
            "slug": "02-the-everyday-loop",
            "title": "The everyday loop: start, connect, tear down",
            "phaseNum": "2",
            "order": 2,
            "summary": "Integration tests against the real thing: spin up a throwaway Postgres, Kafka, or Redis in Docker for each test run, then tear it down automatically.",
            "filePath": "/guides/tooling/testcontainers-from-zero/02-the-everyday-loop.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Production reality: Docker, speed, and CI",
            "phaseNum": "3",
            "order": 3,
            "summary": "Integration tests against the real thing: spin up a throwaway Postgres, Kafka, or Redis in Docker for each test run, then tear it down automatically.",
            "filePath": "/guides/tooling/testcontainers-from-zero/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "load-testing-k6-jmeter",
        "title": "Load Testing: k6 and JMeter",
        "summary": "Find the breaking point before your users do: k6's scriptable load tests and JMeter's mature GUI approach, plus how to read the results.",
        "order": 41,
        "phases": [
          {
            "slug": "01-what-load-testing-measures",
            "title": "What load testing actually measures",
            "phaseNum": "1",
            "order": 1,
            "summary": "Load vs stress vs soak, what a virtual user is, and why the average response time hides the failure your users actually feel.",
            "filePath": "/guides/tooling/load-testing-k6-jmeter/01-what-load-testing-measures.md"
          },
          {
            "slug": "02-k6-and-jmeter-in-practice",
            "title": "Writing the same test in k6 and JMeter",
            "phaseNum": "2",
            "order": 2,
            "summary": "One realistic ramping scenario built twice, in k6's JavaScript and JMeter's GUI, plus thresholds, checks, and running it in CI.",
            "filePath": "/guides/tooling/load-testing-k6-jmeter/02-k6-and-jmeter-in-practice.md"
          },
          {
            "slug": "03-gotchas-and-production-reality",
            "title": "When the numbers lie and the system breaks",
            "phaseNum": "3",
            "order": 3,
            "summary": "The traps that quietly fake a passing load test, plus what real production load does that your tidy localhost run never showed you.",
            "filePath": "/guides/tooling/load-testing-k6-jmeter/03-gotchas-and-production-reality.md"
          }
        ]
      },
      {
        "slug": "eslint-and-prettier",
        "title": "ESLint and Prettier",
        "summary": "Stop arguing about code style: Prettier formats automatically, ESLint catches real bugs and bad patterns, and together they end the bikeshedding.",
        "order": 42,
        "phases": [
          {
            "slug": "01-two-tools-two-jobs",
            "title": "Two tools, two jobs",
            "phaseNum": "1",
            "order": 1,
            "summary": "Stop arguing about code style: Prettier formats automatically, ESLint catches real bugs and bad patterns, and together they end the bikeshedding.",
            "filePath": "/guides/tooling/eslint-and-prettier/01-two-tools-two-jobs.md"
          },
          {
            "slug": "02-config-and-autofix",
            "title": "Config and autofix",
            "phaseNum": "2",
            "order": 2,
            "summary": "Stop arguing about code style: Prettier formats automatically, ESLint catches real bugs and bad patterns, and together they end the bikeshedding.",
            "filePath": "/guides/tooling/eslint-and-prettier/02-config-and-autofix.md"
          },
          {
            "slug": "03-enforcement-and-gotchas",
            "title": "Enforcement and gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Stop arguing about code style: Prettier formats automatically, ESLint catches real bugs and bad patterns, and together they end the bikeshedding.",
            "filePath": "/guides/tooling/eslint-and-prettier/03-enforcement-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "ruff-and-black",
        "title": "Ruff and Black",
        "summary": "Python code quality at speed: Black formats with no options to argue about, and Ruff lints and now formats astonishingly fast, replacing a stack of older tools.",
        "order": 43,
        "phases": [
          {
            "slug": "01-formatter-vs-linter",
            "title": "What a formatter and a linter actually do",
            "phaseNum": "1",
            "order": 1,
            "summary": "Python code quality at speed: Black formats with no options to argue about, and Ruff lints and now formats astonishingly fast, replacing a stack of older tools.",
            "filePath": "/guides/tooling/ruff-and-black/01-formatter-vs-linter.md"
          },
          {
            "slug": "02-the-everyday-workflow",
            "title": "The everyday workflow",
            "phaseNum": "2",
            "order": 2,
            "summary": "Python code quality at speed: Black formats with no options to argue about, and Ruff lints and now formats astonishingly fast, replacing a stack of older tools.",
            "filePath": "/guides/tooling/ruff-and-black/02-the-everyday-workflow.md"
          },
          {
            "slug": "03-pre-commit-ci-and-gotchas",
            "title": "Pre-commit, CI, and the gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Python code quality at speed: Black formats with no options to argue about, and Ruff lints and now formats astonishingly fast, replacing a stack of older tools.",
            "filePath": "/guides/tooling/ruff-and-black/03-pre-commit-ci-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "sonarqube-from-zero",
        "title": "SonarQube, From Zero",
        "summary": "The enterprise code-quality gate: static analysis for bugs, vulnerabilities, and code smells, with coverage and a quality gate that can block a merge.",
        "order": 44,
        "phases": [
          {
            "slug": "01-what-it-is",
            "title": "What SonarQube actually is",
            "phaseNum": "1",
            "order": 1,
            "summary": "The enterprise code-quality gate: static analysis for bugs, vulnerabilities, and code smells, with coverage and a quality gate that can block a merge.",
            "filePath": "/guides/tooling/sonarqube-from-zero/01-what-it-is.md"
          },
          {
            "slug": "02-scanning-and-the-gate",
            "title": "Scanning and the quality gate",
            "phaseNum": "2",
            "order": 2,
            "summary": "The enterprise code-quality gate: static analysis for bugs, vulnerabilities, and code smells, with coverage and a quality gate that can block a merge.",
            "filePath": "/guides/tooling/sonarqube-from-zero/02-scanning-and-the-gate.md"
          },
          {
            "slug": "03-where-it-nags",
            "title": "Where it nags and how to tame it",
            "phaseNum": "3",
            "order": 3,
            "summary": "The enterprise code-quality gate: static analysis for bugs, vulnerabilities, and code smells, with coverage and a quality gate that can block a merge.",
            "filePath": "/guides/tooling/sonarqube-from-zero/03-where-it-nags.md"
          }
        ]
      },
      {
        "slug": "pre-commit-hooks",
        "title": "pre-commit Hooks",
        "summary": "Catch problems before they're committed: the pre-commit framework runs formatters, linters, and secret scanners automatically on every git commit.",
        "order": 45,
        "phases": [
          {
            "slug": "01-what-a-hook-is",
            "title": "What a Hook Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Catch problems before they're committed: the pre-commit framework runs formatters, linters, and secret scanners automatically on every git commit.",
            "filePath": "/guides/tooling/pre-commit-hooks/01-what-a-hook-is.md"
          },
          {
            "slug": "02-the-config-and-loop",
            "title": "The Config and the Commit Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Catch problems before they're committed: the pre-commit framework runs formatters, linters, and secret scanners automatically on every git commit.",
            "filePath": "/guides/tooling/pre-commit-hooks/02-the-config-and-loop.md"
          },
          {
            "slug": "03-bypassing-ci-and-gotchas",
            "title": "Bypassing, CI, and the Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Catch problems before they're committed: the pre-commit framework runs formatters, linters, and secret scanners automatically on every git commit.",
            "filePath": "/guides/tooling/pre-commit-hooks/03-bypassing-ci-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "oauth2-and-oidc",
        "title": "OAuth2 and OpenID Connect",
        "summary": "The standard behind 'Log in with Google': OAuth2 grants delegated access, OIDC adds identity on top, and the authorization-code-with-PKCE flow ties it together.",
        "order": 46,
        "phases": [
          {
            "slug": "01-the-problem-and-the-roles",
            "title": "The Problem and the Four Roles",
            "phaseNum": "1",
            "order": 1,
            "summary": "The standard behind 'Log in with Google': OAuth2 grants delegated access, OIDC adds identity on top, and the authorization-code-with-PKCE flow ties it together.",
            "filePath": "/guides/tooling/oauth2-and-oidc/01-the-problem-and-the-roles.md"
          },
          {
            "slug": "02-the-flow-and-the-tokens",
            "title": "The Authorization Code Flow and the Three Tokens",
            "phaseNum": "2",
            "order": 2,
            "summary": "The standard behind 'Log in with Google': OAuth2 grants delegated access, OIDC adds identity on top, and the authorization-code-with-PKCE flow ties it together.",
            "filePath": "/guides/tooling/oauth2-and-oidc/02-the-flow-and-the-tokens.md"
          },
          {
            "slug": "03-production-reality-and-gotchas",
            "title": "Production Reality and the Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "The standard behind 'Log in with Google': OAuth2 grants delegated access, OIDC adds identity on top, and the authorization-code-with-PKCE flow ties it together.",
            "filePath": "/guides/tooling/oauth2-and-oidc/03-production-reality-and-gotchas.md"
          }
        ]
      },
      {
        "slug": "jwt-in-depth",
        "title": "JWT, In Depth",
        "summary": "What a JSON Web Token really is: three base64 parts, a signature you must verify, and the stateless-auth tradeoffs (plus the mistakes that cause breaches).",
        "order": 47,
        "phases": [
          {
            "slug": "01-three-parts-and-a-signature",
            "title": "Three Parts and a Signature",
            "phaseNum": "1",
            "order": 1,
            "summary": "What a JSON Web Token really is: three base64 parts, a signature you must verify, and the stateless-auth tradeoffs (plus the mistakes that cause breaches).",
            "filePath": "/guides/tooling/jwt-in-depth/01-three-parts-and-a-signature.md"
          },
          {
            "slug": "02-issuing-sending-verifying",
            "title": "Issuing, Sending, and Verifying",
            "phaseNum": "2",
            "order": 2,
            "summary": "What a JSON Web Token really is: three base64 parts, a signature you must verify, and the stateless-auth tradeoffs (plus the mistakes that cause breaches).",
            "filePath": "/guides/tooling/jwt-in-depth/02-issuing-sending-verifying.md"
          },
          {
            "slug": "03-where-it-breaks",
            "title": "Where It Breaks",
            "phaseNum": "3",
            "order": 3,
            "summary": "What a JSON Web Token really is: three base64 parts, a signature you must verify, and the stateless-auth tradeoffs (plus the mistakes that cause breaches).",
            "filePath": "/guides/tooling/jwt-in-depth/03-where-it-breaks.md"
          }
        ]
      },
      {
        "slug": "keycloak-and-auth0",
        "title": "Keycloak and Auth0",
        "summary": "Don't build auth yourself: a managed identity provider (Auth0) or a self-hosted one (Keycloak) gives you login, social sign-on, MFA, and OIDC out of the box.",
        "order": 48,
        "phases": [
          {
            "slug": "01-stop-building-auth",
            "title": "Stop Building Auth",
            "phaseNum": "1",
            "order": 1,
            "summary": "Don't build auth yourself: a managed identity provider (Auth0) or a self-hosted one (Keycloak) gives you login, social sign-on, MFA, and OIDC out of the box.",
            "filePath": "/guides/tooling/keycloak-and-auth0/01-stop-building-auth.md"
          },
          {
            "slug": "02-realms-clients-roles",
            "title": "Realms, Clients, and Roles",
            "phaseNum": "2",
            "order": 2,
            "summary": "Don't build auth yourself: a managed identity provider (Auth0) or a self-hosted one (Keycloak) gives you login, social sign-on, MFA, and OIDC out of the box.",
            "filePath": "/guides/tooling/keycloak-and-auth0/02-realms-clients-roles.md"
          },
          {
            "slug": "03-managed-vs-self-hosted",
            "title": "Managed vs Self-Hosted, and the Gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Don't build auth yourself: a managed identity provider (Auth0) or a self-hosted one (Keycloak) gives you login, social sign-on, MFA, and OIDC out of the box.",
            "filePath": "/guides/tooling/keycloak-and-auth0/03-managed-vs-self-hosted.md"
          }
        ]
      },
      {
        "slug": "openapi-and-swagger",
        "title": "OpenAPI and Swagger",
        "summary": "Describe your REST API once in OpenAPI, and get interactive docs, client SDKs, request validation, and contract tests for free - the API as a spec.",
        "order": 49,
        "phases": [
          {
            "slug": "01-the-contract-not-the-docs",
            "title": "The Contract, Not the Docs",
            "phaseNum": "1",
            "order": 1,
            "summary": "Describe your REST API once in OpenAPI, and get interactive docs, client SDKs, request validation, and contract tests for free - the API as a spec.",
            "filePath": "/guides/tooling/openapi-and-swagger/01-the-contract-not-the-docs.md"
          },
          {
            "slug": "02-writing-and-generating",
            "title": "Writing and Generating From the Spec",
            "phaseNum": "2",
            "order": 2,
            "summary": "Describe your REST API once in OpenAPI, and get interactive docs, client SDKs, request validation, and contract tests for free - the API as a spec.",
            "filePath": "/guides/tooling/openapi-and-swagger/02-writing-and-generating.md"
          },
          {
            "slug": "03-the-spec-in-production",
            "title": "The Spec at Work in Production",
            "phaseNum": "3",
            "order": 3,
            "summary": "Describe your REST API once in OpenAPI, and get interactive docs, client SDKs, request validation, and contract tests for free - the API as a spec.",
            "filePath": "/guides/tooling/openapi-and-swagger/03-the-spec-in-production.md"
          }
        ]
      },
      {
        "slug": "elasticsearch-and-opensearch",
        "title": "Elasticsearch and OpenSearch",
        "summary": "Full-text search at scale: the inverted index, analyzers and relevance scoring, and how a search engine differs from a database WHERE clause.",
        "order": 50,
        "phases": [
          {
            "slug": "01-the-inverted-index",
            "title": "Phase 1: The inverted index, or why search is a different problem",
            "phaseNum": "1",
            "order": 1,
            "summary": "Full-text search at scale: the inverted index, analyzers and relevance scoring, and how a search engine differs from a database WHERE clause.",
            "filePath": "/guides/tooling/elasticsearch-and-opensearch/01-the-inverted-index.md"
          },
          {
            "slug": "02-indexing-and-relevance",
            "title": "Phase 2: Indexing, mappings, analyzers, and getting ranked results",
            "phaseNum": "2",
            "order": 2,
            "summary": "Full-text search at scale: the inverted index, analyzers and relevance scoring, and how a search engine differs from a database WHERE clause.",
            "filePath": "/guides/tooling/elasticsearch-and-opensearch/02-indexing-and-relevance.md"
          },
          {
            "slug": "03-production-reality",
            "title": "Phase 3: Near-real-time, consistency, and when to add search at all",
            "phaseNum": "3",
            "order": 3,
            "summary": "Full-text search at scale: the inverted index, analyzers and relevance scoring, and how a search engine differs from a database WHERE clause.",
            "filePath": "/guides/tooling/elasticsearch-and-opensearch/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "graphql-clients-apollo",
        "title": "GraphQL Clients (Apollo)",
        "summary": "Consuming GraphQL from the front end: how Apollo Client's normalized cache, queries, and mutations change data fetching versus REST calls.",
        "order": 51,
        "phases": [
          {
            "slug": "01-the-cache-is-the-point",
            "title": "The cache is the point",
            "phaseNum": "1",
            "order": 1,
            "summary": "Consuming GraphQL from the front end: how Apollo Client's normalized cache, queries, and mutations change data fetching versus REST calls.",
            "filePath": "/guides/tooling/graphql-clients-apollo/01-the-cache-is-the-point.md"
          },
          {
            "slug": "02-queries-and-mutations",
            "title": "Queries and mutations in real components",
            "phaseNum": "2",
            "order": 2,
            "summary": "Consuming GraphQL from the front end: how Apollo Client's normalized cache, queries, and mutations change data fetching versus REST calls.",
            "filePath": "/guides/tooling/graphql-clients-apollo/02-queries-and-mutations.md"
          },
          {
            "slug": "03-production-reality",
            "title": "When the cache lies to you",
            "phaseNum": "3",
            "order": 3,
            "summary": "Consuming GraphQL from the front end: how Apollo Client's normalized cache, queries, and mutations change data fetching versus REST calls.",
            "filePath": "/guides/tooling/graphql-clients-apollo/03-production-reality.md"
          }
        ]
      },
      {
        "slug": "hashicorp-vault",
        "title": "HashiCorp Vault",
        "summary": "Stop hardcoding secrets: Vault stores them encrypted, gates access by policy, issues short-lived dynamic credentials, and keeps an audit trail.",
        "order": 52,
        "phases": [
          {
            "slug": "01-sealed-by-default",
            "title": "Sealed by Default",
            "phaseNum": "1",
            "order": 1,
            "summary": "Stop hardcoding secrets: Vault stores them encrypted, gates access by policy, issues short-lived dynamic credentials, and keeps an audit trail.",
            "filePath": "/guides/tooling/hashicorp-vault/01-sealed-by-default.md"
          },
          {
            "slug": "02-the-daily-loop",
            "title": "The Daily Loop",
            "phaseNum": "2",
            "order": 2,
            "summary": "Stop hardcoding secrets: Vault stores them encrypted, gates access by policy, issues short-lived dynamic credentials, and keeps an audit trail.",
            "filePath": "/guides/tooling/hashicorp-vault/02-the-daily-loop.md"
          },
          {
            "slug": "03-leases-revocation-and-reality",
            "title": "Leases, Revocation, and Reality",
            "phaseNum": "3",
            "order": 3,
            "summary": "Stop hardcoding secrets: Vault stores them encrypted, gates access by policy, issues short-lived dynamic credentials, and keeps an audit trail.",
            "filePath": "/guides/tooling/hashicorp-vault/03-leases-revocation-and-reality.md"
          }
        ]
      },
      {
        "slug": "artifact-registries",
        "title": "Artifact Registries: Docker Hub, Nexus, Artifactory",
        "summary": "Where your builds live: container and package registries that store, version, and serve your artifacts - with the proxying and access control teams rely on.",
        "order": 53,
        "phases": [
          {
            "slug": "01-what-a-registry-actually-is",
            "title": "What a Registry Actually Is",
            "phaseNum": "1",
            "order": 1,
            "summary": "Where your builds live: container and package registries that store, version, and serve your artifacts - with the proxying and access control teams rely on.",
            "filePath": "/guides/tooling/artifact-registries/01-what-a-registry-actually-is.md"
          },
          {
            "slug": "02-pushing-pulling-private-packages",
            "title": "Pushing, Pulling, and Private Packages",
            "phaseNum": "2",
            "order": 2,
            "summary": "Where your builds live: container and package registries that store, version, and serve your artifacts - with the proxying and access control teams rely on.",
            "filePath": "/guides/tooling/artifact-registries/02-pushing-pulling-private-packages.md"
          },
          {
            "slug": "03-proxying-retention-scanning-gotchas",
            "title": "Proxying, Retention, Scanning, and the Tag Trap",
            "phaseNum": "3",
            "order": 3,
            "summary": "Where your builds live: container and package registries that store, version, and serve your artifacts - with the proxying and access control teams rely on.",
            "filePath": "/guides/tooling/artifact-registries/03-proxying-retention-scanning-gotchas.md"
          }
        ]
      },
      {
        "slug": "protobuf-and-avro",
        "title": "Protobuf and Avro",
        "summary": "Binary serialization with a schema: Protocol Buffers and Avro make data small and fast across services, and force you to think about schema evolution.",
        "order": 54,
        "phases": [
          {
            "slug": "01-why-schemas-beat-json",
            "title": "The mental model: schema-first binary data",
            "phaseNum": "1",
            "order": 1,
            "summary": "Binary serialization with a schema: Protocol Buffers and Avro make data small and fast across services, and force you to think about schema evolution.",
            "filePath": "/guides/tooling/protobuf-and-avro/01-why-schemas-beat-json.md"
          },
          {
            "slug": "02-using-protobuf-and-avro",
            "title": "Using them day to day",
            "phaseNum": "2",
            "order": 2,
            "summary": "Binary serialization with a schema: Protocol Buffers and Avro make data small and fast across services, and force you to think about schema evolution.",
            "filePath": "/guides/tooling/protobuf-and-avro/02-using-protobuf-and-avro.md"
          },
          {
            "slug": "03-schema-evolution-and-gotchas",
            "title": "Schema evolution and the gotchas",
            "phaseNum": "3",
            "order": 3,
            "summary": "Binary serialization with a schema: Protocol Buffers and Avro make data small and fast across services, and force you to think about schema evolution.",
            "filePath": "/guides/tooling/protobuf-and-avro/03-schema-evolution-and-gotchas.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "projects",
    "name": "Projects",
    "icon": "ti-rocket",
    "blurb": "Build real things end to end - small projects with working code run in the browser.",
    "guides": [
      {
        "slug": "url-shortener-python",
        "title": "Build a URL Shortener (Python)",
        "summary": "Build a working URL shortener from scratch in Python - the data model, short-code generation, and lookup - running right in your browser, no setup.",
        "order": 1,
        "phases": [
          {
            "slug": "01-the-plan",
            "title": "The Plan and the Data Model",
            "phaseNum": "1",
            "order": 1,
            "summary": "Pin down what a URL shortener actually does, then build the dictionary store that remembers one short code's long URL.",
            "filePath": "/guides/projects/url-shortener-python/01-the-plan.md"
          },
          {
            "slug": "02-making-short-codes",
            "title": "Making Short Codes",
            "phaseNum": "2",
            "order": 2,
            "summary": "Turn a counting number into a compact base62 short code, using a counter so every link gets a unique, collision-free label.",
            "filePath": "/guides/projects/url-shortener-python/02-making-short-codes.md"
          },
          {
            "slug": "03-store-and-resolve",
            "title": "Store and Resolve",
            "phaseNum": "3",
            "order": 3,
            "summary": "Join the store and the generator into shorten() and resolve(), handling unknown codes and the same URL submitted twice.",
            "filePath": "/guides/projects/url-shortener-python/03-store-and-resolve.md"
          },
          {
            "slug": "04-a-tiny-cli",
            "title": "A Tiny CLI, and Where to Take It",
            "phaseNum": "4",
            "order": 4,
            "summary": "Wrap shorten() and resolve() in a small command loop you can drive with typed commands, then map out how to grow it into a real service.",
            "filePath": "/guides/projects/url-shortener-python/04-a-tiny-cli.md"
          }
        ]
      },
      {
        "slug": "cli-todo-python",
        "title": "Build a CLI To-Do App (Python)",
        "summary": "Build a command-line to-do app in Python - add, list, complete, and save tasks to a file - runnable in your browser, then ready to run for real.",
        "order": 2,
        "phases": [
          {
            "slug": "01-tasks-in-memory",
            "title": "Tasks in Memory",
            "phaseNum": "1",
            "order": 1,
            "summary": "Model each task as a dictionary, collect them in a list, and write add and list functions you can watch grow.",
            "filePath": "/guides/projects/cli-todo-python/01-tasks-in-memory.md"
          },
          {
            "slug": "02-saving-to-a-file",
            "title": "Saving to a File",
            "phaseNum": "2",
            "order": 2,
            "summary": "Use the json module to write your task list to a text file and load it back, so tasks survive after the program ends.",
            "filePath": "/guides/projects/cli-todo-python/02-saving-to-a-file.md"
          },
          {
            "slug": "03-complete-and-delete",
            "title": "Complete, Delete, and Filter",
            "phaseNum": "3",
            "order": 3,
            "summary": "Write functions to mark a task done, remove one by id, and split the list into open and finished tasks.",
            "filePath": "/guides/projects/cli-todo-python/03-complete-and-delete.md"
          },
          {
            "slug": "04-a-real-cli",
            "title": "A Real CLI",
            "phaseNum": "4",
            "order": 4,
            "summary": "Read the command word you typed, dispatch to the right function, and assemble everything into a todo.py you run from your terminal.",
            "filePath": "/guides/projects/cli-todo-python/04-a-real-cli.md"
          }
        ]
      },
      {
        "slug": "markdown-to-html-js",
        "title": "Build a Markdown-to-HTML Converter (JS)",
        "summary": "Write your own little Markdown-to-HTML converter in JavaScript - blocks, inline formatting, and escaping - built and run right in the browser.",
        "order": 3,
        "phases": [
          {
            "slug": "01-the-plan",
            "title": "The Plan: Lines to HTML",
            "phaseNum": "1",
            "order": 1,
            "summary": "Map Markdown onto HTML, split the input into lines, and set up the loop your whole converter will live inside.",
            "filePath": "/guides/projects/markdown-to-html-js/01-the-plan.md"
          },
          {
            "slug": "02-block-elements",
            "title": "Block Elements",
            "phaseNum": "2",
            "order": 2,
            "summary": "Turn whole lines into headings, paragraphs, and lists using regular expressions that capture the text and wrap it in tags.",
            "filePath": "/guides/projects/markdown-to-html-js/02-block-elements.md"
          },
          {
            "slug": "03-inline-formatting",
            "title": "Inline Formatting",
            "phaseNum": "3",
            "order": 3,
            "summary": "Format the text inside blocks - bold, italic, inline code, and links - with a chain of regex replacements applied in the right order.",
            "filePath": "/guides/projects/markdown-to-html-js/03-inline-formatting.md"
          },
          {
            "slug": "04-putting-it-together",
            "title": "Putting It Together",
            "phaseNum": "4",
            "order": 4,
            "summary": "Wire the block and inline passes into one converter, escape raw HTML so it can't break your page, and handle the rough edges.",
            "filePath": "/guides/projects/markdown-to-html-js/04-putting-it-together.md"
          }
        ]
      },
      {
        "slug": "sql-expense-analytics",
        "title": "Build an Expense Analytics Report (SQL)",
        "summary": "Go from a raw expenses table to a real monthly report in SQL - grouping, aggregates, and window functions - all runnable in your browser.",
        "order": 4,
        "phases": [
          {
            "slug": "01-schema-and-data",
            "title": "The Schema and Seed Data",
            "phaseNum": "1",
            "order": 1,
            "summary": "Create the expenses table and fill it with a few dozen realistic rows you can query for the rest of the project.",
            "filePath": "/guides/projects/sql-expense-analytics/01-schema-and-data.md"
          },
          {
            "slug": "02-totals-and-groups",
            "title": "Totals and Groups",
            "phaseNum": "2",
            "order": 2,
            "summary": "Collapse the raw rows into spend per category and spend per month using GROUP BY and SUM.",
            "filePath": "/guides/projects/sql-expense-analytics/02-totals-and-groups.md"
          },
          {
            "slug": "03-window-functions",
            "title": "Running Totals with Window Functions",
            "phaseNum": "3",
            "order": 3,
            "summary": "Compute a running total and a month-over-month change with SUM() OVER and LAG, keeping every row instead of collapsing it.",
            "filePath": "/guides/projects/sql-expense-analytics/03-window-functions.md"
          },
          {
            "slug": "04-the-final-report",
            "title": "The Final Report",
            "phaseNum": "4",
            "order": 4,
            "summary": "Fold category share-of-total and the month-over-month trend into one report query you could drop into a dashboard.",
            "filePath": "/guides/projects/sql-expense-analytics/04-the-final-report.md"
          }
        ]
      },
      {
        "slug": "rest-api-fastapi",
        "title": "Build a REST API with FastAPI (Python)",
        "summary": "Build a real REST API with FastAPI - routes, validation, CRUD, and a database - set up and run on your own machine, the way you would at work.",
        "order": 5,
        "phases": [
          {
            "slug": "01-setup-and-hello",
            "title": "Setup and Hello, API",
            "phaseNum": "1",
            "order": 1,
            "summary": "Create a virtualenv, install FastAPI and Uvicorn, write your first endpoint, and watch the auto-generated docs appear.",
            "filePath": "/guides/projects/rest-api-fastapi/01-setup-and-hello.md"
          },
          {
            "slug": "02-routes-and-models",
            "title": "Routes and Pydantic Models",
            "phaseNum": "2",
            "order": 2,
            "summary": "Add path and query parameters, define a request body as a Pydantic model, and let FastAPI validate incoming data for you.",
            "filePath": "/guides/projects/rest-api-fastapi/02-routes-and-models.md"
          },
          {
            "slug": "03-crud",
            "title": "CRUD with an In-Memory Store",
            "phaseNum": "3",
            "order": 3,
            "summary": "Wire up create, read, update, and delete endpoints over a plain Python dictionary, then exercise every one of them with curl.",
            "filePath": "/guides/projects/rest-api-fastapi/03-crud.md"
          },
          {
            "slug": "04-validation-and-errors",
            "title": "Validation, Errors, and Status Codes",
            "phaseNum": "4",
            "order": 4,
            "summary": "Raise HTTPException for missing notes, return the right status code for each operation, and tighten the input rules with richer validation.",
            "filePath": "/guides/projects/rest-api-fastapi/04-validation-and-errors.md"
          },
          {
            "slug": "05-database-and-ship",
            "title": "A Database, then Ship It",
            "phaseNum": "5",
            "order": 5,
            "summary": "Swap the in-memory dict for a SQLite database so data survives restarts, then run, test, and learn how you'd deploy the finished API.",
            "filePath": "/guides/projects/rest-api-fastapi/05-database-and-ship.md"
          }
        ]
      },
      {
        "slug": "dockerize-an-app",
        "title": "Dockerize an App",
        "summary": "Take a small web app and containerize it - a real Dockerfile, image caching, and a compose file with a database - built and run on your machine.",
        "order": 6,
        "phases": [
          {
            "slug": "01-why-and-the-dockerfile",
            "title": "Why Containers, and a First Dockerfile",
            "phaseNum": "1",
            "order": 1,
            "summary": "Build a tiny Flask app, write a minimal Dockerfile for it, and run it inside a container on your machine.",
            "filePath": "/guides/projects/dockerize-an-app/01-why-and-the-dockerfile.md"
          },
          {
            "slug": "02-a-real-dockerfile",
            "title": "A Real Dockerfile",
            "phaseNum": "2",
            "order": 2,
            "summary": "Rework the Dockerfile so the layer cache speeds up rebuilds, the image shrinks, and the app runs as a non-root user.",
            "filePath": "/guides/projects/dockerize-an-app/02-a-real-dockerfile.md"
          },
          {
            "slug": "03-compose",
            "title": "docker compose: App Plus Database",
            "phaseNum": "3",
            "order": 3,
            "summary": "Write a compose.yaml that runs the Flask app and a Postgres database together, with a volume and depends_on, brought up and down in one command.",
            "filePath": "/guides/projects/dockerize-an-app/03-compose.md"
          },
          {
            "slug": "04-ship-it",
            "title": "Ship It",
            "phaseNum": "4",
            "order": 4,
            "summary": "Move config out of the compose file into env vars and secrets, add a healthcheck, then tag the image and push it to a registry.",
            "filePath": "/guides/projects/dockerize-an-app/04-ship-it.md"
          }
        ]
      },
      {
        "slug": "hangman-python",
        "title": "Build a Hangman Game (Python)",
        "summary": "Build the classic word-guessing game in Python - masked word, guessed letters, dwindling lives, win/lose - running right in your browser (no input(), the play is simulated).",
        "order": 7,
        "phases": [
          {
            "slug": "01-the-secret-word",
            "title": "The Secret Word and the Blanks",
            "phaseNum": "1",
            "order": 1,
            "summary": "Show a hidden word as a row of underscores and reveal only the letters that have been guessed.",
            "filePath": "/guides/projects/hangman-python/01-the-secret-word.md"
          },
          {
            "slug": "02-guessing",
            "title": "Handling a Guess",
            "phaseNum": "2",
            "order": 2,
            "summary": "Record each guessed letter in a set, refresh the masked word, and tell a hit from a miss.",
            "filePath": "/guides/projects/hangman-python/02-guessing.md"
          },
          {
            "slug": "03-lives-and-win-loss",
            "title": "Lives, Wins, and Losses",
            "phaseNum": "3",
            "order": 3,
            "summary": "Subtract a life on every wrong guess, then detect the two endings - the full word for a win, zero lives for a loss.",
            "filePath": "/guides/projects/hangman-python/03-lives-and-win-loss.md"
          },
          {
            "slug": "04-a-word-list-and-loop",
            "title": "A Word List and the Game Loop",
            "phaseNum": "4",
            "order": 4,
            "summary": "Pick a word at random from a list and wrap the whole round into one game function, then extend it with hints, categories, and a real input() version.",
            "filePath": "/guides/projects/hangman-python/04-a-word-list-and-loop.md"
          }
        ]
      },
      {
        "slug": "password-strength-checker-python",
        "title": "Build a Password Strength Checker (Python)",
        "summary": "Build a password strength checker in Python - length and character-class rules, a score, and helpful feedback - runnable in your browser on a set of sample passwords.",
        "order": 8,
        "phases": [
          {
            "slug": "01-the-rules",
            "title": "The Rules",
            "phaseNum": "1",
            "order": 1,
            "summary": "Write one small function per password rule - length and the four character classes - and test them on sample passwords.",
            "filePath": "/guides/projects/password-strength-checker-python/01-the-rules.md"
          },
          {
            "slug": "02-scoring",
            "title": "Turning Rules into a Score",
            "phaseNum": "2",
            "order": 2,
            "summary": "Combine the five rule results into a single 0\u20135 score and a weak/ok/strong label that a person can read at a glance.",
            "filePath": "/guides/projects/password-strength-checker-python/02-scoring.md"
          },
          {
            "slug": "03-feedback",
            "title": "Useful Feedback",
            "phaseNum": "3",
            "order": 3,
            "summary": "Turn the failed rules into a short list of plain-language fixes - \\\"add a symbol\\\", \\\"make it longer\\\" - instead of a bare score.",
            "filePath": "/guides/projects/password-strength-checker-python/03-feedback.md"
          },
          {
            "slug": "04-common-passwords",
            "title": "Catching Common Passwords",
            "phaseNum": "4",
            "order": 4,
            "summary": "Reject a built-in list of common and leaked passwords no matter how they score, finish the full check_password function, and see where real systems go further.",
            "filePath": "/guides/projects/password-strength-checker-python/04-common-passwords.md"
          }
        ]
      },
      {
        "slug": "csv-summary-python",
        "title": "Build a CSV Summary Report (Python)",
        "summary": "Turn raw CSV data into a summary report with Python\u2019s csv module - parse rows, aggregate, group, and format - all runnable in your browser from an embedded sample.",
        "order": 9,
        "phases": [
          {
            "slug": "01-parsing-csv",
            "title": "Parsing the CSV",
            "phaseNum": "1",
            "order": 1,
            "summary": "Read an embedded CSV sample into a list of dicts with the csv module's DictReader.",
            "filePath": "/guides/projects/csv-summary-python/01-parsing-csv.md"
          },
          {
            "slug": "02-aggregating",
            "title": "Totals and Counts",
            "phaseNum": "2",
            "order": 2,
            "summary": "Convert the amount column to numbers and compute sum, count, min, max, and average.",
            "filePath": "/guides/projects/csv-summary-python/02-aggregating.md"
          },
          {
            "slug": "03-grouping",
            "title": "Grouping with a Dict",
            "phaseNum": "3",
            "order": 3,
            "summary": "Group rows by a category column and total each group using collections.defaultdict.",
            "filePath": "/guides/projects/csv-summary-python/03-grouping.md"
          },
          {
            "slug": "04-the-report",
            "title": "Formatting the Report",
            "phaseNum": "4",
            "order": 4,
            "summary": "Assemble the totals and per-group breakdown into one aligned text report, then run it on a real file.",
            "filePath": "/guides/projects/csv-summary-python/04-the-report.md"
          }
        ]
      },
      {
        "slug": "json-formatter-js",
        "title": "Build a JSON Formatter & Validator (JS)",
        "summary": "Build a JSON pretty-printer and validator in JavaScript - parse, format, explain errors, and check shape - runnable right in your browser.",
        "order": 10,
        "phases": [
          {
            "slug": "01-parse-and-pretty",
            "title": "Parse and Pretty-Print",
            "phaseNum": "1",
            "order": 1,
            "summary": "Turn a cramped one-line JSON string into clean, indented output using JSON.parse and JSON.stringify.",
            "filePath": "/guides/projects/json-formatter-js/01-parse-and-pretty.md"
          },
          {
            "slug": "02-explaining-errors",
            "title": "Explaining Errors",
            "phaseNum": "2",
            "order": 2,
            "summary": "Catch a failed parse and turn the thrown error into a readable message with a rough location in the text.",
            "filePath": "/guides/projects/json-formatter-js/02-explaining-errors.md"
          },
          {
            "slug": "03-shape-check",
            "title": "A Tiny Shape Check",
            "phaseNum": "3",
            "order": 3,
            "summary": "Validate parsed JSON against a small expected shape - required keys present and each value the right type.",
            "filePath": "/guides/projects/json-formatter-js/03-shape-check.md"
          },
          {
            "slug": "04-minify-and-extend",
            "title": "Minify and Extend",
            "phaseNum": "4",
            "order": 4,
            "summary": "Add a whitespace-free minify mode, sort keys for stable output, and sketch a diff between two JSON values.",
            "filePath": "/guides/projects/json-formatter-js/04-minify-and-extend.md"
          }
        ]
      },
      {
        "slug": "web-scraper-python",
        "title": "Build a Web Scraper (Python)",
        "summary": "Build a real web scraper in Python with requests and BeautifulSoup - fetch, parse, extract structured data, paginate politely, and save it - run on your own machine.",
        "order": 11,
        "phases": [
          {
            "slug": "01-setup-and-fetch",
            "title": "Setup and Fetch a Page",
            "phaseNum": "1",
            "order": 1,
            "summary": "Set up a clean Python environment, install requests and BeautifulSoup, then fetch a real page and confirm it came back OK.",
            "filePath": "/guides/projects/web-scraper-python/01-setup-and-fetch.md"
          },
          {
            "slug": "02-parsing-html",
            "title": "Parsing the HTML",
            "phaseNum": "2",
            "order": 2,
            "summary": "Load the fetched HTML into BeautifulSoup and locate elements two ways - with the find/find_all methods and with CSS selectors.",
            "filePath": "/guides/projects/web-scraper-python/02-parsing-html.md"
          },
          {
            "slug": "03-extracting-data",
            "title": "Extracting Structured Data",
            "phaseNum": "3",
            "order": 3,
            "summary": "Turn loose page elements into clean dictionaries - one record per item - with tidy text and code that survives a missing field.",
            "filePath": "/guides/projects/web-scraper-python/03-extracting-data.md"
          },
          {
            "slug": "04-pagination-and-politeness",
            "title": "Pagination and Being Polite",
            "phaseNum": "4",
            "order": 4,
            "summary": "Follow next-page links through a whole catalog while staying a good guest - delays, a real User-Agent, robots.txt, rate limits, and the ethics and law of scraping.",
            "filePath": "/guides/projects/web-scraper-python/04-pagination-and-politeness.md"
          },
          {
            "slug": "05-saving-and-extend",
            "title": "Saving the Data, and Where to Take It",
            "phaseNum": "5",
            "order": 5,
            "summary": "Write your collected records to CSV and JSON to finish the working scraper, then map the upgrades - a database, scheduling, and headless browsers for JavaScript-heavy sites.",
            "filePath": "/guides/projects/web-scraper-python/05-saving-and-extend.md"
          }
        ]
      },
      {
        "slug": "realtime-chat-node",
        "title": "Build a Real-Time Chat (Node + WebSockets)",
        "summary": "Build a real-time chat app with Node and WebSockets - a server that broadcasts messages, a browser client, usernames, and rooms - built and run on your machine.",
        "order": 12,
        "phases": [
          {
            "slug": "01-setup-and-server",
            "title": "Setup and a WebSocket Server",
            "phaseNum": "1",
            "order": 1,
            "summary": "Set up a Node project, install the ws library, and run a server that accepts WebSocket connections and logs every message it receives.",
            "filePath": "/guides/projects/realtime-chat-node/01-setup-and-server.md"
          },
          {
            "slug": "02-broadcasting",
            "title": "Broadcasting Messages",
            "phaseNum": "2",
            "order": 2,
            "summary": "Relay each incoming message out to every connected client using the broadcast pattern, so one person's words reach the whole room.",
            "filePath": "/guides/projects/realtime-chat-node/02-broadcasting.md"
          },
          {
            "slug": "03-the-browser-client",
            "title": "The Browser Client",
            "phaseNum": "3",
            "order": 3,
            "summary": "Build an HTML page that opens a WebSocket to your server, sends what you type, and shows a live, scrolling list of incoming messages.",
            "filePath": "/guides/projects/realtime-chat-node/03-the-browser-client.md"
          },
          {
            "slug": "04-usernames",
            "title": "Usernames and Join/Leave",
            "phaseNum": "4",
            "order": 4,
            "summary": "Add a join message so each person picks a name, attach that name to every message, and announce when someone joins or leaves the room.",
            "filePath": "/guides/projects/realtime-chat-node/04-usernames.md"
          },
          {
            "slug": "05-rooms-and-run",
            "title": "Rooms, and Running It",
            "phaseNum": "5",
            "order": 5,
            "summary": "Split the chat into separate rooms so messages stay within a channel, then run the whole app end to end and map out where to take it next.",
            "filePath": "/guides/projects/realtime-chat-node/05-rooms-and-run.md"
          }
        ]
      },
      {
        "slug": "static-blog-generator-python",
        "title": "Build a Static Blog Generator (Python)",
        "summary": "Build your own static site generator in Python - parse Markdown posts with frontmatter, render them through templates you wrote yourself, generate an index, tag pages, and an RSS feed, then deploy the finished site for free.",
        "order": 13,
        "phases": [
          {
            "slug": "01-what-a-generator-is",
            "title": "What a Generator Actually Is, and Setup",
            "phaseNum": "1",
            "order": 1,
            "summary": "Static sites do all their work at build time, once - set up the project folder, a virtual environment, two Markdown posts, and a first script that finds them.",
            "filePath": "/guides/projects/static-blog-generator-python/01-what-a-generator-is.md"
          },
          {
            "slug": "02-parsing-posts",
            "title": "Parsing Posts: Frontmatter and Markdown",
            "phaseNum": "2",
            "order": 2,
            "summary": "Split frontmatter from the post body, parse the key: value metadata by hand, convert Markdown to HTML with the markdown library, and make bad posts fail loudly.",
            "filePath": "/guides/projects/static-blog-generator-python/02-parsing-posts.md"
          },
          {
            "slug": "03-templates",
            "title": "Templates Without a Framework",
            "phaseNum": "3",
            "order": 3,
            "summary": "Write a four-line template engine that replaces {{ placeholders }}, build a base layout and a post template, and generate a styled HTML page for every post.",
            "filePath": "/guides/projects/static-blog-generator-python/03-templates.md"
          },
          {
            "slug": "04-index-tags-rss",
            "title": "The Index, Tags, and an RSS Feed",
            "phaseNum": "4",
            "order": 4,
            "summary": "Generate a front page listing every post, a page per tag, and a valid RSS feed with escaped titles and RFC 822 dates - the pages that make it a blog.",
            "filePath": "/guides/projects/static-blog-generator-python/04-index-tags-rss.md"
          },
          {
            "slug": "05-dev-server",
            "title": "A Dev Server with Auto-Rebuild",
            "phaseNum": "5",
            "order": 5,
            "summary": "Serve the site locally with http.server and add a watcher thread that rebuilds the moment a post, template, or stylesheet changes - save, refresh, done.",
            "filePath": "/guides/projects/static-blog-generator-python/05-dev-server.md"
          },
          {
            "slug": "06-deploy",
            "title": "Deploying, and Where to Take It",
            "phaseNum": "6",
            "order": 6,
            "summary": "Put the generated site on the internet for free with Netlify Drop or GitHub Pages - including the subpath gotcha that breaks root-relative links - then the honest list of what to build next.",
            "filePath": "/guides/projects/static-blog-generator-python/06-deploy.md"
          }
        ]
      },
      {
        "slug": "cli-tool-go",
        "title": "Build a Real CLI Tool in Go",
        "summary": "Build til, a note-taking CLI in Go - subcommands, flags, safe JSON storage on disk, aligned table output, real tests, and cross-compiled binaries you can put on your PATH.",
        "order": 14,
        "phases": [
          {
            "slug": "01-why-go-and-setup",
            "title": "Why Go, and a Compiling Project",
            "phaseNum": "1",
            "order": 1,
            "summary": "Create the til module with go mod init, read command-line arguments from os.Args, and compile your first self-contained binary with go build.",
            "filePath": "/guides/projects/cli-tool-go/01-why-go-and-setup.md"
          },
          {
            "slug": "02-flags-and-add",
            "title": "Flags and the add Command",
            "phaseNum": "2",
            "order": 2,
            "summary": "Dispatch subcommands from os.Args, give each one its own flags with flag.NewFlagSet, and build the add command that parses tags and note text.",
            "filePath": "/guides/projects/cli-tool-go/02-flags-and-add.md"
          },
          {
            "slug": "03-json-on-disk",
            "title": "JSON on Disk, Safely",
            "phaseNum": "3",
            "order": 3,
            "summary": "Persist notes to ~/.til/notes.json with encoding/json - struct tags, a missing file treated as a first run, and atomic writes so a crash can't corrupt the store.",
            "filePath": "/guides/projects/cli-tool-go/03-json-on-disk.md"
          },
          {
            "slug": "04-list-search-tags",
            "title": "list, search, and tags",
            "phaseNum": "4",
            "order": 4,
            "summary": "Finish the subcommand set - list with -n and -tag flags, case-insensitive search, a tags summary - and align it all into clean tables with text/tabwriter.",
            "filePath": "/guides/projects/cli-tool-go/04-list-search-tags.md"
          },
          {
            "slug": "05-testing",
            "title": "Tests That Catch Real Bugs",
            "phaseNum": "5",
            "order": 5,
            "summary": "Write table-driven tests for the search and filter logic, round-trip the JSON storage through t.TempDir, and watch go test catch a planted bug.",
            "filePath": "/guides/projects/cli-tool-go/05-testing.md"
          },
          {
            "slug": "06-cross-compile-and-ship",
            "title": "Cross-Compile and Ship It",
            "phaseNum": "6",
            "order": 6,
            "summary": "Build til for Windows, macOS, and Linux from one machine with GOOS/GOARCH, install it on your PATH with go install, and map the honest next steps.",
            "filePath": "/guides/projects/cli-tool-go/06-cross-compile-and-ship.md"
          }
        ]
      },
      {
        "slug": "key-value-store-python",
        "title": "Build Your Own Key-Value Store (Python)",
        "summary": "Build a tiny persistent key-value database from scratch in Python - an append-only log, crash recovery, an in-memory index, compaction, and a TCP server - and come out understanding how real storage engines actually work.",
        "order": 15,
        "phases": [
          {
            "slug": "01-the-dict-and-the-problem",
            "title": "A Dict, and Why Persistence Is Hard",
            "phaseNum": "1",
            "order": 1,
            "summary": "The in-memory store is ten lines of Python; saving it to disk naively fails two ways - every write rewrites everything, and a crash mid-write corrupts the whole file.",
            "filePath": "/guides/projects/key-value-store-python/01-the-dict-and-the-problem.md"
          },
          {
            "slug": "02-the-append-only-log",
            "title": "The Append-Only Log - the Write Path",
            "phaseNum": "2",
            "order": 2,
            "summary": "Design a binary record format with length prefixes and a CRC32 checksum, append every change to a log, and learn what flush and fsync actually promise about your data reaching the disk.",
            "filePath": "/guides/projects/key-value-store-python/02-the-append-only-log.md"
          },
          {
            "slug": "03-replay-and-the-index",
            "title": "Replay and the Index - the Read Path",
            "phaseNum": "3",
            "order": 3,
            "summary": "Rebuild the store's state by replaying the log on startup, recover cleanly from a record that was half-written during a crash, and swap values-in-RAM for a real index of file offsets.",
            "filePath": "/guides/projects/key-value-store-python/03-replay-and-the-index.md"
          },
          {
            "slug": "04-compaction",
            "title": "Compaction - the Log Can't Grow Forever",
            "phaseNum": "4",
            "order": 4,
            "summary": "An append-only log accumulates every dead version of every key; compaction rewrites only the live records to a new file and swaps it in atomically, reclaiming the space without losing a byte.",
            "filePath": "/guides/projects/key-value-store-python/04-compaction.md"
          },
          {
            "slug": "05-a-tcp-server",
            "title": "A TCP Server - Speaking to Other Programs",
            "phaseNum": "5",
            "order": 5,
            "summary": "Put a SET/GET/DEL wire protocol in front of the engine with a threaded TCP server and a lock, so any program on the machine can use your database - and see why concurrent writers need serializing.",
            "filePath": "/guides/projects/key-value-store-python/05-a-tcp-server.md"
          },
          {
            "slug": "06-benchmarks-and-real-databases",
            "title": "Benchmarks, and What Redis Does Differently",
            "phaseNum": "6",
            "order": 6,
            "summary": "Measure your engine's real throughput, see the brutal price of fsync, and place your design honestly next to Redis, LevelDB, and SQLite - what each one changed and what it cost them.",
            "filePath": "/guides/projects/key-value-store-python/06-benchmarks-and-real-databases.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "working-as-a-developer",
    "name": "Working as a Developer",
    "icon": "ti-briefcase",
    "blurb": "Human side of the job - reviews, messy code, asking questions, on-call, and interviews.",
    "guides": [
      {
        "slug": "code-review-etiquette",
        "title": "Code Review Etiquette",
        "summary": "How to give and receive code review feedback without damaging the relationship: tone, phrasing, picking your battles, handling criticism without getting defensive, and the unwritten norms nobody explains.",
        "order": 1,
        "phases": [
          {
            "slug": "01-reviewing-without-being-a-jerk",
            "title": "Reviewing Someone Else's Code Without Being a Jerk",
            "phaseNum": "1",
            "order": 1,
            "summary": "Text reads harsher than you mean it. Phrase feedback as questions or observations instead of commands, and learn to tell a style nitpick apart from a real bug and an architecture concern.",
            "filePath": "/guides/working-as-a-developer/code-review-etiquette/01-reviewing-without-being-a-jerk.md"
          },
          {
            "slug": "02-receiving-feedback-without-defensiveness",
            "title": "Receiving Feedback Without Getting Defensive",
            "phaseNum": "2",
            "order": 2,
            "summary": "A comment on your PR isn't a comment on your competence. Learn the difference between healthy pushback and defensiveness, and what to do when you genuinely think the reviewer is wrong.",
            "filePath": "/guides/working-as-a-developer/code-review-etiquette/02-receiving-feedback-without-defensiveness.md"
          },
          {
            "slug": "03-the-etiquette-nobody-tells-you",
            "title": "The Etiquette Nobody Tells You",
            "phaseNum": "3",
            "order": 3,
            "summary": "Unwritten code review norms: reasonable response times, the real difference between approving with comments and blocking, and what LGTM culture gets wrong about actually reading the diff.",
            "filePath": "/guides/working-as-a-developer/code-review-etiquette/03-the-etiquette-nobody-tells-you.md"
          }
        ]
      },
      {
        "slug": "reading-legacy-code",
        "title": "Reading Legacy Code",
        "summary": "How to make sense of an unfamiliar, undocumented codebase without reading it top to bottom \u2014 and how to tell when it actually needs a rewrite.",
        "order": 2,
        "phases": [
          {
            "slug": "01-where-to-start",
            "title": "Where to Start When You Don't Understand Any of It",
            "phaseNum": "1",
            "order": 1,
            "summary": "Don't read a legacy codebase top to bottom. Pick one real entry point and follow it through, end to end.",
            "filePath": "/guides/working-as-a-developer/reading-legacy-code/01-where-to-start.md"
          },
          {
            "slug": "02-techniques-for-understanding",
            "title": "Techniques for Making the Unknown Known",
            "phaseNum": "2",
            "order": 2,
            "summary": "Use git blame as archaeology, write a safety-net test before changing anything, and use small refactors to build understanding by doing.",
            "filePath": "/guides/working-as-a-developer/reading-legacy-code/02-techniques-for-understanding.md"
          },
          {
            "slug": "03-when-to-rewrite",
            "title": "When (and When Not) to Rewrite",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why the urge to rewrite legacy code is usually wrong, how Chesterton's Fence keeps you from removing something load-bearing, and the rare cases a rewrite is the right call.",
            "filePath": "/guides/working-as-a-developer/reading-legacy-code/03-when-to-rewrite.md"
          }
        ]
      },
      {
        "slug": "asking-good-questions",
        "title": "Asking Good Questions",
        "summary": "How to ask questions at work that get fast, useful answers: being specific, showing your work, avoiding the XY problem, and picking the right channel for the moment.",
        "order": 3,
        "phases": [
          {
            "slug": "01-why-questions-get-ignored",
            "title": "Why Some Questions Get Answered Fast and Others Get Ignored",
            "phaseNum": "1",
            "order": 1,
            "summary": "What separates a question that gets a fast, useful answer from one that gets ignored: specificity, showing your work, and the XY problem.",
            "filePath": "/guides/working-as-a-developer/asking-good-questions/01-why-questions-get-ignored.md"
          },
          {
            "slug": "02-the-question-template",
            "title": "The Question Template That Actually Works",
            "phaseNum": "2",
            "order": 2,
            "summary": "A reusable template for asking developer questions - what you're trying to do, what you expected, what actually happened, what you tried, and a minimal reproduction - with a bad question rewritten using it.",
            "filePath": "/guides/working-as-a-developer/asking-good-questions/02-the-question-template.md"
          },
          {
            "slug": "03-async-vs-sync-reading-the-room",
            "title": "Async vs. Sync, and Reading the Room",
            "phaseNum": "3",
            "order": 3,
            "summary": "How to pick the right channel for a question - Slack, a ticket, a meeting, or walking over - how to respect focus time, and when to escalate past someone who hasn't answered.",
            "filePath": "/guides/working-as-a-developer/asking-good-questions/03-async-vs-sync-reading-the-room.md"
          }
        ]
      },
      {
        "slug": "your-first-on-call",
        "title": "Your First On-Call",
        "summary": "What it's actually like to carry the pager for the first time: getting set up before your shift starts, staying calm through the 3am page, and turning the aftermath into a blameless postmortem instead of a blame session.",
        "order": 4,
        "phases": [
          {
            "slug": "01-before-your-first-shift",
            "title": "Before Your First Shift",
            "phaseNum": "1",
            "order": 1,
            "summary": "What to verify before your first on-call rotation starts: alerts reach you reliably, you know where the runbooks live (and that missing ones are normal), and you know your escalation path.",
            "filePath": "/guides/working-as-a-developer/your-first-on-call/01-before-your-first-shift.md"
          },
          {
            "slug": "02-the-3am-page-a-calm-playbook",
            "title": "The 3am Page: A Calm Playbook",
            "phaseNum": "2",
            "order": 2,
            "summary": "How to stay calm when the pager goes off: triage before you try to fix anything, stop the bleeding before you root-cause, and know when to escalate instead of struggling alone.",
            "filePath": "/guides/working-as-a-developer/your-first-on-call/02-the-3am-page-a-calm-playbook.md"
          },
          {
            "slug": "03-after-the-fire-the-postmortem",
            "title": "After the Fire: the Postmortem",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why blameless postmortems beat blame-driven ones, why human error is rarely the real root cause, and how to write up an incident so the next on-call engineer benefits from your bad night.",
            "filePath": "/guides/working-as-a-developer/your-first-on-call/03-after-the-fire-the-postmortem.md"
          }
        ]
      },
      {
        "slug": "technical-interviews",
        "title": "Technical Interviews Without the Hazing",
        "summary": "What technical interviews are actually evaluating, how to survive the coding round without panicking, and how to handle system design and behavioral rounds - including what to ask them and how to think about an offer.",
        "order": 5,
        "phases": [
          {
            "slug": "01-what-interviews-are-testing-for",
            "title": "What Interviews Are Actually Testing For",
            "phaseNum": "1",
            "order": 1,
            "summary": "Interviewers are checking whether you can think out loud and reason about a problem, not whether you've memorized every algorithm - here's the real signal they're after and how to spot a good process from a bad one.",
            "filePath": "/guides/working-as-a-developer/technical-interviews/01-what-interviews-are-testing-for.md"
          },
          {
            "slug": "02-the-coding-round-without-the-panic",
            "title": "The Coding Round Without the Panic",
            "phaseNum": "2",
            "order": 2,
            "summary": "How to think out loud, ask clarifying questions before coding, admit you forgot the exact syntax without losing points, and recover when you get stuck mid-problem.",
            "filePath": "/guides/working-as-a-developer/technical-interviews/02-the-coding-round-without-the-panic.md"
          },
          {
            "slug": "03-system-design-and-the-human-round",
            "title": "System Design and the Human Round",
            "phaseNum": "3",
            "order": 3,
            "summary": "Why system design conversations and behavioral rounds are still evaluable skills, what to ask the interviewer about team structure and on-call, and an honest, non-scary look at negotiating an offer.",
            "filePath": "/guides/working-as-a-developer/technical-interviews/03-system-design-and-the-human-round.md"
          }
        ]
      }
    ]
  },
  {
    "slug": "practice",
    "name": "Practice",
    "icon": "ti-keyboard",
    "blurb": "Hands-on lessons in a coding playground - SQL, JavaScript, Python.",
    "guides": [
      {
        "slug": "practice-sql",
        "title": "SQL Practice",
        "summary": "Hands-on SQL lessons - write real queries against a live in-browser database and get checked instantly.",
        "order": 1,
        "phases": [
          {
            "slug": "01-select-columns",
            "title": "Select specific columns",
            "phaseNum": "1",
            "order": 1,
            "summary": "Pick exactly the columns you want instead of grabbing everything with SELECT *.",
            "filePath": "/guides/practice/practice-sql/01-select-columns.md"
          },
          {
            "slug": "02-filter-with-where",
            "title": "Filter rows with WHERE",
            "phaseNum": "2",
            "order": 2,
            "summary": "Return only the rows that match a condition using the WHERE clause.",
            "filePath": "/guides/practice/practice-sql/02-filter-with-where.md"
          },
          {
            "slug": "03-sort-and-limit",
            "title": "Sort and limit results",
            "phaseNum": "3",
            "order": 3,
            "summary": "Order query results with ORDER BY and cut them down to a fixed number with LIMIT.",
            "filePath": "/guides/practice/practice-sql/03-sort-and-limit.md"
          },
          {
            "slug": "04-count-and-aggregates",
            "title": "Count and summarize",
            "phaseNum": "4",
            "order": 4,
            "summary": "Use aggregate functions like COUNT and MAX to summarize a whole table into one row.",
            "filePath": "/guides/practice/practice-sql/04-count-and-aggregates.md"
          },
          {
            "slug": "05-group-rows",
            "title": "Group rows together",
            "phaseNum": "5",
            "order": 5,
            "summary": "Use GROUP BY to run an aggregate function separately for each distinct value in a column.",
            "filePath": "/guides/practice/practice-sql/05-group-rows.md"
          },
          {
            "slug": "06-filter-groups-with-having",
            "title": "Filter groups with HAVING",
            "phaseNum": "6",
            "order": 6,
            "summary": "Use HAVING to filter groups after aggregation, when WHERE can't see the aggregate yet.",
            "filePath": "/guides/practice/practice-sql/06-filter-groups-with-having.md"
          },
          {
            "slug": "07-join-tables",
            "title": "Combine tables with JOIN",
            "phaseNum": "7",
            "order": 7,
            "summary": "Use JOIN to pull matching rows from two related tables into one result.",
            "filePath": "/guides/practice/practice-sql/07-join-tables.md"
          },
          {
            "slug": "08-capstone-total-spent",
            "title": "Capstone: total spent per customer",
            "phaseNum": "8",
            "order": 8,
            "summary": "Combine JOIN, GROUP BY, an aggregate, and ORDER BY in one practical query.",
            "filePath": "/guides/practice/practice-sql/08-capstone-total-spent.md"
          },
          {
            "slug": "09-subqueries",
            "title": "Subqueries: a query inside a query",
            "phaseNum": "9",
            "order": 9,
            "summary": "Use a scalar subquery as a value inside WHERE, comparing each row against an aggregate computed over the whole table.",
            "filePath": "/guides/practice/practice-sql/09-subqueries.md"
          },
          {
            "slug": "10-window-functions",
            "title": "Rank rows with a window function",
            "phaseNum": "10",
            "order": 10,
            "summary": "Use RANK() OVER (ORDER BY ...) to compute a rank per row without collapsing rows the way GROUP BY does.",
            "filePath": "/guides/practice/practice-sql/10-window-functions.md"
          },
          {
            "slug": "11-nulls-and-duplicates",
            "title": "Messy data: NULLs and duplicate names",
            "phaseNum": "11",
            "order": 11,
            "summary": "Use COALESCE to show a fallback value instead of NULL, and watch out for the classic NULL comparison gotcha.",
            "filePath": "/guides/practice/practice-sql/11-nulls-and-duplicates.md"
          },
          {
            "slug": "12-transactions",
            "title": "Transactions: all or nothing",
            "phaseNum": "12",
            "order": 12,
            "summary": "Wrap two related UPDATEs in BEGIN and COMMIT so a balance transfer happens atomically, not as two independent writes.",
            "filePath": "/guides/practice/practice-sql/12-transactions.md"
          },
          {
            "slug": "13-capstone-rank-customers",
            "title": "Capstone: rank customers, gaps included",
            "phaseNum": "13",
            "order": 13,
            "summary": "Combine LEFT JOIN, GROUP BY, COALESCE, and a window function - the advanced version of the total-spent capstone, including customers who've never ordered anything.",
            "filePath": "/guides/practice/practice-sql/13-capstone-rank-customers.md"
          },
          {
            "slug": "14-many-to-many-with-a-junction-table",
            "title": "Many-to-many: joining through a junction table",
            "phaseNum": "14",
            "order": 14,
            "summary": "Chain two JOINs through a junction table to answer a many-to-many question, like which courses each student is enrolled in.",
            "filePath": "/guides/practice/practice-sql/14-many-to-many-with-a-junction-table.md"
          },
          {
            "slug": "15-cte-with-clause",
            "title": "CTEs: naming a subquery with WITH",
            "phaseNum": "15",
            "order": 15,
            "summary": "Rewrite an inline subquery as a named CTE using WITH ... AS (...), the same computation with a name you can read.",
            "filePath": "/guides/practice/practice-sql/15-cte-with-clause.md"
          },
          {
            "slug": "16-case-expressions",
            "title": "CASE: bucket rows into categories",
            "phaseNum": "16",
            "order": 16,
            "summary": "Use a CASE expression to turn a raw column value into a labeled category, right inside SELECT.",
            "filePath": "/guides/practice/practice-sql/16-case-expressions.md"
          },
          {
            "slug": "17-union",
            "title": "UNION: combining two result sets",
            "phaseNum": "17",
            "order": 17,
            "summary": "Stack two SELECTs into one result with UNION, and see how it differs from UNION ALL - deduplicated versus every row kept.",
            "filePath": "/guides/practice/practice-sql/17-union.md"
          },
          {
            "slug": "18-alter-table",
            "title": "ALTER TABLE: changing a table's shape",
            "phaseNum": "18",
            "order": 18,
            "summary": "Add a column to an existing table with ALTER TABLE, then confirm the change by inspecting the table's own schema with PRAGMA table_info.",
            "filePath": "/guides/practice/practice-sql/18-alter-table.md"
          },
          {
            "slug": "19-self-join",
            "title": "Self-join: a table joined to itself",
            "phaseNum": "19",
            "order": 19,
            "summary": "Join a table to itself with two aliases to look up an employee's manager, who's stored as just another row in the same table.",
            "filePath": "/guides/practice/practice-sql/19-self-join.md"
          }
        ]
      },
      {
        "slug": "practice-javascript",
        "title": "JavaScript Practice",
        "summary": "Hands-on JavaScript lessons - write real functions, run them instantly, and get checked by real tests.",
        "order": 2,
        "phases": [
          {
            "slug": "01-variables-and-expressions",
            "title": "Variables and expressions",
            "phaseNum": "1",
            "order": 1,
            "summary": "Declare variables with const, then combine them into a new value with an expression.",
            "filePath": "/guides/practice/practice-javascript/01-variables-and-expressions.md"
          },
          {
            "slug": "02-functions",
            "title": "Functions",
            "phaseNum": "2",
            "order": 2,
            "summary": "Wrap reusable logic in a function that takes parameters and returns a value.",
            "filePath": "/guides/practice/practice-javascript/02-functions.md"
          },
          {
            "slug": "03-conditionals",
            "title": "Conditionals",
            "phaseNum": "3",
            "order": 3,
            "summary": "Branch on a condition with if/else if/else and return different values for different cases.",
            "filePath": "/guides/practice/practice-javascript/03-conditionals.md"
          },
          {
            "slug": "04-arrays-map-filter",
            "title": "Arrays: map, filter, and reduce",
            "phaseNum": "4",
            "order": 4,
            "summary": "Transform an array with map, narrow it with filter, and collapse it to one value with reduce.",
            "filePath": "/guides/practice/practice-javascript/04-arrays-map-filter.md"
          },
          {
            "slug": "05-objects",
            "title": "Objects",
            "phaseNum": "5",
            "order": 5,
            "summary": "Group related values into an object, then read them back with dot notation and template literals.",
            "filePath": "/guides/practice/practice-javascript/05-objects.md"
          },
          {
            "slug": "06-closures",
            "title": "Closures",
            "phaseNum": "6",
            "order": 6,
            "summary": "Write a factory function that returns private state no outside code can touch directly - the everyday job a closure does.",
            "filePath": "/guides/practice/practice-javascript/06-closures.md"
          },
          {
            "slug": "07-classes-and-inheritance",
            "title": "Classes and inheritance",
            "phaseNum": "7",
            "order": 7,
            "summary": "Write a class with a constructor and a method, then extend it so a subclass inherits and overrides behavior.",
            "filePath": "/guides/practice/practice-javascript/07-classes-and-inheritance.md"
          },
          {
            "slug": "08-fix-the-bug",
            "title": "Fix the bug: read the stack trace",
            "phaseNum": "8",
            "order": 8,
            "summary": "The code below throws the moment you run it - read the real error message and stack trace to find the typo and fix it.",
            "filePath": "/guides/practice/practice-javascript/08-fix-the-bug.md"
          },
          {
            "slug": "09-curry-and-partial-application",
            "title": "Curry and partial application",
            "phaseNum": "9",
            "order": 9,
            "summary": "Write a function that works two ways - called with both arguments at once, or with one argument now and the second later.",
            "filePath": "/guides/practice/practice-javascript/09-curry-and-partial-application.md"
          },
          {
            "slug": "10-array-set-operations",
            "title": "Array set operations",
            "phaseNum": "10",
            "order": 10,
            "summary": "Find the items unique to one array with filter + includes, then remove duplicates from an array with a Set.",
            "filePath": "/guides/practice/practice-javascript/10-array-set-operations.md"
          },
          {
            "slug": "11-object-array-search",
            "title": "Object + array combined search",
            "phaseNum": "11",
            "order": 11,
            "summary": "Filter an array of objects by every key/value pair in a criteria object, combining array methods with property access.",
            "filePath": "/guides/practice/practice-javascript/11-object-array-search.md"
          },
          {
            "slug": "12-roman-numeral-converter",
            "title": "Roman numeral converter",
            "phaseNum": "12",
            "order": 12,
            "summary": "Convert a number to a roman numeral with a lookup table and greedy subtraction - including the subtractive cases like IV and XC.",
            "filePath": "/guides/practice/practice-javascript/12-roman-numeral-converter.md"
          },
          {
            "slug": "13-caesar-cipher",
            "title": "Caesar cipher",
            "phaseNum": "13",
            "order": 13,
            "summary": "Shift every letter in a string forward by a fixed amount, wrapping around the alphabet and leaving everything else untouched.",
            "filePath": "/guides/practice/practice-javascript/13-caesar-cipher.md"
          },
          {
            "slug": "14-smallest-common-multiple",
            "title": "Smallest common multiple",
            "phaseNum": "14",
            "order": 14,
            "summary": "Find the least common multiple of every integer in a range, built from a small recursive gcd() helper.",
            "filePath": "/guides/practice/practice-javascript/14-smallest-common-multiple.md"
          },
          {
            "slug": "15-capstone-shopping-cart",
            "title": "Capstone: shopping cart total",
            "phaseNum": "15",
            "order": 15,
            "summary": "Combine functions, arrays, and objects to total a shopping cart and flag big orders.",
            "filePath": "/guides/practice/practice-javascript/15-capstone-shopping-cart.md"
          }
        ]
      },
      {
        "slug": "practice-python",
        "title": "Python Practice",
        "summary": "Hands-on Python lessons - write real code, run it instantly, and get checked by real tests.",
        "order": 3,
        "phases": [
          {
            "slug": "01-print-and-variables",
            "title": "Print and variables",
            "phaseNum": "1",
            "order": 1,
            "summary": "Store values in variables and build a message out of them with an f-string.",
            "filePath": "/guides/practice/practice-python/01-print-and-variables.md"
          },
          {
            "slug": "02-conditionals",
            "title": "Conditionals",
            "phaseNum": "2",
            "order": 2,
            "summary": "Branch on a condition with if/elif/else and return different values for different cases.",
            "filePath": "/guides/practice/practice-python/02-conditionals.md"
          },
          {
            "slug": "03-loops",
            "title": "Loops",
            "phaseNum": "3",
            "order": 3,
            "summary": "Repeat work with a for loop and range(), building up a result as you go.",
            "filePath": "/guides/practice/practice-python/03-loops.md"
          },
          {
            "slug": "04-lists",
            "title": "Lists",
            "phaseNum": "4",
            "order": 4,
            "summary": "Filter a list down with a list comprehension instead of a manual loop and append.",
            "filePath": "/guides/practice/practice-python/04-lists.md"
          },
          {
            "slug": "05-dictionaries",
            "title": "Dictionaries",
            "phaseNum": "5",
            "order": 5,
            "summary": "Look up values by key in a dict, total them with a generator expression, and fall back to a default with .get() when a key might be missing.",
            "filePath": "/guides/practice/practice-python/05-dictionaries.md"
          },
          {
            "slug": "06-error-handling",
            "title": "Error handling",
            "phaseNum": "6",
            "order": 6,
            "summary": "Raise a specific exception with a clear message, then catch it with try/except instead of letting it crash the program.",
            "filePath": "/guides/practice/practice-python/06-error-handling.md"
          },
          {
            "slug": "07-generators",
            "title": "Generators",
            "phaseNum": "7",
            "order": 7,
            "summary": "Write a generator function with yield that produces values one at a time instead of building a whole list up front.",
            "filePath": "/guides/practice/practice-python/07-generators.md"
          },
          {
            "slug": "08-fix-the-bug",
            "title": "Fix the bug: read the traceback",
            "phaseNum": "8",
            "order": 8,
            "summary": "The code below throws the moment you run it - read the real traceback to find the off-by-one bug and fix it.",
            "filePath": "/guides/practice/practice-python/08-fix-the-bug.md"
          },
          {
            "slug": "09-classes-and-inheritance",
            "title": "Classes and inheritance",
            "phaseNum": "9",
            "order": 9,
            "summary": "Write a base class with a constructor and a method, then a subclass that inherits from it and overrides that method.",
            "filePath": "/guides/practice/practice-python/09-classes-and-inheritance.md"
          },
          {
            "slug": "10-list-comprehension-rewrite",
            "title": "List comprehension rewrite",
            "phaseNum": "10",
            "order": 10,
            "summary": "Take a working for-loop that builds a list and rewrite it as a one-line list comprehension producing the identical result.",
            "filePath": "/guides/practice/practice-python/10-list-comprehension-rewrite.md"
          },
          {
            "slug": "11-recursion-kata",
            "title": "Recursion kata: factorial and Fibonacci",
            "phaseNum": "11",
            "order": 11,
            "summary": "Write factorial(n) and fibonacci(n) recursively - each one calling itself with a smaller input until it reaches a base case.",
            "filePath": "/guides/practice/practice-python/11-recursion-kata.md"
          },
          {
            "slug": "12-stats-calculator",
            "title": "Stats calculator: mean and variance",
            "phaseNum": "12",
            "order": 12,
            "summary": "Write mean(nums) and variance(nums) - the population variance - using nothing but sum, len, and a generator expression.",
            "filePath": "/guides/practice/practice-python/12-stats-calculator.md"
          },
          {
            "slug": "13-string-alignment-formatter",
            "title": "String-alignment formatter",
            "phaseNum": "13",
            "order": 13,
            "summary": "Given a list of (a, op, b) arithmetic problems, build a multi-line string with each problem's operands right-aligned over a dashed line.",
            "filePath": "/guides/practice/practice-python/13-string-alignment-formatter.md"
          },
          {
            "slug": "14-time-calculator",
            "title": "Time calculator",
            "phaseNum": "14",
            "order": 14,
            "summary": "Add a duration in minutes to a start time, wrapping correctly at 24 hours and reporting how many days later the end time lands.",
            "filePath": "/guides/practice/practice-python/14-time-calculator.md"
          },
          {
            "slug": "15-probability-calculator",
            "title": "Probability calculator",
            "phaseNum": "15",
            "order": 15,
            "summary": "Simulate drawing colored balls from a bag with replacement, using a provided deterministic random-number generator so the result is exactly reproducible.",
            "filePath": "/guides/practice/practice-python/15-probability-calculator.md"
          },
          {
            "slug": "16-capstone-word-counter",
            "title": "Capstone: word counter",
            "phaseNum": "16",
            "order": 16,
            "summary": "Combine a loop, a dict, and string methods to count word frequency in a piece of text.",
            "filePath": "/guides/practice/practice-python/16-capstone-word-counter.md"
          }
        ]
      },
      {
        "slug": "practice-regex",
        "title": "Regex Practice",
        "summary": "Hands-on regular-expression lessons - write real patterns, run them instantly, and get checked by real tests.",
        "order": 4,
        "phases": [
          {
            "slug": "01-literal-matching-and-test",
            "title": "Literal matching and .test()",
            "phaseNum": "1",
            "order": 1,
            "summary": "Write your first regex literal and ask it a yes/no question with .test().",
            "filePath": "/guides/practice/practice-regex/01-literal-matching-and-test.md"
          },
          {
            "slug": "02-character-classes",
            "title": "Character classes",
            "phaseNum": "2",
            "order": 2,
            "summary": "Match a kind of character instead of one exact character, with \\\\d and your own [...] class.",
            "filePath": "/guides/practice/practice-regex/02-character-classes.md"
          },
          {
            "slug": "03-quantifiers",
            "title": "Quantifiers",
            "phaseNum": "3",
            "order": 3,
            "summary": "Say how many with + and {n,m}, and pull the actual matched text out with .match().",
            "filePath": "/guides/practice/practice-regex/03-quantifiers.md"
          },
          {
            "slug": "04-anchors-and-boundaries",
            "title": "Anchors and boundaries",
            "phaseNum": "4",
            "order": 4,
            "summary": "Pin a match to a position instead of a character, with ^ $ for the whole string and \\\\b for a whole word.",
            "filePath": "/guides/practice/practice-regex/04-anchors-and-boundaries.md"
          },
          {
            "slug": "05-groups-and-capture",
            "title": "Groups and capture",
            "phaseNum": "5",
            "order": 5,
            "summary": "Wrap part of a pattern in () to capture it, then pull it back out by index or by name.",
            "filePath": "/guides/practice/practice-regex/05-groups-and-capture.md"
          },
          {
            "slug": "06-practical-validation",
            "title": "Practical validation",
            "phaseNum": "6",
            "order": 6,
            "summary": "Combine character classes, quantifiers, and anchors into one real-world shape check: a username.",
            "filePath": "/guides/practice/practice-regex/06-practical-validation.md"
          },
          {
            "slug": "07-capstone-extracting-prices",
            "title": "Capstone: extracting prices",
            "phaseNum": "7",
            "order": 7,
            "summary": "Pull every dollar amount out of a messy paragraph with a global regex and str.match().",
            "filePath": "/guides/practice/practice-regex/07-capstone-extracting-prices.md"
          },
          {
            "slug": "08-capstone-normalizing-usernames",
            "title": "Capstone: normalizing usernames",
            "phaseNum": "8",
            "order": 8,
            "summary": "Filter a list down to valid usernames with regex, then normalize what's left with .toLowerCase().",
            "filePath": "/guides/practice/practice-regex/08-capstone-normalizing-usernames.md"
          },
          {
            "slug": "09-lookahead",
            "title": "Lookahead",
            "phaseNum": "9",
            "order": 9,
            "summary": "Check what comes next with (?=...) without including it in the match - a positive lookahead.",
            "filePath": "/guides/practice/practice-regex/09-lookahead.md"
          },
          {
            "slug": "10-backreferences",
            "title": "Backreferences",
            "phaseNum": "10",
            "order": 10,
            "summary": "Reuse a captured group later in the SAME pattern with \\\\1, to require two pieces to match each other.",
            "filePath": "/guides/practice/practice-regex/10-backreferences.md"
          },
          {
            "slug": "11-greedy-vs-lazy-quantifiers",
            "title": "Greedy vs. lazy quantifiers",
            "phaseNum": "11",
            "order": 11,
            "summary": "The same quantifier grabs a different amount of text depending on whether it's greedy (.+) or lazy (.+?).",
            "filePath": "/guides/practice/practice-regex/11-greedy-vs-lazy-quantifiers.md"
          },
          {
            "slug": "12-global-flag-find-and-replace",
            "title": "Global flag: find and replace all",
            "phaseNum": "12",
            "order": 12,
            "summary": "Add the g flag to .replace() to swap out EVERY match in a string, not just the first.",
            "filePath": "/guides/practice/practice-regex/12-global-flag-find-and-replace.md"
          },
          {
            "slug": "13-capstone-reformatting-names",
            "title": "Capstone: reformatting names",
            "phaseNum": "13",
            "order": 13,
            "summary": "Use capture groups and $1/$2 in a replacement string to swap \\\"Last, First\\\" names into \\\"First Last\\\".",
            "filePath": "/guides/practice/practice-regex/13-capstone-reformatting-names.md"
          }
        ]
      },
      {
        "slug": "practice-typescript",
        "title": "TypeScript Practice",
        "summary": "Hands-on TypeScript lessons - add types to real JavaScript, run them instantly, and get checked by real tests.",
        "order": 5,
        "phases": [
          {
            "slug": "01-type-annotations",
            "title": "Type annotations",
            "phaseNum": "1",
            "order": 1,
            "summary": "Add a type to a variable or a function's parameters and return value with a colon.",
            "filePath": "/guides/practice/practice-typescript/01-type-annotations.md"
          },
          {
            "slug": "02-interfaces",
            "title": "Interfaces",
            "phaseNum": "2",
            "order": 2,
            "summary": "Describe the shape of an object with an interface, then write a function that expects it.",
            "filePath": "/guides/practice/practice-typescript/02-interfaces.md"
          },
          {
            "slug": "03-function-types-and-defaults",
            "title": "Function types and default params",
            "phaseNum": "3",
            "order": 3,
            "summary": "Type a function as a value, and give a parameter a default so it's optional to call with.",
            "filePath": "/guides/practice/practice-typescript/03-function-types-and-defaults.md"
          },
          {
            "slug": "04-union-types-and-narrowing",
            "title": "Union types and narrowing",
            "phaseNum": "4",
            "order": 4,
            "summary": "Type a value as one of several types with |, then use typeof to narrow it before acting.",
            "filePath": "/guides/practice/practice-typescript/04-union-types-and-narrowing.md"
          },
          {
            "slug": "05-generics",
            "title": "Generics",
            "phaseNum": "5",
            "order": 5,
            "summary": "Write one function that works with any type, using a generic type parameter.",
            "filePath": "/guides/practice/practice-typescript/05-generics.md"
          },
          {
            "slug": "06-capstone-typed-inventory",
            "title": "Capstone: typed inventory lookup",
            "phaseNum": "6",
            "order": 6,
            "summary": "Combine an interface, a union return type, and a generic helper in one small program.",
            "filePath": "/guides/practice/practice-typescript/06-capstone-typed-inventory.md"
          }
        ]
      },
      {
        "slug": "practice-git",
        "title": "Git Practice",
        "summary": "Hands-on Git lessons - type real git commands into an in-browser terminal, against a real repository, and get checked instantly.",
        "order": 6,
        "phases": [
          {
            "slug": "01-your-first-commit",
            "title": "Your first commit",
            "phaseNum": "1",
            "order": 1,
            "summary": "Stage a file and commit it - the two moves at the heart of everything Git does.",
            "filePath": "/guides/practice/practice-git/01-your-first-commit.md"
          },
          {
            "slug": "02-a-second-commit-and-log",
            "title": "A second commit, and git log",
            "phaseNum": "2",
            "order": 2,
            "summary": "Add a second file to a repo that already has history, then read that history back with git log.",
            "filePath": "/guides/practice/practice-git/02-a-second-commit-and-log.md"
          },
          {
            "slug": "03-branch-and-checkout",
            "title": "Branch, then checkout",
            "phaseNum": "3",
            "order": 3,
            "summary": "Create a branch, switch onto it, and commit there without touching main.",
            "filePath": "/guides/practice/practice-git/03-branch-and-checkout.md"
          },
          {
            "slug": "04-merging-a-branch",
            "title": "Merging a branch back in",
            "phaseNum": "4",
            "order": 4,
            "summary": "Do the work on a branch, then bring it back into main with git merge.",
            "filePath": "/guides/practice/practice-git/04-merging-a-branch.md"
          },
          {
            "slug": "05-reading-git-status",
            "title": "Reading git status",
            "phaseNum": "5",
            "order": 5,
            "summary": "git status is your dashboard - learn to read what it's telling you about a changed-but-uncommitted file.",
            "filePath": "/guides/practice/practice-git/05-reading-git-status.md"
          },
          {
            "slug": "06-stashing-changes",
            "title": "Stashing changes with git stash",
            "phaseNum": "6",
            "order": 6,
            "summary": "Tuck away uncommitted work without committing it, get a clean tree, then bring it back with git stash pop.",
            "filePath": "/guides/practice/practice-git/06-stashing-changes.md"
          },
          {
            "slug": "07-ignoring-files-with-gitignore",
            "title": "Ignoring files with .gitignore",
            "phaseNum": "7",
            "order": 7,
            "summary": "A detective lesson - read git status and confirm a gitignored file never shows up as something to commit.",
            "filePath": "/guides/practice/practice-git/07-ignoring-files-with-gitignore.md"
          },
          {
            "slug": "08-undoing-a-commit-with-revert",
            "title": "Undoing a commit with git revert",
            "phaseNum": "8",
            "order": 8,
            "summary": "Undo a bad commit the safe way - git revert adds a new commit that cancels it out instead of rewriting history.",
            "filePath": "/guides/practice/practice-git/08-undoing-a-commit-with-revert.md"
          }
        ]
      },
      {
        "slug": "practice-postgres",
        "title": "Postgres Practice",
        "summary": "Hands-on lessons on the features real Postgres has beyond standard SQL - JSONB, arrays, RETURNING, UUID keys, and upsert - against a real Postgres running in your browser.",
        "order": 7,
        "phases": [
          {
            "slug": "01-jsonb-read-fields",
            "title": "JSONB: read fields out of a JSON column",
            "phaseNum": "1",
            "order": 1,
            "summary": "Use the ->> operator to pull a field out of a JSONB column as text.",
            "filePath": "/guides/practice/practice-postgres/01-jsonb-read-fields.md"
          },
          {
            "slug": "02-jsonb-containment",
            "title": "JSONB: filter rows with @>",
            "phaseNum": "2",
            "order": 2,
            "summary": "Use the @> containment operator to filter rows by a shape inside a JSONB column, without extracting each field first.",
            "filePath": "/guides/practice/practice-postgres/02-jsonb-containment.md"
          },
          {
            "slug": "03-arrays-any",
            "title": "Arrays: a column that holds a list",
            "phaseNum": "3",
            "order": 3,
            "summary": "Use TEXT[] array columns and the = ANY(array) operator to check whether a value is one of several stored directly in a row.",
            "filePath": "/guides/practice/practice-postgres/03-arrays-any.md"
          },
          {
            "slug": "04-returning-on-insert",
            "title": "RETURNING: get the row back from an INSERT",
            "phaseNum": "4",
            "order": 4,
            "summary": "Use RETURNING on an INSERT to get the inserted row's generated columns back in the same statement, instead of a separate SELECT.",
            "filePath": "/guides/practice/practice-postgres/04-returning-on-insert.md"
          },
          {
            "slug": "05-uuid-primary-keys",
            "title": "UUID primary keys with gen_random_uuid()",
            "phaseNum": "5",
            "order": 5,
            "summary": "Use a UUID column with a gen_random_uuid() default instead of an auto-incrementing integer primary key.",
            "filePath": "/guides/practice/practice-postgres/05-uuid-primary-keys.md"
          },
          {
            "slug": "06-upsert-on-conflict",
            "title": "Upsert: ON CONFLICT DO UPDATE",
            "phaseNum": "6",
            "order": 6,
            "summary": "Use INSERT ... ON CONFLICT DO UPDATE to insert a row or update it in place when it already exists, in a single statement.",
            "filePath": "/guides/practice/practice-postgres/06-upsert-on-conflict.md"
          }
        ]
      },
      {
        "slug": "practice-webassembly",
        "title": "WebAssembly Text Practice",
        "summary": "Hands-on WebAssembly Text (WAT) lessons - write the actual text format browsers compile and run, and get checked instantly against real compiled output.",
        "order": 8,
        "phases": [
          {
            "slug": "01-a-function-that-returns-a-constant",
            "title": "A function that returns a constant",
            "phaseNum": "1",
            "order": 1,
            "summary": "Write your first WebAssembly Text function - export a value and meet the module/func/export syntax that every WAT program is built from.",
            "filePath": "/guides/practice/practice-webassembly/01-a-function-that-returns-a-constant.md"
          },
          {
            "slug": "02-arithmetic-with-parameters",
            "title": "Arithmetic with parameters",
            "phaseNum": "2",
            "order": 2,
            "summary": "Add parameters to a WAT function and combine them with i32.add - your first real look at the stack-based execution model.",
            "filePath": "/guides/practice/practice-webassembly/02-arithmetic-with-parameters.md"
          },
          {
            "slug": "03-a-loop-summing-numbers",
            "title": "A local variable and a loop",
            "phaseNum": "3",
            "order": 3,
            "summary": "Declare a mutable local, then loop with loop/br_if to sum integers from 1 to N - WAT has no for-loop keyword, so you build one from a block, a loop, and a conditional branch.",
            "filePath": "/guides/practice/practice-webassembly/03-a-loop-summing-numbers.md"
          },
          {
            "slug": "04-comparison-and-branching",
            "title": "Comparison and branching",
            "phaseNum": "4",
            "order": 4,
            "summary": "Use i32.gt_s and if/else to pick between two values - WAT's if is an expression that can itself return a value, not just a control-flow statement.",
            "filePath": "/guides/practice/practice-webassembly/04-comparison-and-branching.md"
          },
          {
            "slug": "05-capstone-max-of-four",
            "title": "Capstone: max of four values",
            "phaseNum": "5",
            "order": 5,
            "summary": "Combine everything so far - write a helper function and call it from another function - to find the largest of four fixed parameters, since WAT has no beginner-friendly array type to loop over.",
            "filePath": "/guides/practice/practice-webassembly/05-capstone-max-of-four.md"
          }
        ]
      },
      {
        "slug": "practice-math",
        "title": "Math Practice",
        "summary": "Hands-on arithmetic lessons - type a formula, run it, and get checked instantly. Order of operations, percentages, averages, and compound interest.",
        "order": 9,
        "phases": [
          {
            "slug": "01-order-of-operations",
            "title": "Order of operations",
            "phaseNum": "1",
            "order": 1,
            "summary": "Evaluate a mixed expression the way a calculator does: exponents before multiplication and division, then addition and subtraction, left to right.",
            "filePath": "/guides/practice/practice-math/01-order-of-operations.md"
          },
          {
            "slug": "02-percentage-of-a-number",
            "title": "Percentage of a number",
            "phaseNum": "2",
            "order": 2,
            "summary": "Find a percentage of a number by converting the percent to a decimal and multiplying.",
            "filePath": "/guides/practice/practice-math/02-percentage-of-a-number.md"
          },
          {
            "slug": "03-discount-price",
            "title": "Discount price",
            "phaseNum": "3",
            "order": 3,
            "summary": "Combine percentage-of with subtraction to find a sale price after a percent-off discount.",
            "filePath": "/guides/practice/practice-math/03-discount-price.md"
          },
          {
            "slug": "04-average-of-a-list",
            "title": "Average of a list",
            "phaseNum": "4",
            "order": 4,
            "summary": "Compute a mean by summing a set of values and dividing by how many there are.",
            "filePath": "/guides/practice/practice-math/04-average-of-a-list.md"
          },
          {
            "slug": "05-compound-interest",
            "title": "Compound interest (capstone)",
            "phaseNum": "5",
            "order": 5,
            "summary": "Put order of operations, percentages, and exponents together in the real formula banks use to grow a balance over time.",
            "filePath": "/guides/practice/practice-math/05-compound-interest.md"
          }
        ]
      },
      {
        "slug": "practice-physics",
        "title": "Physics Practice",
        "summary": "Hands-on physics lessons - plug real numbers into the formulas from the Physics guides (force, speed, free fall, momentum, kinetic energy) and get checked instantly.",
        "order": 10,
        "phases": [
          {
            "slug": "01-newtons-second-law",
            "title": "Newton's second law",
            "phaseNum": "1",
            "order": 1,
            "summary": "Use F = m x a to find the net force needed to give an object a given acceleration.",
            "filePath": "/guides/practice/practice-physics/01-newtons-second-law.md"
          },
          {
            "slug": "02-average-speed",
            "title": "Average speed",
            "phaseNum": "2",
            "order": 2,
            "summary": "Use speed = distance / time, the same worked example from the units guide, with your own numbers.",
            "filePath": "/guides/practice/practice-physics/02-average-speed.md"
          },
          {
            "slug": "03-free-fall-distance",
            "title": "Free-fall distance",
            "phaseNum": "3",
            "order": 3,
            "summary": "Use d = 0.5 x g x t^2 - the falling-stone formula from the units guide's dimensional-analysis example - to find how far something falls.",
            "filePath": "/guides/practice/practice-physics/03-free-fall-distance.md"
          },
          {
            "slug": "04-momentum",
            "title": "Momentum",
            "phaseNum": "4",
            "order": 4,
            "summary": "Use p = m x v - how much motion something has, counting both mass and speed.",
            "filePath": "/guides/practice/practice-physics/04-momentum.md"
          },
          {
            "slug": "05-kinetic-energy",
            "title": "Kinetic energy (capstone)",
            "phaseNum": "5",
            "order": 5,
            "summary": "Use KE = 0.5 x m x v^2, and see for yourself why doubling speed quadruples kinetic energy.",
            "filePath": "/guides/practice/practice-physics/05-kinetic-energy.md"
          }
        ]
      }
    ]
  }
];
