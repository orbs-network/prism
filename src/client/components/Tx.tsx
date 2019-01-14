import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import * as React from 'react';

export class Tx extends React.Component {
  public render() {
    return (
      <Card>
        <CardHeader title={`Tx blabla`} />
        <CardContent>
          <Typography variant='subheading'>
            Hash:
            0x77bb2d5055ce4e5aa2863083bb8f59ac5c8114206c1884cd4bc8dfee3a46a98c
          </Typography>
          <Typography variant='subheading'>
            Difficulty: 2,656,027,952,978,796
          </Typography>
        </CardContent>
      </Card>
    );
  }
}
