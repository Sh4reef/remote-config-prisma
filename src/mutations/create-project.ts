import { extendType, nonNull, stringArg } from "nexus";
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
        return await ctx.prisma.project.create({
          data: {
            name: args.name,
            userId,
          },
        });
      },
    });
  },
});

export default CreateProjectMutation;
