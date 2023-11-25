import { and, or, rule } from "graphql-shield";
import { Context } from "./context";
import { getUserId } from "./utils";

export const isAuthenticated = rule()(async (_, __, ctx: Context) => {
  const userId = getUserId(ctx);
  return Boolean(userId);
});

export const isOwnerOfProject = rule()(async (_, args, ctx: Context, info) => {
  const userId = getUserId(ctx);
  const projectId = args["projectId"];
  const project = await ctx.prisma.project.findUnique({
    where: { id: projectId, userId },
  });
  return Boolean(project) || new Error("Forbidden");
});

export const isOwnerOfParameter = rule()(async (_, args, ctx: Context) => {
  const userId = getUserId(ctx);
  const parameterId = args["parameterId"];
  const parameter = await ctx.prisma.parameter.findUnique({
    where: { id: parameterId, userId },
  });
  return Boolean(parameter) || new Error("Forbidden");
});

export const isOwnerOfCondition = rule()(async (_, args, ctx: Context) => {
  const userId = getUserId(ctx);
  const conditionId = args["conditionId"];
  const condition = await ctx.prisma.condition.findUnique({
    where: { id: conditionId, userId },
  });
  return Boolean(condition) || new Error("Forbidden");
});

export const isOnwerOfIdentity = rule()(async (_, args, ctx: Context) => {
  const userId = getUserId(ctx);
  const identityId = args["identityId"];
  const identity = await ctx.prisma.identity.findUnique({
    where: { id: identityId, userId },
  });
  return Boolean(identity) || new Error("Forbidden");
});

export const isOnwerOfIdentityParameter = rule()(
  async (_, args, ctx: Context) => {
    const userId = getUserId(ctx);
    const identityParameterId = args["identityParameterId"];
    const identityParameter = await ctx.prisma.identityParameter.findUnique({
      where: { id: identityParameterId, userId },
    });
    return Boolean(identityParameter) || new Error("Forbidden");
  }
);

export const isProjectUnique = rule()(async (_, args, ctx: Context) => {
  const userId = getUserId(ctx);
  const name = args["name"];
  const project = await ctx.prisma.project.findFirst({
    where: { userId, name },
  });
  return (
    !Boolean(project) || new Error("You already have a project with this name")
  );
});

export const isIdentityUnique = rule()(async (_, args, ctx: Context) => {
  const userId = getUserId(ctx);
  const identityName = args["data"]["identity"];
  const identity = await ctx.prisma.identity.findFirst({
    where: { userId, identity: identityName },
  });
  return !Boolean(identity) || new Error("You already have this identity");
});

export const isParameterUnique = rule()(async (_, args, ctx: Context) => {
  const userId = getUserId(ctx);
  const parameterName = args["data"]["parameter"];
  const parameter = await ctx.prisma.parameter.findFirst({
    where: { userId, parameter: parameterName },
  });
  return !Boolean(parameter) || new Error("You already have this parameter");
});

export const isOwner = and(
  isAuthenticated,
  or(
    isOwnerOfProject,
    isOwnerOfParameter,
    isOwnerOfCondition,
    isOnwerOfIdentity,
    isOnwerOfIdentityParameter
  )
);
