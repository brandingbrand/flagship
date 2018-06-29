package com.brandingbrand.reactnative.and.flagship;

import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.Map;
import java.util.HashMap;

public class EnvSwitcher extends ReactContextBaseJavaModule {
    SharedPreferences sharedPref;

    public EnvSwitcher(ReactApplicationContext reactContext) {
        super(reactContext);
        sharedPref = MainActivity.getActivity().getSharedPreferences("__ENV_NAME_STORE", Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "EnvSwitcher";
    }

    @Override
    public Map<String, Object> getConstants() {
        String initialEnvName = ""; // [EnvSwitcher initialEnvName]
        String envName = sharedPref.getString("envName", initialEnvName);
        final Map<String, Object> constants = new HashMap<>();

        constants.put("envName", envName);

        return constants;
    }

    @ReactMethod
    public void setEnv(String name, Promise promise) {
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString("envName", name);
        editor.commit();
        promise.resolve(null);
    }
}
