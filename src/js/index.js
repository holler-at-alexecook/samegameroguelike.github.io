let gameOptions = {
    gemSize: 100,
    boardOffset: {
        x: 100,
        y: 50
    },
    destroySpeed: 200,
    fallSpeed: 100
}

class SameGame {
    constructor(obj) {
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
        this.fallDirection = 'down'; // Default fall direction
        this.minConnected = 3; // Default minimum connected gems for removal
    }

    generateBoard() {
        this.gameArray = [];
        for (let i = 0; i < this.rows; i++) {
            this.gameArray[i] = [];
            for (let j = 0; j < this.columns; j++) {
                let randomValue = Math.floor(Math.random() * this.items);
                this.gameArray[i][j] = {
                    value: randomValue,
                    isEmpty: false,
                    row: i,
                    column: j
                };
            }
        }
    }

    getRows() {
        return this.rows;
    }

    getColumns() {
        return this.columns;
    }

    isEmpty(row, column) {
        return this.gameArray[row][column].isEmpty;
    }

    getValueAt(row, column) {
        if (!this.validPick(row, column)) {
            return false;
        }
        return this.gameArray[row][column].value;
    }

    getCustomDataAt(row, column) {
        return this.gameArray[row][column].customData;
    }

    validPick(row, column) {
        return (
            row >= 0 &&
            row < this.rows &&
            column >= 0 &&
            column < this.columns &&
            this.gameArray[row] != undefined &&
            this.gameArray[row][column] != undefined
        );
    }

    setCustomData(row, column, customData) {
        this.gameArray[row][column].customData = customData;
    }

    listConnectedItems(row, column) {
        if (!this.validPick(row, column) || this.gameArray[row][column].isEmpty) {
            return [];
        }
        this.colorToLookFor = this.gameArray[row][column].value;
        this.floodFillArray = [];
        this.floodFillArray.length = 0;
        this.floodFill(row, column);
        return this.floodFillArray;
    }

    countConnectedItems(row, column) {
        return this.listConnectedItems(row, column).length;
    }

    removeConnectedItems(row, column) {
        let items = this.listConnectedItems(row, column);
        if (items.length >= this.minConnected) {
            items.forEach(function (item) {
                this.gameArray[item.row][item.column].isEmpty = true;
            }.bind(this));
        }
    }

