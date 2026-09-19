package com.appkids.solarsystem;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Capacitor serves bundled files through request interception, not a socket.
        getBridge().getWebView().getSettings().setBlockNetworkLoads(true);
    }
}
