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
import { HistoryPaginator } from './HistoryTxPaginator';

interface IProps {
  contractName: string;
  prevPage: HistoryPaginator;
}

export const PrevHistoryPageButton = ({ contractName, prevPage }: IProps) => {
  if (!prevPage) {
    return (
      <IconButton disabled>
        <NavigateNext />
      </IconButton>
    );
  }

  return (
    <Link to={`/contract/${contractName}${prevPage.getAsQueryString()}`}>
      <IconButton>
        <NavigateNext />
      </IconButton>
    </Link>
  );
};
