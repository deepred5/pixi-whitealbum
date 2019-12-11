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

    this.currentPage = 0;
    this.currentParaIndex = 0;
    this.story = [
      {
        paragraph: [
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
        ]
      },
      {
        paragraph: [
          {
            content: '第二段',
            x: this.padding,
            y: 100
          }
        ]
      },
      {
        paragraph: [
          {
            content: '第3段',
            x: this.padding,
            y: 100
          }
        ]
      }
    ];

    this.storyContainer = [];

    this.initStoryContainer();
    this.render();
    this.bindEvent();
  }

  initStoryContainer() {
    for (let i = 0; i < this.story.length; i++) {
      const temp = new Container();
      temp.visible = false;
      this.storyContainer.push(temp);
    }
  }

  renderParagrap() {
    const { currentPage, currentParaIndex, story, wordWrapWidth, storyContainer } = this;
    const paragraph = story[currentPage].paragraph[currentParaIndex];
    const container = storyContainer[currentPage];

    const text = new Paragraph({
      content: paragraph.content,
      width: wordWrapWidth
    });
    text.container.x = paragraph.x;
    text.container.y = paragraph.y;
    text.container.alpha = 0;
    container.addChild(text.container);

    TweenMax.to(text.container, 0.5, { alpha: 1 });
  }

  get container() {
    return this.rootContainer;
  }

  get wordWrapWidth() {
    return this.width - this.padding;
  }

  get isStoryEnd() {
    const { currentPage, story } = this;

    if (currentPage === story.length - 1 && this.isCurrentPageEnd) {
      return true;
    }

    return false;

  }

  get isCurrentPageEnd() {
    const { currentPage, currentParaIndex, story } = this;

    if (currentParaIndex === story[currentPage].paragraph.length) {
      return true;
    }

    return false;
  }

  bindEvent() {
    const { mask, storyContainer } = this;

    mask.interactive = true;

    mask.on('tap', () => {
      if (this.isStoryEnd) {
        console.log('end');
        return;
      }

      if (this.isCurrentPageEnd) {
        storyContainer[this.currentPage].visible = false;
        this.currentPage += 1;
        this.currentParaIndex = 0;
        storyContainer[this.currentPage].visible = true;
      }

      this.renderParagrap();

      this.currentParaIndex += 1;
    });

    // trigger触发一次tap
    mask.emit('tap');
  }

  render() {
    const { container: toumaLineContainer, width, finalHeight, wordWrapWidth, storyContainer, currentPage } = this;
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
    tipContainer.y = finalHeight - 240;
    mask.addChild(tipContainer);

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

    storyContainer.forEach((item) => mask.addChild(item));

    storyContainer[currentPage].visible = true;

    this.initBeginAnima();
  }

  initBeginAnima() {
    const { storyScene, container, snow } = this;
    TweenMax.to(storyScene.container, 0.3, { alpha: 0, visible: false });
    TweenMax.to(container, 0.8, { alpha: 1 });
    TweenMax.fromTo(snow, 1, { alpha: 1 }, { alpha: 0, repeat: -1, yoyo: true, delay: 1.2 });
  }
}