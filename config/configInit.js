
//Mettre l'ip local de son pc
exports.hostname    = '192.168.1.19'; 

//A configurer en fonction de redirection NAT/PAT de son routeur
exports.port        = 3000; 

//siteweb a creer plus tard (url du lien se trouvant sur la page de connexion)
exports.urlWebSubscribe = "http://google.com"; 

/*************/
/*****BDD*****/
/*************/
exports.host    = "localhost";
exports.dbName  = "heroquest";
exports.user    = "root";
exports.pass    = "";
/**************/

exports.tyranModeUnlocked   = false;
exports.gdxModeUnlocked     = false;
exports.autoLogin           = true; // mettre a false en prod
exports.gameMode            = "classique";
exports.IA_name             = "Astria";