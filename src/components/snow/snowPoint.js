/**
 * 单个雪花 
 */
export default class SnowPoint {
  constructor(clientWidth, clientHeight,  maxDist) {
    this.x = Math.random() * (clientWidth + maxDist) - (maxDist / 2);
    this.y = Math.random() * (clientHeight + maxDist) - (maxDist / 2);
    this.z = (Math.random() * 0.5) + 0.5;
    this.vx = ((Math.random() * 2) - 0.5) * this.z;
    this.vy = ((Math.random() * 1.5) + 1.5) * this.z;
    this.dia = ((Math.random() * 2.5) + 1.5) * this.z;
    this.alpha = ((0.5 * Math.random()) + 0.5);
  }
}



