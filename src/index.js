import { Application, Container, Loader, Sprite } from 'pixi.js';
import sound from 'pixi-sound';
import { TweenMax, Power0 } from "gsap/all";
import SnowFallBackground from './snow/snowFall';

import setsunaImg from '../assets/setsuna.png';
import toumaImg from '../assets/touma.png';
import bgm from '../assets/bgm.mp3';

import './styles/global.css';

const loader = new Loader();

class WhiteAlbumApp {
  constructor() {
    this.originWidth = 750;
    this.maxDist = 100;
    this.amount = 100;
    this.clientWidth = window.innerWidth;
    this.clientHeight = window.innerHeight;
    this.screenScaleRito = this.clientWidth / this.originWidth;
    this.finalHeight = this.clientHeight / this.screenScaleRito;

    this.loadingDom = document.querySelector('.loading');

    this.snowPointArr = [];

    this.init();

  }

  init() {
    const app = new Application({
      width: this.clientWidth,
      height: this.clientHeight,
      antialias: true,
      transparent: false,
      resolution: 1
    });

    this.app = app;
    this.preLoad();

  }

  preLoad() {
    // https://pixijs.io/pixi-sound/examples/resources/boing.mp3
    loader
      .add('setsuna', setsunaImg)
      .add('touma', toumaImg)
      .add('bgm', bgm)
      .load(this.setup.bind(this));
  }

  setup() {
    this.loadingDom.style.display = 'none';
    this.playBgm();
    document.body.appendChild(this.app.view);
    this.createRootContainer();
    this.createSnowContainer();
    this.initScene();
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  playBgm() {
    if (!loader.resources['bgm'].sound.isPlaying) {
      sound.play('bgm', { loop: true });
    }
  }

  gameLoop() {
    this.snowFallBackground.tick();
  }

  createRootContainer() {
    // 最底层的场景，用于缩放
    const rootContainer = new Container();
    this.app.stage.addChild(rootContainer);
    rootContainer.scale.set(this.screenScaleRito, this.screenScaleRito);

    this.rootContainer = rootContainer;
  }

  createSnowContainer() {
    // 雪花容器
    const { screenScaleRito, rootContainer } = this;
    const snowContainer = new Container();
    // 还原缩放，否则雪花太小
    snowContainer.scale.set(1 / screenScaleRito, 1 / screenScaleRito);
    rootContainer.addChild(snowContainer);

    this.snowContainer = snowContainer;
  }


  initScene() {
    this.initSnowFallScene();
    this.initBeginScene();
  }


  initSnowFallScene() {
    const { clientHeight, clientWidth, maxDist, snowContainer, amount } = this;
    this.snowFallBackground = new SnowFallBackground({
      width: clientWidth,
      height: clientHeight,
      maxDist,
      parent: snowContainer,
      amount
    })
  }

  initBeginScene() {
    const { finalHeight, rootContainer } = this;

    // 冬马
    const toumaAnimateYBegin = finalHeight - 550;
    const toumaAnimateYEnd = finalHeight - 580;

    // 雪菜
    const setsunaAnimateYBegin = finalHeight - 566;
    const setsunaAnimateYEnd = finalHeight - 510;


    // 场景1 开场动画
    const gameBeginScene = new Container();
    rootContainer.addChild(gameBeginScene);

    gameBeginScene.alpha = 0;


    // 冬马Sprite
    const touma = new Sprite(loader.resources['touma'].texture);
    touma.y = toumaAnimateYBegin;
    touma.x = 370;
    gameBeginScene.addChild(touma);

    // touma.buttonMode = true;
    touma.interactive = true;
    touma.on('tap', () => {
      TweenMax.to(touma, 0.8, { y: toumaAnimateYEnd });
      TweenMax.to(setsuna, 0.6, { y: setsunaAnimateYEnd });
      // chrome限制不能自动播放背景音乐，需要用户手动触发
      this.playBgm();
    })

    // 雪菜Sprite
    const setsuna = new Sprite(loader.resources['setsuna'].texture);
    setsuna.y = setsunaAnimateYBegin;
    setsuna.x = 40;
    gameBeginScene.addChild(setsuna);

    setsuna.interactive = true;
    setsuna.on('tap', () => {
      TweenMax.to(touma, 0.8, { y: toumaAnimateYBegin });
      TweenMax.to(setsuna, 0.6, { y: setsunaAnimateYBegin });
      // chrome限制不能自动播放背景音乐，需要用户手动触发
      this.playBgm();
    })

    TweenMax.to(setsuna, 1, { y: setsunaAnimateYEnd, delay: 0.5 });
    TweenMax.to(touma, 1, { y: toumaAnimateYEnd, delay: 0.5 });
    // 透明度使用线性缓动
    TweenMax.to(gameBeginScene, 1, { alpha: 1, ease: Power0.easeNone, delay: 0.5 });
  }

}

const app = new WhiteAlbumApp();