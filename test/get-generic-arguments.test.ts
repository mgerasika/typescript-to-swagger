import { expect } from '@jest/globals';
import { getGenericArguments } from '../src/utils/get-generic-arguments.util';
describe('get-interface-info', () => {
    it('get info from extended', () => {
        expect(getGenericArguments('B<string>')).toMatchObject({
            genericArguments: ['string'],
            interfaceName: 'B',
        });
        expect(getGenericArguments('B<string,number,string>').genericArguments).toEqual(['string', 'number', 'string']);
        expect(getGenericArguments("Omit<B<string,number,string>, 'a'>").genericArguments).toEqual([
            'B<string,number,string>',
        ]);
    });
});
