

let keyCode = {
  27 : false, //esc

  87 : false, //w
  65 : false, //a
  83 : false, //s
  68 : false, //d

  84 : false, //t
}

let delay = {
  keyEsc : true,

  keyT : true,

  update : 10,
  attack : true
}




function keyPress(){
  if(gameplay === true){
    let down = event.keyCode;
    //console.log(down);

    if (down in keyCode){
      //console.log(down+"down");
      keyCode[down] = true;
    }
    else{
      event.returnValue = false; // 브라우저 기능 키 무효화
    }
    //console.log(keyCode);
  }
}

function keyUp(){
  if(gameplay === true){
    let up = event.keyCode;
    //console.log(upKeyCode);

    if (up in keyCode){
      //console.log(up+"up");
      keyCode[up] = false;
    }
    //console.log(keyCode);
  }
}

function isKeyDown(key){
  if(gameplay === true){
    if(typeof(key) === "string"){
      //toUpperCase(소문자 -> 대문자)
      key = key.toUpperCase();
      //charCodeAt(아스키코드로 변환)
      key = key.charCodeAt(0);
      return keyCode[key];
    }
    else return keyCode[key];
  }
}


function resize(){
  let hUserScreen = document.getElementById("userscreen");

  console.log('Resizing...')

  //userScreen.width = window.innerWidth;
  //userScreen.height = window.innerHeight;

  hUserScreen.style.width = window.innerWidth + "px";
  hUserScreen.style.height = window.innerHeight + "px";

  let hPlayer = document.getElementById("player");
  hPlayer.style.marginLeft = (window.innerWidth / 2) - (playerInfo.position.r) + "px";
  hPlayer.style.marginTop = (window.innerHeight / 2) - (playerInfo.position.r) + "px";
};


