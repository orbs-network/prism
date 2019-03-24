/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ISearchResult } from '../../shared/ISearchResult';
import { search } from '../utils/api-facade';

// Action Creators
export const searchAction = (term: string, history): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(searchStartedAction(term));
    try {
      const searchResult: ISearchResult = await search(term); // Call the server api
      dispatch(searchCompletedAction(searchResult));
      if (searchResult.type === 'block') {
        history.push(`/block/${searchResult.block.blockHash}`);
      } else {
        history.push(`/tx/${searchResult.tx.txId}`);
      }
      // navigate to the result
    } catch (e) {
      history.push(`/not-found/${term}`);
      dispatch(seachErrorAction(e));
    }
  };
};

export interface ISearchStartedAction {
  type: 'SEARCH_STARTED';
  term: string;
}

export const searchStartedAction = (term: string): ISearchStartedAction => ({
  type: 'SEARCH_STARTED',
  term,
});

export interface ISearchCompletedAction {
  type: 'SEARCH_COMPLETED';
  searchResult: ISearchResult;
}

export const searchCompletedAction = (searchResult: ISearchResult): ISearchCompletedAction => ({
  type: 'SEARCH_COMPLETED',
  searchResult,
});

export interface ISearchErrorAction {
  type: 'SEARCH_ERROR';
  error: string;
}

export const seachErrorAction = (error: string): ISearchErrorAction => ({
  type: 'SEARCH_ERROR',
  error,
});

// All Actions
export type SearchActions = ISearchStartedAction | ISearchCompletedAction | ISearchErrorAction;
