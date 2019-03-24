/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Table, TableBody, TableCell, TableRow, Theme, withStyles, WithStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { loadBlockAction } from '../actions/blockActions';
import { getBlockData, IBlockData, isBlockLoading } from '../reducers/blocksReducer';
import { IRootState } from '../reducers/rootReducer';
import { TxesList } from './TxesList';
import { ConsoleText } from './ConsoleText';
import { TimeStampField } from './TimeStampField';

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    label: {
      fontWeight: 700,
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
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.label}>Block Hash</TableCell>
                  <TableCell>
                    <ConsoleText>{block.blockHash}</ConsoleText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Block Height</TableCell>
                  <TableCell>{block.blockHeight}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Timestamp</TableCell>
                  <TableCell>
                    <TimeStampField timestamp={block.blockTimestamp} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.label}>Transactions</TableCell>
                  <TableCell>
                    <TxesList txIds={block.txIds} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
