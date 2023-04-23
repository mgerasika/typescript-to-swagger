import fs from 'fs';
import { IEnumInfo } from '../interfaces/enum-info.interface';
import { IInfo } from '../interfaces/info.interface';
import { IInterfaceInfo } from '../interfaces/interface-info.interface';
import { IRouteInfo } from '../interfaces/route-info.interface';
import {
    getAllTypeScriptFilesFromMultipleDirectoriesAsync,
    findAllInterfacesInFile,
    findAllEnumsInFile,
    findAllRoutesInFile,
    findAllClassesInFile,
} from './utils';

interface IProps {
    dir: string[];
}

export const getSpecInfoAsync = ({ dir }: IProps): Promise<IInfo> => {
    return new Promise((resolve, reject) => {
        let interfaces: IInterfaceInfo[] = [];
        let enums: IEnumInfo[] = [];
        let routes: IRouteInfo[] = [];
        getAllTypeScriptFilesFromMultipleDirectoriesAsync(dir)
            .then((tsFiles) => {
                return Promise.all(
                    tsFiles.map(async (filePath) => {
                        const fileContent = await fs.promises.readFile(filePath, 'utf-8');

                        const newInterfaces = findAllInterfacesInFile(fileContent, filePath);
                        const newClasses = findAllClassesInFile(fileContent, filePath);
                        const newEnums = findAllEnumsInFile(fileContent, filePath);
                        const newRoutes = findAllRoutesInFile(fileContent, filePath);
                        interfaces = [...interfaces, ...newInterfaces, ...newClasses];
                        enums = [...enums, ...newEnums];
                        routes = [...routes, ...newRoutes];
                        return Promise.resolve();
                    }),
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
