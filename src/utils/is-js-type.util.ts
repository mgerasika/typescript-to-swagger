export const isJsType = (data: any): boolean => {
    if (data === 'string' || data === 'boolean' || data === 'number' || data === 'Date') {
        return true;
    }
    return false;
};
