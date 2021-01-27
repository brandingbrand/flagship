import { createContext, useContext } from 'react';

import FSNetwork from '@brandingbrand/fsnetwork';

export const APIContext = createContext<FSNetwork | undefined>(undefined);
export const useAPI = () => useContext(APIContext);
