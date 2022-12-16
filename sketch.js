let petStrings;
let guideWords;

let petImg = [];
let zapButton = [];
let byeButton = [];

let species = [];
let ids = [];
let names = [];
let lastZapped = [];

let nameArchive = [];
let nameArchiveP;
let archiveDiv;

function preload() {

    petStrings = loadJSON("./pets.json");
    guideWords = loadJSON("./guide-words.json");
}

function setup() {

    // clearStorage();

    nameArchive = getItem("nameArchive");
    if (nameArchive == null) nameArchive = [];

    species = getItem("species");
    ids = getItem("ids");
    names = getItem("names");
    lastZapped = getItem("lastZapped");

    if (species == null) {
        species = [];
        ids = [];
        names = [];
        lastZapped = [-1, -1, -1, -1, -1, -1];

        for (let i = 0; i < 5; i++) {
            resetPet(i);
        }
    }

    for (let i = 0; i < 5; i++) {
        setupHTML(i);
        setupButtons(i);
    }

    frameRate(1);
}

function draw() {

    for (let i = 0; i < 5; i++) {
        setupHTML(i);
    }
}

function setupHTML(i) {

    petImg[i] = select("#pet" + i);

    setImg(petImg[i], ids[i]);

    if (select("#name" + i).value() == "") {
        select("#name" + i).value(names[i]);
    }

    zapButton[i] = select("#zapButton" + i);
    zapButton[i].html("Zap " + names[i] + "!");

    byeButton[i] = select("#byeButton" + i);
    byeButton[i].html("Put " + names[i] + " up for adoption");

    if (getItem("lastZapped") != null && int(getItem("lastZapped")[i]/86400000) == int(new Date().getTime()/86400000)) {
        zapButton[i].html("Zap again tomorrow");
    }

    archiveDiv = select("#archive");
    if (nameArchive.length == 0) {
        archiveDiv.style("display", "none");
    } else {
        archiveDiv.style("display", "");
    }

    nameArchiveP = select("#nameArchive");
    nameArchiveP.html(nameArchive.join(", "));
}

function setupButtons(i) {

    zapButton[i].mousePressed(() => zapPet(i));
    byeButton[i].mousePressed(() => byePet(i));
}

function zapPet(i) {

    if (getItem("lastZapped") != null && int(getItem("lastZapped")[i]/86400000) == int(new Date().getTime()/86400000)) {
        return;
    }

    let randomId;

    if (random() < 0.03) {

        let newSpecies = random(petStrings.pets);

        while (species[i] == newSpecies) {
            newSpecies = random(petStrings.pets);
        }

        species[i] = newSpecies;
        randomId = species[i][int(random(0, 4))];

    } else {

        randomId = random(species[i].slice(4));

        while (ids[i] == randomId) {
            randomId = random(species[i].slice(4));
        }
    }

    ids[i] = randomId;

    setImg(petImg[i], ids[i]);

    setupHTML(i);

    lastZapped[i] = new Date().getTime();
    saveData();
}

function resetPet(i) {

    species[i] = random(petStrings.pets.slice(4));
    ids[i] = species[i][int(random(0, 4))];
    names[i] = getName();
    // lastZapped[i] = -1; // can't constantly disown and zap
    select("#name" + i).value(names[i]);
    saveData();

    setupHTML(i);
}

function byePet(i) {

    if (!confirm("Are you sure you want to say goodbye to " + names[i] + "?")) return;

    nameArchive.push(names[i]);
    resetPet(i);
}

function saveData() {

    storeItem("species", species);
    storeItem("ids", ids);
    storeItem("names", names);
    storeItem("lastZapped", lastZapped);
    storeItem("nameArchive", nameArchive);
}

function setImg(img, id) {

    let url = "https://pets.neopets.com/cp/" +id + "/1/7.png";
    img.attribute("src", url);
}


function getName() {

    const prefix = random(guideWords.words);
    const mid = random(guideWords.words)
    const suffix = random(guideWords.words);

    let name = [prefix, mid, suffix].join("");
    name = name.slice(0, random(4, 8));
    name = name.replace(/^\w/, (c) => c.toUpperCase());

    return name;
}

function keyPressed() {

    for (let i = 0; i < 5; i++) {
        names[i] = select("#name" + i).value();
        select("#name" + i).value(names[i]);
    }

    saveData();
}