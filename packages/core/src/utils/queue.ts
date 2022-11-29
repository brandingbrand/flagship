/* eslint-disable @typescript-eslint/ban-types */

import fastq from "fastq";
import type { queueAsPromised } from "fastq";

const q: queueAsPromised<unknown> = fastq.promise(asyncWorker, 1);

async function asyncWorker(args: never[]): Promise<void> {
  const [fn, ...passArgs] = args;

  return (fn as Function)(...passArgs);
}

export const enqueue = (...args: unknown[]) => q.push(args);
