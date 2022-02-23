import type { IStore } from '@brandingbrand/cargo-hold';
import type { InjectionToken } from '@brandingbrand/fslinker';
import type { Context } from 'react';
import { provideContext } from '@brandingbrand/react-linker';

// Explicity declaring the return type is necessary to avoid submodule type references
export const GlobalStoreContext: InjectionToken<Context<IStore | undefined>> = provideContext<
  IStore | undefined
>('GlobalStoreContext', undefined);
