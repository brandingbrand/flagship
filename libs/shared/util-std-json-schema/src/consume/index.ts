import type { JSONSchema7Definition } from 'json-schema';
import { toArray } from '@brandingbrand/standard-array';

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

  if ('anyOf' in editorSchema) {
    for (let i = 0; i < (editorSchema.anyOf?.length ?? 0); i++) {
      const anyOfSchema = editorSchema.anyOf?.[i];
      consumeSchema(schema, anyOfSchema);
    }
  }

  if ('anyOf' in schema) {
    for (let i = 0; i < (schema.anyOf?.length ?? 0); i++) {
      const anyOfSchema = schema.anyOf?.[i];
      const updatedSchema = consumeSchema(anyOfSchema, editorSchema);
      if (typeof updatedSchema === 'object' && Object.keys(updatedSchema).length === 0) {
        delete schema.anyOf?.[i];
      }
    }

    schema.anyOf = schema.anyOf?.filter(Boolean);
    if (schema.anyOf?.length === 0) {
      delete schema.anyOf;
      delete schema.title;
    }
  }

  if ('allOf' in editorSchema) {
    for (let i = 0; i < (editorSchema.allOf?.length ?? 0); i++) {
      const allOfSchema = editorSchema.allOf?.[i];
      consumeSchema(schema, allOfSchema);
    }
  }

  if ('allOf' in schema) {
    for (let i = 0; i < (schema.allOf?.length ?? 0); i++) {
      const allOfSchema = schema.anyOf?.[i];
      const updatedSchema = consumeSchema(allOfSchema, editorSchema);
      if (typeof updatedSchema === 'object' && Object.keys(updatedSchema).length === 0) {
        delete schema.allOf?.[i];
      }
    }

    schema.allOf = schema.allOf?.filter(Boolean);
    if (schema.allOf?.length === 0) {
      delete schema.allOf;
      delete schema.title;
    }
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
      schema.required = schema.required.filter((value) => !editorSchema.required?.includes(value));
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

  return schema;
};
