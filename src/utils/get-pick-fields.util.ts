import { findBody } from './find-body.util';

interface IReturn {
    fields: string[] | undefined;
}
export function getPickFields(interfaceName: string | undefined): IReturn {
    let fields: string[] | undefined = undefined;
    if (interfaceName) {
        const pickBody = findBody({
            fileContent: interfaceName,
            startWord: 'Pick',
            START_SYMBOL: '<',
            END_SYMBOL: '>',
        });
        if (pickBody.length) {
            const idx = pickBody[0].indexOf(',');
            if (idx === -1) {
                fields = [];
            } else {
                const omitContent = pickBody[0].substring(idx + 1, pickBody[0].length - 1);
                fields = omitContent.split('|').map((text) => text.replace(/["']/g, '').trim());
            }
        }
    }
    return { fields };
}
