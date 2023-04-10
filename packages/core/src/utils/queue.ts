import fastq from "fastq";
import type { queueAsPromised } from "fastq";

/**
 * The fastq promise queue.
 *
 * @type {queueAsPromised<unknown>}
 */
const q: queueAsPromised<unknown> = fastq.promise(asyncWorker, 1);

/**
 * The async worker function that handles the queue.
 *
 * @param {never[]} args - The arguments passed to the worker function.
 * @returns {Promise<void>} A Promise that resolves when the worker function is complete.
 */
async function asyncWorker(args: never[]): Promise<void> {
  const [fn, ...passArgs] = args;

  return (fn as Function)(...passArgs);
}

/**
 * Enqueue a function call with the provided arguments to the fastq promise queue.
 *
 * @param {...unknown[]} args - The arguments to pass to the function.
 */
export const enqueue = (...args: unknown[]) => q.push(args);
