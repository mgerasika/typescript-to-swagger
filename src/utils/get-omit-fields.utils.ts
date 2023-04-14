import { findBody } from './find-body.util';

interface IReturn {
    fields: string[] | undefined;
}
export function getOmitFields(interfaceName: string | undefined): IReturn {
    let fields: string[] | undefined = undefined;
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
                fields = [];
            } else {
                const omitContent = omitBody[0].substring(idx + 1, omitBody[0].length - 1);
                fields = omitContent.split('|').map((text) => text.replace(/["']/g, '').trim());
            }
        }
    }
    return { fields };
}
