import { extendType, nonNull, stringArg } from "nexus";
import crypto from "crypto";
import { getUserId } from "../utils";

const CreateProjectMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createProject", {
      type: "Project",
      args: {
        name: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx)!;
        const createdProject = await ctx.prisma.project.create({
          data: {
            userId,
            name: args.name,
            apiKeys: {
              createMany: {
                data: [
                  {
                    userId,
                    name: args.name,
                    secret: crypto.randomBytes(16).toString("base64url"),
                    environment: "development",
                  },
                  {
                    userId,
                    name: args.name,
                    secret: crypto.randomBytes(16).toString("base64url"),
                    environment: "production",
                  },
                ],
              },
            },
          },
        });

        return createdProject;
      },
    });
  },
});

export default CreateProjectMutation;
