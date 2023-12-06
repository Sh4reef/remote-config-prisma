import { verify } from "jsonwebtoken";
import { Context } from "./context";
import { User } from "@prisma/client";
import { IncomingMessage } from "http";
import { JWT_ACCESS_SECRET } from "./variables";

export const getUser = (req: IncomingMessage): User => {
  const authorization = req.headers["authorization"]!;
  return verify(authorization, JWT_ACCESS_SECRET, {
    algorithms: ["RS256"],
  }) as User;
};

export const getUserId = ({ req }: Context) => {
  const user = getUser(req) as User;
  return user.id;
};
