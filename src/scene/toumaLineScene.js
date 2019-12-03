import { Container, Text, TextStyle, Graphics, Sprite } from 'pixi.js';
import { TweenMax } from "gsap/all";

import Paragraph from '../components/paragraph';

import { loader } from '../loader';

export default class ToumaLineScene {
  constructor({ storyScene, width, finalHeight }) {
    this.rootContainer = new Container();
    this.storyScene = storyScene;
    this.width = width;
    this.finalHeight = finalHeight;
    this.padding = 20;

    this.paragraphArr = [
      {
        content: '啊，怎么会这样，我竟不知不觉来到了音乐厅',
        x: this.padding,
        y: 100
      },
      {
        content: '666',
        x: this.padding,
        y: 200
      },
      {
        content: '啊，怎么会这样，我竟不知不觉来到了音乐啊，怎么会这样，我竟不知不觉来到了音乐啊，怎么会这样，我竟不知不觉来到了音乐啊，怎么会这样，我竟不知不觉来到了音乐',
        x: this.padding,
        y: 300
      },
      {
        content: '啊，怎么会这样，我竟不知不觉来到了音乐啊，怎么会这样，我竟不知不觉来到了音乐啊，怎么会这样，我竟不知不觉来到了音乐啊，怎么会这样，我竟不知不觉来到了音乐',
        x: this.padding,
        y: 550
      }
    ];

    this.currentIndex = 0;

    this.render();
    this.bindEvent();
  }

  get container() {
    return this.rootContainer;
  }

  get paragraphAmount() {
    return this.paragraphArr.length;
  }

  get wordWrapWidth() {
    return this.width - this.padding;
  }

  renderParagrap() {
    const { currentIndex, paragraphArr, wordWrapWidth, mask } = this;
    const paragraph = paragraphArr[currentIndex];

    const text = new Paragraph({
      content: paragraph.content,
      width: wordWrapWidth
    });
    text.container.x = paragraph.x;
    text.container.y = paragraph.y;
    mask.addChild(text.container);
  }

  bindEvent() {
    const { mask, paragraphAmount } = this;

    mask.interactive = true;
    mask.on('tap', () => {
      this.currentIndex += 1;
      if (this.currentIndex >= paragraphAmount) {
        console.log('end')
        return;
      }
      this.renderParagrap();
    })
  }

  render() {
    const { container: toumaLineContainer, width, finalHeight, wordWrapWidth } = this;
    toumaLineContainer.alpha = 0;

    const mask = new Graphics();
    mask.beginFill(0x052338);
    mask.drawRect(0, 0, width, finalHeight - 200);
    mask.endFill();
    mask.y = 90;
    mask.alpha = 0.8;
    toumaLineContainer.addChild(mask);
    this.mask = mask;

    const tipContainer = new Container();
    tipContainer.x =  width - 110;
    tipContainer.y = finalHeight - 160;
    toumaLineContainer.addChild(tipContainer);

    const text = new Paragraph({
      content: 'TOUCH',
      width: wordWrapWidth,
      fontSize: 25
    });
    tipContainer.addChild(text.container);

    const snow = new Sprite(loader.resources['snow'].texture);
    snow.scale.set(0.6, 0.6);
    snow.position.set(30, -30);
    tipContainer.addChild(snow);
    this.snow = snow;

    this.renderParagrap();

    this.initBeginAnima();
  }

  initBeginAnima() {
    const { storyScene, container, snow } = this;
    TweenMax.to(storyScene.container, 0.3, { alpha: 0 });
    TweenMax.to(container, 0.8, { alpha: 1 });
    TweenMax.fromTo(snow, 1.2, { alpha: 1 }, { alpha: 0, repeat: -1, yoyo: true, delay: 1.5 });
  }
}