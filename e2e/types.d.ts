declare namespace jest {
  interface Matchers<R> {
    toHaveAscendingValues(): CustomMatcherResult;
  }
}
