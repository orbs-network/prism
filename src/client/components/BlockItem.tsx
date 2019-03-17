import { Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IBlockSummary } from '../../shared/IBlock';
import { PrismLink } from './PrismLink';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit,
    },
    line: {
      display: 'flex',
    },
    label: {
      paddingRight: theme.spacing.unit,
      fontWeight: 900,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  block: IBlockSummary;
}

export const BlockItem = withStyles(styles)(({ classes, block }: IProps) => (
  <div id={`block-${block.blockHeight}`} data-type='block-item' className={classes.root}>
    <div className={classes.line}>
      <Typography className={classes.label}>Height:</Typography>
      <Typography data-type='block-height'>{block.blockHeight}</Typography>
    </div>
    <div className={classes.line}>
      <Typography className={classes.label}>Block Hash:</Typography>
      <Typography data-type='block-hash'>
        <PrismLink to={`/block/${block.blockHash}`}>{block.blockHash}</PrismLink>
      </Typography>
    </div>
    <div className={classes.line}>
      <Typography className={classes.label}>Txns:</Typography>
      <Typography>{block.numTransactions}</Typography>
    </div>
    <div className={classes.line}>
      <Typography className={classes.label}>TimeStamp:</Typography>
      <Typography>{block.blockTimestamp}</Typography>
    </div>
  </div>
));
