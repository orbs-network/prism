import { createStyles, Theme, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadFullBlockAction } from '../actions/fullBlockActions';
import { getFullBlockData, IFullBlockData, isFullBlockLoading } from '../reducers/blocksReducer';
import { IRootState } from '../reducers/rootReducer';

const styles = (theme: Theme) => createStyles({});

interface IOwnProps {
  hash: string;
}

interface IProps {
  fullBlockData: IFullBlockData;
  isFullBlockLoading: boolean;
  loadFullBlock: (hash: string) => void;
}

const BlockDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      this.props.loadFullBlock(this.props.hash);
    }

    public render() {
      if (this.props.isFullBlockLoading) {
        return <div>Loading...</div>;
      }

      const { block } = this.props.fullBlockData;
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
  fullBlockData: getFullBlockData(state, ownProps.hash),
  isFullBlockLoading: isFullBlockLoading(state, ownProps.hash),
});

const dispatchProps = {
  loadFullBlock: loadFullBlockAction,
};

export const BlockDetails = connect(
  mapStateToProps,
  dispatchProps,
)(BlockDetailsImpl);
