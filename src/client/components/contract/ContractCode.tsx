/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Card, CardContent, CardHeader, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import goLang from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import darcula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula';

SyntaxHighlighter.registerLanguage('go', goLang);

const styles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
    },
  });

interface IProps extends WithStyles<typeof styles> {
  contractName: string;
  code: string[];
}

export const ContractCode = withStyles(styles)(({ contractName, code, classes }: IProps) => {
  let codeElements = null;
  if (code && code.length > 0) {
    codeElements = code.map((c, idx) => (
      <SyntaxHighlighter key={idx} language='go' style={darcula} customStyle={{ maxHeight: 500 }}>
        {c}
      </SyntaxHighlighter>
    ));
  } else {
    codeElements = (
      <SyntaxHighlighter language='go' style={darcula} customStyle={{ maxHeight: 500 }}>
        System contract
      </SyntaxHighlighter>
    );
  }

  return (
    <Card>
      <CardHeader title={`Contract - ${contractName}`} id='contract-code' className={classes.header} />
      {codeElements}
      <CardContent />
    </Card>
  );
});
