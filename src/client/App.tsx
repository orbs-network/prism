import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { BlockDetails } from './components/BlockDetails';
import { Home } from './components/Home';
import { TermNotFound } from './components/TermNotFound';
import { TxDetails } from './components/TxDetails';
import { animated, Transition, config } from 'react-spring/renderprops';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing.unit * 3,
      margin: 'auto',
      position: 'relative',
      maxWidth: 1100,
    },
    swipeContainer: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      position: 'absolute',
      width: '100%',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  location?: any;
}

const AppImpl = ({ classes, location }: IProps) => {
  return (
    <div className={classes.root}>
      <Transition
        config={config.slow}
        keys={location.pathname}
        from={{ opacity: 0, transform: 'translateX(-15%)' }}
        enter={{ opacity: 1, transform: 'translateX(0%)' }}
        leave={{ opacity: 0, transform: 'translateX(15%)' }}
      >
        {style => props => (
          <Switch location={location}>
            <Route
              exact
              path='/'
              render={() => (
                <div style={props} className={classes.swipeContainer}>
                  <Home />
                </div>
              )}
            />
            <Route
              path='/block/:blockHash'
              render={({ match }) => (
                <div style={props} className={classes.swipeContainer}>
                  <BlockDetails blockHash={match.params.blockHash} />
                </div>
              )}
            />
            <Route
              path='/tx/:txId'
              render={({ match }) => (
                <div style={props} className={classes.swipeContainer}>
                  <TxDetails txId={match.params.txId} />
                </div>
              )}
            />
            <Route
              path='/not-found/:term'
              render={({ match }) => (
                <div style={props} className={classes.swipeContainer}>
                  <TermNotFound term={match.params.term} />
                </div>
              )}
            />
          </Switch>
        )}
      </Transition>
    </div>
  );
};

export const App: any = withRouter(withStyles(styles)(AppImpl as any));
