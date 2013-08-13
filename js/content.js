chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection") {
        sendResponse({data: window.getSelection().toString()});
    }
    else if(request.method == "showDialog") {
        showDialog(); 
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
    document.body.addEventListener('keyup', keyListener);
}

function showDialog() {
    var selectedText = window.getSelection().toString();
    getData(selectedText);

    var dialog = $('#imgDialog');
    dialog.show(500);
}

function hideDialog() {
    $('#imgDialog').slideToggle();
}

function doubleClickListener(event) {
    if(event.altKey) {
        showDialog();        
    }
}

function keyListener(event) {
    if (event.keyCode == 27) { 
        hideDialog();
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
        hideDialog();
    });
}

function getData(selectedText) {

    var xmlhttp = new XMLHttpRequest();
    var searchUrl = "http://m.images.yandex.ru/search?text=";    
    var url = searchUrl + selectedText;
    
    //var xpath = "//div[@class='b-prew']//img/@src";

    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {     

            var doc = xmlhttp.responseText;
            var hrefs = doc.match(/http:\/\/[\w-]+.yandex.net\/i\?id=[\w-]+/g); //Matches to the url like "http://im0-tub-ru.yandex.net/i?id=473594863-10-71"
            var result = '';
            
            if(hrefs && hrefs.length > 0) {
                for(var i = 0; i < hrefs.length && i < 12; i++) {
                    result += "<div class='imgbox'>";
                    result += "<img src='" + hrefs[i] + "' class='img' alt='' />";
                    result += "</div>";
                }
            }            
            $("#dialogContent").html(result);
        }
    };
    xmlhttp.send(null);
}