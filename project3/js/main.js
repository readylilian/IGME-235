"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 700,
    backgroundColor: 0xfaf0e6
});
document.querySelector("#draw").appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
const imageKey = "lr4631-images";
let storedImages = localStorage.getItem(imageKey);

let currentWord;
let stage;
let titleScene,instScene,countScene,gameScene,endScene;
let countDown, timer;
let backSound, countSound, switchSound;
let buttonSheet,buttonRad;
//let soundOn = true;

let brushType = "Circle";
let brushSize = 10;
let brushColor = 0x000000;

let mouseDown;

let typeArray, sizeArray, colorArray;

//Creates the scenes
//Loads the spritesheet buttons
//sets up the sounds and assigns when you can and can't draw
function setup() {
    buttonRad = 50;
	stage = app.stage;
    //Create the Title Screen
    titleScene = new PIXI.Container();
    stage.addChild(titleScene);
    //Create the instruction screen
    instScene = new PIXI.Container();
    instScene.visible = false;
    stage.addChild(instScene);
    //Create the countdown screen
    countScene = new PIXI.Container();
    countScene.visible = false;
    stage.addChild(countScene);
	//Create the main `game` scene
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    //Create the end scene
    endScene = new PIXI.Container();
    endScene.visible = false;
    stage.addChild(endScene);

    buttonSheet = app.loader.resources.buttons;
    createLabelsAndButtons();
    //Create the sounds
    backSound = new Howl({
        src: ['media/sounds/backing.mp3'],
        autoplay:true,
        loop:true,
        volume: 0.3
    });
    countSound = new Howl({
        src: ['media/sounds/countdown.wav']
    });
    switchSound = new Howl({
        src:['media/sounds/switch.wav']
    });

    app.view.onpointerdown = draw;
    app.view.onpointerup = stopDraw;
    app.view.onpointerout = stopDraw;
}
//creates the labels and buttons for all screens except the gameScreen
//(gameScreen gets cleared so that screenshots work correctly, so it needs a separate method)
function createLabelsAndButtons()
{
    //Different styles
    let titleStyle = new PIXI.TextStyle({
        padding:20,
        fill: 0x515151,
        fontSize: 80,
        fontFamily:"Amatic SC"
    });
    let countStyle = new PIXI.TextStyle({
        padding:40,
        fill: 0x515151,
        fontSize: 300,
        fontFamily:"Amatic SC"
    });
    let paraStyle = new PIXI.TextStyle({
        padding:20,
        fill: 0x515151,
        fontSize: 50,
        fontFamily:"Amatic SC"
    });
    //Title screen setup
    //Title
    let titleLabel = new PIXI.Text("Luck of the Draw!");
    titleLabel.x = 100;
    titleLabel.y = 200;
    titleLabel.nextLineHeightBehavior = true;
    titleLabel.style = titleStyle;
    titleScene.addChild(titleLabel);
    //How to play button
    let instButton = new PIXI.Text("How to Play");
    instButton.style = paraStyle;
    instButton.x = 200;
    instButton.y = 350;
    instButton.interactive = true;
    instButton.buttonMode = true;
    instButton.on("pointerup", showInst);
    titleScene.addChild(instButton);
    //Start button
    let startButton = new PIXI.Text("Start!");
    startButton.style = paraStyle;
    startButton.x = 240;
    startButton.y = 450;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup",showCount);
    titleScene.addChild(startButton);
    //Instruction screen
    //instructions
    let instLabel = new PIXI.Text(`1) Press "Start"\n2) A 60 second timer will begin, \n and a word will appear at the top \nof the screen\n3) You have until time runs out \nto draw the word\n4) When the timer runs out, \nwe'll take a picture`);
    instLabel.style = paraStyle;
    instLabel.x = 20;
    instLabel.y = 100;
    instScene.addChild(instLabel);
    //back button
    let backButton = new PIXI.Text("Back");
    backButton.style = paraStyle;
    backButton.x = 20;
    backButton.y = 650;
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.on("pointerup", showTitle);
    instScene.addChild(backButton);
    //Countdown scene
    let count1 = new PIXI.Text("1!");
    count1.style = countStyle;
    count1.x = 230;
    count1.y = 200;
    count1.visible = false;
    countScene.addChild(count1);
    let count2 = new PIXI.Text("2!");
    count2.style = countStyle;
    count2.x = 230;
    count2.y = 200;
    count2.visible = false;
    countScene.addChild(count2);
    let count3 = new PIXI.Text("3!");
    count3.style = countStyle;
    count3.x = 230;
    count3.y = 200;
    countScene.addChild(count3);

    //End Scene
    let playButton = new PIXI.Text("Play again?");
    playButton.style = paraStyle;
    playButton.x = 200;
    playButton.y = 300;
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on("pointerup", showCount);
    endScene.addChild(playButton);
    
    let endBack = new PIXI.Text("Exit");
    endBack.style = paraStyle;
    endBack.x = 250;
    endBack.y = 400;
    endBack.interactive = true;
    endBack.buttonMode = true;
    endBack.on("pointerup", showTitle);
    endScene.addChild(endBack);
}
//Shows the title screen
function showTitle(){
    titleScene.visible = true;
    instScene.visible = false;
    countScene.visible = false;
    gameScene.visible = false;
    endScene.visible = false;
}
//Shows the instructions
function showInst(){
    titleScene.visible = false;
    instScene.visible = true;
}
//Shows the countdown and launches the game scene after three seconds
function showCount()
{
    titleScene.visible = false;
    countScene.visible = true;
    gameScene.visible = false;
    endScene.visible = false;
    countDown = 3;
    getWord();
    countSound.play();
    //after three seconds, switch to the game
    setTimeout(function(){
        eraseAll();
        createGameScene();
        countScene.children[0].visible = false;
        countScene.children[2].visible = true;
        showGame();
    },3000);
    //every second, move to the next number
    timer = setInterval(() => {
        countDown--;
        countScene.children[countDown].visible = false;
        countScene.children[countDown-1].visible = true;
    }, 1000);
}
//the actual game loop
function showGame(){
    clearInterval(timer);
    titleScene.visible = false;
    countScene.visible = false;
    gameScene.visible = true;
    countDown = 60;
    document.querySelector("#count").innerHTML = `${countDown}`;
    //set game to end after 60 seconds
    setTimeout(() => {
        //Remove buttons first
        for(let i = 0; i< 13; i++){
            gameScene.removeChild(gameScene.children[0]);
        }
        //if there's anything drawn on screen without the buttons
        //then take a picture and add it to the gallery with a title
        if(gameScene.children[0]){
            let newImage = document.createElement("div");
            newImage.className = "drawing"
            let savedImage = app.renderer.plugins.extract.image(gameScene);
            newImage.appendChild(savedImage);
            let newTitle = document.createElement("h2");
            newTitle.textContent = currentWord;
            newImage.appendChild(newTitle);
            let photobank = document.querySelector("#photobank");
            //storedImages = newImage;
            photobank.appendChild(newImage);
            //Three pictures shown at a time, if there's more than three remove the first image in the gallery, and add the most recent to the bottom
            if(photobank.childElementCount>4){
                photobank.removeChild(photobank.children[1]);
            }
            
        }
        //then display the endscreen
        countDown = 0;
        document.querySelector("#count").innerHTML = "";
        showEnd();
    }, 60000);
    timer = setInterval(() => {
        countDown--;
        document.querySelector("#count").innerHTML = `${countDown}`;
    }, 1000);
}
//Clear the old word and reset the timer to zero
//Show the end screen
function showEnd(){
    clearWord();
    clearInterval(timer);
    gameScene.visible = false;
    endScene.visible = true;
}
//Stop the mouseDown interval
//No drawing outside of screen or on the buttons
function stopDraw(e){
    if(mouseDown){
        clearInterval(mouseDown);
    }
}
//Every millisecond allow draw to be called (program can't call fast enough if allowed beyond that rate)
//This will create dots if drawn too quickly:-(
//Change what is being drawn based on brush type, size and color
function draw(e){
    mouseDown = setInterval(function(){
        let mousePos = app.renderer.plugins.interaction.mouse.global;
        if(mousePos.y < sceneHeight- (buttonRad * 2)){
            let newX = clamp(mousePos.x, 0 + brushSize, sceneWidth - brushSize);
            let newY = clamp(mousePos.y, 0 + brushSize, sceneHeight - (buttonRad * 2) - brushSize);
            switch(brushType){
                case "Circle":
                    let c = new Circle(newX,newY,brushSize,brushColor);
                    gameScene.addChild(c);
                    break;
                case "Triangle":
                    let t = new Triangle(newX, newY, brushSize,brushColor);
                    gameScene.addChild(t);
                    break;
                case "Square":
                    newX = clamp(mousePos.x, 0, sceneWidth - brushSize);
                    newY = clamp(mousePos.y, 0, sceneHeight - 200 - brushSize);
                    let s = new Square(newX, newY, brushSize,brushColor);
                    gameScene.addChild(s);
                    break;
                case "Star":
                    let st = new Star(newX, newY, brushSize,brushColor);
                    gameScene.addChild(st);
                    break;
            }
        }   
    },1);
}
//Erases the drawing from gameScene by removing all children
function eraseAll(){
    while(gameScene.children[0]){
        gameScene.removeChild(gameScene.children[0]);
    }
    typeArray = "";
    sizeArray = "";
    colorArray = "";
}
//since we need to clear the drawings each round, and remove the buttons to take the picture,
//buttons need to be reinstated each round 
function createGameScene(){
    //Player scene buttons
    //Brush shape
    let circleBrush = new PIXI.Sprite(buttonSheet.textures["circle.png"]);
    circleBrush.anchor.set(0.5);
    circleBrush.value = "Circle";
    circleBrush.width = buttonRad;
    circleBrush.height = buttonRad;
    circleBrush.x = 25;
    circleBrush.y = 625;
    circleBrush.interactive = true;
    circleBrush.buttonMode = true;
    circleBrush.on("pointerup",changeActiveBrush);
    gameScene.addChild(circleBrush);

    let squareBrush = new PIXI.Sprite(buttonSheet.textures["square.png"]);
    squareBrush.anchor.set(0.5);
    squareBrush.value = "Square";
    squareBrush.width = buttonRad;
    squareBrush.height = buttonRad;
    squareBrush.x = 100;
    squareBrush.y =625;
    squareBrush.interactive = true;
    squareBrush.buttonMode = true;
    squareBrush.on("pointerup",changeActiveBrush);
    gameScene.addChild(squareBrush);

    let triBrush = new PIXI.Sprite(buttonSheet.textures["triangle.png"]);
    triBrush.anchor.set(0.5);
    triBrush.value = "Triangle";
    triBrush.width = buttonRad;
    triBrush.height = buttonRad;
    triBrush.x = 175;
    triBrush.y = 625;
    triBrush.interactive = true;
    triBrush.buttonMode = true;
    triBrush.on("pointerup",changeActiveBrush);
    gameScene.addChild(triBrush);

    let starBrush = new PIXI.Sprite(buttonSheet.textures["star.png"]);
    starBrush.anchor.set(0.5);
    starBrush.value = "Star";
    starBrush.width = buttonRad;
    starBrush.height = buttonRad;
    starBrush.x = 250;
    starBrush.y = 625;
    starBrush.interactive = true;
    starBrush.buttonMode = true;
    starBrush.on("pointerup",changeActiveBrush);
    gameScene.addChild(starBrush);


    //Brush width
    let smallBrush = new PIXI.Sprite(buttonSheet.textures["10px.png"]);
    smallBrush.anchor.set(0.5);
    smallBrush.value = "2";
    smallBrush.width = buttonRad;
    smallBrush.height = buttonRad;
    smallBrush.x = 400;
    smallBrush.y = 625;
    smallBrush.interactive = true;
    smallBrush.buttonMode = true;
    smallBrush.on("pointerup",changeActiveSize);
    gameScene.addChild(smallBrush);

    let midBrush = new PIXI.Sprite(buttonSheet.textures["50px.png"]);
    midBrush.anchor.set(0.5);
    midBrush.value = "10";
    midBrush.width = buttonRad;
    midBrush.height = buttonRad;
    midBrush.x = 475;
    midBrush.y = 625;
    midBrush.interactive = true;
    midBrush.buttonMode = true;
    midBrush.on("pointerup",changeActiveSize);
    gameScene.addChild(midBrush);

    let largeBrush = new PIXI.Sprite(buttonSheet.textures["100px.png"]);
    largeBrush.anchor.set(0.5);
    largeBrush.value = "50";
    largeBrush.width = buttonRad;
    largeBrush.height = buttonRad;
    largeBrush.x = 550;
    largeBrush.y = 625;
    largeBrush.interactive = true;
    largeBrush.buttonMode = true;
    largeBrush.on("pointerup",changeActiveSize);
    gameScene.addChild(largeBrush);
    //Brush color
    let blackBrush = new PIXI.Sprite(buttonSheet.textures["black.png"]);
    blackBrush.anchor.set(0.5);
    blackBrush.value = "0x000000";
    blackBrush.width = buttonRad;
    blackBrush.height = buttonRad;
    blackBrush.x = 100;
    blackBrush.y = 675;
    blackBrush.interactive = true;
    blackBrush.buttonMode = true;
    blackBrush.on("pointerup",changeActiveColor);
    gameScene.addChild(blackBrush);
    
    let whiteBrush = new PIXI.Sprite(buttonSheet.textures["white.png"]);
    whiteBrush.anchor.set(0.5);
    whiteBrush.value = "0xFFFFFF";
    whiteBrush.width = buttonRad;
    whiteBrush.height = buttonRad;
    whiteBrush.x = 175;
    whiteBrush.y = 675;
    whiteBrush.interactive = true;
    whiteBrush.buttonMode = true;
    whiteBrush.on("pointerup",changeActiveColor);
    gameScene.addChild(whiteBrush);

    let redBrush = new PIXI.Sprite(buttonSheet.textures["red.png"]);
    redBrush.anchor.set(0.5);
    redBrush.value = "0xFF0000";
    redBrush.width = buttonRad;
    redBrush.height = buttonRad;
    redBrush.x = 250;
    redBrush.y = 675;
    redBrush.interactive = true;
    redBrush.buttonMode = true;
    redBrush.on("pointerup",changeActiveColor);
    gameScene.addChild(redBrush);

    let blueBrush = new PIXI.Sprite(buttonSheet.textures["blue.png"]);
    blueBrush.anchor.set(0.5);
    blueBrush.value = "0x0000FF";
    blueBrush.width = buttonRad;
    blueBrush.height = buttonRad;
    blueBrush.x = 325;
    blueBrush.y = 675;
    blueBrush.interactive = true;
    blueBrush.buttonMode = true;
    blueBrush.on("pointerup",changeActiveColor);
    gameScene.addChild(blueBrush);

    let yellBrush = new PIXI.Sprite(buttonSheet.textures["yellow.png"]);
    yellBrush.anchor.set(0.5);
    yellBrush.value = "0xFFFF00";
    yellBrush.width = buttonRad;
    yellBrush.height = buttonRad;
    yellBrush.x = 400;
    yellBrush.y = 675;
    yellBrush.interactive = true;
    yellBrush.buttonMode = true;
    yellBrush.on("pointerup",changeActiveColor);
    gameScene.addChild(yellBrush);

    let greenBrush = new PIXI.Sprite(buttonSheet.textures["green.png"]);
    greenBrush.anchor.set(0.5);
    greenBrush.value = "0x00FF00";
    greenBrush.width = buttonRad;
    greenBrush.height = buttonRad;
    greenBrush.x = 475;
    greenBrush.y = 675;
    greenBrush.interactive = true;
    greenBrush.buttonMode = true;
    greenBrush.on("pointerup",changeActiveColor);
    gameScene.addChild(greenBrush);

    sizeArray = [smallBrush,midBrush,largeBrush];
    typeArray = [circleBrush,squareBrush,triBrush,starBrush];
    colorArray = [blackBrush,whiteBrush,redBrush,greenBrush,blueBrush,yellBrush];

    for(let i = 0; i<typeArray.length;i++){
        if(typeArray[i].value==brushType){
            typeArray[i].alpha = 1;
        }
        else{
            typeArray[i].alpha = 0.5;
        }
    }
    for(let i = 0; i<sizeArray.length;i++){
        if(sizeArray[i].value==brushSize){
            sizeArray[i].alpha = 1;
        }
        else{
            sizeArray[i].alpha = 0.5;
        }
    }
    for(let i = 0; i<colorArray.length;i++){
        if(colorArray[i].value==brushColor){
            colorArray[i].alpha = 1;
        }
        else{
            colorArray[i].alpha = 0.5;
        }
    }
}