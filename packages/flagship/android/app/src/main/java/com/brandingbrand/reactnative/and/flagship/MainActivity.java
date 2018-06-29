package com.brandingbrand.reactnative.and.flagship;

import android.app.Activity;
import android.os.Bundle;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {
    private static Activity mCurrentActivity = null;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mCurrentActivity = this;
    }

    public static Activity getActivity(){
        return mCurrentActivity;
    }
    @Override
    public int getSplashLayout() {
        return R.layout.splash;
    }
}
