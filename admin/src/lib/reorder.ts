export const swapByIndex = <T>(list: T[], indexA: number, indexB: number): T[] => {
  const next = [...list];
  const temp = next[indexA];
  next[indexA] = next[indexB];
  next[indexB] = temp;
  return next;
};
