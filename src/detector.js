import * as threejs from 'three';
import Skeleton from './skeleton';
import Co from './constants';
/* eslint-disable no-undef */

export default class Detector {
  keypoint3DHandler = undefined;
  async init() {
    this.video = document.getElementById('video-element');
    this.video.style.cssText =
      '-moz-transform: scale(-1, 1); \
-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
transform: scale(-1, 1); filter: FlipH;';
    await this.getVideoStream();
    await this.setVideoDimension();
    this.detector = await this.getDetector();
    console.log('begin detection');
    this.startDetecting();
  }

  async getDetector() {
    // console.log('handPoseDetection', handPoseDetection);

    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfigMediapipe = {
      runtime: 'mediapipe',
      modelType: 'light',
      maxHands: 2,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4`,
    };

    // console.log('getDetector...');
    // console.log('model', model);
    try {
      const detector = await handPoseDetection.createDetector(
        model,
        detectorConfigMediapipe,
      );
      // console.log('detector = ', detector);
      return detector;
    } catch (e) {
      console.log('detector error', e);
    }

    return;
  }
  getVideoStream() {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          // console.log(stream);
          // console.log(this.video);
          this.video.srcObject = stream;

          resolve();
        });
      } else {
        reject();
      }
    });
  }
  setVideoDimension() {
    return new Promise((resolve, reject) => {
      this.video.addEventListener('loadedmetadata', () => {
        this.vw = this.video.videoWidth;
        this.vh = this.video.videoHeight;
        resolve();
      });
    });
  }

  //여기까지 확인
  startDetecting() {
    this.detect(Date.now());
  }
  async detect(t) {
    const tempHands = await this.detector.estimateHands(this.video);
    let leftHand = undefined;
    let rightHand = undefined;
    const leftHands = tempHands.filter((hand) => hand.handedness === 'Left'); // 반전된 동영상이므로 오른손을 의미
    if (leftHands.length > 0) {
      leftHand = leftHands[0];
    } else {
      leftHand = null;
    }

    const rightHands = tempHands.filter((hand) => hand.handedness === 'Right'); // 반전된 동영상이므로 오른손을 의미
    // console.log(leftHands, rightHands, 'a');
    if (rightHands.length > 0) {
      rightHand = rightHands[0];
    } else {
      rightHand = null;
    }

    this.keypoint3DHandler(leftHand, rightHand);

    // this.hands = tempHands.filter((hand) => hand.handedness === 'Left'); // 반전된 동영상이므로 오른손을 의미

    // this.hands = tempHands;
    // // this.hands = tempHands;
    // console.log(this.hands);
    // if (this.hands.length !== 0) {
    //   console.log('IN IF');
    //   try {
    //     // console.log('a', this.hands[0].keypoints3D);
    //     for (const [
    //       i,
    //       keypoint3DHandler,
    //     ] of this.keypoint3DHandlers.entries()) {
    //       console.log('hand', i, this.hands[i]);
    //       if (keypoint3DHandler && typeof keypoint3DHandler === 'function') {
    //         console.log('handDetected');
    //         keypoint3DHandler(this.hands[i].keypoints3D);
    //       }
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
    setTimeout(() => {
      this.detect(Date.now());
    }, Co.DETECT_UPDATE_DELAY);
  }

  // captureFrame = (t) => {
  //   let ctx = this.canvas.getContext('2d');
  //   ctx.save();
  //   ctx.translate(this.vw, 0);
  //   ctx.scale(-1, 1);
  //   ctx.drawImage(this.video, 0, 0, this.vw, this.vh);
  //   ctx.restore();
  //   this.drawHands(ctx);

  //   window.requestAnimationFrame(this.captureFrame);
  // };
  // drawHands(ctx) {
  //   const connections = [
  //     [0, 1],
  //     [1, 2],
  //     [2, 3],
  //     [3, 4],
  //     [0, 5],
  //     [5, 6],
  //     [6, 7],
  //     [7, 8],
  //     [0, 9],
  //     [9, 10],
  //     [10, 11],
  //     [11, 12],
  //     [0, 13],
  //     [13, 14],
  //     [14, 15],
  //     [15, 16],
  //     [0, 17],
  //     [17, 18],
  //     [18, 19],
  //     [19, 20],
  //   ];
  //   ctx.fillStyle = '#f00';
  //   if (!this.hands || !Array.isArray(this.hands)) {
  //     return;
  //   }
  //   this.hands.forEach((hand) => {
  //     console.log(hand);
  //     if (!hand.keypoints) return;
  //     hand.keypoints.forEach((p) => {
  //       console.log(p);
  //       ctx.beginPath();
  //       ctx.arc(this.vw - p.x, p.y, 5, 0, 2 * Math.PI);
  //       ctx.fill();
  //     });
  //     connections.forEach((connection) => {
  //       ctx.beginPath();
  //       ctx.lineWidth = 2;
  //       ctx.strokeStyle = '#f00';

  //       ctx.moveTo(
  //         this.vw - hand.keypoints[connection[0]].x,
  //         hand.keypoints[connection[0]].y,
  //       );
  //       ctx.lineTo(
  //         this.vw - hand.keypoints[connection[1]].x,
  //         hand.keypoints[connection[1]].y,
  //       );
  //       ctx.stroke();
  //     });
  //     let xMin = Infinity;
  //     let xMax = -Infinity;
  //     let yMin = Infinity;
  //     let yMax = -Infinity;
  //     let zMin = Infinity;
  //     let zMax = -Infinity;
  //     if(!hand.keypoints3D) return;//keypoints3D는 -0.1~0.1 사이
  //     hand.keypoints3D.forEach((p) => {
  //       xMin = Math.min(xMin, p.x);
  //       xMax = Math.max(xMax, p.x);
  //       yMin = Math.min(yMin, p.y);
  //       yMax = Math.max(yMax, p.y);
  //       zMin = Math.min(zMin, p.z);
  //       zMax = Math.max(zMax, p.z);
  //     });
  //     console.log(xMin, xMax, yMin, yMax, zMin, zMax);
  //   });
  // }
}
