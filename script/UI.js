//------------------------------------------------------------------------------ define
//--------------------------------------------------------------------------HTML
let hUserscreen = document.getElementById("userscreen");
let hBuffer = document.getElementById("buffer");

//let hScroll = document.getElementsByClassName("scroll")[0];

let ui = {
  inputCheck : true,
  scale : 100,

  tabmenu : {
    width : 0,
    height : 0,
    h : {
      material : {
          Rock : document.getElementsByClassName("Rock")[0],
          Wood : document.getElementsByClassName("Wood")[0],
          Metal : document.getElementsByClassName("Metal")[0],
          BouncyBall : document.getElementsByClassName("BouncyBall")[0],
          SuperBall : document.getElementsByClassName("SuperBall")[0],
          Pillow : document.getElementsByClassName("Pillow")[0],
          Static : document.getElementsByClassName("Static")[0]
      },
      add : {
        circle : document.getElementsByClassName("circle")[0],
        polygon : document.getElementsByClassName("polygon")[0]
      },
      del : {
        one : document.getElementsByClassName("one")[0],
        all : document.getElementsByClassName("all")[0]
      },
      catch : {
        one : document.getElementsByClassName("one")[1],
        connect : document.getElementsByClassName("connect")[0],
        quit : document.getElementsByClassName("quit")[0]
      },
      move : {
        basic : document.getElementsByClassName("basic")[0],
        reset : document.getElementsByClassName("reset")[0]
      }
    }
  },

  tabmenuCheck : false,
  hFilter : document.getElementById("filter"),

  hTabbutton : document.getElementsByClassName("uibutton")[3],
  hMouseR : document.getElementsByClassName("uibutton")[0],
  hMouseL : document.getElementsByClassName("uibutton")[1],
  hMaterial : document.getElementsByClassName("uibutton")[2],

  hTabmenu : document.getElementById("tabmenu"),
  hScroll : document.getElementById("scroll"),

}



let buffers = {
  0 : document.getElementById("buffer1"),
  1 : document.getElementById("buffer2")
}


//"title ? char ? play ?
//let check = "title";
let width = -1;
let height = -1;

function inputFocusOn(me){
  let parent = me.parentNode;
  //console.log(parent);
  let label = parent.childNodes[1];
  //console.log(parent.childNodes);
  label.style.opacity = 0.0;
}

function inputFocusOut(me){
  let parent = me.parentNode;
  //console.log(parent);
  let label = parent.childNodes[1];
  //console.log(parent.childNodes);
  if(me.value == ''){
    label.style.opacity = 1.0;
  }
}
function setBufferSize(){
  let hInput = document.getElementById("input");
  console.log("setBufferSize");


  let hTextbox = document.getElementById("textbox");
  let hInputWidth = document.getElementById("inputWidth").childNodes[3];
  let hInputHeight = document.getElementById("inputHeight").childNodes[3];

  //console.log(hInputWidth , hInputHeight);
  if(hInputWidth.value == "" || hInputHeight.value == ""){
    return 0;
  }
  width = clamp(300, 3000, hInputWidth.value);
  height = clamp(300, 3000, hInputHeight.value);

  //console.log(width, height);
  if(typeof width == "undefined" || typeof height == "undefined"){
    return 0;
  }

  camera.position.x = -(width - window.innerWidth) / 2,
  camera.position.y = -(height - window.innerHeight) / 2

  hInput.style.display = "none";

  ui.inputCheck = false;
  bufferInit();
  resize();
  main();
}



//console.log(width / 2 - window.innerWidth/2);

let camera = {
  position : {
    x : 0,
    y : 0
  },
  scale : 1.0,
  lineWidth : 1.0
}
//(window.innerHeight / 2) -
// material = Rock, Wood, Metal, BouncyBall, SuperBall, Pillow, Static
let userMaterial = "SuperBall";


