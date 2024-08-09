import mitt from 'mitt';
import chalk from 'chalk';

import logger from './logger';

// Represents the possible types for a group.
export type Group = 'template' | 'env' | 'code' | 'dependencies';

// Represents the possible statuses of an action.
export type Status = 'pending' | 'success' | 'fail';

// Represents an event object containing action details.
type Event = {
  action: {
    name: Group; // The name of the group associated with the action.
    status: Status; // The status of the action within the group.
  };
};

// Event emitter for dispatching events of type Event.
export const emitter = mitt<Event>();

// Holds the previous group name, initialized with "template".
export let prevGroup: Group = 'template';

/**
 * Wraps an asynchronous function with logging capabilities.
 * @template TResult - The result type of the function.
 * @template TArgs - The argument types of the function.
 * @param {(...args: TArgs) => Promise<TResult>} fn - The function to wrap.
 * @param {string} name - The name of the action.
 */
export function withAction<TResult, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<TResult>,
  name: string,
  group: Group,
): (...args: TArgs) => Promise<void> {
  return async function (...args: TArgs) {
    try {
      if (group === prevGroup) {
        emitter.emit('action', {name: group, status: 'pending'});
      } else {
        emitter.emit('action', {name: prevGroup, status: 'success'});
        emitter.emit('action', {name: group, status: 'pending'});

        prevGroup = group;
      }

      await fn(...args);
    } catch (error: any) {
      emitter.emit('action', {name: group, status: 'fail'});

      global.unmount?.();

      logger.resume();
      logger.info(chalk.red`💥 Oops something went wrong! See errors below.\n`);
      console.group();
      logger.info(chalk.dim(error.stack) + '\n');
      console.groupEnd();

      process.exit(1);
    }
  };
}
