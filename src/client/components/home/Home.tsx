import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { BlockBox } from './BlockBox';

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

interface IProps extends WithStyles<typeof styles> {}

export const Home = withStyles(styles)(({ classes }: IProps) => (
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
