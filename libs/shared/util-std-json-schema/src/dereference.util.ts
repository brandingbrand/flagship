import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

const refRegex = /^#\/definitions\/(.*)$/;

// eslint-disable-next-line complexity
export const dereference = <T extends JSONSchema7Definition = JSONSchema7>(
  schema: T,
  parentDefinitions?: JSONSchema7['definitions']
): T => {
  if (schema === undefined) {
    return schema;
  }

  if (typeof schema === 'boolean') {
    return schema;
  }

  const jsonSchema: JSONSchema7 = schema;
  const { $ref, definitions, ...otherProperties } = jsonSchema;
  const currentDefinitions = { ...definitions, ...parentDefinitions };

  if ($ref) {
    const refMatch = refRegex.exec($ref);
    if (refMatch !== null) {
      const ref = refMatch[1] as string;
      const definition = currentDefinitions[ref];
      if (definition) {
        if (typeof definition === 'object') {
          return dereference(
            {
              ...definition,
              ...otherProperties,
            },
            currentDefinitions
          ) as T;
        }

        return definition as T;
      }
    }
  }

  return {
    ...otherProperties,
    ...('properties' in jsonSchema
      ? {
          properties: Object.fromEntries(
            Object.entries(jsonSchema.properties ?? {}).map(
              ([key, childSchema]) => [key, dereference(childSchema, currentDefinitions)] as const
            )
          ),
        }
      : {}),
    ...('anyOf' in jsonSchema
      ? {
          anyOf: jsonSchema.anyOf?.map((childSchema) =>
            dereference(childSchema, currentDefinitions)
          ),
        }
      : {}),
    ...('allOf' in jsonSchema
      ? {
          allOf: jsonSchema.allOf?.map((childSchema) =>
            dereference(childSchema, currentDefinitions)
          ),
        }
      : {}),
  } as JSONSchema7 as T;
};
