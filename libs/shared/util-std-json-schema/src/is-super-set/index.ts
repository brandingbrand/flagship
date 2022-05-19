/* eslint-disable max-lines */
// CREDIT: https://github.com/haggholm/is-json-schema-subset
// MIT

import { toArray } from '@brandingbrand/standard-array';

import AJV from 'ajv';
import isEqual from 'fast-deep-equal';
import type { JSONSchema7, JSONSchema7Definition, JSONSchema7Type } from 'json-schema';

import { mergeAllOf } from '../merge-allof';

// eslint-disable-next-line @typescript-eslint/unbound-method
const { hasOwnProperty } = Object.prototype;
const ajv = new AJV();

type Validator = (
  input: JSONSchema7,
  target: JSONSchema7,
  options: Options,
  paths: Paths
) => ErrorArray | undefined;

export const all = <T>(
  elements: T[],
  condition: (val: T, idx: number) => ErrorArray | undefined
): ErrorArray | undefined => {
  for (let i = 0, len = elements.length; i < len; i++) {
    const errors = condition(elements[i] as T, i);
    if (errors?.length) {
      return errors as ErrorArray;
    }
  }
  return undefined;
};

export const allBool = <T>(elements: T[], condition: (val: T, idx: number) => boolean): boolean => {
  for (let i = 0, len = elements.length; i < len; i++) {
    if (!condition(elements[i] as T, i)) {
      return false;
    }
  }
  return true;
};

export const some = <T>(
  elements: T[],
  condition: (val: T, idx: number) => ErrorArray | undefined
): ErrorArray | undefined => {
  const allErrors = [];
  // Reverse for legible error message ordering
  for (let i = elements.length - 1; i >= 0; i--) {
    const errors = condition(elements[i] as T, i);
    if (errors?.length) {
      allErrors.push(...errors);
    } else {
      return;
    }
  }

  return allErrors as ErrorArray; // if length were 0 we'd have returned early
};

/**
 * @internal
 * @param elements
 * @param condition
 */
export const someBool = <T>(
  elements: T[],
  condition: (val: T, idx: number) => boolean
): boolean => {
  for (let i = 0, len = elements.length; i < len; i++) {
    if (condition(elements[i] as T, i)) {
      return true;
    }
  }
  return false;
};

export const one = <T>(
  paths: Paths,
  elements: T[],
  condition: (val: T, idx: number) => ErrorArray | undefined
): ErrorArray | undefined => {
  const allErrors = [];
  let matches = 0;
  // Reverse for legible error message ordering
  for (let i = elements.length - 1; i >= 0; i--) {
    const errors = condition(elements[i] as T, i);
    if (errors?.length) {
      matches++;
      allErrors.push(...errors);
    }
  }

  if (matches === 1) {
    return undefined;
  } else if (matches > 1) {
    return [{ paths, args: ['oneOf matches more than one branch'] }];
  }

  return [
    ...(allErrors as ErrorArray),
    { paths, args: ['oneOf does not match any branches'] },
  ] as ErrorArray;
};

export const isEmptyObject = (ob: JSONSchema7Definition): boolean => {
  if (ob === null || typeof ob !== 'object' || Array.isArray(ob)) {
    return false;
  }
  for (const key in ob) {
    if (hasOwnProperty.call(ob, key)) {
      return false;
    }
  }
  return true;
};

export const allFormats = [
  'date-time',
  'date',
  'time',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
];

export const subFormats: Record<string, string[]> = {
  'uri-reference': ['uri'],
};

export const cloneRefs = <T extends JSONSchema7>(ob: T): T => {
  if (!ob || typeof ob !== 'object') {
    return ob;
  } else if (Array.isArray(ob)) {
    const len = ob.length;
    const copy: unknown[] = new Array(len);
    let changed = false;
    for (let i = 0; i < len; i++) {
      const el = ob[Number(i)];
      copy[Number(i)] = el && typeof el === 'object' ? cloneRefs(el) : el;
      changed = changed || copy[Number(i)] !== el;
    }

    return changed ? (copy as T & unknown[]) : ob;
  }

  if ('type' in ob && ob.type === 'object') {
    const newProps = cloneRefs(ob.properties ?? {});
    return '$ref' in ob || newProps === ob.properties ? ob : ({ ...ob, properties: newProps } as T);
  }
  const copy = {} as T;
  let changed = '$ref' in ob;
  for (const key in ob) {
    if (hasOwnProperty.call(ob, key)) {
      const oldProp = ob[key];
      if (oldProp && typeof oldProp === 'object') {
        const newProp = (copy[key] = cloneRefs(ob[key]));
        changed = changed || oldProp !== newProp;
      } else {
        copy[key] = oldProp;
      }
    }
  }

  return changed ? copy : ob;
};

