import { Container, Text, TextStyle, filters, Sprite } from 'pixi.js';
import { TweenMax } from "gsap/all";

export default class StoryScene {
  constructor({ width, goddess, snowFallScene, gameBeginScene, loader, finalHeight }) {
    this.rootContainer = new Container();
    this.goddess = goddess;
    this.snowFallScene = snowFallScene;
    this.gameBeginScene = gameBeginScene;
    this.width = width;
    this.loader = loader;
    this.finalHeight = finalHeight;
    this.render();
  }

  render() {
    const { rootContainer: storyContainer, snowFallScene, gameBeginScene, width, goddess, loader, finalHeight } = this;
    storyContainer.alpha = 0;

    const dialog = new Sprite(loader.resources['dialog'].texture);
    storyContainer.addChild(dialog);
    dialog.y = finalHeight - 140;
    dialog.x = 50;
    dialog.scale.set(0.7, 0.7);

    const choiceContainer = new Container();
    storyContainer.addChild(choiceContainer);
    choiceContainer.y = 310;
    choiceContainer.x = 100;
    choiceContainer.scale.set(1.2, 1.2)

    const choice = new Sprite(loader.resources['choice'].texture);
    choiceContainer.addChild(choice);
    choice.x = 0;
    choice.y = 0;
    choice.scale.set(0.7, 1);
    choice.skew.x = -10;

    const style1 = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize: 30,
      wordWrap: true,
      wordWrapWidth: width,
      breakWords: true,
    });
    const choiceText1 = new Text('1. 去音乐会', style1);
    choiceContainer.addChild(choiceText1);
    choiceText1.x = 160;
    choiceText1.y = -40;

    // 
    const choiceContainer2 = new Container();
    storyContainer.addChild(choiceContainer2);
    choiceContainer2.y = 460;
    choiceContainer2.x = 100;
    choiceContainer2.scale.set(1.2, 1.2);

    const choice2 = new Sprite(loader.resources['choice'].texture);
    choiceContainer2.addChild(choice2);
    choice2.x = 0;
    choice2.y = 0;
    choice2.scale.set(0.7, 1);
    choice2.skew.x = -10;

    const style2 = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize: 30,
      wordWrap: true,
      wordWrapWidth: width,
      breakWords: true,
    });
    const choiceText2 = new Text('2. 去新年参拜', style2);
    choiceContainer2.addChild(choiceText2);
    choiceText2.x = 140;
    choiceText2.y = -40;

    if (goddess === 'touma') {
      choiceContainer2.alpha = 0.5;
    } else {
      choiceContainer.alpha = 0.5;
    }

    const style = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize: 35,
      wordWrap: true,
      wordWrapWidth: width,
      breakWords: true, // 中文强制换行
    });
    const text = new Text('那么我要...', style);
    storyContainer.addChild(text);
    text.x = 300;
    text.y = finalHeight - 110;

    TweenMax.to(gameBeginScene.rootContainer, 0.5, { alpha: 0 });
    TweenMax.to(storyContainer, 0.5, { alpha: 1 });

    const blurFilter = new filters.BlurFilter();
    blurFilter.blur = 4;
    snowFallScene.rootContainer.filters = [blurFilter];
  }
}