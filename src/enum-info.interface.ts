import { EType } from "./type.enum";

export interface IEnumInfo {
  id: string;
  name: string;
  filePath: string;
  type: EType;
  content: string;
  data: any;
}
