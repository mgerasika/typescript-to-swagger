import { getSpecPropertyName } from "../utils/get-spec-property-name.util";
import { getSpecTypeFromJsType } from "../utils/get-spec-type-from-js-type.util";
import { isExternalDefinition } from "../utils/is-external-definition.util";

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
  if (Object.keys(body).length === 1 && typeof body !== "string") {
    return Object.keys(body).map((key) => {
      return {
        name: getSpecPropertyName(key),
        in: "body",
        type: getSpecTypeFromJsType(body[key]),
        required: true,
      };
    })[0];
  } else if (isExternalDefinition(body)) {
    return {
      in: "body",
      schema: {
        $ref: `#/definitions/${body}`,
      },
      required: true,
    };
  } else {
    return {
      in: "body",
      type: getSpecTypeFromJsType(body),
      required: true,
    };
  }
};
