import { common } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  createStyles,
  MuiThemeProvider,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { listenToBlocksSummaryAction } from './actions/blocksSummaryActions';
import { Background } from './components/Background';
import { BlockDetails } from './components/BlockDetails';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { TermNotFound } from './components/TermNotFound';
import { TxDetails } from './components/TxDetails';
import { configureStore } from './store';

const store = configureStore();
store.dispatch(listenToBlocksSummaryAction() as any);

const baseTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: 'rgba(16, 34, 91, 0.7)' },
    secondary: { main: '#74f6fd' },
    background: {
      default: '#16317d',
      paper: 'rgba(0, 31, 107, 0.6)',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
  overrides: {
    MuiTableCell: {
      body: {
        borderColor: fade(common.white, 0.15),
      },
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
        <Background />
        <Header />
        <div className={classes.root}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route
              path='/block/:blockHash'
              render={({ match }) => <BlockDetails blockHash={match.params.blockHash} />}
            />
            <Route path='/tx/:txId' render={({ match }) => <TxDetails txId={match.params.txId} />} />
            <Route path='/not-found/:term' render={({ match }) => <TermNotFound term={match.params.term} />} />
          </Switch>
        </div>
      </MuiThemeProvider>
    </Provider>
  </BrowserRouter>
));
