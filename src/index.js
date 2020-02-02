import { Application, Container, Spritesheet, Sprite } from 'pixi.js';
import sound from 'pixi-sound';

import SnowFallScene from './scene/snowFallScene';
import GameBeginScene from './scene/gameBeginScene';
import StoryScene from './scene/storyScene';
import ToumaLineScene from './scene/toumaLineScene';
import SetsunaLineScene from './scene/setsunaLineScene';
import GameEndScene from './scene/gameEndScene';

import newYearImg from '../assets/new_year.jpg';
import vocalImg from '../assets/vocal.jpg';
import bgm from '../assets/bgm.mp3';
import newYearBgm from '../assets/new_year.mp3';
import touma1Bgm from '../assets/touma1.mp3';
import touma2Bgm from '../assets/touma2.mp3';
import touma3Bgm from '../assets/touma3.mp3';
import touma4Bgm from '../assets/touma4.mp3';
import meetBgm from '../assets/meet.mp3';

import spriteJson from '../assets/wa_sprite.json';
import spriteImg from '../assets/wa_sprite.png';



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
      .add('newYear', newYearImg)
      .add('vocal', vocalImg)
      .add('spriteImg', spriteImg)
      .add('bgm', bgm)
      .add('newYearBgm', newYearBgm)
      .add('touma1Bgm', touma1Bgm)
      .add('touma2Bgm', touma2Bgm)
      .add('touma3Bgm', touma3Bgm)
      .add('touma4Bgm', touma4Bgm)
      .add('meetBgm', meetBgm)
      .on("progress", this.loadProgressHandler.bind(this))
      .load(this.setup.bind(this));
  }

  loadProgressHandler() {
    // 进度条动画
    this.loadingCurrent.style.width = `${loader.progress}%`;
  }

  resizeHeight() {
    // ios扫码进入时，window.innerHeight会变化两次，第一次全屏高度，第二次减去safasri工具栏高度
    if (window.innerHeight !== this.clientHeight) {
      this.clientHeight = window.innerHeight;
      this.finalHeight = this.clientHeight / this.screenScaleRito;
      this.app.renderer.resize(this.clientWidth, this.clientHeight);
    }

  }

  setup() {
    this.closeLoading();
    this.resizeHeight();
    this.playBgm();
    this.initSpriteTextures();
    this.initRender();
    this.initScene();
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  initSpriteTextures() {
    // 图片精灵 多张图片合成一张图片
    // https://github.com/parcel-bundler/parcel/issues/501
    const texture = loader.resources["spriteImg"].texture.baseTexture;
    const sheet = new Spritesheet(texture, spriteJson);
    sheet.parse((textures) => {
      this.spriteTextures = textures;
    });
  }

  initRender() {
    document.body.appendChild(this.app.view);
    this.createRootContainer();
  }

  closeLoading() {
    this.loadingDom.style.display = 'none';
  }

  playBgm() {
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
    const { finalHeight, rootContainer, initStory, spriteTextures } = this;
    const gameBeginScene = new GameBeginScene(finalHeight, initStory.bind(this), spriteTextures);
    rootContainer.addChild(gameBeginScene.container);
    this.gameBeginScene = gameBeginScene;
  }

  initStory(goddess) {
    const { gameBeginScene, rootContainer, snowFallScene, originWidth, finalHeight, initLine, spriteTextures } = this;

    const storyScene = new StoryScene({
      width: originWidth,
      finalHeight,
      goddess,
      snowFallScene,
      gameBeginScene,
      callback: initLine.bind(this),
      spriteTextures
    });

    rootContainer.addChild(storyScene.container);
    this.storyScene = storyScene;
  }

  initLine(goddess) {
    if (goddess === 'touma') {
      this.initToumaLine();
    } else if (goddess === 'setsuna') {
      this.initSetsunaLine();
    }
  }

  initToumaLine() {
    const { originWidth, storyScene, rootContainer, finalHeight, initEndScene, spriteTextures } = this;
    const toumaLineScene = new ToumaLineScene({
      width: originWidth,
      storyScene,
      finalHeight,
      callback: initEndScene.bind(this),
      spriteTextures
    });
    rootContainer.addChild(toumaLineScene.container);
  }

  initSetsunaLine() {
    const { originWidth, storyScene, rootContainer, finalHeight, initEndScene, spriteTextures } = this;
    const setsunaLineScene = new SetsunaLineScene({
      width: originWidth,
      storyScene,
      finalHeight,
      callback: initEndScene.bind(this),
      spriteTextures
    });
    rootContainer.addChild(setsunaLineScene.container);
  }

  initEndScene(lineScene) {
    // console.log('lineScene', lineScene);
    const { finalHeight, rootContainer, app, spriteTextures } = this;
    const gameEndScene = new GameEndScene({ finalHeight, lineScene, app, spriteTextures });
    rootContainer.addChild(gameEndScene.container);
    this.gameEndScene = gameEndScene;
  }

  get container() {
    return this.rootContainer;
  }

}

const app = new WhiteAlbumApp();