import { map } from 'rxjs/operators';
import { withLens } from './lens';
import type { Lens } from './lens.types';

export const mapLens = <Structure, Value>(lens: Lens<Structure, Value>) => map(withLens(lens));
