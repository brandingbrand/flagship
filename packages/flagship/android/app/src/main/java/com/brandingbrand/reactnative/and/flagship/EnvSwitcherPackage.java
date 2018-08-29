package com.brandingbrand.reactnative.and.flagship;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EnvSwitcherPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(final ReactApplicationContext reactContext) {
        return new ArrayList<NativeModule>() {{
            add(new EnvSwitcher(reactContext));
        }};
    }
}