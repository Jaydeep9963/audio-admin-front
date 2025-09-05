import { Card } from '@mui/material';
import ArtistsTable from './ArtistsTable';
import { useState, useEffect } from 'react';
import { toast } from 'react-toast';
import { getApi } from 'src/helper';
import { ArtistResponse } from 'src/type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { setArtistResponse } from 'src/store/slices/artistSlice';
import { useNavigate } from 'react-router';

const DEBOUNCE_DELAY = 500;

function Artists() {
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const navigate = useNavigate();

  const { artists } = useSelector((state: RootState) => state.artist);
  const dispatch = useDispatch();
  
  const getArtists = async () => {
    try {
      let Page = currentPage;

      if (searchValue) {
        Page = 0;
      }
      const response: ArtistResponse = await getApi(
        `/artists?artistName=${searchValue ?? ''}&page=${
          Page + 1
        }&limit=${limit}`,
        navigate
      );
      if (response) {
        dispatch(setArtistResponse(response));
      }
    } catch (error) {
      console.log('🚀 ~ getArtists ~ error:', error);
      toast.error(
        error?.message || 'An error occurred while fetching artists'
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
    getArtists();
  }, [currentPage, limit, debouncedSearchValue]);

  return (
    <>
      <Card>
        <ArtistsTable
          artistsData={artists}
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

export default Artists;