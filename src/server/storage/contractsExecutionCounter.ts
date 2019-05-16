import { IDB } from '../db/IDB';

export class ContractsExecutionCounter {
  private countersMap: Map<string, number> = new Map();

  constructor(private db: IDB) {}

  public async init(): Promise<void> {
    this.countersMap = await this.db.getContractsExecutionCounter();
  }

  public async incExecutionCounter(contractName: string): Promise<number> {
    const nextExecutionCounter = (this.countersMap.get(contractName) || 0) + 1;
    this.countersMap.set(contractName, nextExecutionCounter);
    await this.db.storeContractExecutionCounter(contractName, nextExecutionCounter);
    return nextExecutionCounter;
  }
}
