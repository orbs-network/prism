import {TDBBuildingStatus} from '../../server/db/IDB';

export interface IHealthStatusApiResponse {
    DB: {
        dbVersion: number;
        dbBuildingStatus: TDBBuildingStatus;
        lastBuiltBlock: number;
    };

    ORBS_SYNC: {
        latestBlockHeight: number;
    };
}