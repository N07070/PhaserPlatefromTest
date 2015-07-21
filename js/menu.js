var menu = {

    preload : function() {
        // Load all the needed resources for the menu.
        game.load.image('menu', './assets/sky.png');

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);
    },

    create : function () {

        // Add menu screen.
        // It will act as a button to start the game.
        this.add.button(0, 0, 'menu', this.startGame, this);
        game.add.text(300, 300, "Click to start !", { font: "bold 16px sans-serif", fill: "#fff", align: "center"});


    },

    startGame : function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};
