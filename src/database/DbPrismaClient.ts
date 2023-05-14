import { PrismaClient } from "@prisma/client";

class DbPrismaClient {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (DbPrismaClient.instance == undefined) {
      DbPrismaClient.instance = new PrismaClient();
    }

    return DbPrismaClient.instance;
  }
}

export default DbPrismaClient;