import type { JSONSchema7 } from 'json-schema';
import alignChildren from './align-children.schema.json';
import viewStyle from './view-style.schema.json';
import lifted from './lifted.schema.json';
import commerceDataSource from './commerce-data-source.json';
import commerceDataSourceEditor from './commerce-data-source.editor.json';
import refinements from './refinements.schema.json';
import refinementsEditor from './refinements.editor.json';

export const alignChildrenSchema = alignChildren as JSONSchema7;
export const liftedSchema = lifted as JSONSchema7;
export const viewStyleSchema = viewStyle as unknown as JSONSchema7;
export const commerceDataSourceSchema = commerceDataSource as unknown as JSONSchema7;
export const commerceDataSourceEditorSchema = commerceDataSourceEditor as unknown as JSONSchema7;
export const refinementsSchema = refinements as unknown as JSONSchema7;
export const refinementsEditorSchema = refinementsEditor as unknown as JSONSchema7;