export interface Paths {
  input: Array<number | string>;
  target: Array<number | string>;
}

export interface SchemaCompatError {
  paths: Paths;
  args: unknown[];
}

export type ErrorArray = [SchemaCompatError, ...SchemaCompatError[]];

export interface Options {
  allowPartial: boolean;
  allowAdditionalProps: boolean;
}

const getTypeMatchErrors: Validator = (input, target, options, paths) => {
  if (isEmptyObject(target) || !target.type) {
    return;
  } else if ((!input || isEmptyObject(input)) && options.allowPartial) {
    if (target.type) {
      return [
        {
          paths,
          args: [`Type mismatch: ${input.type} does not satisfy ${target.type}`],
        },
      ];
    }

    return;
  }

  const match = toArray(input.type).every((inputType) =>
    toArray(target.type).some(
      (targetType) =>
        inputType === targetType || (targetType === 'number' && inputType === 'integer')
    )
  );

  if (!match) {
    return [
      {
        paths,
        args: [`Type mismatch: ${input.type} does not satisfy ${target.type}`],
      },
    ];
  }

  return undefined;
};

const getRequiredInputErrors: Validator = (input, target, options, paths) => {
  // Verify that the target doesn't require anything missing from the input
  const inputRequires: Set<string> = new Set(input.required);
  for (const prop of target.required ?? []) {
    if (!inputRequires.has(prop)) {
      const hasDefault = hasOwnProperty.call(target.properties?.[prop], 'default');
      if (!hasDefault && !options.allowPartial) {
        return [
          {
            paths,
            args: ['input does not guarantee required property', prop],
          },
        ];
      }
    }
  }

  return undefined;
};

const getExtraneousInputErrors: Validator = (input, target, options, paths) => {
  // Verify that the input doesn't have extra properties violating the target
  if (target.additionalProperties === false) {
    const superProps = new Set(Object.keys(target.properties ?? {}));
    for (const prop of Object.keys(input.properties ?? {})) {
      if (!superProps.has(prop)) {
        return [
          {
            paths,
            args: ['input has extraneous property', prop],
          },
        ];
      }
    }
  }

  if (target.required) {
    const superProps = new Set(Object.keys(input.properties ?? {}));
    for (const requiredProp of target.required) {
      if (!superProps.has(requiredProp) && options.allowPartial) {
        return [
          {
            paths,
            args: ['input does not have property defined', requiredProp],
          },
        ];
      }
    }
  }

  return undefined;
};

export const mergeTopWithAnyOf = (ob: SchemaWithAnyOf): SchemaWithAnyOf => {
  const { anyOf, title, ...rest } = ob;
  if (!Array.isArray(anyOf) || Object.keys(rest).length === 0) {
    return ob;
  }

  // If we have an object like
  //   { type: "object", properties: {...}, anyOf: [] }
  // then it may happen, *and be OK*, that not all anyOf branches can be
  // merged.
  //   If *all* branches fail, then it's irreconcilable and will/should fail.
  let error: Error | undefined;
  const newAnyOf: JSONSchema7[] = [];
  for (const o of anyOf) {
    try {
      const merged = mergeAllOf({ allOf: [o, rest] });
      if (typeof merged === 'object') {
        newAnyOf.push(merged);
      }
    } catch (caughtError) {
      error = caughtError as Error;
    }
  }

  if (error && newAnyOf.length === 0) {
    throw error;
  } else {
    return { anyOf: newAnyOf };
  }
};

const calculateEffectiveMinLength = (schema: JSONSchema7): number => {
  if (schema.type === 'string') {
    if (schema.minLength !== undefined) {
      return schema.minLength;
    } else if (schema.enum) {
      return Math.min(...schema.enum.map((s) => (s as JSONSchema7[]).length));
    }
  } else if (schema.allOf ?? schema.anyOf ?? schema.oneOf) {
    return Math.min(
      ...((schema.allOf ?? schema.anyOf ?? schema.oneOf) as JSONSchema7[]).map((s) =>
        calculateEffectiveMinLength(s)
      )
    );
  } else {
    return -1;
  }

  return -1;
};

