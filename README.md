<p align="center">
   <a href="https://opentemplatehub.com">
    <img src="https://raw.githubusercontent.com/open-template-hub/open-template-hub.github.io/master/assets/logo/brand-logo.png" alt="Logo" width=200>
  </a>
</p>

<h1 align="center">
Open Template Hub - Swagger Decorators v4
</h1>

[![Version](https://img.shields.io/npm/v/@open-template-hub/swagger-decorators?color=CB3837&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@open-template-hub/swagger-decorators)
[![Downloads](https://img.shields.io/npm/dt/@open-template-hub/swagger-decorators?color=CB3837&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@open-template-hub/swagger-decorators)
[![License](https://img.shields.io/github/license/open-template-hub/swagger-decorators?color=43b043&style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/open-template-hub/swagger-decorators?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/swagger-decorators/issues)
[![PRCLosed](https://img.shields.io/github/issues-pr-closed-raw/open-template-hub/swagger-decorators?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/swagger-decorators/pulls?q=is%3Apr+is%3Aclosed)
[![LastCommit](https://img.shields.io/github/last-commit/open-template-hub/swagger-decorators?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/swagger-decorators/commits/master)
[![Release](https://img.shields.io/github/release/open-template-hub/swagger-decorators?include_prereleases&color=43b043&style=for-the-badge)](https://github.com/open-template-hub/swagger-decorators/releases)
[![SonarCloud](https://img.shields.io/sonar/quality_gate/open-template-hub_swagger-decorators?server=https%3A%2F%2Fsonarcloud.io&label=Sonar%20Cloud&style=for-the-badge&logo=sonarcloud)](https://sonarcloud.io/dashboard?id=open-template-hub_swagger-decorators)

This library contains methods and decorators to ease and automate [Swagger](https://swagger.io) documentation.

## About the NPM Package

### Package Installation

```sh
npm install --save @open-template-hub/swagger-decorators
```

## Using OTH Swagger Decorators

### @SwRoute

This decorator helps you to define new route and can be specified on top of route class.

You must specify SwaggerRoute as the decorator argument.

```ts
import {
  SwaggerRoute,
  SwRoute,
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

@SwRoute(mySwaggerRoute)
export class MyRoute {
  /// Route Methods
}
```

### @SwTag

This decorator helps you to define new tag and can be specified on top of Route class.

You must specify SwaggerRoute as the decorator argument.

```ts
import {
  SwaggerRoute,
  SwaggerTag,
  SwRoute,
  SwTag,
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

const mySwaggerTag = {
  name: 'MyTag',
  route: mySwaggerRoute,
} as SwaggerTag;

// Second tag under same route
const mySecondSwaggerTag = {
  name: 'MySecondTag',
  route: mySwaggerRoute,
} as SwaggerTag;

@SwRoute(mySwaggerRoute)
@SwTag(mySwaggerTag)
@SwTag(mySecondSwaggerTag)
export class MyRoute {
  /// Route Methods
}
```

### @SwSchema

This decorator helps you to define new schema and can be specified on top of Schema class.

There are two types of Schema:

* Property Schema: Holds properties for Request Body and Response
* Parameter Schema: Holds parameters for Request Query and Path

You must specify SwaggerRoute as the first decorator argument for both Schema types.

The only difference for decoration, if you are defining a schema for parameters, you must set the second argument of
@SwSchema, which is isParameterSchema, to **true**.

You can use Parameter Schema only with @SwParam parameters, and Property Schema can only be used with @SwProp properties.

Here you can see the example for Property Schema:

```ts
import {
  SwaggerRoute,
  SwSchema,
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

@SwSchema(mySwaggerRoute)
export class MySchema {
  // Schema Properties
}
```

Here you can see the example for Parameter Schema:

```ts
import {
  SwaggerRoute,
  SwSchema,
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

@SwSchema(mySwaggerRoute, true)
export class MyParameterSchema {
  // Schema Parameters
}
```

### @SwProp

This decorator helps you to define new property and can be specified on top of Properties.

This decorator takes two arguments. First argument is the description of the property and set the second argument, which is **required**, to **true** if the property is required. You do not need to set anything for the second argument if the property is not required.

Default values set to property will be used as example.

```ts
import {
  SwaggerRoute,
  SwSchema,
  SwProp
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

@SwSchema(mySwaggerRoute)
export class MySchema {
  @SwProp('The source application or service', true)
  source: string = 'OTH Web UI';
  @SwProp('Event creation time', true)
  timestamp: number = 1666476669;
  @SwProp('Can contain any kind of data payload')
  payload: any = { test: true };
}
```

### @SwParam

This decorator helps you to define new parameter and can be specified on top of Parameters.

This decorator takes three arguments. First argument is the description of the parameter. Second argument specifies where this parameter will be stated, so it can be either PATH or QUERY and set the third argument, which is **required**, to **true** if the parameter is required. You do not need to set anything for the third argument if the parameter is not required.

Default values set to parameter will be used as example.

```ts
import {
  SwaggerRoute,
  SwSchema,
  SwParam,
  ParameterIn
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

@SwSchema(mySwaggerRoute, true)
export class MyParameterSchema {
  @SwParam('Filter for reporter', ParameterIn.QUERY)
  reporter: string = 'service-user';
  @SwParam('Limit for records to return', ParameterIn.QUERY, true)
  limit: number = 5;
}
```

### @SwMethod
This decorator helps you to define new method and can be specified on top of route Methods.
This decorator takes only one argument which is SwaggerMethod.

For better understanding, you can check all the properties for SwaggerMethod:

```ts
interface SwaggerMethod {
  // Swagger Route
  route: SwaggerRoute;

  // Method Name
  name: string;

  // Method Summary
  summary: string;

  // Method Description
  description: string;

  // Http Method: GET, POST, PUT, PATCH, DELETE
  httpMethod: HttpMethod;

  // Responses that method will return
  responses: Array<SwaggerResponse>;

  // Identifies the security scheme
  security?: SwaggerSecurityScheme;

  // Tags that method classified
  tags?: Array<SwaggerTag>;

  // Parameter schemas if you have in-query or in-path parameters
  parameterSchemas?: Array<string>;

  // Request Body
  requestBody?: SwaggerRequestBody;
}
```

**Related Interfaces**

* SwaggerRequestBody

```ts
interface SwaggerRequestBody {
  // Request body content
  content: SwaggerContent;

  // Is request body required
  required: boolean;
}
```

* SwaggerResponse

```ts
interface SwaggerResponse {
  // Response code
  responseCode: number;

  // Response description
  description: string;

  // Response content
  content: SwaggerContent;
}
```

* SwaggerTag

```ts
interface SwaggerTag {
  // Tag name
  name: string;

  // Swagger Route
  route: SwaggerRoute;
}
```

* SwaggerContent

```ts
interface SwaggerContent {
  // Related schema
  schema: SwaggerSchema;

  // Is the content array of schema?
  arrayOf?: boolean;
}
```

### Full Route Example Including All Method Types

```ts
import {
  HttpMethod,
  ParameterIn,
  SwaggerMethod,
  SwaggerRequestBody,
  SwaggerResponse,
  SwaggerRoute,
  SwaggerSchema,
  SwaggerSecurityScheme,
  SwaggerTag,
  SwMethod,
  SwParam,
  SwProp,
  SwRoute,
  SwSchema,
  SwTag,
} from '@open-template-hub/swagger-decorators';

const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;

const mySwaggerTag = {
  name: 'MyTag',
  route: mySwaggerRoute,
} as SwaggerTag;

@SwSchema(mySwaggerRoute)
export class MySchema {
  @SwProp('The source application or service', true)
  source: string = 'OTH Web UI';
  @SwProp('Event creation time', true)
  timestamp: number = 1666476669;
  @SwProp('Can contain any kind of data payload')
  payload: any = { test: true };
}

@SwSchema(mySwaggerRoute)
export class MyPatchSchema {
  @SwProp('Can contain any kind of data payload')
  payload: any = { test: true };
}

@SwSchema(mySwaggerRoute, true)
export class MyParameterSchema {
  @SwParam('Filter for reporter', ParameterIn.QUERY)
  reporter: string = 'service-user';
  @SwParam('Limit for records to return', ParameterIn.QUERY, true)
  limit: number = 5;
}

@SwSchema(mySwaggerRoute, true)
export class MyDeleteSchema {
  @SwParam('Identifier of the object that will be deleted', ParameterIn.QUERY)
  id: string = '8034c607-a41d-4f29-8737-4cc9233a8b53';
}

@SwRoute(mySwaggerRoute)
@SwTag(mySwaggerTag)
export class MyRoute {

  @SwMethod({
      httpMethod: HttpMethod.GET,
      route: {
        name: 'Sub-route name',
        parent: mySwaggerRoute,
      } as SwaggerRoute,
      name: 'myGet',
      summary: 'Summary of the method',
      description: 'Description of the method',
      security: SwaggerSecurityScheme.BEARER,
      tags: [mySwaggerTag],
      parameterSchemas: ['MyParameterSchema'],
      responses: [
        {
          content: {
            schema: {
              name: 'MySchema',
              route: mySwaggerRoute,
            } as SwaggerSchema,
            arrayOf: true,
          },
          responseCode: 200,
          description: 'OK',
        } as SwaggerResponse,
      ],
    } as SwaggerMethod)
  myGet = () => {
    // Route method
  }

  @SwMethod({
      httpMethod: HttpMethod.POST,
      route: {
        name: 'Sub-route name',
        parent: mySwaggerRoute,
      } as SwaggerRoute,
      name: 'myPost',
      summary: 'Summary of the method',
      description: 'Description of the method',
      security: SwaggerSecurityScheme.BEARER,
      tags: [mySwaggerTag],
      requestBody: {
        content: {
          schema: {
            name: 'MySchema',
            route: mySwaggerRoute,
          } as SwaggerSchema,
        },
        required: true,
      } as SwaggerRequestBody,
      responses: [
        {
          content: {
            schema: {
              name: 'MySchema',
              route: mySwaggerRoute,
            } as SwaggerSchema,
          },
          responseCode: 201,
          description: 'Created',
        } as SwaggerResponse,
      ],
    } as SwaggerMethod)
  myPost = () => {
    // Route method
  }

  @SwMethod({
      httpMethod: HttpMethod.PUT,
      route: {
        name: 'Sub-route name',
        parent: mySwaggerRoute,
      } as SwaggerRoute,
      name: 'myPut',
      summary: 'Summary of the method',
      description: 'Description of the method',
      security: SwaggerSecurityScheme.BEARER,
      tags: [mySwaggerTag],
      requestBody: {
        content: {
          schema: {
            name: 'MySchema',
            route: mySwaggerRoute,
          } as SwaggerSchema,
        },
        required: true,
      } as SwaggerRequestBody,
      responses: [
        {
          content: {
            schema: {
              name: 'MySchema',
              route: mySwaggerRoute,
            } as SwaggerSchema,
          },
          responseCode: 200,
          description: 'Updated',
        } as SwaggerResponse,
      ],
    } as SwaggerMethod)
  myPut = () => {
    // Route method
  }

  @SwMethod({
      httpMethod: HttpMethod.PATCH,
      route: {
        name: 'Sub-route name',
        parent: mySwaggerRoute,
      } as SwaggerRoute,
      name: 'myPatch',
      summary: 'Summary of the method',
      description: 'Description of the method',
      security: SwaggerSecurityScheme.BEARER,
      tags: [mySwaggerTag],
      requestBody: {
        content: {
          schema: {
            name: 'MyPatchSchema',
            route: mySwaggerRoute,
          } as SwaggerSchema,
        },
        required: true,
      } as SwaggerRequestBody,
      responses: [
        {
          content: {
            schema: {
              name: 'MySchema',
              route: mySwaggerRoute,
            } as SwaggerSchema,
          },
          responseCode: 200,
          description: 'Updated',
        } as SwaggerResponse,
      ],
    } as SwaggerMethod)
  myPatch = () => {
    // Route method
  }

  @SwMethod({
      httpMethod: HttpMethod.DELETE,
      route: {
        name: 'Sub-route name',
        parent: mySwaggerRoute,
      } as SwaggerRoute,
      name: 'myDelete',
      summary: 'Summary of the method',
      description: 'Description of the method',
      security: SwaggerSecurityScheme.BEARER,
      tags: [mySwaggerTag],
      parameterSchemas: ['MyDeleteSchema'],
      responses: [
        {
          content: {
            schema: {
              name: 'MySchema',
              route: mySwaggerRoute,
            } as SwaggerSchema,
          },
          responseCode: 200,
          description: 'Updated',
        } as SwaggerResponse,
      ],
    } as SwaggerMethod)
  myDelete = () => {
    // Route method
  }
  
}
```

### Automation of Swagger Document Generation

Add this codeblock to your index file, to the place after Routes are mounted where you are starting node application.
This codeblock will generate all Swagger Documents by reading decorators.
Change 'app' with the folder name where you want to keep and load Swagger Documents

```ts
if (process.env.OTH_SWAGGER_ON_GENERATION === 'true') {
  SwaggerDocumentation.getInstance().generateDocument(
    Path.join(__dirname, 'app')
  );

  process.exit(1);
}
```

Add "swagger" command to package.json scripts

```
"scripts": {
    ...
    "swagger": "OTH_SWAGGER_ON_GENERATION=true npm start"
  }
```

You can use "swagger-ui-express" package to load Swagger UI from the generated "index.swagger" document spec.

```
npm i swagger-ui-express
```

```ts
if (
  process.env.OTH_SWAGGER_ON_GENERATION !== 'true'
) {
  const { SwaggerSpec } = require('./app/swagger/index.swagger');
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpecification = new SwaggerSpec();
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecification.getSpec())
  );
}
```

# Sponsors

No sponsors yet! **Will you be the first?**

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/furknyavuz"><img src="https://avatars0.githubusercontent.com/u/2248168?s=460&u=435ef6ade0785a7a135ce56cae751fb3ade1d126&v=4" width="100px;" alt=""/><br /><sub><b>Furkan Yavuz</b></sub></a><br /><a href="https://github.com/open-template-hub/swagger-decorators/issues/created_by/furknyavuz" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/swagger-decorators/commits?author=furknyavuz" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/swagger-decorators/pulls?q=is%3Apr+reviewed-by%3Afurknyavuz" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/fatihturker"><img src="https://avatars1.githubusercontent.com/u/2202179?s=460&u=261b1129e7106c067783cb022ab9999aad833bdc&v=4" width="100px;" alt=""/><br /><sub><b>Fatih Turker</b></sub></a><br /><a href="https://github.com/open-template-hub/swagger-decorators/issues/created_by/fatihturker" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/swagger-decorators/commits?author=fatihturker" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/swagger-decorators/pulls?q=is%3Apr+reviewed-by%3Afatihturker" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/mertlsarac"><img src="https://avatars1.githubusercontent.com/u/38442589?s=400&u=aa3cda11724fc297a0bfa6beb35c9be81687cf3c&v=4" width="100px;" alt=""/><br /><sub><b>Mert Sarac</b></sub></a><br /><a href="https://github.com/open-template-hub/swagger-decorators/issues/created_by/mertlsarac" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/swagger-decorators/commits?author=mertlsarac" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/swagger-decorators/pulls?q=is%3Apr+reviewed-by%3Amertlsarac" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributing

Refer to **[CONTRIBUTING.md](https://github.com/open-template-hub/.github/blob/master/docs/CONTRIBUTING.md)** to see how to contribute to Open Template Hub.

<br/>

## Code of Conduct

Refer to **[CODE_OF_CONDUCT.md](https://github.com/open-template-hub/.github/blob/master/docs/CODE_OF_CONDUCT.md)** to see contributor covenant code of conduct.

<br/>

## LICENSE

The source code for this project is released under the [MIT License](LICENSE).
