import {
  SW_METHOD_FILE_EXTENSION,
  SW_METHOD_FOLDER_NAME,
  SW_METHOD_INDEX_PROPERTY_NAME,
  SW_METHOD_SUFFIX,
  SW_PARAMETER_FILE_EXTENSION,
  SW_PARAMETER_FOLDER_NAME,
  SW_PARAMETER_INDEX_PROPERTY_NAME,
  SW_PARAMETER_SUFFIX,
  SW_SCHEMA_FILE_EXTENSION,
  SW_SCHEMA_FOLDER_NAME,
  SW_SCHEMA_INDEX_PROPERTY_NAME,
  SW_SCHEMA_SUFFIX,
  SW_TAG_FILE_EXTENSION,
  SW_TAG_FOLDER_NAME,
  SW_TAG_INDEX_PROPERTY_NAME,
  SW_TAG_SUFFIX,
} from '../app.constant';
import { SwaggerDocumentType } from '../enum/swagger-document-type.enum';
import { SwaggerRoutable } from '../interface/swagger-routable.interface';
import * as fs from 'fs';
import * as prettier from 'prettier';
import * as Path from 'path';
import { SwaggerRoute } from '../interface/swagger-route.interface';
import { SwaggerTemplateType } from '../enum/swagger-template-type.enum';
import { SwaggerWithContent } from '../interface/swagger-with-content.interface';
import { SwaggerSecurityScheme } from '../enum/swagger-security-scheme.enum';

export class FileUtil {
  /**
   * Gets file name without extension
   * @param fileName File name with extension
   * @returns File name without extension
   */
  getFileNameWithoutExtension = (fileName: string) => {
    return Path.parse(fileName).name;
  };

  /**
   * Formats document
   * @param document Unformatted document
   * @returns Formatted document
   */
  formatDocument = (document: string) => {
    return prettier.format(document, {
      parser: 'typescript',
    });
  };

  /**
   * Gets template content by template type
   * @param type Swagger template type
   * @returns Template content
   */
  getTemplateContent = (type: SwaggerTemplateType) => {
    var templateFilePath = Path.resolve(
      __dirname,
      '../template/' + type.toString() + '.template'
    );
    return fs.readFileSync(templateFilePath, 'utf8');
  };

  /**
   * Gets folder path of swagger document
   * @param swaggerPath Swagger path
   * @param type Swagger document type
   * @returns Folder path
   */
  getFolderPath = (swaggerPath: string, type: SwaggerDocumentType) => {
    var folderPath = '';
    switch (type) {
      case SwaggerDocumentType.SCHEMA:
        folderPath = SW_SCHEMA_FOLDER_NAME;
        break;
      case SwaggerDocumentType.TAG:
        folderPath = SW_TAG_FOLDER_NAME;
        break;
      case SwaggerDocumentType.METHOD:
        folderPath = SW_METHOD_FOLDER_NAME;
        break;
      case SwaggerDocumentType.PARAMETER:
        folderPath = SW_PARAMETER_FOLDER_NAME;
        break;
    }

    return Path.join(swaggerPath, folderPath);
  };

  /**
   * Gets index file name by document type
   * @param type Swagger document type
   * @returns Index file name
   */
  getIndexFileName = (type: SwaggerDocumentType) => {
    switch (type) {
      case SwaggerDocumentType.SCHEMA:
        return 'index' + SW_SCHEMA_FILE_EXTENSION;
      case SwaggerDocumentType.TAG:
        return 'index' + SW_TAG_FILE_EXTENSION;
      case SwaggerDocumentType.METHOD:
        return 'index' + SW_METHOD_FILE_EXTENSION;
      case SwaggerDocumentType.PARAMETER:
        return 'index' + SW_PARAMETER_FILE_EXTENSION;
      default:
        return '';
    }
  };

