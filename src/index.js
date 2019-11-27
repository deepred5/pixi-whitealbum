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


PIXI.loader
  .add('setsuna', setsunaImg)
  .add('touma', toumaImg)
  .load(setup);

let setsuna = null;
let touma = null;
let gameBeginScene = null;

const toumaAnimateYBegin = finalHeight - 560;
const toumaAnimateYEnd = finalHeight - 580;

const setsunaAnimateYBegin = finalHeight - 566;
const setsunaAnimateYEnd = finalHeight - 510;
function setup() {

  // 最底层的场景，用于缩放
  const rootContainer = new PIXI.Container();
  app.stage.addChild(rootContainer);
  rootContainer.scale.set(screenScaleRito, screenScaleRito);


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
  // app.ticker.add(delta => gameLoop(delta));

  TweenMax.to(setsuna, 1, { y: setsunaAnimateYEnd });
  TweenMax.to(touma, 1, { y: toumaAnimateYEnd });
  // 透明度使用线性缓动
  TweenMax.to(gameBeginScene, 1, { alpha: 1, ease: Power0.easeNone });
}

function gameLoop(delta) {
  // if (touma.y >= toumaAnimateYEnd) {
  //   gameBeginScene.alpha += .01;
  // }
}