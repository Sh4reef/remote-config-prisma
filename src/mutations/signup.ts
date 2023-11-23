import { extendType, nonNull, stringArg } from "nexus";
import { hash } from "argon2";
import { sign } from "jsonwebtoken";

const SignupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signup", {
      type: "AuthPayload",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const hashedPassword = await hash(args.password);
        const user = await ctx.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            hash: hashedPassword,
          },
        });
        const token = sign(user, process.env.JWT_ACCESS_SECRET as string, {
          algorithm: "RS256",
          expiresIn: "8h",
        });
        return {
          token,
          user,
        };
      },
    });
  },
});

export default SignupMutation;
