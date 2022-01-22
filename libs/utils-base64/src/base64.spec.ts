import base64 from './index';

describe('base64', () => {
  it('decodes a base64 encoded string', () => {
    const encodedBase64 = 'VGVzdGluZyBiYXNlNjQgZGVjb2Rpbmc=';
    const result = base64.decode(encodedBase64);

    expect(result).toEqual('Testing base64 decoding');
  });

  it('encodes text into a base64 string', () => {
    const encodedBase64Text = base64.encode('Testing encoded base64 text');
    const expectedResult = 'VGVzdGluZyBlbmNvZGVkIGJhc2U2NCB0ZXh0';

    expect(encodedBase64Text).toEqual(expectedResult);
  });

  it('should throw decoding error', () => {
    expect(() => {
      base64.decode('this should throw a decoding error');
    }).toThrow();
  });
});
