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

export const TransactionsTableBlockRows = React.memo<IProps>((props) => {
  const { blockHeight, txes, saveToClipboard } = props;

  const innerRows = useMemo(() => {}, []);

  const [firstTx, ...restOfTxes] = txes;

  return (
    <>
      {/* First Row  */}
      <TableRow key={blockHeight} hover>
        {/* Block Height */}
        <TableCell rowSpan={txes.length + 1}>
          <ConsoleText>
            <PrismLink to={`/block/${blockHeight}`}>{blockHeight}</PrismLink>
          </ConsoleText>
        </TableCell>
      </TableRow>

      {/* Rest of the rows */}
      {txes.map((tx) => (
        <TableRow key={tx.txId} hover>
          <TableCell> {tx.txId} </TableCell>
        </TableRow>
      ))}
    </>
  );
});
