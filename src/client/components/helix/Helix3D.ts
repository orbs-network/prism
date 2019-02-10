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
      object.scale.x = 2;
      object.scale.y = 2;
      object.scale.z = 2;
    }
  }

  public handleHoverOut(object: Object3D): void {
    while (object && object.userData.type !== 'block') {
      object = object.parent;
    }

    if (object) {
      object.rotation.x = object.userData.rotation;
      object.scale.x = 1;
      object.scale.y = 1;
      object.scale.z = 1;
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
