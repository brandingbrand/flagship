import {
  CommerceTypes,
  ProductCatalogDataSource,
  ProductRecommendationDataSource,
  ProductSearchDataSource
} from '@brandingbrand/fscommerce';
import {
  Categories,
  CategoryProduct,
  Constructor,
  ProductRefinements,
  Products,
  ProductSortingOptions
} from '../helpers';

export const ProductCatalogMixin = <T extends Constructor>(superclass: T) => {
  return class ProductCatalogMixin extends superclass implements ProductCatalogDataSource,
                                                                 ProductRecommendationDataSource,
                                                                 ProductSearchDataSource {
    public productsPerPage: number = 4;

    async fetchProduct(id: string): Promise<CommerceTypes.Product> {
      const product = Products.find(product => product.id === id);

      if (product === undefined) {
        throw new Error(`No product with ID '${id} found`);
      }

      return product;
    }

    async fetchProductIndex(
      query: CommerceTypes.ProductQuery
    ): Promise<CommerceTypes.ProductIndex> {
      let products = Products;
      const {
        categoryId,
        productIds,
        handle,
        sortBy,
        keyword,
        refinements,
        page = 0,
        limit
      } = query;

      products = this.applyCategoryIdFilter(products, categoryId);
      products = this.applyProductIdFilter(products, productIds);
      products = this.applyHandleFilter(products, handle);
      products = this.applyKeywordFilter(products, keyword);
      products = this.applyRefinementFilters(products, refinements);
      products = this.applySorting(products, sortBy);
      products = this.applyPagination(products, page, limit);

      return {
        products,
        total: products.length,
        keyword,
        sortingOptions: ProductSortingOptions,
        refinements: ProductRefinements,
        selectedSortingOption: sortBy
      };
    }

    async fetchCategory(
      id: string = 'root',
      query?: CommerceTypes.CategoryQuery
    ): Promise<CommerceTypes.Category> {
      if (id === 'root') {
        return Categories;
      }

      const category = (Categories.categories || []).find(cat => cat.id === id);
      if (category === undefined) {
        throw new Error(`Could not find category ${id}`);
      }

      return category;
    }

    async fetchProductRecommendations(id: string): Promise<CommerceTypes.Product[]> {
      const recCount = 2;
      const possibleProducts = Products.filter(product => product.id !== id);

      const randomIndex = Math.floor(Math.random() * (possibleProducts.length - recCount));
      return possibleProducts.slice(randomIndex, randomIndex + recCount);
    }

    async search(
      keyword: string,
      query?: CommerceTypes.ProductQuery
    ): Promise<CommerceTypes.ProductIndex> {
      return this.fetchProductIndex({
        ...query,
        keyword
      });
    }

    async searchSuggestion(query: string): Promise<CommerceTypes.SearchSuggestion> {
      const lowerCaseQuery = query.toLowerCase();
      const products = Products;
      const brands = [...new Set(products.map(product => product.brand))].filter(Boolean);
      const categories = Categories.categories || [];

      const suggestedBrands = brands
        .filter((brand): brand is string => typeof brand === 'string')
        .filter(brand => brand.toLowerCase().includes(lowerCaseQuery))
        .map(brand => ({ title: brand }));

      const suggestedCategories = categories
        .filter(cat => cat.title.toLowerCase().includes(lowerCaseQuery))
        .map(cat => ({
          categoryId: cat.id,
          title: cat.title
        }));

      const suggestedProducts = products
        .filter(product => product.title.toLowerCase().includes(lowerCaseQuery))
        .map(product => ({
          productId: product.id,
          title: product.title
        }));

      return {
        query,
        brandSuggestions: !suggestedBrands ? undefined : {
          brands: suggestedBrands
        },
        categorySuggestions: !suggestedCategories ? undefined : {
          categories: suggestedCategories
        },
        productSuggestions: !suggestedProducts ? undefined : {
          products: suggestedProducts
        }
      };
    }

    public applyCategoryIdFilter(
      products: CommerceTypes.Product[],
      categoryId?: string
    ): CommerceTypes.Product[] {
      if (categoryId) {
        products = products
          .filter(product => CategoryProduct[categoryId].indexOf(product.id) !== -1);
      }

      return products;
    }

    public applyProductIdFilter(
      products: CommerceTypes.Product[],
      productIds?: string[]
    ): CommerceTypes.Product[] {
      if (Array.isArray(productIds)) {
        products = products.filter(product => productIds.indexOf(product.id) !== -1);
      }

      return products;
    }

    public applyHandleFilter(
      products: CommerceTypes.Product[],
      handle?: string
    ): CommerceTypes.Product[] {
      if (handle) {
        products = products.filter(product => product.handle === handle);
      }

      return products;
    }

    public applyKeywordFilter(
      products: CommerceTypes.Product[],
      keyword?: string
    ): CommerceTypes.Product[] {
      if (keyword) {
        products = products.filter(product => product.title.includes(keyword));
      }

      return products;
    }

    public applyRefinementFilters(
      products: CommerceTypes.Product[],
      refinements?: import ('@brandingbrand/fsfoundation').Dictionary<string>
    ): CommerceTypes.Product[] {
      if (refinements) {
        products = Object.keys(refinements).reduce((filteredProducts, key) => {
          const val = refinements[key];
          return filteredProducts.filter(product => (product as any)[key] === val);
        }, products);
      }

      return products;
    }

    public applySorting(
      products: CommerceTypes.Product[],
      sortBy?: string
    ): CommerceTypes.Product[] {
      if (sortBy) {
        const [key, direction] = sortBy.split('-');

        products = products.sort((a, b) => {
          if (key === 'price' && a.price !== undefined && b.price !== undefined) {
            return a.price.value.sub(b.price.value).toNumber();
          } else if (key === 'title') {
            return a.title.localeCompare(b.title);
          }

          return 0;
        });

        if (direction === 'desc') {
          products = products.reverse();
        }
      }

      return products;
    }

    public applyPagination(
      products: CommerceTypes.Product[],
      page: number = 0,
      limit?: number
    ): CommerceTypes.Product[] {
      if (page || limit) {
        const start = page * this.productsPerPage;
        const end = limit ? start + limit : undefined;

        products = products.slice(start, end);
      }

      return products;
    }
  };
};
