import { Card } from '@mui/material';
import { categories_data, subcategories_data } from 'src/constant';
import SubCategoriesTable from './SubCategoriesTable';
import { useState, useEffect } from 'react';
import { toast } from 'react-toast';
import { getApi } from 'src/helper';
import { setCategoryResponse } from 'src/store/slices/categorySlice';
import { CategoryResponse, SubCategoryResponse } from '../../../type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { setSubCategoryResponse } from 'src/store/slices/subCategorySlice';
import { useNavigate } from 'react-router';

const DEBOUNCE_DELAY = 500;

function SubCategories() {
    const [currentPage, setCurrentPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] =
      useState(searchValue);
    const navigate = useNavigate();

    const { subCategories } = useSelector((state: RootState) => state.subcategory);
    const dispatch = useDispatch();
    const getSubCategories = async () => {
      try {
        // const response = await CategoriesHandler();
        // const{data} = response;
        let Page = currentPage;

        if (searchValue) {
          Page = 0;
        }
        const response: SubCategoryResponse = await getApi(
          `/subcategories?subcategoryName=${searchValue ?? ''}&page=${
            Page + 1
          }&limit=${limit}`,
          navigate
        );
        if (response) {
          dispatch(setSubCategoryResponse(response));
        }
      } catch (error) {
        console.log('🚀 ~ getCategories ~ error:', error);
        toast.error(
          error?.message || 'An error occurred while fetching subcategories'
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
      getSubCategories();
    }, [currentPage, limit, debouncedSearchValue]);
  return (
    <Card>
      <SubCategoriesTable
        subcategoriesData={subCategories}
        pageChangeHandler={setCurrentPage}
        limitChangeHandler={setLimit}
        page={currentPage}
        limit={limit}
        searchQueryHandler={setSearchValue}
        searchQuery={searchValue}
      />
    </Card>
  );
}

export default SubCategories;
