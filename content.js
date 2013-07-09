chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("onMessage");
    if (request.method == "getSelection") {
        console.log("method == getSelection");
        console.log("selection: " + window.getSelection().toString());
        sendResponse({data: window.getSelection().toString()});
    }
    else
        sendResponse({});
});

function onDblClickListener() {
    console.log("selection: " + window.getSelection().toString());
}

function init() {
    document.body.addEventListener('dblclick', onDblClickListener);
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});