import * as fs from 'fs';
import * as Path from 'path';
import {
  SW_DATA_TYPES,
  SW_DEFAULT_PROPERTY_TYPE,
  SW_EMPTY,
  SW_FOLDER_NAME,
  SW_METHOD_FILE_EXTENSION,
  SW_METHOD_FOLDER_NAME,
  SW_PARAMETER_FILE_EXTENSION,
  SW_PARAMETER_FOLDER_NAME,
  SW_SCHEMA_FILE_EXTENSION,
  SW_SCHEMA_FOLDER_NAME,
  SW_SPEC_FILE_NAME,
  SW_TAG_FILE_EXTENSION,
  SW_TAG_FOLDER_NAME,
} from '../app.constant';
import { SwaggerDocumentType } from '../enum/swagger-document-type.enum';
import { SwaggerSchemaType } from '../enum/swagger-schema-type.enum';
import { SwaggerTemplateType } from '../enum/swagger-template-type.enum';
import { SwaggerDocument } from '../interface/swagger-document.interface';
import { SwaggerIndexDocument } from '../interface/swagger-index-document.interface';
import { SwaggerMethodDocument } from '../interface/swagger-method-document.interface';
import { SwaggerMethod } from '../interface/swagger-method.interface';
import { SwaggerParameter } from '../interface/swagger-parameter.interface';
import { SwaggerProperty } from '../interface/swagger-property.interface';
import { SwaggerRouteMethod } from '../interface/swagger-route-method.interface';
import { SwaggerSchema } from '../interface/swagger-schema.interface';
import { SwaggerTag } from '../interface/swagger-tag.interface';
import { SwaggerTemplate } from '../interface/swagger-template.interface';
import { FileUtil } from './file.util';

export class DocumentUtil {
  private swaggerDocuments: Array<SwaggerDocument> = [];
  private swaggerTemplates: Array<SwaggerTemplate> = [];
  private indexDocuments: Array<SwaggerIndexDocument> = [];

  constructor(
      private fileUtil: FileUtil,
      private methods: Array<SwaggerMethod>,
      private tags: Array<SwaggerTag>,
      private schemas: Array<SwaggerSchema>,
      private parameters: Array<SwaggerParameter>,
      private properties: Array<SwaggerProperty>
  ) {
  }

  /**
   * Loads Swagger templates
   */
  loadSwaggerTemplates = () => {
    Object.values( SwaggerTemplateType ).forEach( ( t: SwaggerTemplateType ) => {
      this.addSwaggerTemplate( t );
    } );
  };

  /**
   * Adds swagger template by type
   * @param type Swagger template type
   */
  addSwaggerTemplate = ( type: SwaggerTemplateType ) => {
    this.swaggerTemplates.push( {
      type,
      content: this.fileUtil.getTemplateContent( type ),
    } as SwaggerTemplate );
  };

  /**
   * Gets Swagger template content
   * @param type Swagger template type
   * @returns Template content if exists, if not empty
   */
  getSwaggerTemplateContent = ( type: SwaggerTemplateType ): string => {
    const template = this.swaggerTemplates.find( ( t ) => t.type === type );
    if ( template ) {
      return template.content;
    } else {
      return SW_EMPTY;
    }
  };

