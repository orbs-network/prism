import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      display: 'inline',
      backgroundColor: '#b0b0b038',
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingTop: theme.spacing.unit / 2,
      paddingBottom: theme.spacing.unit / 2,
      borderRadius: 5,
      fontSize: 15,
      fontFamily: 'Inconsolata, monospace',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  id?: string;
  className?: string;
}

export const ConsoleText = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      return (
        <span
          id={this.props.id}
          className={`${this.props.classes.textField} ${this.props.className ? this.props.className : ''}`}
        >
          {this.props.children}
        </span>
      );
    }
  },
);