function resize(){
  if(ui.inputCheck == true){
    let hInput = document.getElementById("input");
    let hTextbox = document.getElementById("textbox");
    //console.log(hInput.childNodes);
    let hH1 = hInput.childNodes[1];

    hInput.style.width = window.innerWidth + "px";
    hInput.style.height = window.innerHeight + "px";

    /*
    hTextbox.style.width = Math.floor(window.innerWidth / 2) + "px";
    hTextbox.style.height = Math.floor(window.innerHeight / 2) + "px";
    */

    hTextbox.style.marginLeft = Math.floor((window.innerWidth - 300) / 2) + "px";
    hTextbox.style.marginTop = Math.floor((window.innerHeight - 250) / 2) + "px";

    hH1.style.marginLeft = Math.floor((window.innerWidth - 300) / 2)+43 + "px";
    hH1.style.marginTop = Math.floor((window.innerHeight - 250) / 2) - 43 + "px";


  }
  //console.log('Resizing...')

  //userScreen.width = window.innerWidth;
  //userScreen.height = window.innerHeight;
  buffers[0].style.marginLeft = camera.position.x + "px";
  buffers[0].style.marginTop = camera.position.y + "px";

  buffers[1].style.marginLeft = camera.position.x + "px";
  buffers[1].style.marginTop = camera.position.y + "px";

  hBuffer.style.marginLeft = camera.position.x + "px";
  hBuffer.style.marginTop = camera.position.y + "px";

  hUserscreen.style.width = window.innerWidth + "px";
  hUserscreen.style.height = window.innerHeight + "px";


  // UI

  ui.hTabmenu.style.height = window.innerHeight + "px";
  ui.hTabmenu.style.width = Math.round(window.innerWidth / 4) + "px";

  ui.hTabmenu.style.marginLeft = ui.tabmenuCheck == true ?
                          window.innerWidth - Math.round(window.innerWidth / 4) + "px":
                          window.innerWidth + "px";



  ui.hScroll.style.height = window.innerHeight + "px";
  ui.hScroll.style.width = Math.round(window.innerWidth / 4) + 30 + "px";



  ui.hTabbutton.style.marginTop = Math.round((window.innerHeight - ui.scale) / 2) + "px";
  //console.log(ui.hTabmenu.style.width);
  ui.hTabbutton.style.marginLeft = ui.tabmenuCheck == true ?
        window.innerWidth - Math.round(window.innerWidth / 4) - ui.scale / 2 + "px":
        window.innerWidth - ui.scale / 2 + "px";

  ui.hMouseR.style.marginTop = Math.round(window.innerHeight / 8 * 7) + "px";
  ui.hMouseR.style.marginLeft = Math.round(window.innerWidth + ui.scale) / 2 + "px";

  ui.hMouseL.style.marginTop = Math.round(window.innerHeight / 8 * 7) + "px";
  ui.hMouseL.style.marginLeft = Math.round((window.innerWidth - ui.scale * 3) / 2) + "px";

  ui.hMaterial.style.marginTop = Math.round(window.innerHeight / 16 * 13) + "px";
  ui.hMaterial.style.marginLeft = Math.round((window.innerWidth - 80) / 2) + "px";

  ui.hFilter.style.width = window.innerWidth + "px";
  ui.hFilter.style.height = window.innerHeight + "px";


};



//------------------------------------------------------------------------buffer



let drawingBuffer = 0;

let ctx = buffers[drawingBuffer].getContext("2d");


function bufferInit(){
  hBuffer.style.width = width + "px";
  hBuffer.style.height = height + "px";

  buffers[drawingBuffer].width = width;
  buffers[drawingBuffer].height = height;
  bufferFlip();
  buffers[drawingBuffer].width = width;
  buffers[drawingBuffer].height = height;
}


function bufferFlip(){

  buffers[1-drawingBuffer].style.visibility = 'hidden';
  buffers[1-drawingBuffer].style.zIndex = 0;

  buffers[drawingBuffer].style.visibility = 'visible';
  buffers[drawingBuffer].style.zIndex = 1;

  drawingBuffer = 1 - drawingBuffer;

  ctx = buffers[drawingBuffer].getContext("2d");

  ctx.clearRect(0, 0, width, height);
}



//-------------------------------------------------------------------------Scene

//context.lineWidth = 15;
//document.getElementById("log").innerHTML = "Material : " + userMaterial;

function canvasColor(r,g,b,a){
  return "rgba("+ r +", "+ g +", "+ b +", "+ a +")";
}

function canvasDot(x,y,r){
  //console.log(x,y,r);
  ctx.arc(x, y, r, 0.5, PI * 3);
}

