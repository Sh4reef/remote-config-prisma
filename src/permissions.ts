import { rule, shield } from "graphql-shield";
import { Context } from "./context";
import { getUserId } from "./utils";

const rules = {
  isAuthenticated: rule()(async (_, __, ctx: Context) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
};

const permissions = shield(
  {
    Query: {
      projects: rules.isAuthenticated,
      parameters: rules.isAuthenticated,
      conditions: rules.isAuthenticated,
    },
    Mutation: {
      createProject: rules.isAuthenticated,
      createIdentity: rules.isAuthenticated,
      createParameter: rules.isAuthenticated,
      updateParameter: rules.isAuthenticated,
      deleteParameter: rules.isAuthenticated,
      createCondition: rules.isAuthenticated,
      updateCondition: rules.isAuthenticated,
      deleteCondition: rules.isAuthenticated,
    },
  },
  {
    allowExternalErrors: true,
  }
);

export default permissions;
