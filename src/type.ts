import { Category } from "src/models/category_type";
import { SubCategory } from "src/models/subcategory_type";
import { Audio } from "./models/audio_type";
import { Artist } from "./models/artist_type";
import { Review, ReviewResponse } from "./models/review_type";


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

export interface ArtistResponse {
  artists: Artist[];
  totalArtists: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TotalNumberResponse {
  totalNumOfCategory: number;
  totalNumOfSubCategory: number;
  totalNumOfAudio: number;
}

export type { Review, ReviewResponse };

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  results?: T;
  total?: number;
  error?: string;
}