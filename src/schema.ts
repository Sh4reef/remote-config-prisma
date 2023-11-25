import { asNexusMethod, makeSchema } from "nexus";
import path from "path";
import { applyMiddleware } from "graphql-middleware";
import permissions from "./permissions";
import CreateParameterMutation from "./mutations/create-parameter";
import {
  CountryEnum,
  LanguageEnum,
  PlatformEnum,
  RuleEnum,
  ValueTypeEnum,
} from "./enums";
import RuleInputType from "./inputs/rule-input";
import ConditionInputType from "./inputs/condition-input";
import ParameterInputType from "./inputs/parameter-input";
import Parameter from "./types/parameter";
import UsersQuery from "./queries/users";
import ProjectsQuery from "./queries/projects";
import IdentitiesQuery from "./queries/identities";
import ParametersQuery from "./queries/parameters";
import ConditionsQuery from "./queries/conditions";
import CreateConditionMutation from "./mutations/create-condition";
import CreateIdentityMutation from "./mutations/create-identity";
import IdentityInputType from "./inputs/identity-input";
import UpdateParameterMutation from "./mutations/update-parameter";
import UpdateConditionMutation from "./mutations/update-condition";
import DeleteConditionMutation from "./mutations/delete-condition";
import DeleteParameterMutation from "./mutations/delete-parameter";
import CreateProjectMutation from "./mutations/create-project";
import AuthPayload from "./types/auth-payload";
import ConditionValue from "./types/condition-value";
import Rule from "./types/rule";
import User from "./types/user";
import Project from "./types/project";
import Identity from "./types/identity";
import Condition from "./types/condition";
import FormattedParameters from "./types/formatted-parameters";
import IdentityParameter from "./types/identity-parameter";
import IdentityParameterInputType from "./inputs/identity-parameter-input";
import LoginMutation from "./mutations/login";
import SignupMutation from "./mutations/signup";
import IdentityFormattedParametersQuery from "./queries/identity-formatted-parameters";
import FormattedParametersQuery from "./queries/formatted-parameters";
import UpdateIdentityParameterMutation from "./mutations/update-identity-parameter";
import ResetIdentityParameterMutation from "./mutations/reset-identity-parameter";
import {
  GraphQLDateTimeISO,
  GraphQLJSON,
  GraphQLJSONObject,
} from "graphql-scalars";
import IdentityQuery from "./queries/identity";
import DeleteIdentityMutation from "./mutations/delete-identity";

const schema = makeSchema({
  types: [
    // queries
    UsersQuery,
    ProjectsQuery,
    IdentitiesQuery,
    ParametersQuery,
    ConditionsQuery,
    FormattedParametersQuery,
    IdentityQuery,
    IdentityFormattedParametersQuery,

    // types
    User,
    Project,
    Identity,
    Parameter,
    IdentityParameter,
    Condition,
    Rule,
    ConditionValue,
    AuthPayload,
    FormattedParameters,

    // // mutations
    SignupMutation,
    LoginMutation,
    CreateProjectMutation,
    CreateIdentityMutation,
    CreateParameterMutation,
    UpdateParameterMutation,
    DeleteParameterMutation,
    CreateConditionMutation,
    UpdateConditionMutation,
    DeleteConditionMutation,
    UpdateIdentityParameterMutation,
    ResetIdentityParameterMutation,
    DeleteIdentityMutation,

    // scalar types
    asNexusMethod(GraphQLDateTimeISO, "datetime"),
    asNexusMethod(GraphQLJSON, "json"),
    asNexusMethod(GraphQLJSONObject, "jsonObject"),

    // // input types
    IdentityInputType,
    ParameterInputType,
    ConditionInputType,
    RuleInputType,
    IdentityParameterInputType,

    // // enum types
    ValueTypeEnum,
    PlatformEnum,
    LanguageEnum,
    CountryEnum,
    RuleEnum,
  ],
  shouldGenerateArtifacts: process.env.NODE_ENV === "development",
  outputs: {
    schema: path.join(__dirname, "generated", "schema.graphql"),
    typegen: path.join(__dirname, "generated", "nexus.ts"),
  },
  contextType: {
    module: path.join(__dirname, "context.ts"),
    export: "Context",
  },
});

export default applyMiddleware(schema, permissions);
