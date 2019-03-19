import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import TimeAgo from 'react-timeago';

const styles = (theme: Theme) => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  timestamp: number;
}

export const TimeStampField = withStyles(styles)(
  class extends React.Component<IProps> {
    public render() {
      const utc = new Date(this.props.timestamp);
      return (
        <>
          <span>{utc.toISOString().replace('T', ' ')} </span>
          <span>
            (<TimeAgo date={this.props.timestamp} minPeriod={5} />)
          </span>
        </>
      );
    }
  },
);
