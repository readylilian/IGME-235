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
let startScene;
let countDown;
let gameScene;
let gameEnd;

let brushType = "Star";
let brushSize = 10;
let brushColor = 0x000000;

let mouseDown;

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

function setup() {
	stage = app.stage;
    //Create the Title Screen
    titleScene = new PIXI.Container();
    stage.addChild(titleScene);
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
    let titleLabel1 = new PIXI.TextStyle({
        
    })
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
    while(gameScene.firstChild){
        gameScene.removeChild(gameScene.firstChild);
    }
}