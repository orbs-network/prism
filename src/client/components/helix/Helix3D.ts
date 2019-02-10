import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  MeshLambertMaterial,
  CylinderGeometry,
} from 'three';

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

  private createBlock(height: number, angle: number) {
    const sphere1 = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const sphere2 = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const connector = new Mesh(this.tubeGeometry, this.tubeMaterial);
    sphere1.position.y = 1;
    sphere2.position.y = -1;
    const block = new Object3D();
    block.add(connector);
    block.add(sphere1);
    block.add(sphere2);
    block.position.x = height;
    block.rotation.x = (angle * Math.PI) / 180;
    return block;
  }
}
