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
