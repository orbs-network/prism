import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, IRootState } from './reducers/rootReducer';

export function configureStore(preloadedState?: IRootState) {
  const middleware = [thunk];
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const result = createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...middleware)));

  return result;
}
