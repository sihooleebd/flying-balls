import * as threejs from 'three';
import Co from './constants';
import HandTracer from './handTracer';
import Detector from './detector';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import Balls from './balls';
document.addEventListener('DOMContentLoaded', () => {
  // console.log('a');
  new FlyingBalls();
});

class FlyingBalls {
  constructor() {
    // console.log('hii');
    this.defineScene();
    this.point = 0;
    this.leftHandTracer = new HandTracer(
      25,
      25,
      0,
      this.scene,
      './success.mp3',
    );
    this.rightHandTracer = new HandTracer(
      25,
      25,
      0,
      this.scene,
      './success.mp3',
    );
    this.ballMaker = new Balls(this.scene, './fail.mp3');
    this.detector = new Detector();
    this.detector.init();
    const leftHandler = this.leftHandTracer.handleKeypoints3D;
    // console.log(leftHandler);
    const rightHandler = this.rightHandTracer.handleKeypoints3D;
    // console.log(leftHandler);

    const handleMultipleKeypoints3D = (left, right) => {
      // console.log(left, right);
      if (left) leftHandler(left.keypoints, left.keypoints3D);
      if (right) rightHandler(right.keypoints, right.keypoints3D);
    };

    this.detector.keypoint3DHandler = handleMultipleKeypoints3D;
    this.beginRenderLoop();
    this.ballMaker.startLaunchingBalls();
  }

  beginRenderLoop() {
    this.delta = 0;
    window.requestAnimationFrame(this.renderLoop);
  }

  renderLoop = () => {
    this.delta += 0.01;
    this.camera.position.x = 3 * Math.cos(this.delta);
    this.camera.position.y = 10 + 3 * Math.sin(this.delta);
    this.camera.position.z = 30;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
    this.ballMaker.render();
    this.leftHandTracer.determineCollisions(this.ballMaker.balls);
    this.rightHandTracer.determineCollisions(this.ballMaker.balls);
    this.ballMaker.clearUnseenBalls();
    setTimeout(() => {
      window.requestAnimationFrame(this.renderLoop);
    }, Co.DRAW_UPDATE_DELAY);
  };

  /**
   * 도 단위를 라디안 각도로 바꿔준다.
   * @param {number} degree 도 단위
   * @returns 주어진 각도의 라디안값
   */
  rad = (degree) => (degree * Math.PI) / 180;

  /**
   * line mesh 를 생성해 리턴한다.
   * @param {x|y|z} axis
   * @param {1|-1} direction
   * @param {number} color
   * @returns
   */
  getAxisLineMesh = (axis, direction, color) => {
    const axisLength = 20;
    const points = [];
    points.push(new threejs.Vector3(0, 0, 0));
    points.push(
      new threejs.Vector3(
        axis === 'x' ? axisLength * direction : 0,
        axis === 'y' ? axisLength * direction : 0,
        axis === 'z' ? axisLength * direction : 0,
      ),
    );
    const axisGeo = new threejs.BufferGeometry().setFromPoints(points);
    const colorMaterial = new threejs.LineBasicMaterial({ color });
    return new threejs.Line(axisGeo, colorMaterial);
  };

  getCanvasByPartOfImage(x, y, sizeW, sizeH, loadedImage) {
    const canvas = document.createElement('canvas');
    canvas.width = sizeW;
    canvas.height = sizeH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(loadedImage, x, y, sizeW, sizeH, 0, 0, sizeW, sizeH);
    // console.log(canvas);
    return canvas;
  }

  defineSkybox() {
    const loader = new threejs.ImageLoader();
    loader.load(`././skybox.png`, (image) => {
      const textures = [];
      for (const [xth, yth] of Co.SKYBOX_IMAGE_POSITIONS) {
        // console.log('drawing ', xth, yth);
        const canvas = this.getCanvasByPartOfImage(
          xth * Co.SKYBOX_IMAGE_SIZE,
          yth * Co.SKYBOX_IMAGE_SIZE,
          Co.SKYBOX_IMAGE_SIZE,
          Co.SKYBOX_IMAGE_SIZE,
          image,
        );
        const texture = new threejs.CanvasTexture(canvas);
        textures.push(texture);
      } //end of for

      const materials = textures.map((texture) => {
        return new threejs.MeshBasicMaterial({
          map: texture,
          side: threejs.BackSide,
        });
      }); //end of materials map

      const skyboxGeometry = new threejs.BoxGeometry(2000, 2000, 2000);
      const skybox = new threejs.Mesh(skyboxGeometry, materials);
      this.scene.add(skybox);
    }); //end of loader
  }

  async defineScene() {
    this.scene = new threejs.Scene();
    this.camera = new threejs.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.0001,
      10000,
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 30;

    // this.camera.rotateOnAxis(new threejs.Vector3(30, 0, 0), this.rad(90));

    this.camera.lookAt(0, 0, 0);
    this.light = new threejs.Light(0xffffff, 100);
    this.scene.add(this.light);
    this.defineSkybox();
    if (this.render == undefined) {
      // console.log('AAAAAh');
    }
    this.renderer = new threejs.WebGLRenderer();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera.rotation.x = this.rad(30);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enabled = false;
    this.controls.update();

    // console.log('ROT', this.camera.rotation);
    this.sceneDefined = true;
    // console.log('defining axes');
    // this.scene.add(this.getAxisLineMesh('x', 1, 0xff0000));
    // this.scene.add(this.getAxisLineMesh('x', -1, 0xffdddd));
    // this.scene.add(this.getAxisLineMesh('y', 1, 0x00ff00));
    // this.scene.add(this.getAxisLineMesh('y', -1, 0xddffdd));
    // this.scene.add(this.getAxisLineMesh('z', 1, 0x0000ff));
    // this.scene.add(this.getAxisLineMesh('z', -1, 0xddddff));

    // const axesHelper = new threejs.AxesHelper(20);
    // const axesHelper2 = new threejs.AxesHelper(-20);
    // this.scene.add(axesHelper);
    // this.scene.add(axesHelper2);
    const size = 40;
    const divisions = 10;

    const gridHelper = new threejs.GridHelper(size, divisions);
    this.scene.add(gridHelper);
  }
}
