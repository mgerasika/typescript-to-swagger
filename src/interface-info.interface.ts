import { IPropertyInfo } from "./property-info.interface";
import { EType } from "./type.enum";

export interface IInterfaceInfo {
  name: string;
  path: string;
  type: EType;
  content: string;
  properties: Array<IPropertyInfo>;
}
