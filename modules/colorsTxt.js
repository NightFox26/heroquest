//pour avoir des message en couleur dans la console du serveur
const chalk = require('chalk');
const configInit = require("../config/configInit");

exports.errorTxt = (txt)=>{console.log(chalk.red(txt))};
exports.warningTxt = (txt)=>{console.log(chalk.yellow(txt))};
exports.infoTxt = (txt)=>{console.log(chalk.blueBright(txt))};
exports.successTxt = (txt)=>{console.log(chalk.green(txt))};
exports.astriaTxt = (txt)=>{console.log(chalk.yellow(configInit.IA_name+" : "+txt))};