import { Container, Text, TextStyle, Graphics, Sprite } from 'pixi.js';
import { TweenMax } from "gsap/all";

import Paragraph from '../components/paragraph';

import { loader } from '../loader';

export default class SetsunaLineScene {
  constructor({ storyScene, width, finalHeight }) {
    this.rootContainer = new Container();
    this.storyScene = storyScene;
    this.width = width;
    this.finalHeight = finalHeight;
    this.padding = 20;

    this.paragraphArr = [
      {
        content: '我随着武也、伊绪走出了酒馆。车站外人流攒动，到处洋溢着节日的欢快。',
        x: this.padding,
        y: 100
      },
      {
        content: '三年前的背叛。两年间的逃避。然后是一周前的谎言。脑海中挥之不去自己的罪过。',
        x: this.padding,
        y: 250
      },
      {
        content: '然后，我突然注意到：我们不知何时，已经走到了御宿艺术文化大厅的门前。',
        x: this.padding,
        y: 400
      },
      {
        content: '大批的人沿着大厅的楼梯走下。看来，音乐会好像刚刚结束。我望向手机的时钟，现在的时间是23时59分。',
        x: this.padding,
        y: 550
      },
      {
        content: '而正当我们在热闹的喧嚣中随波逐流的时候，',
        x: this.padding,
        y: 750
      },
      {
        content: '新的一年造访了！',
        x: this.padding,
        y: 850
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
        console.log('end');
        setTimeout(() => window.location.reload(), 500);
        return;
      }
      this.renderParagrap();
    })
  }

  render() {
    const { container: setsunaLineContainer, width, finalHeight, wordWrapWidth } = this;
    setsunaLineContainer.alpha = 0;

    const mask = new Graphics();
    mask.beginFill(0x052338);
    mask.drawRect(0, 0, width, finalHeight - 200);
    mask.endFill();
    mask.y = 90;
    mask.alpha = 0.8;
    setsunaLineContainer.addChild(mask);
    this.mask = mask;

    const tipContainer = new Container();
    tipContainer.x =  width - 110;
    tipContainer.y = finalHeight - 160;
    setsunaLineContainer.addChild(tipContainer);

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