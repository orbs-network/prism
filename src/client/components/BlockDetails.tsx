import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadBlockAction } from '../actions/blockActions';
import { getBlockData, IBlockData, isBlockLoading } from '../reducers/blocksReducer';
import { IRootState } from '../reducers/rootReducer';
import { TxesList } from './home/TxesList';
const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    line: {
      display: 'flex',
    },
    label: {
      paddingRight: theme.spacing.unit,
      fontWeight: 900,
    },
    link: {
      color: 'white',
    },
    txes: {
      paddingTop: theme.spacing.unit * 2,
    },
  });

interface IOwnProps {
  blockHash: string;
}

interface IProps extends WithStyles<typeof styles> {
  blockData: IBlockData;
  isBlockLoading: boolean;
  loadBlock: (blockHash: string) => void;
}

const BlockDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      if (!this.props.isBlockLoading && !this.props.blockData) {
        this.props.loadBlock(this.props.blockHash);
      }
    }

    public render() {
      if (this.props.isBlockLoading) {
        return <Typography>Loading...</Typography>;
      }

      if (!this.props.blockData) {
        return <Typography>Empty...</Typography>;
      }

      if (this.props.blockData.error) {
        return <Typography variant='h4'>{this.props.blockData.error}</Typography>;
      }

      const { classes } = this.props;
      const { block } = this.props.blockData;
      return (
        <Card>
          <CardHeader title='Block' id='block-details' className={classes.header} />
          <CardContent>
            <div className={classes.line}>
              <Typography className={classes.label}>Block Hash:</Typography>
              <Typography>{block.blockHash}</Typography>
            </div>
            <div className={classes.line}>
              <Typography className={classes.label}>Height:</Typography>
              <Typography>{block.blockHeight}</Typography>
            </div>
            <div className={classes.line}>
              <Typography className={classes.label}>TimeStamp:</Typography>
              <Typography>{block.blockTimestamp}</Typography>
            </div>
            <div className={`${classes.line} ${classes.txes}`}>
              <Typography className={classes.label}>Transactions:</Typography>
            </div>
            <TxesList txIds={block.txIds} />
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState, ownProps: IOwnProps) => ({
  blockData: getBlockData(state, ownProps.blockHash),
  isBlockLoading: isBlockLoading(state, ownProps.blockHash),
});

const dispatchProps = {
  loadBlock: loadBlockAction,
};

export const BlockDetails = connect(
  mapStateToProps,
  dispatchProps,
)(BlockDetailsImpl);
