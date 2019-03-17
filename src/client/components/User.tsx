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
