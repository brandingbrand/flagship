import * as yup from 'yup';

export function defineSchema<T extends object>(fields: yup.ObjectSchemaDefinition<Partial<T>>):
  yup.ObjectSchema<Partial<T>> {
  return yup.object().shape(fields);
}

export const schemaRegex = {
  email: yup.string().
  // tslint:disable-next-line max-line-length ter-max-len
    matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    'Invalid Email')
};
