import {emitter, withAction} from '../src/lib/action';

jest.spyOn(process, 'exit').mockImplementation(jest.fn() as any);
jest.spyOn(console, 'info').mockImplementation(jest.fn());
jest.spyOn(emitter, 'emit').mockImplementation(jest.fn());

describe('withAction function', () => {
  it('should log a successful execution', async () => {
    const mockFn = jest.fn().mockResolvedValueOnce(undefined);
    await withAction(mockFn, 'Test Function', 'code')();

    expect(emitter.emit).toHaveBeenCalled();
  });

  it('should log a failed execution with error', async () => {
    const mockFn = jest.fn().mockRejectedValueOnce(new Error('Test Error'));
    await withAction(mockFn, 'Test Function', 'code')();

    expect(emitter.emit).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalled();
  });
});
