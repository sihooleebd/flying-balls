import Co from './constants';

const armLength = 40;
const legLength = 50;

const multiplier = 1000;

const lElbow = (points3D) => {
  const { x, y, z } = points3D[Co.POINT_IDS.get('INDEX')];
  console.log('x=', x, 'z=', z);
  const result = [
    x * multiplier * 5 + 0,
    y * multiplier + 0,
    window.innerWidth / 2 - 300 - z * multiplier * 7,
  ];
  console.log('result=', result);
  return result;
};

const lHand = (points3D) => {
  const [nx, ny, tempZ] = lElbow(points3D);
  return [nx, ny, tempZ - armLength];
};

const rElbow = (points3D) => {
  const { x, y, z } = points3D[Co.POINT_IDS.get('RING')];
  return [
    x * multiplier + 5,
    y * multiplier + 0,
    window.innerWidth / 2 - 300 - z * multiplier * 7,
  ];
};

const rHand = (points3D) => {
  const [nx, ny, tempZ] = rElbow(points3D);
  return [nx, ny, tempZ - armLength];
};

const lAnkle = (points3D) => {
  const { x, y, z } = points3D[Co.POINT_IDS.get('THUMB')];
  return [x * multiplier + 0, y * multiplier + 0, z * multiplier + 0];
};

const lFoot = (points3D) => {
  const [nx, ny, tempZ] = lAnkle(points3D);
  return [nx, ny, tempZ - legLength];
};

const rAnkle = (points3D) => {
  const { x, y, z } = points3D[Co.POINT_IDS.get('PINKY')];
  return [x * multiplier + 0, y * multiplier + 0, z * multiplier + 0];
};

const rFoot = (points3D) => {
  const [nx, ny, tempZ] = rAnkle(points3D);
  return [nx, ny, tempZ - legLength];
};

const fomulas = new Map([
  ['L_ELBOW', lElbow],
  ['L_HAND', lHand],
  ['R_ELBOW', rElbow],
  ['R_HAND', rHand],
  ['L_ANKLE', lAnkle],
  ['L_FOOT', lFoot],
  ['R_ANKLE', rAnkle],
  ['R_FOOT', rFoot],
]);

export default fomulas;
