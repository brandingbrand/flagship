# `fslinker`

> Simple Dependency Injection

## Description

This library allows for easy provision and consumption of dependencies with static references.
It is important that static references are used so that dependencies can be consumed even when
used in externally bundled code.

### The Problem

Let's say a you have a dependency like a React Context:

```ts
export const SomeContext = createContext('defaultValue');
```

If you used this context in a bundle, the reference to `SomeContext` would be encapsulated in that bundle.
If you then tried to make another bundle also using `SomeContext` it would get a new `SomeContext` even
if the first bundle has already been loaded.

In _some_ scenarios, the two bundles operating independently would be the desired and expected behavior.
However, often it would be expected that any change made to the context in one bundle would be reflected
in the same context of another bundle. In these cases, it is necessary to maintain static references
to the dependencies in order to match that behavior.

### The Solution

To preserve these references, we can store them on the global object. This practice allows us to check
for and reuse any existing values rather than instantiating new ones. This library handles this process
for you by maintaining a `GlobalInjectorCache` which will use the global object to store and reuse the
previously defined references.

## Example

### Basic Usage

```ts
// Define a token to reference the value. Note that the `uniqueKey`
// should be unique
export const SOME_TOKEN = new InjectionToken<number>('SOME_TOKEN');

// Then provide the value for the token.
// Note that this should only occur once.
Injector.provide({ provide: SOME_TOKEN, useValue: 9 });

// Then you can get the value back anywhere in your application.
const theValue = Injector.get(SOME_TOKEN); // 9
```

### Factory Usage

```ts
// Just like before, define a token
export const SOME_TOKEN = new InjectionToken<number>('SOME_TOKEN');

// when providing the value you can then use a function
// which will be executed when creating the provider
Injector.provide({ provide: SOME_TOKEN, useFactory: () => 5 + 5 });

// and then you can use the calculated value
const theValue = Injector.get(SOME_TOKEN); // 10
```

This pattern is more useful when you are providing a value
that depends on other provided values.

```ts
export const OTHER_TOKEN = new InjectionToken<number>('OTHER_TOKEN');
export const SOME_TOKEN = new InjectionToken<number>('SOME_TOKEN');

Injector.provide({ provide: OTHER_TOKEN, useValue: 12 });

// You can use `deps` to define a list of InjectionTokens or values
// that will be passed in to the factory function when creating the value
Injector.provide({ provide: SOME_TOKEN, useFactory: (other) => other * 10, deps: [OTHER_TOKEN] });

const theValue = Injector.get(SOME_TOKEN); // 120
```

### Class Usage

Before using classes make sure that decorators are enabled in your TypeScript configuration:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

With classes there are some decorators which take care of a lot of the work for you:

```ts
// Declare Tokens
export const OTHER_TOKEN = new InjectionToken<OtherService>('OTHER_TOKEN');
export const SOME_TOKEN = new InjectionToken<SomeService>('SOME_TOKEN');

// `@Injectable()` will automatically run `Injector.provide()` for you.
@Injectable(OTHER_TOKEN)
export class OtherService {
  public doSomething(): void {
    return;
  }
}

@Injectable(SOME_TOKEN)
export class SomeService {
  // Using `@Inject()` will use the Injector to get the dependency.
  constructor(@Inject(OTHER_TOKEN) protected readonly other: OtherService) {}

  public init(): void {
    this.other.doSomething();
  }
}

// Getting a provided service will give you the singleton instance
// that was constructed when the dependency was provided.
const someService = Injector.get(SOME_TOKEN);
someService.init();
```

Or, if you prefer, you can enable the following in your TypeScript configuration:

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true
  }
}
```

And then you can use the classes themselves as tokens:

```ts
export const SOME_TOKEN = new InjectionToken<number>('SOME_TOKEN');
Injector.provide({ provide: SOME_TOKEN, useValue: 9 });

// `@Injectable()` will mark OtherService as a token with the unique id of OtherService.
@Injectable()
export class OtherService {
  public doSomething(): void {
    return;
  }
}


@Injectable(SOME_TOKEN)
export class SomeService {
  constructor(
    // @Injectable() with mark `SomeService` as having a first dependency
    protected readonly other: OtherService,
    // And the second dependency is marked by the @Inject() which will override
    // anything assumed from the metadata.
    @Inject(SOME_TOKEN) public readonly version: number;
  ) {}

  public init(): void {
    this.other.doSomething();
  }
}


const someService = Injector.get(SOME_TOKEN);
someService.init();
```
