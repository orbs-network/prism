/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Tooltip, Typography } from '@material-ui/core';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    vchainId: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    vchainHelpIcon: {
      color: theme.palette.secondary.main,
      width: 16,
      position: 'relative',
      top: 6,
    },
    tooltip: {
      backgroundColor: 'rgba(16, 34, 91)',
      opacity: 1,
      fontSize: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
      padding: theme.spacing(),
      maxWidth: 500,
    },
    tooltipPopper: {
      opacity: 1,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  vchainId: number;
}

export const VChainDetails = withStyles(styles)(({ vchainId, classes }: IProps) => (
  <Typography className={classes.vchainId}>
    Virtual Chain Id: {vchainId}{' '}
    <Tooltip
      classes={{ popper: classes.tooltipPopper, tooltip: classes.tooltip }}
      title={`The Orbs network runs multiple virtual chains in parallel on the same shared validator infrastructure. Virtual chains provide isolation between apps where every virtual chain runs its own parallel consensus and maintains its own chain of blocks. If you can't find your transactions, make sure you're watching the correct virtual chain Id.`}
      placement='bottom'
    >
      <HelpIcon className={classes.vchainHelpIcon} />
    </Tooltip>
  </Typography>
));
