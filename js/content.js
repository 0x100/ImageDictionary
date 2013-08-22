document.addEventListener('DOMContentLoaded', function () {
    init();
});

function init() {
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "click_type"}, function (response) {
        document.body.addEventListener(response.data && response.data == '1' ? 'click' : 'dblclick', clickListener);
    });
    document.body.addEventListener('keyup', keyListener);
    createDialog();
}

function clickListener(event) {
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "control_key"}, function (response) {
        var controlKey = response.data ? response.data : 'alt';
        if (controlKey == 'alt' && event.altKey || controlKey == 'ctrl' && event.ctrlKey || controlKey == 'none') {
            showDialog();
        }
    });
}

function showDialog() {
    var selectedText = window.getSelection().toString();
    loadData(selectedText);

    var dialog = $('#imgDialog');
    dialog.show(500);
}

function hideDialog() {
    $('#imgDialog').slideToggle();
}

function keyListener(event) {
    if (event.keyCode == 27) {
        hideDialog();
    }
}

function parseData(doc) {
    var hrefs = doc.match(/http:\/\/[\w-]+.yandex.net\/i\?id=[\w-]+/g); //Matches to the url like "http://im0-tub-ru.yandex.net/i?id=473594863-10-71"
    var resultsCount = doc.match(/[\d]+\-[\d]+ [а-яa-z]+ [\d]+&nbsp;[а-яa-z]+./g); //Matches to string like "1-12 из 199 тыс."
    var result = '';

    if (hrefs && hrefs.length > 0) {
        for (var i = 0; i < hrefs.length && i < 12; i++) {
            result += "<div class='container'>";
            result += "<div class='imgbox'><img src='" + hrefs[i] + "' class='img' alt='' /></div>";
            result += "</div>";
        }
    }
    return {resultsCount: resultsCount, result: result};
}
function loadData(selectedText) {

    var xmlhttp = new XMLHttpRequest();
    var searchUrl = "http://m.images.yandex.ru/search?text=";
    var url = searchUrl + selectedText;

    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var doc = xmlhttp.responseText;
            var data = parseData(doc);

            if (data.resultsCount) {
                $("#resultsCount").text("&nbsp;" + data.resultsCount);
            }
            $("#dialogContent").html(data.result);
        }
    };
    xmlhttp.send(null);
}

function createDialog() {
    var dialog = document.createElement("div");
    dialog.id = "imgDialog";
    dialog.title = "Image Dictionary";
    dialog.style.display = "none";
    dialog.className = "imdict-dialog";

    var logo = document.createElement("div");
    logo.id = 'yandexLogo';
    logo.className = "yandex-logo";

    var logoHref = document.createElement("a");
    logoHref.href = "http://images.yandex.ru";

    var logoImg = document.createElement("img");
    logoImg.src = "http://img.yandex.net/i/m_logo.png";
    logoImg.alt = "";
    logoImg.className = "yandex-logo-img";

    var dialogContent = document.createElement("p");
    dialogContent.id = "dialogContent";
    dialogContent.className = "imdict-dialog-content";

    var resultsCount = document.createElement("span");
    resultsCount.id = "resultsCount";
    resultsCount.className = "results";

    logoHref.appendChild(logoImg);
    logo.appendChild(logoHref);
    logo.appendChild(resultsCount);
    dialog.appendChild(logo);

    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);

    $('#dialogContent').click(function () {
        hideDialog();
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection") {
        sendResponse({data: window.getSelection().toString()});
    }
    else if (request.method == "showDialog") {
        showDialog();
    }
    else
        sendResponse({});
});