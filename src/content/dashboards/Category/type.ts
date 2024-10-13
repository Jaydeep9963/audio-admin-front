import { Category } from "src/models/category_type";


export interface CategoryResponse {
  categories: Category[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
