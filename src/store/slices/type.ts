import { Category } from "src/models/category_type";

interface user {
    email: string;
    id: string
}

export interface AdminState {
  user: user | null;
  token: string | null;
}

export interface CategoryState {
  categories: Category[] | null;
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AddCategoryBody {
  categoryName: string;
  image: string;
  description: string;
}
