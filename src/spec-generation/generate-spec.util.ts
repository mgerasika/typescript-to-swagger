import { getSpecInfoAsync } from '../utils/get-spec-info';
import { generateDefinitions } from './generate-definitions.util';
import { generateMethodParameters, generateRequestBodyParameter } from './generate-parameters.util';
import { generateResponse } from './generate-response.util';

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
                        operationId: '',
                        summary: '',
                        parameters: generateMethodParameters({ route, allSpec }),
                        requestBody: generateRequestBodyParameter({ route, allSpec }),
                        responses: generateResponse({ route, allSpec }),
                    },
                },
            };
        }, {});

        const definitions = generateDefinitions({ allSpec });

        return {
            paths,
            components: {
                schemas: { ...definitions },
            },
        };
    });
};
