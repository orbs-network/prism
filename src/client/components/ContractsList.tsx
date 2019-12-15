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
import { loadDeployedContractsAction } from '../actions/contractsActions';
import { IRootState } from '../reducers/rootReducer';
import { IContractGist } from '../../shared/IContractData';

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  deployedContracts: IContractGist[];
  isLoading: boolean;
  error: string;
  loadDeployedContracts: () => void;
}

const ContractsListImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    public componentDidMount() {
      if (!this.props.isLoading) {
        if (!this.props.error) {
          this.fetchData();
        }
      }
    }

    public render() {
      if (this.props.isLoading) {
        return <Typography>Loading...</Typography>;
      }

      if (this.props.deployedContracts.length === 0) {
        return <Typography>Empty...</Typography>;
      }

      if (this.props.error) {
        return <Typography variant='h4'>{this.props.error}</Typography>;
      }

      const { deployedContracts } = this.props;
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {deployedContracts.map(c => (
              <Typography key={c.contractName}>{c.contractName}</Typography>
            ))}
          </Grid>
        </Grid>
      );
    }

    private fetchData() {
      this.props.loadDeployedContracts();
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  deployedContracts: state.deployedContracts.deployedContracts,
  isLoading: state.deployedContracts.isLoading,
  error: state.deployedContracts.error,
});

const dispatchProps = {
  loadDeployedContracts: loadDeployedContractsAction,
};

export const ContractsList = connect(mapStateToProps, dispatchProps)(ContractsListImpl);
