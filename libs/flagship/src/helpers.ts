export const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

export function logInfo(...messages: string[]): void {
  logWithType('info', [].slice.call(messages, 0));
}

export function logError(...messages: string[]): void {
  logWithType('error', [].slice.call(messages, 0));
}

export function logWarn(...messages: string[]): void {
  return logWithType('warn', [].slice.call(messages, 0));
}

export function getCmdOption(argv: string[]): (a: string) => string | undefined {
  return (optionName: string): string | undefined => {
    const optionArgv = argv.slice(0).find((arg) => arg.indexOf(`--${optionName}=`) === 0);

    return (optionArgv && optionArgv.split('=')[1]) || undefined;
  };
}

function logWithType(type: string, args: string[]): void {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const _args = args.slice(0);
  switch (type) {
    case 'error':
      _args.unshift(`\n${colors.BgRed} ERROR ${colors.Reset}`);
      console.error.call(null, ..._args);
      break;

    case 'info':
      _args.unshift(`\n${colors.BgBlue} INFO ${colors.Reset}`);
      console.log.call(null, ..._args);
      break;

    case 'warn':
      _args.unshift(`\n${colors.BgYellow}${colors.FgBlack} WARN ${colors.Reset}`);
      console.warn.call(null, ..._args);
      break;

    default:
      throw new Error('expect 1st argument to be error, info or warn');
  }
}
