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
const BlockBoxImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const { classes } = this.props;
      return (
        <div>
          <Card id='blocks-box'>
            <CardHeader title={'Blocks'} className={classes.header} />
          </Card>
          <Transition
            items={this.props.blocks}
            keys={block => block.blockHash}
            from={{ height: 0, opacity: 0, transform: `scale(0, 0) translate(0, 0px)` }}
            enter={{ height: 130, opacity: 1, transform: `scale(1, 1) translate(0, 0px)` }}
            leave={{ opacity: 0, transform: `scale(1, 1) translate(0, 130px)` }}
          >
            {block => props => <BlockItem style={props} block={block} />}
          </Transition>
        </div>
      );
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocksSummary(state),
});

export const BlockBox = connect(mapStateToProps)(BlockBoxImpl);
