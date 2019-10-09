const BALL_SIZES = [10, 15, 20, 23, 25, 27, 30];
const BALL_MASS_UNIT = 2; //Mass per 1 unit size
const SPEED = [-1, 1];
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 600;
const FRAME_RATE = 10;
const COLORS = ['black', 'green', 'yellow', 'orange'];

function getRandomValue(min, max) {
  min = Math.round(min);
  max = Math.round(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Ball {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.ballSize = BALL_SIZES[getRandomValue(0, BALL_SIZES.length)];
    this.ballMass = this.ballSize * BALL_MASS_UNIT;
    this.ballColor = COLORS[getRandomValue(0, COLORS.length)];
    this.create();
    this.directionX = SPEED[getRandomValue(0, SPEED.length)];
    this.directionY = SPEED[getRandomValue(0, SPEED.length)];
  }

  create() {
    this.element = document.createElement('div');
    this.element.classList.add('balls');
    this.element.style.height = this.element.style.width = this.ballSize + 'px';
    this.element.style.backgroundColor = this.ballColor;
    this.parentElement.appendChild(this.element);
  }

  setPosition(positionX, positionY) {
    this.ballPositionX = positionX;
    this.ballPositionY = positionY;
  }

  draw() {
    this.element.style.left = this.ballPositionX + 'px';
    this.element.style.top = this.ballPositionY + 'px';
  }

  move() {
    this.ballPositionX += this.directionX;
    this.ballPositionY += this.directionY;
    this.draw();
    this.checkCollision();
  }

  

  checkCollision() {

    //change direction if the ball contacts the vertical walls
    if (this.ballPositionX + this.ballSize >= (GAME_WIDTH) || this.ballPositionX <= 0) {
      this.directionX = -this.directionX;
    }

    // change direction if the ball contants the horizontal walls
    if (this.ballPositionY + this.ballSize >= (GAME_HEIGHT) || this.ballPositionY <= 0) {
      this.directionY = -this.directionY;
    }
  }
}

class Game {
  ballArray = [];
  xyArray = [];

  constructor(gameWrapperId, ballCount) {
    this.parentElement = document.getElementById(gameWrapperId);
    this.parentElement.style.width = GAME_WIDTH + 'px';
    this.parentElement.style.height = GAME_HEIGHT + 'px';
    this.ballCount = ballCount;
    this.init();
  }

  init() {
    this.createBalls();
    setInterval(this.moveBalls.bind(this), FRAME_RATE);
  }

  createBalls() {
    for (var i = 0; i < this.ballCount; i++) {
      this.ball = new Ball(this.parentElement);
      this.createNewPositionAndCheckOverlaps();
      this.ball.setPosition(this.xyArray[i].x, this.xyArray[i].y);
      this.ball.draw();
      this.ballArray.push(this.ball);
    }
    console.log(this.xyArray);
  }

  createNewPositionAndCheckOverlaps() {
    var maxBallSize = BALL_SIZES[BALL_SIZES.length - 1];
    var randomX = getRandomValue(0, GAME_WIDTH - maxBallSize);
    var randomY = getRandomValue(0, GAME_HEIGHT - maxBallSize);

    for (var i = 0; i < this.xyArray.length; i++) {
      if (
        randomX >= this.xyArray[i].x &&
        randomX <= this.xyArray[i].x + maxBallSize &&
        randomY >= this.xyArray[i].y &&
        randomY <= this.xyArray[i].y + maxBallSize
      ) {
        this.createNewPositionAndCheckOverlaps();
      }
    }

    this.xyArray.push({ x: randomX, y: randomY });
  }

  moveBalls() {
    for (var i = 0; i < this.ballCount; i++) {
      this.ballArray[i].move();
      this.detectOverallCollision();
    }
  }

  detectOverallCollision() {
    for (var i = 0; i < this.ballArray.length; i++) {
      for (var j = 0; j < this.ballArray.length; j++) {
        if (i != j) {
          if (this.detectBallCollision(this.ballArray[i], this.ballArray[j])) {
            this.changeVelocityAfterCollision(this.ballArray[i], this.ballArray[j]);
          }
        }
      }
    }
  }

  detectBallCollision(ball1, ball2) {
    var r1 = ball1.ballSize / 2;
    var r2 = ball2.ballSize / 2;
    var centerX1 = ball1.ballPositionX + r1;
    var centerY1 = ball1.ballPositionY + r1;
    var centerX2 = ball2.ballPositionX + r2;
    var centerY2 = ball2.ballPositionY + r2;

    var dx = centerX1 - centerX2;
    var dy = centerY1 - centerY2;
    var distance = Math.sqrt(dx**2 + dy**2);

    if (distance <= r1 + r2) {
      console.log('Collision');
      return true;
    } 
    else 
      return false;
  }

  changeVelocityAfterCollision(ball1, ball2) {
    // Change velocity at X-axis
    var u1 = ball1.directionX; //Initial speed at X-axis of ball 1
    var u2 = ball2.directionX; //Initial speed at X-axis of ball 2
    var m1 = ball1.ballMass; //Mass of ball 1
    var m2 = ball2.ballMass; //Mass of ball 2
    ball1.directionX = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
    ball2.directionX = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;

    //Change velocity at Y-axis
    u1 = ball1.directionY; //Initial speed at Y-axis of ball 1
    u2 = ball2.directionY; //Initial speed at Y-axis of ball 2
    m1 = ball1.ballMass; //Mass of ball 1
    m2 = ball2.ballMass; //Mass of ball 2
    ball1.directionY = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
    ball2.directionY = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;

    ball1.move();
    ball2.move();
  }
}

new Game('game-wrapper', 30);
