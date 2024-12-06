package com.flagshipenv

import android.annotation.SuppressLint
import android.content.Context

import android.content.SharedPreferences
import android.content.pm.PackageInfo
import android.content.res.Resources
import android.os.Build
import androidx.annotation.RequiresApi

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class FlagshipEnvModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val resources: Resources = reactContext.applicationContext.resources
    private val sharedPref: SharedPreferences =
        reactContext.getSharedPreferences("__ENV_NAME_STORE", Context.MODE_PRIVATE)

    override fun getName(): String {
        return NAME
    }

    @RequiresApi(Build.VERSION_CODES.P)
    @SuppressLint("DiscouragedApi")
    override fun getConstants(): Map<String, Any> {
        val constants = HashMap<String, Any>()
        val context = reactApplicationContext

        val envNameResourceId = resources.getIdentifier("flagship_env", "string", context.packageName)
        val envName = resources.getString(envNameResourceId);
        val showDevMenuResourceId = resources.getIdentifier("flagship_dev_menu", "string", context.packageName)
        val showDevMenu = resources.getString(showDevMenuResourceId)

        constants["envName"] = sharedPref.getString("envName", envName) ?: envName
        constants["showDevMenu"] = showDevMenu
        constants["appVersion"] = getPackageInfo().versionName
        constants["buildNumber"] = getPackageInfo().longVersionCode.toString()

        return constants
    }

    @SuppressLint("ApplySharedPref")
    @ReactMethod
    fun setEnv(name: String, promise: Promise) {
        val editor = sharedPref.edit()
        editor.putString("envName", name)
        editor.commit()

        promise.resolve(null)
    }

    @Throws(Exception::class)
    private fun getPackageInfo(): PackageInfo {
        val packageManager = reactApplicationContext.packageManager
        val packageName = reactApplicationContext.packageName
        return packageManager.getPackageInfo(packageName, 0)
    }


    companion object {
        const val NAME = "FlagshipEnv"
    }
}
