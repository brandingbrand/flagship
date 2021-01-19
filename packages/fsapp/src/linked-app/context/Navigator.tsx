import type { RouterHistory } from '../History';

import React, { createContext, useContext } from 'react';

export const NavigatorContext = createContext<RouterHistory | undefined>(
  undefined
);
export const useNavigator = () => useContext(NavigatorContext);

export const NavigatorProvider: React.FC<{ value: RouterHistory }> = ({
  value,
  children
}) => {
  return (
    <NavigatorContext.Provider value={value}>
      {children}
    </NavigatorContext.Provider>
  );
};
