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

    if(event.altKey) {

        var selectedText = window.getSelection().toString();
        console.log('text: ' + selectedText);
        getData(selectedText);

        var dialog = $('#imgDialog');
        dialog.show(1000);
    }
}

function createDialog() {
    var dialog = document.createElement("div");
    dialog.id = "imgDialog";
    dialog.title = "Image Dictionary";
    dialog.style.display = "none";
    dialog.className = "img-dialog";

    var dialogContent = document.createElement("p");
    dialogContent.id = "dialogContent";
    dialogContent.className = "img-dialog-content";

    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);

    $('#dialogContent').click(function() {
        $('#imgDialog').slideToggle();
    });
}

function getData(selectedText) {

    var xmlhttp = new XMLHttpRequest();
    var searchUrl = "http://m.images.yandex.ru/search?text=";
    var xpath = "//div[@class='b-prew']//img/@src";
    var url = searchUrl + selectedText;
    console.log("url: " + url);

    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log("data is received successfully.");
            console.log(xmlhttp);

            var parser = new DOMParser();
            var dom = parser.parseFromString(xmlhttp.responseText, "text/xml");
            console.log(dom);

            var nodes = dom.evaluate(xpath, dom, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            console.log(nodes);

            var result = ""
            var node = nodes.iterateNext ();
            while (node) {
                result += node.innerHTML + "<br />";
                node = nodes.iterateNext ()
            }
            console.log(result);
            $("#dialogContent").html(result);
        }
    };
    xmlhttp.send(null);
}