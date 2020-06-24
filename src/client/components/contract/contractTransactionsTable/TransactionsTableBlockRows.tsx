/* eslint-disable */
import React, { useMemo } from 'react';
import { makeStyles, TableCell, TableRow, Tooltip, useTheme } from '@material-ui/core';
import { ConsoleText } from '../../ConsoleText';
import { PrismLink } from '../../PrismLink';
import { ShortTxesList } from '../../ShortTxesList';
import { IShortTx } from '../../../../shared/IContractData';
import { createStyles, Theme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

interface IProps {
  blockHeight: string;
  saveToClipboard: (txId: string) => void;
  txes: IShortTx[];
}

const useStyles = makeStyles((theme: Theme) => ({
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
  cellWithCenteredText: {
    textAlign: 'center',
  },
}));

export const TransactionsTableBlockRows = React.memo<IProps>((props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { blockHeight, txes, saveToClipboard } = props;

  return (
    <>
      {/* First Row  */}
      <TableRow key={blockHeight} hover>
        {/* Block Height */}
        <TableCell rowSpan={txes.length + 1} style={{ textAlign: 'center' }}>
          <ConsoleText>
            <PrismLink to={`/block/${blockHeight}`}>{blockHeight}</PrismLink>
          </ConsoleText>
        </TableCell>
      </TableRow>

      {/* Rest of the rows */}
      {txes.map((tx) => (
        <TableRow key={tx.txId} hover>
          {/* Execution index */}
          <TableCell size={'small'} className={classes.cellWithCenteredText}>
            <ConsoleText className={classes.executionIdx}>{tx.executionIdx}</ConsoleText>
          </TableCell>

          {/* Signer Address */}
          <TableCell className={classes.cellWithCenteredText}>
            <Tooltip
              title={tx.signerAddress}
              placement={'bottom'}
              classes={{ tooltip: classes.txIdTooltip }}
              enterDelay={400}
            >
              <span className={classes.txIdspan} onClick={() => saveToClipboard(tx.signerAddress)}>
                <ConsoleText className={classes.signerAddress}>{getShortenedId(tx.signerAddress)}</ConsoleText>
              </span>
            </Tooltip>
          </TableCell>

          {/* Tx Id */}
          <TableCell className={classes.cellWithCenteredText}>
            <Tooltip title={tx.txId} placement={'bottom'} classes={{ tooltip: classes.txIdTooltip }} enterDelay={400}>
              <span className={classes.txIdspan} onClick={() => saveToClipboard(tx.txId)}>
                <ConsoleText className={classes.signerAddress}>{getShortenedId(tx.txId)}</ConsoleText>
              </span>
            </Tooltip>
          </TableCell>

          {/* Method */}
          <TableCell className={classes.cellWithCenteredText}>
            <ConsoleText id={`tx-${tx.txId.toLowerCase()}`}>
              <PrismLink to={`/tx/${tx.txId}`}>{tx.method}</PrismLink>
            </ConsoleText>
          </TableCell>

          {/* Success indicator */}
          <TableCell size={'small'} className={classes.cellWithCenteredText}>
            {tx.successful ? (
              <SuccessIcon className={classes.successIcon} />
            ) : (
              <ErrorIcon className={classes.errorIcon} />
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
});

const getShortenedId = (id: string, buffer = 15) => {
  // First two characters are '0x'
  const begin = id.substr(2, buffer);
  const end = id.substr(-buffer, id.length);
  const combined = '0x' + begin + '...' + end;

  return combined;
};
