import { Text, TextStyle } from 'pixi.js';

/**
 * 段落
 */
export default class Paragraph {
  constructor({ content, width, fontSize = 35 }) {
    this.content = content;
    this.width = width;
    this.fontSize = fontSize;
    this.render();
  }

  render() {
    const { content, width, fontSize } = this;
    const style = new TextStyle({
      fill: 'white',
      fontFamily: '-apple-system,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;',
      fontSize,
      wordWrap: true,
      wordWrapWidth: width,
      breakWords: true,
    });
    const text = new Text(content, style);
    this.container = text;
  }
}