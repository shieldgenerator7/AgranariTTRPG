"use strict";

export function downloadFile(file, filename, type) {
    const json = JSON.stringify(file);

    const link = document.createElement('a');
    link.download = `${filename}.${type}`;

    //2024-03-17: copied from https://stackoverflow.com/a/30800715/2336212
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    // var dlAnchorElem = document.getElementById('downloadAnchorElem');
    // dlAnchorElem.setAttribute("href", dataStr);
    link.href = dataStr;
    // dlAnchorElem.setAttribute("download", "scene.json");
    // dlAnchorElem.click();
    link.click();
}