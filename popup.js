function showOptions() {
    console.log("showOptions");
}

function closePopup() {
    console.log("closePopup");
}

function getSelectedText() {
    return window.getSelection().toString();
}

function loadImages() {
    console.log("loadImages");
    console.log(getSelectedText());
}

function doubleClickListener() {
    loadImages();
    console.log("double click");
}

function init() {
    console.log("init...");

    document.getElementById('btnOptions').addEventListener('click', showOptions);
    document.getElementById('btnUpdate').addEventListener('click', loadImages);
    document.getElementById('btnClose').addEventListener('click', closePopup);
    document.body.addEventListener('dblclick', doubleClickListener);

    console.log("initialized");
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});
