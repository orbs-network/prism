import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { BlockItem } from './BlockItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { IBlockSummary } from '../../../shared/IBlock';
import { connect } from 'react-redux';
import { IState } from '../../reducers/rootReducer';

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  blocks: IBlockSummary[];
}

class BlockBoxImpl extends React.Component<IProps> {
  public render() {
    return (
      <Card id='blocks-box'>
        <CardHeader title={'Blocks'} />
        <CardContent>
          {this.props.blocks.slice(0, 5).map((block, idx) => (
            <BlockItem block={block} key={idx} />
          ))}
        </CardContent>
      </Card>
    );
  }
}

function mapStateToProps(state: IState) {
  return {
    blocks: state.blocks,
  };
}

export const BlockBox = connect(mapStateToProps)(BlockBoxImpl);
