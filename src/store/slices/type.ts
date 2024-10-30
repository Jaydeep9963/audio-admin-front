import { Audio } from "src/models/audio_type";
import { Category } from "src/models/category_type";
import { SubCategory } from "src/models/subcategory_type";

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

export interface SubCategoryState {
  subCategories: SubCategory[] | null;
  totalSubCategories: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AudioState {
  audios: Audio[] | null;
  totalAudios: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PrivacyPolicyState {
  _id: string;
  content: string;
  lastUpdated: string;
}