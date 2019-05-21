import * as queryString from 'query-string';
export class HistoryPaginator {
  public static FromQueryString(search: string): HistoryPaginator {
    const executionIdx = queryString.parse(search).executionIdx as string;
    const executionIdxAsNumber = executionIdx ? Number(executionIdx) : undefined;
    return new HistoryPaginator(executionIdxAsNumber);
  }

  constructor(private executionIdx?: number) {}

  public getAsQueryString(firstParams: boolean = true): string {
    const prefix = firstParams ? '?' : '';

    if (this.executionIdx !== undefined) {
      return `${prefix}executionIdx=${this.executionIdx}`;
    } else {
      return '';
    }
  }
}
