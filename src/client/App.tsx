import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { listenToBlocksSummaryAction } from './actions/blocksSummaryActions';
import { BlockDetails } from './components/BlockDetails';
import { Header } from './components/Header';
import { Home } from './components/home/Home';
import { NotFound } from './components/NotFound';
import { TxDetails } from './components/TxDetails';
import { configureStore } from './store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const store = configureStore();
store.dispatch(listenToBlocksSummaryAction());

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: '#09142c' },
    secondary: { main: '#74f6fd' },
    background: {
      default: '#0a0f25',
      paper: '#192a45',
    },
  },
});

class AppImpl extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container spacing={24}>
              <Header />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/block/:hash' render={({ match }) => <BlockDetails hash={match.params.hash} />} />
                <Route path='/tx/:hash' render={({ match }) => <TxDetails hash={match.params.hash} />} />
                <Route path='/not-found/:term' render={({ match }) => <NotFound term={match.params.term} />} />
              </Switch>
            </Grid>
          </MuiThemeProvider>
        </Provider>
      </BrowserRouter>
    );
  }
}

export const App = hot(module)(AppImpl);
