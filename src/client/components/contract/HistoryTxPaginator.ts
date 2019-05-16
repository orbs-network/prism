import * as queryString from 'query-string';
import { calcPrevBlock } from '../../utils/blockHeightUtils';

export class HistoryPaginator {
  public static FromQueryString(search: string): HistoryPaginator {
    const blockHeight = queryString.parse(search).blockHeight as string;
    const contractExecutionIdx = queryString.parse(search).contractExecutionIdx as string;
    const contractExecutionIdxAsNumber = contractExecutionIdx ? Number(contractExecutionIdx) : undefined;
    return new HistoryPaginator(blockHeight, contractExecutionIdxAsNumber);
  }

  constructor(private blockHeight?: string, private contractExecutionIdx?: number) {}

  public getAsQueryString(firstParams: boolean = true): string {
    const prefix = firstParams ? '?' : '';
    if (this.blockHeight === undefined) {
      return '';
    }

    if (this.contractExecutionIdx === undefined) {
      return `${prefix}blockHeight=${this.blockHeight}`;
    } else {
      return `${prefix}blockHeight=${this.blockHeight}&contractExecutionIdx=${this.contractExecutionIdx}`;
    }
  }

  public back(): void {
    if (this.contractExecutionIdx === 0) {
      this.contractExecutionIdx = undefined;
      this.blockHeight = calcPrevBlock(this.blockHeight);
    } else {
      this.contractExecutionIdx--;
    }
  }
}