    floodFill(row, column) {
        if (!this.validPick(row, column) || this.gameArray[row][column].isEmpty) {
            return;
        }
        if (this.gameArray[row][column].value == this.colorToLookFor && !this.alreadyVisited(row, column)) {
            this.floodFillArray.push({
                row: row,
                column: column
            });
            this.floodFill(row + 1, column);
            this.floodFill(row - 1, column);
            this.floodFill(row, column + 1);
            this.floodFill(row, column - 1);
        }
    }
    /*
    arrangeBoard() {
        let result = [];
        for (let i = this.getRows() - 2; i >= 0; i--) {
            for (let j = 0; j < this.getColumns(); j++) {
                let emptySpaces = this.emptySpacesBelow(i, j);
                if (!this.isEmpty(i, j) && emptySpaces > 0) {
                    this.swapItems(i, j, i + emptySpaces, j);
                    result.push({
                        row: i + emptySpaces,
                        column: j,
                        deltaRow: emptySpaces
                    });
                }
            }
        }
        return result;
    }
    */
    countEmptySpaces(row, column, direction) {
        let result = 0;
        switch (direction) {
            case 'up':
                for (let i = row - 1; i >= 0; i--) {
                    if (this.isEmpty(i, column)) {
                        result++;
                    } else {
                        break;
                    }
                }
                break;
            case 'right':
                for (let j = column + 1; j < this.getColumns(); j++) {
                    if (this.isEmpty(row, j)) {
                        result++;
                    } else {
                        break;
                    }
                }
                break;
            case 'down':
                for (let i = row + 1; i < this.getRows(); i++) {
                    if (this.isEmpty(i, column)) {
                        result++;
                    } else {
                        break;
                    }
                }
                break;
            case 'left':
                for (let j = column - 1; j >= 0; j--) {
                    if (this.isEmpty(row, j)) {
                        result++;
                    } else {
                        break;
                    }
                }
                break;
        }
        return result;
    }
    arrangeBoard() {
        let result = [];
        switch (this.fallDirection) {
            case 'down':
                for (let i = this.getRows() - 2; i >= 0; i--) {
                    for (let j = 0; j < this.getColumns(); j++) {
                        let emptySpaces = this.countEmptySpaces(i, j, this.fallDirection);
                        if (!this.isEmpty(i, j) && emptySpaces > 0) {
                            this.swapItems(i, j, i + emptySpaces, j);
                            result.push({
                                row: i + emptySpaces,
                                column: j,
                                deltaRow: emptySpaces
                            });
                        }
                    }
                }
                break;
            case 'up':
                for (let i = 1; i < this.getRows(); i++) {
                    for (let j = 0; j < this.getColumns(); j++) {
                        let emptySpaces = this.countEmptySpaces(i, j, this.fallDirection);
                        if (!this.isEmpty(i, j) && emptySpaces > 0) {
                            this.swapItems(i, j, i - emptySpaces, j);
                            result.push({
                                row: i - emptySpaces,
                                column: j,
                                deltaRow: -emptySpaces
                            });
                        }
                    }
                }
                break;
            case 'left':
                for (let j = 1; j < this.getColumns(); j++) {
                    for (let i = 0; i < this.getRows(); i++) {
                        let emptySpaces = this.countEmptySpaces(i, j, this.fallDirection);
                        if (!this.isEmpty(i, j) && emptySpaces > 0) {
                            this.swapItems(i, j, i, j - emptySpaces);
                            result.push({
                                row: i,
                                column: j - emptySpaces,
                                deltaColumn: -emptySpaces
                            });
                        }
                    }
                }
                break;
            case 'right':
                for (let j = this.getColumns() - 2; j >= 0; j--) {
                    for (let i = 0; i < this.getRows(); i++) {
                        let emptySpaces = this.countEmptySpaces(i, j, this.fallDirection);
                        if (!this.isEmpty(i, j) && emptySpaces > 0) {
                            this.swapItems(i, j, i, j + emptySpaces);
                            result.push({
                                row: i,
                                column: j + emptySpaces,
                                deltaColumn: emptySpaces
                            });
                        }
                    }
                }
                break;
        }
        return result;
    }
    /*
    replenishBoard() {
        let result = [];
        for (let i = 0; i < this.getColumns(); i++) {
            if (this.isEmpty(0, i)) {
                let emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for (let j = 0; j < emptySpaces; j++) {
                    let randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptySpaces
                    });
                    this.gameArray[j][i].value = randomValue;
                    this.gameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }
    */
    replenishBoard() {
        let result = [];
        for (let j = 0; j < this.getColumns(); j++) {
            let startRow, deltaRow, startColumn, deltaColumn;
            switch (this.fallDirection) {
                case 'down':
                    startRow = 0;
                    deltaRow = 1;
                    startColumn = j;
                    deltaColumn = 0;
                    break;
                case 'up':
                    startRow = this.getRows() - 1;
                    deltaRow = -1;
                    startColumn = j;
                    deltaColumn = 0;
                    break;
                case 'left':
                    startRow = 0;
                    deltaRow = 0;
                    startColumn = j;
                    deltaColumn = -1;
                    break;
                case 'right':
                    startRow = 0;
                    deltaRow = 0;
                    startColumn = this.getColumns() - 1;
                    deltaColumn = 1;
                    break;
            }
            if (this.isEmpty(startRow, startColumn)) {
                let emptySpaces;
                if (this.fallDirection === 'down' || this.fallDirection === 'up') {
                    emptySpaces = this.countEmptySpaces(startRow, startColumn, this.fallDirection) + 1;
                    for (let i = startRow, count = 0; count < emptySpaces; i += deltaRow, count++) {
                        let randomValue = Math.floor(Math.random() * this.items);
                        result.push({
                            row: i,
                            column: startColumn,
                            deltaRow: emptySpaces
                        });
                        this.gameArray[i][startColumn].value = randomValue;
                        this.gameArray[i][startColumn].isEmpty = false;
                    }
                } else if (this.fallDirection === 'left' || this.fallDirection === 'right') {
                    emptySpaces = this.countEmptySpaces(startRow, startColumn, this.fallDirection) + 1;
                    for (let j = startColumn, count = 0; count < emptySpaces; j += deltaColumn, count++) {
                        let randomValue = Math.floor(Math.random() * this.items);
                        result.push({
                            row: startRow,
                            column: j,
                            deltaColumn: emptySpaces
                        });
                        this.gameArray[startRow][j].value = randomValue;
                        this.gameArray[startRow][j].isEmpty = false;
                    }
                }
            }
        }
        return result;
    }
    emptySpacesBelow(row, column) {
        let result = 0;
        if (row != this.getRows()) {
            for (let i = row + 1; i < this.getRows(); i++) {
                if (this.isEmpty(i, column)) {
                    result++;
                }
            }
        }
        return result;
    }

    swapItems(row, column, row2, column2) {
        let tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
    }

    alreadyVisited(row, column) {
        let found = false;
        this.floodFillArray.forEach(function (item) {
            if (item.row == row && item.column == column) {
                found = true;
            }
        });
        return found;
    }

    // Set fall direction
    setFallDirection(direction) {
        this.fallDirection = direction;
    }

    // get fall direction
    getFallDirection(direction) {
        return this.fallDirection;
    }

