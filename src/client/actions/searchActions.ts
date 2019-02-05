import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ISearchResult } from '../../shared/ISearchResult';
import { search } from '../utils/api-facade';

// Action Creators
export const searchAction = (term: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(searchStartedAction(term));
    try {
      const searchResult: ISearchResult = await search(term); // Call the server api
      dispatch(searchCompletedAction(searchResult));
    } catch (e) {
      dispatch(seachErrorAction(e));
    }
  };
};

export interface ISearchStartedAction {
  type: 'SEARCH_STARTED';
  hash: string;
}

export const searchStartedAction = (hash: string): ISearchStartedAction => ({
  type: 'SEARCH_STARTED',
  hash,
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
