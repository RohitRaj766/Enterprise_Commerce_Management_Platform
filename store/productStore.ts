import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { categories as mockCategories, products as mockProducts } from '@/data/products';
import type { Brand, ProductState, ProductCategory } from '@/types';

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      categories: mockCategories,
      favorites: new Set<string>(),
      searchTerm: '',
      selectedCategories: new Set<ProductCategory>(),
      selectedBrands: new Set<Brand>(),

      setSearchTerm: (term: string) => set({ searchTerm: term }),

      toggleCategory: (id: ProductCategory) => {
        const current = new Set(get().selectedCategories);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        set({ selectedCategories: current });
      },

      toggleBrand: (brand: Brand) => {
        const current = new Set(get().selectedBrands);
        if (current.has(brand)) current.delete(brand);
        else current.add(brand);
        set({ selectedBrands: current });
      },

      toggleFavorite: (productId: string) => {
        const current = new Set(get().favorites);
        if (current.has(productId)) current.delete(productId);
        else current.add(productId);
        set({ favorites: current });
      },

      filteredProducts: () => {
        const { products, searchTerm, selectedCategories, selectedBrands } = get();
        const term = searchTerm.toLowerCase();
        return products.filter((product) => {
          const matchesTerm =
            !term ||
            product.name.toLowerCase().includes(term) ||
            product.unit.toLowerCase().includes(term);
          const matchesCategory =
            selectedCategories.size === 0 || selectedCategories.has(product.category);
          const matchesBrand =
            selectedBrands.size === 0 || (product.brand && selectedBrands.has(product.brand));
          return matchesTerm && matchesCategory && matchesBrand;
        });
      },
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: Array.from(state.favorites),
        selectedCategories: Array.from(state.selectedCategories),
        selectedBrands: Array.from(state.selectedBrands),
      }),
      merge: (persistedState, currentState) => {
        const typed = persistedState as Partial<ProductState> & {
          favorites?: string[];
          selectedCategories?: ProductCategory[];
          selectedBrands?: Brand[];
        };
        return {
          ...currentState,
          ...typed,
          favorites: new Set(typed.favorites ?? []),
          selectedCategories: new Set(typed.selectedCategories ?? []),
          selectedBrands: new Set(typed.selectedBrands ?? []),
        };
      },
    }
  )
);

