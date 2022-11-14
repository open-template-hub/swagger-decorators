import { SwaggerSchema } from './swagger-schema.interface';

export interface SwaggerContent {
  schema: SwaggerSchema;
  arrayOf?: boolean;
}
