import { ParameterIn } from '../enum/parameter-in.enum';
import { SwaggerWithContent } from './swagger-with-content.interface';

export interface SwaggerParameter extends SwaggerWithContent {
  name: string;
  paramIn: ParameterIn;
  schema: string;
  description: string;
}
