const configInit    = require("../../config/configInit");
const color         = require("../../modules/colorsTxt");
const servFunc      = require("../../modules/functionServer");

function getGameSocketController(io){    

    const io_game = io.of("/game")
    io_game.on('connection', (socket) => {
        color.infoTxt('Un utilisateur se connecte au plateau de jeu');

        socket.on('disconnect', (reason) => {
            color.errorTxt('un joueur quitte le plateau de jeu');
        });
    });
}

module.exports = {
    getGameSocketController
}