  /**
   * Gets formatted swagger example value
   * @param withContent Swagger content
   * @returns Formatted swagger example
   */
  getSwaggerExample = (withContent: SwaggerWithContent) => {
    if (withContent.type === 'string') return "'" + withContent.example + "'";
    else if (withContent.type === 'object')
      return JSON.stringify(withContent.example);

    return withContent.example;
  };

  /**
   * Gets index property name
   * @param type Swagger document type
   * @returns Index property name
   */
  getIndexPropName = (type: SwaggerDocumentType) => {
    switch (type) {
      case SwaggerDocumentType.SCHEMA:
        return SW_SCHEMA_INDEX_PROPERTY_NAME;
      case SwaggerDocumentType.TAG:
        return SW_TAG_INDEX_PROPERTY_NAME;
      case SwaggerDocumentType.METHOD:
        return SW_METHOD_INDEX_PROPERTY_NAME;
      case SwaggerDocumentType.PARAMETER:
        return SW_PARAMETER_INDEX_PROPERTY_NAME;
      default:
        return '';
    }
  };

  /**
   * Gets all attached routes
   * @param routable Swagger Routable
   * @returns All attached routes
   */
  getAttachedRoutes = (routable: Array<SwaggerRoutable>) => {
    return routable
      .map((r) => {
        return r.route.name;
      })
      .filter((v, i, a) => a.indexOf(v) === i);
  };

  /**
   * Creates document file if it does not exist
   * @param path File path
   * @param route Route name
   * @param ext File extension
   * @returns Created document file path
   */
  createDocumentFileIfNotExist = (path: string, route: string, ext: string) => {
    var filePath = Path.join(
      path,
      route
        .replace(/[<>:"\/\\|?*]+/g, '')
        .toLowerCase()
        .trim() + ext
    );

    this.createFolderIfNotExist(filePath);

    return filePath;
  };

  /**
   * Gets safe Typescript property name and adds suffix
   * @param propName Property name
   * @param type Swagger document type
   * @returns Safe property name with suffix
   */
  getSafeTsPropertyName = (propName: string, type: SwaggerDocumentType) => {
    const SAFE_STRING_REPLACE_REGEXP =
      /[^\p{Script=Latin}\p{Zs}\p{M}\p{Nd}'\s-]/u;
    var propName = propName.split(SAFE_STRING_REPLACE_REGEXP).join('');
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);
    switch (type) {
      case SwaggerDocumentType.SCHEMA:
        return propName + SW_SCHEMA_SUFFIX;
      case SwaggerDocumentType.TAG:
        return propName + SW_TAG_SUFFIX;
      case SwaggerDocumentType.METHOD:
        return propName + SW_METHOD_SUFFIX;
      case SwaggerDocumentType.PARAMETER:
        return propName + SW_PARAMETER_SUFFIX;
      default:
        return propName;
    }
  };

  /**
   * Gets main route from Swagger route
   * @param route Swagger route
   * @returns Main route
   */
  getMainRoute = (route: SwaggerRoute): string => {
    if (!route.parent) return route.name;

    return this.getMainRoute(route.parent);
  };

  /**
   * Gets full method path by iterating parent
   * @param route Swagger route
   * @param fullRoute Full route
   * @returns Full method path
   */
  getFullMethodPath = (route: SwaggerRoute, fullRoute: string): string => {
    fullRoute =
      (route.name.startsWith('/') ? route.name : '/' + route.name) + fullRoute;
    if (!route.parent) return fullRoute;
    return this.getFullMethodPath(route.parent, fullRoute);
  };

  /**
   * Gets applicable security scheme
   * @param scheme Security Scheme
   * @returns Applicable Security Scheme
   */
  getSecurityScheme = (scheme?: SwaggerSecurityScheme) => {
    if (!scheme) return '';

    switch (scheme) {
      case SwaggerSecurityScheme.BEARER:
        return '{ BearerAuth: [] }';
      default:
        return '';
    }
  };

  /**
   * Creates folder if it does not exist
   * @param filePath File path
   */
  createFolderIfNotExist = (filePath: string) => {
    var folderName = Path.dirname(filePath);

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }
  };
}
