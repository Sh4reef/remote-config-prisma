import { verify } from "jsonwebtoken";
import { Context } from "./context";
import { User } from "@prisma/client";
import { IncomingMessage } from "http";

export const getUser = (req: IncomingMessage): User => {
  const authorization = req.headers["authorization"]!;
  return verify(authorization, process.env.JWT_ACCESS_SECRET as string, {
    algorithms: ["RS256"],
  }) as User;
};

export const getUserId = ({ req }: Context) => {
  const user = getUser(req) as User;
  return user.id;
};
