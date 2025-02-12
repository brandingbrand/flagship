import path from '../../src/lib/path/0.73';

describe('path', () => {
  it('should have an android.mainApplication function that returns the path to android/app/src/main/java/com/example/app/MainApplication.kt', () => {
    const config = {
      android: {
        name: 'example',
        displayName: 'Example',
        packageName: 'com.example.app',
      },
      ios: {
        name: 'example',
        displayName: 'Example',
        bundleId: 'com.example.app',
      },
    };
    const mainApplicationPath = path.android.mainApplication(config);
    expect(mainApplicationPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/java\/com\/example\/app\/MainApplication\.kt$/,
      ),
    );
  });

  it('should have an android.mainActivity function that returns the path to android/app/src/main/java/com/example/app/MainActivity.kt', () => {
    const config = {
      android: {
        name: 'example',
        displayName: 'Example',
        packageName: 'com.example.app',
      },
      ios: {
        name: 'example',
        displayName: 'Example',
        bundleId: 'com.example.app',
      },
    };
    const mainActivityPath = path.android.mainActivity(config);
    expect(mainActivityPath).toEqual(
      expect.stringMatching(
        /.*android\/app\/src\/main\/java\/com\/example\/app\/MainActivity\.kt$/,
      ),
    );
  });
});
