import { Container, Sprite, Text, TextStyle, filters } from 'pixi.js';
import { TweenMax } from "gsap/all";

export default class StoryScene {
  constructor(width, goddess, snowFallScene, gameBeginScene) {
    this.rootContainer = new Container();
    this.goddess = goddess;
    this.snowFallScene = snowFallScene;
    this.gameBeginScene = gameBeginScene;
    this.width = width;
    this.render();
  }

  render() {
    const { rootContainer: storyContainer, snowFallScene, gameBeginScene, width, goddess } = this;
    storyContainer.alpha = 0;

    const style = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize: 45,
      stroke: "#2b3f56",
      strokeThickness: 8,
      wordWrap: true,
      wordWrapWidth: width,
      breakWords: true, // 中文强制换行
    });
    const text = new Text('那么我要选' + goddess, style);
    storyContainer.addChild(text);

    TweenMax.to(gameBeginScene.rootContainer, 0.5, { alpha: 0 });
    TweenMax.to(storyContainer, 0.5, { alpha: 1 });

    const blurFilter = new filters.BlurFilter();
    blurFilter.blur = 4;
    snowFallScene.rootContainer.filters = [blurFilter];
  }
}