{

if(isKeyDown("i") && delay.keyI){
  delay.keyI = false;
  check.inventory = !check.inventory;
  console.log(check.inventory+"key");
  // key code reset
}
else if(!isKeyDown("i") && !delay.keyI){
  delay.keyI = true;
}

// esc
if(isKeyDown(27) && delay.keyEsc){
  delay.keyEsc = false;
  check.setting = !check.setting;
  // key code reset
}
else if(!isKeyDown(27) && !delay.keyEsc){
  delay.keyEsc = true;
}

if(isKeyDown("m") && delay.keyM){
  delay.keyM = false;
  //mapInfo.rule
  //CellularAutomata
  let aB = [false, false, false, false, false, false, false, false, false];
  let aS = [false, false, false, false, false, false, false, false, false];

  let fGetNeighbors = function(x,y){
    /*
    [1][0][1]
    [0][?][0]
    [0][1][0]
    */

    let vNeighbors = {
      alive : 0,
      dead : 0
    }

    for(let j = y - 1; j <= y + 1; j++)
    {
      for(let i = x-1; i <= x + 1; i++)
      {
        if(j === y && i === x) continue;
        else{
            if(map[j][i] != 0) vNeighbors.alive++;
            else vNeighbors.dead++;
        }
      }
    }

    //console.log(vNeighbors.dead + vNeighbors.alive);
    if(vNeighbors.dead + vNeighbors.alive !== 8) console.log("getNei.. error roop!!");
    else return vNeighbors;
  }

  let sRuleB = mapInfo.rule.split("/")[0].split("");
  let sRuleS = mapInfo.rule.split("/")[1].split("");

  //console.log(sRuleB);
  for(let i in sRuleB)
  {
      //console.log(sRuleB[i]);
      if(!isNaN(sRuleB[i] *= 1)) aB[sRuleB[i]] = true;
      else{
          //console.log("a");
          //if(sRuleB[i] !== "B"){
          //    console.log("fMapSellularAutomata-[B]error-!");
          //}
      }
  }
  //console.log(sRuleS);
  for(let i in sRuleS)
  {
      if(!isNaN(sRuleS[i] *= 1)) aS[sRuleS[i]] = true;
      else{
          if(sRuleS[i] === "S" ){
            console.log("error");
          }
          //if(sRuleS[i] !== "S"){
          //    console.log("fMapSellularAutomata-[S]error-!");
          //}
      }
  }

  //console.log(aB, aS);
  //start
  let i = 1;
  let vNeighbors = {};
  let tempMap = map;

  for(let j = 1; j < mapInfo.height + 1; j++){
    for(let i = 1; i < mapInfo.width + 1; i++){
      vNeighbors = fGetNeighbors(i,j);
      //console.log(vNeighbors);
      if(map[j][i] != 0){ // Alive
          if(aS[vNeighbors.alive] === true)
            tempMap[j][i] = 1;
          else tempMap[j][i] = 0;
      }
      else{ // Dead
          if(aB[vNeighbors.alive] === true){ // B
              tempMap[j][i] = 1;
          }
          else tempMap[j][i] = 0;
      }
    }
    //console.log(temp);
  }
  map = tempMap;

  check.mapChange = true;

}
else if(!isKeyDown("m") && !delay.keyM){
  delay.keyM = true;
}


if(isKeyDown("h") && delay.keyH){
  delay.keyH = false;

}
else if(!isKeyDown("h") && !delay.keyH){
  delay.keyH = true;
}


if(isKeyDown("n") && delay.keyN){
  delay.keyN = false;

  let x = getMapAlive();
  //console.log(x);
  let kMeans = kMeansClustering(mapInfo.placeCount, x);
  let r = kMeans[0];

  mapInfo.place = kMeans[1];

  console.log("placeCount : " + mapInfo.placeCount);
  //console.log(r);


  // x,y -> [j][i]
  for(let t = 0; t < r.length; t++){
    map[(x[t].y / mapInfo.blockSize - 0.5)]
      [(x[t].x / mapInfo.blockSize - 0.5)] = r[t] + 1;
  }

  check.kMeans = true;
  check.mapChange = true;
}
else if(!isKeyDown("n") && !delay.keyN){
  delay.keyN = true;
}


if(isKeyDown("t") && delay.keyT){
  delay.keyT = false;
  check.mapChange = true;
  check.kMeans = true;
  check.treeGrow = true;

  let temp = new Array;
  let x = new Array;
  let i = 0;
  let j = 0;

  // init tree !!!!
  if(object.tree.length === 0){
    x = getMapAlive();
    for(let t = 0; t < x.length; t++){
      i = x[t].x / mapInfo.blockSize - 0.5;
      j = x[t].y / mapInfo.blockSize - 0.5;
      if( (map[j][i] % blockInfo.count + 1) === 1){
        //console.log(map[j][i]);
        if(getRandomBool(objectInfo.tree.initV)){
          object.tree.push({
            x : getRandomInt(i * mapInfo.blockSize + 1,
                            (i+1) * mapInfo.blockSize),
            y : getRandomInt(j * mapInfo.blockSize + 1,
                            (j+1) * mapInfo.blockSize),
            intersect : false
          });
        }
      }
    }
    //console.log(object.tree.length);
  }
  else{ // tree grow
    //tree delete
    temp = new Array;
    for(let t = 0; t < object.tree.length; t++){
      i = Math.floor(object.tree[t].x / mapInfo.blockSize);
      j = Math.floor(object.tree[t].y / mapInfo.blockSize);
      if ( (map[j][i] % blockInfo.count + 1) === 1){
        temp.push(object.tree[t]);
      }
      else{
        continue;
      }
      /*
      if(map[j][i] === 1){
        t++;
      }
      else if((map[j][i] % blockInfo.count + 1) === 1){
        t++;
      }
      else{
        console.log("del");
        object.tree.splice(t,1);
        continue;
      }
      */

    }
    object.tree = temp;
  }

}
else if(!isKeyDown("t") && !delay.keyT){
  delay.keyT = true;
}




}




// mapDraw
if(check.mapChange){
  check.mapChange = false;


}
if(check.kMeans){
  check.kMeans = false;
}


if(check.treeGrow){
    check.treeGrow = false;


}
