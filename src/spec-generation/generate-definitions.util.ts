import { getGenericArguments } from '../utils/get-generic-arguments.util';
import { IEnumInfo } from '../interfaces/enum-info.interface';
import { IInfo } from '../interfaces/info.interface';
import { IInterfaceInfo } from '../interfaces/interface-info.interface';
import { getSpecTypeFromJsType } from '../utils/get-spec-type-from-js-type.util';
import { isExternalDefinition } from '../utils/is-external-definition.util';
import { getInterfaceName } from '../utils/get-interface-name.util';
import { getOmitFields } from '../utils/get-omit-fields.utils';
import { getPickFields } from '../utils/get-pick-fields.util';
import { isJsSubObject } from '../utils/is-js-sub-object.util';

interface IProps {
    allSpec: IInfo;
}

export const generateDefinitions = ({ allSpec }: IProps) => {
    return allSpec.routes.reduce((result, route) => {
        const requestInterface = allSpec.interfaces.find((i) => i.id === route.requestInterfaceId);

        result = addSchemasRecursive({
            result: result,
            inputStringOrData: requestInterface?.data?.body,
            allSpec,
        });

        const responseInterface = allSpec.interfaces.find((i) => i.id === route.responseInterfaceId);
        if (responseInterface && responseInterface.extendedInterfaces?.length) {
            const { genericArguments: argumentTypes } = getGenericArguments(responseInterface.extendedInterfaces[0]) || [];

            argumentTypes?.forEach((argumentType) => {
                if (argumentType) {
                    result = addSchemasRecursive({
                        result,
                        inputStringOrData: argumentType,
                        allSpec,
                    });
                }
            });
        }
        return result;
    }, {});
};

// Example input
// {
//     body: IPostUser;
//     color: string;
//     metadata: { subObject: IPostUser }
// }
// find all schemas and add to output definitions
const addSchemasRecursive = ({
    inputStringOrData,
    result,
    allSpec,
}: {
    allSpec: IInfo;
    inputStringOrData: any;
    result: any;
}) => {
    if (isJsSubObject(inputStringOrData)) {
        Object.values(inputStringOrData).forEach((value) => {
            result = addSchemasRecursive({ allSpec, inputStringOrData: value, result });
        });
    } else if (typeof inputStringOrData === 'string' && isExternalDefinition(inputStringOrData)) {
        const { genericArguments: genericArguments } = getGenericArguments(inputStringOrData);

        inputStringOrData = getInterfaceName(inputStringOrData);
        if (genericArguments?.length) {
            genericArguments?.forEach((genericArgument) => {
                if (isExternalDefinition(genericArgument)) {
                    result = addSchemasRecursive({
                        allSpec,
                        result,
                        inputStringOrData: genericArgument,
                    });
                }
            });
        }

        const interfaceInfo = allSpec.interfaces.find((i) => i.name === inputStringOrData);
        if (interfaceInfo) {
            // replace omit/pick fields if need
            const newFields = getFieldsRecursive({
                allSpec,
                interfaceName: inputStringOrData,
                fields: interfaceInfo.data,
            });
            interfaceInfo.data = newFields;

            result = { ...result, ...generateDefinition({ interfaceInfo }) };
        }

        // Try find another related interfaces
        if (interfaceInfo) {
            Object.values(interfaceInfo.data).forEach((value) => {
                if (isJsSubObject(value)) {
                    result = addSchemasRecursive({ allSpec, inputStringOrData: value, result });
                } else {
                    value = value?.toString().replace('[]', '');
                    if (isExternalDefinition(value)) {
                        result = addSchemasRecursive({
                            inputStringOrData: value as string,
                            allSpec,
                            result,
                        });
                    }
                }
            });
        } else {
            const enumInfo = allSpec.enums.find((i) => i.name === inputStringOrData);
            if (enumInfo) {
                result = { ...result, ...generateDefinition({ enumInfo: enumInfo }) };
                Object.values(enumInfo.data).forEach((value) => {
                    if (isExternalDefinition(value)) {
                        result = addSchemasRecursive({
                            inputStringOrData: value as string,
                            allSpec,
                            result,
                        });
                    }
                });
            }
        }
    }

    return result;
};

const getFieldsRecursive = ({
    interfaceName,
    fields,
    allSpec,
}: {
    allSpec: IInfo;
    interfaceName: string | undefined;
    fields: any;
}) => {
    const omitFields = getOmitFields(interfaceName);
    const pickFields = getPickFields(interfaceName);

    interfaceName = getInterfaceName(interfaceName);
    if (isExternalDefinition(interfaceName)) {
        const interfaceInfo = allSpec.interfaces.find((i) => i.name === interfaceName);
        if (interfaceInfo) {
            let newFields = interfaceInfo.extendedInterfaces
                ?.map((extendedInterfaceName) => {
                    return getFieldsRecursive({
                        allSpec,
                        interfaceName: extendedInterfaceName,
                        fields: fields,
                    });
                })
                .filter((f) => f);

            if (newFields?.length) {
                newFields = newFields.reduce(
                    (acc, it) => {
                        acc = { ...it, ...acc };
                        return acc;
                    },
                    { ...interfaceInfo.data },
                );
                fields = { ...newFields, ...fields };
            } else {
                fields = { ...newFields, ...interfaceInfo.data };
            }
        }
        if (omitFields.fields?.length) {
            Object.keys(fields).forEach((fieldName) => {
                const newFieldName = fieldName.replace('?', '');
                if (omitFields.fields?.includes(newFieldName)) {
                    delete fields[fieldName];
                }
            });
        }
        if (pickFields.fields?.length) {
            Object.keys(fields).forEach((fieldName) => {
                const newFieldName = fieldName.replace('?', '');
                if (!pickFields.fields?.includes(newFieldName)) {
                    delete fields[fieldName];
                }
            });
        }
    }
    return fields;
};

/*
 "definitions": {
    "Pet": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/definitions/NewPet"
        },
        {
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "type": "integer",
              "format": "int64"
            }
          }
        }
      ]
    },
    "NewPet": {
      "type": "object",
      "required": [
        "name"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      }
    },
*/
export const generateDefinition = ({
    interfaceInfo,
    enumInfo,
}: {
    interfaceInfo?: IInterfaceInfo;
    enumInfo?: IEnumInfo;
}) => {
    if (interfaceInfo) {
        return {
            [interfaceInfo.name]: {
                ...generateProperties(interfaceInfo.data),
            },
        };
    }
    if (enumInfo) {
        return {
            [enumInfo.name]: {
                type: 'string',
                enum: Object.values(enumInfo.data),
            },
        };
    }
};

export const generateProperties = (data: any): any => {
    if (!data) {
        return undefined;
    }
    return {
        type: 'object',
        required: data
            ? Object.keys(data)
                  .map((key) => (!key.includes('?') ? key : undefined))
                  .filter((f) => f)
            : undefined,
        properties: Object.keys(data).reduce((acc, key) => {
            const name = key.replace('?', '');
            const value = data[key];
            const type = getSpecTypeFromJsType(value);
            if (type === 'object') {
                return {
                    ...acc,
                    [name]: generateProperties(value),
                };
            }
            return {
                ...acc,
                [name]: {
                    type,
                },
            };
        }, {}),
    };
};
