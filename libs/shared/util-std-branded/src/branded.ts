/**
 * A Branded type. Make sure that type `T` does not include
 * a `_tag` key as it is used as the branding tag.
 */
export type Branded<T, Brand extends string> = T & { _tag: Brand };

export type BrandingHelper<Brand extends string> = {
  brand: <T extends object>(item: T) => Branded<T, Brand>;
  isBrand: <T>(item: T) => item is Branded<T, Brand>;
};

export const makeBranding = <Brand extends string>(brand: Brand): BrandingHelper<Brand> => ({
  brand: <T extends object>(item: T): Branded<T, Brand> => ({
    ...item,
    _tag: brand,
  }),
  isBrand: <T>(item: T): item is Branded<T, Brand> => {
    try {
      return (item as Branded<T, Brand>)._tag === brand;
    } catch (e) {
      return false;
    }
  },
});
