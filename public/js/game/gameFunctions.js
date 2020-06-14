
//devoile une case
function showTile(idTile){
    $("#gamePage #tile-"+idTile).removeClass('fog');
}

//cache une case
function hideTile(idTile){
    $("#gamePage #tile-"+idTile).addClass('fog');
}

//place un hero sur la case
function addHeroToTile(idTile,hero){
    $("#gamePage #tile-"+idTile).append(
        `<span class="content">
            <img src="/images/icon/${hero}.png" alt="${hero}" class="iconAvatar ${hero}">
        </span>`
    );
    showTile(idTile);
}

//place un monstre sur la case
function addMonsterToTile(idTile,monster){
    $("#gamePage #tile-"+idTile).append(
        `<span class="content">
            <img src="/images/icon/${monster}.png" alt="${monster}" class="iconMonster ${monster}">
        </span>`
    );
    showTile(idTile);
}

//place un mobilier sur la case
function addMobilierToTile(stuff){
    let fileName = stuff.rotat==1? stuff.type+"-R90":stuff.type; 
    if(stuff.direction){
        fileName = stuff.type+"-"+stuff.direction;
    }   
    
    for(let i=0; i<stuff.lg;i++){
        for(let j=0; j<stuff.ht;j++){
            let idTile = (parseInt(stuff.xPos)+i)+'-'+(parseInt(stuff.yPos)+j);   
            let hidden = i || j > 0 ? "hidden":""; 

            $("#gamePage #tile-"+idTile).append(
                `<span class="content">
                    <img src="/images/mobilier/${fileName}.png" alt="${stuff.type}" class="iconMoilier ${fileName}" data-ht="${stuff.ht}" data-lg="${stuff.lg}" ${hidden}>
                </span>`
            );        
            showTile(idTile);
        }
    }
}

//place les 4 heros aleatoirement dans les coins du plateau
function placeHeroInCorners(){
    let heros = ["Magicien","Naim","Elf", "Barbare"];
    let corners = ["0-0","25-18","25-0", "0-18"];
    for(let i=0; i<4; i++){
        let randId = Math.floor(Math.random() * heros.length)
        let hero = heros[randId];
        heros.splice(randId,1)       
        addHeroToTile(corners[i],hero)
    }
}

//remplie la carte avec le fichier xml correspondant
function hydrateMap(etage=1, mode="classique"){
    $.ajax({
        type: "GET",
        url: "/quests/"+mode+"_"+etage+".xml",
        dataType: "xml",
        success: mapXmlParser,
        error: function(err){
            alert("cette map ne contient pas de xml")
        }
    });  
    
    function mapXmlParser(xml){        
        placeHeroInCorners();
        let monsters    = $(xml).find("monstres").children();
        let mobiliers   = $(xml).find("mobiliers").children();
        let elements    = $(xml).find("elements").children();

        for( let monster of monsters){
            let type = $(monster)[0].localName;
            let xPos = $(monster).find("x").text();
            let yPos = $(monster).find("y").text();
            addMonsterToTile(xPos+'-'+yPos,type)
        }

        for( let mobilier of mobiliers){
            let stuff = {
                type: $(mobilier)[0].localName,
                xPos: $(mobilier).find("x").text(),
                yPos: $(mobilier).find("y").text(),                
                rotat: $(mobilier).find("rotation").text(),
                ht: $(mobilier).find("ht").text(),
                lg: $(mobilier).find("lg").text(),
            }        
            addMobilierToTile(stuff)
        }

        for( let element of elements){
            let elem = {
                type: $(element)[0].localName,
                xPos: $(element).find("x").text(),
                yPos: $(element).find("y").text(),                
                rotat: $(element).find("rotation").text(),
                ht: $(element).find("ht").text(),
                lg: $(element).find("lg").text(),
                direction: $(element).find("direction").text(),
            }        
            addMobilierToTile(elem)
        }
    }
}

hydrateMap();