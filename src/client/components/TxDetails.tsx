import {
  createStyles,
  Theme,
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
} from '@material-ui/core';
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
import { ITx } from '../../shared/ITx';
import { IRawArgument, IRawEvent } from '../../server/orbs-adapter/IOrbsAdapter';

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
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>block</TableCell>
                  <TableCell align='left'>
                    <Link to={`/block/${tx.blockHash}`}>{tx.blockHash}</Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>txId</TableCell>
                  <TableCell align='left'>{tx.txId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Time stamp</TableCell>
                  <TableCell align='left'>{tx.timestamp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Protocol Version</TableCell>
                  <TableCell align='left'>{tx.protocolVersion}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Signer public key</TableCell>
                  <TableCell align='left'>{tx.signerPublicKey}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contract</TableCell>
                  <TableCell align='left'>{tx.contractName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell align='left'>{tx.methodName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Execution result</TableCell>
                  <TableCell align='left'>{tx.executionResult}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Input arguments</TableCell>
                  <TableCell>{this.renderArgs(tx.inputArguments)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ouput arguments</TableCell>
                  <TableCell>{this.renderArgs(tx.outputArguments)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ouput events</TableCell>
                  <TableCell>{this.renderEvents(tx.outputEvents)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    }

    private renderEvents(events: IRawEvent[]) {
      if (!events || events.length === 0) {
        return <div>None</div>;
      }

      return (
        <ul>
          {events.map((i, idx) => {
            return (
              <li key={idx}>
                {i.eventName}, ${i.contractName}, {this.renderArgs(i.arguments)}
              </li>
            );
          })}
        </ul>
      );
    }

    private renderArgs(args: IRawArgument[]) {
      if (!args || args.length === 0) {
        return <div>None</div>;
      }

      return (
        <>
          {args.map((i, idx) => {
            return <Chip key={idx} label={`${i.value} - [${i.type}]`} />;
          })}
        </>
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
