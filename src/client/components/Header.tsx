import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { searchAction } from '../actions/searchActions';
import { PrismLink } from './PrismLink';

const logo: string = require('../assets/logo.png');

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
    },
    cleanLink: {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    logo: {
      height: 30,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 5,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 5,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 250,
        '&:focus': {
          width: 350,
        },
      },
    },
  });

interface IProps extends WithStyles<typeof styles> {
  search: (term: string, history: any) => void;
  history: any;
}

interface IState {
  searchTerm: string;
}

const HeaderImpl = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props) {
      super(props);
      this.state = { searchTerm: '' };
    }

    public render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <AppBar position='static'>
            <Toolbar>
              <PrismLink to={'/'} className={classes.cleanLink}>
                <img src={logo} alt='Logo' className={classes.logo} />
              </PrismLink>
              <div className={classes.title}>
                <Typography variant='h5'>ORBS Blockchain Explorer</Typography>
              </div>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <form onSubmit={e => this.onSubmitSearch(e)}>
                  <InputBase
                    placeholder='Block Height / Block Hash / Tx Id'
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    value={this.state.searchTerm}
                    onChange={e => this.setState({ searchTerm: e.currentTarget.value })}
                  />
                </form>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      );
    }

    private onSubmitSearch(e) {
      e.preventDefault();
      this.props.search(this.state.searchTerm, this.props.history);
      this.setState({ searchTerm: '' });
    }
  },
);

const mapDispatchToProps = {
  search: searchAction,
};

export const Header: any = withRouter(
  compose(
    withStyles(styles),
    connect(
      null,
      mapDispatchToProps,
    ),
  )(HeaderImpl),
);