circle.prototype.draw = function(){
  //console.log("draw!");
  const k_segments = 20;

  // Render a circle with a bunch of lines
  ctx.strokeStyle = canvasColor(this.body.r, this.body.g, this.body.b, 1);
  ctx.beginPath();
  canvasDot(this.body.position.x, this.body.position.y, this.radius);
  ctx.closePath();
  ctx.lineWidth = camera.lineWidth;
  ctx.stroke();

  // Render line within circle so orientation is visible
  ctx.beginPath();
  let r = new vector2(0, 1.0);
  let c = Math.cos(this.body.orient);
  let s = Math.sin(this.body.orient);
  r.set(r.x * c - r.y * s, r.x * s + r.y * c);
  r.x *= this.radius; r.y *= this.radius;
  r.x += this.body.position.x; r.y += this.body.position.y;

  ctx.moveTo(this.body.position.x, this.body.position.y);
  ctx.lineTo(r.x, r.y);
  ctx.closePath();
  ctx.lineWidth = camera.lineWidth;
  ctx.stroke();
};
polygonShape.prototype.draw = function(){

  //console.log("draw! poly");

  ctx.strokeStyle = canvasColor(this.body.r, this.body.g, this.body.b, 1);
  ctx.beginPath();
  let startDot = new vector2(0,0);

  for(let i = 0; i < this.m_vertexCount; ++i){
    let temp = this.u.multiplicationV(this.m_vertices[i]);
    let v = new vector2(this.body.position.x + temp.x,
                        this.body.position.y + temp.y);
    //console.log(this.body.position.y+", "+temp.y);
    if(i == 0){
      startDot.set(v.x, v.y);
      ctx.moveTo(v.x, v.y);
    }
    else{
      ctx.lineTo(v.x, v.y);
    }

  }

  ctx.lineTo(startDot.x, startDot.y);
  ctx.closePath();
  ctx.lineWidth = camera.lineWidth;
  ctx.stroke();


  for(let i = 0; i < this.m_vertexCount; ++i){
    ctx.beginPath();
    let temp = this.u.multiplicationV(this.m_vertices[i]);
    let v = new vector2(this.body.position.x + temp.x,
                        this.body.position.y + temp.y);
    //console.log(this.body.position.y+", "+temp.y);
    if(i == 0){
      canvasDot(v.x, v.y, 3);
    }
    else{
      canvasDot(v.x, v.y, 2);
    }
    ctx.closePath();
    ctx.lineWidth = camera.lineWidth;
    ctx.stroke();

  }

}
scene.prototype.render = function(){
  //console.log("scene render")

  for(let i = 0; i < size(this.bodies); ++i){
    let b = this.bodies[i];
    //console.log("shape draw");
    b.shape.draw();
  }




  ctx.strokeStyle = canvasColor(255, 106, 183, 1);
  for(let i = 0; i < mouse.catch.length; ++i){
    ctx.beginPath();
    let j = mouse.catch[i];

    //console.log(this.bodies[j],mouse);
    ctx.moveTo(this.bodies[j].position.x, this.bodies[j].position.y);
    ctx.lineTo(mouse.x, mouse.y);

    ctx.closePath();
    ctx.lineWidth = camera.lineWidth;
    ctx.stroke();

  }




  ctx.strokeStyle = canvasColor(200, 0, 0, 0.5);

  for(let i = 0; i < size(this.contacts); ++i){
    //Manifold& m = this.contacts[i];
    for(let j = 0; j < this.contacts[i].contact_count; ++j){
      let c = new vector2(this.contacts[i].contacts[j].x,
                          this.contacts[i].contacts[j].y);
      ctx.beginPath();
      canvasDot(c.x, c.y, 3);
      ctx.closePath();
      ctx.lineWidth = camera.lineWidth;
      ctx.stroke();

    }
  }



  ctx.strokeStyle = canvasColor(0, 200, 0, 0.5);

  for(let i = 0; i < size(this.contacts); ++i){
    //Manifold& m = contacts[i];
    ctx.beginPath();
    let n = new vector2(this.contacts[i].normal.x,
                        this.contacts[i].normal.y);
    for(let j = 0; j < this.contacts[i].contact_count; ++j){

      let c = new vector2(this.contacts[i].contacts[j].x,
                          this.contacts[i].contacts[j].y);

      ctx.moveTo(c.x, c.y);
      n.x *= 4.5;
      n.y *= 4.5;
      c.x += n.x;
      c.y += n.y;
      ctx.lineTo(c.x, c.y);
    }

    ctx.closePath();
    ctx.lineWidth = camera.lineWidth;
    ctx.stroke();
  }


}



