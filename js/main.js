// Create the game
var game ;

game = new Phaser.Game(800, 600, Phaser.AUTO, '');

// Create a new state for the menu
game.state.add('menu', menu);

// Adding the Game state.
game.state.add('Game', Game);

// Add the Game Over state
game.state.add('game_over', game_over);

// Start the menu
game.state.start('menu');
