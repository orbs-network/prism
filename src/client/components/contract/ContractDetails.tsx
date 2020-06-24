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
import { useCallback, useEffect } from 'react';

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

const ContractDetailsImpl = withStyles(styles)((props: IOwnProps & IProps) => {
  const { isLoading, contractData, error, loadContract, contractName, executionIdx } = props;

  const fetchData = useCallback(
    (contractName: string, executionIdx?: number) => {
      const historyPaginator: HistoryPaginator = new HistoryPaginator(executionIdx);
      loadContract(contractName, historyPaginator);
    },
    [loadContract],
  );

  useEffect(() => {
    fetchData(contractName, executionIdx);
  }, [fetchData, contractName, executionIdx]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!contractData) {
    return <Typography>Empty...</Typography>;
  }

  if (error) {
    return <Typography variant='h4'>{this.props.error}</Typography>;
  }

  const { code, contractName: contractNameFromData, blocksInfo } = contractData;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ContractCode code={code} contractName={contractNameFromData} />
      </Grid>
      <Grid item xs={12}>
        <ContractHistory blocksInfo={blocksInfo} contractName={contractNameFromData} />
      </Grid>
    </Grid>
  );
});

const mapStateToProps = (state: IRootState, ownProps: IOwnProps) => ({
  contractData: state.focusedContract.contractData,
  isLoading: state.focusedContract.isLoading,
  error: state.focusedContract.error,
});

const dispatchProps = {
  loadContract: loadContractDataAction,
};

export const ContractDetails = connect(mapStateToProps, dispatchProps)(ContractDetailsImpl);