  /**
   * Generates Swagger documents
   * @param path Path where to store Swagger documents
   */
  generateDocument = ( path: string ) => {
    try {
      console.log( 'Generating Swagger documents..' );
      const swaggerPath = Path.join( path, SW_FOLDER_NAME );

      // Set schema folder path
      const schemaPath = this.fileUtil.getFolderPath(
          swaggerPath,
          SwaggerDocumentType.SCHEMA
      );

      // Load swagger templates
      this.loadSwaggerTemplates();

      // Generate Indexes
      this.generateIndexes();

      console.log( 'Templates are loaded and indexes are generated..' );

      // Cleanup swagger schemas
      fs.rmSync( schemaPath, { recursive: true, force: true } );

      // Generate swagger schemas
      this.generateSchemas( schemaPath );

      console.log( 'Schemas are generated..' );

      // Set tag folder path
      const tagPath = this.fileUtil.getFolderPath(
          swaggerPath,
          SwaggerDocumentType.TAG
      );

      // Cleanup swagger tags
      fs.rmSync( tagPath, { recursive: true, force: true } );

      // Generate swagger tags
      this.generateTags( tagPath );

      console.log( 'Tags are generated..' );

      // Set parameter folder path
      const parameterPath = this.fileUtil.getFolderPath(
          swaggerPath,
          SwaggerDocumentType.PARAMETER
      );

      // Cleanup swagger parameters
      fs.rmSync( parameterPath, { recursive: true, force: true } );

      // Generate swagger parameters
      this.generateParameters( parameterPath );

      console.log( 'Parameters are generated..' );

      // Set method folder path
      const methodPath = this.fileUtil.getFolderPath(
          swaggerPath,
          SwaggerDocumentType.METHOD
      );

      // Cleanup swagger methods
      fs.rmSync( methodPath, { recursive: true, force: true } );

      // Generate swagger methods
      this.generateMethods( methodPath );

      console.log( 'Methods are generated..' );

      // Generate documents
      this.generateSchemaDocuments();
      this.generateTagDocuments();
      this.generateParameterDocuments();
      this.generateMethodDocuments();

      // Generate index documents
      this.generateIndexDocuments( swaggerPath );

      // Generate spec document
      this.generateSpecDocument( swaggerPath );

      console.log( 'Swagger documents are generated successfully..' );
    } catch ( ex ) {
      console.log( 'Error while generating Swagger documents: ', ex );
    }
  };

