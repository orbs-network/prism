/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import TimeAgo from 'react-timeago';

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  timestamp: number;
}

export const TimeStampField = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const utc = new Date(this.props.timestamp);
      return (
        <>
          <span>{utc.toISOString().replace('T', ' ')} </span>
          <span>
            (<TimeAgo date={this.props.timestamp} minPeriod={5} />)
          </span>
        </>
      );
    }
  },
);
