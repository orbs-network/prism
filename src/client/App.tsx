import Grid from '@material-ui/core/Grid';
import * as React from 'react';
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
store.dispatch(listenToBlocksSummaryAction() as any);

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

export class App extends React.Component {
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
                <Route
                  path='/block/:blockHash'
                  render={({ match }) => <BlockDetails blockHash={match.params.blockHash} />}
                />
                <Route path='/tx/:txId' render={({ match }) => <TxDetails txId={match.params.txId} />} />
                <Route path='/not-found/:term' render={({ match }) => <NotFound term={match.params.term} />} />
              </Switch>
            </Grid>
          </MuiThemeProvider>
        </Provider>
      </BrowserRouter>
    );
  }
}
