class InvalidCharacterError extends Error {
  constructor(...params: string[]) {
    super(...params);
    this.name = 'InvalidCharacterError';
  }
}

const error = function (message: string) {
  // Note: the error messages used throughout this file match those used by
  // the native `atob`/`btoa` implementation in Chromium.
  throw new InvalidCharacterError(message);
};

const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

function decode(input: string) {
  input = String(input).replace(REGEX_SPACE_CHARACTERS, '');
  let length = input.length;
  if (length % 4 === 0) {
    input = input.replace(/==?$/, '');
    length = input.length;
  }
  if (
    length % 4 === 1 ||
    // http://whatwg.org/C#alphanumeric-ascii-characters
    /[^+a-zA-Z0-9/]/.test(input)
  ) {
    error('Invalid character: the string to be decoded is not correctly encoded.');
  }
  let bitCounter = 0;
  let bitStorage = 0;
  let buffer;
  let output = '';
  let position = -1;
  while (++position < length) {
    buffer = TABLE.indexOf(input.charAt(position));
    bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
    // Unless this is the first of a group of 4 characters…
    if (bitCounter++ % 4) {
      // …convert the first 8 bits to a single ASCII character.
      output += String.fromCharCode(0xff & (bitStorage >> ((-2 * bitCounter) & 6)));
    }
  }
  return output;
}

const encode = function (input: string) {
  input = String(input);
  if (/[^\0-\xFF]/.test(input)) {
    // Note: no need to special-case astral symbols here, as surrogates are
    // matched, and the input is supposed to only contain ASCII anyway.
    error('The string to be encoded contains characters outside of the ' + 'Latin1 range.');
  }
  const padding = input.length % 3;
  let output = '';
  let position = -1;
  let a;
  let b;
  let c;
  let buffer;
  // Make sure any padding is handled outside of the loop.
  const length = input.length - padding;

  while (++position < length) {
    // Read three bytes, i.e. 24 bits.
    a = input.charCodeAt(position) << 16;
    b = input.charCodeAt(++position) << 8;
    c = input.charCodeAt(++position);
    buffer = a + b + c;
    // Turn the 24 bits into four chunks of 6 bits each, and append the
    // matching character for each of them to the output.
    output +=
      TABLE.charAt((buffer >> 18) & 0x3f) +
      TABLE.charAt((buffer >> 12) & 0x3f) +
      TABLE.charAt((buffer >> 6) & 0x3f) +
      TABLE.charAt(buffer & 0x3f);
  }

  if (padding === 2) {
    a = input.charCodeAt(position) << 8;
    b = input.charCodeAt(++position);
    buffer = a + b;
    output +=
      TABLE.charAt(buffer >> 10) +
      TABLE.charAt((buffer >> 4) & 0x3f) +
      TABLE.charAt((buffer << 2) & 0x3f) +
      '=';
  } else if (padding === 1) {
    buffer = input.charCodeAt(position);
    output += TABLE.charAt(buffer >> 2) + TABLE.charAt((buffer << 4) & 0x3f) + '==';
  }

  return output;
};

const base64 = {
  decode,
  encode,
};

export default base64;
