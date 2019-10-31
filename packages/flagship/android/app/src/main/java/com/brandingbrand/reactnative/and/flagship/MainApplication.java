package CONFIG_BUNDLE_ID;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIImplementationProvider;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    protected List<ReactPackage> getPackages(Application application, boolean debug) {
        return Arrays.asList(
                new MainReactPackage(),
                new NativeConstantsPackage(),
                new EnvSwitcherPackage(),
                new ReactNativeRestartPackage(),
                new CookieManagerPackage(),
                new RNDeviceInfo()
        );
    }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages(this, BuildConfig.DEBUG);
    }

    @Override
    public String getJSMainModuleName() {
        return "index";
    }

    protected UIImplementationProvider getUIImplementationProvider() {
        return new UIImplementationProvider() {
            @Override
            public UIImplementation createUIImplementation(
                    ReactApplicationContext reactContext,
                    UIManagerModule.ViewManagerResolver viewManagerResolver,
                    EventDispatcher eventDispatcher,
                    int minTimeLeftInFrameForNonBatchedOperationMs) {
                return new ThreadSafeUIImplementation(
                        reactContext,
                        viewManagerResolver,
                        eventDispatcher,
                        minTimeLeftInFrameForNonBatchedOperationMs);
            }

            @Override
            public UIImplementation createUIImplementation(
                    ReactApplicationContext reactContext,
                    List<ViewManager> viewManagerList,
                    EventDispatcher eventDispatcher,
                    int minTimeLeftInFrameForNonBatchedOperationMs) {
                return new ThreadSafeUIImplementation(
                        reactContext,
                        viewManagerList,
                        eventDispatcher,
                        minTimeLeftInFrameForNonBatchedOperationMs);
            }
        };
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    // [CODEPUSH FUNCTIONS INJECT]
}