  /**
   * Generates methods
   * @param methodPath Method path
   */
  generateMethods = ( methodPath: string ) => {
    const requestBodyTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.REQUEST_BODY
    );
    const responseTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.RESPONSE
    );
    const responseArrayTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.RESPONSE_ARRAY
    );

    const methodTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.METHOD
    );
    const routeMethodTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.ROUTE_METHOD
    );
    const methodParameterTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.METHOD_PARAMETER
    );

    var routeMethods: Array<SwaggerRouteMethod> = [];

    this.methods.forEach( ( m ) => {
      var requestBodyStream = '';
      var responseStream = '';
      var parameterStream = '';
      var tagStream = '';

      if ( m.requestBody ) {
        requestBodyStream = requestBodyTemplate
        .replace( '{{REQUEST_SCHEMA}}', m.requestBody.content.schema.name )
        .replace( '{{REQUIRED}}', m.requestBody.required ? 'true' : 'false' );
      }

      if ( m.responses && m.responses.length > 0 ) {
        m.responses.forEach( ( r ) => {
          var template = responseTemplate;
          if ( r.content.arrayOf ) {
            template = responseArrayTemplate;
          }

          responseStream += template
          .replace( '{{RESPONSE_CODE}}', r.responseCode.toString() )
          .replace( '{{RESPONSE_DESCRIPTION}}', r.description )
          .replace( '{{RESPONSE_SCHEMA}}', r.content.schema.name );
        } );
      }

      if ( m.parameterSchemas && m.parameterSchemas.length > 0 ) {
        m.parameterSchemas.forEach( ( ps ) => {
          const schemaParameters = this.parameters.filter(
              ( p ) => p.schema === ps
          );
          schemaParameters.forEach( ( sp ) => {
            parameterStream += methodParameterTemplate
            .replace( '{{PARAMETER_SCHEMA}}', sp.schema )
            .replace( '{{PARAMETER_NAME}}', sp.name );
          } );
        } );
      }

      if ( m.tags && m.tags.length > 0 ) {
        m.tags.forEach( ( t ) => {
          tagStream += '\'' + t.name + '\',';
        } );
      }

      var fullPath = this.fileUtil.getFullMethodPath( m.route, '' );

      var mainRoute = this.fileUtil.getMainRoute( m.route );

      var routeMethodQuery = ( rm: SwaggerRouteMethod ) =>
          rm.endpoint === fullPath && rm.route === mainRoute;

      var routeMethod = routeMethods.find( routeMethodQuery );

      var routeMethodStream = routeMethodTemplate
      .replace(
          '{{SECURITY_SCHEME}}',
          this.fileUtil.getSecurityScheme( m.security )
      )
      .replace( '{{HTTP_METHOD}}', m.httpMethod.toString() )
      .replace( '{{TAGS}}', tagStream )
      .replace( '{{SUMMARY}}', m.summary )
      .replace( '{{DESCRIPTION}}', m.description )
      .replace( '{{NAME}}', m.name )
      .replace( '{{PARAMETERS}}', parameterStream )
      .replace( '{{REQUEST_BODY}}', requestBodyStream )
      .replace( '{{RESPONSES}}', responseStream );

      if ( routeMethod ) {
        const routeMethodIndex = routeMethods.findIndex( routeMethodQuery );
        routeMethod.stream += routeMethodStream;
        routeMethods[ routeMethodIndex ] = routeMethod;
      } else {
        routeMethods.push( {
          endpoint: fullPath,
          route: mainRoute,
          stream: routeMethodStream,
        } );
      }
    } );

    var swaggerMethodDocument: Array<SwaggerMethodDocument> = [];

    routeMethods.forEach( ( rm ) => {
      var swaggerMethodQuery = ( sm: SwaggerMethodDocument ) =>
          sm.route === rm.route;

      var swaggerMethodStream = methodTemplate
      .replace( '{{METHOD_ROUTE}}', rm.endpoint )
      .replace( '{{ROUTE_METHODS}}', rm.stream );

      var swaggerMethod = swaggerMethodDocument.find( swaggerMethodQuery );

      if ( swaggerMethod ) {
        const swaggerMethodIndex =
            swaggerMethodDocument.findIndex( swaggerMethodQuery );
        swaggerMethod.stream += swaggerMethodStream;
        swaggerMethodDocument[ swaggerMethodIndex ] = swaggerMethod;
      } else {
        swaggerMethodDocument.push( {
          route: rm.route,
          stream: swaggerMethodStream,
        } );
      }
    } );

    var swaggerMethodDocumentRoutes = new Set(
        swaggerMethodDocument.map( ( sm ) => {
          return sm.route;
        } )
    );

    swaggerMethodDocumentRoutes.forEach( ( smr ) => {
      const filePath = this.fileUtil.createDocumentFileIfNotExist(
          methodPath,
          smr,
          SW_METHOD_FILE_EXTENSION
      );

      this.swaggerDocuments.push( {
        route: smr,
        filePath,
        type: SwaggerDocumentType.METHOD,
      } as SwaggerDocument );
    } );

    swaggerMethodDocument.forEach( ( sm ) => {
      this.updateSwaggerDocument(
          sm.route,
          sm.stream,
          SwaggerDocumentType.METHOD
      );
    } );
  };

  /**
   * Generates indexes
   */
  generateIndexes = () => {
    Object.values( SwaggerDocumentType ).forEach( ( t: SwaggerDocumentType ) => {
      const docType = t as SwaggerDocumentType;
      this.indexDocuments.push( { type: docType } );
    } );
  };

  /**
   * Generates tags
   * @param tagPath Tag path
   */
  generateTags = ( tagPath: string ) => {
    const tagTemplate = this.getSwaggerTemplateContent( SwaggerTemplateType.TAG );

    const tagRoutes = this.fileUtil.getAttachedRoutes( this.tags );

    tagRoutes.forEach( ( tagRoute ) => {
      const filePath = this.fileUtil.createDocumentFileIfNotExist(
          tagPath,
          tagRoute,
          SW_TAG_FILE_EXTENSION
      );

      this.swaggerDocuments.push( {
        route: tagRoute,
        filePath,
        type: SwaggerDocumentType.TAG,
      } as SwaggerDocument );
    } );

    this.tags.forEach( ( t ) => {
      var tagStream = tagTemplate.replace( '{{TAG_NAME}}', t.name );

      this.updateSwaggerDocument(
          t.route.name,
          tagStream,
          SwaggerDocumentType.TAG
      );
    } );
  };

  /**
   * Generates parameters
   * @param parameterPath Parameter path
   */
  generateParameters = ( parameterPath: string ) => {
    const parameterTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.PARAMETER
    );

    const parametersTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.PARAMETERS
    );

    const parameterSchemaRoutes = this.fileUtil.getAttachedRoutes(
        this.schemas.filter( ( s ) => s.type === SwaggerSchemaType.PARAMETER_SCHEMA )
    );

    parameterSchemaRoutes.forEach( ( psr ) => {
      const filePath = this.fileUtil.createDocumentFileIfNotExist(
          parameterPath,
          psr,
          SW_PARAMETER_FILE_EXTENSION
      );

      this.swaggerDocuments.push( {
        route: psr,
        filePath,
        type: SwaggerDocumentType.PARAMETER,
      } as SwaggerDocument );
    } );

    this.schemas
    .filter( ( sc ) => sc.type === SwaggerSchemaType.PARAMETER_SCHEMA )
    .map( ( s ) => {
      var schemaParameters = this.parameters.filter(
          ( p ) => p.schema === s.name
      );

      var parameterStream = '';

      schemaParameters.forEach( ( sp ) => {
        var paramType = SW_DEFAULT_PROPERTY_TYPE;
        if ( sp.type && SW_DATA_TYPES.includes( sp.type ) ) {
          paramType = sp.type;
        }

        parameterStream += parameterTemplate
        .replace( '{{PARAMETER_NAME}}', sp.name )
        .replace( '{{PARAMETER_PROP_NAME}}', sp.name )
        .replace( '{{PARAMETER_IN}}', sp.paramIn.toString() )
        .replace( '{{PARAMETER_TYPE}}', paramType )
        .replace( '{{PARAMETER_REQUIRED}}', sp.required ? 'true' : 'false' )
        .replace( '{{PARAMETER_DESCRIPTION}}', sp.description )
        .replace(
            '{{PARAMETER_EXAMPLE}}',
            this.fileUtil.getSwaggerExample( sp )
        );
      } );

      const parametersStream = parametersTemplate
      .replace( '{{PARAMETER_SCHEMA_NAME}}', s.name )
      .replace( '{{PARAMETERS}}', parameterStream );

      this.updateSwaggerDocument(
          s.route.name,
          parametersStream,
          SwaggerDocumentType.PARAMETER
      );
    } );
  };

  /**
   * Generates schemas
   * @param schemaPath Schema path
   */
  generateSchemas = ( schemaPath: string ) => {
    const schemaTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.SCHEMA
    );
    const propertyTemplate = this.getSwaggerTemplateContent(
        SwaggerTemplateType.PROPERTY
    );

    const schemaRoutes = this.fileUtil.getAttachedRoutes(
        this.schemas.filter( ( s ) => s.type === SwaggerSchemaType.PROPERTY_SCHEMA )
    );

    schemaRoutes.forEach( ( schemaRoute ) => {
      const filePath = this.fileUtil.createDocumentFileIfNotExist(
          schemaPath,
          schemaRoute,
          SW_SCHEMA_FILE_EXTENSION
      );

      this.swaggerDocuments.push( {
        route: schemaRoute,
        filePath,
        type: SwaggerDocumentType.SCHEMA,
      } as SwaggerDocument );
    } );

    // Create schemas
    this.schemas
    .filter( ( sc ) => sc.type === SwaggerSchemaType.PROPERTY_SCHEMA )
    .map( ( s ) => {
      var propertiesStream = '';
      this.properties.map( ( p ) => {
        if ( p.schema === s.name ) {
          var propType = SW_DEFAULT_PROPERTY_TYPE;
          if ( p.type && SW_DATA_TYPES.includes( p.type ) ) {
            propType = p.type;
          }
          propertiesStream += propertyTemplate
          .replace( '{{PROPERTY_NAME}}', p.name )
          .replace( '{{PROPERTY_TYPE}}', propType )
          .replace( '{{PROPERTY_DESCRIPTION}}', p.description )
          .replace( '{{PROPERTY_REQUIRED}}', p.required ? 'true' : 'false' )
          .replace(
              '{{PROPERTY_EXAMPLE}}',
              this.fileUtil.getSwaggerExample( p )
          );
        }
      } );

      var schemaStream = schemaTemplate
      .replace( '{{SCHEMA_NAME}}', s.name )
      .replace( '{{PROPERTIES}}', propertiesStream );

      this.updateSwaggerDocument(
          s.route.name,
          schemaStream,
          SwaggerDocumentType.SCHEMA
      );
    } );
  };

  /**
   * Generates schema documents
   */
  generateSchemaDocuments = () => {
    const schemasTemplateFile = this.getSwaggerTemplateContent(
        SwaggerTemplateType.SCHEMAS
    );

    this.swaggerDocuments
    .filter( ( doc ) => doc.type === SwaggerDocumentType.SCHEMA )
    .forEach( ( sd ) => {
      var propName = this.fileUtil.getSafeTsPropertyName(
          sd.route,
          SwaggerDocumentType.SCHEMA
      );
      var schemaDocument = schemasTemplateFile
      .replace( '{{ROUTE_NAME}}', propName )
      .replace( '{{SCHEMAS}}', sd.content );

      const formattedSchemaDocument =
          this.fileUtil.formatDocument( schemaDocument );

      fs.writeFileSync( sd.filePath, formattedSchemaDocument, { flag: 'wx' } );

      this.updateIndexDocument(
          SwaggerDocumentType.SCHEMA,
          propName,
          sd.filePath
      );
    } );
  };

  /**
   * Generates parameter documents
   */
  generateParameterDocuments = () => {
    const parameterObjectTemplateFile = this.getSwaggerTemplateContent(
        SwaggerTemplateType.PARAMETER_OBJECT
    );

    this.swaggerDocuments
    .filter( ( doc ) => doc.type === SwaggerDocumentType.PARAMETER )
    .forEach( ( sd ) => {
      var propName = this.fileUtil.getSafeTsPropertyName(
          sd.route,
          SwaggerDocumentType.PARAMETER
      );
      var parameterDocument = parameterObjectTemplateFile
      .replace( '{{ROUTE_NAME}}', propName )
      .replace( '{{PARAMETERS}}', sd.content );

      const formattedParameterDocument =
          this.fileUtil.formatDocument( parameterDocument );

      fs.writeFileSync( sd.filePath, formattedParameterDocument, {
        flag: 'wx',
      } );

      this.updateIndexDocument(
          SwaggerDocumentType.PARAMETER,
          propName,
          sd.filePath
      );
    } );
  };

  /**
   * Generates method documents
   */
  generateMethodDocuments = () => {
    const methodsTemplateFile = this.getSwaggerTemplateContent(
        SwaggerTemplateType.METHODS
    );

    this.swaggerDocuments
    .filter( ( doc ) => doc.type === SwaggerDocumentType.METHOD )
    .forEach( ( sd ) => {
      var propName = this.fileUtil.getSafeTsPropertyName(
          sd.route,
          SwaggerDocumentType.METHOD
      );
      var methodsDocument = methodsTemplateFile
      .replace( '{{ROUTE_NAME}}', propName )
      .replace( '{{METHODS}}', sd.content );

      const formattedMethodDocument =
          this.fileUtil.formatDocument( methodsDocument );

      fs.writeFileSync( sd.filePath, formattedMethodDocument, { flag: 'wx' } );

      this.updateIndexDocument(
          SwaggerDocumentType.METHOD,
          propName,
          sd.filePath
      );
    } );
  };

  /**
   * Generates tag documents
   */
  generateTagDocuments = () => {
    const tagsTemplateFile = this.getSwaggerTemplateContent(
        SwaggerTemplateType.TAGS
    );

    this.swaggerDocuments
    .filter( ( doc ) => doc.type === SwaggerDocumentType.TAG )
    .forEach( ( sd ) => {
      var propName = this.fileUtil.getSafeTsPropertyName(
          sd.route,
          SwaggerDocumentType.TAG
      );
      var tagDocument = tagsTemplateFile
      .replace( '{{ROUTE_NAME}}', propName )
      .replace( '{{TAGS}}', sd.content );

      const formattedSchemaDocument =
          this.fileUtil.formatDocument( tagDocument );

      fs.writeFileSync( sd.filePath, formattedSchemaDocument, { flag: 'wx' } );

      this.updateIndexDocument(
          SwaggerDocumentType.TAG,
          propName,
          sd.filePath
      );
    } );
  };

  /**
   * Generates index documents
   * @param swaggerPath Swagger path
   */
  generateIndexDocuments = ( swaggerPath: string ) => {
    const indexTemplateFile = this.getSwaggerTemplateContent(
        SwaggerTemplateType.INDEX
    );

    this.indexDocuments.forEach( ( swid ) => {
      var propName = this.fileUtil.getIndexPropName( swid.type );

      var indexDocument = indexTemplateFile
      .replace( '{{IMPORTS}}', swid.imports as string )
      .replace( '{{PROPERTY_NAME}}', propName )
      .replace( '{{ITEMS}}', swid.propertyNames as string );

      const formattedIndexDocument =
          this.fileUtil.formatDocument( indexDocument );

      const filePath = Path.join(
          this.fileUtil.getFolderPath( swaggerPath, swid.type ),
          this.fileUtil.getIndexFileName( swid.type )
      );

      fs.writeFileSync( filePath, formattedIndexDocument, { flag: 'wx' } );
    } );
  };

  /**
   * Generates Swagger spec document
   * @param swaggerPath Swagger path
   * @returns null if spec file already exists
   */
  generateSpecDocument = ( swaggerPath: string ) => {
    const specDocumentPath = Path.join( swaggerPath, SW_SPEC_FILE_NAME );

    if ( fs.existsSync( specDocumentPath ) ) return;

    const specTemplateFile = this.getSwaggerTemplateContent(
        SwaggerTemplateType.SPEC
    );

    const specDocument = specTemplateFile
    .replace( '{{SCHEMA_FOLDER_PATH}}', SW_SCHEMA_FOLDER_NAME )
    .replace( '{{TAG_FOLDER_PATH}}', SW_TAG_FOLDER_NAME )
    .replace( '{{METHOD_FOLDER_PATH}}', SW_METHOD_FOLDER_NAME )
    .replace( '{{PARAMETER_FOLDER_PATH}}', SW_PARAMETER_FOLDER_NAME )
    .replace(
        '{{SCHEMA_INDEX_FILE_NAME}}',
        this.fileUtil.getFileNameWithoutExtension(
            this.fileUtil.getIndexFileName( SwaggerDocumentType.SCHEMA )
        )
    )
    .replace(
        '{{TAG_INDEX_FILE_NAME}}',
        this.fileUtil.getFileNameWithoutExtension(
            this.fileUtil.getIndexFileName( SwaggerDocumentType.TAG )
        )
    )
    .replace(
        '{{METHOD_INDEX_FILE_NAME}}',
        this.fileUtil.getFileNameWithoutExtension(
            this.fileUtil.getIndexFileName( SwaggerDocumentType.METHOD )
        )
    )
    .replace(
        '{{PARAMETER_INDEX_FILE_NAME}}',
        this.fileUtil.getFileNameWithoutExtension(
            this.fileUtil.getIndexFileName( SwaggerDocumentType.PARAMETER )
        )
    );

    const formattedSpecDocument = this.fileUtil.formatDocument( specDocument );

    fs.writeFileSync( specDocumentPath, formattedSpecDocument, { flag: 'wx' } );
  };

  /**
   * Updates swagger document
   * @param route Route
   * @param stream Stream
   * @param type Swagger document type
   */
  updateSwaggerDocument = (
      route: string,
      stream: string,
      type: SwaggerDocumentType
  ) => {
    const query = ( sr: SwaggerDocument ) =>
        sr.route === route && sr.type === type;

    var doc = this.swaggerDocuments.find( query );

    if ( doc ) {
      if ( doc.content ) {
        doc.content += stream;
      } else {
        doc.content = stream;
      }

      const index = this.swaggerDocuments.findIndex( query );
      this.swaggerDocuments[ index ] = doc;
    }
  };

  /**
   * Updates index document
   * @param type Swagger document type
   * @param propertyName Property name
   * @param filePath File path
   */
  updateIndexDocument = (
      type: SwaggerDocumentType,
      propertyName: string,
      filePath: string
  ) => {
    const query = ( swid: SwaggerIndexDocument ) => swid.type === type;

    var doc = this.indexDocuments.find( query );

    var fileName = filePath.replace( /^.*[\\\/]/, '' );
    // Remove ts from import
    fileName = this.fileUtil.getFileNameWithoutExtension( fileName );

    if ( doc ) {
      const propNameStr = '...' + propertyName + ', ';

      if ( doc.propertyNames ) {
        doc.propertyNames += propNameStr;
      } else {
        doc.propertyNames = propNameStr;
      }
      const importStr =
          'import { ' + propertyName + ' } from \'./' + fileName + '\';\n';

      if ( doc.imports ) {
        doc.imports += importStr;
      } else {
        doc.imports = importStr;
      }

      const index = this.indexDocuments.findIndex( query );
      this.indexDocuments[ index ] = doc;
    }
  };
}
