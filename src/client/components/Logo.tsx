import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '&:hover $t1': {
        animation: 'anim1 3s cubic-bezier(.8, 0, .2, 1)',
      },
      '&:hover $t3': {
        animation: 'anim3 3s cubic-bezier(.8, 0, .2, 1)',
      },
    },
    svgElm: {
      height: 54,
    },
    triangle: {
      opacity: 0.7,
    },
    text: {
      fontSize: 35,
      letterSpacing: 4,
      fill: '#fff',
      fontFamily: 'Montserrat-Regular, Montserrat',
    },
    t1: {
      transformOrigin: '9.5% 51%',
    },
    t2: {},
    t3: {
      transformOrigin: '16% 63%',
    },
    '@keyframes anim1': {
      '0%': {
        transform: 'translate(0px, 0px) rotate(0deg)',
      },
      '50%': {
        transform: 'translate(12px, 6px) rotate(120deg)',
      },
      '100%': {
        transform: 'translate(0px, 0px) rotate(0deg)',
      },
    },
    '@keyframes anim3': {
      '0%': {
        transform: 'translate(0px, 0px) rotate(0deg)',
      },
      '50%': {
        transform: 'translate(-12px, -6px) rotate(360deg)',
      },
      '100%': {
        transform: 'translate(0px, 0px) rotate(0deg)',
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {}

export const Logo = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <svg xmlns='http://www.w3.org/2000/svg' className={classes.svgElm} viewBox='0 0 400 100'>
            <path
              fill='red'
              className={`${classes.triangle} ${classes.t1}`}
              d='m8.44388,72.186002l59.79,0a5.46,5.46 0 0 0 4.58,-8.41l-29.85,-46.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.28a5.45,5.45 0 0 0 4.57,8.41z'
            />
            <path
              fill='yellow'
              className={`${classes.triangle} ${classes.t2}`}
              d='m20.93,78.176003l58.6,0a6.09,6.09 0 0 0 5.12,-9.4l-29.2,-45.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.27a5.45,5.45 0 0 0 4.57,8.41z'
            />
            <path
              fill='blue'
              className={`${classes.triangle} ${classes.t3}`}
              d='m32.443882,84.176l58.6,0a6.09,6.09 0 0 0 5.12,-9.4l-29.2,-45.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.27a5.45,5.45 0 0 0 4.57,8.41z'
            />
            <text transform='translate(115 65)' className={classes.text}>
              PRISM
            </text>
          </svg>
        </div>
      );
    }
  },
);
