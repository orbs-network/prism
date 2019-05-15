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
import { IContractBlockInfo } from '../../../shared/IContractData';
import { subtract, calcPrevBlock } from '../../utils/blockHeightUtils';
import { ConsoleText } from '../ConsoleText';
import { PrismLink } from '../PrismLink';
import { ShortTxesList } from '../ShortTxesList';
import { NextHistoryPageButton, INextTxIdx } from './NextHistoryPageButton';
import { PrevHistoryPageButton } from './PrevHistoryPageButton';

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
  blockInfo: IContractBlockInfo;
  contractName: string;
}

export const ContractHistory = withStyles(styles)(({ blockInfo, contractName, classes }: IProps) => {
  const blockHeights = Object.keys(blockInfo).sort((a, b) => subtract(b, a));
  let nextTxIdx: INextTxIdx;
  // TODO: also if it's smaller than the page size.
  if (blockHeights.length > 0) {
    let blockHeight = blockHeights[blockHeights.length - 1];
    const { txes } = blockInfo[blockHeight];
    const lastTx = txes[txes.length - 1];
    let { contractExecutionIdx } = lastTx;
    if (contractExecutionIdx === 0) {
      contractExecutionIdx = undefined;
      blockHeight = calcPrevBlock(blockHeight);
    } else {
      contractExecutionIdx--;
    }

    nextTxIdx = {
      blockHeight,
      contractExecutionIdx,
    };
  }
  return (
    <Card>
      <CardHeader
        title='History'
        id='contract-history'
        action={
          <>
            <PrevHistoryPageButton />
            <NextHistoryPageButton contractName={contractName} nextTxIdx={nextTxIdx} />
          </>
        }
        classes={{ root: classes.header, action: classes.headerActions }}
      />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block Height</TableCell>
              <TableCell>Transactions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blockHeights.map(blockHeight => {
              return (
                <TableRow key={blockHeight}>
                  <TableCell>
                    <ConsoleText>
                      <PrismLink to={`/block/${blockHeight}`}>{blockHeight}</PrismLink>
                    </ConsoleText>
                  </TableCell>
                  <TableCell>
                    <ShortTxesList txes={blockInfo[blockHeight].txes} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});
