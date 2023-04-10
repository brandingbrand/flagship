/**
 * A collection of ANSI color codes for console logging.
 *
 * @property {string} Reset - The ANSI code for resetting console color.
 * @property {string} Bright - The ANSI code for brightening console color.
 * @property {string} Dim - The ANSI code for dimming console color.
 * @property {string} Underscore - The ANSI code for underlining console text.
 * @property {string} Blink - The ANSI code for blinking console text.
 * @property {string} Reverse - The ANSI code for reversing the foreground and background colors of console text.
 * @property {string} Hidden - The ANSI code for hiding console text.
 * @property {string} FgBlack - The ANSI code for setting the foreground color to black.
 * @property {string} FgRed - The ANSI code for setting the foreground color to red.
 * @property {string} FgGreen - The ANSI code for setting the foreground color to green.
 * @property {string} FgYellow - The ANSI code for setting the foreground color to yellow.
 * @property {string} FgBlue - The ANSI code for setting the foreground color to blue.
 * @property {string} FgMagenta - The ANSI code for setting the foreground color to magenta.
 * @property {string} FgCyan - The ANSI code for setting the foreground color to cyan.
 * @property {string} FgWhite - The ANSI code for setting the foreground color to white.
 * @property {string} BgBlack - The ANSI code for setting the background color to black.
 * @property {string} BgRed - The ANSI code for setting the background color to red.
 * @property {string} BgGreen - The ANSI code for setting the background color to green.
 * @property {string} BgYellow - The ANSI code for setting the background color to yellow.
 * @property {string} BgBlue - The ANSI code for setting the background color to blue.
 * @property {string} BgMagenta - The ANSI code for setting the background color to magenta.
 * @property {string} BgCyan - The ANSI code for setting the background color to cyan.
 * @property {string} BgWhite - The ANSI code for setting the background color to white.
 */
export const colors = {
  Reset: "\u001B[0m",
  Bright: "\u001B[1m",
  Dim: "\u001B[2m",
  Underscore: "\u001B[4m",
  Blink: "\u001B[5m",
  Reverse: "\u001B[7m",
  Hidden: "\u001B[8m",

  FgBlack: "\u001B[30m",
  FgRed: "\u001B[31m",
  FgGreen: "\u001B[32m",
  FgYellow: "\u001B[33m",
  FgBlue: "\u001B[34m",
  FgMagenta: "\u001B[35m",
  FgCyan: "\u001B[36m",
  FgWhite: "\u001B[37m",

  BgBlack: "\u001B[40m",
  BgRed: "\u001B[41m",
  BgGreen: "\u001B[42m",
  BgYellow: "\u001B[43m",
  BgBlue: "\u001B[44m",
  BgMagenta: "\u001B[45m",
  BgCyan: "\u001B[46m",
  BgWhite: "\u001B[47m",
};

/**
 * Logs the given messages with type "info".
 *
 * @param {...string} messages - The messages to log.
 * @returns {void}
 */
export const logInfo = (...messages: string[]): void => {
  logWithType("info", Array.prototype.slice.call(messages, 0));
};

/**
 * Logs the given messages with type "error".
 *
 * @param {...string} messages - The messages to log.
 * @returns {void}
 */
export const logError = (...messages: string[]): void => {
  logWithType("error", Array.prototype.slice.call(messages, 0));
};

/**
 * Logs the given messages with type "warn".
 *
 * @param {...string} messages - The messages to log.
 * @returns {void}
 */
export const logWarn = (...messages: string[]): void => {
  logWithType("warn", Array.prototype.slice.call(messages, 0));
};

/**
 * Returns a function that takes an option name and returns the value
 * of the corresponding command line option from the given arguments.
 *
 * @param {string[]} argv - The command line arguments.
 * @returns {(optionName: string) => string|undefined} - The option value.
 */
export const getCmdOption =
  (argv: string[]): ((a: string) => string | undefined) =>
  (optionName: string): string | undefined => {
    const optionArgv = [...argv].find((arg) =>
      arg.startsWith(`--${optionName}=`)
    );

    return (optionArgv && optionArgv.split("=")[1]) || undefined;
  };

/**
 * Logs the given messages with the given type.
 *
 * @param {string} type - The type of log to create.
 * @param {string[]} args - The messages to log.
 * @returns {void}
 * @throws {Error} If the type is not "error", "info", or "warn".
 */
const logWithType = (type: string, args: string[]): void => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const _args = [...args];
  switch (type) {
    case "error":
      _args.unshift(`\n${colors.BgRed} ERROR ${colors.Reset}`);
      console.error.call(null, ..._args);
      break;

    case "info":
      _args.unshift(`\n${colors.BgBlue} INFO ${colors.Reset}`);
      console.log.call(null, ..._args);
      break;

    case "warn":
      _args.unshift(
        `\n${colors.BgYellow}${colors.FgBlack} WARN ${colors.Reset}`
      );
      console.warn.call(null, ..._args);
      break;

    default:
      throw new Error("expect 1st argument to be error, info or warn");
  }
};
