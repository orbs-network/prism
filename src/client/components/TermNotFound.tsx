/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import Typography from '@material-ui/core/Typography';
import * as React from 'react';

interface IProps {
  term: string;
}

export class TermNotFound extends React.Component<IProps> {
  public render() {
    return <Typography variant='h4'>"{this.props.term}" Not Found</Typography>;
  }
}