const calculateEffectiveMaxLength = (schema: JSONSchema7): number => {
  if (schema.type === 'string') {
    if (schema.minLength !== undefined) {
      return schema.minLength;
    } else if (schema.enum) {
      return Math.max(...schema.enum.map((s) => (s as JSONSchema7[]).length));
    }
  } else if (schema.allOf ?? schema.anyOf ?? schema.oneOf) {
    return Math.max(
      ...((schema.allOf ?? schema.anyOf ?? schema.oneOf) as JSONSchema7[]).map((s) =>
        calculateEffectiveMaxLength(s)
      )
    );
  } else {
    return -1;
  }

  return -1;
};

const gatherEnumValues = (schema: JSONSchema7): unknown[] | undefined => {
  if (schema.allOf ?? schema.anyOf ?? schema.oneOf) {
    let enums: unknown[] | undefined;
    for (const e of (schema.allOf ?? schema.anyOf ?? schema.oneOf) as JSONSchema7[]) {
      const subEnums = gatherEnumValues(e);
      if (subEnums) {
        if (enums === undefined) {
          enums = [];
        }

        enums = enums.concat(subEnums);
      }
    }
    return enums;
  }

  return schema.enum ?? undefined;
};

const regexRegex = /^\/(.+)\/(g|i)?$/;
const getTitleErrors: Validator = (input, target, options, paths) => {
  if (target.title) {
    const regexTitle = regexRegex.exec(target.title);
    if (regexTitle) {
      const titleRegex = new RegExp(regexTitle[1] as string, regexTitle[2] as string);

      if (!input.title || !titleRegex.test(input.title)) {
        return [
          {
            paths,
            args: [`input title does not match target title's regex ${target.title}`],
          },
        ];
      }

      return;
    }

    if (target.title !== input.title) {
      return [
        {
          paths,
          args: [
            `input title does not match target, got ${input.title} but expected ${target.title}`,
          ],
        },
      ];
    }
  }

  return undefined;
};

const getStringErrors: Validator = (input, target, options, paths) => {
  if (target.type !== 'string') {
    return;
  }

  if (target.format && target.format !== input.format) {
    const compatible = input.enum
      ? allBool(input.enum, (s: JSONSchema7Type) => ajv.validate(target, s))
      : Boolean(
          input.format &&
            subFormats[target.format] &&
            subFormats[target.format]?.indexOf(input.format) !== -1
        );
    if (!compatible) {
      return [{ paths, args: ['String format mismatch'] }];
    }
  }

  if (target.pattern && target.pattern !== input.pattern) {
    return [{ paths, args: ['String pattern mismatch'] }];
  }

  if (
    hasOwnProperty.call(target, 'minLength') &&
    calculateEffectiveMinLength(input) < (target.minLength as number)
  ) {
    return [
      {
        paths,
        args: ['input minLength is less than target'],
      },
    ];
  }
  if (
    hasOwnProperty.call(target, 'maxLength') &&
    calculateEffectiveMaxLength(input) > (target.maxLength as number)
  ) {
    return [
      {
        paths,
        args: ['input maxLength is less than target'],
      },
    ];
  }

  const maybeTargetEnums = new Set(gatherEnumValues(target));
  if (maybeTargetEnums.size > 0) {
    const inputEnums = gatherEnumValues(input);
    if (inputEnums === undefined) {
      return [
        {
          paths,
          args: ['input is missing enum restrictions'],
        },
      ];
    }
    for (const e of inputEnums) {
      if (!maybeTargetEnums.has(e)) {
        return [
          {
            paths,
            args: ['target', [...maybeTargetEnums], 'is missing possible input enum:', e],
          },
        ];
      }
    }
  }

  if ('enum' in target && !('enum' in input)) {
    return [
      {
        paths,
        args: ['target requires enum, but input does not'],
      },
    ];
  }

  return undefined;
};

