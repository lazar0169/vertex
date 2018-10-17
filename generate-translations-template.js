console.log('Generating...');

const fs = require('fs');
const {JSDOM} = require("jsdom");

let objects = merge(getFiles('objects'), true);
let views = fs.readdirSync('views');


let translations = {};
for (let view of views) {
    if (view.split('.')[1] !== 'html') continue;
    view = view.split('.')[0];

    let document = parseObjects(fs.readFileSync(`./views/${view}.html`, 'utf8'));

    let translatableElements = document.getElementsByClassName('element-multilanguage');
    for (let i = 0, length = translatableElements.length; i < length; i++) {
        let key = translatableElements[i].getAttribute('data-translation-key');
        if (key.indexOf('.') > -1) {
            let splitted = key.split('.');
            let property = splitted.pop();
            let currentProp = null;

            currentProp = translations;
            for (let j = 0, length = splitted.length; j < length; j++) {
                let prop = splitted[j];
                    if (currentProp[prop] === undefined) {
                        currentProp[prop] = {};
                    }
                    currentProp = currentProp[prop];
            }
            currentProp[property] = 'placeholder';
        }
        else {
            translations[key] = 'placeholder';
        }
    }
}

fs.writeFile('languages/template.json',JSON.stringify(translations,null,4),function(){
    console.log('Language template file generated - in /languages/template.json');
});

function parseObjects(html) {
    let document = new JSDOM(html).window.document;
    while (document.querySelectorAll('object').length !== 0) {
        for (let object of document.querySelectorAll('object')) {
            let objectName = object.dataset.object;
            object.insertAdjacentHTML('beforebegin', objects[objectName]);
            object.remove();
        }
    }
    return document;
}

function merge(dirArray, isObject = false) {
    let code = '', objects = {};
    for (let i = 0; i < dirArray.length; i++) {
        if (isObject) {
            let object = dirArray[i].split('/')[dirArray[i].split('/').length - 1].split('.')[0];
            objects[object] = fs.readFileSync(`${dirArray[i]}`, 'utf8').replace(/(\r\n|\n|\r)/gm, '');
        } else {
            code += fs.readFileSync(`${dirArray[i]}`, 'utf8') + '\r';
        }
    }
    if (isObject) code = objects;
    return code;
}

function getFiles(folder) {
    let array = fs.readdirSync(folder);
    array = array.map(path => `${folder}/${path}`);
    for (let file of array) {
        let stats = fs.statSync(file);
        if (stats.isDirectory()) {
            let files = getFiles(file);
            array = array.concat(files);
            array.splice(array.indexOf(file), 1);
        }
    }
    return array;
}
