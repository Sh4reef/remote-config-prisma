import { extendType, nonNull, stringArg } from "nexus";

const DeleteProjectMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteProject", {
      type: "Project",
      args: {
        projectId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.project.delete({
          where: { id: args.projectId },
        });
      },
    });
  },
});

export default DeleteProjectMutation;
