import Phaser from "phaser";

//in base scene we provide functionalities we will share to all of our scenes

class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2]
        this.fontSize = 32;
        this.lineHeight = 42; 
        this.fontOptions = {fontSize: `${this.fontSize}px`, fill: '#fff'};
    }


    create() {
        this.add.image(0, 0, 'sky_background').setOrigin(0);

        //if  config can go back we are are creating back button in the scene
        if(this.config.canGoBack){
            const backButton = this.add.image(this.config.width -10, this.config.height -10, 'back').setOrigin(1).setScale(2).setInteractive();
        backButton.on('pointerup', () => {
            this.scene.start('MenuScene');
        })
        }
    }

    createMenu(menu, setUpMenuEvents){
        let lastMenuPositionY = 0;

        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
            menuItem.textGameObject = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setUpMenuEvents(menuItem);
        })
    }

}

export default BaseScene;