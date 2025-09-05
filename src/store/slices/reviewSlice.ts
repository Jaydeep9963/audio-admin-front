import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review } from 'src/models/review_type';

export interface ReviewState {
  reviews: Review[] | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const initialState: ReviewState = {
  reviews: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviewResponse: (state, action: PayloadAction<{
      feedback: Review[];
      totalFeedback: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    }>) => {
      state.reviews = action.payload.feedback;
      state.totalItems = action.payload.totalFeedback;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    clearReviews: (state) => {
      state.reviews = null;
      state.totalItems = 0;
      state.totalPages = 0;
      state.currentPage = 0;
    }
  }
});

export const { setReviewResponse, clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;