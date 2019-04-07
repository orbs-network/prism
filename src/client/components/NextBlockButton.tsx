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
import { IBlock } from '../../shared/IBlock';
import { calcNextBlock } from '../utils/blockHeightUtils';
import { IRootState } from '../reducers/rootReducer';
import { getHeighestBlockHeight } from '../reducers/recentBlocksReducer';
import { connect } from 'react-redux';

interface IOwnProps {
  block: IBlock;
}

interface IProps {
  heighestBlockHeight: string;
}

const NextBlockButtonImpl = ({ block, heighestBlockHeight }: IProps & IOwnProps) => {
  const { blockHeight } = block;
  if (blockHeight === heighestBlockHeight) {
    return (
      <IconButton disabled>
        <NavigateNext />
      </IconButton>
    );
  }

  return (
    <Link to={`/block/${calcNextBlock(blockHeight)}`}>
      <IconButton>
        <NavigateNext />
      </IconButton>
    </Link>
  );
};

const mapStateToProps = (state: IRootState) => ({
  heighestBlockHeight: getHeighestBlockHeight(state),
});

export const NextBlockButton = connect(mapStateToProps)(NextBlockButtonImpl);
