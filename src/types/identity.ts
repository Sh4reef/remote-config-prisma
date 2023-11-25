import { objectType } from "nexus";

/**
 * Identity type
 */
const Identity = objectType({
  name: "Identity",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("projectId");
    t.nonNull.string("identity");
    t.field("platform", { type: "PlatformEnum" });
    t.field("language", { type: "LanguageEnum" });
    t.field("country", { type: "CountryEnum" });
    t.field("project", {
      type: "Project",
      async resolve(parent, __, ctx) {
        return await ctx.prisma.project.findUnique({
          where: { id: parent.projectId },
        });
      },
    });
    t.list.field("parameters", {
      type: "IdentityParameter",
      async resolve(parent, __, ctx) {
        return await ctx.prisma.identityParameter.findMany({
          where: { identityId: parent.id },
        });
      },
    });
  },
});

export default Identity;
