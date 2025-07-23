/**
 * Dynamically imports and returns the execa function for executing shell commands.
 * Uses ESM dynamic imports to ensure compatibility with both CommonJS and ESM environments.
 *
 * @returns {Promise<Function>} A promise that resolves to the execa function
 *
 * @example
 * ```typescript
 * // Import and use execa dynamically
 * const execa = await getExeca();
 *
 * // Execute a shell command
 * const result = await execa('ls', ['-la']);
 * console.log(result.stdout);
 *
 * // With working directory option
 * await execa('npm', ['install'], { cwd: './my-project' });
 * ```
 */
export async function getExeca() {
  // Dynamic import for ESM
  const {execa} = await import('execa');

  return execa;
}
