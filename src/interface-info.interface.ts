import { EType } from "./type.enum";

export interface IInterfaceInfo {
  id: string;
  name: string;
  filePath: string;
  type: EType;
  content: string;
  data: any;
}
