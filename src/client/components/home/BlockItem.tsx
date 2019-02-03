import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IBlockSummary } from '../../../shared/IBlock';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  block: IBlockSummary;
}

export const BlockItem = withStyles(styles)(({ classes, block }: IProps) => (
  <div id={`block-${block.height}`} data-type='block-item'>
    <hr />
    <div>
      Height: <span data-type='block-height'>{block.height}</span>
    </div>
    <div>
      Hash: <a href={`/block/${block.hash}`}>{block.hash}</a>
    </div>
    <div>Txns: {block.countOfTx}</div>
    <div>Time Stamp: {block.timestamp}</div>
    <div>Leader Node: {block.leanderNode}</div>
  </div>
));
