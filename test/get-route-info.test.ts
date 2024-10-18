import { getRouteInfo } from '../src/utils/get-route-info.util';

describe('get-route-info', () => {
    it('get route info ', () => {
        expect(getRouteInfo('app.get(API_URL.api.statistic.info.toString(), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {', 'test.txt')).
            toEqual({
                "content":
                    "app.get(API_URL.api.statistic.info.toString(), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {",
                "filePath": "test.txt",
                "httpMethod": "get",
                "requestInterfaceId": "test.txt#IStatisticInfoRequest",
                "responseInterfaceId": "test.txt#IStatisticInfoResponse", 
                "url": "api/statistic/info/"
            });
    });

   
});

describe('get-route-info with middleware function', () => {
    

    it('simple middleware', () => {
        expect(getRouteInfo('app.get(API_URL.api.statistic.info.toString(), callMe(), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {', 'test.txt')).
            toEqual({
                "content":
                    "app.get(API_URL.api.statistic.info.toString(), callMe(), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {",
                "filePath": "test.txt",
                "httpMethod": "get",
                "requestInterfaceId": "test.txt#IStatisticInfoRequest",
                "responseInterfaceId": "test.txt#IStatisticInfoResponse", 
                "url": "api/statistic/info/"
            });
    });

    it('with arguments', () => {
        expect(getRouteInfo(`app.get(API_URL.api.statistic.info.toString(), callMe('a','b'), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {`, 'test.txt')).
            toEqual({
                "content":
                    "app.get(API_URL.api.statistic.info.toString(), callMe('a','b'), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {",
                "filePath": "test.txt",
                "httpMethod": "get",
                "requestInterfaceId": "test.txt#IStatisticInfoRequest",
                "responseInterfaceId": "test.txt#IStatisticInfoResponse", 
                "url": "api/statistic/info/"
            });
    });
});
