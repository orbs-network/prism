export class HistoryPaginator {
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
