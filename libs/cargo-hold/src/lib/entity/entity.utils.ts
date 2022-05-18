import type { EntityId, EntityState } from './entity.types';

export const getDefaultedEntity =
  (id?: EntityId) =>
  <EntityType>(state: EntityState<EntityType>): EntityType | undefined => {
    const defaultedId = id ?? state.ids[0];
    if (defaultedId === undefined) {
      return undefined;
    }
    return state.entities[defaultedId];
  };
