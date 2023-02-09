import BaseScene from './BaseScene';

const pipesToBird = 4;


    class PlayScene extends BaseScene {
        constructor(config){
            super('PlayScene', config);
            this.bird = null;
            this.pipes = null;
            this.isPaused = false;
            this.pipesHorizontalDistance = 0;
            this.velocity = 300; 

            this.currentDifficulty = 'easy';
            this.difficulties = {
              'easy': {
                pipeHorizontalDistanceRange: [450, 550],
                pipeVerticalDistanceRange: [150, 250]
              }, 
              'normal': {
                pipeHorizontalDistanceRange: [300, 350],
                pipeVerticalDistanceRange: [140, 200]
              }, 
              'hard': {
                pipeHorizontalDistanceRange: [250, 320],
                pipeVerticalDistanceRange: [130, 200]
              }, 
            }
        }


// initializing instanses of the objects (all of interactions)
create(){
  // we are executing here create from base scene
        super.create();

        this.currentDifficulty = 'easy';
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.listenToEvents();
        this.flapping();
}

flapping(){this.anims.create({
  key: 'fly',
  frames: this.anims.generateFrameNumbers('bird', {start: 8, end: 15}),
  // framerate 24fps defaults, it will play animation consisting of 24 frames in 1 sec
  // we will play 8 frames per second
  frameRate: 16,
  //repeat unlimited times
 // repeat: 1
 
});this.bird.play('fly')}

update(){
      this.gameStatus();

    //функцію викликаємо тут, щоб її виконувало з освіженням 60 разів на сек
    this.recyclePipes();

}

listenToEvents(){
  //event will be executed whenever you scene will be resumed
  if(this.pauseEvent) {return;}
  this.pauseEvent = this.events.on('resume', () => {
    this.initialTime = 3; 
    this.countDownText = this.add.text(...this.screenCenter, 'Continue in ' + this.initialTime, this.fontOptions).setOrigin(0.5);
    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.countDown,
      callbackScope: this,
      loop: true
    })
  });
}

countDown(){
  this.initialTime--;
  this.countDownText.setText('Continue in ' + this.initialTime);
  if(this.initialTime <= 0) {
    this.isPaused = false;
    this.countDownText.setText('');
    this.physics.resume();
    this.timedEvent.remove();
  }
}


createBird() {
        //sprite is game object that has more properties
        // потрібно додавати фізику до спрайта (додати аркадну фізику для пташки, щоб потім можна було цю фізику модифікувати)
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0).setScale(3).setFlipX(true);
        this.bird.setBodySize(this.bird.width, this.bird.height-8);
        this.bird.body.gravity.y = 600;
}

createPipes(){
  this.pipes = this.physics.add.group();

  //створюємо труби і кидаємо їх в петлю + додаємо функцію, що генерила труби
  for (let i = 0; i < pipesToBird; i++){
    const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0,1);
    const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0,0);

    //викликаємо функцію
    this.placePipes(upperPipe, lowerPipe);
    
  }

    this.pipes.setVelocityX(-200);

}

//додаємо колайдер (межі пташки і труб), якщо вони стикаються, то викликаємо функцію геймовер
createColliders(){
  this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
}

createScore(){
  this.score = 0;
  const bestScore = localStorage.getItem("bestScore");
  this.scoreText = this.add.text(20, 10, `Score: ${0}`, {fontSize: '25px',});

  //remember our best score
  this.add.text(20, 40, `Best score: ${bestScore || 0}`, {fontSize: '20px',});
}

createPause(){
  this.isPaused = false;
  const pauseButton = this.add.image(this.config.width-10, this.config.height -10, 'pause').setScale(2).setOrigin(1);

  //creating event for our pause button which is object
  pauseButton.on('pointerdown', () => {
    this.isPaused = true;
    this.physics.pause();
    this.scene.pause();
    
    //use launch instead of start to not shut down my scene
    this.scene.launch('PauseScene');
  })

  //making pause button interactive -> when press on it it make action
  pauseButton.setInteractive();
}


handleInputs() {
      //додаємо рух пташки, коли натискається курсор. для цього робимо функцію
      const handling = this.input.on('pointerdown', this.up, this);
}

gameStatus(){
      //if bird y position lower or higher than canvas -> game over
      if(this.bird.getBounds().bottom >= this.config.height-this.bird.height/2){
        this.gameOver();
      } else if (this.bird.y < 0)
      {
        this.gameOver();
      }
}

// функція, яка задає відстань між трубами, труби зміщуються в сторону пташки
 placePipes(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty]
    const pipeHorizontalPosition = this.getRightMaxPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 30, this.config.height - 30 - pipeVerticalDistance);
    const pipesHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

    uPipe.x = pipeHorizontalPosition + pipesHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
    }

    getRightMaxPipe(){
      let rightMaxX = 0;

      //getChildren витягує всі труби з груби в вигляді масиву
      //тут ми  витягуємо труби з нашої групи
      this.pipes.getChildren().forEach(function(pipe){
        rightMaxX = Math.max(pipe.x, rightMaxX);
      })

      return rightMaxX;
    }

    recyclePipes(){
      const temporaryPipes = [];
      this.pipes.getChildren().forEach(pipe => {
        //getBounds method to check right coordinate in our sprite pipe
        if (pipe.getBounds().right <= 0) {
          //recycle pipe
          // whem getBounds indentifies pipes are out, we get upper and lower pipes 
          //that are out of canvas to empty array, where if length is 2 we initiate new pipes creation
          temporaryPipes.push(pipe);
            if (temporaryPipes.length === 2) {
              this.placePipes(...temporaryPipes);
              this.increaseScore();
              this.increaseDifficulty();
            }
        }
      })
    }

    increaseDifficulty(){
      if(this.score === 4) {
        this.currentDifficulty = 'normal';
      }

      if(this.score === 8) {
        this.currentDifficulty = 'hard';
      }
    }
    
    setBestScore(){
        //remember our best result in local storage -> save it when game is over
        const bestScoreText = localStorage.getItem('bestScore');
        // check do we have something there and convert to number
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);
        // if there is best score and our current score is better then best -> save to local storage
        if (!bestScore || this.score > bestScore){
          localStorage.setItem('bestScore', this.score);
      }
    }

    //позиція пташки як досягне верзнього або нижнього канвасу рестартиться на початкову
    gameOver() {
        //when bird crash to pipe phisic (game) stopped
        this.physics.pause();
        this.bird.setTint(0xEE4824);
        this.setBestScore();
        

        this.time.addEvent({
          delay: 1000,
          callback: () => {
            this.scene.restart();
          },
          //we dont want to reoccur fuction -> (true) value to false
          loop: false
        })
        }


    //функція що пташка підскакує вверх при натисканні курсором 
    up() {
        if(this.isPaused) {return;}
        this.bird.body.velocity.y = - this.velocity;
        this.flapping();
    }

    increaseScore(){
      this.score += 1;
      this.scoreText.setText(`Score: ${this.score}`);
    }

}

export default PlayScene;










