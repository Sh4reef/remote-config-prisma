import { allow, deny, rule, shield } from "graphql-shield";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { Context } from "./context";
import { JwtPayload, verify } from "jsonwebtoken";
import { User } from "@prisma/client";
import { applyMiddleware } from "graphql-middleware";
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
