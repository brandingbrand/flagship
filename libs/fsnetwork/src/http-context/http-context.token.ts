export class HttpContextToken<T = unknown> {
  constructor(public readonly name: string, public readonly defaultValue: T) {}
}
