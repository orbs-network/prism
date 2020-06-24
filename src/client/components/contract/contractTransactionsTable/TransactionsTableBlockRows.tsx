import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { ConsoleText } from '../../ConsoleText';
import { PrismLink } from '../../PrismLink';
import { ShortTxesList } from '../../ShortTxesList';
import { IShortTx } from '../../../../shared/IContractData';

interface IProps {
  blockHeight: string;
  saveToClipboard: (txId: string) => void;
  txes: IShortTx[];
}

export const TransactionsTableBlockRow = React.memo<IProps>((props) => {
  const { blockHeight, txes, saveToClipboard } = props;

  const innerRows = useMemo(() => {}, []);

  return (
    <TableRow key={blockHeight}>
      {/* Block Height */}
      <TableCell rowSpan={3}>
        <ConsoleText>
          <PrismLink to={`/block/${blockHeight}`}>{blockHeight}</PrismLink>
        </ConsoleText>
      </TableCell>

      {innerRows}
      {/* Transaction details */}
      {/*<TableCell>*/}
      <ShortTxesList saveToClipboard={saveToClipboard} txes={txes} />
      {/*</TableCell>*/}
    </TableRow>
  );
});
