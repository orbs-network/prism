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
            <Typography>timestamp:{tx.timestamp}</Typography>
            <Typography>protocolVersion:{tx.protocolVersion}</Typography>
            <Typography>signerPublicKey:{tx.signerPublicKey}</Typography>
            <Typography>contractName:{tx.contractName}</Typography>
            <Typography>methodName:{tx.methodName}</Typography>
            <Typography>executionResult:{tx.executionResult}</Typography>

            <Typography>inputArguments:</Typography>
            <div>
              {tx.inputArguments &&
                tx.inputArguments.map((i, idx) => {
                  return (
                    <div key={idx}>
                      <Typography>Type: {i.type}</Typography>
                      <Typography>Value: {i.value}</Typography>
                    </div>
                  );
                })}
            </div>

            <Typography>outputArguments:</Typography>
            <div>
              {tx.outputArguments &&
                tx.outputArguments.map((i, idx) => {
                  return (
                    <div key={idx}>
                      <Typography>Type: {i.type}</Typography>
                      <Typography>Value: {i.value}</Typography>
                    </div>
                  );
                })}
            </div>

            <Typography>outputEvents:</Typography>
            <div>
              {tx.outputEvents &&
                tx.outputEvents.map((e, eventIdx) => {
                  return (
                    <div key={eventIdx}>
                      <Typography>Contract name: {e.contractName}</Typography>
                      <Typography>Event name: {e.eventName}</Typography>
                      <Typography>Arguments:</Typography>
                      <div>
                        {e.arguments.map((a, argIdx) => {
                          return (
                            <div key={argIdx}>
                              <Typography>Type: {a.type}</Typography>
                              <Typography>Value: {a.value}</Typography>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
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
