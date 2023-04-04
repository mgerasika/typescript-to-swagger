import { getSpecPropertyName } from '../utils/get-spec-property-name.util';
import { getSpecTypeFromJsType } from '../utils/get-spec-type-from-js-type.util';
import { isExternalDefinition } from '../utils/is-external-definition.util';

interface IProps {
    body: any;
}
/*
 "parameters": [
	{
		"name": "pet",
		"in": "body",
		"description": "Pet to add to the store",
		"required": true,
		"schema": {
			"$ref": "#/definitions/NewPet"
		}
	},
],
*/

export const generateBodyParameters = ({ body }: IProps) => {
    if (Object.keys(body).length === 1 && typeof body !== 'string') {
        return Object.keys(body).map((key) => {
            return {
                required: true,
                content: {
                    'application/json': {
                        name: getSpecPropertyName(key),
                        schema: {
                            type: getSpecTypeFromJsType(body[key]),
                        },
                    },
                },
            };
        })[0];
    } else if (isExternalDefinition(body)) {
        return {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${body}`,
                    },
                },
            },
        };
    } else {
        return {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: getSpecTypeFromJsType(body),
                    },
                },
            },
        };
    }
};
