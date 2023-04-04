import { getSpecInfoAsync } from "../utils/get-spec-info";
import { generateDefinitions } from "./generate-definitions.util";
import { generateParameters } from "./generate-parameters.util";
import { generateResponse } from "./generate-response.util";

interface IProps {
  dir: string[];
}

export const generateSpecAsync = ({ dir }: IProps): Promise<any> => {
  return getSpecInfoAsync({ dir }).then((allSpec) => {
    const paths = allSpec.routes.reduce((acc, route) => {
      return {
        ...acc,
        [route.url]: {
          [route.httpMethod]: {
            operationId: "",
            summary: "",
            parameters: generateParameters({ route, allSpec }),
            responses: generateResponse({ route, allSpec }),
          },
        },
      };
    }, {});

    const definitions = generateDefinitions({ allSpec });

    return {
      paths,
      definitions,
    };
  });
};
