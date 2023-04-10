import { isSimpleType } from './is-simple-type.util';

export const isExternalDefinition = (data: any): boolean => {
    if (typeof data === 'string') {
        if (!isSimpleType(data)) {
            return true;
        }
    }
    return false;
};
