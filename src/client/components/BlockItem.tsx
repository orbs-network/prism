import { Typography, Paper } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as React from 'react';
import { IBlockSummary } from '../../shared/IBlock';
import { ConsoleText } from './ConsoleText';
import { PrismLink } from './PrismLink';
import { TimeStampField } from './TimeStampField';
import { animated } from 'react-spring/renderprops';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 2,
    },
    line: {
      display: 'flex',
      marginBottom: theme.spacing.unit / 2,
    },
    label: {
      paddingRight: theme.spacing.unit,
      minWidth: 150,
      fontWeight: 700,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  style?: any;
  block: IBlockSummary;
}

export const BlockItem = withStyles(styles)(({ classes, block, style }: IProps) => (
  <animated.div id={`block-${block.blockHeight}`} data-type='block-item' style={style}>
    <Paper className={classes.root}>
      <div className={classes.line}>
        <Typography className={classes.label}>Block Height:</Typography>
        <Typography data-type='block-height'>{block.blockHeight}</Typography>
      </div>
      <div className={classes.line}>
        <Typography className={classes.label}>Block Hash:</Typography>
        <Typography data-type='block-hash'>
          <ConsoleText>
            <PrismLink to={`/block/${block.blockHash}`}>{block.blockHash}</PrismLink>
          </ConsoleText>
        </Typography>
      </div>
      <div className={classes.line}>
        <Typography className={classes.label}>Transactions:</Typography>
        <Typography>{block.numTransactions > 0 ? block.numTransactions : '-'}</Typography>
      </div>
      <div className={classes.line}>
        <Typography className={classes.label}>Timestamp:</Typography>
        <Typography>
          <TimeStampField timestamp={block.blockTimestamp} />
        </Typography>
      </div>
    </Paper>
  </animated.div>
));
