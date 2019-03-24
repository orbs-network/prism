/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, IRootState } from './reducers/rootReducer';

export function configureStore(preloadedState?: IRootState) {
  const middleware = [thunk];
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const result = createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...middleware)));

  return result;
}
