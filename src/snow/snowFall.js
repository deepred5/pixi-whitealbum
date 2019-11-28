/**
 * 雪花动态背景
 */

import * as PIXI from 'pixi.js';
import SnowPoint  from './snowPoint';

export default class SnowFallBackground {
  constructor({ width, height, amount, maxDist, parent }) {
    this.width = width;
    this.height = height;
    this.amount = amount;
    this.maxDist = maxDist;
    this.parent = parent;
    this.snowPointsArr = [];
    this.circleArr = [];

    this.init();
  }

  init() {
    this.generateSnowPoints(this.amount);
    this.render();
  }

  generateSnowPoints() {
    const { width, height, amount, maxDist } = this;
    for (let i = 0; i < amount; i++) {
      this.snowPointsArr.push(new SnowPoint(width, height, maxDist));
    }
  }

  render() {
    const { parent, snowPointsArr, circleArr } = this;
    snowPointsArr.forEach((obj) => {
      let circle = new PIXI.Graphics();
      circle.beginFill(0xFFFFFF, obj.alpha);
      circle.drawCircle(0, 0, obj.dia);
      circle.endFill();
      circle.x = obj.x;
      circle.y = obj.y;
      parent.addChild(circle);
      circleArr.push(circle);
    })
  }

  update(obj) {
    const { width, height, maxDist } = this;
    obj.x += obj.vx;
    obj.y += obj.vy;
    if (obj.x > width + (maxDist / 2)) {
      obj.x = -(maxDist / 2);
    }
    else if (obj.xpos < -(maxDist / 2)) {
      obj.x = width + (maxDist / 2);
    }
    if (obj.y > height + (maxDist / 2)) {
      obj.y = -(maxDist / 2);
    }
    else if (obj.y < -(maxDist / 2)) {
      obj.y = height + (maxDist / 2);
    }
  }

  tick() {
    const { snowPointsArr, circleArr } = this;
    snowPointsArr.forEach((obj, i) => {
      this.update(obj);
      const circle = circleArr[i];
      circle.x = obj.x;
      circle.y = obj.y;
    })
  }
}