import { calcSymbolsCount } from "./calc-symbols-count.util";
import { indexOf } from "./index-of.util";

export const findBody = (
  type: "interface" | "enum" | "class",
  fileContent: string
): string[] => {
  let startIdx = fileContent.indexOf(type);
  const res = [];
  let position = 0;

  while (startIdx >= 0) {
    let startCount = 0;
    let endCount = 0;
    let tmp;
    do {
      let endIdx = fileContent.indexOf("}", position) + 1;
      if (endIdx === 0) {
        startIdx = -1;
        position = -1;
        break;
      }
      tmp = fileContent.substring(startIdx, endIdx).trim();
      startCount = calcSymbolsCount(tmp, "{");
      endCount = calcSymbolsCount(tmp, "}");
      position = endIdx;
    } while (startCount !== endCount);
    if (tmp) {
      res.push(tmp);
    }
    startIdx = position;
  }
  return res;
};
