import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

export const Block: React.FunctionComponent = () => (
  <Card>
    <CardHeader title='Block' />
    <CardContent>
      <Typography>Block data</Typography>
    </CardContent>
  </Card>
);
