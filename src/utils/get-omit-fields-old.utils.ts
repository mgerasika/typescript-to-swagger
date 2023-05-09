import { IInfo } from '../interfaces/info.interface';
import { findBody } from './find-body.util';

export function getOmitFieldsOld({
    interfaceName,
    allSpec,
}: {
    interfaceName: string | undefined;
    allSpec: IInfo;
}): string[] | undefined {
    let res: string[] | undefined = undefined;
    if (interfaceName) {
        const omitBody = findBody({
            fileContent: interfaceName,
            startWord: 'Omit',
            START_SYMBOL: '<',
            END_SYMBOL: '>',
        });
        if (omitBody.length) {
            const idx = omitBody[0].indexOf(',');
            if (idx === -1) {
                const omitInterfaceName = omitBody[0].replace('Omit<', '').replace('>', '').trim();
                if (omitInterfaceName) {
                    const omitInterface = allSpec.interfaces.find((i) => i.name === omitInterfaceName);
                    if (omitInterface) {
                        res = Object.keys(omitInterface.data);
                    }
                }
            } else {
                const omitContent = omitBody[0].substring(idx + 1, omitBody[0].length - 1);
                const omitFields = omitContent.split('|').map((text) => text.replace(/["']/g, '').trim());

                const omitInterfaceName = omitBody[0].substring(0, idx).replace('Omit<', '').trim();
                if (omitInterfaceName) {
                    const omitInterface = allSpec.interfaces.find((i) => i.name === omitInterfaceName);
                    if (omitInterface) {
                        res = Object.keys(omitInterface.data)
                            .map((key) => {
                                if (omitFields.includes(key)) {
                                    return undefined;
                                }
                                return key;
                            })
                            .filter((f) => f) as string[];
                    }
                }
            }
        }
    }
    return res;
}
