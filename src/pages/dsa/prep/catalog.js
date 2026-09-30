// The Code Lab catalog, indexed once for every prep section.
import catalog from "../../../data/codelab/catalog.json";

export const problems = catalog.problems || [];
export const categories = catalog.categories || [];
export const problemBySlug = new Map(problems.map((problem) => [problem.slug, problem]));
export const judgeableProblems = problems.filter((problem) => problem.judgeAvailable);
