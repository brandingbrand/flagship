package com.brandingbrand.reactnative.and.flagship;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class EnvSwitcher extends ReactContextBaseJavaModule {
    private SharedPreferences sharedPref;

    public EnvSwitcher(ReactApplicationContext reactContext) {
        super(reactContext);

        sharedPref = reactContext.getSharedPreferences("__ENV_NAME_STORE", Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "EnvSwitcher";
    }

    @Override
    public Map<String, Object> getConstants() {
        final String initialEnvName = ""; // [EnvSwitcher initialEnvName]

        return new HashMap<String, Object>() {{
            put("envName", sharedPref.getString("envName", initialEnvName));
        }};
    }

    @SuppressLint("ApplySharedPref")
    @ReactMethod
    public void setEnv(String name, Promise promise) {
        final SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString("envName", name);
        editor.commit();

        promise.resolve(null);
    }
}