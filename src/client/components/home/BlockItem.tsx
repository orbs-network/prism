import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { IBlock } from '../../../shared/IBlock';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  block: IBlock;
}

export const BlockItem = withStyles(styles)(({ classes, block }: IProps) => (
  <div>
    <hr />
    <div>Height: {block.blockHeight}</div>
  </div>
));
