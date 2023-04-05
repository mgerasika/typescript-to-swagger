import { isJsType } from './is-js-type.util';

export const isExternalDefinition = (data: any): boolean => {
    if (typeof data === 'string') {
        if (!isJsType(data)) {
            return true;
        }
    }
    return false;
};
