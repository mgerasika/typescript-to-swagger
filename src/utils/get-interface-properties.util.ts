export function getInterfaceProperties(interfaceContent: string): any {
    let match: RegExpExecArray | null;

    const REGEXP_BODY = /\{([\s\S\w\W]*)\}/g;

    while ((match = REGEXP_BODY.exec(interfaceContent)) !== null) {
        const withoutComments = match[1].replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
        let data =
            '{' +
            withoutComments
                .replace(/(\w+(\<\w+\>)?\[?\]?\??)/g, '"$1"')
                .replace(/;/g, ',')
                .replace(/\s/g, '') +
            '}';
        data = data.replace(/,}/g, '}');

        try {
            return JSON.parse(data);
        } catch {
            console.error('parse error ' + data);
        }
    }
}
