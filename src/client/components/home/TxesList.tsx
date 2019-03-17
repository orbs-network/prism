import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    link: {
      color: 'white',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  txIds: string[];
}

export const TxesList = withStyles(styles)(({ classes, txIds }: IProps) => (
  <div className={classes.root}>
    {txIds.length > 0 ? (
      txIds.map((txId, idx) => (
        <Link className={classes.link} to={`/tx/${txId}`} key={idx} id={`tx-${txId.toLowerCase()}`}>
          {txId}
        </Link>
      ))
    ) : (
      <Typography>No transactions</Typography>
    )}
  </div>
));
