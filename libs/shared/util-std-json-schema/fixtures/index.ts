import type { JSONSchema7 } from 'json-schema';
import alignChildren from './align-children.schema.json';
import viewStyle from './view-style.schema.json';
import lifted from './lifted.schema.json';

export const alignChildrenSchema = alignChildren as JSONSchema7;
export const liftedSchema = lifted as JSONSchema7;
export const viewStyleSchema = viewStyle as unknown as JSONSchema7;