// eslint-disable-next-line max-statements
const getNumericErrors: Validator = (input, target, options, paths) => {
  if (target.type !== 'integer' && target.type !== 'number') {
    return;
  }

  if (hasOwnProperty.call(target, 'maximum')) {
    if (!hasOwnProperty.call(input, 'maximum') && !hasOwnProperty.call(input, 'exclusiveMaximum')) {
      return [{ paths, args: ['input has no maximum property'] }];
    }

    if (
      hasOwnProperty.call(input, 'maximum') &&
      (input.maximum as number) > (target.maximum as number)
    ) {
      return [{ paths, args: ['input permits greater maximum'] }];
    }
    if (
      hasOwnProperty.call(input, 'exclusiveMaximum') &&
      (input.exclusiveMaximum as number) > (target.maximum as number)
    ) {
      return [
        {
          paths,
          args: ['input permits greater maximum (exclusive)'],
        },
      ];
    }
  }

  if (hasOwnProperty.call(target, 'exclusiveMaximum')) {
    if (!hasOwnProperty.call(input, 'maximum') && !hasOwnProperty.call(input, 'exclusiveMaximum')) {
      return [{ paths, args: ['input has no maximum property'] }];
    }

    if (
      hasOwnProperty.call(input, 'maximum') &&
      (input.maximum as number) >= (target.exclusiveMaximum as number)
    ) {
      return [{ paths, args: ['input permits greater maximum'] }];
    }
    if (
      hasOwnProperty.call(input, 'exclusiveMaximum') &&
      (input.exclusiveMaximum as number) > (target.exclusiveMaximum as number)
    ) {
      return [
        {
          paths,
          args: ['input permits greater exclusiveMaximum'],
        },
      ];
    }
  }

  if (hasOwnProperty.call(target, 'minimum')) {
    if (!hasOwnProperty.call(input, 'minimum') && !hasOwnProperty.call(input, 'exclusiveMinimum')) {
      return [{ paths, args: ['input has no minimum property'] }];
    }

    if (
      hasOwnProperty.call(input, 'minimum') &&
      (input.minimum as number) < (target.minimum as number)
    ) {
      return [{ paths, args: ['input permits greater minimum'] }];
    }
    if (
      hasOwnProperty.call(input, 'exclusiveMinimum') &&
      (input.exclusiveMinimum as number) < (target.minimum as number)
    ) {
      return [{ paths, args: ['input permits greater minimum'] }];
    }
  }

  if (hasOwnProperty.call(target, 'exclusiveMinimum')) {
    if (!hasOwnProperty.call(input, 'minimum') && !hasOwnProperty.call(input, 'exclusiveMinimum')) {
      return [{ paths, args: ['input has no minimum property'] }];
    }

    if (
      hasOwnProperty.call(input, 'minimum') &&
      (input.minimum as number) <= (target.exclusiveMinimum as number)
    ) {
      return [{ paths, args: ['input permits smaller minimum'] }];
    }
    if (
      hasOwnProperty.call(input, 'exclusiveMinimum') &&
      (input.exclusiveMinimum as number) < (target.exclusiveMinimum as number)
    ) {
      return [
        {
          paths,
          args: ['input permits greater exclusiveMinimum'],
        },
      ];
    }
  }

  if (target.multipleOf) {
    if (!input.multipleOf) {
      return [{ paths, args: ['input lacks multipleOf'] }];
    }
    if (input.multipleOf % target.multipleOf !== 0) {
      return [
        {
          paths,
          args: ['input multipleOf is not an integer multiple of target multipleOf'],
        },
      ];
    }
  }

  return undefined;
};

const getConstErrors: Validator = (input, target, options, paths) => {
  if (target.const && target.const !== input.const) {
    return [
      {
        paths,
        args: [`input const mismatch (${target.const} !== ${input.const})`],
      },
    ];
  }

  return undefined;
};

