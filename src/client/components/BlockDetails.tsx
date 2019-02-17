import { createStyles, Theme, withStyles } from '@material-ui/core';
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

const styles = (theme: Theme) => createStyles({});

interface IOwnProps {
  blockHash: string;
}

interface IProps {
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
        return <div>Loading...</div>;
      }

      if (!this.props.blockData) {
        return <div>empty</div>;
      }

      if (this.props.blockData.error) {
        return <Typography variant='h4'>{this.props.blockData.error}</Typography>;
      }

      const { block } = this.props.blockData;
      return (
        <Card>
          <CardHeader title='Block' />
          <CardContent>
            <Typography>blockHash:{block.blockHash}</Typography>
            <Typography>height:{block.blockHeight}</Typography>
            <Typography>numTransactions:{block.txsHashes.length}</Typography>
            <Typography>TimeStamp: {block.blockTimestamp}</Typography>
            <Typography>Txs</Typography>
            <ul>
              {block.txsHashes ? (
                block.txsHashes.map((hash, id) => (
                  <li key={id}>
                    <Link to={`/tx/${hash}`}>{hash}</Link>
                  </li>
                ))
              ) : (
                <Typography>No transactions found</Typography>
              )}
            </ul>
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
