import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { BlockItem } from './BlockItem';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { IBlock } from '../../../shared/IBlock';

const styles = (theme: Theme) => createStyles({});

type Props = WithStyles<typeof styles>;

const fakeBlocks: IBlock[] = [
  {
    blockHeight: 7065236,
    leaderNode: 'OrbsTerra03',
    countOfTx: 234,
    approvalTime: Date.now(),
  },
  {
    blockHeight: 7065237,
    leaderNode: 'OrbsTerra02',
    countOfTx: 163,
    approvalTime: Date.now(),
  },
  {
    blockHeight: 7065238,
    leaderNode: 'OrbsIBM13',
    countOfTx: 442,
    approvalTime: Date.now(),
  },
  {
    blockHeight: 7065239,
    leaderNode: 'OrbsPepssi09',
    countOfTx: 125,
    approvalTime: Date.now(),
  },
];

export const BlockBox = withStyles(styles)(({ classes }: Props) => (
  <Card>
    <CardHeader title={'Blocks'} />
    <CardContent>
      {fakeBlocks.map((block, idx) => (
        <BlockItem block={block} key={idx} />
      ))}
    </CardContent>
  </Card>
));
