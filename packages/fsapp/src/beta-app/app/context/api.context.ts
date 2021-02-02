import FSNetwork from '@brandingbrand/fsnetwork';

import { createContext, useContext } from 'react';


export const APIContext = createContext<FSNetwork>(new FSNetwork());
export const useAPI = () => useContext(APIContext);
