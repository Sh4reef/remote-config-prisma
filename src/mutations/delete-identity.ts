import { extendType, intArg, nonNull } from "nexus";

const DeleteIdentityMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteIdentity", {
      type: "Identity",
      args: {
        identityId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.identity.delete({
          where: { id: args.identityId },
        });
      },
    });
  },
});

export default DeleteIdentityMutation;
