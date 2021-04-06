const chalk = require("chalk");

const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const sukses = chalk.keyword("green");
const log = console.log;
let nameOwner = "Rizqi a.k.a ZefianAlfian";
let whatsapp = "6289630171792";

exports.nameOwner = nameOwner;
exports.whatsapp = whatsapp;
exports.error = error;
exports.warning = warning;
exports.sukses = sukses;
exports.log = log;