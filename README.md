cordova-plugin-acra
===================

What it does
------------

### Android
Bundles the Acra client library, and catch all Javascript errors to send them to the server in addition to Java exceptions.
### iOS
Catch all javascripts errors by listening to window.onerror and send them to the server.

Javascript errors being all seen as the same Java exception, custom fields are included:

```
CUSTOM_DATA -> sourceId
CUSTOM_DATA -> line
CUSTOM_DATA -> message
```

Dependencies
------------

This plugins depends on the Cordova Device plugin: org.apache.cordova.device

Usage
-----
 * Install the plugin to your Cordova application: `cordova plugin add https://github.com/erwan/cordova-plugin-acra`
 * for Android
 ** As the documentation of Acra says, create an Application class with the `ReportsCrashes` annotation with the address to your acra server like

``` java
package com.mycompany.MyAppPackage;

import android.app.Application;
import org.acra.ACRA;
import org.acra.annotation.ReportsCrashes;
import org.acra.sender.HttpSender;

@ReportsCrashes(
    formKey = "",
    httpMethod = HttpSender.Method.POST,
    reportType = HttpSender.Type.JSON,
    formUri = "http://my-acra-server/report"
)
public class MyApp extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        ACRA.init(this);
    }

}
```

then tell the AndroidManifest.xml to point to that Application by adding the following attribute

```
android:name=".MyApp"
```

to the application tag in the AndroidManifest.xml

* for iOS, you need to provide the following 3 global variables:

```
ACRA_SERVER = "http://my-server";
APP_VERSION_NAME = "http://my-server";
PACKAGE_NAME = "my-bundle-id";
```
