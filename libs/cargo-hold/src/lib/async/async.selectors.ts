import type { Lens } from '../lens';
import type { AsyncState, AsyncStatus } from './async.types';

export const makeSelectPayload =
  <Payload, FailPayload, Structure>(lens: Lens<Structure, AsyncState<Payload, FailPayload>>) =>
  (structure: Structure): Payload =>
    lens.get(structure).payload;

export const makeSelectStatus =
  <Payload, FailPayload, Structure>(lens: Lens<Structure, AsyncState<Payload, FailPayload>>) =>
  (structure: Structure): AsyncStatus =>
    lens.get(structure).status;

export const makeSelectFailure =
  <Payload, FailPayload, Structure>(lens: Lens<Structure, AsyncState<Payload, FailPayload>>) =>
  (structure: Structure): FailPayload | undefined => {
    const state = lens.get(structure);
    if (state.status === 'failure') {
      return state.failure;
    }
    return undefined;
  };

export const createSelectors = <Payload, FailPayload, Structure>(
  lens: Lens<Structure, AsyncState<Payload, FailPayload>>
) => ({
  selectPayload: makeSelectPayload(lens),
  selectStatus: makeSelectStatus(lens),
  selectFailure: makeSelectFailure(lens),
});
