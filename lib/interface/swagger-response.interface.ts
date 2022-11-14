import { SwaggerContent } from './swagger-content.interface';

export interface SwaggerResponse {
  responseCode: number;
  description: string;
  content: SwaggerContent;
}
