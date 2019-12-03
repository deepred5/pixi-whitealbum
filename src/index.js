import { Application, Container } from 'pixi.js';
import sound from 'pixi-sound';

import SnowFallScene from './scene/snowFallScene';
import GameBeginScene from './scene/gameBeginScene';
import StoryScene from './scene/storyScene';
import ToumaLineScene from './scene/toumaLineScene';

import setsunaImg from '../assets/setsuna.png';
import toumaImg from '../assets/touma.png';
import snowImg from '../assets/snow.png';
import logoImg from '../assets/wa2_tv.png';
import dialogImg from '../assets/dialog.png';
import choiceImg from '../assets/choice.png';
import bgm from '../assets/bgm.mp3';

import './styles/global.scss';

import { loader } from './loader';

class WhiteAlbumApp {
  constructor() {
    this.originWidth = 750;
    this.maxDist = 100;
    this.amount = 100;
    this.clientWidth = window.innerWidth;
    this.clientHeight = window.innerHeight;
    this.screenScaleRito = this.clientWidth / this.originWidth;
    this.finalHeight = this.clientHeight / this.screenScaleRito;

    this.loadingDom = document.querySelector('.loading-container');
    this.loadingCurrent = document.querySelector('.loading-current');

    this.snowPointArr = [];

    this.goddess = 'touma';

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
      .add('dialog', dialogImg)
      .add('choice', choiceImg)
      .add('bgm', bgm)
      .on("progress", this.loadProgressHandler.bind(this))
      .load(this.setup.bind(this));
  }

  loadProgressHandler() {
    // 进度条动画
    this.loadingCurrent.style.width = `${loader.progress}%`;
  }

  setup() {
    this.closeLoading();
    this.playBgm();
    this.initRender();
    this.initScene();
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  initRender() {
    document.body.appendChild(this.app.view);
    this.createRootContainer();
  }

  closeLoading() {
    this.loadingDom.style.display = 'none';
  }

  playBgm() {
    // return;
    // chrome限制不能自动播放背景音乐，需要用户手动触发
    if (!loader.resources['bgm'].sound.isPlaying) {
      sound.play('bgm', { loop: true });
    }
  }

  gameLoop() {
    this.snowFallScene.tick();
  }

  createRootContainer() {
    // 最底层的场景，用于缩放
    const rootContainer = new Container();
    this.app.stage.addChild(rootContainer);
    rootContainer.scale.set(this.screenScaleRito, this.screenScaleRito);

    this.rootContainer = rootContainer;
  }


  initScene() {
    this.initSnowFallScene();
    this.initBeginScene();
  }


  initSnowFallScene() {
    // 雪花粒子场景
    const { screenScaleRito, rootContainer, clientHeight, clientWidth } = this;

    const snowFallScene = new SnowFallScene(clientWidth, clientHeight, screenScaleRito);
    rootContainer.addChild(snowFallScene.rootContainer);
    this.snowFallScene = snowFallScene;
  }

  initBeginScene() {
    const { finalHeight, rootContainer, initStory } = this;
    const gameBeginScene = new GameBeginScene(finalHeight, initStory.bind(this));
    rootContainer.addChild(gameBeginScene.container);
    this.gameBeginScene = gameBeginScene;
  }

  initStory(goddess) {
    const { gameBeginScene, rootContainer, snowFallScene, originWidth, finalHeight, initToumaLine } = this;

    const storyScene = new StoryScene({
      width: originWidth,
      finalHeight,
      goddess,
      snowFallScene,
      gameBeginScene,
      callback: initToumaLine.bind(this)
    });

    rootContainer.addChild(storyScene.container);
    this.storyScene = storyScene;
  }

  initToumaLine(goddess) {
    const { originWidth, storyScene, rootContainer, finalHeight } = this;
    if (goddess === 'touma') {
      const toumaLineScene = new ToumaLineScene({ width: originWidth, storyScene, finalHeight });
      rootContainer.addChild(toumaLineScene.container);
    }
  }

  get container() {
    return this.rootContainer;
  }

}

const app = new WhiteAlbumApp();