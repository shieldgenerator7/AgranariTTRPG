"use strict";

//2024-03-03: copied from https://stackoverflow.com/a/56607553/2336212
export function UploadFromFilePicker(filetype, readAsText = true, callback = (result, filename) => { }) {
    var el = document.createElement("INPUT");
    el.type = "file";
    el.accept = filetype; //"image/*"; "text/*"
    // el.multiple = "multiple"; // remove to have a single file selection

    // (cancel will not trigger 'change')
    el.addEventListener('change', () => {
        // access el.files[] to do something with it (test its length!)

        // add first image, if available
        if (el.files.length) {
            let file = el.files[0];
            UploadFile(file, readAsText, callback);
        }
    });

    el.click(); // open
}

export function UploadFile(file, readAsText = true, callback = (result, filename) => { }) {
    //2024-03-14: copied from RoomLayout
    let reader = new FileReader();
    if (readAsText) {
        reader.readAsText(file);
    }
    else {
        reader.readAsDataURL(file);
    }
    reader.onloadend = (progressEvent) => {
        callback(progressEvent.currentTarget.result, file.name);
    };
}
