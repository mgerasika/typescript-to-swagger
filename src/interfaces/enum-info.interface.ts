import { EType } from "../enums/type.enum";

export interface IEnumInfo {
  id: string;
  name: string;
  filePath: string;
  type: EType;
  content: string;
  data: any;
}
