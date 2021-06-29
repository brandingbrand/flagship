package CONFIG_BUNDLE_ID;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

public class MainApplication extends NavigationApplication {
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }
            @Override
            public List<ReactPackage> getPackages() {
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here, for example:
                packages.add(new NativeConstantsPackage());
                packages.add(new EnvSwitcherPackage());
                return packages;
            }

            // [CODEPUSH FUNCTIONS INJECT]
        };
        return new ReactGateway(host);
    }

    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    public String getJSMainModuleName() {
        return "index";
    }

    private final ReactNativeHost mReactNativeHost =
        new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here, for example:
                // packages.add(new MyReactNativePackage());
                return packages;
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
