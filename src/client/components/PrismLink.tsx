import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: 'white',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  to: string;
  id?: string;
  className?: string;
}

export const PrismLink = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      return (
        <Link
          className={`${this.props.classes.link} ${this.props.className ? this.props.className : ''}`}
          id={this.props.id}
          to={this.props.to}
        >
          {this.props.children}
        </Link>
      );
    }
  },
);
