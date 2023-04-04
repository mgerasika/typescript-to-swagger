import { IInfo } from "../interfaces/info.interface";
import { IInterfaceInfo } from "../interfaces/interface-info.interface";
import { IRouteInfo } from "../interfaces/route-info.interface";
import { getSpecInfoAsync } from "../utils/get-spec-info";
import { getSpecTypeFromJsType } from "../utils/get-spec-type-from-js-type.util";
import { isExternalDefinition } from "../utils/is-external-definition.util";
import { generateParameters } from "./generate-parameters.util";
import { generateResponse } from "./generate-response.util";

interface IProps {
  allSpec: IInfo;
}

export const generateDefinitions = ({ allSpec }: IProps) => {
  return allSpec.routes.reduce((acc, route) => {
    const requestInterface = allSpec.interfaces.find(
      (i) => i.id === route.requestInterfaceId
    );

    const body = requestInterface?.data?.body;
    if (isExternalDefinition(body)) {
      const interfaceInfo = allSpec.interfaces.find((i) => i.name === body);
      if (interfaceInfo) {
        acc = { ...acc, ...generateDefinition({ interfaceInfo }) };
      }
    }
    const responseInterface = allSpec.interfaces.find(
      (i) => i.id === route.responseInterfaceId
    );

    if (isExternalDefinition(requestInterface?.data)) {
    }
    return {
      ...acc,
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
}: {
  interfaceInfo: IInterfaceInfo;
}) => {
  return {
    [interfaceInfo.name]: {
      type: "object",
      properties: interfaceInfo.data
        ? Object.keys(interfaceInfo.data).reduce((acc, key) => {
            return {
              ...acc,
              [key]: {
                type: getSpecTypeFromJsType(interfaceInfo.data[key]),
              },
            };
          }, {})
        : undefined,
    },
  };
};
