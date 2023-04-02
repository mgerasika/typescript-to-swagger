import { IEnumInfo } from "./enum-info.interface";
import { IInfo } from "./info.interface";
import { IInterfaceInfo } from "./interface-info.interface";
import {
  findAllEnumsInFileAsync,
  findAllInterfacesInFileAsync,
  getAllTypeScriptFilesFromMutlipleDirectoriesAsync as getAllTypeScriptFilesFromMultipleDirectoriesAsync,
} from "./utils";
export * from "./utils";

interface IProps {
  dir: string[];
}

export const getInterfaceInfo = ({ dir }: IProps): Promise<IInfo> => {
  return new Promise((resolve, reject) => {
    let interfaces: IInterfaceInfo[] = [];
    let enums: IEnumInfo[] = [];
    getAllTypeScriptFilesFromMultipleDirectoriesAsync(dir)
      .then((tsFiles) => {
        return Promise.all(
          tsFiles.map(async (filePath) => {
            const i = await findAllInterfacesInFileAsync(filePath);
            const e = await findAllEnumsInFileAsync(filePath);
            interfaces = [...interfaces, ...i];
            enums = [...enums, ...e];
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        resolve({
          interfaces,
          enums,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

getInterfaceInfo({ dir: ["./src/api-admin"] }).then((res) => {
  console.log(JSON.stringify(res.interfaces, null, 2));
});
