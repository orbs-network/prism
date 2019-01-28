import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { BlockItem } from './BlockItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { IBlock } from '../../../shared/IBlock';
import * as io from 'socket.io-client';

const socket = io();

const styles = (theme: Theme) => createStyles({});

type Props = WithStyles<typeof styles>;

interface IState {
  blocks: IBlock[];
}

export class BlockBox extends React.Component<Props, IState> {
  constructor(props) {
    super(props);
    this.state = { blocks: [] };
  }

  public componentDidMount() {
    socket.on('new-block', (block: IBlock) => {
      const blocks = [block, ...this.state.blocks].slice(0, 5);
      this.setState({ blocks });
    });
  }

  public render() {
    return (
      <Card id='blocks-box'>
        <CardHeader title={'Blocks'} />
        <CardContent>
          {this.state.blocks.map((block, idx) => (
            <BlockItem block={block} key={idx} />
          ))}
        </CardContent>
      </Card>
    );
  }
}