    // Set minimum connected gems for removal
    setMinConnected(minConnected) {
        this.minConnected = minConnected;
    }
}

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
class GameScreen extends Phaser.Scene{
    constructor(){
        super("GameScreen");
    }
    preload(){
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
    }
    create(){
        // Create top area with goal number
        this.goal = 500;
        this.goalText = this.add.text(20, 20, 'Goal: ' + this.goal, { fontSize: '32px', fill: '#fff' });

        // Create game area
        this.score = 0;
        this.scoreText = this.add.text(20, 60, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.sameGame = new SameGame({
            rows: 8,
            columns: 7,
            items: 4
        });
        this.sameGame.generateBoard();
        this.drawField();
        this.canPick = true;
        this.input.on("pointerdown", this.tileSelect, this);

        // Create area for player items
        this.playerItems = this.add.text(20, 600, 'Player Items', { fontSize: '32px', fill: '#fff' });
    }

    // Function to draw the game field
    drawField(){
        this.poolArray = [];
        for(let i = 0; i < this.sameGame.getRows(); i ++){
            for(let j = 0; j < this.sameGame.getColumns(); j ++){
                let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
                let gem = this.add.sprite(gemX, gemY, "tiles", this.sameGame.getValueAt(i, j));
                this.sameGame.setCustomData(i, j, gem);
            }
        }
    }

    // Function to handle tile selection
    tileSelect(pointer){
        if(this.canPick){
            let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
            if(this.sameGame.validPick(row, col)){
                if(this.sameGame.countConnectedItems(row, col) > 2){
                    this.canPick = false;
                    let gemsToRemove = this.sameGame.listConnectedItems(row, col);
                    let destroyed = 0;
                    gemsToRemove.forEach(function(gem){
                        destroyed ++;
                        this.poolArray.push(this.sameGame.getCustomDataAt(gem.row, gem.column))
                        this.tweens.add({
                            targets: this.sameGame.getCustomDataAt(gem.row, gem.column),
                            alpha: 0,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function(){
                                destroyed --;
                                if(destroyed == 0){
                                    this.sameGame.removeConnectedItems(row, col)
                                    this.makeGemsFall();
                                }
                            }
                        });
                    }.bind(this))
                    // Calculate score based on the number of gems removed
                    let gemsRemoved = gemsToRemove.length;
                    let scoreDelta = gemsRemoved * 10; // Adjust as needed
                    this.score += scoreDelta;

                    // Update score text
                    this.scoreText.setText('Score: ' + this.score);
                }
            }
        }
    }

    // Function to make gems fall
    makeGemsFall(fallDirection = this.sameGame.getFallDirection()){
        let fallingGems = 0;
        let movements = this.sameGame.arrangeBoard(fallDirection);
        let replenishMovements = this.sameGame.replenishBoard(fallDirection);
        movements.forEach(function(movement){
            fallingGems ++;
            let targetX = this.sameGame.getCustomDataAt(movement.row, movement.column).x;
            let targetY = this.sameGame.getCustomDataAt(movement.row, movement.column).y;
            switch(fallDirection){
                case 'up':
                    targetY -= gameOptions.gemSize * movement.deltaRow;
                    break;
                case 'down':
                    targetY += gameOptions.gemSize * movement.deltaRow;
                    break;
                case 'left':
                    targetX -= gameOptions.gemSize * movement.deltaRow;
                    break;
                case 'right':
                    targetX += gameOptions.gemSize * movement.deltaRow;
                    break;
            }
            this.tweens.add({
                targets: this.sameGame.getCustomDataAt(movement.row, movement.column),
                x: targetX,
                y: targetY,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function(){
                    fallingGems --;
                    if(fallingGems == 0){
                        this.canPick = true
                    }
                }
            })
        }.bind(this))
        replenishMovements.forEach(function(movement){
            fallingGems ++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            let targetX = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2;
            let targetY = gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2;
            switch(fallDirection){
                case 'up':
                    targetY -= gameOptions.gemSize * movement.deltaRow;
                    break;
                case 'down':
                    targetY += gameOptions.gemSize * movement.deltaRow;
                    break;
                case 'left':
                    targetX -= gameOptions.gemSize * movement.deltaRow;
                    break;
                case 'right':
                    targetX += gameOptions.gemSize * movement.deltaRow;
                    break;
            }
            sprite.y = targetY;
            sprite.x = targetX;
            sprite.setFrame(this.sameGame.getValueAt(movement.row, movement.column));
            this.sameGame.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: targetY,
                x: targetX,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function(){
                    fallingGems --;
                    if(fallingGems == 0){
                        this.canPick = true
                    }
                }
            });
        }.bind(this))
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

window.onload = function() {
    // Define game configuration
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [StartScreen, ShopScreen, GameScreen, EndScreen]
    };

    // Create a new Phaser game instance
    let game = new Phaser.Game(config);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}