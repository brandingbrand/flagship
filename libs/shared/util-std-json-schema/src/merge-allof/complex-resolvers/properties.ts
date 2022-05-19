import { uniqueWith } from '@brandingbrand/standard-array';

import type { JSONSchema7 } from 'json-schema';

import { compare } from '../../compare.util';
import {
  allUniqueKeys,
  deleteUndefinedProperties,
  getValues,
  keys,
  notUndefined,
  withoutArray,
} from '../common';
import type { ComplexResolver, MergeSchemas } from '../resolver.type';

const removeFalseSchemas = (target: object) => {
  for (const [prop, schema] of Object.entries(target)) {
    if (schema === false) {
      delete target[prop as keyof typeof target];
    }
  }
};

const mergeSchemaGroup = (
  group: Array<Pick<JSONSchema7, typeof keywords[number]>>,
  mergeSchemas: MergeSchemas
) => {
  const allKeys = allUniqueKeys(group);
  return allKeys.reduce<Pick<JSONSchema7, typeof keywords[number]>>((all, key) => {
    const schemas = getValues(group, key);
    const compacted = uniqueWith(schemas.filter(notUndefined), compare);
    all[key] = mergeSchemas(compacted, [key]) as any;
    return all;
  }, {});
};

export const keywords = ['properties', 'patternProperties', 'additionalProperties'] as const;
export const resolver: ComplexResolver<typeof keywords[number]> = (values, parents, mergers) => {
  // first get rid of all non permitted properties
  for (const subSchema of values) {
    const otherSubSchemas = values.filter((s) => s !== subSchema);
    const ownKeys = keys(subSchema.properties ?? {});
    const ownPatternKeys = keys(subSchema.patternProperties ?? {});
    const ownPatterns = ownPatternKeys.map((k) => new RegExp(`${k}`));
    for (const other of otherSubSchemas) {
      const allOtherKeys = keys(other.properties);
      const keysMatchingPattern = allOtherKeys.filter((k) => ownPatterns.some((pk) => pk.test(k)));
      const additionalKeys = withoutArray(allOtherKeys, ownKeys, keysMatchingPattern);
      for (const key of additionalKeys) {
        if (other.properties) {
          const result = mergers.properties(
            [other.properties[key], subSchema.additionalProperties].filter(notUndefined),
            [key]
          );

          if (result !== undefined) {
            other.properties[key] = result;
          }
        }
      }
    }
  }

  // remove disallowed patternProperties
  for (const subSchema of values) {
    const otherSubSchemas = values.filter((s) => s !== subSchema);
    const ownPatternKeys = keys(subSchema.patternProperties);
    if (subSchema.additionalProperties === false) {
      for (const other of otherSubSchemas) {
        const allOtherPatterns = keys(other.patternProperties);
        const additionalPatternKeys = withoutArray(allOtherPatterns, ownPatternKeys);
        for (const key of additionalPatternKeys) {
          if (other.patternProperties) {
            delete other.patternProperties[key];
          }
        }
      }
    }
  }

  const returnObject = {
    additionalProperties: mergers.additionalProperties(
      values.map((s) => s.additionalProperties).filter(notUndefined)
    ),
    patternProperties: mergeSchemaGroup(
      values.map((s) => s.patternProperties).filter(notUndefined),
      mergers.patternProperties
    ),
    properties: mergeSchemaGroup(
      values.map((s) => s.properties).filter(notUndefined),
      mergers.properties
    ),
  };

  if (returnObject.additionalProperties === false) {
    removeFalseSchemas(returnObject.properties);
  }

  return deleteUndefinedProperties(returnObject);
};
