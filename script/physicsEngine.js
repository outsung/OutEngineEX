//------------------------------------------------------------------------------ math

function assert(bool){
  if(bool == false)
    throw new Error("error!");
}

const PI =  3.141592741;
const EPSILON = 0.0001;
const FLT_MAX = Number.MAX_VALUE;


//-----------------------------------------------------------------------vector2
let vector2 = function(x,y){
  this.x = x;
  this.y = y;
}

// 대입
vector2.prototype.set = function(x,y){
  this.x = x;
  this.y = y;
};

// 길이 반환
vector2.prototype.length = function(){
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

vector2.prototype.lengthXX2 = function(){
  return (this.x * this.x + this.y * this.y);
};

// 평준화
vector2.prototype.normalized = function(){
  let len = this.length();
  if(len > EPSILON){
    let invLen = 1 / len;
    this.x *= invLen;
    this.y *= invLen;
  }
};
// 회전
vector2.prototype.rotate = function(radians){
  let c = Math.cos(radians);
  let s = Math.sin(radians);

  this.x = this.x * c - this.y * s;
  this.y = this.x * s - this.y * c;

};

// 곱셈
vector2.prototype.multiplication = function(scalar){
  return new vector2(this.x * scalar, this.x * scalar);
};

//----------------------------------------------------------------------matrix22
let matrix22 = function(m00,m01,m10,m11){
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
};

// 라디안값으로 대입
matrix22.prototype.setR = function(radians){
  let c = Math.cos(radians);
  let s = Math.sin(radians);

  this.m00 = c; this.m01 = -s;
  this.m10 = s; this.m11 = c;
};
// 값으로 대입
matrix22.prototype.setN = function(m00,m01,m10,m11){
  this.m00 = m00; this.m01 = m01;
  this.m10 = m10; this.m11 = m11;
};
// 행렬로 대입
matrix22.prototype.setN = function(m){
  this.m00 = m.m00; this.m01 = m.m01;
  this.m10 = m.m10; this.m11 = m.m11;
};

// 절대값
matrix22.prototype.abs = function(){
  return new matrix22(Math.abs(this.m00),Math.abs(this.m01),
                      Math.abs(this.m10),Math.abs(this.m11));
};


matrix22.prototype.axisX = function(){
  return new vector2(this.m00,this.m10);
};
matrix22.prototype.axisY = function(){
  return new vector2(this.m01,this.m11);
};

// 역행렬
matrix22.prototype.transpose = function(){
  return new matrix22(this.m00,this.m10,this.m01,this.m11);
};

// 곱셈
matrix22.prototype.multiplicationV = function(vec){
  return new vector2(this.m00 * vec.x + this.m01 * vec.y,
                    this.m10 * vec.x + this.m11 * vec.y);
};

matrix22.prototype.multiplicationM = function(mat){
  return new matrix22(
    this.m00 * mat.m00 + this.m01 * mat.m10,
    this.m00 * mat.m01 + this.m01 * mat.m11,
    this.m10 * mat.m00 + this.m11 * mat.m10,
    this.m10 * mat.m01 + this.m11 * mat.m11);
};


//----------------------------------------------------------------------function
function minVV(vec1, vec2){
  return new vector2( Math.min( vec1.x, vec2.x ),
                      Math.min( vec1.y, vec2.y ));
}
function maxVV(vec1, vec2){
  return new vector2( Math.max( vec1.x, vec2.x ),
                      Math.max( vec1.y, vec2.y ));
}

// 내적
function dotVV(vec1, vec2){
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

// 두벡터의 길이
function distsqrVV(vec1, vec2){
  let c = new vector2(vec1.x - vec2.x, vec1.y - vec2.y);
  return dotVV(c, c);
}

// 외적
function crossVS(vec, scalar){
  return new vector2(scalar * vec.y, -scalar * vec.x);
}
function crossSV(scalar, vec){
  return new vector2(-scalar * vec.y, scalar * vec.x);
}
function crossVV(vec1, vec2){
  return (vec1.x * vec2.y - vec1.y * vec2.x);
}

function equal(a, b){
  return Math.abs(a - b) <= EPSILON;
}

function sqr(a){
  return a * a;
}

function clamp(min, max, a){
  if(a < min) return min;
  if(a > max) return max;
  return a;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function biasGreaterThan(a, b){
  return a >= (b * 0.95 + a * 0.01);
}

function size(a){
  return Object.keys(a).length;
}

//--------------------------------------------------------------------------init
const material = {
  Rock : {
    density : 0.12,
    restitution : 0.1,
    r : 84, g : 84, b : 84 // 어두운 회색
  },
  Wood : {
    density : 0.06,
    restitution : 0.2,
    r : 255, g : 111, b : 28 //주황
  },
  Metal : {
    density : 0.24,
    restitution : 0.05,
    r : 156, g : 156, b : 156 // 회색
  },
  BouncyBall : {
    density : 0.06,
    restitution : 0.8,
    r : 119, g : 255, b : 91
  },
  SuperBall : {
    density : 0.06,
    restitution : 0.995,
    r : 1, g : 65, b : 255
  },
  Pillow : {
    density : 0.2,
    restitution : 0.2,
    r : 122, g : 155, b : 148
  },
  Static : {
    density : 0.0,
    restitution : 0.4,
    r : 100, g : 205, b : 255
  }
};
const gravityScale = 7.5;
const gravity = new vector2(0, 10.0 * gravityScale);
const dt = 1.0 / 60.0;
//------------------------------------------------------------------------------ clock
let clock = function(){
  this.m_start = performance.now();
  this.m_stop = performance.now();
  this.m_current = performance.now();
}


// 소멸자
clock.prototype.del = function(){

};
// 시작
clock.prototype.start = function(){
  this.m_start = performance.now();
};
clock.prototype.stop = function(){
  this.m_stop = performance.now();
};

// 이전 start call 에서 현제시간 계산
clock.prototype.elapsed = function(){
  this.m_current = performance.now();
  return this.m_current - this.m_start;
};

clock.prototype.difference = function(){
  return this.m_stop - this.m_start;
};
clock.prototype.current = function(){
  this.m_current = performance.now();
  return performance.now();
};

//------------------------------------------------------------------------------ render


//------------------------------------------------------------------------------ shape

let shape = function(){}
shape.prototype.type = "eCount";
shape.prototype.clone = function(){};
shape.prototype.initialize = function(){};
shape.prototype.computeMass = function(density){};
shape.prototype.setOrient = function(radians){};
shape.prototype.draw = function(){};
shape.prototype.getType = function(){};
shape.prototype.body = new Object;
shape.prototype.radius = 0;



//------------------------------------------------------------------------circle
function circle(r){
  this.radius = r;
  this.type = "eCircle";
}

circle.prototype = Object.create(shape.prototype);
circle.prototype.constructor = circle;


circle.prototype.clone = function(){
  return new circle( this.radius );
};
circle.prototype.initialize = function(){
  let density = material[this.body.material].density;
  this.body.restitution = material[this.body.material].restitution;

  this.body.r = material[this.body.material].r;
  this.body.g = material[this.body.material].g;
  this.body.b = material[this.body.material].b;

  this.computeMass(density);
};
circle.prototype.computeMass = function(density){

  this.body.m = PI * (this.radius * this.radius) * density;
  this.body.im = (this.body.m) ? (1.0 / this.body.m) : 0.0;
  this.body.I = this.body.m * (this.radius * this.radius);
  this.body.iI = (this.body.I) ? (1.0 / this.body.I) : 0.0;
};
circle.prototype.setOrient = function(radians){};
circle.prototype.draw = function(){};
circle.prototype.getType = function(){
  return this.type;
}

//------------------------------------------------------------------polygonShape
function polygonShape(){
  this.type = "ePoly";
  this.MaxPolyVertexCount = 64;
  this.m_vertexCount = 0;
  this.m_vertices = new Array;
  this.m_normals = new Array;
  this.u = new matrix22(0,0,0,0);
}

polygonShape.prototype = Object.create(shape.prototype);
polygonShape.prototype.constructor = polygonShape;

polygonShape.prototype.initialize = function(){
  let density = material[this.body.material].density;
  this.body.restitution = material[this.body.material].restitution;

  this.body.r = material[this.body.material].r;
  this.body.g = material[this.body.material].g;
  this.body.b = material[this.body.material].b;

  this.computeMass(density);
};
polygonShape.prototype.clone = function(){
  let poly = new polygonShape();
  poly.u = this.u;
  for(let i = 0; i < this.m_vertexCount; ++i){
    poly.m_vertices[i] = this.m_vertices[i];
    poly.m_normals[i] = this.m_normals[i];
  }
  poly.m_vertexCount = this.m_vertexCount;
  return poly;
};

//중심 및 관성 계산 밀도로
polygonShape.prototype.computeMass = function(density){
  //중심
  let c = new vector2(0.0, 0.0);
  let area = 0.0;
  let I = 0.0;

  const k_inv3 = 1.0 / 3.0;

  //중심 설정
  for(let i1 = 0; i1 < this.m_vertexCount; ++i1){

    let p1 = new vector2(this.m_vertices[i1].x, this.m_vertices[i1].y);

    let i2 = ( (i1 + 1) < this.m_vertexCount) ? (i1 + 1) : 0;

    let p2 = new vector2(this.m_vertices[i2].x, this.m_vertices[i2].y);

    let D = crossVV(p1, p2);
    let triangleArea = 0.5 * D;

    area += triangleArea;

    c.x += triangleArea * k_inv3 * (p1.x + p2.x);
    c.y += triangleArea * k_inv3 * (p1.y + p2.y);

    let intx2 = (p1.x * p1.x) + (p2.x * p1.x) + (p2.x * p2.x);
    let inty2 = (p1.y * p1.y) + (p2.y * p1.y) + (p2.y * p2.y);
    I += (0.25 * k_inv3 * D) * (intx2 + inty2);

  }

  c.x *= (1.0 / area);
  c.y *= (1.0 / area);

  //모든 점을 중심을 기준으로 바꾸기
  for(let i = 0; i < this.m_vertexCount; ++i){
    this.m_vertices[i].x -= c.x;
    this.m_vertices[i].y -= c.y;
  }
  this.body.m = density * area;
  this.body.im = (this.body.m) ? (1.0 /this.body.m) : 0.0;
  this.body.I = I * density;
  this.body.iI = (this.body.I) ? (1.0 / this.body.I) : 0.0;
};

polygonShape.prototype.setOrient = function(radians){
   this.u.setR(radians);
};
polygonShape.prototype.draw = function(){};
polygonShape.prototype.getType = function(){
  return this.type;
};
// 넓이의 절반 = hw, 높이의 절반 = hh
polygonShape.prototype.setBox = function(hw, hh){
  this.m_vertexCount = 4;
  this.m_vertices[0] = new vector2(-hw, -hh);
  this.m_vertices[1] = new vector2( hw, -hh);
  this.m_vertices[2] = new vector2( hw,  hh);
  this.m_vertices[3] = new vector2(-hw,  hh);
  this.m_normals[0] = new vector2( 0.0, -1.0);
  this.m_normals[1] = new vector2( 1.0,  0.0);
  this.m_normals[2] = new vector2( 0.0,  1.0);
  this.m_normals[3] = new vector2(-1.0,  0.0);
};
polygonShape.prototype.set = function(vertices, count){
  assert((count > 2) && (count <= this.MaxPolyVertexCount));
  count = Math.min(Math.floor(count), this.MaxPolyVertexCount);
  //console
  // 가장 오른쪽 위치 점 찾기
  let rightMost = 0;
  let highestXCoord = vertices[0].x;
  for(let i = 0; i < count; ++i){

    let x = vertices[i].x;

    if(x > highestXCoord){
      highestXCoord = x;
      rightMost = i;
    }
    else if(x == highestXCoord){
      // x가 같으면 y가 더 낮은 점
      if(vertices[i].y < vertices[rightMost].y){
        rightMost = i;
      }
    }
  }

  let hull = {};
  let outCount = 0;
  let indexHull = rightMost;

  while(true){
    hull[outCount] = indexHull;

    // 물체의 꼭짓점을 시계반대방향으로 이어준다.
    let nextHullIndex = 0;
    for(let i = 1; i < Math.floor(count); ++i){
      //
      if(nextHullIndex == indexHull){
        nextHullIndex = i;
        continue;
      }

      //
      let e1 = new vector2(vertices[nextHullIndex].x - vertices[hull[outCount]].x,
                          vertices[nextHullIndex].y - vertices[hull[outCount]].y);
      let e2 = new vector2(vertices[i].x - vertices[hull[outCount]].x,
                          vertices[i].y - vertices[hull[outCount]].y);

      let c = crossVV(e1, e2);
      if(c < 0.0){
        nextHullIndex = i;
      }

      //
      if( (c == 0) && ( e2.lengthXX2() > e1.lengthXX2() ) ){
        nextHullIndex = i;
      }
    }

    ++outCount;
    indexHull = nextHullIndex;

    //처음 점으로 돌아왔을 때
    if(nextHullIndex == rightMost){
      this.m_vertexCount = outCount;
      break;
    }
  }

  // 계산한 꼭짓점을 도형으로 옮기기
  for(let i = 0; i < this.m_vertexCount; ++i){
    this.m_vertices[i] = vertices[hull[i]];
  }

  // 각 면 법선 계산
  for(let i1 = 0; i1 < this.m_vertexCount; ++i1){
    let i2 = (i1 + 1 < this.m_vertexCount) ? (i1 + 1) : 0;
    let face = new vector2(this.m_vertices[i2].x - this.m_vertices[i1].x,
                          this.m_vertices[i2].y - this.m_vertices[i1].y);

    assert(face.lengthXX2() > EPSILON * EPSILON);

    this.m_normals[i1] = new vector2(face.y, -face.x);
    this.m_normals[i1].normalized();

  }

};
polygonShape.prototype.getSupport = function(dir){
  let bestProjection = -FLT_MAX;
  let bestVertex = new vector2(0, 0);

  for(let i = 0; i < this.m_vertexCount; ++i){
    let v = new vector2(this.m_vertices[i].x, this.m_vertices[i].y);
    let projection = dotVV(v, dir);

    if(projection > bestProjection)
    {
      bestVertex.x = v.x;
      bestVertex.y = v.y;
      bestProjection = projection;
    }
  }

  return bestVertex;
};




//------------------------------------------------------------------------------ body
let body = function(shape, x, y){
  this.shape = shape.clone();

  this.shape.body = this;

  // 위치,속도
  this.position = new vector2(x, y);
  this.velocity = new vector2(0, 0);

  // 각속도, 토크, 각도
  this.angularVelocity = 0;
  this.torque = 0;
  this.orient = random(-PI, PI);

  // 힘
  this.force = new vector2(0, 0);

  //관성
  this.I = 0.0;
  this.iI = 0.0;
  //질량
  this.m = 0.0;
  this.im = 0.0;
  // 재질
  this.material = "Rock";

  // 정적마찰,동적마찰
  this.staticFriction = 0.8;
  this.dynamicFriction = 0.5;
  this.restitution = 0.05;


  // 색깔
  this.r = random(50, 200);
  this.g = random(50, 200);
  this.b = random(50, 200);
}

// 무게중심에 힘 적용
body.prototype.applyForce = function(f){
  this.force = new vector2(this.force.x + f.x,
                          this.force.y + f.y);
};

// 충격량 적용
body.prototype.applyImpulse = function(impulse, contactVector){
  //console.log(impulse);
  this.velocity = new vector2(this.velocity.x + this.im * impulse.x,
                              this.velocity.y + this.im * impulse.y);
  this.angularVelocity += this.iI * crossVV(contactVector, impulse);
  if(this.angularVelocity > 0){
    let qweqwrqrqer = 0;
  }
};

body.prototype.setStatic = function(){
  this.material = "Static";
  this.shape.initialize();
  this.I = 0.0;
  this.iI = 0.0;
  this.m = 0.0;
  this.im = 0.0;
};
body.prototype.initialize = function(){
  this.shape.initialize();
};

body.prototype.setOrient = function(radians){
  this.orient = radians;
  this.shape.setOrient(radians);
};

body.prototype.integrateForces = function(dt){

  //console.log(this.torque);
  if(this.im == 0.0){
    return;
  }
  //console.log(dt/2.0);
  this.velocity.set(this.velocity.x +
            (this.force.x * this.im + gravity.x) * (dt / 2.0),
                    this.velocity.y +
            (this.force.y * this.im + gravity.y) * (dt / 2.0));
  this.angularVelocity += this.torque * this.iI * (dt / 2.0);
  /*
  if(isNaN(this.angularVelocity)){
    let qweqwrqrqer = 0;
  }
  */
  //console.log(this.velocity.x);
}

body.prototype.integrateVelocity = function(dt){
  if(this.im == 0.0)
    return;

  this.position.x += this.velocity.x * dt;
  this.position.y += this.velocity.y * dt;

  this.orient += this.angularVelocity * dt;

  this.setOrient(this.orient);
  this.integrateForces(dt);
}

//------------------------------------------------------------------------------ manifold
let manifold = function(a, b){
  this.A = a;
  this.B = b;
  // 충돌량
  this.penetration = 0;
  // 충돌 방향
  this.normal = new vector2(0,0);
  this.contacts = {
    0 : new vector2(0,0),
    1 : new vector2(0,0)
  };
  this.contact_count = 0;
  this.e = 0;
  this.df = 0;
  this.sf = 0;
};

manifold.prototype.solve = function(){
  return Dispatch(this.A.shape.getType(), this.B.shape.getType(), this, this.A, this.B);
}

manifold.prototype.initialize = function(){
  this.e = Math.min(this.A.restitution, this.B.restitution);

  this.sf = Math.sqrt(this.A.staticFriction * this.A.staticFriction)
  this.df = Math.sqrt(this.A.dynamicFriction * this.A.dynamicFriction);

  let temp1 = 0;
  let temp2 = 0;
  for(let i = 0; i < this.contact_count; ++i){
    // Calculate radii from COM to contact
    let ra = new vector2(this.contacts[i].x - this.A.position.x,
                        this.contacts[i].y - this.A.position.y);
    let rb = new vector2(this.contacts[i].x - this.B.position.x,
                        this.contacts[i].y - this.B.position.y);

    temp1 = crossSV(this.B.angularVelocity, rb);
    temp2 = crossSV(this.A.angularVelocity, ra);
    let rv = new vector2(this.B.velocity.x + temp1.x - this.A.velocity.x - temp2.x,
                        this.B.velocity.y + temp1.y - this.A.velocity.y - temp2.y);

    temp1 = new vector2(dt * gravity.x, dt * gravity.y);
    if(rv.lengthXX2() < (temp1.lengthXX2() + EPSILON))
      this.e = 0.0;
  }
}

manifold.prototype.applyImpulse = function(){
  if(equal((this.A.im + this.B.im), 0)){
    this.InfiniteMassCorrection();
    return;
  }

  for(let i = 0; i < this.contact_count; ++i){
    // Calculate radii from COM to contact
    let ra = new vector2(this.contacts[i].x - this.A.position.x,
                        this.contacts[i].y - this.A.position.y);
    let rb = new vector2(this.contacts[i].x - this.B.position.x,
                        this.contacts[i].y - this.B.position.y);

    // Relative velocity
    let temp1 = crossSV(this.B.angularVelocity, rb);
    let temp2 = crossSV(this.A.angularVelocity, ra);
    let rv = new vector2(this.B.velocity.x + temp1.x - this.A.velocity.x - temp2.x,
                        this.B.velocity.y + temp1.y - this.A.velocity.y - temp2.y);

    // Relative velocity along the normal
    let contactVel = dotVV(rv, this.normal);

    // Do not resolve if velocities are separating
    if(contactVel > 0){
      return;
    }

    let raCrossN = crossVV(ra, this.normal);
    let rbCrossN = crossVV(rb, this.normal);
    let invMassSum = this.A.im + this.B.im +
                    sqr(raCrossN) * this.A.iI +
                    sqr(rbCrossN) * this.B.iI;

    // Calculate impulse scalar
    let j = -(1.0 + this.e) * contactVel;
    j /= invMassSum;
    j /= this.contact_count;

    // Apply impulse
    let impulse = new vector2(this.normal.x * j,
                              this.normal.y * j);
    this.A.applyImpulse(new vector2(-impulse.x, -impulse.y), ra);
    this.B.applyImpulse(impulse, rb);

    // Friction impulse
    temp1 = crossSV(this.B.angularVelocity, rb);
    temp2 = crossSV(this.A.angularVelocity, ra);
    rv.set(this.B.velocity.x + temp1.x - this.A.velocity.x - temp2.x,
          this.B.velocity.y + temp1.y - this.A.velocity.y - temp2.y);

    temp2 = dotVV(rv, this.normal);
    temp1.set(this.normal.x * temp2,
              this.normal.y * temp2);
    let t = new vector2(rv.x - temp1.x,
                        rv.y - temp1.y);
    t.normalized();

    let jt = -dotVV(rv, t);
    jt /= invMassSum;
    jt /= this.contact_count;

    // Don't apply tiny friction impulses
    if(equal(jt, 0.0)){
      return;
    }

    // Coulumb's law
    let tangentImpulse = new vector2(0,0);
    if(Math.abs(jt) < (j * this.sf))
      tangentImpulse.set(t.x * jt, t.y * jt);
    else{
      tangentImpulse.set(t.x * -j * this.df,
                        t.y * -j * this.df);
    }
    // Apply friction impulse
    this.A.applyImpulse(new vector2(-tangentImpulse.x, -tangentImpulse.y), ra);
    this.B.applyImpulse( tangentImpulse, rb);
  }

}

manifold.prototype.positionalCorrection = function(){
  const k_slop = 0.001; // Penetration 허용오차
  const percent = 0.4; // Penetration 관통 비율

  let temp = Math.max((this.penetration - k_slop), 0.0) / (this.A.im + this.B.im);

  let correction = new vector2(temp * this.normal.x * percent,
                              temp * this.normal.y * percent);

  this.A.position = new vector2(this.A.position.x - (correction.x * this.A.im),
                                this.A.position.y - (correction.y * this.A.im));

  this.B.position = new vector2(this.B.position.x + (correction.x * this.B.im),
                                this.B.position.y + (correction.y * this.B.im));

}

manifold.prototype.InfiniteMassCorrection = function(){
  this.A.velocity.set(0, 0);
  this.B.velocity.set(0, 0);
}


//------------------------------------------------------------------------------ collision

function Dispatch(typeA, typeB, m, A, B){
  let newM = new Object;
  if(typeA == "eCircle"){
    if(typeB == "eCircle")
      newM = CircletoCircle(m, A, B);
    else if(typeB == "ePoly")
      newM = CircletoPolygon(m, A, B);
  }
  else if(typeA == "ePoly"){
    if(typeB == "eCircle")
      newM = PolygontoCircle(m, A, B);
    else if(typeB == "ePoly")
      newM = PolygontoPolygon(m, A, B);
  }
  return newM;
}

// return m ------------------------------------------------------CircletoCircle
function CircletoCircle(m, a, b){
  let A = a.shape;
  let B = b.shape;

  // 법선 계산
  let normal = new vector2(b.position.x - a.position.x,
                          b.position.y - a.position.y);

  let dist_sqr = normal.lengthXX2();
  let radius = A.radius + B.radius;


  // 충돌 하지 않음
  if(dist_sqr >= (radius * radius)){
    m.contact_count = 0;
    return m;
  }

  let distance = Math.sqrt(dist_sqr);

  m.contact_count = 1;

  // 똑같이 곂칠 때
  if(distance == 0.0){
    m.penetration = A.radius;
    m.normal = new vector2(1.0, 0.0);
    m.contacts[0].x = a.position.x;
    m.contacts[0].y = a.position.y;
  }
  else{
    m.penetration = radius - distance;
    // 노말라이즈
    m.normal = new vector2(normal.x / distance,
                          normal.y / distance);

    m.contacts[0].x = m.normal.x * A.radius + a.position.x;
    m.contacts[0].y = m.normal.y * A.radius + a.position.y;
  }

  return m;
}

// return m -----------------------------------------------------CircletoPolygon
function CircletoPolygon(m, a, b){
  // circle
  let A = a.shape;
  //Polygon
  let B = b.shape;

  m.contact_count = 0;

  // Transform circle center to Polygon model space
  let center = new vector2(a.position.x, a.position.y);
  center = B.u.transpose().multiplicationV(new vector2(center.x - b.position.x,
                                                      center.y - b.position.y));

  // Find edge with minimum penetration
  // Exact concept as using support points in Polygon vs Polygon
  let separation = -FLT_MAX;
  let faceNormal = 0;
  for(let i = 0; i < B.m_vertexCount; ++i){
    let s = dotVV(B.m_normals[i], new vector2(center.x - B.m_vertices[i].x,
                                            center.y - B.m_vertices[i].y));

    if(s > A.radius)
      return m;

    if(s > separation){
      separation = s;
      faceNormal = i;
    }
  }

  // Grab face's vertices
  let v1 = new vector2(B.m_vertices[faceNormal].x, B.m_vertices[faceNormal].y);
  let i2 = (faceNormal + 1 < B.m_vertexCount) ? (faceNormal + 1) : 0;
  let v2 = new vector2(B.m_vertices[i2].x, B.m_vertices[i2].y);

  //중심이 다각형 안에 있는지 확인
  if(separation < EPSILON){
    //console.log("z");
    m.contact_count = 1;
    let temp = B.u.multiplicationV(B.m_normals[faceNormal]);
    m.normal = new vector2(-temp.x, -temp.y);

    m.contacts[0] = new vector2(m.normal.x * A.radius + a.position.x,
                                m.normal.y * A.radius + a.position.y);
    m.penetration = A.radius;
    return m;
  }

  // Determine which voronoi region of the edge center of circle lies within
  let dot1 = dotVV(new vector2(center.x - v1.x, center.y - v1.y),
                  new vector2(v2.x - v1.x, v2.y - v1.y));
  let dot2 = dotVV(new vector2(center.x - v2.x, center.y - v2.y),
                  new vector2(v1.x - v2.x, v1.y - v2.y));
  m.penetration = A.radius - separation;

  // Closest to v1
  if(dot1 <= 0.0){
    if(distsqrVV(center, v1) > (A.radius * A.radius))
      return m;

    m.contact_count = 1;
    let n = new vector2(v1.x - center.x, v1.y - center.y);
    n = B.u.multiplicationV(n);
    n.normalized();
    m.normal = n;
    let temp = B.u.multiplicationV(v1);
    v1.set(temp.x + b.position.x, temp.y + b.position.y);
    m.contacts[0] = v1;
  }
  else if(dot2 <= 0.0){ // Closest to v2
    if(distsqrVV(center, v2) > (A.radius * A.radius))
      return m;

    m.contact_count = 1;
    let n = new vector2(v2.x - center.x, v2.y - center.y);

    let temp = B.u.multiplicationV(v2);
    v2.set(temp.x + b.position.x, temp.y + b.position.y);

    m.contacts[0] = v2;
    n = B.u.multiplicationV(n);
    n.normalized();
    m.normal = n;
  }
  else{ // Closest to face
    let n = new vector2(B.m_normals[faceNormal].x,
                        B.m_normals[faceNormal].y);
    if(dotVV(new vector2(center.x - v1.x, center.y - v1.y), n) > A.radius)
      return m;

    n = B.u.multiplicationV(n);
    m.normal = new vector2(-n.x, -n.y);
    m.contacts[0] = new vector2(m.normal.x * A.radius + a.position.x,
                                m.normal.y * A.radius + a.position.y);
    m.contact_count = 1;
  }

  return m;
}

// return m------------------------------------------------------PolygontoCircle
function PolygontoCircle(m, a, b){
  m = CircletoPolygon(m, b, a);
  m.normal.set(-m.normal.x, -m.normal.y);
  return m;
}

// return faceIndex, bestDistance
function FindAxisLeastPenetration(A, B){
  // A, B = Polygon

  let bestDistance = -FLT_MAX;
  let bestIndex;

  for(let i = 0; i < A.m_vertexCount; ++i){
    // Retrieve a face normal from A
    let n = new vector2(A.m_normals[i].x, A.m_normals[i].y);
    let nw = A.u.multiplicationV(n);

    // Transform face normal into B's model space
    // 제댈됌
    let buT = B.u.transpose();
    n = buT.multiplicationV(nw);

    // Retrieve support point from B along -n
    let s = B.getSupport(new vector2(-n.x, -n.y));

    // Retrieve vertex on face from A, transform into
    // B's model space
    let v = new vector2(A.m_vertices[i].x, A.m_vertices[i].y);

    let temp = A.u.multiplicationV(v);

    v = new vector2(temp.x + A.body.position.x,
                    temp.y + A.body.position.y);

    v.set(v.x - B.body.position.x, v.y - B.body.position.y);
    v = buT.multiplicationV(v);

    // Compute penetration distance (in B's model space)
    let d = dotVV(n, new vector2(s.x - v.x, s.y - v.y));

    // Store greatest distance
    if(d > bestDistance){
      bestDistance = d;
      bestIndex = i;
    }
  }

  let faceIndex = bestIndex;
  return {0:faceIndex, 1:bestDistance};
}

// return v
function FindIncidentFace(v, RefPoly, IncPoly, referenceIndex){
  // Vec = v; PolygonShape = RefPoly,IncPoly; let = referenceIndex;
  let referenceNormal = new vector2(RefPoly.m_normals[referenceIndex].x,
                                    RefPoly.m_normals[referenceIndex].y);

  let temp = 0;
  // Calculate normal in incident's frame of reference
  temp = RefPoly.u.multiplicationV(referenceNormal);
  referenceNormal.set(temp.x, temp.y); // To world space
  temp = IncPoly.u.transpose().multiplicationV(referenceNormal);
  referenceNormal.set(temp.x, temp.y); // To incident's model space

  // Find most anti-normal face on incident polygon
  let incidentFace = 0;
  let minDot = FLT_MAX;
  for(let i = 0; i < IncPoly.m_vertexCount; ++i){
    let dot = dotVV(referenceNormal, IncPoly.m_normals[i]);
    if(dot < minDot){
      minDot = dot;
      incidentFace = i;
    }
  }

  // Assign face vertices for incidentFace
  temp = IncPoly.u.multiplicationV(IncPoly.m_vertices[incidentFace]);
  v[0].set(temp.x + IncPoly.body.position.x,
          temp.y + IncPoly.body.position.y);

  if( (incidentFace + 1) >= Math.floor(IncPoly.m_vertexCount) ){
    incidentFace = 0;
  }
  else{
    incidentFace = incidentFace + 1;
  }

  temp = IncPoly.u.multiplicationV(IncPoly.m_vertices[incidentFace]);
  v[1].set(temp.x + IncPoly.body.position.x,
          temp.y + IncPoly.body.position.y);

  return v;
}

// return sp, face
function Clip(n, c, face){
  let sp = 0;
  let out = {
    0 : face[0],
    1 : face[1]
  };

  // Retrieve distances from each endpoint to the line
  // d = ax + by - c
  let d1 = dotVV(n, face[0]) - c;
  let d2 = dotVV(n, face[1]) - c;

  // If negative (behind plane) clip
  if(d1 <= 0.0) out[sp++] = face[0];
  if(d2 <= 0.0) out[sp++] = face[1];

  // If the points are on different sides of the plane
  if(d1 * d2 < 0.0){ // less than to ignore -0.0f
    // Push interesection point
    let alpha = d1 / (d1 - d2);
    out[sp].x = face[0].x + alpha * (face[1].x - face[0].x);
    out[sp].y = face[0].y + alpha * (face[1].y - face[0].y);
    ++sp;
  }

  // Assign our new converted values
  face[0] = out[0];
  face[1] = out[1];

  assert(sp != 3);

  return {0:sp, 1:face};
}

// return m ----------------------------------------------------PolygontoPolygon
function PolygontoPolygon(m, a, b){
  // A,B = Polygon
  let A = a.shape;
  let B = b.shape;
  m.contact_count = 0;

  let temp = 0;
  // Check for a separating axis with A's face planes
  let faceA;

  temp = FindAxisLeastPenetration(A, B);
  faceA = temp[0];
  let penetrationA = temp[1];
  if(penetrationA >= 0.0){
    //console.log("0x");
    return m;
  }

  // Check for a separating axis with B's face planes
  let faceB;
  temp = FindAxisLeastPenetration(B, A);
  faceB = temp[0];
  let penetrationB = temp[1];
  if(penetrationB >= 0.0){
    //console.log("1x");
    return m;
  }
  let referenceIndex;
  let flip; // Always point from a to b

  let RefPoly; // Reference
  let IncPoly; // Incident

  // Determine which shape contains reference face
  if(biasGreaterThan(penetrationA, penetrationB)){
    RefPoly = a.shape;
    IncPoly = b.shape;
    referenceIndex = faceA;
    flip = false;
  }
  else{
    RefPoly = b.shape;
    IncPoly = a.shape;
    referenceIndex = faceB;
    flip = true;
  }

  // World space incident face
  let incidentFace = {
    0 : new vector2(0.0,0.0),
    1 : new vector2(0.0,0.0)
  };
  incidentFace = FindIncidentFace(incidentFace, RefPoly, IncPoly, referenceIndex);

  //        y
  //        ^  ->n       ^
  //      +---c ------posPlane--
  //  x < | i |\
  //      +---+ c-----negPlane--
  //             \       v
  //              r
  //
  //  r : reference face
  //  i : incident poly
  //  c : clipped point
  //  n : incident normal

  // Setup reference face vertices
  let v1 = new vector2(RefPoly.m_vertices[referenceIndex].x,
                      RefPoly.m_vertices[referenceIndex].y);

  if((referenceIndex + 1) == RefPoly.m_vertexCount){
    referenceIndex = 0;
  }
  else{
    referenceIndex = referenceIndex + 1;
  }

  let v2 = new vector2(RefPoly.m_vertices[referenceIndex].x,
                      RefPoly.m_vertices[referenceIndex].y);

  // Transform vertices to world space
  temp = RefPoly.u.multiplicationV(v1);
  v1.set(temp.x + RefPoly.body.position.x,
        temp.y + RefPoly.body.position.y);

  temp = RefPoly.u.multiplicationV(v2);
  v2.set(temp.x + RefPoly.body.position.x,
        temp.y + RefPoly.body.position.y);

  // Calculate reference face side normal in world space
  let sidePlaneNormal = new vector2(v2.x - v1.x,
                                    v2.y - v1.y);
  sidePlaneNormal.normalized();

  // Orthogonalize
  let refFaceNormal = new vector2(sidePlaneNormal.y, -sidePlaneNormal.x);

  // ax + by = c
  // c is distance from origin
  let refC    =  dotVV(  refFaceNormal, v1);
  let negSide = -dotVV(sidePlaneNormal, v1);
  let posSide =  dotVV(sidePlaneNormal, v2);

  // Clip incident face to reference face side planes
  temp = Clip(new vector2(-sidePlaneNormal.x, -sidePlaneNormal.y), negSide, incidentFace);
  incidentFace = temp[1];
  if(temp[0] < 2){
    //console.log("2x");
    return m; // Due to floating point error, possible to not have required points
  }
  temp = Clip(sidePlaneNormal, posSide, incidentFace);
  incidentFace = temp[1];
  if(temp[0] < 2){
    //console.log("3x");
    return m; // Due to floating point error, possible to not have required points
  }
  // Flip
  m.normal = flip ? new vector2(-refFaceNormal.x, -refFaceNormal.y) : refFaceNormal;

  // Keep points behind reference face
  let cp = 0; // clipped points behind reference face
  let separation = dotVV(refFaceNormal, incidentFace[0]) - refC;

  if(separation <= 0.0){
    m.contacts[cp] = incidentFace[0];
    m.penetration = -separation;
    ++cp;
  }
  else
    m.penetration = 0;

  separation = dotVV(refFaceNormal, incidentFace[1]) - refC;
  if(separation <= 0.0){
    m.contacts[cp] = incidentFace[1];
    m.penetration += -separation;
    ++cp;

    // Average penetration
    m.penetration /= cp;
  }

  //console.log(cp);
  m.contact_count = cp;

  return m;
}

function PolygontoPoint(a, b){
  A = a.shape;
  B = b;

  let center = new vector2(b.x, b.y);
  center = A.u.transpose().multiplicationV(new vector2(center.x - a.position.x,
                                                      center.y - a.position.y));

  let separation = -FLT_MAX;
  for(let i = 0; i < A.m_vertexCount; ++i){
    let s = dotVV(A.m_normals[i], new vector2(center.x - A.m_vertices[i].x,
                                            center.y - A.m_vertices[i].y));
    if(s > EPSILON){
      return false;
    }

    if(s > separation){
      separation = s;
    }
  }
  if(separation < EPSILON){
    return true;
  }

}

function CircletoPoint(a, b){
  A = a.shape;
  B = b;

  // 법선 계산
  let normal = new vector2(b.x - a.position.x,
                          b.y - a.position.y);

  let dist_sqr = normal.lengthXX2();
  let radius = A.radius;

  if(dist_sqr >= (radius * radius)){
    return false;
  }
  else{
    return true;
  }



}

//------------------------------------------------------------------------------ scene

let scene = function(dt, iterations){
  this.m_dt = dt;
  this.m_iterations = iterations;

  //this.count = 0;
  this.delete = [];

  this.bodies = {};

  this.contacts = {};
}

scene.prototype.step = function(){
  //console.log("z");
  //this.count++;
  this.contacts = {};

  // 매니폴드 생성
  for(let i = 0; i < size(this.bodies); ++i){
    let A = this.bodies[i];

    for(let j = i + 1; j < size(this.bodies); ++j){
      let B = this.bodies[j];
      if((A.im == 0) && (B.im == 0))
        continue;
      let m = new manifold(A, B);
      m = m.solve();
      if(m.contact_count){
        //console.log(m.contact_count);
        if( (m.A.shape.type == "ePoly") && (m.B.shape.type == "ePoly") ){
          let asdad = 123;
        }
        this.contacts[size(this.contacts)] = m;
      }
    }
  }

  // 힘 적용
  for(let i = 0; i < size(this.bodies); ++i){
    this.bodies[i].integrateForces(this.m_dt);
    /*
    if(i == 2){
    }
    */
  }

  // 초기화
  for(let i = 0; i < size(this.contacts); ++i){
    this.contacts[i].initialize();
  }

  // 충격량 적용
  for(let j = 0; j < this.m_iterations; ++j){
    for(let i = 0; i < size(this.contacts); ++i){
      this.contacts[i].applyImpulse();
    }
  }



  // 위치 보정
  for(let i = 0; i < size(this.contacts); ++i){
    //error
    this.contacts[i].positionalCorrection();
  }


  // 속도에 따라 위치 변경
  for(let i = 0; i < size(this.bodies); ++i){
    this.bodies[i].integrateVelocity(this.m_dt);
  }



  // Clear all forces
  for(let i = 0; i < size(this.bodies); ++i){
    this.bodies[i].force.set(0,0);
    this.bodies[i].torque = 0;
  }

  // bodies delete
  let temp = {};
  for(let i = 0; i < size(this.bodies); ++i){
    if(this.delete.indexOf(i) == -1){
      temp[size(temp)] = this.bodies[i];
    }
  }
  this.delete = [];
  this.bodies = temp;

}

scene.prototype.render = function(){};

scene.prototype.add = function(shape, x, y){
  assert(shape);
  let b = new body(shape, x, y);

  this.bodies[size(this.bodies)] = b;
  return size(this.bodies)-1;
}

scene.prototype.clear = function(){

  this.bodies = {};
  this.contacts = {};
  this.delete = [];
};



//------------------------------------------------------------------------------
