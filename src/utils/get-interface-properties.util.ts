import { IPropertyInfo } from "../property-info.interface";

export function getInterfaceProperties(
  interfaceContent: string
): IPropertyInfo[] | undefined {
  let match: RegExpExecArray | null;

  const REGEXP_BODY = /\{([\s\S\w\W]*)\}/g;

  const res: IPropertyInfo[] = [];
  while ((match = REGEXP_BODY.exec(interfaceContent)) !== null) {
    const withoutComments = match[1].replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
    let result =
      "{" +
      withoutComments
        .replace(/\b(\w+)\b/g, '"$1"')
        .replace(/;/g, ",")
        .replace(/\s/g, "") +
      "}";
    result = result.replace(/,}/g, "}");

    try {
      const json = JSON.parse(result);
      Object.keys(json).map((key) => {
        res.push({
          name: key,
          // eslint-disable-next-line no-useless-escape
          type: JSON.stringify(json[key]).replace(/\"/g, ""),
        });
      });
    } catch (e) {
      console.error("parse error", result);
    }

    return res;
  }
}