//------------------------------------------------------------------------------ init

//  bufferInit();
resize();


//------------------------------------------------------------------------------ main

let Scene = new scene(dt, 10);
let g_Clock = new clock();
let frameStepping = true;
let canStep = true;
let accumulator = 0;

//main();
//main();
function PhysicsLoop(){
  //glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

  //RenderString( 1, 2, "Left click to spawn a polygon" );
  //RenderString( 1, 4, "Right click to spawn a circle" );

  // Different time mechanisms for Linux and Windows
  accumulator = 0;
  accumulator += g_Clock.elapsed() / 10;


  g_Clock.start();
  //console.log(accumulator +",  "+dt);

  accumulator = clamp(0.00, 0.1, accumulator);
  while(accumulator >= dt){
    if(frameStepping)
      Scene.step();
    else{
      if(canStep){
        Scene.step();
        canStep = false;
      }
    }
    accumulator -= dt;
  }


  g_Clock.stop();

  Scene.render();

  bufferFlip();

}

function main(){

  let c = new circle(50.0);

  let indexB = Scene.add(c, width / 2, height / 2 - 100);
  Scene.bodies[indexB].setStatic();

  let poly = new polygonShape();
  poly.setBox(300.0, 50.0);

  indexB = Scene.add(poly, width / 2, height / 2 + 100);
  Scene.bodies[indexB].setStatic();
  Scene.bodies[indexB].setOrient(0);

  //Scene.add(new circle(random(10.0,30.0)) ,500 , 500);

  //srand( 1 );

  let hPhysicsLoop = setInterval(PhysicsLoop,30);

  return 0;
}



//------------------------------------------------------------------------- init

if(width !== -1 || height !== -1){
  let hInput = document.getElementById("input");

  camera.position.x = -(width - window.innerWidth) / 2,
  camera.position.y = -(height - window.innerHeight) / 2

  hInput.style.display = "none";

  ui.inputCheck = false;
  bufferInit();
  resize();
  main();
}



//-------------------------------------------------------------------------mouse
// F = add ,del ,catch, enter, break, move
//


//
let mouseFlist = {
  "add" : 0,
  "del" : 1,
  "catch" : 2,
  "enter" : 3,
  "break" : 4,
  "move" : 5
}

function getMouseSelect(mouseX, mouseY){
  for(let i = 0; i < size(Scene.bodies); ++i){
    let typeA = Scene.bodies[i].shape.getType();
    if(typeA == "ePoly"){
      if(PolygontoPoint(Scene.bodies[i], new vector2(mouseX, mouseY))){
        return i;
      }
    }
    else if(typeA == "eCircle"){
      if(CircletoPoint(Scene.bodies[i], new vector2(mouseX, mouseY))){
        return i;
      }
    }
  }
  return -1;
}

function catchMove(i){

  let mouseForce = new vector2(mouse.x - Scene.bodies[i].position.x,
                              mouse.y - Scene.bodies[i].position.y);

  let length = mouseForce.lengthXX2() / 10000;
  length = clamp(0.9, 3, length);

  mouseForce.x *= Scene.bodies[i].m;
  mouseForce.y *= Scene.bodies[i].m;
  if(length != 0.9){
    mouseForce.x *= length;
    mouseForce.y *= length;
  }
  //console.log(mouseForce);
  mouseForce.x -= Scene.bodies[i].m * gravity.x * 3;
  mouseForce.y -= Scene.bodies[i].m * gravity.y * 3;
  //console.log(gravity.y * gravity.y * 40);
  //console.log(Scene.bodies[i].m * 150);

  Scene.bodies[i].applyForce(mouseForce);
}


