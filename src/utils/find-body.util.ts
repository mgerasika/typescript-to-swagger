import { calcSymbolsCount } from "./calc-symbols-count.util";

export const findBody = (
  type: "interface" | "enum" | "class",
  fileContent: string
): string[] => {
  let startIdx = fileContent.indexOf(type);
  const res = [];
  let position = 0;

  while (startIdx >= 0) {
    startIdx = fileContent.indexOf(type, position);
    let startCount = 0;
    let endCount = 0;
    let tmp;
    do {
      const endIdx = fileContent.indexOf("}", position) + 1;
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
      if (tmp.startsWith(type)) {
        const text = tmp
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
          //   .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")
          .replace(/[\n\t]*/g, "")
          // eslint-disable-next-line no-regex-spaces
          .replace(/  /g, " ")
          .replace(/ \}/g, "}");
        res.push(text);
      }
    }
    if (position === -1) {
      break;
    }
    startIdx = position;
  }

  return res;
};
