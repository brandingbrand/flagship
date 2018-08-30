package com.brandingbrand.reactnative.and.flagship;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.common.MeasureSpecProvider;
import com.facebook.react.uimanager.common.SizeMonitoringFrameLayout;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.UIViewOperationQueue;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.ViewManagerRegistry;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.util.List;

public class ThreadSafeUIImplementation extends UIImplementation {
    private final Object mLock = new Object();

    public ThreadSafeUIImplementation(ReactApplicationContext reactContext,
                                      UIManagerModule.ViewManagerResolver viewManagerResolver,
                                      EventDispatcher eventDispatcher,
                                      int minTimeLeftInFrameForNonBatchedOperationMs) {
        super(reactContext, viewManagerResolver, eventDispatcher, minTimeLeftInFrameForNonBatchedOperationMs);
    }

    public ThreadSafeUIImplementation(ReactApplicationContext reactContext,
                                      List<ViewManager> viewManagers,
                                      EventDispatcher eventDispatcher,
                                      int minTimeLeftInFrameForNonBatchedOperationMs) {
        super(reactContext, viewManagers, eventDispatcher, minTimeLeftInFrameForNonBatchedOperationMs);
    }

    public ThreadSafeUIImplementation(ReactApplicationContext reactContext,
                                      ViewManagerRegistry viewManagers,
                                      UIViewOperationQueue operationsQueue,
                                      EventDispatcher eventDispatcher) {
        super(reactContext, viewManagers, operationsQueue, eventDispatcher);
    }

    @Override
    public void manageChildren(
            int viewTag,
            @Nullable ReadableArray moveFrom,
            @Nullable ReadableArray moveTo,
            @Nullable ReadableArray addChildTags,
            @Nullable ReadableArray addAtIndices,
            @Nullable ReadableArray removeFrom) {
        synchronized (mLock) {
            super.manageChildren(viewTag, moveFrom, moveTo, addChildTags, addAtIndices, removeFrom);
        }
    }

    @Override
    public void setChildren(int viewTag, ReadableArray childrenTags) {
        synchronized (mLock) {
            super.setChildren(viewTag, childrenTags);
        }
    }

    @Override
    public void createView(int tag, String className, int rootViewTag, ReadableMap props) {
        synchronized (mLock) {
            super.createView(tag, className, rootViewTag, props);
        }
    }

    @Override
    public void removeRootShadowNode(int rootViewTag) {
        synchronized (mLock) {
            super.removeRootShadowNode(rootViewTag);
        }
    }

    @Override
    public <T extends SizeMonitoringFrameLayout & MeasureSpecProvider> void registerRootView(T rootView, int tag, ThemedReactContext context) {
        synchronized (mLock) {
            super.registerRootView(rootView, tag, context);
        }
    }
}
