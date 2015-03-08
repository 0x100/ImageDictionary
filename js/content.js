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

document.addEventListener('DOMContentLoaded', function () {
    initialize();
});

function initialize() {
    initializeEvents();
}

function initializeEvents() {
    chrome.runtime.sendMessage({method: "getLocalStorage", key: "click_type"}, function (response) {
        var isDoubleClickEvent = response.data && response.data == '2';
        if (isDoubleClickEvent) {
            document.body.addEventListener('dblclick', clickListener);
        }
    });

    document.body.addEventListener('click',  clickListener);
    document.body.addEventListener('keyup', keyListener);
}

function showDialog() {
    var selectedText = window.getSelection().toString();

    if (selectedText && selectedText.trim().length > 0) {
        loadData(selectedText);

        createDialog();

        var dialog = $('#imgDialog');
        dialog.attr('title', selectedText);
        dialog.show(500);
    }
}

function hideDialog() {
    var imgDialog = $('#imgDialog');
    if(imgDialog.is(':visible')) {
        imgDialog.slideToggle('fast', function() {
          $('#imgDialog').remove();
        });
    }
}

function createDialog() {
    var dialog = document.createElement("div");
    dialog.id = "imgDialog";
    dialog.style.display = "none";

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

    var nothingFoundMessage = document.createElement("span");
    nothingFoundMessage.id = "nothingFoundMessage";
    nothingFoundMessage.innerText = chrome.i18n.getMessage("not_found");
    nothingFoundMessage.className = "not-found-message";
    nothingFoundMessage.display = "none";

    logoHref.appendChild(logoImg);
    logo.appendChild(logoHref);

    dialog.appendChild(logo);
    dialog.appendChild(dialogContent);
    dialog.appendChild(nothingFoundMessage);

    document.body.appendChild(dialog);
}

function clickListener(event) {
    var imgDialog = $('#imgDialog');
    if (imgDialog.is(':visible')) {
        hideDialog();
    }
    else {
        chrome.runtime.sendMessage({method: "getLocalStorage", key: "control_key"}, function (response) {
            var controlKey = response.data ? response.data : 'alt';
            if (controlKey == 'alt' && event.altKey || controlKey == 'ctrl' && event.ctrlKey || controlKey == 'none') {
                chrome.runtime.sendMessage({method: 'gaEvent', category: 'Showing dialog', event: 'key & mouse'});
                showDialog();
            }
        });
    }
}

function keyListener(event) {
    if (event.keyCode == 27) {
        hideDialog();
    }
}

function loadData(selectedText) {

    var xmlhttp = new XMLHttpRequest();
    var searchUrl = "https://yandex.ru/images/search?text=";
    var url = searchUrl + selectedText;

    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var doc = xmlhttp.responseText;
            var data = parseData(doc);
            $("#dialogContent").html(data.result);
        }
    };
    xmlhttp.send(null);
}

function removeDublicates(array) {
    return array.filter(function (elem, pos) {
        return array.indexOf(elem) == pos;
    });
}

function parseData(doc) {
    var hrefs = doc.match(/(\/\/[\w-]+\.yandex\.net\/i\?id=[\w-]+)/g); //Matches to the url like "http://im0-tub-ru.yandex.net/i?id=473594863-10-71"

    var nothingFoundMessage = $('#nothingFoundMessage');
    var yandexLogo = $('#yandexLogo');

    var result = '';

    if (hrefs && hrefs.length > 0) {
        hrefs = removeDublicates(hrefs);

        for (var i = 0; i < hrefs.length && i < 12; i++) {
            result += "<div class='container'>";
            result += "<div class='imgbox'><img src='http://" + hrefs[i] + "&n=3' class='img' alt='' /></div>";
            result += "</div>";
        }
        yandexLogo.css('display', 'block');
        nothingFoundMessage.css('display', 'none');
    }
    else {
        yandexLogo.css('display', 'none');
        nothingFoundMessage.css('display', 'block');
    }
    return {result: result};
}