import React, { useMemo } from 'react';
import { IContractBlocksInfo } from '../../../../shared/IContractData';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ConsoleText } from '../../ConsoleText';
import { PrismLink } from '../../PrismLink';
import { ShortTxesList } from '../../ShortTxesList';
import { TransactionsTableBlockRows } from './TransactionsTableBlockRows';

interface IProps {
  blocksInfo: IContractBlocksInfo;
  orderedBlockHeights: string[];
  saveToClipboard: (txId: string) => void;
}

export const ContractTransactionsTable = React.memo<IProps>((props) => {
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
          <TableCell>Block Height</TableCell>
          <TableCell>Transactions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{rows}</TableBody>
    </Table>
  );
});
