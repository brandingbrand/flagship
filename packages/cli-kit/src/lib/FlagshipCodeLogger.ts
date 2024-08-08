import {Writable} from 'stream';

import chalk, {Chalk} from 'chalk';
import dayjs from 'dayjs';

import {FlagshipCodeManager} from './FlagshipCodeManager';

export enum LogLevel {
  Debug,
  Log,
  Info,
  Warn,
  Error,
}

/**
 * A logger for the flagship code that ensures there is only one instance.
 * Provides methods for logging messages with different log levels.
 *
 * @example
 * const logger = FlagshipCodeLogger.shared;
 * logger.log('This is a log message');
 * logger.info('This is an info message');
 * logger.warn('This is a warning message');
 * logger.error('This is an error message');
 */
export class FlagshipCodeLogger {
  private static COLOR_BY_LEVEL: Record<LogLevel, Chalk> = {
    [LogLevel.Debug]: chalk.gray,
    [LogLevel.Log]: chalk.green,
    [LogLevel.Info]: chalk.cyan,
    [LogLevel.Warn]: chalk.yellow,
    [LogLevel.Error]: chalk.red,
  };

  private groupDepth = 0;

  /**
   * A boolean indicating whether logging is currently paused.
   */
  protected isPaused = false;

  /**
   * Log level to determine which logs to show and hide.
   */
  protected logLevel = LogLevel.Info;

  /**
   * The original `process.stdout.write` function.
   *
   * @type {Function}
   * @private
   */
  protected __stdout__ = process.stdout.write;

