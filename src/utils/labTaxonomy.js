export const FEATURED_LAB_TAGS = [
  "ML", "DL", "GenAI", "Python", "Statistics", "Probability", "EDA",
  "Evaluation", "RAG", "Agents", "NLP", "Computer Vision", "DevOps",
];

const CATEGORY_TAGS = [
  [/python/i, ["Python"]],
  [/deep learning/i, ["DL", "ML"]],
  [/machine learning/i, ["ML"]],
  [/statistics|experiment/i, ["Statistics"]],
  [/rag/i, ["RAG", "GenAI"]],
  [/agent/i, ["Agents", "GenAI"]],
  [/nlp/i, ["NLP", "ML"]],
  [/computer vision/i, ["Computer Vision", "DL"]],
  [/evaluation|model evaluation/i, ["Evaluation", "ML"]],
  [/production engineering/i, ["DevOps"]],
  [/safety|optimization|strategy/i, ["GenAI"]],
  [/eda|data tools/i, ["EDA"]],
];

const TITLE_TAGS = [
  [/prompt|generation|diffusion|lora|multimodal|hallucination|guardrail|context window/i, ["GenAI"]],
  [/retriev|rerank|chunk|citation|semantic cache|graphrag/i, ["RAG", "GenAI"]],
  [/agent|tool calling|mcp|memory policy|handoff/i, ["Agents", "GenAI"]],
  [/regression|tree|knn|cluster|pca|svm|ensemble|feature|anomaly|drift/i, ["ML"]],
  [/neural|network|tensor|backprop|activation|optimizer|cnn|rnn|lstm|attention|autoencoder/i, ["DL"]],
  [/probability|bayes|hypothesis|confidence|sampling|monte carlo|correlation/i, ["Statistics", "Probability"]],
  [/precision|recall|f1|roc|auc|calibration|evaluation|test/i, ["Evaluation"]],
];

export function withLabTags(lab) {
  const tags = new Set(lab.tags || []);
  const category = lab.category || "Other";
  const source = `${category} ${lab.title || ""}`;
  CATEGORY_TAGS.forEach(([pattern, inferred]) => {
    if (pattern.test(category)) inferred.forEach((tag) => tags.add(tag));
  });
  TITLE_TAGS.forEach(([pattern, inferred]) => {
    if (pattern.test(source)) inferred.forEach((tag) => tags.add(tag));
  });
  if (!tags.size) tags.add(category);
  return { ...lab, tags: [...tags] };
}
