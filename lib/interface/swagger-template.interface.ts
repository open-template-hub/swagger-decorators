import { SwaggerTemplateType } from '../enum/swagger-template-type.enum';

export interface SwaggerTemplate {
  type: SwaggerTemplateType;
  content: string;
}
