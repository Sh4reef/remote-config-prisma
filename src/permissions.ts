import { allow, and, shield } from "graphql-shield";
import * as rules from "./rules";

const permissions = shield(
  {
    Query: {
      "*": rules.isOwner,
      projects: rules.isAuthenticated,
      users: allow,
    },
    Mutation: {
      "*": rules.isOwner,
      createProject: and(rules.isAuthenticated, rules.isProjectUnique),
      createIdentity: and(rules.isOwner, rules.isIdentityUnique),
      createParameter: and(rules.isOwner, rules.isParameterUnique),
      login: allow,
      signup: allow,
    },
  },
  {
    allowExternalErrors: true,
  }
);

export default permissions;
