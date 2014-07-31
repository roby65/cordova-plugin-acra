/*
 * send js errors to acra the ios part...
 */

var config = {
    ACRA_SERVER : window.ACRA_SERVER || "http://192.168.0.48:9000",
    APP_VERSION_NAME : window.ACRA_SERVER || "default-0.0.1",
    APP_VERSION_CODE : 1,
    PACKAGE_NAME : window.PACKAGE_NAME || "default-bundleId",
    ANDROID_VERSION : "ios"
};

function report(err, source, line) {
    var stack = window.printStackTrace({e:err});
    return {
        USER_CRASH_DATE: (new Date()).toISOString(),
        PACKAGE_NAME : config.PACKAGE_NAME,
        ANDROID_VERSION : 'ios-' + device.version,
        CUSTOM_DATA : {
            message: err.msg || err.message || err.toString() || "Oooooooooops",
            line: line,
            sourceId: source
        },
        PHONE_MODEL: device.model,
        APP_VERSION_NAME: config.APP_VERSION_NAME,
        APP_VERSION_CODE: config.APP_VERSION_CODE,
        REPORT_ID: (Math.random() * 10000).toString() + "/" + device.uuid,
        STACK_TRACE: stack.join(',')
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

function send(err, source, line) {
    if(device.platform !== 'Android') {
        xhr('POST', config.ACRA_SERVER + '/report', report(err, source, line), function (err, response) {
            console.log('error sent to acra');
        });
    }
}

// listen global js errors
window.onerror = send;

module.exports = {
    send:send
};
