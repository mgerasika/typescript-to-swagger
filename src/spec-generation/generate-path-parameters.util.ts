import { getSpecPropertyName } from "../utils/get-spec-property-name.util";
import { getSpecTypeFromJsType } from "../utils/get-spec-type-from-js-type.util";

interface IProps {
  params: any;
}
/*
 "parameters": [
	
	{
		"name": "limit",
		"in": "path",
		"description": "maximum number of results to return",
		"required": false,
		"type": "integer",
		"format": "int32"
	}
],
*/
export const generatePathParameters = ({ params }: IProps): any[] => {
  return Object.keys(params).map((key) => {
    return {
      name: getSpecPropertyName(key),
      in: "path",
      required: !key.includes("?"),
      schema: {
        type: getSpecTypeFromJsType(params[key]),
      },
    };
  });
};
