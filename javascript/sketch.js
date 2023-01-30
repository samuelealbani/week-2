/*
Title: RoomLights (responsive)
Date: 22/11/2022
Author: Samuele Albani
*/


let positions = [],
  sizes = [],
  rotations = [],
  numFloors = [],
  randomRoomPositions = [],
  randomRoomSizes = [],
  randomRoomBrightness = [],
  numColumns = [],
  randomNumColumns = [],
  numBuildings = 10;

let columnsOffset;
let columnsWidth;

let lastPosX = 0;

let interval = 60;
let lastTimer = 0;


let canvas;
let button;
let slider;

let changeColor = 0;



function setup() {

  console.log(windowWidth);
  if (windowWidth < 600) {
    canvas = createCanvas(windowWidth, windowWidth);
  } else {
    canvas = createCanvas(600, 600, WEBGL);
  }

  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  createEasyCam();
  document.oncontextmenu = () => false;
  rectMode(CENTER);

  addGUI();

  for (let i = 0; i < numBuildings; i++) {
    
    let buildingWidth = random(60, 200);
    let buildingHeight = random(70, 500);
    let buildingDepth = random(50, 200);
    numFloors.push(random(2, 10));
    numColumns.push(createVector(int(random(3, 6)), int(random(4, 15))));

    let buildingSize = createVector(buildingWidth, buildingDepth, buildingHeight);

    sizes.push(buildingSize);
  }
  for(let i = 0; i < numColumns; i++){
    for(let j = 0; j < numColumns[i].x * numColumns[i].y; j++){
      randomNumColumns.push(random(1));
    }
  }

  createNewRooms();
  
  for (let i = 0; i < numBuildings; i++) {
    if (i != 0) {
      lastPosX += (sizes[i].x / 2);
    }
    positions.push(createVector(lastPosX, 0, 0));
    lastPosX += sizes[i].x / 2;
  }
  columnsOffset = random(10, 20);

}

function draw() {
  background(0);
  noStroke();

  let pos = createVector(0, 0, 0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  pointLight(150, 150, 150, locX, locY, 100);

  // ** put your code below this **/
  for (let i = 0; i < numBuildings; i++) {
    drawBuilding(positions[i], sizes[i], numFloors[i], numColumns[i], i);
  }
  if(changeColor && frameCount % interval == 0){
    createNewRooms();
  }

}

function addGUI()
{
  //add a slider
  slider = createSlider(0, 255, 100);
  slider.addClass("slider");
  //Add the slider to the parent gui HTML element
  slider.parent("gui-container");

  //add a button
  if(changeColor == 0)
  {
      button = createButton("Play");
  }else if(changeColor == 1){
      button = createButton("Stop");
  }

  button.addClass("button");

  //Add the play button to the parent gui HTML element
  button.parent("gui-container");
  
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 

}

function handleButtonPress()
{
    
  if(changeColor < 1)
  {
    changeColor++;
  }else{
    changeColor = 0;
  }

  if(changeColor == 0)
  {
      button.html("Play");
  }else if(changeColor == 1){
      button.html("Stop");
  }
}

function windowResized() {

  if (windowWidth < 600) {
    resizeCanvas(windowWidth, windowWidth);
  } else if (canvas.width != 600) {
    resizeCanvas(600, 600);
  }
}

function createNewRooms(){

  randomRoomPositions = [];
  randomRoomSizes = [];
  randomRoomBrightness = [];
  for(let i = 0; i < numBuildings; i++){ // for each building
    let thisBuildigFloorsPositions = [];
    let thisBuildigFloorsSizes = [];
    let thisBuildigFloorsBrightness = [];
    for(let j = 0; j < numFloors[i]; j++){
      let thisRoomPos =createVector(random(-1,1),random(-1,1)) ;
      let thisRoomSize =createVector(random(0.1,1),random(0.1,1)) ;
      let thisRoomBrightness = random(1);
      thisBuildigFloorsPositions.push(thisRoomPos);
      thisBuildigFloorsSizes.push(thisRoomSize);
      thisBuildigFloorsBrightness.push(thisRoomBrightness);
    }
    
    randomRoomPositions.push(thisBuildigFloorsPositions);
    randomRoomSizes.push(thisBuildigFloorsSizes);
    randomRoomBrightness.push(thisBuildigFloorsBrightness);
  }
}

function drawBuilding(_px, _sz, _nf, _nc, indexBuild) {
  push();
  translate(_px.x, _px.y, _px.z + _sz.z / 2);
  pop();
  drawFloors(_px, _sz, _nf, indexBuild);
  specularMaterial(250);
  drawColumns(_px, _sz, _nc);
}

function drawColumns(_px, _sz, num){
  let offsetX = _sz.x/num.x;
  let offsetY = _sz.y/num.y;
  let startX = _px.x - (offsetX*(num.x-1))/2;
  let startY = _px.y - (offsetY*(num.y-1))/2;
  for(let i = 0; i < num.x; i++){
    for(let j = 0; j < num.y; j++){
      push();
      translate(startX + offsetX*i,startY + offsetY*j,  _px.z + _sz.z / 2);
      box(2, 2, _sz.z);
      pop();
    }
  }
}

function drawFloors(_px, _sz, num, i){
  let offset = _sz.z / num;
  for(let j = 0; j < num; j++){
    push();
    translate(_px.x, _px.y, offset*j);

    // room
    push();
    translate(randomRoomPositions[i][j].x*((randomRoomSizes[i][j].x *_sz.x)/2-(randomRoomSizes[i][j].x *_sz.x)/4), 
              randomRoomPositions[i][j].y*((randomRoomSizes[i][j].y *_sz.y)/2-(randomRoomSizes[i][j].y *_sz.y)/4), offset/2);
    colorMode(HSB);  
    //const hue = map()
    emissiveMaterial(slider.value(), 255, randomRoomBrightness[i][j] * 255);
        
/*     emissiveMaterial(randomRoomBrightness[i][j] * 255, randomRoomBrightness[i][j] * 255, 0);
 */    
    box(randomRoomSizes[i][j].x *_sz.x/2 , randomRoomSizes[i][j].y*_sz.y/2, offset);
    pop();
    
    // floors
    box(_sz.x, _sz.y, 2);
    pop();
  }
}