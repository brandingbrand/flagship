export interface GoToOptions {
  animated?: boolean;
}

export interface CarouselController {
  goTo(index: number, options?: GoToOptions): Promise<void>;
  goToPrev(options?: GoToOptions): Promise<void>;
  goToNext(options?: GoToOptions): Promise<void>;
  goToOrigin(options?: GoToOptions): Promise<void>;
}
