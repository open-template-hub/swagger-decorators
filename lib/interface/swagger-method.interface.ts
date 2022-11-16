import { HttpMethod } from '../enum/http-method.enum';
import { SwaggerSecurityScheme } from '../enum/swagger-security-scheme.enum';
import { SwaggerRequestBody } from './swagger-request-body.interface';
import { SwaggerResponse } from './swagger-response.interface';
import { SwaggerRoute } from './swagger-route.interface';
import { SwaggerTag } from './swagger-tag.interface';

/**
 * Swagger method interface
 */
export interface SwaggerMethod {
  route: SwaggerRoute;
  name: string;
  summary: string;
  description: string;
  httpMethod: HttpMethod;
  responses: Array<SwaggerResponse>;
  security?: SwaggerSecurityScheme;
  tags?: Array<SwaggerTag>;
  parameterSchemas?: Array<string>;
  requestBody?: SwaggerRequestBody;
}
