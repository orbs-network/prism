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
  hash: string;
}

interface IProps {
  blockData: IBlockData;
  isBlockLoading: boolean;
  loadBlock: (hash: string) => void;
}

const BlockDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      this.props.loadBlock(this.props.hash);
    }

    public render() {
      if (this.props.isBlockLoading) {
        return <div>Loading...</div>;
      }

      const { block } = this.props.blockData;
      return (
        <Card>
          <CardHeader title='Block' />
          <CardContent>
            <Typography>data</Typography>
            <Typography>hash:{block.hash}</Typography>
            <Typography>height:{block.height}</Typography>
            <Typography>countOfTx:{block.countOfTx}</Typography>
            <Typography>timestamp:{block.timestamp}</Typography>
            <Typography>leanderNode:{block.leanderNode}</Typography>
            <Typography>Txs</Typography>
            <ul>
              {block.txsHashes.map((hash, id) => (
                <li key={id}>
                  <Link to={`/tx/${hash}`}>{hash}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState, ownProps: IOwnProps) => ({
  blockData: getBlockData(state, ownProps.hash),
  isBlockLoading: isBlockLoading(state, ownProps.hash),
});

const dispatchProps = {
  loadBlock: loadBlockAction,
};

export const BlockDetails = connect(
  mapStateToProps,
  dispatchProps,
)(BlockDetailsImpl);
