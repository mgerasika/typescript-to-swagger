import * as fs from "fs";
import { IEnumInfo } from "../interfaces/enum-info.interface";
import { IInterfaceInfo } from "../interfaces/interface-info.interface";
import { IRouteInfo } from "../interfaces/route-info.interface";
import { findBody } from "./find-body.util";
import { getEnumInfo } from "./get-enum-info.util";
import { getInterfaceInfo } from "./get-interface-info.util";
import { getRouteInfo } from "./get-route-info.util";

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

export function findAllEnumsInFile(
  fileContent: string,
  filePath: string
): Array<IEnumInfo> {
  const res: IEnumInfo[] = [];

  findBody({ type: "enum", fileContent }).forEach((interfaceBody) => {
    const info = getEnumInfo(interfaceBody, filePath);
    if (info) {
      res.push(info);
    }
  });

  return res;
}

export function findAllInterfacesInFile(
  fileContent: string,
  filePath: string
): Array<IInterfaceInfo> {
  const res: IInterfaceInfo[] = [];

  findBody({ type: "interface", fileContent }).forEach((interfaceBody) => {
    const info = getInterfaceInfo(interfaceBody, filePath);
    if (info) {
      res.push(info);
    }
  });

  return res;
}

export function findAllRoutesInFile(
  fileContent: string,
  filePath: string
): Array<IRouteInfo> {
  const res: IRouteInfo[] = [];

  findBody({
    type: "app.",
    fileContent,
    START_SYMBOL: "(",
    END_SYMBOL: ")",
  }).forEach((interfaceBody) => {
    const info = getRouteInfo(interfaceBody, filePath);
    if (info) {
      res.push(info);
    }
  });

  return res;
}
