/* eslint-disable max-classes-per-file */
import { uniqueId } from 'lodash-es';

export const INTERNAL = Symbol('Internal Method');

type QueueableMethod<A extends unknown[] = unknown[]> = (...args: A) => Promise<void>;

class LazyPromise<T> implements PromiseLike<T> {
  constructor(
    private readonly executor: (
      resolve: (value: PromiseLike<T> | T) => void,
      reject: (reason?: unknown) => void
    ) => void
  ) {}

  private hotPromise?: Promise<T> | void;

  public async then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | null | undefined,
    onrejected?: ((reason: unknown) => PromiseLike<TResult2> | TResult2) | null | undefined
  ): Promise<TResult1 | TResult2> {
    if (!this.hotPromise) {
      this.hotPromise = new Promise<T>((resolve, reject) => {
        try {
          this.executor(resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    return this.hotPromise.then(onfulfilled).catch(onrejected);
  }
}

class QueueRunner {
  private readonly promises: Map<string, PromiseLike<void>> = new Map();

  public async run<A extends unknown[], T extends QueueableMethod<A>>(
    method: T,
    args: A
  ): Promise<void> {
    const id = uniqueId(QueueRunner.name);
    const promise = new LazyPromise<void>(async (resolve, reject) =>
      method(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.promises.delete(id);
        })
    );

    const existing = [...this.promises.values()];
    this.promises.set(id, promise);

    for (const promise of existing) {
      try {
        // Promise Like
        await promise;
      } catch (error) {
        this.promises.clear();
        throw error;
      }
    }

    return promise;
  }
}

const runners = new WeakMap<Object, QueueRunner>();
// Binds method to a class wide queue so that calls will always execute in order received
export const queueMethod = (obj: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = obj[propertyKey as keyof typeof obj] as Function;
  descriptor.value = async function (...args: unknown[]): Promise<void> {
    // Bound to instance
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const runner = (() => {
      const existingRunner = runners.get(obj);
      if (existingRunner) {
        return existingRunner;
      }

      const newRunner = new QueueRunner();
      runners.set(obj, newRunner);
      return newRunner;
    })();

    const boundMethod = originalMethod.bind(context);

    // Internal calls should skip the queue
    if (args[args.length - 1] === INTERNAL) {
      return boundMethod(...args);
    }
    return runner.run(boundMethod, args);
  };
};
