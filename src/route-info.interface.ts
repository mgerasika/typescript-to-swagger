import { EType } from "./type.enum";

export interface IRouteInfo {
  httpMethod: string;
  url: string;
  content: string;
  requestInterfaceId: string;
  responseInterfaceId: string;
  filePath: string;
}
