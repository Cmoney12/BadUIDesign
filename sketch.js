let circleX = 400;
let circleY = 500;
let diameter = 200;
let radius = diameter / 2;
let points = 10;
let clickedMouseX;
let clickedMouseY;
let rotation = 0;
let resetInProgress = false;

class DialNumber {
  constructor(x, y, number) {
    this.x = x;
    this.y = y;
    this.number = number;
  }
}

let DialNumbers = [];

function setup() {
  createCanvas(800, 800);
  setupDialNumbers();
  
  //for (let i = 0; i < points; ++i) {
  //  console.log(DialNumbers[i]);
  //}
}

function setupDialNumbers() {
  let factor = 0.7; 
  let r = diameter / 2;
  for (let i = 0; i < points; ++i) {
    let angleDeg = 360 / points * i;  
    let angleRad = angleDeg * (Math.PI / 180);
    let x = r * cos(angleRad) * factor;
    let y = r * sin(angleRad) * factor;
    
    DialNumbers.push(new DialNumber(x, y, i));
  }
}

function drawNumbers() {
  let factor = 0.7; 
  let r = diameter / 2;
  push();
  translate(circleX, circleY);
  rotate(rotation);
  

  for (let i = 0; i < points; ++i) {
    let angleDeg = 360 / points * i;  // Angle in degrees
    let angleRad = angleDeg * (Math.PI / 180); // Convert degrees to radians
    let x = r * cos(angleRad); // Scale by the radius and shift by circle's center
    let y = r * sin(angleRad); // Scale by the radius and shift by circle's center
     
    let numX = x * factor;
    let numY = y * factor;
    
    textSize(16);
    fill(0); // Black text
    text(i, numX, numY);
  }
  
  pop();
}


function mouseReleased() {
  //console.log(rotation);
  if (clickedMouseX < circleX + radius && clickedMouseX > circleX - radius &&
     clickedMouseY < circleY + radius && clickedMouseY > circleY - radius) {
    findClosestNumber();
  }
  rotation = 0;
}

function setNumber(number) {
  let areaCodeRadio = document.getElementById("area-radio");
  let prefixRadio = document.getElementById("prefix-radio");
  let lineNumRadio = document.getElementById("line-radio");
  
  if (areaCodeRadio.checked) {
    let inputField = document.getElementById("area-code");
    inputField.value += number; // Append the number
  } else if (prefixRadio.checked) {
    let prefixField = document.getElementById("prefix");
    prefixField.value += number;
  } else if (lineNumRadio.checked) {
    let lineNumField = document.getElementById("line-number");
    lineNumField.value += number;
  } 
}

function findClosestNumber() {
  let angleAtRelease = rotation; // This is the current rotation at mouse release
  let closestIndex = -1;
  let minAngleDiff = Infinity;

  // Loop through all dial numbers and find the one with the smallest angle difference
  for (let i = 0; i < points; ++i) {
    let angleDeg = 360 / points * i;  // Angle in degrees
    let angleRad = angleDeg * (Math.PI / 180);  // Convert degrees to radians

    // Calculate the difference between the current rotation and the angle of the dial number
    let angleDiff = Math.abs(angleAtRelease - angleRad);
    
    // Normalize the angle difference to be between 0 and Math.PI
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

    if (angleDiff < minAngleDiff) {
      minAngleDiff = angleDiff;
      closestIndex = i;
    }
  }
  // Have to go the reverse way in the array
  let index = closestIndex > 0 ? Math.abs(closestIndex - points) : 0;
  setNumber(index)

}


function mouseDragged() {
  // Check to see if we are clicking inside of the dial
  if (clickedMouseX < circleX + radius && clickedMouseX > circleX - radius &&
     clickedMouseY < circleY + radius && clickedMouseY > circleY - radius) {
    
    // only rotating this by the y axis
    let delta = clickedMouseY - mouseY;
    rotation += delta * 0.05;
    clickedMouseY = mouseY;
  }
}

function mousePressed() {
  clickedMouseY = mouseY;
  clickedMouseX = mouseX;
}

function drawDialPointer() {
  let x = circleX + diameter / 2; // point at the number
  let y = circleY;
  let x1 = circleX + diameter + 40;
  let y1 = circleY + 40;
  let x2 = circleX + diameter + 40;
  let y2 = circleY - 40;
  
  triangle(x, y, x1, y1, x2, y2);
  
}

function draw() {
  background(400);
  fill(255, 0, 0);
  circle(circleX, circleY, diameter);
  drawNumbers();
  drawDialPointer();
}

/**function drawLines() {
  // draw lines divide the circle up into 10 even pieces 
   let r = diameter / 2;  // The radius of the circle (half of the diameter)
  
  for (let i = 0; i < points; ++i) {
    let angleDeg = 360 / points * i;  // Angle in degrees
    let angleRad = angleDeg * (PI / 180); // Convert degrees to radians
    let x = circleX + r * cos(angleRad); // Scale by the radius and shift by circle's center
    let y = circleY + r * sin(angleRad); // Scale by the radius and shift by circle's center
    //line(circleX, circleY, x, y); 
    
    let factor = 0.7; 
    let numX = circleX + (x - circleX) * factor;
    let numY = circleY + (y - circleY) * factor;
    
    textSize(16);
    fill(0); // Black text
    text(i, numX, numY);
    
  }
}**/

// stuff for backspace

document.addEventListener("DOMContentLoaded", function () {
  function backspaceInput(inputId) {
    let inputField = document.getElementById(inputId);
    let currentValue = inputField.value;
    inputField.value = currentValue.slice(0, -1); // Remove the last character
  }

  // Handle clicking the backspace buttons
  document.getElementById("area-backspace").addEventListener("click", function () {
    backspaceInput("area-code");
  });

  document.getElementById("prefix-backspace").addEventListener("click", function () {
    backspaceInput("prefix");
  });

  document.getElementById("line-backspace").addEventListener("click", function () {
    backspaceInput("line-number");
  });
  
  document.getElementById("submit-button").addEventListener("click", function () {
    let areaCodeField = document.getElementById("area-code");
    let prefixField = document.getElementById("prefix");
    let lineNumField = document.getElementById("line-number");
    
    let submitDiv = document.getElementById("submit-message");

    if (areaCodeField.value.length === 3 && prefixField.value.length === 3 &&
        lineNumField.value.length === 4) {
      submitDiv.innerHTML = "<p>Successfully submitted number</p>";
    } else {
      submitDiv.innerHTML = "<p>Error submitting number</p>";
    }
    
  });
  
});


