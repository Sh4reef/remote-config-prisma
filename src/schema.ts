import { makeSchema, objectType, scalarType } from "nexus";
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
import Users from "./queries/users";
import Projects from "./queries/projects";
import Identities from "./queries/identities";
import Parameters from "./queries/parameters";
import Conditions from "./queries/conditions";
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
import JsonScalar from "./scalars/json";
import IdentityParameter from "./types/identity-parameter";
import IdentityParameterInputType from "./inputs/identity-parameter-input";

const schema = makeSchema({
  types: [
    // queries
    Users,
    Projects,
    Identities,
    Parameters,
    Conditions,

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
    CreateProjectMutation,
    CreateIdentityMutation,
    CreateParameterMutation,
    UpdateParameterMutation,
    DeleteParameterMutation,
    CreateConditionMutation,
    UpdateConditionMutation,
    DeleteConditionMutation,

    // scalar types
    JsonScalar,

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
  outputs: {
    schema: path.join(__dirname, "/../schema.graphql"),
    typegen: path.join(__dirname, "/../generated/nexus.ts"),
  },
  contextType: {
    module: path.join(__dirname, "context.ts"),
    export: "Context",
  },
});

export default applyMiddleware(schema, permissions);
