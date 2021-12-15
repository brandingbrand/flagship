/* eslint-disable max-classes-per-file */
import { uniqueId } from 'lodash-es';

export const INTERNAL = Symbol('Internal Method');

type QueueableMethod<A extends any[] = any[]> = (...args: A) => Promise<void>;

class LazyPromise<T> implements PromiseLike<T> {
  private hotPromise?: Promise<T> | void;
  constructor(
    private readonly executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {}

  async then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    if (!this.hotPromise) {
      this.hotPromise = new Promise<T>((resolve, reject) => {
        try {
          this.executor(resolve, reject);
        } catch (ex) {
          reject(ex);
        }
      });
    }

    return this.hotPromise.then(onfulfilled).catch(onrejected);
  }
}

class QueueRunner {
  private readonly promises: Map<string, PromiseLike<void>> = new Map();

  public async run<A extends any[], T extends QueueableMethod<A>>(
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
      } catch {
        this.promises.clear();
        throw new Error('Error in queue, Try Again');
      }
    }

    return promise;
  }
}

const runners = new WeakMap<Object, QueueRunner>();
// Binds method to a class wide queue so that calls will always execute in order received
export const queueMethod = (
  obj: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = obj[propertyKey as keyof typeof obj] as Function;
  descriptor.value = async function(...args: any[]): Promise<void> {
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
    } else {
      return runner.run(boundMethod, args);
    }
  };
};
