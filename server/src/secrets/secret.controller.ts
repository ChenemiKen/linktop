import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { SecretService } from "./secret.service";
// import { AddressControllerBase } from "./base/address.controller.base";
import { ConfigService } from "@nestjs/config";
import { SecretsManagerService } from "src/providers/secrets/secretsManager.service";

@swagger.ApiTags("secrets")
@common.Controller("secrets")
export class SecretController {
  constructor(protected readonly service: SecretService) {
    // super(service);
  }

  @common.Get("/:key")
  async getASecret(@common.Param() param:{key:string}): Promise<string|null> {
    const configService = new ConfigService()
    const secretManager = new SecretsManagerService(configService)
    return await secretManager.getSecret(param.key)
  }
}