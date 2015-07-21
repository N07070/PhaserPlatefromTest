
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    // The environnement
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');

    // The mobs and players
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('mob', 'assets/baddie.png',32, 32);

    // The items
    game.load.image('firstaid', 'assets/firstaid.png');
    game.load.image('diamond', 'assets/diamond.png');

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);

}

var player;
var platforms;
var cursors;
var mob;
var move = 0;

var stars;
var score = 0;
var scoreText

var speed_bonus_potion = 1;
var gravity_player = 500;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = gravity_player;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // Add the mob
    mob = game.add.sprite(40, game.world.height - 400, 'mob');
    game.physics.arcade.enable(mob);
    mob.body.bounce.y = 0.3;
    mob.body.gravity.y = 700;
    mob.body.collideWorldBounds = true;

    mob.animations.add('left',[0,1], 10, true);
    mob.animations.add('right',[2,3], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.3;
    }

	firstaid = game.add.group();
	firstaid.enableBody = true;
	medikit = firstaid.create(200,220, 'firstaid');

    diamond = game.add.group();
    diamond.enableBody = true;
    gravity_potion = diamond.create(100,500,'diamond');

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(firstaid, platforms);
    game.physics.arcade.collide(diamond, platforms);
    game.physics.arcade.collide(mob, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

	// Check if the player touches the first aid kit
	game.physics.arcade.overlap(player, firstaid, speed_bonus, null, this);

    //Check if the player has the gravity potion
    game.physics.arcade.overlap(player, diamond, gravity_bonus, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150 * speed_bonus_potion;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150 * speed_bonus_potion;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    if (cursors.down.isDown && !player.body.touching.down) {
        player.body.gravity.y = 5000;
    } else {
        player.body.gravity.y = gravity_player;
    }

    move_the_mob();

}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function speed_bonus (player, firstaid) {
	firstaid.kill();

	speed_bonus_potion = 2;

}

function gravity_bonus (player, diamond) {
    diamond.kill();

    gravity_player = 200;
    // The jumping of the player
    player.body.gravity.y = gravity_player;



}

function move_the_mob () {

    if(mob.body.blocked.left ){
        move = 0;
    }else if (mob.body.blocked.right ) {
        move = 1;
    }



    if (move === 1){
        mob.body.velocity.x = -150;
        mob.animations.play('left');
        mob_bounce();

    }else if ( move === 0 ) {
        mob.body.velocity.x = 150 ;
        mob.animations.play('right');
        mob_bounce();

    }else{
        //  Stand still
        mob.animations.stop();

        mob.frame = 2;
    }

}

function mob_bounce (){
    bounce = Math.random() * 10;

    if( bounce > 9 && mob.body.touching.down){
        mob.body.velocity.y = -150;
    }
}
