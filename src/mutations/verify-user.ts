import { extendType, nonNull, stringArg } from "nexus";

const VerifyUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("verifyUser", {
      type: "User",
      args: {
        userId: nonNull(stringArg()),
        verificationCode: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: args.userId,
            verification_code: args.verificationCode,
          },
        });

        if (user?.verified) {
          throw new Error("Your account is already verified.");
        }

        if (!user) {
          throw new Error("User verification failed.");
        }

        return await ctx.prisma.user.update({
          where: {
            id: args.userId,
          },
          data: {
            verified: true,
          },
        });
      },
    });
  },
});

export default VerifyUserMutation;
