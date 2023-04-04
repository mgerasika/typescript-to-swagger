import { IInterfaceInfo } from "../interfaces/interface-info.interface";
import { EType } from "../enums/type.enum";
import { getInterfaceProperties } from "./get-interface-properties.util";
import { makeId } from "./make-id.util";

export function getInterfaceInfo(
  interfaceContent: string,
  filePath: string
): IInterfaceInfo | undefined {
  let match: RegExpExecArray | null;

  const regex = /interface\s+(\w+)\s*(?:extends\s+(.*))?/g;

  while ((match = regex.exec(interfaceContent)) !== null) {
    const interfaceName = match[1];
    // const extendedInterfaces = match[2] ? match[2].split(/\s*,\s*/) : [];

    return {
      name: interfaceName,
      id: makeId(filePath, interfaceName),
      content: interfaceContent,
      type: EType.interface,
      filePath: filePath,
      data: getInterfaceProperties(interfaceContent) || [],
    };
  }
}
