import { getOmitFirstArgument } from "./get-omit-fields.utils";
import { getPickFirstArgument } from "./get-pick-fields.util";

export const getInterfaceName = (input: string | undefined): string => {
  input = getOmitFirstArgument(input || "")?.firstArgumentBody || input;
  input = getPickFirstArgument(input || "")?.firstArgumentBody || input;
  input = input?.replace("Omit<", "");
  input = input?.replace("Pick<", "");
  input = input?.replace("[]", "") || "";
  let idx = input.indexOf("<");
  if (idx !== -1) {
    input = input.substring(0, idx);
  }
  idx = input.indexOf(",");
  if (idx !== -1) {
    input = input.substring(0, idx);
  }
  return input.trim();
};
