import { SwaggerWithContent } from './swagger-with-content.interface';

export interface SwaggerProperty extends SwaggerWithContent {
  name: string;
  schema: string;
  description: string;
}
