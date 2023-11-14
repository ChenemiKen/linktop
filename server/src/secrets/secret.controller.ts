import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { SecretService } from "./secret.service";
// import { AddressControllerBase } from "./base/address.controller.base";
import { ConfigService } from "@nestjs/config";
import { SecretsManagerService } from "src/providers/secrets/on_demand/secretsManager.service";
import { SecretsManagerService as StartupSecretsManager } from "src/providers/secrets/startup/secretsManager.service";

@swagger.ApiTags("secrets")
@common.Controller("secrets")
export class SecretController {
  constructor(protected readonly service: SecretService,
    protected readonly secretManagerService:SecretsManagerService,
    protected readonly startupSecretsManagerService:StartupSecretsManager) {
    // super(service);
  }

  @common.Get("/:key")
  async getASecret(@common.Param() param:{key:string}): Promise<string|null> {
    return await this.secretManagerService.getSecret(param.key)
  }

  @common.Get("/startup/:key")
  async getASecretsAtStartup(@common.Param() param:{key:string}): Promise<string|null> {
    return await this.startupSecretsManagerService.getSecret(param.key)
  }
}