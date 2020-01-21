import * as yup from 'yup';

export function defineSchema<T extends object>(fields: yup.ObjectSchemaDefinition<Partial<T>>):
  yup.ObjectSchema<Partial<T>> {
  return yup.object().shape(fields);
}
