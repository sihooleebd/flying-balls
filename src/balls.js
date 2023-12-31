import * as threejs from 'three';
import Co from './constants';
import Ball from './ball';

export default class Balls {
  balls = [];
  speed = Co.DEFAULT_SPEED;
  acceleration = Co.DEFAULT_ACCEL;
  timeDiff = Co.DEFAULT_TIME_DIFF;
  constructor(scene, source) {
    this.scene = scene;
    this.SFXSource = source;
  }
  startLaunchingBalls() {
    window.requestAnimationFrame(this.launchBall);
  }

  launchBall = () => {
    const x = Math.random() * 40 - 20;
    const y = Math.random() * 20;
    const ball = new Ball(
      x,
      y,
      Co.BALL_START_Z,
      Math.min(this.speed, Co.MAX_SPEED),
      Math.min(this.acceleration, Co.MAX_ACCEL),
    );
    this.speed += Co.SPEED_DIFF;
    this.acceleration += Co.ACCEL_DIFF;
    this.balls.push(ball);
    this.scene.add(ball.ballElem);
    this.timeDiff += Co.TIME_DIFF_DIFF;
    setTimeout(
      () => {
        window.requestAnimationFrame(this.launchBall);
      },
      Math.max(Co.BALL_UPDATE_DELAY - this.timeDiff, Co.MIN_TIME),
    );
  };

  clearUnseenBalls() {
    for (const [i, ball] of this.balls.entries()) {
      if (ball.z >= 40) {
        ball.ballElem.removeFromParent();
        this.balls.splice(i, 1);
        const audio = document.createElement('audio');
        audio.src = this.SFXSource;
        audio.play();
      }
    }
  }

  render = () => {
    this.balls.forEach((ball) => {
      ball.accelerate();
      ball.rotate();
    });
  };
}
