import { Container, Sprite, Text, TextStyle } from 'pixi.js';
import { TweenMax } from "gsap/all";

export default class GameEndScene {
  constructor({ finalHeight, lineScene, app, spriteTextures }) {
    this.rootContainer = new Container();
    this.finalHeight = finalHeight;
    this.lineScene = lineScene;
    this.spriteTextures = spriteTextures;
    this.app = app;
    this.render();
    this.bindEvent();
  }

  get container() {
    return this.rootContainer;
  }

  bindEvent() {
    const { text } = this;

    text.interactive = true;
    text.on('tap', () => {
      window.location.reload();
    });
  }

  render() {
    const { finalHeight, container: gameEndContainer, app, spriteTextures } = this;

    app.renderer.backgroundColor = 0xFFFFFFF;

    gameEndContainer.alpha = 0;

    // logo position
    const logoY = finalHeight / 2 - 400;
    const logoX = 50;

    const snowX = 300;
    const snowY = finalHeight / 2 - 40;

    const startX = 290;
    const startY = finalHeight / 2 + 280;

    // logo
    const logo = new Sprite(spriteTextures['wa2_tv.png']);
    gameEndContainer.addChild(logo);
    logo.x = logoX;
    logo.y = logoY;

    // snow
    const snow = new Sprite(spriteTextures['snow2.png']);
    gameEndContainer.addChild(snow);

    snow.scale.set(0.4);
    snow.x = snowX;
    snow.y = snowY;

    this.snow = snow;


    // 重新开始
    const style = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize: 40,
      stroke: "#2b3f56",
      strokeThickness: 4
    });
    const text = new Text('重新开始', style);
    gameEndContainer.addChild(text);
    text.position.set(startX, startY);
    this.text = text;

    this.initBeginAnima();
  }

  initBeginAnima() {
    const { lineScene, container, snow } = this;
    TweenMax.to(lineScene, 0, {
      alpha: 0,
      visible: false,
    });
    TweenMax.to(container, 1.5, { alpha: 1 });

    TweenMax.fromTo(snow, 4,
      {
        alpha: 1,
      },
      {
        alpha: 0,
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });
  }
}