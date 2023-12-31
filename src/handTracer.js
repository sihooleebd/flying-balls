import * as threejs from 'three';
import Co from './constants';

export default class HandTracer {
  sceneDefined = false;
  points = [];
  lines = [];
  constructor(xOffset, yOffset, zOffset, scene, SFXSource) {
    // console.log('initializing...');
    this.scene = scene;
    this.initialize();
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.zOffset = zOffset;
    this.SFXSource = SFXSource;
  }

  positionArray = (line) => {
    return line.geometry.attributes.position.array;
  };

  initialize() {
    for (let i = 0; i < Co.LANDMARK_COUNT; ++i) {
      this.points.push(this.getVertexMesh());
      this.scene.add(this.points[i]);
    }
    for (let i = 0; i < Co.CONNECTIONS.length; ++i) {
      this.lines.push(this.getLineMesh());
      this.scene.add(this.lines[i]);
    }
    // console.log(this.lines);
  }

  updateByRatio = (numA, numB, ratio) => {
    //k:1내분 함수
    // console.log('updateByRatio', ratio);
    return (numA * ratio + numB) / (ratio + 1);
  };
  updatePoint = (i, keyPoint2D, keyPoint3D) => {
    // console.log(keyPoint3D);
    this.points[i].position.x = this.updateByRatio(
      this.points[i].position.x,
      keyPoint3D.x * -100 + this.xOffset - keyPoint2D.x / 12.5,
      3,
    );
    this.points[i].position.y = this.updateByRatio(
      this.points[i].position.y,
      keyPoint3D.y * -100 + this.yOffset - keyPoint2D.y / 12.5,
      3,
    );
    this.points[i].position.z = this.updateByRatio(
      this.points[i].position.z,
      keyPoint3D.z * 100 + this.zOffset,
      3,
    );
  };

  updatePoints = (keyPoints2D, keyPoints3D) => {
    // console.log('updating', keyPoints3D);
    for (let i = 0; i < Co.LANDMARK_COUNT; ++i) {
      // console.log('in for loop', i, keyPoints2D[i], keyPoints3D[i]);
      this.updatePoint(i, keyPoints2D[i], keyPoints3D[i]);
    }
  };
  determineCollisions(balls) {
    const targetPoint = new threejs.Vector3(
      (this.points[2].position.x + this.points[17].position.x) / 2,
      (this.points[2].position.y + this.points[17].position.y) / 2,
      (this.points[2].position.z + this.points[17].position.z) / 2,
    );
    let points = 0;
    for (const [i, ball] of balls.entries()) {
      // console.log(ball.ballElem.position);
      // console.log(targetPoint);
      // console.log(ball.ballElem.position.distanceTo(targetPoint));

      if (
        this.points.some(
          (point) =>
            ball.ballElem.position.distanceTo(point.position) <=
            Co.DETECT_THRESHOLD,
        )
      ) {
        // console.log('SOUND');
        const audio = document.createElement('audio');
        audio.src = this.SFXSource;
        audio.play();
        ball.ballElem.removeFromParent();
        balls.splice(i, 1);
        points++;
      }
    }
    return points;
  }
  updateLines = () => {
    for (const [i, connection] of Co.CONNECTIONS.entries()) {
      const startT = connection[0];
      const endT = connection[1];
      // console.log('in updateline for', i, startT, endT);
      // console.log(this.points[startT]);
      // console.log(this.points[endT]);
      this.positionArray(this.lines[i])[0] = this.points[startT].position.x;
      this.positionArray(this.lines[i])[1] = this.points[startT].position.y;
      this.positionArray(this.lines[i])[2] = this.points[startT].position.z;
      this.positionArray(this.lines[i])[3] = this.points[endT].position.x;
      this.positionArray(this.lines[i])[4] = this.points[endT].position.y;
      this.positionArray(this.lines[i])[5] = this.points[endT].position.z;
      this.lines[i].geometry.attributes.position.needsUpdate = true;
    }
    // this.lines[endT]
  };

  getVertexMesh = () => {
    const geometry = new threejs.SphereGeometry(0.1);
    const material = new threejs.MeshBasicMaterial({ color: Co.HAND_COLOUR });
    const mesh = new threejs.Mesh(geometry, material);
    return mesh;
  };

  getLineMesh = () => {
    const points = [];
    points.push(new threejs.Vector3(0, 0, 0));
    points.push(new threejs.Vector3(0, 0, 0));
    const material = new threejs.LineBasicMaterial({ color: Co.HAND_COLOUR });
    const geometry = new threejs.BufferGeometry().setFromPoints(points);
    const line = new threejs.Line(geometry, material);
    return line;
  };

  handleKeypoints3D = (keypoints2D, keypoints3D) => {
    // do something
    // console.log('in handler', keypoints3D);
    this.updatePoints(keypoints2D, keypoints3D);
    this.updateLines();
  };
}
