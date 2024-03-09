class Player {
    constructor() {
        this.score = 0;
        this.itemLimit = 3;
        this.items = [];
    }

    // Method to reset player data
    reset() {
        this.score = 0;
        this.items = [];
    }
}

// Start screen scene
class StartScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen' });
    }

    preload() {
        // Preload assets for the start screen (e.g., background image, buttons)
    }

    create() {
        // Create start screen UI elements (e.g., title text, start button)
        this.add.text(400, 300, 'Welcome to Gem Miner', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.startButton = this.add.text(400, 400, 'Start Game', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', this.startGame, this);
    }

    startGame() {
        this.scene.get('ShopScreen').data.set('playerData', new Player());
        this.scene.start('MapScreen');
    }
}

// Game screen scene
class ShopScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScreen' });
    }

    preload() {
        // Preload assets for the game screen (e.g., background image, gems)
    }

    create() {
        this.playerData = this.data.get('playerData');
        console.log(this.playerData);
        // Create game screen UI elements (e.g., game board, score display)
        this.add.text(400, 100, 'Shop Screen', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        // Add your game logic here
        this.shopButton = this.add.text(400, 500, 'Start Game', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.shopButton.setInteractive();
        this.shopButton.on('pointerdown', this.endGame, this);
    }

    endGame() {
        this.scene.start('GameScreen');
    }

    update() {
        // Update game logic (e.g., handle player input, check game over conditions)
    }
}

// Game screen scene
class GameScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScreen' });
    }

    preload() {
        // Preload assets for the game screen (e.g., background image, gems)
    }

    create() {
        // Create game screen UI elements (e.g., game board, score display)
        this.add.text(400, 100, 'Game Screen', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        // Add your game logic here
        this.gameOverButton = this.add.text(400, 500, 'Game Over', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.gameOverButton.setInteractive();
        this.gameOverButton.on('pointerdown', this.endGame, this);
    }

    endGame() {
        this.scene.start('EndScreen');
    }

    update() {
        // Update game logic (e.g., handle player input, check game over conditions)
    }
}

// End screen scene
class EndScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScreen' });
    }

    preload() {
        // Preload assets for the end screen (e.g., background image, score display)
    }

    create() {
        // Create end screen UI elements (e.g., game over message, score display, restart button)
        this.add.text(400, 300, 'Game Over', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        //this.add.text(400, 400, 'Your Score: ' + finalScore, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.restartButton = this.add.text(400, 500, 'Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', this.restartGame, this);
    }

    restartGame() {
        this.scene.start('StartScreen');
    }
}

// Define game configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [StartScreen, ShopScreen, GameScreen, EndScreen]
};

// Create a new Phaser game instance
let game = new Phaser.Game(config);