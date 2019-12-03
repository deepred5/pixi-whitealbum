import { Container, Text, TextStyle, filters, Sprite } from 'pixi.js';
import { TweenMax } from "gsap/all";

import ChoiceButton from '../components/choiceButton';
import { loader } from '../loader';

export default class StoryScene {
  constructor({ width, goddess, snowFallScene, gameBeginScene, finalHeight, callback }) {
    this.rootContainer = new Container();
    this.goddess = goddess;
    this.snowFallScene = snowFallScene;
    this.gameBeginScene = gameBeginScene;
    this.width = width;
    this.finalHeight = finalHeight;
    this.callback = callback;
    this.render();
    this.bindEvent();
  }

  bindEvent() {
    const { toumaButton, setsunaButton, goddess, callback } = this;

    const button = goddess === 'touma' ? toumaButton : setsunaButton;

    button.interactive = true;
    button.on('tap', () => {
      callback(goddess);
    });
  }

  render() {
    const { rootContainer: storyContainer, snowFallScene, width, goddess, finalHeight } = this;
    storyContainer.alpha = 0;

    const dialog = new Sprite(loader.resources['dialog'].texture);
    storyContainer.addChild(dialog);
    dialog.y = finalHeight - 140;
    dialog.x = 50;
    dialog.scale.set(0.7, 0.7);

    const button1 = new ChoiceButton({
      text: '1. 去音乐会',
      x: 160,
      y: -40,
      loader,
    });
    storyContainer.addChild(button1.container);
    button1.container.x = 100;
    button1.container.y = 310;
    this.toumaButton = button1.container;

    const button2 = new ChoiceButton({
      text: '2. 去新年参拜',
      x: 140,
      y: -40,
      loader,
    });
    storyContainer.addChild(button2.container);
    button2.container.x = 100;
    button2.container.y = 460;
    this.setsunaButton = button2.container;


    if (goddess === 'touma') {
      button2.container.alpha = 0.4;
    } else {
      button1.container.alpha = 0.4;
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

    const blurFilter = new filters.BlurFilter();
    blurFilter.blur = 4;
    snowFallScene.rootContainer.filters = [blurFilter];

    this.initBeginAnima();
  }

  initBeginAnima() {
    const { gameBeginScene, rootContainer } = this;
    TweenMax.to(gameBeginScene.rootContainer, 0.5, { alpha: 0 });
    TweenMax.to(rootContainer, 0.8, { alpha: 1 });
  }

  get container() {
    return this.rootContainer;
  }
}