
//Mettre l'ip local de son pc
exports.hostname    = '192.168.1.19'; 

//A configurer en fonction de redirection NAT/PAT de son routeur
exports.port        = 3000; 

//siteweb a creer plus tard (url du lien se trouvant sur la page de connexion)
exports.urlWebSubscribe = "http://google.com"; 

/*************/
/*****BDD*****/
/*************/
exports.dbHost    = "localhost";
exports.dbName  = "heroquest";
exports.dbUser    = "root";
exports.dbPass    = "";
/**************/

exports.tyranModeUnlocked   = false;
exports.gdxModeUnlocked     = false;
exports.autoLogin           = false; // mettre a false en prod
exports.gameMode            = "classique";
exports.IA_name             = "Astria";