import { SwaggerDocumentation } from '../controller/swagger-documentation.controller';

/**
 * Swagger property decorator to define new property
 * @param comment Property description
 * @param required Is property required
 * @returns
 */
export function SwProp( comment: string, required?: boolean ) {
  return ( target: Object, propertyKey: string | symbol ) => {
    SwaggerDocumentation.getInstance().addOrUpdateProperty( {
      name: propertyKey.toString(),
      schema: target.constructor.name,
      description: comment,
      required,
    } );
  };
}
