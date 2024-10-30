import { Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CategoriesTable from './CategoriesTable';
import { CategoryResponse } from '../../../type';
import { setCategoryResponse } from 'src/store/slices/categorySlice';
import { useEffect, useState } from 'react';
import { RootState } from 'src/store/store';
import adminApi from 'src/store/services/adminApi';
import { getApi } from 'src/helper';
import { toast, ToastContainer } from 'react-toast';
import { useNavigate } from 'react-router';

const DEBOUNCE_DELAY = 500;

function Categories() {
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const navigate = useNavigate();

  const { categories } = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch();
  const getCategories = async () => {
    try {
      // const response = await CategoriesHandler();
      // const{data} = response;
      let Page = currentPage;

       if (searchValue) {
        Page = 0;
       }
      const response: CategoryResponse = await getApi(
        `/categories?categoryName=${searchValue ?? ''}&page=${
          Page + 1
        }&limit=${limit}`,
        navigate
      );
      if (response) {
        dispatch(setCategoryResponse(response));
      }
    } catch (error) {
      console.log('🚀 ~ getCategories ~ error:', error);
      toast.error(
        error?.message || 'An error occurred while fetching categories'
      );
    }
  };

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchValue(searchValue);
      }, DEBOUNCE_DELAY);

      return () => {
        clearTimeout(handler); // Cleanup timeout on searchValue change
      };
    }, [searchValue]);

  useEffect(() => {
    getCategories();
  }, [currentPage, limit, debouncedSearchValue]);

  return (
    <>
      <Card>
        <CategoriesTable
          categoriesData={categories}
          pageChangeHandler={setCurrentPage}
          limitChangeHandler={setLimit}
          page={currentPage}
          limit={limit}
          searchQueryHandler={setSearchValue}
          searchQuery={searchValue}
        />
      </Card>
    </>
  );
}

export default Categories;
