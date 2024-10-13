import { SubCategory } from "./subcategory_type";

export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export interface Category {
  _id: string;
  category_name: string;
  image: string;
  description?: string;
  subcategories?: SubCategory[];
}
