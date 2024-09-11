import {EventEmitter} from 'events';

import {FlagshipCodeLogger} from './FlagshipCodeLogger';

/**
 * Manages the flagship code and ensures there is only one instance of the manager.
 * Extends EventEmitter to handle events.
 *
 * @example
 * const manager = FlagshipCodeManager.shared;
 * manager.addAction(async () => {
 *   // Your action code here
 * });
 * manager.run().then(() => {
 *   console.log('All actions completed');
 * });
 */
export class FlagshipCodeManager extends EventEmitter {
  /**
   * An array of functions representing the actions.
   *
   * @type {Function[]}
   */
  protected actions: Function[] = [];

  /**
   * The number of actions in the `actions` array.
   *
   * @type {number}
   */
  protected numberOfActions: number = 0;

  // The single instance of the FlagshipCodeManager
  protected static instance: FlagshipCodeManager;

  /**
   * Returns the shared instance of the FlagshipCodeManager.
   * If no instance exists, it creates one.
   *
   * @returns {FlagshipCodeManager} The shared instance of FlagshipCodeManager.
   */
  static get shared(): FlagshipCodeManager {
    if (!FlagshipCodeManager.instance) {
      FlagshipCodeManager.instance = new FlagshipCodeManager();
    }

    return FlagshipCodeManager.instance;
  }

  /**
   * Protected constructor to prevent direct instantiation.
   * Initializes the EventEmitter.
   */
  protected constructor() {
    super();
  }

  /**
   * Adds an action to the list of actions to be executed.
   *
   * @param {Function} action - The action to be added.
   *
   * @example
   * FlagshipCodeManager.shared.addAction(async () => {
   *   // Your action code here
   * });
   */
  addAction(action: Function) {
    this.actions.push(action);
    ++this.numberOfActions;

    return this;
  }

  /**
   * Executes all added actions sequentially.
   * Emits 'onError' if an action throws an error.
   * Emits 'onRun' with the progress of actions executed.
   * Emits 'onEnd' when all actions are completed.
   *
   * @returns {Promise<void>} A promise that resolves when all actions are completed.
   *
   * @example
   * FlagshipCodeManager.shared.run().then(() => {
   *   console.log('All actions completed');
   * });
   */
  async run(): Promise<void> {
    let actionsRun = 0;

    for (const action of this.actions) {
      try {
        await action();
      } catch (e: any) {
        FlagshipCodeLogger.shared.error(e);
        this.emit('onError');
      }

      ++actionsRun;
      this.emit('onRun', actionsRun / this.numberOfActions);
    }

    this.emit('onEnd');
  }
}
