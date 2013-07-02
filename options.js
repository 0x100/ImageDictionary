function onChangeLanguage() {
    window.close();
}

function onSave() {
    window.close();
}

function onClose() {
    window.close();
}

function init() {
    var ctrl = document.getElementById("language");
    ctrl.add(createOption("Russian", "ru_RU"));
}