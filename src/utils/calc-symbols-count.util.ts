export const calcSymbolsCount = (
  fileContent: string,
  symbol: string
): number => {
  return Math.max(fileContent.split(symbol).length - 1, 0);
};
