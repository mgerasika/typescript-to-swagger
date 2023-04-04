import { IEnumInfo } from "./enum-info.interface";
import { IInterfaceInfo } from "./interface-info.interface";
import { IRouteInfo } from "./route-info.interface";

export interface IInfo {
  enums: IEnumInfo[];
  interfaces: IInterfaceInfo[];
  routes: IRouteInfo[];
}
