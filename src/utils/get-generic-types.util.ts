import { getInterfaceName, removeOmit, removePick } from '../spec-generation/get-interface-name.util';
import { findBody } from './find-body.util';

interface IReturn {
    fields: string[] | undefined;
    interfaceNameWithoutGeneric: string;
}
export function getGenericTypes(interfaceName: string | undefined): IReturn {
    let fields: string[] | undefined = undefined;
    let newInterfaceName = removeOmit(interfaceName || '');
    newInterfaceName = removePick(newInterfaceName);
    if (interfaceName) {
        if (newInterfaceName !== interfaceName) {
            if (newInterfaceName?.includes('<')) {
                fields = [newInterfaceName];
            } else {
                fields = newInterfaceName.split(',');
            }
        } else {
            const genericBody = findBody({
                fileContent: newInterfaceName,
                startWord: '<',
                START_SYMBOL: '<',
                END_SYMBOL: '>',
            });
            if (genericBody.length) {
                let onlyBodyWithoutExtraSymbols = genericBody[0].substring(1, genericBody[0].length - 1);
                onlyBodyWithoutExtraSymbols = removeOmit(onlyBodyWithoutExtraSymbols);
                onlyBodyWithoutExtraSymbols = removePick(onlyBodyWithoutExtraSymbols);

                if (onlyBodyWithoutExtraSymbols?.includes('<')) {
                    fields = [onlyBodyWithoutExtraSymbols];
                } else {
                    fields = onlyBodyWithoutExtraSymbols.split(',');
                }
            }
        }
    }
    return { fields, interfaceNameWithoutGeneric: getInterfaceName(interfaceName) };
}
