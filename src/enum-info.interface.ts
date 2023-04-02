import { EType } from "./type.enum";

export interface IEnumInfo {
  name: string;
  path: string;
  type: EType;
  members: Array<{ name: string; value: string }>;
}
