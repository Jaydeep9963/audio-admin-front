import { Card } from '@mui/material';
import ReviewsGrid from './ReviewsGrid';
import { useState, useEffect } from 'react';
import { toast } from 'react-toast';
import { getApi } from 'src/helper';
import { ReviewResponse, Review } from 'src/type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { setReviewResponse } from 'src/store/slices/reviewSlice';
import { useNavigate } from 'react-router';

const DEBOUNCE_DELAY = 500;

function Reviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(12);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { reviews } = useSelector((state: RootState) => state.review);
  const dispatch = useDispatch();
  
  const getReviews = async () => {
    try {
      setLoading(true);
      let Page = currentPage;

      // Reset to first page when searching
      if (debouncedSearchValue && debouncedSearchValue !== '') {
        Page = 0;
      }
      
      const response: any = await getApi(
        `/feedback?search=${debouncedSearchValue ?? ''}&page=${
          Page + 1
        }&limit=${limit}`,
        navigate
      );
      
      if (response) {
        // Handle different possible response structures
        let reviewsData: Review[] = [];
        let totalItems = 0;
        let totalPages = 0;
        let currentPage = 0;
        
        // Check for different possible response formats
        if (response.feedback) {
          reviewsData = response.feedback;
          totalItems = response.totalFeedback || response.totalItems || 0;
          totalPages = response.totalPages || 0;
          currentPage = response.currentPage || 0;
        } else if (response.data) {
          reviewsData = response.data;
          totalItems = response.totalItems || response.totalFeedback || 0;
          totalPages = response.totalPages || 0;
          currentPage = response.currentPage || 0;
        } else if (Array.isArray(response)) {
          // If response is directly an array
          reviewsData = response;
          totalItems = response.length;
          totalPages = 1;
          currentPage = 1;
        }
        
        dispatch(setReviewResponse({
          feedback: reviewsData,
          totalFeedback: totalItems,
          totalPages,
          currentPage,
          pageSize: limit
        }));
      }
    } catch (error) {
      console.log('🚀 ~ getReviews ~ error:', error);
      toast.error(
        error?.message || 'An error occurred while fetching reviews'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
      // Reset to first page when search changes
      if (searchValue !== debouncedSearchValue) {
        setCurrentPage(0);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, debouncedSearchValue]);

  useEffect(() => {
    getReviews();
  }, [currentPage, limit, debouncedSearchValue]);

  return (
    <>
      <Card>
        <ReviewsGrid
          reviewsData={reviews}
          pageChangeHandler={setCurrentPage}
          limitChangeHandler={setLimit}
          page={currentPage}
          limit={limit}
          searchQueryHandler={setSearchValue}
          searchQuery={searchValue}
          loading={loading}
        />
      </Card>
    </>
  );
}

export default Reviews;