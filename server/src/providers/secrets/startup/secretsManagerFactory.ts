import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common"
import { BitwardenClient, ClientSettings, DeviceType, LogLevel, SecretIdentifierResponse } from "@bitwarden/sdk-napi";

const secretNames = ["key1", "key2"]

export const secretsManagerFactory = {
    provide: "BITWARDEN_SECRETS_MANAGER",
    useFactory: async (configService: ConfigService) => {
        console.log("running factory")
        const logger = new Logger()
        const settings: ClientSettings = {
            apiUrl : configService.get("BITWARDEN_API_URL"),
            identityUrl: configService.get("BITWARDEN_IDENTITY_URL"),
            userAgent: "Bitwarden SDK",
            deviceType: DeviceType.SDK,
        };

        const accessToken = configService.get("BITWARDEN_ACCESS_TOKEN")!
        const organisationId = configService.get("BITWARDEN_ORGANISATION_ID")!
        const bitwardenClient = new BitwardenClient(settings, LogLevel.Info)

        const auth = await bitwardenClient.loginWithAccessToken(accessToken);
        if(!auth.success){
        throw Error("bitwarden authentication failed");
        }

        // List secrets
        const secretsList = await bitwardenClient.secrets().list(organisationId);

        if(secretsList.success){
            const secretsNamesIds: string[] = [] 
            secretsList.data?.data.forEach((sec:SecretIdentifierResponse) => {
                if(secretNames.includes(sec.key)) secretsNamesIds.push(sec.id)
            })

            const response = await bitwardenClient.secrets().getByIds(secretsNamesIds)

            var secrets: Partial<Record<string, unknown>> = {}

            if(response.success){
                if(response.data){
                    for(const secret of response.data?.data){
                        secrets = {
                            ...secrets,
                            [secret.key]: secret.value
                        }
                    }

                    return secrets
                }
            }
            
        }
    },
    inject: [ConfigService]
}