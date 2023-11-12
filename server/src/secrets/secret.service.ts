import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
// import { AddressServiceBase } from "./base/address.service.base";

@Injectable()
export class SecretService {
  constructor(protected readonly prisma: PrismaService) {
    // super(prisma);
  }
}
