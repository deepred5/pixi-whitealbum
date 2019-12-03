import { Container, Sprite, Text, TextStyle, Graphics } from 'pixi.js';
import { TweenMax, Power0 } from "gsap/all";
import { gradient } from '../util';
import { loader } from '../loader';

/**
 * 入场动画场景
 */
export default class GameBeginScene {
  constructor(finalHeight, callback) {
    this.rootContainer = new Container();
    this.finalHeight = finalHeight;
    this.callback = callback;
    this.goddess = 'touma';

    this.render();
    this.bindEvent();
  }

  bindEvent() {
    const {
      setsuna,
      setsunaContainer,
      setsunaSnow,
      touma,
      toumaContainer,
      toumaSnow,
      toumaAnimateYBegin,
      toumaAnimateYEnd,
      setsunaAnimateYBegin,
      setsunaAnimateYEnd,
      startButtonContainer,
      callback
    } = this;

    // 冬马事件
    touma.interactive = true;
    touma.on('tap', () => {
      this.goddess = 'touma';

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
    });

    // 雪菜事件
    setsuna.interactive = true;
    setsuna.on('tap', () => {

      this.goddess = 'setsuna';

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
    });

    // 按钮事件
    startButtonContainer.interactive = true;
    startButtonContainer.buttonMode = true;
    startButtonContainer.on('tap', () => {
      callback(this.goddess);
    });
  }

  render() {
    const { finalHeight, rootContainer: gameBeginScene } = this;

    // 冬马 position
    const toumaAnimateYBegin = finalHeight - 550;
    const toumaAnimateYEnd = finalHeight - 580;
    const toumaX = 370;
    this.toumaAnimateYBegin = toumaAnimateYBegin;
    this.toumaAnimateYEnd = toumaAnimateYEnd;

    // 雪菜 position
    const setsunaAnimateYBegin = finalHeight - 566;
    const setsunaAnimateYEnd = finalHeight - 510;
    const setsunaX = 40;
    this.setsunaAnimateYBegin = setsunaAnimateYBegin;
    this.setsunaAnimateYEnd = setsunaAnimateYEnd;

    // logo position
    const logoY = finalHeight / 2 - 460;
    const logoX = 50;

    // 开始button position
    const startX = 280;
    const startY = finalHeight / 2 - 120;

    // 椭圆
    const ellipseX = 90;
    const ellipseY = 44;

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
    this.toumaContainer = toumaContainer;

    // 冬马Sprite
    const touma = new Sprite(loader.resources['touma'].texture);
    touma.y = 0;
    touma.x = 0;
    toumaContainer.addChild(touma);
    this.touma = touma;

    // 冬马snow
    const toumaSnow = new Sprite(loader.resources['snow'].texture);
    toumaSnow.x = 110;
    toumaSnow.y = -60;
    toumaSnow.alpha = 0;
    toumaSnow.scale.set(0.8, 0.8);
    toumaContainer.addChild(toumaSnow);
    this.toumaSnow = toumaSnow;

    // 雪菜和snow的container
    const setsunaContainer = new Container();
    gameBeginScene.addChild(setsunaContainer);
    setsunaContainer.x = setsunaX;
    setsunaContainer.y = setsunaAnimateYBegin;
    this.setsunaContainer = setsunaContainer;

    // 雪菜Sprite
    const setsuna = new Sprite(loader.resources['setsuna'].texture);
    setsuna.y = 0;
    setsuna.x = 0;
    setsunaContainer.addChild(setsuna);
    this.setsuna = setsuna;


    // 雪菜snow
    const setsunaSnow = new Sprite(loader.resources['snow'].texture);
    setsunaSnow.alpha = 0;
    setsunaSnow.x = 210;
    setsunaSnow.y = -60;
    setsunaSnow.scale.set(0.8, 0.8);
    setsunaContainer.addChild(setsunaSnow);
    this.setsunaSnow = setsunaSnow;

    // 开始按钮
    const startButtonContainer = new Container();
    gameBeginScene.addChild(startButtonContainer);
    startButtonContainer.x = startX;
    startButtonContainer.y = startY;
    this.startButtonContainer = startButtonContainer;

    // 椭圆
    const ellipse = new Graphics();
    ellipse.beginTextureFill({
      texture: gradient('#3BC1E3', '#FFF')
    })
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

    this.initBeginAnima();
  }

  initBeginAnima() {
    // 进场初始动画
    const {
      toumaContainer,
      setsunaContainer,
      rootContainer: gameBeginScene,
      toumaSnow,
      setsunaAnimateYEnd,
      toumaAnimateYEnd
    } = this;

    TweenMax.to(setsunaContainer, 1, { y: setsunaAnimateYEnd, delay: 0.5 });
    TweenMax.to(toumaContainer, 1, { y: toumaAnimateYEnd, delay: 0.5 });
    TweenMax.to(gameBeginScene, 1, { alpha: 1, ease: Power0.easeNone, delay: 0.5 });
    TweenMax.fromTo(toumaSnow, 1.2, { alpha: 0 }, { alpha: 1, repeat: -1, yoyo: true, delay: 1.5 });
  }

  get container() {
    return this.rootContainer;
  }
}