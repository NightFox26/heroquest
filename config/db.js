const configInit = require("./configInit");

module.exports = {
  host     : configInit.dbHost,
  user     : configInit.dbUser,
  password : configInit.dbPass,
  database : configInit.dbName
};