const mockFn = jest.fn(() => {
  return new Promise((resolve) => {
    return resolve();
  });
});

// react-native-cookies currently throws an "add files to XCode project" error when running
// tests. We'll need to investigate this or add alternate functionality to add session
// testing in the future. -BW
jest.mock('react-native-cookies', () => {
  return {
    set: mockFn,
    setFromResponse: mockFn,
    getFromResponse: mockFn,
    get: mockFn,
    getAll: mockFn,
    clearAll: mockFn,
    clearByName: mockFn,
  };
});
