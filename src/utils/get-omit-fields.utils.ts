import { findBody } from "./find-body.util";

interface IReturn {
  fields: string[] | undefined;
}
export function getOmitFields(interfaceName: string | undefined): IReturn {
  let fields: string[] | undefined = undefined;
  if (interfaceName) {
    const omitBody = findBody({
      fileContent: interfaceName,
      startWord: "Omit",
      START_SYMBOL: "<",
      END_SYMBOL: ">",
    });
    if (omitBody.length) {
      const idx = omitBody[0].indexOf(",");
      if (idx === -1) {
        fields = [];
      } else {
        const omitContent = omitBody[0].substring(
          idx + 1,
          omitBody[0].length - 1
        );
        fields = omitContent
          .split("|")
          .map((text) => text.replace(/["']/g, "").trim());
      }
    }
  }
  return { fields };
}

export const getOmitFirstArgument = (
  interfaceBody?: string
): { firstArgumentBody: string } | undefined => {
  if (!interfaceBody?.startsWith("Omit<")) {
    return undefined;
  }
  const genericBody = findBody({
    fileContent: interfaceBody,
    startWord: "Omit<",
    START_SYMBOL: "<",
    END_SYMBOL: ">",
  });
  if (genericBody.length) {
    const endIdx = genericBody[0].lastIndexOf(",") || genericBody[0].length - 1;
    interfaceBody = genericBody[0].substring(0, endIdx).replace("Omit<", "");
  }
  return { firstArgumentBody: interfaceBody };
};
