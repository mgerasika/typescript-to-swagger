import { EType } from "./type.enum";

export interface IInterfaceInfo {
  name: string;
  path: string;
  type: EType;
  properties: Array<{ name: string; type: string }>;
}
