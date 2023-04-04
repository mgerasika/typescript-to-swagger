import { IInfo } from "../interfaces/info.interface";
import { IRouteInfo } from "../interfaces/route-info.interface";

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
  const requestInterface = allSpec.interfaces.find(
    (i) => i.id === route.requestInterfaceId
  );
  const responseInterface = allSpec.interfaces.find(
    (i) => i.id === route.responseInterfaceId
  );
};
