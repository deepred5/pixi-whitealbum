import * as PIXI from 'pixi.js';

import './styles/global.css';

import setsunaImg from '../assets/setsuna.png';
import toumaImg from '../assets/touma.png';

const originWidth = 750;

const clientWidth = window.innerWidth;
const clientHeight = window.innerHeight;

const screenScaleRito = window.innerWidth / originWidth;

const finalHeight = clientHeight / screenScaleRito;

let app = new PIXI.Application({
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

function setup() {

  // 最底层的场景，用于缩放
  const rootContainer = new PIXI.Container();
  app.stage.addChild(rootContainer);
  rootContainer.scale.set(screenScaleRito, screenScaleRito);


  // 场景1 开场动画
  const gameBeginScene = new PIXI.Container();
  rootContainer.addChild(gameBeginScene);

  // 冬马Sprite
  const touma = new PIXI.Sprite(PIXI.loader.resources['touma'].texture);
  touma.y = finalHeight - 610;
  touma.x = 375;
  gameBeginScene.addChild(touma);

  // 雪菜Sprite
  const setsuna = new PIXI.Sprite(PIXI.loader.resources['setsuna'].texture);
  setsuna.y = finalHeight - 566;
  setsuna.x = 40;
  gameBeginScene.addChild(setsuna);
}