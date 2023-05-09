export function getClassProperties(classContent: string): any {
    let match: RegExpExecArray | null;

    classContent = removeMethodsFromClass(classContent);
    classContent = removeDecoratorsFromClass(classContent);
    classContent = removeAllCommentsFromClass(classContent);

    const REGEXP_BODY = /\{([\s\S\w\W]*)\}/g;

    while ((match = REGEXP_BODY.exec(classContent)) !== null) {
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
            console.error('parse error in get-class ' + data);
        }
    }
}

function removeMethodsFromClass(classBody: string): string {
    const regex = /(?<!interface\s)\b\w+\s*\([^)]*\)\s*(:\s*\w+\s*)?{\s*[\s\S]*?}\s*/g;
    return classBody.replace(regex, '');
}

function removeDecoratorsFromClass(classBody: string): string {
    // eslint-disable-next-line no-useless-escape
    const regex = /@[a-zA-Z0-9_]+(\([^\)]*\))?(\s*)/g;
    return classBody.replace(regex, '');
}

function removeAllCommentsFromClass(classBody: string): string {
    const regex = /\/\/.*|\/\*[\s\S]*?\*\//g;
    return classBody.replace(regex, '');
}
