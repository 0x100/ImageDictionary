var context = "selection";
var title = chrome.i18n.getMessage("context_menu_item");
var id = chrome.contextMenus.create({"title": title, "contexts":[context], "onclick": onClickContextMenu});

function onClickContextMenu(info, tab) {
    _gaq.push(['_trackEvent', 'Showing dialog', 'context menu']);
    chrome.tabs.query({'active': true,'currentWindow':true},function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {method: "showDialog"}, null);
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    if (message.method == "getLocalStorage") {
        sendResponse({data: localStorage[message.key]});
    }
    else if (message.method == "gaEvent") {
        _gaq.push(['_trackEvent', message.category, message.event]);
    }
    else {
        sendResponse({});
    }
});

// ----- Google Analytics -----
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
