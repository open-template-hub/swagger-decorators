import { SwaggerContent } from './swagger-content.interface';

export interface SwaggerRequestBody {
  content: SwaggerContent;
  required: boolean;
}
