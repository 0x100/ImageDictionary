function showOptions() {
    console.log("showOptions");
}

function closePopup() {
    console.log("closePopup");
}

function init() {
    console.log("init...");

    document.getElementById('btnOptions').addEventListener('click', showOptions);
    document.getElementById('btnUpdate').addEventListener('click', pasteSelection);
    document.getElementById('btnClose').addEventListener('click', closePopup);

    console.log("initialized");
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});

function pasteSelection() {
    console.log("pasteSelection");
    chrome.tabs.query({'active': true,'currentWindow':true},function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {method: "getSelection"}, function (response) {
            var text = document.getElementById('imagesPanel');
            text.innerHTML = response.data;
            console.log('callback: ' + JSON.stringify(response));
        });
    });
}
