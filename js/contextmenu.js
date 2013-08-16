function onClickContextMenu(info, tab) {
  console.log(info.selectionText);
  chrome.tabs.query({'active': true,'currentWindow':true},function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {method: "showDialog"}, null);
    });
}

var context = "selection";
var title = "Show '%s' in Image Dictionary";
var id = chrome.contextMenus.create({"title": title, "contexts":[context], "onclick": onClickContextMenu});