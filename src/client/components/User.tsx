/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { IUserDTO } from '../../shared/IUserDTO';

interface IProps {
  user: IUserDTO;
}

export class User extends React.Component<IProps> {
  public render() {
    return (
      <Card>
        <CardHeader title={`User: ${this.props.user.userName}`} />
        <CardContent>
          <Typography variant='h3'>Id: {this.props.user.userId}</Typography>
          <Typography variant='h3'>Image Url: {this.props.user.imageUrl}</Typography>
        </CardContent>
      </Card>
    );
  }
}
