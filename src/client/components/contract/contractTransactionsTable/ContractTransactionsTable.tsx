import React, { useMemo } from 'react';
import { IContractBlocksInfo } from '../../../shared/IContractData';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ConsoleText } from '../ConsoleText';
import { PrismLink } from '../PrismLink';
import { ShortTxesList } from '../ShortTxesList';

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
        <TableRow key={blockHeight}>
          {/* Block Height */}
          <TableCell>
            <ConsoleText>
              <PrismLink to={`/block/${blockHeight}`}>{blockHeight}</PrismLink>
            </ConsoleText>
          </TableCell>

          {/* Transaction details */}
          {/*<TableCell>*/}
          <ShortTxesList saveToClipboard={saveToClipboard} txes={txes} />
          {/*</TableCell>*/}
        </TableRow>
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
