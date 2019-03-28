/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Paper, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { animated } from 'react-spring/renderprops';
import { IBlockSummary } from '../../shared/IBlock';
import { ConsoleText } from './ConsoleText';
import { PrismLink } from './PrismLink';
import { TimeStampField } from './TimeStampField';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      marginTop: theme.spacing.unit,
    },
    line: {
      display: 'flex',
      marginBottom: theme.spacing.unit / 4,
    },
    label: {
      paddingRight: theme.spacing.unit,
      minWidth: 150,
      fontWeight: 700,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  style?: any;
  block: IBlockSummary;
}

export const BlockItem = withStyles(styles)(({ classes, block, style }: IProps) => (
  <animated.div id={`block-${block.blockHeight}`} data-type='block-item' style={style}>
    <Paper className={classes.paper}>
      <div className={classes.line}>
        <Typography className={classes.label}>Block Height:</Typography>
        <Typography data-type='block-height'>{block.blockHeight}</Typography>
      </div>
      <div className={classes.line}>
        <Typography className={classes.label}>Block Hash:</Typography>
        <Typography data-type='block-hash'>
          <ConsoleText>
            <PrismLink to={`/block/${block.blockHash}`}>{block.blockHash}</PrismLink>
          </ConsoleText>
        </Typography>
      </div>
      <div className={classes.line}>
        <Typography className={classes.label}>Transactions:</Typography>
        <Typography>{block.numTransactions > 0 ? block.numTransactions : '-'}</Typography>
      </div>
      <div className={classes.line}>
        <Typography className={classes.label}>Timestamp:</Typography>
        <Typography>
          <TimeStampField timestamp={block.blockTimestamp} />
        </Typography>
      </div>
    </Paper>
  </animated.div>
));
