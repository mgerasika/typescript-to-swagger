import {
  findAllEnumsInFileAsync,
  findAllInterfacesInFileAsync,
  getAllTypeScriptFilesFromMutlipleDirectoriesAsync as getAllTypeScriptFilesFromMultipleDirectoriesAsync,
  IEnumInfo,
  IInterfaceInfo,
} from "./utils";
export * from "./utils";

interface IProps {
  dir: string[];
}
export interface IInfo {
  enums: IEnumInfo[];
  interfaces: IInterfaceInfo[];
}

export const getInterfaceInfo = ({ dir }: IProps): Promise<IInfo> => {
  return new Promise(async (resolve, reject) => {
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
