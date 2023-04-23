import { IInterfaceInfo } from '../interfaces/interface-info.interface';
import { EType } from '../enums/type.enum';
import { makeId } from './make-id.util';
import { getClassProperties } from './get-class-properties.util';

export function getClassInfo(classContent: string, filePath: string): IInterfaceInfo | undefined {
    let match: RegExpExecArray | null;

    const regex = /class\s+(\w+)\s*(?:implements\s+(.*?))?\{/g;

    while ((match = regex.exec(classContent)) !== null) {
        const className = match[1];
        const extendedInterfaces = match[2]?.split(/,(?![^<>]*>)/).map((f) => f.trim());
        return {
            name: className,
            extendedInterfaces,
            id: makeId(filePath, className),
            content: classContent,
            type: EType.interface,
            filePath: filePath,
            data: getClassProperties(classContent) || [],
        };
    }
}
