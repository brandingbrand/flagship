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

export const logInfo = (...messages: string[]): void => {
  logWithType("info", Array.prototype.slice.call(messages, 0));
};

export const logError = (...messages: string[]): void => {
  logWithType("error", Array.prototype.slice.call(messages, 0));
};

export const logWarn = (...messages: string[]): void => {
  logWithType("warn", Array.prototype.slice.call(messages, 0));
};

export const getCmdOption =
  (argv: string[]): ((a: string) => string | undefined) =>
  (optionName: string): string | undefined => {
    const optionArgv = [...argv].find((arg) =>
      arg.startsWith(`--${optionName}=`)
    );

    return (optionArgv && optionArgv.split("=")[1]) || undefined;
  };

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