function mouseF(f1, f2){
  switch (f1) {

    case "add":
      switch (f2) {

        case "circle":
          return function(downANDup){
            if(downANDup == "down"){
              let c = new circle(random(10.0,30.0));
              let indexB = Scene.add(c, mouse.x, mouse.y);
              Scene.bodies[indexB].material = userMaterial;
              Scene.bodies[indexB].initialize();
            }
          };
          break;

        case "polygon":
          return function(downANDup){
            if(downANDup == "down"){
              let poly = new polygonShape();
              let count = random(3,64);

              let vertices = {};
              let e = random(50,100);

              for(let i = 0; i < count; ++i){
                vertices[i] = new vector2(random(-e, e), random(-e, e));
              }
              //console.log("A");
              poly.set(vertices, count);
              //console.log("B");
              let indexB = Scene.add(poly, mouse.x, mouse.y );
              Scene.bodies[indexB].setOrient(random(-PI,PI));
              Scene.bodies[indexB].material = userMaterial;
              Scene.bodies[indexB].initialize();
              Scene.bodies[indexB].dynamicFriction = 0.2;
              Scene.bodies[indexB].staticFriction = 0.4;
            }
          };
          break;

      }
      break;

    case "del":
      switch (f2) {

        case "one":
          return function(downANDup){
            if(downANDup == "down"){
              let i = getMouseSelect(mouse.x, mouse.y);
              if(i != -1){
                Scene.delete.push(i);
              }
            }
          };
          break;

        case "all":
          return function(downANDup){
            if(downANDup == "down"){
              Scene.clear();
            }
          };
          break;

      }
      break;

    case "catch":
      switch (f2) {

        case "one":
          return function(downANDup){
            if(downANDup == "down"){
              let i = getMouseSelect(mouse.x, mouse.y);
              if(i != -1){
                mouse.catch[0] = i;
                mouse.hCatch[0] = setInterval(function(){catchMove(i)}, 16);
              }
            }
            else{
              //console.log("quit");
              clearInterval(mouse.hCatch[0]);
              mouse.hCatch = [];
              mouse.catch = [];
            }
          };
          break;

        case "connect":
          return function(downANDup){
            if(downANDup == "down"){
              let i = getMouseSelect(mouse.x, mouse.y);
              if(i != -1){
                let cathIndex = mouse.catch.indexOf(i);
                if(cathIndex === -1){
                  mouse.catch.push(i);
                  mouse.hCatch.push(setInterval(function(){catchMove(i)}, 16));
                }
                else{
                  clearInterval(mouse.hCatch[cathIndex]);
                  mouse.catch.splice(cathIndex, 1);
                  mouse.hCatch.splice(cathIndex, 1);
                }
              }
            }
          };
          break;

        case "quit":
          return function(downANDup){
            if(downANDup == "down"){
              for(let i = 0; i < size(mouse.hCatch); ++i){
                clearInterval(mouse.hCatch[i]);
              }
              mouse.catch = [];
              mouse.hCatch = [];
            }
          }
          break;

      }
      break;

    case "move":
      switch (f2) {

        case "basic":
          return function(downANDup){
            if(downANDup == "down"){
              mouse.move = true;
            }
            else{
              mouse.move = false;
            }
          }
          break;

        case "reset":
          return function(downANDup){
            if(downANDup == "down"){
              if(mouse.move == false){
                camera.position.x = -(width - window.innerWidth) / 2;
                camera.position.y = -(height - window.innerHeight) / 2;
                resize();
              }
            }
          }
          break;

      }
      break;

  }
}

//
let mouse = {
  x : 0,
  y : 0,
  r : {
    f1 : "add",
    f2 : "circle"
  },
  l : {
    f1 : "add",
    f2 : "polygon"
  },

  Rfunc : mouseF("add", "circle"),
  Lfunc : mouseF("add", "polygon"),

  hCatch : [],
  catch : [],

  move : false
};





// 기본 우클릭 기능 중지
document.addEventListener('contextmenu', function(){
  event.preventDefault();
});


