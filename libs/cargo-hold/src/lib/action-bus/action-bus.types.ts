import { PAYLOAD } from '../internal/tokens';

/**
 * `ActionSpecifier` is an object designed to provide a "prototype" action so that various filter
 * functions can filter actions by it. It effectively provides everything but the payload of an action.
 */
export type ActionSpecifier<Type extends string, Subtype extends string | undefined, Payload> = {
  /**
   * `Type` is a string that describes the event happening.
   */
  type: Type;

  /**
   * `Subtype` is an optional field similar to Type. It allows adaptors like `Async` to react to
   * various "subtypes" of the same action in a meaningful way (like "load" or "fail")
   */
  subtype?: Subtype;

  /**
   * `Source` is an optional field, again similar to Type, but also allows Symbols. It allows reducers
   * and effects to further filter down actions that came from a particular source.
   */
  source?: string | symbol;

  /**
   * This key doesn't truly exist; it is only a placeholder in order to pass on the Payload type.
   */
  [PAYLOAD]?: Payload;
};

/**
 * `AnyActionSpecifier` is the general form of an `ActionSpecifier`. All possible `ActionSpecifier`s
 * would conform to an `AnyActionSpecifier`.
 */
export type AnyActionSpecifier = ActionSpecifier<string, string | undefined, any> | AnyAction;

/**
 * The basic structure for describing an event that happened (or request for an event to happen).
 * Can be reacted to using `Effect`s and `ActionReducer`s.
 */
export type Action<
  Type extends string,
  Payload,
  Subtype extends string | undefined = never
> = ActionSpecifier<Type, Subtype, Payload> & {
  /**
   * Any data associated with the action
   */
  payload: Payload;
};

/**
 * The type of an `action` described by an `ActionSpecifier`
 */
export type ActionOf<ActionType extends ActionSpecifier<string, any, unknown>> = Action<
  ActionType['type'],
  Exclude<ActionType[typeof PAYLOAD], undefined>,
  ActionType['subtype']
>;

/**
 * `AnyAction` would be the supertype for any `Action` type. It is used in places where we don't care
 * what the Type, Subtype, or in some cases, Payload is for a given action.
 */
export type AnyAction<Payload = unknown> = Action<string, Payload, string | undefined>;

/**
 * `ActionCreator` is an `ActionSpecifier` with a `create` function that creates the action in
 * question given a payload.
 */
export type ActionCreator<
  Type extends string,
  Subtype extends string | undefined,
  Payload,
  Params extends unknown[]
> = ActionSpecifier<Type, Subtype, Payload> & {
  create: (...params: Params) => Action<Type, Payload, Subtype>;
};

export type ActionHandler<T extends AnyAction> = (action: T) => void;
