/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { common } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { listenToBlocksSummaryAction } from './actions/blocksSummaryActions';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { configureStore } from './store';
import { App } from './App';

const store = configureStore();
store.dispatch(listenToBlocksSummaryAction() as any);

const baseTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: 'rgba(16, 34, 91, 0.7)' },
    secondary: { main: '#7ccbf4' },
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

export const AppRoot = () => (
  <BrowserRouter>
    <Provider store={store}>
      <MuiThemeProvider theme={baseTheme}>
        <CssBaseline />
        <Background />
        <Header />
        <App />
      </MuiThemeProvider>
    </Provider>
  </BrowserRouter>
);
