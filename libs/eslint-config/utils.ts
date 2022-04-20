/**
 * Used to indicate a rule that has been turned off and optionally
 * explain why
 *
 * @param _reason the rationale for not using the rule.
 * @return the rule disabled
 */
export const OFF = (_reason?: string): string => 'off';

/**
 * Some plugins extend rules of other plugins.
 * For example, the typescript plugin may extend a rule in the base eslint rule set.
 *
 * @param _ruleId the rule that takes precedence over this one
 * @return the rule disabled
 */
export const SUCCESSOR = (_ruleId: string): string => 'off';

/**
 * Used for `@typescript-eslint` extension rules for eslint rules of the same name.
 * see: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#extension-rules
 */
export const TYPESCRIPT_EXTENDED = '@typescript-eslint/*';

export const WARN = 'warn';
export const ERROR = 'error';
export const DEPRECATED = 'off';

/**
 * Used when a rule is only turned off because it was found not to work well.
 *
 * @param _asOfVersion the version of the parser or plugin when last investigated
 * @param _reason the reason why this rule was found to be buggy
 * @return the rule disabled
 */
export const BUGGY = (_asOfVersion: string, _reason: string): string => 'off';

/**
 * This is useful when adding many new rules at once.
 */
export const UNKNOWN = 'off';

/**
 * Used to signal that while a rule may have utility, it should really be configured differently
 * depending on the project.
 */
export const PROJECT_BY_PROJECT =
  'This is a project-by-project rule that should be configured differently depending on the project.';

/** Used to signify that the rule in question is borderline-useless. */
export const NOT_VALUABLE = "I don't see enough value to justify including this rule.";

/** Used to signify that the rule in question is not useful for this particular platform */
export const NOT_RELEVANT = "I don't see enough value to justify including this rule.";

/**
 * Used to signal that while a rule may be useful for formatting, formatting itself ise beyond the
 * scope of this config
 */
export const CODE_FORMATTING = 'Code formatting rules are unnecessary when using prettier';

/** This rule is turned off in an override for *.js files only because it requires typescript */
export const JAVASCRIPT = 'off';

export const MARKDOWN = 'off';

export const TYPESCRIPT = 'off';

export const USER_DISCRETION = 'off';

/**
 * This rule is disabled due to the performance cost of running the rule being greater than the
 * benefit of the rule itself.
 */
export const LARGE_PERFORMANCE_COST = 'off';

/**
 * Our stack currently does not support es2021
 */
export const ES2021 = 'off';
