import { IEnumInfo } from '../interfaces/enum-info.interface';
import { IInfo } from '../interfaces/info.interface';
import { IInterfaceInfo } from '../interfaces/interface-info.interface';
import { getSpecTypeFromJsType } from '../utils/get-spec-type-from-js-type.util';
import { isExternalDefinition } from '../utils/is-external-definition.util';

interface IProps {
    allSpec: IInfo;
}

const addSchemasRecursive = ({ body, result, allSpec }: { allSpec: IInfo; body: any; result: any }) => {
    if (isExternalDefinition(body)) {
        const interfaceInfo = allSpec.interfaces.find((i) => i.name === body);
        if (interfaceInfo) {
            result = { ...result, ...generateDefinition({ interfaceInfo }) };
            Object.values(interfaceInfo.data).forEach((value) => {
                if (isExternalDefinition(value)) {
                    result = addSchemasRecursive({ body: value, allSpec, result });
                }
            });
        } else {
            const enumInfo = allSpec.enums.find((i) => i.name === body);
            if (enumInfo) {
                result = { ...result, ...generateDefinition({ enumInfo: enumInfo }) };
                Object.values(enumInfo.data).forEach((value) => {
                    if (isExternalDefinition(value)) {
                        result = addSchemasRecursive({ body: value, allSpec, result });
                    }
                });
            }
        }
    }
    return result;
};
export const generateDefinitions = ({ allSpec }: IProps) => {
    return allSpec.routes.reduce((result, route) => {
        const requestInterface = allSpec.interfaces.find((i) => i.id === route.requestInterfaceId);

        const body = requestInterface?.data?.body;
        result = addSchemasRecursive({ result: result, body, allSpec });
        // const responseInterface = allSpec.interfaces.find(
        //   (i) => i.id === route.responseInterfaceId
        // );

        if (isExternalDefinition(requestInterface?.data)) {
        }
        return {
            ...result,
        };
    }, {});
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
