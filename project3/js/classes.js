class Circle extends PIXI.Graphics{
    constructor(x=0, y=0, radius, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawCircle(x,y,radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
class Rect extends PIXI.Graphics{
    constructor(x=0, y=0, width, height, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawRect(x,y,width, height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Triangle extends PIXI.Graphics{
    constructor(x=0, y=0, radius, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawRegularPolygon(x,y,radius, 3,0);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius
    }
}
class Star extends PIXI.Graphics{
    constructor(x=0, y=0, radius, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawStar(x, y, 5, radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}