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

document.addEventListener('DOMContentLoaded', function () {
    init();
});

function init() {
    initListeners();
    createDialog();
}

function initListeners() {
    document.body.addEventListener('dblclick', doubleClickListener);
}

function doubleClickListener() {
    var selectedText = window.getSelection().toString();
    console.log("selected text: " + selectedText);

    $("#dialog").dialog();
    $("#dialogContent").text(selectedText);
}

function createDialog() {
    var dialog = document.createElement("div");
    dialog.id = "dialog";
    dialog.title = "Image Dictionary";
    dialog.style.display = "none";

    var dialogContent = document.createElement("p");
    dialogContent.id = "dialogContent";
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
}