import * as threejs from 'three';
import Co from './constants';

export default class Ball {
  x = 0;
  y = 0;
  z = 0;
  speed = 0;
  acceleration = 0;
  vy = 0.1;
  ay = -0.005;
  rotationX = Math.random() * 0.4 - 0.2;
  rotationY = Math.random() * 0.4 - 0.2;
  rotationZ = Math.random() * 0.4 - 0.2;
  constructor(x, y, z, speed, acceleration) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.speed = speed;
    this.acceleration = acceleration;
    this.ballElem = this.createBallElement(x, y, z);
  }

  accelerate() {
    this.speed += this.acceleration;
    this.z += this.speed;
    this.y += this.vy;
    this.vy += this.ay;
    this.ballElem.position.z = this.z;
    this.ballElem.position.y = this.y;
  }

  rotate() {
    this.ballElem.rotation.x += this.rotationX;
    this.ballElem.rotation.y += this.rotationY;
    this.ballElem.rotation.z += this.rotationZ;
  }

  createBallElement(x, y, z) {
    const geometry = new threejs.SphereGeometry(Co.BALL_SIZE);
    // const geometry = new threejs.BoxGeometry(3, 3, 3);
    const uvTexture = new threejs.TextureLoader().load('../texture.jpg');
    const material = new threejs.MeshBasicMaterial({ map: uvTexture });
    const mesh = new threejs.Mesh(geometry, material);

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    return mesh;
  }
}
