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

function doubleClickListener(event) {
    console.log("double click");

    if(event.altKey) {
        console.log("alt is down");

        var selectedText = window.getSelection().toString();
        console.log("selected text: " + selectedText);

        getData(selectedText);
        $("#dialog").dialog();
    }    
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

function getData(selectedText) {

    var xmlhttp = new XMLHttpRequest();
    var searchUrl = "http://m.images.yandex.ru/search?text=";
    var userAgent = "Opera/9.80 (Android; Opera Mini/7.5.31657/28.2555; U; ru) Presto/2.8.119 Version/11.10";
    var url = searchUrl + selectedText;
    console.log("url: " + url);

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xmlhttp.setRequestHeader("User-Agent", userAgent);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log("data is received successfully.");
            $("#dialogContent").html(xmlhttp.responseText);
        }
    };
    xmlhttp.send(null);
}