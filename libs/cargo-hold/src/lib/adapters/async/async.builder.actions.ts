import { branchObject, pipe } from '@brandingbrand/standard-compose';
import { createActionCreator } from '../../action-bus';
import type {
  WithActionKey,
  WithFailureType,
  WithIdleType,
  WithMetadata,
  WithPayloadTypes,
  WithSuccessType,
} from './async.builder.types';

export const buildInitActionCreator = <
  ActionKey extends string,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithIdleType<IdleType> &
    WithActionKey<ActionKey> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) => {
  return createActionCreator({
    ...builder,
    subtype: 'async:init',
    callback: (idlePayload: IdleType) => idlePayload,
  });
};

export const buildLoadingActionCreator = <
  ActionKey extends string,
  SuccessType,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithIdleType<IdleType> &
    WithSuccessType<SuccessType> &
    WithActionKey<ActionKey> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) => {
  return createActionCreator({
    ...builder,
    actionKey: builder.actionKey,
    subtype: 'async:load' as const,
    callback: (loadingPayload: IdleType | SuccessType) => loadingPayload,
  });
};

export const buildLoadingMoreActionCreator = <
  ActionKey extends string,
  SuccessType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithSuccessType<SuccessType> &
    WithActionKey<ActionKey> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) => {
  return createActionCreator({
    ...builder,
    subtype: 'async:load-more',
    callback: (loadingPayload: SuccessType) => loadingPayload,
  });
};

export const buildSucceedActionCreator = <
  ActionKey extends string,
  SuccessType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithSuccessType<SuccessType> &
    WithActionKey<ActionKey> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) => {
  return createActionCreator({
    ...builder,
    subtype: 'async:succeed',
    callback: (succeedPayload: SuccessType) => succeedPayload,
  });
};

export const buildFailActionCreator = <
  ActionKey extends string,
  FailureType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithFailureType<FailureType> &
    WithActionKey<ActionKey> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) => {
  return createActionCreator({
    ...builder,
    subtype: 'async:fail',
    callback: (failure: FailureType) => failure,
  });
};

export const buildRevertActionCreator = <
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithActionKey<ActionKey> &
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
    (MetadataType extends Record<string, unknown> ? WithMetadata<MetadataType> : {})
) => {
  return createActionCreator({
    ...builder,
    subtype: 'async:revert',
    callback: (revertPayload: SuccessType | IdleType) => revertPayload,
  });
};

export const buildActionCreators = <
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType,
  MetadataType extends Record<string, unknown> | undefined
>(
  builder: WithActionKey<ActionKey> &
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
