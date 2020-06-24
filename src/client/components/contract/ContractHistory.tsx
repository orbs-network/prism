/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import * as React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import goLang from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import { IContractBlocksInfo } from '../../../shared/IContractData';
import { subtract, calcPrevBlock } from '../../utils/blockHeightUtils';
import { ConsoleText } from '../ConsoleText';
import { PrismLink } from '../PrismLink';
import { ShortTxesList } from '../ShortTxesList';
import { PrevHistoryPageButton } from './PrevHistoryPageButton';
import { NextHistoryPageButton } from './NextHistoryPageButton';
import { HistoryPaginator } from './HistoryTxPaginator';
import { CONTRACT_TXES_HISTORY_PAGE_SIZE } from '../../../shared/Constants';
import { useCallback } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { ContractTransactionsTable } from './contractTransactionsTable/ContractTransactionsTable';
import { useSnackbar, VariantType } from 'notistack';

SyntaxHighlighter.registerLanguage('go', goLang);

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    headerActions: {
      marginTop: 0,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  blocksInfo: IContractBlocksInfo;
  contractName: string;
}

export const ContractHistory = withStyles(styles)(({ blocksInfo, contractName, classes }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const blockHeights = Object.keys(blocksInfo).sort((a, b) => subtract(b, a));
  let prevPage: HistoryPaginator;
  let nextPage: HistoryPaginator;
  if (blockHeights.length > 0) {
    const lastBlockHeight = blockHeights[blockHeights.length - 1];
    const { txes } = blocksInfo[lastBlockHeight];
    const lastTx = txes[txes.length - 1];
    if (lastTx.executionIdx > 1) {
      prevPage = new HistoryPaginator(lastTx.executionIdx - 1);
    }

    const firstBlockHeight = blockHeights[0];
    const firstTx = blocksInfo[firstBlockHeight].txes[0];
    nextPage = new HistoryPaginator(firstTx.executionIdx + CONTRACT_TXES_HISTORY_PAGE_SIZE);
  }

  const clipboard = useClipboard();
  const onTxIdCopy = useCallback(
    (txId: string) => {
      clipboard.copy(txId);
      enqueueSnackbar('Copied !', { variant: 'success', autoHideDuration: 3000 });
      // TODO : O.L : Add better alert message (snackbar ?)
    },
    [clipboard],
  );

  return (
    <Card>
      <CardHeader
        title='History'
        id='contract-history'
        action={
          <>
            <NextHistoryPageButton contractName={contractName} nextPage={nextPage} />
            <PrevHistoryPageButton contractName={contractName} prevPage={prevPage} />
          </>
        }
        classes={{ root: classes.header, action: classes.headerActions }}
      />
      <CardContent>
        <ContractTransactionsTable
          blocksInfo={blocksInfo}
          orderedBlockHeights={blockHeights}
          saveToClipboard={onTxIdCopy}
        />
      </CardContent>
    </Card>
  );
});
