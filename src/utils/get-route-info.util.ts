import { IRouteInfo } from '../interfaces/route-info.interface';
import { makeId } from './make-id.util';

export function getRouteInfo(content: string, filePath: string): IRouteInfo | undefined {
    let match: RegExpExecArray | null;

    /*
	app.get(API_URL.api.users.id().toString(), (req: IRequest, res: IResponse) => {
	res.send("Hello world");
	});
*/
    const REGEXP_APP = /app\.(.+?)\((.+?)\,[\s\w]*?\((.*?)\)/g;

    while ((match = REGEXP_APP.exec(content)) !== null) {
        const httpMethod = match[1];
        let requestUrl = match[2];
        const arg = match[3].split(',');

        let requestInterface = '';
        let responseInterface = '';
        if (arg.length === 2) {
            const req = arg[0].split(':');
            if (req.length === 2) {
                requestInterface = makeId(filePath, req[1].trim());
            }
            const res = arg[1].split(':');
            if (res.length === 2) {
                responseInterface = makeId(filePath, res[1].trim());
            }
        }
        if (requestUrl.includes('toString()')) {
            requestUrl = requestUrl
                .replace(/\.(\w+?)\(\)\./g, '/{$1}')
                .replace(/toString\(\)/, '')
                .replace(/\./g, '/');

            const [, ...rest] = requestUrl.split('/');
            requestUrl = rest.join('/');
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
