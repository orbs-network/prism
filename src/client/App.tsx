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
import { MuiThemeProvider, createMuiTheme, withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const store = configureStore();
store.dispatch(listenToBlocksSummaryAction() as any);

const baseTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: '#0f235e' },
    secondary: { main: '#74f6fd' },
    background: {
      default: '#16317d',
      paper: '#032573',
    },
  },
});

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 3,
      margin: 'auto',
      maxWidth: 1500,
    },
    headTableTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.unit * 3,
    },
  });

interface IProps extends WithStyles<typeof styles> {}

export const App = withStyles(styles)(({ classes }: IProps) => (
  <BrowserRouter>
    <Provider store={store}>
      <MuiThemeProvider theme={baseTheme}>
        <CssBaseline />
        <Header />
        <div className={classes.root}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route
              path='/block/:blockHash'
              render={({ match }) => <BlockDetails blockHash={match.params.blockHash} />}
            />
            <Route path='/tx/:txId' render={({ match }) => <TxDetails txId={match.params.txId} />} />
            <Route path='/not-found/:term' render={({ match }) => <NotFound term={match.params.term} />} />
          </Switch>
        </div>
      </MuiThemeProvider>
    </Provider>
  </BrowserRouter>
));
