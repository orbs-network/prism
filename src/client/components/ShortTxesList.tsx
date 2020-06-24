/* eslint-disable */
/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Tooltip, Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { PrismLink } from './PrismLink';
import { ConsoleText } from './ConsoleText';
import { IShortTx } from '../../shared/IContractData';
import ErrorIcon from '@material-ui/icons/Error';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import { useMemo } from 'react';

const styles = (theme: Theme) =>
  createStyles({
    signerAddress: {
      marginRight: theme.spacing(),
    },
    executionIdx: {
      marginRight: theme.spacing(),
    },
    errorIcon: {
      marginLeft: theme.spacing(),
      color: red[500],
      width: 16,
      position: 'relative',
      top: 6,
    },
    successIcon: {
      marginLeft: theme.spacing(),
      color: green[500],
      width: 16,
      position: 'relative',
      top: 6,
    },
    txIdTooltip: {
      maxWidth: 'none',
    },
    txIdspan: {
      '&:hover': {
        // backgroundColor: 'red',
        cursor: 'pointer',
        fontWeight: 'bold',
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {
  txes: IShortTx[];
  saveToClipboard: (txId: string) => void;
}

export const ShortTxesList = withStyles(styles)(({ classes, txes, saveToClipboard }: IProps) => {
  return (
    <>
      {txes.length > 0 ? (
        txes.map((tx) => (
          <div key={tx.txId}>
            {/* Execution index */}
            <ConsoleText className={classes.executionIdx}>{tx.executionIdx}</ConsoleText>

            {/* Signer Address */}
            {/*<ConsoleText className={classes.signerAddress}>{tx.signerAddress}</ConsoleText>*/}

            {/* Tx Id */}
            <Tooltip title={tx.txId} placement={'bottom'} classes={{ tooltip: classes.txIdTooltip }} enterDelay={400}>
              <span className={classes.txIdspan} onClick={() => saveToClipboard(tx.txId)}>
                <ConsoleText className={classes.signerAddress}>{getShortenedId(tx.txId)}</ConsoleText>
              </span>
            </Tooltip>

            {/* Link To Tx page */}
            <ConsoleText id={`tx-${tx.txId.toLowerCase()}`}>
              <PrismLink to={`/tx/${tx.txId}`}>{tx.method}</PrismLink>
            </ConsoleText>

            {/* Success Icon */}
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
  );
});

const getShortenedId = (id: string, buffer = 20) => {
  // First two characters are '0x'
  const begin = id.substr(2, buffer);
  const end = id.substr(-buffer, id.length);
  const combined = '0x' + begin + '...' + end;

  return combined;
};
