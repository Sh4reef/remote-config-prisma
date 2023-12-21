import { extendType, nonNull, stringArg } from "nexus";
import { getUserId } from "../utils";

const CreateParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createParameter", {
      type: "Parameter",
      args: {
        projectId: nonNull(stringArg()),
        environment: nonNull("EnvironmentEnum"),
        data: nonNull("ParameterInputType"),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        const parameter = await ctx.prisma.parameter.create({
          data: {
            userId,
            parameter: args.data.parameter,
            value_type: args.data.value_type,
            projectId: args.projectId,
            string_value: args.data.string_value,
            integer_value: args.data.integer_value,
            boolean_value: args.data.boolean_value,
            json_value: args.data.json_value,
            enabled: args.data.enabled,
            environment: args.environment,
          },
        });
        const parameterOfAnotherEnv = await ctx.prisma.parameter.create({
          data: {
            userId,
            parameter: args.data.parameter,
            value_type: args.data.value_type,
            projectId: args.projectId,
            string_value: args.data.string_value,
            integer_value: args.data.integer_value,
            boolean_value: args.data.boolean_value,
            json_value: args.data.json_value,
            enabled: false,
            environment:
              args.environment === "development" ? "production" : "development",
          },
        });

        /**
         * Create equivalent parameter for each identity in both environments
         */
        const identities = await ctx.prisma.identity.findMany({
          where: {
            projectId: args.projectId,
          },
          select: {
            id: true,
            environment: true,
          },
        });
        await ctx.prisma.identityParameter.createMany({
          data: identities.map((identity) => ({
            userId,
            identityId: identity.id,
            parameterId:
              parameter.environment === "development"
                ? identity.environment === "development"
                  ? parameter.id
                  : parameterOfAnotherEnv.id
                : identity.environment === "production"
                ? parameterOfAnotherEnv.id
                : parameter.id,
          })),
        });

        for (const condition of args.data.conditions) {
          const createdCondition = await ctx.prisma.condition.upsert({
            where: { id: condition.id || "" },
            create: {
              userId,
              projectId: args.projectId,
              environment: args.environment,
              name: condition.name,
            },
            update: {
              name: condition.name,
              rules: {
                deleteMany: {
                  conditionId: condition.id || "",
                },
              },
            },
          });

          // upsert the other environment condition
          const conditionOfAnotherEnv = await ctx.prisma.condition.upsert({
            where: { id: createdCondition.anotherEnvironmentConditionId || "" },
            create: {
              userId,
              name: condition.name,
              projectId: args.projectId,
              environment:
                args.environment === "development"
                  ? "production"
                  : "development",
              anotherEnvironmentConditionId: createdCondition.id,
            },
            update: {
              name: condition.name,
              rules: {
                deleteMany: {
                  conditionId: condition.id || "",
                },
              },
            },
          });

          for (const rule of condition.rules) {
            const ruleValues = {
              rule: rule.rule,
              datetime: rule.datetime,
              platform: rule.platform,
              language: rule.language,
              country: rule.country,
              before_datetime: rule.before_datetime,
            };
            const createdRule = await ctx.prisma.rule.upsert({
              where: {
                id: rule.id || "",
              },
              create: {
                conditionId: createdCondition.id,
                ...ruleValues,
              },
              update: ruleValues,
            });

            const ruleOfAnotherEnv = await ctx.prisma.rule.upsert({
              where: {
                id: createdRule.anotherEnvironmentRuleId || "",
              },
              create: {
                conditionId: conditionOfAnotherEnv.id,
                anotherEnvironmentRuleId: createdRule.id,
                ...ruleValues,
              },
              update: ruleValues,
            });

            await ctx.prisma.rule.update({
              where: { id: createdRule.id },
              data: {
                anotherEnvironmentRuleId: ruleOfAnotherEnv.id,
              },
            });

            await ctx.prisma.rule.update({
              where: { id: ruleOfAnotherEnv.id },
              data: {
                anotherEnvironmentRuleId: createdRule.id,
              },
            });
          }

          await ctx.prisma.conditionValue.createMany({
            data: [
              {
                conditionId: createdCondition.id,
                parameterId: parameter.id,
                string_value: condition.string_value,
                integer_value: condition.integer_value,
                boolean_value: condition.boolean_value,
                json_value: condition.json_value,
              },
              {
                conditionId: conditionOfAnotherEnv.id,
                parameterId: parameterOfAnotherEnv.id,
                string_value: condition.string_value,
                integer_value: condition.integer_value,
                boolean_value: condition.boolean_value,
                json_value: condition.json_value,
              },
            ],
          });

          await ctx.prisma.condition.update({
            where: { id: createdCondition.id },
            data: { anotherEnvironmentConditionId: conditionOfAnotherEnv.id },
          });

          await ctx.prisma.condition.update({
            where: { id: conditionOfAnotherEnv.id },
            data: { anotherEnvironmentConditionId: createdCondition.id },
          });
        }

        await ctx.prisma.parameter.update({
          where: { id: parameter.id },
          data: { anotherEnvironmentParameterId: parameterOfAnotherEnv.id },
        });
        await ctx.prisma.parameter.update({
          where: { id: parameterOfAnotherEnv.id },
          data: { anotherEnvironmentParameterId: parameter.id },
        });

        return parameter;
      },
    });
  },
});

export default CreateParameterMutation;
