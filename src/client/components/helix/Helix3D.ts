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
    this.sphereGeometry = new SphereGeometry(0.1, 32, 32);
    this.sphereMaterial = new MeshLambertMaterial({ color: 0x00ff00 });
    this.tubeGeometry = new CylinderGeometry(0.03, 0.03, 2, 32);
    this.tubeMaterial = new MeshLambertMaterial({ color: 0xaaaaaa });
  }

  public build(): Object3D {
    this.chain = this.createChain();
    return this.chain;
  }

  public animate(): any {
    this.chain.rotation.y += 0.01;
  }

  private createChain(): Object3D {
    const chain = new Object3D();
    for (let i = 0; i < 30; i++) {
      chain.add(this.createBlock(-0.3 * i, 9 * i));
    }
    return chain;
  }

  private createBlock(height: number, angle: number) {
    const sphere1 = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const sphere2 = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const connector = new Mesh(this.tubeGeometry, this.tubeMaterial);
    connector.rotation.z = Math.PI / 2;
    sphere1.position.x = 1;
    sphere2.position.x = -1;
    const block = new Object3D();
    block.add(connector);
    block.add(sphere1);
    block.add(sphere2);
    block.position.y = height;
    block.rotation.y = (angle * Math.PI) / 180;
    return block;
  }
}
