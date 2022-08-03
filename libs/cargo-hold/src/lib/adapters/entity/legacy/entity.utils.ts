import type { EntityId, EntityState } from '../entity.types';

/**
 * Returns the entity for a given id, if no id is provided it returns the first entity.
 *
 * @param id Optional entity id.
 * @return Entity represented by the id, or the first entity.
 */
export const getDefaultedEntity =
  (id?: EntityId) =>
  <EntityType>(state: EntityState<EntityType>): EntityType | undefined => {
    const defaultedId = id ?? state.ids[0];
    if (defaultedId === undefined) {
      return undefined;
    }
    return state.entities[defaultedId];
  };
