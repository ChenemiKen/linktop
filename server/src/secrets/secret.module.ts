import { Module } from "@nestjs/common";
// import { AddressModuleBase } from "./base/address.module.base";
import { SecretService } from "./secret.service";
import { SecretController } from "./secret.controller";

@Module({
//   imports: [AddressModuleBase],
  controllers: [SecretController],
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretsModule {}