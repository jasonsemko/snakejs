class World {
  constructor() {
    this.board = document.getElementById('snake-canvas');
    this.boardCtx = this.board.getContext('2d');
  }

  startGame() {
    let snake = new Snake()
    let player = new Player();
    let food = new Food();

    this.gameloop = setInterval(function() {
      this.refreshBoard()
      food.drawFood(this.boardCtx)
      let c = snake.getSnakePosition(player);
      let ateFood = food.ateFood(c.x, c.y)

      if(!this.isLegalMove(c.x, c.y, snake)) {
        this.gameOver();
      }

      if(ateFood) {
        food.newFood(this.boardCtx)
        player.addScore();
      }

      snake.move(c.x, c.y, ateFood, this.boardCtx);
    }.bind(this), 100);
  }

  refreshBoard() {
    this.boardCtx.fillStyle = "black";
    this.boardCtx.fillRect(0,0,this.board.width, this.board.height)
  }

  updateScore() {
    this.score += 5;
  }

  isLegalMove(x, y, snake) {
    var inBounds = (x < this.board.width && x >= 0) && (y < this.board.height && y >= 0)
    return !snake.hitSelf() && inBounds
  }

  gameOver() {
    clearInterval(this.gameloop)
  }
}

class Player {
  constructor() {
    this.legitMoves = [37, 38, 39, 40];
    this.score = 0;
    this.scoreCard = document.getElementById('score')
    this.listenForMoves();
  }

  addScore() {
    this.score += 5;
    this.scoreCard.textContent = this.score;
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
    this.snake = [{x: 0, y: 0}]
  }

  hitSelf() {
    if(this.snake.length < 2) {
      return false;
    }

    return this.snake.some(function(element) {
      return this.x == element.x && this.y == element.y;
    }.bind(this))
  }

  move(x, y, ateFood, board) {
    if (!ateFood) {
      this.snake.pop();
    }
    this.snake.unshift({x: x, y: y})

    board.fillStyle = 'blue';
    for(var i=0; i<this.snake.length; i++) {
      board.fillRect(this.snake[i].x, this.snake[i].y, 5, 5)
    }
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
    this.newFood();
  }

  newFood() {
    this.x = Math.ceil((Math.random() * 400)/20) * 20 - 20;
    this.y = Math.ceil((Math.random() * 400)/20) * 20 - 20;
  } 
  drawFood(board) {
    board.fillStyle = "red";
    board.fillRect(this.x, this.y, 20, 20)
  }

  ateFood(x, y) {
    return x === this.x && y === this.y;
  }
}


let world = new World();
world.startGame()
