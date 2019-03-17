import {
  Chip,
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IRawArgument, IRawEvent } from '../../shared/IRawData';
import { loadTxAction } from '../actions/txActions';
import { IRootState } from '../reducers/rootReducer';
import { getTxData, isTxLoading, ITxData } from '../reducers/txsReducer';

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    chips: {
      marginRight: 10,
    },
  });

interface IOwnProps {
  txId: string;
}

interface IProps extends WithStyles<typeof styles> {
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
        return <Typography>Loading...</Typography>;
      }

      if (!this.props.txData) {
        return <Typography>Empty...</Typography>;
      }

      if (this.props.txData.error) {
        return <Typography variant='h4'>{this.props.txData.error}</Typography>;
      }

      const { classes } = this.props;
      const { tx } = this.props.txData;
      return (
        <Card>
          <CardHeader title='Tx' id='tx-details' className={classes.header} />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>block</TableCell>
                  <TableCell>
                    <Link to={`/block/${tx.blockHash}`}>{tx.blockHash}</Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>txId</TableCell>
                  <TableCell>{tx.txId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Time stamp</TableCell>
                  <TableCell>{tx.timestamp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Protocol Version</TableCell>
                  <TableCell>{tx.protocolVersion}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Signer public key</TableCell>
                  <TableCell>{tx.signerPublicKey}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contract</TableCell>
                  <TableCell>{tx.contractName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell>{tx.methodName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Execution result</TableCell>
                  <TableCell>{tx.executionResult}</TableCell>
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
            return <Chip key={idx} id={`arg_${idx}`} label={i.value} className={this.props.classes.chips} />;
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
