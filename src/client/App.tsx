import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BlockDetails } from './components/BlockDetails';
import { Home } from './components/Home';
import { TermNotFound } from './components/TermNotFound';
import { TxDetails } from './components/TxDetails';

const animSpeed = 250;
const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 3,
      margin: 'auto',
      position: 'relative',
      maxWidth: 1500,
    },
    headTableTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.unit * 3,
    },
    swipeContainer: {
      position: 'absolute',
      width: '100%',
    },
    routeEnter: {
      transform: 'translateX(-15%)',
      opacity: 0,
    },
    routeEnterActive: {
      transform: 'translateX(0%)',
      opacity: 1,
      transition: `all ${animSpeed}ms ease-out`,
    },
    routeExit: {
      transform: 'translateX(0%)',
      opacity: 1,
    },
    routeExitActive: {
      transform: 'translateX(15%)',
      opacity: 0,
      transition: `all ${animSpeed}ms ease-out`,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  location?: any;
}

const AppImpl = ({ classes, location }: IProps) => (
  <div className={classes.root}>
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={animSpeed}
        classNames={{
          enter: classes.routeEnter,
          enterActive: classes.routeEnterActive,
          exit: classes.routeExit,
          exitActive: classes.routeExitActive,
        }}
      >
        <div className={classes.swipeContainer}>
          <Switch location={location}>
            <Route exact path='/' component={Home} />
            <Route
              path='/block/:blockHash'
              render={({ match }) => <BlockDetails blockHash={match.params.blockHash} />}
            />
            <Route path='/tx/:txId' render={({ match }) => <TxDetails txId={match.params.txId} />} />
            <Route path='/not-found/:term' render={({ match }) => <TermNotFound term={match.params.term} />} />
          </Switch>
        </div>
      </CSSTransition>
    </TransitionGroup>
  </div>
);

export const App: any = withRouter(withStyles(styles)(AppImpl));
