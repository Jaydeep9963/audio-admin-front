import { Category } from "src/models/category_type";
import { SubCategory } from "src/models/subcategory_type";
import { Audio } from "./models/audio_type";


export interface CategoryResponse {
  categories: Category[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface SubCategoryResponse {
  subCategories: SubCategory[];
  totalSubCategories: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AudioResponse {
  audios: Audio[];
  totalAudios: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TotalNumberResponse {
  totalNumOfCategory: number;
  totalNumOfSubCategory: number;
  totalNumOfAudio: number;
}
