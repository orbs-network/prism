/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IconButton } from '@material-ui/core';
import NavigateNext from '@material-ui/icons/NavigateNext';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface INextTxIdx {
  blockHeight: string;
  contractExecutionIdx?: number;
}

interface IProps {
  contractName: string;
  nextTxIdx: INextTxIdx;
}

export const NextHistoryPageButton = ({ contractName, nextTxIdx }: IProps) => {
  if (!nextTxIdx) {
    return (
      <IconButton disabled>
        <NavigateNext />
      </IconButton>
    );
  }

  const { blockHeight, contractExecutionIdx } = nextTxIdx;
  const query = typeof contractExecutionIdx !== undefined
    ? `?blockHeight=${blockHeight}&contractExecutionIdx=${contractExecutionIdx}`
    : `?blockHeight=${blockHeight}`;
  return (
    <Link to={`/contract/${contractName}${query}`}>
      <IconButton>
        <NavigateNext />
      </IconButton>
    </Link>
  );
};
