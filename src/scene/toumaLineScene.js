import { Container, Graphics, Sprite } from 'pixi.js';
import { TweenMax } from "gsap/all";
import sound from 'pixi-sound';

import Paragraph from '../components/paragraph';

import { loader } from '../loader';

export default class ToumaLineScene {
  constructor({ storyScene, width, finalHeight, spriteTextures, callback }) {
    this.rootContainer = new Container();
    this.storyScene = storyScene;
    this.spriteTextures = spriteTextures;
    this.width = width;
    this.callback = callback;
    this.finalHeight = finalHeight;
    this.padding = 20;

    this.currentPage = 0;
    this.currentParaIndex = 0;
    this.story = [
      {
        paragraph: [
          {
            content: '我把曜子送的票攥到了口袋，瞥了一眼墙上的钟，离演出开始只有30分钟了。',
            x: this.padding,
            y: 100
          },
          {
            content: '三年前的背叛。两年间的逃避。然后是一周前的谎言。脑海中挥之不去自己的罪过。',
            x: this.padding,
            y: 250
          },
          {
            content: '随着人流，我来到了御宿艺术文化大厅。演出就要开始，会场喧嚣的声音渐渐安静下来。',
            x: this.padding,
            y: 400
          },
          {
            content: '左手边的座位依旧是空的。我究竟是为何而来呢？',
            x: this.padding,
            y: 550
          },
          {
            content: '而正当自我怀疑的时候，',
            x: this.padding,
            y: 700
          },
          {
            content: '我突然看到了一个熟悉的身影！',
            x: this.padding,
            y: 800
          }
        ]
      },
      {
        paragraph: [
          {
            content: '对了 ... 新年快乐！',
            x: this.padding,
            y: 210,
            bgm: 'touma3Bgm'
          },
          {
            content: '啊 ... 新年快乐！',
            x: this.padding,
            y: 400,
            bgm: 'touma4Bgm'
          },
          {
            content: '又是一个悲喜交加、永远的瞬间...',
            x: this.padding,
            y: 590,
          },
          {
            content: '我开始喜欢白色相簿的季节了。',
            x: this.padding,
            y: 780,
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

    if (paragraph.bgm) {
      sound.play(paragraph.bgm, {
        volume: 1.3,
      });
    }

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

  get isFirstPageEnd() {
    const { currentPage } = this;

    if (currentPage === 0 && this.isCurrentPageEnd) {
      return true;
    }

    return false;
  }

  showVocal() {
    TweenMax.to(this.mask, 0.5, {
      alpha: 0
    });

    TweenMax.to(this.vocal, 0.5, {
      alpha: 1
    });

    if (!loader.resources['meetBgm'].sound.isPlaying) {
      // 背景音乐放小
      sound.volume('bgm', 0.5);

      sound.play('meetBgm', {
        volume: 1.3,
        complete: () => {
          // console.log('Sound finished');
          // 还原背景音乐
          sound.volume('bgm', 0.6);

          TweenMax.to(this.mask, 0.5, {
            alpha: 0.8
          });

          TweenMax.to(this.vocal, 0.5, {
            alpha: 0,
            complete: () => {
              this.vocal.visible = false;
              this.storyContainer[this.currentPage].visible = false;
              this.currentPage += 1;
              this.currentParaIndex = 0;
              this.storyContainer[this.currentPage].visible = true;
              setTimeout(() => this.mask.emit('tap'), 500);
            }
          });
        }
      });
    }
  }

  bindEvent() {
    const { mask, storyContainer } = this;

    mask.interactive = true;

    mask.on('tap', () => {

      if (loader.resources['touma3Bgm'].sound.isPlaying || loader.resources['touma4Bgm'].sound.isPlaying) {
        return;
      }

      if (this.isFirstPageEnd) {
        this.showVocal();
        return;
      }

      if (this.isStoryEnd) {
        // console.log('isStoryEnd');
        this.callback(this.container);
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
    const { container: toumaLineContainer, width, finalHeight, wordWrapWidth, storyContainer, currentPage, spriteTextures } = this;
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

    const snow = new Sprite(spriteTextures['snow.png']);
    snow.scale.set(0.6, 0.6);
    snow.position.set(30, -30);
    tipContainer.addChild(snow);
    this.snow = snow;

    const vocal = new Sprite(loader.resources['vocal'].texture);
    toumaLineContainer.addChild(vocal);
    vocal.alpha = 0;
    vocal.y = (finalHeight - 450) / 2 - 20;
    this.vocal = vocal;

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