function DropArea(x,y,width, height,color){
  var m_rectangle = new Phaser.Rectangle(x, y, width, height);
  var m_color = color;

  var m_objects = [];

  this.getRectangle = function (){
    return m_rectangle;
  }

  this.getColor = function (){
    return m_color;
  }

  this.addObject = function(object){
    m_objects.push(object);
    rearrangeObjects();
  }

  var rearrangeObjects = function(){
    for (var i = 0; i < m_objects.length; ++i){
      m_objects[i].y = m_rectangle.y;
      m_objects[i].x = m_rectangle.x + 110 * i;
    }
  }

  this.removeObject = function(object){
    var index = m_objects.indexOf(object);

    if (index != -1){
      m_objects.splice(index, 1);
      rearrangeObjects();
    }    
  }

  this.isFull = function(){
    return m_objects.length > 0;
  }
} 

var GAME_WIDTH = 1024;
var GAME_HEIGHT = 768;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render });

var fruits;
var dropAreas = [];
var fx;
var gameEnd = false;

function preload() {
  game.load.image('fruit0', 'assets/fruit0.jpg');
  game.load.image('fruit1', 'assets/fruit1.jpg');
  game.load.image('fruit2', 'assets/fruit2.jpg');
  game.load.image('fruit3', 'assets/fruit3.jpg');

  game.load.audio('victory', 'assets/vitoria.mp3');
}

function create() {
  
  game.stage.backgroundColor = '#2d2d2d';
  
  fx = game.add.audio('victory');
  
  for (var i = 0; i < 4; ++i){
    var fruit = game.add.sprite(100, 30 + 120 * i, 'fruit' + i);
    fruit.name = 'fruit_' + i;

    fruit.inputEnabled = true;

    fruit.input.enableDrag(true);

    fruit.events.onDragStop.add(fixLocation);
    fruit.events.onDragStart.add(removeFromArea);
  }

  for (var i = 0; i < 4; ++i){
    var dropArea = new DropArea(300, 30 + 140 * i, 500, 120, '#0fffff');

    dropAreas.push(dropArea);
  }
}

function update () {
  if (gameEnd) return;

  var shouldWin = true;

  for (var i = 0; i < dropAreas.length; ++i){
    if (!dropAreas[i].isFull()){
      shouldWin = false;
      break;
    }
  }

  if (shouldWin){
    fx.play();
    gameEnd = true;
  }

}

function render(){
  for (var i = 0; i < dropAreas.length; ++i)
    game.debug.geom(dropAreas[i].getRectangle(), dropAreas[i].getColor() , false);
}

function removeFromArea(item){
  for (var i = 0; i < dropAreas.length; ++i){
    dropAreas[i].removeObject(item);
  }
}

function fixLocation(item){
  for (var i = 0; i < dropAreas.length; ++i){
    if(dropAreas[i].getRectangle().contains(item.x,item.y)){
      dropAreas[i].addObject(item);
      return;
    }
  }

  item.x = 100;
}
