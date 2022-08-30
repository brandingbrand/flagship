import type { JSONSchema7 } from 'json-schema';

export type JSONSchemaCreateDefinition = JSONSchemaCreate | boolean;

interface EditorOptions {
  throttleValue?: {
    delay: number | string;
  };
}

export interface JSONSchemaCreate extends JSONSchema7 {
  items?: JSONSchemaCreateDefinition | JSONSchemaCreateDefinition[] | undefined;
  additionalItems?: JSONSchemaCreateDefinition | undefined;
  $editorOptions?: EditorOptions;
  properties?: Record<string, JSONSchemaCreateDefinition> | undefined;
  patternProperties?: Record<string, JSONSchemaCreateDefinition> | undefined;
  additionalProperties?: JSONSchemaCreateDefinition | undefined;
  dependencies?: Record<string, JSONSchemaCreateDefinition | string[]> | undefined;
  propertyNames?: JSONSchemaCreateDefinition | undefined;
  if?: JSONSchemaCreateDefinition | undefined;
  then?: JSONSchemaCreateDefinition | undefined;
  else?: JSONSchemaCreateDefinition | undefined;
  definitions?: Record<string, JSONSchemaCreateDefinition> | undefined;
  allOf?: JSONSchemaCreateDefinition[] | undefined;
  anyOf?: JSONSchemaCreateDefinition[] | undefined;
  oneOf?: JSONSchemaCreateDefinition[] | undefined;
  not?: JSONSchemaCreateDefinition | undefined;
}
