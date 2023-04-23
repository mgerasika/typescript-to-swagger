import { getGenericArguments } from '../utils/get-generic-arguments.util';
import { IInfo } from '../interfaces/info.interface';
import { IRouteInfo } from '../interfaces/route-info.interface';
import { isArray } from '../utils/is-array.util';
import { isSimpleType } from '../utils/is-simple-type.util';
import { getSpecTypeFromJsType } from '../utils/get-spec-type-from-js-type.util';

interface IProps {
    allSpec: IInfo;
    route: IRouteInfo;
}

/*
 "responses": {
	"200": {
	"description": "pet response",
	"schema": {
		"type": "array",
		"items": {
		"$ref": "#/definitions/Pet"
		}
	}
	},
	"default": {
	"description": "unexpected error",
	"schema": {
		"$ref": "#/definitions/ErrorModel"
	}
	}
}
*/
export const generateResponse = ({ route, allSpec }: IProps) => {
    const responseInterface = allSpec.interfaces.find((i) => i.id === route.responseInterfaceId);

    if (responseInterface?.extendedInterfaces?.length) {
        const { genericArguments: genericArguments } = getGenericArguments(responseInterface.extendedInterfaces[0]);
        // console.log('genericArguments', responseInterface.extendedInterfaces[0], genericArguments);
        if (genericArguments?.length) {
            const [successName, errorName] = genericArguments;
            const success = generateSuccessResponse({ name: successName });
            const error = generateErrorResponse({ name: errorName });

            return {
                ...success,
                ...error,
            };
        }
    }
    return {};
};

export const generateSuccessResponse = ({ name }: { name: string }) => {
    if (name) {
        if (name === 'void') {
            return {};
        }
        if (isArray(name)) {
            const arrayItemName = name.replace('[]', '');
            if (isSimpleType(arrayItemName)) {
                return {
                    '200': {
                        content: {
                            'application/json': {
                                schema: {
                                    type: getSpecTypeFromJsType(name),
                                },
                            },
                        },
                    },
                };
            }
            return {
                '200': {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: `#/components/schemas/${arrayItemName}`,
                                },
                            },
                        },
                    },
                },
            };
        } else if (isSimpleType(name)) {
            return {
                '200': {
                    content: {
                        'application/json': {
                            schema: {
                                type: getSpecTypeFromJsType(name),
                            },
                        },
                    },
                },
            };
        } else {
            return {
                '200': {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${name}`,
                            },
                        },
                    },
                },
            };
        }
    }
    return {};
};

export const generateErrorResponse = ({ name }: { name: string }) => {
    if (name === 'void') {
        return {};
    }
    if (name) {
        if (isArray(name)) {
            const arrayItemName = name.replace('[]', '');
            return {
                '400': {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: `#/components/schemas/${arrayItemName}`,
                                },
                            },
                        },
                    },
                },
            };
        } else if (isSimpleType(name)) {
            return {
                '400': {
                    content: {
                        'application/json': {
                            schema: {
                                type: getSpecTypeFromJsType(name),
                            },
                        },
                    },
                },
            };
        } else {
            return {
                '400': {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${name}`,
                            },
                        },
                    },
                },
            };
        }
    }
    return {};
};
