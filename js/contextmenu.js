function onClickContextMenu(info, tab) {
  console.log(info.selectionText);
  chrome.tabs.query({'active': true,'currentWindow':true},function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {method: "showDialog"}, null);
    });
}

var context = "selection";
var title = chrome.i18n.getMessage("context_menu_item");
var id = chrome.contextMenus.create({"title": title, "contexts":[context], "onclick": onClickContextMenu});