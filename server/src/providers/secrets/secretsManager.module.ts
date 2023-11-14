import { Module } from "@nestjs/common";
import { SecretsManagerService } from "./on_demand/secretsManager.service";

@Module({
  providers: [SecretsManagerService],
  exports: [SecretsManagerService],
})
export class SecretsManagerModule {}
