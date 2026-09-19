package com.appkids.solarsystem;

import static org.junit.Assert.*;
import android.content.Context;
import android.content.pm.PackageManager;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class OfflineBundleTest {
    @Test
    public void appCannotAccessInternetAndContainsAudio() throws Exception {
        Context context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.appkids.solarsystem", context.getPackageName());
        assertEquals(PackageManager.PERMISSION_DENIED,
            context.getPackageManager().checkPermission("android.permission.INTERNET", context.getPackageName()));
        assertEquals(78, context.getAssets().list("public/offline-assets/audio/questions").length);
        assertEquals(57, context.getAssets().list("public/offline-assets/audio/explanations").length);
        assertEquals(48, context.getAssets().list("public/offline-assets/audio/objects").length);
        assertEquals(20, context.getAssets().list("public/offline-assets/audio/ui").length);
    }
}
