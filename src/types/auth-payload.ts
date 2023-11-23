import { objectType } from "nexus";

/**
 * AuthPayload type
 */
const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.nullable.field("user", { type: "User" });
  },
});

export default AuthPayload;
