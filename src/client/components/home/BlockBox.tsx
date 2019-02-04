import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { IBlockSummary } from '../../../shared/IBlock';
import { IRootState } from '../../reducers/rootReducer';
import { BlockItem } from './BlockItem';
import { getRecentBlocks } from '../../reducers/recentBlocksReducer';

const styles = (theme: Theme) => createStyles({});

interface IProps {
  blocks: IBlockSummary[];
}
const BlockBoxImpl = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      return (
        <Card id='blocks-box'>
          <CardHeader title={'Blocks'} />
          <CardContent>
            {this.props.blocks.map((block, idx) => (
              <BlockItem block={block} key={idx} />
            ))}
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocks(state),
});

export const BlockBox = connect(mapStateToProps)(BlockBoxImpl);
