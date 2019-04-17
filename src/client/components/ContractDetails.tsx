/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { IContractData } from '../../shared/IContractData';
import { loadContractDataAction } from '../actions/focusedContractActions';
import { IRootState } from '../reducers/rootReducer';

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
  });

interface IOwnProps {
  contractName: string;
}

interface IProps extends WithStyles<typeof styles> {
  contractData: IContractData;
  isLoading: boolean;
  error: string;
  loadContract: (contractName: string) => void;
}

const ContractDetailsImpl = withStyles(styles)(
  class extends React.Component<IProps & IOwnProps> {
    public componentDidMount() {
      if (!this.props.isLoading) {
        if (!this.props.contractData || this.props.error) {
          this.props.loadContract(this.props.contractName);
        }
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

      const { classes } = this.props;
      const { code } = this.props.contractData;
      return (
        <Card>
          <CardHeader title='Contract' id='tx-details' className={classes.header} />
          <CardContent>
            {code}
          </CardContent>
        </Card>
      );
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
