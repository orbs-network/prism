import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 3,
      margin: 'auto',
      maxWidth: 1200,
    },
    headTableTitle: {},
  });

type Props = WithStyles<typeof styles>;

export const Home = withStyles(styles)(({ classes }: Props) => (
  <div className={classes.root}>
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          <CardContent>
            <Typography align={'center'} variant='h2'>
              Hubble - The ORBS Blockchain Explorer
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell align='right'>Difficulty</TableCell>
                  <TableCell align='right'>Block time</TableCell>
                  <TableCell align='right'>TPS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component='th' scope='row'>
                    $177
                  </TableCell>
                  <TableCell align='right'>2,602 T</TableCell>
                  <TableCell align='right'>15.4 s</TableCell>
                  <TableCell align='right'>126</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <Card>
              <CardHeader title={'Blocks'} />
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component='th' scope='row'>
                        $177
                      </TableCell>
                      <TableCell align='right'>2,602 T</TableCell>
                      <TableCell align='right'>15.4 s</TableCell>
                      <TableCell align='right'>181.8 TH/s</TableCell>
                      <TableCell align='right'>126</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title={'Transactions'} />
              <CardContent>bla</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
));
