import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";
import { prisma } from "./client";

export type Context = {
  prisma: PrismaClient;
  req: IncomingMessage;
};

export default async function (ctx: { req: IncomingMessage }) {
  return {
    ...ctx,
    prisma,
  };
}
