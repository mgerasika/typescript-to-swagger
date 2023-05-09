import { IEnumInfo } from '../interfaces/enum-info.interface';
import { EType } from '../enums/type.enum';
import { makeId } from './make-id.util';

export function getEnumInfo(fileContent: string, filePath: string): IEnumInfo | undefined {
    const regex = /enum\s+(\w+)\s*{\s*((?:\s*\w+\s*=.*?,?\s*)*)}/gs;

    let match: RegExpExecArray | null;

    while ((match = regex.exec(fileContent)) !== null) {
        const enumName = match[1];

        let data =
            '{' +
            match[2]
                .replace(/\b(\w+)\b\s*=\s*/g, '"$1":')
                .replace(/;/g, ',')
                .replace(/'/g, '"')
                .replace(/\s/g, '') +
            '}';
        data = data.replace(/,}/g, '}');

        try {
            data = JSON.parse(data);
        } catch {
            console.error('parse error in get-enum', data);
        }

        return {
            name: enumName,
            id: makeId(filePath, enumName),
            content: fileContent,
            type: EType.enum,
            filePath: filePath,
            data: data,
        };
    }
}
