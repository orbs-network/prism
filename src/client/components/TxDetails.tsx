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
  txId: string;
}

interface IProps {
  txData: ITxData;
  isTxLoading: boolean;
  loadTx: (txId: string) => void;
}

const TxDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      if (!this.props.isTxLoading && !this.props.txData) {
        this.props.loadTx(this.props.txId);
      }
    }

    public render() {
      if (this.props.isTxLoading) {
        return <div>Loading...</div>;
      }

      if (!this.props.txData) {
        return <div>Empty</div>;
      }

      if (this.props.txData.error) {
        return <Typography variant='h4'>{this.props.txData.error}</Typography>;
      }

      const { tx } = this.props.txData;
      return (
        <Card>
          <CardHeader title='Tx' id='tx-details' />
          <CardContent>
            <Typography>
              block:<Link to={`/block/${tx.blockHash}`}>{tx.blockHash}</Link>
            </Typography>
            <Typography>txId:{tx.txId}</Typography>
            <Typography>data:{tx.data}</Typography>
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState, ownProps: IOwnProps) => ({
  txData: getTxData(state, ownProps.txId),
  isTxLoading: isTxLoading(state, ownProps.txId),
});

const dispatchProps = {
  loadTx: loadTxAction,
};

export const TxDetails = connect(
  mapStateToProps,
  dispatchProps,
)(TxDetailsImpl);
