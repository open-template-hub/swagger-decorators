import { SW_EMPTY } from '../app.constant';
import { SwaggerMethod } from '../interface/swagger-method.interface';
import { SwaggerParameter } from '../interface/swagger-parameter.interface';
import { SwaggerProperty } from '../interface/swagger-property.interface';
import { SwaggerRoute } from '../interface/swagger-route.interface';
import { SwaggerSchema } from '../interface/swagger-schema.interface';
import { SwaggerTag } from '../interface/swagger-tag.interface';
import { DocumentUtil } from '../util/document.util';
import { FileUtil } from '../util/file.util';

export class SwaggerDocumentation {
  private static _instance: SwaggerDocumentation;

  private routes: Array<SwaggerRoute> = [];
  private methods: Array<SwaggerMethod> = [];
  private tags: Array<SwaggerTag> = [];
  private schemas: Array<SwaggerSchema> = [];
  private parameters: Array<SwaggerParameter> = [];
  private properties: Array<SwaggerProperty> = [];

  private constructor() {
  }

  /**
   * Gets Swagger documentation singleton instance
   * @returns Swagger documentation singleton instance
   */
  public static getInstance = () => {
    if ( !SwaggerDocumentation._instance ) {
      SwaggerDocumentation._instance = new SwaggerDocumentation();
    }
    return SwaggerDocumentation._instance;
  };

  /**
   * Generates Swagger documents
   * @param path Path to generate swagger documents
   */
  generateDocument = ( path: string ) => {
    const fileUtil = new FileUtil();

    const documentUtil = new DocumentUtil(
        fileUtil,
        this.methods,
        this.tags,
        this.schemas,
        this.parameters,
        this.properties
    );

    documentUtil.generateDocument( path );
  };

  printAll = () => {
    console.log( 'Routes: ', this.routes );
    console.log( 'Methods: ', this.methods );
    console.log( 'Tags: ', this.tags );
    console.log( 'Schemas: ', this.schemas );
    console.log( 'Properties: ', this.properties );
  };

  addRoute = async ( route: SwaggerRoute ) => {
    this.routes.push( route );
  };

  addMethod = async ( method: SwaggerMethod ) => {
    this.methods.push( method );
  };

  addTag = async ( tag: SwaggerTag ) => {
    this.tags.push( tag );
  };

  addSchema = async ( schema: SwaggerSchema ) => {
    this.schemas.push( schema );
  };

  addOrUpdateProperty = async ( prop: SwaggerProperty ) => {
    var query = ( p: SwaggerProperty ) =>
        p.name === prop.name && p.schema === prop.schema;
    var exProp = this.properties.find( query );
    var index = this.properties.findIndex( query );
    if ( exProp ) {
      var tmpProp = exProp;
      if ( tmpProp.description === SW_EMPTY ) {
        tmpProp.description = prop.description;
      } else {
        tmpProp.example = prop.example;
        tmpProp.name = prop.name;
        tmpProp.schema = prop.schema;
        tmpProp.type = prop.type;
      }

      this.properties[ index ] = tmpProp;
    } else {
      this.properties.push( prop );
    }
  };

  addOrUpdateParameter = async ( param: SwaggerParameter ) => {
    var query = ( p: SwaggerParameter ) =>
        p.name === param.name && p.schema === param.schema;
    var exParam = this.parameters.find( query );
    var index = this.parameters.findIndex( query );
    if ( exParam ) {
      var tmpParam = exParam;
      if ( tmpParam.description === SW_EMPTY ) {
        tmpParam.description = param.description;
        tmpParam.paramIn = param.paramIn;
      } else {
        tmpParam.example = param.example;
        tmpParam.name = param.name;
        tmpParam.schema = param.schema;
        tmpParam.type = param.type;
      }

      this.parameters[ index ] = tmpParam;
    } else {
      this.parameters.push( param );
    }
  };
}
