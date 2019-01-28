expect.extend({
  toHaveAscendingValues: values => {
    let pass = true;
    for (let i = 0; i < values.length - 1; i++) {
      pass = pass && values[i] === values[i + 1] + 1;
    }

    if (pass) {
      return {
        message: () => `expected ${values} to not have ascending values`,
        pass,
      };
    } else {
      return {
        message: () => `expected ${values} to have ascending values`,
        pass,
      };
    }
  },
});
