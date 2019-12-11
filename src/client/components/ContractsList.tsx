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
import { loadContractsNamesAction } from '../actions/contractsActions';
import { IRootState } from '../reducers/rootReducer';

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  contractsNames: string[];
  isLoading: boolean;
  error: string;
  loadContractsNames: () => void;
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

      if (this.props.contractsNames.length === 0) {
        return <Typography>Empty...</Typography>;
      }

      if (this.props.error) {
        return <Typography variant='h4'>{this.props.error}</Typography>;
      }

      const { contractsNames } = this.props;
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {contractsNames.map(c => (
              <Typography key={c}>{c}</Typography>
            ))}
          </Grid>
        </Grid>
      );
    }

    private fetchData() {
      this.props.loadContractsNames();
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  contractsNames: state.contractsNames.contractsNames,
  isLoading: state.contractsNames.isLoading,
  error: state.contractsNames.error,
});

const dispatchProps = {
  loadContractsNames: loadContractsNamesAction,
};

export const ContractsList = connect(mapStateToProps, dispatchProps)(ContractsListImpl);
