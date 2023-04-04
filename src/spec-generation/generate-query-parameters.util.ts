import { getSpecPropertyName } from "../utils/get-spec-property-name.util";
import { getSpecTypeFromJsType } from "../utils/get-spec-type-from-js-type.util";

interface IProps {
  query: any;
}
/*
 "parameters": [
	{
		"name": "limit",
		"in": "query",
		"description": "maximum number of results to return",
		"required": false,
		"type": "integer",
		"format": "int32"
	}
],
*/

export const generateQueryParameters = ({ query }: IProps): any[] => {
  return Object.keys(query).map((key) => {
    return {
      name: getSpecPropertyName(key),
      in: "query",
      type: getSpecTypeFromJsType(query[key]),
      required: !key.includes("?"),
    };
  });
};
