import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { listenToBlocksSummaryAction } from './actions/blocksSummaryActions';
import { BlockDetails } from './components/BlockDetails';
import { Header } from './components/Header';
import { Home } from './components/home/Home';
import { TxDetails } from './components/TxDetails';
import { configureStore } from './store';

const store = configureStore();
store.dispatch(listenToBlocksSummaryAction());

class AppImpl extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Grid container spacing={24}>
            <Header />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/block/:hash' render={({ match }) => <BlockDetails hash={match.params.hash} />} />
              <Route path='/tx/:hash' render={({ match }) => <TxDetails hash={match.params.hash} />} />
            </Switch>
          </Grid>
        </Provider>
      </BrowserRouter>
    );
  }
}

export const App = hot(module)(AppImpl);
