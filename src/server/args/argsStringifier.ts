import { IRawTx } from '../orbs-adapter/IRawData';

export function stringifyMethodCall(tx: IRawTx): string {
  const inputArgsStr = tx.inputArguments
    .map(arg => {
      switch (arg.type) {
        case 'uint64':
        case 'uint32':
          return arg.value.toString();

        case 'string':
        const value = arg.value.length < 8 ? arg.value : arg.value.substr(0, 5) + '...';
        return `'${value}'`;

        case 'bytes':
          return 'bytes';

        default:
          break;
      }
    })
    .join(', ');

  let outputArgsStr = tx.outputArguments
    .map(arg => {
      switch (arg.type) {
        case 'uint64':
        case 'uint32':
          return arg.value.toString();

        case 'string':
          const value = arg.value.length < 8 ? arg.value : arg.value.substr(0, 5) + '...';
          return `'${value}'`;

        case 'bytes':
          return 'bytes';

        default:
          break;
      }
    })
    .join(', ');

  if (outputArgsStr !== '') {
    outputArgsStr = ` => (${outputArgsStr})`;
  }
  return `${tx.methodName}(${inputArgsStr})${outputArgsStr}`;
}
