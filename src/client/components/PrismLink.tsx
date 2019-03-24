/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {
  to: string;
  id?: string;
  className?: string;
}

export const PrismLink = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      return (
        <Link
          className={`${this.props.classes.link} ${this.props.className ? this.props.className : ''}`}
          id={this.props.id}
          to={this.props.to}
        >
          {this.props.children}
        </Link>
      );
    }
  },
);