// eslint-disable-next-line max-statements
const getErrors: Validator = (input, target, options, paths) => {
  if (
    !target ||
    input === target ||
    isEmptyObject(target) ||
    (input && typeof input === 'object' && '$id' in input && input.$id === target.$id) ||
    isEqual(input, target)
  ) {
    return;
  }

  if (!input) {
    return [{ paths, args: ['input does not provide a value'] }];
  }

  if ('const' in input && !ajv.validate(target, input)) {
    return [{ paths, args: ['const input does not match target schema'] }];
  }

  if (target.allOf || input.allOf) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return getAllOfErrors(input, target, options, paths);
  } else if (target.anyOf || input.anyOf) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return getAnyOfErrors(input, target, options, paths);
  } else if (target.oneOf || input.oneOf) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return getOneOfErrors(input, target, options, paths);
  } else if (input.not || target.not) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return getNotErrors(input, target, options, paths);
  }

  // Type matching must be done *first*, or we may make wrong assumptions
  // about available keywords (e.g. array `items` vs. object `properties`)
  const tme = getTypeMatchErrors(input, target, options, paths);
  if (tme?.length) {
    return tme as ErrorArray;
  }

  const validators: Validator[] = [getTitleErrors];
  const inputType = input.type;
  const targetType = target.type;
  if (inputType === 'string' || targetType === 'string') {
    validators.push(getStringErrors);
  } else if (inputType === 'object' || targetType === 'object') {
    // If we're not dealing with objects, we can bypass calling several
    // validators
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    validators.push(getInputPropertyErrors, getRequiredInputErrors);
    if (!options.allowAdditionalProps) {
      validators.push(getExtraneousInputErrors);
    }
  } else if (inputType === 'array' || targetType === 'array') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    validators.push(getArrayErrors);
  } else if (
    inputType === 'integer' ||
    targetType === 'integer' ||
    inputType === 'number' ||
    targetType === 'number'
  ) {
    validators.push(getNumericErrors);
  }

  if (target.const) {
    validators.push(getConstErrors);
  }

  for (const validator of validators) {
    const errors = validator(input, target, options, paths);
    if (errors?.length) {
      return errors as ErrorArray;
    }
  }

  return undefined;
};

const getAnyOfErrors: Validator = (input, target, options, paths) => {
  if (input.anyOf && target.anyOf) {
    const { anyOf: inputAnyOf } = mergeTopWithAnyOf(input as SchemaWithAnyOf);
    const { anyOf: targetAnyOf } = mergeTopWithAnyOf(target as SchemaWithAnyOf);

    let inputIndex = 0;
    for (const inputBranch of inputAnyOf) {
      let targetIndex = 0;

      let inputMatch = false;
      let inputErrors: ErrorArray | undefined;
      for (const targetBranch of targetAnyOf) {
        const errors = getErrors(inputBranch, targetBranch, options, {
          input: [...paths.input, 'anyOf', inputIndex],
          target: [...paths.target, 'anyOf', targetIndex],
        });

        if (errors) {
          inputErrors = [...(inputErrors ?? []), ...errors];
        } else {
          inputMatch = true;
          break;
        }

        targetIndex += 1;
      }

      if (!inputMatch) {
        return [
          ...(inputErrors ?? []),
          {
            paths,
            args: ['input does not satisfy any of target.anyOf'],
          },
        ];
      }

      inputIndex += 1;
    }

    return undefined;
  }

  // If input can be anyOf [a,b,...], then each of them must be accepted
  // by the target.
  if (input.anyOf) {
    const { anyOf } = mergeTopWithAnyOf(input as SchemaWithAnyOf);
    const errors = all(anyOf as JSONSchema7[], (branch, idx) =>
      getErrors(branch, target, options, {
        input: [...paths.input, 'anyOf', idx],
        target: paths.target,
      })
    );
    if (errors?.length) {
      return [
        ...errors,
        {
          paths,
          args: ['Some input.anyOf elements do not satisfy target'],
        },
      ] as ErrorArray;
    }
  }

  // If the target can accept anyOf [a,b,...], then it's enough
  // that at least one is satisfied by the input
  if (target.anyOf) {
    const { anyOf } = mergeTopWithAnyOf(target as SchemaWithAnyOf);
    const errors = some(anyOf as JSONSchema7[], (branch, idx) =>
      getErrors(input, branch, options, {
        input: paths.input,
        target: [...paths.target, 'anyOf', idx],
      })
    );
    if (errors?.length) {
      return [
        ...errors,
        {
          paths,
          args: ['input does not satisfy any of target.anyOf'],
        },
      ] as ErrorArray;
    }
  }

  return undefined;
};

