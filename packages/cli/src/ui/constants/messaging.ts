/**
 * CLI configuration constants
 */
export const constants = {
  /** GitHub URL for reporting issues with the CLI */
  ERROR_REPORT_URL: 'https://github.com/brandingbrand/flagship/issues',

  /** Name of the CLI tool used in help text and command execution */
  CLI_NAME: 'flagship-code',

  /** Description of the CLI's purpose shown in help text */
  CLI_DESCRIPTION:
    'command-line interface for ephemeral native code generation',

  /** Available logging levels from most to least verbose */
  LOG_LEVEL_CHOICES: ['debug', 'log', 'info', 'warn', 'error'] as const,

  /** Supported platforms for code generation */
  PLATFORM_CHOICES: ['ios', 'android', 'native'] as const,

  /** Supported React Native version profiles for dependency alignment */
  RN_PROFILE_CHOICES: [
    '0.72',
    '0.73',
    '0.74',
    '0.75',
    '0.76',
    '0.77',
    '0.78',
    '0.79',
    '0.80',
  ] as const,

  /** Default logging level if none specified */
  DEFAULT_LOG_LEVEL: 'info',

  /** Default platform for code generation if none specified */
  DEFAULT_PLATFORM: 'native',
} as const;
