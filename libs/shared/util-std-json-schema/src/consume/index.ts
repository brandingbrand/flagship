import type { JSONSchema7Definition } from 'json-schema';
import { difference, toArray } from '@brandingbrand/standard-array';

// eslint-disable-next-line complexity
export const consumeSchema = (
  schema?: JSONSchema7Definition,
  editorSchema?: JSONSchema7Definition
) => {
  if (editorSchema === undefined || schema === undefined) {
    return schema;
  }

  if (typeof editorSchema === 'boolean') {
    if (typeof schema !== 'boolean') {
      return schema;
    }

    return false;
  }

  if (typeof schema === 'boolean') {
    return schema;
  }

  if (schema.type?.includes('object') && editorSchema.type?.includes('object')) {
    if (schema.properties) {
      for (const [property, propertySchema] of Object.entries(editorSchema.properties ?? {})) {
        const updatedSchema = consumeSchema(schema.properties[property], propertySchema);

        if (typeof updatedSchema === 'object' && Object.keys(updatedSchema).length === 0) {
          delete schema.properties[property];
        }
      }
    }

    if (schema.required) {
      schema.required = difference(schema.required, editorSchema.required ?? []);
    }

    if (!schema.required?.length) {
      delete schema.required;
    }

    if (Object.keys(schema.properties ?? {}).length === 0) {
      delete schema.title;
      delete schema.type;
      delete schema.properties;
      delete schema.additionalProperties;
    }
  } else if (schema.type?.includes('string') && editorSchema.type?.includes('string')) {
    delete schema.title;
    delete schema.type;
    delete schema.enum;
  } else {
    if (
      schema.type &&
      toArray(schema.type).some((type) => toArray(editorSchema.type).includes(type))
    ) {
      delete schema.title;
      delete schema.type;
    }
  }

  if ('anyOf' in schema) {
    delete schema.anyOf;
  }

  return schema;
};
