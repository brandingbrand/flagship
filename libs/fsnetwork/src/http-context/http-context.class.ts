import type { HttpContextToken } from './http-context.token';

export class HttpContext {
  private readonly storage = new Map<HttpContextToken['name'], unknown>();

  private setWithName<T>(name: HttpContextToken<T>['name'], value: T): this {
    this.storage.set(name, value);
    return this;
  }

  private getWithName<T>(name: HttpContextToken<T>['name']): T | undefined {
    return this.storage.get(name) as T | undefined;
  }

  public set<T>(token: HttpContextToken<T>, value: T): this {
    this.storage.set(token.name, value);
    return this;
  }

  public get<T>(token: HttpContextToken<T>): T {
    return (this.storage.get(token.name) as T | undefined) ?? token.defaultValue;
  }

  public delete(token: HttpContextToken): this {
    this.storage.delete(token.name);
    return this;
  }

  public has(token: HttpContextToken): boolean {
    return this.storage.has(token.name);
  }

  public keys(): IterableIterator<HttpContextToken['name']> {
    return this.storage.keys();
  }

  public merge(context: HttpContext): HttpContext {
    const mergedContext = new HttpContext();

    for (const key of this.keys()) {
      mergedContext.setWithName(key, this.getWithName(key));
    }

    for (const key of context.keys()) {
      mergedContext.setWithName(key, context.getWithName(key));
    }

    return mergedContext;
  }
}
