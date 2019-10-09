const SPEED = [-1, 1];
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 600;
const FRAME_RATE = 25;
const ANT_WIDTH = 48;
const ANT_HEIGHT = 55;
const ANT_AUDIO = new Audio();
ANT_AUDIO.src = 'js/ants-moving.mp3';
const DEAD_AUDIO = new Audio();
DEAD_AUDIO.src = 'js/smash.mp3';
const GAME_OVER = new Audio();
GAME_OVER.src = 'js/game-complete.mp3';
let scoreBox = document.getElementById('score');
let score = 0;

function getRandomValue(min, max) {
  min = Math.round(min);
  max = Math.round(max);
  return Math.floor(Math.random() * (max - min));
}

class Ant {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.create();
    this.directionX = SPEED[getRandomValue(0, SPEED.length)];
    this.directionY = SPEED[getRandomValue(0, SPEED.length)];
    this.isSmashed = false;
    this.turnAround();
    this.element.onclick = () => {
      if (!this.isSmashed) {
        this.element.classList.add('dead');
        this.isSmashed = true;
        DEAD_AUDIO.play();
        score++;
        scoreBox.innerHTML = score;
        setTimeout(() => {
          this.parentElement.removeChild(this.element);
        }, 2000);
      }
    };
  }

  create() {
    this.element = document.createElement('div');
    this.element.classList.add('ants');
    this.parentElement.appendChild(this.element);
  }

  setPosition(positionX, positionY) {
    this.antPositionX = positionX;
    this.antPositionY = positionY;
  }

  draw() {
    this.element.style.left = this.antPositionX + 'px';
    this.element.style.top = this.antPositionY + 'px';
  }

  move() {
    this.turnAround();
    this.antPositionX += this.directionX;
    this.antPositionY += this.directionY;
    this.draw();
    this.checkCollision();
  }
 

  checkCollision() {
    //collision in the x-axis
    if (this.antPositionX + ANT_WIDTH >= GAME_WIDTH || this.antPositionX <= 0) {
      this.directionX = -this.directionX;
    }

    // collision in the y-axis
    if (this.antPositionY + ANT_HEIGHT >= GAME_HEIGHT || this.antPositionY <= 0) {
      this.directionY = -this.directionY;
    }
  }

  turnAround() {
    if (this.directionX < 0 && this.directionY < 0) {
      this.element.style.transform = 'rotate(315deg)';
    } else if (this.directionX < 0 && this.directionY > 0) {
      this.element.style.transform = 'rotate(225deg)';
    } else if (this.directionX > 0 && this.directionY > 0) {
      this.element.style.transform = 'rotate(135deg)';
    } else if (this.directionX > 0 && this.directionY < 0) {
      this.element.style.transform = 'rotate(45deg)';
    }
  }
}

class Game {
  antArray = [];
  xyArray = [];

  constructor(gameWrapperId, antCount) {
    this.parentElement = document.getElementById(gameWrapperId);
    this.parentElement.style.width = GAME_WIDTH + 'px';
    this.parentElement.style.height = GAME_HEIGHT + 'px';
    scoreBox.innerHTML = score;
    this.antCount = antCount;
    this.init();
  }

  init() {
    this.createAnts();
    setInterval(this.moveAnts.bind(this), FRAME_RATE);
  }

  createAnts() {
    for (var i = 0; i < this.antCount; i++) {
      this.ant = new Ant(this.parentElement);
      this.createNewPositionAndCheckOverlaps();
      this.ant.setPosition(this.xyArray[i].x, this.xyArray[i].y);
      this.ant.draw();
      this.antArray.push(this.ant);
    }
  }

  createNewPositionAndCheckOverlaps() {
    var randomX = getRandomValue(0, GAME_WIDTH - ANT_WIDTH);
    var randomY = getRandomValue(0, GAME_HEIGHT - ANT_HEIGHT);
    for (var i = 0; i < this.xyArray.length; i++) {
      if (
        randomX >= this.xyArray[i].x &&
        randomX <= this.xyArray[i].x + ANT_WIDTH &&
        randomY >= this.xyArray[i].y &&
        randomY <= this.xyArray[i].y + ANT_HEIGHT
      ) {
        this.createNewPositionAndCheckOverlaps();
      }
    }
    this.xyArray.push({ x: randomX, y: randomY });
  }

  moveAnts() {
    for (var i = 0; i < this.antArray.length; i++) {
      this.antArray[i].move();
      this.detectOverallCollision();
      this.checkDeadAnt();
    }
  }

 

  checkDeadAnt() {
    for (var i = 0; i < this.antArray.length; i++) {
      ANT_AUDIO.play();
      if (this.antArray[i].isSmashed) {
        this.antArray.splice(i, 1);
      }
    }
    if (this.antArray.length == 0) {
      GAME_OVER.play();
      alert('CONGRATULATIONS, YOU WON!!!');
    }
  }

  detectOverallCollision() {
    for (var i = 0; i < this.antArray.length; i++) {
      for (var j = 0; j < this.antArray.length; j++) {
        if (i != j) {
          if (this.detectAntCollision(this.antArray[i], this.antArray[j])) {
            this.changeVelocityAfterCollision(this.antArray[i], this.antArray[j]);
          }
        }
      }
    }
  }

  detectAntCollision(ant1, ant2) {
    if (
      ant1.antPositionX < ant2.antPositionX + ANT_WIDTH &&
      ant1.antPositionX + ANT_WIDTH > ant2.antPositionX &&
      ant1.antPositionY < ant2.antPositionY + ANT_HEIGHT &&
      ant1.antPositionY + ANT_HEIGHT > ant2.antPositionY
    ) {
      // collision detected!
      console.log('Collision');
      return true;
    } else return false;
  }

  changeVelocityAfterCollision(ant1, ant2) {
    // Change velocity at X-axis
    var u1 = ant1.directionX; //Initial speed at X-axis of ant 1
    var u2 = ant2.directionX; //Initial speed at X-axis of ant 2
    ant1.directionX = u2;
    ant2.directionX = u1;

    //Change velocity at Y-axis
    u1 = ant1.directionY; //Initial speed at Y-axis of ant 1
    u2 = ant2.directionY; //Initial speed at Y-axis of ant 2
    ant1.directionY = u2;
    ant2.directionY = u1;

    ant1.move();
    ant2.move();
  }
}

new Game('game-wrapper', 15);
