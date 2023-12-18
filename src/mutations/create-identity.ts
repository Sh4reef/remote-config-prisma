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
          select: { id: true, environment: true },
        });

        const createdIdentity = await ctx.prisma.identity.create({
          data: {
            userId,
            projectId: args.projectId,
            identity: `${args.data.identity}_${args.data.environment}`,
            platform: args.data.platform,
            language: args.data.language,
            country: args.data.country,
            environment: args.data.environment,
            parameters: {
              createMany: {
                data:
                  args.data.environment === "development"
                    ? parameters
                        .filter(
                          (parameter) => parameter.environment === "development"
                        )
                        .map((parameter) => ({
                          userId,
                          parameterId: parameter.id,
                        }))
                    : parameters
                        .filter(
                          (parameter) => parameter.environment === "production"
                        )
                        .map((parameter) => ({
                          userId,
                          parameterId: parameter.id,
                        })),
              },
            },
          },
        });

        return createdIdentity;
      },
    });
  },
});

export default CreateIdentityMutation;
