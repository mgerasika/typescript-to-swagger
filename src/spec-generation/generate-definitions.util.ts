import { getGenericTypes } from '../utils/get-generic-types.util';
import { IEnumInfo } from '../interfaces/enum-info.interface';
import { IInfo } from '../interfaces/info.interface';
import { IInterfaceInfo } from '../interfaces/interface-info.interface';
import { getSpecTypeFromJsType } from '../utils/get-spec-type-from-js-type.util';
import { isExternalDefinition } from '../utils/is-external-definition.util';
import { getInterfaceName } from './get-interface-name.util';
import { getOmitFields } from '../utils/get-omit-fields.utils';
import { getPickFields } from '../utils/get-pick-fields.util';

interface IProps {
    allSpec: IInfo;
}

export const generateDefinitions = ({ allSpec }: IProps) => {
    return allSpec.routes.reduce((result, route) => {
        const requestInterface = allSpec.interfaces.find((i) => i.id === route.requestInterfaceId);

        const body = requestInterface?.data?.body;
        result = addSchemasRecursive({ result: result, interfaceName: body, allSpec });

        const responseInterface = allSpec.interfaces.find((i) => i.id === route.responseInterfaceId);
        if (responseInterface && responseInterface.extendedInterfaces?.length) {
            const { fields: argumentTypes } = getGenericTypes(responseInterface.extendedInterfaces[0]) || [];

            argumentTypes?.forEach((argumentType) => {
                if (argumentType) {
                    result = addSchemasRecursive({ result, interfaceName: argumentType || '', allSpec });
                }
            });
        }
        return result;
    }, {});
};

const addSchemasRecursive = ({
    interfaceName,
    result,
    allSpec,
}: {
    allSpec: IInfo;
    interfaceName: string | undefined;
    result: any;
}) => {
    const { fields: genericArguments } = getGenericTypes(interfaceName);

    interfaceName = getInterfaceName(interfaceName);
    if (genericArguments?.length) {
        genericArguments?.forEach((genericArgument) => {
            if (isExternalDefinition(genericArgument)) {
                result = addSchemasRecursive({ allSpec, result, interfaceName: genericArgument });
            }
        });
    }

    if (isExternalDefinition(interfaceName)) {
        const interfaceInfo = allSpec.interfaces.find((i) => i.name === interfaceName);
        if (interfaceInfo) {
            const newData = getFieldsRecursive({ allSpec, interfaceName: interfaceName, fields: interfaceInfo.data });
            interfaceInfo.data = { ...newData, ...interfaceInfo.data };

            result = { ...result, ...generateDefinition({ interfaceInfo }) };
            Object.values(interfaceInfo.data).forEach((value) => {
                value = value?.toString().replace('[]', '');
                if (isExternalDefinition(value)) {
                    result = addSchemasRecursive({ interfaceName: value as string, allSpec, result });
                }
            });
        } else {
            const enumInfo = allSpec.enums.find((i) => i.name === interfaceName);
            if (enumInfo) {
                result = { ...result, ...generateDefinition({ enumInfo: enumInfo }) };
                Object.values(enumInfo.data).forEach((value) => {
                    if (isExternalDefinition(value)) {
                        result = addSchemasRecursive({ interfaceName: value as string, allSpec, result });
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
                    return getFieldsRecursive({ allSpec, interfaceName: extendedInterfaceName, fields: fields });
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
                fieldName = fieldName.replace('?', '');
                if (omitFields.fields?.includes(fieldName)) {
                    delete fields[fieldName];
                }
            });
        }
        if (pickFields.fields?.length) {
            Object.keys(fields).forEach((fieldName) => {
                fieldName = fieldName.replace('?', '');
                if (!pickFields.fields?.includes(fieldName)) {
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
                type: 'object',
                required: interfaceInfo.data
                    ? Object.keys(interfaceInfo.data)
                          .map((key) => (!key.includes('?') ? key : undefined))
                          .filter((f) => f)
                    : undefined,
                properties: interfaceInfo.data
                    ? Object.keys(interfaceInfo.data).reduce((acc, key) => {
                          const name = key.replace('?', '');
                          return {
                              ...acc,
                              [name]: {
                                  type: getSpecTypeFromJsType(interfaceInfo.data[key]),
                              },
                          };
                      }, {})
                    : undefined,
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
