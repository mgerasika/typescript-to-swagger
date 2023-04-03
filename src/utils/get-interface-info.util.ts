import { IInterfaceInfo } from "../interface-info.interface";
import { IPropertyInfo } from "../property-info.interface";
import { EType } from "../type.enum";
import { getInterfaceProperties } from "./get-interface-properties.util";

export function getInterfaceInfo(
  interfaceContent: string,
  filePath: string
): IInterfaceInfo | undefined {
  let match: RegExpExecArray | null;

  const regex = /interface\s+(\w+)\s*(?:extends\s+(.*))?/g;

  while ((match = regex.exec(interfaceContent)) !== null) {
    const interfaceName = match[1];
    const extendedInterfaces = match[2] ? match[2].split(/\s*,\s*/) : [];

    return {
      name: interfaceName,
      content: interfaceContent,
      type: EType.interface,
      path: filePath,
      properties: getInterfaceProperties(interfaceContent) || [],
    };
  }
}
