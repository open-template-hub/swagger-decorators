import { SwaggerDocumentation } from '../controller/swagger-documentation.controller';
import { SwaggerMethod } from '../interface/swagger-method.interface';

/**
 * Swagger method decorator to define new method
 * @param method Swagger Method
 * @returns
 */
export function SwMethod( method: SwaggerMethod ) {
  SwaggerDocumentation.getInstance().addMethod( method );
  return <T>(
      target: Object,
      propertyKey: string | symbol,
      descriptor?: TypedPropertyDescriptor<T>
  ) => {
  };
}
