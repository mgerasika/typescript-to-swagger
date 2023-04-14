import { expect } from '@jest/globals';
import { getOmitFieldsOld } from '../src/utils/get-omit-fields-old.utils';
import { IInterfaceInfo } from '../src/interfaces/interface-info.interface';

describe('get-omit-fields old', () => {
    it('get omit fields with one omit ', () => {
        expect(
            getOmitFieldsOld({
                interfaceName: 'interface Omit<IColor,a>',
                allSpec: {
                    interfaces: [
                        {
                            name: 'IColor',
                            data: {
                                a: 'string',
                                b: 'string',
                                c: 'string',
                            },
                        } as IInterfaceInfo,
                    ],
                },
            }),
        ).toEqual(['b', 'c']);
    });

    it('get omit fields without omits ', () => {
        expect(
            getOmitFieldsOld({
                interfaceName: 'interface Omit<IColor>',
                allSpec: {
                    interfaces: [
                        {
                            name: 'IColor',
                            data: {
                                a: 'string',
                                b: 'string',
                                c: 'string',
                            },
                        } as IInterfaceInfo,
                    ],
                },
            }),
        ).toEqual(['a', 'b', 'c']);
    });
});