hBuffer.addEventListener('mousemove', function(event){
  //console.log("x : " + event.movementX + ", y : " + event.movementY);
  //mapRotate(event.movementX);
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;

  if(mouse.move){
    //console.log("move"+ Math.round(event.movementX));

    camera.position.x += Math.round(event.movementX);
    camera.position.y += Math.round(event.movementY);

    buffers[0].style.marginLeft = camera.position.x + "px";
    buffers[0].style.marginTop = camera.position.y + "px";

    buffers[1].style.marginLeft = camera.position.x + "px";
    buffers[1].style.marginTop = camera.position.y + "px";

    hBuffer.style.marginLeft = camera.position.x + "px";
    hBuffer.style.marginTop = camera.position.y + "px";
  }

  //console.log(player.direction);
});






// 마우스 다운
hBuffer.addEventListener('mousedown', function(event){
  // 우클릭시
  if((event.button == 2) || (event.which == 3)){
    //console.log(mouse.R);
    mouse.Rfunc("down");
  }
  else if((event.button == 0) || (event.which == 1)){

    mouse.Lfunc("down");
  }

});


// 마우스 업
hBuffer.addEventListener('mouseup', function(event){
  //우클릭시
  if((event.button == 2) || (event.which == 3)){
    mouse.Rfunc("up");
  }
  else if((event.button == 0) || (event.which == 1)){
    mouse.Lfunc("up");
  }

});


// canvas 넘어가고 마우스 up 할 때
hUserscreen.addEventListener('mouseup', function(event){
  if((event.button == 2) || (event.which == 3)){
    mouse.Rfunc("up");
  }
  else if((event.button == 0) || (event.which == 1)){
    mouse.Lfunc("up");
  }
});


// 탭 메뉴 버튼 눌렀을때
ui.hTabbutton.addEventListener('click', function(){
  // 메뉴 펼침
  if(ui.tabmenuCheck == false){
    //console.log(ui.hTabmenu.style.width);
    ui.tabmenuCheck = true;
    ui.hTabbutton.id = "tabmenubuttonOn";
    ui.hTabmenu.style.visibility = "visible";
    ui.hTabbutton.style.marginLeft =
        window.innerWidth - Math.round(window.innerWidth / 4) - ui.scale / 2 + "px";
    ui.hTabmenu.style.marginLeft = window.innerWidth - Math.round(window.innerWidth / 4) + "px";
    ui.hFilter.style.visibility = "visible";
  }
  else{
    //console.log("false" + window.innerWidth + "px");
    ui.tabmenuCheck = false;
    ui.hTabbutton.id = "tabmenubutton";
    ui.hTabmenu.style.visibility = "hidden";
    ui.hTabbutton.style.marginLeft = window.innerWidth - ui.scale / 2 + "px";
    ui.hTabmenu.style.marginLeft = window.innerWidth + "px";
    ui.hFilter.style.visibility = "hidden";
  }
});




// 마우스 R L 이미지 & 기능 바꾸기
function mouseRLChange(rAndl){
  //console.log("mouseRLChange");
  let hMouseRimg = ui.hMouseR.childNodes[1];
  let hMouseLimg = ui.hMouseL.childNodes[1];

  let hMaterialimg = ui.hMaterial.childNodes[1];
  //console.log(hMouseLimg);

  if(rAndl === "m"){
    let t = 0;
    let hButtonMove = setInterval(function(){
      if(t <= 8){
        if(t % 2 == 0){
          ui.hMaterial.style.left = (8 - t) + "px";
        }
        else{
          ui.hMaterial.style.left = -(8 - t) + "px";
        }
        t++;
      }
      else{
        clearInterval(hButtonMove);
      }

    },50);

    hMaterialimg.src = "https://outsung.github.io/OutEngineEX/image/" + userMaterial + ".png";
  }
  else if(rAndl === "r"){
    let t = 0;
    let hButtonMove = setInterval(function(){
      if(t <= 8){
        if(t % 2 == 0){
          ui.hMouseR.style.left = (8 - t) + "px";
        }
        else{
          ui.hMouseR.style.left = -(8 - t) + "px";
        }
        t++;
      }
      else{
        clearInterval(hButtonMove);
      }

    },50);

    hMouseRimg.src = "https://outsung.github.io/OutEngineEX/image/" + mouse.r.f1 + "_" + mouse.r.f2 + ".png";
    mouse.Rfunc = mouseF(mouse.r.f1, mouse.r.f2);
  }
  else{
    let t = 0;
    let hButtonMove = setInterval(function(){
      if(t <= 8){
        if(t % 2 == 0){
          ui.hMouseL.style.left = (8 - t) + "px";
        }
        else{
          ui.hMouseL.style.left = -(8 - t) + "px";
        }
        t++;
      }
      else{
        clearInterval(hButtonMove);
      }

    },50);

    hMouseLimg.src = "https://outsung.github.io/OutEngineEX/image/" + mouse.l.f1 + "_" + mouse.l.f2 + ".png";
    mouse.Lfunc = mouseF(mouse.l.f1, mouse.l.f2);
  }

  //console.log(mouse.r.f1 +"_"+ mouse.r.f2);

}


