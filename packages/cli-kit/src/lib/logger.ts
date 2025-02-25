import {Writable} from 'stream';

import chalk, {Chalk} from 'chalk';
import dayjs from 'dayjs';

const GLOBAL_KEY = Symbol.for('global.event.emitter');

/**
 * Enum representing available logging levels in order of increasing severity
 */
export enum LogLevel {
  Debug,
  Log,
  Info,
  Warn,
  Error,
}

// State
let isPaused = false;
let logLevel = LogLevel.Info;
let groupDepth = 0;
let logQueue: Promise<void> = Promise.resolve();

// Original references
const originalStdout = process.stdout.write;
const originalConsoleLog = console.log;

/**
 * A writable stream that discards all input. Used when logging is paused.
 */
const nullStream = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});

/**
 * Mapping of log levels to their corresponding chalk color functions
 */
const COLOR_BY_LEVEL: Record<LogLevel, Chalk> = {
  [LogLevel.Debug]: chalk.gray,
  [LogLevel.Log]: chalk.green,
  [LogLevel.Info]: chalk.cyan,
  [LogLevel.Warn]: chalk.yellow,
  [LogLevel.Error]: chalk.red,
};

/**
 * Gets the current timestamp formatted as a gray-colored string
 * @returns Formatted timestamp string
 */
const getTimestamp = (): string =>
  `${chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'))} `;

/**
 * Formats an array of message parts into a single log message string
 * @param messages - Array of message parts to combine
 * @param newLine - Whether to append a newline character
 * @returns Formatted message string
 */
const formatMessage = (messages: string[], newLine = true): string =>
  `\r${getTimestamp()}${messages.filter(Boolean).join(' ').trimEnd()}${newLine ? '\n' : ''}`;

/**
 * Gets the padding string based on current group depth
 * @param options - Padding options
 * @param options.padding - Character to use for padding
 * @param options.last - Character to use for last padding element
 * @returns Formatted padding string
 */
const getGroupPadding = (options?: {
  padding?: string;
  last?: string;
}): string => {
  const {padding = '│', last} = options ?? {};
  if (groupDepth === 0 && last) return last;
  if (groupDepth === 0) return '';

  const paddingArray = new Array(groupDepth).fill(padding);
  if (last) paddingArray[paddingArray.length - 1] = last;

  return chalk.gray(paddingArray.join(''));
};

/**
 * Converts a LogLevel enum value to its string representation
 * @param level - The log level to convert
 * @returns String representation of the log level
 */
const getTagStringByLevel = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.Log:
      return '  log';
    case LogLevel.Info:
      return ' info';
    case LogLevel.Warn:
      return ' warn';
    case LogLevel.Error:
      return 'error';
    case LogLevel.Debug:
      return 'debug';
    default:
      return '';
  }
};

/**
 * Gets a colored tag string for a given log level
 * @param level - The log level to get tag for
 * @returns Colored tag string
 */
const getLevelTag = (level: LogLevel): string =>
  chalk.bold(COLOR_BY_LEVEL[level](getTagStringByLevel(level)));

/**
 * Writes formatted messages to stdout
 * @param messages - Array of messages to write
 */
const writeToStdout = (messages: string[]): void => {
  process.stdout.write(formatMessage(messages));
};

/**
 * Handles logging when the logger is paused by emitting events instead of writing to stdout
 * @param messages - Array of messages to log
 * @param isError - Whether this is an error log
 */
const handlePausedLog = async (
  messages: (string | Error)[],
  isError = false,
): Promise<void> => {
  return new Promise<void>(resolve => {
    logQueue = logQueue.then(async () => {
      // @ts-ignore
      (global[GLOBAL_KEY] as any).emit(
        'onLog',
        formatMessage(
          messages.map(m => m.toString()),
          false,
        ),
      );

      if (isError && messages[3] && messages[3] instanceof Error) {
        const error = messages[3] as Error;
        const errorStackArr = error.stack?.split('\n') ?? [];
        errorStackArr.shift();
        // @ts-ignore
        (global[GLOBAL_KEY] as any).emit(
          'onLog',
          chalk.dim('\n' + errorStackArr.join('\n')),
        );
      }
      resolve();
    });
  });
};

