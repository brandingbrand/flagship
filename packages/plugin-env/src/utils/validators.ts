import {fs, path} from '@brandingbrand/code-cli-kit';

/**
 * Custom error for when a specified directory does not exist.
 */
export class DirectoryNotFoundError extends Error {
  constructor(directoryPath: string) {
    super(
      `DirectoryNotFoundError: The directory "${directoryPath}" does not exist.`,
    );
    this.name = 'DirectoryNotFoundError';
  }
}

/**
 * Custom error for when a specified file does not exist.
 */
export class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`FileNotFoundError: The file "${filePath}" does not exist.`);
    this.name = 'FileNotFoundError';
  }
}

export async function validateEnvPaths(
  envPath: string,
  initialEnv: string,
): Promise<void> {
  const absoluteAppEnvDir = path.resolve(process.cwd(), envPath);
  if (!(await fs.doesPathExist(absoluteAppEnvDir))) {
    throw new DirectoryNotFoundError(absoluteAppEnvDir);
  }

  // Validates the initial env file to ensure it exists
  const absoluteEnvFilePath = path.resolve(
    process.cwd(),
    envPath,
    `env.${initialEnv}.ts`,
  );
  if (!(await fs.doesPathExist(absoluteEnvFilePath))) {
    throw new FileNotFoundError(absoluteEnvFilePath);
  }
}
