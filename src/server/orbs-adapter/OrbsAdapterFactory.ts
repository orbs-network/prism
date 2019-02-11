import { IOrbsAdapter } from './IOrbsAdapter';
import { MockOrbsAdapter } from './MockOrbsAdapter';

export function genOrbsAdapter(): IOrbsAdapter {
    return new MockOrbsAdapter();
}