import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { BlockBox } from './BlockBox';
// import { HelixContainer } from '../helix/HelixContainer';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
  });

interface IProps extends WithStyles<typeof styles> {}

export const Home = withStyles(styles)(({ classes }: IProps) => (
  <div className={classes.root}>
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <BlockBox />
      </Grid>
    </Grid>
  </div>
));
