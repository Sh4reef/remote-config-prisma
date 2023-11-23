import { extendType, intArg, nonNull } from "nexus";
import moment from "moment";
import { getUserId } from "../utils";

const FormattedParameters = extendType({
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

        const formattedParams = parameters.reduce(
          (prevParameters, parameter) => {
            const valueType = parameter["value_type"];
            const value = parameter[`${valueType}_value`];
            const conditionValues = parameter["conditionValues"];

            let formattedParameter;

            conditionValues.forEach((conditionValue) => {
              const conditionalValue = conditionValue[`${valueType}_value`];
              const rules = conditionValue["condition"]["rules"];
              const rulesApplied = rules.every((rule) => {
                const ruleType = rule["rule"];
                const ruleValue = rule[ruleType];

                // datetime logic
                if (ruleType === "datetime") {
                  var isBefore = rule["before_datetime"];
                  if (isBefore) {
                    return moment().isBefore(ruleValue);
                  } else {
                    return moment().isAfter(ruleValue);
                  }
                }
              });

              formattedParameter = rulesApplied ? conditionalValue : value;
            });

            return {
              ...prevParameters,
              [`${parameter.parameter}`]: formattedParameter,
            };
          },
          {}
        );

        return {
          parameters: formattedParams,
        };
      },
    });
  },
});

export default FormattedParameters;
