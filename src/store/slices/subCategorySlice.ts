import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubCategoryState } from './type';
import { SubCategory } from 'src/models/subcategory_type';

const initialState: SubCategoryState = {
  subCategories: null,
  totalSubCategories: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0
};

const subCategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {
    setSubCategoryResponse: (
      state,
      action: PayloadAction<SubCategoryState>
    ) => {
      state.subCategories = action.payload.subCategories;
      state.totalSubCategories = action.payload.totalSubCategories;
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
    },
    setSubCategory: (state, action: PayloadAction<SubCategory>) => {
      const newSubCategories = [...state.subCategories, action.payload];
      state.subCategories = [...newSubCategories];
    },
    updateSubCategory: (state, action: PayloadAction<SubCategory>) => {
      const updatedCategory = action.payload;
      const findIndex = state.subCategories.findIndex(
        (category) => category._id == updatedCategory._id
      );

      state.subCategories.splice(findIndex, 1, updatedCategory);
    },
    deleteSubCategory: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const newCategories = state.subCategories.filter(
        (category) => category._id !== id
      );

      state.subCategories = [...newCategories];
    }
  }
});

export const {
  setSubCategoryResponse,
  setSubCategory,
  updateSubCategory,
  deleteSubCategory
} = subCategorySlice.actions;
export default subCategorySlice.reducer;
