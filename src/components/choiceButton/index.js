import { Container, Text, TextStyle, filters, Sprite } from 'pixi.js';

/**
 * 游戏分支选项按钮
 */
export default class ChoiceButton {
  constructor({ text, x, y, loader, fontSize = 30 }) {
    this.text = text;
    this.textX = x;
    this.textY = y;
    this.rootContainer = new Container();
    this.loader = loader;
    this.fontSize = fontSize;

    this.render();
  }

  render() {
    const { rootContainer, text, textX, textY, loader, fontSize } = this;

    rootContainer.scale.set(1.2, 1.2);
    const choice = new Sprite(loader.resources['choice'].texture);
    choice.x = 0;
    choice.y = 0;
    choice.scale.set(0.7, 1);
    choice.skew.x = -10;
    rootContainer.addChild(choice);

    const style = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize
    });
    const choiceText = new Text(text, style);
    rootContainer.addChild(choiceText);
    choiceText.x = textX;
    choiceText.y = textY;
  }

  // rootContainer别名
  get container() {
    return this.rootContainer;
  }

}