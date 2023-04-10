package <%- android.packageName %>;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

public class NativeConstants extends ReactContextBaseJavaModule {
    public NativeConstants(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NativeConstants";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("installed", true);
        constants.put("ShowDevMenu", "<%- !release %>");

        return constants;
    }
}
