import * as PIXI from 'pixi.js';
import { TweenMax, Power0 } from "gsap/all";

import './styles/global.css';

import setsunaImg from '../assets/setsuna.png';
import toumaImg from '../assets/touma.png';

const originWidth = 750;

const clientWidth = window.innerWidth;
const clientHeight = window.innerHeight;

const screenScaleRito = window.innerWidth / originWidth;

const finalHeight = clientHeight / screenScaleRito;

const app = new PIXI.Application({
  width: clientWidth,
  height: clientHeight,
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1       // default: 1
});

document.body.appendChild(app.view);

var points = [];
var maxDist = 100;
var circleArr = [];

function point() {
  this.x = Math.random() * (clientWidth + maxDist) - (maxDist / 2);
  this.y = Math.random() * (clientHeight + maxDist) - (maxDist / 2);
  this.z = (Math.random() * 0.5) + 0.5;
  this.vx = ((Math.random() * 2) - 0.5) * this.z;
  this.vy = ((Math.random() * 1.5) + 1.5) * this.z;
  this.fill = "rgba(255,255,255," + ((0.5 * Math.random()) + 0.5) + ")";
  this.dia = ((Math.random() * 2.5) + 1.5) * this.z;
  this.alpha = ((0.5 * Math.random()) + 0.5);
  points.push(this);
}

function generatePoints(amount) {
  var temp;
  for (var i = 0; i < amount; i++) {
    temp = new point();
  };
}

generatePoints(100);


PIXI.loader
  .add('setsuna', setsunaImg)
  .add('touma', toumaImg)
  .load(setup);

let setsuna = null;
let touma = null;
let gameBeginScene = null;
let snowScene = null;

const toumaAnimateYBegin = finalHeight - 560;
const toumaAnimateYEnd = finalHeight - 580;

const setsunaAnimateYBegin = finalHeight - 566;
const setsunaAnimateYEnd = finalHeight - 510;

function update(obj) {
  obj.x += obj.vx;
  obj.y += obj.vy;
  if (obj.x > clientWidth + (maxDist / 2)) {
    obj.x = -(maxDist / 2);
  }
  else if (obj.xpos < -(maxDist / 2)) {
    obj.x = clientWidth + (maxDist / 2);
  }
  if (obj.y > clientHeight + (maxDist / 2)) {
    obj.y = -(maxDist / 2);
  }
  else if (obj.y < -(maxDist / 2)) {
    obj.y = clientHeight + (maxDist / 2);
  }
}


function setup() {

  // 最底层的场景，用于缩放
  const rootContainer = new PIXI.Container();
  app.stage.addChild(rootContainer);
  rootContainer.scale.set(screenScaleRito, screenScaleRito);

  // 雪花容器
  snowScene = new PIXI.Container();
  snowScene.scale.set(1 / screenScaleRito, 1 / screenScaleRito);
  rootContainer.addChild(snowScene);

  for (var i = 0; i < points.length; i++) {
    let circle = new PIXI.Graphics();
    let obj = points[i];
    circle.beginFill(0xFFFFFF, obj.alpha);
    circle.drawCircle(0, 0, obj.dia);
    circle.endFill();
    circle.x = obj.x;
    circle.y = obj.y;
    snowScene.addChild(circle);
    circleArr.push(circle);
  };

  // 场景1 开场动画
  gameBeginScene = new PIXI.Container();
  rootContainer.addChild(gameBeginScene);

  gameBeginScene.alpha = 0;


  // 冬马Sprite
  touma = new PIXI.Sprite(PIXI.loader.resources['touma'].texture);
  touma.y = toumaAnimateYBegin;
  touma.x = 370;
  gameBeginScene.addChild(touma);

  // 雪菜Sprite
  setsuna = new PIXI.Sprite(PIXI.loader.resources['setsuna'].texture);
  setsuna.y = setsunaAnimateYBegin;
  setsuna.x = 40;
  gameBeginScene.addChild(setsuna);

  // 每秒执行60次该方法，类似requestAnimationFrame
  app.ticker.add(delta => gameLoop(delta));

  TweenMax.to(setsuna, 1, { y: setsunaAnimateYEnd, delay: 0.5 });
  TweenMax.to(touma, 1, { y: toumaAnimateYEnd, delay: 0.5 });
  // 透明度使用线性缓动
  TweenMax.to(gameBeginScene, 1, { alpha: 1, ease: Power0.easeNone, delay: 0.5 });
}

function gameLoop(delta) {
  for (let i = 0; i < points.length; i++) {
    update(points[i]);
    let obj = points[i];
    let circle = circleArr[i];
    circle.x = obj.x;
    circle.y = obj.y;
  };
}