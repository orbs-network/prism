import { Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { PrismLink } from './PrismLink';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {
  txIds: string[];
}

export const TxesList = withStyles(styles)(({ classes, txIds }: IProps) => (
  <div className={classes.root}>
    {txIds.length > 0 ? (
      txIds.map((txId, idx) => (
        <PrismLink to={`/tx/${txId}`} key={idx} id={`tx-${txId.toLowerCase()}`}>
          {txId}
        </PrismLink>
      ))
    ) : (
      <Typography>No transactions</Typography>
    )}
  </div>
));
