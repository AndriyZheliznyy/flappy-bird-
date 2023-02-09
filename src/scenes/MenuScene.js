import BaseScene from "./BaseScene";


class MenuScene extends BaseScene {
    constructor(config) {
        super('MenuScene', config);

        // creating variable where each icon is object (object has to have scene parameter to enable this object navigate to scene)
        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Best score'},
            {scene: null, text: 'Exit'}
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

        // move when clicking to desired scene
        // if menuitem has the scene, then perform function to call the scene
        textGameObject.on('pointerup', () => {
            menuItem.scene && this.scene.start(menuItem.scene);

                if(menuItem.text === 'Exit'){
                    this.game.destroy(true);
                }
            })
        }

}

export default MenuScene;


