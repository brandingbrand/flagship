package com.brandingbrand.reactnative.and.flagship;

import android.app.Application;

import com.facebook.react.ReactApplication;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.reactnativenavigation.*;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    protected List<ReactPackage> getPackages(Application application, boolean debug) {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNSensitiveInfoPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new NativeConstantsPackage(),
            new EnvSwitcherPackage(),
            new ReactNativeRestartPackage()
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

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    // [CODEPUSH FUNCTIONS INJECT]
}
