import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      top: -170,
      height: 1810,
      opacity: 0.1,
      zIndex: -1000,
      position: `absolute`,
      transform: `rotate(15deg)`,
      left: -340,
    },
  });

interface IProps extends WithStyles<typeof styles> {}

export const Background = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes } = this.props;
      return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 362.95 124' className={classes.root}>
          <defs>
            <style>{`.triangle { fill:#08e4f4;opacity:0.72; }`}</style>
          </defs>
          <path
            className='triangle'
            d='M32.71,90.55H92.5a5.46,5.46,0,0,0,4.58-8.41L67.23,35.86a5.45,5.45,0,0,0-9.16,0L28.14,82.14A5.45,5.45,0,0,0,32.71,90.55Z'
          />
          <path
            className='triangle'
            d='M53.93,101.52h58.6a6.09,6.09,0,0,0,5.12-9.4L88.45,46.84a5.45,5.45,0,0,0-9.16,0L49.36,93.11A5.45,5.45,0,0,0,53.93,101.52Z'
          />
        </svg>
      );
    }
  },
);
