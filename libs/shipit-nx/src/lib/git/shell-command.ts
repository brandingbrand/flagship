import * as nodeChildProcess from 'child_process';

export interface ShellCommandResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * This is our opinionated wrapper around `child_process` module. It exposes
 * limited API to call underlying system commands securely with proper Flow
 * types. It also throws exceptions instead of exiting so you can catch the
 * failures and react easily (for example call `--abort` when working with Git).
 */
export class ShellCommand {
  constructor(private readonly cwd: string, ...command: readonly string[]) {
    this.command = command;
  }

  private readonly command: readonly string[];
  private outputToScreen = false;
  private throwForNonZeroExit = true;
  private stdin?: string;
  private environmentVariables?: NodeJS.ProcessEnv;

  private maybeThrow(error: Error): never | void {
    if (this.throwForNonZeroExit) {
      throw error;
    }
  }

  /**
   * Method `runSynchronously` will return empty string when you set output
   * to screen.
   *
   * @return the same shell command
   */
  public setOutputToScreen(): this {
    this.outputToScreen = true;
    return this;
  }

  public setStdin(input: string): this {
    this.stdin = input;
    return this;
  }

  /**
   * This method will effectively hide any errors caused by child failure.
   * Use it sparingly.
   *
   * @return the same shell command
   */
  public setNoExceptions(): this {
    this.throwForNonZeroExit = false;
    return this;
  }

  public setEnvironmentVariables(envs: Map<string, string>): this {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error -- Transpile time only error
    // @ts-ignore Object.entries() is defined, but project is unknown due to shebang
    this.environmentVariables = Object.fromEntries(envs) as NodeJS.ProcessEnv;
    return this;
  }

  /**
   * Please note: this function is synchronous which means it should be used for
   * your dev scripts and not to be executed in production.
   *
   * SECURITY NOTE: If the shell option is enabled, do not pass unsanitized user
   * input to this function. Any input containing shell metacharacters may be
   * used to trigger arbitrary command execution.
   *
   * @throws if `setNoExceptions()` has not been called AND the command fails
   * @return the result of the command
   */
  // eslint-disable-next-line complexity
  public runSynchronously(): ShellCommandResult {
    const [command, ...args] = this.command.filter((arg) => arg !== '');
    if (command === undefined) throw new Error('Unknown command');

    const response = nodeChildProcess.spawnSync(command, args, {
      cwd: this.cwd,
      // stdin, stdout, stderr
      stdio: [
        this.stdin === undefined ? 'inherit' : 'pipe', // 'pipe' accepts stdin from the input, 'inherit' accepts key strokes for example
        // We have to make a decision here: either use 'inherit' and print into
        // console with colors and everything OR 'pipe' and get output.
        this.outputToScreen ? 'inherit' : 'pipe',
        this.outputToScreen ? 'inherit' : 'pipe',
      ],
      input: this.stdin,
      env: this.environmentVariables,
      maxBuffer: Number.POSITIVE_INFINITY, // to prevent Error: spawnSync git ENOBUFS
    });

    if (response.error !== undefined) {
      // this happens when command doesn't exist for example (ENOENT)
      this.maybeThrow(response.error);
    }

    if (response.signal !== null) {
      this.maybeThrow(new Error(`Command killed with signal ${response.signal}.`));
    }

    if (response.status !== 0) {
      // we could eventually pass down the status code into error so wrapping
      // scripts can return proper process.exitCode
      const stderr = response.stderr.toString();
      const error = stderr === '' ? '.' : `: ${stderr}`;
      this.maybeThrow(new Error(`Command failed with exit code ${response.status}${error}`));
    }

    if (this.outputToScreen) {
      return {
        exitCode: response.status ?? 1,
        stderr: '',
        stdout: '',
      };
    }

    return {
      exitCode: response.status ?? 1, // status is null for signal kills and response errors
      stdout: response.stdout.toString(),
      stderr: response.stderr.toString(),
    };
  }
}
