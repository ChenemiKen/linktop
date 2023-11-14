import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./filters/HttpExceptions.filter";
import { AppModule } from "./app.module";
import { connectMicroservices } from "./connectMicroservices";
import {
  swaggerPath,
  swaggerDocumentOptions,
  swaggerSetupOptions,
} from "./swagger";

import { BitwardenClient, ClientSettings, DeviceType, LogLevel } from "@bitwarden/sdk-napi";

const settings: ClientSettings = {
  apiUrl: "https://api.bitwarden.com",
  identityUrl: "https://identity.bitwarden.com",
  userAgent: "Bitwarden SDK",
  deviceType: DeviceType.SDK,
};
// const accessToken = "0.abe4259c-bd98-4993-9533-b0b4017fa05c.jiqnRE2lOaChGjek50haqH3cloGHUm:MIKqd+SBzwzksmefIgiGzw==";
const accessToken = "0.23365048-37f9-418c-b665-b0b500027f61.B6uLF9x1pprXAPJMhN9jHPmHVuE1TW:hRpAChR/UvUVkA4VuquahQ==";


const { PORT = 3000 } = process.env;

async function main() {
  // await bitwarden()
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    })
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes("isPublic")
      ) {
        method.security = [];
      }
    });
  });

  await connectMicroservices(app);
  await app.startAllMicroservices();

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  void app.listen(PORT);

  return app;
}

async function bitwarden(){
  // -----------------------------------
  const client = new BitwardenClient(settings, LogLevel.Info);

  // Authenticating using a service accounts access token
  const result = await client.loginWithAccessToken(accessToken);
  console.log(result)
  if (!result.success) {
    // console.log(result.data)
    // console.log(result.errorMessage)
    // console.log(result.success)
    throw Error("Authentication failed");
  }

  // List secrets
  const secrets = await client.secrets().list("63fc584f-7801-498b-bf36-b0b40011052d");

  // Get a specific secret
  // const secret = await client.secrets().get("9ca9a9f1-e9ab-42f8-a849-b0b400135d95");
  // console.log(secrets.data?.data)
  const secretIds = secrets.data?.data.map(sec => sec.id)
  // console.log(secret)
  const secretsById = await client.secrets().getByIds(secretIds!)
  console.log(secretsById.data)
  //---------------------------------------------------
}

module.exports = main();
