import { IEnumInfo } from "./enum-info.interface";
import { IInfo } from "./info.interface";
import { IInterfaceInfo } from "./interface-info.interface";
import { IRouteInfo } from "./route-info.interface";
import {
  findAllEnumsInFile,
  findAllInterfacesInFile,
  findAllRoutesInFile,
  getAllTypeScriptFilesFromMultipleDirectoriesAsync,
} from "./utils";
export * from "./utils";
import fs from "fs";

interface IProps {
  dir: string[];
}

export const getInterfaceInfo = ({ dir }: IProps): Promise<IInfo> => {
  return new Promise((resolve, reject) => {
    let interfaces: IInterfaceInfo[] = [];
    let enums: IEnumInfo[] = [];
    let routes: IRouteInfo[] = [];
    getAllTypeScriptFilesFromMultipleDirectoriesAsync(dir)
      .then((tsFiles) => {
        console.log("tsFiles", tsFiles);
        return Promise.all(
          tsFiles.map(async (filePath) => {
            const fileContent = await fs.promises.readFile(filePath, "utf-8");

            const newInterfaces = findAllInterfacesInFile(
              fileContent,
              filePath
            );
            const newEnums = findAllEnumsInFile(fileContent, filePath);
            const newRoutes = findAllRoutesInFile(fileContent, filePath);
            interfaces = [...interfaces, ...newInterfaces];
            enums = [...enums, ...newEnums];
            routes = [...routes, ...newRoutes];
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        resolve({
          interfaces,
          enums,
          routes,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
