const Letter     = require("../Letter");
const servFunc   = require("../../modules/functionServer");
const heroMng = require("./HeroMng")

let connection  = servFunc.getBdd();

function getLetterById(id,callBack){    
    connection.query('SELECT * FROM letters WHERE id= ?',[id], function (err, letter) {
        if (err) throw err; 
        var letter = letter[0];
        heroMng.getHeroById(letter.for_hero_id,(for_hero)=>{
            heroMng.getHeroById(letter.from_hero_id,(from_hero)=>{                
                callBack(hydrateLetter(letter,for_hero,from_hero));
            })
        }) 
    });    
}

function countNotRead(idHero,callBack){    
    connection.query('SELECT COUNT(id) AS nb FROM letters WHERE for_hero_id= ? AND readed =0',[idHero], function (err, letter) {
        if (err) throw err;
        callBack(letter[0].nb);          
    });    
}

function getAllLetterByHero(idHero,callBack){    
    connection.query('SELECT * FROM letters WHERE for_hero_id= ? ORDER BY id DESC',[idHero], function (err, letters) {
        if (err) throw err; 
        var allLetters = [];
        if(letters.length > 0){
            heroMng.getHeroById(letters[0].for_hero_id,(for_hero)=>{
                for(let letter of letters){   
                    heroMng.getHeroById(letter.from_hero_id,(from_hero)=>{                
                        allLetters.push(callBack(hydrateLetter(letter,for_hero,from_hero)));
                    })
                }
                callBack(allLetters)
            })
        }        
    });    
}

function setReadedLetter(idLetter,cb){
    connection.query('UPDATE letters SET readed = 1 WHERE id= ?',[idLetter], function (err, letter) {
        if (err) throw err;
        cb(letter)
    })
}

function addLetter(from_heroId,for_heroId,letter){
    connection.query('INSERT INTO letters (`title`, `content`, `date`, `for_hero_id`, `from_hero_id`) VALUES ( ?,?,NOW(),?,? )',[letter.title,letter.content,for_heroId,from_heroId], function (err, letter) {
        if (err) throw err;        
    })
}

function deleteLetterById(idLetter,cb){
    connection.query('DELETE FROM letters WHERE id= ?',[idLetter], function (err, letter) {
        if (err) throw err;
        cb(letter)
    })
}


function hydrateLetter(cols,for_hero=null,from_hero=null){
    let letter = new Letter();    
    for(attrib in cols){        
        let setter = "set"+attrib.charAt(0).toUpperCase() + attrib.slice(1); 
        // console.log(setter)       
        letter[setter](cols[attrib]);
    }
    letter.setFor_hero(for_hero);
    letter.setFrom_hero(from_hero);
    return letter;    
}



module.exports = {
    getLetterById,
    getAllLetterByHero,
    countNotRead,
    setReadedLetter,
    deleteLetterById,    
    addLetter
}