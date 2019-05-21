import * as queryString from 'query-string';

export class HistoryPaginator {
  public static FromQueryString(search: string): HistoryPaginator {
    const contractExecutionIdx = queryString.parse(search).contractExecutionIdx as string;
    const contractExecutionIdxAsNumber = contractExecutionIdx ? Number(contractExecutionIdx) : undefined;
    return new HistoryPaginator(contractExecutionIdxAsNumber);
  }

  constructor(private contractExecutionIdx?: number) {}

  public getAsQueryString(firstParams: boolean = true): string {
    const prefix = firstParams ? '?' : '';

    if (this.contractExecutionIdx !== undefined) {
      return `${prefix}contractExecutionIdx=${this.contractExecutionIdx}`;
    }
  }

  public back(): void {
    if (this.contractExecutionIdx === 0) {
      this.contractExecutionIdx = undefined;
    } else {
      this.contractExecutionIdx = this.contractExecutionIdx - 5;
    }
  }
}
