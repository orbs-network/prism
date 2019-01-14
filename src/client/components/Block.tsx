import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import * as React from 'react';

export const Block: React.FunctionComponent = () => (
  <Card>
    <CardHeader title='Block' />
    <CardContent>
      <Typography>Block data</Typography>
    </CardContent>
  </Card>
);
