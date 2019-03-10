import { IOrbsAdapter } from './IOrbsAdapter';
import { EmittingBlocksOrbsAdapter } from './EmittingBlocksOrbsAdapter';
import { OrbsAdapter } from './OrbsAdapter';

export function genOrbsAdapter(): IOrbsAdapter {
  return new OrbsAdapter();
  // return new EmittingBlocksOrbsAdapter();
}
