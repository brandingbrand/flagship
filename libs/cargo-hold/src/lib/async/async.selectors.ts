import type { ILens } from '@brandingbrand/standard-lens';
import type { AsyncState, AsyncStatus } from './async.types';

export const makeSelectPayload =
  <Payload, FailPayload, Structure, EmptyPayload = Payload>(
    lens: ILens<Structure, AsyncState<Payload, FailPayload, EmptyPayload>>
  ) =>
  (structure: Structure): Payload | EmptyPayload =>
    lens.get(structure).payload;

export const makeSelectStatus =
  <Payload, FailPayload, Structure, EmptyPayload = Payload>(
    lens: ILens<Structure, AsyncState<Payload, FailPayload, EmptyPayload>>
  ) =>
  (structure: Structure): AsyncStatus =>
    lens.get(structure).status;

export const makeSelectFailure =
  <Payload, FailPayload, Structure, EmptyPayload = Payload>(
    lens: ILens<Structure, AsyncState<Payload, FailPayload, EmptyPayload>>
  ) =>
  (structure: Structure): FailPayload | undefined => {
    const state = lens.get(structure);
    if (state.status === 'failure') {
      return state.failure;
    }
    return undefined;
  };

export const createSelectors = <Payload, FailPayload, Structure, EmptyPayload = Payload>(
  lens: ILens<Structure, AsyncState<Payload, FailPayload, EmptyPayload>>
) => ({
  selectPayload: makeSelectPayload(lens),
  selectStatus: makeSelectStatus(lens),
  selectFailure: makeSelectFailure(lens),
});
