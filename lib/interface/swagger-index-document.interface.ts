import { SwaggerDocumentType } from '../enum/swagger-document-type.enum';

export interface SwaggerIndexDocument {
  propertyNames?: string;
  imports?: string;
  type: SwaggerDocumentType;
}
