import { getInterfaceName } from "./get-interface-name.util";
import { findBody } from "./find-body.util";
import { getOmitFirstArgument } from "./get-omit-fields.utils";
import { getPickFirstArgument } from "./get-pick-fields.util";

interface IReturn {
  fields: string[] | undefined;
  interfaceNameWithoutGeneric: string;
}
export function getGenericTypes(interfaceBody: string | undefined): IReturn {
  let fields: string[] | undefined = undefined;
  let newInterfaceBody =
    getOmitFirstArgument(interfaceBody || "")?.firstArgumentBody ||
    interfaceBody;
  newInterfaceBody =
    getPickFirstArgument(newInterfaceBody)?.firstArgumentBody ||
    newInterfaceBody ||
    "";
  if (interfaceBody) {
    if (newInterfaceBody !== interfaceBody) {
      if (newInterfaceBody?.includes("<")) {
        fields = [newInterfaceBody];
      } else {
        fields = newInterfaceBody.split(",");
      }
    } else {
      const genericBody = findBody({
        fileContent: newInterfaceBody,
        startWord: "<",
        START_SYMBOL: "<",
        END_SYMBOL: ">",
      });
      if (genericBody.length) {
        let onlyBodyWithoutExtraSymbols = genericBody[0].substring(
          1,
          genericBody[0].length - 1
        );
        onlyBodyWithoutExtraSymbols =
          getOmitFirstArgument(onlyBodyWithoutExtraSymbols)
            ?.firstArgumentBody || onlyBodyWithoutExtraSymbols;
        onlyBodyWithoutExtraSymbols =
          getPickFirstArgument(onlyBodyWithoutExtraSymbols)
            ?.firstArgumentBody || onlyBodyWithoutExtraSymbols;

        if (onlyBodyWithoutExtraSymbols?.includes("<")) {
          fields = [onlyBodyWithoutExtraSymbols];
        } else {
          fields = onlyBodyWithoutExtraSymbols.split(",");
        }
      }
    }
  }
  return {
    fields,
    interfaceNameWithoutGeneric: getInterfaceName(interfaceBody),
  };
}
