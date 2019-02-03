import { createStyles, Theme, WithStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as io from 'socket.io-client';
import { BlockDetails } from './components/BlockDetails';
// Pages
import { Header } from './components/Header';
import { Home } from './components/home/Home';
import { Tx } from './components/Tx';
import { configureStore } from './store';
import { listenToBlocksSummaryAction } from './blocksSummaryActions';

const store = configureStore();
store.dispatch(listenToBlocksSummaryAction());

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {}

class AppImpl extends React.Component<IProps> {
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Grid container spacing={24}>
            <Header />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/block/:hash' component={BlockDetails} />
              <Route path='/tx' component={Tx} />
            </Switch>
          </Grid>
        </BrowserRouter>
      </Provider>
    );
  }
}

export const App = hot(module)(AppImpl);
