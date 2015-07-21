var game_over = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('gameover', 'assets/sky.png');

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);
    },

    create : function() {

        // Create button to start game like in Menu.
        this.add.button(0, 0, 'gameover', this.startGame, this);

        // Add text with information about the score from last game.
        game.add.text(235, 310, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
        game.add.text(350, 308, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
        game.add.text(350, 300, "Click to restart", { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Game');

    }

};
