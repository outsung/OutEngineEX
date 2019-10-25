//------------------------------------------------------------------------------ define
//--------------------------------------------------------------------------HTML
let hBuffer = document.getElementById("buffer");
let hTool = document.getElementsByClassName("tool");

// material = Rock, Wood, Metal, BouncyBall, SuperBall, Pillow, Static
let userMaterial = "SuperBall";
let userMaterialList = {
  Rock : 0,
  Wood : 1,
  Metal : 2,
  BouncyBall : 3,
  SuperBall : 4,
  Pillow : 5,
  Static : 6
}
hTool[userMaterialList[userMaterial]].style.backgroundColor = "#788BFF";





//-----------------------------------------------------------------mouse
// F = add ,del ,catch, enter, break;
//

let mouse = {
  x : 0,
  y : 0
};

// 기본 우클릭 기능 중지
document.addEventListener('contextmenu', function() {
  event.preventDefault();
});


hBuffer.addEventListener('mousemove', function(event){
  //console.log("x : " + event.movementX + ", y : " + event.movementY);
  //mapRotate(event.movementX);
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
  //console.log(player.direction);
});


// Buffer 우클릭 시
hBuffer.addEventListener('mousedown', function(event){
  if ((event.button == 2) || (event.which == 3)) {


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
});

// Buffer 클릭 시
hBuffer.addEventListener('click', function(event){

  let c = new circle(random(10.0,30.0));
  let indexB = Scene.add(c, mouse.x, mouse.y);
  // 기본
  Scene.bodies[indexB].material = userMaterial;
  Scene.bodies[indexB].initialize();
});

for(let i = 0; i < 7; i++){
  //클릭
  hTool[i].addEventListener('click', function(event){
    // material = Rock, Wood, Metal, BouncyBall, SuperBall, Pillow, Static
    hTool[userMaterialList[userMaterial]].style.backgroundColor = "#FFA585";
    switch (i) {
      case 0:
        console.log("0");
        userMaterial = "Rock";
        break;
      case 1:
        console.log("1");
        userMaterial = "Wood";
        break;
      case 2:
        console.log("2");
        userMaterial = "Metal";
        break;
      case 3:
        console.log("3");
        userMaterial = "BouncyBall";
        break;
      case 4:
        console.log("4");
        userMaterial = "SuperBall";
        break;
      case 5:
        console.log("5");
        userMaterial = "Pillow";
        break;
      case 6:
        console.log("6");
        userMaterial = "Static";
        break;
    }
    hTool[i].style.backgroundColor = "#788BFF";
  });

}



// 휠
/*
hUserscreen.addEventListener('mousewheel', function(delta){
  let hCanvas1 = document.getElementsByTagName("canvas")[0];
  let hCanvas2 = document.getElementsByTagName("canvas")[1];
  if(delta.wheelDelta >= 0){
    camera.scale += 0.05;
    if(camera.scale >= 5.0)
      camera.scale = 5.0;
    hCanvas1.style.transform = "scale(" + camera.scale + ")";
    hCanvas2.style.transform = "scale(" + camera.scale + ")";

  }
  else{
    camera.scale -= 0.05;
    if(camera.scale <= 0.1)
      camera.scale = 0.1;
    hCanvas1.style.transform = "scale(" + camera.scale + ")";
    hCanvas2.style.transform = "scale(" + camera.scale + ")";
  }
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



//------------------------------------------------------------------------buffer
let buffers = {
  0 : document.getElementById("buffer1"),
  1 : document.getElementById("buffer2")
}

let drawingBuffer = 0;

let ctx = buffers[drawingBuffer].getContext("2d");

function bufferInit(){
  buffers[drawingBuffer].width = 800;
  buffers[drawingBuffer].height = 600;
  bufferFlip();
  buffers[drawingBuffer].width = 800;
  buffers[drawingBuffer].height = 600;
}

function bufferFlip(){

  buffers[1-drawingBuffer].style.visibility = 'hidden';
  buffers[drawingBuffer].style.visibility = 'visible';

  drawingBuffer = 1 - drawingBuffer;

  ctx = buffers[drawingBuffer].getContext("2d");

  ctx.clearRect(0, 0, 800, 600);
}


//-------------------------------------------------------------------------Scene

document.getElementById("log").innerHTML = "Material : " + userMaterial;

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


  ctx.strokeStyle = canvasColor(200, 0, 0, 0.5);

  for(let i = 0; i < size(this.contacts); ++i){
    //Manifold& m = this.contacts[i];
    for(let j = 0; j < this.contacts[i].contact_count; ++j){
      let c = new vector2(this.contacts[i].contacts[j].x,
                          this.contacts[i].contacts[j].y);
      ctx.beginPath();
      canvasDot(c.x, c.y, 3);
      ctx.closePath();
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
    ctx.stroke();
  }


}



//------------------------------------------------------------------------------ define

bufferInit();
