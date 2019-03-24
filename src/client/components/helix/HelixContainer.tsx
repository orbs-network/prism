/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { IBlockSummary } from '../../../shared/IBlock';
import { getRecentBlocksSummary } from '../../reducers/recentBlocksReducer';
import { IRootState } from '../../reducers/rootReducer';
import { Helix } from './Helix';

const styles = (theme: Theme) => createStyles({});

interface IProps {
  blocks: IBlockSummary[];
}
const HelixContainerImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      return (
        <Card id='helix-blocks-box'>
          <CardHeader title={'Blocks Helix'} />
          <CardContent>
            <Helix />
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocksSummary(state),
});

export const HelixContainer = connect(mapStateToProps)(HelixContainerImpl);
