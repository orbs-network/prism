import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { IBlockSummary } from '../../../shared/IBlock';
import { IRootState } from '../../reducers/rootReducer';
import { BlockItem } from './BlockItem';
import { getRecentBlocksSummary } from '../../reducers/recentBlocksReducer';

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
        <Card id='blocks-box'>
          <CardHeader title={'Blocks'} className={classes.header} />
          <CardContent>
            {this.props.blocks.map((block, idx) => (
              <div key={idx}>
                {idx > 0 ? <hr /> : null}
                <BlockItem block={block} />
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }
  },
);

const mapStateToProps = (state: IRootState) => ({
  blocks: getRecentBlocksSummary(state),
});

export const BlockBox = connect(mapStateToProps)(BlockBoxImpl);
