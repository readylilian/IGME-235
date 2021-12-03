"use strict";
const app = new PIXI.Application({
    width: 800,
    height: 800,
    backgroundColor: 0xfaf0e6
});
document.querySelector("#draw").appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;



let stage;
let titleScene,instScene,countScene,gameScene,endScene;
let countDown;
let timer;

let brushType = "Circle";
let brushSize = 10;
let brushColor = 0x000000;

let mouseDown;
let savedImages;

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

function setup() {
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

    createLabelsAndButtons();

    app.view.onpointerdown = Draw;
    app.view.onpointerup = StopDraw;
    app.view.onpointerout = StopDraw;
}

function createLabelsAndButtons()
{
    let titleStyle = new PIXI.TextStyle({
        padding:20,
        fill: 0x515151,
        fontSize: 120,
        fontFamily:"Amatic SC"
    });
    let countStyle = new PIXI.TextStyle({
        fill: 0x515151,
        fontSize: 300,
        fontFamily:"Amatic SC"
    });
    let paraStyle = new PIXI.TextStyle({
        fill: 0x515151,
        fontSize: 70,
        fontFamily:"Amatic SC"
    });
    let textButtonStyle = new PIXI.TextStyle({
        fill: 0x515151,
        fontSize: 70,
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
    instButton.style = textButtonStyle;
    instButton.x = 250;
    instButton.y = 350;
    instButton.interactive = true;
    instButton.buttonMode = true;
    instButton.on("pointerup", showInst);
    titleScene.addChild(instButton);
    //Start button
    let startButton = new PIXI.Text("Start!");
    startButton.style = textButtonStyle;
    startButton.x = 300;
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
    backButton.style = textButtonStyle;
    backButton.x = 20;
    backButton.y = 650;
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.on("pointerup", showTitle);
    instScene.addChild(backButton);
    //Countdown scene
    let count1 = new PIXI.Text("1!");
    count1.style = countStyle;
    count1.x = 330;
    count1.y = 300;
    count1.visible = false;
    countScene.addChild(count1);
    let count2 = new PIXI.Text("2!");
    count2.style = countStyle;
    count2.x = 330;
    count2.y = 300;
    count2.visible = false;
    countScene.addChild(count2);
    let count3 = new PIXI.Text("3!");
    count3.style = countStyle;
    count3.x = 330;
    count3.y = 300;
    countScene.addChild(count3);

}
function showTitle(){
    titleScene.visible = true;
    instScene.visible = false;
    countScene.visible = false;
    gameScene.visible = false;
    endScene.visible = false;
}
function showInst(){
    titleScene.visible = false;
    instScene.visible = true;
}
function showCount()
{
    titleScene.visible = false;
    countScene.visible = true;
    gameScene.visible = false;
    endScene.visible = false;
    countDown = 3;
    setTimeout(function(){
        EraseAll();
        showGame();
        console.log("called showGame");
    },3000);
    timer = setInterval(() => {
        countDown--;
        countScene.children[countDown].visible = false;
        countScene.children[countDown-1].visible = true;
    }, 1000);
}
function showGame(){
    clearInterval(timer);
    titleScene.visible = false;
    countScene.visible = false;
    gameScene.visible = true;
    setTimeout(() => {
        showEnd();
        //savedImages += `<img src="${app.renderer.plugins.extract.image()}" alt ="Your drawing!">`;
        //savedImages = app.renderer.plugins.extract.image(gameScene);
        app.renderer.plugins.extract.canvas(gameScene).toBlob((b)=>{
            let a = document.createElement(`<img = "${URL.createObjectURL(b)}>`);
            document.querySelector("#photobank").append(a);
        }, 'image/png');
        //document.querySelector("#photobank").appendChild(savedImages);
        //document.querySelector("#photobank").innerHTML = savedImages;
        console.log("called showEnd");
    }, 6000);
}
function showEnd(){
    clearInterval(timer);
    gameScene.visible = false;
    endScene.visible = true;
}
function StopDraw(e){
    if(mouseDown){
        clearInterval(mouseDown);
    }
}
function Draw(e){
    mouseDown = setInterval(function(){

        let mousePos = app.renderer.plugins.interaction.mouse.global;

        let newX = clamp(mousePos.x, 0, sceneWidth);
        let newY = clamp(mousePos.y, 0, sceneHeight);
        //let newX = mousePos.x;
        //let newY = mousePos.y;
        console.log(newX + ", " + newY);
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
                let s = new Square(newX, newY, brushSize,brushColor);
                gameScene.addChild(s);
                break;
            case "Star":
                let st = new Star(newX, newY, brushSize,brushColor);
                gameScene.addChild(st);
                break;
        }
    },1);
}
function EraseAll(){
    while(gameScene.children[0]){
        gameScene.removeChild(gameScene.children[0]);
    }
}