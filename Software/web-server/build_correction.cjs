"use strict";

//2023-08-23: copied from https://stackoverflow.com/a/21255219/2336212

var fs = require('fs');

function readWriteSync() {

  var data = fs.readFileSync('build/index.html', 'utf-8');

  var newValue = data.replaceAll("=\"/assets", "=\"./assets");

  fs.writeFileSync('build/index.html', newValue, 'utf-8');

  console.log('readFileSync complete');
}

readWriteSync();
