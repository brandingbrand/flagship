import type { HttpContextToken } from './http-context.token';

export class HttpContext {
  private readonly storage = new Map<HttpContextToken, unknown>();

  public set<T>(token: HttpContextToken<T>, value: T): this {
    this.storage.set(token, value);
    return this;
  }

  public get<T>(token: HttpContextToken<T>): T {
    return (this.storage.get(token) as T | undefined) ?? token.defaultValue;
  }

  public delete(token: HttpContextToken): this {
    this.storage.delete(token);
    return this;
  }

  public has(token: HttpContextToken): boolean {
    return this.storage.has(token);
  }

  public keys(): IterableIterator<HttpContextToken> {
    return this.storage.keys();
  }

  public merge(context: HttpContext): HttpContext {
    const mergedContext = new HttpContext();

    for (const key of this.keys()) {
      mergedContext.set(key, this.get(key));
    }

    for (const key of context.keys()) {
      mergedContext.set(key, context.get(key));
    }

    return mergedContext;
  }
}
