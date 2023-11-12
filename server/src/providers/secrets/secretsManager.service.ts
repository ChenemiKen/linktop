import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsManagerServiceBase } from "./base/secretsManager.service.base";
import { BitwardenClient, ClientSettings, DeviceType, LogLevel } from "@bitwarden/sdk-napi";


@Injectable()
export class SecretsManagerService extends SecretsManagerServiceBase {
  private readonly settings: ClientSettings
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
    this.bitwardenClient = new BitwardenClient(this.settings, LogLevel.Info)
  }

  async getSecret<T>(key: string): Promise<T | null> {
    const auth = await this.bitwardenClient.loginWithAccessToken(this.accessToken);
    if(!auth.success){
      throw Error("bitwarden authentication failed");
    }
    const secret = await this.bitwardenClient.secrets().get("63fc584f-7801-498b-bf36-b0b40011052d")

    console.log(secret.data)
    if(secret.success){
      if(secret.data){
        return JSON.parse(secret.data.toString())
      }
    }

    return null
  }
}
