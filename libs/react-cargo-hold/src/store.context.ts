import { IStore } from '@brandingbrand/cargo-hold';
import { provideContext } from '@brandingbrand/react-linker';

export const StoreContext = provideContext<IStore | undefined>('StoreContext', undefined);
