import * as yup from 'yup';

export const defineSchema = <T extends object>(
  fields: yup.ObjectSchemaDefinition<Partial<T>>
): yup.ObjectSchema<Partial<T>> => yup.object().shape(fields);

export const schemaRegex = {
  email: yup
    .string()
    .matches(
      /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\da-z\-]+\.)+[a-z]{2,}))$/i,
      'Invalid Email'
    ),
};
