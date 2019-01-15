import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { BlockBox } from './BlockBox';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 3,
      margin: 'auto',
      maxWidth: 1500,
    },
    headTableTitle: {
      textAlign: 'center',
      marginBottom: theme.spacing.unit * 3,
    },
  });

type Props = WithStyles<typeof styles>;

export const Home = withStyles(styles)(({ classes }: Props) => (
  <div className={classes.root}>
    <Typography className={classes.headTableTitle} variant='h3' id='pageTitle'>
      Hubble - The ORBS Blockchain Explorer
    </Typography>
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          <CardContent>
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
            <BlockBox />
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
