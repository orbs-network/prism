/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@material-ui/core';
import * as React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import goLang from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import { IContractBlockInfo } from '../../../shared/IContractData';
import { TxesList } from '../TxesList';
import { ConsoleText } from '../ConsoleText';
import { PrismLink } from '../PrismLink';
import { subtract } from '../../utils/blockHeightUtils';

SyntaxHighlighter.registerLanguage('go', goLang);

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  blockInfo: IContractBlockInfo;
}

export const ContractHistory = withStyles(styles)(({ blockInfo, classes }: IProps) => (
  <Card>
    <CardHeader title='History' id='contract-history' className={classes.header} />
    <CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Block Height</TableCell>
            <TableCell>Transactions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(blockInfo)
            .sort((a, b) => subtract(b, a))
            .map(blockHeight => {
              return (
                <TableRow key={blockHeight}>
                  <TableCell>
                    <ConsoleText>
                      <PrismLink to={`/block/${blockHeight}`}>{blockHeight}</PrismLink>
                    </ConsoleText>
                  </TableCell>
                  <TableCell>
                    <TxesList txIds={blockInfo[blockHeight].txes} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
));
