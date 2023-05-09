
export const isJsSubObject = (type: any) => {
    if (typeof type === 'object' && JSON.stringify(type).startsWith('{')) {
        return true;
    }
};
