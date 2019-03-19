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
import { IRawArgument, IRawEvent } from '../../shared/IRawData';
import { loadTxAction } from '../actions/txActions';
import { IRootState } from '../reducers/rootReducer';
import { getTxData, isTxLoading, ITxData } from '../reducers/txsReducer';
import { PrismLink } from './PrismLink';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    label: {
      fontWeight: 700,
    },
    chips: {
      marginRight: 12,
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
          <CardHeader title='Transaction' id='tx-details' className={classes.header} />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.label}>Block Hash</TableCell>
                  <TableCell>
                    <PrismLink to={`/block/${tx.blockHash}`}>{tx.blockHash}</PrismLink>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Transaction Id</TableCell>
                  <TableCell>{tx.txId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Timestamp</TableCell>
                  <TableCell>{tx.timestamp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Protocol Version</TableCell>
                  <TableCell>{tx.protocolVersion}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Signer Public Key</TableCell>
                  <TableCell>{tx.signerPublicKey}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Contract</TableCell>
                  <TableCell>{tx.contractName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Method</TableCell>
                  <TableCell>{tx.methodName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Execution Result</TableCell>
                  <TableCell>{tx.executionResult}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Input Arguments</TableCell>
                  <TableCell>{this.renderArgs(tx.inputArguments)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Ouput Arguments</TableCell>
                  <TableCell>{this.renderArgs(tx.outputArguments)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Ouput Events</TableCell>
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
        return <div>-</div>;
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
        return <div>-</div>;
      }

      return (
        <>
          {args.map((i, idx) => {
            return (
              <Chip
                key={idx}
                id={`arg_${idx}`}
                color='secondary'
                label={i.value}
                className={this.props.classes.chips}
              />
            );
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
