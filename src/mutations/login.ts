import { extendType, nonNull, stringArg } from "nexus";
import { verify } from "argon2";
import { sign } from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../variables";

const LoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: { email: args.email },
        });
        if (!user) {
          throw new Error("Incorrect email or password.");
        }

        const isPasswordValid = await verify(user.hash, args.password);
        if (!isPasswordValid) {
          throw new Error("Incorrect email or password.");
        }

        const token = sign(user, JWT_ACCESS_SECRET, {
          algorithm: "RS256",
        });

        return {
          token,
          user,
        };
      },
    });
  },
});

export default LoginMutation;
