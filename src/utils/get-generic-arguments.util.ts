import { getInterfaceName } from './get-interface-name.util';
import { findBody } from './find-body.util';
import { getOmitFirstArgument } from './get-omit-fields.utils';
import { getPickFirstArgument } from './get-pick-fields.util';

interface IReturn {
    genericArguments: string[] | undefined;
    interfaceName: string;
}
export function getGenericArguments(interfaceBody: string | undefined): IReturn {
    let fields: string[] | undefined = undefined;

    if (interfaceBody) {
        let newInterfaceBody = getOmitFirstArgument(interfaceBody || '')?.firstArgumentBody || interfaceBody;
        newInterfaceBody = getPickFirstArgument(newInterfaceBody)?.firstArgumentBody || newInterfaceBody || '';

        //has omit or pick
        if (newInterfaceBody !== interfaceBody) {
            if (newInterfaceBody?.includes('<')) {
                fields = [newInterfaceBody];
            } else {
                fields = newInterfaceBody.split(',');
            }
        } else {
            const genericBody = findBody({
                fileContent: newInterfaceBody,
                startWord: '<',
                START_SYMBOL: '<',
                END_SYMBOL: '>',
            });
            if (genericBody.length) {
                let genericBodyContent = genericBody[0].substring(1, genericBody[0].length - 1);
                genericBodyContent = getOmitFirstArgument(genericBodyContent)?.firstArgumentBody || genericBodyContent;
                genericBodyContent = getPickFirstArgument(genericBodyContent)?.firstArgumentBody || genericBodyContent;

                if (genericBodyContent?.includes('<')) {
                    fields = [genericBodyContent];
                } else {
                    fields = genericBodyContent.split(',');
                }
            }
        }
    }
    return {
        genericArguments: fields,
        interfaceName: getInterfaceName(interfaceBody),
    };
}
