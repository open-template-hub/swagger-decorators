import { SwaggerDocumentation } from '../controller/swagger-documentation.controller';
import { ParameterIn } from '../enum/parameter-in.enum';

/**
 * Swagger parameter decorator to define new parameter
 * @param comment Parameter description
 * @param paramIn Parameter in query or path etc.
 * @param required Is parameter required
 * @returns
 */
export function SwParam(
  comment: string,
  paramIn: ParameterIn,
  required?: boolean
) {
  return (target: Object, propertyKey: string | symbol) => {
    SwaggerDocumentation.getInstance().addOrUpdateParameter({
      name: propertyKey.toString(),
      schema: target.constructor.name,
      description: comment,
      required,
      paramIn,
    });
  };
}
