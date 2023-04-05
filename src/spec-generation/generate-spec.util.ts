import { getSpecInfoAsync } from '../utils/get-spec-info';
import { generateDefinitions } from './generate-definitions.util';
import { generateMethodParameters, generateRequestBodyParameter } from './generate-parameters.util';
import { generateResponse } from './generate-response.util';

interface IProps {
    dir: string[];
}

export const generateSpecAsync = ({ dir }: IProps): Promise<any> => {
    return getSpecInfoAsync({ dir }).then((allSpec) => {
        const paths = allSpec.routes.reduce((acc: any, route) => {
            if (acc[route.url] && acc[route.url][route.httpMethod]) {
                throw `This url already used ${route.httpMethod} ${route.url}. File name = ${route.filePath}`;
            }
            return {
                ...acc,
                [route.url]: {
                    ...(acc && acc[route.url] ? acc[route.url] : {}),
                    [route.httpMethod]: {
                        operationId: '',
                        summary: '',
                        parameters: generateMethodParameters({ route, allSpec }),
                        requestBody: generateRequestBodyParameter({ route, allSpec }),
                        responses: generateResponse({ route, allSpec }),
                    },
                },
            };
        }, {});

        const schemas = generateDefinitions({ allSpec });

        return {
            paths,
            components: {
                schemas: { ...schemas },
            },
        };
    });
};
