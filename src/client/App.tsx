import { Grid } from '@material-ui/core';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Block } from './components/Block';
// Pages
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Tx } from './components/Tx';

export const App = () => (
  <BrowserRouter>
    <div>
      <Grid container spacing={24}>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/block' component={Block} />
          <Route path='/tx' component={Tx} />
        </Switch>
      </Grid>
    </div>
  </BrowserRouter>
);
