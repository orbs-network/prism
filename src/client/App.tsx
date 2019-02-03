import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Block } from './components/Block';
// Pages
import { Header } from './components/Header';
import { Home } from './components/home/Home';
import { Tx } from './components/Tx';

import { hot } from 'react-hot-loader';

const AppImpl = () => (
  <BrowserRouter>
    <Grid container spacing={24}>
      <Header />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/block/:hash' component={Block} />
        <Route path='/tx' component={Tx} />
      </Switch>
    </Grid>
  </BrowserRouter>
);

export const App = hot(module)(AppImpl);
