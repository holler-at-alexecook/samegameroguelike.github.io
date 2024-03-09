// Create an event emitter object
let emitter = new Phaser.Events.EventEmitter();

let player;

let characters = [
    { 
        name: 'Packrat', 
        description: 'Has room for more items to start with.',
        opts: {
            itemLimit: 4
        }
    },
    { 
        name: 'Money Bags', 
        description: 'Has more cash to start with.',
        opts: {
            cash: 10
        }
    },
    // Add more characters as needed
];

class Item {
    constructor(item = {}) {
        const opts = item.opts || {};
        this.name = item.name || 'Item';
        this.description = item.description || 'Description';
        this.cost = opts.cost || 1;
        this.uses = opts.uses || -1;
        this.listeners = opts.listeners || null;
        this.triggers = opts.triggers || null;
        this.active = opts.active || true;

        this.init();
    }
    init() {
        if (this.triggers) {
            this.triggers.forEach((trigger) => {
                emitter.on(trigger, trigger.effect, this);
            });
        }
    }
}

const items = [
    {
        name: 'Pickaxe',
        description: 'Remove 1 Gem',
        opts: {
            listeners: [
                {
                    event: 'gemClicked',
                    effect: (data) => {
                        console.log('gemClicked', data, this);
                    }
                }
            ]
        }
    },
    {
        name: 'Broken Compass (N)',
        description: 'Makes Gems fall upward',
        opts: {
            listeners: [
                {
                    event: 'gemClicked',
                    effect: (data) => {
                        console.log('gemClicked', data, this);
                    }
                }
            ]
        }
    },
];

class Player {
    constructor(character = {}) {
        const opts = character.opts || {};
        this.name = character.name || 'Name';
        this.description = character.description || 'Description';
        this.score = opts.score || 0;
        this.itemLimit = opts.itemLimit || 3;
        this.items = opts.items || [];
        this.cash = opts.cash || 6;
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
        // Display character selection UI elements (e.g., character options)
        this.add.text(400, 100, 'Select Your Character', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        let startY = 200;
        characters.forEach((character, index) => {
            let characterText = this.add.text(400, startY + index * 50, character.name + ' ' + character.description, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            characterText.setInteractive();
            characterText.on('pointerdown', () => this.selectCharacter(character));
        });
    }

    selectCharacter(character) {
        // Save selected character data and transition to the next scene (e.g., game screen)
        player = new Player(character);
        this.scene.start('ShopScreen');
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
        // Create game screen UI elements (e.g., game board, score display)
        this.add.text(400, 100, 'Shop Screen', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        // Add your game logic here

        let startY = 200;
        items.forEach((item, index) => {
            let itemText = this.add.text(400, startY + index * 50, item.name + ' ' + item.description, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            itemText.setInteractive();
            itemText.on('pointerdown', () => this.selectItem(item));
        });

        this.shopButton = this.add.text(400, 500, 'Start Game', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.shopButton.setInteractive();
        this.shopButton.on('pointerdown', this.endGame, this);
    }

    selectItem(item) {
        player.items.push(new Item(item));
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
        console.log('GameScreen.create', player);
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
        console.log('EndScreen.create', player);
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