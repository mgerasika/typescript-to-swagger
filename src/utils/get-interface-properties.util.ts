export function getInterfaceProperties(interfaceContent: string): any {
    let match: RegExpExecArray | null;

    const REGEXP_BODY = /\{([\s\S\w\W]*)\}/g;

    while ((match = REGEXP_BODY.exec(interfaceContent)) !== null) {
        // eslint-disable-next-line no-useless-escape
        const withoutComments = match[1].replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
        let data =
            '{' +
            withoutComments
                // eslint-disable-next-line no-useless-escape
                .replace(/(\w+(\<\w+\>)?\[?\]?\??)/g, '"$1"')
                .replace(/;/g, ',')
                .replace(/\s/g, '') +
            '}';
        data = data.replace(/,}/g, '}');
        data = data.replace(/!/g, '');

        try {
            return JSON.parse(data);
        } catch {
            console.error('parse error in get-interface-props ' + data);
        }
    }
}
