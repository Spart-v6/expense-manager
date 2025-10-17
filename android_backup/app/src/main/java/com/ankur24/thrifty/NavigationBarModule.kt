package com.ankur24.thrifty

import android.app.Activity
import android.graphics.Color
import android.view.Window
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NavigationBarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "NavigationBarModule"
    }

    @ReactMethod
    fun setNavigationBarColor(color: String) {
        val activity: Activity? = currentActivity
        activity?.runOnUiThread {
            val window: Window = activity.window
            window.navigationBarColor = Color.parseColor(color)

            // Adjust icon color based on brightness
            val controller = WindowInsetsControllerCompat(window, window.decorView)
            val luminance = Color.luminance(Color.parseColor(color))
            controller.isAppearanceLightNavigationBars = luminance > 0.5
        }
    }
}
