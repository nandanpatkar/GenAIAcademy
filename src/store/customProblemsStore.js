// Minimal store implementation to satisfy getProblemById lookup
// In a full implementation, this would be a Zustand store
export const useCustomProblemsStore = {
  getState: () => ({
    problems: [] // Currently empty, can be extended to support localStorage
  })
};