const getInputPropertyErrors: Validator = (input, target, options, paths) => {
  const subProps = (input.properties ?? {}) as Record<string, JSONSchema7>;
  const superProps = (target.properties ?? {}) as Record<string, JSONSchema7>;

  if (subProps) {
    for (const prop in superProps) {
      if (!hasOwnProperty.call(superProps, prop) || !hasOwnProperty.call(subProps, prop)) {
        continue;
      }

      const subProp = subProps[prop];
      const superProp = superProps[prop];
      if (subProp && superProp) {
        const errors = getErrors(subProp, superProp, options, {
          input: [...paths.input, prop],
          target: [...paths.target, prop],
        });

        if (errors?.length) {
          return [...errors, { paths, args: ['Property', prop, 'does not match'] }] as ErrorArray;
        }
      }
    }
  }

  return undefined;
};

// eslint-disable-next-line max-statements
const getArrayErrors: Validator = (input, target, options, paths) => {
  if (target.type !== 'array') {
    return; // nop
  }

  const inputMinItems = hasOwnProperty.call(input, 'minItems')
    ? input.minItems
    : Array.isArray(input.items)
    ? input.items.length
    : null;
  const targetMinItems = hasOwnProperty.call(target, 'minItems')
    ? target.minItems
    : Array.isArray(target.items)
    ? target.items.length
    : null;
  const inputMaxItems = hasOwnProperty.call(input, 'maxItems')
    ? input.maxItems
    : Array.isArray(input.items)
    ? input.items.length
    : null;
  const targetMaxItems = hasOwnProperty.call(target, 'maxItems')
    ? target.maxItems
    : Array.isArray(target.items)
    ? target.items.length
    : null;

  if (targetMinItems !== null) {
    if (inputMinItems === null) {
      return [{ paths, args: ['input does not guarantee minItems'] }];
    } else if ((inputMinItems as number) < (targetMinItems as number)) {
      return [{ paths, args: ['input minItems is less than target'] }];
    } else if (targetMaxItems !== null && (inputMinItems as number) > (targetMaxItems as number)) {
      return [{ paths, args: ['input minItems is more than target maxItems'] }];
    }
  }
  if (targetMaxItems !== null) {
    if (inputMaxItems === null) {
      return [{ paths, args: ['input does not guarantee maxItems'] }];
    } else if ((inputMaxItems as number) > (targetMaxItems as number)) {
      return [{ paths, args: ['input maxItems is more than target'] }];
    } else if (inputMinItems !== null && (inputMinItems as number) > (targetMaxItems as number)) {
      return [{ paths, args: ['input minItems is more than target minItems'] }];
    }
  }

  if (Array.isArray(target.items)) {
    if (!hasOwnProperty.call(input, 'items')) {
      return [{ paths, args: ['input is missing items'] }];
    }

    if (!Array.isArray(input.items) || target.items.length !== input.items.length) {
      return [{ paths, args: ['Tuple item count mismatch'] }];
    }
    for (let i = 0, len = target.items.length; i < len; i++) {
      const errors = getErrors(
        input.items[i] as JSONSchema7,
        target.items[i] as JSONSchema7,
        options,
        {
          input: [...paths.input, i],
          target: [...paths.target, i],
        }
      );
      if (errors?.length) {
        return [
          ...errors,
          {
            paths,
            args: ['Tuple items mismatch:'],
          },
        ] as ErrorArray;
      }
    }
  } else if (inputMaxItems === 0) {
    // A zero-tuple [] satisfies any target (if it doesn't violate length
    // constraints, already covered above).
    return;
  } else if (Array.isArray(input.items)) {
    // TODO: What if *both* are arrays?
    for (const it of input.items) {
      const errors = getErrors(it as JSONSchema7, (target.items ?? {}) as JSONSchema7, options, {
        input: [...paths.input, 'items'],
        target: [...paths.target, 'items'],
      });
      if (errors?.length) {
        return [
          ...errors,
          {
            paths,
            args: ['Array items mismatch:'],
          },
        ] as ErrorArray;
      }
    }
  } else {
    const errors = getErrors(
      (input.items ?? {}) as JSONSchema7,
      (target.items ?? {}) as JSONSchema7,
      options,
      {
        input: [...paths.input, 'items'],
        target: [...paths.target, 'items'],
      }
    );
    if (errors?.length) {
      return [
        ...errors,
        {
          paths,
          args: ['Array items mismatch:'],
        },
      ] as ErrorArray;
    }
  }

  if (target.uniqueItems && !input.uniqueItems) {
    return [{ paths, args: ['input does not require uniqueItems'] }];
  }

  return undefined;
};

