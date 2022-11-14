import { SwaggerDocumentation } from '../controller/swagger-documentation.controller';
import { SwaggerTag } from '../interface/swagger-tag.interface';

/**
 * Swagger tag decorator to define new tag
 * @param tag Swagger tag
 * @returns
 */
export function SwTag(tag: SwaggerTag) {
  SwaggerDocumentation.getInstance().addTag(tag);
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {};
}
