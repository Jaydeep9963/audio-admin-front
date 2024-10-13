import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddCategoryBody, CategoryState } from './type';
import { Category } from 'src/models/category_type';

const initialState: CategoryState = {
    categories: null,
    totalCategories: 0,
    currentPage:1,
    pageSize:10,
    totalPages: 0
};

const categorySlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setCategoryResponse: (state, action: PayloadAction<CategoryState>) => {
      state.categories = action.payload.categories;
      state.totalCategories = action.payload.totalCategories;
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
    },
     setCategory: (state, action: PayloadAction<Category>) => {
        const newCategories = [...state.categories, action.payload];
        state.categories = [...newCategories]
     },

     deleteCategory:  (state, action: PayloadAction<string>) =>{
        const id = action.payload;
       const newCategories = state.categories.filter(
         (category) => category._id !== id
       );

       state.categories = [...newCategories];
     }
  }
});

export const { setCategoryResponse, setCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
