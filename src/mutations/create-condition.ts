import { extendType, nonNull, stringArg } from "nexus";
import { getUserId } from "../utils";

const CreateConditionMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createCondition", {
      type: "Condition",
      args: {
        projectId: nonNull(stringArg()),
        data: nonNull("ConditionInputType"),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        const createdCondition = await ctx.prisma.condition.create({
          data: {
            userId,
            projectId: args.projectId,
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
          await ctx.prisma.rule.create({
            data: {
              conditionId: createdCondition.id,
              ...ruleValues,
            },
          });
        }

        return createdCondition;
      },
    });
  },
});

export default CreateConditionMutation;
