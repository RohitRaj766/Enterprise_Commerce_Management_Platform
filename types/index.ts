// User types
export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  zone?: string;
  area?: string;
}

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// Location types
export interface Location {
  zone: string;
  area: string;
}

export interface LocationState {
  selectedZone: string | null;
  selectedArea: string | null;
  zones: string[];
  areas: Record<string, string[]>;
}

// OTP types
export interface OTPState {
  phoneNumber: string;
  otp: string;
  isVerified: boolean;
  isResending: boolean;
}

// Product & commerce types
export enum ProductCategory {
  FRUITS_VEG = 'fruits_veg',
  DAIRY_EGGS = 'dairy_eggs',
  BEVERAGES = 'beverages',
  MEAT_FISH = 'meat_fish',
  BAKERY_SNACKS = 'bakery_snacks',
  COOKING = 'cooking',
  PULSES = 'pulses',
  RICE = 'rice',
}

export enum Brand {
  INDIVIDUAL = 'Individual Collection',
  COOLIO = 'Coolio',
  ITAD = 'Itad',
  KAZI = 'Kazi Farms',
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: ProductCategory;
  brand?: Brand;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isBestSelling?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductState {
  products: Product[];
  categories: { id: ProductCategory; name: string; icon: string }[];
  favorites: Set<string>;
  searchTerm: string;
  selectedCategories: Set<ProductCategory>;
  selectedBrands: Set<Brand>;
  setSearchTerm: (term: string) => void;
  toggleCategory: (id: ProductCategory) => void;
  toggleBrand: (brand: Brand) => void;
  toggleFavorite: (productId: string) => void;
  filteredProducts: () => Product[];
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

