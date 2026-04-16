export const textToArray = (value: string): string[] =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const arrayToText = (value: string[] | null | undefined): string =>
  (value || []).join('\n');

export const commaTextToArray = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const arrayToCommaText = (value: string[] | null | undefined): string =>
  (value || []).join(', ');
