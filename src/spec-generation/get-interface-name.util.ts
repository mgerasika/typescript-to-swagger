import { findBody } from '../utils/find-body.util';

export const getInterfaceName = (input: string | undefined): string => {
    input = removeOmit(input || '');
    input = removePick(input || '');
    input = input?.replace('Omit<', '');
    input = input?.replace('Pick<', '');
    input = input?.replace('[]', '') || '';
    let idx = input.indexOf('<');
    if (idx !== -1) {
        input = input.substring(0, idx);
    }
    idx = input.indexOf(',');
    if (idx !== -1) {
        input = input.substring(0, idx);
    }
    return input.trim();
};

export const removeOmit = (interfaceName: string): string => {
    const genericBody = findBody({
        fileContent: interfaceName,
        startWord: 'Omit<',
        START_SYMBOL: '<',
        END_SYMBOL: '>',
    });
    if (genericBody.length) {
        const endIdx = genericBody[0].lastIndexOf(',') || genericBody[0].length - 1;
        return genericBody[0].substring(0, endIdx).replace('Omit<', '');
    }
    return interfaceName;
};

export const removePick = (interfaceName: string): string => {
    const genericBody = findBody({
        fileContent: interfaceName,
        startWord: 'Pick<',
        START_SYMBOL: '<',
        END_SYMBOL: '>',
    });
    if (genericBody.length) {
        const endIdx = genericBody[0].lastIndexOf(',') || genericBody[0].length - 1;
        return genericBody[0].substring(0, endIdx).replace('Pick<', '');
    }
    return interfaceName;
};
