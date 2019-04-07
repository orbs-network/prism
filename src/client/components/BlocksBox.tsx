/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { Transition } from 'react-spring/renderprops';
import { IBlockSummary } from '../../shared/IBlock';
import { getRecentBlocksSummary } from '../reducers/recentBlocksReducer';
import { IRootState } from '../reducers/rootReducer';
import { BlockItem } from './BlockItem';

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  blocks: IBlockSummary[];
}
const BlocksBoxImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes } = this.props;
      return (
        <>
          <Card id='blocks-box'>
            <CardHeader title={'Blocks'} className={classes.header} />
          </Card>
          <Transition
            config={{ duration: 250 }}
            items={this.props.blocks}
            keys={block => block.blockHash}
            from={{ height: 0, opacity: 0, transform: `scale(0, 0) translate(0, 0px)` }}
            enter={{ height: 105, opacity: 1, transform: `scale(1, 1) translate(0, 0px)` }}
            leave={{ opacity: 0, transform: `scale(1, 1) translate(0, 105px)` }}
          >
            {block => props => <BlockItem style={props} block={block} />}
          </Transition>
        </>
      );
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocksSummary(state),
});

export const BlocksBox = connect(mapStateToProps)(BlocksBoxImpl);
