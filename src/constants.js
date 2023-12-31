import * as threejs from 'three';

const Co = {
  CONNECTIONS: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [0, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [0, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [0, 17],
    [17, 18],
    [18, 19],
    [19, 20],
    [2, 5],
    [5, 9],
    [9, 13],
    [13, 17],
  ],

  JOINT_POSITIONS: [
    0, 180, 0, /**/ 0, 160, 0, /**/ 50, 150, 0, /**/ -50, 150, 0, /**/ 60, 120,
    0, /**/ -60, 120, 0, /**/ 0, 80, 0, /**/ 30, 40, 0, /**/ -30, 40, 0,
    /**/ 40, 0, 0, /**/ -40, 0, 0,
  ],
  JOINT_IDS: new Map([
    ['HEAD', 0],
    ['SHOULDER', 1],
    ['L_ELBOW', 2],
    ['L_HAND', 3],
    ['R_ELBOW', 4],
    ['R_HAND', 5],
    ['WAIST', 6],
    ['L_ANKLE', 7],
    ['L_FOOT', 8],
    ['R_ANKLE', 9],
    ['R_FOOT', 10],
  ]), //11
  CONNECTED_BONES: [[0], [1], [], [], [], [], [], [], []],
  CONNECTED_JOINTS: [
    0, 1, /**/ 1, 2, /**/ 2, 3, /**/ 1, 4, /**/ 4, 5, /**/ 1, 6, /**/ 6, 7,
    /**/ 7, 8, /**/ 6, 9, /**/ 9, 10,
  ],
  BONE_IDS: new Map([
    ['HEAD', 0],
    ['L_ARM_TOP', 1],
    ['L_ARM_BOTTOM', 2],
    ['R_ARM_TOP', 3],
    ['L_ARM_BOTTOM', 4],
    ['BODY', 5],
    ['L_LEG_TOP', 6],
    ['L_LEG_BOTTOM', 7],
    ['R_LEG_TOP', 8],
    ['R_LEG_BOTTOM', 9],
  ]), //10
  POINT_IDS: new Map([
    ['THUMB', 0],
    ['INDEX', 1],
    ['MIDDLE', 2],
    ['RING', 3],
    ['PINKY', 4],
  ]),
  BASIC_MATERIAL: new threejs.LineBasicMaterial({ color: 0xff0000 }),
  UPDATE_RATIO: 0,
  DRAW_UPDATE_DELAY: 10,
  DETECT_UPDATE_DELAY: 0,
  LANDMARK_COUNT: 21,
  BALL_UPDATE_DELAY: 3000,
  BALL_SIZE: 3,
  MAX_SPEED: 2,
  MAX_ACCEL: 0.3,
  MIN_TIME: 1000,
  SPEED_DIFF: 0.1,
  ACCEL_DIFF: 0,
  TIME_DIFF_DIFF: 2000,
  BALL_START_Z: -100,
  DEFAULT_SPEED: 1,
  DEFAULT_ACCEL: 0,
  DEFAULT_TIME_DIFF: 0,
  DETECT_THRESHOLD: 5,
  SKYBOX_IMAGE_SIZE: 900,
  SKYBOX_IMAGE_POSITIONS: [
    [2, 1], //right
    [0, 1], //left
    [1, 0], //top
    [1, 2], //bottom
    [1, 1], //front
    [3, 1], //back
  ],
  HAND_COLOUR: 0x000000,
};

export default Co;
