// node tools/script/makeLayer

require('app-module-path').addPath(__dirname + '/../../node_modules');
global._ = require('lodash');
let fs = require('fs');
let path = require('path');

function copyFileSync(source, target) {
    let targetFile = target;
    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source));
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    let files = [];
    // Check if folder needs to be created or integrated
    let targetFolder = path.join(target, path.basename(source));
    if (fs.existsSync(targetFolder) && fs.lstatSync(targetFolder).isDirectory()) {
        fs.rmdirSync(targetFolder, {recursive: true});
    }
    fs.mkdirSync(targetFolder, {recursive: true} );
    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function(file) {
            let curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        } );
    }
}

function makeLayer() {
  copyFolderRecursiveSync('./node_modules', './layer/nodejs');
}

makeLayer();
