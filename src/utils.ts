import { verify } from "jsonwebtoken";
import { Context } from "./context";
import { User } from "@prisma/client";

export const getUserId = ({ req }: Context) => {
  const authorization = req.headers["authorization"];
  if (authorization) {
    const user = verify(
      authorization,
      process.env.JWT_ACCESS_SECRET as string,
      { algorithms: ["RS256"] }
    ) as User;
    return user.id;
  }
};
