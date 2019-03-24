import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Spring } from 'react-spring/renderprops';

const styles = (theme: Theme) =>
  createStyles({
    svgElm: {
      height: 54,
    },
    text: {
      fontSize: 35,
      letterSpacing: 4,
      fill: '#fff',
      fontFamily: 'Montserrat-Regular, Montserrat',
    },
  });

interface IProps extends WithStyles<typeof styles> {}
interface IState {
  hovered: boolean;
}

export const Logo = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props) {
      super(props);
      this.state = { hovered: false };
    }

    public render() {
      const { classes } = this.props;
      const { hovered: h } = this.state;
      return (
        <div onMouseOver={() => this.setHover()} onMouseOut={() => this.cancelHover()}>
          <Spring to={{ x: h ? 1 : 0 }}>
            {props => (
              <svg xmlns='http://www.w3.org/2000/svg' className={classes.svgElm} viewBox='0 0 400 100'>
                <path
                  fill='red'
                  style={{
                    opacity: 0.7,
                    transformOrigin: '9.5% 51%',
                    transform: `translate(${props.x * 12}px, ${props.x * 6}px) rotate(${props.x * 120}deg)`,
                  }}
                  d='m8.44388,72.186002l59.79,0a5.46,5.46 0 0 0 4.58,-8.41l-29.85,-46.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.28a5.45,5.45 0 0 0 4.57,8.41z'
                />
                <path
                  fill='yellow'
                  style={{
                    opacity: 0.7,
                  }}
                  d='m20.93,78.176003l58.6,0a6.09,6.09 0 0 0 5.12,-9.4l-29.2,-45.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.27a5.45,5.45 0 0 0 4.57,8.41z'
                />
                <path
                  fill='#00d2e4'
                  style={{
                    opacity: 0.7,
                    transformOrigin: '16% 63%',
                    transform: `translate(${props.x * -12}px, ${props.x * -6}px) rotate(${props.x * 360}deg)`,
                  }}
                  d='m32.443882,84.176l58.6,0a6.09,6.09 0 0 0 5.12,-9.4l-29.2,-45.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.27a5.45,5.45 0 0 0 4.57,8.41z'
                />
                <text transform='translate(115 65)' className={classes.text}>
                  PRISM
                </text>
              </svg>
            )}
          </Spring>
        </div>
      );
    }

    private setHover() {
      this.setState({ hovered: true });
    }

    private cancelHover() {
      this.setState({ hovered: false });
    }
  },
);
