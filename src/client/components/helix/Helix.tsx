import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Fog } from 'three';
import { IBlockSummary } from '../../../shared/IBlock';
import { getRecentBlocksSummary } from '../../reducers/recentBlocksReducer';
import { IRootState } from '../../reducers/rootReducer';
import { Helix3D } from './Helix3D';

const styles = (theme: Theme) => createStyles({});

interface IProps {
  blocks: IBlockSummary[];
}
const HelixImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    private helix3D: Helix3D;
    private scene: Scene;
    private mount: HTMLDivElement;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private frameId: number;

    public componentDidMount() {
      const width = this.mount.clientWidth;
      const height = this.mount.clientHeight;

      // ADD SCENE
      this.scene = new Scene();

      // Add light
      const light = new AmbientLight(0x202020);
      this.scene.add(light);

      // another light
      const directionalLight = new DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0.3, 0.3, 1);
      this.scene.add(directionalLight);

      // ADD CAMERA
      this.camera = new PerspectiveCamera(10, width / height, 0.1, 1000);
      this.camera.position.x = -5;
      this.camera.position.z = 40;

      // Add Fog
      this.scene.fog = new Fog(0x000000, 48, 53);

      // ADD RENDERER
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setClearColor('#000000');
      this.renderer.setSize(width, height);
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
          style={{ width: '100%', height: '400px' }}
          ref={mount => {
            this.mount = mount;
          }}
        />
      );
    }

    private startAnimation() {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(() => this.animate());
      }
    }

    private stopAnimation() {
      cancelAnimationFrame(this.frameId);
    }

    private animate() {
      this.helix3D.animate();
      this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(() => this.animate());
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocksSummary(state),
});

export const Helix = connect(mapStateToProps)(HelixImpl);
