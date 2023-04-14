import { getOmitFields } from '../src/utils/get-omit-fields.utils';
import { IInterfaceInfo } from '../src/interfaces/interface-info.interface';

describe('get-omit-fields', () => {
    it('get omit fields ', () => {
        expect(getOmitFields('interface Omit<IColor,a|b>').fields).toEqual(['a', 'b']);
    });
});
