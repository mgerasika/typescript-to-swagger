import { expect } from '@jest/globals';
import { getGenericTypes } from '../src/utils/get-generic-types.util';

describe('get-interface-info', () => {
    it('get info from extended', () => {
        expect(getGenericTypes('B<string>')).toMatchObject({ fields: ['string'], interfaceNameWithoutGeneric: 'B' });
        expect(getGenericTypes('B<string,number,string>').fields).toEqual(['string', 'number', 'string']);
        expect(getGenericTypes("Omit<B<string,number,string>, 'a'>").fields).toEqual(['B<string,number,string>']);
    });
});
