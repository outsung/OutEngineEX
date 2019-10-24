const ESC_KEY = 27;


let Scene = new scene(dt, 10);
let g_Clock = new clock();
let frameStepping = true;
let canStep = true;
let accumulator = 0;

main();

/*
function Mouse( int button, int state, int x, int y ){
  x /= 10.0f;
  y /= 10.0f;
  if(state == GLUT_DOWN)
    switch(button)
    {
    case GLUT_LEFT_BUTTON:
      {
        PolygonShape poly;
        uint32 count = (uint32)Random( 3, MaxPolyVertexCount );
        Vec2 *vertices = new Vec2[count];
        real e = Random( 5, 10 );
        for(uint32 i = 0; i < count; ++i)
          vertices[i].Set( Random( -e, e ), Random( -e, e ) );
        poly.Set( vertices, count );
        Body *b = scene.Add( &poly, x, y );
        b->SetOrient( Random( -PI, PI ) );
        b->restitution = 0.2f;
        b->dynamicFriction = 0.2f;
        b->staticFriction = 0.4f;
        delete [] vertices;
      }
      break;
    case GLUT_RIGHT_BUTTON:
      {
        Circle c( Random( 1.0f, 3.0f ) );
        Body *b = scene.Add( &c, x, y );
      }
      break;
    }
}
function Keyboard(unsigned char key, int x, int y){
  switch(key)
  {
  case ESC_KEY:
    exit( 0 );
    break;
  case 's':
    {
      //Circle c( 25.0f );
      //scene.Add( &c, 400 + (rand( ) % 250) * ((rand( ) % 2 == 1) ? 1 : -1), 50 );
      //OBB obb;
      //real e = Random( 10.0f, 35.0f );
      //obb.extents.Set( e, e );
      //Body *b = scene.Add( &obb, 400 + (rand( ) % 250) * ((rand( ) % 2 == 1) ? 1 : -1), 50 );
      //b->SetOrient( PI / 4.0f );
      //b->restitution = 0.2f;
      //b->dynamicFriction = 0.2f;
      //b->staticFriction = 0.4f;
    }
    break;
  case 'd':
    {
      //Circle c( 25.0f );
      //scene.Add( &c, 420, 50 );
    }
      break;
  case 'f':
    frameStepping = frameStepping ? false : true;
      break;
  case ' ':
    canStep = true;
    break;
  }
}
*/

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
  //glutInit(&argc, argv);
  //glutInitDisplayMode( GLUT_RGBA | GLUT_DOUBLE );
  //glutInitWindowSize( 800, 600 );
  //glutCreateWindow( "PhyEngine" );

  //glutDisplayFunc( PhysicsLoop );

  //glutKeyboardFunc( Keyboard );
  //glutMouseFunc( Mouse );
  //glutIdleFunc( PhysicsLoop );

  //glMatrixMode( GL_PROJECTION );
  //glPushMatrix( );
  //glLoadIdentity( );
  //gluOrtho2D( 0, 80, 60, 0 );
  //glMatrixMode( GL_MODELVIEW );
  //glPushMatrix( );
  //glLoadIdentity( );

  let c = new circle(50.0);

  let indexB = Scene.add(c, 400, 300);
  Scene.bodies[indexB].setStatic();

  let poly = new polygonShape();
  poly.setBox(300.0, 50.0);

  indexB = Scene.add(poly, 400, 500);
  Scene.bodies[indexB].setStatic();
  Scene.bodies[indexB].setOrient(0);

  //Scene.add(new circle(random(10.0,30.0)) ,500 , 500);

  //srand( 1 );

  let hPhysicsLoop = setInterval(PhysicsLoop,30);

  return 0;
}
