import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

interface IProps {
  match: any;
}
export const BlockDetails: React.FunctionComponent<IProps> = ({ match }) => (
  <Card>
    <CardHeader title='Block' />
    <CardContent>
      <Typography>Block data</Typography>
      <Typography>Block hash:{match.params.hash}</Typography>
    </CardContent>
  </Card>
);
