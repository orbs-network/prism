import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { searchAction } from '../actions/searchActions';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
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
      width: theme.spacing.unit * 9,
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
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 200,
        '&:focus': {
          width: 240,
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
        <AppBar position='static' color='default'>
          <Toolbar>
            <Typography className={classes.title} variant='h6' color='inherit' noWrap>
              <Link to='/'>OrbsHubble.com</Link>
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <form onSubmit={e => this.onSubmitSearch(e)}>
                <InputBase
                  placeholder='Block Number / Tx Hash'
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
