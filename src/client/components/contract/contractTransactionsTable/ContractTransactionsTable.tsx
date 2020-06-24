import React, { useMemo } from 'react';
import { IContractBlocksInfo } from '../../../../shared/IContractData';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ConsoleText } from '../../ConsoleText';
import { PrismLink } from '../../PrismLink';
import { ShortTxesList } from '../../ShortTxesList';
import { TransactionsTableBlockRows } from './TransactionsTableBlockRows';
import { Theme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

interface IProps {
  blocksInfo: IContractBlocksInfo;
  orderedBlockHeights: string[];
  saveToClipboard: (txId: string) => void;
}
const useStyles = makeStyles({
  cellWithCenteredText: {
    textAlign: 'center',
  },
});

export const ContractTransactionsTable = React.memo<IProps>((props) => {
  const classes = useStyles();
  const { orderedBlockHeights, blocksInfo, saveToClipboard } = props;

  const rows = useMemo(() => {
    return orderedBlockHeights.map((blockHeight) => {
      const txes = blocksInfo[blockHeight].txes;

      return (
        <TransactionsTableBlockRows
          blockHeight={blockHeight}
          saveToClipboard={saveToClipboard}
          txes={txes}
          key={blockHeight}
        />
      );
    });
  }, [orderedBlockHeights, blocksInfo, saveToClipboard]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.cellWithCenteredText}>Block Height</TableCell>
          <TableCell className={classes.cellWithCenteredText}>Execution index</TableCell>
          <TableCell className={classes.cellWithCenteredText}>Signer ID</TableCell>
          <TableCell className={classes.cellWithCenteredText}>Tx ID</TableCell>
          <TableCell className={classes.cellWithCenteredText}>Method</TableCell>
          <TableCell className={classes.cellWithCenteredText}>Success</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{rows}</TableBody>
    </Table>
  );
});
