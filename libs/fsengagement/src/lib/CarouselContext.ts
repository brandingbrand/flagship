import { createContext, useContext } from 'react';

interface CarouselContextProps {
  currentItem: number;
  totalItems: number;
  headerColor?: string;
}

export const CarouselContext = createContext<CarouselContextProps>({
  currentItem: 1,
  totalItems: 0,
});

export const useCarouselContext = (): CarouselContextProps => useContext(CarouselContext);
