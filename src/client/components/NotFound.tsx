import Typography from '@material-ui/core/Typography';
import * as React from 'react';

interface IProps {
  term: string;
}

export class NotFound extends React.Component<IProps> {
  public render() {
    return <Typography variant='h4'>"{this.props.term}" Not Found</Typography>;
  }
}
