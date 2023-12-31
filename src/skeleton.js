import * as threejs from 'three';
import Co from './constants';

// export class Joint {
//   x = 0;
//   y = 0;
//   z = 0;
//   name = '';
//   constructor(x, y, z, name) {
//     this.x = x;
//     this.y = y;
//     this.z = z;
//     this.name = name;
//   }
// }

// export class Bone {
//   startJoint;
//   endJoint;
//   name = '';
//   threeLine;
//   constructor(sJ, eJ, name) {
//     this.startJoint = sJ;
//     this.endJoint = eJ;
//     this.name = name;
//     this.threeLine = this.createThreeLineObject();
//   }

//   createThreeLineObject() {
//     const points = [];
//     points.push(new threejs.Vector3(this.startJoint.x, this.startJoint.y, this.startJoint.z))
//     points.push(new threejs.Vector3(this.endJoint.x, this.endJoint.y, this.endJoint.z))
//   }
// }

const positionArray = (line) => {
  return line.geometry.attributes.position.array;
};

const bufferIndex = (nth, axis) => {
  return nth * 3 + (axis === 'x' ? 0 : axis === 'y' ? 1 : 2);
};

export default class Skeleton {
  joints = [];
  bones = [];
  connectedBonesOfJoint = [];
  // constructor() {
  //   //create bones and skellies
  //   for (let i = 0; i <= 10; ++i) {
  //     this.joints.push(
  //       new threejs.Vector3(
  //         Co.JOINT_POSITIONS[i * 3],
  //         Co.JOINT_POSITIONS[i * 3 + 1],
  //         Co.JOINT_POSITIONS[i * 3 + 2],
  //       ),
  //     );
  //   }

  //   for (let i = 0; i <= 9; ++i) {
  //     // this.bones.push(new Bone(this.joints[connectedJoints[i*2], connectedJoints[i*2+1], boneIds[i]]));
  //     const points = [];
  //     points.push(this.joints[Co.CONNECTED_JOINTS[i * 2]]);
  //     points.push(this.joints[Co.CONNECTED_JOINTS[i * 2 + 1]]);
  //     const geometry = new threejs.BufferGeometry().setFromPoints(points);
  //     const material = Co.BASIC_MATERIAL;
  //     this.bones.push(new threejs.Line(geometry, material));
  //   }
  // }
  createJoint(x, y, z) {
    this.joints.push(new threejs.Vector3(x, y, z));
    this.connectedBonesOfJoint.push([]);
  }

  updateByRatio = (numA, numB, ratio) => {
    //k:1내분 함수
    // console.log('updateByRatio', ratio);
    return (numA * ratio + numB) / (ratio + 1);
  };

  updateBoneConnectedJoint = (boneId, nth, nx, ny, nz) => {
    // console.log('prev position array', positionArray(this.bones[boneId]));

    positionArray(this.bones[boneId])[bufferIndex(nth, 'x')] =
      this.updateByRatio(
        positionArray(this.bones[boneId])[bufferIndex(nth, 'x')],
        nx,
        Co.UPDATE_RATIO,
      );
    positionArray(this.bones[boneId])[bufferIndex(nth, 'y')] =
      this.updateByRatio(
        positionArray(this.bones[boneId])[bufferIndex(nth, 'y')],
        ny,
        Co.UPDATE_RATIO,
      );
    positionArray(this.bones[boneId])[bufferIndex(nth, 'z')] =
      this.updateByRatio(
        positionArray(this.bones[boneId])[bufferIndex(nth, 'z')],
        nz,
        Co.UPDATE_RATIO,
      );

    // console.log('new position array', positionArray(this.bones[boneId]));
  };

  updateJoint = (jointId, nx, ny, nz) => {
    // console.log('UPDATEJOINT');
    // console.log(this.connectedBonesOfJoint[jointId]);
    const newVec = new threejs.Vector3(nx, ny, nz);
    const oldVec = this.joints[jointId];
    this.joints[jointId].copy(newVec);
    // console.log('UPDATING', oldVec);
    this.connectedBonesOfJoint[jointId].forEach((boneId) => {
      // console.log('changed ', this.bones[boneId], 'to ', newVec);

      try {
        if (this.bones[boneId].myStartId == jointId) {
          //0번째
          // console.log('0th');
          this.updateBoneConnectedJoint(boneId, 0, nx, ny, nz);
        } else {
          // console.log('1st');
          this.updateBoneConnectedJoint(boneId, 1, nx, ny, nz);
        }
        // console.log('AAAAAH');
        this.bones[boneId].geometry.attributes.position.needsUpdate = true;

        // console.log('AA', this.bones[boneId].geometry);
      } catch (e) {
        console.log('error', e);
      }
    });
  };
  createBone(startJointId, endJointId) {
    const points = [this.joints[startJointId], this.joints[endJointId]];
    const geometry = new threejs.BufferGeometry().setFromPoints(points);
    const material = Co.BASIC_MATERIAL;
    let line = new threejs.Line(geometry, material);
    line.myStartId = startJointId;
    line.myEndId = endJointId;
    this.bones.push(line);
    this.connectedBonesOfJoint[startJointId].push(this.bones.length - 1);
    this.connectedBonesOfJoint[endJointId].push(this.bones.length - 1);
  }
  createCube(Id, materialno) {
    const geometry = new threejs.BoxGeometry(10, 10, 10);
    const material = new threejs.MeshBasicMaterial({ color: 0x00ff00 });
    const material2 = new threejs.MeshBasicMaterial({ color: 0x0000ff });
    const cube = new threejs.Mesh(
      geometry,
      materialno == 1 ? material : material2,
    );
    cube.position[0] = this.joints[Id];
    this.bones.push(cube);
    this.connectedBonesOfJoint[Id].push(this.bones.length - 1);
  }
}
