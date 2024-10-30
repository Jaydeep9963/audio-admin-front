import { SubCategory } from "./subcategory_type";

export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export interface Category {
  _id: string;
  category_name: string;
  image: { file: string; fileName: string; fileType: string, fileSize: number};
  description?: string;
  subcategories?: SubCategory[];
}
