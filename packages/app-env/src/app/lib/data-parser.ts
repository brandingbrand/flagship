/**
 * Attempts to recursively parse any JSON strings within the input.
 *
 * If the input is a string that appears to be a JSON object or array, this function will act
 * similarly to JSON.parse. If parsing fails, the input will be returned unmodified.
 *
 * If the input is a string, but does not appear to be a JSON object or array,
 * it will be returned unmodified.
 *
 * If the input is an object or array, this function will attempt to recursively parse any
 * string values within the input. detected strings follow the same parsing
 * rules as the top-level input.
 *
 * A new object or array will be returned with the same structure as the input,
 * but with any successfully parsed JSON strings replaced with their corresponding
 * JavaScript object or array values.
 *
 * **WARNING** This method may be extremely expensive for large complex objects.
 * Use with caution, and heavily memoize results to avoid repeated parsing operations.
 *
 */
export const tryDeepJSONParse = (input: any): any => {
  if (
    typeof input === 'string' &&
    (isMaybeObjectString(input) || isMaybeArrayString(input))
  ) {
    try {
      const finalInput = tryDeepJSONParse(JSON.parse(input));
      return finalInput;
    } catch {
      return input;
    }
  }

  if (typeof input === 'object' && input !== null) {
    return Array.isArray(input)
      ? input.map(it => tryDeepJSONParse(it))
      : Object.fromEntries(
        Object.entries(input).map(([key, value]) => [
          key,
          tryDeepJSONParse(value),
        ]),
      );
  }

  return input;
};

const isMaybeObjectString = (input: string): boolean =>
  input.trim().startsWith('{') && input.trim().endsWith('}');
const isMaybeArrayString = (input: string): boolean =>
  input.trim().startsWith('[') && input.trim().endsWith(']');
