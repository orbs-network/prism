import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      top: -320,
      left: -80,
      height: 1500,
      opacity: 0.1,
      zIndex: -1000,
      position: `absolute`,
      transform: `rotate(15deg)`,
      overflow: 'hidden',
      animation: 'rotate 500s linear infinite',
    },
    '@keyframes rotate': {
      '0%': {
        transform: 'rotate(15deg)',
      },
      '100%': {
        transform: 'rotate(375deg)',
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {}

export const Background = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes } = this.props;
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' className={classes.root}>
          <defs>
            <style>{`.triangle { fill:#08e4f4;opacity:0.72; }`}</style>
          </defs>
          <path
            className='triangle'
            d='M9.59172060251236,71.73279439210891 H69.38172060251236 a5.46,5.46 0 0 0 4.58,-8.41 L44.111720602512364,17.042794392108917 a5.45,5.45 0 0 0 -9.16,0 L5.02172060251236,63.32279439210892 A5.45,5.45 0 0 0 9.59172060251236,71.73279439210891 z'
          />
          <path
            className='triangle'
            d='M30.81172060251236,82.70279439210891 h58.6 a6.09,6.09 0 0 0 5.12,-9.4 L65.33172060251236,28.02279439210892 a5.45,5.45 0 0 0 -9.16,0 L26.24172060251236,74.29279439210892 A5.45,5.45 0 0 0 30.81172060251236,82.70279439210891 z'
          />
        </svg>
      );
    }
  },
);
