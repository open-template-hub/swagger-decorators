import { SW_EMPTY } from '../app.constant';
import { SwaggerDocumentation } from '../controller/swagger-documentation.controller';
import { SwaggerSchemaType } from '../enum/swagger-schema-type.enum';
import { SwaggerParameter } from '../interface/swagger-parameter.interface';
import { SwaggerProperty } from '../interface/swagger-property.interface';
import { SwaggerRoute } from '../interface/swagger-route.interface';

/**
 * Swagger schema decorator to define new schema
 * @param route Schema route
 * @param isParameterSchema True if the schema is parameter schema
 * @returns
 */
export function SwSchema(route: SwaggerRoute, isParameterSchema?: boolean) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    SwaggerDocumentation.getInstance().addSchema({
      name: constructor.name,
      route: route,
      type: isParameterSchema
        ? SwaggerSchemaType.PARAMETER_SCHEMA
        : SwaggerSchemaType.PROPERTY_SCHEMA,
    });

    var inst = new constructor();
    var propNames = Object.getOwnPropertyNames(inst);
    for (let key of propNames) {
      const descriptor = Object.getOwnPropertyDescriptor(inst, key);
      var doc = {
        name: key,
        schema: constructor.name,
        example: descriptor?.value,
        description: SW_EMPTY,
        type: typeof descriptor?.value,
      };

      if (isParameterSchema) {
        SwaggerDocumentation.getInstance().addOrUpdateParameter(
          doc as SwaggerParameter
        );
      } else {
        SwaggerDocumentation.getInstance().addOrUpdateProperty(
          doc as SwaggerProperty
        );
      }
    }
  };
}
