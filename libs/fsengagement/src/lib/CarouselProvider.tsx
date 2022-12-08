import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { CarouselContext } from './CarouselContext';

type CarouselProviderProps = PropsWithChildren<{
  currentItem?: number;
  totalItems: number;
}>;

const CarouselProvider: FC<CarouselProviderProps> = ({ children, currentItem = 1, totalItems }) => (
  <CarouselContext.Provider
    value={{
      currentItem,
      totalItems,
    }}
  >
    {children}
  </CarouselContext.Provider>
);

export default CarouselProvider;
