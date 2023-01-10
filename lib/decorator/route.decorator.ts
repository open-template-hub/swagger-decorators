import { SwaggerDocumentation } from '../controller/swagger-documentation.controller';
import { SwaggerRoute } from '../interface/swagger-route.interface';

/**
 * Swagger route decorator to define new route
 * @param route Swagger route
 * @returns
 */
export function SwRoute( route: SwaggerRoute ) {
  SwaggerDocumentation.getInstance().addRoute( route );
  return <T extends { new( ...args: any[] ): {} }>( constructor: T ) => {
  };
}
