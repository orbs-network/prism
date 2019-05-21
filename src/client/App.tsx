/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as queryString from 'query-string';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { config, Transition } from 'react-spring/renderprops';
import { BlockDetails } from './components/BlockDetails/BlockDetails';
import { ContractDetails } from './components/contract/ContractDetails';
import { Home } from './components/Home';
import { TermNotFound } from './components/TermNotFound';
import { TxDetails } from './components/TxDetails';
import { DISABLE_ANIMATIONS } from './config';

const styles = (theme: Theme) =>
  createStyles({
    swipeContainer: {
      position: 'absolute',
      width: '100%',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  location?: any;
}

const AppImpl = ({ classes, location }: IProps) => {
  return (
    <Transition
      config={config.slow}
      initial={null}
      immediate={DISABLE_ANIMATIONS}
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
            path='/block/:blockHeight'
            render={({ match }) => (
              <div style={props} className={classes.swipeContainer}>
                <BlockDetails blockHeight={match.params.blockHeight} />
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
            path='/contract/:contractName'
            render={({ match }) => {
              const executionIdx = queryString.parse(location.search).executionIdx;
              const executionIdxAsNumber = executionIdx ? Number(executionIdx) : undefined;
              return (
                <div style={props} className={classes.swipeContainer}>
                  <ContractDetails contractName={match.params.contractName} executionIdx={executionIdxAsNumber} />
                </div>
              );
            }}
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
  );
};

export const App: any = withRouter(withStyles(styles)(AppImpl as any));
