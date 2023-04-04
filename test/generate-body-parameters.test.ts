import { expect } from '@jest/globals';
import { generateBodyParameters } from '../src/spec-generation/generate-body-parameters.util';

describe('generate-body-parameters', () => {
    it('default', () => {
        expect(generateBodyParameters({ body: { x: 'number' } })).toMatchObject({
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'integer',
                    },
                },
            },
        });
    });

    it('when body interface', () => {
        expect(generateBodyParameters({ body: 'IUser' })).toMatchObject({
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/IUser',
                    },
                },
            },
        });
    });

    it('when body simple type', () => {
        expect(generateBodyParameters({ body: 'string' })).toMatchObject({
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'string',
                    },
                },
            },
        });

        expect(generateBodyParameters({ body: 'number' })).toMatchObject({
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'integer',
                    },
                },
            },
        });

        expect(generateBodyParameters({ body: 'boolean' })).toMatchObject({
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'boolean',
                    },
                },
            },
        });
    });
});