//console.log(ui.tabmenu.h);

// 탭 메뉴에 있는 요소 눌렀을때
for(let i = 0; i < size(Object.keys(ui.tabmenu.h)); ++i){
  let child = ui.tabmenu.h[Object.keys(ui.tabmenu.h)[i]];
  //console.log(child);
  for(let j = 0; j < size(Object.keys(child)); ++j){
    let button = child[Object.keys(child)[j]];
    //console.log(button);
    button.addEventListener('mousedown', function(){

      let t = 0;
      //흔들림 이벤트
      let hButtonMove = setInterval(function(){
        if(t <= 8){
          if(t % 2 == 0){
            button.style.left = (8 - t) + "px";
          }
          else{
            button.style.left = -(8 - t) + "px";
          }
          t++;
        }
        else{
          clearInterval(hButtonMove);
        }

      },50);

      let rAndl = "";

      //우클릭
      if((event.button == 2) || (event.which == 3)){
        //console.log("우클릭");
        if(Object.keys(ui.tabmenu.h)[i] == "material"){
          //console.log("material 클릭");
          userMaterial = Object.keys(child)[j];
          rAndl = "m";
        }
        else{
          mouse.r.f1 = Object.keys(ui.tabmenu.h)[i];
          mouse.r.f2 = Object.keys(child)[j];
          rAndl = "r";
        }
      }
      //좌클릭
      else if((event.button == 0) || (event.which == 1)){
        //console.log("좌클릭");
        if(Object.keys(ui.tabmenu.h)[i] == "material"){
          //console.log("material 클릭");
          userMaterial = Object.keys(child)[j];
          rAndl = "m";
          //console.log(userMaterial);
        }
        else{
          mouse.l.f1 = Object.keys(ui.tabmenu.h)[i];
          mouse.l.f2 = Object.keys(child)[j];
          rAndl = "l";
        }
      }

      mouseRLChange(rAndl);
    });
  }
}



// 휠

hUserscreen.addEventListener('mousewheel', function(delta){
  if(mouse.move == false){
    buffers[0].style.transformOrigin = camera.position.x + " " + camera.position.y;
    buffers[1].style.transformOrigin = camera.position.x + " " + camera.position.y;

    hBuffer.style.transformOrigin = camera.position.x + " " + camera.position.y;

    if(delta.wheelDelta >= 0){
      camera.scale += 0.05;
      if(camera.scale >= 2.5)
        camera.scale = 2.5;
    }
    else{
      camera.scale -= 0.05;
      if(camera.scale <= 0.1)
        camera.scale = 0.1;
    }

    buffers[0].style.transform = "scale(" + camera.scale + ")";
    buffers[1].style.transform = "scale(" + camera.scale + ")";
    hBuffer.style.transform = "scale(" + camera.scale + ")";

    camera.lineWidth = camera.scale * -12 + 11;
    camera.lineWidth = Math.max(1, camera.lineWidth);
    //console.log(camera.scale , camera.lineWidth);
  }
});

//캐릭터 휠
/*
hScroll.addEventListener('mousewheel', function(delta){
  console.log("mousewheel");
  delta = window.event || delta;
  delta.preventDefault();
  document.hScroll.scrollLeft -= (delta.wheelDelta || -delta.detail);
});

*/
//--------------------------------------------------------------ketbord



let keyCode = {
  27 : false, //esc

  87 : false, //w
  65 : false, //a
  83 : false, //s
  68 : false, //d

  84 : false, //t
}

function keyPress(){};
function keyUp(){};
