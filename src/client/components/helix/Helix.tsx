import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  AmbientLight,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Projector,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
  Clock,
} from 'three';
import { IBlockSummary } from '../../../shared/IBlock';
import { getRecentBlocksSummary } from '../../reducers/recentBlocksReducer';
import { IRootState } from '../../reducers/rootReducer';
import { Helix3D } from './Helix3D';

const raycaster = new Raycaster();

const styles = (theme: Theme) => createStyles({});

interface IProps {
  blocks: IBlockSummary[];
}
const HelixImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    private clock: Clock = new Clock();
    private helix3D: Helix3D;
    private scene: Scene;
    private mount: HTMLDivElement;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private composer: EffectComposer;
    private frameId: number;
    private mouse: Vector2 = new Vector2();
    private hoverdObject: Object3D;

    public componentDidMount() {
      const width = this.mount.clientWidth;
      const height = this.mount.clientHeight;

      // ADD SCENE
      this.scene = new Scene();

      // Add light
      const light = new AmbientLight(0xffffff, 0.5);
      this.scene.add(light);

      // another light
      const directionalLight = new DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 1, 0);
      this.scene.add(directionalLight);

      // ADD CAMERA
      this.camera = new PerspectiveCamera(10, width / height, 0.1, 1000);
      this.camera.position.x = -5;
      this.camera.position.z = 40;

      // ADD RENDERER
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setClearColor('#0a0f25');
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Add effects
      this.composer = new EffectComposer(this.renderer);
      const effectPass = new EffectPass(this.camera, new BloomEffect(3.0));
      effectPass.renderToScreen = true;

      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.composer.addPass(effectPass);

      this.mount.appendChild(this.renderer.domElement);

      // ADD Helix
      this.helix3D = new Helix3D();
      this.scene.add(this.helix3D.build());

      this.startAnimation();
    }

    public componentWillUnmount() {
      this.stopAnimation();
      this.mount.removeChild(this.renderer.domElement);
    }

    public render() {
      return (
        <div
          id='mount'
          style={{ width: '100%', height: '400px' }}
          onMouseMove={e => this.onDocumentMouseMove(e)}
          ref={mount => {
            this.mount = mount;
          }}
        />
      );
    }

    private onDocumentMouseMove(e: React.MouseEvent): void {
      this.mouse.x = (e.nativeEvent.offsetX / this.mount.clientWidth) * 2 - 1;
      this.mouse.y = -(e.nativeEvent.offsetY / this.mount.clientHeight) * 2 + 1;
    }

    private startAnimation() {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(() => this.animate());
      }
    }

    private stopAnimation() {
      cancelAnimationFrame(this.frameId);
    }

    private handleHover(): void {
      raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        const newIntersectedObject = intersects[0].object;
        if (this.hoverdObject !== newIntersectedObject) {
          this.helix3D.handleHoverOut(this.hoverdObject);
        }
        this.hoverdObject = intersects[0].object;
        this.helix3D.handleHover(this.hoverdObject);
      } else {
        if (this.hoverdObject) {
          this.helix3D.handleHoverOut(this.hoverdObject);
        }
      }
    }

    private animate() {
      this.helix3D.animate();
      this.handleHover();
      this.composer.render(this.clock.getDelta());
      // this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(() => this.animate());
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocksSummary(state),
});

export const Helix = connect(mapStateToProps)(HelixImpl);
