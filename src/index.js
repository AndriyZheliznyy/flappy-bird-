//імпортуєм фейзер
import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const width = 800;
const height = 600;
const birdPosition = {x: width / 10, y: height / 2};

const sharedConfig = {
  width: 800,
  height: 600,
  startPosition: birdPosition
}


//вікно гри
const config = {
        type: Phaser.AUTO,
        ...sharedConfig,
        //prevent the blur when scaled
        pixelArt: true,
        physics: {
          // arcade менеджить симуляцію фізики
          default: 'arcade',
          arcade: {
          }
        },
        scene: [new PreloadScene, new MenuScene(sharedConfig), new ScoreScene(sharedConfig), new PlayScene(sharedConfig), new PauseScene(sharedConfig)]
}


// створюємо нашу нову гру в фейзері
new Phaser.Game(config);

