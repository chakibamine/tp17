const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Charger la définition Protobuf à partir du fichier .proto
const root = protobuf.loadSync('employee.proto');

// Récupérer le type "Employees" défini dans employee.proto
const EmployeeList = root.lookupType('Employees');

// Création d'une liste d'employés en mémoire
const employees = [];

employees.push({
  id: 1,
  name: 'Ali',
  salary: 9000
});

employees.push({
  id: 2,
  name: 'Kamal',
  salary: 22000
});

employees.push({
  id: 3,
  name: 'Amal',
  salary: 23000
});

employees.push({ id: 4, name: 'Fatima', salary: 12000 });

employees.push({ id: 5, name: 'Hassan', salary: 15000 });

employees.push({ id: 6, name: 'Sara', salary: 18000 });

employees.push({ id: 7, name: 'Omar', salary: 20000 });

employees.push({ id: 8, name: 'Nadia', salary: 9500 });

employees.push({ id: 9, name: 'Youssef', salary: 27000 });

employees.push({ id: 10, name: 'Laila', salary: 14000 });

employees.push({ id: 11, name: 'Rami', salary: 11000 });

employees.push({ id: 12, name: 'Maya', salary: 16000 });

employees.push({ id: 13, name: 'Ibrahim', salary: 21000 });

employees.push({ id: 14, name: 'Nour', salary: 12500 });

employees.push({ id: 15, name: 'Samir', salary: 23000 });

employees.push({ id: 16, name: 'Rania', salary: 19500 });

employees.push({ id: 17, name: 'Karim', salary: 17500 });

employees.push({ id: 18, name: 'Zeinab', salary: 13200 });

employees.push({ id: 19, name: 'Fouad', salary: 14500 });

employees.push({ id: 20, name: 'Amina', salary: 9800 });

let jsonObject = {
  employee: employees
};
// ---------- JSON : encodage ----------
console.time('JSON encode');
let jsonData = JSON.stringify(jsonObject);
console.timeEnd('JSON encode');

// ---------- JSON : décodage ----------
console.time('JSON decode');
let jsonDecoded = JSON.parse(jsonData);
console.timeEnd('JSON decode');



// Options pour la conversion JSON -> XML
const options = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};
// Conversion de l'objet JSON en XML// ---------- XML : encodage ----------
console.time('XML encode');
let xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";
console.timeEnd('XML encode');

// ---------- XML : décodage ----------
console.time('XML decode');
// Conversion XML -> JSON (texte) -> objet JS
let xmlJson = convert.xml2json(xmlData, { compact: true });
let xmlDecoded = JSON.parse(xmlJson);
console.timeEnd('XML decode');

// Encodage en Protobuf : vérification du schéma
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
  throw Error(errMsg);
}
// ---------- Protobuf : encodage ----------
console.time('Protobuf encode');
let message = EmployeeList.create(jsonObject);
let buffer = EmployeeList.encode(message).finish();
console.timeEnd('Protobuf encode');

// ---------- Protobuf : décodage ----------
console.time('Protobuf decode');
let decodedMessage = EmployeeList.decode(buffer);
// Optionnel : conversion vers objet JS "classique"
let protoDecoded = EmployeeList.toObject(decodedMessage);
console.timeEnd('Protobuf decode');
// Écriture des données dans les fichiers
fs.writeFileSync('data.json', jsonData);   // Fichier JSON
fs.writeFileSync('data.xml', xmlData);     // Fichier XML
fs.writeFileSync('data.proto', buffer);    // Fichier Protobuf binaire

// Récupération de la taille des fichiers (en octets)
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

// Affichage des tailles dans la console
console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto': ${protoFileSize} octets`);