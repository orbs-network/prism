/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { IContractData } from '../../../shared/IContractData';
import { loadContractDataAction } from '../../actions/focusedContractActions';
import { IRootState } from '../../reducers/rootReducer';
import { ContractCode } from './ContractCode';
import { ContractHistory } from './ContractHistory';
import { HistoryPaginator } from './HistoryTxPaginator';

const styles = (theme: Theme) => createStyles({});

interface IOwnProps {
  contractName: string;
  executionIdx?: number;
}

interface IProps extends WithStyles<typeof styles> {
  contractData: IContractData;
  isLoading: boolean;
  error: string;
  loadContract: (contractName: string, historyPaginator: HistoryPaginator) => void;
}

const ContractDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      if (!this.props.isLoading) {
        if (!this.props.contractData || this.props.error) {
          this.fetchData();
        }
      }
    }

    public componentDidUpdate(prevProps: IOwnProps) {
      if (this.props.contractName !== prevProps.contractName || this.props.executionIdx !== prevProps.executionIdx) {
        this.fetchData();
      }
    }

    public render() {
      if (this.props.isLoading) {
        return <Typography>Loading...</Typography>;
      }

      if (!this.props.contractData) {
        return <Typography>Empty...</Typography>;
      }

      if (this.props.error) {
        return <Typography variant='h4'>{this.props.error}</Typography>;
      }

      const { code, contractName, blockInfo } = this.props.contractData;
      return (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <ContractCode code={code} contractName={contractName} />
          </Grid>
          <Grid item xs={12}>
            <ContractHistory blockInfo={blockInfo} contractName={contractName} />
          </Grid>
        </Grid>
      );
    }

    private fetchData() {
      const historyPaginator: HistoryPaginator = new HistoryPaginator(this.props.executionIdx);
      this.props.loadContract(this.props.contractName, historyPaginator);
    }
  },
);

const mapStateToProps = (state: IRootState, ownProps: IOwnProps) => ({
  contractData: state.focusedContract.contractData,
  isLoading: state.focusedContract.isLoading,
  error: state.focusedContract.error,
});

const dispatchProps = {
  loadContract: loadContractDataAction,
};

export const ContractDetails = connect(
  mapStateToProps,
  dispatchProps,
)(ContractDetailsImpl);
