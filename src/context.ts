import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: IncomingMessage;
}

export default async function (ctx: { req: IncomingMessage }) {
  return {
    ...ctx,
    prisma,
  };
}
