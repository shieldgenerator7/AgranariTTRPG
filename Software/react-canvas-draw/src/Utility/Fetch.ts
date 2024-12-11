"use strict";

export function fetchFile  (url: string, callBack: (text: string) => void) {
    //2023-05-19: copied from https://stackoverflow.com/a/39758157/2336212
    fetch(url).then(function (response) {
        response.text().then(function (text) {
            callBack(text);
        });
    });
};
