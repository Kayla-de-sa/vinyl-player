let draggableImg;
let targetImg;
let draggablePos;
let targetPos;
let dragging = false;
let offsetX = 0;
let offsetY = 0;

let staticImg;
let vinylAspect = 1;

let popupImg;
let sideImg;

let dropSound;
let musicStopped = false;
let vinylSnapped = false;

let vinylVideo;
let videoAspect = 1;
let videoReady = false;

let vinylSize = 150;
const maxVinylSize = 300;

function preload() {
  draggableImg = loadImage("VinylDisk.png", img => {
    vinylAspect = img.width / img.height;
  });
  targetImg = loadImage("VinylAlbums.png");
  dropSound = loadSound('Forgotten.mp3');
  staticImg = loadImage("LinkinPark.jpg");
  popupImg = loadImage("popup.png");
  sideImg = loadImage("Instructions2.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  draggablePos = createVector(180, 150);
  targetPos = createVector(500, 365);

  dropSound.onended(() => {
    console.log("Sound finished");
  });

  vinylVideo = createVideo("lighter1.mp4", () => {
    // Store the true aspect ratio (width / height)
    videoAspect = vinylVideo.width / vinylVideo.height;
    videoReady = true;
  });
  vinylVideo.hide();
  vinylVideo.loop(); // This makes the video loop automatically
  
}

function draw() {
  background(255);

  // Static image on the right-hand side
  const imgWidth = 300;
  const imgHeight = 450;
  const x = width - imgWidth - 1; // left
  const y = 400; // down

  image(sideImg, x, y, imgWidth, imgHeight);

  // Draw vinyl player
  image(targetImg, targetPos.x, targetPos.y, 1000, 1000);

  // Gradually increase size while dragging
  if (dragging && vinylSize < maxVinylSize) {
    vinylSize += 2;
  }


  // Draw draggable vinyl
  let vinylWidth = vinylSize;
  let vinylHeight = vinylSize / vinylAspect;
  image(draggableImg, draggablePos.x, draggablePos.y, vinylWidth, vinylHeight);

  // STOP button
  const stopBtnX = targetPos.x + 180;
  const stopBtnY = targetPos.y + 305;

  fill(255, 0, 0);
  noStroke();
  circle(stopBtnX, stopBtnY, 30);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  text("STOP", stopBtnX, stopBtnY);

  // START button 
  const startBtnX = stopBtnX - 10; // move left
  const startBtnY = stopBtnY - 35;

  fill(0, 200, 0);
  noStroke();
  circle(startBtnX, startBtnY, 30);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  text("START", startBtnX, startBtnY);

  // Draw static album cover
  image(staticImg, 130, 150, 150, 150);

  if (videoReady && dropSound.isPlaying()) {
    const videoScale = 0.9; // 90% of the vinyl size
    const videoWidth = vinylSize; // Use vinylSize to match vinyl growth
    const videoHeight = videoWidth / videoAspect;
  
    const offsetX = 15; // right
    const offsetY = 0; // down
  
    image(vinylVideo, draggablePos.x + offsetX, draggablePos.y + offsetY, videoWidth, videoHeight);

    // Draw the popup image only while video/sound are playing
  const popupX = draggablePos.x + 165; // right
  const popupY = draggablePos.y + 50; // down
  const popupWidth = 50; 
  const popupHeight = 100; 

  image(popupImg, popupX, popupY, popupWidth, popupHeight);

  }  
  
}

function mousePressed() {
  // STOP button
  if (clickedStopButton(mouseX, mouseY)) {
    if (dropSound.isPlaying()) {
      dropSound.stop();
      console.log("Song stopped.");
    }
    musicStopped = true;
    return;
  }

  // START button
  const stopBtnX = targetPos.x + 180;
  const stopBtnY = targetPos.y + 305;
  const startBtnX = stopBtnX;
  const startBtnY = stopBtnY - 40;
  const startBtnRadius = 15;

  if (dist(mouseX, mouseY, startBtnX, startBtnY) < startBtnRadius) {
    if (vinylSnapped && !dropSound.isPlaying()) {
      musicStopped = false; // reset here if needed
      dropSound.play();
      vinylVideo.time(0);
      vinylVideo.play();
    }
    
  }

  // Drag check (based on current vinyl size)
  let halfW = vinylSize / 2;
  let halfH = vinylSize / (2 * vinylAspect);
  if (
    mouseX > draggablePos.x - halfW &&
    mouseX < draggablePos.x + halfW &&
    mouseY > draggablePos.y - halfH &&
    mouseY < draggablePos.y + halfH
  ) {
    dragging = true;
    offsetX = draggablePos.x - mouseX;
    offsetY = draggablePos.y - mouseY;
  }
}

function mouseDragged() {
  if (dragging) {
    draggablePos.x = mouseX + offsetX;
    draggablePos.y = mouseY + offsetY;
  }
}

function mouseReleased() {
  dragging = false;

  if (musicStopped) return;

  if (dist(draggablePos.x, draggablePos.y, targetPos.x, targetPos.y) < 500) {
    const snapOffsetX = -25;
    const snapOffsetY = 290;
    draggablePos.set(targetPos.x + snapOffsetX, targetPos.y + snapOffsetY);

    vinylSize = 310;
    vinylSnapped = true;
  }
}

function clickedStopButton(mx, my) {
  const stopBtnRadius = 15;
  const stopBtnX = targetPos.x + 180;
  const stopBtnY = targetPos.y + 305;

  return dist(mx, my, stopBtnX, stopBtnY) < stopBtnRadius;
}
