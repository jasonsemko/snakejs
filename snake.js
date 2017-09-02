class World {
  constructor(width, height) {
    this.boardWidth = width;
    this.boardHeight = height;
    this.board = document.getElementById('board');
    this.score = 0;
    this.scoreEl = document.getElementById('score');
  }

  createWorld() {
    this.board.style.width = '200px';
    this.board.style.height = '200px';
  }

  init() {
    this.createWorld()
    this.startGame();
  }

  updateScore() {
    this.score += 5;
    this.drawScore();
  }

  drawScore() {
    this.scoreEl.textContent = this.score; 
  }

  isLegalMove(x, y, snake) {
    var inBounds = (x < this.boardWidth && x >= 0) && (y < this.boardHeight && y >= 0)
    return !snake.hitSelf() && inBounds
  }


  startGame() {
    let snake = new Snake()
    let player = new Player();
    let food = new Food();
    player.listenForMoves()


    this.gameloop = setInterval(function() {
      let coordinates = snake.getSnakePosition(player); // {x: X, y: Y}
      let proposed_x = coordinates['x'];
      let proposed_y = coordinates['y'];
      let ateFood = false;

      if(!this.isLegalMove(proposed_x, proposed_y, snake)) {
        this.gameOver();
      }

      if(food.ateFood(proposed_x, proposed_y)) {
        this.updateScore();
        food.drawNewFood();
        ateFood = true;
      }

      snake.move(proposed_x, proposed_y, ateFood);
    }.bind(this), 100);
  }

  gameOver() {
    clearInterval(this.gameloop)
  }
}

class Player {
  constructor() {
    this.legitMoves = [37, 38, 39, 40];
    this.listenForMoves();
    this.lastMove;
    this.listenForMoves();
  }

  listenForMoves() {
    window.addEventListener('keydown', function(e) {
      if (this.legitMoves.indexOf(e.keyCode) !== -1) {
        this.lastMove = e.keyCode;
      }
    }.bind(this))
  }
}

class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.createSnake()
    this.currentDirection = 0;
  } 

  createSnake() {
    let snakeEl = document.createElement('li');
    document.getElementById('snake').appendChild(snakeEl)
    snakeEl.style.top = 0;
    snakeEl.style.left = 0;
    this.snake = [{el: snakeEl, x: 0, y: 0}]
  }

  hitSelf() {
    if(this.snake.length < 2) {
      return false;
    }

    return this.snake.some(function(element) {
      return this.x == element.x && this.y == element.y;
    }.bind(this))
  }

  move(x, y, appendTail) {
    if (!appendTail) {
      var removedElement = this.snake.pop();
      document.getElementById('snake').removeChild(removedElement.el);
    }

    var newSnakeHead = document.createElement('li');
    newSnakeHead.style.top = y;
    newSnakeHead.style.left = x;

    this.snake.unshift({el: newSnakeHead, x: x, y: y})
    document.getElementById('snake').prepend(this.snake[0].el)
  }

  getSnakePosition(player) {
    let x = this.x
    let y = this.y 

    if (this.currentDirection == 37 && player.lastMove == 39) {
      player.lastMove = 37
    }
    if (this.currentDirection == 39 && player.lastMove == 37) {
      player.lastMove = 39
    }
    if (this.currentDirection == 38 && player.lastMove == 40) {
      player.lastMove = 38
    }
    if (this.currentDirection == 40 && player.lastMove == 38) {
      player.lastMove = 40 
    }

    switch(player.lastMove) {
      case(37):
        this.x -= 20;
        break;
      case(38):
        this.y -= 20;
        break;
      case(39):
        this.x += 20;
        break;
      case(40):
        this.y += 20;
        break;
    }

    this.currentDirection = player.lastMove;

    return {
      'x': this.x,
      'y': this.y
    };
  }
}


class Food {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.food = document.getElementById('food');
    this.drawNewFood();
  }

  drawNewFood(board) {
    this.x = this.generateRandomCoordinate();
    this.y = this.generateRandomCoordinate();

    this.food.style.left = this.x;
    this.food.style.top = this.y;
  }

  generateRandomCoordinate() {
    return Math.ceil((Math.random() * 200)/20) * 20 - 20;
  }

  ateFood(x, y) {
    return x === this.x && y === this.y;
  }
}


let world = new World(200, 200);
world.init()
