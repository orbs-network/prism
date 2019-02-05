import { createStyles, Theme, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '../reducers/rootReducer';
import { getTxData, isTxLoading, ITxData } from '../reducers/txsReducer';
import { loadTxAction } from '../actions/txActions';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) => createStyles({});

interface IOwnProps {
  hash: string;
}

interface IProps {
  txData: ITxData;
  isTxLoading: boolean;
  loadTx: (hash: string) => void;
}

const TxDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      this.props.loadTx(this.props.hash);
    }

    public render() {
      if (this.props.isTxLoading) {
        return <div>Loading...</div>;
      }

      const { tx } = this.props.txData;
      return (
        <Card>
          <CardHeader title='Tx' />
          <CardContent>
            <Typography>
              block:<Link to={`/block/${tx.blockHash}`}>{tx.blockHash}</Link>
            </Typography>
            <Typography>hash:{tx.hash}</Typography>
            <Typography>data:{tx.data}</Typography>
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState, ownProps: IOwnProps) => ({
  txData: getTxData(state, ownProps.hash),
  isTxLoading: isTxLoading(state, ownProps.hash),
});

const dispatchProps = {
  loadTx: loadTxAction,
};

export const TxDetails = connect(
  mapStateToProps,
  dispatchProps,
)(TxDetailsImpl);
