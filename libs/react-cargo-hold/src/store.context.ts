import type { Context } from 'react';
import type { IStore } from '@brandingbrand/cargo-hold';
import type { InjectionToken } from '@brandingbrand/fslinker';

import { provideContext } from '@brandingbrand/react-linker';

// Explicity declaring the return type is necessary to avoid submodule type references
export const StoreContext: InjectionToken<Context<IStore | undefined>> = provideContext<
  IStore | undefined
>('StoreContext', undefined);
