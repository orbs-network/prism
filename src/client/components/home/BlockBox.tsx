import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { BlockItem } from './BlockItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { IBlockSummary } from '../../../shared/IBlock';

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  blocks: IBlockSummary[];
}

export const BlockBox = withStyles(styles)(
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
