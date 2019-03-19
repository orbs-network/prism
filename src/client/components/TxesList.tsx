import { Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { PrismLink } from './PrismLink';
import { ConsoleText } from './ConsoleText';

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
        <ConsoleText key={idx} id={`tx-${txId.toLowerCase()}`}>
          <PrismLink to={`/tx/${txId}`}>{txId}</PrismLink>
        </ConsoleText>
      ))
    ) : (
      <Typography>No transactions</Typography>
    )}
  </div>
));
