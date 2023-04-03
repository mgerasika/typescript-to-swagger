export const indexOf = (
  fileContent: string,
  symbol: string,
  index: number
): number => {
  let i = 0;
  let tmp = fileContent;
  let resIndex = 0;
  let prevPosition = 0;
  do {
    resIndex = tmp.indexOf(symbol, prevPosition);
    if (i === index) {
      return resIndex;
    }
    i++;
    prevPosition = resIndex + 1;
  } while (resIndex !== -1);
  return -1;
};
