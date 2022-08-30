import { toArray, uniqueWith } from '@brandingbrand/standard-array';

import { compare } from '../../compare.util';
import type { JSONSchemaCreate, JSONSchemaCreateDefinition } from '../../types';
import {
  allUniqueKeys,
  deleteUndefinedProperties,
  isSchemaDefinition,
  notUndefined,
} from '../common';
import type { ComplexResolver, MergeSchemas } from '../resolver.type';

const removeFalseSchemasFromArray = (target: unknown[]) => {
  for (const [index, schema] of target.entries()) {
    if (schema === false) {
      target.splice(index, 1);
    }
  }
};

const getItemSchemas = (
  subSchemas: Array<Pick<JSONSchemaCreate, typeof keywords[number]>>,
  key: number
) =>
  subSchemas.map((sub) => {
    if (!sub) {
      return undefined;
    }

    if (Array.isArray(sub.items)) {
      const schemaAtPos = sub.items[key];
      if (isSchemaDefinition(schemaAtPos)) {
        return schemaAtPos;
      } else if (sub.hasOwnProperty('additionalItems')) {
        return sub.additionalItems;
      }
    } else {
      return sub.items;
    }

    return undefined;
  });

const getAdditionalSchemas = (subSchemas: JSONSchemaCreate[]) =>
  subSchemas.map((sub) => {
    if (!sub) {
      return undefined;
    }

    if (Array.isArray(sub.items)) {
      return sub.additionalItems;
    }

    return sub.items;
  });

// Provide source when array
const mergeItems = (
  group: Array<Pick<JSONSchemaCreate, typeof keywords[number]>>,
  mergeSchemas: MergeSchemas,
  items: JSONSchemaCreateDefinition[][]
) => {
  const allKeys = allUniqueKeys(items);
  return allKeys.reduce<Array<Pick<JSONSchemaCreate, typeof keywords[number]>>>((all, key) => {
    const schemas = getItemSchemas(group, key);
    const compacted = uniqueWith(schemas.filter(notUndefined), compare);
    all[key] = mergeSchemas(compacted, [key]) as any;
    return all;
  }, []);
};

export const keywords = ['items', 'additionalItems'] as const;
export const resolver: ComplexResolver<typeof keywords[number]> = (values, parents, mergers) => {
  const items = values.map((s) => s.items);
  const itemsCompacted = items.filter(notUndefined);
  const returnObject: Pick<JSONSchemaCreate, typeof keywords[number]> = {};

  // if all items keyword values are schemas, we can merge them as simple schemas
  // if not we need to merge them as mixed
  returnObject.items = itemsCompacted.every(isSchemaDefinition)
    ? mergers.items(items as JSONSchemaCreateDefinition[])
    : mergeItems(values, mergers.items, items.map(toArray) as JSONSchemaCreateDefinition[][]);

  let schemasAtLastPos;
  if (itemsCompacted.every(Array.isArray)) {
    schemasAtLastPos = values.map((s) => s.additionalItems);
  } else if (itemsCompacted.some(Array.isArray)) {
    schemasAtLastPos = getAdditionalSchemas(values);
  }

  if (schemasAtLastPos) {
    returnObject.additionalItems = mergers.additionalItems(schemasAtLastPos.filter(notUndefined));
  }

  if (returnObject.additionalItems === false && Array.isArray(returnObject.items)) {
    removeFalseSchemasFromArray(returnObject.items);
  }

  return deleteUndefinedProperties(returnObject);
};
