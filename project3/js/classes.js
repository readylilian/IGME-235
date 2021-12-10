//Set up class (brush) constructors
//Create circles when called
class Circle extends PIXI.Graphics{
    constructor(x=0, y=0, radius, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawCircle(0,0,radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
//Create squares when called
class Square extends PIXI.Graphics{
    constructor(x=0, y=0, width, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawRect(0,0,width, width);
        this.endFill();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = width;
    }
}
//Create triangles when called
class Triangle extends PIXI.Graphics{
    constructor(x=0, y=0, radius, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawRegularPolygon(0,0,radius, 3,0);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius
    }
}
//Create stars when called
class Star extends PIXI.Graphics{
    constructor(x=0, y=0, radius, color = 0x000000){
        super();
        this.beginFill(color);
        this.drawStar(0, 0, 5, radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}