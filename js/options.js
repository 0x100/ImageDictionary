function init() {

  document.title = chrome.i18n.getMessage("options_title");
  document.getElementById("lblKey").innerText = chrome.i18n.getMessage("key");
  document.getElementById("btnSave").value = chrome.i18n.getMessage("save");
  
  restoreOptions();
}

function saveOptions() {
  var ddlKey = document.getElementById("ddlKey");
  var controlKey = ddlKey.children[ddlKey.selectedIndex].value;
  localStorage["control_key"] = controlKey;
  
  var status = document.getElementById("status");
  status.innerHTML = chrome.i18n.getMessage("options_saved");
  setTimeout(function() { 
      status.innerHTML = ""; 
  }, 750);
}

function restoreOptions() {
  var controlKey = localStorage["control_key"];
  if (!controlKey) {
    return;
  }
  var ddlKey = document.getElementById("ddlKey");
  for (var i = 0; i < ddlKey.children.length; i++) {
    var child = ddlKey.children[i];
    if (child.value == controlKey) {
      child.selected = "true";
      break;
    }
  }
}
document.addEventListener('DOMContentLoaded', init);
document.querySelector('#btnSave').addEventListener('click', saveOptions);