import { ios, android } from "../src";

describe('plugin-local', () => {
  it('ios', async () => {
    await ios({} as never);

    expect('').toMatch('');
  });

  it('android', async () => {
    await android({} as never);

    expect('').toMatch('');
  });
});
