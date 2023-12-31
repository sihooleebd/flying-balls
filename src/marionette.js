import Co from './constants';
import fomulas from './fomulas';
import Skeleton from './skeleton';
import * as threejs from 'three';

export default class Marionette {
  skeleton = new Skeleton();
  renderer;
  camera;
  scene;
  light;

  constructor() {
    this.defineSkeleton();
    this.defineScene();
    this.addSkeletonToScene();
  }

  defineSkeleton() {
    // this.skeleton.createJoint(-10, 0, 0);
    // this.skeleton.createJoint(10, 0, 0);
    // this.skeleton.createBone(0, 1);
    this.skeleton.createJoint(0, 0, 180);
    this.skeleton.createJoint(0, 0, 160);
    this.skeleton.createJoint(50, 0, 150);
    this.skeleton.createJoint(60, 0, 120);
    this.skeleton.createJoint(-50, 0, 150);
    this.skeleton.createJoint(-60, 0, 120);
    this.skeleton.createJoint(0, 0, 80);
    this.skeleton.createJoint(30, 0, 40);
    this.skeleton.createJoint(40, 0, 0);
    this.skeleton.createJoint(-30, 0, 40);
    this.skeleton.createJoint(-40, 0, 0);
    this.skeleton.createBone(0, 1);
    this.skeleton.createBone(1, 2);
    this.skeleton.createBone(2, 3);
    this.skeleton.createBone(1, 4);
    this.skeleton.createBone(4, 5);
    this.skeleton.createBone(1, 6);
    this.skeleton.createBone(6, 7);
    this.skeleton.createBone(7, 8);
    this.skeleton.createBone(6, 9);
    this.skeleton.createBone(9, 10);
  }

  addSkeletonToScene() {
    this.skeleton.bones.forEach((bone) => {
      this.scene.add(bone);
    });
  }

  async defineScene() {
    this.scene = new threejs.Scene();
    this.camera = new threejs.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.y = -250;
    this.camera.position.z = 100;
    this.camera.lookAt(0, 0, 100);
    this.light = new threejs.Light(5);
    this.scene.add(this.light);
    this.renderer = new threejs.WebGLRenderer();
    if (this.render == undefined) {
      // console.log('AAAAAh');
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  updateJoint = (keypoints3D, jointId) => {
    // console.log('updateJoint');
    const [nx, ny, nz] = fomulas.get(jointId)(keypoints3D);
    // console.log('nx, ny, nz=', nx, ny, nz);

    this.skeleton.updateJoint(Co.JOINT_IDS.get(jointId), nx, ny, nz);
  };

  updateScene = (keypoints3D) => {
    // console.log('updateScene');
    [
      'L_ELBOW',
      'R_ELBOW',
      'L_HAND',
      'R_HAND',
      'L_ANKLE',
      'R_ANKLE',
      'L_FOOT',
      'R_FOOT',
    ].forEach((jointId) => this.updateJoint(keypoints3D, jointId));
  };

  beginRenderLoop() {
    window.requestAnimationFrame(this.renderLoop);
  }
  renderLoop = () => {
    // console.log('renderLoop', this.scene);
    this.renderer.render(this.scene, this.camera);

    setTimeout(() => {
      // console.clear();
      window.requestAnimationFrame(this.renderLoop);
    }, Co.UPDATE_DELAY);
  };

  handleKeypoints3D = (keypoints3D) => {
    // do something
    this.updateScene(keypoints3D);
  };
}
