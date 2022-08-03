/* eslint-disable @typescript-eslint/sort-type-union-intersection-members */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { branchObject, pipe } from '@brandingbrand/standard-compose';

import type { ActionCreator } from '../../action-bus';
import { createActionCreator } from '../../action-bus';

import type {
  WithActionKey,
  WithFailureType,
  WithIdleType,
  WithMetadata,
  WithPayloadTypes,
  WithSuccessType,
} from './async.builder.types';
/**
 * Takes a builder and returns an init action creator.
 *
 * @param builder
 * @return
 */
export const buildInitActionCreator = <
  ActionKeyType extends string,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithIdleType<IdleType> &
    WithActionKey<ActionKeyType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
): ActionCreator<ActionKeyType, 'async:init', IdleType, [IdleType]> =>
  createActionCreator({
    ...builder,
    subtype: 'async:init',
    callback: (idlePayload: IdleType) => idlePayload,
  });

/**
 * Takes a builder and returns a loading action creator.
 *
 * @param builder
 * @return
 */
export const buildLoadingActionCreator = <
  ActionKeyType extends string,
  SuccessType,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithIdleType<IdleType> &
    WithSuccessType<SuccessType> &
    WithActionKey<ActionKeyType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
): ActionCreator<ActionKeyType, 'async:load', IdleType | SuccessType, [IdleType | SuccessType]> =>
  createActionCreator({
    ...builder,
    actionKey: builder.actionKey,
    subtype: 'async:load' as const,
    callback: (loadingPayload: IdleType | SuccessType) => loadingPayload,
  });

/**
 * Takes a builder and returns a loading more action creator.
 *
 * @param builder
 * @return
 */
export const buildLoadingMoreActionCreator = <
  ActionKeyType extends string,
  SuccessType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithSuccessType<SuccessType> &
    WithActionKey<ActionKeyType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
): ActionCreator<ActionKeyType, 'async:load-more', SuccessType, [SuccessType]> =>
  createActionCreator({
    ...builder,
    subtype: 'async:load-more',
    callback: (loadingPayload: SuccessType) => loadingPayload,
  });

/**
 * Takes a builder and returns a success action creator.
 *
 * @param builder
 * @return
 */
export const buildSucceedActionCreator = <
  ActionKeyType extends string,
  SuccessType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithSuccessType<SuccessType> &
    WithActionKey<ActionKeyType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
): ActionCreator<ActionKeyType, 'async:succeed', SuccessType, [SuccessType]> =>
  createActionCreator({
    ...builder,
    subtype: 'async:succeed',
    callback: (succeedPayload: SuccessType) => succeedPayload,
  });

/**
 * Takes a builder and returns a failure action creator.
 *
 * @param builder
 * @return
 */
export const buildFailActionCreator = <
  ActionKeyType extends string,
  FailureType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithFailureType<FailureType> &
    WithActionKey<ActionKeyType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
): ActionCreator<ActionKeyType, 'async:fail', FailureType, [FailureType]> =>
  createActionCreator({
    ...builder,
    subtype: 'async:fail',
    callback: (failure: FailureType) => failure,
  });

/**
 * Takes a builder and returns a revert action creator.
 *
 * @param builder
 * @return
 */
export const buildRevertActionCreator = <
  ActionKeyType extends string,
  SuccessType,
  FailureType,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithActionKey<ActionKeyType> &
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) =>
  createActionCreator({
    ...builder,
    subtype: 'async:revert',
    callback: (revertPayload: SuccessType | IdleType) => revertPayload,
  });

/**
 * Builds a full suite of async action creators.
 *
 * @param builder
 * @return
 */
export const buildActionCreators = <
  ActionKeyType extends string,
  SuccessType,
  FailureType,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithActionKey<ActionKeyType> &
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) =>
  pipe(
    builder,
    branchObject({
      init: buildInitActionCreator,
      load: buildLoadingActionCreator,
      loadMore: buildLoadingMoreActionCreator,
      succeed: buildSucceedActionCreator,
      fail: buildFailActionCreator,
      revert: buildRevertActionCreator,
    })
  );
