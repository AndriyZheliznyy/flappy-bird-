import BaseScene from "./BaseScene";


class PauseScene extends BaseScene {
    constructor(config) {
        super('PauseScene', config);

        // creating variable where each icon is object 
        this.menu = [
            {scene: 'PlayScene', text: 'Continue'},
            {scene: 'MenuScene', text: 'Exit'},
        ]
    }


    create() {
        super.create();

        this.createMenu(this.menu, this.setUpMenuEvents.bind(this));
    }

    setUpMenuEvents(menuItem){
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive();

        //коли наводимо курсор на текст меню колір змінюється на жовтий
        textGameObject.on('pointerover', () => {
            textGameObject.setStyle({fill: '#ff0'})
        })

        //змінюємо колір тексту в меню назад на білий
        textGameObject.on('pointerout', () => {
            textGameObject.setStyle({fill: '#fff'})
        })

        // if menuItem has a scene
       textGameObject.on('pointerup', () => {
            if(menuItem.scene && menuItem.text === 'Continue'){
                //shutting down pause scene and resuming play scene
                this.scene.stop();
                this.scene.resume(menuItem.scene);
                this.physics.on
            } else {
                //play scene when we paused the game run in parralel, so firtly we need to stop it, then to move to menu scene
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        })
    }

}

export default PauseScene;


