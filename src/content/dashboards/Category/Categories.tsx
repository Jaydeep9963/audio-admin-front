import { Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CategoriesTable from './CategoriesTable';
import { CategoryResponse } from './type';
import { setCategoryResponse } from 'src/store/slices/categorySlice';
import { useEffect } from 'react';
import { RootState } from 'src/store/store';
import adminApi from 'src/store/services/adminApi';
import { getApi } from 'src/helper';
import { toast } from 'react-toast';

function Categories() {
  // const {useGetCategoriesMutation} = adminApi;
  // const [CategoriesHandler] = useGetCategoriesMutation();

  const {categories} =  useSelector((state: RootState) => state.category)
  const dispatch  = useDispatch();
  const getCategories = async()=>{
    try {
      // const response = await CategoriesHandler();
      // const{data} = response;
      const response: CategoryResponse = await getApi('/categories');
      if(response){
        dispatch(setCategoryResponse(response));
      }
    } catch (error) {
      console.log("🚀 ~ getCategories ~ error:", error)
      toast.error(
        error?.message || 'An error occurred while fetching categories'
      );
    }
      
  }

  useEffect(()=>{
    getCategories()
  },[])

  return (
    <Card>
      <CategoriesTable categoriesData={categories} />
    </Card>
  );
}

export default Categories;
