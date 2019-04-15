/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      display: 'inline-block',
      backgroundColor: '#b0b0b038',
      paddingTop: theme.spacing.unit / 4,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit / 4,
      paddingLeft: theme.spacing.unit,
      marginTop: theme.spacing.unit / 4,
      marginBottom: theme.spacing.unit / 4,
      borderRadius: 5,
      fontSize: 15,
      fontFamily: 'Inconsolata, monospace',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  id?: string;
  className?: string;
}

export const ConsoleText = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      return (
        <span
          id={this.props.id}
          className={`${this.props.classes.textField} ${this.props.className ? this.props.className : ''}`}
        >
          {this.props.children}
        </span>
      );
    }
  },
);
