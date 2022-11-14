import { SwaggerDocumentType } from '../enum/swagger-document-type.enum';

export interface SwaggerDocument {
  route: string;
  filePath: string;
  content: string;
  type: SwaggerDocumentType;
}
