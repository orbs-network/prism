import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BlockDetails } from './components/BlockDetails';

import * as io from 'socket.io-client';

// Pages
import { Header } from './components/Header';
import { Home } from './components/home/Home';
import { Tx } from './components/Tx';

import { hot } from 'react-hot-loader';
import { IBlockSummary } from '../shared/IBlock';
import { Theme, createStyles, WithStyles } from '@material-ui/core';

const socket = io();

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {}

interface IState {
  blocks: IBlockSummary[];
}

class AppImpl extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { blocks: [] };
  }

  public componentDidMount() {
    socket.on('new-block-summary', (blockSummary: IBlockSummary) => {
      const blocks = [blockSummary, ...this.state.blocks].slice(0, 5);
      this.setState({ blocks });
    });
  }

  public render() {
    return (
      <BrowserRouter>
        <Grid container spacing={24}>
          <Header />
          <Switch>
            <Route exact path='/' render={() => <Home blocks={this.state.blocks} />} />
            <Route path='/block/:hash' component={BlockDetails} />
            <Route path='/tx' component={Tx} />
          </Switch>
        </Grid>
      </BrowserRouter>
    );
  }
}

export const App = hot(module)(AppImpl);
