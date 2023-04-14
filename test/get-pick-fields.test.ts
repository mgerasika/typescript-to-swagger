import { expect } from '@jest/globals';
import { getPickFields } from '../src/utils/get-pick-fields.util';

describe('get-pick-fields', () => {
    it('get default pick fields', () => {
        expect(getPickFields("Pick<string,'a' | 'b' >").fields).toEqual(['a', 'b']);
        expect(getPickFields('Pick<string,a | b >').fields).toEqual(['a', 'b']);
        expect(getPickFields('Pick<string,a>').fields).toEqual(['a']);
    });
});
