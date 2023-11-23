import { extendType, intArg, nonNull } from "nexus";

const UpdateConditionMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCondition", {
      type: "Condition",
      args: {
        projectId: nonNull(intArg()),
        conditionId: nonNull(intArg()),
        data: nonNull("ConditionInputType"),
      },
      async resolve(_, args, ctx) {
        const updatedCondition = await ctx.prisma.condition.update({
          where: { projectId: args.projectId, id: args.conditionId },
          data: {
            name: args.data.name,
          },
        });

        for (const rule of args.data.rules) {
          const ruleValues = {
            rule: rule.rule,
            datetime: rule.datetime,
            platform: rule.platform,
            language: rule.language,
            country: rule.country,
            before_datetime: rule.before_datetime,
          };
          await ctx.prisma.rule.upsert({
            where: {
              id: Number(rule.id || 0),
            },
            create: {
              conditionId: updatedCondition.id,
              ...ruleValues,
            },
            update: ruleValues,
          });
        }

        return updatedCondition;
      },
    });
  },
});

export default UpdateConditionMutation;
