function init() {
    document.title = chrome.i18n.getMessage("options_title");
    document.getElementById("lblClickType").innerText = chrome.i18n.getMessage("click_type");
    document.getElementById("lblKey").innerText = chrome.i18n.getMessage("key");
    document.getElementById("btnSave").value = chrome.i18n.getMessage("save");

    var ddlClickType = document.getElementById("ddlClickType");
    ddlClickType.options[ddlClickType.options.length] = new Option(chrome.i18n.getMessage("dblclick"), "2");
    ddlClickType.options[ddlClickType.options.length] = new Option(chrome.i18n.getMessage("click"), "1");

    restoreOptions();
}

function saveOptions() {
    var ddlClickType = document.getElementById("ddlClickType");
    var ddlKey = document.getElementById("ddlKey");

    localStorage["control_key"] = ddlKey.children[ddlKey.selectedIndex].value;
    localStorage["click_type"] = ddlClickType.children[ddlClickType.selectedIndex].value;

    var status = document.getElementById("status");
    status.innerHTML = chrome.i18n.getMessage("options_saved");
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);
}

function restoreOptions() {
    var ddlClickType = document.getElementById("ddlClickType");
    var ddlKey = document.getElementById("ddlKey");

    var clickType = localStorage["click_type"];
    var controlKey = localStorage["control_key"];

    if (!clickType) {
        clickType = '2';
    }
    if (!controlKey) {
        controlKey = 'alt';
    }

    for (var i = 0; i < ddlClickType.children.length; i++) {
        var child = ddlClickType.children[i];
        if (child.value == clickType) {
            child.selected = "true";
            break;
        }
    }

    for (i = 0; i < ddlKey.children.length; i++) {
        child = ddlKey.children[i];
        if (child.value == controlKey) {
            child.selected = "true";
            break;
        }
    }
}
document.addEventListener('DOMContentLoaded', init);
document.querySelector('#btnSave').addEventListener('click', saveOptions);