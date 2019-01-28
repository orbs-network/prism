expect.extend({
  toEndWith: (actualString: string, expectedEnding: string) => ({
    message: `expected that ${actualString} ends with ${expectedEnding}`,
    pass: actualString.endsWith(expectedEnding),
  }),
});
