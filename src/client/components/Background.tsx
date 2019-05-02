/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      zIndex: -1000,
      position: `absolute`,
      overflow: 'hidden',
    },
    prismVersion: {
      position: `fixed`,
      bottom: 4,
      left: 4,
    },
    triangle: {
      opacity: 0.25,
      fill: '#08e4f4',
    },
    svgElm: {
      top: -320,
      left: -80,
      position: 'relative',
      height: 1500,
      opacity: 0.1,
      transform: `rotate(15deg)`,
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

interface IProps extends WithStyles<typeof styles> {
  prismVersion: string;
}

export const Background = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes, prismVersion } = this.props;
      return (
        <div className={classes.root}>
          <svg xmlns='http://www.w3.org/2000/svg' className={classes.svgElm} viewBox='0 0 100 100'>
            <path
              className={classes.triangle}
              d='m8.44388,72.186002l59.79,0a5.46,5.46 0 0 0 4.58,-8.41l-29.85,-46.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.28a5.45,5.45 0 0 0 4.57,8.41z'
            />
            <path
              className={classes.triangle}
              d='m20.93,78.176003l58.6,0a6.09,6.09 0 0 0 5.12,-9.4l-29.2,-45.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.27a5.45,5.45 0 0 0 4.57,8.41z'
            />
            <path
              className={classes.triangle}
              d='m32.443882,84.176l58.6,0a6.09,6.09 0 0 0 5.12,-9.4l-29.2,-45.28a5.45,5.45 0 0 0 -9.16,0l-29.93,46.27a5.45,5.45 0 0 0 4.57,8.41z'
            />
          </svg>
          <Typography className={classes.prismVersion} variant='caption'>
            {prismVersion}
          </Typography>
        </div>
      );
    }
  },
);
