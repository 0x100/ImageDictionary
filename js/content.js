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
    
    var logo = document.createElement("div");    
    logo.id = 'yandex-logo';
    logo.className = "yandex-logo";
        
    var logoHref = document.createElement("a");    
    logoHref.href = "http://images.yandex.ru";    
    
    var logoImg = document.createElement("img");
    logoImg.src = "http://img.yandex.net/i/m_logo.png";
    logoImg.alt = "";

    var dialogContent = document.createElement("p");
    dialogContent.id = "dialogContent";
    dialogContent.className = "img-dialog-content";
    
    var resultsCount = document.createElement("span");    
    resultsCount.id = "resultsCount";    
    resultsCount.className = "results";    

    logoHref.appendChild(logoImg);
    logo.appendChild(logoHref);
    logo.appendChild(resultsCount);
    dialog.appendChild(logo);
    
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
            var resultsCount = doc.match(/[\d]+\-[\d]+ [а-яa-z]+ [\d]+&nbsp;[а-яa-z]+./g); //Matches to string like "1-12 из 199 тыс."
            var result = '';
            
            if(hrefs && hrefs.length > 0) {
                for(var i = 0; i < hrefs.length && i < 12; i++) {
                    result += "<div class='imgbox'>";
                    result += "<span><img src='" + hrefs[i] + "' alt='' /></span>";
                    result += "</div>";
                }
            }            
            console.log(resultsCount);
            if(resultsCount) {
              $("#resultsCount").text("&nbsp;" + resultsCount);
            }
              
            $("#dialogContent").html(result);
        }
    };
    xmlhttp.send(null);
}