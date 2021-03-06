/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { TweenLite } from 'gsap';
import { CylinderGeometry, Mesh, MeshLambertMaterial, Object3D, SphereGeometry } from 'three';

export class Helix3D {
  private chain: Object3D;
  private sphereGeometry: SphereGeometry;
  private sphereMaterial: MeshLambertMaterial;
  private tubeGeometry: CylinderGeometry;
  private tubeMaterial: MeshLambertMaterial;

  constructor() {
    this.sphereGeometry = new SphereGeometry(0.25, 32, 32);
    this.sphereMaterial = new MeshLambertMaterial({ color: 0x4485bb });
    this.tubeGeometry = new CylinderGeometry(0.1, 0.1, 2, 32);
    this.tubeMaterial = new MeshLambertMaterial({ color: 0x344396 });
  }

  public build(): Object3D {
    this.chain = this.createChain();
    return this.chain;
  }

  public handleHover(object: Object3D): void {
    while (object && object.userData.type !== 'block') {
      object = object.parent;
    }

    if (object) {
      object.rotation.x = -this.chain.rotation.x;
      TweenLite.to(object.scale, 0.3, { x: 2, y: 2, z: 2 });
    }
  }

  public handleHoverOut(object: Object3D): void {
    while (object && object.userData.type !== 'block') {
      object = object.parent;
    }

    if (object) {
      object.rotation.x = object.userData.rotation;
      TweenLite.to(object.scale, 0.3, { x: 1, y: 1, z: 1 });
    }
  }

  public animate(): any {
    this.chain.rotation.x += 0.01;
  }

  private createChain(): Object3D {
    const chain = new Object3D();
    for (let i = 0; i < 30; i++) {
      chain.add(this.createBlock(-0.75 * i, 15 * i));
    }
    return chain;
  }

  private createBlock(height: number, angle: number): Object3D {
    const sphere1 = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const sphere2 = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const connector = new Mesh(this.tubeGeometry, this.tubeMaterial);
    sphere1.position.y = 1;
    sphere2.position.y = -1;
    const block = new Object3D();
    const rotation = (angle * Math.PI) / 180;
    block.userData = { type: 'block', rotation };
    block.add(connector);
    block.add(sphere1);
    block.add(sphere2);
    block.position.x = height;
    block.rotation.x = rotation;
    return block;
  }
}
