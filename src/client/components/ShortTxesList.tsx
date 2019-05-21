/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { PrismLink } from './PrismLink';
import { ConsoleText } from './ConsoleText';
import { IShortTx } from '../../shared/IContractData';
import ErrorIcon from '@material-ui/icons/Error';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

const styles = (theme: Theme) =>
  createStyles({
    signerAddress: {
      marginRight: theme.spacing.unit,
    },
    executionIdx: {
      marginRight: theme.spacing.unit,
    },
    errorIcon: {
      marginLeft: theme.spacing.unit,
      color: red[500],
      width: 16,
      position: 'relative',
      top: 6,
    },
    successIcon: {
      marginLeft: theme.spacing.unit,
      color: green[500],
      width: 16,
      position: 'relative',
      top: 6,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  txes: IShortTx[];
}

export const ShortTxesList = withStyles(styles)(({ classes, txes }: IProps) => (
  <>
    {txes.length > 0 ? (
      txes.map(tx => (
        <div key={tx.txId}>
          <ConsoleText className={classes.executionIdx}>{tx.executionIdx}</ConsoleText>
          <ConsoleText className={classes.signerAddress}>{tx.signerAddress}</ConsoleText>
          <ConsoleText id={`tx-${tx.txId.toLowerCase()}`}>
            <PrismLink to={`/tx/${tx.txId}`}>{tx.method}</PrismLink>
          </ConsoleText>
          {tx.successful ? (
            <SuccessIcon className={classes.successIcon} />
          ) : (
            <ErrorIcon className={classes.errorIcon} />
          )}
        </div>
      ))
    ) : (
      <Typography>No transactions</Typography>
    )}
  </>
));
