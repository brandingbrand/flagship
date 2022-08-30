import type { JSONSchemaCreate } from '../src/types';

import alignChildren from './align-children.schema.json';
import commerceDataSourceEditor from './commerce-data-source.editor.json';
import commerceDataSource from './commerce-data-source.json';
import lifted from './lifted.schema.json';
import refinementsEditor from './refinements.editor.json';
import refinements from './refinements.schema.json';
import viewStyle from './view-style.schema.json';

export const alignChildrenSchema = alignChildren as JSONSchemaCreate;
export const liftedSchema = lifted as JSONSchemaCreate;
export const viewStyleSchema = viewStyle as unknown as JSONSchemaCreate;
export const commerceDataSourceSchema = commerceDataSource as unknown as JSONSchemaCreate;
export const commerceDataSourceEditorSchema =
  commerceDataSourceEditor as unknown as JSONSchemaCreate;
export const refinementsSchema = refinements as unknown as JSONSchemaCreate;
export const refinementsEditorSchema = refinementsEditor as unknown as JSONSchemaCreate;
