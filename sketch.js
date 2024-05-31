// group work code below, change some of them.
let multiCircles = [];
let multiCircleNum = 20;// Number of multiCircles
let innerMultiCircleNum = 10; // Number of inner concentric circles
let layerNum = 5; // Number of outer layers
let dotSize = 10; // Size of the dots
let dotDensity = 30; // Density of the dots

class MultiCircle {
  // Constructor to initialize the properties of multiCircle
  constructor(x, y, maxRadius, innerMultiCircleNum, layerNum) {
    this.x = x;
    this.y = y;
    // Set the circles and each one will move randomly （Changed part）
    this.vx = random(-1, 1); //Circular velocity direction
    this.vy = random(-1, 1); //Circular velocity direction
    this.rotateAngle = 0 // Current Angle
    this.rotateVelocity = random(-2, 2) // Angle of rotation speed
    this.maxRadius = maxRadius;
    this.innerMultiCircleNum = innerMultiCircleNum;
    this.layerNum = layerNum;
    this.innerRadius = maxRadius / 2;
    this.dotRadius = 5;
    // Allowed colors for inner concentric circles
    this.innerAllowedColors = [
      color(87, 98, 100),
      color(180, 172, 153),
      color(128, 128, 98),
      color(175, 146, 116),
      color(145, 73, 63)
    ];
    // Allowed colors for outer dots
    this.outerAllowedColors = [
      color(221, 211, 143),
      color(198, 177, 107),
      color(124, 167, 195),
      color(141, 164, 189),
      color(228, 122, 77),
    ];
    // Generate random colors for inner circles and outer dots
    this.innerColors = this.generateRandomColors(innerMultiCircleNum, this.innerAllowedColors);
    this.outerColor = this.generateRandomColors(1, this.outerAllowedColors)[0];
  }

  // Generate an array of random colors from the allowed colors
  generateRandomColors(num, allowedColors = []) {
    let colors = [];
    for (let i = 0; i < num; i++) {
      if (allowedColors.length > 0) {
        colors.push(allowedColors[int(random(allowedColors.length))]);
      } else {
        colors.push(color(random(255), random(255), random(255)));
      }
    }
    return colors;
  }

  // Display the multiCircle
  display() {
    // Calculate the outermost radius
    let outerRadius = this.innerRadius + this.layerNum * this.dotRadius * 2;

    // Draw the background circle with no stroke
    fill(231, 231, 224);
    push();
    translate(this.x, this.y);


    // Rotate the graph （added part）
    rotate(this.rotateAngle);
    // Scale the graph according to the volume to achieve the effect of volume change （added part）
    scale(0.55 + level * 2)
    // The speed at which the graphic changes Angle varies according to the volume （added part）
    this.rotateAngle += this.rotateVelocity * level
    noStroke();
    ellipse(0, 0, outerRadius * 2);

    // Draw inner concentric circles
    noFill();
    for (let i = this.innerColors.length - 1; i >= 0; i--) {
      stroke(this.innerColors[i]);
      strokeWeight(5);
      ellipse(
        0,
        0,
        ((this.innerRadius * (i + 1)) / this.innerColors.length) * 2
      );
    }

    // Draw outer circle dots
    fill(this.outerColor);
    noStroke();
    for (let i = 0; i < 360; i += 15) {
      let angle = radians(i);
      for (let j = 0; j < this.layerNum; j++) {
        let radius = this.innerRadius + j * this.dotRadius * 2;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        ellipse(x, y, this.dotRadius * 2);
      }
    }
    pop(); //Restores the previously saved state of the drawing
  }

// Realize circular motion (main activity)
move() {
  // Map a speed value based on the volume
  let velocity = map(level, 0, 1, 0.01, 50);
  // When the volume is less than the threshold, the speed will keep changing randomly, 
  // resulting in a jitter effect (new technique code from tiktok class)
  if (level < 0.02) {
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
  }
  // Let the coordinates of the graph vary according to the velocity value and the vx vy of the graph itself
  this.x = this.x + this.vx * velocity;
  this.y = this.y + this.vy * velocity;
    // Make the image bounce back when the coordinates of the image touch the boundary
  if (this.x > width) {
    this.vx *= -1;
    this.x = width;
  }
  if (this.x < 0) {
    this.vx *= -1;
    this.x = 0;
  }
  if (this.y > height) {
    this.vy *= -1;
    this.y = height;
  }
  if (this.y < 0) {
    this.vy *= -1;
    this.y = 0;
  }

}
}
// music-related variables
let music, analyzer, level;
// Store an array of background color changes
let backgroundColors = []
// Indicates the current background color
let backgroundColorIndex = 0
// Indicates the cooldown time of the background switch
let backgroundChangeCD = 0
function preload() {
  // Load the specified audio (Beethoven's Symphony of Destiny)
  music = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
// create a new Amplitude analyzer ,this will analyze the volume of the song
analyzer = new p5.Amplitude();
// Sets the color array of the background (varies with the frequency of the music)
backgroundColors = [
  color(221, 211, 143),
  color(198, 177, 107),
  color(124, 167, 195),
  color(141, 164, 189),
  color(228, 122, 77),
];
  // Generate multiCircles at random positions
  for (let i = 0; i < multiCircleNum; i++) {
    let x = random(width);
    let y = random(height);
    let maxRadius = random(100, 200);
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  }
}

function draw() {
  // Set the background color according to the Background ColorIndex (changed part)
  background(backgroundColors[backgroundColorIndex]);
  drawPolkaDotBackground();
  // Get the music volume 
  level = analyzer.getLevel();
  // Determine if the volume is high enough and the cd value for switching colors is less than 0
  if (level > 0.067 && backgroundChangeCD <= 0) {
    // Set index value 1 to 0 if it exceeds the range to change the background color
    backgroundColorIndex += 1
    if (backgroundColorIndex >= backgroundColors.length) {
      backgroundColorIndex = 0
    }
    // Set the cooldown to 12 frames
    backgroundChangeCD = 12
  }
  // Reduce cooldown time
  backgroundChangeCD -= 1
    // Display all multiCircles
  for (let mc of multiCircles) {
    mc.move();
    mc.display();
  }
}

function drawPolkaDotBackground() {
  // Draw polka dot background
  // Set the fan Angle based on the volume level
  let angle = map(level, 0, 1, 0, 360)
  fill(193, 110, 74, 50);
  noStroke();
  // Loop through to calculate the position of the background dots
  for (let y = 0; y < height; y += dotDensity) {
    for (let x = 0; x < width; x += dotDensity) {
      ellipse(x, y, dotSize);
      fill(193, 110, 74);
      // Set arc data and status
      arc(x, y, dotSize * level * 5 + dotSize, dotSize * level * 5 + dotSize, radians(-90 - angle), radians(-90 + angle))
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}