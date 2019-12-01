import { Application, Container, Loader, Sprite, Text, TextStyle, Graphics } from 'pixi.js';
import sound from 'pixi-sound';
import { TweenMax, Power0 } from "gsap/all";
import SnowFallBackground from './snow/snowFall';
import { gradient } from './util';

import setsunaImg from '../assets/setsuna.png';
import toumaImg from '../assets/touma.png';
import snowImg from '../assets/snow.png';
import logoImg from '../assets/wa2_tv.png';
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
      .add('snow', snowImg)
      .add('logo', logoImg)
      .add('bgm', bgm)
      .load(this.setup.bind(this));
  }

  setup() {
    this.loadingDom.style.display = 'none';
    // this.playBgm();
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

    // 冬马 position
    const toumaAnimateYBegin = finalHeight - 550;
    const toumaAnimateYEnd = finalHeight - 580;
    const toumaX = 370;

    // 雪菜 position
    const setsunaAnimateYBegin = finalHeight - 566;
    const setsunaAnimateYEnd = finalHeight - 510;
    const setsunaX = 40;

    // logo position
    const logoY = finalHeight / 2 - 460;
    const logoX = 50;

    // 开始button position
    const startX = 280;
    const startY = finalHeight / 2 - 120;

    // 椭圆
    const ellipseX = 90;
    const ellipseY = 44;

    // 开场动画
    const gameBeginScene = new Container();
    rootContainer.addChild(gameBeginScene);

    gameBeginScene.alpha = 0;

    // logo
    const logo = new Sprite(loader.resources['logo'].texture);
    gameBeginScene.addChild(logo);
    logo.x = logoX;
    logo.y = logoY;

    // 东马和snow的container
    const toumaContainer = new Container();
    gameBeginScene.addChild(toumaContainer);
    toumaContainer.x = toumaX;
    toumaContainer.y = toumaAnimateYBegin;

    // 冬马Sprite
    const touma = new Sprite(loader.resources['touma'].texture);
    touma.y = 0;
    touma.x = 0;
    toumaContainer.addChild(touma);

    // 冬马snow
    const toumaSnow = new Sprite(loader.resources['snow'].texture);
    toumaSnow.x = 110;
    toumaSnow.y = -60;
    toumaSnow.alpha = 0;
    toumaSnow.scale.set(0.8, 0.8);
    toumaContainer.addChild(toumaSnow);

    touma.interactive = true;
    touma.on('tap', () => {
      TweenMax.to(toumaContainer, 0.8, { y: toumaAnimateYEnd });
      TweenMax.to(setsunaContainer, 0.8, { y: setsunaAnimateYEnd });

      // 冬马头顶的雪花展示
      TweenMax.to(toumaSnow, 0.3, { alpha: 1, delay: 0.2 });
      TweenMax.fromTo(toumaSnow, 1.2, { alpha: 1, ease: Power0.easeNone, }, { alpha: 0, repeat: -1, yoyo: true, delay: 0.5, ease: Power0.easeNone, delay: 1 });

      // 关闭雪菜头顶的雪花
      TweenMax.to(setsunaSnow, 0.5, {
        alpha: 0,
        onComplete: function () {
          TweenMax.killTweensOf(setsunaSnow);
        }
      });

      // chrome限制不能自动播放背景音乐，需要用户手动触发
      // this.playBgm();
    })

    // 雪菜和snow的container
    const setsunaContainer = new Container();
    gameBeginScene.addChild(setsunaContainer);
    setsunaContainer.x = setsunaX;
    setsunaContainer.y = setsunaAnimateYBegin;

    // 雪菜Sprite
    const setsuna = new Sprite(loader.resources['setsuna'].texture);
    setsuna.y = 0;
    setsuna.x = 0;
    setsunaContainer.addChild(setsuna);

    // 雪菜snow
    const setsunaSnow = new Sprite(loader.resources['snow'].texture);
    setsunaSnow.alpha = 0;
    setsunaSnow.x = 210;
    setsunaSnow.y = -60;
    setsunaSnow.scale.set(0.8, 0.8);
    setsunaContainer.addChild(setsunaSnow);

    setsuna.interactive = true;
    setsuna.on('tap', () => {
      TweenMax.to(toumaContainer, 0.8, { y: toumaAnimateYBegin });
      TweenMax.to(setsunaContainer, 0.8, { y: setsunaAnimateYBegin });

      // 雪菜头顶的雪花展示，并且循环透明
      TweenMax.to(setsunaSnow, 0.3, { alpha: 1, delay: 0.2 });
      TweenMax.fromTo(setsunaSnow, 1.2, { alpha: 1, ease: Power0.easeNone, }, { alpha: 0, repeat: -1, yoyo: true, delay: 0.5, ease: Power0.easeNone, delay: 1 });

      // 关闭冬马头顶的雪花
      TweenMax.to(toumaSnow, 0.5, {
        alpha: 0,
        onComplete: function () {
          TweenMax.killTweensOf(toumaSnow);
        }
      });
      // chrome限制不能自动播放背景音乐，需要用户手动触发
      // this.playBgm();
    })

    // 开始按钮
    const startButtonContainer = new Container();
    gameBeginScene.addChild(startButtonContainer);
    startButtonContainer.x = startX;
    startButtonContainer.y = startY;

    startButtonContainer.interactive = true;
    startButtonContainer.buttonMode = true;
    startButtonContainer.on('tap', () => {
      console.log('game start');
    });

    // 椭圆
    const ellipse = new Graphics();
    ellipse.beginTextureFill(gradient('#3BC1E3', '#fff', 160, 20))
    ellipse.drawEllipse(0, 0, 160, 20);
    ellipse.endFill();
    ellipse.x = ellipseX;
    ellipse.y = ellipseY;
    ellipse.alpha = 0.5;
    startButtonContainer.addChild(ellipse);

    // 开始文字
    const style = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize: 45,
      stroke: "#2b3f56",
      strokeThickness: 8
    });
    const text = new Text('开始游戏', style);
    startButtonContainer.addChild(text);
    text.position.set(0, 0);

    // 进场初始动画
    TweenMax.to(setsunaContainer, 1, { y: setsunaAnimateYEnd, delay: 0.5 });
    TweenMax.to(toumaContainer, 1, { y: toumaAnimateYEnd, delay: 0.5 });
    TweenMax.to(gameBeginScene, 1, { alpha: 1, ease: Power0.easeNone, delay: 0.5 });
    TweenMax.fromTo(toumaSnow, 1.2, { alpha: 0 }, { alpha: 1, repeat: -1, yoyo: true, delay: 1.5 });
  }

}

const app = new WhiteAlbumApp();