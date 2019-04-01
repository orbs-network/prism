/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { BlocksBox } from './BlocksBox';
// import { HelixContainer } from '../helix/HelixContainer';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {}

export const Home = withStyles(styles)(({ classes }: IProps) => (
  <div className={classes.root}>
    <BlocksBox />
  </div>
));
