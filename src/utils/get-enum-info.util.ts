import * as fs from "fs";
import { IEnumInfo } from "../enum-info.interface";
import { EType } from "../type.enum";

export function getEnumInfo(
  fileContent: string,
  filePath: string
): IEnumInfo | undefined {
  const regex = /enum\s+(\w+)\s*{\s*((?:\s*\w+\s*=.*?,?\s*)*)}/gs;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(fileContent)) !== null) {
    const enumName = match[1];
    const memberRegex = /\s*(\w+)\s*=\s*(.*?),?\s*/g;
    const membersList = [];

    let memberMatch: RegExpExecArray | null;

    while ((memberMatch = memberRegex.exec(match[2])) !== null) {
      const memberName = memberMatch[1];
      const memberValue = memberMatch[2];
      membersList.push({ name: memberName, value: memberValue });
    }

    return {
      name: enumName,
      type: EType.enum,
      path: filePath,
      members: membersList,
    };
  }
}
