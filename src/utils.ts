import * as fs from "fs";

export async function getAllTypeScriptFilesAsync(
  dirPath: string,
  arrayOfFiles: string[] = []
): Promise<string[]> {
  const files = await fs.promises.readdir(dirPath);

  for (const file of files) {
    const filePath = `${dirPath}/${file}`;

    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      await getAllTypeScriptFilesAsync(filePath, arrayOfFiles);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
}

export async function getAllTypeScriptFilesFromMutlipleDirectoriesAsync(
  dirPathArr: string[]
): Promise<string[]> {
  return Promise.all(
    dirPathArr.map(async (dirPath) => getAllTypeScriptFilesAsync(dirPath))
  ).then((data) => data.flat());
}

export enum EType {
  interface = "interface",
  enum = "enum",
  type = "type",
}
export interface IEnumInfo {
  name: string;
  path: string;
  type: EType;
  members: Array<{ name: string; value: string }>;
}
export async function findAllEnumsInFileAsync(
  filePath: string
): Promise<Array<IEnumInfo>> {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");

  const regex = /enum\s+(\w+)\s*{\s*((?:\s*\w+\s*=.*?,?\s*)*)}/gs;

  const res = [];

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

    res.push({
      name: enumName,
      type: EType.enum,
      path: filePath,
      members: membersList,
    });
  }

  return res;
}

export interface IInterfaceInfo {
  name: string;
  path: string;
  type: EType;
  properties: Array<{ name: string; type: string }>;
}
export async function findAllInterfacesInFileAsync(
  filePath: string
): Promise<Array<IInterfaceInfo>> {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");

  const regex = /interface\s+(\w+)\s*{\s*((?:\s*\w+\s*:\s*.+?;\s*)*)}/gs;

  const res = [];

  let match: RegExpExecArray | null;

  while ((match = regex.exec(fileContent)) !== null) {
    const interfaceName = match[1];
    const propertyRegex = /\s*(\w+)\s*:\s*(.+?)\s*;/g;
    const propertiesList = [];

    let propertyMatch: RegExpExecArray | null;

    while ((propertyMatch = propertyRegex.exec(match[2])) !== null) {
      const propertyName = propertyMatch[1];
      const propertyType = propertyMatch[2];
      propertiesList.push({ name: propertyName, type: propertyType });
    }

    res.push({
      name: interfaceName,
      type: EType.interface,
      path: filePath,
      properties: propertiesList,
    });
  }

  return res;
}
