import { Module } from "@nestjs/common";
// import { AddressModuleBase } from "./base/address.module.base";
import { SecretService } from "./secret.service";
import { SecretController } from "./secret.controller";
import { SecretsManagerService } from "src/providers/secrets/on_demand/secretsManager.service";
import { SecretsManagerService as StartupSecretsManager } from "src/providers/secrets/startup/secretsManager.service";
import { secretsManagerFactory } from "src/providers/secrets/startup/secretsManagerFactory";
import { SecretsManagerModule } from "src/providers/secrets/startup/secretsManager.module";
@Module({
  imports: [SecretsManagerModule],
  controllers: [SecretController],
  providers: [SecretService, SecretsManagerService, StartupSecretsManager, secretsManagerFactory],
  exports: [SecretService],
})
export class SecretsModule {}