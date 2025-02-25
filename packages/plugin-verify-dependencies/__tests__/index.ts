// Mock with a spy we can track
const mockSelect = jest.fn();

// Mock the module
jest.mock('@brandingbrand/code-cli-kit', () => ({
  version: {
    select: mockSelect,
  },
}));

import {profiles, getProfile} from '../src/profile';
import profile072 from '../src/profile/0.72';
import profile073 from '../src/profile/0.73';
import profile074 from '../src/profile/0.74';
import profile075 from '../src/profile/0.75';
import profile076 from '../src/profile/0.76';
import profile077 from '../src/profile/0.77';
import profile078 from '../src/profile/0.78';

describe('Profile Module', () => {
  describe('profiles', () => {
    it('should contain all supported React Native versions', () => {
      expect(profiles).toEqual({
        '0.72': profile072,
        '0.73': profile073,
        '0.74': profile074,
        '0.75': profile075,
        '0.76': profile076,
        '0.77': profile077,
        '0.78': profile078,
      });
    });
  });

  describe('getProfile', () => {
    it('should return correct profile for valid version', () => {
      expect(getProfile('0.72')).toBe(profile072);
      expect(getProfile('0.73')).toBe(profile073);
      expect(getProfile('0.74')).toBe(profile074);
      expect(getProfile('0.75')).toBe(profile075);
      expect(getProfile('0.76')).toBe(profile076);
      expect(getProfile('0.77')).toBe(profile077);
      expect(getProfile('0.78')).toBe(profile078);
    });

    it('should return undefined for invalid version', () => {
      expect(getProfile('0.71')).toBeUndefined();
      expect(getProfile('0.79')).toBeUndefined();
      expect(getProfile('invalid')).toBeUndefined();
    });
  });

  describe('version selection', () => {
    it('should call version.select with profiles', () => {
      // Set up mock return value
      mockSelect.mockReturnValue(profile072);

      // Import the default export
      require('../src/profile').default;

      // Verify the mock was called with profiles
      expect(mockSelect).toHaveBeenCalledTimes(1);
      expect(mockSelect).toHaveBeenCalledWith(profiles);
    });
  });
});
