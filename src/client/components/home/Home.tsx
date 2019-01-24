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
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <BlockBox />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
));
