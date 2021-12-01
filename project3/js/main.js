"use strict";
const app = new PIXI.Application({
    width: 800,
    height: 800,
    backgroundColor: 0xfaf0e6
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;



let stage;
let startScene;
let countDown;
let gameScene;
let gameEnd;

let brushType = "Square";
let brushSize = 10;
let brushColor = 0x000000;

let mouseDown;

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

function setup() {
	stage = app.stage;
	//Create the main `game` scene
    gameScene = new PIXI.Container();
    stage.addChild(gameScene);

    app.view.onpointerdown = Draw;
    app.view.onpointerup = StopDraw;
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
    },10);
    
}