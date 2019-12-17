import React, {useEffect, useMemo} from 'react';
import {Button, Typography} from '@material-ui/core';
import { useStateful, useBoolean } from 'react-hanger';
import axios from 'axios';

import { IHealthStatusApiResponse } from '../../shared/apis/metricsApis';

type TDbBuildingStatuses = 'Unknown'| 'NotStarted' | 'InProcess' | 'Done';

export const DbBuildingStatusIndicator: React.FC<{}> = () => {
    const dbState = useStateful<{ status: TDbBuildingStatuses, lastBuiltBlock: number }>({ status: 'Unknown', lastBuiltBlock: 0 });
    const isVisible = useBoolean(true);

    const displayMessage = useMemo(() => {
        switch (dbState.value.status) {
            case 'Unknown':
                return 'DB building status is Unknown';
            case 'NotStarted':
                return 'DB building has not started yet';
            case 'InProcess':
                return `DB building is in process (last built block is ${dbState.value.lastBuiltBlock.toLocaleString()})`;
            case 'Done':
                return 'DB building is done';
            default:
                console.error(`Invalid db building status of ${dbState.value.status}`);
                return 'Invalid DB Building status value';
        }
    }, [ dbState.value.status, dbState.value.lastBuiltBlock]);

    useEffect( () => {
        async function fetchData() {
            try {
                const response = await axios.get('/api/health/status');
                const data: IHealthStatusApiResponse = response.data;
                const { dbBuildingStatus, lastBuiltBlock } = data.DB;

                if (dbBuildingStatus === 'HasNotStarted') {
                    dbState.setValue( { lastBuiltBlock: 0, status: 'NotStarted' });
                } else if (dbBuildingStatus === 'InWork') {
                    dbState.setValue( { lastBuiltBlock, status: 'InProcess' });
                } else if (dbBuildingStatus === 'Done') {
                    dbState.setValue( { lastBuiltBlock, status: 'Done' });
                }
            }  catch (e) {
                console.error(`Error while fetching db building status : ${e}`);
            }
        }

        const intervalId = setInterval(fetchData, 1500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Typography  variant='caption'>
                {displayMessage}
            </Typography>
        </>
    );
};