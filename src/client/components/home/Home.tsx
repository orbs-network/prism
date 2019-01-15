import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
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
