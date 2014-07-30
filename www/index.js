/*
 * send js errors to acra the ios part
 */

// test default values
var config = {
    ACRA_SERVER : "http://192.168.0.48:9000",
    APP_VERSION_NAME : "test-0.0.1",
    APP_VERSION_CODE : 1,
    PACKAGE_NAME : "",
    ANDROID_VERSION : "ios"
};

function init(acra_server, version, bundleId) {
    config.ACRA_SERVER = acra_server;
    config.APP_VERSION_NAME = version;
    config.APP_VERSION_CODE = 1;
    config.PACKAGE_NAME = bundleId;
    config.ANDROID_VERSION = "ios";
}

function report(err) {
    return {
        USER_CRASH_DATE: (new Date()).toISOString(),
        PACKAGE_NAME : config.PACKAGE_NAME,
        ANDROID_VERSION : 'ios-' + device.version,
        CUSTOM_DATA: {
            message: err.message,
            line: err.line || "",
            sourceId: err.sourceId || ""
        },
        PHONE_MODEL: device.model,
        APP_VERSION_NAME: config.APP_VERSION_NAME,
        APP_VERSION_CODE: config.APP_VERSION_CODE,
        REPORT_ID: (Math.random() * 10000).toString() + "/" + device.uuid,
        STACK_TRACE: err.stack || "no stack trace available " + ((Math.random() * 10000).toString())
    };
}

function xhr(method, url, data, cb) {
    var x = new XMLHttpRequest();

    x.onreadystatechange = function() {
        if (x.readyState === 4 && x.status == 200)
            return cb(null, x.reponseText);
        else return cb(new Error("Failed" + x.readyState));
    }
    x.open(method, url, true);
    x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    x.send(JSON.stringify(data));
}

// FIXME
function send(err, sourceId, line) {
    console.log(err);
    if(device.platform !== 'Android') {
        xhr('POST', config.ACRA_SERVER + '/report', report(err), function (err, response) {
            console.log('error sent to acra');
        });
    }
}

// listen global js errors
window.onerror = send;

module.exports = {
    // expose send for testing
    send:send,
    // initialize the acra plugin
    init:init
};
