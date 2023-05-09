export const isSimpleType = (data: any): boolean => {
    if (
        data === 'string' ||
        data === 'boolean' ||
        data === 'number' ||
        data === 'Date' ||
        data === 'any' ||
        data === 'Blob'
    ) {
        return true;
    }
    return false;
};
