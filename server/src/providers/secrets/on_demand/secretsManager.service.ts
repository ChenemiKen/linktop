import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsManagerServiceBase } from "../base/secretsManager.service.base";
import { BitwardenClient, ClientSettings, DeviceType, LogLevel, SecretIdentifierResponse } from "@bitwarden/sdk-napi";


@Injectable()
export class SecretsManagerService extends SecretsManagerServiceBase {
  private readonly settings: ClientSettings
  private readonly organisationId: string
  private readonly accessToken : string
  private readonly bitwardenClient: BitwardenClient

  constructor(protected readonly configService: ConfigService) {
    super(configService);

    this.settings = {
      apiUrl : this.configService.get("BITWARDEN_API_URL"),
      identityUrl: this.configService.get("BITWARDEN_IDENTITY_URL"),
      userAgent: "Bitwarden SDK",
      deviceType: DeviceType.SDK,
    };

    this.accessToken = configService.get("BITWARDEN_ACCESS_TOKEN")!
    this.organisationId = configService.get("BITWARDEN_ORGANISATION_ID")!
    this.bitwardenClient = new BitwardenClient(this.settings, LogLevel.Info)
  }

  async getSecret<T>(key: string): Promise<T | null> {
    const auth = await this.bitwardenClient.loginWithAccessToken(this.accessToken);
    if(!auth.success){
      throw Error("bitwarden authentication failed");
    }

    // List secrets
    const secretsList = await this.bitwardenClient.secrets().list(this.organisationId);


    console.log(secretsList)
    if(secretsList.success){
      if(secretsList.data){
        const secretId = secretsList.data.data.filter((sec:SecretIdentifierResponse) => sec.key === key)

        const secret = await this.bitwardenClient.secrets().get(secretId[0].id)

        console.log(secret.data)
        if(secret.success){
          if(secret.data){
            return secret.data.value as any
          }
        }
      }
    }

    return null
  }
}