// eslint-disable-next-line max-statements
const getAllOfErrors: Validator = (input, target, options, paths) => {
  if (target.allOf && input.anyOf) {
    const { anyOf: inputAnyOf } = mergeTopWithAnyOf(input as SchemaWithAnyOf);

    let targetIndex = 0;
    for (const targetBranch of target.allOf) {
      let inputIndex = 0;

      let targetMatch = false;
      let inputErrors: ErrorArray | undefined;
      for (const inputBranch of inputAnyOf) {
        const errors = getErrors(inputBranch, targetBranch as JSONSchema7, options, {
          input: [...paths.input, 'anyOf', inputIndex],
          target: [...paths.target, 'anyOf', targetIndex],
        });

        if (errors) {
          inputErrors = [...(inputErrors ?? []), ...errors];
        } else {
          targetMatch = true;
          break;
        }

        inputIndex += 1;
      }

      if (!targetMatch) {
        return [
          ...(inputErrors ?? []),
          {
            paths,
            args: ['Some target.allOf elements cannot be satisfied'],
          },
        ];
      }

      targetIndex += 1;
    }

    return;
  }

  if (target.allOf && Array.isArray(input.type)) {
    const inputAnyOf = input.type.map((type): JSONSchema7 => ({ ...input, type }));

    let targetIndex = 0;
    for (const targetBranch of target.allOf) {
      let inputIndex = 0;

      let targetMatch = false;
      let inputErrors: ErrorArray | undefined;
      for (const inputBranch of inputAnyOf) {
        const errors = getErrors(inputBranch, targetBranch as JSONSchema7, options, {
          input: [...paths.input, 'type', inputIndex],
          target: [...paths.target, 'anyOf', targetIndex],
        });

        if (errors) {
          inputErrors = [...(inputErrors ?? []), ...errors];
        } else {
          targetMatch = true;
          break;
        }

        inputIndex += 1;
      }

      if (!targetMatch) {
        return [
          ...(inputErrors ?? []),
          {
            paths,
            args: ['Some target.allOf elements cannot be satisfied'],
          },
        ];
      }

      targetIndex += 1;
    }

    return;
  }

  if (input.allOf) {
    const errors = all(input.allOf as JSONSchema7[], (e, idx) =>
      getErrors(e, target, options, {
        input: [...paths.input, 'allOf', idx],
        target: paths.target,
      })
    );
    if (errors?.length) {
      return [
        ...errors,
        {
          paths,
          args: ['Some input.allOf elements do not satisfy target'],
        },
      ] as ErrorArray;
    }
  }

  if (target.allOf) {
    const errors = all(target.allOf as JSONSchema7[], (e, idx) =>
      getErrors(input, e, options, {
        input: paths.input,
        target: [...paths.target, 'allOf', idx],
      })
    );
    if (errors?.length) {
      return [
        ...errors,
        {
          paths,
          args: ['Some target.allOf elements cannot be satisfied'],
        },
      ] as ErrorArray;
    }
  }

  return undefined;
};

type SchemaWithAnyOf = JSONSchema7 & { anyOf: JSONSchema7[] };

const getOneOfErrors: Validator = (input, target, options, paths) => {
  if (input.oneOf) {
    const cond = (e: JSONSchema7, idx: number) =>
      getErrors(e, target, options, {
        input: [...paths.input, 'oneOf', idx],
        target: paths.target,
      });
    const errors = all(input.oneOf as JSONSchema7[], cond);
    if (errors?.length) {
      return [
        ...errors,
        {
          paths,
          args: ['Some input.oneOf elements do not satisfy target'],
        },
      ] as ErrorArray;
    }
  }

  if (target.oneOf) {
    const errors = one(
      {
        input: paths.input,
        target: [...paths.target, 'oneOf'],
      },
      target.oneOf as JSONSchema7[],
      (e, idx) =>
        getErrors(input, e, options, {
          input: paths.input,
          target: [...paths.target, 'oneOf', idx],
        })
    );
    if (errors?.length) {
      return errors as ErrorArray;
    }
  }

  return undefined;
};

