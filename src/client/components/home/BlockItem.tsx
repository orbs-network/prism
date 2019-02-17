import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Link } from 'react-router-dom';
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
  <div id={`block-${block.blockHeight}`} data-type='block-item'>
    <hr />
    <div>
      Height: <span data-type='block-height'>{block.blockHeight}</span>
    </div>
    <div>
      Block Hash: <Link to={`/block/${block.blockHash}`}>{block.blockHash}</Link>
    </div>
    <div>Txns: {block.numTransactions}</div>
    <div>TimeStamp : {block.blockTimestamp}</div>
  </div>
));
