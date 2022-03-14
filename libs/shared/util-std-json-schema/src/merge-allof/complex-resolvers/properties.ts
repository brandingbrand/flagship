import type { JSONSchema7 } from 'json-schema';
import type { ComplexResolver, MergeSchemas } from '../resolver.type';

import { uniqueWith } from '@brandingbrand/standard-array';

import { compare } from '../../compare.util';
import {
  allUniqueKeys,
  deleteUndefinedProperties,
  getValues,
  keys,
  notUndefined,
  withoutArray,
} from '../common';

const removeFalseSchemas = (target: object) => {
  Object.entries(target).forEach(([prop, schema]) => {
    if (schema === false) {
      delete target[prop as keyof typeof target];
    }
  });
};

const mergeSchemaGroup = (
  group: Pick<JSONSchema7, typeof keywords[number]>[],
  mergeSchemas: MergeSchemas
) => {
  const allKeys = allUniqueKeys(group);
  return allKeys.reduce((all, key) => {
    const schemas = getValues(group, key);
    const compacted = uniqueWith(schemas.filter(notUndefined), compare);
    all[key] = mergeSchemas(compacted, [key]) as any;
    return all;
  }, {} as Pick<JSONSchema7, typeof keywords[number]>);
};

export const keywords = ['properties', 'patternProperties', 'additionalProperties'] as const;
export const resolver: ComplexResolver<typeof keywords[number]> = (values, parents, mergers) => {
  // first get rid of all non permitted properties
  values.forEach((subSchema) => {
    const otherSubSchemas = values.filter((s) => s !== subSchema);
    const ownKeys = keys(subSchema.properties ?? {});
    const ownPatternKeys = keys(subSchema.patternProperties ?? {});
    const ownPatterns = ownPatternKeys.map((k) => new RegExp(`${k}`));
    otherSubSchemas.forEach((other) => {
      const allOtherKeys = keys(other.properties);
      const keysMatchingPattern = allOtherKeys.filter((k) => ownPatterns.some((pk) => pk.test(k)));
      const additionalKeys = withoutArray(allOtherKeys, ownKeys, keysMatchingPattern);
      additionalKeys.forEach((key) => {
        if (other.properties) {
          const result = mergers.properties(
            [other.properties[key], subSchema.additionalProperties].filter(notUndefined),
            [key]
          );

          if (result !== undefined) other.properties[key] = result;
        }
      });
    });
  });

  // remove disallowed patternProperties
  values.forEach((subSchema) => {
    const otherSubSchemas = values.filter((s) => s !== subSchema);
    const ownPatternKeys = keys(subSchema.patternProperties);
    if (subSchema.additionalProperties === false) {
      otherSubSchemas.forEach((other) => {
        const allOtherPatterns = keys(other.patternProperties);
        const additionalPatternKeys = withoutArray(allOtherPatterns, ownPatternKeys);
        additionalPatternKeys.forEach((key) => {
          if (other.patternProperties) delete other.patternProperties[key];
        });
      });
    }
  });

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
