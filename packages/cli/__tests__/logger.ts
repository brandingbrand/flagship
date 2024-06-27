import logger, {centerText} from '../src/lib/logger';

jest.spyOn(console, 'log').mockImplementation(jest.fn());
jest.spyOn(console, 'warn').mockImplementation(jest.fn());
jest.spyOn(console, 'info').mockImplementation(jest.fn());
jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('logger', () => {
  beforeEach(() => {
    logger.isPaused = false; // Reset logger state before each test
  });

  it('should log info message when not paused', () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    logger.info('Test message');
    expect(consoleSpy).toHaveBeenCalledWith('Test message');
    consoleSpy.mockRestore();
  });

  it('should not log info message when paused', () => {
    logger.isPaused = true;
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    logger.info('Test message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log warning message when not paused', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('Test message');
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ ', 'Test message');
    consoleSpy.mockRestore();
  });

  it('should not log warning message when paused', () => {
    logger.isPaused = true;
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('Test message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log error message when not paused', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('Test message');
    expect(consoleSpy).toHaveBeenCalledWith('🛑 ', 'Test message');
    consoleSpy.mockRestore();
  });

  it('should not log error message when paused', () => {
    logger.isPaused = true;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('Test message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log success message when not paused', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.success('Test message');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should not log success message when paused', () => {
    logger.isPaused = true;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.success('Test message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log start message when not paused', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.start('Test message');
    expect(consoleSpy).toHaveBeenCalledWith('🎬 ', 'Test message');
    expect(consoleSpy).toHaveBeenCalledTimes(3); // Start message adds two extra lines
    consoleSpy.mockRestore();
  });

  it('should not log start message when paused', () => {
    logger.isPaused = true;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.start('Test message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should pause logging', () => {
    logger.pause();
    expect(logger.isPaused).toBeTruthy();
  });
});

describe('centerText', () => {
  test('should center text within the total length', () => {
    const result = centerText('hello', 11);
    expect(result).toBe('   hello   ');
  });

  test('should return text as is if total length is less than or equal to text length', () => {
    const result = centerText('hello world', 5);
    expect(result).toBe('hello world');
  });

  test('should return text as is if total length is equal to text length', () => {
    const result = centerText('hello', 5);
    expect(result).toBe('hello');
  });

  test('should handle empty string', () => {
    const result = centerText('', 10);
    expect(result).toBe('          ');
  });

  test('should handle total length less than custom length', () => {
    const result = centerText('hello', 4);
    expect(result).toBe('hello');
  });

  test('should handle single character padding', () => {
    const result = centerText('a', 3);
    expect(result).toBe(' a ');
  });
});
