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
        <ConsoleText key={idx}>
          <PrismLink to={`/tx/${txId}`} id={`tx-${txId.toLowerCase()}`}>
            {txId}
          </PrismLink>
        </ConsoleText>
      ))
    ) : (
      <Typography>No transactions</Typography>
    )}
  </div>
));
