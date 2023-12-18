import { allow, and, shield } from "graphql-shield";
import * as rules from "./rules";
import { ShieldRule } from "graphql-shield/typings/types";
import { IS_DEVELOPMENT } from "./variables";

const Query: { [key: string]: ShieldRule } = {
  "*": rules.isOwner,
  projects: rules.isAuthenticated,
};

const Mutation: { [key: string]: ShieldRule } = {
  "*": rules.isOwner,
  createProject: and(rules.isAuthenticated, rules.isProjectUnique),
  createIdentity: and(rules.isOwner, rules.isIdentityUnique),
  createParameter: and(rules.isOwner, rules.isParameterUnique),
  login: allow,
  signup: allow,
  verifyUser: allow,
};

if (IS_DEVELOPMENT) {
  Query["users"] = allow;
}

const permissions = shield(
  {
    Query,
    Mutation,
  },
  {
    allowExternalErrors: true,
  }
);

export default permissions;
