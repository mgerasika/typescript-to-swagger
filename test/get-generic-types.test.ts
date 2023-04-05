import { expect } from '@jest/globals';
import { getGenericTypes } from '../src/utils/get-generic-types.util';

describe('get-interface-info', () => {
    it('get info from extended', () => {
        expect(getGenericTypes('B<string>')).toEqual(['string']);
        expect(getGenericTypes('B<string,number,string>')).toEqual(['string', 'number', 'string']);
    });
});