  /**
   * A writable stream that does nothing.
   *
   * @type {Writable}
   * @private
   */
  protected __stdout__redirect = new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });

  /**
   * The original `console.log` function.
   * @private
   */
  protected __console_log__ = console.log;

  /**
   * A console.log override function that does nothing.
   * @private
   */
  protected __console_log__redirect = function () {};

  // The single instance of the FlagshipCodeLogger
  protected static instance: FlagshipCodeLogger;

  getLogLevelFromString(level: string): LogLevel {
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
  }

  /**
   * Returns the shared instance of the FlagshipCodeLogger.
   * If no instance exists, it creates one.
   *
   * @returns {FlagshipCodeLogger} The shared instance of FlagshipCodeLogger.
   */
  static get shared(): FlagshipCodeLogger {
    if (!FlagshipCodeLogger.instance) {
      FlagshipCodeLogger.instance = new FlagshipCodeLogger();
    }

    return FlagshipCodeLogger.instance;
  }

  /**
   * Protected constructor to prevent direct instantiation.
   */
  protected constructor() {}

  /**
   * Gets the current timestamp formatted as a string.
   *
   * @returns {string} The formatted timestamp.
   */
  protected getTimestamp(): string {
    return `${chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'))} `;
  }

  /**
   * Constructs a formatted log message.
   *
   * @param {string[]} messages - The parts of the message to be combined.
   * @returns {string} The formatted log message.
   */
  protected getMessage(messages: string[], newLine = true): string {
    return `\r${this.getTimestamp()}${messages
      .filter(Boolean)
      .join(' ')
      .trimEnd()}${newLine ? '\n' : ''}`;
  }

  /**
   * Writes a formatted message to stdout.
   *
   * @param {string[]} messages - The parts of the message to be written.
   */
  protected stdout(...messages: string[]): void {
    process.stdout.write(this.getMessage(messages));
  }

  /**
   * Gets the padding for log messages based on the group depth.
   *
   * @param {Object} [options] - Options for padding.
   * @param {string} [options.padding='│'] - The padding character.
   * @param {string} [options.last] - The character for the last padding element.
   * @returns {string} The padding string.
   */
  protected getGroupPadding(options?: {
    padding?: string;
    last?: string;
  }): string {
    const {padding = '│', last} = options ?? {};
    if (this.groupDepth === 0 && last) return last;
    if (this.groupDepth === 0) return '';
    const paddingArray = new Array(this.groupDepth).fill(padding);

    if (last) paddingArray[paddingArray.length - 1] = last;

    return chalk.gray(paddingArray.join(''));
  }

  /**
   * Gets the tag string for a given log level.
   *
   * @param {LogLevel} level - The log level.
   * @returns {string} The tag string for the log level.
   */
  protected getTagStringByLevel(level: LogLevel): string {
    switch (true) {
      case level === LogLevel.Log:
        return 'log';
      case level === LogLevel.Info:
        return 'info';
      case level === LogLevel.Warn:
        return 'warn';
      case level === LogLevel.Error:
        return 'error';
      case level === LogLevel.Debug:
        return 'debug';
      default:
        return '';
    }
  }

  /**
   * Gets the formatted level tag for a given log level.
   *
   * @param {LogLevel} level - The log level.
   * @returns {string} The formatted level tag.
   */
  protected getLevelTag(level: LogLevel): string {
    return chalk.bold(
      FlagshipCodeLogger.COLOR_BY_LEVEL[level](this.getTagStringByLevel(level)),
    );
  }

  /**
   *
   */
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   *
   */
  getLogLevel() {
    return this.logLevel;
  }

  /**
   * Logs a message with the 'log' level.
   *
   * @param {string} message - The message to log.
   * @param {string} [scope='cli'] - The scope of the message.
   *
   * @example
   * FlagshipCodeLogger.shared.log('This is a log message');
   */
  debug(message: string, scope = 'cli'): void {
    if (this.getLogLevel() > LogLevel.Debug) return;

    const messages = [
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Debug),
      chalk.magenta(scope),
      message,
    ];

    if (this.isPaused) {
      FlagshipCodeManager.shared.emit(
        'onLog',
        this.getMessage(messages, false),
      );
      return;
    }

    this.stdout(...messages);
  }

  /**
   * Logs a message with the 'log' level.
   *
   * @param {string} message - The message to log.
   * @param {string} [scope='cli'] - The scope of the message.
   *
   * @example
   * FlagshipCodeLogger.shared.log('This is a log message');
   */
  log(message: string, scope = 'cli'): void {
    if (this.getLogLevel() > LogLevel.Log) return;

    const messages = [
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Log),
      chalk.magenta(scope),
      message,
    ];

    if (this.isPaused) {
      FlagshipCodeManager.shared.emit(
        'onLog',
        this.getMessage(messages, false),
      );
      return;
    }

    this.stdout(...messages);
  }

  /**
   * Logs a message with the 'info' level.
   *
   * @param {string} message - The message to log.
   * @param {string} [scope='cli'] - The scope of the message.
   *
   * @example
   * FlagshipCodeLogger.shared.info('This is an info message');
   */
  info(message: string, scope = 'cli'): void {
    if (this.getLogLevel() > LogLevel.Info) return;

    const messages = [
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Info),
      chalk.magenta(scope),
      message,
    ];

    if (this.isPaused) {
      FlagshipCodeManager.shared.emit(
        'onLog',
        this.getMessage(messages, false),
      );
      return;
    }

    this.stdout(...messages);
  }

  /**
   * Logs a message with the 'warn' level.
   *
   * @param {string} message - The message to log.
   * @param {string} [scope='cli'] - The scope of the message.
   *
   * @example
   * FlagshipCodeLogger.shared.warn('This is a warning message');
   */
  warn(message: string, scope = 'cli'): void {
    if (this.getLogLevel() > LogLevel.Warn) return;

    const messages = [
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Warn),
      chalk.magenta(scope),
      message,
    ];

    if (this.isPaused) {
      FlagshipCodeManager.shared.emit(
        'onLog',
        this.getMessage(messages, false),
      );
      return;
    }

    this.stdout(...messages);
  }

  /**
   * Logs a message with the 'error' level.
   *
   * @param {string} message - The message to log.
   * @param {string} [scope='cli'] - The scope of the message.
   *
   * @example
   * FlagshipCodeLogger.shared.error('This is an error message');
   */
  error(message: string, scope = 'cli'): void {
    if (this.getLogLevel() > LogLevel.Error) return;

    const messages = [
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Error),
      chalk.magenta(scope),
      message,
    ];

    if (this.isPaused) {
      FlagshipCodeManager.shared.emit(
        'onLog',
        this.getMessage(messages, false),
      );

      if ((message as any) instanceof Error) {
        const errorStackArr = (message as any).stack.split(
          '\n',
        ) as unknown as Array<string>;

        errorStackArr.shift();

        FlagshipCodeManager.shared.emit(
          'onLog',
          chalk.dim('\n' + errorStackArr.join('\n')),
        );
      }
      return;
    }

    this.stdout(...messages);
  }

  /**
   * Pauses the logger by redirecting `console.log` and `process.stdout.write` to custom handlers.
   * Sets the `isPaused` flag to `true`.
   *
   * @example
   * const logger = FlagshipCodeLogger.shared;
   * logger.pause();
   * // All subsequent console.log and process.stdout.write calls are redirected.
   */
  pause() {
    this.isPaused = true;

    console.log = this.__console_log__redirect;

    // @ts-ignore
    process.stdout.write = this.__stdout__redirect.write.bind(
      this.__stdout__redirect,
    );
  }

  /**
   * Resumes the logger by restoring the original `console.log` and `process.stdout.write`.
   * Sets the `isPaused` flag to `false`.
   *
   * @example
   * const logger = FlagshipCodeLogger.shared;
   * logger.resume();
   * // console.log and process.stdout.write are restored to their original implementations.
   */
  resume() {
    this.isPaused = false;

    console.log = this.__console_log__;
    process.stdout.write = this.__stdout__;
  }

  /**
   * Prints debug options in a formatted manner.
   * Logs each key-value pair from the options object, with a visual pipe indicating the hierarchy.
   *
   * @param {T} options - The options object to be printed.
   *
   * @template T
   *
   * @example
   * const logger = FlagshipCodeLogger.shared;
   * logger.printDebugOptions({ option1: 'value1', option2: 'value2' });
   * // Outputs:
   * // ├─ option1: "value1"
   * // ╰─ option2: "value2"
   */
  printCmdOptions = <T extends Record<string, any>>(
    options: T,
    cmd: string,
  ): void => {
    this.info(`${cmd} options`);

    Object.entries(options).forEach(([key, value], index, entries) => {
      const isLast = entries.length - 1 === index;
      const pipe = `${isLast ? '╰' : '├'}─`;
      const keyValue = `${key}: ${JSON.stringify(value)}`;

      this.info(chalk.gray(`${pipe} ${keyValue}${isLast ? '\n' : ''}`));
    });
  };
}
