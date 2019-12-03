import { Container } from 'pixi.js';
import SnowFallBackground from '../components/snow/snowFall';

/**
 * 雪花粒子场景
 */
class SnowFallScene {
  constructor(width, height, screenScaleRito) {
    this.rootContainer = new Container();
    this.width = width;
    this.height = height;
    this.screenScaleRito = screenScaleRito;

    this.maxDist = 100;
    this.amount = 100;

    this.render();
  }

  render() {
    const { rootContainer, screenScaleRito, width, height, amount, maxDist } = this;
    rootContainer.scale.set(1 / screenScaleRito, 1 / screenScaleRito);
    this.snowFallBackground = new SnowFallBackground({
      width,
      height,
      maxDist,
      parent: rootContainer,
      amount
    });
  }

  tick() {
    this.snowFallBackground.tick();
  }

  get container() {
    return this.rootContainer;
  }
}

export default SnowFallScene;