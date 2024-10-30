import { Card } from '@mui/material';
import { audios_data } from 'src/constant';
import AudiosTable from './AudiosTable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toast';
import { getApi } from 'src/helper';
import { setSubCategoryResponse } from 'src/store/slices/subCategorySlice';
import { AudioResponse, SubCategoryResponse } from 'src/type';
import { RootState } from 'src/store/store';
import { setAudioResponse } from 'src/store/slices/audioSlice';
import { useNavigate } from 'react-router';

const DEBOUNCE_DELAY = 500;

function Audios() {
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const navigate = useNavigate();

  const { audios } = useSelector((state: RootState) => state.audio);
  const dispatch = useDispatch();

  const getAudios = async () => {
    try {
      // const response = await CategoriesHandler();
      // const{data} = response;
      let Page = currentPage;

      if (searchValue) {
        Page = 0;
      }
      const response: AudioResponse = await getApi(
        `/audios?audioName=${searchValue ?? ''}&page=${
          Page + 1
        }&limit=${limit}`,
        navigate
      );
      if (response) {
        dispatch(setAudioResponse(response));
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
    getAudios();
  }, [currentPage, limit, debouncedSearchValue]);
  return (
    <Card>
      <AudiosTable
        audiosData={audios}
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

export default Audios;
