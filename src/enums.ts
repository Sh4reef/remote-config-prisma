import { enumType } from "nexus";

/**
 * ************************ Enum types ************************
 */

/**
 * Rule enum
 */
export const RuleEnum = enumType({
  name: "RuleEnum",
  members: ["datetime", "platform", "language", "country"],
});

/**
 * value enum
 */
export const ValueTypeEnum = enumType({
  name: "ValueTypeEnum",
  members: ["string", "integer", "boolean", "json"],
});

/**
 * Country enum
 */
export const CountryEnum = enumType({
  name: "CountryEnum",
  members: ["saudi_arabia", "united_states"],
});

/**
 * Platform type enum
 */
export const PlatformEnum = enumType({
  name: "PlatformEnum",
  members: ["ios", "android", "web"],
});

/**
 * Language type enum
 */
export const LanguageEnum = enumType({
  name: "LanguageEnum",
  members: ["arabic", "english"],
});