const getNotErrors: Validator = (input, target, options, paths) => {
  if (input.not) {
    const errors = getErrors(input.not as JSONSchema7, target, options, {
      input: [...paths.input, 'not'],
      target: paths.target,
    });
    if (!errors?.length) {
      return [
        {
          paths,
          args: ['input.not should not satisfy target'],
        },
      ] as ErrorArray;
    }
  }

  if (target.not) {
    const errors = getErrors(input, target.not as JSONSchema7, options, {
      input: paths.input,
      target: [...paths.target, 'not'],
    });
    if (!errors?.length) {
      return [
        {
          paths,
          args: ['input should not satisfy target.not'],
        },
      ] as ErrorArray;
    }
  }

  return undefined;
};

export const isValidTopLevelSchema = (schema: JSONSchema7Definition): boolean => {
  if (typeof schema !== 'object') {
    return false;
  }

  if (
    schema.type ||
    schema.oneOf ||
    schema.anyOf ||
    schema.allOf ||
    schema.enum ||
    hasOwnProperty.call(schema, 'const') ||
    isEmptyObject(schema)
  ) {
    return true;
  }

  for (const key in schema) {
    if (
      hasOwnProperty.call(schema, key) &&
      key !== 'description' &&
      key !== 'title' &&
      !key.startsWith('$')
    ) {
      return false;
    }
  }

  return true;
};

const hasAllOf = (schema: JSONSchema7Definition): boolean => {
  if (!schema || typeof schema !== 'object') {
    return false;
  } else if ('allOf' in schema) {
    return true;
  } else if ('anyOf' in schema && someBool(schema.anyOf ?? [], hasAllOf)) {
    return true;
  } else if ('oneOf' in schema && someBool(schema.oneOf ?? [], hasAllOf)) {
    return true;
  } else if ('type' in schema && schema.type === 'object') {
    return someBool(Object.values(schema.properties ?? {}), hasAllOf);
  }
  return someBool(Object.values(schema ?? {}), hasAllOf);
};

const purgeEmptyAllOfObjects = (s: JSONSchema7): JSONSchema7 => {
  if (!s || typeof s !== 'object') {
    return s;
  }

  if (Array.isArray(s)) {
    const len = s.length;
    const copy: typeof s = new Array(len);
    let changed = false;
    for (let i = 0; i < len; i++) {
      const oldVal = s[i];
      const newVal = purgeEmptyAllOfObjects(oldVal);
      copy[i] = newVal;
      changed = changed || newVal !== oldVal;
    }
    return changed ? copy : (s as JSONSchema7);
  }

  if (s.type === 'object') {
    if (
      s.anyOf &&
      (!s.required || s.required.length === 0) &&
      (!s.properties || isEmptyObject(s.properties)) &&
      allBool(s.anyOf, (sub) => sub && typeof sub === 'object' && sub.type === 'object')
    ) {
      const { properties, required, type, ...rest } = s;
      s = rest;
    }

    const props = { ...s.properties };
    if (props) {
      let changed = false;
      for (const k in props) {
        if (hasOwnProperty.call(props, k)) {
          const oldVal = props[k];
          const newVal = purgeEmptyAllOfObjects(oldVal as JSONSchema7);
          if (newVal !== oldVal) {
            props[k] = newVal;
            changed = true;
          }
        }
      }
      return changed ? { ...s, properties: props } : s;
    }
  }

  return s;
};

const tryMergeAllOf = (schema: JSONSchema7) => {
  try {
    const result = mergeAllOf(schema);
    if (typeof result !== 'object') {
      return schema;
    }

    return purgeEmptyAllOfObjects(result);
  } catch {
    return schema;
  }
};

export const inputSatisfies = (
  input: JSONSchema7,
  target: JSONSchema7,
  options: Partial<Options> | boolean = true
): boolean => {
  if (isEmptyObject(target)) {
    return true;
  }

  if (!isValidTopLevelSchema(input)) {
    return false;
  } else if (!isValidTopLevelSchema(target)) {
    return false;
  }

  const processedOpts: Options =
    typeof options === 'boolean'
      ? {
          allowPartial: options,
          allowAdditionalProps: false,
        }
      : {
          allowPartial: options.allowPartial ?? true,
          allowAdditionalProps: options.allowAdditionalProps ?? false,
        };

  if (hasAllOf(input)) {
    input = tryMergeAllOf(input);
  }

  const errors = getErrors(input, target, processedOpts, {
    input: [],
    target: [],
  });

  return !errors?.length;
};
