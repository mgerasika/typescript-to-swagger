export function getGenericTypes(interfaceName: string): string[] | undefined {
    let res: string[] | undefined = undefined;
    if (interfaceName) {
        const startIdx = interfaceName.indexOf('<');
        const lastIdx = interfaceName.lastIndexOf('>');
        if (startIdx !== -1 && lastIdx !== -1) {
            res = interfaceName
                .substring(startIdx + 1, lastIdx)
                .split(',')
                .map((f) => f.trim());
        }
    }
    return res;
}
