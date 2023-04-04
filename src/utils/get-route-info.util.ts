import { IInterfaceInfo } from "../interface-info.interface";
import { IRouteInfo } from "../route-info.interface";
import { EType } from "../type.enum";
import { getInterfaceProperties } from "./get-interface-properties.util";
import { makeId } from "./make-id.util";

export function getRouteInfo(
  content: string,
  filePath: string
): IRouteInfo | undefined {
  let match: RegExpExecArray | null;

  /*
	app.get(API_URL.api.users.id().toString(), (req: IRequest, res: IResponse) => {
	res.send("Hello world");
	});
*/
  const REGEXP_APP = /app\.(.+?)\((.+?)\,\s*?\((.*?)\)/g;

  while ((match = REGEXP_APP.exec(content)) !== null) {
    const httpMethod = match[1];
    const requestUrl = match[2];
    const arg = match[3].split(",");

    let requestInterface = "";
    let responseInterface = "";
    if (arg.length === 2) {
      const req = arg[0].split(":");
      if (req.length === 2) {
        requestInterface = makeId(filePath, req[1].trim());
      }
      const res = arg[1].split(":");
      if (res.length === 2) {
        responseInterface = makeId(filePath, res[1].trim());
      }
    }
    return {
      httpMethod: httpMethod,
      url: requestUrl,
      content: content,
      requestInterfaceId: requestInterface,
      responseInterfaceId: responseInterface,
      filePath: filePath,
    };
  }
}
