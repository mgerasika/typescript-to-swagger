import { isJsSubObject } from "./is-js-sub-object.util";

export const getSpecTypeFromJsType = (type: string): string => {
    if (type === 'number') {
        return 'integer';
    }
    if (isJsSubObject(type)) {
        return 'object';
    }
    return type;
};


