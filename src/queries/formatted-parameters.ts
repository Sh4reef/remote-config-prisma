import { extendType, intArg, nonNull } from "nexus";
import moment from "moment";
import { getUserId } from "../utils";
import { isRulesApplied } from "../helpers";

const FormattedParametersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("formattedParameters", {
      type: "FormattedParameters",
      args: {
        projectId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);

        const parameters = await ctx.prisma.parameter.findMany({
          where: { projectId: args.projectId, project: { userId } },
          include: {
            conditionValues: {
              include: {
                condition: {
                  include: {
                    rules: true,
                  },
                },
              },
            },
          },
        });

        const formattedParameters = parameters.reduce(
          (prevParameters, parameter) => {
            const valueType = parameter["value_type"];
            const conditionValues = parameter["conditionValues"];
            let value = parameter[`${valueType}_value`];

            conditionValues.forEach((conditionValue) => {
              const conditionalValue = conditionValue[`${valueType}_value`];
              const rules = conditionValue["condition"]["rules"];
              const rulesApplied = isRulesApplied(rules);

              value = rulesApplied ? conditionalValue : value;
            });

            return {
              ...prevParameters,
              [parameter.parameter]: value,
            };
          },
          {}
        );

        return {
          parameters: formattedParameters,
        };
      },
    });
  },
});

export default FormattedParametersQuery;
