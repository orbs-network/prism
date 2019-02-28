import { IOrbsAdapter } from './IOrbsAdapter';
import { MockOrbsAdapter } from './MockOrbsAdapter';
import { OrbsAdapter } from './orbsAdapter';

export function genOrbsAdapter(): IOrbsAdapter {
  // return new OrbsAdapter();
  return new MockOrbsAdapter();
}
