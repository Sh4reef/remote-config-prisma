import { extendType, nonNull, stringArg } from "nexus";
import { getUserId } from "../utils";

const CreateIdentityMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createIdentity", {
      type: "Identity",
      args: {
        projectId: nonNull(stringArg()),
        data: nonNull("IdentityInputType"),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        const parameters = await ctx.prisma.parameter.findMany({
          where: { projectId: args.projectId },
          select: { id: true },
        });
        return await ctx.prisma.identity.create({
          data: {
            userId,
            projectId: args.projectId,
            identity: args.data.identity,
            platform: args.data.platform,
            language: args.data.language,
            country: args.data.country,
            parameters: {
              createMany: {
                data: parameters.map((parameter) => ({
                  userId,
                  parameterId: parameter.id,
                })),
              },
            },
          },
        });
      },
    });
  },
});

export default CreateIdentityMutation;
