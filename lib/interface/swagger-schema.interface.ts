import { SwaggerSchemaType } from '../enum/swagger-schema-type.enum';
import { SwaggerRoutable } from './swagger-routable.interface';

export interface SwaggerSchema extends SwaggerRoutable {
  name: string;
  type: SwaggerSchemaType;
}