/**
 * Core logging function that handles message formatting and output
 * @param level - Log level for the message
 * @param message - The message to log
 * @param scope - The scope of the log message
 */
const logMessage = async (
  level: LogLevel,
  message: string | Error,
  scope = 'cli',
): Promise<void> => {
  if (logLevel > level) return;

  const messages: (string | Error)[] = [
    getGroupPadding(),
    getLevelTag(level),
    chalk.magenta(scope),
    message,
  ];

  if (isPaused) {
    await handlePausedLog(messages, level === LogLevel.Error);
    return;
  }

  writeToStdout(messages.map(m => m.toString()));
};

/**
 * Logs a debug message
 * @param message - The message to log
 * @param scope - The scope of the log message
 */
export const debug = async (message: string, scope = 'cli'): Promise<void> =>
  logMessage(LogLevel.Debug, message, scope);

/**
 * Logs a standard message
 * @param message - The message to log
 * @param scope - The scope of the log message
 */
export const log = async (message: string, scope = 'cli'): Promise<void> =>
  logMessage(LogLevel.Log, message, scope);

/**
 * Logs an info message
 * @param message - The message to log
 * @param scope - The scope of the log message
 */
export const info = async (message: string, scope = 'cli'): Promise<void> =>
  logMessage(LogLevel.Info, message, scope);

/**
 * Logs a warning message
 * @param message - The message to log
 * @param scope - The scope of the log message
 */
export const warn = async (message: string, scope = 'cli'): Promise<void> =>
  logMessage(LogLevel.Warn, message, scope);

/**
 * Logs an error message
 * @param message - The message or error to log
 * @param scope - The scope of the log message
 */
export const error = async (
  message: string | Error,
  scope = 'cli',
): Promise<void> => logMessage(LogLevel.Error, message, scope);

/**
 * Pauses logging output by redirecting stdout and console.log
 */
export const pause = (): void => {
  isPaused = true;
  console.log = () => {};
  // @ts-ignore
  process.stdout.write = nullStream.write.bind(nullStream);
};

/**
 * Resumes logging output by restoring stdout and console.log
 */
export const resume = (): void => {
  isPaused = false;
  console.log = originalConsoleLog;
  process.stdout.write = originalStdout;
};

/**
 * Sets the minimum log level that will be output
 * @param level - The minimum log level to show
 */
export const setLogLevel = (level: LogLevel): void => {
  logLevel = level;
};

/**
 * Gets the current minimum log level
 * @returns Current log level
 */
export const getLogLevel = (): LogLevel => logLevel;

/**
 * Returns a promise that resolves when all queued logs are processed
 */
export const flush = async (): Promise<void> => {
  await logQueue;
};

/**
 * Converts a string to its corresponding LogLevel enum value
 * @param level - String representation of log level
 * @returns Corresponding LogLevel enum value
 */
export const getLogLevelFromString = (level: string): LogLevel => {
  switch (level.toLowerCase()) {
    case 'debug':
      return LogLevel.Debug;
    case 'log':
      return LogLevel.Log;
    case 'warn':
      return LogLevel.Warn;
    case 'error':
      return LogLevel.Error;
    case 'info':
    default:
      return LogLevel.Info;
  }
};

/**
 * Prints command options in a formatted tree structure
 * @param options - Object containing command options
 * @param cmd - Name of the command
 */
export const printCmdOptions = async <T extends Record<string, any>>(
  options: T,
  cmd: string,
): Promise<void> => {
  await info(`${cmd} options`);

  for (const [key, value, index] of Object.entries(options).map((entry, i) => [
    ...entry,
    i,
  ])) {
    const isLast = index === Object.entries(options).length - 1;
    const pipe = `${isLast ? '╰' : '├'}─`;
    const keyValue = `${key}: ${JSON.stringify(value)}`;

    await info(chalk.gray(`${pipe} ${keyValue}${isLast ? '\n' : ''}`));
  }
};
