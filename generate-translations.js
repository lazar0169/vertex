console.log('Generating...');
console.log('');

const fs = require('fs');
const {JSDOM} = require("jsdom");
const langFolder = "languages";
const translationFile = 'translations.json';

let objects = merge(getFiles('objects'), true);
let views = fs.readdirSync('views');


let languages = new Map();
languages.set('en', 'English');
languages.set('sr', 'Srpski');
languages.set('de', 'Deutsch');
languages.set('fr', 'Française');

let messagesTerms = [];

let existingTranslations = [];

//get keys from html
let translationKeys = {};
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

            currentProp = translationKeys;
            for (let j = 0, length = splitted.length; j < length; j++) {
                let prop = splitted[j];
                if (currentProp[prop] === undefined) {
                    currentProp[prop] = {};
                }
                currentProp = currentProp[prop];
            }
            currentProp[property] = '';
        }
        else {
            translationKeys[key] = '';
        }
    }
}

//napravi languages folder
if (!fs.existsSync(langFolder)) {
    fs.mkdirSync(`./${langFolder}`);
}
//check if directories exists, read
languages.forEach(function (v, langDirectory) {
    if (!fs.existsSync(`${langFolder}/${langDirectory}`)) {
        if (!fs.existsSync(`./${langFolder}/${langDirectory}`)) {
            fs.mkdirSync(`./${langFolder}/${langDirectory}`);
        }
        let trans = {};
        trans.labels = translationKeys;
        trans.messages = {};
        //create empty file
        fs.writeFile(`./${langFolder}/${langDirectory}/${translationFile}`, JSON.stringify(trans, null, 4), function () {
            console.log(`empty file for ${v} language has been created.`);
            console.log(``);
        });
    }
    else {
        let fileContent = fs.readFileSync(`./${langFolder}/${langDirectory}/${translationFile}`, 'utf8');
        let currentTrans = JSON.parse(fileContent);
        existingTranslations[langDirectory] = currentTrans;
        for (let term in currentTrans.messages) {
            if (messagesTerms.indexOf(term) < 0) {
                messagesTerms.push(term);
            }
        }
    }
});

//compare translations for each language

for (let language in existingTranslations) {
    let translations = existingTranslations[language];
    let labels = translations.labels;
    let messages = translations.messages;
    //check if translation exists
    mergeTranslations(labels, translationKeys);
    removeUnusedTranslations(labels, translationKeys);
    //populate all files with union of messages from all files
    for (let termIndex in messagesTerms) {
        let term = messagesTerms[termIndex];
        if (messages[term] === undefined) {
            translations.messages[term] = '';
            console.log(`term ${term} has been addded to the ${language} translation file.`);
            console.log('');
        }
    }
    fs.writeFile(`./${langFolder}/${language}/${translationFile}`, JSON.stringify(translations, null, 4), function () {
        console.log(`Translations file generated in ${langFolder}/${language}/${translationFile} `);
        console.log('');
    });

}

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

function mergeTranslations(translations, keys) {
    for (let key in keys) {
        try {
            // Property in destination object set; update its value.
            if (keys[key].constructor == Object) {
                translations[key] = mergeTranslations(translations[key], keys[key]);
            }
            else {
                let translation = translations[key];
                if (translation === undefined) {
                    translations[key] = '';
                }
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            translations[key] = '';
        }
    }

    return translations;
}
function removeUnusedTranslations(translations, keys) {
    for (let key in translations) {
        try {
            // Property in destination object set; update its value.
            if (translations[key].constructor == Object) {
                removeUnusedTranslations(translations[key], keys[key]);
            }
            else {
                let translation = keys[key];
                if (translation === undefined) {
                    delete translations[key];
                }
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            delete translations[key];
        }
    }
    return translations;
}