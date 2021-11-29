"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600,
    backgroundColor: 0xfaf0e6
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;