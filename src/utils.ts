import * as fs from "fs";
import { IEnumInfo } from "./enum-info.interface";
import { IInterfaceInfo } from "./interface-info.interface";
import { findBody } from "./utils/find-body.util";
import { getEnumInfo } from "./utils/get-enum-info.util";
import { getInterfaceInfo } from "./utils/get-interface-info.util";

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

export async function getAllTypeScriptFilesFromMultipleDirectoriesAsync(
  dirPathArr: string[]
): Promise<string[]> {
  return Promise.all(
    dirPathArr.map(async (dirPath) => getAllTypeScriptFilesAsync(dirPath))
  ).then((data) => data.flat());
}

export async function findAllEnumsInFileAsync(
  filePath: string
): Promise<Array<IEnumInfo>> {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");

  const res: IEnumInfo[] = [];

  findBody("enum", fileContent).forEach((interfaceBody) => {
    const info = getEnumInfo(interfaceBody, filePath);
    if (info) {
      res.push(info);
    }
  });

  return res;
}

export async function findAllInterfacesInFileAsync(
  filePath: string
): Promise<Array<IInterfaceInfo>> {
  const fileContent = await fs.promises.readFile(filePath, "utf-8");

  const res: IInterfaceInfo[] = [];

  findBody("interface", fileContent).forEach((interfaceBody) => {
    const info = getInterfaceInfo(interfaceBody, filePath);
    if (info) {
      res.push(info);
    }
  });

  return res;
}
